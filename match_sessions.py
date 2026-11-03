#!/usr/bin/env python3
"""
match_sessions.py
─────────────────
Matches sessions logged in the phone logger (training.simas.fit/log) to the Garmin
activity the watch recorded, then writes into that activity:

    strength  → the Sets tab (exercise, kg, reps) + name + description
    erg       → distance (SkiErg = indoor_cardio, Row = indoor_rowing) + name + description
    run       → name + description (plan, rep times, shoes, fuel)
    tennis    → name  "<opponent>🎾<score>"  + the +/- description
    hyrox     → name + description (station splits per round)
    other     → description only (name only when a title was typed)

The complete log is kept in data/sessions/<id>.json: Garmin only gets what fits.
Every description ends with "#log v1 <id>" so Claude (or anything else) can
find the full record from the Garmin activity.

Before the first write the activity's original name, description, distance and
exercise sets are saved in the session's status.before. Every later write is
built from that snapshot, so re-saving an edited session rewrites cleanly
instead of stacking, and --action undo restores the original.

    python match_sessions.py --ingest "$SESSION_JSON" --apply   # save + match one
    python match_sessions.py --pending --apply                  # retry everything waiting
    python match_sessions.py --action undo --id <id> --apply
    python match_sessions.py --action rematch --id <id> --activity-id 123 --apply

Without --apply nothing is written to Garmin (session files are still saved by
--ingest). Runs in CI (log-session.yml, update.yml): Garmin tokens live only there.
"""

from __future__ import annotations
import argparse
import copy
import hashlib
import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

SESSIONS = Path("data/sessions")
ID_RE = re.compile(r"^\d{4}-\d{2}-\d{2}-[a-z0-9-]{1,48}$")
GIVE_UP_AFTER = timedelta(days=3)       # stop looking for an activity after this
MAX_ERRORS = 3

# Which Garmin activity types a logged session may match.
KIND_TYPES = {
    "strength": ["strength_training"],
    "run": ["running", "treadmill_running", "indoor_running", "trail_running", "track_running"],
    "tennis": ["tennis_v2", "tennis"],
    "hyrox": ["hyrox", "indoor_cardio", "hiit", "strength_training", "other", "multi_sport"],
}
ERG_TYPES = {"SkiErg": ["indoor_cardio"], "Row": ["indoor_rowing"], "BikeErg": ["indoor_cycling", "indoor_cardio"]}


# ── formatting ───────────────────────────────────────────────────────────────
def clock(sec) -> str:
    if sec is None:
        return "—"
    sec = int(round(sec))
    h, r = divmod(sec, 3600)
    m, s = divmod(r, 60)
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m}:{s:02d}"


def num(x) -> str:
    if x is None:
        return ""
    return f"{x:g}" if isinstance(x, (int, float)) else str(x)


def pace500(m, sec) -> str:
    return clock(sec * 500.0 / m) if m and sec else "—"


def short(name: str) -> str:
    words = {"romanian deadlift": "RDL", "walking lunges": "Lunges", "back squat": "Squat",
             "calf raises": "Calf", "farmers carry": "Farmers", "shoulder press": "Press",
             "lat pulldown": "Pulldown", "wall balls": "Wall balls"}
    return words.get(name.lower(), name)


def strength_lines(ex: list[dict]) -> list[str]:
    out = []
    for e in ex:
        sets = [s for s in e.get("sets") or [] if s.get("n") is not None or s.get("kg") is not None]
        if not sets:
            continue
        unit = {"m": "m", "s": "s"}.get(e.get("unit"), "")
        kgs = {s.get("kg") for s in sets}
        if len(kgs) == 1:
            kg = kgs.pop()
            head = (f"{e['name']} {num(kg)}kg" if kg is not None
                    else f"{e['name']} BW" if (e.get("unit") or "reps") == "reps" else e["name"])
            body = " · ".join(f"{num(s.get('n'))}{unit}" for s in sets)
        else:
            head = e["name"]
            body = " · ".join(f"{num(s.get('kg')) if s.get('kg') is not None else 'BW'}×{num(s.get('n'))}{unit}"
                              for s in sets)
        out.append(f"{head}: {body}")
    return out


def top_kg(e: dict):
    kgs = [s.get("kg") for s in e.get("sets") or [] if s.get("kg") is not None]
    return max(kgs) if kgs else None


def default_name(s: dict) -> str | None:
    kind = s.get("kind")
    if kind == "strength":
        parts = [short(e["name"]) + (f" {num(top_kg(e))}" if top_kg(e) is not None else "")
                 for e in s.get("exercises") or []
                 if any(x.get("n") is not None or x.get("kg") is not None for x in e.get("sets") or [])]
        name = s.get("template") or "Strength"
        for p in parts:
            if len(name) + len(p) + 3 > 95:
                break
            name += (" · " if name != (s.get("template") or "Strength") else " — ") + p
        return name
    if kind == "erg":
        e = s.get("erg") or {}
        pieces = [p for p in e.get("pieces") or [] if p.get("m")]
        m = sum(p["m"] for p in pieces)
        sec = sum(p.get("sec") or 0 for p in pieces)
        mach = e.get("machine") or "Erg"
        if not pieces:
            return mach
        if len(pieces) == 1:
            return f"{mach} {num(m)}m {clock(sec)} · {pace500(m, sec)}/500m"
        if len({p['m'] for p in pieces}) == 1:
            return f"{mach} {len(pieces)}×{num(pieces[0]['m'])}m · {pace500(m, sec)}/500m"
        return f"{mach} {len(pieces)} pieces {num(m)}m · {pace500(m, sec)}/500m"
    if kind == "run":
        r = s.get("run") or {}
        return r.get("plan") or s.get("template") or None
    if kind == "tennis":
        t = s.get("tennis") or {}
        opp = (t.get("opponent") or "").strip()
        tail = (t.get("score") or "").strip() or ({"sparring": "sparring", "match": "match"}.get(t.get("mode")) or "")
        if not opp:
            return "Tennis training" if t.get("mode") == "training" else (f"Tennis🎾{tail}" if tail else None)
        return f"{opp}🎾{tail}" if tail else f"{opp}🎾"
    if kind == "hyrox":
        h = s.get("hyrox") or {}
        n = len(h.get("rounds") or [])
        total = h.get("total_sec")
        return f"{s.get('template') or 'Hyrox stations'} {n} rounds" + (f" · {clock(total)}" if total else "")
    return None


def description(s: dict) -> str:
    kind = s.get("kind")
    lines: list[str] = []
    if kind == "strength":
        lines += strength_lines(s.get("exercises") or [])
    elif kind == "erg":
        e = s.get("erg") or {}
        for i, p in enumerate(e.get("pieces") or [], 1):
            if not p.get("m") and not p.get("sec"):
                continue
            bits = [f"{num(p.get('m'))}m" if p.get("m") else "", clock(p.get("sec")) if p.get("sec") else "",
                    f"{pace500(p.get('m'), p.get('sec'))}/500m" if p.get("m") and p.get("sec") else "",
                    f"{num(p['spm'])}spm" if p.get("spm") else ""]
            lines.append(f"{i}. " + " ".join(b for b in bits if b))
        if e.get("rest_sec"):
            lines.append(f"Rest {clock(e['rest_sec'])}")
        if e.get("damper"):
            lines.append(f"Damper {num(e['damper'])}")
    elif kind == "run":
        r = s.get("run") or {}
        if r.get("plan"):
            lines.append(r["plan"])
        reps = [x for x in r.get("reps") or [] if x]
        if reps:
            lines.append("Reps: " + " ".join(clock(x) for x in reps))
        if r.get("shoes"):
            lines.append(f"Shoes: {r['shoes']}")
        if r.get("fuel"):
            lines.append(f"Fuel: {r['fuel']}")
    elif kind == "tennis":
        t = s.get("tennis") or {}
        for key, mark in (("plus", "+"), ("mixed", "+-"), ("minus", "-")):
            for ln in t.get(key) or []:
                ln = ln.strip().lstrip("+-").strip()
                if ln:
                    lines.append(f"{mark}{ln}")
    elif kind == "hyrox":
        h = s.get("hyrox") or {}
        st = h.get("stations") or []
        rounds = h.get("rounds") or []
        for j, name in enumerate(st):
            times = [r[j] if j < len(r) else None for r in rounds]
            if any(times):
                lines.append(f"{name}: " + " ".join(clock(t) for t in times))
        if h.get("total_sec"):
            lines.append(f"Total {clock(h['total_sec'])}")
    if s.get("rpe"):
        lines.append(f"RPE {num(s['rpe'])}")
    if (s.get("notes") or "").strip():
        lines.append(s["notes"].strip())
    return "\n".join(lines).strip()


def tag(s: dict) -> str:
    return f"#log v1 {s['id']}"


def strength_spec(s: dict, existing: list[dict]) -> tuple[list[dict], str]:
    """Logged sets in order → strength_sets.build() edits. The first N go onto the
    watch's first N ACTIVE sets (keeping its timing); the rest are appended."""
    flat = []
    for e in s.get("exercises") or []:
        cat, gname, unit = e.get("cat"), e.get("gname"), e.get("unit") or "reps"
        if not cat:
            continue
        for st in e.get("sets") or []:
            if st.get("n") is None and st.get("kg") is None:
                continue
            item = {"category": cat, "name": gname, "kg": st.get("kg"),
                    "reps": None if unit == "s" else st.get("n")}
            if unit == "s":
                item["sec"] = st.get("n")
            flat.append(item)
    active = [i for i, x in enumerate(existing) if x.get("setType") == "ACTIVE"]
    spec, note = [], ""
    for k, item in enumerate(flat):
        if k < len(active):
            spec.append({"at": active[k], **item})
        else:
            spec.append(item)
    if len(active) > len(flat):
        note = f"watch had {len(active) - len(flat)} more sets than logged; left them as recorded"
    return spec, note


# ── Garmin ───────────────────────────────────────────────────────────────────
class Garmin:
    def __init__(self):
        import garth
        self.g = garth
        garth.resume(str(Path.home() / ".garth"))
        try:
            garth.client.refresh_oauth2()
        except Exception as e:  # fails from Azure IPs; the Worker already refreshed
            print(f"Token refresh failed ({e}) — using the token from secrets.")

    def recent(self, limit=60):
        return self.g.connectapi("/activitylist-service/activities/search/activities",
                                 params={"start": 0, "limit": limit}) or []

    def activity(self, aid):
        return self.g.connectapi(f"/activity-service/activity/{aid}")

    def sets(self, aid):
        return (self.g.connectapi(f"/activity-service/activity/{aid}/exerciseSets") or {}).get("exerciseSets") or []

    def put_activity(self, aid, payload):
        self.g.client.put("connectapi", f"/activity-service/activity/{aid}", json=payload, api=True)

    def put_sets(self, aid, sets):
        self.g.client.put("connectapi", f"/activity-service/activity/{aid}/exerciseSets",
                          json={"activityId": int(aid), "exerciseSets": sets}, api=True)


def check_catalog(spec: list[dict]) -> tuple[list[dict], list[str]]:
    """Garmin rejects or silently blanks unknown exercise names, so check them
    against the live catalog: unknown name → category only; unknown category →
    the set is left out of Garmin (it is still in the description)."""
    try:
        from strength_sets import catalog
        cat = catalog()
    except Exception as e:
        print(f"⚠ could not load Garmin's exercise catalog ({e}); writing names unchecked")
        return spec, []
    out, bad = [], []
    for sp in spec:
        c, n = sp.get("category"), sp.get("name")
        if c not in cat:
            bad.append(f"{c}/{n}")
            continue
        if n and n not in cat[c]["exercises"]:
            bad.append(f"{c}/{n}")
            sp = {**sp, "name": None}
        out.append(sp)
    return out, sorted(set(bad))


def build_sets(existing, spec):
    from strength_sets import build   # imports garth; only reached in CI or tests with a stub
    return build(existing, spec)


# ── matching ─────────────────────────────────────────────────────────────────
def parse_ts(x: str | None) -> datetime | None:
    if not x:
        return None
    try:
        d = datetime.fromisoformat(x.replace("Z", "+00:00"))
    except ValueError:
        return None
    return d if d.tzinfo else None


def act_window(a: dict):
    st = a.get("startTimeGMT")
    if not st:
        return None, None
    start = datetime.fromisoformat(st.replace(" ", "T")).replace(tzinfo=timezone.utc)
    dur = a.get("elapsedDuration") or a.get("duration") or 0
    return start, start + timedelta(seconds=float(dur))


def allowed_types(s: dict) -> list[str]:
    if s.get("type_keys"):
        return list(s["type_keys"])
    if s.get("kind") == "erg":
        return ERG_TYPES.get((s.get("erg") or {}).get("machine"), ["indoor_cardio", "indoor_rowing"])
    return KIND_TYPES.get(s.get("kind"), [])


def match(s: dict, acts: list[dict], claimed: set[str]) -> dict | None:
    start, end = parse_ts(s.get("start")), parse_ts(s.get("end"))
    if not start:
        return None
    end = end or start + timedelta(hours=1)
    types = allowed_types(s)
    best, best_key = None, None
    for a in acts:
        tk = (a.get("activityType") or {}).get("typeKey")
        if types and tk not in types:
            continue
        if str(a.get("activityId")) in claimed:
            continue
        a0, a1 = act_window(a)
        if not a0:
            continue
        overlap = (min(end, a1) - max(start, a0)).total_seconds()
        gap = abs((a0 - start).total_seconds())
        if overlap <= 0 and gap > 4 * 3600:
            continue
        key = (max(overlap, 0), -gap)
        if best_key is None or key > best_key:
            best, best_key = a, key
    return best


def content_hash(s: dict) -> str:
    body = {k: v for k, v in s.items() if k != "status"}
    return hashlib.sha1(json.dumps(body, sort_keys=True, ensure_ascii=False).encode()).hexdigest()[:12]


# ── apply / undo ─────────────────────────────────────────────────────────────
def snapshot(gc: Garmin, aid: str, kind: str) -> dict:
    act = gc.activity(aid)
    snap = {"name": act.get("activityName") or "", "description": act.get("description") or "",
            "distance": (act.get("summaryDTO") or {}).get("distance")}
    if kind == "strength":
        snap["sets"] = gc.sets(aid)
    return snap


def write(gc: Garmin, s: dict, aid: str, before: dict, apply: bool) -> tuple[bool, str]:
    kind = s.get("kind")
    notes = []
    if kind == "strength":
        spec, note = strength_spec(s, before.get("sets") or [])
        if note:
            notes.append(note)
        spec, bad = check_catalog(spec)
        if bad:
            notes.append("not in Garmin's catalog, logged category-only: " + ", ".join(bad))
        if spec:
            new_sets = build_sets(copy.deepcopy(before.get("sets") or []), spec)
            print(f"  sets: {sum(1 for x in new_sets if x['setType'] == 'ACTIVE')} active")
            if apply:
                gc.put_sets(aid, new_sets)
                after = gc.sets(aid)
                want = [(x["exercises"][0]["category"], x.get("repetitionCount")) for x in new_sets if x["setType"] == "ACTIVE"]
                got = [((x.get("exercises") or [{}])[0].get("category"), x.get("repetitionCount"))
                       for x in after if x.get("setType") == "ACTIVE"]
                if got != want:
                    return False, f"sets read-back differs: want {want} got {got}"

    name = (s.get("title") or "").strip() or default_name(s)
    desc = description(s)
    old = (before.get("description") or "").strip()
    if old and "#log v1" not in old:      # keep what was typed in Garmin before
        desc = f"{desc}\n\n{old}"
    desc = f"{desc}\n\n{tag(s)}".strip()
    payload = {"activityId": int(aid), "description": desc}
    if name:
        payload["activityName"] = name[:100]
    if kind == "erg":
        m = sum(p.get("m") or 0 for p in (s.get("erg") or {}).get("pieces") or [])
        if m:
            payload["summaryDTO"] = {"distance": float(m)}
    print(f"  name: {payload.get('activityName', '(unchanged)')!r}")
    print("  description:\n    | " + desc.replace("\n", "\n    | "))
    if "summaryDTO" in payload:
        print(f"  distance: {payload['summaryDTO']['distance']:g} m")
    if not apply:
        return True, "dry run"
    gc.put_activity(aid, payload)
    after = gc.activity(aid)
    if "activityName" in payload and (after.get("activityName") or "").strip() != payload["activityName"].strip():
        return False, f"name did not stick (Garmin has {after.get('activityName')!r})"
    if (after.get("description") or "").strip() != desc.strip():
        return False, "description did not stick"
    if "summaryDTO" in payload:
        got = (after.get("summaryDTO") or {}).get("distance")
        if got is None or abs(got - payload["summaryDTO"]["distance"]) > 1:
            notes.append(f"distance did not stick (Garmin has {got})")
    return True, "; ".join(notes) or "ok"


def restore(gc: Garmin, aid: str, before: dict, apply: bool) -> tuple[bool, str]:
    print(f"  restore name {before.get('name')!r}, {len(before.get('description') or '')} char description")
    if not apply:
        return True, "dry run"
    if "sets" in before:
        gc.put_sets(aid, before["sets"])
    payload = {"activityId": int(aid), "activityName": before.get("name") or "",
               "description": before.get("description") or ""}
    if before.get("distance") is not None:
        payload["summaryDTO"] = {"distance": before["distance"]}
    gc.put_activity(aid, payload)
    after = gc.activity(aid)
    ok = (after.get("activityName") or "") == (before.get("name") or "")
    return ok, "restored" if ok else "restore did not stick"


# ── session files ────────────────────────────────────────────────────────────
def load_all() -> dict[str, dict]:
    out = {}
    for f in sorted(SESSIONS.glob("*.json")):
        try:
            out[f.stem] = json.loads(f.read_text())
        except Exception as e:
            print(f"⚠ unreadable {f}: {e}")
    return out


def save(s: dict) -> None:
    SESSIONS.mkdir(parents=True, exist_ok=True)
    (SESSIONS / f"{s['id']}.json").write_text(json.dumps(s, indent=2, ensure_ascii=False) + "\n")


def ingest(raw: str) -> dict:
    s = json.loads(raw)
    if not isinstance(s, dict) or s.get("v") != 1 or not ID_RE.match(str(s.get("id", ""))):
        raise SystemExit("✗ not a v1 session with a valid id")
    if s.get("kind") not in ("strength", "erg", "run", "tennis", "hyrox", "other"):
        raise SystemExit(f"✗ unknown kind {s.get('kind')!r}")
    if not parse_ts(s.get("start")):
        raise SystemExit("✗ start must be ISO 8601 with a UTC offset")
    prev = load_all().get(s["id"])
    status = dict((prev or {}).get("status") or {})
    status.update({"state": "pending", "errors": 0})
    s["status"] = status
    s["received"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    save(s)
    print(f"✓ saved data/sessions/{s['id']}.json")
    return s


def process(gc_factory, s: dict, all_s: dict, apply: bool, forced_aid: str | None = None) -> None:
    st = s.setdefault("status", {})
    claimed = {str(x["status"]["garmin_id"]) for k, x in all_s.items()
               if k != s["id"] and (x.get("status") or {}).get("garmin_id") and x["status"].get("state") == "applied"}
    gc = gc_factory()
    aid = forced_aid or (str(st["garmin_id"]) if st.get("garmin_id") else None)
    if not aid:
        a = match(s, gc.recent(), claimed)
        if not a:
            end = parse_ts(s.get("end")) or parse_ts(s.get("start"))
            if end and datetime.now(timezone.utc) - end > GIVE_UP_AFTER:
                st.update(state="no_match", message="no Garmin activity found within 3 days")
            else:
                st.update(state="pending", message="waiting for the Garmin activity")
            print(f"  {s['id']}: {st['message']}")
            return
        aid = str(a["activityId"])
        print(f"  {s['id']}: matched {aid} {a.get('startTimeLocal')} '{a.get('activityName')}'")
    if not st.get("before") or str(st.get("garmin_id")) != aid:
        st["before"] = snapshot(gc, aid, s.get("kind"))
    try:
        ok, msg = write(gc, s, aid, st["before"], apply)
    except Exception as e:
        ok, msg = False, f"{type(e).__name__}: {e}"
    if not apply:
        print(f"  DRY RUN — {msg}")
        return
    if ok:
        st.update(state="applied", garmin_id=aid, message=msg, hash=content_hash(s),
                  applied_at=datetime.now(timezone.utc).isoformat(timespec="seconds"), errors=0)
        print(f"  ✓ {s['id']} → {aid}: {msg}")
    else:
        st["errors"] = int(st.get("errors") or 0) + 1
        st.update(state="error" if st["errors"] >= MAX_ERRORS else "pending", garmin_id=aid, message=msg)
        print(f"  ✗ {s['id']} → {aid}: {msg}")


def needs_work(s: dict) -> bool:
    st = s.get("status") or {}
    if st.get("state") == "pending":
        return True
    return st.get("state") == "applied" and st.get("hash") != content_hash(s)


def main(argv=None, gc_factory=Garmin) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--ingest", default="", help="session JSON to save and match")
    ap.add_argument("--pending", action="store_true", help="process every session waiting for Garmin")
    ap.add_argument("--action", choices=["save", "undo", "rematch"], default="save")
    ap.add_argument("--id", default="")
    ap.add_argument("--activity-id", default="")
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args(argv)

    if a.activity_id and not a.activity_id.isdigit():
        raise SystemExit("✗ activity id must be numeric")
    todo: list[str] = []
    if a.ingest:
        todo.append(ingest(a.ingest)["id"])
    all_s = load_all()
    if a.action in ("undo", "rematch"):
        if a.id not in all_s:
            raise SystemExit(f"✗ no session {a.id!r}")
        s = all_s[a.id]
        st = s.setdefault("status", {})
        if st.get("garmin_id") and st.get("before") and st.get("state") == "applied":
            ok, msg = restore(gc_factory(), str(st["garmin_id"]), st["before"], a.apply)
            print(f"  {'✓' if ok else '✗'} undo {a.id}: {msg}")
            if a.apply and ok:
                st.update(state="undone", message="restored the original Garmin name/description/sets")
                st.pop("before", None)
                st.pop("garmin_id", None)
        if a.action == "rematch":
            st.update(state="pending", errors=0)
            process(gc_factory, s, all_s, a.apply, a.activity_id or None)
        if a.apply:
            save(s)
        return 0

    if a.pending:
        todo += [k for k, s in all_s.items() if needs_work(s) and k not in todo]
    if not todo:
        print("no logged sessions waiting for Garmin")
        return 0
    lazy = {}
    def factory():
        if "gc" not in lazy:
            lazy["gc"] = gc_factory()
        return lazy["gc"]
    for k in todo:
        s = all_s[k]
        process(factory, s, all_s, a.apply)
        if a.apply:
            save(s)
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
strength_sets.py
────────────────
Reads (and optionally rewrites) the exercise sets of a Garmin strength
activity — the "Sets" tab in Garmin Connect, which the watch fills with
guessed exercises and the user corrects by hand.

READ-ONLY by default: finds the strength activity on --date (or --activity-id),
prints its sets, and checks any --sets spec against Garmin's exercise catalog.
With --sets and --apply it PUTs the full set list and reads it back.

--sets is a JSON list of sets in order, each:
    {"category": "PULL_UP", "name": "PULL_UP", "reps": 11, "kg": null, "sec": 60}
`keep: N` as an entry keeps the next N existing ACTIVE sets unchanged.

Runs in CI (strength-sets.yml) because Garmin tokens live only in Actions.
"""

from __future__ import annotations
import argparse
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

import garth
import requests

CATALOG_URL = "https://connect.garmin.com/web-data/exercises/Exercises.json"


def find_activity(date: str) -> dict | None:
    acts = garth.connectapi("/activitylist-service/activities/search/activities",
                            params={"start": 0, "limit": 40}) or []
    hits = [a for a in acts
            if (a.get("startTimeLocal") or "").startswith(date)
            and (a.get("activityType") or {}).get("typeKey") == "strength_training"]
    for a in hits:
        print(f"  candidate {a['activityId']}  {a.get('startTimeLocal')}  '{a.get('activityName')}'")
    if len(hits) != 1:
        print(f"✗ {len(hits)} strength activities on {date} — pass --activity-id")
        return None
    return hits[0]


def get_sets(aid) -> dict:
    return garth.connectapi(f"/activity-service/activity/{aid}/exerciseSets")


def show(sets: list[dict]) -> None:
    for i, s in enumerate(sets):
        ex = (s.get("exercises") or [{}])
        top = max(ex, key=lambda e: e.get("probability") or 0) if ex else {}
        print(f"  {i:>2} {s.get('setType','?'):<6} {str(s.get('startTime'))[11:19]:<8} "
              f"{(s.get('duration') or 0):>6.0f}s  "
              f"{(top.get('category') or '-'):<16} {(top.get('name') or '-'):<28} "
              f"p={top.get('probability')}  reps={s.get('repetitionCount')}  weight={s.get('weight')}"
              + (f"  (+{len(ex)-1} alt)" if len(ex) > 1 else ""))


def build(existing: list[dict], spec: list[dict], start: datetime) -> list[dict]:
    """Keep the requested existing ACTIVE sets (and the RESTs between them),
    then append the spec sets after them, each followed by a rest."""
    out, it = [], iter(existing)
    pending = list(spec)
    while pending and "keep" in pending[0]:
        n = pending.pop(0)["keep"]
        while n:
            s = next(it)
            out.append(s)
            if s.get("setType") == "ACTIVE":
                n -= 1
        # include a trailing rest if there is one
    t = start
    if out:
        last = out[-1]
        t = datetime.fromisoformat(last["startTime"].replace("Z", "")[:19]) + timedelta(seconds=last.get("duration") or 0)
    for sp in pending:
        dur = float(sp.get("sec") or 45)
        out.append({
            "exercises": [{"category": sp["category"], "name": sp.get("name"), "probability": 100.0}],
            "duration": dur,
            "repetitionCount": sp.get("reps"),
            "weight": None if sp.get("kg") is None else float(sp["kg"]) * 1000.0,   # grams
            "setType": "ACTIVE",
            "startTime": t.strftime("%Y-%m-%dT%H:%M:%S.0"),
            "wktStepIndex": None,
            "messageIndex": None,
        })
        t += timedelta(seconds=dur)
        rest = float(sp.get("rest", 90))
        out.append({"exercises": [], "duration": rest, "repetitionCount": None, "weight": None,
                    "setType": "REST", "startTime": t.strftime("%Y-%m-%dT%H:%M:%S.0"),
                    "wktStepIndex": None, "messageIndex": None})
        t += timedelta(seconds=rest)
    for i, s in enumerate(out):
        s["messageIndex"] = i
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", default=datetime.now(ZoneInfo("Europe/Vilnius")).strftime("%Y-%m-%d"))
    ap.add_argument("--activity-id", default="")
    ap.add_argument("--sets", default="", help="JSON spec (see module docstring)")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    garth.resume(str(Path.home() / ".garth"))
    try:
        garth.client.refresh_oauth2()
    except Exception as e:
        print(f"Token refresh failed ({e}) — using the token from secrets.")

    if args.activity_id:
        aid = args.activity_id
        act = garth.connectapi(f"/activity-service/activity/{aid}")
        print(f"  activity {aid} '{act.get('activityName')}' {(act.get('summaryDTO') or {}).get('startTimeLocal')}")
        start_gmt = (act.get("summaryDTO") or {}).get("startTimeGMT")
    else:
        act = find_activity(args.date)
        if not act:
            return 1
        aid = act["activityId"]
        start_gmt = act.get("startTimeGMT")

    data = get_sets(aid)
    sets = data.get("exerciseSets") or []
    print(f"\nexisting sets ({len(sets)}):")
    show(sets)
    print("\nraw first set:", json.dumps(sets[0] if sets else None))

    if not args.sets:
        return 0

    spec = json.loads(args.sets)
    try:
        cat = requests.get(CATALOG_URL, timeout=20).json()["categories"]
        bad = [s for s in spec if "category" in s and (s["category"] not in cat or
               (s.get("name") and s["name"] not in cat[s["category"]]["exercises"]))]
        for s in bad:
            c = s["category"]
            print(f"✗ not in catalog: {c}/{s.get('name')}  options: "
                  f"{sorted(cat[c]['exercises']) if c in cat else sorted(cat)}")
        if bad:
            return 1
        print("✓ all exercise names are in Garmin's catalog")
    except Exception as e:
        print(f"⚠ could not check catalog: {e}")
        if args.apply:
            return 1

    start = datetime.fromisoformat(str(start_gmt).replace(" ", "T")[:19])
    new = build(sets, spec, start)
    print(f"\nplanned sets ({len(new)}):")
    show(new)

    if not args.apply:
        print("\nDRY RUN — nothing changed. Re-run with --apply.")
        return 0

    body = {"activityId": int(aid), "exerciseSets": new}
    garth.client.put("connectapi", f"/activity-service/activity/{aid}/exerciseSets", json=body, api=True)

    after = get_sets(aid).get("exerciseSets") or []
    print(f"\nafter write ({len(after)}):")
    show(after)
    want = [(s["exercises"][0]["category"], s.get("repetitionCount")) for s in new if s["setType"] == "ACTIVE"]
    got = [((s.get("exercises") or [{}])[0].get("category"), s.get("repetitionCount"))
           for s in after if s.get("setType") == "ACTIVE"]
    if got[-len(want):] == want[-len(want):] and len(got) == len(want):
        print("✓ sets written and read back")
        return 0
    print(f"✗ read-back differs\n  want {want}\n  got  {got}")
    return 1


if __name__ == "__main__":
    sys.exit(main())

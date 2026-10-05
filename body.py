#!/usr/bin/env python3
"""Body composition (Renpho scale) → Garmin Connect → HEALTH_DATA.body.

Renpho has no Garmin integration, so readings take this path:

    Renpho app → Apple Health → iOS Shortcut → POST auth.simas.fit/body
      → Worker dispatches body.yml with the readings as JSON
      → this script, --upload: writes them into Garmin as a FIT weight file,
        re-reads Garmin to prove they landed, then patches App.jsx

Garmin stays the single source of truth. The hourly full sync runs
`body.py --days N`, which reads body composition back out of Garmin and
upserts it, so a reading that reached Garmin by any route (or a backfill)
ends up on the dashboard even if the upload run's commit was dropped.

    python3 body.py --upload '[{"ts":"2026-10-02T07:12:31+03:00","kg":76.4,"fat":14.2,"bmi":23.1}]'
    python3 body.py --upload '...' --dry-run   # build + check, write nothing
    python3 body.py --days 30                  # Garmin → App.jsx only

Sync mode never fails the job (an outage must not cost the Garmin sync its
commit). Upload mode DOES fail when the write did not land: that run exists
only to make the write, and a green tick on a silent no-op is how earlier
Garmin writes went wrong (see rename_activity.py).
"""
from __future__ import annotations

import argparse
import datetime
import json
import re
import sys
import time
from pathlib import Path

DASHBOARD = Path("src/App.jsx")

# Sanity bounds. A reading outside these is a mis-step on the scale (a child,
# a bag, a foot on the edge), not a body. Rejected before anything is written.
KG_RANGE = (50.0, 110.0)
FAT_RANGE = (3.0, 40.0)

# Garmin's dateWeightList fields → dashboard row fields. Masses come in grams.
FIELDS = ("kg", "fat", "bmi", "water", "muscle", "bone")


# ── input ────────────────────────────────────────────────────────────────────

def _pct(v):
    """Apple Health percentages arrive as 0.142 from some Shortcut actions and
    14.2 from others. Anything at or below 1 is a fraction."""
    if v is None or v == "":
        return None
    v = float(v)
    return round(v * 100, 1) if v <= 1 else round(v, 1)


def parse_readings(raw: str) -> list[dict]:
    data = json.loads(raw)
    if isinstance(data, dict):
        data = data.get("readings", [data])
    out = []
    for r in data:
        ts = datetime.datetime.fromisoformat(str(r["ts"]).replace("Z", "+00:00"))
        if ts.tzinfo is None:
            raise ValueError(f"timestamp without UTC offset: {r['ts']} — refusing to guess")
        kg = round(float(r["kg"]), 2)
        if not KG_RANGE[0] <= kg <= KG_RANGE[1]:
            raise ValueError(f"{kg} kg is outside {KG_RANGE} — not a real weigh-in")
        fat = _pct(r.get("fat"))
        if fat is not None and not FAT_RANGE[0] <= fat <= FAT_RANGE[1]:
            print(f"::warning::body fat {fat}% outside {FAT_RANGE} — uploading weight without it")
            fat = None
        bmi = round(float(r["bmi"]), 1) if r.get("bmi") not in (None, "") else None
        out.append({"ts": ts, "kg": kg, "fat": fat, "bmi": bmi})
    return out


# ── Garmin ───────────────────────────────────────────────────────────────────

def garmin_entries(client, start: str, end: str) -> list[dict]:
    res = client.get_body_composition(start, end) or {}
    return res.get("dateWeightList") or []


def _matches(entry: dict, r: dict) -> bool:
    """Same weigh-in: within a minute and 50 g. Garmin stores whole seconds and
    grams, so a reading it accepted comes back within those."""
    gmt = entry.get("timestampGMT") or entry.get("date")
    w = entry.get("weight")
    if not gmt or not w:
        return False
    same_time = abs(gmt / 1000 - r["ts"].timestamp()) <= 60
    same_kg = abs(w / 1000 - r["kg"]) < 0.05
    has_fat = r["fat"] is None or entry.get("bodyFat") is not None
    return same_time and same_kg and has_fat


def build_fit(readings: list[dict]) -> bytes:
    from fit_weight import FitEncoderWeight
    enc = FitEncoderWeight()
    first = readings[0]["ts"].timestamp()
    enc.write_file_info(time_created=first)
    enc.write_file_creator()
    enc.write_device_info(first)
    for r in readings:
        # Pass epoch seconds, not the datetime: fit_weight converts a datetime
        # through time.mktime(), which reads it as runner-local and drops the
        # offset — every weigh-in would land three hours off.
        enc.write_weight_scale(r["ts"].timestamp(), weight=r["kg"],
                               percent_fat=r["fat"], bmi=r["bmi"])
    enc.finish()
    return enc.getvalue()


def upload(client, readings: list[dict], dry_run: bool) -> list[dict]:
    """Write readings Garmin doesn't already have, then prove they landed.
    Returns the readings now confirmed in Garmin."""
    # Garmin files a weigh-in under the athlete's calendar day; pad a day each
    # side so a reading near midnight is found whichever way it was bucketed.
    one = datetime.timedelta(days=1)
    days = [(min(r["ts"].date() for r in readings) - one).isoformat(),
            (max(r["ts"].date() for r in readings) + one).isoformat()]
    existing = garmin_entries(client, days[0], days[-1])

    todo = [r for r in readings if not any(_matches(e, r) for e in existing)]
    for r in readings:
        if r not in todo:
            print(f"  = {r['ts'].isoformat()} {r['kg']} kg already in Garmin — skipping")
    if not todo:
        return readings

    fit = build_fit(todo)
    for r in todo:
        print(f"  → {r['ts'].isoformat()}  {r['kg']} kg  fat {r['fat']}%  bmi {r['bmi']}")
    if dry_run:
        print(f"dry run: built a {len(fit)}-byte FIT file, not uploading")
        return []

    import garth
    resp = garth.client.post("connectapi", "/upload-service/upload", api=True,
                             files={"file": ("body_composition.fit", fit)})
    print(f"  upload → HTTP {resp.status_code}")

    # Garmin imports uploads asynchronously and answers 2xx either way, so the
    # status code proves nothing. Poll until every reading reads back.
    for attempt in range(8):
        time.sleep(5 if attempt == 0 else 10)
        got = garmin_entries(client, days[0], days[-1])
        missing = [r for r in todo if not any(_matches(e, r) for e in got)]
        if not missing:
            print(f"  ✓ all {len(todo)} reading(s) confirmed in Garmin")
            return readings
        print(f"  … {len(missing)} not visible yet (attempt {attempt + 1})")
    raise RuntimeError(f"{len(missing)} reading(s) never appeared in Garmin after upload: "
                       + ", ".join(f"{r['ts'].isoformat()} {r['kg']}kg" for r in missing))


def fetch_rows(client, days: int) -> dict[str, dict]:
    """Garmin → {date: row}, the LAST reading of each calendar day. Days with
    a weight but no body fat (a manual entry, say) are skipped: the weight
    array already carries those, and a fat-less row would plot as a gap."""
    end = datetime.date.today()
    start = end - datetime.timedelta(days=days)
    rows, when = {}, {}
    for e in garmin_entries(client, start.isoformat(), end.isoformat()):
        d = e.get("calendarDate")
        if not d or e.get("bodyFat") is None or not e.get("weight"):
            continue
        t = e.get("timestampGMT") or 0
        if d in when and when[d] > t:
            continue
        g = lambda k, s=1000: round(e[k] / s, 1) if e.get(k) is not None else None
        rows[d] = {"kg": g("weight"), "fat": round(e["bodyFat"], 1), "bmi": g("bmi", 1),
                   "water": g("bodyWater", 1), "muscle": g("muscleMass"), "bone": g("boneMass")}
        when[d] = t
    return rows


# ── patch ────────────────────────────────────────────────────────────────────
# Same discipline as mfp.py's nutrition patch: upsert inside the array's own
# span, keyed by date (the lesson of the weight/vo2max bug), one row per line,
# 4-space indent. Anchored on the newline + 2-space indent because "body:"
# also appears as a fetch() option further down App.jsx.

ARRAY = re.compile(r'(\n  body:\s*\[)(.*?)(\n  \],)', re.DOTALL)
ROW = re.compile(r'\{date:"([\d-]+)"[^}]*\},')


def _row(d, r):
    vals = ",".join(f"{k}:{'null' if r.get(k) is None else r[k]}" for k in FIELDS)
    return f'    {{date:"{d}",{vals}}},'


# Where the array is created the first time: right after HEALTH_DATA.nutrition.
# Done here at runtime rather than in a hand commit because the lines around
# it are rewritten by the bot every hour, so a hand-made patch there goes
# stale within the hour and stops applying.
NUTRITION = re.compile(r'\n  nutrition:\s*\[.*?\n  \],', re.DOTALL)
NEW_ARRAY = """
  // Body composition from Garmin, written by body.py: the last reading of each
  // day that carries body fat. kg, fat %, BMI, water %, muscle and bone in kg;
  // fields the scale did not send are null. Readings reach Garmin from the
  // Renpho scale via Apple Health -> Shortcut -> auth.simas.fit/body. One row
  // per line, 4-space indent, machine-written: do not reformat.
  body: [
  ],"""


def ensure_array(code: str) -> str:
    if ARRAY.search(code):
        return code
    n = NUTRITION.search(code)
    if not n:
        raise RuntimeError("neither body nor nutrition array found in App.jsx — was HEALTH_DATA reshaped?")
    print("  + creating HEALTH_DATA.body")
    return code[:n.end()] + NEW_ARRAY + code[n.end():]


def patch(rows: dict[str, dict], code: str) -> str:
    code = ensure_array(code)
    m = ARRAY.search(code)
    if not m:
        raise RuntimeError("body array not found in App.jsx — was HEALTH_DATA reshaped?")
    by_date = {e.group(1): "    " + e.group(0) for e in ROW.finditer(m.group(2))}
    for d, r in rows.items():
        by_date[d] = _row(d, r)
    body = "".join("\n" + by_date[d] for d in sorted(by_date))
    return code[:m.start(2)] + body + code[m.end(2):]


# ── main ─────────────────────────────────────────────────────────────────────

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--upload", help="JSON readings from the Worker")
    p.add_argument("--days", type=int, default=30)
    p.add_argument("--dry-run", action="store_true")
    a = p.parse_args()

    from update import get_client
    client = get_client()

    if a.upload:
        readings = parse_readings(a.upload)        # raises → job fails, correctly
        confirmed = upload(client, readings, a.dry_run)
        if a.dry_run or not confirmed:
            return 0
        # Weight array too, so the Weight card moves without waiting for the
        # next full sync. update.patch with only a weight is what poll mode does.
        import update
        latest = max(confirmed, key=lambda r: r["ts"])
        local_day = latest["ts"].date().isoformat()   # the offset the phone sent
        update.patch(local_day, {"weight": (local_day, round(latest["kg"], 1))}, [],
                     advance_today=False)
        span = max(2, (datetime.date.today() - min(r["ts"].date() for r in confirmed)).days + 1)
        rows = fetch_rows(client, span)
    else:
        try:
            rows = fetch_rows(client, a.days)
        except Exception as e:
            print(f"::warning::body composition fetch failed: {type(e).__name__}: {e}")
            return 0

    print(f"Body: {len(rows)} day(s) with body fat in Garmin")
    for d, r in sorted(rows.items())[-5:]:
        print(f"  {d}: {r['kg']} kg · {r['fat']}% fat")
    if a.dry_run:
        return 0
    code = DASHBOARD.read_text(encoding="utf-8")
    try:
        new = patch(rows, code)
    except RuntimeError as e:
        print(f"::warning::{e}")
        return 0 if not a.upload else 1
    if new != code:
        DASHBOARD.write_text(new, encoding="utf-8")
        print(f"✓ Patched {DASHBOARD}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

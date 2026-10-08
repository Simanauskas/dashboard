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

--sets is a JSON list of set edits, each one of:
    {"category": "PULL_UP", "name": "PULL_UP", "reps": 11, "kg": null}
        → appended after the existing sets (untimed, followed by a REST),
          the way Garmin Connect's own "add set" editor writes them
    {"at": 4, "category": ..., "name": ..., "reps": ..., "kg": ...}
        → relabels existing set #4 (index as printed), keeping its timing
    {"at": 6, "delete": true}
        → removes existing set #6
Existing sets not named by an "at" are kept untouched. Weight goes to Garmin
in grams; kg null = bodyweight. Carries log metres as reps.

--find TEXT searches Garmin's exercise catalog (e.g. --find "row; wall ball").

Runs in CI (strength-sets.yml) because Garmin tokens live only in Actions.
"""

from __future__ import annotations
import argparse
import json
import sys
from datetime import datetime
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


def exercise(sp: dict) -> list[dict]:
    return [{"category": sp["category"], "name": sp.get("name"), "probability": 100.0}]


def build(existing: list[dict], spec: list[dict]) -> list[dict]:
    out = [dict(s) for s in existing]
    drop = set()
    for sp in spec:
        if "at" not in sp:
            continue
        i = sp["at"]
        if not 0 <= i < len(out):
            raise SystemExit(f"✗ set #{i} does not exist ({len(out)} sets)")
        if sp.get("delete"):
            drop.add(i)
            continue
        out[i].update({"exercises": exercise(sp), "setType": "ACTIVE",
                       "repetitionCount": sp.get("reps"),
                       "weight": None if sp.get("kg") is None else float(sp["kg"]) * 1000.0})
    out = [s for i, s in enumerate(out) if i not in drop]
    for sp in spec:
        if "at" in sp:
            continue
        out.append({
            "exercises": exercise(sp),
            "duration": float(sp.get("sec") or 0),
            "repetitionCount": sp.get("reps"),
            "weight": None if sp.get("kg") is None else float(sp["kg"]) * 1000.0,   # grams
            "setType": "ACTIVE",
            "startTime": None,
            "wktStepIndex": None,
        })
        out.append({"exercises": [], "duration": 0.0, "repetitionCount": None, "weight": None,
                    "setType": "REST", "startTime": None, "wktStepIndex": None})
    for i, s in enumerate(out):
        s["messageIndex"] = i
    return out


def catalog() -> dict:
    return requests.get(CATALOG_URL, timeout=20).json()["categories"]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", default=datetime.now(ZoneInfo("Europe/Vilnius")).strftime("%Y-%m-%d"))
    ap.add_argument("--activity-id", default="")
    ap.add_argument("--sets", default="", help="JSON spec (see module docstring)")
    ap.add_argument("--find", default="", help="search the exercise catalog and exit")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    if args.find:
        cat = catalog()
        for q in args.find.split(";"):      # several searches: "row; lunge"
            terms = q.upper().replace("-", " ").split()
            print(f"\n[{q.strip()}]")
            for c, v in sorted(cat.items()):
                for n in sorted(v["exercises"]):
                    if all(t in f"{c} {n}".replace("_", " ") for t in terms):
                        print(f"  {c:<20} {n}")
        return 0

    garth.resume(str(Path.home() / ".garth"))
    try:
        garth.client.refresh_oauth2()
    except Exception as e:
        print(f"Token refresh failed ({e}) — using the token from secrets.")

    if args.activity_id:
        aid = args.activity_id
        act = garth.connectapi(f"/activity-service/activity/{aid}")
        print(f"  activity {aid} '{act.get('activityName')}' {(act.get('summaryDTO') or {}).get('startTimeLocal')}")
    else:
        act = find_activity(args.date)
        if not act:
            return 1
        aid = act["activityId"]

    data = get_sets(aid)
    sets = data.get("exerciseSets") or []
    print(f"\nexisting sets ({len(sets)}):")
    show(sets)
    print("\nraw first set:", json.dumps(sets[0] if sets else None))

    if not args.sets:
        return 0

    spec = json.loads(args.sets)
    try:
        cat = catalog()
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

    new = build(sets, spec)
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
    if got == want:
        print("✓ sets written and read back")
        return 0
    print(f"✗ read-back differs\n  want {want}\n  got  {got}")
    return 1


if __name__ == "__main__":
    sys.exit(main())

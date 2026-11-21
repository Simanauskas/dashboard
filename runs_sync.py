#!/usr/bin/env python3
"""
runs_sync.py
────────────
Adds new running activities to data/runs/ (see run_analysis.py). Skips any
activity that is already there, so an hourly call costs one activity-list
request when nothing is new. READ-ONLY against Garmin. Never raises: a
failure here must not stop the dashboard sync.

  python runs_sync.py                 # runs of the last 3 days
  python runs_sync.py --days 60       # backfill
  python runs_sync.py 25148432922     # specific ids (re-analyses, even if present)
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import garth

import fit_export as fx
import run_analysis as ra


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--days", type=int, default=3)
    args = ap.parse_args()

    garth.resume(str(Path.home() / ".garth"))
    try:
        if args.ids:
            acts = []
            for i in args.ids:
                a = garth.connectapi(f"/activity-service/activity/{i}")
                acts.append({"activityId": a["activityId"], "activityName": a.get("activityName"),
                             "startTimeLocal": (a.get("summaryDTO") or {}).get("startTimeLocal", ""),
                             "activityType": a.get("activityTypeDTO") or {}})
        else:
            acts = fx.running_ids(args.days)
    except Exception as e:
        print(f"runs_sync: activity list failed ({e}) — skipping")
        return 0

    new = [a for a in acts if args.ids or not (ra.RUNS_DIR / f"{a['activityId']}.json").exists()]
    print(f"runs_sync: {len(acts)} runs in range, {len(new)} to analyse")
    for a in new:
        aid = a["activityId"]
        try:
            rec, laps = fx.flatten(fx.download_fit(aid))
            if len(rec) < 60:
                print(f"- {aid}: only {len(rec)} records, skipped")
                continue
            res = ra.analyse(rec, laps, {
                "id": aid, "date": (a.get("startTimeLocal") or "")[:10] or "unknown",
                "start_local": a.get("startTimeLocal"), "name": a.get("activityName"),
                "type": (a.get("activityType") or {}).get("typeKey")})
            ra.write(res)
            print(f"✓ {aid} {res['class']} {a.get('activityName')!r}")
        except Exception as e:
            print(f"✗ {aid}: {e}", file=sys.stderr)
    if new:
        ra.write_index()
    return 0


if __name__ == "__main__":
    sys.exit(main())

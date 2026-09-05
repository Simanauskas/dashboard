#!/usr/bin/env python3
"""
rename_activity.py
──────────────────
Renames a single Garmin Connect activity by id, and optionally sets its
description. Useful when a race is logged under a placeholder title — the
dashboard takes `name` straight from Garmin on every sync, so the fix belongs
upstream in Garmin rather than in App.jsx (update.py would overwrite it).

DRY RUN by default. Pass --apply to write.

Locally:
    python rename_activity.py 24244349642 "Hyrox race Athens 1:09:23" --apply

In CI: the rename-activity workflow restores ~/.garth from GitHub Secrets and
runs this, because Garmin tokens are not readable outside Actions/the Worker.
"""

from __future__ import annotations
import argparse
import sys
from pathlib import Path

import garth


def get_activity(aid: str) -> dict:
    return garth.connectapi(f"/activity-service/activity/{aid}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("activity_id", help="Garmin activity id")
    ap.add_argument("name", help="New activity name")
    ap.add_argument("--description", default=None, help="Optional activity description")
    ap.add_argument("--apply", action="store_true", help="Actually write the change")
    args = ap.parse_args()

    garth.resume(str(Path.home() / ".garth"))
    try:
        garth.client.refresh_oauth2()
        print("Token refreshed OK")
    except Exception as e:
        # Same story as update.py: the refresh fails from Azure IPs, and the
        # Worker has already minted a fresh token by the time we run. Say so
        # rather than swallowing it.
        print(f"Token refresh failed ({e}) — using the token from secrets.")

    aid = args.activity_id
    try:
        act = get_activity(aid)
    except Exception as e:
        print(f"✗ could not read activity {aid}: {e}")
        return 1

    summary = act.get("summaryDTO") or {}
    old_name = (act.get("activityName") or "?").strip()
    started = (summary.get("startTimeLocal") or "")[:16]
    dur = summary.get("duration")
    print(f"  activity {aid}")
    print(f"    started : {started}")
    print(f"    duration: {dur if dur is None else f'{int(dur)//60}:{int(dur)%60:02d}'}")
    print(f"    name    : '{old_name}'")
    print(f"    new name: '{args.name}'")

    if old_name == args.name and args.description is None:
        print("\n✓ already named that — nothing to do.")
        return 0

    if not args.apply:
        print("\nDRY RUN — nothing changed. Re-run with --apply.")
        return 0

    payload = {"activityId": int(aid), "activityName": args.name}
    if args.description is not None:
        payload["description"] = args.description
    try:
        garth.client.put("connectapi", f"/activity-service/activity/{aid}", json=payload, api=True)
    except Exception as e:
        print(f"\n✗ rename FAILED: {e}")
        return 1

    # Read it back: a 200 from this endpoint does not by itself prove the field
    # took, and a rename that silently no-ops is exactly the kind of thing that
    # looks fine in CI and is wrong on the watch.
    try:
        after = (get_activity(aid).get("activityName") or "").strip()
    except Exception as e:
        print(f"\n⚠ renamed, but could not read it back to confirm: {e}")
        return 0
    if after == args.name:
        print(f"\n✓ renamed to '{after}'")
        return 0
    print(f"\n✗ rename did not stick — Garmin still reports '{after}'")
    return 1


if __name__ == "__main__":
    sys.exit(main())

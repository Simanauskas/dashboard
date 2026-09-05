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
    old_desc = act.get("description") or ""
    started = (summary.get("startTimeLocal") or "")[:16]
    def clock(d):
        if d is None: return "?"
        d = int(d); return f"{d//3600}:{d//60%60:02d}:{d%60:02d}" if d >= 3600 else f"{d//60}:{d%60:02d}"
    print(f"  activity {aid}")
    print(f"    started  : {started}")
    # Garmin reports several durations; print each, because they disagree when
    # an activity has been edited and only one of them is the one you mean.
    for k in ("duration", "elapsedDuration", "movingDuration"):
        if summary.get(k) is not None:
            print(f"    {k:<9}: {clock(summary[k])}  ({int(summary[k])}s)")
    print(f"    name     : '{old_name}'")
    print(f"    new name : '{args.name}'")
    print(f"    description: {len(old_desc)} chars"
          + (f" — starts '{old_desc[:60].replace(chr(10), ' ')}…'" if old_desc else " (empty)"))
    if args.description is not None:
        print(f"    new description: {len(args.description)} chars")

    if old_name == args.name and (args.description is None or old_desc.strip() == args.description.strip()):
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
        after = get_activity(aid)
    except Exception as e:
        print(f"\n⚠ renamed, but could not read it back to confirm: {e}")
        return 0
    ok = True
    if after.get("activityName", "").strip() == args.name:
        print(f"\n✓ name is '{args.name}'")
    else:
        print(f"\n✗ name did not stick — Garmin reports '{after.get('activityName')}'")
        ok = False
    if args.description is not None:
        got = after.get("description") or ""
        if got.strip() == args.description.strip():
            print(f"✓ description written ({len(got)} chars)")
        else:
            print(f"✗ description did not stick — Garmin has {len(got)} chars, sent {len(args.description)}")
            ok = False
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())

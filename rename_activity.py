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

Lookup helpers (read-only):
    python rename_activity.py --list 15 --type tennis_v2
        → recent activities of that type with id, start, name and FULL description
          (how the garmin-tennis-log skill learns his naming/description style)
    python rename_activity.py --date 2026-10-31 --type tennis_v2 "<name>" ...
        → resolves the activity id from the one activity of that type on the date

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


def recent(limit: int, type_key: str | None) -> list[dict]:
    acts = garth.connectapi("/activitylist-service/activities/search/activities",
                            params={"start": 0, "limit": max(limit * 4, 40)}) or []
    if type_key:
        acts = [a for a in acts if (a.get("activityType") or {}).get("typeKey") == type_key]
    return acts[:limit] if limit else acts


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("activity_id", nargs="?", default=None,
                    help="Garmin activity id (or omit and pass --date/--type)")
    ap.add_argument("name", nargs="?", default=None, help="New activity name")
    ap.add_argument("--list", type=int, default=0, metavar="N",
                    help="Print the N most recent activities (with --type: of that type) and exit")
    ap.add_argument("--type", default=None, help="Activity typeKey filter, e.g. tennis_v2")
    ap.add_argument("--date", default=None, help="Resolve the activity id from this date (YYYY-MM-DD)")
    ap.add_argument("--description", default=None, help="Optional activity description")
    ap.add_argument("--distance", type=float, default=None,
                    help="Optional distance in metres (e.g. 1000 for an indoor row)")
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

    if args.list:
        for a in recent(args.list, args.type):
            full = get_activity(a["activityId"])
            desc = (full.get("description") or "").strip()
            print(f"── {a['activityId']}  {(a.get('startTimeLocal') or '')[:16]}  "
                  f"{(a.get('activityType') or {}).get('typeKey')}  '{a.get('activityName')}'")
            print("   " + (desc.replace(chr(10), chr(10) + "   ") if desc else "(no description)"))
        return 0

    aid = args.activity_id
    if args.date and args.activity_id and not args.activity_id.isdigit():
        # Called as: --date D --type T "<name>" — the positional is the name.
        args.name, aid = args.activity_id, None
    if not aid:
        if not args.date:
            print("✗ need an activity id, or --date (with --type)")
            return 1
        hits = [a for a in recent(0, args.type)
                if (a.get("startTimeLocal") or "").startswith(args.date)]
        for a in hits:
            print(f"  candidate {a['activityId']}  {a.get('startTimeLocal')}  '{a.get('activityName')}'")
        if len(hits) != 1:
            print(f"✗ {len(hits)} {args.type or ''} activities on {args.date} — pass the activity id")
            return 1
        aid = str(hits[0]["activityId"])
    if not args.name:
        print("✗ need a new name")
        return 1
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
    print(f"    description: {len(old_desc)} chars" + ("" if old_desc else " (empty)"))
    if old_desc:
        print("      | " + old_desc.replace(chr(10), chr(10) + "      | "))
    if args.description is not None:
        print(f"    new description: {len(args.description)} chars")
        print("      | " + args.description.replace(chr(10), chr(10) + "      | "))
    old_dist = summary.get("distance")
    print(f"    distance : {old_dist if old_dist is not None else '—'} m")
    if args.distance is not None:
        print(f"    new distance: {args.distance:g} m")
    dist_same = args.distance is None or (old_dist is not None and abs(old_dist - args.distance) < 1)

    if old_name == args.name and dist_same and (args.description is None or old_desc.strip() == args.description.strip()):
        print("\n✓ already named that — nothing to do.")
        return 0

    if not args.apply:
        print("\nDRY RUN — nothing changed. Re-run with --apply.")
        return 0

    payload = {"activityId": int(aid), "activityName": args.name}
    if args.description is not None:
        payload["description"] = args.description
    if args.distance is not None:
        # Same shape Garmin Connect's own "edit activity" form sends.
        payload["summaryDTO"] = {"distance": args.distance}
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
    if args.distance is not None:
        got = (after.get("summaryDTO") or {}).get("distance")
        if got is not None and abs(got - args.distance) < 1:
            print(f"✓ distance is {got:g} m")
        else:
            print(f"✗ distance did not stick — Garmin reports {got} m, sent {args.distance:g}")
            ok = False
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
rename_commutes.py
──────────────────
One-off maintenance script. Runs inside GitHub Actions (same token setup
as update.py — garth tokens pre-written to ~/.garth/ by the workflow).

Finds all cycling activities since CUTOFF whose start/end points match
home <-> work (either direction) and renames them to "Commute to work",
setting the activity type to Garmin's commute type (if available,
otherwise leaves type as-is and tells you).

DRY RUN by default — prints what it WOULD change. Pass --apply to write.
"""

from __future__ import annotations
import argparse
import math
import sys
from pathlib import Path

import garth

# ── Config ────────────────────────────────────────────────────────────────────

CUTOFF = "2025-11-01"                       # moved in Nov 1 2025
HOME = (54.674856, 25.234178)               # Eigulių g. 5, Vilnius
WORK = (54.674395, 25.272151)               # Algirdo g. 34, Vilnius
RADIUS_M = 350                              # match tolerance (GPS acquisition slack)
NEW_NAME = "Commute to work"

# Outdoor cycling type keys we consider candidates (indoor/virtual excluded)
CYCLING_KEYS = {
    "cycling", "road_biking", "mountain_biking", "gravel_cycling",
    "cyclocross", "downhill_biking", "track_cycling", "recumbent_cycling",
    "bmx", "e_bike_fitness", "e_bike_mountain", "commuting", "bike_commute",
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def haversine_m(lat1, lon1, lat2, lon2):
    R = 6371000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def near(lat, lon, point):
    if lat is None or lon is None:
        return False
    return haversine_m(lat, lon, point[0], point[1]) <= RADIUS_M


def is_outdoor_cycling(act):
    t = (act.get("activityType") or {})
    key = t.get("typeKey", "")
    if key in CYCLING_KEYS:
        return True
    # parentTypeId 2 == cycling family in Garmin's taxonomy
    return t.get("parentTypeId") == 2 and "indoor" not in key and "virtual" not in key


def fetch_all_activities():
    """Paginate the activity search endpoint from CUTOFF to today."""
    acts, start, page = [], 0, 50
    while True:
        batch = garth.connectapi(
            "/activitylist-service/activities/search/activities",
            params={"start": start, "limit": page, "startDate": CUTOFF},
        )
        if not batch:
            break
        acts.extend(batch)
        if len(batch) < page:
            break
        start += page
    return acts


def find_commute_type():
    """Look up Garmin's commute activity type, if one exists."""
    try:
        types = garth.connectapi("/activity-service/activity/activityTypes")
    except Exception as e:
        print(f"  ⚠ Could not fetch activity types: {e}")
        return None
    candidates = [t for t in types if "commut" in t.get("typeKey", "").lower()]
    # Prefer a bike-flavoured commute key if more than one exists
    candidates.sort(key=lambda t: ("bike" not in t["typeKey"], t["typeKey"]))
    return candidates[0] if candidates else None


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="actually rename (default: dry run)")
    args = ap.parse_args()

    garth.resume(str(Path.home() / ".garth"))
    try:
        garth.client.refresh_oauth2()
        print("Token refreshed OK")
    except Exception:
        pass  # use whatever is loaded; 401 below will make the failure obvious

    commute_type = find_commute_type()
    if commute_type:
        print(f"Commute activity type found: typeKey={commute_type['typeKey']} typeId={commute_type['typeId']}")
    else:
        print("⚠ No commute type in Garmin's type list — names will be updated, type left unchanged.")

    print(f"Fetching activities since {CUTOFF} …")
    acts = fetch_all_activities()
    print(f"  {len(acts)} total activities, filtering …\n")

    matches, skipped_no_gps = [], 0
    for a in acts:
        if not is_outdoor_cycling(a):
            continue
        s_lat, s_lon = a.get("startLatitude"), a.get("startLongitude")
        e_lat, e_lon = a.get("endLatitude"), a.get("endLongitude")
        if s_lat is None or e_lat is None:
            skipped_no_gps += 1
            continue
        h2w = near(s_lat, s_lon, HOME) and near(e_lat, e_lon, WORK)
        w2h = near(s_lat, s_lon, WORK) and near(e_lat, e_lon, HOME)
        if h2w or w2h:
            matches.append((a, "home→work" if h2w else "work→home"))

    if skipped_no_gps:
        print(f"  (skipped {skipped_no_gps} cycling activities with no GPS coords)")
    print(f"  {len(matches)} commute matches:\n")

    changed = 0
    for a, direction in matches:
        aid = a["activityId"]
        old_name = a.get("activityName", "?")
        old_type = (a.get("activityType") or {}).get("typeKey", "?")
        date = (a.get("startTimeLocal") or "")[:16]
        already = old_name == NEW_NAME and (
            not commute_type or old_type == commute_type["typeKey"]
        )
        flag = "✓ already done" if already else ("APPLY" if args.apply else "would rename")
        print(f"  {date}  [{direction}]  id={aid}  '{old_name}' ({old_type})  → {flag}")

        if already or not args.apply:
            continue

        payload = {"activityId": aid, "activityName": NEW_NAME}
        if commute_type:
            payload["activityTypeDTO"] = {
                "typeId": commute_type["typeId"],
                "typeKey": commute_type["typeKey"],
            }
        try:
            garth.client.put(
                "connectapi",
                f"/activity-service/activity/{aid}",
                json=payload,
                api=True,
            )
            changed += 1
        except Exception as e:
            print(f"    ✗ FAILED: {e}")

    mode = "APPLIED" if args.apply else "DRY RUN — nothing changed. Re-run with --apply."
    print(f"\nDone. {changed} renamed. ({mode})")
    if matches and not args.apply:
        sys.exit(0)


if __name__ == "__main__":
    main()

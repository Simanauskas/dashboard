#!/usr/bin/env python3
"""
rename_commutes.py
──────────────────
Finds all cycling activities since CUTOFF where the GPS track passes
within WORK_RADIUS_M of the office at any point, and the ride is at
least MIN_DISTANCE_M long.

Renames matches to NEW_NAME with event type Transportation.
DRY RUN by default. Pass --apply to write.
"""

from __future__ import annotations
import argparse
import math
import sys
from pathlib import Path

import garth

# ── Config ────────────────────────────────────────────────────────────────────

CUTOFF = "2025-11-01"
WORK = (54.674395, 25.272151)           # Algirdo g. 34, Vilnius
WORK_RADIUS_M = 300
MIN_DISTANCE_M = 2000                  # at least 2 km — filters trivial rides
NEW_NAME = "Commute to work"

CYCLING_KEYS = {
    "cycling", "road_biking", "mountain_biking", "gravel_cycling",
    "cyclocross", "recumbent_cycling", "e_bike_fitness", "e_bike_mountain",
    "commuting", "bike_commute",
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def haversine_m(lat1, lon1, lat2, lon2):
    R = 6371000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def is_cycling(act):
    t = act.get("activityType") or {}
    key = t.get("typeKey", "")
    if key in CYCLING_KEYS:
        return True
    return t.get("parentTypeId") == 2 and "indoor" not in key and "virtual" not in key


def fetch_all_activities():
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


def track_passes_work(aid):
    """Return True if any GPS point in the activity is within WORK_RADIUS_M of office."""
    try:
        details = garth.connectapi(f"/activity-service/activity/{aid}/details")
        polyline = (details.get("geoPolylineDTO") or {}).get("polyline", [])
        for pt in polyline:
            lat, lon = pt.get("lat"), pt.get("lon")
            if lat and lon and haversine_m(lat, lon, WORK[0], WORK[1]) <= WORK_RADIUS_M:
                return True
    except Exception as e:
        print(f"    ⚠ track fetch failed for {aid}: {e}")
    return False


def find_transport_event_type():
    try:
        types = garth.connectapi("/activity-service/activity/eventTypes")
    except Exception as e:
        print(f"  ⚠ Could not fetch event types: {e}")
        return {"typeId": 5, "typeKey": "transportation"}
    candidates = [t for t in types if "transport" in t.get("typeKey", "").lower()]
    return candidates[0] if candidates else {"typeId": 5, "typeKey": "transportation"}


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    garth.resume(str(Path.home() / ".garth"))
    try:
        garth.client.refresh_oauth2()
        print("Token refreshed OK")
    except Exception:
        pass

    transport_type = find_transport_event_type()
    print(f"Transport event type: typeKey={transport_type['typeKey']} typeId={transport_type['typeId']}")

    print(f"Fetching activities since {CUTOFF} …")
    acts = fetch_all_activities()
    print(f"  {len(acts)} total activities\n")

    # Pre-filter: cycling type + minimum distance (avoids GPS track fetches for non-candidates)
    candidates = [
        a for a in acts
        if is_cycling(a) and (a.get("distance") or 0) >= MIN_DISTANCE_M
    ]
    print(f"  {len(candidates)} cycling activities ≥ {MIN_DISTANCE_M/1000:.0f}km — checking GPS tracks …\n")

    matches = []
    for a in candidates:
        aid = a["activityId"]
        date = (a.get("startTimeLocal") or "")[:16]
        dist_km = (a.get("distance") or 0) / 1000
        mins = int((a.get("duration") or 0) // 60)
        print(f"  checking {date}  {mins}min  {dist_km:.1f}km  id={aid} …", end=" ", flush=True)
        if track_passes_work(aid):
            print("✓ passes office")
            matches.append(a)
        else:
            print("skip")

    print(f"\n  {len(matches)} commute matches:\n")

    changed = 0
    for a in matches:
        aid = a["activityId"]
        old_name = a.get("activityName", "?")
        old_type = (a.get("activityType") or {}).get("typeKey", "?")
        date = (a.get("startTimeLocal") or "")[:16]
        mins = int((a.get("duration") or 0) // 60)
        dist_km = (a.get("distance") or 0) / 1000
        already = old_name == NEW_NAME and (
            (a.get("eventType") or {}).get("typeKey") == transport_type["typeKey"]
        )
        flag = "✓ already done" if already else ("APPLY" if args.apply else "would rename")
        print(f"  {date}  {mins}min  {dist_km:.1f}km  id={aid}  '{old_name}' ({old_type})  → {flag}")

        if already or not args.apply:
            continue

        payload = {"activityId": aid, "activityName": NEW_NAME, "eventTypeDTO": {
            "typeId": transport_type["typeId"],
            "typeKey": transport_type["typeKey"],
        }}
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

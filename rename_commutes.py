#!/usr/bin/env python3
"""
rename_commutes.py
──────────────────
Finds all activities since CUTOFF where:
  - start or end point is within WORK_RADIUS_M of the office, AND
  - duration is at most MAX_DURATION_S
and renames them to NEW_NAME with event type Transportation.

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
WORK_RADIUS_M = 500
MAX_DURATION_S = 45 * 60               # 45 minutes
NEW_NAME = "Commute to work"

EXCLUDE_KEYS = {"indoor_cycling", "virtual_ride", "treadmill_running", "indoor_running"}

# ── Helpers ───────────────────────────────────────────────────────────────────

def haversine_m(lat1, lon1, lat2, lon2):
    R = 6371000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def near_work(lat, lon):
    if lat is None or lon is None:
        return False
    return haversine_m(lat, lon, WORK[0], WORK[1]) <= WORK_RADIUS_M


def is_candidate(act):
    key = (act.get("activityType") or {}).get("typeKey", "")
    if key in EXCLUDE_KEYS:
        return False
    return "indoor" not in key and "virtual" not in key


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

    matches, skipped_no_gps, skipped_too_long = [], 0, 0
    nearby_debug = []  # (dist_m, activity) for candidates with GPS
    for a in acts:
        if not is_candidate(a):
            continue
        s_lat, s_lon = a.get("startLatitude"), a.get("startLongitude")
        e_lat, e_lon = a.get("endLatitude"), a.get("endLongitude")
        if s_lat is None and e_lat is None:
            skipped_no_gps += 1
            continue
        dists = []
        if s_lat is not None: dists.append(haversine_m(s_lat, s_lon, WORK[0], WORK[1]))
        if e_lat is not None: dists.append(haversine_m(e_lat, e_lon, WORK[0], WORK[1]))
        min_dist = min(dists) if dists else None
        if min_dist is not None:
            nearby_debug.append((min_dist, a))
        if not (near_work(s_lat, s_lon) or near_work(e_lat, e_lon)):
            continue
        duration = a.get("duration", 0) or 0
        if duration > MAX_DURATION_S:
            skipped_too_long += 1
            continue
        matches.append(a)

    print(f"  (skipped {skipped_no_gps} with no GPS, {skipped_too_long} near-office but >45 min)")
    nearby_debug.sort(key=lambda x: x[0])
    print(f"\n  20 closest GPS activities to office ({WORK_RADIUS_M}m threshold):")
    for dist, a in nearby_debug[:20]:
        t = (a.get("activityType") or {}).get("typeKey", "?")
        date = (a.get("startTimeLocal") or "")[:16]
        mins = int((a.get("duration") or 0) // 60)
        print(f"    {date}  {mins}min  {int(dist)}m  {t}  '{a.get('activityName','?')}'")
    print()
    print(f"  {len(matches)} commute matches:\n")

    changed = 0
    for a in matches:
        aid = a["activityId"]
        old_name = a.get("activityName", "?")
        old_type = (a.get("activityType") or {}).get("typeKey", "?")
        date = (a.get("startTimeLocal") or "")[:16]
        mins = int((a.get("duration") or 0) // 60)
        already = old_name == NEW_NAME and (
            (a.get("eventType") or {}).get("typeKey") == transport_type["typeKey"]
        )
        flag = "✓ already done" if already else ("APPLY" if args.apply else "would rename")
        print(f"  {date}  {mins}min  id={aid}  '{old_name}' ({old_type})  → {flag}")

        if already or not args.apply:
            continue

        payload = {"activityId": aid, "activityName": NEW_NAME, "eventType": {
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

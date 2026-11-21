#!/usr/bin/env python3
"""
fit_export.py
─────────────
Downloads the original FIT file of Garmin running activities and flattens it
into second-by-second CSVs: HR, pace, cadence, stride length, vertical
oscillation, vertical ratio, ground contact time + balance, power, altitude.

READ-ONLY against Garmin. Writes to ./fit_export/:
  <date>_<id>.fit           original file
  <date>_<id>_records.csv   one row per record (≈1 s)
  <date>_<id>_laps.csv      one row per lap
  index.csv                 one row per activity

GPS is left out of the CSVs on purpose (runs start and end at home); it is
still inside the .fit if ever needed.

Usage:
  python fit_export.py --days 1              # runs of the last day
  python fit_export.py --days 90             # last 90 days
  python fit_export.py 25148432922 25031234567   # specific ids (any type)

In CI: fit-export.yml restores ~/.garth from GitHub Secrets, runs this and
uploads ./fit_export as a short-lived workflow artifact. Nothing is committed:
the repo is public and this is per-second physiology.
"""
from __future__ import annotations

import argparse
import csv
import io
import sys
import zipfile
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import garth
from fitparse import FitFile

OUT = Path("fit_export")

RECORD_COLS = [
    "timestamp", "elapsed_s", "distance_m", "speed_mps", "pace_min_km",
    "heart_rate", "cadence_spm", "stride_length_m", "vertical_oscillation_mm",
    "vertical_ratio_pct", "ground_contact_ms", "gct_balance_left_pct",
    "power_w", "altitude_m", "temperature_c",
]
LAP_COLS = [
    "lap", "start", "elapsed_s", "timer_s", "distance_m", "avg_speed_mps",
    "pace_min_km", "avg_hr", "max_hr", "avg_cadence_spm",
    "avg_stride_length_m", "avg_vertical_oscillation_mm",
    "avg_vertical_ratio_pct", "avg_ground_contact_ms",
    "avg_gct_balance_left_pct", "avg_power_w", "total_ascent_m", "intensity",
]


def first(v: dict, *keys):
    for k in keys:
        x = v.get(k)
        if x is not None:
            return x
    return None


def pace(mps):
    if not mps or mps < 0.3:
        return None
    return round(1000 / mps / 60, 3)


def cadence_spm(v: dict):
    # Running cadence in FIT is strides/min (one foot); ×2 for steps/min.
    c = v.get("cadence")
    if c is None:
        return None
    return round((c + (v.get("fractional_cadence") or 0)) * 2, 1)


def mm_to_m(x):
    return round(x / 1000, 3) if x is not None else None


def r(x, n=2):
    return round(x, n) if isinstance(x, (int, float)) else x


def running_ids(days: int) -> list[dict]:
    since = date.today() - timedelta(days=days)
    out, start = [], 0
    while True:
        page = garth.connectapi(
            "/activitylist-service/activities/search/activities",
            params={"start": start, "limit": 100, "startDate": since.isoformat()}) or []
        if not page:
            break
        out += [a for a in page
                if "running" in ((a.get("activityType") or {}).get("typeKey") or "")]
        if len(page) < 100:
            break
        start += 100
    return out


def download_fit(aid) -> bytes:
    blob = garth.download(f"/download-service/files/activity/{aid}")
    if blob[:2] == b"PK":
        with zipfile.ZipFile(io.BytesIO(blob)) as z:
            name = next(n for n in z.namelist() if n.lower().endswith(".fit"))
            return z.read(name)
    return blob


def flatten(fit_bytes: bytes):
    ff = FitFile(io.BytesIO(fit_bytes))
    records, laps, t0 = [], [], None
    for m in ff.get_messages("record"):
        v = m.get_values()
        ts = v.get("timestamp")
        if ts is None:
            continue
        t0 = t0 or ts
        spd = first(v, "enhanced_speed", "speed")
        records.append({
            "timestamp": ts.replace(tzinfo=timezone.utc).isoformat(),
            "elapsed_s": int((ts - t0).total_seconds()),
            "distance_m": r(v.get("distance"), 1),
            "speed_mps": r(spd, 3),
            "pace_min_km": pace(spd),
            "heart_rate": v.get("heart_rate"),
            "cadence_spm": cadence_spm(v),
            "stride_length_m": mm_to_m(v.get("step_length")),
            "vertical_oscillation_mm": r(v.get("vertical_oscillation"), 1),
            "vertical_ratio_pct": r(v.get("vertical_ratio"), 2),
            "ground_contact_ms": r(v.get("stance_time"), 1),
            "gct_balance_left_pct": r(v.get("stance_time_balance"), 2),
            "power_w": v.get("power"),
            "altitude_m": r(first(v, "enhanced_altitude", "altitude"), 1),
            "temperature_c": v.get("temperature"),
        })
    for i, m in enumerate(ff.get_messages("lap"), 1):
        v = m.get_values()
        spd = first(v, "enhanced_avg_speed", "avg_speed")
        c = v.get("avg_running_cadence") or v.get("avg_cadence")
        if c is not None:
            c = round((c + (v.get("avg_fractional_cadence") or 0)) * 2, 1)
        st = v.get("start_time")
        laps.append({
            "lap": i,
            "start": st.replace(tzinfo=timezone.utc).isoformat() if st else None,
            "elapsed_s": r(v.get("total_elapsed_time"), 1),
            "timer_s": r(v.get("total_timer_time"), 1),
            "distance_m": r(v.get("total_distance"), 1),
            "avg_speed_mps": r(spd, 3),
            "pace_min_km": pace(spd),
            "avg_hr": v.get("avg_heart_rate"),
            "max_hr": v.get("max_heart_rate"),
            "avg_cadence_spm": c,
            "avg_stride_length_m": mm_to_m(v.get("avg_step_length")),
            "avg_vertical_oscillation_mm": r(v.get("avg_vertical_oscillation"), 1),
            "avg_vertical_ratio_pct": r(v.get("avg_vertical_ratio"), 2),
            "avg_ground_contact_ms": r(v.get("avg_stance_time"), 1),
            "avg_gct_balance_left_pct": r(v.get("avg_stance_time_balance"), 2),
            "avg_power_w": v.get("avg_power"),
            "total_ascent_m": v.get("total_ascent"),
            "intensity": v.get("intensity"),
        })
    return records, laps


def write_csv(path: Path, cols, rows):
    with path.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*", help="Garmin activity ids (overrides --days)")
    ap.add_argument("--days", type=int, default=1,
                    help="Running activities of the last N days")
    args = ap.parse_args()

    garth.resume(str(Path.home() / ".garth"))
    try:
        garth.client.refresh_oauth2()
    except Exception as e:
        print(f"Token refresh failed ({e}) — using the token from secrets.")

    if args.ids:
        acts = [garth.connectapi(f"/activity-service/activity/{i}") for i in args.ids]
        acts = [{"activityId": a["activityId"], "activityName": a.get("activityName"),
                 "startTimeLocal": (a.get("summaryDTO") or {}).get("startTimeLocal", ""),
                 "activityType": a.get("activityTypeDTO") or {}} for a in acts]
    else:
        acts = running_ids(args.days)
    if not acts:
        print("No matching activities.")
        return 0

    OUT.mkdir(exist_ok=True)
    index, failed = [], 0
    for a in acts:
        aid = a["activityId"]
        day = (a.get("startTimeLocal") or "")[:10] or "unknown"
        stem = f"{day}_{aid}"
        try:
            fit = download_fit(aid)
            (OUT / f"{stem}.fit").write_bytes(fit)
            rec, laps = flatten(fit)
            write_csv(OUT / f"{stem}_records.csv", RECORD_COLS, rec)
            write_csv(OUT / f"{stem}_laps.csv", LAP_COLS, laps)
            index.append({"activity_id": aid, "date": day,
                          "start_local": a.get("startTimeLocal"),
                          "type": (a.get("activityType") or {}).get("typeKey"),
                          "name": a.get("activityName"),
                          "records": len(rec), "laps": len(laps)})
            print(f"✓ {stem}  {a.get('activityName')!r}  {len(rec)} records, {len(laps)} laps")
        except Exception as e:
            failed += 1
            print(f"✗ {stem}: {e}", file=sys.stderr)
    write_csv(OUT / "index.csv",
              ["activity_id", "date", "start_local", "type", "name", "records", "laps"], index)
    print(f"{len(index)} exported, {failed} failed")
    return 1 if failed and not index else 0


if __name__ == "__main__":
    sys.exit(main())

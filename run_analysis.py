#!/usr/bin/env python3
"""
run_analysis.py
───────────────
Turns one running activity (per-second records + laps, as produced by
fit_export.flatten) into a compact JSON the dashboard's Runs screen reads:

  meta      id, date, name, type, treadmill, duration, distance, avg HR
  class     intervals | z2 | steady | other
  segments  the work reps (intervals) or the steady block (steady/z2), each
            with pace, HR avg/max/drift, cadence, stride, vertical
            oscillation/ratio, GCT + balance, power
  rests     HR drop in every rest between reps
  fatigue   last segment vs first segment, % change per metric (intervals)
  aerobic   efficiency factor + decoupling of the steady block (z2/steady)
  series    the per-second channels, column-wise, for the charts

Treadmill runs have no GPS pace: the footpod under-reads the belt (6 Nov
showed 1.58 km for a 2 km rep). Where the activity name carries the belt
speeds ("3x2km 14kmh 14kmh 13.5kmh") those are used for pace; otherwise pace
is left null rather than shown wrong.

Writes data/runs/<id>.json and data/runs/index.json. Public repo, public data.

  python run_analysis.py --from-csv DIR      # backfill from fit_export/ CSVs
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import pandas as pd

RUNS_DIR = Path("data/runs")
CHANNELS = {  # json key -> record column
    "hr": "heart_rate", "spd": "speed_mps", "cad": "cadence_spm",
    "str": "stride_length_m", "vo": "vertical_oscillation_mm",
    "vr": "vertical_ratio_pct", "gct": "ground_contact_ms",
    "bal": "gct_balance_left_pct", "pw": "power_w", "alt": "altitude_m",
}
FORM = ["cadence_spm", "stride_length_m", "vertical_oscillation_mm",
        "vertical_ratio_pct", "ground_contact_ms", "gct_balance_left_pct", "power_w"]
MIN_LAP_S = 120        # a work rep is at least this long
WORK_FRACTION = 0.85   # of the fastest long lap's speed
WARMUP_TRIM_S = 600    # steady runs: skip the first 10 min for decoupling
OTHER_RE = re.compile(r"hyrox|circle|sled|row|ski|burpee", re.I)
Z2_RE = re.compile(r"\bz2\b|easy|recovery|aerobic", re.I)


def _num(x, n=2):
    return None if x is None or pd.isna(x) else round(float(x), n)


def pace_min_km(mps):
    return None if not mps or mps < 0.3 else 1000 / mps / 60


def belt_speeds(name: str, n_segments: int):
    """'… 14kmh 14kmh 13.5kmh' → [14, 14, 13.5] if it matches the rep count."""
    if n_segments < 2:
        return None
    vals = [float(v) for v in re.findall(r"(?<![x\d.])(\d{1,2}(?:\.\d)?)\s*km", name or "", re.I)]
    vals = [v for v in vals if 7 <= v <= 25]
    return vals if len(vals) == n_segments else None


def window(rec: pd.DataFrame, start, seconds: float) -> pd.DataFrame:
    end = start + pd.Timedelta(seconds=seconds)
    return rec[(rec.timestamp >= start) & (rec.timestamp < end)]


def block_metrics(w: pd.DataFrame, duration_s: float, treadmill: bool, belt_kmh=None, dist_m=None) -> dict:
    h = len(w) // 2
    a, b = w.iloc[:h], w.iloc[h:]
    d = w.distance_m.dropna()
    if belt_kmh:
        pace = 60 / belt_kmh
    elif treadmill or len(d) < 2:
        pace = None
    elif dist_m:
        pace = pace_min_km(dist_m / duration_s)
    else:
        pace = pace_min_km((d.iloc[-1] - d.iloc[0]) / duration_s) if duration_s else None
    out = {
        "start_s": int(w.elapsed_s.iloc[0]), "dur_s": round(duration_s, 1),
        "pace": _num(pace, 3), "belt_kmh": belt_kmh,
        "hr_avg": _num(w.heart_rate.mean(), 1), "hr_max": _num(w.heart_rate.max(), 0),
        "hr_1st": _num(a.heart_rate.mean(), 1), "hr_2nd": _num(b.heart_rate.mean(), 1),
        "hr_drift": _num(b.heart_rate.mean() - a.heart_rate.mean(), 1),
    }
    for c in FORM:
        out[c] = _num(w[c].mean(), 2)
    return out


def find_segments(laps: pd.DataFrame):
    """Work laps, plus whether they are separated (= intervals)."""
    long = laps[laps.elapsed_s >= MIN_LAP_S]
    if long.empty:
        return [], False
    vmax = long.avg_speed_mps.max()
    work = long[long.avg_speed_mps >= WORK_FRACTION * vmax]
    if len(work) < 2:
        return list(work.itertuples()), False
    first, last = work.lap.min(), work.lap.max()
    between = laps[(laps.lap > first) & (laps.lap < last)]
    separated = len(between) > len(work) - 2  # something between the reps
    gaps = len(work) - 1
    return list(work.itertuples()), separated and gaps >= 1


def analyse(records: list[dict] | pd.DataFrame, laps: list[dict] | pd.DataFrame, meta: dict) -> dict:
    rec = pd.DataFrame(records)
    lp = pd.DataFrame(laps)
    rec["timestamp"] = pd.to_datetime(rec["timestamp"], utc=True)
    if not lp.empty:
        lp["start"] = pd.to_datetime(lp["start"], utc=True)
    name = meta.get("name") or ""
    atype = meta.get("type") or ""
    treadmill = "treadmill" in atype or "indoor" in atype
    dur = float(rec.elapsed_s.max() - rec.elapsed_s.min())
    dist = rec.distance_m.dropna()
    res = {
        "id": int(meta["id"]), "date": meta["date"], "start_local": meta.get("start_local"),
        "name": name, "type": atype, "treadmill": treadmill,
        "duration_s": round(dur), "distance_m": _num(dist.iloc[-1] if len(dist) else None, 0),
        "hr_avg": _num(rec.heart_rate.mean(), 1), "hr_max": _num(rec.heart_rate.max(), 0),
        "segments": [], "rests": [], "fatigue": None, "aerobic": None,
    }

    work, intervals = ([], False) if lp.empty else find_segments(lp)
    if OTHER_RE.search(name):
        res["class"] = "other"
    elif intervals:
        res["class"] = "intervals"
        belts = belt_speeds(name, len(work)) if treadmill else None
        for i, lap in enumerate(work):
            w = window(rec, lap.start, lap.elapsed_s)
            if len(w) < 30:
                continue
            res["segments"].append(block_metrics(w, lap.elapsed_s, treadmill, belts[i] if belts else None, lap.distance_m))
        segs = res["segments"]
        for i in range(len(segs) - 1):
            end_t = rec.timestamp.iloc[0] + pd.Timedelta(seconds=segs[i]["start_s"] + segs[i]["dur_s"])
            nxt = rec.timestamp.iloc[0] + pd.Timedelta(seconds=segs[i + 1]["start_s"])
            rest = rec[(rec.timestamp >= end_t) & (rec.timestamp < nxt)]
            tail = window(rec, end_t - pd.Timedelta(seconds=5), 5)
            if rest.empty or tail.empty:
                continue
            hr_end = tail.heart_rate.mean()
            hr_min = rest.heart_rate.min()
            res["rests"].append({
                "after": i + 1, "dur_s": round((nxt - end_t).total_seconds()),
                "hr_end_rep": _num(hr_end, 0), "hr_min": _num(hr_min, 0),
                "hr_start_next": _num(rest.heart_rate.iloc[-3:].mean(), 0),
                "drop": _num(hr_end - hr_min, 0),
            })
        if len(segs) >= 2:
            f, l = segs[0], segs[-1]
            keys = ["pace", "hr_avg", "hr_max", "hr_drift"] + FORM
            res["fatigue"] = {k: (_num(l[k] - f[k], 2) if f.get(k) is not None and l.get(k) is not None else None)
                              for k in keys}
            res["fatigue_pct"] = {k: (_num((l[k] / f[k] - 1) * 100, 1)
                                      if f.get(k) and l.get(k) is not None and k != "hr_drift" else None)
                                  for k in keys}
    else:
        res["class"] = "z2" if Z2_RE.search(name) and not OTHER_RE.search(name) else "steady"
        trim = WARMUP_TRIM_S if dur > 1800 else 300 if dur > 900 else 0
        w = rec[rec.elapsed_s >= rec.elapsed_s.min() + trim]
        if len(w) > 120:
            seg = block_metrics(w, float(w.elapsed_s.iloc[-1] - w.elapsed_s.iloc[0]), treadmill)
            res["segments"].append(seg)
            # Aerobic efficiency: metres per minute per bpm, and Pa:HR decoupling
            # (how much efficiency falls from the first to the second half).
            h = len(w) // 2
            a, b = w.iloc[:h], w.iloc[h:]
            if not treadmill:
                ef = lambda x: (x.speed_mps.mean() * 60) / x.heart_rate.mean()
                ef1, ef2 = ef(a), ef(b)
                res["aerobic"] = {"ef": _num((ef1 + ef2) / 2, 3), "ef_1st": _num(ef1, 3), "ef_2nd": _num(ef2, 3),
                                  "decoupling_pct": _num((ef1 - ef2) / ef1 * 100, 1)}

    # Series, 1 Hz, column-wise
    ser = {"t": [int(x) for x in rec.elapsed_s]}
    for k, col in CHANNELS.items():
        ser[k] = [None if pd.isna(v) else round(float(v), 2) for v in rec[col]]
    res["series"] = ser
    res["laps"] = [{"start_s": int((r.start - rec.timestamp.iloc[0]).total_seconds()),
                    "dur_s": _num(r.elapsed_s, 1), "work": bool(any(r.lap == x.lap for x in work)) if work else False}
                   for r in lp.itertuples()] if not lp.empty else []
    return res


def write(res: dict):
    RUNS_DIR.mkdir(parents=True, exist_ok=True)
    (RUNS_DIR / f"{res['id']}.json").write_text(json.dumps(res, separators=(",", ":"), ensure_ascii=False))


def write_index():
    items = []
    for p in sorted(RUNS_DIR.glob("[0-9]*.json")):
        r = json.loads(p.read_text())
        seg = r["segments"][0] if r["segments"] else {}
        items.append({k: r.get(k) for k in ("id", "date", "start_local", "name", "type", "treadmill", "class",
                                            "duration_s", "distance_m", "hr_avg", "hr_max")}
                     | {"n_segments": len(r["segments"]), "aerobic": r.get("aerobic"),
                        "pace": seg.get("pace") if r.get("class") != "intervals" else
                        (round(sum(s["pace"] for s in r["segments"]) / len(r["segments"]), 3)
                         if r["segments"] and all(s.get("pace") for s in r["segments"]) else None),
                        "seg_hr": seg.get("hr_avg")})
    items.sort(key=lambda x: x["start_local"] or x["date"], reverse=True)
    (RUNS_DIR / "index.json").write_text(json.dumps(items, separators=(",", ":"), ensure_ascii=False))
    return items


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--from-csv", required=True, help="a fit_export/ directory (index.csv + *_records/_laps.csv)")
    args = ap.parse_args()
    d = Path(args.from_csv)
    idx = pd.read_csv(d / "index.csv")
    for row in idx.itertuples():
        stem = f"{row.date}_{row.activity_id}"
        rec = pd.read_csv(d / f"{stem}_records.csv")
        laps = pd.read_csv(d / f"{stem}_laps.csv")
        if len(rec) < 60:
            continue
        res = analyse(rec, laps, {"id": row.activity_id, "date": row.date, "start_local": row.start_local,
                                  "name": row.name, "type": row.type})
        write(res)
        print(f"✓ {stem} {res['class']:9s} {len(res['segments'])} seg  {row.name}")
    print(len(write_index()), "runs indexed")


if __name__ == "__main__":
    main()

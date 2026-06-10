#!/usr/bin/env python3
"""
create_workouts.py
──────────────────
One-off script: creates 5 structured running workouts in Garmin Connect
(workout-service API) so they sync to the Epix 2 Pro under
Run → Training → Workouts.

Runs inside GitHub Actions (same token pattern as update.py — garth tokens
pre-written to ~/.garth/ by the workflow step). Safe to re-run: it first
deletes any existing workout with the same name, then recreates it.

ADJUST THE PACE CONFIG BELOW BEFORE RUNNING.
"""

from __future__ import annotations
import sys
from pathlib import Path

import garth

# ── PACE CONFIG ──────────────────────────────────────────────────────────────
# Set your current threshold pace (min:sec per km). Everything derives from it.
THRESHOLD = "4:15"          # ← EDIT ME if needed

# Offsets in seconds/km relative to threshold (negative = faster)
PACES = {
    "threshold":        0,      # 1km/2km/1500m threshold reps
    "supra_threshold": -10,     # the 1000m "little faster than threshold"
    "hard_3min":       -15,     # 3-min hard efforts in the complex
    "interval_1min":   -25,     # 1-min reps at interval pace
    "float":           +15,     # the "slightly slower" 500s in changing tempo
    "r400":            -20,     # 16×400 — faster than threshold, short of VO2max
}
PACE_WINDOW = 5                 # ± sec/km tolerance band shown on watch

EASY_HR = (115, 145)            # bpm band for the easy trail run
# ─────────────────────────────────────────────────────────────────────────────


def pace_to_secs(p: str) -> int:
    m, s = p.split(":")
    return int(m) * 60 + int(s)

THR_SECS = pace_to_secs(THRESHOLD)

def mps(sec_per_km: int) -> float:
    return 1000.0 / sec_per_km

def pace_target(offset: int):
    """Garmin pace.zone target: valueOne = slower bound, valueTwo = faster, in m/s."""
    centre = THR_SECS + offset
    return (
        {"workoutTargetTypeId": 6, "workoutTargetTypeKey": "pace.zone"},
        round(mps(centre + PACE_WINDOW), 3),   # slower bound
        round(mps(centre - PACE_WINDOW), 3),   # faster bound
    )

NO_TARGET = ({"workoutTargetTypeId": 1, "workoutTargetTypeKey": "no.target"}, None, None)
HR_TARGET = (
    {"workoutTargetTypeId": 4, "workoutTargetTypeKey": "heart.rate.zone"},
    float(EASY_HR[0]), float(EASY_HR[1]),
)

STEP_TYPES = {
    "warmup":   {"stepTypeId": 1, "stepTypeKey": "warmup"},
    "cooldown": {"stepTypeId": 2, "stepTypeKey": "cooldown"},
    "interval": {"stepTypeId": 3, "stepTypeKey": "interval"},
    "recovery": {"stepTypeId": 4, "stepTypeKey": "recovery"},
    "rest":     {"stepTypeId": 5, "stepTypeKey": "rest"},
}

_order = 0
def _next() -> int:
    global _order
    _order += 1
    return _order

def step(kind, *, secs=None, metres=None, target=NO_TARGET, desc=None):
    t, v1, v2 = target
    s = {
        "type": "ExecutableStepDTO",
        "stepOrder": _next(),
        "stepType": STEP_TYPES[kind],
        "targetType": t,
        "targetValueOne": v1,
        "targetValueTwo": v2,
    }
    if secs is not None:
        s["endCondition"] = {"conditionTypeId": 2, "conditionTypeKey": "time"}
        s["endConditionValue"] = float(secs)
    elif metres is not None:
        s["endCondition"] = {"conditionTypeId": 3, "conditionTypeKey": "distance"}
        s["endConditionValue"] = float(metres)
    else:
        s["endCondition"] = {"conditionTypeId": 1, "conditionTypeKey": "lap.button"}
    if desc:
        s["description"] = desc
    return s

def repeat(n, steps):
    return {
        "type": "RepeatGroupDTO",
        "stepOrder": _next(),
        "stepType": {"stepTypeId": 6, "stepTypeKey": "repeat"},
        "numberOfIterations": n,
        "smartRepeat": False,
        "endCondition": {"conditionTypeId": 7, "conditionTypeKey": "iterations"},
        "workoutSteps": steps,
    }

def build_workouts():
    w = []
    global _order

    # 1 ── Threshold complex
    _order = 0
    w.append({
        "name": "1. Threshold Complex",
        "desc": ("3x1km @ threshold (1' rest) → 3x3' hard (2' jog) → "
                 "6 strides → 5x1' @ interval pace (2' jog). "
                 "Race pace control + speed endurance in one block."),
        "steps": [
            step("warmup", secs=15*60, desc="Easy build, finish with 2-3 pickups"),
            repeat(3, [
                step("interval", metres=1000, target=pace_target(PACES["threshold"]), desc="Threshold — controlled"),
                step("rest", secs=60, desc="Standing/walk rest"),
            ]),
            repeat(3, [
                step("interval", secs=3*60, target=pace_target(PACES["hard_3min"]), desc="Hard but smooth"),
                step("recovery", secs=2*60, desc="Easy jog"),
            ]),
            repeat(6, [
                step("interval", secs=20, desc="Stride — fast & relaxed"),
                step("recovery", secs=60, desc="Easy jog"),
            ]),
            repeat(5, [
                step("interval", secs=60, target=pace_target(PACES["interval_1min"]), desc="Interval pace"),
                step("recovery", secs=2*60, desc="Easy jog"),
            ]),
            step("cooldown", secs=10*60),
        ],
    })

    # 2 ── Threshold endurance block
    _order = 0
    w.append({
        "name": "2. Threshold Endurance",
        "desc": ("4 rounds: 2000m @ threshold straight into 1000m slightly faster, "
                 "2:30 controlled rest. Do 3 rounds if HRV/legs say so. "
                 "Sustained pace across varying distances — broken-8km specific."),
        "steps": [
            step("warmup", secs=15*60),
            repeat(4, [
                step("interval", metres=2000, target=pace_target(PACES["threshold"]), desc="Threshold"),
                step("interval", metres=1000, target=pace_target(PACES["supra_threshold"]), desc="Slightly faster — no rest before this"),
                step("rest", secs=150, desc="Controlled rest 2:30"),
            ]),
            step("cooldown", secs=10*60),
        ],
    })

    # 3 ── Changing tempo 6×1500m
    _order = 0
    w.append({
        "name": "3. Changing Tempo 6x1500",
        "desc": ("6x1500m as 500 threshold / 500 float / 500 threshold, "
                 "2:30 rest between reps. Composure under shifting intensity — "
                 "the most Hyrox-specific run format."),
        "steps": [
            step("warmup", secs=15*60),
            repeat(6, [
                step("interval", metres=500, target=pace_target(PACES["threshold"]), desc="Threshold"),
                step("interval", metres=500, target=pace_target(PACES["float"]), desc="Float — slightly slower, stay tall"),
                step("interval", metres=500, target=pace_target(PACES["threshold"]), desc="Back to threshold"),
                step("rest", secs=150, desc="Rest 2:30"),
            ]),
            step("cooldown", secs=10*60),
        ],
    })

    # 4 ── Easy trail run
    _order = 0
    w.append({
        "name": "4. Easy Trail 75min",
        "desc": ("75' genuinely easy on varied terrain. Aerobic depth + "
                 "stabilising strength. Conversational the whole way — "
                 "if in doubt, slower."),
        "steps": [
            step("interval", secs=75*60, target=HR_TARGET, desc="Easy — keep HR in band, walk hills if needed"),
        ],
    })

    # 5 ── 16×400m
    _order = 0
    w.append({
        "name": "5. 16x400m Speed",
        "desc": ("16x400m faster than threshold, short of VO2max, 70s rest. "
                 "Raises the speed ceiling so race pace feels controlled."),
        "steps": [
            step("warmup", secs=15*60, desc="Finish with 3-4 strides"),
            repeat(16, [
                step("interval", metres=400, target=pace_target(PACES["r400"]), desc="Quick but repeatable — rep 16 same as rep 1"),
                step("rest", secs=70, desc="Rest 70s"),
            ]),
            step("cooldown", secs=10*60),
        ],
    })

    return [
        workout_payload(x["name"], x["desc"], x["steps"]) for x in w
    ]


def workout_payload(name, description, steps):
    return {
        "sportType": {"sportTypeId": 1, "sportTypeKey": "running"},
        "workoutName": name,
        "description": description,
        "workoutSegments": [{
            "segmentOrder": 1,
            "sportType": {"sportTypeId": 1, "sportTypeKey": "running"},
            "workoutSteps": steps,
        }],
    }


def main():
    garth.resume(str(Path.home() / ".garth"))
    try:
        garth.client.username  # touch profile to confirm tokens work
    except Exception as e:
        print(f"❌ Garmin auth failed — tokens likely expired. Renew via dashboard 🔑 first. ({e})")
        sys.exit(1)

    # Existing workouts (for idempotent re-runs)
    existing = garth.connectapi(
        "/workout-service/workouts", params={"start": 0, "limit": 200}
    ) or []
    by_name = {wo["workoutName"]: wo["workoutId"] for wo in existing}

    created = []
    for payload in build_workouts():
        name = payload["workoutName"]
        if name in by_name:
            garth.connectapi(f"/workout-service/workout/{by_name[name]}", "DELETE")
            print(f"♻️  Replaced existing '{name}'")
        resp = garth.connectapi("/workout-service/workout", "POST", json=payload)
        wid = resp.get("workoutId") if isinstance(resp, dict) else None
        created.append((name, wid))
        print(f"✅ Created '{name}' (id={wid})")

    print(f"\nDone — {len(created)} workouts in Garmin Connect.")
    print("Sync the watch via the Connect app, then: Run → hold UP → Training → Workouts.")


if __name__ == "__main__":
    main()

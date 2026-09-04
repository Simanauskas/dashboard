#!/usr/bin/env python3
"""
create_workouts.py
──────────────────
Creates structured running workouts in Garmin Connect (workout-service API)
so they sync to the Epix 2 Pro under Run → Training → Workouts:

  1-5  the training block (threshold, endurance, tempo, easy, speed)
  6    HYROX ATHENS race plan — the 16 race splits, lap-button driven

Runs inside GitHub Actions (same token pattern as update.py — garth tokens
pre-written to ~/.garth/ by the workflow step). Safe to re-run: it first
deletes any existing workout with the same name, then recreates it.

  python create_workouts.py                 # all six
  python create_workouts.py --only ATHENS   # just the race plan

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


# ── RACE CONFIG · HYROX ATHENS, 5 Sep 2026 ───────────────────────────────────
# Targets come straight from the dashboard: RACE_BUDGET / RACE_GAINS /
# RIGA_SPLITS in src/App.jsx. Station targets are Riga's official splits minus
# the identified gains, so they sum to the 28:30 station budget exactly.
RACE_RUN = 276                  # 4:36 per km, every run
RACE_RUN_WINDOW = 5             # +/- sec/km band on the watch
RACE_ROXZONE_TOTAL = 262        # 4:22 across all transitions (jog every one)

# (station name, target seconds, cue shown on the watch)
RACE_STATIONS = [
    ("Ski Erg 1000m",   248, "2:04/500 - long strong pulls, full compression"),
    ("Sled Push 50m",   136, "Low hips, short steps, do not stop the sled"),
    ("Sled Pull 50m",   210, "Hand-over-hand rhythm, sit back - 38s to win here"),
    ("Burpee Broad Jp", 285, "6x20m blocks at 68s - rhythm over power"),
    ("Row 1000m",       252, "2:06/500 - hold it off tired legs"),
    ("Farmers Carry",    88, "No set-downs, quick turns"),
    ("Sandbag Lunge",   245, "Do not reset mid-lane - 100m unbroken"),
    ("Wall Balls 100",  246, "Sets of 10, breathe at the top, trust the legs"),
]


def pace_target_abs(sec_per_km: int, window: int = RACE_RUN_WINDOW):
    """Pace target from an absolute pace, independent of THRESHOLD."""
    return (
        {"workoutTargetTypeId": 6, "workoutTargetTypeKey": "pace.zone"},
        round(mps(sec_per_km + window), 3),   # slower bound
        round(mps(sec_per_km - window), 3),   # faster bound
    )


def build_race_workout():
    """HYROX Athens race plan as a 16-step, lap-button-driven workout.

    Every step ends on the LAP button rather than on distance. Indoor GPS is
    unusable for this: in Riga the eight 1 km runs recorded as 895-1234 m, so
    distance-ended steps would desync from the race within two stations.
    Pressing lap at each transition is what the user does anyway.

    Each description carries the segment target and the cumulative race clock
    it should be met at, so the plan can be checked against elapsed time even
    if a step is skipped by a double-press.
    """
    global _order
    _order = 0

    steps = []
    clock = 0

    for i, (name, target, cue) in enumerate(RACE_STATIONS, start=1):
        # Run leg i: the kilometre plus its share of the roxzone. Roxzone is
        # accumulated on the exact total so rounding cannot drift off 4:22.
        rox_to_here = round(i * RACE_ROXZONE_TOTAL / len(RACE_STATIONS))
        rox_prev = round((i - 1) * RACE_ROXZONE_TOTAL / len(RACE_STATIONS))
        clock += RACE_RUN + (rox_to_here - rox_prev)
        steps.append(step(
            "interval",
            target=pace_target_abs(RACE_RUN),
            desc=f"RUN {i} - 4:36/km - jog the roxzone - by {fmt(clock)}",
        ))

        clock += target
        steps.append(step(
            "interval",
            desc=f"{name.upper()} - {fmt(target)} - {cue} - by {fmt(clock)}",
        ))

    return workout_payload(
        "HYROX ATHENS - Target 1:10:00",
        (f"Race plan, 5 Sep 2026. 8x1km at 4:36 ({fmt(8 * RACE_RUN)}) + stations "
         f"({fmt(sum(s[1] for s in RACE_STATIONS))}) + roxzone "
         f"({fmt(RACE_ROXZONE_TOTAL)}) = {fmt(clock)}, 20s inside 1:10:00. "
         "Press LAP at every run/station transition - each press advances one step."),
        steps,
    )


def fmt(secs: int) -> str:
    """mm:ss, rolling over to h:mm:ss so the late race-clock checkpoints
    read 1:00:25 rather than 60:25."""
    if secs >= 3600:
        return f"{secs // 3600}:{(secs % 3600) // 60:02d}:{secs % 60:02d}"
    return f"{secs // 60}:{secs % 60:02d}"


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


def build_all():
    return build_workouts() + [build_race_workout()]


def main():
    # Without --only every workout is rebuilt. The five training workouts are
    # done with once the race block ends, so pass e.g. --only ATHENS to touch
    # just the race plan and leave the rest of the Connect library alone.
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1].lower()

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

    payloads = build_all()
    if only:
        payloads = [p for p in payloads if only in p["workoutName"].lower()]
        if not payloads:
            print(f"❌ --only {only!r} matched no workout")
            sys.exit(1)

    created = []
    for payload in payloads:
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

// Exercise names → Garmin's exercise catalog (category / name), verified for
// the garmin-strength-sets skill (Oct 2026). match_sessions.py re-checks every
// name against Garmin's live catalog and falls back to category-only if one
// has gone. unit: what the number in a set means — reps, metres or seconds.
export const EXERCISES = [
  ["Back squat", "SQUAT", "BARBELL_BACK_SQUAT"],
  ["Front squat", "SQUAT", "BARBELL_FRONT_SQUAT"],
  ["Goblet squat", "SQUAT", "GOBLET_SQUAT"],
  ["Leg press", "SQUAT", "LEG_PRESS"],
  ["Romanian deadlift", "DEADLIFT", "ROMANIAN_DEADLIFT"],
  ["Deadlift", "DEADLIFT", "BARBELL_DEADLIFT"],
  ["Trap bar deadlift", "DEADLIFT", "TRAP_BAR_DEADLIFT"],
  ["Walking lunges", "LUNGE", "WALKING_LUNGE"],
  ["Sandbag lunges", "SANDBAG", "LUNGE"],
  ["Bulgarian split squat", "LUNGE", "DUMBBELL_BULGARIAN_SPLIT_SQUAT"],
  ["Step-ups", "SQUAT", "DUMBBELL_STEP_UP"],
  ["Sled push", "SLED", "PUSH", "s"],
  ["Sled pull", "SLED", "BACKWARD_DRAG", "m"],
  ["Calf raises", "CALF_RAISE", "STANDING_CALF_RAISE"],
  ["Hip thrust", "HIP_RAISE", "BARBELL_HIP_THRUST_WITH_BENCH"],
  ["Nordic curl", "LEG_CURL", null],
  ["Pull-ups", "PULL_UP", "PULL_UP"],
  ["Chin-ups", "PULL_UP", "CHIN_UP"],
  ["Lat pulldown", "PULL_UP", "LAT_PULLDOWN"],
  ["Barbell row", "ROW", "BARBELL_ROW"],
  ["Seated row", "ROW", "SEATED_CABLE_ROW"],
  ["One-arm DB row", "ROW", "ONE_ARM_BENT_OVER_ROW"],
  ["Face pull", "ROW", "FACE_PULL"],
  ["Shoulder press", "SHOULDER_PRESS", "OVERHEAD_BARBELL_PRESS"],
  ["DB shoulder press", "SHOULDER_PRESS", "OVERHEAD_DUMBBELL_PRESS"],
  ["Push press", "SHOULDER_PRESS", "BARBELL_PUSH_PRESS"],
  ["Bench press", "BENCH_PRESS", "BARBELL_BENCH_PRESS"],
  ["DB bench press", "BENCH_PRESS", "DUMBBELL_BENCH_PRESS"],
  ["Farmers carry", "CARRY", "FARMERS_CARRY", "m"],
  ["Sandbag carry", "SANDBAG", "FRONT_CARRY", "m"],
  ["Wall balls", "SQUAT", "WALL_BALL"],
  ["Burpees", "TOTAL_BODY", "BURPEE"],
  ["Burpee broad jumps", "TOTAL_BODY", "BURPEE"],
  ["KB swing", "HIP_RAISE", "KETTLEBELL_SWING"],
  ["Box jump", "PLYO", "BOX_JUMP"],
  ["Thrusters", "SQUAT", "THRUSTERS"],
  ["Hanging leg raise", "LEG_RAISE", "HANGING_LEG_RAISE"],
  ["Dips", "TRICEPS_EXTENSION", "BODY_WEIGHT_DIP"],
  ["Push-ups", "PUSH_UP", "PUSH_UP"],
  ["Plank", "PLANK", "PLANK", "s"],
].map(([name, cat, gname, unit = "reps"]) => ({ name, cat, gname, unit }))

export const exByName = n => EXERCISES.find(e => e.name.toLowerCase() === (n || "").trim().toLowerCase())

// Workout templates. `target` is the plan's prescription, shown as a hint;
// `seed` is the first-time prefill (from the Apple Notes log) until real
// history exists for that exercise.
export const STRENGTH_TEMPLATES = {
  "Lower body": [
    { name: "Back squat", target: "4×5-8", seed: { kg: 70, n: 6, sets: 3 } },
    { name: "Romanian deadlift", target: "3×6-8", seed: { kg: 80, n: 10, sets: 3 } },
    { name: "Walking lunges", target: "3×12 each", seed: { kg: 35, n: 20, sets: 3 } },
    { name: "Sled push", target: "4×20m heavy · treadmill 70s", seed: { kg: null, n: 70, sets: 3 } },
    { name: "Calf raises", target: "3×15-20", seed: { kg: 25, n: 15, sets: 3 } },
  ],
  "Upper body": [
    { name: "Pull-ups", target: "4×6-10" },
    { name: "Barbell row", target: "3×6-8" },
    { name: "Shoulder press", target: "3×6-8" },
    { name: "Farmers carry", target: "4×40m" },
    { name: "Wall balls", target: "4×20" },
  ],
  "Empty": [],
}

export const RUN_TEMPLATES = {
  "Speed session": {
    goal: "get faster, boost VO₂max · 45-60 min",
    options: ["6×400m @ 5K pace (90s rest)", "5×1km @ threshold (60s rest)", "10×200m fast (walk/jog recovery)"],
  },
  "Easy run": { goal: "zone 2 · 30-50 min · +1-2 min/km on interval pace", options: ["Easy run Z2"] },
  "Long run": { goal: "endurance · 60-120 min · practice fueling", options: ["Long run"] },
  "Other run": { goal: "", options: [] },
}

export const HYROX_TEMPLATE = {
  rounds: 4,
  stations: ["1km run", "50m Sled pull", "10 Burpee broad jumps", "500m Row", "50m Farmers carry"],
}

// Garmin type display name (as update.py writes it into CSV_DATA) → how the
// logger treats it. Types not listed log as "other" with notes + RPE only.
const RUN_TYPES = ["Running", "Indoor Running", "Treadmill Running", "Trail Running", "Track Running"]
const snake = t => t.toLowerCase().replace(/ v2$/, "_v2").replace(/\s+/g, "_")

export function activityOptions(types) {
  const seen = new Map()
  const add = (key, o) => { if (!seen.has(key)) seen.set(key, o); else seen.get(key).n += o.n }
  for (const { type, n } of types) {
    if (type === "Strength Training") add("strength", { key: "strength", label: "Strength training", kind: "strength", n })
    else if (type === "Indoor Cardio") {
      add("skierg", { key: "skierg", label: "SkiErg", sub: "Indoor Cardio", kind: "erg", machine: "SkiErg", n })
      add("hyrox", { key: "hyrox", label: "Hyrox stations", sub: "Indoor Cardio", kind: "hyrox", n: 0 })
    } else if (type === "Indoor Rowing" || type === "Rowing V2")
      add("row", { key: "row", label: "Row (erg)", sub: "Indoor Rowing", kind: "erg", machine: "Row", n })
    else if (RUN_TYPES.includes(type)) add(snake(type), { key: snake(type), label: type, kind: "run", n })
    else if (/^Tennis/.test(type)) add("tennis", { key: "tennis", label: "Tennis", kind: "tennis", n })
    else add(snake(type), { key: snake(type), label: type, kind: "other", typeKeys: [snake(type)], n })
  }
  // The core sessions are always offered, even before they show up in a year of data.
  for (const o of [
    { key: "strength", label: "Strength training", kind: "strength", n: 0 },
    { key: "skierg", label: "SkiErg", sub: "Indoor Cardio", kind: "erg", machine: "SkiErg", n: 0 },
    { key: "hyrox", label: "Hyrox stations", sub: "Indoor Cardio", kind: "hyrox", n: 0 },
    { key: "running", label: "Running", kind: "run", n: 0 },
    { key: "tennis", label: "Tennis", kind: "tennis", n: 0 },
  ]) if (!seen.has(o.key)) seen.set(o.key, o)
  return [...seen.values()].sort((a, b) => b.n - a.n)
}

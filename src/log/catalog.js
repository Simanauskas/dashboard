import GARMIN from "./garmin-exercises.json"

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
  ["Sled pull", "SLED", "PULL", "m"],
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
  ["Burpee broad jumps", "TOTAL_BODY", "BURPEE_BROAD_JUMP"],
  ["Kettlebell swing", "HIP_RAISE", "KETTLEBELL_SWING"],
  ["Box jump", "PLYO", "BOX_JUMP"],
  ["Thrusters", "SQUAT", "THRUSTERS"],
  ["Hanging leg raise", "LEG_RAISE", "HANGING_LEG_RAISE"],
  ["Dips", "TRICEPS_EXTENSION", "BODY_WEIGHT_DIP"],
  ["Push-ups", "PUSH_UP", "PUSH_UP"],
  ["Plank", "PLANK", "PLANK", "s"],
  ["Crunch", "CRUNCH", "CRUNCH"],
  // Hyrox / circuit stations
  ["Treadmill run", "RUN_INDOOR", "TREADMILL", "m"],
  ["Run", "RUN", "RUN", "m"],
  ["Row (erg)", "ROW", "INDOOR_ROW", "m"],
  ["SkiErg", "CARDIO", "CROSS_COUNTRY_SKI_MACHINE", "m"],
  ["Bike (erg)", "INDOOR_BIKE", "STATIONARY_BIKE", "m"],
].map(([name, cat, gname, unit = "reps"]) => ({ name, cat, gname, unit, curated: true }))

// Every exercise in Garmin's catalog (src/log/garmin-exercises.json, refreshed
// from Garmin by exercise_catalog.py in the hourly sync), named from Garmin's
// key: CRUNCH/BICYCLE_CRUNCH → "Bicycle crunch". The hand-picked list above
// wins where both name the same Garmin exercise, so its friendlier names stay.
const human = k => (k || "").toLowerCase().replace(/_/g, " ").replace(/^./, c => c.toUpperCase())
const unitFor = (cat, name) =>
  cat === "CARRY" || (cat === "SLED" && name !== "PUSH") ? "m"
    : cat === "PLANK" || /(^|_)(HOLD|PLANK|HANG)(_|$)/.test(name || "") ? "s" : "reps"

export const ALL_EXERCISES = (() => {
  const seen = new Set(EXERCISES.map(e => `${e.cat}/${e.gname}`))
  const garmin = (GARMIN.exercises || [])
    .filter(([c, n]) => !seen.has(`${c}/${n}`))
    .map(([c, n]) => ({ name: human(n), cat: c, gname: n, unit: unitFor(c, n) }))
  // A name in several categories keeps the plain name in the category it
  // belongs to (Bicycle crunch → CRUNCH, Sit up → SIT_UP); the other copies,
  // and any that clash with a hand-picked name, get "(category)" added.
  const groups = {}
  for (const e of garmin) (groups[e.name] = groups[e.name] || []).push(e)
  for (const [name, list] of Object.entries(groups)) {
    const lower = name.toLowerCase()
    const home = EXERCISES.some(x => x.name === name) ? null
      : list.length === 1 ? list[0]
      : list.find(e => human(e.cat) === name) || list.find(e => lower.includes(human(e.cat).toLowerCase())) || null
    for (const e of list) if (e !== home) e.name = `${name} (${human(e.cat).toLowerCase()})`
  }
  return [...EXERCISES, ...garmin].map(e => ({ ...e, catLabel: human(e.cat), hay: `${e.name} ${human(e.cat)}`.toLowerCase().replace(/-/g, " ") }))
})()

export const exByName = n => {
  const k = (n || "").trim().toLowerCase()
  return ALL_EXERCISES.find(e => e.name.toLowerCase() === k)
}

// Search for the exercise picker: every word typed must appear (in the name or
// Garmin's category); "crunches"/"lunges" also match "crunch"/"lunge".
// Hand-picked names first, then names that start with what was typed, then shorter.
export function searchExercises(q, limit = 8) {
  const words = q.trim().toLowerCase().replace(/-/g, " ").split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const stem = w => (w.length > 4 && w.endsWith("es") ? w.slice(0, -2) : w.length > 2 && w.endsWith("s") ? w.slice(0, -1) : w)
  const ql = words.join(" ")
  const hits = []
  for (const e of ALL_EXERCISES) {
    if (!words.every(w => e.hay.includes(w) || e.hay.includes(stem(w)))) continue
    const nl = e.name.toLowerCase()
    const score = (e.curated ? 10 : 0) + (nl === ql || nl === stem(ql) ? 8 : 0) + (nl.startsWith(stem(words[0])) ? 3 : 0)
      + (nl.split(" (")[0].split(/\s+/).some(t => t.startsWith(stem(words[0]))) ? 1 : 0) - nl.length / 100
    hits.push([score, e])
  }
  return hits.sort((a, b) => b[0] - a[0]).slice(0, limit).map(h => h[1])
}

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

// Old "Hyrox stations" sessions (kind hyrox) still open with this; new ones are circuits.
export const HYROX_TEMPLATE = {
  rounds: 4,
  stations: ["1km run", "50m Sled pull", "10 Burpee broad jumps", "500m Row", "50m Farmers carry"],
}

// Circuit workouts offered before any history exists. Each station is an
// exercise name (looked up in ALL_EXERCISES) with its amount; workouts he names
// and saves are offered again from history ("Repeat …").
export const CIRCUIT_TEMPLATES = {
  "Hyrox circuit": { rounds: 3, stations: [
    ["Treadmill run", 1000], ["Sled pull", 40], ["Burpee broad jumps", 10], ["Row (erg)", 500], ["Farmers carry", 50],
  ] },
}

// The New session screen: fixed tiles in his order (7 Nov 2026). Everything
// else he did in the last year sits under "Other…", most frequent first.
// Inline skating is left out on purpose — nothing to log for it.
const CYCLING_TYPES = ["cycling", "road_biking", "gravel_cycling", "mountain_biking"]
export const TILES = {
  Indoors: [
    { key: "strength", label: "Strength", kind: "strength", icon: "🏋️" },
    { key: "circuit", label: "Circuit", sub: "HIIT", kind: "circuit", icon: "🔁" },
    { key: "treadmill", label: "Indoor run", kind: "erg", machine: "Treadmill", icon: "🏃" },
    { key: "bike", label: "Indoor bike", kind: "erg", machine: "Bike", icon: "🚲" },
    { key: "skierg", label: "SkiErg", sub: "Indoor Cardio", kind: "erg", machine: "SkiErg", icon: "⛷️" },
    { key: "row", label: "RowErg", sub: "Indoor Rowing", kind: "erg", machine: "Row", icon: "🚣" },
  ],
  Outdoors: [
    { key: "tennis", label: "Tennis", kind: "tennis", icon: "🎾" },
    { key: "running", label: "Run", kind: "run", icon: "👟" },
    { key: "cycling", label: "Cycling", kind: "other", typeKeys: CYCLING_TYPES, icon: "🚴" },
  ],
}

// Garmin type display names (as update.py writes them into CSV_DATA) that a
// tile already covers, or that are deliberately not offered.
const COVERED = new Set(["Strength Training", "Indoor Cardio", "Indoor Rowing", "Rowing V2", "Running",
  "Indoor Running", "Treadmill Running", "Trail Running", "Track Running", "Tennis", "Tennis V2",
  "Cycling", "Road Biking", "Indoor Cycling", "Inline Skating"])
const snake = t => t.toLowerCase().replace(/ v2$/, "_v2").replace(/\s+/g, "_")

export function otherOptions(types) {
  return types.filter(t => !COVERED.has(t.type))
    .map(({ type, n }) => ({ key: snake(type), label: type, kind: "other", typeKeys: [snake(type)], n }))
}

---
name: garmin-strength-sets
description: Log Simas Simanauskas's strength-session sets — exercises, weights and reps — into the matching Garmin Connect strength activity, via the strength-sets.yml GitHub Actions workflow in Simanauskas/dashboard. Use whenever he drops a workout list like "Overhead 45kgx7x6x7, Pullups 11x7x9, Farmers carry 48kg x 100m x3", asks to "add these sets/exercises to Garmin", "fill in today's strength session", "log my lifts", "finish the sets I started", or fix the exercise names/reps/weights the watch guessed. Also use to look up Garmin's exercise names. Not for renaming an activity (simas-fit-update) or coaching (simas-hyrox).
---

# Garmin strength sets

Simas drops a workout in shorthand; you write it into the **Sets** tab of the
Garmin strength activity and confirm it read back. Just do it — no need to ask
first, unless the notation is genuinely ambiguous (see below). The whole job is
3 workflow runs: read → dry run → apply.

## How it works

Garmin tokens only exist inside GitHub Actions, so every Garmin call runs there:

- Repo `Simanauskas/dashboard`, workflow **`strength-sets.yml`** (ref `main`),
  script `strength_sets.py`. Dispatch with the GitHub MCP
  `actions_run_trigger` (`method: run_workflow`), then find the run with
  `actions_list` → `list_workflow_runs` (resource_id `strength-sets.yml`,
  perPage 1) → `list_workflow_jobs`, and read `get_job_logs`
  (`return_content: true`, `tail_lines` ~80). A run takes ~20 s; wait about
  45 s before looking (in Claude Code, a Bash `until` loop on the clock — plain
  `sleep` is blocked).
- Inputs: `date` (YYYY-MM-DD, blank = today in Vilnius), `activity_id`,
  `sets` (JSON, below), `apply` (boolean — **only `true` writes**), `find`
  (catalog search, e.g. `"row; wall ball"`).
- If there is no GitHub tool in the session, say so and give him the inputs to
  paste into Actions → Strength Sets → Run workflow himself.

## Steps

1. **Read.** Dispatch with just `date` (default today). The log lists the
   candidate activity id and every existing set:
   `idx  ACTIVE/REST  time  duration  CATEGORY  NAME  p=  reps=  weight=` (grams).
   - More than one strength activity that day → it prints them and fails; pick
     by time/name, or ask, then pass `activity_id`.
   - No strength activity → tell him (it may not have synced from the watch yet).
2. **Work out the edits** (rules below) and build the `sets` JSON.
3. **Dry run**: same inputs + `sets`, `apply` false. Check it printed
   `✓ all exercise names are in Garmin's catalog` and that the planned list is
   what you intend. A `✗ not in catalog` line lists the valid names — fix and
   re-run.
4. **Apply**: identical inputs + `apply: true`. Success is the line
   `✓ sets written and read back`. Anything else → report the log, don't retry
   blindly.
5. **Report** a short table: exercise | sets, marking which were already there
   and which you added/changed. Mention any naming judgement call.

## The `sets` JSON

A list of edits:

```json
[
  {"category": "ROW", "name": "ONE_ARM_BENT_OVER_ROW", "reps": 15, "kg": 25},
  {"at": 4, "category": "PULL_UP", "name": "PULL_UP", "reps": 9, "kg": null},
  {"at": 6, "delete": true}
]
```

- No `at` → **appended** after the existing sets, untimed, each followed by a
  REST — exactly what Garmin Connect's own "add set" button produces.
- `"at": i` → **relabels** existing set i (index from the read log), keeping
  the watch's timing. `"delete": true` removes it.
- `kg: null` = bodyweight. The script converts kg → grams.
- `name` may be `null` for a category-only label (Garmin accepts it — e.g. his
  pull-ups were entered that way).

## Deciding the edits

- **Never duplicate.** Compare his list with what's already there. Sets he
  already entered (p=100, right exercise/reps/weight) are left alone — on
  8 Oct 2026 he had done 3 of 5 exercises himself and only rows + burpees
  were missing.
- **Watch-detected sets** (timed, usually wrong exercise, p < 100): relabel
  them in order with `at` so the timing is kept — the first N sets of his list
  onto the first N timed ACTIVE sets, in the order he did them. Append whatever
  is left over. If the watch has clearly *more* ACTIVE sets than he lists, ask
  before deleting any (often the watch split one set into two, or counted a
  carry/warm-up).
- Keep his exercise order.

## Reading his notation

| He writes | Means |
|---|---|
| `Overhead 45kgx7x6x7` | 45 kg, sets of 7, 6, 7 (3 sets) |
| `1arm db rows 25kgx15,14,12` | 25 kg, sets of 15, 14, 12 |
| `Pullups 11x7x9` | bodyweight, sets of 11, 7, 9 |
| `Farmers carry 48kg x 100m x3` | 3 sets, 48 kg, **reps = 100** (metres as reps — his convention in Garmin) |
| `100 Burpees to plate` | 1 set of 100 |
| `DL 100x6x3` | 100 kg, 6 reps × 3 sets (weight followed by exactly two numbers = reps × sets) |

Rule of thumb: after the weight, **three or more numbers or a comma list =
reps per set**; **exactly two numbers = reps × sets**; a trailing `xN` after a
distance/time = N sets. When it is still ambiguous (e.g. `10x5` with no
weight), compare with the number of timed sets the watch recorded; if that
doesn't settle it, ask. Kg is the default unit. A per-hand weight
("2×24kg KB") — log the per-hand number and say so.

## Exercise names (verified in Garmin's catalog, Oct 2026)

| Exercise | category / name |
|---|---|
| Overhead press (barbell) | SHOULDER_PRESS / OVERHEAD_BARBELL_PRESS |
| DB shoulder press | SHOULDER_PRESS / OVERHEAD_DUMBBELL_PRESS |
| Push press | SHOULDER_PRESS / BARBELL_PUSH_PRESS |
| Bench press | BENCH_PRESS / BARBELL_BENCH_PRESS (DB: DUMBBELL_BENCH_PRESS) |
| Deadlift | DEADLIFT / BARBELL_DEADLIFT (RDL: ROMANIAN_DEADLIFT, trap bar: TRAP_BAR_DEADLIFT) |
| Back / front squat | SQUAT / BARBELL_BACK_SQUAT, BARBELL_FRONT_SQUAT; goblet: GOBLET_SQUAT |
| Bulgarian split squat | LUNGE / DUMBBELL_BULGARIAN_SPLIT_SQUAT |
| Walking lunge / sandbag lunge | LUNGE / WALKING_LUNGE · SANDBAG / LUNGE |
| Step-ups | SQUAT / DUMBBELL_STEP_UP (bodyweight: STEP_UP) |
| Pull-ups / chin-ups | PULL_UP / PULL_UP · PULL_UP / CHIN_UP |
| Lat pulldown | PULL_UP / LAT_PULLDOWN |
| One-arm DB row | ROW / ONE_ARM_BENT_OVER_ROW |
| Barbell row | ROW / BARBELL_ROW |
| Face pull | ROW / FACE_PULL |
| Farmers carry | CARRY / FARMERS_CARRY |
| Sandbag carry | SANDBAG / FRONT_CARRY |
| Sled push / pull | SLED / PUSH · SLED / BACKWARD_DRAG (or FORWARD_DRAG) |
| Wall balls | SQUAT / WALL_BALL |
| Burpees (incl. "to plate") | TOTAL_BODY / BURPEE · burpee broad jump: no exact match → TOTAL_BODY / BURPEE and say so |
| KB swing | HIP_RAISE / KETTLEBELL_SWING |
| Box jump | PLYO / BOX_JUMP |
| Calf raise | CALF_RAISE / STANDING_CALF_RAISE (DB: STANDING_DUMBBELL_CALF_RAISE) |
| Hip thrust | HIP_RAISE / BARBELL_HIP_THRUST_WITH_BENCH |
| Nordic / Norwegian curl | not in catalog → LEG_CURL / null |
| Hanging leg raise | LEG_RAISE / HANGING_LEG_RAISE |
| Dips / push-ups | TRICEPS_EXTENSION / BODY_WEIGHT_DIP · PUSH_UP / PUSH_UP |
| Thrusters | SQUAT / THRUSTERS |
| Plank | PLANK / PLANK (log seconds as reps only if he gives a time) |

Anything else: dispatch with `find` (several terms separated by `;`) and pick
the closest plain match. If there's no good name, use the category with
`name: null` and say so. Ski/row ergs are separate cardio activities, not sets.

## Gotchas

- A green run is not proof — only `✓ sets written and read back` is.
- `apply` is a boolean checkbox input; pass JSON `true`, not the string.
- Don't touch `src/App.jsx` — the dashboard doesn't read sets.
- Changing `strength_sets.py`/the workflow: they must be on `main` to dispatch.

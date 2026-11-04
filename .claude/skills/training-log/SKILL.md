---
name: training-log
description: Simas Simanauskas's phone training logger at training.simas.fit/log — the home-screen web app where he logs strength sets, SkiErg/row pieces, runs, tennis and Hyrox station rounds during training, which match_sessions.py then writes into the matching Garmin activity (sets, distance, name, description) via log-session.yml and the auth.simas.fit/log Worker route. Use whenever he asks what he logged ("what did I squat last week", "my SkiErg pieces this month"), says a logged session didn't reach Garmin / went to the wrong activity / shows "waiting" or "failed", wants to undo or re-match a session, or wants to change the logger (add an exercise, workout template, run session, activity type, field, or fix its UI). Also use to read data/sessions/*.json for coaching context. Not for typed-in workout lists with no app involved (garmin-strength-sets), tennis typed in chat (garmin-tennis-log), the dashboard itself (simas-fit-update) or coaching (simas-hyrox).
---

# Training logger — training.simas.fit/log

He logs on his iPhone while training; each saved session is written into the
Garmin activity his watch recorded. Built 3–4 Nov 2026. Repo
`Simanauskas/dashboard` (+ the `/log` route in `Simanauskas/garmin-auth-worker`).
Architecture details also in `docs/logger.md` in the repo.

**URL: https://training.simas.fit/log/** — NOT simas.fit/log. simas.fit is a
separate landing site and shows its 3-choice page for any path it lacks.

```
iPhone home-screen app (training.simas.fit/log/)
  every keystroke → localStorage (works offline; queued sends retry on reconnect)
  Save → POST auth.simas.fit/log  (Bearer LOG_TOKEN)
           → workflow_dispatch log-session.yml {action, id, session, activity_id}
                → match_sessions.py --ingest "$SESSION" --apply
                     ├─ data/sessions/<id>.json  (full record, committed by garmin-bot)
                     └─ matching Garmin activity (sets / distance / name / description)
  activity not synced yet → state "pending" → hourly update.yml runs
                            match_sessions.py --pending --apply
```
Fallback when the Worker is down: logger ⚙︎ Settings → "GitHub (fallback)"
with a fine-grained token (repo dashboard only; Actions RW, Contents R) — the
phone dispatches log-session.yml directly.

## Reading what he logged

The full records are `data/sessions/<id>.json` on `main` (public repo):
`https://raw.githubusercontent.com/Simanauskas/dashboard/main/data/sessions/<id>.json`,
or list the folder with the GitHub MCP `get_file_contents`. Every Garmin
description ends with `#log v1 <id>`, so from a Garmin activity you can find the
record. Use the JSON, not the Garmin description, as the source of truth — the
description is a lossy summary.

```json
{ "v": 1, "id": "2026-11-03-1712-strength", "kind": "strength",
  "activity": "Strength training", "template": "Lower body",
  "start": "2026-11-03T17:12:00+02:00", "end": "2026-11-03T18:01:00+02:00",
  "rpe": 7, "notes": "", "title": "",
  "exercises": [{ "name": "Back squat", "cat": "SQUAT", "gname": "BARBELL_BACK_SQUAT",
                  "unit": "reps", "sets": [{ "kg": 70, "n": 6 }, { "kg": 72.5, "n": 5 }] }],
  "status": { "state": "applied", "garmin_id": "21234567890", "message": "ok",
              "hash": "…", "applied_at": "…", "before": { "name": "…", "description": "…",
              "distance": null, "sets": [ … ] } } }
```
- `id` = `YYYY-MM-DD-HHMM-<activity key>` (regex `^\d{4}-\d{2}-\d{2}-[a-z0-9-]{1,48}$`).
- `kind`: `strength | erg | run | tennis | hyrox | other`.
- Strength set `n` means reps, metres or seconds per the exercise's `unit`
  (`reps | m | s`); `kg: null` = bodyweight. A set with both null was not done.
- `erg {machine: SkiErg|Row|BikeErg, pieces:[{m, sec, spm}], damper, rest_sec}`
- `run {plan, reps:[sec|null], shoes, fuel}` — `template` is Speed session / Easy run / Long run / Other run
- `tennis {opponent, mode: match|sparring|training, score, plus:[], minus:[]}`
- `hyrox {stations:[names], rounds:[[sec|null per station]], total_sec}`
- `other` sessions carry `type_keys` (e.g. `["cycling"]`) plus notes/RPE only.

`status.state`: `pending` (waiting for the watch activity) · `applied` · `error`
(3 failed writes; `message` says why) · `no_match` (nothing found within 3 days)
· `undone`.

## "My session didn't reach Garmin"

1. Read `data/sessions/<id>.json` → `status.state` + `message`. If the file
   doesn't exist, the send never ran: check Actions → **Log Session**
   (`actions_list` → `list_workflow_runs`, resource_id `log-session.yml`) and the
   app's pill ("waiting for signal" = still queued on the phone; tap the session,
   check ⚙︎ token → Test).
2. `pending` — the watch activity isn't in Garmin yet, or nothing matched:
   - Matching needs the **same Garmin type**: strength → `strength_training`;
     SkiErg → `indoor_cardio` (that's how he records it); Row → `indoor_rowing`;
     run → running/treadmill_running/indoor_running/trail_running/track_running;
     tennis → `tennis_v2`/`tennis`; Hyrox stations → hyrox/indoor_cardio/hiit/
     strength_training/other/multi_sport; other → its own type key.
   - …and **time**: the activity whose window overlaps the logged start→save
     window, else the closest start within 4 h. Logged afterwards with a wrong
     start time → no overlap. He can fix "Started" under "Garmin name & time".
   - An activity another applied session already claimed is never reused.
3. Wrong activity, or force a specific one → rematch (undoes the old write first):
   dispatch `log-session.yml` with `action: rematch`, `id`, `activity_id`
   (the number in the Garmin Connect URL). Or he taps "Wrong activity…" in the app.
4. Undo → `action: undo`, `id`. Restores the original name, description,
   distance and sets from `status.before`.
5. A green run is not proof. Read the job log for `✓ <id> → <garmin id>: ok`.
   `✗` lines carry the reason; `distance did not stick` / `not in Garmin's
   catalog` are notes on an otherwise applied write.

Dispatch from chat: GitHub MCP `actions_run_trigger` (`method: run_workflow`,
workflow `log-session.yml`, ref `main`, inputs as strings). `save` needs the full
session JSON in `session`; undo/rematch leave it empty.

## What gets written (match_sessions.py)

- **Before the first write**, the activity's name, description, distance and
  (strength) exercise sets are snapshotted into `status.before`. Every later
  write is built from that snapshot, so a re-save from the phone rewrites
  cleanly instead of stacking, and the description he typed in Garmin before is
  kept (appended after the log block, before the tag).
- **Strength**: logged sets in order relabel the watch's ACTIVE sets (keeping
  its timing); extra logged sets are appended (each + a REST); extra *watch*
  sets are left as recorded and noted. Reuses `strength_sets.build()`. Names are
  checked against Garmin's live catalog (`strength_sets.catalog()`): unknown name
  → category only; unknown category → left out of the Sets tab (still in the
  description). Carries: metres as reps (his convention). Timed sets (`unit: s`,
  e.g. treadmill sled push 70s): reps null, seconds as duration on appended sets.
  Sets are read back and compared — a mismatch fails the write.
- **Erg**: `summaryDTO.distance` = total metres, read back (a "did not stick" is
  a note, not a failure).
- **Name** (≤100 chars): `title` if he typed one, else built —
  `Lower body — Squat 72.5 · RDL 80 · Sled push` · `SkiErg 2325m 10:00 · 2:09/500m` ·
  `SkiErg 4×500m · 1:58/500m` · run = the plan (`6×400m @ 5K pace (90s rest)`) ·
  tennis `Rokas Mačiulaitis🎾6:4 3:6 10:8` (garmin-tennis-log format; training
  with no opponent → `Tennis training`) · `Hyrox stations 4 rounds · 52:10`.
  `other` keeps Garmin's name unless a title was typed.
- **Description**: one line per exercise/piece/station (`Back squat: 70×6 · 72.5×5`,
  `Romanian deadlift 80kg: 10 · 10 · 10`), tennis `+`/`+-`/`-` lines, `RPE 7`,
  notes, then `#log v1 <id>` as the very last line.
- Name and description are read back; either not sticking fails the write.

## The app (src/log/)

| File | What |
|---|---|
| `src/log/catalog.js` | `EXERCISES` (name → Garmin category/name/unit), `STRENGTH_TEMPLATES` (Lower body / Upper body / Empty, each exercise with `target` hint and first-time `seed`), `RUN_TEMPLATES`, `HYROX_TEMPLATE`, `activityOptions()` (Garmin type → logger kind) |
| `src/log/LogApp.jsx` | Screens: Home, Editor (per-kind forms), Settings; status pills; "last time" prefill |
| `src/log/store.js` | localStorage (`simaslog.v1`), send/queue/retry, dispatch (Worker default, GitHub fallback), live status fetch; `clean()` strips `ph`/`target` and makes numbers |
| `src/log/log.css` | Same tokens as the dashboard's `T` — colour means status |
| `log/index.html` | Second Vite page (`vite.config.js` `rollupOptions.input.log`) |
| `log-data.plugin.js` | Build-time `virtual:log-data`: activity types of the last 365 days with counts (from `CSV_DATA`), past tennis opponents (`Name🎾…` activity names), calendar tennis fixtures (`cal:true` SCHEDULE lines), last 80 `data/sessions` records. Rebuilt on every hourly bot deploy |
| `public/log/` | `manifest.webmanifest`, `sw.js` (network-first HTML, cache-first assets), icons |
| `public/_headers` | `/log/`, `/log/index.html`, `/log/sw.js` no-cache — keep them |

UX facts: weights/reps from the last session of the same exercise show as
**placeholders**; the ✓ button accepts them (one tap per set), typing overrides.
Time fields take `10:00` or `10.00` (iOS numeric keypad has no colon); a bare
number is minutes for erg/Hyrox and seconds for run reps. Decimal commas
("72,5") are fine. Drafts autosave; the run template defaults by weekday
(Tue speed, Thu easy, Sat long).

### Common changes

- **New exercise / fix a Garmin name** → `EXERCISES` in catalog.js. Verify the
  name first: dispatch `strength-sets.yml` with `find: "<terms>"` (see
  garmin-strength-sets). Unverified names still work (category-only fallback).
- **Change a workout template** → `STRENGTH_TEMPLATES` (`target` = plan text,
  `seed` = prefill until history exists). Run sessions → `RUN_TEMPLATES`;
  Friday stations → `HYROX_TEMPLATE`.
- **New activity kind** → touch all of: `activityOptions()` + a form component
  + `initSession()` + `summary()` in LogApp.jsx; `KIND_TYPES`/`ERG_TYPES`,
  `default_name()`, `description()` and the `ingest()` kind whitelist in
  match_sessions.py; the Worker needs nothing.
- **Session schema change** → keep `v: 1` readable (old files live in the repo
  forever); add fields, don't rename. Update this skill and `docs/logger.md`.

### Testing (all offline — never test against real Garmin)

- Matcher: `match_sessions.main(argv, gc_factory=Fake)` takes any object with
  `recent() / activity(aid) / sets(aid) / put_activity(aid, p) / put_sets(aid, sets)`.
  Stub `sys.modules['garth']` and `requests` (give `requests.get` a fake catalog)
  before importing. Run from a scratch dir — it writes `data/sessions/` relative
  to the cwd.
- App: `npm run build && npx vite preview --port 4173 --host 127.0.0.1`, then
  Playwright `chromium.launch()` with `devices['iPhone 13']`; `page.route`
  `https://api.github.com/**` and `https://auth.simas.fit/**` to capture the
  dispatch body instead of sending it. Feed the captured `inputs.session` into
  the matcher test — that's the real end-to-end check.
- Worker route: import `src/worker.js` in Node, stub `globalThis.fetch`, call
  `default.fetch(new Request('https://auth.simas.fit/log', …), env)`.
  Expected: no/wrong token 401 · empty body with good token 400 (the app's
  Test button reads that as "token accepted") · bad id 400 · save 200 queued.

## Gotchas

- **Don't send a real save to test.** A save with a valid session is a real
  Garmin write. Test the Worker with no token (→ 401) or `{}` (→ 400).
- Workflows must be on `main` to dispatch (simas-fit-update gotcha 19).
- `workflow_dispatch` inputs total ≤ 65,535 chars; the Worker refuses sessions
  > 60 KB. Fine for any real session.
- localStorage is per device and per browser: the home-screen app and Safari
  have separate stores. Sessions from other devices appear only via the
  build-time `data/sessions` list (refreshed on each hourly deploy).
- Two sends of one save used to happen (home screen's `flush()` re-sent an
  in-flight save); `store.js` has an `inflight` guard — keep it.
- The manual skills (garmin-strength-sets, garmin-tennis-log) write to the same
  activities. Before using them on a day he also logged in the app, check the
  activity's description for `#log v1` — if present, change the session
  (re-save or rematch) instead of overwriting by hand, or the next re-save will
  rebuild from the old snapshot and drop the manual edit.
- `update.yml`'s rebase-conflict path drops a run's commit; if that ever drops
  a session file's status, the next write snapshots the already-written
  activity (its description contains `#log v1`, so it isn't duplicated), but
  undo would then restore the logged version, not the watch original.

# Training logger — simas.fit/log

A home-screen web app for logging sessions while training. Each saved session
is written into the matching Garmin activity automatically.

```
iPhone (simas.fit/log, works offline — every keystroke saved on the phone)
  └─ Save → auth.simas.fit/log (LOG_TOKEN) → workflow_dispatch log-session.yml
            (fallback: direct dispatch with a fine-grained GitHub token)
       └─ match_sessions.py --ingest
            ├─ data/sessions/<id>.json   ← the full record (read this, Claude)
            └─ matching Garmin activity  ← sets / distance / name / description
  hourly update.yml → match_sessions.py --pending   (activity synced later)
```

## What goes where in Garmin

| Logged as | Garmin type matched | Written |
|---|---|---|
| Strength | strength_training | Sets tab (exercise, kg, reps), name `Lower body — Squat 70 · RDL 80 …`, description with every set |
| SkiErg | indoor_cardio | distance, name `SkiErg 2325m 10:00 · 2:09/500m`, pieces in description |
| Row | indoor_rowing | same as SkiErg |
| Run | running / treadmill / indoor / trail | name = session (`6×400m @ 5K pace`), rep times, shoes, fuel |
| Tennis | tennis_v2 | name `Opponent🎾6:4 3:6`, `+`/`-` lines (garmin-tennis-log format) |
| Hyrox stations | hyrox / indoor_cardio / hiit / other | name `Hyrox stations 4 rounds · 52:10`, station splits per round |
| Anything else | that type | description (notes, RPE) |

Every description ends with `#log v1 <id>` → `data/sessions/<id>.json`.

**Matching:** same type, the activity whose time overlaps the logged start→save
window (else the closest start within 4 h), never one another session already
claimed. Not found yet → `pending`, retried every sync; after 3 days `no_match`.

**Strength sets:** the logged sets, in order, relabel the watch's ACTIVE sets
(keeping its timing); extra logged sets are appended. Extra *watch* sets are
left alone and noted. Carries log metres as reps (his Garmin convention);
timed sets (sled push 70s) log the duration.

**Undo / re-save:** the activity's original name, description, distance and
sets are stored in `status.before` on first write. A re-save rewrites from that
snapshot (no stacking); "Undo Garmin write" restores it; "Wrong activity…"
undoes and re-applies to a given activity id.

## Setup (once)

1. Merge to `main` (workflows must be on main to dispatch).
2. Worker (`Simanauskas/garmin-auth-worker`, `/log` route): set the token and deploy
   from the Mac —
   `openssl rand -hex 32` → save it in the password manager →
   `npx wrangler secret put LOG_TOKEN` → `npx wrangler deploy --dry-run` → `npx wrangler deploy`.
   Deploy output must still list the cron, `env.TOKENS` and `auth.simas.fit (custom domain)`.
3. Logger ⚙︎ Settings → auth.simas.fit → paste LOG_TOKEN → Test ("token accepted").
4. Safari → simas.fit/log → Share → Add to Home Screen.

Fallback if the Worker is down: Settings → GitHub, with a fine-grained token
(repo `Simanauskas/dashboard` only; Actions read/write, Contents read).

## Session file (v1)

```json
{ "v": 1, "id": "2026-11-03-1712-strength", "kind": "strength",
  "activity": "Strength training", "template": "Lower body",
  "start": "2026-11-03T17:12:00+02:00", "end": "2026-11-03T18:01:00+02:00",
  "rpe": 7, "notes": "", "title": "",
  "exercises": [{ "name": "Back squat", "cat": "SQUAT", "gname": "BARBELL_BACK_SQUAT",
                  "unit": "reps", "sets": [{ "kg": 70, "n": 6 }] }],
  "status": { "state": "applied", "garmin_id": "…", "before": { … } } }
```
Other kinds carry `erg {machine, pieces[{m,sec,spm}], damper, rest_sec}`,
`run {plan, reps[sec], shoes, fuel}`, `tennis {opponent, mode, score, plus[], minus[]}`,
`hyrox {stations[], rounds[[sec]], total_sec}`.

Local tests: `match_sessions.main(argv, gc_factory=Fake)` takes any object with
`recent/activity/sets/put_activity/put_sets`, so the whole flow runs offline.

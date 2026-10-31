---
name: garmin-tennis-log
description: Log Simas Simanauskas's tennis session into Garmin Connect — set the activity name (opponent🎾score) and a +/- description of what went well and what didn't, via the rename-activity.yml GitHub Actions workflow in Simanauskas/dashboard. Use whenever he says how a tennis session/match/sparring/training went ("played Rokas today, lost 4:6 6:3…", "update my tennis activity", "log today's tennis", "my forehand was good, serve bad"), even if he doesn't mention Garmin. Finds the opponent from his Google Calendar. Not for booking courts (tennis-court-booking-to-calendar), strength sets (garmin-strength-sets) or coaching (simas-hyrox).
---

# Garmin tennis log

Simas tells you how a session went; you name the Garmin tennis activity and
write the description, then confirm it read back. Just do it — ask only if the
opponent or the score is genuinely unclear.

## How it works

Garmin tokens only exist inside GitHub Actions, so every Garmin call runs there:
repo `Simanauskas/dashboard`, workflow **`rename-activity.yml`** (ref `main`),
script `rename_activity.py`. Dispatch with GitHub MCP `actions_run_trigger`
(`method: run_workflow`), then `actions_list` → `list_workflow_runs`
(resource_id `rename-activity.yml`, perPage 1) → `list_workflow_jobs` →
`get_job_logs` (`return_content: true`, `tail_lines` ~80). A run takes ~15 s;
wait ~45 s before looking (in Claude Code a Bash `until` loop on the clock —
plain `sleep` is blocked). No GitHub tool in the session → give him the inputs
to paste into Actions → Rename Garmin Activity → Run workflow.

Inputs (all strings): `activity_id`, `name`, `description`, `date`
(YYYY-MM-DD), `type` (typeKey — tennis is **`tennis_v2`**), `list` (N),
`apply` (`"true"` writes; anything else is a dry run).

## Steps

1. **Opponent** — Google Calendar `list_events` for the session day (default
   today, Europe/Vilnius). His tennis events are titled like
   `Rokas Mačiulaitis🎾2` (the trailing number is a court/booking detail, not
   part of the name) with the venue as location. If he names the person himself,
   that wins. No event and no name → ask.
2. **Find the activity + see recent style** — dispatch with
   `list: "10"`, `type: "tennis_v2"`. Read-only; prints id, start, name and full
   description of each. Pick the one on the session day (match start time to
   the calendar slot — he usually starts warming up ~30 min early). Several
   that day → match by time, or ask. None → not synced from the watch yet; tell
   him. Previous sessions vs the same opponent are useful context.
3. **Dry run** — `activity_id`, `name`, `description`, `apply: "false"`. The
   log prints old and new name/description in full; check them.
4. **Apply** — identical inputs + `apply: "true"`. Success is `✓ name is …`
   plus `✓ description written`. Any `✗` → report it, don't retry blindly.
5. **Report** the name and description you wrote.

## Name format (from his own logs)

`<Full name>🎾<score or session type>` — no space before the emoji, sets
separated by spaces, games with `:`. A match tiebreak is written as its own
"set" (`10:6`); a set tiebreak in brackets (`7:6(2)`). His score first.

| Session | Name |
|---|---|
| Match | `Rokas Mačiulaitis🎾 0:6 5:7` · `Laurynas Sederevičius🎾7:5 4:6 10:6` |
| Sparring, no score | `Vainius Sodeika🎾sparring` |
| Sparring + a set + tiebreaks | `Rokas Mačiulaitis🎾sparring 6:6 7:10 10:8` |
| Coach / group training | `Tennis training` (or `Training🎾1:1`) |

## Description format

Short lines, one point each, prefixed `+` (went well), `-` (didn't), `+-`
(mixed). Shorthand: `fh` forehand, `bh` backhand. Keep his wording, compress
it; no sentences or headings. Write in English unless he writes in Lithuanian
(older notes are Lithuanian: dešinė = fh, kairė = bh, servas = serve).

```
+fh good at the start (before sets) and at the end
-fh lost it in the middle, focused on winning points instead of hitting the ball
-serve toss, talk to coach
-bh falling short
```

## Changing this skill or its script

Simas has authorised pushing changes to this skill, `rename_activity.py` and
`rename-activity.yml` straight to `main` (rebase onto `origin/main`, then
fast-forward push — the bot commits hourly). They must be on `main` anyway:
skills load from it, and the workflow is dispatched with ref `main`.

## Gotchas

- His dictated scores can come out garbled ("we played 2-1-1-1-1" meant "we
  played tie-breaks"). If a number doesn't parse as a score, ask rather than
  guess.

- `update.py` reads names from Garmin; never edit `src/App.jsx` for this —
  the next sync would overwrite it anyway.
- A green run is not proof; only the `✓` read-back lines are.
- Don't key anything on the old name — the watch default is just `Tennis`.

# Keeping the dashboard current

Two things have to stay fresh for the dashboard to be worth opening on a phone:
the **data** (what Garmin knows) and the **plan** (what to do about it). They are
kept fresh by different machinery, and conflating them is how this gets built
wrong.

| | Freshness | Mechanism |
|---|---|---|
| Wellness, activities, splits | up to ten minutes | Cloudflare cron → `workflow_dispatch` → `update.py` |
| Today's prescription, week budget | every page load | `adaptPlan()` in `src/App.jsx` |
| The written block itself | when a human or a scheduled session edits it | `SCHEDULE` / `TAPER_PLAN` |

## 1. The adaptive plan engine

`adaptPlan()` in `src/App.jsx` is a **pure function of the synced data**,
evaluated on every render. That is the whole design: there is no second
pipeline to keep alive, no cached plan to go stale, and no window in which the
dashboard shows a prescription that contradicts what was actually trained.
An unplanned session changes the rest of the week the moment the sync picks it
up — including while the page is open, on the next load.

`SCHEDULE` stays the hand-authored *intent* and is never rewritten from here.
Adaptations are an overlay carrying their own reason, so the block stays
readable and diffable and an adjustment can always be audited back to the
number that caused it.

### What it decides

- **Reconciliation.** Every planned line is matched against what was logged
  that day: `done`, `missed`, or still `planned`. Anything logged that no line
  asked for is surfaced as unplanned load.
- **Week load budget.** Banked TRIMP against the `TAPER_PLAN` band for the
  week, plus a projection of where the week lands if the rest of it is trained
  as written.
- **Volume governor.** When the projection overshoots the band's ceiling, the
  remaining sessions are trimmed — durations rewritten in place, optional
  sessions dropped first — until the week lands inside it, floored at −40% so
  no single signal can erase a session. When the projection undershoots the
  floor *and* readiness is 7+, volume goes up instead.
- **Readiness gate.** Readiness ≤3, HRV 10ms+ under baseline, under six hours
  of sleep, or three hard days back to back caps today's and tomorrow's
  intensity at Z2. This overrides the governor: a suppressed morning caps the
  day regardless of what the week's arithmetic wants.
- **Rest-day guard.** Nine days without a rest day while form is under −15
  converts the next already-light day into recovery.

Only the **current week** is steered. Beyond that the block is shown as
authored, because the physiology in view is too old to prescribe a month out.
Re-planning further ahead is a coaching decision, not an arithmetic one.

### Costing a planned session

A line's load is estimated from the duration it names (`35min`, `20–30min`,
`1h15`) and the intensity its wording implies, priced through the same `calcTRIMP`
the real activities use. Where a line names no duration, the median duration
and HR for that session type over his last 90 days stands in, so the estimate
tracks him rather than a constant.

Two traps worth knowing about:

- **A line can be a reminder, not a session.** "Debrief: roxzone drills are the
  next block's headline — see RACE → what Athens says" names no duration and
  asks for no work, but it mentions a station, so the matchers claimed it and it
  was costing 63 TRIMP of imaginary training — enough on its own to push the
  week over its ceiling and trim a real session. Mark such a line `note: true`
  in `SCHEDULE`. `isInfoLine()` also catches unmarked ones, but narrowly; the
  explicit flag is the reliable path.
- **A line can offer a choice.** "Tennis or full rest — your call" is costed at
  half, because over a block that is what it averages to.

### Adding a rule

Put it in `adaptPlan()`, give it a `note(date, label, why, kind)` call, and make
`why` quote the numbers that fired it. An adjustment the athlete cannot audit is
one he will ignore, and the plan-adjustments panel exists for exactly that.

## 2. Sync latency — `poll` mode

`update.py --mode poll` is a cheap, silent check for anything new. It makes the
same single `get_activities()` call as `activities` mode (Garmin returns the
last 30 activities regardless of the window, so widening it is free) but it
**writes nothing, `LAST_RUN` included, unless the file actually changed**.

That exemption is what makes the cadence affordable. Every hourly run produces
a commit precisely because `LAST_RUN` is always rewritten; at a ten-minute
cadence that would otherwise be 144 commits a day, each one a Pages deploy.
In practice it holds: roughly 144 runs a day produce about 24 commits, of
which only two to four are polls that actually found something.

### The live schedule

One cron in `wrangler.toml`, with the mode chosen by the minute it fires on:

```toml
crons = ["7,10,20,30,40,50 * * * *"]
```

`:07` refreshes OAuth2 and dispatches `full` (05–09 UTC) or `activities`.
The other five ticks are refresh-free polls — refreshing on every one would be
144 token exchanges a day against Garmin for a token good for ~27h. Keep
`SYNC_MINUTE` in `src/worker.js` at 7 to match.

**Data freshness is up to ten minutes.** The adaptive plan re-derives on every
page load, so the plan is never stale relative to the data either.

### Correction: the hourly cap recorded here was wrong

An earlier version of this file stated, at length and with a table, that
Cloudflare would not invoke this Worker's cron more than once an hour, and
told the reader not to try. **That is false.** All six minutes fire. Measured
over the last 100 dispatches:

| Cron minute | Dispatches |
|---|---|
| `:07` | 17 |
| `:10` | 16 |
| `:20` | 16 |
| `:30` | 16 |
| `:40` | 17 |
| `:50` | 17 |

The original finding came from a two-hour window on 11 Sep 2026 in which the
sub-hourly ticks genuinely never fired, across three different cron shapes,
confirmed by `wrangler tail`. Whatever that was — new-schedule propagation
taking far longer than expected, or a transient on Cloudflare's side — it
resolved on its own. `mode=poll` commits appear from 21 Sep onward.

The lesson worth keeping: a negative result from a single session is a
snapshot, not a property. This file asserted a platform limit from two hours
of evidence and would have stopped anyone from re-testing it.

### If the poll ever needs turning down

Cut the minute list. `["7,25,45 * * * *"]` is a third of the run volume and
still twenty-minute freshness; `["7 * * * *"]` is the original hourly. Nothing
else needs changing — `SYNC_MINUTE` stays 7 and `poll` mode is unaffected.

### The non-cron alternative

The Worker exposes `POST /refresh` taking `{"mode":"poll"}`, so an external
scheduler can drive it without any cron at all. Before relying on that —
**the endpoint is unauthenticated**. It is already publicly reachable, because
the dashboard's Refresh button calls it straight from the browser, but
pointing a public scheduler at it deserves a shared secret first.

### When jobs fail before any step runs

A run that fails in ~4 seconds with **zero steps and a 404 on its logs** never
reached a runner, so nothing in this repo caused it. Read the annotation
rather than guessing:

```
GET /repos/Simanauskas/dashboard/check-runs/<job_id>/annotations
```

On 25 Sep 2026 that returned "The job was not started because recent account
payments have failed or your spending limit needs to be increased", which is
an account-level GitHub billing block and is fixed only in GitHub Settings →
Billing & plans. Every run from 20:30 UTC on 24 Sep failed this way. Note that
this repo is public, so standard-runner minutes are free and the poll cadence
is not billable — the cause was elsewhere in the account.

# Keeping the dashboard current

Two things have to stay fresh for the dashboard to be worth opening on a phone:
the **data** (what Garmin knows) and the **plan** (what to do about it). They are
kept fresh by different machinery, and conflating them is how this gets built
wrong.

| | Freshness | Mechanism |
|---|---|---|
| Wellness, activities, splits | up to one hour, minutes with polling | Cloudflare cron → `workflow_dispatch` → `update.py` |
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

That exemption is the point. Every hourly run produces a commit precisely
because `LAST_RUN` is always rewritten; at a ten-minute cadence that would be
144 empty commits a day, each one a Cloudflare Pages deploy. The hourly
`full`/`activities` runs stay the proof-of-life the dashboard's sync dot reads.

To actually get minute-level freshness, the **Cloudflare Worker** has to dispatch
it — scheduling lives there, not in GitHub Actions. In `wrangler.toml`:

```toml
[triggers]
crons = ["7 * * * *", "*/10 * * * *"]
```

and in the Worker's `scheduled()` handler, pick the mode from the cron that
fired, keeping the existing hourly behaviour intact:

```js
const mode = event.cron === "*/10 * * * *"
  ? "poll"
  : (new Date().getUTCHours() >= 5 && new Date().getUTCHours() <= 9 ? "full" : "activities");
```

The Worker lives in `Simanauskas/garmin-auth-worker` and is deployed from the
Mac with `npx wrangler deploy`. Answer **n** to any config-diff prompt and add
the missing settings to `wrangler.toml` first — a deploy overwrites remote with
local, and the `auth.simas.fit` custom domain is not in local config.

The OAuth2 refresh still runs once an hour, not per poll. It has to: the ten
minute cron reuses whatever token the hourly refresh minted.

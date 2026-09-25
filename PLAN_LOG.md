# Plan decision log

One entry per firing of the daily re-plan Routine, newest first. **Append
only** — never rewrite or prune an old entry.

This file exists because the Routine is a cold session every morning with no
memory of the one before. Between 12 and 25 Sep 2026 it fired fourteen times,
succeeded every time, and changed nothing every time. That was not a bug: on
any single morning the written plan looked reasonable, and it had been told to
be conservative. The case for acting only existed in the pattern across days,
and no individual run could see it.

So each run now reads this file first and writes to it last, whether or not it
changed the plan. A run that declines to act can see how many times it has
already declined.

**Format.** Keep it mechanical so it stays skimmable at fifty entries:

```
## YYYY-MM-DD
- adherence: <the one-line verdicts from `python3 adherence.py`>
- readiness: HRV <n> vs baseline <n>, RHR <n>, form <n>
- decision: CHANGED <what> | NO CHANGE
- why: <one sentence, quoting the number that drove it>
- watching: <anything deliberately left alone, and what would make it act>
```

Run `python3 adherence.py --days 21` before deciding. It prints planned
versus actually-trained per session type, names benchmarks already due and
those landing in the next 14 days, and flags anything prescribed repeatedly
and never once done.

---

## 2026-09-25 (b)
- adherence: unchanged from entry (a); tennis now reads 7/7 on history only
- readiness: not re-read; this entry records a plan-structure change, not a
  daily decision
- decision: CHANGED — removed all 12 prescribed tennis sessions from 26 Sep
  onward, and reworded one line that assumed tennis later the same day
- why: he plays tournaments and sparring arranged with other people, usually
  confirmed only a few days ahead. The fixed Tue-AM / Thu-PM / one-of-Sat-Sun
  slot was fiction. A plan that prescribes a session he cannot commit to
  teaches him to ignore the plan.
- watching: **the prospective calendar path is NOT built.** He asked for a
  daily scan of his calendar that writes confirmed fixtures into SCHEDULE as
  `{type:"tennis",cal:true,text:"..."}` BEFORE they happen. Two things block
  it, and neither is code:
    1. No Google Calendar connector on the account. Connect at
       https://claude.ai/customize/connectors — connectors are read when a
       session starts, so a new session is needed after connecting.
    2. Even then, this Routine's fired sessions carry NO connectors. A
       Routine created through the API only inherits connectors the creating
       session itself holds. It will need recreating from a session that has
       Calendar, or creating through the claude.ai Routines UI.
  Naming convention to match when it is built, from the athlete:
    `Edvinas🎾`              → session with his trainer
    `Name Surname🎾<court>`  → match or sparring
  Until then tennis reaches the dashboard retrospectively only: Garmin syncs
  it, adaptPlan() surfaces it as unplanned load, its TRIMP lands in the week
  budget, and the remaining sessions are trimmed to absorb it. That path
  works and needs nothing.

---

## 2026-09-25
- adherence: ski 2x prescribed / 0 done · everything else on track
- readiness: HRV 90 vs baseline 72, RHR 39, hrvBaseline down from 91 on 11 Sep
- decision: NO CHANGE — entry written by hand while rebuilding the Routine,
  not by a Routine run
- why: this is the baseline entry; the fourteen runs before it left no record,
  which is the gap this file closes
- watching: ski, never once trained since the block opened on 14 Sep, with a
  1000m ski TT due Mon 28 Sep that the plan text already calls "deferred
  twice". Also HRV 39 / RHR 56 on 19 Sep against a normal RHR of 38–42, which
  looks like illness and nothing in the plan acknowledged it.

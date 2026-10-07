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

## 2026-10-07
- adherence: no ACTION REQUIRED and no WATCH. ski **5/2** · strength **6/3** · hyrox 4/3 ·
  row 1x/0 · swim 1x/0 · cycle 2/5 · tennis 7/7 · run 9/8. Table byte-identical to
  yesterday's except hyrox 3/3 → **4/3** (today's circle is newly in window, not a miss).
  **Benchmarks already due: 28 Sep and 2 Oct NOTHING LOGGED** (dead structure, addressed by
  the 3 and 4 Oct restructures), **30 Sep logged**, and **6 Oct — which yesterday's addendum
  called out as a false positive, and it was.** `adherence.py` now reports it as
  `TRAINED EASY INSTEAD · Running Z2 10km` against a prescribed `threshold 5×1km @ 4:06`
  (see the tooling note below). Next 14d: **Thu 8 Oct**, **Wed 14 Oct** (new, mine) and
  **Thu 15 Oct**. Nothing in the fortnight sits on a day he does not train.
- readiness: HRV **56 vs baseline 69** (delta **−13**), RHR **44**, respiration 12.0,
  SpO₂ 93, **7h25 asleep** — written out: seven and a half hours, 121 of deep, 64 of REM,
  11 awake — sleep score null. LAST_DATA **2026-10-07T06:08Z**, minutes old, sync healthy.
  `hrvBaseline` 75 → **69**.
- decision: CHANGED — **the KEY RUN moves off Tuesday evening to Wednesday late morning in
  weeks 6 and 7, and its rep count resets to the session 6 Oct never took.** Plus one clause
  on Thu 8 Oct protecting the roxzone measurement from the engine, and the placement rule
  written into the Base I note as block policy. Week 5's costed load is **unchanged to the
  decimal** — all six probed properties on 8 Oct identical, and the week still projects 878
  with the governor still at 0.60.
- why: **his own timestamps say the evening cannot hold a measured session, and nobody had
  looked at them.** Every structured run he has logged since 3 Aug started between **08:52
  and 13:43** — 6×1500 on 5 Aug (08:52), 8×600 with jumps on 13 Aug (13:43), 16×400 on
  27 Aug (09:02), 3×2km on 25 Sep (10:09), 8×1km at 4:01 on 1 Oct (13:05). Every standalone
  run after 18:00 in the same stretch — **all ten of them** — came back Z2 or easier, and
  **four of those ten were Tuesdays** (11 Aug, 15 Sep, 22 Sep, 6 Oct). n=15, zero
  exceptions. The 6 Oct KEY RUN was prescribed for the evening and came back as a 10km at
  an average of 138 at 18:52, which is not a refusal — it is the fifteenth data point in the
  same direction. So Tuesday evening now gets the Z2 run it reliably delivers and the
  measurement goes where measurements actually happen.
- why Wednesday specifically: it hosted two of the five (5 Aug, and the 16 Sep compromised
  session), **25 Sep proves the shape** — tempo at 10:09, group class at 18:32, same day —
  and the daytime is reliably free because the class is evening-only and has landed on a
  Wednesday once in five outings. Tue 13 Oct's daytime is taken by a calendar-confirmed
  court session at 10:00, so Tuesday could not host it even if the slot worked. Thursday was
  the other candidate and is his single best quality day (1 Oct's 8×1km was a Thursday,
  8/9 attended) but it holds the roxzone circuit, whose eight transition times are meant to
  be compared week on week — bolting them onto a threshold set one week and an easy Z2 run
  the next destroys the comparison. So Thursday stays as it is.
- why the reps went **down**: 14 Oct is **5×1km @ 4:06 off 90s**, not the 6×1km off 75s the
  plan had reached. That progression was written on 3 Oct assuming its first rung got taken.
  It did not. Buying a sixth rep and 15s of recovery off a session that never happened is the
  same error corrected on the Monday erg a week ago — sub-4:03 asked off an afternoon that
  averaged 4:15 — and this file exists because an unreachable number is how a session stops
  happening. 21 Oct therefore takes the step 13 Oct was going to take (6×1km @ 4:06 off 75s)
  instead of 6×1km @ 4:04 off 60s; 4:04/60s comes only once 4:06 has been held to the last
  rep at least once.
- **the control reading is now marked as one.** Yesterday's addendum recorded that Monday's
  finding — erg 4:02/4:19/4:24 against treadmill kilometres 4:08/4:00/4:00, so the fade is in
  the pull and not the engine — stands on a single session, and that the next chance to
  falsify it was 13 Oct. Nothing in the plan said so: 13 Oct carried no ⏱, so neither
  `adherence.py`'s benchmark list nor a cold session could see that it mattered. **14 Oct
  carries ⏱ now** and appears in the forward benchmark list.
- physiology — **nothing new is wrong, and the baseline is now the thing worth watching.**
  HRV 56 against 69 is −13, which fires `adaptPlan`'s readiness gate (`hrvDelta <= -10`), but
  in absolute terms this is an **improvement** on yesterday: HRV 52 → 56 while the baseline
  fell 75 → 69. RHR **44 is inside his 38–46 range**, respiration 12.0 flat, and the 2–3 Oct
  excursion signature (RHR 54 then 62, zero REM on two consecutive nights) is absent. REM at
  64 sits almost exactly on his 25th percentile for the last 60 days (p25 = 65, median 90)
  and 16 of those 60 nights came in under 70, so the 145 → 141 → 114 → 64 slide is reversion
  from an unusually good recovery stretch, not a warning. Yesterday predicted "low again
  tomorrow; judge the week on Thursday" and that is exactly what arrived.
  **On the baseline, which is the one signal I would not dismiss: 91 → 88 → 79 → 83 → 75 →
  69.** Roughly half of that is instrument — it is Garmin's own `weeklyAvg` absorbing 43, 52
  and 56 — but **half is real.** His trailing 7-day raw HRV mean is **73.3**, against **85.3**
  for 24–30 Sep and **86.1** for 17–23 Sep. Strip the illness day (43) and it is still 78.
  Mid-September gave him 101, 105, 117, 118, 122, 129; October has produced one reading over
  100 in seven days. That is a genuine 12–14 point downward shift in the raw signal, with a
  load explanation behind it: ATL **59.0** against CTL **51.8**, form **−7.2**, and week 5
  already at **264 TRIMP after two days** against a 350 floor. This is what a base block is
  supposed to look like and it does not change today's session. What it does mean: **do not
  read small deltas off this baseline yet** — it has fallen 6 points in a day for the second
  day running, and against yesterday's 75 today's HRV would have read −19 rather than −13.
  Judge it again when it stops moving.
- **the roxzone measurement was about to be quietly eased out of existence.** HRV −13 trips
  `easeHard`, which applies to today and tomorrow and whose instruction is "Hold it at Z2 —
  drop the intervals, **the timing** and the max efforts." Tomorrow's session is `⏱ Roxzone
  circuit`, intensity-classified 168 by the ⏱ itself, and dropping its timing deletes the
  first roxzone baseline he has ever taken. On top of that the week projects **878 TRIMP
  against a 460 ceiling**, so the volume governor is pinned at **scale 0.60**, its maximum
  cut, which rewrites "15min" to "10min". Both rules are right about the effort and wrong
  about this session: what is measured is eight transition times, and 0:36 for 100m is
  six-minute-kilometre jogging, not a maximal effort. The line now says to take the stations
  controlled, keep all eight transitions and keep the clock. **This changed no duration, no
  intensity and no day** — all six probed properties on 8 Oct are identical before and after,
  which is why I was willing to touch a week he is partway through at all.
- **a defect I am NOT fixing, and it is the largest one in the engine right now.**
  `isTennis` (src/App.jsx:1115) tests `Activity Type === "tennis"`. **60 of his 69 tennis
  rows are typed `Tennis V2`** and only 9 are `Tennis`, so it is false for nearly every
  tennis session he has ever logged. Three consequences, all live:
  1. `loadModel().tennis` can never learn from history and falls back forever to **138 bpm /
     75min**, costing a planned tennis session **100.9 TRIMP** when his real median across
     32 sessions is **39.0** — a **2.6× over-cost**. Week 5 plans three of them: **303
     projected against ~117 real.**
  2. `sessionSatisfiedBy` has a tennis branch that can never match, so **every planned
     tennis day reads "missed"** on the week board once it is past, however much he played.
  3. `getColor`/`getEmoji` fall through to `other`, so tennis draws grey ⚡ instead of 🎾.
  The whole estimator is biased the same way, tennis just worst: circle **1.5×** (89.2 vs
  61.5 real), KEY RUN **1.5×** (127.9 vs 87.6), long run **1.3×**, Z2 run **1.2×**. That is
  why every week in the plan projects **626–878** against a 350–460 band while his delivered
  weeks run **446 / 357 / 327** — and why the governor is not governing, it is applying a
  permanent 40% haircut at its floor. `isTennis` and `loadModel` sit outside the edit surface
  this Routine is given (SCHEDULE / TAPER_PLAN / RACE / targets), so I have not touched them;
  same call yesterday made on `calcTRIMP`. **One-word fix: make it a regex, `/^tennis/`.**
- **and a defect I did fix, in the Routine's own mandatory input.** Yesterday's addendum found
  that `adherence.py`'s benchmark check tested only `date in done_on` — whether *any* activity
  existed that day — and asked for it to be fixed here rather than remembered. It now resolves
  the benchmark line to its session types, matches them against the logged activities, and
  **prints the titles**: `NOTHING LOGGED` / `TRAINED OTHER TYPE` / `TRAINED EASY INSTEAD` /
  `type match — CHECK IT`. The 6 Oct false positive is gone (`TRAINED EASY INSTEAD · Running
  Z2 10km`) and 30 Sep still reads correctly off its SkiErg TT title. It never claims more
  than it knows — a Garmin title need not say "threshold" — so the titles print either way.
- what I deliberately did NOT touch:
  - **Week 5's structure and load.** The only week-5 edit adds no cost and moves nothing. HRV
    is suppressed but not alarming, RHR is in range, and nothing here is a physiological
    reason to rewrite a week he is three days into.
  - **Today's own line.** Court session at 12:00, class in the evening, take the ski option.
    I had the readiness note half-written and dropped it: yesterday already said "expect it
    low again tomorrow, judge the week on Thursday", that is precisely what happened, and a
    line restating it is noise on the day he most needs the plan to be short.
  - **Thu 8 Oct's placement.** Moved on 4 Oct, still untested, gets its first attempt
    tomorrow. Third relocation before a first attempt would be churn, and I had a real
    candidate reason (Thursday is his best quality day) and still did not take it.
  - **TAPER_PLAN bands.** Base I 350–460 stands. The projections are 626–878 but that is the
    estimator, not him: his actual weeks are 446/357/327 and the band brackets them well.
    Raising a band to match a 1.2–2.6× biased estimator would let real load drift up on a
    defect. **The 4 Oct trigger is still live and resolves Sunday**: week 5 is at 264 after
    two days and will clear 350 by Thursday, so it will almost certainly not fire.
  - **The phase.** Base I · Aerobic is right. What moved is when one session happens, not
    what the block is doing.
  - **STATION_TARGETS / RACE_BUDGET / RACE_GAINS and the weakness ranking.** Nothing has been
    trained since yesterday's run — he played tennis and ran a Z2 10km — so no target could
    have moved. Ski erg still the weakest element (top 29.8%), running still the weakest block
    (top 27.7%).
- watching:
  - **ski 5/2 — and it is now down to ONE exposure a week, both of them Mondays.** Three of
    the five prescriptions are dead structure ageing out 14–19 Oct; on live structure he is
    **2-for-2** (30 Sep 3:57, 5 Oct 4:02/4:19/4:24). But the forward count is the thing:
    **12 Oct and 19 Oct are the only ski prescriptions in the next 18 days**, both inside the
    Monday gym trip, because the only other erg opportunity is the Wednesday class note and
    that is `note:true` and conditional. One weekly exposure to the #1 priority, wholly
    dependent on one trip existing. I did not add a second: a standalone erg trip has gone
    **0-for-4**, the block's hard-won rule is that every erg exposure bolts onto a session he
    already attends, and the only attended gym days are Monday and class night. Yesterday's
    trigger stands unchanged — **if 12 Oct logs no ski, the erg moves out of the gym trip and
    into a running session as a pre-run piece.** If 12 Oct *does* log ski, the question I want
    answered next is whether a second short erg piece can ride the end of that same Monday
    hour rather than needing a day of its own.
  - **the Wednesday class as a host, which has quietly gone 0-for-2.** It was prescribed
    23 Sep and 30 Sep and ran neither day — it ran Sun 20 Sep and Fri 25 Sep instead. Today is
    the third Wednesday prescription. The roxzone circuit was moved off this host on 4 Oct for
    exactly this reason; the ski note was left behind on it. It costs nothing when the class
    does not run, so it is not a miss — but it is also not an exposure. **What would make me
    act: if today's class does not run on a Wednesday either, 0-for-3, the ski instruction
    stops hanging off it and the Monday erg becomes the only place it is written** — which
    makes the 12 Oct trigger above the whole of the ski plan, and I would rather know that
    explicitly than discover it.
  - **row 1x/0 and swim 1x/0**, both under the WATCH threshold, neither prescribed forward.
    Swim ages out 13 Oct, row 19 Oct. Row stays out deliberately: at top 11.4% it is a
    strength to defend, not to train.
  - **the baseline.** If `hrvBaseline` is still falling on 9 Oct with RHR drifting above 46,
    that stops being load and becomes a reason to cut week 6 before it starts. RHR has gone
    40 → 40 → 43 → 44 in four days; 46 is the line.
- verification: `npm run build` clean (**441.27 kB**, from 437.14 — plan text only, all six
  edits are strings on single lines; 6 insertions / 6 deletions in src/App.jsx). **11/11**
  patch anchors. SCHEDULE still parses as **50 days**, TAPER_PLAN as **18 blocks**.
  HEALTH_DATA `daily`/`sleep`/`weight`/`vo2max`/`nutrition`/`body`, CSV_DATA, HYROX_DATA,
  TODAY, LAST_RUN, LAST_DATA and hrvBaseline all **byte-identical** to HEAD. Every touched
  SCHEDULE line probed on six properties before and after (duration, intensity, info, optional,
  estTrimp, adherence types, benchmark flag): **8 Oct identical on all seven**, 13 Oct
  228.8 → 154.7, 14 Oct +127.9 with `bench=1`, 20 Oct 127.9 → 60.5, 21 Oct +127.9 — and
  **no phantom prescriptions**: the new lines resolve to `['run']` only, with no `ski`,
  `strength`, `tennis`, `row` or `swim` added anywhere. Week 5's governor arithmetic is
  identical before and after (done 264.0, remaining 614.1, projected 878, f=0.319, scale 0.60).
  `update.patch()` round-tripped against a copy of the real src/App.jsx — **33/33** — and
  against pristine HEAD as a control, where the only failures were the **8** assertions
  looking for my own edits and all **25** sync assertions passed identically. Wellness rows
  patch and keep their **4-space indent**, no rows lost, dates unique and sorted, weight
  upserts inside its own array with vo2max byte-identical, CSV upserts exactly once at 44
  columns, TODAY advances to date+1, and SCHEDULE / TAPER_PLAN / RACE / RACE_BUDGET /
  RACE_GAINS / STATION_TARGETS / HYROX_DATA / hrvBaseline all survive byte-identical.
  `adherence.py --days 21` re-run: the adherence table is unchanged except hyrox 3/3 → 4/3
  from today entering the window, and the benchmark block now carries titles.
  **Two traps the probe caught in my own draft before commit.** "came back Z2 or Z1" put a
  standalone *or* in a plan line, which `isOptionalLine` matches case-insensitively via
  `\bOR\b` — it would have halved that session's cost and made it eligible for the
  governor's outright *drop* branch. Rewritten to "and nothing harder". And the 13 Oct text's
  em dash between "13:43" and "6×1500" was close enough to `(\d+)\s*[–—-]\s*(\d+)\s*min` to
  be worth testing rather than eyeballing; it does not match, confirmed, and the line costs
  the 40min it says. Reverted the package-lock.json churn `npm install` introduced.
- consecutive no-change runs before this one: **0** (6 Oct CHANGED, 5 Oct CHANGED, 4 Oct
  CHANGED, 3 Oct CHANGED).

## 2026-10-06 · addendum (evening) — the multi-sport TRIMP defect is FIXED
Not a re-plan. Written the same day as the entry below, after the user asked for the
defect in it to be fixed, and appended rather than folded into that entry so nothing
above is rewritten. **Read this before acting on the "what I deliberately did NOT
touch" and "watching" items in the 2026-10-06 entry — two of them are now stale.**

- what changed in the machine: `fetch_activities()` in `update.py` now fills in a
  missing average HR before the CSV row and the per-activity summaries are built, so
  CSV_DATA, HYROX_DATA and everything derived from them agree. `derive_avg_hr()` tries
  the activity detail summary, then its child activities weighted by duration (the
  multi-sport case), then its laps. Gated on "has a max HR but no average", which is
  exactly the multi-sport parent signature and matched **one row in his entire
  history**; anything genuinely HR-less (a sauna, a skydive) has neither figure and is
  skipped without an API call. On total failure it leaves '--' exactly as before and
  prints a loud WARNING naming the session that will count as zero.
- it landed and the number is real: the 5 Oct double now reads **avg HR 159** (max 175),
  derived by Garmin's own detail summary and upserted in place by the normal sync
  (`4fb4259`, mode=activities). **No rows with the broken signature remain.**
- **the numbers this morning's entry was wrong about.** 5 Oct goes from **53.9 → 114.0
  TRIMP**, and the session itself from **0.0 → 60.0**. So:
  - **The instruction "do not move the Base I floor off any week containing a Multi
    Sport activity" is RETIRED.** It was correct while the defect existed and is now
    obsolete. Multi-sport days are costed properly from here.
  - **Week 5 (5–11 Oct) stands at 264 TRIMP after two days**, against the 350 floor,
    with five days still to come. The 4 Oct trigger — *if 5–11 Oct also finishes under
    350 with no physiological explanation, drop the floor to 320* — is now very unlikely
    to fire, and for the right reason: the week was never as empty as the dashboard said.
  - **ATL/CTL/form and `adaptPlan`'s week governor were reading an understated week and
    are now correct.** Anything either of them did on 5–6 Oct was decided on ~47% of
    Monday.
- a side benefit worth keeping: **159 bpm settles what Monday actually cost.** His 1 Oct
  8×1km tempo averaged 151, the 25 Sep 3×2km tempo 141, the 30 Sep ski TT 136. At 159 —
  the bottom of CPET zone D once the +10 running adjustment is applied — the compromised
  double was indeed his hardest session in three weeks, which this morning's 6 Oct plan
  line asserted off max HR alone. The claim holds; it is now measured rather than inferred.
- **tonight did NOT happen as written, and tomorrow must not be fooled.** The 6 Oct
  prescription was `⏱ KEY RUN · threshold 5×1km @ 4:06, 90s jog`, and this morning's entry
  made it the control for whether Monday's erg fade is local or systemic. He logged
  **"Z2 10km", 52min, avg HR 138** instead — an easy aerobic run, on a morning his HRV was
  23 below baseline. That is sound autoregulation and not a refusal, and the day still
  carries 150 TRIMP across it plus 140min of tennis. But two consequences:
  - **The control reading is still outstanding.** Monday's finding stands on one session:
    erg 4:02/4:19/4:24 against runs 4:08/4:00/4:00. Nothing tonight tested whether a flat
    threshold set holds 4:06 to rep 5. The next chance is **Tue 13 Oct's 6×1km @ 4:06**,
    and the 12 Oct Monday rewrite goes ahead on Monday's evidence alone until then.
  - **`adherence.py` will report "2026-10-06 something logged" for that benchmark, and
    that is a false positive.** Its benchmark check tests only whether *any* activity
    exists on the date (`d in done_on`), not whether the prescribed session is the one
    that was trained. Three activities were logged on 6 Oct and none of them was a
    threshold set. **Do not read that line as the KEY RUN having been taken.** The same
    blind spot will mask any future benchmark that lands on a day he trains something
    else, which is worth fixing in `adherence.py` rather than remembering.
- verification: 36/36 offline assertions against fake clients covering source precedence,
  duration weighting (a 4-minute rep and a 40-second transition must not count equally),
  alternate field names, a partially failing child fetch, total failure, BaseException
  passthrough, and the zero-API-call gate on both an activity that already has HR and one
  with no HR at all; plus 14/14 on a real `update.patch()` round-trip against a copy of
  src/App.jsx proving the stored 5 Oct row is replaced **in place** with every other
  column byte-identical, no duplicate row, and daily/sleep/weight/body/SCHEDULE/
  TAPER_PLAN/HYROX_DATA/hrvBaseline all untouched. Confirmed against the live sync
  afterwards, not just in the fixture. `src/App.jsx` was not edited in this change.

## 2026-10-06
- adherence: no ACTION REQUIRED and no WATCH. ski **5/2** · strength **6/3** · row 1x/0 ·
  swim 1x/0 · hyrox 3/3 · cycle 2/6 · tennis 8/6 · run 9/8. **Yesterday's two dated
  triggers both resolved, and both resolved green**: 5 Oct was the Monday that was going
  to decide whether the end-of-gym-trip strength block moves to the front and whether the
  erg leaves the gym trip entirely, and he trained both — ski 1→2 done, strength 2→3 done.
  **Benchmarks already due: 28 Sep NOTHING LOGGED, 2 Oct NOTHING LOGGED** (both dead
  structure, addressed by the 3 and 4 Oct restructures), **30 Sep logged**, and **6 Oct
  listed as due is today — not a miss**. Next 14d: **Thu 8 Oct and Thu 15 Oct roxzone
  circuits**, on a day attended 8/9. Nothing in the fortnight sits on a day he does not
  train.
- readiness: HRV **52 vs baseline 75** (delta **−23**), RHR **43**, respiration 12.0,
  SpO₂ 98, **8h44 asleep** (132 deep / 114 REM / 278 light / 14 awake), sleep score null.
  LAST_DATA **2026-10-06T06:08Z**, minutes old — sync healthy. `hrvBaseline` 83 → **75**.
- decision: CHANGED — **the Monday compromised-ski standard is rewritten from a ceiling
  to a fade, on 12 and 19 Oct**; the treadmill km becomes a ceiling he may not beat;
  tonight's KEY RUN gains the control reading and this morning's physiology; `RACE_GAINS`'s
  ski mechanism claim is corrected; the Base I note records the finding. **Net change to
  written training load: zero** — all six probed properties identical on every session
  touched.
- why: **5 Oct finally ran the session this block is built around, and it falsified that
  session's own premise.** `Compromised 3x[ski 1km+run 1km]` logged **ski 4:02 / 4:19 /
  4:24** against **runs 4:08 / 4:00 / 4:00**. The line asked for every ski rep under 4:05
  and named *the run* as the measurement — "hold 4:15 per km … note whether rep 3 still
  holds it. That is the real Athens question." Both halves came back wrong:
  - **The run passed so hard it stopped being a measurement.** All three kms beat the 4:15
    standard, the last two by 15s, and they got *faster* across the session (−8s rep 1 →
    rep 3). A standard he beats by 15s is not a control.
  - **The ski collapsed: +22s rep 1 → rep 3.** Rep 1 at 4:02 already beat the sub-4:03 that
    12 Oct was going to ask for — the ceiling the whole progression was built to chase. So
    the ceiling was never the limiter. The repeat is.
- why that matters more than the splits do: it **re-reads Athens**. `RACE_GAINS` has said
  since the race that the ski's 20s is "pacing, not fatigue", on the strength of 3:57 off
  tennis legs versus 4:18 raced — and **simas-hyrox** carries the same claim. But 4:19 is
  his rep-2 number and 4:24 his rep-3: **his Athens split was his repeat capability showing
  up, not timidity on the day.** The 3:57 and the fresh 3:54 measure something he can do
  once. The 20s is still real, but it is not lying on the floor — it has to be built, and
  what has to be built is fatigue resistance in the pull, which the runs prove is not
  aerobic: his engine and his legs did not fade at all. That is a weakness **localised**,
  which answers "has a weakness moved?" with data for the first time this block.
- why the old progression had to go rather than be left to `adaptPlan`: it asked sub-4:03
  ×3 on 12 Oct and sub-4:00 ×3 on 19 Oct off a session that averaged **4:15**. That is 12s
  then 15s per rep inside one and two weeks, on the session type with the worst adherence
  record in this file (**5 prescribed / 2 done**) — and `adaptPlan` cannot see that a
  *standard* is unreachable. It scales volume and caps intensity; it does not re-specify a
  target. An unreachable number on his least-attended session type is how a session stops
  happening, which is the exact failure mode this file exists to prevent. New standard:
  **every rep under 4:10 AND rep 3 within 10s of rep 1** (12 Oct), tightening to **4:08
  and 6s** (19 Oct) — the fade halves, the ceiling deliberately stays put, and 4:10×3 asks
  5s/rep faster than Monday rather than 12s.
- **the treadmill is a ceiling now, not a target.** On 5 Oct he protected the run and spent
  the erg — the exact reverse of that line's "do NOT pace the ski to protect the run".
  Capping the km at 4:10 and saying outright that every second under it is stolen from the
  next erg rep is the only way the erg gets the effort.
- the strength block: on 5 Oct it asked for sled pull + lunges and he logged **"Strength:
  shoulders, pecs, biceps"** — push and elbow flexion, on the one day his pulling gave out.
  He does pick his own content (30 Sep he chose "lats and core" himself and skied 3:57 that
  same evening), so 12 Oct now names *why* the pull is the point instead of only listing it.
- **a defect I could not fix, and it is affecting live decisions.** Monday's Multi Sport row
  carries `Avg HR = "--"`, and `calcTRIMP` returns **0** on a falsy avgHR
  (`src/App.jsx:1133`, via `parseNum("--") → null`). So the block's single most important
  session — 27 minutes, max HR 175 — contributes **0 TRIMP** to ATL/CTL/form and to the
  week's total. 5 Oct counts as **53.9 TRIMP** against roughly **103** had that row carried
  an average HR. Two consequences: (1) the 5–11 Oct test of the 350 floor — the live trigger
  set on 4 Oct — is being scored with ~47% of Monday missing and **cannot be read as
  written**; a week that lands "under floor" may simply be unmeasured. (2) `adaptPlan`'s week
  governor sees room that is not there, and will add load on top of a −23 HRV morning.
  `calcTRIMP` and the CSV enrichment sit outside the edit surface this Routine is given
  (SCHEDULE / TAPER_PLAN / RACE / targets only), so I have **not** touched it; flagged to the
  user instead. Until it is fixed, do not move the Base I floor off any week containing a
  Multi Sport activity.
- physiology — **HRV −23, and it is Monday's bill, not the excursion returning.** 94 → 52 in
  one day, his biggest negative delta since 3 Oct. But the 2–3 Oct signature is absent: RHR
  is **43, inside the 38–46 range** (the excursion read 54 then 62, the latter the highest
  anywhere in his record), respiration 12.0 against 14–15, and he slept **8h44 with 114
  minutes of REM** where those two nights gave 3h55 and 5h47 with **zero REM both times**.
  An acute HRV drop the morning after his hardest session in three weeks, with sleep intact
  and RHR in range, is the expected response — and a reason to take today as written rather
  than to nurse it. I said so in the 6 Oct line, because a cold session, or he himself,
  reading "HRV 52" against last week's excursion could easily over-read it.
  On the baseline: `hrvBaseline` 91 → 88 → 79 → 83 → **75**. It is Garmin's own `weeklyAvg`
  (`update.py:534`), not computed here, and it is now absorbing 43 and 52. Yesterday
  predicted it would read true again by ~8 Oct; today's 52 pushes that back. **Do not read
  small deltas off this baseline for the next several days** — it is 8 points below
  yesterday's, which flatters today's number: 52 against 83 would have been −31.
- what I deliberately did NOT touch:
  - **Tonight's prescription** — 5×1km @ 4:06 off 90s, evening, unchanged. He ran 8×1km at
    4:01 on 1 Oct and 4:00 kms off a maximal erg on Monday, so 4:06×5 is soft, and on any
    other morning I would have said so. On a −23 morning, raising a pace standard is the
    wrong instinct, and `adaptPlan` caps intensity on poor readiness anyway. The pace stays;
    only the session's *purpose* grew — it is now the control for whether Monday's fade is
    local or systemic.
  - **Thu 8 Oct's roxzone circuit** — moved on 4 Oct, still untested, still the only thing in
    the fortnight with no baseline at all. Touching a relocation twice before testing it once
    is churn; that was yesterday's call and it still holds.
  - **STATION_TARGETS ski 3:58 and `RACE_GAINS` sec:20** — the *mechanism* was false, the
    target is not yet shown to be. Copenhagen is 172 days out and this is the first
    compromised ski measurement ever taken; cutting a target on one session would be the
    mirror of the error I am correcting. Only the `how` string changed.
  - **TAPER_PLAN bands and the Base I floor of 350** — see the defect above: this week cannot
    test the floor cleanly, so it stands by default rather than by evidence.
  - **The phase.** Base I · Aerobic is right, and 5 Oct argues *for* it: zero run fade, 4:00
    kms off a maximal erg. What moved is the content of one session inside the phase, not the
    phase or its bands.
  - **Sat 10 / Sun 11 Oct** — yesterday's trigger (a blank Saturday plus unprompted Sunday
    aerobic work a second time turns the optional into "Sat or Sun, your call") is live and
    cannot fire until the weekend.
- watching:
  - **ski 5/2 and strength 6/3.** Both of yesterday's dated triggers resolved green on 5 Oct,
    so both retire. Three of ski's five prescriptions are still dead structure — the 23/24 Sep
    standalone ergs and the blank 28 Sep double TT — ageing out 14–19 Oct; on the live
    structure ski is **2-for-2** (30 Sep 3:57, 5 Oct 4:02/4:19/4:24). What would make me act
    again: **if 12 Oct logs no ski**, the erg moves out of the gym trip and into a running
    session as a pre-run piece. Same trigger as yesterday's, now with one success behind it
    rather than none.
  - **the Monday treadmill km staying out of the `run` adherence count, deliberately.** My
    rewrite says "4:10 a kilometre" rather than "4:10/km" so the Monday lines do not start
    matching `\bkm\b` and adding two phantom run prescriptions to a row already reading 9/8.
    That km is a controlled cost inside an erg session, not a run session, and leaving it
    uncounted preserves comparability with the structure that preceded it. A future run that
    changes this wording should expect `run` to jump to 11 prescribed and should not read that
    as a drop in adherence.
  - **row 1x/0 and swim 1x/0**, both under the WATCH threshold and neither prescribed forward.
    Swim ages out 13 Oct, row 19 Oct. Row stays out: at top 11.4% it is a strength to defend.
- verification: `npm run build` clean (**437.14 kB**, from 430.95 — plan text only; all five
  edits are strings); **11/11** patch anchors; SCHEDULE still parses as **50 days**; the full
  `adherence.py --days 21` report **byte-identical** to the pre-edit run; HEALTH_DATA /
  HYROX_DATA / CSV_DATA / TODAY / LAST_RUN / LAST_DATA / hrvBaseline all **byte-identical**.
  `update.patch()` round-tripped against a copy of the real src/App.jsx — **28/28** — and
  against pristine origin/main as a control, where the only failures were the five assertions
  that look for my own edits. Wellness rows patch and keep their **4-space indent**, no rows
  lost, dates unique and sorted, weight upserts inside its own array with vo2max
  byte-identical, CSV upserts exactly once, TODAY advances to date+1, and SCHEDULE /
  TAPER_PLAN / RACE / RACE_BUDGET / RACE_GAINS / STATION_TARGETS / HYROX_DATA all survive the
  patch byte-identical.
  **The probe caught a real defect in my own draft.** My first 6 Oct text read "you slept
  8h44 with 132 minutes of deep" — and `planDurationMin` tests `(\d+)\s*h\s*(\d{1,2})`
  **before** it tests minutes, so "8h44" costed tonight's KEY RUN at **524 minutes** at HR
  168 instead of falling through to the run model's median. A ~10× over-cost on the week's
  hardest planned session, which would have had `adaptPlan` strip the rest of the week to make
  room for it — the same class of defect 4 Oct caught, in the opposite direction. Rewritten to
  spell the durations out ("nearly nine hours", "132 of deep"). Two further traps avoided by
  probing rather than reading: writing "ski" into the 6 Oct line would have added a **sixth
  phantom ski prescription** to the very row that drives the ACTION trigger (used "the erg",
  which `\bski(?:erg)?\b` does not match), and writing "strength" would have added a phantom
  strength prescription (used "a full lifting session"). Two of my own assertions also failed
  first and were wrong, not the code — sleep stages live under `wellness['sleep']`, and
  `^(\s*)` ate the leading newline of the extracted array slice — both caught because the
  pristine control failed identically. Reverted the package-lock.json churn `npm install`
  introduced. One factual slip fixed before commit: 5 Oct logged **four** short rides, not
  five.
- consecutive no-change runs before this one: **0** (5 Oct CHANGED, 4 Oct CHANGED, 3 Oct
  CHANGED, 2 Oct CHANGED).

## 2026-10-05
- adherence: no ACTION REQUIRED and no WATCH. ski 5/1 · strength 6/2 · row 1x/0 ·
  swim 1x/0 · hyrox 3/3 · cycle 2/6 · tennis 7/7 · run 9/8. **Benchmarks already due:
  28 Sep NOTHING LOGGED, 2 Oct NOTHING LOGGED, 30 Sep logged** — all three already
  addressed by the 3 and 4 Oct restructures. Next 14d: **Tue 6 Oct KEY RUN, Thu 8 Oct
  and Thu 15 Oct roxzone circuits**, on days attended 7/9 and 8/9. Nothing in the
  fortnight sits on a day he does not train, so nothing is pre-deferred.
- readiness: HRV **94 vs baseline 83** (delta **+11**), RHR **40**, respiration 11.0,
  SpO₂ 96, **9h21 asleep** (95 deep / 141 REM / 324 light / 1 awake), sleep score 95.
  LAST_DATA **2026-10-05T06:07Z**, minutes old — sync healthy. `hrvBaseline` 79 → 83.
- decision: CHANGED — two factual corrections, no structural change. (1) **Monday
  5 Oct's preamble**, which told him he arrives off three completely blank days.
  (2) **the Base I note's claim that he has never strung three 380+ weeks together.**
  Net change to written training load: **zero** (the 5 Oct line probes identical in
  all six derived properties, 163.3 TRIMP before and after).
- why (1): **he trained yesterday, and the line says he did not.** The 4 Oct row
  reached the repo after yesterday's run had already read the data: **Z2 Active
  Recovery, 57min, avg HR 123, 51.8 TRIMP**, plus 76min mushrooming at 9.8. So
  "three completely blank days — 2, 3 and 4 Oct" is now false, and it was load-bearing
  in that line: it was the premise for "take the session as written and do not nurse
  it." The conclusion survives — it is arguably stronger off a deliberate easy
  re-entry than off three days of nothing — but the premise does not, and yesterday's
  own entry set the standard I am applying: *he should not read a claim the data
  contradicts.* The corrected line now states the actual Monday reading, says in terms
  that the RHR-above-46 gate **did not fire**, and names the 57min/123/52 TRIMP session.
- why (2): **the number was wrong and yesterday's run caught it but only wrote the
  correction into this log, not into the note he actually reads.** The Base I note
  said "only 4 of his last 10 weeks cleared 380 and he has never strung three of them
  together". The first half is right; the second is false — **13/20/27 Jul went 439 /
  530 / 476**, three consecutive 380+ weeks. The note now says so, and adds the honest
  framing: 350 is conservative, not a stretch, because **6 of his last 10 weeks cleared
  it**.
- **the week-4 number changed, and it moves yesterday's live trigger.** Yesterday
  recorded week 4 (28 Sep–4 Oct) as closing at **265 TRIMP against a 350 floor, 85
  under**, with the trend 447 → 358 → 265, and set the trigger: *if 5–11 Oct also
  finishes under 350 with no physiological explanation, drop the floor to 320.* With
  the 4 Oct run in, week 4 actually closed at **327 — 23 under, not 85**, and the trend
  is **447 → 357 → 327**. That is 93% of the floor in a week that lost three days to
  the worst RHR excursion in his record. The trigger's premise is therefore gone: a
  327 week with a two-day RHR excursion inside it is not evidence that a 350 floor is
  unrealistic, it is evidence the floor survived an illness week nearly intact. **The
  floor stays at 350 and the note now says explicitly not to drop it on a week with a
  physiological explanation.** 5–11 Oct remains the first week that could test it
  cleanly, and it has to be a clean week to count.
- physiology — **the excursion is closed, and the instrument is un-blunting.** 2 Oct
  RHR 54, 3 Oct RHR **62** (the highest in his 123-day record, 16 beats above the top
  of his 38–46 range) with HRV 43 and two consecutive nights of **zero REM**. Then
  4 Oct RHR 40 / HRV 79 / 145min REM, and today **RHR 40 / HRV 94 / 141min REM /
  sleep score 95 / respiration 11.0**. Two clean mornings, REM restored both nights,
  and **HRV is above baseline for the first time since 1 Oct**. Yesterday said "it is
  over" off one day; today is the second, independent confirmation. No RHR reading
  outside 38–46 since 3 Oct.
  On the baseline: `hrvBaseline` has gone 91 → 88 → 79 → **83**. Yesterday's reading
  of this was right and is now visible — the fall to 79 was the rolling mean absorbing
  43 and 71, not a physiological decline, and it made a genuinely recovered HRV of 79
  compute `hrvDelta` = 0. Today the mean is climbing back as those values roll out and
  the delta reads **+11** on an HRV of 94. The instrument is recovering roughly a week
  behind the athlete, as expected; by ~8 Oct it should be reading true again.
- what I deliberately did NOT touch:
  - **Monday 5 Oct's session content** — the compromised ski reps under 4:05, the
    4:15 run standard, the sled-pull-and-lunge block. Readiness is green (+11, RHR 40),
    so the gate is moot rather than triggered, and this is the #1 priority session.
    `adaptPlan` can scale it on its own and the week is under floor with R high, so
    duplicating that judgement here would fight the engine.
  - **Tue 6 Oct's KEY RUN and the Thu 8 / 15 Oct roxzone circuits** — moved on 3 and
    4 Oct respectively, onto days attended 7/9 and 8/9. **Thu 8 Oct is still the one
    thing in the fortnight with no baseline at all** and it has not had its first
    attempt yet. Touching a relocation twice before testing it once is churn.
  - **TAPER_PLAN bands, phase, STATION_TARGETS / RACE_BUDGET / RACE_GAINS** — Base I
    350–460 stands (see above). Nothing was trained between yesterday's run and this
    one except an easy Z2 run, so no target could have moved.
  - **weakness ranking** — unchanged: running still the weakest block against the
    field (top 27.7%), ski erg still the weakest element (top 29.8%).
- watching:
  - **strength 6/2 and ski 5/1.** Both triggers from yesterday are dated and both
    resolve on **today and Mon 12 Oct**: for strength, if both Mondays pass with no
    logged strength, the end-of-gym-trip block moves to the front of the session; for
    ski, if neither Monday logs ski, the erg moves into a running session as a pre-run
    piece rather than waiting on a gym. Neither can fire yet — today has not happened.
    Both counts are also still inflated by the dead structure: three of ski's five
    prescriptions are the 23/24 Sep standalone ergs and the blank 28 Sep double TT,
    ageing out 14–19 Oct. On the replacement structure ski is **1-for-1** (30 Sep, 3:57).
  - **row 1x/0 and swim 1x/0**, both under the WATCH threshold and neither prescribed
    anywhere forward. Swim ages out 13 Oct, row 19 Oct. Row stays out: at top 11.4% it
    is a strength to defend, and `references/training-log.md` records its TT as deferred
    twice across months, which no 21-day window can see.
  - **Saturday 3/9 vs Sunday 6/9, and this is the first Sunday data point of a new
    kind.** Yesterday recorded this as a non-finding, correctly, on the grounds that the
    Sunday sessions were Hyrox circles landing there rather than a Sunday habit, and that
    family day is his stated constraint. Yesterday's 4 Oct run was **not** a circle — it
    was a self-chosen Z2 run on a day the plan asked for nothing, during a recovery. The
    week's only flex session still sits on Saturday, his least reliable day at 3/9, which
    is part of why week 4 came in under floor. I am **not** prescribing Sunday — that
    would trade his stated constraint for a session he already takes unprompted and the
    engine already counts as unplanned load. What would make me act: **if Sat 10 Oct is
    blank while Sun 11 Oct carries unprompted aerobic work a second time**, the optional
    stops being pinned to Saturday and becomes "Sat or Sun, your call", which costs him
    nothing and stops the week's buffer sitting on his worst day.
- verification: `npm run build` clean (**430.95 kB**, from 428.93 — text only); **9/9**
  patch anchors; SCHEDULE still parses as **50 days** under `adherence.py`'s day regex
  and the full adherence report is byte-identical to the pre-edit run. `update.patch()`
  round-tripped against a copy of the real src/App.jsx **and** against pristine
  origin/main as a control — **21/21 on both**: wellness rows patch and keep their
  **4-space indent**, no rows lost, dates unique and sorted, weight upserts inside its
  own array with vo2max byte-identical, CSV upserts, TODAY advances to date+1, and
  SCHEDULE / TAPER_PLAN / RACE / RACE_BUDGET / RACE_GAINS / STATION_TARGETS /
  HYROX_DATA all survive byte-identical.
  **The probe caught a real defect in my own first draft.** The corrected Monday line
  originally read "on a day the plan said full rest", and `full rest` matches
  `PLAN_INTENSITY` rule 1 — so `planIntensity` returned **0** and the session's
  projected cost fell from **163.3 TRIMP to 0**, which would have let `adaptPlan`'s
  week governor treat the week's single most important session as free and add load on
  top of it. Rephrased to "asked for nothing at all"; the line now probes identical to
  before the edit on all six properties (duration 60, intensity 168, not info, not
  optional, 163.3 TRIMP, adherence types ski/strength/run). One test assertion of mine
  also failed first and was wrong, not the code — `wellness['weight']` is a
  `(date, kg)` tuple, not a float — caught because the pristine control failed
  identically. Reverted the package-lock.json churn `npm install` introduced.
- consecutive no-change runs before this one: **0** (4 Oct CHANGED, 3 Oct CHANGED,
  2 Oct CHANGED).

## 2026-10-04
- adherence: no ACTION REQUIRED and no WATCH. ski 4/1 · strength 5/2 · row 1x/0 ·
  swim 1x/0 · hyrox 3/3 · cycle 2/6 · tennis 7/8 · run 8/7. **Benchmarks already due:
  28 Sep NOTHING LOGGED, 2 Oct NOTHING LOGGED, 30 Sep logged.** Next 14d as the plan
  stood this morning: **Wed 7 Oct and Wed 14 Oct roxzone circuits**, plus Tue 6 Oct's
  KEY RUN. After this entry: Tue 6 Oct, **Thu 8 Oct, Thu 15 Oct**.
- readiness: HRV **79 vs baseline 79** (delta **0**), RHR **40**, respiration 12.0,
  **10h35 asleep** (204 deep / 145 REM / 286 light / 17 awake), sleep score 95.
  LAST_DATA **2026-10-04T06:07Z**, minutes old — sync healthy. `hrvBaseline` 88 → 79.
- decision: CHANGED — **the roxzone circuit moves off Wednesday onto Thursday, in all
  three weeks that carry it (7→8, 14→15, 21→22 Oct)**, is rewritten to need no venue,
  and now tells him to put the word roxzone in the title. Plus two corrections: Monday
  5 Oct's preamble, which stated something that turned out to be false, and the Base I
  note.
- why: **the host session does not exist.** The line read `15min standalone, run it
  even if the circle does not` — so on any Wednesday the circle skips, the first
  roxzone measurement he has ever taken becomes a trip made for no other purpose, and
  **a trip of its own is 0-for-4**: ski 23 Sep, ski 24 Sep, the 28 Sep double TT, the
  2 Oct 5km. The one benchmark that landed, 30 Sep's 3:57, hung off an evening he was
  already out. Yesterday's run wrote that rule into the Base I note and then said of
  this very session "it sits on the circle night, which is the right structure.
  Protect it." **That was the error, and it is only visible from the circle's history:
  five circles since August landed Mon 24 Aug, Mon 31 Aug, Wed 16 Sep, SUN 20 Sep and
  FRI 25 Sep — four different weekdays, one Wednesday in five.** A benchmark hung off
  a host that shows up on the right day 20% of the time is a standalone trip 80% of
  the time. Thursday instead: **8/9 attended since 3 Aug** against Wednesday's 6/9, it
  already carries a Z2 run to bolt onto, and the circuit is now burpee broad jumps and
  step-ups — nothing to load, which matters because **he has entered a gym on a
  Thursday 0 times in 9 weeks**. It also lands the circuit *under fatigue*, off the
  back of a run, which is what the Athens post-mortem actually asked for and what a
  fresh Wednesday version would not have given.
- why this was worth overriding yesterday's "protect it": roxzone is the only bucket
  that went backwards from Riga (**+29s**) and the only one to miss its Athens plan
  (**+1:25**); `RACE_GAINS` credits it **92 of the 287 seconds** Copenhagen needs, the
  second-largest line on the board. It has **never once been measured**. Deferring it
  the way the ski TT and the 5km were deferred is the single most expensive thing that
  could happen to this block, and the mechanism that deferred both of those was
  already written into this line.
- two defects found while verifying, both invisible from the plan text: (1) the
  Wednesday line contained the words "after the tennis", so `planIntensity` matched
  `/tennis/i` **before** reaching the ⏱ branch and costed a timed benchmark at his
  tennis median HR of 103 — **7.5 TRIMP instead of 40.8**, a 5.4× under-cost, which
  means `adaptPlan`'s week governor has been trimming real sessions to make room for a
  roxzone circuit it believed was almost free. (2) The same three words made
  `adherence.py` score a **phantom tennis prescription** on every roxzone Wednesday.
  Both are gone; the new lines probe clean at duration 15, intensity 168, 41 TRIMP,
  adherence types `hyrox,run` only, benchmark=true.
- physiology — **the thing to say this morning.** Yesterday set the trigger: "a second
  consecutive day with RHR above 46, or a 10-03 row that has not recovered." **Both
  halves fired, and harder than the trigger anticipated.** 3 Oct read **RHR 62** — 16
  beats above the top of his 38–46 range and **the highest reading in the whole
  122-day record**, worse than 19 Sep's 56 — with HRV 43, respiration 15.0, and a
  **second consecutive night of literally zero REM** (5h47 total, 62min awake). Then
  this morning it is simply over: **RHR 40, HRV 79, respiration 12.0, 10h35 asleep
  with 145min of REM back, sleep score 95.** A two-day excursion with REM suppression,
  closed out by a 10½-hour rebound night. So the gate yesterday attached to Monday is
  the right machinery and it is now almost certainly moot — which is why I left the
  gate in place but corrected the sentence above it, because that sentence told him
  "the same shape as 19 Sep, which washed through inside a day, so this is most likely
  already behind you" and **it did not wash through in a day; 3 Oct was worse.** He
  should not read a claim the data contradicts.
- the baseline, and a blunted instrument: `hrvBaseline` has gone **91 → 88 → 79 in
  three days**. That is not a sustained physiological decline — it is the rolling mean
  absorbing 71 and 43, inside a series that has run **39 to 129 over 21 days**. The
  consequence is worth stating though: **the baseline fell to meet the suppressed
  reading, so today's genuinely-recovered HRV of 79 computes `hrvDelta` = 0** and
  `adaptPlan` reads this morning as perfectly neutral. Before the excursion he was
  posting 100 and 118 against a baseline of 91. For a week or so the HRV delta will
  under-report both suppression and recovery, and the honest readiness signal is RHR
  and sleep — which is a second, independent reason Monday's explicit RHR-above-46
  gate stays in rather than being left to the engine.
- what I deliberately did NOT touch: **Monday 5 Oct's session content.** He arrives off
  **three completely blank days** (2, 3 and 4 Oct — last logged session is the 1 Oct
  8×1km) on a clean reading, so the compromised ski reps, the 4:15 run standard and the
  pull-and-carry block all stand exactly as yesterday built them; the only change is
  the preamble that was factually wrong. **Tuesday 6 Oct** is untouched — it is the
  running benchmark yesterday moved there and Tuesday is 7/9. **Friday's long run,
  Saturday's optional flex, Sunday's rest**: unchanged, and Saturday at **3/9 attended**
  is correctly the droppable one. **STATION_TARGETS / RACE_BUDGET / RACE_GAINS**:
  unchanged — they already encode the 3:57-off-tennis-legs read of the ski erg ("it is
  pacing, not fatigue") and a trained roxzone, and nothing moved in 24h because nothing
  was trained.
- phase and bands: **Base I stays, 350–460 stays.** The week closed at **265 TRIMP**
  against a 350 floor — 85 under, and the trend is **447 → 358 → 265**. Yesterday's
  stated trigger was "if 5–11 Oct also finishes under 350 with no physiological
  explanation, drop the floor to 320." Week 4's miss is explained twice over: Mon 28 Sep
  was the standalone double-TT trip (the structural fault this entry is still unwinding)
  and 2–3 Oct was the RHR excursion. **So the trigger is live and unresolved, and next
  Sunday's run decides it.** One correction for whoever reads that note: it claims he
  "has never strung three [380+ weeks] together" — he did, Jul 13 / 20 / 27 at 440 /
  530 / 476. The 350 floor is ambitious, not fictional: **6 of his last 10 weeks
  cleared it.** Note also the written weeks now project 641 / 627 / 665, far over the
  460 ceiling — that is by design, `adaptPlan` is the governor and trims to band; my net
  addition to written intent is **+32** (roxzone 41 on Thursday, less the 9 it was
  wrongly costing on Wednesday).
- weakness ranking: unchanged. Running still the weakest block against the field (top
  27.7%), ski erg still the weakest element (top 29.8%). Nothing trained since 1 Oct,
  so nothing could have moved.
- watching:
  - **strength 5/2**, a fourth morning carried, trigger unchanged: a third consecutive
    week with no logged strength, **or** 3+ prescribed and 0 done in 21 days. Neither is
    met — 21 Sep (48min) and 30 Sep (26min) both landed, and **both were bolted to a
    night he was already out**, which is the same structural lesson holding. What would
    make me act: if Mon 5 **and** Mon 12 Oct both pass with no strength logged, the
    end-of-gym-trip block is being dropped and it moves to the front of the session.
  - **ski 4/1** — still expected decay, not a live signal. Three of the four
    prescriptions are the 23/24 Sep standalone ergs and the blank 28 Sep, all ageing out
    by 19 Oct, and the replacement structure produced 3:57 first time. What would make me
    act: no ski logged across Mon 5 **and** Mon 12 Oct, which would mean the bolted
    structure is failing too and ski has to move into a running session as a pre-run erg
    rather than wait for a gym.
  - **row 1x/0** and **swim 1x/0**, both under the WATCH threshold. Swim ages out 13 Oct
    untouched. Row is the honest one: `references/training-log.md` records the 1000m row
    TT as **never completed, deferred twice** across months, which no 21-day window can
    see — and at **top 11.4%** it is a strength the plan is told to defend, not chase.
    It is not prescribed anywhere in the next three weeks and I am not re-adding it; if
    a future run wants the number, it belongs bolted to a Monday gym trip, never as a
    trip of its own.
  - **Thu 8 Oct is now the one thing in the fortnight with no baseline at all.** If it
    goes blank, the problem is not the day and not the venue, and the next move is to
    fold the eight transitions into the Monday gym trip rather than keep relocating a
    session of its own.
  - **Sunday 5/8 vs Saturday 3/9.** He trains Sundays more often than Saturdays, yet
    every Sunday reads "Full rest · family day" and Saturday carries the optional. The
    Sunday sessions were circles landing there (16 Aug, 20 Sep), not a Sunday habit, and
    family day is his stated constraint — so I am not prescribing Sunday. Recording it
    because it is the kind of thing that looks like a finding and is not.
- verification: `npm run build` clean (**428.93 kB**, from 426.04 — text only); **9/9**
  patch anchors; SCHEDULE still parses as **50 days** under `adherence.py`'s day regex.
  `update.patch()` round-tripped against a copy of the real src/App.jsx **and** against
  pristine origin/main as a control — **21/21 on both**: daily and sleep rows patch and
  keep their **4-space indent**, no rows lost, dates unique and sorted, weight upserts
  inside its own array without touching vo2max, CSV upserts, TODAY advances, and
  SCHEDULE / TAPER_PLAN / RACE / RACE_BUDGET / RACE_GAINS / STATION_TARGETS /
  HYROX_DATA all survive byte-identical. Every new and edited line was probed through
  `planDurationMin` / `planIntensity` / `isInfoLine` / `isOptionalLine` and
  `adherence.py`'s matchers before it was written: **Mon 5 Oct is identical in all six
  derived properties** (duration 60, intensity 168, not info, not optional, 163 TRIMP,
  types ski/strength/run); the three new Thursday lines carry an explicit `15min` so
  they cannot fall back to the 52-minute run median, contain no double quote (which
  would truncate `adherence.py`'s `text:"([^"]+)"`), no `] }` (which would break its day
  regex), no bare "or" (which `isOptionalLine` would half-cost), and none of
  ski/row/lunge/sled/strength/wall-ball/tennis (which would each have invented a
  prescription). Four of my own test assertions failed first and were wrong, not the
  code — caught because the pristine control failed identically: `advance_today` moves
  TODAY to **date+1**, and sleep stages arrive nested under `wellness['sleep']`, not as
  top-level keys. Reverted the package-lock.json churn `npm install` introduced.
- consecutive no-change runs before this one: **0** (3 Oct CHANGED, 2 Oct CHANGED,
  1 Oct CHANGED).

## 2026-10-03
- adherence: no ACTION REQUIRED and no WATCH. ski 4/1 · strength 5/2 · row 1x/0 ·
  swim 1x/0 · hyrox 3/3 · cycle 2/6 · tennis 8/8 · run 8/7. **Benchmarks already due:
  28 Sep NOTHING LOGGED, 2 Oct NOTHING LOGGED, 30 Sep logged.** Next 14d: roxzone
  circuit Wed 7 and Wed 14 Oct, plus the running benchmark I moved onto Tue 6 Oct.
- readiness: **no 2026-10-03 row yet**; latest is 2 Oct — HRV **71 vs baseline 88**
  (−17), RHR **54**, respiration **14.0**, sleep **3h55 total with zero REM** and 32min
  awake, no sleep score. LAST_DATA **2026-10-03T06:07Z**, so the sync is alive and
  yesterday's missing-row watch resolved itself: the 10-02 row backfilled exactly as
  predicted. `hrvBaseline` slipped 91 → 88.
- decision: CHANGED — 3 lines. (1) **Tue 6 Oct becomes the running benchmark** and
  carries the ⏱, because Friday's standalone 5km TT did not happen. (2) A degrade rule
  on Mon 5 Oct keyed to the RHR excursion. (3) The Base I note now extends the
  no-trip-of-its-own rule from ergs to benchmarks.
- why: **standalone benchmark trips are 0-for-2; bolted-on benchmarks are 1-for-1.**
  The three benchmarks in this window: 28 Sep (ski + row double TT) — blank day,
  nothing logged. 2 Oct (5km TT) — blank day, nothing logged. 30 Sep (ski TT) —
  **done, 3:57**, and that was the one bolted onto a night he was already out for
  tennis. Two of the three were trips made for no other purpose and neither happened.
  This is precisely the lesson the plan already learned for ergs and wrote into the
  Base I note on 28 Sep ("EVERY erg exposure now sits inside the Mon gym trip or the
  circle night, never a trip of its own") — and it was never applied to running. So
  the running measurement moves inside the Tuesday KEY RUN: **Tuesday is 7/8 attended
  over eight weeks**, against Saturday's 3/8, and the session was already race-shaped.
  Kilometre reps at the Copenhagen budget pace (4:06) read Copenhagen better than a
  flat 5km ever would, because Copenhagen is eight kilometre reps with a station in
  front of each. Adding ⏱ is what makes `adherence.py` see it, so a future cold
  morning can tell whether it happened.
- why I did NOT simply re-prescribe the 5km on a later Friday: it has **no decision
  riding on it any more**. Yesterday's run re-derived the whole October threshold
  ladder off the 1 Oct 8×1km @ 4:01 and stated the paces no longer wait on the TT.
  A benchmark that measures nothing and has gone 0-for-2 is a wish, not a session.
- physiology — **the one thing to say this morning.** 2 Oct: **RHR 54, eight beats
  above the top of his 38–46 range**, with HRV 71 (−17 on baseline), respiration 14.0
  against a typical 10–12, and a 3h55 night containing **no REM at all**. That is the
  same signature as 19 Sep (HRV 39, RHR 56, resp 14.0), which washed through in a
  single day: 20 Sep read 57/41 and 21 Sep was back to 98/40. So the likeliest read is
  one bad night rather than the start of something, and **it is also the explanation
  for the blank Friday** — 2 Oct was not a refusal to train, and nothing in this entry
  treats it as one. `hrvBaseline` 91 → 88 is a 3ms drift inside an oscillation that has
  run 118/71 in two days; not a sustained shift. **What would make me act:** a second
  consecutive day with RHR above 46, or a 10-03 row that has not recovered toward the
  high 30s / low 40s. That is why Monday now carries an explicit RHR-above-46 rule.
- what I deliberately did NOT touch, and why — **today's Saturday line.** It reads
  "Optional · Z2 run 40min · drop it without guilt", and that is already the right
  session. More importantly `adaptPlan` will cap today on its own: `easeHard` fires
  twice over, on `hrvDelta −17 ≤ −10` and on `sleepMin 235 < 360`, and the under-floor
  scale-up is gated behind `R >= 7` so it cannot add load on a morning like this.
  Rewriting the line would have duplicated the engine. **Monday 5 Oct's prescription**
  is likewise unchanged — yesterday built it, it is the #1 priority session, and
  churning it would be preference. All I added is where the trim should land if he is
  still suppressed: keep the compromised erg reps, drop the pull-and-carry block.
- phase and bands: **Base I stays, 350–460 stays.** The week closes at **265 TRIMP
  done through 2 Oct**, projecting ~292 with today half-costed — roughly 85 under the
  floor, and the trend is 447 → 357 → 265. That looks like an unrealistic band until
  you see the cause: **two blank days, and both are explained.** Mon 28 Sep was the
  standalone double-TT trip (the structural problem this entry fixes) and Fri 2 Oct was
  the RHR 54 morning. With those two attended the week lands near 420, mid-band. The
  350 floor was set four days ago with explicit reasoning and one week does not
  overturn it. **What would make me move it:** if 5–11 Oct also finishes under 350 with
  no physiological explanation, that is two of two in Base I and the band is wrong, not
  him — drop the floor to 320 rather than keep grading him against a number he misses.
- weakness ranking: unchanged. Running is still the weakest block against the field
  (top 27.7%) and the ski erg still the weakest element (top 29.8%). Nothing in the
  last 24h moves either — there was no training on 2 Oct to move them.
- watching:
  - **strength 5/2**, carried for a third morning with its trigger unchanged: a third
    week with no logged strength session, **or** 3+ prescribed and 0 done in a 21-day
    window. Neither is met (21 and 30 Sep were both trained). Still not acting.
  - **ski 4/1** — still expected decay, not a live signal. Three of the four
    prescriptions are the 23/24 Sep standalone ergs and the blank 28 Sep, all ageing
    out by 19 Oct, and the replacement structure produced 3:57 on its first attempt.
    Next instances Mon 5 / 12 / 19 Oct, all inside the gym trip.
  - **row 1x/0** and **swim 1x/0**, both below the WATCH threshold. Row acts if
    prescribed once more (→ 2x/0) and then only as the in-circle alternate. Swim ages
    out of the window on 13 Oct without action.
  - **the easy-day overshoot**, carried from yesterday: 1 Oct asked for 25min easy and
    got 96 TRIMP. The trigger was "a second overshoot inside three weeks" — 2 Oct was
    blank, so no second instance. Unchanged.
  - **Wed 7 Oct roxzone circuit** is still the first roxzone measurement he has ever
    taken, and the only thing in the fortnight with no baseline. It sits on the circle
    night, which is the right structure. Protect it.
- verification: `npm run build` clean (**426.04 kB**); **9/9** patch anchors;
  `update.patch()` round-tripped against a copy of the real src/App.jsx **and** against
  pristine origin/main as a control — **18/18 identical on both**: wellness daily and
  sleep rows patch and keep their **4-space indent**, no rows lost, dates unique and
  sorted, weight upserts inside its own array without touching vo2max, CSV upserts,
  TODAY advances, and SCHEDULE / TAPER_PLAN / RACE_GAINS / STATION_TARGETS /
  RACE_BUDGET / HYROX_DATA all survive byte-identical. Both edited SCHEDULE lines were
  run through the accident-prone regexes and diffed against their HEAD versions: Mon
  5 Oct is **identical in every derived property** (intensity 168, duration 60,
  not optional, types ski/strength/run); Tue 6 Oct changes **only** the benchmark flag
  False → True, keeping intensity 168, **no duration** (so `estTrimp` still falls back
  to his historical run median), not optional, and **exactly one** adherence type
  (`run`) with no phantom ski/row/strength/cycle/tennis prescription. One real defect
  caught and fixed before it shipped: my first draft ended "the number that matters is
  rep **5 min**us rep 1", which `planDurationMin` read as a **5-minute** session and
  would have costed a threshold workout at ~9 TRIMP instead of ~90. Reverted the
  package-lock.json churn `npm install` introduced. Final diff: 3 lines, none
  machine-written.
- consecutive no-change runs before this one: **0** (2 Oct CHANGED, 1 Oct CHANGED,
  30 Sep CHANGED).

## 2026-10-02
- adherence: no ACTION REQUIRED and no WATCH. ski 4/1 · **strength 5/2** · row 1x/0 ·
  swim 1x/0 · hyrox 3/3 · cycle 2/6 · tennis 8/9 · **run 8/7 after my edit, see the
  note below — that is not a new miss** · benchmarks next 14d: roxzone circuit Wed
  7 Oct (the first ever) and Wed 14 Oct, both on 8/10 Wednesdays, neither at risk.
- readiness: **no 2026-10-02 wellness row yet** — latest is 1 Oct, HRV **118 vs
  baseline 91**, RHR **40**, sleep 8h25 (deep 132 / rem 77), score 95. LAST_DATA is
  **2026-10-02T06:07Z**, so the sync is alive and this is the watch not yet synced
  this morning, not a break; REFRESH_DAYS=4 will backfill it. I did not read today's
  readiness, and nothing below depends on it.
- decision: CHANGED — **re-priced the entire October threshold ladder off a
  measurement he made on his own**, and rewrote today's benchmark line around what
  he did yesterday. 5 lines: Tue 6 / 13 / 20 Oct, Fri 2 Oct, and the Base II note.

### What arrived overnight
**`Running · "8x1km tempo 4:01"`, 1 Oct 13:05 — 10.87km, 52:12, avg HR 151, max 176,
Aerobic TE 4.4, 96 TRIMP.** The day's prescription was *"Easy day · 25min easy spin,
a walk, or full rest — your call. Friday's 5km is the week's benchmark and it is
worth arriving fresh for."* He went and ran eight kilometre reps instead. Overall
pace 4:48/km across 10.87km means ~2:30 of jog recovery per rep, and avg 151 with a
176 max puts the reps in upper zone D (156–177 running) — hard, but **not maximal**:
he never reached zone E.

- why — **three running prescriptions were slower than the race they are preparing.**
  Laid side by side:

  | | Pace per km |
  |---|---|
  | Tue 6 / 13 / 20 Oct, as written | 4:15 / 4:14 / 4:12 |
  | Athens R2–R8, **with a station before every km** | **4:18** |
  | Copenhagen budget, runs 2–8 (`RACE_BUDGET`) | **4:06** |
  | What he ran on 1 Oct, unprompted, off jog recoveries | **4:01** |

  A session labelled `KEY RUN · threshold` was asking **3 seconds per km faster than
  his compromised race pace**, 9s/km slower than the budget it is supposed to build,
  and 14s/km slower than a session he did for fun four days earlier on a rest day.
  That cannot produce 4:06, and it is the same defect yesterday's run named on the
  ski — *a target he clears while coasting is not a stimulus* — sitting untouched in
  every running line. Yesterday's run was explicitly waiting on tonight's 5km TT to
  re-derive these paces. It no longer has to: the measurement already exists, it is
  race-shaped (8×1km is literally the Hyrox run profile), and it is better evidence
  than a TT would have been.
- the new ladder — **pace pinned at the budget number, progression by density.**
  **5×1km @ 4:06 off 90s (6 Oct) → 6×1km @ 4:06 off 75s (13 Oct) → 6×1km @ 4:04 off
  60s (20 Oct).** Two axes move, both monotonic; the pace stops drifting 3s over
  three weeks and sits at 4:06 because **race pace has to become repeatable, not
  maximal**. 6km at 4:04 off 60s rest is meaningfully denser than 8km at 4:01 off
  2:30 jogs, so the end of the ladder is a real step past 1 Oct rather than a
  ratification of it. I deliberately started at 5 reps, not 8: one unprescribed
  session is not a licence to make his best day the new weekly floor.
- why I did NOT touch the Monday 4:15 km. Yesterday's run built that session one day
  ago and held the run standard constant on purpose — it is a compromised km straight
  off a maximal 1000m erg, pegged to Athens R2, with the ski as the only moving
  variable. Churning it the next morning would be preference, not physiology, and the
  session is 3 days out. The Tuesday line now says so explicitly so the two numbers
  do not read as a contradiction. **What would make me act, and when:** if rep 3
  holds 4:15 comfortably on Mon 5 Oct, 12 Oct should go to 4:08 and 19 Oct to 4:06 —
  check his report on that session before leaving those lines alone.
- today's 5km TT: **kept on Friday, and the week needs it.** The week stands at
  **265 TRIMP through 1 Oct against the Base I 350–460 band** — 28 Sep was blank, and
  the 8×1km is the largest single session in it. The TT is the session that puts the
  week in band, Friday is **9/10** attended and reliably a running day, and he goes
  in on HRV 118 / RHR 40. Moving it would have been the wrong read: he is not
  fatigued, he is under-loaded. What I did change is the framing — the line now
  quotes yesterday's session back at him, says the TT sits 24h off hard legs and will
  read a few seconds per km slow, sets the expectation at **19:00–19:30 as a floor,
  not a ceiling**, and adds a degrade rule (if km 1 says no, make it 3km hard and keep
  the day). It also states that the October paces no longer wait on this number,
  which is the point: a slow TT can no longer poison the ladder.
- a defect I fixed while in the line: **today's benchmark was costed at 10 minutes.**
  `planDurationMin` takes the leftmost `(\d+)\s*min`, and the old text's first match
  was "10min warm-up" — so a 5km TT was projecting ~27 TRIMP instead of ~120, and the
  week was reading ~319 projected, *under* its floor, where `adaptPlan` would sooner
  add volume than trim. Now "45min door to door" is leftmost and the week projects
  **~414**, mid-band. **And the same line was invisible to `adherence.py`**: its run
  pattern ends in `\bkm\b`, which does not match "5km" (no word boundary inside
  `5km`), and the old text had no *jog*, *tempo* or *threshold* either — so the 5km TT
  has never once been counted as a prescribed run. The new text contains "jog home",
  so run moved 7/7 → **8/7**. **For tomorrow: that "short by 1" is my edit plus a
  session that had not happened when I ran. It should read 8/8 once tonight syncs.**
- phase: **Base I stays, bands stay.** 265 TRIMP so far this week against 350–460 is
  low but explained by a blank Monday, and the projection lands at ~414. Recent weeks:
  447 (14–20 Sep, over band) → 357 (21–27 Sep, in band) → ~414 projected. The 350
  floor set on 30 Sep is holding and nothing argues for moving it. The only TAPER_PLAN
  edit is the **Base II note**, which read `3×1km @ 4:00–4:05` — after this morning
  that is *fewer reps at a slower pace* than the Base I block it follows, and the
  roadmap panel displays it. Rewritten to carry on from 6×1km @ 4:04 off 60s.
- weakness: unchanged in ranking, but **running's mechanism is now clearer**. It is
  still the weakest block against the field (top 27.7%) while the stations block is
  top 9.6%. What today establishes is that the gap is not engine — a man who runs
  8×1km at 4:01 at submaximal HR is not pace-limited at 4:18. Like the ski, it is
  what he will commit to under race conditions. Athens showed zero fade and R8 was
  his best-ranked run of the day (#63, top 11.0%), which says the same thing: he
  finished with something left. The ladder is built to make 4:06 feel ordinary.
- physiology: **nothing to act on.** `hrvBaseline` 91, unchanged from yesterday and
  exactly where it sat on 11 Sep before the 19 Sep illness spike washed through.
  Last seven HRV 117/60/65/106/100/118 plus a missing today — wide oscillation around
  a restored centre. RHR is **38–42 on every day in the 21-day window** except that
  single 56 on 19 Sep, comfortably inside his 38–46 range. **No sustained shift and no
  excursion.**
- watching:
  - **He does not do easy days when he feels good.** 1 Oct asked for 25min easy and
    got 96 TRIMP of kilometre reps, the day before a benchmark. One instance is not a
    pattern — 17 Sep's Thursday was an honest Z2 40min at HR 130, and on 26 Sep he
    *under*-did a prescribed long run. But it is the second time in a week the written
    day and the trained day diverged upward. **What would make me act:** a second
    easy-day overshoot inside three weeks. At that point the fix is not to keep
    writing easy days he ignores — it is to put the quality where he wants to do it
    and make the easy day a genuine rest day he will respect.
  - **strength 5 prescribed / 2 done**, carried from yesterday with its trigger
    unchanged: a third week with no logged strength session, **or** the count reaching
    3+ prescribed with 0 done in a 21-day window. Neither is met (21 and 30 Sep were
    both trained). Still not acting.
  - **row 1x/0** and **swim 1x/0**, both below the WATCH threshold and both carried
    unchanged. Row acts if prescribed once more (→ 2x/0), and then goes inside the
    Wednesday circle as the alternate, never as a trip of its own. Swim ages out of
    the window on 13 Oct without action.
  - **the missing 2026-10-02 wellness row.** Two full-mode runs today (05:07Z, 06:07Z)
    stamped LAST_DATA but wrote no wellness row, where 1 Oct's landed at 05:08Z.
    Almost certainly an unsynced watch. **What would make me act:** if tomorrow opens
    with no 10-02 row *and* no 10-03 row, that is two days and the Worker's
    `oauth2 refresh:` line is the thing to read, not the plan.
  - **ski 4/1** is expected decay, not a live signal: three of the four prescriptions
    are the 23/24 Sep standalone ergs and the blank 28 Sep, all of which age out by
    19 Oct, and the structure that replaced them produced 3:57 on 30 Sep on its first
    attempt. The next instances are Mon 5 / 12 / 19 Oct.
  - **Wed 7 Oct is the first roxzone measurement he has ever taken** — top 19.8% and
    the cheapest seconds on the board (92s in `RACE_GAINS`). It is the one thing in
    the next fortnight with no baseline at all. Protect it.
- verification: `npm run build` clean (**424.38 kB**); **9/9** patch anchors;
  `update.patch()` round-tripped against a copy of the real src/App.jsx **and**
  against pristine origin/main as a control — **18/18 identical on both**: wellness
  rows patch and keep their **4-space indent**, no daily or sleep rows lost
  (119→120, 118→119), dates unique after dedupe, weight upserts inside its own array
  without touching vo2max, CSV upserts, and SCHEDULE / TAPER_PLAN / RACE_GAINS /
  STATION_TARGETS / RACE_BUDGET / HYROX_DATA survive byte-identical. Every new line
  was run through the accident-prone regexes: all four SCHEDULE lines resolve to
  intensity **168**, match **exactly one** adherence type (`run`) with no phantom
  ski/row/strength/cycle/tennis prescription, carry no bare `or` so `isOptionalLine`
  does not half-cost them, contain no `Nh NN` to inflate `planDurationMin`, and the
  three Tuesday lines carry no `⏱`/`TT` so they are not misread as benchmarks. The
  Tuesday lines deliberately name no duration, so `estTrimp` keeps falling back to
  his historical run median exactly as before. Reverted the package-lock.json churn
  `npm install` introduced. Final diff: **5 lines**, none machine-written.
- consecutive no-change runs before this one: **0** (1 Oct CHANGED, 30 Sep CHANGED).

## 2026-10-01
- adherence: **ski 4x prescribed / 1 done — the ACTION REQUIRED banner is cleared,
  and cleared honestly: he skied.** No ACTION REQUIRED and no WATCH this morning.
  strength 6/2 (→ 5/2 after the edit below) · row 1x/0 · swim 1x/0 · hyrox 3/3 ·
  cycle 2/6 · tennis 8/9 · run 7/7 · benchmarks next 14d: 5km TT Fri 2 Oct,
  roxzone circuit Wed 7 and Wed 14 Oct.
- readiness: HRV **118 vs baseline 91** (+27, the best reading in the 21-day
  window), RHR **40**, **8h25** sleep (deep 132 / rem 77), sleep score 95.
- decision: CHANGED — (1) **re-anchored all three October compromised-ski
  sessions on the 3:57 he actually skied**, and (2) **inverted what those
  sessions measure**: the ski is now the fixed input and the following km is the
  measurement. (3) Removed a phantom strength prescription from today's line.
  (4) Updated the ski `how` string in RACE_GAINS, which still described the
  superseded method.

### The measurement that arrived
**`Indoor Cardio · "SkiErg TT 10min warmup-2290m, 1000m- 3:57 (post tennis)"`,
30 Sep 18:33.** This is the fourth consecutive morning ski was prescribed and the
first it was trained — and it landed on the day yesterday's run re-homed it to
and then explicitly protected by demoting the roxzone baseline behind it. The
intervention worked; record that, because three previous runs re-homed this
session and this is the one that produced a number.

His three ski data points now read:

| | 1000m | Context |
|---|---|---|
| 28 Jul | **3:54** | fresh, standalone |
| 30 Sep | **3:57** | after a 93min straight-sets match (avg HR 119, max 169) |
| Athens | **4:18** | race, station 1, after a single 5:09 run |

- why (1) — **the targets were 13–18s too soft, and I set them myself yesterday.**
  Yesterday's run re-priced 5/12/19 Oct off the raced 4:18 (→ 4:15 / 4:12 / 4:10)
  precisely *because* it had no measurement off tired legs and said so. It now has
  one. He skied **3:57** on legs that had just played a 93-minute match, so three
  sessions were about to ask him for 4:15, 4:12 and 4:10 — all slower than a
  single rep he has already done in a worse state. A target he clears while
  coasting is not a stimulus. New progression, ×3 continuous rather than a single
  rep so the ask sits ~8s off the measured single and tightens: **under 4:05
  (5 Oct) → under 4:03 (12 Oct) → under 4:00 (19 Oct)**, monotonic.
- why (2), and this is the actual block-level call — **the diagnosis of ski was
  wrong in kind, not in degree, and my own re-anchoring yesterday was built on it.**
  The skill's standing prescription is "train the ski compromised, off running
  legs, not fresh." Tested: tennis legs cost him **3 seconds**. Leg fatigue is
  therefore *not* where the race loss lives, and a session built to impose leg
  fatigue on an exercise driven by lats, triceps and trunk is measuring a
  variable with a 3-second range.

  So where do the 21 seconds come from? Not fitness (3:54 fresh), not leg fatigue
  (3:57 tired), and not accumulated race fatigue either — **ski is station 1 at
  Hyrox, straight after one run, when he is the freshest he will be all day.** The
  only remaining explanation is **pacing under race conditions**: he throttled the
  erg to protect the seven runs and seven stations still ahead. That is a rational
  fear and it is the thing to train, and no amount of skiing on tired legs
  addresses it.

  The session that answers it keeps the shape yesterday built — [1000m ski → 1km
  treadmill] ×3 inside the Monday gym trip, which has 9/10 weekday attendance
  behind it — but swaps which half carries the number. The ski is now committed
  and non-negotiable ("do NOT pace the ski to protect the run"); the **km is the
  measurement**, held at **4:15 = Athens R2 pace**, and the question he reports
  back is whether rep 3 still holds it. The run standard stays 4:15 across all
  three weeks on purpose: one variable moves, and it is the ski, so the kms stay
  comparable week to week. If the kms survive on 19 Oct he has *demonstrated* he
  can open Copenhagen at 4:00, and the 20s already sitting in RACE_GAINS and the
  3:58 in STATION_TARGETS become evidence instead of hope.
- why I did NOT move STATION_TARGETS / RACE_BUDGET / RACE_GAINS `sec` values:
  **the target was already 3:58 and the gain already 20s.** The TT validates those
  numbers, it does not move them, and inventing a faster target off one post-match
  rep would be exactly the over-extrapolation that priced Athens at 4:08. The one
  thing I did change is the ski `how` string, which read "3:54 fresh vs 4:18 raced
  — train it off running legs" and is now the superseded method the schedule no
  longer asks for; leaving it would have made the RACE tab contradict the plan.
- why (3) — **today's line was generating a strength prescription out of a
  sentence saying strength had moved away.** "the UPPER-only strength that lived
  here moved to Wednesday's gym trip" tripped `adherence.py`'s
  `strength|sled|lunge|...` matcher, so 1 Oct counted as a sixth prescribed
  strength session on a day whose actual prescription is "easy spin, a walk, or
  full rest". Reworded to "gym work": strength now reads **5 prescribed / 2 done**
  and today is costed as the easy day it is. Fixed in the plan text rather than by
  widening `REJECTED` in adherence.py, because that regex is deliberately narrow
  and loosening it to catch "moved to" would start eating real prescriptions.
- benchmarks, checked against where he actually trains: **5km TT Fri 2 Oct is
  safe** — Friday is **9/10** attended since 23 Jul and is reliably a *running*
  day (tempo 3×2km on 25 Sep, Z2 10km 21 Aug, 5km+strides 4 Sep). Roxzone Wed 7
  and Wed 14 Oct sit on **8/10** Wednesdays, the circle night. Nothing needs
  moving ahead of slipping, so today adds no load before tomorrow's benchmark:
  HRV 118 is a green light, but the right use of a green light the day before his
  first-ever running benchmark is to arrive fresh.
- phase: **Base I stays, and the Base I floor stays at 350.** Worth stating
  explicitly because yesterday set that floor while `hrvBaseline` was depressed at
  82 — but it was justified on TRIMP history (only 4 of his last 10 weeks cleared
  380, longest run of consecutive 380+ weeks is two, Base I asks for six), not on
  HRV, so the baseline's recovery does not reopen it. Bands are otherwise
  realistic against what he is absorbing; no TAPER_PLAN edit.
- weakness: **ski's ranking is unchanged but its mechanism is now known.** Still
  the weakest element at top 29.8%; running still the weakest block (top 27.7%);
  roxzone still the cheapest seconds (top 19.8%) and still untested — Wed 7 Oct is
  the first ever measurement of it. What moved is that ski has gone from "needs
  fatigue resistance" to "needs permission to commit", which is a cheaper fix.
- physiology: **`hrvBaseline` 82 → 91 in one day, and this is a recovery, not a
  shift.** 91 is exactly where it sat on 11 Sep, before the 19 Sep illness spike
  (HRV 39, RHR 56); the intervening 72 → 82 readings were that single day washing
  through Garmin's rolling window, and it has now washed out. Last seven HRV are
  90/117/60/65/106/100/118, mean **94** against baseline 91 — his usual wide
  oscillation, now around a restored centre. RHR across the 21 days is **38–42
  every day except that one 56**, today 40, comfortably inside his 38–46 range.
  No excursion to act on, and nothing here argues for backing off.
- watching:
  - **strength, 5 prescribed / 2 done.** Not flagged (two were trained) and
    day-granular matching overstates it — 28 Sep was a blank day and he did train
    strength on 21 and 30 Sep. Leaving it. **What would make me act:** a third
    week with no logged strength session, or the count reaching 3+ prescribed
    with 0 done inside a 21-day window — either would mean moving the Monday
    strength block onto the Wednesday circle night rather than asking for it again.
  - **row, 1x prescribed / 0 done** (the 28 Sep ROW 1000m TT, on a day he logged
    nothing at all). Below the WATCH threshold and deliberately not re-homed: row
    is top 11.4%, a strength to defend rather than chase, and re-homing it would
    put a second standalone erg benchmark back on the board after that pattern
    went 0-for-3. **What would make me act:** if it is prescribed once more it hits
    2x/0 and becomes a WATCH, and at that point it goes inside the Wednesday
    circle as the alternate, never as a trip of its own.
  - **swim, 1x prescribed / 0 done** (22 Sep, Aerobic Reset). Not in the Base I
    template at all, so it will age out of the window on 13 Oct without action.
  - **the 28 Sep benchmark line still prints NOTHING LOGGED** and will keep doing
    so until it ages out around 19 Oct. That day really was blank; rewriting an
    elapsed day would falsify the record. Do not re-home it — the ski half is
    now measured and the row half is covered above.
- for tomorrow's Routine: the 5km TT is tonight's business, so **the first thing
  to check is whether a ~5km hard run synced on 2 Oct.** If it did, that is the
  first running benchmark he has ever set and the three Tuesday threshold targets
  (4:15 / 4:14 / 4:12) should be re-derived off it the way the ski targets were
  re-derived today — running is the weakest *block* (top 27.7%) and those
  paces are currently inherited, not measured. If it did not land, read it against
  Friday's 9/10 attendance before concluding anything: one miss on his most
  reliable weekday is a miss, not a pattern.
- verification: `npm run build` clean (422.17 kB); **9/9** patch anchors;
  `update.patch()` round-tripped against a copy of the real src/App.jsx **and**
  against pristine origin/main as a control — both identical on all 13 checks:
  wellness rows patch and keep their **4-space indent**, no daily rows lost
  (119 → 119), weight upserts inside its own array without touching vo2max, CSV
  upserts, and SCHEDULE / TAPER_PLAN / RACE_GAINS / STATION_TARGETS / RACE_BUDGET
  survive byte-identical. Checked every line I wrote against the accident-prone
  regexes, and **caught two defects in my own text doing it**: (a) "off a 1h33
  tennis match" made `planDurationMin` return **93** instead of 60, because the
  `(\d+)h(\d{1,2})` branch is tested before the plain-minutes branch and would
  have inflated 5 Oct's TRIMP by 55%; and (b) the word *tennis* in a gym line
  let `SESSION_MATCHERS` mark the session satisfied by a tennis activity, since
  tennis is matched first. Both reworded to "93min singles match". Also confirmed
  the three Monday lines carry no `⏱`/`TT`/"time trial" so they are not misread
  as benchmarks, and no bare `or` so `isOptionalLine` does not half-cost them;
  today's line keeps "your call" and is correctly optional. Reverted the
  package-lock.json churn `npm install` introduced. Final diff: **5 lines**, none
  of them machine-written.

## 2026-09-30 · intra-day (not a Routine firing — user asked at ~16:10 local)
- trigger: he played the 13:45 fixture (Andrius Jonaitis, **6/3 6/3, 1h33, avg HR
  119, max 169, ~76 TRIMP**), reported it was harder on the legs than expected,
  and asked what to do with a gym trip two hours out.
- read: **the fatigue is local and eccentric, not systemic.** An avg HR of 119 is
  zone B — barely an aerobic session — but a straight-sets match with spikes to
  169 is a lot of decelerations. HRV 100 vs baseline 82, RHR 39, 8h31 sleep all
  say he is not tired; his legs are. So the answer is to fence off the legs, not
  to back off.
- decision: CHANGED — (1) ski TT **stays on today**, reworded for tired legs and
  re-paced; (2) Thursday's UPPER-only strength **pulled forward** into today,
  since he is in the gym anyway; (3) today's roxzone baseline **moved to Wed
  7 Oct**, which now reads as the baseline; (4) tonight's circle marked optional
  with the eccentric work fenced off; (5) Thu 1 Oct becomes the easy day.
- why keep the ski TT on beaten-up legs: ski is lats, triceps and trunk with a
  hip drive — the least leg-dependent thing in his toolkit — and it is four
  minutes. There is also a positive case, not merely a tolerable one: the fresh
  **3:54** of 28 Jul is *precisely the number that did not transfer* (it priced
  Athens at 4:08; he raced **4:18**). A split off tired legs is closer to how ski
  actually arrives in a race and is therefore **more** useful for pricing the
  October compromised sessions than another fresh number. This morning I anchored
  those targets on the raced 4:18 because I had no measurement; tonight replaces
  the inference with one. Pacing is written as 1:56–1:58/500m with an explicit
  "do not chase 3:54", because a blown TT at 600m yields a number worse than none.
- why the upper pull is the best add: zero leg cost, and **ski (top 29.8%) and
  sled pull (top 18.6%) are two of his three weakest elements sharing one prime
  mover.** It was already written for Thursday, so nothing is invented — it just
  happens on the day he is standing in the gym. Thursday then becomes genuinely
  easy, which is a better run-up to Friday's 5km than a second strength session
  in three days.
- why the roxzone moved rather than stayed: 8× [station 30s → jog 100m] is the
  most leg-eccentric thing on the board and it is a *baseline* — nothing is
  riding on the number, and 7 Oct already carried the next one. Friday's 5km TT
  is his first ever running benchmark, on his weakest block against the field
  (top 27.7%), and protecting it outranks a baseline that costs nothing to defer
  by a week. Also fixed an inconsistency the move exposed: today said "target
  0:32" while 7 Oct said "vs 0:36". Athens averaged **0:43** per transition
  (5:47 over 8), so 7 Oct now states that and calls 0:36 the number to beat.
- what I did NOT do: no change to TAPER_PLAN, RACE, STATION_TARGETS,
  RACE_BUDGET or RACE_GAINS. The Base I floor stays at the 350 set this morning.
  I did not add load to chase the week's number — removing the roxzone and
  half-costing the circle lowers today's projection, which is correct: the
  constraint tonight is his legs, not his week.
- adherence after the edit: strength 4 → **5 prescribed / 2 done** (today now
  carries a strength-matching line) and run 8 → 7 prescribed (the removed
  roxzone line was matching `\bjog\b`). Both moves are honest. Note the
  benchmark check now prints "something logged" against today's ski TT — that is
  day-granular, and what is logged is the tennis, not a ski. Pre-existing
  behaviour, untouched, but do not read it as the TT having landed.
- verification: `npm run build` clean (420.12 kB); 9/9 patch anchors;
  `update.patch()` round-tripped against a copy of src/App.jsx and against
  pristine origin/main — identical, SCHEDULE and TAPER_PLAN byte-identical
  after patching. Checked both accident-prone regexes on every line I wrote:
  `isOptionalLine` matches a bare `\bOR\b`, so the ski TT and the upper pull are
  verified NOT optional while the circle and Thursday deliberately are; and
  `adherence.py`'s `\bTT\b` is kept out of the upper-pull line so it is not
  mistaken for a benchmark.
- also learned, worth carrying: **`calendar_sync.py` writes into SCHEDULE.** A
  `mode=poll` sync removed today's `{type:"tennis",cal:true,...}` line while this
  session was open. It only ever touches `cal:true` tennis objects and never
  reads or moves hand-authored lines, so hand edits are safe — but SCHEDULE is
  not a purely hand-written constant, and a future run should not be surprised to
  find a tennis line appear or vanish under it.
- for tomorrow's Routine: today's ski TT is now measured or it is not. If a
  ski-titled activity synced, **re-derive the three compromised targets (5, 12,
  19 Oct) off it** rather than off my 4:18 anchor, and read it against a
  post-tennis context, not against the fresh 3:54 — anything near 4:00–4:05 on
  these legs is a good number. If nothing synced, yesterday's standing
  instruction holds: take ski out rather than re-home it a fifth time.

## 2026-09-30
- adherence: **ski 4x prescribed / 0 done — ACTION REQUIRED** (23, 24, 28 and
  **30 Sep**) · row 1x/0 · strength 4/2 · hyrox 3/3, cycle 1/5, tennis 8/8,
  run 8/8, swim 1/1 · benchmarks next 14d: 5km TT Fri 2 Oct, roxzone circuit
  Wed 7 and Wed 14 Oct. **Read the fourth ski date carefully: 30 Sep is TODAY**
  and this fires at dawn, so it is an unstarted session, not a miss. The honest
  elapsed count is 3x/0 — and all three elapsed dates were already resolved by
  yesterday's run, which re-homed the TT onto today. At `--days 45` ski reads
  **4 prescribed / 2 done, "short by 2"**, because both real ski sessions are
  August.
- **so the instrument cannot go quiet for two more weeks, and that is not a bug
  to fix.** 23 and 24 Sep are elapsed days in SCHEDULE; rewriting them would
  falsify the record, so ACTION REQUIRED will keep firing until they age out of
  the 21-day window on 14/15 Oct. The only thing that clears it honestly is a
  logged ski activity. Whoever runs tomorrow: do not re-home the TT a fifth
  time just because the banner is still red — check whether 30 Sep produced a
  ski-titled activity first, and if it did not, follow yesterday's instruction
  and take ski out rather than move it again.
- readiness: HRV **100 vs baseline 82** (+18), RHR **39**, **8h31** sleep
  (deep 121 / rem 116 / light 274, awake 1), sleep score 95. His best readiness
  of the week, on the one day of the week that carries a benchmark. Nothing in
  the state argues for backing off, and the Monday degrade rule's threshold
  (~15 below baseline) is nowhere near.
- decision: CHANGED — (1) demoted today's roxzone baseline **behind** the ski
  TT; (2) moved the compromised ski off **Tue 13 Oct** into the Mon 12 Oct gym
  trip that already exists, Tuesday becomes a plain threshold run; (3) re-priced
  all three compromised-ski targets off the **raced 4:18** instead of the fresh
  3:54; (4) Base I floor **380 → 350**. Today's ski TT line is untouched, on
  purpose — it is yesterday's experiment and I am not muddying it.
- why — **today asks for four things and only one of them matters.** Wed 30 Sep
  carried a calendar-fixed tennis at 13:45, the ski TT, the Hyrox circle, and a
  brand-new 15min standalone roxzone baseline. Two of those are unproven ⏱ asks
  competing for the same evening at Gym+, and stacking discrete asks is the
  exact shape that went 0-for-3 on the erg. The roxzone baseline is the one with
  nothing riding on it: it is **already written for Wed 7 Oct** and loses nothing
  by waiting a week, whereas three October sessions are still priced off a 28 Jul
  number until the ski TT lands. So the roxzone line now says so in as many
  words — run it, but after the ski, and if only one extra thing fits it is the
  ski. No load added or removed; a precedence, not a rewrite.
- why — **week 6 was the last erg trip in the plan, and yesterday's own evidence
  condemned it.** Yesterday moved the Thursday ski sessions to Monday on a
  by-weekday count of gym attendance (Thu 0/8, Mon 4/9) and then left **Tue
  13 Oct** — "KEY RUN · compromised: [1000m ski → 1km] ×3 · evening" — sitting
  on a weekday that reads **2/9**, barely better than the Thursday it rejected.
  Meanwhile Mon 12 Oct was already a gym day and was the only Base I Monday
  *without* an erg on it. Merging them costs nothing and makes all three Base I
  weeks one shape: **Monday is the gym-and-erg day, Tuesday is the key run.**
  Mon 12 Oct is now GYM 60min (compromised ski first, then strength 30min,
  keeping the wall-balls-off-a-treadmill-run content, which is the skill's
  prescribed fix for the one station that went backwards at Athens), and Tue
  13 Oct is threshold 4×1km @ 4:14, which also fixes an incoherent progression —
  the three Tuesdays now read 3×4:15 → 4×4:14 → 4×4:12 instead of 4:15, a
  compromised erg session, and 4:12. **Every erg exposure in the plan is now
  bolted to a session archetype with attendance behind it. There is no
  standalone erg trip left anywhere.**
- why — **the compromised ski targets were built on the wrong number.** Mon 5 Oct
  asked 4:05, Mon 19 Oct 4:00, Tue 13 Oct 4:20 — all derived from the fresh
  **3:54** of 28 Jul, and two of them are *faster than anything he has ever
  skied except that single fresh TT*, asked for three times continuously off
  running legs. The Athens plan already ran this experiment: it took the same
  3:54, asked **4:08**, and he raced **4:18**. A fresh number over-predicts by
  ~10s even for one rep in a race where ski comes after a single run. So the
  progression is re-anchored on the 4:18 he actually raced: **4:15 (5 Oct) →
  4:12 (12 Oct) → 4:10 (19 Oct)**, monotonic, and the 5 Oct line now says where
  the number comes from so he can trust it. This holds whatever today's TT
  reads: applying a fresh split as a compromised target is the error, not the
  size of the split.
- why — **the Base I floor was a floor he will fail.** Weekly TRIMP, last ten
  weeks: **476, 363, 421, 472, 289, 250, 156, 447, 357**, and this week is at
  **50 after two elapsed days** (28 Sep blank, 29 Sep tennis only). Only 4 of
  those 10 weeks cleared 380, and his longest run of consecutive 380+ weeks is
  **two** (421 then 472, 10–23 Aug) — Base I asks for **six**. A floor he misses
  every week is not just cosmetic: `adaptPlan` scales sessions **up** by as much
  as 1.25× whenever the week projects under `lo` and readiness is ≥7, so a
  too-high floor makes the engine push hardest on exactly the weeks two days
  went missing — today being one. Floor moves to **350**, mid 405, still above
  the 357 he just closed. `hi` stays **460** so a good week is not capped. Six
  weeks at 350–460 is a plan describing him; 380–460 was describing a wish.
- phase: Base I is otherwise right and stays. The content question — "do the
  next two weeks need different sessions rather than smaller ones?" — is what
  change (2) answers: the sessions were not too big, one of them was on the
  wrong day.
- weakness: nothing has moved. Ski is still the weakest element (top 29.8%),
  running still the weakest block (top 27.7%), roxzone still the cheapest
  seconds (top 19.8%). No new race, sim or TT since Athens, so STATION_TARGETS,
  RACE_BUDGET and RACE_GAINS are untouched — there is no evidence to move them
  with, and today's TT is the first that would be.
- physiology: nothing to act on. HRV 100 today; the last seven days are
  59/90/117/60/65/106/100, **mean 85 against baseline 82** — his usual wide
  oscillation around baseline, not a shift. `hrvBaseline` 91 (11 Sep) → 72
  (25 Sep) → 84 → 85 → 83 → **82** is still the 19 Sep illness spike (HRV 39,
  RHR 56) washing out of Garmin's 7-day window. RHR across 21 days is **38–42
  every day except that one 56**, well inside his 38–46 range. No excursion.
- verification: `npm run build` clean (419.17 kB); 9/9 patch anchors present;
  `update.patch()` round-tripped against a copy of the real src/App.jsx **and**
  against pristine origin/main as a control — both identical: daily and sleep
  rows replace with their 4-space indent intact, weight upserts inside its own
  span with vo2max untouched, CSV upserts, 118 daily and 117 sleep rows both
  sides, SCHEDULE and TAPER_PLAN byte-identical afterwards. Used the nested
  `wellness["sleep"]` shape, per yesterday's note. Also caught and fixed two of
  my own drafts before they shipped: "3:54 fresh TT" in the 5 Oct line made
  `adherence.py` list that session as a benchmark (its regex matches `\bTT\b`),
  and a first draft of the TAPER_PLAN note claimed he had never held two
  consecutive weeks above 380 — 421 then 472 in August is exactly that. It is
  three he has never strung together.
- watching:
  **Today is still the whole test, and demoting the roxzone does not change
  that.** Ski prescribed at the venue that certainly has an erg, on his most
  attended session, as four minutes of work, with everything else on the day
  explicitly told to yield to it. If no ski activity syncs, the theory is out of
  excuses and yesterday's instruction stands: remove ski from the plan rather
  than re-home it a fifth time, and put the time into running.
  **The three October ski splits are provisional until the TT lands.** They are
  anchored on the raced 4:18 now, which is defensible with no new data at all,
  but if today reads materially off 3:54 — either way — the next run should
  re-derive them from it. A TT slower than ~4:10 fresh would mean 4:15
  compromised is too hard and the whole Base I ski progression needs loosening.
  **Strength 4/2**, carried from yesterday unchanged: act if **Mon 5 Oct** syncs
  with neither a strength nor a ski activity — that is the merged Monday session
  failing on its first attempt. Mon 12 Oct is now the same shape, so the same
  test repeats a week later.
  **This week's volume**, new: at 50 TRIMP with five days left and a 350 floor,
  the week needs ~300 from Wed–Sat, of which Fri is a 5km TT (short) and Sat is
  optional. It will probably land 250–300, under even the lowered floor. I am
  deliberately not adding sessions to chase it — the shortfall is two blank days
  already spent, and `adaptPlan` will scale what remains. But if week 5 (5–11
  Oct) also closes under 350, that is two Base I weeks under a floor I just
  lowered, and the honest response then is to question the phase, not the band
  again.
  **The Wednesday circle's day**, carried unchanged: landed Wed 16 Sep, SUN
  20 Sep, FRI 25 Sep, Wed 23 Sep blank. Trigger stays at two more off-Wednesday
  landings inside three weeks. Today it matters less than it did — the ski TT is
  written to survive the circle not running — but the three `note:true` ski
  preference lines on 7, 14 and 21 Oct still depend on it.
- consecutive no-change runs before this one: **0** (29, 28, 27 and 26 Sep were
  all CHANGED runs).

## 2026-09-29
- adherence: **ski 3x prescribed / 0 done — ACTION REQUIRED** (23, 24, 28 Sep)
  at 21 days · row 1x/0 · strength 4/2 · hyrox 2/3, cycle 1/5, run 8/8, tennis
  8/7, swim 2/1 · benchmarks next 14d: ski TT + roxzone circuit Wed 30 Sep,
  5km TT Fri 2 Oct, roxzone circuit Wed 7 Oct. **Yesterday's marker resolves
  badly: Mon 28 Sep is a completely blank day.** No activity of any kind — the
  GYM trip carrying both erg benchmarks did not happen, and 27 Sep was blank
  too. That is the trigger 27 Sep set verbatim ("the 28 Sep gym trip syncs
  without a ski-titled activity"), and 28 Sep is now a real elapsed miss, not
  an artifact of the counter's window.
- **the instrument was lying again, and this one is bigger than the row
  double-count.** `adherence.py` matched ski with `\bski\b`. His Garmin titles
  spell it as one word: **"DL + Skierg 1km, 200 lunges, 100 burpees" (16 Aug)**
  and **"Hyrox: 4 runs + skierg, sled push, sled pull" (29 Aug)**. `\bski\b`
  cannot match "skierg", so **both of his real ski sessions have been invisible
  to every morning run**, and the claim "not one ski erg in five months of
  Garmin data" — asserted in four SCHEDULE lines and in the week-3 comment
  block, and repeated in three PLAN_LOG entries — **is false**. Pattern is now
  `\bski(?:erg)?\b` on both the plan and activity sides ("Inline Skating" still
  does not match: ska != ski). With it fixed, `--days 60` reads **ski 3
  prescribed / 2 done, "short by 1"**, not NEVER DONE. The 21-day window is
  unchanged at 3/0 because both instances are August, so ACTION REQUIRED
  correctly still fires — but the diagnosis inverts.
- readiness: HRV **106 vs baseline 83**, RHR 41, 8h32 sleep. Green.
- decision: CHANGED — (1) fixed the ski matcher; (2) re-homed the lost 1000m
  ski TT onto **Wed 30 Sep at Gym+**; (3) moved the two Thursday compromised-erg
  sessions (8, 22 Oct) into that week's **Monday gym trip**, Thursdays become
  Z2 runs; (4) corrected the false "zero ski erg" claim everywhere it is
  written; (5) one TAPER_PLAN note. No load added, no session invented.
- why — **he is not refusing to ski, he is refusing to make a trip of it.** Both
  real ski sessions were bolted to something already on the calendar: 1km inside
  a strength session (16 Aug), and inside a Hyrox session (29 Aug). Every failed
  prescription was a trip whose *purpose* was the erg — standalone mornings
  23 and 24 Sep, and the dedicated 28 Sep GYM trip whose entire content was two
  erg TTs. That archetype is now **0-for-3**. Yesterday's fix (attach ski to
  circle night as a `note:true` preference) had the right instinct but no
  teeth: a note is free, unmeasured, and cannot carry a benchmark. So the ski
  TT is now a **prescribed** line on Wed 30 Sep, first thing at Gym+, worded to
  go even if the circle does not run — four minutes of work, and 29 Aug is
  direct precedent for skiing inside that session. This is the highest-
  probability ski exposure available and it is tomorrow, not next week.
- why — **Thursday, hard evidence.** Over the last eight weeks (3 Aug–29 Sep)
  he trained **7 of 8 Thursdays** but entered a gym on **0 of 8**. Thursdays are
  outdoor runs and tennis (10 Sep run, 17 Sep run+cycle, 24 Sep tennis). Two
  compromised ski→run sessions sat there (8, 22 Oct) needing an erg. By weekday,
  indoor-or-gym goes **Mon 4/9, Wed 3/8, Sat 3/8, Sun 3/8, Tue 2/9, Fri 2/8,
  Thu 0/8** — Monday is his best gym day and is where the strength already is,
  so the ski moved there and merged with it rather than stacking: Mon 5/19 Oct
  become "GYM 60min · compromised ski FIRST [1000m ski → 1km treadmill] ×3,
  then strength 25min", strength trimmed from 45 to 25min so the week's volume
  is roughly flat. Thu 8/22 Oct become the Z2 runs he does anyway. **Note I did
  not retreat from Monday** despite 28 Sep being blank: 28 Sep failed as an
  *erg-only* trip, and Monday's record as a *gym* day (7 Sep swim+strength,
  21 Sep strength, 4/9 overall, trained 8/9) is the best in the week. 16 Aug is
  the precedent for exactly this shape — ski inside a strength session.
- why — **28 Sep was partly physiological, and I am saying so rather than
  reading it purely as disobedience.** HRV was 60 on 27 Sep and 65 on 28 Sep,
  both ~20 below the then-baseline of 85, after training 24/25/26 Sep. The
  written degrade rule said "ski TT only, drop the row" on that morning; he did
  neither, but two rest days on those numbers is a defensible athlete decision.
  It does not rescue the benchmark — three-times deferred is three-times
  deferred — but it does mean the fix is *where* the ski lives, not *whether*
  he will train.
- row: **the 1000m row TT is retired, not rescheduled.** It has now been
  deferred three times and it was never worth much: row is **top 11.4%**, a
  strength the skill says to defend rather than chase, and the circle rows. No
  standalone row is prescribed anywhere in weeks 4-7. Its 1x/0 in the window is
  the dead 28 Sep line and will age out on 15 Oct.
- phase: unchanged. Base I (380-460) opened 28 Sep and is two days old, one of
  them blank — too early to judge the band. The 21-27 Sep week closed at 357
  against 280-400, and 380 is a 6% step from that and well under the 421-476 he
  held through August, so the bands stay realistic. Only the Base I **note**
  changed, because its premise moved: "gym+erg on Mon" is now "erg only inside
  the Mon gym trip or circle night, never a trip of its own".
- physiology: nothing to act on. HRV 106 today against baseline 83; the last
  seven days are 105/59/90/117/60/65/106, **mean 86 against baseline 83** —
  oscillation around baseline with a wide sd, which is his normal shape, not a
  shift. `hrvBaseline` has drifted 91 (11 Sep) -> 72 (25 Sep) -> 84 -> 85 ->
  **83**, and that whole swing is the 19 Sep illness spike (HRV 39, RHR 56)
  moving through Garmin's 7-day window; it is not a sustained decline. RHR over
  21 days is **38-42 every single day except that one spike**, comfortably
  inside his 38-46 range. No excursion.
- verification: `npm run build` clean (418.05 kB); all 9 patch anchors present;
  `update.patch()` round-tripped against a copy of the real src/App.jsx and
  against pristine origin/main as a control — daily and sleep rows replace with
  their 4-space indent intact, weight upserts inside its own span, CSV upserts,
  no daily/sleep rows lost (117/116 both sides), and SCHEDULE comes back
  byte-identical.
- watching:
  **Wed 30 Sep is now the whole test, and it is decisive.** If a ski activity
  syncs tomorrow, the "bolt it to something he already does" theory is proven
  and the Oct structure stands. If it does not — ski prescribed at the one
  venue that certainly has the erg, on his most-attended session, as four
  minutes of work — then the theory is wrong and **the next run should take ski
  out of the plan rather than re-home it a fifth time**, and redirect the time
  to running, which is his weakest *block* against the field (top 27.7%) and
  needs no equipment. Say that plainly: four re-homings is enough.
  **The 28 Jul 3:54 is still the only ski number the block owns.** Every
  compromised target downstream (4:05 on Mon 5 Oct, 4:20 on Tue 13 Oct, 4:00 on
  Mon 19 Oct) is built on it and it is two months old. Whoever runs after
  Wed 30 Sep: read the TT before trusting those three numbers, and reset them
  off the new one if it comes in slower than ~4:00.
  **Strength 4/2.** Both missed Fridays (18, 25 Sep) plus the blank 28 Sep. It
  now sits on Mondays only, merged with the ski. I will act if Mon 5 Oct syncs
  without a strength or ski activity — that is the merged session failing on
  its first attempt, and it would mean Monday has stopped being a gym day.
  **A pre-existing `update.py` quirk, recorded not acted on:** `patch()` reads
  sleep stages from `wellness["sleep"]`, not flat keys. My first round-trip
  passed flat keys and the sleep row silently no-op'd rather than erroring.
  Behaviour is identical on pristine origin/main so it is not a regression and
  I have not touched it, but a future harness should use the nested shape or it
  will believe sleep patching is broken when it is not.
  **The Wednesday circle's day**, carried: landed Wed 16 Sep, SUN 20 Sep, FRI
  25 Sep, Wed 23 Sep blank. Trigger unchanged at two more off-Wednesday
  landings inside three weeks. This matters more again today — the ski TT is
  written to survive the circle not running, but the three `note:true` ski
  preference lines on 7, 14 and 21 Oct do depend on it.
- consecutive no-change runs before this one: **0** (28, 27 and 26 Sep were all
  CHANGED runs).

## 2026-09-28
- adherence: **ski 3x prescribed / 0 done — ACTION REQUIRED** (23, 24 and
  **28 Sep**) · row 1x / 0 · hyrox 2/3, strength 4/3, swim 2/2, cycle 1/5,
  tennis 7/7, run 7/8 · benchmarks in the next 14d: roxzone circuit Wed 30 Sep,
  5km TT Fri 2 Oct, roxzone circuit Wed 7 Oct. **Read the third ski date
  carefully: 28 Sep is TODAY**, and the Routine fires at dawn, so it is an
  unstarted session, not a miss. The same is true of row's only prescription.
  The honest elapsed count this morning is ski 2x/0 — the WATCH that yesterday
  already resolved structurally. Over `--days 90` the counts are identical
  (SCHEDULE only reaches back to 14 Sep), and there row reads 2 done: he rows,
  he has simply not skied.
- readiness: **today's wellness row has not landed yet** — `daily` ends at
  27 Sep. LAST_DATA is 2026-09-28T06:07Z, under an hour old, so the sync is
  healthy; Garmin just had not written the overnight HRV when the full run
  fired. Last read: HRV 60 vs baseline 85, RHR 38, 7h56 sleep with 205min deep.
  The Monday session's degrade rule is phrased against what he reads on the
  watch this morning, so it still works without this.
- decision: CHANGED — put the ski instruction back on the **Wednesday Hyrox
  circle** (30 Sep, 7, 14 and 21 Oct) as a `note:true` line. Nothing else
  touched: no day moved, no session added or removed, no load changed, and the
  week he is one day into is structurally as he found it.
- why: the 26 Sep rebuild's stated principle was right — *a session archetype
  with no instance in the record is a wish* — but check where ski actually
  landed. Of the four remaining ski touches (Mon 28 Sep TT, Thu 8 Oct, Tue
  13 Oct, Thu 22 Oct), **three are standalone erg trips to the gym**, which is
  the exact archetype that went 0-for-2 on 23 and 24 Sep. Meanwhile the one
  ski prescription that *was* attached to a session with a real attendance
  record — the 23 Sep circle line, "pick SKI over row wherever the block
  offers a choice" — was deleted by that rebuild and never replaced. The
  circle is the most reliably attended thing in his week: **hyrox reads 3 done
  against 2 prescribed at 21 days, 8/2 at 45, 10/2 at 90**, and it landed
  16 Sep, 20 Sep and 25 Sep. It also contains a ski station. Re-attaching the
  preference there costs nothing, adds no load, and is the single highest-
  probability ski exposure in the plan. Ski is worth this: **top 29.8%**, his
  weakest element, **3:54 fresh on 28 Jul against 4:18 raced at Athens** — 24s
  he has already proven he owns — and **zero ski-erg activities in five months
  of Garmin data**.
- also — measurability: the note tells him to put the word *ski* in the
  circle's Garmin title if he takes the ski option. Erg work buried inside an
  activity logged as "Hyrox circle" is invisible to the matcher, which is part
  of why ski looks untrained. `note:true` is deliberate: this redirects a
  choice inside a session he is already doing, so it must not be costed as
  load by `adaptPlan` or counted as a fifth prescribed ski by `adherence.py`.
  Verified against both — `isInfoLine` returns true on `s.note` before
  anything else, and `planned_days` drops a text whose line carries
  `note:true` within 24 chars.
- a change I started and abandoned, recorded because it will tempt the next
  run: I began patching `adherence.py` so the prescribed window ends at
  *yesterday*, on the reasoning that a session prescribed for today cannot
  have been missed at 06:07 — and that is what turned ski from 2x (WATCH) into
  3x (ACTION REQUIRED) this morning, on the very day the new structure was
  first due to run. The edit was blocked, and it was right to block it.
  Narrowing what the counter counts, on the morning the counter fires at me,
  is how a future genuine 3x goes unseen; and this Routine is explicitly told
  not to re-derive these inputs by eye. The correct answer was to leave the
  alarm loud and resolve it in the plan, which is what the change above does.
  **Note for tomorrow: "28 Sep" will still sit in that miss list, and from
  tonight it is a real data point rather than an artifact.** 23 and 24 Sep age
  out on 15 Oct.
- phase: unchanged. Aerobic Reset closed yesterday, Base I (380-460) opens
  today as written. The 21-27 Sep week finished at **357 TRIMP** inside its
  280-400 band, so Base I's 380 floor is a 6% step up and well under the
  421-476 he held through August. Bands are realistic against what he is
  absorbing. No TAPER_PLAN edit.
- physiology: nothing to act on. 7-day HRV means run **84.7 (7-13 Sep) → 97.7
  (14-20) → 87.1 (21-27)** — the middle figure is inflated on one side and
  deflated on the other by the 19 Sep illness day (HRV 39, RHR 56), so this is
  oscillation around a baseline of 85, not a sustained shift. RHR has been
  **38-42 every single day of the last 21 except that one spike**, inside his
  38-46 range with room to spare; yesterday's 38 is his floor, not an
  excursion. I could not read today's numbers — see readiness above — so this
  judgement is made on data through 27 Sep and should be re-read tomorrow.
- watching:
  **The Thursday compromised ergs — this is my live trigger.** Thu 8 Oct and
  Thu 22 Oct ask for `[1000m ski → 1km run] ×3` at Gym+. His last three
  Thursdays were tennis (24 Sep), cycling + running (17 Sep) and running
  (10 Sep): **zero gym trips on a Thursday in the visible record**, while
  Monday and Friday carry his strength work (9, 21, 25 Sep). I did not move
  them today because yesterday's trigger comes first and the evidence is three
  Thursdays deep. I will move them onto Monday or Friday if Thu 8 Oct syncs
  without a gym or ski activity — one failure is enough, because the archetype
  is already 0-for-2.
  **The 28 Sep TT result, carried from yesterday and still the priority.** The
  compromised ski targets downstream — 4:05 on Thu 8 Oct, 4:20 on Tue 13 Oct,
  4:00 on Thu 22 Oct — are all built off the 28 Jul 3:54. If tonight's TT comes
  in slower than ~4:00 those three numbers are fiction and must be reset off
  the new TT. Whoever runs tomorrow: read the TT before trusting those lines.
  **The Monday double**, carried: if the row TT is deferred a third time it
  becomes 3x500m inside the circle. A red-morning skip under the degrade rule
  counts as a defer, not disobedience.
  **The Wednesday circle's day**, carried unchanged: it landed Wed 16 Sep, SUN
  20 Sep, FRI 25 Sep. The tally of off-Wednesday landings since 26 Sep still
  stands at zero new; the trigger is two more inside three weeks. Note this
  now matters more than it did — today's change hangs the ski prescription on
  that session, so if the circle stops running, ski loses its one attached
  home and the standalone ergs are all that is left.
  **Tue 29 Sep** has an unconfirmed 18:00 tennis and an evening Z2 run on the
  same day. Left alone deliberately: `adaptPlan` trims the written session
  against unplanned load on every page load, and that is its job, not mine.
- consecutive no-change runs before this one: 0 (27 Sep was a CHANGED run, and
  26 Sep before it).

## 2026-09-27
- adherence: ski 2x prescribed / 0 done (WATCH) · everything else on track ·
  **row's "NEVER DONE (1x)" was a measurement bug and is now gone** — see below ·
  benchmarks in the next 14d: ski+row TT Mon 28 Sep, roxzone circuit Wed 30 Sep,
  5km TT Fri 2 Oct, roxzone circuit Wed 7 Oct
- readiness: HRV 60 vs baseline 85, RHR **38** (his floor), sleep 7h56 with
  205min deep. Sunday, already a full rest day.
- decision: CHANGED two things, both small: (1) fixed a double-count in
  `adherence.py`; (2) reversed the order of the two erg TTs on Mon 28 Sep and
  gave the session a degrade rule. Weeks 4-7 otherwise untouched — yesterday
  rebuilt them and nothing since contradicts that.
- why (1) — the instrument was lying: the Hyrox-circle line on 23 Sep reads
  "pick SKI over row wherever the block offers a choice". One line, one
  session, but `report()` tested every type pattern against it independently,
  so it scored as a prescribed **ski** session AND a prescribed **row**
  session. That single mention is **the entirety** of row's "NEVER DONE (1x
  prescribed)" — a miss on a day he was only ever asked to do the circle,
  which he did (25 Sep). `adherence.py` now strips a type named as the
  rejected side of a choice ("over/instead of/rather than <type>") before
  matching. Exactly one line in App.jsx matches that pattern today, the
  intended one; row drops out, ski correctly stays at 2x because both 23 and
  24 Sep did ask for ski. This matters beyond one phantom: the Routine is
  ordered to trust these two inputs and not re-derive them by eye, so a
  counter that inflates on a coaching aside will eventually either trip
  ACTION REQUIRED on a session that was never prescribed, or teach a future
  run that the counter is noise and to ignore a real 2x. **Note for tomorrow:
  the row line disappearing from the report is my edit, not new adherence.**
- why (2) — the Monday session measured the wrong thing: it read "10min easy
  erg, ⏱ ROW 1000m TT, 10min easy, ⏱ SKI 1000m TT (expect ~3:54)". The ski TT
  is the one number the whole Copenhagen block turns on — ski is his weakest
  element at **top 29.8%**, and the gap that defines the block is **3:54 fresh
  (28 Jul) vs 4:18 raced at Athens**, ~24s he has already proven he owns. That
  comparison is only meaningful against a *clean fresh* reference, and a
  maximal 1000m row is ~3:20-3:30 of near-max work that 10min easy does not
  clear. Running ski second guaranteed a slow number he would then read as
  "ski got worse" when it is just order of operations. Ski now goes first; row
  second, with the line telling him to read a slow row as the ski tax. Row is
  top **11.4%** — a strength the skill says to defend, not chase — so it is
  the right one to degrade. Added: *if HRV is more than ~15 below baseline
  this morning, do the ski TT only and drop the row.* Phrased against baseline
  rather than an absolute number so it cannot go stale as hrvBaseline moves.
  This is not adaptPlan's job: it scales duration and caps intensity, but it
  cannot know which of two TTs in one line is the expendable one.
- phase: unchanged. Aerobic Reset closes today and Base I (380-460) opens
  tomorrow as written. The week just closed at **357 TRIMP** against the
  280-400 band — in band, 89% of ceiling, 6 of 7 days trained. Base I's 380
  floor is a 6% step from 357 and well under the 421-476 he held through
  August, so the bands are realistic against what he is absorbing. No
  TAPER_PLAN edit.
- physiology: HRV 60 is 25ms below baseline 85 and reads alarming in
  isolation; it is not. Last 7 days are 98/81/105/59/90/117/60 — mean 87
  against a baseline of 85, sd ~21, so today is ~1.2sd on a genuinely
  oscillatory series with two sub-65 days. Against that, **RHR 38 is the
  lowest value in the visible series** (39-42 every day since 23 Sep, never
  outside 38-46 in three weeks) and deep sleep was 205min against a 60-140
  norm. Low HRV + floor RHR + outsized deep sleep is parasympathetic
  dominance, not accumulating strain, and today is a rest day regardless. The
  7-day mean has drifted 98 (14-20 Sep) -> 87, but that window contains the
  19 Sep illness spike rolling out, so it is not yet a trend. **No sustained
  shift and no RHR excursion. Nothing to act on; worth one more morning's
  look** because tomorrow opens the block with maximal work.
- watching:
  **The 28 Sep ski TT result is a trigger, not just a benchmark.** The
  compromised ski targets downstream — 4:05 on Thu 8 Oct, 4:20 on Tue 13 Oct,
  4:00 on Thu 22 Oct — are all built off the **28 Jul** 3:54, and he has not
  logged a ski erg activity in five months. If Monday comes in slower than
  ~4:00, those three targets are fiction and must be reset off the new TT
  rather than off the July number. Whoever runs next after Monday: check the
  TT before reading those lines as sound.
  **The Monday double**, carried from yesterday: if the row TT is deferred a
  third time it stops being a TT and becomes 3x500m inside the circle. My
  degrade rule deliberately makes skipping it legitimate on a red morning, so
  count a red-morning skip as a defer, not as disobedience.
  **The Wednesday Hyrox circle**, carried unchanged: it landed Wed 16 Sep, SUN
  20 Sep, FRI 25 Sep, and nothing in the plan now depends on it. Yesterday set
  the trigger at two more off-Wednesday landings inside three weeks; 25 Sep is
  already counted, so the count stands at zero new. Wed 23 Sep was blank and
  the circle ran Fri 25 Sep — that is the landing already on the tally, not a
  new one.
  **Ski 2x/0** stays on the WATCH list until 23-24 Sep age out of the 21-day
  window on 15 Oct. Expected, not a live signal: yesterday deleted every
  standalone ski and re-homed the erg inside the Monday gym trip and the
  compromised ski->run intervals, and the first instance of that new structure
  is tomorrow. I would act — and reopen the structure rather than the day — if
  the 28 Sep gym trip syncs without a ski-titled activity, because that is the
  new plan failing on its first attempt rather than the old one still decaying.
- consecutive no-change runs before this one: 0 (26 Sep was a CHANGED run).

## 2026-09-26
- adherence: ski 2x prescribed / 0 done (WATCH) · row 1x / 0 · everything else
  on track · benchmarks in the next 14d: row+ski TT Mon 28 Sep, roxzone
  circuit Wed 30 Sep, 5km TT Sat 3 Oct
- readiness: HRV 117 vs baseline 84, RHR 39, sleep 8h51 — highest HRV since
  16 Sep, RHR mid-range. Green.
- decision: CHANGED — rebuilt the week template for weeks 4–7 (28 Sep–25 Oct).
  Long run and the 5km TT moved off Saturday onto Friday; strength/erg moved
  onto Monday; standalone ski sessions deleted and the ski re-homed inside the
  Monday gym trip and the compromised ski→run intervals; the roxzone circuit
  un-bolted from the Hyrox circle. Weeks 1–3 untouched.
- why: two numbers. **Saturday is 3/8 trained since 3 Aug**, and two of the
  three were the Athens race and its half sim — 8/15/22 Aug and 12/19 Sep are
  blank, and today he swapped the planned 70min long run for a 1h recovery
  ride. Mon 8/8, Tue 7/8, Thu 7/8, Fri 7/8, Wed 6/8. The plan had the week's
  biggest aerobic session AND its only running benchmark on his one reliable
  rest day, every week, which makes the 5km TT on Sat 3 Oct already deferred.
  Second: **zero ski erg activities in five months of Garmin data** (rowing
  three, one of them on water at Trakai). Ski was prescribed 23 and 24 Sep as
  a standalone morning erg and done neither time; three more standalone ergs
  sat in weeks 4/5/7. A session archetype with no instance in the record is a
  wish, so ski now only appears attached to something he does. This also
  matches the skill's own reading — ski is top 29.8%, his weakest element,
  with a 24s gap between the 3:54 fresh TT and the 4:18 he raced, so the fix
  is compromised work off running legs rather than fresh technique anyway.
  Third: the circle landed Wed 16 Sep, **SUN** 20 Sep and **FRI** 25 Sep, so
  pinning the roxzone circuit to "10min after the circle" made the one thing
  Athens proved was never trained hostage to a 1-in-3 Wednesday. It is now
  15min standalone with "run it even if the circle does not".
- also: the ski/row/roxzone lines now say what to title the Garmin activity.
  The adherence matcher reads the activity title, and erg work buried inside
  a session logged as "Indoor Running" is invisible to it — part of why ski
  has looked untrained is that it would be unmeasurable even if done.
- phase: unchanged. Aerobic Reset closes 27 Sep and Base I (380–460) opens
  28 Sep as written. Bands check out: he did 447 TRIMP in the 14–20 Sep reset
  week (over the 280–400 band by 12%, and that week ended with his worst
  readiness day of the month) and 357 in the 21–27 Sep week, in band. Base I
  at 380–460 is a ~7% step from 357 and well inside the 421–476 he sustained
  through August. No change to TAPER_PLAN bands, only the Base I note.
- physiology: hrvBaseline 84, up from 72 yesterday and 73 on 24 Sep, after a
  dip from 91 on 11 Sep. Not a sustained shift — the 19 Sep illness spike
  (HRV 39, RHR 56 against a 38–42 normal) is rolling out of Garmin's 7-day
  window; it resolved inside a day and RHR has been 39–42 every day since.
  No RHR excursion outside 38–46 in the last three weeks.
- watching: **the Wednesday Hyrox circle.** Attendance is fine — three in three
  weeks — but the DAY is not (Wed, Sun, Fri). Nothing now depends on it, so I
  left it on Wednesday rather than guess a new day. I will act if it lands
  off-Wednesday twice more in the next three weeks: at that point the circle
  line stops naming a day and becomes "once this week, whenever it runs".
  **The Monday double.** Mon 28 Sep asks for two erg TTs in one trip and
  Mondays have carried tennis two of the last three weeks. If the row TT is
  deferred a third time, it stops being a TT and becomes 3×500m inside the
  circle — a number he will actually produce beats a benchmark he will not.
  Historical ski 2x/0 stays on the WATCH list until 23–24 Sep age out of the
  21-day window on 15 Oct; that is expected, not a live signal.

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
- update (later the same day): the prospective path IS now built, against
  iCloud rather than Google. `calendar_sync.py` reads iCloud CalDAV inside
  the GitHub Actions run, filters events containing 🎾, and writes them into
  SCHEDULE as `{type:"tennis",cal:true,...}`. It only ever manages lines
  carrying `cal:true`, so hand-authored sessions on the same day are
  untouched. It needs the ICLOUD_USER and ICLOUD_APP_PASSWORD repository
  secrets; until those exist the step prints "not configured yet" and skips.
  The Routine needs no connector for any of this. The paragraph below is the
  superseded Google-connector plan, kept for the record.
- watching (superseded): **the prospective calendar path is NOT built.** He asked for a
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

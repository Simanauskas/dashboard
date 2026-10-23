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

**What goes in the dashboard, set by Simas on 9 Oct 2026.** A SCHEDULE line is
**three sentences at most**: what to do, and why it changed. Nothing else. No
reasoning chains, no evidence lists, no running commentary on previous runs —
he reads these on a phone before training, and the long ones were being skipped.
All of that belongs in THIS file, which is where the deliberation lives. If a
line needs a fourth sentence to justify itself, the justification goes here and
the line gets shorter. Deliberate at length, ship three sentences.

Also from him, and both of these are corrections no amount of split-reading
would have produced:
- **Roxzone is not trainable as a session.** Race roxzone time is distance
  between stations, a sip of water, and heavy legs off the run. His gym has
  everything close together, so it cannot be rehearsed. Compromised running IS
  the roxzone training — do not prescribe transition circuits.
- **A station's clock runs arc to arc, not machine to machine.** Roughly 10s in
  and 10s out of the ski erg split is getting to the machine and leaving it,
  which is most of the gap between his gym times and his race splits. It is not
  lost performance. Every competitor crosses the same arcs, so his top-29.8%
  ski rank is still a real weakness and still worth training — but as genuine
  erg speed, not as free seconds waiting to be collected.

Run `python3 adherence.py --days 21` before deciding. It prints planned
versus actually-trained per session type, names benchmarks already due and
those landing in the next 14 days, and flags anything prescribed repeatedly
and never once done.

---

## 2026-10-23
- adherence: no ACTION REQUIRED section. ski **5/2, short by 3** · row 0/1 · **hyrox 2/0 (WATCH)** ·
  strength 4/3 · cycle 0/3 · tennis **0/8** · **run 11/4, short by 7 — the largest shortfall on the board
  and one worse than yesterday's 10/4.** Benchmarks already due: 2 Oct and 15 Oct NOTHING LOGGED, 6 Oct
  TRAINED EASY INSTEAD, 8 Oct TRAINED OTHER TYPE, **22 Oct "type match — CHECK IT" on `Running Vilnius
  Running`.** Next 14d: **Thu 29 Oct**, now joined by **Thu 5 Nov** once week 9 was written — both
  Thursdays, a day he trains (1 Oct's 8×1km @ 4:01 was a Thursday), so neither is on a weekday he skips
  and neither is deferred.
- **I CHECKED IT, and the type match is false.** 22 Oct logged `Running, 21:22:44, "Vilnius Running",
  **8.71km in 48:55 at 5:37/km, avg HR 131, max HR 143**`. The prescription was 5×1km at 4:06 off 90s,
  late morning. **A max heart rate of 143 cannot contain one kilometre at 4:06** — his running zones put
  threshold at 142–177 and he averaged 151 with a max of 176 for the 8×1km on 1 Oct — so he ran, easy, in
  the evening, and adherence.py's strongest word (CHECK) was exactly right not to claim more.
- readiness: HRV **112** vs baseline **102** (+10), RHR **46**, resp **12.0**, deep 106, REM 123, awake 1,
  sleep_score 88, sleepMin **452** — **all of these are 22 Oct's row, because the 23 Oct wellness row never
  arrived.** 140 daily / 139 sleep rows, contiguous, last row 2026-10-22. **LAST_DATA 2026-10-23T06:08Z and
  LAST_RUN the same, one hour old, so the sync is healthy** and this is a watch-sync gap, not a pipeline
  fault — nothing to fix and nothing to change for it, but every readiness number below is a day old and I
  am saying so rather than quoting it as this morning's. Engine: TSB **−4.89**, ATL **36.14**, CTL
  **31.25**, `consecutiveHard` **3**, `daysSinceRest` 3, forceRest FALSE, **easeHard TRUE** (*"3 hard days
  back to back"*), **readiness 7/10**, **scale 1.25**, `unplanned7` **126**.
- decision: **CHANGED — eight edits. The prescribed threshold set is abolished and replaced by a floor he
  shapes himself; today's long run is frozen against a 25% governor inflation; the long-run ladder stops
  climbing off rungs nobody has stood on; and week 9 (2–8 Nov) is written, as 17 and 22 Oct both
  committed. Week 7 is costed at 403 before and after — byte-identical — which is the proof the week he is
  partway through was not rewritten.**

### 1. The KEY RUN stops being a prescribed set. (Pre-committed trigger, fired verbatim.)
- 21 and 22 Oct both set the same trigger: *"if 22 Oct is blank or he runs easy again, 29 Oct stops being a
  prescribed set and becomes a tempo floor he picks the shape of. Decide it Fri 23 Oct."* Today is that
  date and he ran easy. **The record, and it is not close:**

  | written threshold set | what happened |
  |---|---|
  | 6 Oct, 5×1km @ 4:06 | `Z2 10km`, 52:09 @ 5:12, HR 138/146 |
  | 15 Oct, 5×1km @ 4:06 | nothing — HRV 31, RHR 68, resp 19, the infection |
  | 22 Oct, 5×1km @ 4:06 | `Vilnius Running`, 8.71km @ 5:37, HR 131/**143** |

  | hard run he chose himself | what happened |
  |---|---|
  | 1 Oct, unprescribed | **`8x1km tempo 4:01`**, 10.87km in 52:12, HR 151/**176** |
  | 25 Sep, unprescribed | **`Tempo 3x2km 14kmh, 60s rest`**, 39:18, HR 141/**169** |

- **Written sets are 0-for-3. Self-chosen tempo is 2-for-2, and both were harder than the prescription** —
  8×1km at 4:01 is three more reps and 5s/km faster than the 5×1km at 4:06 he declined five days later;
  3×2km at 4:17 off 60s is 6km of work against the 5km that was written. **The limiter is not fitness,
  willingness or the pace. It is the prescription.** He owns 4:06 and has proved it twice; what he does
  not do is run someone else's reps.
- So **29 Oct and 5 Nov now read `⏱ KEY RUN · 50min, hard running, your shape · 5km at 4:20/km and no
  slower, any reps you like`**, with the ask that he put the average pace of the fast part in the title so
  the number can be read. **4:20 and not 4:06 on purpose:** the floor has to be a number he will clear
  without negotiating, and 4:20 is 19s/km slower than the 1 Oct set he actually ran — if he beats it the
  way he beat the last two, the written figure never mattered; if he only just clears it, that is the first
  honest measurement of his running since 1 Oct.
- `⏱` and the words KEY RUN are kept deliberately, so `adherence.py`'s BENCH regex and its run matcher both
  still see it and the next cold run keeps scoring it. Intensity is unchanged at 168 and cost at 136 —
  **this is a change of format, not of load.**

### 2. Today's long run was about to be shown to him 20 minutes longer than written.
- **This is the find of the morning and it was invisible in the SCHEDULE text.** `adaptPlan` computed
  **scale 1.25** — *"week projects 282 TRIMP, under the 400 floor, and readiness is 7/10"* — and
  `scaleDuration` rewrote the written `Long run 75min` to **`Long run 95min`**, posted as *Volume raised
  25%*. **His longest run in six weeks is the 1h10 of 10 Oct.** He has run four times in 21 days, he ran
  8.71km at 21:22 last night, and `consecutiveHard` is 3.
- **The mechanism, because it will recur every morning this block.** The governor fires on `projected`, and
  the week projects 282 only *because 19 and 21 Oct went untrained* — the plan's own note already records
  that *the governor relaxes when a session is missed rather than tightening*. And `easeHard` is TRUE this
  morning, but the long run's `planIntensity` is 138 against a `HARD_HR` of 155, **so the ease gate does
  not cover it: the engine simultaneously says "ease off hard work" and "add 25% to the long run".** The
  one it chose to inflate is the only session where a 25% overshoot is dangerous rather than merely wrong.
- The fix is the one 17 Oct found and the Base I note already names: **spell it `1h15`, which
  `planDurationMin` reads as 75 and `scaleDuration` cannot touch.** But 17 Oct's line had no other
  duration in it and today's did — `scaleDuration` would have found the `15min` of the fast finish and
  grown it to 20min — **so the finish is now written in kilometres: `last 3km @ 4:30/km`.** 3km at 4:30 is
  13:30, within 90 seconds of the 15min it replaces. Re-read after the edit: **today's session comes back
  `planned`, not `adjusted`, and `adjustments` is now EMPTY where it held one entry.** Cost unchanged at
  101, week 7 unchanged at 403.
- Two factual errors in the same line went with it. It claimed *"five minutes longer than 16 Oct"* — **16
  Oct was a prescribed recovery day and nothing was run** — and that *"the ladder now climbs from 1:06"*,
  which was 15 Sep's hour. **The last long run that actually landed is 10 Oct at 1h10**, so that is what
  the line now cites. The Sat 24 Oct backstop was re-spelled to match the Friday it backs up.

### 3. The long-run ladder stops climbing off an unclimbed rung.
- The plan's own rule, set on 20 Oct for the run ladder: *A PROGRESSION IS NEVER WRITTEN OFF A RUNG THAT
  WAS NEVER CLIMBED.* **The long-run ladder has been breaking it.** 10 Oct's 1h10 landed; **17 Oct's 1h10
  went untrained**; 23 Oct's 1h15 is unanswered as I write; and **30 Oct was written at 80min, a step up
  from a rung nobody has stood on.** 30 Oct and week 9's 6 Nov are therefore both held at **1h15**, with
  1h20 arriving the week after a 1h15 has actually landed. Week 8 goes 463 → **457**, inside 400–560, so no
  trim and no inflation.

### 4. Week 9 (2–8 Nov) written — the last week of Base I.
- Both 17 Oct and 22 Oct set this for **Fri 23 Oct**. 22 Oct also said it must absorb the ski verdict of
  27 Oct and the band decision of 26 Oct, which is a contradiction inside one entry. **I wrote it anyway,
  on the structures that have actually landed rather than on the pending verdicts**, because an unwritten
  week is invisible to adherence.py and to the governor, and re-basing one line on 28 Oct is cheaper than
  that. It is built from six things the record already settles:
  1. **Mon 2 Nov rest.** Monday has carried a gym trip on 5, 12 and 19 Oct and been trained once (5 Oct,
     `Compromised 3x[ski 1km+run 1km]`, HR 159). **1-for-3.** If 26 Oct gets trained anyway the sled and
     lunges come back here, per 22 Oct's experiment.
  2. **Tue 3 Nov, the gym trip: ski ×2 plus sled pull and lunges, behind the court if a fixture appears.**
     The structure that lands is erg *with lifting in the same trip* — 30 Sep, 5, 7 and 8 Oct — while
     standalone erg trips are 0-for-5. **Still ×2 and no fade test**: the step to ×3 comes the week after a
     ×2 lands, and as written the last erg of any kind is 8 Oct.
  3. **Wed 4 Nov empty**, a `note:true` line at zero cost. A Wednesday erg was prescribed 14, 21 and 28 Oct
     and trained none of them.
  4. **Thu 5 Nov, the floor, not a set** — and it carries the block's closing measurement, which is why the
     title has to hold the pace.
  5. **Fri 6 Nov long run 1h15** with Sat 7 Nov as its backstop, held per §3.
  6. **No `cal:true` line hand-written anywhere in it.** `calendar_sync.py` *replaces* every cal:true
     tennis line inside `HORIZON_DAYS = 10`, so hand-writing one inside the horizon would be deleted and
     one outside it would go stale. Week 9 crosses that horizon on 2 Nov. The single surviving fixture,
     27 Oct 10:00 with Edvinas, is untouched.
- Week 9 costs **356** against the 400–560 band and will draw a ~12% inflation when it goes live. That is
  the same structural defect as §2 and is left standing: the Friday cannot be inflated, and +12% on a
  door-to-door figure moves warmup, not work. **Tennis is the rest of that band and is never written** —
  0 prescribed, 8 trained in 21 days.

### The physiology this run owes
- **`hrvBaseline` is 102, unchanged, stamped 2026-10-22.** HRV reads 110 / 113 / 107 / 111 / 112 across
  18–22 Oct — **five mornings inside a 6ms band**, against 43–94 on a sd of ~18 for 1–14 Oct. Yesterday
  read that variance collapse as a **detraining signature rather than supercompensation**; today adds the
  number that settles it. **Sessions above an average HR of 150 in the last 60 days: two.** 5 Oct (159) and
  1 Oct (151). **The last is 22 days ago.** Running minutes by week: 109, 122, **0**, 49 so far. CTL on a
  warm 1 Jul start went 44.1 at the block start (28 Sep) → **52.2 on 12 Oct → 46.6 today**, i.e. the only
  real fitness this block bought has been handed back since the illness, and TSB on that start is **+10.4**.
  Four weeks into a six-week aerobic base block whose entire purpose is to raise CTL, it is **below its
  mid-block peak.** A green readiness score this week is evidence about his recovery and silent about his
  fitness, exactly as 21 and 22 Oct said.
- **RHR: no excursion to report.** 44 / 42 / 44 / 46 / 46 across 18–22 Oct, all inside the 38–46 range,
  against a 43.0 mean for 16 Sep–14 Oct. 15–17 Oct's 68 / 51 / 50 were the infection.
- **21 Oct's RHR trigger cannot be advanced today and that is not a hold.** It asked for *two more mornings
  ≥46 with HRV near 111*; 22 Oct was the first; **there is no 23 Oct row, so this morning is neither a
  confirmation nor a reset.** Re-set for **Sat 24 Oct**, on the first morning a row actually lands.
- **`consecutiveHard` is 3 off 59 / 67 / 55 TRIMP — two social tennis matches and an easy evening run.**
  That is the `HARD_TRIMP = 55` defect, and today it is load-bearing: it made `easeHard` TRUE, which did
  nothing for the long run (138 < 155) while the volume governor added 25% to it.

### Is the phase still right
- **Yes, and nothing about it moved.** Base I · Aerobic (28 Sep – 8 Nov, 400–560), four weeks in,
  **Copenhagen 27 Mar 2027 is 155 days out.** Aerobic base is right this far from a race and specificity
  still belongs later. **Nothing has raced or tested since Athens and the last erg is 8 Oct, so the weakness
  ranking cannot have moved**: ski 29.8%, running 27.7%, roxzone 19.8% and not trainable as a session. What
  changed today is how running is *asked for*, not what the block is for.
- **The TAPER_PLAN bands are NOT realistic and I am holding the decision to Monday as committed.** Measured
  Mon–Sun inside Base I: **week 4 327, week 5 693, week 6 129, week 7 181 with three days left.** **Zero of
  four weeks have closed inside 400–560**, one overshot by 24% and two missed the floor by more than a
  quarter. Week 7 needs 219 more TRIMP in three days to reach 400; today's long run is ~101 and a weekend
  match ~60, so **it closes near ~340 and makes it 0-for-4.** 22 Oct pre-committed this for **Mon 26 Oct**
  when week 7 actually closes, two days away, with the closing number as the evidence — **so the arithmetic
  is recorded here and the decision stays on its date.** The ceiling stays at 560 regardless, for the
  reason the note already gives. **Note for Monday: the floor is the live problem, not the ceiling.** The
  band is specified as TOTAL load including self-generated court time, but the governor projects only
  written sessions plus what is already logged, so **every week reads under-floor until the tennis has
  happened, and every under-floor morning inflates whatever is written.** That is the §2 mechanism, and it
  argues for a floor set against written plan cost rather than total measured load.
- **hyrox WATCH, resolved not carried.** Parsed every SCHEDULE day from today forward, week 9 included:
  **zero sessions typed `hyrox`, zero occurrences of hyrox / circle / roxzone anywhere.** Both flagged
  dates (7, 8 Oct) are past records, the forward plan is clean, so there is nothing to move or remove and
  the flag clears itself on 29 Oct. **What would make me act: any line reintroducing the circle before
  29 Oct gets deleted the same morning.** The past lines stay as written — rewriting them clears the flag
  instantly and destroys the only instrument that sees across days.

### What I deliberately left alone
1. **Today's long run as a session** — only its spelling, its fast-finish units and two wrong dates changed;
   75 written minutes in, 75 written minutes out.
2. **Week 7 entire.** Re-costed after the edits at **403, byte-identical to before**, with 19 and 21 Oct
   left standing as `missed` and 22 Oct as `done`. **The past lines are the instrument; they are never
   tidied.**
3. **Tue 27 Oct's ski ×2** — yesterday re-based it and 27 Oct is its test. Not touched twice.
4. **Mon 26 Oct's rest experiment** and Wed 28 Oct's deliberate blank.
5. **The 560 ceiling and every band number.**
6. **The 27 Oct `cal:true` fixture** and every past prescription.
7. **No standalone Z2 run re-added anywhere**, and no hyrox line.
8. **No machine-written constant touched** — not HEALTH_DATA, HYROX_DATA, CSV_DATA, TODAY, LAST_RUN,
   LAST_DATA or `hrvBaseline`. Not RACE, PREV_RACE, STATION_TARGETS, RACE_BUDGET or RACE_GAINS either:
   nothing raced, nothing tested, no target moved.

### Verification
- `npm run build` **clean, 458.01 kB** against yesterday's 453.47. **11/11** patch anchors.
- SCHEDULE **64 days / 9 weeks** (was 57/8), sorted, unique, **0 dow mismatches**, all 64 still matched by
  `calendar_sync.py`'s own `DAY` regex so fixtures can still be inserted. TAPER_PLAN 18 blocks. **1
  `cal:true` fixture.** 140 daily / 139 sleep rows, indent `[ ]{4}` only, sorted, unique.
- **Engine re-read: week 7 403 → 403 and `adjustments` went from one entry (`Volume raised 25%`) to
  EMPTY**; week 8 463 → 457; week 9 costs 356; 28 Oct, 4 Nov and 7 Nov all resolve to `note:true` at zero
  cost. `adherence.py` re-run after the edits: **every count in the 21-day window identical** — correct,
  since every edit falls on 23 Oct or later and 23 Oct is still a prescribed run.
- Round-trip `update.patch()` against a copy of the real src/App.jsx (`head -1046 update.py`, imported with
  `-I`): **65/65**. Insert path — TODAY advanced to date+1, daily and sleep each grown by exactly one at
  4-space indent, sorted, unique, nothing pre-existing lost, weight upserted inside its own array with
  **`vo2max` byte-identical (gotcha 4)**, nutrition and body byte-identical, CSV row added, no `hrv:0`, no
  `sleep_score:None`, SCHEDULE / TAPER_PLAN / RACE / RACE_BUDGET / RACE_GAINS / STATION_TARGETS /
  HYROX_DATA all byte-identical, all eight of this run's markers surviving at their expected counts and all
  six replaced clauses absent. Replace path — no growth, CSV upserted not duplicated, indent and ordering
  held, every constant still byte-identical.
- **Harness notes for the next cold run, all three learned this morning.** (1) `wellness['weight']` is a
  **`(date, kg)` tuple**, not a float — passing a bare number dies at `update.py:762` with
  `cannot unpack non-iterable float`, which looks like a patch bug and is not. (2) The node module cut is
  **`sed -n '2,2003p'` today, against 1993 yesterday — find it, never trust it** (`grep -n
  '^const GLOBAL_CSS = `' | cut -d: -f1`, minus 2), and `hrvBaseline` is on **2362**, not 2353. (3) Two of
  my own marker assertions failed on the first round-trip and **both were the harness, not the file** — the
  floor wording is deliberately on two days, and `Long run 75min` legitimately survives on **9 Oct**, a past
  day I did not touch. Assert per-day, not per-file, for anything that recurs.

### Engine defects, outside this Routine's edit surface
1. **NEW — `isOptionalLine` (src/App.jsx:1714) matches `\bOR\b` case-insensitively, so any plan line
   containing the ordinary English word "or" is costed at HALF.** Caught live: my first draft of the floor
   read *"5km or more at 4:20/km or faster"* and the engine priced the session at **68 instead of 136**,
   dropping week 8 to 389 and under its own floor. **Reworded to "5km at 4:20/km and no slower" to dodge
   it.** Audited every SCHEDULE line afterwards: the six that still price at half are all genuinely
   optional and all in the past, so nothing live is mispriced today. The fix is `/\bOR\b/` without the
   `i` flag, since the marker was only ever meant to catch the shouted `OR` of *"jog OR swim"*. **Until it
   is fixed, a plan line must not contain a bare "or".**
2. **`isTennis` (src/App.jsx:1176) is `=== "tennis"` against rows typed `Tennis V2`**, so `loadModel.tennis`
   reads **n=0** and planned court sessions price from the fallback at 101 against 59 measured on 20 Oct.
   **Eighteenth entry.** One word: `/^tennis/`.
3. **`readiness()` takes only TSB and HRV** — no RHR, no respiration, no REM. **Eighth entry**, and today it
   is worse than usual: with no 23 Oct row it returned 7/10 off a day-old reading, and that 7 is one of the
   two conditions that produced the 25% inflation in §2. `signals.rhr` is already computed; feeding it in
   is the fix.
4. **`HARD_TRIMP = 55` counts ordinary days as hard.** `consecutiveHard` is 3 off two tennis matches and an
   easy run. **Twelfth entry**, third day live, and today it was load-bearing — see the physiology section.
5. **`update.py:661`** writes `sleep_score:None` if a caller passes the key with an explicit `None`. Not
   reachable from the real fetch path. **Eighth entry; recorded, not fixed.**
- consecutive no-change runs before this one: **0** — 22, 21, 20 and 19 Oct were all CHANGED.
- watching:
  - **the floor, and this is now the single most important thing on the board.** 29 Oct is its first test.
    **What would make me act: if 29 Oct also goes blank or easy, the problem is not the format and running
    stops being prescribed on a named day at all** — it becomes a weekly minimum (one run over 5km above
    4:20, any day he likes) and the Thursday slot goes to the compromised ski, which at least shares a trip
    with lifting that lands. **Decide it Fri 30 Oct.** If 29 Oct lands, read the title's pace and write
    Base II's threshold reps off that number and nothing else.
  - **the ski, down to one chance a week.** Tue 27 Oct is week 8's only erg and week 9's Tuesday mirrors it.
    **Trigger unchanged from 22 Oct: if 27 Oct logs no erg, the erg is 0-for-4 on this block, it stops being
    written as a session and becomes a line inside the Tuesday gym trip with no distance, pace or title
    requirement, and week 9's Tuesday gets re-based the same morning. Decide it Wed 28 Oct.**
  - **the long run's Friday slot.** 23 Oct carries it with 24 Oct as its `note:true` backstop; the record
    favours the backstop (**9 Oct Friday blank, 10 Oct Saturday landed at 70min; 17 Oct Saturday blank**).
    **Decide it Mon 26 Oct**, as 22 Oct set.
  - **the band, 0-for-4 in Base I.** **Decide it Mon 26 Oct** when week 7 closes, with the floor-versus-
    governor mismatch recorded above as the substance of that decision.
  - **RHR 46, one morning of the two.** **Decide it Sat 24 Oct**, on the first morning a wellness row lands.
  - **the missing 23 Oct wellness row.** LAST_DATA is one hour old, so this is his watch and not the
    pipeline. **What would make me act: if 24 Oct is also missing with LAST_DATA fresh, say so on the
    dashboard rather than silently prescribing off two-day-old physiology.**
  - **Mon 26 Oct is rest, and that is the experiment.** If it logs training anyway, the slot was fine and
    the content was wrong, and **2 Nov's Monday gets the sled and lunges back. Decide it Tue 27 Oct.**
  - **week 10 (9–15 Nov) opens Base II · Threshold** and its reps are now written off 5 Nov's recorded pace
    rather than a prescribed figure. **Write it Fri 6 Nov**, once that number exists.


---

## 2026-10-22
- adherence: no ACTION REQUIRED section printed — **30 Sep aged out of the window overnight exactly as
  21 Oct predicted, so hyrox demoted to WATCH on `2x — 2026-10-07, 2026-10-08`.** ski **5/2, short by 3** ·
  row 0/1 · hyrox 2/0 · strength 4/3 · cycle 1/3 · tennis **1/8** · **run 10/4, short by 6 and still the
  largest shortfall on the board.** Benchmarks already due: 2 Oct and 15 Oct NOTHING LOGGED, 6 Oct TRAINED
  EASY INSTEAD, 8 Oct TRAINED OTHER TYPE, 22 Oct live as of this run. Next 14d: **Thu 29 Oct KEY RUN
  6×1km @ 4:06 off 75s** — Thursday is a day he trains (1 Oct's 8×1km @ 4:01 was a Thursday), so it is not
  on a weekday he skips and it is not deferred.
- **WATCH resolved, not carried.** Parsed all 11 forward day lines (22 Oct–1 Nov): **zero sessions typed
  `hyrox`, zero occurrences of hyrox / circle / roxzone anywhere.** Both flagged dates are past records, the
  forward plan is clean, so there is nothing to move, change or remove and the flag clears itself on 29 Oct.
  **What would make me act: any line reintroducing the circle before 29 Oct gets deleted the same morning.**
  The past lines stay as written — rewriting them clears the flag instantly and destroys the only instrument
  that sees across days.
- readiness: HRV **112** vs baseline **102** (+10), RHR **46**, resp **12.0**, deep **106**, REM **123**,
  awake **1**, sleep_score **88**, sleepMin **452**. TSB **−3.10**, ATL **34.39**, CTL **31.28**,
  `consecutiveHard` **2**, `daysSinceRest` 2, forceRest FALSE, easeHard FALSE, **readiness 7/10**,
  **scale 1.102**, scaleWhy *"week projects 363 TRIMP, under the 400 floor"*, **2 adjustments — 22 and
  23 Oct both Volume RAISED 10%**, `unplanned7` **126**. LAST_DATA **2026-10-22T06:08Z**, LAST_RUN the same
  — fresh, sync healthy. 140 daily / 139 sleep rows, contiguous through today.
- decision: **CHANGED — the ski is re-based from two weekly ergs to one. Three edits, all in week 8 and the
  Base I note. Week 7, the week he is partway through, is untouched and verified identical.**
- why: **21 Oct logged one activity, `Tennis V2 20:30:48`, 1:09:33 at HR 125. No erg, no lat pulldown.**
  That fires yesterday's pre-committed trigger verbatim — *"if 21 Oct logs no erg, the ski is 0-for-3 on this
  block and week 8 carries one erg, on Tuesday behind the court, not two. Decide it Thu 22 Oct"* — and today
  is that date. **The ski is 0-for-3 on this block (14, 19, 21 Oct) and the last erg of any kind is 8 Oct,
  fourteen days; by Tue 27 Oct it is nineteen.**
- **the wider number, and it is worse than the ski alone.** Nothing written has landed since **10 Oct**. In
  those twelve days the record holds **four tennis matches and one long run** — five consecutive written
  sessions declined (12, 14, 19, 21 Oct), with 15 Oct excluded because that was the infection and does not
  count against him. `unplanned7` is **126**, i.e. **every minute of the last seven days was
  self-generated.** His court habit needs no prescribing; the erg and the run do.
- **what changed, session by session.**
  1. **Wed 28 Oct — both sessions out**, replaced by one `note:true` line. It held a 45min Z2 run plus
     6×500m ski with lat pulldown and sled pull. **Wednesday is 0-for-2 on the erg this block (14, 21 Oct)**,
     and the Z2 run existed only to compromise the ski, so with the ski gone it reverts to the standalone
     easy run this plan already removed on 12 Oct as 0-for-3. **−108 TRIMP.**
  2. **Tue 27 Oct — ×3 becomes ×2, the fade-test framing and the 4:08 / 6s targets come out**, replaced by
     "anything under 4:15 a rep is the win". Lifting, the court bolt-on and "go anyway if the court falls
     through" all stay. **When yesterday wrote the ×3 it assumed 21 Oct's 4×500m would have landed six days
     earlier. It did not, so the test now sits off nineteen cold days** — and the plan's own rule, *a
     benchmark taken off a long layoff measures the layoff, not the thing it was written to measure*, applies
     to its own fade test. This is new evidence changing the session's premise, not a decision pulled forward.
  3. **TAPER_PLAN, Base I note** — *"the second ski stays on Wednesday and always carries the week's upper
     pull in the same trip"* is now false and is replaced by **THE WEEK CARRIES ONE SKI, NOT TWO** plus
     **A SECOND WEEKLY ERG IS WRITTEN BACK IN ONLY AFTER ONE HAS ACTUALLY LANDED.** *THE ERG IS NEVER THE
     ONLY CONTENT OF A TRIP* survives untouched and is precisely why the Tuesday is the one that lives.
- **why one erg and not zero.** Ski is his **weakest element at top 29.8%** with **24s of proven headroom**
  (3:54 fresh TT on 28 Jul against the 4:18 he raced at Athens), so leaving the block's named weakness with
  no prescription at all is the opposite error. And the structure that has actually landed — erg plus lifting
  in one trip, 30 Sep / 5 / 7 / 8 Oct — **is exactly what Tuesday is.** The one I cut is the structure that
  has never landed.
- **cost.** Week 8 carried **two ergs and costed 572 against the 560 ceiling**; it now costs **463**
  (≈**421** once tennis is corrected for the `isTennis` defect below), **inside 400–560**, so no governor
  trim and no inflation next week. `planDurationMin` still reads "GYM 50min" on Tuesday, so edit 2 moves no
  costed number at all — **119 before and after.**
- **physiology, and this is the signal this run owes.** **`hrvBaseline` went 85 → 102 overnight, and
  71 → 77 → 82 → 85 → 102 in five days — a 44% rise**, machine-written. HRV reads **110 / 113 / 107 / 111 /
  112** five mornings running. **The thing to name is not the level but the collapse in variance:** 1–14 Oct
  the series ran **43–94** on a sd of ~18, and the last five days sit inside a **6ms band**. A high, flat HRV
  in an athlete who has absorbed **126 TRIMP in seven days** is the parasympathetic dominance of inactivity
  — **this is a detraining signature, not supercompensation** — and because `readiness()` reads only TSB and
  HRV it is actively making the governor optimistic: **it raised today's benchmark and tomorrow's long run
  by 10% on the strength of it.** Treat a green readiness score this week as evidence about his recovery and
  silent about his fitness. **RHR 46 is the second morning at the ceiling of his 38–46 range** (44/42/44/46/46)
  against a **43.0 mean for 16 Sep–14 Oct**, but it is *inside* the range, so **no excursion to report.**
  21 Oct's trigger asked for two more mornings ≥46 with HRV near 111; **today is the first.** Decide it
  Fri 23 Oct, as committed.
- **is the phase still right.** Base I · Aerobic (28 Sep – 8 Nov, 400–560), four weeks in, **Copenhagen
  27 Mar 2027 is 156 days out** — aerobic base is right this far from a race and specificity still belongs
  later, so **the phase content stands.** Nothing has raced or tested since Athens and the last erg was 8 Oct,
  so **the weakness ranking cannot have moved**: ski 29.8%, running 27.7%, roxzone 19.8% and not trainable as
  a session. **The band: on the SCHEDULE's own Mon–Sun grouping, 327 / 693 / 129 closed and week 7 projects
  390** (126 done + 237 planned). Zero of three in band. **I am deliberately not acting on it today** and
  this is a pre-committed hold, not avoidance: week 7 has three days left and today's 136 plus Friday's 101
  plus a single tennis match would close it at ~400. **Decide Mon 26 Oct when it closes**, as 21 Oct
  committed, alongside the running-minutes and long-run judgements so one week's evidence settles all three.
  **Note for the next cold run: `ana.weeklyTrimp` is rolling-7-day, NOT this Mon–Sun grouping** — say which
  you used or the band argument drifts by a hundred TRIMP a day.
- **what I deliberately left alone.** (1) **Today's KEY RUN** — text re-checked and accurate ("first run in
  twelve days": last run 10 Oct), **no court fixture today**, and the governor's 50→55min only moves warmup
  because the reps are written in the text. (2) **Fri 23 Oct's long run and its Sat 24 Oct backstop.**
  (3) **Thu 29 Oct's 6×1km** — the density step is unchanged. (4) **Mon 26 Oct's rest experiment.**
  (5) **Every pre-committed decision date.** (6) **The bands and the 560 ceiling.** (7) **The three past
  hyrox prescriptions.** (8) **No standalone Z2 run re-added anywhere.** (9) **No machine-written constant
  touched** — not HEALTH_DATA, HYROX_DATA, CSV_DATA, TODAY, LAST_RUN, LAST_DATA or `hrvBaseline` — and the
  one surviving `cal:true` fixture is untouched.
- verification: `npm run build` clean, **453.47 kB** against yesterday's 452.89. **11/11** patch anchors.
  SCHEDULE **57 days / 8 weeks**, sorted, unique, **0 dow mismatches**; TAPER_PLAN **18 blocks**;
  **1 `cal:true`** fixture (20 and 21 Oct aged out of the file overnight, not by me); 140 daily / 139 sleep,
  indent `[ ]{4}` only, sorted and unique. **Engine re-read: week 7 costed 403, projected 390, 2 adjustments
  — byte-for-byte the same as before the edits, which is the proof week 7 was not touched**; week 8
  572 → 463; 28 Oct resolves to **one `note:true` session at zero cost**. adherence.py re-run after the
  edits: **every count identical** — correct, since both edited days fall outside the 21-day window.
  Round-trip `update.patch()` against a copy of the real src/App.jsx (`head -1046 update.py`, imported with
  `-I`): **insert path 39/39** (TODAY advanced to date+1, daily and sleep each grown by exactly one at
  4-space indent, sorted, unique, nothing pre-existing lost, weight upserted inside its own array with
  **`vo2max` byte-identical (gotcha 4)**, nutrition and body byte-identical, CSV row added, no `hrv:0`, no
  `sleep_score:None`, SCHEDULE / TAPER_PLAN / RACE / RACE_BUDGET / RACE_GAINS / STATION_TARGETS / HYROX_DATA
  all byte-identical, all six of this run's marker strings surviving exactly once and all five replaced
  clauses absent); **replace path 24/24** with **no growth asserted**, indent and ordering held.
- **harness notes for the next cold run, both learned the hard way this morning.** (1) **The round-trip must
  pass sleep stages NESTED** as `wellness['sleep'] = {deep,rem,light,awake}` — `update.py:644` reads
  `wellness.get('sleep')`, so flat keys leave `has_real_sleep` False and the sleep row is **correctly**
  skipped; asserting growth on a flat dict prints a failure that looks exactly like gotcha #2 and is not.
  (2) **`[1000m ski → 1km treadmill] ×2 continuous` is NOT a unique marker** — 19 Oct carries it too, so pick
  a marker from the sentence you wrote, not from the prescription. (3) The node module cut is
  `sed -n '2,1993p'` today — **1993, against 1950 yesterday, so find it, do not trust it** (it ends at the
  close of `SS`, before `const GLOBAL_CSS`), and append `sed -n '2352p'` for `hrvBaseline`.
- **engine defects, outside this Routine's edit surface, carried:**
  1. **`isTennis` (src/App.jsx:1172) is `=== "tennis"` against rows typed `Tennis V2`**, so
     `loadModel.tennis` reads **n=0** (`{"hr":138,"min":75,"n":0}`) and planned court sessions price from the
     fallback at **101 TRIMP against 59 measured on 20 Oct**. **Seventeenth entry.** Week 8's 463 is ~421
     corrected. One word: `/^tennis/`.
  2. **`readiness()` takes only TSB and HRV** — no RHR, no respiration, no REM. **Seventh entry**, and today
     it is the mechanism behind the detraining read above: **7/10 on an athlete who has trained once in
     seven days.** `signals.rhr` is already computed and exposed; feeding it in is the fix.
  3. **`HARD_TRIMP = 55` counts ordinary days as hard.** `consecutiveHard` is **2** this morning off **two
     social tennis matches**. **Eleventh entry**, second day live. Changed nothing (easeHard FALSE).
  4. **`update.py:661`** writes `sleep_score:None` if a caller passes the key with an explicit `None`. Not
     reachable from the real fetch path. **Seventh entry; recorded, not fixed.**
- consecutive no-change runs before this one: **0** — 21, 20, 19 and 18 Oct were all CHANGED.
- watching:
  - **the ski, now re-based and down to one chance a week.** Tue 27 Oct is week 8's only erg. **What would
    make me act: if 27 Oct logs no erg, the erg is 0-for-4 on this block and the ski stops being written as
    a session at all — it becomes a line inside the Tuesday gym trip with no distance, no pace and no title
    requirement, and week 9's weakness work goes to compromised running instead. Decide it Wed 28 Oct**,
    which is already the committed date.
  - **today's KEY RUN, 0-for-2 on the written day and 1-for-1 off it.** Two questions, and do not let one
    answer the other: **did he run at all**, and **did 4:06 hold to rep 5**. **Trigger unchanged from
    21 Oct: if 22 Oct is blank or he runs easy again, 29 Oct stops being a prescribed set and becomes a tempo
    floor he picks the shape of** — he has already delivered 8×1km at 4:01 and 3×2km at 14kmh unprescribed.
    **Decide it Fri 23 Oct.**
  - **court-plus-bolt-on, carried from 21 Oct with its first leg now answered the wrong way.** 21 Oct closed
    with the court session as the only thing logged. **Trigger as set: if 22 and 23 Oct also close with
    nothing but tennis, three written sessions in a row have been declined while he keeps turning up to the
    court, and week 9 gets built as court-plus-bolt-on only, with nothing standing alone. Decide it
    Sat 24 Oct.**
  - **RHR 46**, one of the two mornings required. **Decide it Fri 23 Oct.**
  - **the band**, 0-for-3 in Base I. **Decide it Mon 26 Oct** when week 7 closes, as above.
  - **the long run's Friday slot.** 23 Oct carries it with 24 Oct as its `note:true` backstop; the record
    favours the backstop (**9 Oct Friday blank, 10 Oct Saturday landed at 70min**; 16 Oct was the illness and
    counts neither way). **Decide it Mon 26 Oct.**
  - **Mon 26 Oct is rest, and that is the experiment.** **If 26 Oct logs training anyway, the slot was fine
    and the content was wrong, and week 9's Monday gets the sled and lunges back. Decide it Tue 27 Oct.**
  - **week 9 (2–8 Nov) is still unwritten** and Base I runs to 8 Nov; the 17 Oct entry set it for
    **Fri 23 Oct** and that stands. It has to absorb the ski verdict from 27 Oct, the running-delivery
    judgement from 26 Oct and the band decision.


## 2026-10-21
- adherence: **ACTION REQUIRED still prints `hyrox: 3x — 2026-09-30, 2026-10-07, 2026-10-08`, re-verified and
  not inherited: parsing all 12 forward day lines (21 Oct–1 Nov) gives **zero sessions typed `hyrox` and zero
  occurrences of hyrox / circle / roxzone anywhere**. All three dates are past, the forward plan is clean, the
  past lines stay as the record. **30 Sep is on its last day in the window** — tomorrow it drops out and the
  flag demotes itself to WATCH on 7 and 8 Oct; it clears entirely on 29 Oct. ski **6/3** · row 0/1 · hyrox 3/0
  · strength 5/4 · cycle 1/4 · tennis 3/8 · **run 9/4, short by 5 and still the largest shortfall on the
  board** (was 10/4 — 29 Sep's Z2 line left the window, nothing was trained). No WATCH section printed.
  Benchmarks already due: 30 Sep logged, 2 Oct and 15 Oct NOTHING LOGGED, 6 Oct TRAINED EASY INSTEAD, 8 Oct
  TRAINED OTHER TYPE. Next 14d: **Thu 22 Oct and Thu 29 Oct, both KEY RUNs** — Thursday carries 4 distinct
  trained days since 14 Sep **and his best running session of the block** (1 Oct, 8×1km @ 4:01), so neither is
  on a day he does not train and neither is deferred.
- readiness: HRV **111** vs baseline **85** (+26), RHR **46**, resp **12.0**, deep **113**, REM **131**,
  awake **0**, sleep_score **88**, sleepMin **530**. TSB **−0.10**, ATL **30.80**, CTL **30.70**,
  `consecutiveHard` **1**, `daysSinceRest` 1, forceRest FALSE, easeHard FALSE, **readiness 8/10**, **scale
  1.0, scaleWhy null, 0 adjustments**, `unplanned7` **59**. LAST_DATA **2026-10-21T06:08Z**, LAST_RUN the
  same — fresh, sync healthy. 139 daily / 138 sleep rows, contiguous through today.
- decision: **CHANGED — two edits, both corrections of fact, neither moving a costed number. Today's plan line
  is rewritten (it claimed a seven-day layoff that no longer exists and did not know a court fixture sits on
  the same day), and the TAPER_PLAN Base I note's "erg off a court day is 3-for-3" clause is corrected
  because 8 Oct was not a court day.** Bands untouched, ceiling stays 560. Weeks 1–6 and week 8 untouched.
- why: **the thing yesterday was waiting for happened — 20 Oct landed.** `Tennis V2 | Tennis | 01:19:24`, 59
  TRIMP, which closes the six-day stop in the benign direction yesterday named: *"If the court session landed
  today, this reverts to an ordinary post-illness re-entry and the structural items below stand."* It did, so
  it does, and **the question does not go to him.** Worth recording that it was **unprescribed** — the 20 Oct
  SCHEDULE line is `sessions:[]` and `unplanned7` is 59, i.e. **every minute of the last seven days was
  self-generated**. His court habit does not need prescribing; running and the erg do.
- **the find of this run, and it is on today's own line.** Today reads *"this is your first training of any
  kind in seven days and your first erg in thirteen"*. The first half is now false — he played 79 minutes
  yesterday. More to the point, **today carries a `cal:true` fixture, "Simonas Dong · court 1 · 20:30", and it
  has been in the file since the 19 Oct 07:07Z sync** (`git log -S'Simonas Dong'`), through two runs of this
  Routine, and **neither of them mentioned it**. Yesterday wrote today as a standalone gym day. So the line he
  reads on his phone this morning asserts a layoff he does not have and schedules a 50-minute gym trip against
  an evening booking it does not know about. That is exactly how a session gets skipped.
- **what changed, session by session.**
  1. **Wed 21 Oct (today)** — the 15min treadmill and **4×500m @ 1:59 off 90s stay, and so does the lat
     pulldown 4×10; the sled pull 6×25m comes out and the line now names the 20:30 court and says to do the
     gym in the daytime.** The stated reason is corrected to what is actually true: last erg 8 Oct (thirteen
     days), yesterday's 79min match was his first training in six days, and **tomorrow's 5×1km is the week's
     measurement, not this.** Three sentences.
  2. **TAPER_PLAN, Base I note** — *"an erg bolted onto a court day is 3-for-3"* replaced. Of the **four ergs
     that have landed since 30 Sep, two were off a match (30 Sep post-tennis ski TT 3:57; 7 Oct row after a
     2:25 match) and two were off gym trips with no court in the day at all (5 Oct compromised ×3; 8 Oct ski
     2380m)** — so **8 Oct, one of the three cited, was never a court day**, and what predicts an erg landing
     is the trip carrying lifting as well, not the court. The note's own capitalised rule — THE ERG IS NEVER
     THE ONLY CONTENT OF A TRIP — survives this intact and is in fact strengthened by it; the court-day
     sub-claim was the wrong part. Tuesday's replacement reason is the stronger one anyway: **Tue has trained
     on 6 distinct days since 14 Sep against Mon's 3.**
- **why the sled pull and not a rep, and why this costs nothing.** `planDurationMin` reads **"SKI 20min"**, the
  first duration in the line, so **the session still prices at 48 TRIMP and week 7 still projects 444** —
  re-read after the edits: readiness 8, scale 1.0, trimmedBy 1, **0 adjustments, numerically identical to
  before.** The reduction is therefore real in the gym and invisible to the engine, which is the point: the
  day now costs **149 TRIMP (101 court + 48 ski)** the morning after a 59-TRIMP match and the day before a
  136-TRIMP benchmark, and `adaptPlan` is content because 444 sits inside 400–560. **Choosing which 20 minutes
  of accessory work comes out of a day that gained a fixture after the plan was written is the block-level call
  the governor cannot make.** The reps were not cut because 4×500m is already the re-based rung and cutting it
  again would leave no erg content at all.
- **the physiological signal this run owes: the illness is fully unwound, and this is now a detraining
  problem, not a recovery one.** `hrvBaseline` has gone **71 → 77 → 82 → 85 in four days**, machine-written;
  HRV reads **110, 113, 107, 111** four mornings running; **REM 131 is inside his 114–145 normal** and
  **awake was 0 minutes** on 530 of sleep. **RHR 46 is the one number to name**: it is *inside* the 38–46 range
  but exactly at its ceiling, against a **43.0 mean for 16 Sep–14 Oct** (n=29) and after three mornings at
  44/42/44. The morning after a first match back off six blank days is precisely when a +3 appears, so this
  reads as the expected cost of resuming rather than a flag — **but it is the number to watch now that load is
  returning, and two more mornings at 46 or above with the HRV still at 111 would be a different signal.**
  Against that, **CTL 30.70 and ATL 30.80 with TSB −0.10**: he is not fatigued, he is unloaded.
- **is the phase still right.** Base I · Aerobic (28 Sep – 8 Nov, 400–560) is four weeks in. On the SCHEDULE's
  own Mon–Sun grouping, computed here rather than read off `weeklyTrimp`: **Sep 28–Oct 4 327 (under) · Oct 5–11
  693 (over) · Oct 12–18 129 (illness) · Oct 19–25 59 so far.** Zero of three closed weeks inside the band.
  **Note for the next cold run: `ana.weeklyTrimp` is NOT this grouping** — it buckets rolling 7-day windows
  ending yesterday and relabels them daily, which is why yesterday's entry reported 441/579/129 for what are
  the same activities. Say which grouping you used or the band argument drifts by a hundred TRIMP a day. The
  conclusion is unchanged and I am not touching the band: **delivery is the problem, not the ceiling**, and
  week 7 can only reach the 400 floor if today, Thursday and Friday all land in full (59 + 149 + 136 + 101 =
  445). Copenhagen is **27 Mar 2027, 157 days out**, so specificity still belongs later and the phase stands.
  **Weakness ranking has not moved and could not have** — nothing raced or tested since Athens, last erg 8 Oct,
  last run 10 Oct. Ski top 29.8%, running top 27.7%, roxzone top 19.8% and not trainable as a session.
- **what I deliberately left alone, and this is the larger half of this run.** (1) **Thu 22 Oct's KEY RUN** —
  dose, pace and 50min all untouched; the layoff argument that set it on 19 Oct is unchanged, and the evidence
  that it is comfortably within him got *stronger* today, not weaker: **1 Oct's 8×1km @ 4:01 came the day after
  a day holding tennis 1:33 plus a ski TT plus strength**, so a threshold set the morning after an evening
  match is a shape he has already delivered. (2) **The whole of week 8** — Mon 26 Oct rest, Tue 27 Oct's ×3
  fade test, Wed 28 Oct's 6×500m, Thu 29 Oct's 6×1km, all exactly as yesterday wrote them; the 27 Oct
  placement survives its reason being corrected, because Tuesday 6-of-6 against Monday 3-of-3 is the better
  argument and points the same way. (3) **Every pre-committed decision date** — the KEY RUN's written form
  (Fri 23 Oct), Friday-versus-Saturday long run and running minutes and the band (all Mon 26 Oct), the ski
  verdict (Thu 22 Oct), the ×3 read (Wed 28 Oct). **No new running or erg evidence arrived today — nothing has
  been logged since yesterday's match — so pulling any of those forward would be acting on a calendar rather
  than on data.** (4) **The three past hyrox prescriptions** — rewriting them clears the flag instantly and
  destroys the only instrument that sees across days. (5) **The bands and the 560 ceiling.** (6) **No
  standalone Z2 run re-added** anywhere: 0-for-3 and removed on 12 Oct. (7) **No machine-written constant
  touched** — not HEALTH_DATA, HYROX_DATA, CSV_DATA, TODAY, LAST_RUN, LAST_DATA, `hrvBaseline`, and not one
  of the 3 `cal:true` fixture lines.
- verification: `npm run build` clean, **452.89 kB** against yesterday's 452.11 (+0.78 kB, the corrected
  TAPER_PLAN clause). **11/11** patch anchors. SCHEDULE **57 days / 8 weeks**, 2026-09-06..2026-11-01, sorted
  and unique, **every `dow` verified against its own date (0 mismatches)**; TAPER_PLAN **18 blocks**; **3
  `cal:true`** fixtures intact. 139 daily / 138 sleep rows, indent `[ ]{4}` only, sorted and unique.
  **Engine re-read after the edits: readiness 8, scale 1.0, scaleWhy null, 0 adjustments, week 7 projected
  444 / raw 445 / trimmedBy 1, today's ski still `dur=20` and `est=48`, week 8 still 572 — identical to
  before, as intended.** adherence.py re-run after the edits: **every count identical** (run 9/4, ski 6/3,
  hyrox 3/0) — correct, since neither edit changes a session's type. Round-trip `update.patch()` against a
  copy of the real src/App.jsx (`head -1046 update.py`, imported with `-I`): **36/36 on the insert path**
  (date_str 2026-10-22) — TODAY advanced to date_str+1, daily/sleep each grown by exactly one at 4-space
  indent, sorted, unique, no pre-existing date lost, weight upserted inside its own array with **`vo2max`
  byte-identical (gotcha 4)**, `nutrition` and `body` byte-identical, CSV row added, no `hrv:0`, no
  `sleep_score:None`, and SCHEDULE, TAPER_PLAN, RACE, RACE_BUDGET, RACE_GAINS, STATION_TARGETS and HYROX_DATA
  all byte-identical with **both edits' six marker strings surviving exactly once each** and both replaced
  clauses absent. **Replace path also run** (date_str 2026-10-21, already present): row counts hold at
  139/138, indent holds, nothing lost, SCHEDULE and TAPER_PLAN byte-identical. Note for the next run: assert
  *no growth* on the replace path — asserting growth there prints failures that look exactly like gotcha #2
  and are not.
- **harness notes for the next cold run, verified against today's file.** The node cut is `sed -n '2,1950p'
  src/App.jsx` — **1950 today, 1947 yesterday, so it moved; find it, do not trust it**
  (`awk 'NR>1715 && /^}/ {print NR; exit}'`, and 1715 drifts too). Append `grep '^const hrvBaseline'`.
  **`analyze` takes an argument**: `analyze(parseCSV(CSV_DATA))`, not `analyze()` — a bare call throws
  *"raw is not iterable"*. Per-session cost is **`estTrimp(s, loadModel(ana.enriched))`**, filtering
  `isRestSession` and `isInfoLine`; there is no `_trimp` on a planned session and `out.weeks[].projected` is
  undefined — only `out.governor` carries a projection, and only for the CURRENT week. **`update.patch()`
  wants `wellness['weight']` as a `(date, kg)` tuple**, not a float. Running the harness via
  `node --input-type=module -e "$(cat …)"` fails with *"Argument list too long"*; write the file and
  `node file.mjs`. `npm ci` is needed before `npm run build` in a fresh container; the clone here is shallow.
- **on the no-change count.** The four entries before this one are **20, 19, 18 and 17 Oct, all CHANGED**, so
  **zero consecutive NO CHANGE runs precede this one** and the file's three-NO-CHANGE warning does not apply.
  **The live risk is the opposite one and it is now five days old: churn.** This run's answer to it is that
  **neither edit moves a single costed number** — one corrects a false clause and removes an accessory on a
  day that gained a fixture, the other corrects a fact in the standing rule set that two previous runs have
  already reasoned from. **No dose, no duration, no band and no future week was touched**, and every
  structural question was left on the date it was already committed to.
- **engine defects, outside this Routine's edit surface, carried:**
  1. **`isTennis` (src/App.jsx:1172) is `=== "tennis"` against rows typed `Tennis V2`**, so `loadModel.tennis`
     reads **n=0** (re-confirmed: `{"hr":138,"min":75,"n":0}`) and planned court sessions price from the
     fallback at **101 TRIMP against yesterday's measured 59**. **Sixteenth entry**, and today it is no longer
     academic: **today's projected 149 is ~42 TRIMP too high** because of it, and week 8's 572 against a 560
     ceiling is **~549 corrected**. One word: `/^tennis/`. (Note the line moved from 1161 to 1172.)
  2. **`readiness()` takes only TSB and HRV.** No RHR, no respiration, no REM. **Sixth entry.** It reads
     **8/10** this morning on an athlete who has trained once in seven days, which is true of his recovery and
     silent about his detraining. `signals.rhr` is already computed and exposed; feeding it in is the fix.
  3. **`HARD_TRIMP = 55` counts ordinary days as hard — and it has now fired.** `consecutiveHard` is **1**
     this morning on the strength of a **79-minute social tennis match (59 TRIMP)**. **Tenth entry**, first
     time it is actually live rather than quiet. It changed nothing today (`easeHard` FALSE, scale 1.0), but
     it is one more such day from gating a session.
  4. **`update.py:661`** writes `sleep_score:None` if a caller passes the key with an explicit `None`. Not
     reachable from the real fetch path. **Sixth entry; recorded, not fixed.**
- watching:
  - **delivery, still the only thing that matters, but no longer at escalation pitch.** 20 Oct landed, so the
    six-day stop is closed and yesterday's *"the question goes to him directly"* trigger is **stood down**.
    What replaces it is narrower: **he has trained 59 TRIMP in seven days and every bit of it was
    unprescribed.** **What would make me act: if 21–23 Oct closes with the court session as the only thing
    logged — no erg, no run — then three written sessions in a row have been declined while he keeps turning up
    to tennis, and week 9 gets built as court-plus-bolt-on only, with nothing standing alone. Decide it
    Sat 24 Oct**, after the long run's Friday slot has had its answer.
  - **today's 4×500m @ 1:59, now the ski's third prescription on this block (14, 19, 21 Oct) and the first two
    were not trained.** Standing number: **2380m in 10:18 on 8 Oct is 4:19/1000m, his exact Athens split, off
    a 3:54 fresh TT** — the 24s this block exists to recover. **What would make me act: if 21 Oct logs no erg,
    the ski is 0-for-3 on this block and week 8 carries one erg, on Tuesday behind the court, not two. Decide
    it Thu 22 Oct**, as already committed, separately from the KEY RUN landing the same day.
  - **Thu 22 Oct, the threshold set, 0-for-2 on the written day and 1-for-1 off it.** Two questions, and do not
    let one answer the other: **did he run at all**, and **did 4:06 hold to rep 5**. **What would make me act,
    unchanged from yesterday: if 22 Oct is blank or he runs easy again, 29 Oct stops being `5×1km @ 4:06, 90s
    jog, 50min door to door` and becomes a tempo floor he picks the shape of — he has already delivered 8×1km
    at 4:01 and 3×2km at 14kmh unprescribed. Decide it Fri 23 Oct.**
  - **the run ladder's ceiling, provably written too low.** Week 8 tops out at **6×1km @ 4:06 off 75s**; **1 Oct
    was 8×1km at 4:01**, more reps and 5s/km faster, eight days before the ladder started. **What would make me
    act: once one threshold set has actually landed on its written day, week 9's step is to 4:01 and 7–8 reps,
    not to 4:06 off 60s. Decide it when the first one lands**, not on a date.
  - **Mon 26 Oct is rest, and that is the experiment.** **What would make me act: if 26 Oct logs training
    anyway — a commute, a lift, anything — the slot is fine and it was the content that was wrong, and week 9's
    Monday gets the sled and lunges back. Decide it Tue 27 Oct.**
  - **Tue 27 Oct's ×3 fade test, the measurement this block has been trying to take since 12 Oct.** Against
    **5 Oct's 4:02 / 4:19 / 4:24**, the ask is every rep under 4:08 and rep 3 within 6s of rep 1. **What would
    make me act: if it lands, it sets week 9's ski entirely. If it is blank, the compromised ×3 has been
    prescribed four times (12, 19, 26→27 Oct) and trained once, and it stops being prescribed as a session —
    it folds into the 6×500m. Decide it Wed 28 Oct.**
  - **the Friday-versus-Saturday long run, unchanged.** 23 Oct carries it with 24 Oct as its `note:true`
    backstop; the record favours the backstop (**9 Oct Friday did not happen, 10 Oct Saturday did, at 70min**).
    **What would make me act: if 23 Oct is blank and 24 Oct carries it again, the pairing is 0-for-2 on Friday
    and the long run moves to Saturday outright. Decide it Mon 26 Oct.**
  - **RHR 46, named above.** **What would make me act: two more mornings at 46 or above while HRV stays near
    111 — that combination is not the day-after-a-match artifact it looks like today, and it would mean the
    resumption is costing more than the markers suggest. Decide it Fri 23 Oct.**
  - **running delivery, the standing judgement, date unchanged.** **Trigger: judge 19–25 Oct, decide it Mon
    26 Oct; if it closes under 90 running minutes with no illness in it, week 9 gets its third running session
    built into a trip rather than standing alone.** Judge the ratio, not the total.
  - **the band.** Base I has closed inside 400–560 zero times in three on the SCHEDULE's own Mon–Sun grouping
    (327, 693, 129). **What would make me act: if 19–25 Oct closes below the 400 floor with no illness in it,
    that is two sub-floor weeks running and the question stops being the ceiling and becomes whether 400–560
    describes this athlete's life at all. Decide it Mon 26 Oct**, alongside the running-minutes and long-run
    judgements, so one week's evidence settles all three.
  - **week 9 (2–8 Nov) is still unwritten** and Base I runs to 8 Nov. 17 Oct set it for **Fri 23 Oct**;
    unchanged. It has to absorb the 6×1km density step, the ski decision from 27 Oct, the Monday verdict and
    the court-plus-bolt-on question above.


## 2026-10-20
- adherence: **ACTION REQUIRED still prints `hyrox: 3x — 2026-09-30, 2026-10-07, 2026-10-08`, re-verified
  rather than inherited: parsing all 11 forward day lines (20 Oct–1 Nov) gives **zero sessions typed `hyrox`
  and zero occurrences of hyrox / circle / roxzone anywhere**. All three dates are past, the forward plan is
  clean, and the past lines stay as the record. 30 Sep leaves the window **21 Oct**, 7 and 8 Oct on **28 and
  29 Oct**, and it clears itself on 29 Oct — a run before then re-verifies the forward days and does not
  re-cut the past lines. ski **5/3** · row 0/1 · hyrox 3/0 · strength 4/4 · cycle 1/4 · tennis **3/8** ·
  **run 10/4, short by 6 and still the largest shortfall on the board**. No WATCH section printed — nothing
  sits at 2-and-0. Benchmarks already due: 30 Sep logged, 2 Oct and 15 Oct NOTHING LOGGED, 6 Oct TRAINED
  EASY INSTEAD, 8 Oct TRAINED OTHER TYPE. Next 14d: **Thu 22 Oct and Thu 29 Oct, both KEY RUNs**, both on a
  weekday he trains (Thursday carries 9 logged activities since 14 Sep), neither deferred, both edited below.
- readiness: HRV **107** vs baseline **82** (+25), RHR **44**, resp **12.0**, deep **131**, REM **139**,
  awake **6**, sleep_score **88**, sleepMin **501**. TSB **+2.41**, ATL **27.64**, CTL **30.05**,
  `daysSinceHard` **15**, `consecutiveHard` 0, `daysSinceRest` 0, forceRest FALSE, easeHard FALSE,
  **readiness 8/10**, **scale 1.0, scaleWhy null, 0 adjustments**. LAST_DATA **2026-10-20T06:08Z**, LAST_RUN
  the same — fresh, sync healthy. 138 daily / 137 sleep rows, contiguous through today.
- decision: **CHANGED — seven SCHEDULE/TAPER_PLAN edits. The week-7 erg becomes the re-entry Monday never
  supplied; the ×3 fade measurement comes off a slot that is 1-for-3 and goes onto the back of a court
  fixture; week 8 is re-costed from 616 to 572 so its two measurements survive at full size.** Bands
  untouched, ceiling stays 560. Weeks 1–6 untouched. Nothing on today (20 Oct) touched — it carries a 10:00
  fixture and it is already ~09:00 in Vilnius.
- why: **nothing has been logged since 14 Oct.** Six consecutive blank days, 15–20 Oct, and **tennis stopped
  too** — he plays 3–4×/week and has not played in six days. Within that, **Mon 19 Oct, the keystone, went
  blank on the best wellness reading in three weeks** (HRV 113, RHR 42, five rest days behind it), written as
  the easiest version it has ever been. Yesterday armed exactly this: *"a miss today makes it 1-for-3 … decide
  it Tue 20 Oct"*, and warned that **the diagnosis could no longer hide behind illness**. It is 1-for-3:
  **5 Oct landed, 12 Oct blank, 19 Oct blank.**
- **but the pre-committed remedy was aimed at the wrong thing, and I did not execute it as written.** It
  said: move the compromised ski to Wednesday, leaving the week one erg trip. **Wednesday already is that
  trip** — 15min treadmill, 6×500m, lat pulldown, sled pull — so the move was close to a no-op, and the
  premise behind it (that the miss is evidence about the *Monday slot*) is only half right. The miss sits
  inside a **six-day total stop that includes his most reliable activity**, so attributing it to Monday alone
  would have solved the wrong problem. What the Monday record does support is narrower and still worth
  acting on: **a measurement should not sit on a 1-for-3 slot**, which is edit 3/4 below, on an unstarted week.
- **the finding of this run, and it is a machine one: the governor got LESS protective because he trained
  less.** Week 7 projected **605 TRIMP yesterday with a 7% trim and 4 adjustments**. Monday going blank took
  its **119 TRIMP out of `remainingPlanned`**, so this morning the same week reads **486 projected, trimmedBy
  0, scale 1.0, zero adjustments**. The sessions behind the missed one are now delivered at **full written
  size onto an athlete who has done nothing for six days** — Wednesday's 6×500m @ 1:59 off a **13-day erg
  layoff**, Thursday's threshold set off a **12-day run layoff**, neither with the ×2 re-entry that was
  written to precede them. `adaptPlan` cannot see this: it reconciles against the band, and a missed session
  makes the band easier to hold. **Re-basing what follows a missed re-entry is the plan's job, not the
  engine's**, and that rule is now in the Base I note.
- **what changed, session by session.**
  1. **Wed 21 Oct** — 6×500m @ 1:59 off 90s becomes **4×500m @ 1:59 off 90s**. The pace is untouched because
     the pace is the whole point (4:19/1000m at Athens off a 3:54 fresh TT); only the rep count moves. This
     is yesterday's own new rule — *a progression is never written off a rung that was never climbed* —
     applied one rung lower: the ×2 Monday existed to break the layoff before this test, and 18 Oct refused
     to put a measurement off a ten-day layoff for precisely this reason. The stale clauses go too: the line
     claimed *"the week is costed at 605 against a 560 ceiling"* (it is 486, no trim) and re-litigated an RHR
     cut that lapsed. **Cost unchanged — `SKI 20min` still drives `planDurationMin`.**
  2. **Thu 22 Oct** — **dose untouched** (5×1km @ 4:06 off 90s, 50min), stated reason corrected. It read
     *"this rung has never been climbed"*. **It has: 1 Oct, `Running | 8x1km tempo 4:01` — eight reps at 4:01,
     unprescribed and strictly harder than what is written.** Yesterday's 0-for-2 is true of the exact
     prescription and false of the capacity, and this is the single most useful thing in the log this morning:
     **he does threshold running of his own accord** (also 25 Sep, 3×2km at 14kmh) **and skips it on the day
     it is written**. So the pace is not in question, the **12-day layoff** is, and the line now says so.
  3. **Mon 26 Oct** — the **×3 fade test comes off Monday**, which is 1-for-3 since 5 Oct. The day becomes
     **rest**.
  4. **Tue 27 Oct** — the **×3 fade test lands here**, bolted onto the booked 10:00 fixture, carrying the sled
     pull 8×25m and lunges 4×50m Monday used to hold. The erg-off-a-court-day pattern is **3-for-3** (30 Sep,
     7 Oct, 8 Oct) and produced his best compromised number, **3:57/1000m off a 93min match on 30 Sep**;
     standalone erg trips are 0-for-4. The line says **go anyway if the court falls through**, because the
     anchor is a `cal:true` fixture and those move. The stale `note:true` line claiming *"no fixture is booked
     this far out"* is gone — the fixture landed in the 17 Oct sync and the note has been contradicting it
     on-screen ever since.
  5. **Wed 28 Oct** — it said *"21 Oct is the first real answer on this ask and today is the second"*. With
     21 Oct re-based to ×4, **today is the first 6×500m answer**; corrected.
  6. **TAPER_PLAN, Base I note** — two sentences: *a measurement goes on the slot that lands*, and *the
     governor relaxes when a session is missed rather than tightening*.
- **why Mon 26 became rest rather than a lighter strength session, which is the part I went back and
  changed.** My first cut left Monday as `Strength 45min`. Simulated with TODAY forced to 2026-10-26, week 8
  then read **616 projected, scale 0.909, 6 adjustments** — worse than the 595/6%/5 it had before I touched
  it. At that trim **Thursday's 6×1km @ 4:06 off 75s drops to 45min door to door**, and the reps and
  recoveries alone are **30:51**, leaving 14:09 for warmup, cooldown and getting there — the exact defect
  18 Oct spent its morning removing from week 7 — while **Wednesday's 6×500m takes a `Shorten` adjustment,
  "cut roughly a quarter of the working sets"**, which deletes the measurement. **Both of those were already
  there at −6% before my edits; I inherited them, I did not create them, and leaving them would have been the
  passive call.** Writing a session back onto the 1-for-3 slot immediately after taking the measurement off it
  for being 1-for-3 was also incoherent. Monday out: **572 projected, trimmedBy 0, scale 1.0, zero
  adjustments** — Thursday keeps its 50min and all six reps, Wednesday keeps all six 500s, Friday keeps 80min.
- **on 572 against a 560 ceiling, stated plainly rather than hidden.** The governor applies no trim there, so
  its tolerance sits somewhere between 572 and 616. 572 is **2% over** and **~23 of it is the `isTennis` bug
  below** — the one booked Tue 27 fixture prices at the **101 fallback against a measured ~78**. Corrected for
  that the week is **~549, inside the band**. I did not shave another session to chase a number the engine
  itself does not object to.
- **the physiological signal this run owes, and it is the inverse of the last five entries.** The illness is
  gone and the recovery is complete: **15 Oct HRV 31 / RHR 68 / resp 19.0 / REM 0** → **18–20 Oct HRV 110,
  113, 107; RHR 44, 42, 44; REM 104, 81, 139; deep 52, 101, 131**. **REM 139 is back inside his 114–145
  normal for the first time since the infection**, 501 minutes of sleep, 6 awake. `hrvBaseline` has moved
  **71 → 77 → 82** in three days, machine-written, so the illness depression has fully unwound. **RHR 44 is
  inside the 38–46 range**, and the upward drift flagged on 18 Oct (clean days 10–14 Oct meaning 45.60 against
  a prior-30 mean of 42.90) is closed — the last five mornings read 51, 50, 44, 42, 44. **There is no
  physiological reason left not to train, and that is the point: `daysSinceHard` is 15, TSB is +2.41, and
  CTL has fallen to 30.05 while ATL sits at 27.64.** Measured weeks on the dashboard's own `weeklyTrimp`:
  **Sep 29–Oct 5 441 · Oct 6–12 579 · Oct 13–19 129.** He is detraining on perfect wellness.
- **is the phase still right.** Base I · Aerobic (28 Sep – 8 Nov, 400–560) is four weeks in. On the engine's
  own Mon–Sun grouping it has closed **441 (in band), 579 (19 over), 129 (illness)** — so one clean week has
  landed inside it, which is a softer statement than the "zero times / 327, 693, 129" of the last three
  entries, and the difference is week boundaries (SCHEDULE weeks vs `weeklyTrimp`), not new data. **The band
  is not the problem; delivery is**, and raising it while he trains nothing would be absurd. Copenhagen is
  **27 Mar 2027, 158 days out**, so specificity still belongs later and the phase stands. **Weakness ranking
  has not moved and could not have** — nothing raced or tested since Athens, last erg 8 Oct, last run 10 Oct.
  Ski top 29.8%, running top 27.7%, roxzone top 19.8% and not trainable as a session.
- **what I deliberately left alone.** (1) **Today, 20 Oct** — one court fixture, and the sync stamp is 06:08Z
  against a 10:00 local start; editing a day an hour before it begins is noise. (2) **The three past hyrox
  prescriptions** — rewriting them clears the flag instantly and destroys the only instrument that sees across
  days. (3) **The bands and the 560 ceiling** — he has trained 129 TRIMP in the last seven days; there is no
  case for raising a ceiling he is nowhere near. (4) **Thu 22 Oct's dose** — the layoff argument that set it
  yesterday is unchanged and the 1 Oct finding argues the pace is already his, not that Thursday should be
  bigger off twelve days off. (5) **Fri 23 Oct keeps the long run** with 24 Oct as its `note:true` backstop —
  see watching. (6) **No standalone Z2 run re-added** anywhere: 0-for-3 and removed on 12 Oct. (7) **No
  machine-written constant touched** — not HEALTH_DATA, HYROX_DATA, CSV_DATA, TODAY, LAST_RUN, LAST_DATA,
  `hrvBaseline`, and not one `cal:true` fixture line.
- verification: `npm run build` clean, **452.11 kB** against yesterday's 451.31 (+0.80 kB, the TAPER_PLAN
  note). **11/11** patch anchors. SCHEDULE **57 days / 8 weeks**, 2026-09-06..2026-11-01, sorted and unique,
  **every `dow` verified against its own date (0 mismatches)**, all 57 day lines at 4-space indent;
  `calendar_sync.py`'s own `CAL_SESSION` regex matches **3** fixtures and its `DAY` regex **57** days (the 4th
  `cal:true` in the file is the explanatory comment at src/App.jsx:1433). TAPER_PLAN **18 blocks**. 138 daily
  / 137 sleep rows, indent `[ ]{4}` only, sorted and unique. **Engine re-read after the edits: week 7 still
  486 / trimmedBy 0 / scale 1.0 / 0 adjustments, readiness 8 — numerically identical to before the edits, as
  intended, since no week-7 duration moved. Week 8 simulated at TODAY=2026-10-26: 572 / trimmedBy 0 / scale
  1.0 / 0 adjustments, against 595 / 39 / 0.941 / 5 before.** adherence.py re-run after the edits: **every
  count identical** (run 10/4, ski 5/3, hyrox 3/0) — correct, since all seven edits are on future dates
  outside the backward window. Round-trip `update.patch()` against a copy of the real src/App.jsx (`head -1046
  update.py`, imported with `-I`): **32/32 on the insert path** (date_str 2026-10-21) — TODAY advanced to
  date_str+1, daily/sleep each grown by exactly one with 4-space indent, sorted, unique and no pre-existing
  date lost, weight upserted inside its own array with **`vo2max` byte-identical (gotcha 4)**, `nutrition` and
  `body` byte-identical, CSV row added, no `hrv:0`, no `sleep_score:None`, and SCHEDULE, TAPER_PLAN, RACE,
  PREV_RACE, RACE_BUDGET, RACE_GAINS, STATION_TARGETS and HYROX_DATA all byte-identical with **all six edit
  strings surviving exactly once each**. The replace path (date_str 2026-10-20, a date already present) was
  run first and behaves correctly — row counts hold, indent holds, nothing is lost; **the 4 "failures" it
  printed were my assertion expecting growth on a replace, not a patch bug.** Worth writing down because it
  looks exactly like gotcha #2 and is not.
- **harness notes for the next cold run, verified against today's file.** The node cut is
  **`sed -n '2,1947p' src/App.jsx`** — 1947 today, 1947 on 19 Oct, but **find the closing brace of `adaptPlan`
  rather than trusting it** (`awk 'NR>1712 && /^}/ {print NR; exit}'`, and 1712 drifts too). Append
  `grep '^const hrvBaseline'`. `head -n -4` on a harness file is fragile — rebuild the cut from `src/App.jsx`
  each time instead of trimming a previous harness. To see a future week, copy the harness and `sed` TODAY
  forward; **the readiness it prints is then synthetic (today's wellness) but the week cost is valid.**
  Session-level trims are read off `out.weeks[].days[].sessions[]._adj`, not off the governor.
  `out.governor` carries only the CURRENT week. `ana.weeklyTrimp` is the measured history and groups Mon–Sun,
  which is **not** the SCHEDULE's week grouping — do not compare the two without saying which you used.
  `npm ci` is needed before `npm run build` in a fresh container. The repo clone here is **shallow**.
- **on the no-change count.** The three entries before this one are **19 Oct CHANGED, 18 Oct CHANGED, 17 Oct
  CHANGED**, so **zero consecutive NO CHANGE runs precede this one** and the file's three-NO-CHANGE warning
  does not apply. The live risk remains churn: of seven edits, **four move no load at all** (two reason
  corrections, one stale-note deletion, one TAPER_PLAN note) and the three that do move load move it **off**
  the plan, not onto it.
- **engine defects, outside this Routine's edit surface, carried:**
  1. **`isTennis` (src/App.jsx:1161) is `=== "tennis"` against rows typed `Tennis V2`**, so `loadModel.tennis`
     reads **n=0** (re-confirmed this morning) and planned court sessions price from the fallback at **101
     TRIMP against a measured ~78**. **Fifteenth entry.** It is ~23 of week 8's 572 and the reason that week
     reads 2% over a ceiling it is actually under. One word: `/^tennis/`.
  2. **`readiness()` (src/App.jsx:1332) takes only TSB and HRV.** No RHR, no respiration, no REM — the three
     signals that tracked this illness from start to finish. **Fifth entry.** It also means readiness reads
     **8/10 after six days of nothing**, which is true of recovery and silent about detraining.
     `signals.rhr` is already computed and exposed; feeding it in is the durable fix.
  3. **`HARD_TRIMP = 55` counts ordinary days as hard.** Quiet again (`consecutiveHard` 0, `daysSinceHard`
     15 — nothing to count). **Ninth entry.**
  4. **`update.py:661`** writes `sleep_score:None` if a caller passes the key with an explicit `None`. Not
     reachable from the real fetch path. **Fifth entry; recorded, not fixed.**
- watching:
  - **delivery itself, which is now the only thing that matters and outranks every structural question
    below.** Six blank days, **tennis included**, on HRV 107–113 and RHR 42–44. I cannot tell from here
    whether this is travel, work, a lingering infection the markers do not show, or disengagement, and the
    difference decides everything. **What would make me act: if 20–22 Oct closes with nothing logged at all —
    no court, no erg, no run — then the week is not a dosing problem and no amount of re-basing fixes it;
    week 8 comes down to three sessions built entirely onto court days and the long run, and the question
    goes to him directly rather than into a schedule line. Decide it Fri 23 Oct.** If the court session
    landed today, this reverts to an ordinary post-illness re-entry and the structural items below stand.
  - **Wed 21 Oct, the re-entry, now carrying 4×500m @ 1:59 and the 15min treadmill that breaks a 12-day run
    layoff.** Standing number: **2380m in 10:18 on 8 Oct is 4:19/1000m, his exact Athens split, off a 3:54
    fresh TT** — the 24s this block exists to recover. **What would make me act: if 21 Oct logs no erg, the
    ski is 0-for-3 on this block's prescriptions (14, 19, 21 Oct) and week 8 carries one erg, on Tuesday,
    not two. Decide it Thu 22 Oct**, separately from the KEY RUN landing the same day.
  - **Thu 22 Oct, the threshold set, 0-for-2 on the day and 1-for-1 off it.** Read it as two questions and do
    not let one answer the other: **did he run at all**, and **did 4:06 hold to rep 5**. The 1 Oct finding
    reframes a blank Thursday: it would be the third time the set was written and the second time he ran
    something else instead, which is evidence the **written form** is wrong, not the dose. **What would make
    me act: if 22 Oct is blank or he runs easy again, 29 Oct stops being `5×1km @ 4:06, 90s jog, 50min door to
    door` and becomes a tempo floor he picks the shape of — he has already delivered 8×1km at 4:01 and
    3×2km at 14kmh unprescribed. Decide it Fri 23 Oct.**
  - **the run ladder's ceiling, which is now provably written too low.** Week 8 tops out at **6×1km @ 4:06
    off 75s** and week 9 was to take the off-60s step. **1 Oct was 8×1km at 4:01** — more reps and 5s/km
    faster, eight days before the ladder started. The layoff justifies the current rungs and nothing beyond
    them. **What would make me act: once one threshold set has actually landed on its written day, week 9's
    step is to 4:01 and 7–8 reps, not to 4:06 off 60s. Decide it when the first one lands**, not on a date.
  - **Mon 26 Oct is now rest, and that is the experiment.** Monday is 1-for-3 and I have stopped asking it for
    anything. **What would make me act: if 26 Oct logs training anyway — a commute, a lift, anything — the
    slot is fine and it was the content that was wrong, and week 9's Monday gets the sled and lunges back.
    Decide it Tue 27 Oct**, the same morning the ×3 test is read.
  - **Tue 27 Oct's ×3 fade test, the measurement this block has been trying to take since 12 Oct.** It is now
    on the 3-for-3 slot and written to go ahead without the court. Against **5 Oct's 4:02 / 4:19 / 4:24**, the
    ask is every rep under 4:08 and rep 3 within 6s of rep 1. **What would make me act: if it lands, it is the
    first fade number since 5 Oct and sets week 9's ski entirely. If it is blank, the compromised ×3 has been
    prescribed four times (12, 19, 26→27 Oct) and trained once, and it stops being prescribed as a session —
    it folds into the 6×500m. Decide it Wed 28 Oct.**
  - **the Friday-versus-Saturday long run, unchanged and still the closest thing to an unforced miss.** 23 Oct
    carries it with 24 Oct as a `note:true` backstop; the record favours the backstop (**9 Oct Friday did not
    happen, 10 Oct Saturday did, at 70min**). **What would make me act: if 23 Oct is blank and 24 Oct carries
    it again, the pairing is 0-for-2 on Friday and the long run moves to Saturday outright. Decide it Mon
    26 Oct.**
  - **running delivery, the standing judgement, date unchanged.** Week 7 asks ~120 running minutes across two
    sessions. **Trigger: judge 19–25 Oct, decide it Mon 26 Oct; if it closes under 90 running minutes with no
    illness in it, week 9 gets its third running session built into a trip rather than standing alone.**
    Judge the ratio, not the total — two prescriptions were removed from this week, and 19 Oct is already
    gone, so the denominator is small.
  - **the band, and the clean week that was supposed to test it has already lost its first two days.** Base I
    has closed inside 400–560 once in four. Week 7 can now reach at most ~486 against a 400 floor and will
    land well under it if Wednesday or Thursday slips. **What would make me act: if 19–25 Oct closes below the
    400 floor with no illness in it, that is two sub-floor weeks running and the question stops being the
    ceiling and becomes whether a 400–560 band describes this athlete's life at all. Decide it Mon 26 Oct**,
    alongside the running-minutes and long-run judgements, so one week's evidence settles all three.
  - **week 9 (2–8 Nov) is still unwritten** and Base I runs to 8 Nov. 17 Oct set it for **Fri 23 Oct**;
    unchanged. It now has to absorb the **6×1km density step**, the ski decision from 27 Oct, and the Monday
    verdict above.


## 2026-10-19
- adherence: **ACTION REQUIRED still prints `hyrox: 3x — 2026-09-30, 2026-10-07, 2026-10-08`, and I re-verified
  it rather than inheriting the verdict: parsing all 14 forward days (19 Oct–1 Nov) gives **zero sessions typed
  `hyrox` and zero occurrences of the strings hyrox / circle / roxzone anywhere**. All three flagged dates are
  past. It is resolved in the forward plan and the past lines stay as the record; 30 Sep leaves the window
  **21 Oct**, 7 and 8 Oct on **28 and 29 Oct**, and it clears itself on 29 Oct. **A run before 29 Oct should
  re-verify the forward days as above and not re-cut the past lines.** ski **6/3** (was 5/3 — today's own gym
  line entered the window) · row 1/1 · hyrox 3/0 · strength 5/4 · cycle 1/4 · tennis 2/8 · **run 10/4, short
  by 6 and still the largest shortfall on the board**. No WATCH section printed — nothing sits at 2-and-0.
  Benchmarks already due: 28 Sep and 2 Oct NOTHING LOGGED, 30 Sep logged, 6 Oct TRAINED EASY INSTEAD, 8 Oct
  TRAINED OTHER TYPE, 15 Oct NOTHING LOGGED (closed as illness). Next 14d: **Thu 22 Oct and Thu 29 Oct, both
  KEY RUNs** — both land on a weekday he trains, neither is deferred, and both are edited below.
- readiness: HRV **113** vs baseline **77** (+36), RHR **42**, resp **11.0**, deep **101**, REM **81**, awake
  **0**, sleep_score **95**, sleepMin **497**. TSB **-0.97**, ATL **31.90**, CTL **30.93**, `daysSinceHard` 14,
  `consecutiveHard` 0, `daysSinceRest` 0, forceRest FALSE, easeHard FALSE, **readiness 8/10 (was 7)**, scale
  **0.9256**, scaleWhy *"week projects 605 TRIMP against a 400–560 ceiling"*, 4 `trim` adjustments.
  LAST_DATA **2026-10-19T06:07Z**, LAST_RUN the same — fresh, sync healthy. 137 daily / 136 sleep rows,
  contiguous through today.
- decision: **CHANGED — the run ladder is re-based one rung down, and two lines that justified themselves with
  numbers that have since moved are rewritten to their true reasons.** Four SCHEDULE edits (19, 21, 22, 29 Oct)
  plus one rule appended to the Base I TAPER_PLAN note. **No dose and no duration changed anywhere**: week 7
  still costs **605** and week 8 **595**, the governor still reads scale **0.9256** with the same 4 adjustments.
  Bands untouched, ceiling stays 560.
- why: **22 Oct was written as a density progression off a rung that has never been climbed, landing on a
  12-day running layoff.** 5×1km @ 4:06 off 90s was prescribed **6 Oct** (he ran *Running Z2 10km*, 52:09 —
  adherence calls it TRAINED EASY INSTEAD) and **15 Oct** (NOTHING LOGGED, the infection), so it is **0-for-2**.
  22 Oct then asked **6×1km off 75s** — one more rep *and* 15s less recovery than a set he has not completed —
  as his **first run since 10 Oct**. The ladder had no bottom rung. **22 Oct becomes 5×1km @ 4:06 off 90s and
  29 Oct becomes 6×1km off 75s**, each at its existing 50min; the off-60s step goes into week 9, unwritten
  anyway. Both days keep 50min, so neither week's cost moves by a single TRIMP — verified against the engine,
  605 and 595 before and after.
- **this is yesterday's own ski reasoning applied to the run side, which yesterday did not do.** 18 Oct moved
  the ×3 ski fade test off 19 Oct because *"taken off ten days without an erg it would have measured the layoff
  and not the fade"*. The identical argument held for the run and was not made: the erg got protected and the
  threshold set did not. That rule is now in the Base I note so a cold run applies it to whichever side it hits
  next: **a progression is never written off a rung that was never climbed.**
- **the trim arithmetic is better too, and this was not the reason but it confirms it.** At scale 0.9256 the
  Thursday line trims to **45min door to door**. 6×1km off 75s is **30:51** of reps and recoveries alone,
  leaving 14:09 for warmup, cooldown and getting there. 5×1km off 90s is **26:30**, leaving **18:30**. The
  re-based rung is also the one that survives this week's trim intact.
- **the illness is fully resolved and the RHR excursion has closed — the physiological signal this run owes.**
  The arc: **15 Oct HRV 31 / RHR 68 / resp 19.0 / REM 0** (second-worst day in 137 rows) → **19 Oct HRV 113 /
  RHR 42 / resp 11.0 / REM 81 / deep 101 / awake 0 / sleep_score 95**. HRV 113 is his highest since 1 Oct;
  **RHR 42 is back inside the 38–46 range and below the prior-30 mean of 42.9**. `hrvBaseline` moved **71 → 77**
  overnight (machine-written), so the illness depression is unwinding on its own and the governor's inflation
  artifact is shrinking with it. **The mild upward RHR drift I flagged yesterday as beginning ~10 Oct — clean
  days 10–14 Oct meaning 45.60 against a prior-30 mean of 42.90 — has reversed: the last three mornings read
  50, 44, 42.** The overreach→prodrome→illness reading of 5 Oct–15 Oct still stands as history, but it is
  history now, not a live signal.
- **and that is why two lines had to be rewritten even though neither dose changed.** Today's Monday line said
  *"RHR is still 50 against a 38–46 range"*; the same screen shows him **42**. Wednesday's said *"your clean-day
  RHR mean is 47.7 across 13, 14 and 17 Oct, above the 44 that was set as the cut line"*; that trigger has
  lapsed. He reads these on a phone before training, and a line whose stated reason is contradicted by the
  number next to it is worse than a line with no reason — the three-sentence rule exists because he skips the
  ones he does not trust. **Monday now gives the real reason (11 days since the last erg, 9 since the last run)
  and says outright that this morning is the best wellness reading since the illness. Wednesday now gives the
  durable reason (a 20:30 match the morning after a 10:00 one, and a week costed at 605 against 560) and states
  plainly that the RHR reason has gone.**
- **why Monday was NOT raised back to ×3, which was the live alternative.** Readiness is 8/10, TSB -0.97,
  `daysSinceHard` 14 and he has had five completely blank days — he is about as fresh as he ever is, and the
  stated reason for the ×2 has evaporated. I held it anyway on three grounds: the **11-day erg layoff is
  unchanged** and is the real reason; **18 Oct moved the ×3 fade measurement to 26 Oct on purpose** so it
  measures fade rather than layoff against 5 Oct's 4:02/4:19/4:24, and restoring it today re-creates exactly
  what yesterday fixed; and **day one back from a five-day layoff is the worst day to take a maximal session**,
  with week 5's record 693 → missed 12 Oct keystone → 15 Oct infection one month of evidence that he overreaches.
  **The dose is right; only its stated reason was wrong.**
- **why the Wednesday Z2 run was NOT restored, stated as a resolution rather than a hold.** Its cut-trigger has
  genuinely lapsed, so this needed an answer and not a carry-forward. Three reasons it stays off: the RHR clause
  was only **one of two**, and the other — **21 Oct already carries a 20:30 match the morning after a 10:00
  one**, plus the ski trip — is unchanged and sufficient alone; restoring it puts week 7 back to **~691 against
  560**, which returns the **19% trim** and drops the Thursday benchmark to 40min, the precise defect 18 Oct
  spent the morning removing; and running grows on **28 Oct**, in week 8, where its 45min Z2 run is already
  written and the week costs 595. **What would make me act: the trigger is retired, not re-armed — the running
  decision is now the 26 Oct judgement below and nothing else.**
- **the running shortfall, decomposed honestly rather than quoted as 4-of-10.** Of the 6 missed, **three are the
  standalone easy Z2 run** (29 Sep, 3 Oct, 8 Oct — 0-for-3), a prescription **already removed from the plan on
  12 Oct**, and **two are the infection** (15, 17 Oct). The dominant failure mode is fixed and what remains is
  illness. So I did **not** add a fourth session to a week he starts this morning: the standalone Z2 run is
  0-for-3 and re-prescribing it is the mistake the Base I note exists to prevent. Week 7 asks ~120 running
  minutes across two sessions against **zero in the last nine days**. One thing worth recording because it is
  easy to miss: **today's gym trip already contains 2km of treadmill**, so the 9-day running layoff breaks
  *today*, inside a trip type that is 3-for-3 (30 Sep, 7 Oct, 8 Oct), rather than first on Thursday's benchmark.
  That needed no edit — it was already true — but it is why Thursday is a re-based rung and not a fourth session.
- **is the phase still right.** Base I · Aerobic (28 Sep – 8 Nov, 400–560) is four weeks in and has closed
  inside the band **zero times**: 327, 693, 129. Two of those four weeks contained illness, so the honest
  statement is unchanged — **no clean week has tested this band yet** and week 7 is the first that can.
  Copenhagen is 27 Mar 2027, **159 days out**, so specificity belongs later and the phase stands. **Weakness
  ranking has not moved and could not have**: nothing raced or tested since Athens, last erg 8 Oct, last run
  10 Oct. Ski remains top 29.8%, running top 27.7%, roxzone top 19.8% and not trainable as a session.
- **what I deliberately left alone.** (1) The three past hyrox prescriptions — rewriting them clears the flag
  instantly and destroys the only instrument that sees across days. (2) **The bands and the 560 ceiling** —
  yesterday's physiological case against raising them is unchanged and this morning adds nothing to it.
  (3) **Fri 23 Oct keeps the long run** with 24 Oct as its `note:true` backstop — see watching. (4) **Week 8 is
  otherwise untouched** beyond its Thursday rung. (5) **Today's dose** — ×2, sled pull 6×25m, lunges 3×50m,
  GYM 50min, exactly as 18 Oct wrote it. (6) **No machine-written constant touched** — not HEALTH_DATA,
  HYROX_DATA, CSV_DATA, TODAY, LAST_RUN, LAST_DATA, `hrvBaseline`, and not one `cal:true` fixture line.
- verification: `npm run build` clean, **451.31 kB** against yesterday's 450.18 (+1.13 kB, almost all the note
  clause). **11/11** patch anchors. SCHEDULE **57 days / 8 weeks**, 2026-09-06..2026-11-01, dates sorted and
  unique, **every `dow` verified against its own date (0 mismatches)**, all day lines at 4-space indent;
  `calendar_sync.py`'s own `CAL_SESSION` regex still matches **3** fixtures and its `DAY` regex **57** days
  (a 4th `cal:true` in the file is the explanatory comment at src/App.jsx:1431, not a fixture). TAPER_PLAN
  **18 blocks**. 137 daily / 136 sleep rows, indent `[ ]{4}` only, sorted and unique. **Engine re-read after
  the edit: week 7 still 605, projected 573, trimmedBy 32, scale 0.9256, readiness 8, 4 adjustments — byte-for-
  byte the same governor as before the edit, which is the point.** adherence.py re-run after the edit: **every
  count identical** (run still 10, ski 6, hyrox 3) — correct, since all four edits are on future dates outside
  the backward window. Round-trip `update.patch()` against a copy of the real src/App.jsx (`head -1046
  update.py`, imported with `-I`): **35/35** — TODAY advanced to `date_str`+1, daily/sleep/weight/CSV all
  patched, both wellness arrays keeping their 4-space indent, sorted, unique and grown by exactly one with no
  pre-existing date lost, weight upserted inside its own array with **`vo2max` byte-identical (gotcha 4)**,
  `nutrition` and `body` byte-identical, no `hrv:0`, no `sleep_score:None`, and SCHEDULE, TAPER_PLAN, RACE,
  RACE_BUDGET, RACE_GAINS, STATION_TARGETS and HYROX_DATA all byte-identical through the patch with all five
  of today's edits surviving.
- **two harness traps that cost time and will cost it again.** (1) `update.patch()` takes sleep stages
  **nested under `wellness["sleep"]`**, not flat — passing `deep`/`rem`/`light` at the top level makes
  `has_real_sleep` false and the sleep array silently does not grow, which reads exactly like a patch bug and
  is not (`update.py:650`). `weight` is a **`(date, kg)` tuple**, not a float (`update.py:762`). (2) An
  assertion that a superseded string is gone must be **scoped to its own day line**: `threshold 5×1km @ 4:06,
  90s jog` now legitimately appears **twice** — 15 Oct in the closed week and 22 Oct as today's edit — and a
  whole-file `count == 1` fails on a correct file. Same class of false alarm as yesterday's.
- **on the no-change count.** The three entries before this one are **18 Oct CHANGED, 17 Oct CHANGED, 16 Oct
  CHANGED**, so **zero consecutive NO CHANGE runs precede this one** and the file's three-NO-CHANGE warning does
  not apply. The live risk is the other one, churn, which is why **every edit this morning is zero-cost**: not
  one duration, rep count or session was added or removed, the governor is numerically identical before and
  after, and the week he starts today keeps the shape 18 Oct gave it.
- **engine defects, outside this Routine's edit surface, carried:**
  1. **`isTennis` (src/App.jsx:1161) is `=== "tennis"` against rows typed `Tennis V2`**, so `loadModel.tennis`
     reads **n=0** and planned court sessions price from the fallback at **101 TRIMP against a measured ~78**.
     **Fourteenth entry.** The two booked fixtures are **202 of week 7's 605, 33% of the week**, and ~46 of that
     is the bug. One word: `/^tennis/`.
  2. **`readiness()` (src/App.jsx:1332) takes only TSB and HRV.** No RHR, no respiration, no REM — the three
     signals that tracked this illness from start to finish, and the three that told me this morning it is over.
     **Fourth entry.** `signals.rhr` is already computed and exposed; feeding it in is the durable fix.
  3. **`HARD_TRIMP = 55` counts ordinary days as hard.** Quiet again (`consecutiveHard` 0). **Eighth entry.**
  4. **`update.py:661`** writes `sleep_score:None` if a caller passes the key with an explicit `None`. Not
     reachable from the real fetch path. **Fourth entry; recorded, not fixed.**
- **notes for the next cold run, all verified against today's file.** The node harness cut is
  **`sed -n '2,1945p' src/App.jsx`** — **1945 today, 1941 on 18 Oct; the number drifts with the bot's rows, so
  find the closing brace of `adaptPlan` rather than trusting either** (`awk 'NR>=1710 && /^}/ {print NR; exit}'`,
  and 1710 drifts too). Append `grep '^const hrvBaseline'` after it. **To see what the governor will do on a
  future day, copy the harness and `sed` TODAY forward.** When checking an indent use **`[ ]*`, not `\s*`**.
  `PREV_RACE` is a one-liner, `const PREV_RACE = ATHENS;` — check `ATHENS` instead. Measured load is not
  readable off the week objects; use **`governor.doneTrimp` / `remainingPlanned` / `projected`**.
  `planDurationMin` tries **h:mm before bare-min**, so `1h10` costs a correct 70 and is immune to
  `scaleDuration`; `scaleDuration` rewrites only the **first** `(\d+)min` token. `PLAN_INTENSITY` is
  **first-match-wins** and the `⏱|threshold|KEY RUN` row (168) is tested **before** `compromised` (162) and
  `strength|sled` (126) — which is why today's rep-count edits moved no cost at all. adherence.py counts
  **dates, not sessions**, per type. `npm ci` is needed before `npm run build` — vite is not installed in a
  fresh container. The repo clone here is **shallow (50 commits)**.
- watching:
  - **Monday 19 Oct, the keystone, still 1-for-2** (5 Oct in full, 12 Oct missed two days before the infection).
    It is written as the easiest version it has ever been, on the best readiness it has had in three weeks.
    **What would make me act: a miss today makes it 1-for-3 and the compromised ski moves to Wednesday to merge
    with the 6×500m, leaving the week one erg trip instead of two. Decide it Tue 20 Oct** — and note the
    diagnosis can no longer hide behind illness: **RHR 42, HRV 113 and five rest days remove every physiological
    excuse**, so a miss today is evidence about Monday itself and should be read that way.
  - **Thu 22 Oct, now the first honest answer on 5×1km @ 4:06 off 90s after two failures, and his first run in
    12 days.** Read it as two separate questions and do not let one answer the other: **did he run at all**, and
    **did 4:06 hold to rep 5**. A blank Thursday is evidence about running delivery; a run that holds 4 reps and
    fades is evidence about the engine off a layoff. **What would make me act: if it is blank, the threshold set
    is 0-for-3 and it moves off Thursday onto a day with a court fixture already on it, since the trip is what
    lands. If it runs and holds, 29 Oct's 6×1km off 75s stands as written. Decide it Fri 23 Oct.**
  - **the ski, and 21 Oct is still the first real test of 6×500m @ 1:59.** Protected from the governor (20min
    survives the 7% trim intact) and carrying the lat pulldown, the sled pull and a 15min treadmill block, so it
    is not a standalone erg trip — those are 0-for-4. Standing number: **2380m in 10:18 on 8 Oct is 4:19/1000m,
    his exact Athens split, off a 3:54 fresh TT** — the 24s this block exists to recover. **What would make me
    act: if 21 Oct logs no erg, the Wednesday ski merges into Monday's trip and the week carries one erg.
    Decide it Thu 22 Oct**, separately from the KEY RUN that lands the same day.
  - **running delivery, the standing judgement, unchanged in date and sharpened in content.** Week 7 asks ~120
    running minutes across two sessions. **Trigger: judge 19–25 Oct, decide it Mon 26 Oct; if it closes under
    90 running minutes with no illness in it, week 8's Wednesday Z2 run is the one that grows, and week 9 gets a
    third running session built into a trip rather than standing alone.** Judge the ratio, not the total — two
    prescriptions were removed from this week, so 2-of-2 is a pass and last week's 10-prescription denominator
    is not the comparison.
  - **the Friday-versus-Saturday long run, left alone and still the closest thing to an unforced miss.** 23 Oct
    carries it with 24 Oct as a `note:true` backstop; the record favours the backstop (**9 Oct Friday did not
    happen, 10 Oct Saturday did, at 70min**), and it sits the day after the Thursday set, which is hard-on-hard.
    **What would make me act: if 23 Oct is blank and 24 Oct carries it again, the pairing is 0-for-2 on Friday
    and the long run moves to Saturday outright. Decide it Mon 26 Oct**, alongside the running-minutes and band
    judgements, so one week's evidence settles all three.
  - **the band, and the first clean week is now genuinely in front of us** — no illness in it, the best readiness
    in three weeks, and only a 7% trim rather than 19%, so the governor is not interfering with its own
    experiment. Base I has closed 0-for-4 inside 400–560. **What would make me act: if 19–25 Oct closes above
    620 with running again under 150 minutes, court time becomes a booked fixed cost counted separately rather
    than unplanned load inside the band. Decide it Mon 26 Oct.**
  - **week 9 (2–8 Nov) is still unwritten** and Base I runs to 8 Nov. 17 Oct set it for **Fri 23 Oct**;
    unchanged, and it now also has to absorb the **6×1km @ 4:06 off 60s** step that today pushed out of week 8.


## 2026-10-18
- adherence: **ACTION REQUIRED still prints `hyrox: 3x — 2026-09-30, 2026-10-07, 2026-10-08`, and it is the
  same backward-looking artifact yesterday resolved — all three are PAST days and there are now **0 hyrox,
  circle or roxzone lines anywhere from 19 Oct onward** (verified over all 14 forward days, not assumed).
  ski 5/3 · row 1/1 · **hyrox 3/0** · strength 4/4 · cycle 1/4 · tennis 2/8 · **run 10/4, short by 6 and
  still the largest shortfall on the board** (it read 11/4 yesterday; 29 Sep rolled out of the 21-day
  window). No WATCH section printed — nothing sits at 2-and-0. Benchmarks already due: 28 Sep and 2 Oct
  NOTHING LOGGED, 30 Sep logged, 6 Oct TRAINED EASY INSTEAD, 8 Oct TRAINED OTHER TYPE, 15 Oct NOTHING
  LOGGED (closed as illness). Next 14d: Thu 22 Oct and Thu 29 Oct, both KEY RUNs.
- readiness: HRV **78** vs baseline **71** (+7), RHR **50**, resp **12.0**, REM **79**, sleepMin **450**.
  TSB **-5.12** (was -8.9), ATL **36.79**, CTL **31.67**, `consecutiveHard` 0, `daysSinceRest` 0, forceRest
  FALSE, easeHard FALSE, **readiness 7/10 (was 8)**, scale **1.250**, scaleWhy *"week projects 129 TRIMP,
  under the 400 floor, and readiness is 7/10"*, `adjustments: []` (week 6 is closed, remainingPlanned 0).
  LAST_DATA **2026-10-18T06:07Z**, LAST_RUN the same — 21 minutes old, sync healthy. 135 daily / 134 sleep
  rows, contiguous through 17 Oct.
- decision: **CHANGED — week 7 is re-costed from 691 to 605 so the governor trims it 7% instead of 19%.**
  Three SCHEDULE edits, all on a week he has **not started**, plus one TAPER_PLAN note block. **Bands
  untouched — the ceiling stays 560.** Weeks 1-6 untouched; week 8 deliberately untouched but for one
  sentence on Mon 26 Oct.
- **the 17 Oct row landed, and it is the first thing to check as yesterday instructed.** `{date:"2026-10-17",
  hrv:78,rhr:50,spo2:98,resp:12.0}` and `{deep:65,rem:79,light:306,awake:2}`. So yesterday's "not-yet-landed,
  not a fault" reading was right and there is **no gap to backfill**. Read as yesterday asked — as the
  morning's verdict after the fact — **RHR 50 means the cancel branch was the correct one to add**: the gate
  read *"at 50 and above do not go at all"*, and **nothing is logged on 17 Oct**, so he executed it himself
  off his own watch. That is the first evidence in this block that a three-branch gate written into a line
  actually works, and it is the reason the tool is worth reusing rather than a lucky outcome.
- **the illness has resolved on the marker yesterday named, which is REM and not HRV.** REM went **0 → 0 →
  79** across 15-17 Oct and respiration **19.0 → 13.0 → 12.0** (19.0 remains the highest in all 135 rows).
  Yesterday's armed trigger was *"a third zero-REM night or RHR back above 55 in the 17 or 18 Oct rows and
  Monday's gym trip comes down to the ski alone without the sled pull and lunges"*. **Neither clause fired**
  — REM is back and RHR is 50, not above 55 — so **Monday keeps its sled pull and its lunges**, and that
  trigger is now closed rather than carried. 79min of REM is still well under his 114-145 normal, so this is
  resolved, not restored.
- **the 19 Oct RHR trigger DID fire, and it is the first of today's edits.** It read: compute the 7-day RHR
  mean excluding 15 and 16 Oct; at or above 44 cut the Wednesday Z2 run; under 44 week 7 stands. Stating the
  n as instructed: the clean rows in 13-19 Oct are **13 Oct 46, 14 Oct 47, 17 Oct 50 — n=3, mean 47.67**,
  against a 44 cut line. The unexcluded 13-19 mean is 52.40 and is NOT what I used, per yesterday's explicit
  warning. **So the 45min Z2 run comes off Wed 21 Oct**, and the number is not marginal: 47.67 is 3.67 above
  the line and 4.77 above the prior-30 mean of **42.90**.
- **the wider RHR reading, which the Routine asks for and which is not only about the infection.** His stated
  range is 38-46. The last eight rows run **47, 43, 45, 46, 47, 68, 51, 50**. Strip the two sick days and the
  five clean pre-illness days 10-14 Oct still mean **45.60 — at the ceiling of his range, 2.70 above the
  prior-30 mean of 42.90**. So there is a **mild sustained upward drift in RHR that began around 10 Oct,
  before the infection declared**, and it sits directly after week 5 closing at **693 measured — his record
  week, 47% above the previous best of 472** — and directly before the 12 Oct keystone being missed and an
  infection on 15 Oct. **Overreach, prodrome, illness is a coherent reading of that sequence**, and it is the
  single reason I did not raise the ceiling (below). `hrvBaseline` is **71**, down from 80 across the
  illness; it is still illness-depressed, which is why the governor is asking for +25% on a week an infection
  emptied. That artifact is unchanged from yesterday except that **readiness fell 8 → 7** as HRV's delta came
  back toward baseline.
- **the finding of this run: week 7 was written at 691 against a 560 ceiling, so Monday morning would have
  opened at scale 0.813 and cut all five of its sessions by 19%.** I simulated it rather than inferring it
  (TODAY forced to 2026-10-19 against a copy of the engine, `adaptPlan` re-read): **GYM 60→50min, Z2 run
  45→35min, SKI 20→15min, KEY RUN 50→40min, long run 75→60min**, five `trim` adjustments. **Three of those
  land below the floor at which the session stops being the session.** The KEY RUN at 40min door to door
  cannot hold 6×1km @ 4:06 off 75s jog — the reps and recoveries alone are **30:51**, leaving 9min for
  warmup, cooldown and getting there, and the whole point of writing a length in was that a heavy week trims
  warmup rather than reps. The ski at 15min cannot hold 6×500m @ 1:59 off 90s (**19:24**). And the long run
  at 60min is **below the 70min he already ran on 10 Oct**, so the ladder goes backwards. **This is the
  block-level judgement the engine cannot make**: `adaptPlan` trims proportionally and has no way to know a
  set-based session has a floor, so which session leaves an over-budget week is the plan's call.
- **why this recurred eight days after 12 Oct fixed exactly the same thing.** 12 Oct cut week 6 from 736 to
  fit the 560 ceiling and recorded *"the written week is cut to fit the band instead of the band being raised
  to fit the week"*. **Week 7 was never re-costed afterwards**, and two things pushed it back over: week 8
  was written on 13 Oct, and the booked court fixtures landed. One of those arrived **overnight**: the
  **27 Oct 10:00 fixture with Edvinas appeared in the 2026-10-17T08:07Z sync**, after yesterday's run had
  already read the file, which is why yesterday costed week 8 at 494 and it costs **595** this morning. A
  fixture is machine-written by `calendar_sync.py` (`cal:true`, 10-day horizon, so 18-28 Oct is live), so
  **the cost of a written week moves on its own between runs** and re-costing the next unstarted week is a
  standing job, not a one-off.
- **what I changed, and the arithmetic after it.** (1) **Mon 19 Oct is a re-entry, not the week's hardest
  session:** GYM 60→50min, compromised ski **×3 → ×2**, sled pull 8×25m → 6×25m, lunges 4×50m → 3×50m, both
  marked light. The reason is not the band — it is that Monday is **day one back from four blank days
  (15-18 Oct), his last erg was 8 Oct and his last run 10 Oct**, so a hard triple off a 10-day quality
  layoff is the wrong first session. (2) **The ×3 fade ask moves off 19 Oct onto 26 Oct.** This matters more
  than the dose: *"every rep under 4:08 and rep 3 within 6s of rep 1"* is a **measurement**, and taken off
  ten days without an erg it would have measured the layoff and not the fade, then been compared against
  5 Oct's 4:02/4:19/4:24. 26 Oct already asked for the identical thing, so nothing is lost — it simply
  becomes the **first** honest ×3 answer instead of the second, which is what its line now says. (3) **Wed
  21 Oct loses the 45min Z2 run** on the RHR trigger above; the ski keeps `6×500m @ 1:59` and keeps its lat
  pulldown 4×10 plus sled pull 6×25m in the same trip, and takes **15min of easy treadmill inside the
  session** so the erg is still compromised rather than fresh. Result, measured not estimated: week 7 **691 →
  605**, Monday's scale **0.813 → 0.926**, a **7% trim**, and the week now reads **GYM 45min · SKI 20min ·
  KEY RUN 45min · long run 70min** — the **ski set is no longer trimmed at all**, the KEY RUN keeps 14min for
  warmup and travel around its 30:51, and the long run lands exactly on the 70min of 10 Oct with no
  regression. Four sessions at full size instead of five at 81%.
- **the obvious objection to edit (3), which has a specific answer.** "Ski with the run taken out from in
  front of it" was tried once, on **14 Oct, and got nothing** — 12 Oct made that exact change. But the
  diagnosed cause of that failure is already written in the Base I note and it is **not** the missing run:
  *"THE ERG IS NEVER THE ONLY CONTENT OF A TRIP — 14 Oct asked for 20min of ski alone after a 13:00 match and
  got nothing, while 30 Sep, 7 Oct and 8 Oct all landed as erg then lifting on one trip."* 14 Oct was a
  standalone erg trip; **21 Oct is not** — it carries the lat pulldown and the sled pull that 15 Oct put
  there precisely for this reason, plus the treadmill block. The failure mode is addressed, and the day stops
  being the heaviest in the week (**210 → 149 TRIMP**) on a day that already carries a 20:30 match the
  morning after a 10:00 one and sits immediately before the Thursday benchmark.
- **why the ceiling was NOT raised, which was the live alternative and would have been the easier edit.**
  Raising Base I to 400-660 makes the trim vanish outright — f would be 660/691 = 0.955, and the code only
  trims below 0.95 — and the note's own rule permits a move on *"closed measured weeks and on the plan's own
  costed total"*, both of which I have (327, 693, 129 measured; 691 and 595 written). **I rejected it on the
  physiology.** 693 is his record week by 47%, and it is followed by a missed keystone and an infection; a
  ceiling of 660 would sanction almost exactly the load that preceded the illness, and it would have handed
  him the full 691 on day one back from four blank days. I also declined to raise only the **floor**: the
  inflation branch is capped at 1.25 either way, so a higher floor adds no headroom and only fires 1.25 on
  more weeks — the opposite of what an illness-depressed baseline needs. **The band is right; the written
  week was wrong.**
- **is the phase still right, and have the bands got a real answer yet.** Base I · Aerobic (28 Sep - 8 Nov,
  400-560) is four weeks in and has closed inside the band **zero times**: 327, 693, **129**. Two of those
  four weeks contained illness (2-3 Oct, 15-17 Oct), so the honest statement is unchanged from yesterday —
  **no clean week has tested this band yet**, and week 7 is the first one that can. The phase itself is
  right: Copenhagen is 27 Mar 2027, 160 days out, and specificity belongs later. **Weakness ranking has not
  moved** and could not have: nothing has been raced or tested since Athens, and the last erg was 8 Oct.
  Ski remains top 29.8%, running top 27.7%, roxzone top 19.8% and not trainable as a session.
- **what I deliberately left alone.** (1) **The three past hyrox prescriptions stay exactly as written** —
  rewriting them would clear the flag instantly and destroy the only instrument that sees across days, which
  is the fourteen-mornings failure this file exists to prevent. 30 Sep leaves the window **21 Oct**, 7 and
  8 Oct on **28 and 29 Oct**; from 29 Oct it clears itself. **A run before 29 Oct should read this and not
  re-cut it.** (2) **Week 8 keeps its 45min Wednesday Z2 run** — it costs 595, which trims 6% on 26 Oct and
  breaks nothing, and the RHR trigger I fired was written about 21 Oct, not about a week nine days out.
  (3) **Fri 23 Oct keeps the long run with Sat 24 as its backstop**, though the record favours Saturday
  (10 Oct landed, 9 Oct did not) — see watching. (4) **Today's own line is untouched**: Sunday is full rest
  and family day. (5) **No machine-written constant touched** — not HEALTH_DATA, HYROX_DATA, CSV_DATA, TODAY,
  LAST_RUN, LAST_DATA, `hrvBaseline`, and not one `cal:true` fixture line.
- verification: `npm run build` clean, **450.18 kB** against yesterday's 448.96 (+1.22 kB: the note block in,
  one schedule line out, plus the bot's rows). **11/11** patch anchors. SCHEDULE **57 days / 8 weeks**,
  2026-09-06..2026-11-01, dates sorted and unique, **every `dow` verified against its own date (0
  mismatches)**, all day lines at 4-space indent, **3 `cal:true` lines still matching `calendar_sync.py`'s
  own regex** and the `DAY` day-line shape intact for both that script and adherence.py. TAPER_PLAN **18
  blocks**; 135 daily and 134 sleep rows, indent `{4}` only, sorted and unique. Engine re-read after the
  edit: week 7 **605**, week 8 **595**, Monday's simulated scale **0.926** with 4 adjustments and the ski
  untouched; today's governor still week 6, projected **129**, scale **1.250**, `adjustments: []`.
  adherence.py re-run after the edit: **every count identical** (run still 10, ski 5, hyrox 3), no
  prescription erased and no new type minted — correct, since all four edits are on future dates outside the
  backward window. Round-trip `update.patch()` against a copy of the real src/App.jsx (`head -1046
  update.py`, imported with `-I`): **29/29** — TODAY advanced to `date_str`+1, daily/sleep/weight/CSV all
  patched, wellness rows keeping their 4-space indent, both arrays sorted, unique and grown by exactly one
  with no pre-existing date lost, weight date unique inside its own array and **`vo2max` byte-identical
  (gotcha 4)**, no `hrv:0` row, no `sleep_score:None`, and SCHEDULE, TAPER_PLAN, RACE, ATHENS,
  STATION_TARGETS, RACE_BUDGET, RACE_GAINS and HYROX_DATA all byte-identical through the patch with all four
  of today's edits surviving. One assertion failed on the first pass and was **my check, not the file**: it
  tested that no `Z2 run 45min · late afternoon` string remained anywhere, which also matched **week 8's
  28 Oct line that I intentionally kept** — re-scoped per-day, 21 Oct has 2 sessions with the run gone and
  the fixture intact, 28 Oct still has its run.
- **on the no-change count.** The three entries before this one are **17 Oct CHANGED, 16 Oct CHANGED,
  15 Oct CHANGED**, so **zero consecutive NO CHANGE runs precede this one** and the file's three-NO-CHANGE
  warning does not apply. Churn is the live risk in the other direction, which is why this morning changed
  **two sessions on an unstarted week, one sentence on a third, and one phase note**, while declining to
  raise the band, rewrite week 8, move the Friday long run, or touch the week that just closed.
- **engine defects, outside this Routine's edit surface, carried:**
  1. **`isTennis` (src/App.jsx:1161) is `=== "tennis"` against rows typed `Tennis V2`**, so
     `loadModel.tennis` reads **`{hr:138, min:75, n:0}`** — n=0, confirmed again — and planned court
     sessions price from that fallback at **101 TRIMP each against a measured ~78** (week 5: 311 across four
     matches). **Thirteenth entry, and today it had teeth**: the two booked fixtures are **202 of week 7's
     691, 29% of the week**, and ~46 of that is the bug. One word: `/^tennis/`.
  2. **`readiness()` (src/App.jsx:1326) takes only TSB and HRV.** No RHR, no respiration, no REM — the three
     signals that actually tracked this illness. **Third entry.** `signals.rhr` is already computed and
     exposed; feeding it in is the durable fix.
  3. **`HARD_TRIMP = 55` counts ordinary days as hard.** Quiet again (`consecutiveHard` 0). **Seventh entry.**
  4. **`update.py:661`** writes `sleep_score:None` if a caller passes the key with an explicit `None`. Not
     reachable from the real fetch path. **Third entry; recorded, not fixed.**
- **notes for the next cold run, all verified against today's file.** The node harness cut is
  **`sed -n '2,1941p' src/App.jsx`** — **1941, not the 1940 yesterday recorded; the number drifts with the
  bot's rows, so find the closing brace of `adaptPlan` rather than trusting either** (`awk 'NR>=1706 && /^}/
  {print NR; exit}'`). Cutting one line short fails as `SyntaxError: Unexpected token 'export'`, which looks
  like a bad export and is not. Append `grep '^const hrvBaseline'` after it. **To see what the governor will
  do tomorrow, copy the harness and `sed` TODAY forward** — that simulation is what found today's 19% trim
  and nothing in the live page shows it. When checking an indent, **use `[ ]*` and not `\s*`**: `\s` eats the
  newline under `re.M` and reports a phantom 5-space row. `PREV_RACE` is a one-liner, `const PREV_RACE =
  ATHENS;` — check `ATHENS` as the object instead. Measured load is not readable off the week objects; use
  **`governor.doneTrimp` / `remainingPlanned` / `projected`**. `planDurationMin` tries **h:mm before
  bare-min**, which is why `1h10` costs a correct 70 and is immune to `scaleDuration`; `scaleDuration`
  rewrites only the **first** `(\d+)min` token, so a second duration later in the same line survives a trim
  untouched. `PLAN_INTENSITY` is **first-match-wins and `compromised` (162) is tested before `strength|sled|
  pulldown` (126)** — drop the word "compromised" from an erg line that also mentions a sled and its cost
  silently falls by a quarter. adherence.py counts **dates, not sessions**, per type, so adding the word
  `jog` or `km` to a ski line mints a phantom prescribed run; I used "treadmill" on 21 Oct deliberately,
  since it matches only the activity side. The repo clone here is **shallow (50 commits)**, but
  `git log -S` back to 15 Oct is enough to date a `cal:true` fixture, which is how the 27 Oct one was pinned
  to 17 Oct 08:07Z. `npm ci` is needed before `npm run build` — vite is not installed in a fresh container.
- watching:
  - **Monday 19 Oct, the keystone, still 1-for-2** (5 Oct in full, 12 Oct missed two days before the
    infection, so plausibly prodrome). It is now written as a ×2 re-entry, which is the easiest version it
    has ever been. **What would make me act: a miss on 19 Oct makes it 1-for-3 and the compromised ski moves
    to Wednesday to merge with the 6×500m, leaving the week one erg trip instead of two. Decide it Tue
    20 Oct** — and note the diagnosis then has to separate "day one back from illness" from "Monday does not
    work", which a single miss cannot do on its own.
  - **the 18 Oct row, missing at the time of this run and not a fault.** No `{date:"2026-10-18"}` row exists;
    LAST_DATA is 21 minutes old and the arrays are contiguous, and the same thing happened on 17 Oct and
    resolved on its own — weekends sync late. **What would make me act: if 18 Oct is still absent on the
    19 Oct run, that is a real gap** — say so, change nothing on its account, and expect `mode=backfill` if
    it is still missing on 20 Oct. **It also carries the last unread clause of the illness**: if 18 Oct reads
    RHR above 55 or a return to zero REM, Monday comes down to the ski alone and the lifting comes off.
  - **the ski, and 21 Oct is still the first real test of 6×500m @ 1:59.** It is now protected from the
    governor (20min survives a 7% trim intact) and it carries the lifting and a treadmill block. Standing
    number: **2380m in 10:18 on 8 Oct is 4:19/1000m, his exact Athens split, off a 3:54 fresh TT** — the 24s
    this block exists to recover. **What would make me act: if 21 Oct logs no erg, the Wednesday ski merges
    into Monday's trip and the week carries one erg. Decide it Thu 22 Oct**, and read it **separately** from
    the KEY RUN test that lands the same day — a blank Thursday is evidence about the run and says nothing
    about the erg.
  - **running delivery, still the sharpest number in the block: 4 of 10 prescribed over 21 days, on his
    weakest block against the field at top 27.7%.** Week 6 closed with **zero running minutes** against 158
    on court, but it closed that way because of an infection, and growing a week to compensate for an illness
    is the same error as cutting one. Week 7 now asks ~125 running minutes (KEY RUN + long run) against ~178
    as written — **I removed a prescription, so judge the ratio honestly next week, not just the total.**
    **Trigger unchanged: judge 19-25 Oct, decide it Mon 26 Oct; if it closes under 90 running minutes with no
    illness in it, week 9's Wednesday run grows.**
  - **the Friday-versus-Saturday long run, left alone today and the closest thing to an unforced miss.**
    23 Oct carries it with 24 Oct as a `note:true` backstop. The record favours the backstop: **9 Oct Friday
    did not happen and 10 Oct Saturday did, at 70min**. It also sits the day after the Thursday threshold
    set, which is hard-on-hard. **What would make me act: if 23 Oct is blank and 24 Oct carries the long run
    again, the pairing is 0-for-2 on Friday and the long run moves to Saturday outright with Friday written
    easy or empty. Decide it Mon 26 Oct**, alongside the running-minutes judgement and the band question, so
    one week's evidence settles all three.
  - **the band, and the first clean week is finally in front of us.** Base I has closed 0-for-4 inside
    400-560 and no clean week has tested it. Week 7 is written at **605**, which trims 7% to about 573 asked.
    **What would make me act: if 19-25 Oct closes above 620 with running again under 150 minutes, court time
    becomes a booked fixed cost counted separately rather than unplanned load inside the band. Decide it
    Mon 26 Oct.** And note the trap this trigger nearly walked into: **the governor interferes with its own
    experiment** — a week whose sessions were all shaved 19% before he saw them cannot tell you whether the
    band is right. That is now much less of a problem at 7%, which is the second reason today's edit mattered.
  - **week 9 (2-8 Nov) is still unwritten** and Base I runs to 8 Nov. Yesterday set it for **Fri 23 Oct**,
    alongside the 22 Oct benchmark read. Unchanged.


## 2026-10-17
- adherence: **ACTION REQUIRED is back — `hyrox: 3x — 2026-09-30, 2026-10-07, 2026-10-08`, prescribed three
  times and trained zero.** It was absent yesterday (hyrox read 3/1) because the 21-day window moved: the
  one circle he actually did was 25 Sep and it has now rolled out of the window, leaving three prescriptions
  and nothing done. ski 5/3 · row 1/1 · **hyrox 3/0** · strength 4/4 · cycle 1/5 · tennis 2/8 · **run 11/4,
  short by 7 and still the largest shortfall on the board.** Benchmarks already due: 28 Sep and 2 Oct
  NOTHING LOGGED, 30 Sep logged, 6 Oct TRAINED EASY INSTEAD, 8 Oct TRAINED OTHER TYPE, 15 Oct NOTHING LOGGED
  (closed yesterday as illness, not adherence). Next 14d: Thu 22 Oct and Thu 29 Oct, both KEY RUNs.
- readiness: **no row for today exists.** The engine is therefore reading the 16 Oct row as today's: HRV
  **88** vs baseline **71** (+17), RHR **51**, resp 13.0, sleepMin 425. TSB **-8.9** (was -14.4), ATL **42.5**,
  CTL **33.5**, `consecutiveHard` 0, `daysSinceRest` 0, forceRest FALSE, easeHard FALSE, **readiness 8/10
  (was 7), scale 1.250**, scaleWhy *"week projects 223 TRIMP, under the 400 floor, and readiness is 8/10"*,
  `unplanned7` 201. `adjustments: []`. LAST_DATA **2026-10-17T06:07Z**, LAST_RUN the same, 134 daily / 133
  sleep rows, contiguous through 16 Oct.
- decision: **CHANGED — today's long run is re-gated on his own watch with a third branch that cancels it,
  the dead Hyrox-circle reminder comes out of 21 Oct, and the Base I note gains two sentences.** Week 6's
  remaining cost is **unchanged at 94** (projected 223); weeks 7 and 8 are byte-identical at **689** and
  **494**. No day was moved and no session was added or removed except the note-only circle line.

- **the row this morning needed did not arrive, and it is the row yesterday's trigger was armed on.**
  Yesterday set: *"if tomorrow's row still shows RHR at or above 50, OR respiration back above 15, OR a
  third consecutive zero-REM night, Saturday's long run comes off too and the weekend is written off
  entirely — decide it Sat 17 Oct."* There is **no `{date:"2026-10-17"}` row in `daily` or `sleep`**, so all
  three clauses are unevaluable. This is **not a broken sync** by the stated test: LAST_DATA is 21 minutes
  old at the time of this run (06:07Z against 06:28Z now, 09:28 Vilnius), the arrays are contiguous and
  unchanged in length since yesterday, and full-mode runs continue hourly to 09:00Z. The most likely reading
  is the benign one — **he is two days into a resolving infection on a Saturday and is probably still
  asleep, so the watch has not synced the night** — and `missing_wellness_dates(REFRESH_DAYS=4)` will pick
  it up without intervention. The one check I could make: on 16 Oct the same-morning row **was** present in
  the 06:08Z commit, so this is a departure from yesterday's timing, but the clone is shallow (50 commits,
  back to 15 Oct) and I could not test any earlier day, let alone an earlier Saturday. **Recorded as
  not-yet-landed, not as a fault. If 17 Oct is still missing tomorrow morning, that is a real gap and the
  next run should treat it as one.**
- **so the trigger is resolved by handing it to the only party who has the number, which is him, with his
  watch, before he leaves.** This is the whole point of a gate written into the line, and yesterday's line
  already had one — but it was **weaker than the trigger it was supposed to serve**: it read *"at 48 and
  below run the full hour and ten, in the fifties keep it easy and short"*, so an RHR of 55 would have sent
  him out for a short easy run when the armed decision said the weekend comes off. That mismatch is the
  defect, and it is the thing I fixed. The line now carries all three branches explicitly: **under 48 the
  full hour and ten; 48-49 cut to half an hour and say so in the title; 50 and above do not go at all,
  because that is a third bad night and the weekend is written off.** He now executes yesterday's trigger
  himself, at the only moment the data exists.
- **why gate and not cancel, which was the live alternative.** Cancelling outright was defensible and I
  rejected it on three numbers. (1) **The trend is resolution, not deterioration:** respiration has gone
  19.0 → 13.0 (19.0 is the highest in all 134 rows, by 3.0 over the next worst) and HRV 31 → 88. (2) He has
  now had **two complete rest days**, 15 and 16 Oct, both blank. (3) **Week 6 has delivered zero running
  minutes** against 159 on court, and running is his weakest block against the field at top 27.7% — so
  cancelling costs the only running in the week to insure against a number that may well read 44. Against
  that, RHR **51** on 16 Oct is still **5 above the top of his 38-46 range and 7.2 above the prior-30 mean
  of 43.83**, and **16 Oct was a second consecutive zero-REM night** — which is why the cancel branch exists
  at all rather than being left out. Gating is strictly better than guessing from a two-day-old row in both
  directions.
- **the illness artifact got STRONGER overnight, which is the finding of this run.** Yesterday documented
  the loop: a post-illness HRV rebound, measured against a baseline the illness itself depressed (80 → 71),
  on a week the illness itself emptied, producing an instruction to add 25%. All of that still holds, and
  **one more input has now moved the same way**: two blank sick days lifted TSB from **-14.4 to -8.9**, the
  TSB term in `readiness()` rose with it, and **readiness went 7 → 8**. `scale` is still **1.250** and
  `scaleWhy` still names the 400 floor. So the governor is pushing harder today than it was yesterday, for
  the additional reason that he was too ill to train. **`readiness()` cannot see any of this** — it takes
  only TSB and HRV (src/App.jsx:1326), and RHR 51, two zero-REM nights and a record respiration rate two
  days ago are not inputs. Note `signals.rhr` **is** computed and exposed; it simply is not fed to
  `readiness()`.
- **and the only thing between him and a 90-minute run is a spelling.** `adjustments` is empty and today's
  session reads `_adj: null` **solely because `scaleDuration` rewrites a `(\d+)\s*min` token and `1h10` has
  none**; `planDurationMin` still parses it to **70** via its `h`-branch, so the session costs a correct 94
  TRIMP and adherence.py still counts it as a prescribed run (verified: run stayed at 11 prescribed after my
  edit). Yesterday engineered this deliberately and it is working. **I preserved the exact `1h10` token, and
  I checked my new text introduces no digit-followed-by-`min` anywhere** — the durations in it are "1h10",
  "half an hour", and the bare numbers 48, 49, 50 and 159. I also kept the word "or" out of the line, since
  `isOptionalLine` matches a bare `\bOR\b` case-insensitively and would halve the session's TRIMP.
  **Because this guard is one careless tidy away from failing, it is no longer only in this file: it is now
  a sentence in the Base I phase note, which is harder to miss than entry 2 of a 3600-line log.**
- **the hyrox ACTION REQUIRED, resolved by taking it out — and an explicit refusal to resolve it the easy
  way.** The three counted prescriptions are the circle written as a real session on **30 Sep** and
  **7 Oct**, and the **8 Oct `⏱ Roxzone circuit`** benchmark. All three are **past days**, so of the three
  options the Routine offers — move it to a day he trains, change it to something he will do, take it out —
  only the third is available. What I did: **removed the standing `note:true` circle reminder from Wed
  21 Oct**, which was the last hyrox line anywhere in the forward plan, and **recorded the decision in the
  Base I note** so the next cold run does not re-add it. There is now **no hyrox session, prescribed or
  reminded, written after today**. That is correct for the block on its own terms: the circle **last ran
  25 Sep, 22 days ago**, the reminder hardcoded the stale assertion *"It has not run since 25 Sep"* that
  every future run would have copied forward unchecked, and Base I is an aerobic block whose own note says
  specificity comes later — Monday's compromised ski into run carries it.
  **What I deliberately did not do: rewrite the three past lines.** Converting them to `note:true` or
  deleting them would have cleared the flag instantly and **destroyed the only instrument that sees across
  days** — a Routine that each morning erases the prescriptions it failed to deliver reads clean forever,
  which is precisely the fourteen-mornings failure this file exists to prevent. **So be honest about the
  number: `hyrox 3/0` will keep printing.** 30 Sep leaves the 21-day window on **21 Oct**, 7 and 8 Oct on
  **28 and 29 Oct**; from 29 Oct the flag clears itself and should then stay clear, because nothing forward
  prescribes it. **A run before 29 Oct that sees this flag should read this paragraph and not re-cut it.**
- **the 8 Oct line is worth one more sentence, because it is a rule already written being violated in
  place.** `⏱ Roxzone circuit` is a prescribed transition session, and Simas's own correction at the top of
  this file is that **roxzone is not trainable as a session** — his gym has everything close together, so
  race transitions cannot be rehearsed, and compromised running carries it instead. The Base I note already
  records that the roxzone circuit "had three named hosts and was trained zero times". The forward plan
  contains no such line. Nothing to fix; noting that the flag's third count is a dead rule, not a live ask.
- **the 22 Oct benchmark is not pre-deferred, checked rather than assumed.** The Routine says a benchmark
  landing in the next fortnight on a weekday he does not train is already deferred. **Thursday is a day he
  trains: 3 of the last 4 weeks** (24 Sep tennis, **1 Oct `8x1km tempo 4:01`**, 8 Oct the erg-plus-lifting
  trip; 15 Oct blank on illness), and trained-day counts since 21 Sep run Mon 2, Tue 4, Wed 3, **Thu 3**,
  Fri 2, Sat 2, Sun 2 — Thursday is mid-pack, not empty. More to the point **1 Oct was the KEY RUN format
  itself, on a Thursday, at 4:01/km against a 4:06 ask**, with nobody moving it. So both Thursday benchmarks
  stay where they are and **yesterday's test stands unaltered: if 22 Oct is blank or reads easy with no
  illness marker and no 2h-plus court session that morning, the KEY RUN moves to Tuesday or Wednesday late
  morning, NOT onto Monday's gym trip. Decide it Fri 23 Oct**, alongside writing week 9.
- **the phase is still right and the bands still do not move.** Base I · Aerobic (28 Sep - 8 Nov, 400-560)
  is three weeks in and has never closed inside the band, and week 6 will close around 223-317 — but **two
  of those weeks contained illness** (2-3 Oct and 15-16 Oct), and the note's own rule is that the band moves
  on closed measured weeks and the plan's costed total, never on a projection and never on a week an
  infection emptied. Weeks 7 and 8 are written at **689** and **494** against a 560 ceiling, so the written
  plan is not short of the band; delivery is. **The question is whether 400-560 is realistic against what he
  absorbs, and the honest answer is that no clean week has tested it yet** — week 5 closed at 693 measured
  with tennis supplying 311 of it. **Trigger unchanged and still waiting on a clean week: if 19-25 Oct
  closes above 620 with running again under 150 minutes, court time becomes a booked fixed cost rather than
  unplanned load. Decide it Mon 26 Oct.**
- **what else I deliberately left alone.** (1) **Did not backfill week 6** — it is ~278 short of the floor
  and there is no honest way to recover that in two days out of an infection; the week is written off.
  (2) **Did not touch Mon 19 Oct or anything in weeks 7-9** — the physiology says one more gated day, so I
  changed one day's gate. (3) **Did not touch the ski**; 21 Oct remains the first real test of 6x500m @ 1:59
  with the lat pulldown and sled pull attached. (4) **Did not touch the 14 Oct circle reminder** — it is
  history, same reason as the three prescriptions. (5) **Did not move `hrvBaseline`, or any machine-written
  constant.**
- verification: `npm run build` clean, **448.96 kB** against yesterday's 448.35 (+0.61 kB: two note
  sentences in, one note-only schedule line out, plus the bot's rows). **11/11** patch anchors. SCHEDULE
  **57 days / 8 weeks**, 2026-09-06..2026-11-01, dates sorted and unique, **every `dow` verified against its
  own date (0 mismatches)**, all day lines at 4-space indent; TAPER_PLAN **18 blocks**; 134 daily and 133
  sleep rows, indent `{4}` only, sorted and unique. Engine re-read after the edit: **scale still 1.250,
  readiness 8, `adjustments: []`, today `_adj: null`, `planDurationMin("1h10") = 70`**; week 6 remaining
  **94**, weeks 7-8 **689** and **494**, all three identical to before the edit. adherence.py re-run after
  the edit: **run still 11 prescribed** (the rewritten line is still counted), no new type minted.
  Round-trip `update.patch()` against a copy of the real src/App.jsx (`head -1046 update.py`, imported with
  `-I`): **33/33** — TODAY advanced to `date_str`+1, daily/sleep/weight/CSV all patched, wellness rows
  keeping their 4-space indent, both arrays sorted, unique and grown by exactly one with no pre-existing
  date lost, weight date unique inside its own array and **`vo2max` untouched (gotcha 4)**, no `hrv:0` row,
  no `sleep_score:None`, and SCHEDULE, TAPER_PLAN, RACE, PREV_RACE, ATHENS, STATION_TARGETS, RACE_BUDGET,
  RACE_GAINS and HYROX_DATA all byte-identical through the patch with all three of today's edits surviving.
- **on the no-change count.** The three entries before this one are **16 Oct CHANGED, 15 Oct CHANGED,
  14 Oct NO CHANGE**, so **zero consecutive NO CHANGE runs precede this one** and the file's
  three-NO-CHANGE warning does not apply. Today is CHANGED. Churn is the live risk in the other direction,
  which is why this morning **re-gated one day, deleted one note-only line, and added two sentences to a
  phase note**, while declining five edits it had standing invitations to make.
- **engine defects, outside this Routine's edit surface, carried:**
  1. **`readiness()` (src/App.jsx:1326) takes only TSB and HRV.** No RHR, no respiration, no REM. **Second
     entry, and today it is worse than yesterday: the illness-created rest raised TSB and pushed readiness
     7 → 8, so the two sick days now read as a green light.** `signals.rhr` already exists and is already
     exposed; feeding it to `readiness()` is the durable fix for everything above.
  2. **`isTennis` (src/App.jsx:1161) is `=== "tennis"` against rows typed `Tennis V2`**, so
     `loadModel.tennis` reads **`{hr:138, min:75, n:0}`** — n=0, confirmed again this morning — and planned
     court sessions price from that fallback at ~101 TRIMP against a measured median of 76. **Twelfth entry.
     One word: `/^tennis/`.**
  3. **`HARD_TRIMP = 55` counts ordinary days as hard.** Quiet again today (`consecutiveHard` 0).
     **Sixth entry.**
  4. **`update.py:661`** writes `sleep_score:None` if a caller passes the key with an explicit `None`. Not
     reachable from the real fetch path. **Second entry; recorded, not fixed.**
- **notes for the next cold run, all verified against today's file.** The node harness cut is
  **`sed -n '2,1940p' src/App.jsx`** — 1940 is the closing brace of `adaptPlan`; grep `^const hrvBaseline`
  for its line (**2338 today**) and append it, because the number drifts. **`PREV_RACE` is a one-liner,
  `const PREV_RACE = ATHENS;`** — a round-trip harness that greps it as `const PREV_RACE = \{.*?\n\};` gets
  a false FAIL, as mine did on the first pass; check `ATHENS` as the object instead. **Measured load is NOT
  readable off the week objects**: `weeks[i].days[j]._done[k].trimp` reads 0/null, and a week object has
  only `{week, label, theme, days}` — use **`governor.doneTrimp` / `remainingPlanned` / `projected`** (129 /
  94 / 223 this morning). `patch()` advances TODAY to `date_str` + 1 day; it reads sleep stages from a
  nested `wellness["sleep"]` dict; `weight` is a `(date, kg)` tuple; the function is `planIntensity`, not
  `planHR`; **`analyze()` takes `parseCSV(CSV_DATA)`, not the raw string.** The repo clone here is
  **shallow (50 commits)**, so `git log -S` cannot see past 15 Oct — do not conclude anything from an empty
  result.
- watching:
  - **the missing 17 Oct row, which is the first thing to check tomorrow.** **What would make me act: if
    `daily` still has no 2026-10-17 row on the 18 Oct run, that is a real gap and not a late sync** — say so
    plainly, change nothing on its account, and expect `mode=backfill` to be needed if it is still absent on
    19 Oct. If it landed, **read it as this morning's verdict after the fact**: RHR at 50 or above means the
    cancel branch was the right one to add, and it should be kept in the Monday line too.
  - **the illness, still the thing that matters.** Two zero-REM nights and RHR 51 on the last row available.
    Every zero-REM cluster in the 133-row record sits on an RHR excursion — 8-9 Aug (55, 57), 22 Aug (59),
    3 Sep (67), 2-3 Oct (54, 62), 15-16 Oct (68, 51) — so REM returning is the marker to watch, not HRV,
    which rebounds first and lies. **What would make me act: a third zero-REM night or RHR back above 55 in
    the 17 or 18 Oct rows and Monday's gym trip comes down to the ski alone without the sled pull and
    lunges. Decide it Mon 19 Oct.**
  - **the 19 Oct RHR trigger, restated once more because it still cannot be computed as written.** It reads:
    compute the 7-day RHR mean **excluding 15 and 16 Oct**; at or above 44 cut the Wednesday Z2 run; under 44
    week 7 stands. The five clean days 10-14 Oct mean **45.6**; the full 7-day mean including the sick days
    is **49.57**; the prior-30 mean is **43.83**. **With 17 Oct missing, Monday's window may have only 5-6
    usable days. Compute it from whatever clean rows exist in 13-19 Oct, state the n, and do not substitute
    the unexcluded mean — 49.57 clears 44 on the strength of 68 and 51 alone and would cut a week for an
    infection that has resolved.**
  - **running delivery, the sharpest number in the block and now at zero.** Week 6: **0 running minutes**
    against 159 on court. Prior weeks 100 / 109 / 122 minutes (18.5 / 20.6 / 22.8 km) against ~185 written.
    His weakest block against the field, top 27.7%. **The 17 Oct judgement is suspended for cause as
    yesterday set it — this week closed empty because of an infection, and growing a future week to
    compensate for an illness is the same error as cutting one. Judge 19-25 Oct instead, decide it
    Mon 26 Oct**, and if that week also closes under 90 running minutes with no illness in it, week 9's
    Wednesday run grows.
  - **the ski format, unchanged and still armed. 21 Oct is the first real test of 6x500m @ 1:59**, with lat
    pulldown and sled pull on the same trip. **What would make me act: if 21 Oct logs no erg, the Wednesday
    ski merges into Monday's gym trip and the week carries one erg instead of two. Decide it Thu 22 Oct.**
    Standing number: 2380m in 10:18 on 8 Oct is **4:19/1000m, his exact Athens split**, off a 3:54 fresh TT
    — the 24s this block exists to recover. The KEY RUN test also lands on Thu 22 Oct; **read them
    separately**, since a blank Thursday is evidence about the run and says nothing about the erg.
  - **the Monday keystone, still 1-for-2** (5 Oct in full, 12 Oct missed, and that miss sits two days before
    an infection declared so it may be prodrome). **What would make me act: a second consecutive miss on
    19 Oct makes it 1-for-3 and the compromised ski moves to Wednesday to merge with the 6x500m. Decide it
    Tue 20 Oct.**
  - **hyrox, now removed forward.** **What would make me act: if he logs a circle at all, or says the class
    is running again, Wednesday gets it back as a real session and the ski moves to Monday's trip.** Until
    then nothing is written and the flag is history clearing itself by 29 Oct, as above.
  - **same-day adherence**, the 14 Oct instrument. **What would make me act: under 60% across 12 Oct -
    1 Nov, measured Mon 2 Nov** — that says the day-of-week assignment is wrong, not the content. **Exclude
    15, 16 and 17 Oct** when the time comes; an infection is not a scheduling verdict and neither is a day
    whose data never arrived.
  - **Base I week 9 (2-8 Nov), still unwritten.** Its rung is the **4:04-off-60s** that the Base II note
    names as where Base I ends. **Write it Fri 23 Oct**, once 22 Oct has reported, under the standing rule
    that the erg is never the only content of a trip.

---

## 2026-10-16
- adherence: **no ACTION REQUIRED and no WATCH** — "every prescribed session type has been trained at
  least once". ski 5/3 · row 1/1 · hyrox 3/1 · strength 5/4 · cycle 1/5 · tennis 2/8 · **run 11/5, short
  by 6 and the largest shortfall on the board.** Benchmarks already due: 28 Sep and 2 Oct NOTHING LOGGED,
  30 Sep logged (the 3:57 TT), 6 Oct TRAINED EASY INSTEAD, 8 Oct TRAINED OTHER TYPE, and **15 Oct NOTHING
  LOGGED — yesterday's entry left this open as "not yet a miss"; it is now closed, and the reason is not
  adherence.** Next 14d: Thu 22 Oct and Thu 29 Oct, both KEY RUNs on a Thursday, nothing pre-deferred.
- readiness: HRV **88** vs baseline **71** (+17), RHR **51**, form **-14.4**, 7h05 asleep (43 deep, **0
  REM**, 382 light). `hrvBaseline` **80 → 71**. LAST_DATA **2026-10-16T06:08Z**, 134 daily / 133 sleep rows,
  contiguous. Engine signals read out of `adaptPlan`: **readiness 7/10, ATL 49.0 against CTL 34.6 (1.42x),
  consecutiveHard 0, daysSinceRest 0, forceRest FALSE, easeHard FALSE, scale 1.250, adjustments
  ["Volume raised 25%" on today]** — the governor was not idle this morning, it was pushing, and that is
  what this entry is about.
- decision: **CHANGED — today becomes a recovery day and the long run moves to Saturday.** 16 Oct goes from
  `Long run 70min Z2` to `{type:"rest"}`; 17 Oct goes from a note-only backstop to the real prescribed
  session, `Long run 1h10 Z2`; and the Base I phase note gains one sentence. Week 6's written cost is
  **unchanged at 407** — the 94 TRIMP moved from Friday to Saturday, nothing was added and nothing removed.
  Weeks 7 and 8 are byte-identical (689 and 494).
- why: **15 Oct was an acute illness, not a missed session, and it is the second-worst wellness day in his
  entire 134-row record — on all three markers at once.** RHR **68** (2nd highest ever, behind only 69 on
  3 May) · respiration **19.0** (**the highest ever recorded**, by 3.0 over the next worst) · HRV **31**
  (2nd lowest ever, behind 29 on 3 May) · 5h11 of sleep with **50 minutes awake and zero REM**. The whole
  day went blank. For comparison the 2-3 Oct illness peaked at RHR 62 / HRV 43 / resp 15, so this was worse.

- **the engine was about to tell him to run ninety minutes, and every input that got it there was an
  artifact of the illness.** This is the finding, and it is a clean three-step loop:
  1. **The sick night dropped `hrvBaseline` from 80 to 71.** That constant is Garmin's own 7-day HRV
     `weeklyAvg` (`update.py:643`), so the HRV-31 night went into the window and pulled the mean down 9ms.
  2. **`readiness()` divides today's HRV by that depressed baseline.** 88/71 = **1.239**, over the 1.15
     cut, so `hrvScore` takes its **top value of 9**. Had the baseline still read 80, 88/80 = 1.10 →
     `hrvScore` 7 → readiness `round(0.4x4.84 + 0.6x7)` = **6**. At 71 it is `round(0.4x4.84 + 0.6x9)` =
     **7**. The illness moved readiness up by exactly one point.
  3. **The volume-raise gate is `R >= 7`.** One point was the whole difference. With week 6 projecting
     **223 against a 400 floor** — short because illness took out Thursday's 122-TRIMP KEY RUN — the
     governor set `scale 1.25` and wrote **"Volume raised 25%"** onto today. `scaleDuration` would have
     rewritten `70min` to **90min** (70 x 1.25 = 87.5, `round5` rounds up).
  So: a post-illness HRV rebound, measured against a baseline the illness itself depressed, on a week the
  illness itself emptied, produced an instruction to add 25% to the first morning back. **Three illness
  artifacts, all pushing the same way, and none of them visible to the engine as illness.** `readiness()`
  takes only TSB and HRV — **RHR, respiration and REM are not inputs**, so the three markers that actually
  called this (51, 13.0 after 19.0, and a second consecutive zero-REM night) could not reach it.
  `easeHard` could not catch it either: `hrvDelta` is **+17**, `sleepMin` **425** clears the 360 gate, and
  `consecutiveHard` reads **0** because the engine scores a sick day as a rest day.
- **why this is a physiological reason and not a preference, which is the bar for touching a week in
  progress.** RHR **51** is still 5 above the top of his 38-46 range and **9.2 above his prior-30 mean of
  41.77**; the 7-day mean is **49.57** against 44.86 the week before. Respiration has normalised (19.0 →
  13.0) and HRV has rebounded, so this is an infection in resolution roughly 24-36h in, not a deteriorating
  one — which is exactly why the answer is one quiet day and not a rewritten block. **Zero REM is a
  reliable co-marker for him:** every zero-REM cluster in the record sits on an RHR spike — 8-9 Aug (55,
  57), 22 Aug (59), 3 Sep (67), 2-3 Oct (54, 62), now 15-16 Oct (68, 51). Two nights in, it has not cleared.
- **and it retrospectively explains the RHR puzzle the last four entries could not close.** 13 and 15 Oct
  read the elevated RHR as a chronic training-load floor shift that had "plateaued, not progressing",
  oscillating in a 42.7-46.7 band. The two 47s on **10 Oct and 14 Oct** now look like the prodrome of this
  infection rather than a load signal, and the 15 Oct spike is where it declared. **That matters because it
  points the Monday decision at a different lever:** cutting week 7's volume for chronic overload would be
  treating an infection with periodisation.
- **the 19 Oct RHR trigger is therefore restated, because as written it will now misfire.** It reads: *"if
  the 7-day RHR mean is still at or above 44 on Mon 19 Oct, the Wednesday Z2 run comes down 45 to 30min."*
  The mean is **49.57** and will clear 44 easily on Monday — but only because 68 and 51 are inside the
  window, and cutting a week for an illness that has already resolved is the wrong action.
  **Restated: on Mon 19 Oct compute the 7-day RHR mean EXCLUDING 15 and 16 Oct. If that figure is still at
  or above 44, cut the Wednesday Z2 run 45 to 30min as written; if it is under 44, the elevation was the
  infection and week 7 stands.** For reference the five clean days 10-14 Oct mean **45.6**, so this is a
  live test and not a way of dodging it.
- **the KEY RUN trigger fired this morning and I am not firing it, and the reason is evidence rather than
  caution.** Yesterday set it: *"if 15 Oct is blank or reads easy, the quality run comes off a standalone
  slot entirely and gets bolted to Monday's gym trip. Decide it Fri 16 Oct."* 15 Oct is blank, so the
  premise holds literally — but the trigger exists to detect a **day-of-week assignment failure**, and the
  blank was an infection with a record-high respiration rate. Acting on it would file an illness as an
  adherence problem, which is the same error the 15 Oct entry caught on 14 Oct.
  **The evidence against the trigger's conclusion, which the trigger did not have:**
  - **Thu 1 Oct he ran `8x1km tempo 4:01` — 10.87km, 52min, HR 151/176.** That is the KEY RUN format, on a
    Thursday, at **5s per km faster than the 4:06 ask**, and nobody had to move it anywhere.
  - The two misses each carry their own confound: **6 Oct** followed **2h20 of tennis that morning** (he
    ran an easy Z2 10km instead, which was the right call), and **15 Oct** was this illness.
  - So the Thursday slot is **1-for-1 on the one occasion he was healthy and not pre-fatigued**, not 0-for-2.
  - Much of the headline `run 11/5` shortfall is **already-fixed history**: three of those 11 were the
    standalone easy Z2 runs on 29 Sep, 3 Oct and 8 Oct that the 12 Oct restructure **already deleted** for
    exactly this reason. Counting them again as live evidence would double-charge a fix already made.
  - And the proposed destination is wrong on its own terms: Monday already carries compromised ski into run
    plus sled pull plus lunges at **143 TRIMP**, the biggest day of the week. Bolting a threshold set onto
    it puts quality running on dead legs and makes one day a single point of failure for the whole week.
  **What would make me act, and when: Thu 22 Oct. If 22 Oct is blank or reads easy with no illness marker
  and no 2h-plus court session that morning, that is the clean third data point and the KEY RUN moves —
  to Tuesday or Wednesday late morning, NOT onto Monday's gym trip. Decide it Fri 23 Oct**, which is also
  when week 9 gets written, so the two decisions land together.
- **what I deliberately did not do.** (1) **Did not move the TAPER_PLAN bands.** Base I has still never
  closed inside 400-560 and week 6 will close far under, but a week emptied by infection is the single
  worst evidence for lowering a floor — the note's own rule is that the band moves on closed measured weeks
  and the costed total, never on a projection, and an illness week is not a measurement of what he absorbs.
  (2) **Did not backfill week 6's hole.** It is now ~278 TRIMP short of the floor and there is no honest way
  to recover that in two days post-infection; the week is written off and that is the correct outcome.
  (3) **Did not touch Monday 19 Oct or anything in weeks 7-9** — the physiology says one day, so I changed
  one day. (4) **Did not touch the ski.** 21 Oct is still the first real test of 6x500m @ 1:59 with the
  lifting attached, exactly as yesterday left it.
- **one mechanic worth recording, because it is deliberate and it is fragile.** Saturday is written as
  **`Long run 1h10 Z2`**, not `70min`, and that is load-bearing. `planDurationMin` parses `1h10` to **70**
  via its `(\d+)\s*h\s*(\d{1,2})` branch, so the session still costs a correct **94 TRIMP** and adherence.py
  still counts it as a prescribed run — but `scaleDuration` only rewrites a `(\d+)\s*min` token, so with
  `scale` still at 1.25 **there is nothing for it to inflate**, and the line survives untouched
  (`_adj: null`). Written as `70min` it would have read **90min** on his phone. **Consequence for the next
  cold run: do not "tidy" that `1h10` into `70min`, and do not put a bare digit followed by `min` anywhere
  in a line you need protected — note that even "122 minutes" matches, and would be mangled to
  "155minutes".** The durable fix is RHR and respiration as `readiness()` inputs, which is outside this
  Routine's edit surface.
- **two traps avoided while writing today's lines**, both of which would have corrupted the instrument this
  Routine depends on:
  1. **adherence.py scores a `type:"rest"` line as a prescription.** `planned_days()` takes every
     `text:"..."` that is not `note:true` and does not match INFO — **it never checks the session type**. My
     first draft of today's line read *"walk, easy spin"* and *"the long run moves to tomorrow"*, which
     matches `\bspin\b` (cycle) and `long run` (run), and would have minted **two phantom prescribed
     sessions on a rest day**, inflating tomorrow's counts. The line now names no session-type keyword at
     all — which is why the existing Sunday lines read "Full rest · family day" and nothing more.
  2. **`isOptionalLine` matches a bare `\bOR\b` case-insensitively**, so the ordinary English word "or"
     halves a session's TRIMP. Both new lines are written without it.
- verification: `npm run build` clean, **448.35 kB** against yesterday's 447.74 (+0.61 kB, the bot's two
  wellness rows plus net plan text). **11/11** patch anchors. SCHEDULE **57 days / 8 weeks**, dates sorted
  and unique, **every `dow` label verified against its own date**, all day lines at 4-space indent;
  TAPER_PLAN **18 blocks**; 134 daily and 133 sleep rows all at 4-space indent, sorted and unique.
  Re-costed through `estTrimp` after the edit: **week 6 still 407**, week 7 **689**, week 8 **494** —
  every week identical to before. Engine re-read after the edit: **`adjustments: []`** — the "Volume raised
  25%" instruction is gone, today prices at 0 and Saturday at 94 with `_adj: null`. Round-trip
  `update.patch()` against a copy of the real src/App.jsx (`head -1046 update.py`, imported with `-I`):
  **44/44** — TODAY advanced to `date_str`+1, daily/sleep/weight/CSV all patched, wellness rows keeping
  their 4-space indent, both arrays sorted, unique and grown by exactly one with no pre-existing date lost,
  `vo2max` untouched by the weight upsert (gotcha 4), `hrvBaseline` rewritten to the weekly value, and
  SCHEDULE, TAPER_PLAN, RACE, ATHENS, STATION_TARGETS, RACE_BUDGET, RACE_GAINS and HYROX_DATA byte-identical
  through the patch with all three of today's edits surviving.
- **on the no-change count, with a correction.** The three entries before this one are **15 Oct CHANGED,
  14 Oct NO CHANGE, 13 Oct CHANGED**, so there is no passivity streak and the file's three-NO-CHANGE
  warning does not apply. Yesterday's entry claimed *"24 consecutive CHANGED entries precede this one —
  every dated entry from 25 Sep through 14 Oct"*, which is **wrong**: 14 Oct was a NO CHANGE. Noting it
  because that count is used as a governance signal and an inflated one makes churn look safer than it is.
  Churn remains the live risk, which is why this morning moved **one day inside the live week and added one
  sentence to a phase note**, and declined four edits it had standing invitations to make.
- **engine defects, outside this Routine's edit surface, carried:**
  1. **`readiness()` (src/App.jsx:1326) takes only TSB and HRV.** No RHR, no respiration, no REM — the whole
     subject of this entry. **First entry recording it.**
  2. **`isTennis` (now src/App.jsx:1157-ish, grep it) is `=== "tennis"` against rows typed `Tennis V2`**, so
     `loadModel.tennis` has n=0 and planned court sessions price from a 138bpm/75min fallback at ~101 TRIMP
     against a measured median of 76. **Eleventh entry. One word: `/^tennis/`.**
  3. **`HARD_TRIMP = 55` counts ordinary days as hard.** Quiet today (`consecutiveHard` 0), but unchanged.
     **Fifth entry.**
  4. **`update.py:661`, new and minor:** `ss_str = str(wellness.get("sleep_score", "null"))` writes
     `sleep_score:None` — invalid JS — if a caller passes the key with an explicit `None`. Not reachable
     from the real fetch path, which leaves the key **absent** when there is no score (`update.py:179`), so
     every real row correctly reads `null`. Found by passing `None` in a round-trip harness. Recorded, not
     fixed; a one-line `if ... is None` guard would close it.
- **notes for the next cold run, carried and verified against today's file.** `patch()` advances TODAY to
  **`date_str` + 1 day**; it reads sleep stages from a **nested `wellness["sleep"]` dict**; `weight` is a
  **`(date, kg)` tuple**; the function is `planIntensity`, not `planHR`; **`analyze()` takes
  `parseCSV(CSV_DATA)`, not the raw string** (pass the string and it silently returns ATL/CTL/TSB of 0).
  The node harness cut is now **`sed -n '2,1939p' src/App.jsx`** — 1939 is the closing brace of
  `adaptPlan`; **1945 lands inside a comment block and throws `SyntaxError`**. Grep `^const hrvBaseline`
  for its line and append it; the numbers in an old entry are already stale.
- watching:
  - **the illness, which is the only thing that matters this weekend.** **What would make me act: if
    tomorrow's row still shows RHR at or above 50, OR respiration back above 15, OR a third consecutive
    zero-REM night, Saturday's long run comes off too and the weekend is written off entirely — decide it
    Sat 17 Oct.** If RHR is 48 or below and REM returns, the plan stands as written and Monday is normal.
    The line itself already gates on RHR, so he has the instruction either way.
  - **running delivery, now the sharpest number in the block.** **Week 6 has given running ZERO minutes**
    (court 159). Prior weeks: wk4 **100min / 18.5km**, wk5 **109min / 20.6km**, 5-11 Oct **122min / 22.8km**
    — against ~185min written. His weakest block against the field is running at **top 27.7%**, and this
    week will deliver at most one session of it. **The 17 Oct trigger yesterday set — "if 12-18 Oct closes
    under 90 running minutes, week 8's Wednesday Z2 run grows" — is suspended for cause: this week closes
    under 90 because of an infection, and growing a future week to compensate for an illness is the same
    error as cutting one. Restated: judge it on 19-25 Oct instead, decide it Mon 26 Oct**, and if that week
    also closes under 90 running minutes with no illness in it, then week 9 grows the Wednesday run.
  - **the ski format, unchanged and still armed. 21 Oct remains the first real test of 6x500m @ 1:59**, now
    with lat pulldown and sled pull on the same trip. **What would make me act: if 21 Oct logs no erg, the
    Wednesday ski merges into Monday's gym trip and the week carries one erg instead of two. Decide it
    Thu 22 Oct.** If it logs an erg as a continuous ten-minute piece, 4x500m off 60s becomes the written
    ask. Standing number: 2380m in 10:18 on 8 Oct is **4:19/1000m, his exact Athens split**, off a 3:54
    fresh TT — the 24s the block exists to recover. Note this and the KEY RUN test now both land on
    **Thu 22 Oct**; read them separately, because an illness-free blank Thursday is evidence about the run
    and says nothing about the erg.
  - **the Monday keystone, still 1-for-2** (5 Oct in full, 12 Oct missed). **What would make me act: a
    second consecutive miss on 19 Oct makes it 1-for-3 and the compromised ski moves to Wednesday to merge
    with the 6x500m. Decide it Tue 20 Oct** — and weigh that 12 Oct's miss sits two days before an
    infection declared, so it may be prodrome rather than non-adherence.
  - **Saturday's line is now a real prescription, not a note**, so from tomorrow adherence.py counts it and
    a missed long run will show as a missed run rather than vanishing. That is the point of dropping
    `note:true`, and it is the first time the backstop has been measurable.
  - **the 560 ceiling and the bands, deliberately unmoved.** `unplanned7` is **201** (was 279). **Trigger
    stands but needs a clean week: if 19-25 Oct closes above 620 with running again under 150 minutes,
    court time has to be entered as a booked fixed cost rather than arriving as unplanned load. Decide it
    Mon 26 Oct.**
  - **same-day adherence**, the 14 Oct instrument. **What would make me act: under 60% across 12 Oct -
    1 Nov, measured Mon 2 Nov** — that says the day-of-week assignment is wrong, not the content. Exclude
    15 and 16 Oct from that measurement when the time comes; an infection is not a scheduling verdict.
  - **Base I week 9 (2-8 Nov), still unwritten.** Its rung is the 4:04-off-60s that the Base II note names
    as where Base I ends. **Write it Fri 23 Oct**, once 22 Oct has reported, and write its Wednesday under
    the standing rule: the erg is never the only content of a trip.

---

## 2026-10-15
- adherence: **no ACTION REQUIRED and no WATCH.** ski 6/3 · row 1/1 · hyrox 3/1 · strength 5/4 · cycle 1/5 ·
  tennis 3/9 · run 10/5. Benchmarks already due: 28 Sep and 2 Oct NOTHING LOGGED, 30 Sep logged, 6 Oct
  TRAINED EASY INSTEAD, 8 Oct TRAINED OTHER TYPE, **15 Oct NOTHING LOGGED — but that is today's KEY RUN,
  written for late morning and read at 07:00, so it is not yet a miss.** Next 14d: Thu 22 Oct and Thu
  29 Oct, both KEY RUNs on his best running weekday (9/10 attended, 5/10 with a run since 3 Aug), so
  nothing is pre-deferred.
- readiness: **HRV 84 vs baseline 80 (+4) — his first above-baseline morning since 11 Oct** · RHR **47** ·
  8h15 asleep (99 deep, **36 REM**, 360 light, 18 awake) · `hrvBaseline` 75 → 80. The 10-14 row DID arrive;
  LAST_DATA **2026-10-15T06:08Z**, 132 daily rows, 131 sleep rows, contiguous since 7 Aug. Today's own row
  is not in yet, so these are 10-14's values. Engine signals read out of `adaptPlan` itself: **readiness
  6/10 (was 5, was 4 on 13 Oct), tsb -21.1, ATL 56.5 against CTL 35.4 (1.60x), consecutiveHard 2,
  daysSinceRest 2, daysSinceHard 10, forceRest FALSE, easeHard FALSE, scale 1.000, adjustments [] —
  the governor is touching nothing.**
- decision: **CHANGED — the Wednesday ski gets a host.** 21 Oct and 28 Oct now carry lat pulldown 4×10 and
  sled pull 6×25m in the same trip as the erg, and the TAPER_PLAN Base I rule that produced yesterday's
  miss is replaced. Weeks 6 is byte-identical; nothing he has reached was touched. Three lines and one
  phase note, costed at **zero** added TRIMP (21 Oct stays 209, 28 Oct stays 108, week 7 stays 689,
  week 8 stays 494).

- **yesterday's trigger fired and the answer was not on its menu.** The 13 Oct entry set it as "a third
  continuous ten-minute piece on 14 Oct makes 4×500m off 60s the written ask", and the 14 Oct entry
  restated it as "decide it Thu 15 Oct, on what the title and splits say". **There is no title and there
  are no splits. 14 Oct logged one activity: Tennis V2, 13:17–14:31, 1h14, HR 123. No erg at all.** So the
  trigger's premise — that he keeps answering an interval ask with a continuous piece — is not what
  happened, and softening 6×500m to 4×500m would have been rewarding a session that never started with an
  easier target. **The rep format is unchanged and 1:59 is still completely untested.** What needs fixing
  is not the reps; it is the trip.
- **the finding, and it is the sharpest thing in this file about the erg: every erg that has landed in this
  block was part of a trip he had a second reason to make, and the two that didn't land were erg-only.**
  - **30 Sep** ✓ SkiErg TT 2290m warmup + 1000m in **3:57** · *then* Strength – lats and core (after a match)
  - **5 Oct** ✓ Multi Sport, compromised 3×[ski 1km → run 1km] 4:02/4:19/4:24 · *then* Strength – shoulders, pecs, biceps
  - **7 Oct** ✓ Row 10min 2400m · *then* Strength – DL 100×6×3, kb swings, one-leg steps (after a **2h25** match)
  - **8 Oct** ✓ Ski-ERG 10min 2380m · *then* Strength – upper · *then* 10km inline skating
  - **12 Oct** ✗ compromised ski + strength prescribed → **whole day blank** (confounded: he took the rest day `forceRest` was about to try to convert)
  - **14 Oct** ✗ **"SKI 20min · 6×500m" and nothing else prescribed → nothing done**
  **4-for-4 with lifting in the same trip, 0-for-1 without it.** And 14 Oct is the clean case, because he
  trained that day: he simply did not make a second trip for twenty minutes of erg. It is also the day with
  the **least** court load of the three post-match Wednesdays — 1h14 against 1h33 on 30 Sep and 2h25 on
  7 Oct — so this is not fatigue. A standalone erg trip is now **0-for-4** (23 Sep, 24 Sep, 28 Sep, 14 Oct).
- **the rule that produced it, and it was mine.** The 12 Oct restructure removed the 40min run in front of
  the Wednesday ski on the grounds that "the court already supplies the tired legs" — true about the legs,
  and it is exactly what the 30 Sep 3:57 off a 93min match proves. But removing the run also removed the
  only other thing on the trip, and turned the Wednesday ski back into the one format with a 0-for-3
  record. The TAPER_PLAN note said it out loud — *"the second ski stays on Wednesday, compromised by the
  booked match where there is one and by an easy run where there is not"* — so the rule was written down
  and it was wrong. It now reads: **the second ski always carries the week's upper pull in the same trip,
  because THE ERG IS NEVER THE ONLY CONTENT OF A TRIP.** That is the sentence week 9 gets written from on
  23 Oct, which is the point of putting it in the phase note rather than only in a day.
- **why the lifting is free, which is what made this edit possible at all.** `planDurationMin` takes the
  first duration in the line and `PLAN_INTENSITY` matches `/compromised/` before `/pulldown|sled/`, so both
  ski lines still price at **20min × 162bpm = 48 TRIMP**, unchanged. His measured lifting HR is **95** over
  a 49min median, so fifteen minutes of upper pull is worth about **6 TRIMP** in reality. Week 7 is already
  689 against a 560 ceiling and I was not willing to add load to it; I did not have to. Checked for the two
  traps that cost the last two mornings a draft: no bare `OR` (`isOptionalLine` would halve the session) and
  the word *compromised* is still present (dropping it moves the line from the 162 group to the 146 erg
  group and would have mispriced it at 32).
- **and a factual error on the dashboard, fixed in the same line.** 21 Oct's Z2 run read *"No match is
  booked today"* while the line directly above it is `{type:"tennis",cal:true,…​ Simonas Dong · court 1 ·
  20:30}` — `calendar_sync.py` wrote that fixture in after the run line was authored. A match **is** booked;
  it is at **20:30**, which is after the gym trip, so it cannot compromise an afternoon erg. The line now
  says that instead of contradicting the fixture sitting above it.

- **yesterday's RHR trigger is now unsafe and would have done real damage on Monday, so I am saying so here
  rather than letting it fire.** It reads: *"if the 7-day RHR mean is still at or above 44 on Mon 19 Oct,
  week 7 loses the Wednesday 45min Z2 run — the cheapest line in that week, and the one whose only job is
  to compromise the ski, which 14 Oct will have already shown a court can do instead."* **14 Oct showed the
  opposite.** With the court as the ski's only host, the ski did not happen. Deleting the 21 Oct Z2 run
  would leave the erg standalone on a day whose match is at 20:30 — reproducing 14 Oct exactly, on the
  block's priority-1 weakness. **Restated: the 19 Oct test still stands, but the Wednesday Z2 run is no
  longer the first thing to cut. Cut minutes off it (45 → 30) if load must come out of week 7; never cut
  the line, because it is the ski's host.** The mean today is **44.71**, so the test would otherwise fire.
- **physiology: the floor shift has plateaued, it is not progressing.** The 7-day RHR mean peaked at
  **46.71 on 8 Oct**, fell to **42.71 on 10 Oct**, and has drifted back up: 43.14 / 43.86 / 44.29 / **44.71**.
  Against a prior-30 mean of **41.63** that is the ~3bpm lift the 13 Oct entry identified, nine days old,
  oscillating inside a 42.7–46.7 band rather than climbing. **RHR 47 is worth naming: it is 1 above the top
  of his 38–46 range and the second 47 in five days (10 Oct, 14 Oct), with only the 2–3 Oct illness (54,
  62) above it anywhere in the record.** But it is an edge, not an excursion, and the other three markers
  disagree with alarm: **HRV last-7 80.3 against 79.3 for the fourteen before it — flat, and today is
  +4 over baseline**; REM last-7 76.3 against 81.6 — flat; and the load correction is still unwinding on
  schedule, **tsb -41.3 (8 Oct) → -29.4 → -21.4 → -21.1**, ATL/CTL **1.83 → 1.65 → 1.61 → 1.60**, readiness
  **4 → 5 → 6**. One elevated marker plateauing while three sit flat is not a reason to cut a week. Last
  night's **36 minutes of REM** is the third sub-45 REM night in ten (40 on 8 Oct, 35 on 10 Oct) on 8h15
  total — worth one more morning's look, not an action.
- **band realism, which this run is in a position to answer properly for the first time: Base I has run
  four weeks and has never once closed inside its own 400–560 band.** Measured calendar weeks:
  **wk4 327** (18% under) · **wk5 693** (24% over) · **wk6 projecting 346** (14% under) · wk7/wk8 unwritten
  history. Their mean is **455 — within 5% of the band's 480 midpoint.** So the band's centre is right and
  its *width* is not the problem either; the problem is that court time arrives unplanned and swings
  **196 → 468 → 159 minutes** week to week, and no band can absorb variance that size. **I did not move the
  bands.** Raising the ceiling to fit a 693 outlier would license more load in the exact week that produced
  the RHR floor shift, and lowering the floor would bless a week that is short only because two sessions
  were missed. The note's own rule — ceiling moves on closed measured weeks and on the costed total, never
  on a projection — is doing its job.
- **week 6 is under its floor, and it is entirely the two misses.** Governor: doneTrimp **129**, remaining
  planned **217**, projected **346** against 400–560, `under:true`, and the engine is **not** raising it
  because the volume-raise path wants readiness ≥7 and today reads 6. The written week was **407**; the
  blank Monday took **143** and the missing Wednesday ski took **48**, which is the whole 61-point shortfall
  plus change. **I did not backfill it.** The four days left are today's KEY RUN, Friday's long run, a
  note-only Saturday backstop and Sunday rest; there is no host for a replacement erg that is not a
  standalone trip, which is the thing this entry is about. Rewriting a week he is three days into needs a
  physiological reason and the physiology above is improving, not deteriorating.
- **running volume, and this is the number to watch tomorrow: week 6 has given running ZERO minutes through
  Wednesday.** 12 Oct blank, 13 Oct tennis 1h24, 14 Oct tennis 1h14 — court **159min**, running **0**. The
  written plan puts all of it in today (KEY RUN, 122 TRIMP) and tomorrow (long run 70min, 94), so if either
  slips the week delivers under an hour of running in a phase built on aerobic running base, for a race
  whose weakest block against the field is running at **top 27.7%**. Prior weeks: wk4 **109min / 20.6km**,
  wk5 **122min / 22.8km**, against **~185min written**. It is a delivery gap, not a plan gap, and today and
  tomorrow are the entire answer to it.
- **engine defects, outside this Routine's edit surface, both unchanged:**
  1. **`isTennis` (src/App.jsx:1157) is `=== "tennis"` against rows typed `Tennis V2`**, so
     `loadModel.tennis` has **n=0** and every planned court session is priced from the 138bpm/75min fallback
     at **101 TRIMP** against a measured median of **76**. **Tenth entry recording this. One word:
     `/^tennis/`.** Its effect today: roughly **50 of week 7's 129-TRIMP overshoot** is phantom load on the
     two booked matches — corrected, week 7 is 639, not 689.
  2. **`HARD_TRIMP = 55` in `adaptPlan` counts ordinary days as hard.** `consecutiveHard` reads **2** off
     two tennis matches at HR 115 and 123 while `daysSinceHard`, which uses the HR test, correctly reads
     **10** — the last session above HR 155 was 5 Oct. Two instruments, same question, eight days apart.
     Fourth entry.
- verification: `npm run build` clean, **447.74 kB** against yesterday's **446.74** — **+1.00 kB**, the bot's
  10-14 wellness rows plus my plan text. (`vite` is not installed in a cold container; `npm install` first,
  then `git checkout -- package-lock.json`, which npm rewrites.) **11/11** patch anchors. SCHEDULE **57 days
  / 8 weeks**, dates sorted and unique, every day line at 4-space indent and **every `dow` label verified
  against its own date**; TAPER_PLAN **18 blocks**. 132 daily and 131 sleep rows, all at 4-space indent.
  Re-costed through `estTrimp` after the edit: every week identical to before it. Round-trip `update.patch()`
  against a copy of the real src/App.jsx (module body above `# -- Main --`, `head -1046`, imported with
  `-I`): **49/49** — TODAY advanced to `date_str` + 1 day, daily/sleep/weight/CSV all patched, wellness rows
  keeping their 4-space indent, both arrays sorted, unique, grown by exactly one with no pre-existing date
  lost, `vo2max` untouched by the weight upsert (gotcha 4), `hrvBaseline` correctly rewritten to the weekly
  value, and SCHEDULE, TAPER_PLAN, RACE, PREV_RACE, STATION_TARGETS, RACE_BUDGET, RACE_GAINS and HYROX_DATA
  byte-identical through the patch with week 8 and all three of today's edits surviving.
- **notes for the next cold run, four carried and two new.** Carried: `patch()` advances TODAY to
  **`date_str` + 1 day**; it reads sleep stages from a **nested `wellness["sleep"]` dict**; `weight` is a
  **`(date, kg)` tuple**; the function is `planIntensity`, not `planHR`. New, because both cost me a harness
  run this morning: the node harness cut is now **`sed -n '2,1935p' src/App.jsx`** plus **line 2334** for
  `hrvBaseline` (both moved by the bot's rows — grep, do not trust the numbers in an old entry), and
  **`analyze()` takes `parseCSV(CSV_DATA)`, not the raw string** — pass the string and it returns
  ATL/CTL/TSB of 0 with a plausible-looking `scale: 1.25`, which is a silently wrong readout.
- **on the no-change count: 24 consecutive CHANGED entries precede this one** — every dated entry from
  25 Sep (b) through 14 Oct. The file's standing warning about three NO CHANGEs in a row does not apply;
  churn remains the live risk. So this morning changed three lines and one phase note, all on days he has
  not reached, all load-neutral, and declined the three edits it was most tempted by: backfilling week 6's
  61-TRIMP hole, cutting week 7 for the RHR signal, and softening the 1:59 ask.
- watching:
  - **the wellness feed — trigger resolved, closed.** Yesterday's test was "10-14 still absent tomorrow
    morning means the feed, not the watch". **The 10-14 row arrived** (HRV 84, RHR 47), so it was a late
    watch sync and the Worker needs no check. What stands is the **disclosure**, not a trigger: `LAST_DATA`
    advances when Garmin answers for *yesterday*, a day already on file, so it cannot distinguish fresh
    data from an answer about a day we already have, and the header dot would stay green through a dead
    wellness feed. `update.py` is outside this Routine's edit surface. Recorded, not fixed.
  - **the Thursday KEY RUN — today, and the decision is tomorrow's.** 6 Oct was the benchmark and he ran an
    easy Z2 10km instead, after 140min of tennis that morning; today carries nothing else. **What would
    make me act: if 15 Oct is blank or reads easy, the quality run comes off a standalone slot entirely and
    gets bolted to Monday's gym trip, the only session in this block that has ever been 1-for-1. Decide it
    Fri 16 Oct**, not after 22 Oct has also failed.
  - **the ski format, re-armed because 14 Oct produced no data at all. 21 Oct is now the first real test of
    6×500m @ 1:59**, and it is the first Wednesday with the lifting attached, so it tests the host and the
    format at once. **What would make me act: if 21 Oct logs no erg, the Wednesday ski merges into Monday's
    gym trip and the week carries one erg instead of two — one trip he reliably makes beats two he does
    not. Decide it Thu 22 Oct.** If it logs an erg but as a continuous ten-minute piece, 4×500m off 60s
    becomes the written ask, as the 13 Oct trigger intended. Standing number: 2380m in 10:18 on 8 Oct is
    **4:19/1000m, his exact Athens split**, off a 3:54 fresh TT — the 24s the whole block exists to recover.
  - **RHR, restated with the Z2-run correction above.** **What would make me act: if the 7-day mean is still
    at or above 44 on Mon 19 Oct, week 7 loses minutes — the Wednesday Z2 run comes down 45 → 30min, NOT
    out. Decide it Mon 19 Oct.** The Thursday KEY RUN and the Friday long run are the last two things to go,
    never the first. Today's mean is 44.71; a single reading above 48, or a third 47-plus inside a week,
    brings that decision forward.
  - **the Monday keystone, still 1-for-2** (5 Oct in full, 12 Oct missed). **What would make me act: a
    second consecutive miss on 19 Oct makes it 1-for-3, and then the compromised ski moves to Wednesday and
    merges with the 6×500m — one gym trip instead of two. Decide it Tue 20 Oct.** Note this and the ski
    trigger above now point at the same merge from opposite directions; if both fire, do it once.
  - **running delivery, the sharpest live number.** Week 6 has **0 running minutes through Wednesday**, with
    122 and 94 TRIMP of it written for today and tomorrow. **What would make me act: if 12–18 Oct closes
    under 90 running minutes, week 8's Wednesday Z2 run grows and the Monday treadmill kilometres stop
    being a ceiling, because two sessions carrying a whole phase's running is a single point of failure.
    Decide it Sat 17 Oct**, once today and tomorrow have reported.
  - **the 560 ceiling and the bands, both deliberately unmoved.** `unplanned7` is **279** (was 278).
    **Trigger stands: if 12–18 Oct closes above 620 with running again under 150 minutes, court time has to
    be entered as a booked fixed cost rather than arriving as unplanned load. Decide it Mon 19 Oct** — and
    note that week 6 is currently heading the other way, 346 against a 400 floor.
  - **same-day adherence, the instrument the 14 Oct run built.** **What would make me act: under 60% across
    12 Oct – 1 Nov, measured on Mon 2 Nov** — that says the day-of-week assignment is wrong, not the session
    content. Three days in, the restructured plan is 0-for-2 on prescribed sessions (12 Oct blank, 14 Oct
    ski missed), which is why this morning acted on the host rather than waiting for 2 Nov.
  - **Base I week 9 (2–8 Nov), still unwritten and still deliberately.** Its rung is the 4:04-off-60s that
    TAPER_PLAN's Base II note already names as where Base I ends. **Write it Fri 23 Oct once 15 and 22 Oct
    have both reported — sooner if either Thursday is missed**, and write its Wednesday under the new rule:
    the erg never alone on a trip.

---

## 2026-10-14
- adherence: **no ACTION REQUIRED and no WATCH.** ski 7/3 · row 1/1 · hyrox 4/1 · strength 5/4 · cycle 1/5 ·
  tennis 4/8 · run 9/5. Benchmarks already due: 28 Sep and 2 Oct NOTHING LOGGED, 30 Sep logged, 6 Oct
  TRAINED EASY INSTEAD, 8 Oct TRAINED OTHER TYPE. Next 14d: **Thu 15 Oct and Thu 22 Oct**, both KEY RUNs.
  I checked Thursday myself rather than trust the plan text: since 3 Aug it is **9 of 10 days with an
  activity and 5 of 10 with a run — his best running weekday — and 1 of 10 with tennis, his least likely
  court day.** No benchmark sits on a day he does not train, so nothing is pre-deferred and neither hard
  mandate binds this morning.
- readiness: **there is no reading for this morning.** The 2026-10-14 rows are absent from both `daily` and
  `sleep` after two full-mode runs (05:08Z and 06:08Z) and a third at 06:35Z, so the engine served
  **10-13's values a second day: HRV 70 vs baseline 75 (-5), RHR 46, 8h58 asleep, 126 REM.** LAST_DATA
  reads **2026-10-14T06:08Z**, minutes old. 131 daily rows, 130 sleep rows, contiguous since 7 Aug.
  Engine signals read out of `adaptPlan` itself: **readiness 5/10 (was 4), tsb -21.4 (was -22.4), ATL 56.3
  against CTL 34.7 (1.61x, was 1.65x), consecutiveHard 1, daysSinceRest 1, forceRest FALSE, easeHard FALSE,
  scale 1.000, adjustments [] — not one session touched, governor projecting 426 against 400-560.**
- decision: **NO CHANGE.** SCHEDULE, TAPER_PLAN, RACE, STATION_TARGETS, RACE_BUDGET and RACE_GAINS are
  byte-identical to yesterday. This entry is the only change in the commit.
- why: **this run has no new physiological information** — the newest wellness row is the one yesterday
  already decided on — and the two things that did arrive since (a blank Monday, an unplanned 61-TRIMP
  Tuesday match) are what the week was rewritten on Monday to expect. Changing anything today would mean
  acting a second time on the 10-13 reading, or rewriting on preference a week he is three days into.

- **the sync, and the distinction that matters: the feed is late, not broken.** `update.py` full mode always
  fetches `[yesterday, today]`, and `missing_wellness_dates()` keeps retrying for `REFRESH_DAYS = 4`, so
  07:08Z, 08:08Z and 09:08Z will each try 10-14 again. Most likely he has not worn or synced the watch yet;
  nothing needs doing. **But one thing is worth recording for whoever next debugs this file.**
  `got_fresh_data` is set when Garmin answers for **yesterday** — a day already on file and unchanged — so
  **LAST_DATA cannot distinguish "fresh data arrived" from "Garmin answered about a day we already have".**
  Today is the proof: LAST_DATA advanced three times this morning and the wellness feed produced nothing.
  The header's status dot would therefore stay green through a completely dead wellness feed, which is the
  one failure it exists to catch. `update.py` is outside this Routine's edit surface, so this is recorded,
  not fixed. **Trigger: if 10-14 is still absent tomorrow morning, it is a feed failure rather than a late
  watch sync, and tomorrow's run should check the Worker before anything else.**

- **the number no previous run has computed, and it is the sharpest adherence figure in this file:
  same-day adherence is 8 of 31 prescribed sessions — 26%.** Per type, counting only whether the type was
  trained **on the day it was written**: **ski 2/7** (30 Sep, 5 Oct) · **run 2/9** (6 Oct, 10 Oct) ·
  **hyrox 0/4** · **strength 2/5** · **tennis 2/4** · row 0/1 · cycle 0/1.
- **this also exposes a blind spot in adherence.py itself, and it is why hyrox prints "4/1" instead of
  WATCH.** Its `a_dates` test asks whether a type was trained **anywhere** in the window, never on the day
  it was prescribed. The circle ran once, on **25 Sep — a day it was not prescribed** — and went **0-for-4**
  on 23 Sep, 30 Sep, 7 Oct and 8 Oct, the days it was. One hit anywhere in 22 days is enough to clear both
  the 3+ hard stop and the 2x watch, so the headline reads "Every prescribed session type has been trained
  at least once" over a 26% same-day rate. **Recommended, and deliberately not done unattended: print
  same-day hits beside anywhere-in-window, and fire WATCH on 0-for-N on the day.** This is the one tool
  built to catch this Routine's failure mode and it currently cannot see the sharpest form of it; changing
  the measuring instrument with nobody reviewing is worse than recording it.
- **and why 26% is NOT grounds for a change this morning, which is the whole judgement.** The window is
  23 Sep - 14 Oct, so **20 of its 22 days predate the 12 Oct restructure.** 26% is a verdict on the plan as
  it *was*, and that plan has already been replaced: the standalone easy Z2 run removed (0-for-3), the
  roxzone circuit removed for good, the circle demoted to `note:true`, every session re-homed onto Mon gym
  / Wed court+ski / Thu run / Fri long run with Saturday as the long run's backstop. The restructured plan
  has produced **three days of evidence** — one miss, one unprescribed match, and today still ahead of him.
  Acting on a figure that indicts a structure which no longer exists would be changing the new plan on the
  old plan's data. **Trigger: compute same-day adherence over 12 Oct - 1 Nov on Mon 2 Nov. Under 60% and the
  day-of-week assignment is wrong rather than the content, and the fix is re-homing, not more rewriting.**

- **the second new number: one session above HR 155 in twenty-five days.** `HARD_HR` is 155 and
  **`daysSinceHard` reads 9** — the last was 5 Oct, HR 159, the compromised ski. Next hardest in the window
  is **1 Oct, 8x1km at 4:01, HR 151, 96 TRIMP — unprompted, on a day the plan asked for nothing.**
  Everything else sits at HR 102-138: tennis 102-120, Z2 runs 131-138, ergs 137-138, strength 85-105. For
  **Base I · Aerobic that is broadly correct by design**, and CTL agrees it is working — **24.7 on 1 Oct to
  34.7 today, +10 points in a fortnight**, with ATL unwinding 73.9 to 56.3. What it does mean is that
  Thursday now carries the whole of the block's running quality, which is the argument for protecting it
  rather than for adding intensity somewhere else.
- **and it explains 6 Oct, which reads as a refusal and is not.** He *did* go out that evening — he ran it
  easy, 10km in 52min at HR 138, **after 140 minutes of tennis training the same morning.** 1 Oct had
  nothing else on it at all and produced 8x1km at 4:01. **The pattern is scheduling, not willingness: he
  runs quality on days carrying nothing else and easy on days that already carried a court session.**
  Thursday is his least likely court day (1 in 10 weeks) and his best running day (5 in 10), so 15 and
  22 Oct are already on the only weekday that satisfies this. Confirmation of the written plan, not a
  reason to move it.

- **band realism — stated, and deliberately not acted on, which is a different thing from not noticing.**
  Week 6 projects **426 against 400-560, scale 1.000, zero adjustments**, where the same week costed **736
  and was being cut 24%** two mornings ago; the restructure worked. **But 426 includes a zero Monday.**
  Week 6 fully delivered would have been **569 — over the 560 ceiling** — and **week 7 as written costs 589
  before any unplanned court time at all** (week 8 is 494). So the written plan plus his actual court habit
  does not fit inside the band. **I did not move the ceiling.** Yesterday's own rule, now in the Base I
  note, allows a move only on closed measured weeks or on the plan's costed total, and the honest reading of
  the costed total is that a governor trimming ~5% in a week like 7 is the governor doing its job — minutes
  off a warmup, which is only possible because every line now carries a written length. Raising it twelve
  hours after declining to raise it is exactly the ratchet that note exists to prevent. **Of week 7's
  29-TRIMP overshoot, roughly 25 is the `isTennis` defect**, pricing the one booked match at 101 against a
  measured median of **76** across his last seven matches (61/73/78/80/80/76/50).
- **running volume, for the record and not as a finding.** Last four closed weeks gave running **225, 145,
  109, 122 minutes** (20.5, 20.6, 22.8 km in the last three) against tennis at **176, 262, 213, 468** —
  court time is **2.5x his running time** in a phase built on aerobic running base, for a race whose weakest
  block against the field is running at top 27.7%. **The written plan does not have this hole:** weeks 7 and
  8 carry ~185 running minutes each. It is a delivery gap, and Thursday and Friday are the sessions that
  close it. First honest read is **Sat 17 Oct**, once 15 and 16 Oct have reported.
- **physiology: nothing new, and that is itself the finding.** With no 10-14 row the RHR last-7 mean is
  still **44.29 against a prior-30 of 41.5**, and HRV last-7 still **76.3 against 82.8** for the fourteen
  before it. Yesterday's floor-shift reading stands eight days old, neither extended nor broken. The
  correction it predicted is running on schedule: **tsb -41.3 (8 Oct) to -29.4 (13 Oct) to -21.6**, ATL/CTL
  **1.83 to 1.65 to 1.61**, readiness **4/10 to 5/10**, `forceRest` and `easeHard` both false. Restating the
  trigger on the same measurement would be acting twice on one reading, so it carries forward verbatim.
- **engine defects, outside this Routine's edit surface, both unchanged:**
  1. **`isTennis` (src/App.jsx:1153) is `=== "tennis"` against rows typed `Tennis V2`**, so `loadModel.tennis`
     has **n=0** and every planned court session is priced from the 138bpm/75min fallback at **101 TRIMP**
     against a measured median of **76**. **Ninth entry recording this. One word: `/^tennis/`.**
  2. **`HARD_TRIMP = 55` in `adaptPlan` counts ordinary days as hard.** Today is the clean demonstration:
     `consecutiveHard` reads **1** off a 61-TRIMP tennis match at HR 115 while `daysSinceHard`, which uses
     the HR test, correctly reads **9**. Two instruments, same question, 8 days apart. Third entry.
- verification: `npm run build` clean, **446.74 kB** against yesterday's **446.45** — **+0.29 kB, all of it
  the bot's own 10-13 wellness rows**, since no App.jsx line of mine changed. (`vite` was not installed in
  this container; `npm install` first, which is why a cold run should budget for it.) **11/11** patch
  anchors. SCHEDULE **57 days / 8 weeks**, dates sorted and unique, every day line at 4-space indent and
  **every `dow` label verified against its own date**; TAPER_PLAN **18 blocks**. 131 daily and 130 sleep
  rows, all at 4-space indent. Round-trip `update.patch()` against a copy of the real src/App.jsx (module
  body above `# -- Main --`, `head -1046`, imported with `-I`): **40/40** — TODAY advanced to `date_str`
  + 1 day, daily/sleep/weight/CSV all patched, wellness rows keeping their 4-space indent, both arrays
  sorted, unique, grown by exactly one and with no pre-existing date lost, `vo2max` untouched by the weight
  upsert (gotcha 4), and SCHEDULE, TAPER_PLAN, RACE, PREV_RACE, STATION_TARGETS, RACE_BUDGET, RACE_GAINS,
  HYROX_DATA and hrvBaseline all byte-identical through the patch with week 8 surviving. `git diff --stat`
  on src/App.jsx: **empty**, which is the real proof.
- **three notes for the next cold run, carried from yesterday because they cost two harness runs then and
  would again:** `patch()` advances TODAY to **`date_str` + 1 day**, not to `date_str`; it reads sleep
  stages from a **nested `wellness["sleep"]` dict**, not from flat `deep`/`rem`/`light` keys; and `weight`
  is a **`(date, kg)` tuple**, not a float. A fourth: the node harness for reading `adaptPlan` directly is
  `sed -n '2,1931p' src/App.jsx` plus **line 2330 for `hrvBaseline`**, which sits below the cut, then an
  `export {...}` block — `planHR` does not exist, the function is `planIntensity`.
- **on the no-change count: 23 consecutive CHANGED entries precede this one** — every dated entry from
  25 Sep (b) through 13 Oct. The last NO CHANGE is the hand-written 25 Sep baseline, which was not a
  Routine run. So the file's standing warning about three NO CHANGEs in a row does not apply, and yesterday
  named the live failure mode correctly as **churn, not passivity**. The honest test of this morning is not
  "did I find something" — I found three numbers no previous run computed — it is **"does any of it bear on
  a day he has not reached, on evidence he has not already been judged on"**, and none of it does.
- watching:
  - **the wellness feed.** **What would make me act: 10-14 still absent tomorrow morning** — then it is the
    feed and not the watch, and the Worker gets checked before the plan does. **Decide it 15 Oct.**
  - **RHR, as the level test yesterday restated it.** **What would make me act: if the 7-day RHR mean is
    still at or above 44 on Mon 19 Oct, week 7 loses the Wednesday 45min Z2 run** — the cheapest line in
    that week, and the one whose only job is to compromise the ski, which today will have shown a court can
    do instead. The Thursday KEY RUN and the Friday long run are the last two things to go, never the first.
    **Decide it Mon 19 Oct.** Carried forward verbatim; today's mean is the same 44.29 measurement.
  - **the Thursday KEY RUN, 15 Oct.** Unchanged and still the real test — 6 Oct was the benchmark and he ran
    an easy Z2 10km instead, after 140min of tennis that morning. **What would make me act: if 15 Oct is
    blank or reads easy, the quality run comes off a standalone slot entirely and gets bolted to Monday's
    gym trip, the only session in this block that has ever been 1-for-1. Decide it Fri 16 Oct**, not after
    22 Oct has also failed.
  - **the ski format, and today IS its test date — it simply cannot be read at 09:35 in the morning.**
    Yesterday's trigger was "a third continuous ten-minute piece on 14 Oct makes 4x500m off 60s the written
    ask". Tonight's session is still ahead of him and the line already says "4x500m off 60s counts in full",
    so nothing is lost by waiting. **Decide it Thu 15 Oct, on what the title and splits say.** Standing
    numbers: 2380m in 10:18 on 8 Oct is 4:19/1000m, his exact Athens split, off a 3:54 fresh TT.
  - **the Monday keystone, still 1-for-2** (5 Oct in full, 12 Oct missed). **What would make me act: a
    second consecutive miss on 19 Oct makes it 1-for-3, and then the compromised ski moves to Wednesday and
    merges with the 6x500m — one gym trip instead of two. Decide it Tue 20 Oct.**
  - **the 560 ceiling.** Week 6 projects 426 and `unplanned7` is **278** (was 316). **Trigger stands: if
    12-18 Oct closes above 620 with running again under 150 minutes, court time has to be entered as a
    booked fixed cost rather than arriving as unplanned load. Decide it Mon 19 Oct.**
  - **same-day adherence, the new instrument.** **What would make me act: under 60% across 12 Oct - 1 Nov,
    measured on Mon 2 Nov** — that says the day-of-week assignment is wrong, not the session content.
  - **Base I week 9 (2-8 Nov), still unwritten and still deliberately.** Its rung is the 4:04-off-60s that
    TAPER_PLAN's Base II note already names as where Base I ends. **Write it Fri 23 Oct once 15 and 22 Oct
    have both reported — sooner if either Thursday is missed**, because then the ladder needs re-anchoring
    rather than extending.

---

## 2026-10-13
- adherence: **no ACTION REQUIRED and no WATCH.** ski 6/3 · row 1/1 · hyrox 4/1 · strength 5/4 · swim 1x/0 ·
  cycle 2/5 · tennis 5/8 · run 9/6. Benchmarks already due: 28 Sep and 2 Oct NOTHING LOGGED, 30 Sep logged,
  6 Oct TRAINED EASY INSTEAD, 8 Oct TRAINED OTHER TYPE. Next 14d: **Thu 15 Oct and Thu 22 Oct**, both KEY RUNs,
  both on Thursday, which is 9/10 attended since 3 Aug — no benchmark sits on a day he does not train, so
  nothing is pre-deferred and neither hard mandate binds this morning.
- readiness: HRV **70 vs baseline 75** (delta **-5**), RHR **46**, respiration 12.0, SpO2 98, **8h58 asleep**
  — 116 deep, **126 REM**, 296 light, 12 awake. `hrvBaseline` **72 -> 75**, recovering yesterday's 2ms give-back.
  LAST_DATA **2026-10-13T06:08Z**, minutes old, sync healthy (131 daily rows, 130 sleep rows, contiguous).
  Engine signals read out of `adaptPlan` itself, not estimated: **readiness 4/10, tsb -22.4, ATL 56.8 against
  CTL 34.4 (1.65x), consecutiveHard 0, daysSinceRest 0, easeHard FALSE, scale 1.000, unplanned7 316.**
- decision: CHANGED — **wrote Base I week 8 (26 Oct – 1 Nov), seven new days.** No week in progress touched;
  weeks 6 and 7 are byte-identical to yesterday. Ten added lines, nothing changed and nothing removed.
- why: **the written plan ran out on 25 Oct while Base I runs to 8 Nov — fourteen days of the phase unwritten,
  a horizon of twelve days, shrinking by one every morning.** `adaptPlan` can only reconcile days that exist,
  so this is a gap no amount of recomputation closes.

- **the horizon, and why nobody caught it.** SCHEDULE ended 2026-10-25; TAPER_PLAN's Base I block ends
  2026-11-08. Nothing in this file records a deliberate two-week horizon — I grepped for one. The clone is
  shallow (50 commits, back only to 11 Oct) so I could not date when week 7 was written, but either way the
  runway has simply been drifting down one day at a time and no entry has mentioned it. That is exactly the
  failure mode this file exists for: defensible every single morning, wrong across a fortnight.
- **Monday 12 Oct logged ZERO activities.** The keystone compromised-ski session that yesterday's run
  deliberately protected ("he may be in the gym within the hour") was not trained. **I did not move the slot,
  and the reasoning matters more than the call:** it is not a "provably not doing" case. On 5 Oct it landed in
  full with splits recorded (4:02/4:19/4:24). Monday is his **best-attended weekday, 9/11 since 3 Aug**. And
  the miss came off tsb -29.8, ATL at 1.83x CTL and eight consecutive days carrying load — he took the rest day
  `forceRest` was about to try to convert on its own. That is a reason, not avoidance. The cost is still real:
  12 Oct was to be the second data point on the fade, and the fade is the entire ski problem.
- **the physiological finding, and it is the number no previous entry has computed: his RHR floor has lifted
  about 3 bpm, and it is a shift, not an excursion.** 23 Sep – 1 Oct ran **40/42/39/39/38/40/41/39/40** — nine
  consecutive mornings inside 38-42. From 6 Oct: **43/44/44/41/47/43/45/46** — eight mornings, **not one below
  41**, last-7 mean **44.3 against a prior-30 mean of 41.5**. This is not the 2-3 Oct event (54 then 62, zero
  REM both nights, under four hours asleep); that was acute and it cleared inside a day. This is the floor of
  the range itself moving, inside a nominal 38-46 so the range test never trips. **HRV agrees** (last-7 mean
  76.3 against 82.8 for the fourteen before it) and so do the load counters (tsb -22.4, ATL 1.65x CTL). Three
  independent markers, same direction, and they all date from the 693-TRIMP week.
- **why that did NOT become a cut to week 6.** The correction is already running, and the rest day is what ran
  it: tsb **-29.8 -> -22.4**, ATL/CTL **1.83 -> 1.65**, consecutiveHard **4 -> 0** — which also retired
  yesterday's spurious `easeHard`, the one firing on four Z2-and-tennis days. Week 6 now costs **466 remaining
  against a 400-560 band, governor at scale 1.000, no day adjusted**: nothing is over-prescribed and nothing is
  being trimmed, because the missed Monday took its own 143 out with it. Sleep last night was 538 minutes with
  126 REM. Cutting the Thursday KEY RUN or the Friday long run — the two sessions the block is short of, in his
  weakest block against the field at top 27.7% — would be reacting to a signal the system is absorbing in front
  of me. The signal gets stated and gets a sharper trigger instead.
- **yesterday's RHR trigger did not fire, and I am saying so rather than quietly acting anyway.** It asked for
  "47 or above on any two mornings in week 6, or any single reading above 48". Week 6 has given 45 and 46. But
  it was written to catch an **excursion** and cannot see a **floor shift**, which is what happened. Restated
  below as a level test on the 7-day mean.

- **what went into week 8, with the reason for each number:**
  - **Mon 26 Oct** repeats 19 Oct's ask — every rep under 4:08, rep 3 within 6s of rep 1 — rather than
    tightening again, **because 12 Oct never happened, so 19 Oct is the first test of that standard and one
    answer is not a trend.** Same logic the 21 Oct ski line already runs on. Costs 143, identical to 19 Oct.
  - **Thu 29 Oct** is the next rung: **6x1km @ 4:06 off 60s, 50min door to door.** Density only, no new pace —
    15s less recovery than 22 Oct. Safe to write before 15 Oct reports precisely because it asks no pace he has
    not already been set. It also lands the ladder where TAPER_PLAN's Base II note already says Base I ends
    ("6x1km @ 4:04 off 60s"): 4:04 is week 9's rung and 4:06-off-60s is the step immediately before it.
    Costs 136, same as 22 Oct.
  - **Fri 30 Oct** long run **80min, last 20min @ 4:30/km**. The ladder is 70 done (10 Oct, 1:10:05 / 12.80km)
    -> 70 (16 Oct) -> 75 (23 Oct) -> 80, and the fast finish grows 15 -> 20min, the first time this block asks
    for plan-template's full race-pace finish. Costs 108.
  - **Wed 28 Oct** is the third writing of 6x500m @ 1:59 off 90s, compromised by a 45min Z2 run in front of it
    because no fixture is booked. 61 + 48, same as 21 Oct.
  - **Tue 27 Oct** carries a `note:true` tennis reminder and no prescription. No fixture is booked fourteen days
    out, and the SCHEDULE header's own rule is that tennis is not prescribed. Costs 0 and adherence.py does not
    count it as prescribed.
  - **Sat 31 Oct** is the long-run backstop as a note — the mechanism that actually worked on 10 Oct, when
    Friday 9 Oct went to a two-hour match and the 70min landed on the Saturday.
  - **no Hyrox-circle note in week 8.** The circle has not run since 25 Sep, five weeks. Weeks 6 and 7 still
    carry their `note:true` reminder and I left those alone, but propagating it into a week thirteen days out is
    clutter for something that does not happen.
  - **Sunday stays "Full rest - family day"** although he trains 7 Sundays in 10 (3 of them tennis), and
    11 Oct's 1h29 match on a written rest day is what preceded the missed Monday. **I drafted an edit here and
    it was wrong:** plan-template.md records "Sunday is family day and full rest" as his own constraint, and
    unplanned Sunday load is meant to be absorbed retrospectively by adaptPlan. Reading the reference instead
    of trusting my own pattern-match is the only reason that edit did not ship.
  - **week 8 costs 494** against 400-560, scale 1.000, no day adjusted. Weeks 6 (466 remaining / 609 as
    written) and 7 (589) are unchanged.
- **two costing traps I introduced and caught before pushing, both in one line, and both one word.** The Wed
  28 Oct ski first read "1:59 either holds to rep 6 **or** the format changes" — `isOptionalLine` tests
  `/\bOR\b/i`, so that halved the session — and the same draft had dropped the word **compromised**, which
  drops `PLAN_INTENSITY` from the 162 group to the 146 erg group. Together they priced a session **identical to
  14 and 21 Oct at 16 TRIMP instead of 48.** Rewritten with "compromised by it" and with no bare "or"; it now
  prices at 48, matching both. Recording the mechanism because this is the **second morning running** that a
  draft line was mispriced by a single word, and the cost of the first was caught the same way.
- **engine defects, outside this Routine's edit surface, both unchanged:**
  1. **`isTennis` (src/App.jsx:1151) is `=== "tennis"` against rows typed `Tennis V2`**, so `loadModel.tennis`
     has **n=0** and every planned court session is priced from the 138bpm/75min fallback at **101 TRIMP**
     against a measured mean of **78** across his four matches last week. **Eighth entry recording this. One
     word: `/^tennis/`.** Its effect today is specific: week 7 costs 589 against a 560 ceiling and roughly 23 of
     that overshoot is phantom load on the single booked match.
  2. **`HARD_TRIMP = 55` in `adaptPlan` counts ordinary days as hard.** Quiet this morning only because the
     rest day reset `consecutiveHard` to 0 — the instrument is still a TRIMP threshold where it wants an
     intensity test (`_avgHR >= HARD_HR`). Second entry.
- verification: `npm run build` clean, **446.45 kB** against **443.98** yesterday — **+2.47 kB**, all of it the
  new week's plan text. **11/11** patch anchors. 131 daily and 130 sleep rows, all at 4-space indent. SCHEDULE
  **57 days** (was 50), dates sorted and unique, every day line at 4-space indent, **8 weeks**; TAPER_PLAN
  **18 blocks**. Round-trip `update.patch()` against a copy of the real src/App.jsx (module body above
  `# -- Main --`, `head -1046`, imported with `-I`): **24/24** — TODAY advanced, daily/sleep/weight/CSV all
  patched, wellness rows keeping their 4-space indent, sorted and deduped with no rows lost, and SCHEDULE,
  TAPER_PLAN, RACE, STATION_TARGETS, RACE_BUDGET and RACE_GAINS all byte-identical through the patch, with
  week 8 surviving. **Three notes for the next cold run, which cost me two harness runs:** `patch()` advances
  TODAY to **`date_str` + 1 day**, not to `date_str`; it reads sleep stages from a **nested `wellness["sleep"]`
  dict**, not from flat `deep`/`rem`/`light` keys; and `weight` is a **`(date, kg)` tuple**, not a float.
- **on the no-change count: zero consecutive NO CHANGE runs precede this entry — the last twenty-three all say
  CHANGED.** Passivity is not this Routine's failure mode now; churn is. So this run made exactly one change,
  on days he has not reached, and deliberately declined the two edits it was most tempted by — a cut to week 6
  off the RHR signal, and moving the Monday keystone off a single miss.
- watching:
  - **RHR, restated as a level test because the excursion test could not see what happened.** **What would make
    me act: if the 7-day RHR mean is still at or above 44 on Mon 19 Oct, week 7 loses the Wednesday 45min Z2
    run** — the cheapest line in that week, and the one whose only job is to compromise the ski, which 14 Oct
    will have already shown a court can do instead. **Decide it Mon 19 Oct.** The Thursday KEY RUN and the
    Friday long run are the last two things to go, never the first.
  - **the Thursday KEY RUN, 15 Oct.** Unchanged and still the real test — 6 Oct was written as the benchmark
    and he ran an easy Z2 10km instead. **What would make me act: if 15 Oct is blank or reads easy, the quality
    run comes off a standalone slot entirely and gets bolted to Monday's gym trip, the only session in this
    block that has ever been 1-for-1. Decide it Fri 16 Oct**, not after 22 Oct has also failed.
  - **Base I week 9 (2-8 Nov), still unwritten, and deliberately.** Its rung is the 4:04-off-60s that
    TAPER_PLAN's Base II note already names as where Base I ends, and writing 4:04 before knowing whether 4:06
    held to the last rep would be guessing. **What would make me act: write it on Fri 23 Oct, once 15 and
    22 Oct have both reported — and write it sooner than that if either Thursday is missed**, because then the
    ladder needs re-anchoring rather than extending.
  - **the Monday keystone, now 1-for-2** (5 Oct in full, 12 Oct missed). Not moved, for the reasons above.
    **What would make me act: a second consecutive miss on 19 Oct makes it 1-for-3, and then the compromised
    ski moves to Wednesday and merges with the 6x500m — one gym trip instead of two. Decide it Tue 20 Oct.**
  - **the ski format.** Two continuous ten-minute pieces against an interval ask so far (7 Oct Row 10min 2400m,
    8 Oct Ski-ERG 10min 2380m). Yesterday's trigger carries forward unchanged: **a third continuous ten-minute
    piece on 14 Oct makes 4x500m off 60s the written ask.** Worth restating that 2380m in 10:18 is 4:19/1000m —
    his exact Athens split — off a 3:54 fresh TT. That gap is priority 1, in one line.
  - **the 560 ceiling.** Week 6 remaining costs 466 and `unplanned7` is **316**, so if court load repeats the
    week closes near 600 again. Yesterday's trigger stands: **if 12-18 Oct closes above 620 with running again
    under 150, court time has to be entered as a booked fixed cost rather than arriving as unplanned load.
    Decide it Mon 19 Oct.**
  - **swim 1x/0 has aged out and is not a finding.** Its only prescription is 8 Sep's "20-30min very easy jog
    OR swim" in the decompress week; it will leave the 21-day window on its own.

---

## 2026-10-12
- adherence: no ACTION REQUIRED and no WATCH. ski 6/3 · row 1/1 · hyrox 4/1 · strength 5/5 · swim 1x/0
  (ages out tomorrow) · cycle 2/5 · tennis 4/9 · **run 10/6, short by 4 — and only 2 of the 10 landed on
  the day it was written** (6 Oct, 10 Oct). Benchmarks already due: 28 Sep and 2 Oct NOTHING LOGGED,
  30 Sep logged, 6 Oct TRAINED EASY INSTEAD, 8 Oct TRAINED OTHER TYPE. Next 14d: **Thu 15 Oct and
  Thu 22 Oct**, both KEY RUNs, both on his best-attended weekday — no benchmark is sitting on a day he
  does not train, so nothing is pre-deferred.
- readiness: HRV **78 vs baseline 72** (delta **+6**), RHR **45**, respiration 12.0, SpO2 98,
  **8h36 asleep** — 101 deep, **123 REM**, 292 light, 1 awake. `hrvBaseline` **74 -> 72**, the first fall
  after two rises. LAST_DATA **2026-10-12T06:08Z**, minutes old, sync healthy (130 daily rows, 129 sleep
  rows, contiguous). Engine signals, read out of `adaptPlan` itself rather than estimated:
  **readiness 5/10, tsb -29.8, ATL 65.5 against CTL 35.7, 8 days since a zero-load day, easeHard TRUE.**
- decision: CHANGED — **the written week is cut to fit the band instead of the band being raised to fit
  the week.** Six SCHEDULE lines: the standalone easy Z2 run comes off **Tue 13, Wed 14 and Tue 20 Oct**;
  **Wed 14 Oct**'s ski now hangs off the booked 13:00 match instead of a 40min run in front of it;
  **Thu 15 and Thu 22 Oct** get a written length (45min / 50min); **Mon 19 Oct**'s "unbroken" is reworded.
  TAPER_PLAN Base I note corrected and rewritten. **Bands untouched — the ceiling stays 560.**

- **the number that forced this, and it is one no previous run has computed: week 6 as written costed
  736 TRIMP against a 560 ceiling, so the governor opened this morning at scale 0.761 and the Friday
  long run read 55min on the first page load.** That is worse than the 0.79 yesterday raised the ceiling
  to avoid. Yesterday's raise was computed off a hand projection of 635; the engine's own cost, using
  its own `loadModel` (tennis n=0 -> 138bpm/75min fallback, run median 52.15min), is 736. I stopped
  estimating and ran the real functions: `analyze(parseCSV(CSV_DATA))` -> `loadModel` -> `adaptPlan`,
  extracted out of src/App.jsx into a node harness, which is how every number in this entry was produced.
- **and the week that just closed is not 617 either. It closed at 693 measured** — the Sunday match
  (1h29, 73 TRIMP) landed after yesterday's run read the file. 693 is **+47% on his previous record week
  (472, 17 Aug)** and 1.45x the next-highest week in the eleven weeks since 27 Jul: 476, 363, 421, 472,
  289, 250, 156, 447, 357, 327, **693**. Composition: **tennis 311 across four matches (two over two
  hours), treadmill 79, running 70, strength 65, multisport 60, cycle 52, indoor cardio 27, skating 22.**
- **so the band is not wrong — the week was.** Seven of the last eleven measured weeks sit in 289–476.
  400–560 describes him accurately; 693 is an outlier, not a new normal, and raising the ceiling a second
  day running to cover it is precisely the ratchet yesterday wrote into the Base I note. **I honoured that
  rule rather than reinterpret it twelve hours later.** After the edits week 6 costs **609** and week 7
  **589**, the governor opens at **0.920**, and the long run reads **65min instead of 55min**.
- **why the easy Z2 run is the session that goes, and it is the only session type that clears the brief's
  "provably not doing" bar.** Prescribed standalone easy runs in the window: **29 Sep (missed — he played
  tennis instead, unplanned 50 TRIMP), 3 Oct (missed), 8 Oct (missed — inline skating, strength and a
  10min ski erg instead). Nought for three.** Over the same window the two runs that matter both landed:
  the 6 Oct threshold set and the 10 Oct backstop long run (1:10:05, 12.80km, HR 131). **Writing four runs
  a week and getting two is what made the week cost 736 and kept the governor cutting the two that count
  by a fifth to make room for the court.** Two runs at full length beats four at 76%.
- **Wed 14 Oct is the edit I am most confident about.** It carried a booked match at 13:00, a 40min Z2 run
  and a 20min ski — 203 costed TRIMP on a court day. The run was there to make the ski compromised, and
  the match already does that job better than the run would: **30 Sep he skied 1000m in 3:57 straight off
  a 93-minute singles match, 3 seconds off his fresh 3:54.** 7 Oct is the behavioural proof too — off a
  2h25 match he went to the gym and did a 10min row plus 48min of strength, not a 40min run. So the run
  was both the most expensive and the least likely line on the day. **Wed 21 Oct keeps its run**, because
  no match is booked that day and there the run is the only thing that can put tired legs under the erg;
  the line now says so, so the two Wednesdays do not look like a contradiction.
- **the two Thursday benchmarks now carry a written length, and this is a mechanism fix, not padding.**
  A line with no duration cannot be scaled: `scaleDuration` returns null, so the governor fell through to
  "Shorten — cut roughly a quarter of the working sets" **on the block's keystone benchmark**, while
  simultaneously pricing it at `model.run.min` = **52min at HR 168 = 142 TRIMP**, the second most
  expensive session in the week. With "45min door to door" written in it costs **122** and trims to 40min
  — minutes off the warmup instead of reps off the set. Same for 22 Oct at 50min (136).
- **two costing traps found and closed.** Mon 19 Oct read "lunges 4x50m **unbroken**", and `PLAN_INTENSITY`
  tests the threshold group *before* `compromised`, so that one word priced the Monday gym trip at **168
  instead of 162 (163 TRIMP instead of 143)**. Reworded to "with the bag never down" — same instruction,
  honest price. The second was in my own draft: the Wed 21 Oct run line nearly said "this run is what makes
  the ski **compromised**", which would have priced an easy Z2 run at 162; it says "puts tired legs under
  the ski" instead.

- physiology — **the load counters and the overnight data disagree this morning, and both are worth saying.**
  Overnight is good: HRV 78 against 72 (+6), **8h36 asleep with 123 minutes of REM**, RHR 45, respiration
  12. Yesterday's sleep-duration watch item (453 then 401 minutes; trigger was a third night under 420)
  **did not fire** — 516 minutes, retired. But the load counters are not good: **tsb -29.8 with ATL at
  1.83x CTL (65.5 vs 35.7), eight consecutive days carrying load, and a 693-TRIMP week behind him.** The
  honest reading is that his autonomic markers are absorbing it and his accumulated-fatigue markers are
  not, which is what an outlier week looks like three days in. **That is the physiological reason the brief
  asks for before touching a week in progress** — and week 6 is one day old with today's line untouched.
- **`hrvBaseline` ticked 74 -> 72.** Against the eight-session fall that preceded the turn
  (91 -> 88 -> 79 -> 83 -> 75 -> 69 -> 67 -> 66) a single 2ms give-back after 66 -> 72 -> 74 is noise, not
  a reversal of the reversal. Net still +6 off the trough. Noted, not acted on.
- **RHR 45 is the thing I am actually watching.** Six-day run **47/43/45** after **44/44/41** — inside the
  38–46 range but sitting at the top of it, and 45 on a night with 8h36 and 123 REM is not what a recovered
  morning looks like. Not an excursion: the 2–3 Oct signature (54 then 62, zero REM twice, under four hours
  asleep) is absent. Trigger below.

- what I deliberately did NOT touch:
  - **Mon 12 Oct, today's line.** He may be in the gym within the hour; rewriting the session he is about
    to do is the one thing a 06:00 cold session should never do. It is also the block's keystone and 1-for-1.
  - **Fri 16 Oct, the long run.** 70min Z2 with the Saturday backstop. Protecting it from the governor was
    the whole point of the exercise — it is the session the block is short of and the weakest block against
    the field (top 27.7%).
  - **The TAPER_PLAN bands.** 400–560 stands. See the anti-ratchet reasoning above; this is the first
    morning the rule has actually bound anyone and it bound me.
  - **The phase.** Base I · Aerobic, week 6 of 6, 166 days to Copenhagen. Still right. The problem was
    the written week's size and shape, not the phase.
  - **The ski ask.** 6x500m @ 1:59 off 90s on both Wednesdays, 4x500m off 60s still counting in full.
    Yesterday's format trigger carries forward unchanged: **a third continuous ten-minute piece on 14 Oct
    makes 4x500m off 60s the written ask.** Worth recording that 7 Oct logged "Row 10min 2400m" and 8 Oct
    "Ski-ERG 10min 2380m" — the ten-minute continuous habit is modality-independent, and 2380m in 10:18 is
    4:19/1000m, his exact Athens race split, off a 3:54 TT. That gap is the priority-1 problem restated.
  - **hyrox 4/1.** Every forward Hyrox line is already `note:true` — the circle has not run since 25 Sep
    and the plan stopped waiting on it on 9 Oct. Nothing to resolve; the prescription is already zero.
  - **RACE / STATION_TARGETS / RACE_BUDGET / RACE_GAINS.** Yesterday produced one match and a sauna. No
    target moved. Ski erg still the weakest element (top 29.8%), running still the weakest block (27.7%),
    and the 39-second budget shortfall stays visible and unallocated until 15 and 22 Oct report.
- **two engine defects, both outside this Routine's edit surface, and today they are not cosmetic —
  together they are capping real training this morning:**
  1. **`isTennis` (src/App.jsx:1149) is `=== "tennis"` against 33 rows typed `Tennis V2`**, so
     `loadModel.tennis` has **n=0** and every planned court session is priced from the 138bpm/75min
     fallback at **101 TRIMP**. His four real matches last week measured 80/80/78/73, mean **78**. Two
     booked matches in week 6 therefore carry **~46 TRIMP of phantom load**, inside the 609 the governor
     is trimming against. **Seventh entry recording this. One word: `/^tennis/`.**
  2. **`HARD_TRIMP = 55` in `adaptPlan` is counting ordinary days as hard days.** `easeHard` fired this
     morning with the reason **"4 hard days back to back"** — 8/9/10/11 Oct at 69/78/82/76 TRIMP, which is
     a gym trip plus skating, a match, **a Z2 long run**, and another match. Not one of them was a hard
     session by intensity. The consequence is specific and lands today: **the Monday compromised ski is
     eased to "hold it at Z2, drop the intervals, the timing and the max efforts" on a morning with
     HRV +6, 8h36 of sleep and 123 REM**, and the code's own release clause cannot fire because it requires
     `consecutiveHard < 3`. A TRIMP threshold is the wrong instrument; it wants an intensity test
     (`_avgHR >= HARD_HR`) or a much higher floor. **I did not work around it** — the alternative was to
     take the word "compromised" out of the Monday line to drop it under the 155 gate, which would be
     gaming the engine and mispricing the session.
- verification: `npm run build` clean, **443.98 kB** against **443.85** for a build of this morning's HEAD
  — **+0.13 kB**, all of it plan text. **11/11** patch anchors, SCHEDULE **50 days** (all at 4-space
  indent), TAPER_PLAN **18 blocks**, 130 daily and 129 sleep rows all at 4-space indent. Round-trip
  `update.patch()` against a copy of the real src/App.jsx (module body above `# -- Main --`, imported with
  `-I`): **24/24** — TODAY advanced, daily/sleep/weight/CSV all patched, wellness rows keeping their
  4-space indent, sorted and deduped with no rows lost, `hrvBaseline` rewritten, and SCHEDULE, TAPER_PLAN,
  RACE, PREV_RACE, STATION_TARGETS, RACE_BUDGET and RACE_GAINS all byte-identical through the patch.
  (`PREV_RACE` is `const PREV_RACE = ATHENS;`, not an object literal — a brace-matching assertion on it
  fails for the wrong reason. Note for the next cold run.)
- every SCHEDULE day from 12 Oct re-diffed for prescribed type, costed duration, `PLAN_INTENSITY` value,
  note status, benchmark flag and estimated TRIMP: **6 lines changed, 3 sessions removed, none added**;
  week 6 **736 -> 609**, week 7 **676 -> 589**, governor **0.761 -> 0.920**, Friday long run **55 -> 65min**.
  Every changed line is **2 or 3 sentences** and the longest is 383 characters. One residual I am leaving
  alone: the Wed 14 ski shows "Shorten" rather than a percentage, because `scaleDuration(20min, 0.92)`
  rounds back to 20 and a hard session with no scalable duration falls to the working-sets branch — the
  line already offers 4x500m off 60s as a full-credit fallback, so the advice is coherent.
- **on the no-change count: zero consecutive NO CHANGE runs precede this entry — the last twenty-two all
  say CHANGED.** Passivity is not the failure mode; the risk is churn, so I held this to the two tests the
  last few entries used. It answers a question the brief asks outright (are the bands realistic against
  what he is absorbing — yes, and the plan was not), it rests on numbers no previous run had: **693 closed
  rather than 617, 736 costed by the engine's own model rather than 635 by hand, 2 of 10 prescribed runs
  landing on their written day, and `easeHard` firing on four Z2-and-tennis days.** And it is the opposite
  of yesterday's instinct: yesterday moved the ceiling to fit the plan, today the plan moves to fit the
  ceiling. Three lines of it land on a week he has not started; three land on days 2–4 of a week whose
  day 1 is untouched.
- watching:
  - **the Thursday KEY RUN, 15 Oct.** Unchanged from yesterday and still the real test. **What would make
    me act: if 15 Oct is blank or reads easy, the quality run comes off a standalone slot entirely and
    gets bolted to Monday's gym trip, the only session in this block that is 1-for-1. Decide it Fri 16 Oct**,
    not after 22 Oct also fails.
  - **the 560 ceiling against week 6, now that the plan fits inside it.** **What would make me act: if
    12–18 Oct closes above 620 with running again under 150, the written week is no longer the binding
    constraint and court time has to be entered as a booked fixed cost rather than arriving as unplanned
    load. Decide it Mon 19 Oct.** Six unplanned tennis sessions in the last three weeks (50/76/80/80/78/73)
    is the pattern that would do it.
  - **RHR.** 45 today on 8h36 and 123 REM, after 47 on 10 Oct. **What would make me act: 47 or above on
    any two mornings in week 6, or any single reading above 48, and Thursday's KEY RUN is what eases first
    — not Monday's ski, which the block cannot afford to lose.**
  - **the rest-day gap.** Eight days without a zero-load day; 18 Oct would be fourteen. `forceRest` needs
    `daysSinceRest >= 9 && tsb < -15` and tsb is -29.8, so **the engine will try to convert a day on its
    own from tomorrow** — it cannot touch Tue 13 Oct (a session there already carries an adjustment, which
    the rule forbids) and Wed/Thu/Fri are all either booked or load-bearing. **What would make me act: if
    13–15 Oct all carry load and HRV drops under 62 (baseline -10), Sat 17 Oct becomes full rest and the
    long run goes to Friday with no backstop. Decide it Fri 16 Oct.**
  - **the ski format.** A third continuous ten-minute piece on 14 Oct makes 4x500m off 60s the written ask.

---

## 2026-10-11
- adherence: no ACTION REQUIRED and no WATCH. ski 5/3 · row 1/1 · hyrox 4/2 · strength 4/5 on track
  · swim 1x/0 · cycle 2/5 · tennis 6/8 · **run 10/7, short by 3** (yesterday read 11/6 — the Saturday
  long run closed one of those gaps). Benchmarks already due: 28 Sep and 2 Oct **NOTHING LOGGED**
  (dead structure, both age out of the window by 23 Oct), 30 Sep logged, 6 Oct **TRAINED EASY
  INSTEAD**, 8 Oct **TRAINED OTHER TYPE**. One of five benchmarks in 21 days actually landed.
  Next 14d after this morning's edit: **Thu 15 Oct and Thu 22 Oct**, both KEY RUNs.
- readiness: HRV **91 vs baseline 74** (delta **+17**, the best of the block), RHR **43**, respiration
  12.0, SpO₂ 98, **6h41 asleep** — 125 deep, **70 REM**, 206 light, 0 awake. `hrvBaseline` 72 → **74**.
  LAST_DATA **2026-10-11T06:08Z**, minutes old, sync healthy (129 daily rows, 128 sleep rows,
  contiguous). Neither `easeHard` gate fires: +17 against a −10 trigger, 401 minutes clears the 360 floor.
- decision: CHANGED — **two edits, both on weeks he has not started.** (1) **TAPER_PLAN Base I ceiling
  500 → 560**; the floor stays at 400. (2) **The KEY RUN moves off Wednesday onto Thursday** on both
  14/15 Oct and 21/22 Oct, swapping with the easy Z2 that sat on Thursday, so Wednesday becomes an
  easy-run-into-ski compromised erg session inside the gym trip he already makes. Week 5 is untouched;
  today's line (court at 08:00, then family day) is untouched.

- **the Saturday long run landed, and that is the first thing to record.** Yesterday's live change
  asked for 70min Z2 against his 1:06 ten-week ceiling. He ran **1:10:05, 12.80 km, average HR 131,
  ~79 TRIMP** — his longest run since 21 July and the longest genuine Z2 run anywhere in the record.
  The reachable-ladder reasoning was right and **the 16 Oct watch item is answered eight days early**:
  70 minutes is now inside what he has done, so the 70 → 70 → 75 ladder needs no further defence.
  Per yesterday's procedural note this was an agreed change, not drift, and adherence scored it.

- **why the ceiling moved again, one day after it moved, and this is the number that forces it:
  week 5 did not close at the 535 yesterday's raise was computed from. It closed at 617** — and today's
  booked court time is not in that yet. 617 is **145 above his previous record week (472, 17 Aug)** and
  **117 above the 500 ceiling set yesterday**. Yesterday's decision was made on a Friday projection
  and is now known-insufficient on its own terms, from data that arrived overnight. Composition:
  **tennis 238 (6h19), running 149 (2h02), ski 74, strength 65, cycle 52, other 22, row 13, sauna 4.**
  Running recovered from the 70 that drove yesterday's entry to 149, entirely because of Saturday.
- **and the band has never once contained the written plan, which is the finding no previous run had
  computed.** Costing every SCHEDULE day through the engine's own `planIntensity`/`planDurationMin`/
  `estTrimp`: wk4 **474**, wk5 **785**, wk6 **635**, wk7 **676** — against bands of 350–460 and then
  400–500. So the governor at `src/App.jsx:1740` has been in **permanent trim** for the whole block,
  which means the written plan was never the plan; the trimmed version was.
- **what 500 would have done to week 6, tomorrow morning, before a single session:** `scale =
  max(0.6, (hi − done) / remainingPlanned)` = 500/635 = **0.79**, so Friday's **70min long run is
  rewritten to 55min and Monday's 60min gym to 45min on Monday's first page load**. At 560 the same
  arithmetic gives **0.88 — 60min and 55min**, a mild trim instead of a fifth off the block's keystone
  session. At 620 it would not trim at all, which I did not want: his second-biggest week ever is 472
  and 617 should not read as normal. **560 is chosen to let the governor trim a little, not to bless 617.**
- **the floor deliberately stays at 400.** The diagnosed defect is entirely the ceiling. Raising the
  floor would arm the *volume-raise* branch (projection under `lo` and readiness ≥7 scales up to 1.25×),
  and after a 617-week with no zero-load day since 3 Oct the last thing this plan needs is a mechanism
  that adds volume to a light week. Minimal edit, one direction.
- **the anti-ratchet rule is now written into the Base I note**, because two raises in two days is
  exactly how a cold session talks itself into a ceiling of 700 by November: *the ceiling moves only on
  closed measured weeks and on the plan's own costed total, never on a projection.* Yesterday's raise
  broke that rule and this one obeys it — 617 is a closed week and 474/785/635/676 are the plan's own
  arithmetic.

- **why the KEY RUN left Wednesday, and I tested this against my own host-chasing warning first.**
  Quality runs by weekday since 3 Aug: **Thursday 3** (13 Aug 8×600m, 27 Aug 16×400m, 1 Oct 8×1km at
  4:01), **Wednesday 1** (5 Aug, nine weeks ago), **Friday 1**, **Tuesday 0**. The 9 Oct entry moved
  quality onto "Wednesday late morning" on the correct finding that **every structured run since 3 Aug
  started 08:52–13:43 while all ten evening runs came back Z2** — but that is a statement about the
  *hour*, and it was applied to the wrong *weekday*. Wednesday late morning is when he is on court:
  **30 Sep tennis 13:56 for 94min, 7 Oct tennis 12:02 for 145min**, each followed by an evening gym trip.
- **the part that does not depend on court time at all, and is the stronger half of the argument:
  Wednesday is the gym-trip day** and the written plan already puts the second ski and the Hyrox-circle
  note there. Asking for the week's hardest run *and* its second erg session on the one day that needs
  a venue guarantees the governor cuts both. **Thursday is the only day in week 6 carrying nothing**,
  is 8/9 attended since 3 Aug, and has had **one court session in ten weeks** (24 Sep).
- **why this is not the host-chasing the 9 Oct addendum named as this Routine's live failure mode.**
  That was a session that should have been deleted, moved twice instead. This one is the block's
  keystone benchmark, it has a **positive** host with direct evidence rather than a merely-less-bad one,
  and it is load-neutral. The honest objection is that **Wednesday has had zero chances — 14 Oct would
  have been its first**, and I am moving it before it has been tested. I am taking that cost on purpose:
  the collision is 2-for-2 and 145 minutes deep, the brief says move a benchmark *before* it slips, and
  this one already slipped once on 6 Oct. **If Thursday fails twice the answer is not a third weekday**
  — see the watch list.
- **the Wednesday session is better than what it replaces, not a leftover.** Easy 40min run straight
  into 6×500m at 1:59 is genuinely compromised erg work off running legs, which is priority #1 from the
  athlete profile ("train the ski *compromised*, off running legs, not fresh"). Monday stays the hard
  compromised ski; Wednesday is now the easy-legs one. Two different stimuli instead of one erg session
  bolted to a threshold run it was competing with.
- **13 and 20 Oct were rewritten too, and they had to be:** both still read "quality work sits on
  Wednesday". Leaving them would have had the plan telling him two different things on the same screen.
  Costing is identical (both are Z2 runs with their durations unchanged); only the sentence moved.

- physiology — **the baseline reversal is holding, and it happened through his biggest week ever.**
  `hrvBaseline` fell eight consecutive times, 91 → 88 → 79 → 83 → 75 → 69 → 67 → 66, then **66 → 72 → 74**.
  Three rises, +8 in total, and the third one lands the morning after a 617-TRIMP week closed. HRV itself
  is **91 against 74**, the best delta of the block. That is the evidence that 617 is inside what he
  absorbs, and most of why I was willing to put the ceiling at 560 rather than leave it.
- **yesterday's RHR trigger did not fire, and that is worth stating plainly.** It read: *47 or above
  again tomorrow, or two more nights under 60 minutes of REM, and the Monday compromised ski eases first.*
  Today is **RHR 43**, back inside 38–46, on **70 minutes of REM**. The six-day run is 44/44/41/47/43 —
  so 47 was one beat out, not an excursion, and the 2–3 Oct signature (RHR 54 then 62, zero REM twice,
  under four hours asleep) remains absent. **Monday's ski is not eased. The trigger is retired.**
- **the signal that replaces it is sleep, and it is the one caution this morning.** 453 then **401
  minutes** — two nights under 7 hours, the shortest since 3 Oct, against a 505–560 habit. REM was fine
  last night (70) so this is duration, not architecture, and 401 clears the engine's 360 gate with 41
  minutes to spare. On its own, nothing. On top of 617 TRIMP it is the first thing I would expect to bend.
- **no zero-load day since 3 Oct.** 4–11 Oct is eight consecutive days and today's court time makes it
  nine; the next written rest day is **Sun 18 Oct**, which would be fifteen. I did not insert one:
  HRV is +17, the baseline is rising, the 560 ceiling now trims week 6 by 12% on its own, and
  `adaptPlan`'s rest-day guard (9 days without rest while form is under −15) exists for exactly this.
  **Stated rather than acted on, with a trigger below.**

- what I deliberately did NOT touch:
  - **Week 5, including today.** Nothing in it moves. Today is court at 08:00 then family day, which is
    the right shape for the last day of a 617 week.
  - **Monday 12 Oct.** The compromised ski is the block's keystone, it is 1-for-1, and the 5 Oct fade
    (4:02 → 4:19 → 4:24) is still the target. Untouched.
  - **The phase.** Base I · Aerobic, week 5 of 6, 167 days to Copenhagen. Still right. The problem this
    morning was placement and a ceiling, not content — and the Saturday run is evidence the content works
    when it is reachable and lands on a day he attends.
  - **The long-run ladder and the Saturday backstops.** 70 / 70 / 75 with `note:true` Saturdays, exactly
    as written yesterday. Validated rather than revised.
  - **The ski ask itself.** 6×500m at 1:59 off 90s on both Wednesdays, with the 4×500m off 60s fallback
    intact. Yesterday's format trigger carries forward with one correction: **the ten-minute continuous
    habit has now shown up twice without waiting for 14 Oct** — 30 Sep (TT, 10min warmup) and 8 Oct
    (Ski-ERG 10min, 2380m). The line already concedes 4×500m off 60s "counts in full", so the trigger is
    half-satisfied and needs no edit; **if 14 Oct logs a third continuous ten-minute piece, 4×500m off 60s
    becomes the written ask rather than the fallback.**
  - **RACE / STATION_TARGETS / RACE_BUDGET / RACE_GAINS.** Yesterday produced one Z2 run and a sauna.
    No target moved. Ski erg is still the weakest element (top 29.8%), running still the weakest block
    (27.7%), and the **39-second budget shortfall stays visible and unallocated** until the 15 and 22 Oct
    KEY RUNs report.
  - **`isTennis` (src/App.jsx:1132).** Still `=== "tennis"` against 33 rows typed `Tennis V2`, so
    `loadModel.tennis` has **n=0** and falls back to the hardcoded 138bpm/75min. **Sixth run recording
    it, and this morning I can finally price it: planned court time is costed at 101 TRIMP where his
    real median (104bpm, 87min) is 45 — the engine over-prices every planned session on his most
    frequent activity by about 2.2×.** That inflation is inside the 635 I just set a ceiling against,
    which means 560 is more generous in real terms than it looks. One-word fix, `/^tennis/`, outside
    this Routine's edit surface — but it is now the largest single distortion in the week projection,
    not a cosmetic nit.
  - **swim 1x/0.** Ages out of the window on 13 Oct, never prescribed forward, no action — same as
    yesterday, and this is the last entry that needs to mention it.
- verification: `npm run build` clean, **442.94 kB** against **442.44** for a build of this morning's
  HEAD — **+0.50 kB**, all of it plan text. **11/11** patch anchors, SCHEDULE **50 days** (all at
  4-space indent — my first draft left four of them at 8 and inserted a stray blank line after the
  Base I block; both fixed before commit), TAPER_PLAN **18 blocks**. Round-trip `update.patch()` against
  a copy of the real src/App.jsx: **17/17**, with SCHEDULE, TAPER_PLAN, RACE, RACE_BUDGET, RACE_GAINS and
  STATION_TARGETS all byte-identical through the patch, wellness rows keeping their 4-space indent,
  sorted and deduped with no rows lost, and daily/sleep/weight/CSV all still patching. (Note for the next
  cold run: `patch()` wants sleep stages nested under `wellness["sleep"]` and weight as a
  `(date, kg)` tuple — a flat dict silently skips both, which cost me two runs of the test.)
- every one of the 50 SCHEDULE days re-diffed for prescribed type, costed duration, `PLAN_INTENSITY`
  value, info-line status, optional-line status, benchmark flag and estimated TRIMP: **exactly 4 changed**
  (14, 15, 21, 22 Oct), **46 of 50 identical**, and **week 6 costs 635 before and after, week 7 676
  before and after** — so this is a pure placement change that moved no load and invented no prescription.
  The costing traps were checked by hand again and two were live in the drafts: the Wednesday ski line
  contained the word **threshold** ("instead of threshold ones"), which `PLAN_INTENSITY` tests *before*
  `compromised` and would have priced it at **168 instead of 162**; and the Wednesday run line said
  "easy legs into the **erg**", which `SESSION_MATCHERS` tests ski/row/erg *before* run, so a logged
  SkiErg would have marked the easy run done. Both rewritten before the build. No line anywhere in the
  window contains the literal word for court sport outside a `type:"tennis"` line, and none contains a
  `\d+h\d+`. Longest line from 11 Oct onward is **413 characters / 3 sentences** (12 Oct, untouched);
  my longest new line is **376**. Every line in the window is ≤3 sentences.
- **on the no-change count: zero consecutive NO CHANGE runs precede this entry — the last twenty-one
  entries all say CHANGED.** Passivity is not this Routine's current failure mode, so I held both edits
  to the same test as yesterday: each answers a question the brief asks outright (are the bands realistic
  against what he is absorbing; do the next weeks need different *sessions* rather than smaller ones),
  each rests on a number no previous run had computed (617 closed, not 535 projected; the plan's own
  costed 474/785/635/676; three of five structured runs on a Thursday and one on a Wednesday since 5 Aug),
  and both land on weeks he has not started. The third thing I found — that the engine over-prices his
  court time by 2.2× — I have **not** acted on, because the fix is one word outside my edit surface.
- watching:
  - **the Thursday KEY RUN, 15 Oct.** This is the real test of this morning. **What would make me act:
    if 15 Oct is blank or reads easy, the answer is NOT a fourth weekday — the quality run comes off a
    standalone slot entirely and gets bolted to Monday's gym trip, which is the only session in this
    block that is 1-for-1. Decide it Friday 16 Oct**, not after 22 Oct also fails.
  - **the 560 ceiling, against week 6.** First week judged by it, and the anti-ratchet rule now binds me.
    **What would make me act: if 12–18 Oct closes above 560 with running again under 150, the ceiling is
    not the binding constraint and court time has to be priced into the week as a fixed cost rather than
    arriving as a surprise. Decide it Monday 19 Oct** — this is yesterday's 19 Oct watch item, carried
    forward unchanged and now with a second week of evidence behind it.
  - **sleep duration.** 453 then 401 minutes on the back of 617 TRIMP. **What would make me act: a third
    night under 420 minutes, or any night under 360 (which trips the engine's own gate), and Thursday's
    KEY RUN is what eases first — not Monday's ski, which is the session the block cannot afford to lose.**
  - **the rest-day gap.** Nine days without a zero-load day as of today, fifteen by 18 Oct. **What would
    make me act: HRV under baseline −10 or RHR above 46 at any point in week 6, and Thursday 15 Oct
    converts to full rest with the KEY RUN going to Friday and the long run to its Saturday backstop.**
  - **the ski format.** A third continuous ten-minute piece on 14 Oct makes 4×500m off 60s the written
    ask, per the note above.

---

## 2026-10-10 · addendum, after Simas read the morning’s push
- context: he came back live and said he had meant to run yesterday but ran out of time, asked
  **"shall I do today long run — 1:30min z2?"**, and noted there has been little running this week.
  He is right about the week, and his instinct to fix it today is right. **The 1:30 is not.**
- decision: CHANGED — **today’s line only.** Sat 10 Oct goes from `Optional · Z2 run 40min · flex
  session` to **`Long run 70min Z2`**, conversational throughout, 75min only if 70 still feels easy,
  no fast finish. Nothing else in week 5 moves, and the 16/23 Oct ladder from this morning stands.
- why a long run today, yes: **running delivered 70 TRIMP from one 52-minute Z2 10km this week against
  238 TRIMP from 6h19 of court time** — the lowest running load of any training week in the record, in
  an aerobic-base block, on his weakest block against the field (top 27.7%). And he is clear to go:
  **HRV 83 against a baseline of 72 (+11)**, on a baseline that has just turned upward 66 → 72.
- why not 1:30, and this is the number that settled it: **in the whole 44-column record back to 12 May
  there is exactly one running activity over 75 minutes — 13 Jun, 10.12km in 90:36, which is 9:00/km
  trail hiking rather than a Z2 run.** His longest genuine run is **1:14** (21 Jul, a tempo session) and
  his longest since 1 Aug is **1:06** (15 Sep). So 1:30 is **+24 minutes, a 36% jump on his ten-week
  maximum**, taken off a week carrying six hours of court legs — the shape of a calf or achilles
  problem, not a fitness gain. **Monday 12 Oct is also the session to protect**: the compromised ski is
  the block’s keystone and 1-for-1, and a 90-minute run today is the most likely way to lose it.
- **consistency check against my own morning push, which is the strongest argument available:** two
  hours earlier I cut 16 Oct from 80min to 70min and 23 Oct from 85min to 75min, on the explicit
  grounds that a 1:06 ceiling cannot support an 80-plus-minute ask. Blessing 90 minutes this afternoon
  would have contradicted that reasoning on the same data, the same day. 70 today is not a concession
  — it pulls 16 Oct’s session forward by six days and leaves the 70 → 70 → 75 ladder intact.
- the mild caution was stated to him rather than acted on: **RHR 47, first outside 38–46 since 3 Oct,
  on 35 minutes of REM and 7h43 asleep.** HRV says go; it does not say set a distance record. Trigger
  from the main entry is unchanged.
- **I also told him not to let the dashboard talk him out of it.** Week 5 sits at 535 against the
  400–500 band I set this morning, so the governor reads today as over and will trim the line on
  screen. That trim is the defect the morning entry describes, arriving on cue: 70 minutes of Z2
  running is exactly the load this block wants and more court time is not. Worth knowing that **the
  first version of the band fix does not stop the governor cutting the one session the week needs** —
  it only raised the ceiling, and 535 is past 500 too. **What would make me act: if the same thing
  happens in week 6, tennis gets priced into the week explicitly instead of arriving as a surprise.
  That is the 19 Oct decision already in the watch list, and this is the second data point for it.**
- procedural note for the next cold run: **today’s 70min run is an agreed live change, not plan
  drift.** If 10 Oct logs a 70-minute Z2 run, that is adherence, and the week’s run count should read
  one better than this morning’s 11/6 suggested. He answered my confirmation prompt with a bare `T`
  first, which I did not treat as consent — a stray keystroke next to `Y` is not an approval to deploy
  — and asked again before pushing.
- verification: `npm run build` clean, **441.59 kB** (from 441.20 — +0.39 kB). **11/11** patch anchors.
  Round-trip `update.patch()` against a copy of the real src/App.jsx: **27/27**, SCHEDULE and
  TAPER_PLAN byte-identical through the patch. All 50 SCHEDULE days re-diffed: **exactly 1 changed**
  (10 Oct, duration 40 → 70, `PLAN_INTENSITY` 138 both before and after, optional-line flag True →
  False so it now costs in full, prescribed type still `run` alone), **49 of 50 identical**. The line
  was written around the same two costing traps as this morning’s: no form of the word *tennis* (which
  `planIntensity` tests before anything else) and no `\d+h\d+` (which would read as hundreds of
  minutes), so "six hours of court legs" carries the number safely.

---

## 2026-10-10
- adherence: no ACTION REQUIRED and no WATCH. ski 5/3 · row 1/1 · hyrox 4/2 · strength 4/5 on track
  · swim 1x/0 · cycle 2/5 · tennis 5/8 · **run 11/6, short by 5 and the worst gap on the board.**
  Benchmarks already due: 28 Sep and 2 Oct **NOTHING LOGGED** (dead structure, aged out), 30 Sep
  logged, 6 Oct **TRAINED EASY INSTEAD**, 8 Oct **TRAINED OTHER TYPE**. Next 14d: Wed 14 Oct and
  Wed 21 Oct, both KEY RUNs, both on a weekday he trains — four run activities have landed on a
  Wednesday since 1 Aug, so neither is sitting on a day he does not show up. Nothing to defer.
- readiness: HRV **83 vs baseline 72** (delta **+11**, a green light), RHR **47**, respiration 13.0,
  SpO₂ 97, **7h43 asleep** — 61 deep, **35 REM**, 10 awake, no sleep score. `hrvBaseline` 66 → **72**.
  LAST_DATA **2026-10-10T06:08Z**, minutes old, sync healthy (128 daily rows, 127 sleep rows,
  contiguous). Neither `easeHard` gate fires: delta is +11 against a −10 trigger and 463 minutes of
  sleep clears the 360 floor.
- decision: CHANGED — **two block-level edits, both on future weeks, none on the week in progress.**
  (1) **TAPER_PLAN Base I band 350–460 → 400–500**, with one sentence in its note saying the band is
  total load and tennis is most of it. (2) **The weekend's long run is re-anchored and the Saturday
  flex run is folded into it as a `note:true` backstop** on 17 and 24 Oct — Fri 16 Oct goes 80min →
  **70min Z2**, Fri 23 Oct goes 85min/last 20min @4:25 → **75min/last 15min @4:30**. Week 5 is not
  touched at all, today's line included.
- why the band moved, and it is the brief's own question answered with the number: **week 5 stands at
  535 TRIMP through Friday against a 350–460 band — 75 over the ceiling with two days still to run.**
  Yesterday's entry deferred this decision to Monday, "on what closed rather than on a projection."
  That condition is now met early and in the only direction that matters: no Saturday and no Sunday
  can bring 535 back under 460, so the thing being waited for has already happened and waiting is
  just delay. The four most recent non-taper weeks are **447 / 357 / 327 / 535**, mean 417 — against
  which 350–460 called the two poor weeks in-band and the good one over. **400–500 discriminates on
  the actual data**: it flags 357 and 327 as under (both weeks carried a blank benchmark day) and 535
  as over (an outlier), which is what a band is for.
- and the composition is the real story, which no block-level total shows: **238 of those 535 — 44% —
  is tennis, from 6h19 of court time across three sessions (2h20, 2h25, 1h34, at 80/80/78 TRIMP).
  Running contributed 70, from one 52-minute Z2 10km. In a week of a block whose stated purpose is
  aerobic base, he spent six hours playing tennis and fifty-two minutes running.** Tennis by week since
  10 Aug: 91 / 70 / 39 / 26 / 44 / 138 / 116 / 148 / **238**. Running over the same weeks: 174 / 357 /
  227 / 210 / 84 / 262 / 170 / 148 / **70** — the lowest running load of any training week in the record,
  and running is his weakest block against the field at top 27.7%.
- **so the old band was doing active harm, which is why this is not a cosmetic edit.** The governor at
  `src/App.jsx:1740` trims when `projected > target.hi`, down to a floor of 0.6. With tennis at 238 a
  460 ceiling left 222 for everything the plan actually prescribes, so a normal tennis week clamps the
  governor at its floor and cuts **the prescribed running and erg work by 40% to make room for the
  court** — tennis arrives unprescribed and uncuttable, so the trim lands entirely on the sessions that
  address the weakness. That is a defect the deterministic engine cannot see: it holds the band it is
  given and cannot ask whether the band is right.
- why the long run was re-anchored rather than re-homed, and I checked myself against yesterday's
  warning about host-chasing before touching it: **the Friday long run did not happen yesterday — he
  played tennis at 13:30 and did not run.** The day was attended; the session was not. The day is not
  the problem, so the day does not move: Friday has produced 3 runs on 10 Fridays since 1 Aug (21 Aug,
  4 Sep, 25 Sep) and 2 of those were the week's quality or long run, while Saturday has produced **one
  real session in the last five Saturdays**. Moving it to Saturday would be host-chasing onto a worse
  day, which is the mistake the 8 and 9 Oct entries both made.
- **the length is what was wrong, and this is a number nobody had put next to the plan.** The ladder
  asks 75 → 80 → 85 minutes. **His longest run in ten weeks is 1:06 (15 Sep), and nothing above 70
  minutes exists in the record since 21 July.** The eighteen runs since 1 Aug average 51 minutes and
  peak at 66. So 9 Oct asked him for a 75-minute run with a hard 15-minute finish, 9 minutes beyond
  anything he has done in ten weeks — and this file's own rule is that an unreachable number is how a
  session stops happening. 70 → 75 climbs from his real ceiling; 75 → 80 → 85 climbed from nothing.
  The 23 Oct fast finish also comes down from 20min @4:25 to 15min @4:30 for the same reason.
- **the Saturday flex run: I am acting 8 days before yesterday's trigger, deliberately, and this is the
  justification.** That trigger was "blank on 10 Oct and 17 Oct too makes it 0-for-5, decide it Sunday
  18 Oct" — written when the question was whether a droppable extra was worth keeping. **Last night
  changed the question.** With Friday's long run lost to tennis, Saturday is no longer an extra; it is
  the last slot in the week for the one session the block is built on. So it is not removed and it is
  not kept as a session: it becomes `note:true` — the backstop for Friday's run, at the same 70min,
  costing zero projected load and counting as zero prescriptions. That settles the 0-for-4 evidence
  (prescribed 19 Sep, 26 Sep, 3 Oct, 10 Oct, trained zero times) without waiting for a fifth blank day
  to tell me something I already know, and it removes the phantom load yesterday complained about —
  which matters more now, not less, because a 400 floor makes a run that never happens more likely to
  push the governor the wrong way.
- **measurement artifact I am creating, flagged so tomorrow's cold run does not misread it:** if the long
  run lands on the backstop Saturday, `adherence.py` will score Friday as a missed prescription and the
  Saturday run as unprescribed. The run happened; the report will say the plan was missed. Read the
  Friday/Saturday pair as one prescription with a two-day window.
- physiology — **the eight-month-long story reversed, and that is this morning's other real signal.**
  `hrvBaseline` had fallen eight consecutive times, 91 → 88 → 79 → 83 → 75 → 69 → 67 → 66. **It is 72
  today, up 6 in one day**, and the trailing 7-day raw mean is **74.3** (79/94/52/56/93/63/83) against
  68.6 yesterday and 85.3 for 24–30 Sep. So the drift did not merely flatten, it turned — and it turned
  during the largest training week in his record. **That is the single strongest piece of evidence that
  535 is inside what he absorbs and 460 was not his ceiling**, and it is most of why I was willing to
  raise the band on one week's data.
- the one dissenting signal, and the brief asks me to name it: **RHR 47, his first reading above the
  38–46 range since 3 Oct's 62**, on respiration 13.0 (up from 12.0) and **35 minutes of REM on 7h43**
  — the second REM-poor night in three (8 Oct read 40). Against that: HRV is +11, the five-day RHR run
  is 43/44/44/41/47 so 47 is one beat out rather than an excursion, and the 2–3 Oct signature (RHR 54
  then 62, respiration 14–15, **zero** REM twice, under four hours asleep) is absent — he slept 7h43.
  Yesterday's trigger was *baseline still falling with RHR drifting above 46*; **exactly half of it
  fired** — RHR crossed, the baseline went the other way, which is not the shape of accumulating
  fatigue. One morning, no action. **What would make me act: RHR at 47 or above again tomorrow, or two
  more nights under 60 minutes of REM, and the Monday 12 Oct compromised ski is the session that gets
  eased first.**
- what I deliberately did NOT touch:
  - **Week 5, entirely — including today.** He is six days in, HRV is +11, and there is no
    physiological case for rewriting a week in progress. Today's line stays `Optional · Z2 run 40min ·
    flex session`, which is the right session: the week's running load is 70 and an easy hour would
    help it. I did **not** promote it into the long run, because that would add roughly 80 TRIMP to a
    week already 35 over even the new 500 ceiling, and because the inconsistency with 17 and 24 Oct is
    deliberate — in weeks 6 and 7 Saturday backs up a Friday long run, in week 5 that Friday is
    already gone and Saturday is the last running slot there is. Different job, different line.
  - **The phase.** Base I · Aerobic, week 5 of 6, 168 days to Copenhagen. Right, and the problem this
    morning was never that the phase is wrong — it is that the phase's content is not being delivered.
    Smaller sessions would not have helped; a reachable long run and a band that stops cutting it might.
  - **The 14 and 21 Oct KEY RUNs, and the 14 Oct ski.** Untouched, and yesterday's ski-format trigger
    carries forward verbatim: if 14 Oct logs a continuous ten-minute piece rather than reps, the
    Wednesday ask becomes 4×500m off 60s permanently.
  - **RACE / STATION_TARGETS / RACE_BUDGET / RACE_GAINS.** Yesterday produced tennis and nothing else.
    No target moved. Ski erg is still the weakest element (top 29.8%), running still the weakest block
    (27.7%), and the 39-second budget shortfall from yesterday's re-pricing stays visible and
    unallocated until the 14 and 21 Oct KEY RUNs report.
  - **`isTennis` (src/App.jsx:1132).** Still `=== "tennis"` against 60 rows typed `Tennis V2`. **Fifth
    run recording it**, and it matters more today than it did yesterday: tennis is now 44% of his week,
    so every UI path that classifies tennis is wrong about nearly half his load. One-word fix,
    `/^tennis/`, outside this Routine's edit surface.
  - **The two `adherence.py` measurement bugs** from yesterday (roxzone lines counting as prescribed
    runs; roxzone folded into `hyrox`). The roxzone lines are gone from the plan, so the run over-count
    ages out of the window on its own by 22 Oct. Still outside the surface.
- verification: `npm run build` clean, **441.20 kB**, measured against a build of this morning's HEAD
  at **440.01 kB** — **+1.19 kB**, all of it plan text (yesterday's 439.61 is not the right comparison:
  the bot has written a day of data since). **11/11** patch anchors. Round-trip `update.patch()` against a copy of
  the real src/App.jsx: **34/34**, with SCHEDULE, TAPER_PLAN, RACE, STATION_TARGETS, RACE_BUDGET and
  RACE_GAINS all byte-identical through the patch, wellness rows keeping their 4-space indent, and
  daily/sleep/weight/CSV all still patching. Every one of the 50 SCHEDULE days diffed for prescribed
  type, costed duration, `PLAN_INTENSITY` value, info-line status, optional-line status and benchmark
  flag: **exactly 4 changed** (16, 17, 23, 24 Oct), **46 of 50 identical** — so re-anchoring the long
  run moved no other load and invented no prescription. That check earned its keep again: the first
  draft of the 16 Oct line contained the words "against 6h19 of tennis", and **both** halves of that
  phrase were costing traps — `planIntensity` tests `/tennis/i` before anything else and would have
  priced a Z2 long run at tennis HR, and `planDurationMin`'s `(\d+)\s*h\s*(\d{1,2})` reads "6h19" as
  **379 minutes**. Rewritten to "six hours on court", which carries the same number and trips neither.
- the longest line I shipped this morning is **342 characters / 3 sentences** (23 Oct); 16 Oct is 336.
  The longest line anywhere in the 10–25 Oct window is still 12 Oct at **415**, which I did not touch.
  Every line in the window is ≤3 sentences.
- **on the no-change count: zero consecutive NO CHANGE runs precede this entry — the last twenty
  entries all say CHANGED.** The brief's warning is about passivity, and that is not this Routine's
  current failure mode; yesterday's addendum named the live one, host-chasing, and said two consecutive
  runs had spent their budget on it. So I held the two edits I made to a test: both answer a question
  the brief asks outright (is the band realistic against what he absorbs; do the next weeks need
  different sessions rather than smaller ones), both are grounded in a number nobody had computed
  before this morning (535 against 460; a 1:06 ceiling under a 75-minute ask), and both land on future
  weeks only. The third thing I found — that his running load has collapsed to 70 TRIMP while tennis
  reached 238 — I have deliberately **not** acted on beyond these two edits, because the lever for it
  is whether 14 Oct's KEY RUN happens, and that is four days away.
- watching:
  - **the new 400–500 band, against week 6.** It will be the first week judged by it. **What would make
    me act: if 12–18 Oct closes above 500 with running again under 150, the band is not the binding
    constraint and the plan has to stop competing with tennis for the same budget — at which point the
    honest fix is to price tennis into the week explicitly rather than let it arrive as a surprise.
    Decide it Monday 19 Oct.**
  - **the re-anchored long run, 16 Oct.** 70 minutes is inside everything he has done. **What would
    make me act: if 16 Oct AND its 17 Oct backstop are both blank, the problem is not the day and not
    the length, and the long run comes out of Friday and goes onto Monday ahead of the gym trip, which
    is 1-for-1. Decide it Sunday 18 Oct.**
  - **RHR 47 and 35 minutes of REM**, per the trigger stated above. Tomorrow morning.
  - **swim 1x/0** ages out 13 Oct, never prescribed forward, no action.

---

## 2026-10-09 · addendum, after Simas read the morning’s push
- context: he pushed back on two things, and both land. **(1) The dashboard
  comments are too long and read as a trail of thought rather than an action.
  Three sentences at most, what changed and why.** (2) The roxzone circuit I
  re-homed this morning is not trainable at all, and the ski gap I have been
  calling free time is mostly a timing artifact.
- decision: CHANGED — **the roxzone circuit is out of the plan for good**, the
  ski and roxzone lines of the race budget are re-priced, every plan line from
  12 Oct onward is cut to three sentences, and the Base I note goes from a
  2,400-character wall to five lines. The three-sentence rule and both of his
  corrections are now in this file’s header, where every future cold run reads
  them before it writes anything.
- why roxzone is gone, in his words: race roxzone time is **distance between
  stations, a sip of water, and heavy legs off the run**. His gym has everything
  close together, so there is nothing to rehearse — a gym transition circuit
  measures a different thing and would have taught him nothing. **Compromised
  running is the roxzone training**, and Monday already carries it. This is the
  better resolution of the thing I flagged this morning: I had the right
  diagnosis (prescribed three times, trained zero times) and the wrong fix. The
  brief offers three options for a session he will not do — move it, change it,
  or take it out — and I reached for the first when the answer was the third.
  **Worth noting against my own 8 Oct and 9 Oct entries: two consecutive runs
  spent their change budget re-homing a session that should never have been in
  the plan.** Host-chasing is a failure mode of this Routine.
- why the ski gap was never free, and the arithmetic agrees with him: the
  station clock runs **arc to arc**, so ~10s in and ~10s out of the ski split is
  reaching the machine and leaving it. **4:18 raced minus ~20s is 3:58 of actual
  skiing — which sits between his 3:57 off a 93-minute match and his 4:02 off
  running legs.** His race skiing is already inside his own tested range, so the
  "24 seconds already yours" that four SCHEDULE lines and a RACE_GAINS row have
  been asserting is mostly geometry. **He is right that this does not mean stop
  training ski:** every competitor crosses the same arcs, so top 29.8% is a real
  weakness. What changes is the lever — genuine erg speed, not execution.
- the re-pricing, with the numbers: **roxzone 92s → 47s** (target 5:47 → 5:00
  rather than 4:15; Riga was **5:18 with zero roxzone training**, so ~30s is
  available on execution alone and 0:32 a transition was priced on a session
  that will not happen). **Ski 20s → 10s** (target 4:18 → 4:08, because 20s off
  the clock now means 20s of real erg speed from a 3:54 fresh ceiling, not 20s
  of tidier execution). Total predicted gain **287s → 232s**, so the budget sums
  to **1:05:39 against the 1:05:00 goal — 39 seconds short, and I have left that
  shortfall visible in the RACE_BUDGET comment rather than papering over it.**
  I did **not** touch `RACE.target`: the brief lets me edit RACE only when a race
  is added or its result is known, and moving his goal is his call, not mine.
  The honest reading is that the 39s has to come from running, which is his worst
  block against the field (top 27.7%) and therefore where it most likely is.
- the 1:59 ski ask **stays at 1:59**. Only its justification was wrong — it was
  labelled "the Copenhagen target split", which under the arc correction it is
  not. As a training stimulus it is still right: just under his 4:02 compromised,
  repeated six times, which is exactly the erg speed the corrected plan needs.
  Number kept, label removed.
- verification: `npm run build` clean, **439.61 kB from 452.89** — **13.3 kB of
  prose deleted**, which is the clearest measure of the problem he was pointing
  at. **11/11** patch anchors, SCHEDULE **50 days**, TAPER_PLAN **18 blocks**.
  Round-trip `update.patch()` against a copy of the real src/App.jsx: **22/22**,
  SCHEDULE and TAPER_PLAN byte-identical through the patch. Every one of the 50
  days diffed for prescribed type, costed `PLAN_INTENSITY` and benchmark flag:
  **exactly 2 changed** (15 and 22 Oct losing the circuit), **48 of 50 identical**
  — so cutting the prose moved no load and invented no prescription. That check
  again earned its keep: shortening the lines had silently dropped the word
  `compromised` off 12, 14 and 21 Oct (re-costing Monday’s 159-bpm session at
  **126**) and turned `4:10/km` into a phantom `run` prescription on 12 and
  19 Oct. All six fixed before commit.
- longest upcoming line is now **374 characters / 3 sentences** (12 Oct), against
  **2,700** yesterday (14 Oct). Every line from 10 Oct to 25 Oct is ≤3 sentences.
- watching:
  - **whether three sentences is enough to carry a reason.** If a future line
    reads as a bare instruction he cannot audit, the fix is a better sentence,
    not a fourth one. **What would make me act: he says a line is too terse to
    act on.**
  - **the 39-second budget shortfall.** It stays visible and unallocated until
    either the running block delivers against 4:06/km or he says to move the
    1:05:00 goal. **Decide it after the 14 and 21 Oct KEY RUNs — those two
    sessions are the first evidence either way.**
  - the 14 Oct ski format trigger from this morning’s entry stands unchanged.

---

## 2026-10-09
- adherence: no ACTION REQUIRED and no WATCH — and the thing that needed acting on this
  morning is invisible to both flags. ski **5/3** (up from 5/2: he skied yesterday, unprompted)
  · hyrox 4/2 · strength **5/5 on track** · run 10/6 · row 1/1 · swim 1x/0 · cycle 2/6 · tennis 6/8.
  Benchmarks already due: 28 Sep and 2 Oct **NOTHING LOGGED** (dead structure, aged out),
  30 Sep logged, 6 Oct **TRAINED EASY INSTEAD**, and 8 Oct **TRAINED OTHER TYPE** — the
  roxzone circuit, against a log of inline skating, cycling, upper strength and a 10min ski.
  Next 14d after my edits: Wed 14 Oct, Thu 15 Oct, Wed 21 Oct (newly ⏱), Thu 22 Oct. Nothing
  in the fortnight sits on a day he does not train.
- readiness: HRV **63 vs baseline 66** (delta **−3**), RHR **41**, respiration 12.0, SpO₂ 94,
  **8h16 asleep** — 141 deep, **104 REM** (back from 40), 4 awake, sleep score 88.
  `hrvBaseline` 67 → **66**. LAST_DATA **2026-10-09T06:08Z**, minutes old, sync healthy
  (127 daily rows, 126 sleep rows, contiguous). `easeHard` does not fire.
- decision: CHANGED — **the roxzone circuit stops naming the session it hangs off.** Its
  host on 15 and 22 Oct goes from *the end of this morning’s Z2 run* to *the end of today’s
  session, whatever today’s session turns out to be*, with instructions for both venues he
  might be standing in; the word **morning** comes off the Thursday Z2 run on both days; the
  12 Oct compromised session is told to clock its own changeovers; the 14 Oct ski gets a
  **10-minute floor**; and 21 Oct’s KEY RUN gets the ⏱ it should always have had. One clause
  added to the Base I note as block policy. **Week 5 is not touched at all** — every edit
  lands on 12, 14, 15, 21 or 22 Oct.
- why: **the roxzone circuit has now had three hosts and been trained zero times, and each
  time the day was right and the named host did not happen.** It sat inside the Wednesday
  circle (which has not run since 25 Sep), then as a trip of its own (0-for-4), then from
  4 Oct bolted to a Thursday **morning Z2 run**. Yesterday was the first unconditional
  prescription and it failed in a new and more informative way: **he trained four times —
  a gym trip at 14:22, 10min of ski erg for 2380m, 46min of upper strength, 10km of inline
  skating — and never ran at all.** That is not a refusal and not a readiness problem; HRV
  was +26 that morning. The host simply does not exist: his Thursday sessions since 3 Aug
  started **13:43, 09:02, 15:53, 20:54, 13:05** and now a 14:22 gym trip — **one of six
  before 10:00.** Across all 27 runs since 3 Aug only five started before 10:00. So the
  7 Oct finding (quality runs go in the late morning) was right about the *evening* and
  quietly wrong about the *morning*: what he reliably does is **train on Thursday**, not
  **run on Thursday morning**. Thursday stays — 8 of 9 attended, and his three best
  unprompted structured sessions were Thursdays (8×600 on 13 Aug, 16×400 on 27 Aug,
  8×1km at 4:01 on 1 Oct) — and the host goes.
- **this is a correction to my own 4 Oct rule, not a reversal of it.** That rule said a timed
  benchmark must hang off a session he already attends, and it was right about trips: 0-for-4
  standalone against 1-for-1 bolted. It was wrong about *naming which session*. The attended
  thing is the **day**; the activity inside it is his choice and it varies. So the generalised
  rule now written into the Base I note is **a benchmark may not name the session it hangs
  off** — it names a day, a length, and how to do it in either venue.
- roxzone is worth this much attention because it is **the cheapest time on the board**:
  top 19.8% against stations at top 9.6%, 92 of the 287 seconds Copenhagen needs, +29s
  *worse* than Riga, 1:25 over its Athens plan — and pure execution rather than fitness.
  It is also the only one of the skill’s four priorities that has never once been measured.
- **so I also took the measurement that costs nothing, and it was already in the file.**
  5 Oct’s compromised session recorded **27:01** while its six splits sum to **24:53**
  (12:45 of ski — 4:02/4:19/4:24 — and 12:08 of running — 4:08/4:00/4:00). **2:08 went
  on five changeovers, about 0:26 each**, against an Athens average of 0:43. Nobody had
  subtracted those two numbers. 12 Oct now asks him to keep the watch running through the
  changeovers and write the five times into the description, so that even if Thursday fails
  a third time the block still gets a transition number — on the one session this block has
  delivered 1-for-1. Caveat recorded honestly in the line itself: some of that 2:08 may be
  lead-in rather than changeover.
- the 14 Oct ski gets a floor, and yesterday’s theory gets its first confirmation.
  **He skied at the gym yesterday without being asked, so ski-at-the-gym is 2-for-2
  (30 Sep, 8 Oct) and ski moved 5/2 → 5/3.** Yesterday’s trigger was *if 14 Oct logs no ski
  despite the gym trip happening, the host theory is wrong* — the host theory is looking
  right and the live question has moved to **format**. His own erg habit is **ten minutes**:
  30 Sep 10min then a 3:57 single, 7 Oct ten minutes on the rower for 2400m, 8 Oct ten
  minutes of ski for 2380m. The 14 Oct ask is 6×500m off 90s — roughly 20 minutes, double
  his habit. Rather than thrash a line written yesterday and not yet tried, I gave it a floor
  he has proven he takes: **4×500m @ 1:59 off 60s counts in full.** This file’s own rule is
  that an unreachable number is how a session stops happening; a floor is cheaper than a
  rewrite.
- **the best single number in yesterday’s data, and it argues the skill’s case for it:**
  2380m of ski in 10:18 is **4:20 per 1000m, at an average HR of 137.** That is his Athens
  race split (4:18) at a heart rate 20–30 beats below race effort. The 24 seconds the skill
  says are sitting there look, on this evidence, conservative.
- physiology — **nothing is wrong and yesterday’s one flag resolved overnight.** HRV 63
  against 66 is −3, inside the band where the answer is *train, keep intensity honest*;
  `adaptPlan`’s gate needs −10. RHR **41, well inside 38–46**, and the five-day run is
  43/44/44/41. **REM came back: 40 → 104 minutes**, with 141 of deep on 8h16 and a sleep
  score of 88, so the two signals that disagreed yesterday now agree. The 2–3 Oct excursion
  signature (RHR 54 then 62, zero REM twice) remains absent.
- **the baseline is still the one real physiological story.** 91 → 88 → 79 → 83 → 75 → 69
  → 67 → **66**, eight consecutive falls. Trailing 7-day raw mean is **68.6** (43/79/94/52/
  56/93/63), against 69.7 yesterday and **85.3 for 24–30 Sep** — so the drift is real and
  roughly 17 ms over two weeks, but it has flattened in the last two days rather than
  accelerating. Yesterday’s trigger — *still falling with RHR drifting above 46* — did
  **not** fire: RHR is 41, his lowest in five days. It carries forward to 10 Oct unchanged.
  46 is still the line, and a week of 60s with RHR in range is a base block being absorbed,
  not a hole being dug.
- what I deliberately did NOT touch:
  - **Week 5, entirely.** He is five days into it and HRV is −3, not −15. There is no
    physiological case for rewriting a week in progress and the brief forbids a preference
    one. Today’s line (tennis 13:30, long run 75min with the last 15min at 4:30) stands as
    written; Friday long runs have landed 4 Sep, 21 Aug and 25 Sep.
  - **TAPER_PLAN bands.** Base I 350–460 stands. The ceiling question — whether 460 is
    below what he absorbs in a tennis-heavy week — **resolves Sunday 11 Oct and yesterday
    said decide it on Monday, on what closed rather than on a projection.** I am honouring
    that; moving a band on a partial week is exactly the error that rule exists to prevent.
  - **The phase.** Base I · Aerobic, week 5 of 6, 169 days to Copenhagen. Right.
  - **STATION_TARGETS / RACE_BUDGET / RACE_GAINS.** Yesterday produced a 10min easy ski, 46min
    of upper strength and 42min of inline skating. Nothing there moves a target. Ski erg is
    still the weakest element (top 29.8%, 3:58 target against 4:18 raced), running still the
    weakest block (27.7%), roxzone still the cheapest 92 seconds and still unmeasured.
  - **`isTennis` (src/App.jsx:1132).** Still `=== "tennis"` against 60 rows typed `Tennis V2`.
    **Fourth run recording it.** One-word fix, `/^tennis/`, outside the edit surface this
    Routine is given.
  - **Two measurement-integrity bugs in `adherence.py`, also outside the surface.** (1) The
    roxzone line contains `jog 100m`, so every roxzone prescription is ALSO counted as a
    prescribed `run` — three of the ten in the window — which is part of why run reads
    10/6. (2) Roxzone is folded into `hyrox`, which has 2 done, so a session prescribed three
    times and trained zero times can never raise ACTION REQUIRED. **The flags did not catch
    this morning’s finding; the benchmark list did.** Worth a separate fix when someone has
    the surface for it.
- watching:
  - **the roxzone circuit, now host-free. What would make me act: if 15 Oct logs no roxzone
    despite him training that day, the problem is the CONTENT, not the host** — at which
    point the 8-station circuit is abandoned and the measurement becomes the 12 Oct
    changeover clock permanently, which needs no extra minutes and no extra willingness.
    **Decide it Friday 16 Oct.** If 15 Oct DOES log one, the next question is whether eight
    transitions average under 0:43.
  - **the Saturday flex run, 0-for-3 (19 Sep, 26 Sep, 3 Oct).** It is written `Optional ·
    Z2 run 40min · flex session`, so it is deliberately droppable and I am not converting a
    genuine option into a `note:true` reminder on three data points. But it is costing the
    week load it never delivers and it accounts for three of the four missing runs.
    **What would make me act: blank on 10 Oct and 17 Oct too makes it 0-for-5, at which point
    it either becomes a real session on a day he trains or it leaves the plan. Decide it
    Sunday 18 Oct.**
  - **the 14 Oct ski format.** Host confirmed 2-for-2; the open question is whether 6×500m
    off 90s happens at all against a ten-minute habit. **What would make me act: if 14 Oct
    logs a continuous ten-minute piece rather than reps, the Wednesday ask becomes the
    10-minute version permanently** (4×500m off 60s) rather than being asked for twenty
    minutes a second time.
  - **swim 1x/0** ages out 13 Oct, never prescribed forward, no action.
  - **the baseline**, as above: 46 on RHR is the line, and a second week of sub-70 raw HRV
    with RHR in range would make me look at the Friday long run before anything else.
- consecutive NO CHANGE runs preceding this one: **zero.** The last NO CHANGE entry is 25 Sep.
- verification: `npm run build` clean (**452.89 kB**, from 447.04 — plan text only; 6
  insertions / 6 deletions in src/App.jsx, every hunk at line 1346 or below, nothing inside
  any machine-written constant). **11/11** patch anchors. SCHEDULE still parses as **50 days**,
  TAPER_PLAN as **18 blocks**, daily and sleep rows with wrong indent **0**.
  Round-trip `update.patch()` against a copy of the real src/App.jsx: **22/22 pass** — TODAY
  advanced, wellness and sleep rows written and read back field-for-field, weight upserted,
  CSV row upserted, every daily and sleep row keeping its 4-space indent, no row lost
  (127→128 daily, 126→127 sleep), dates unique and sorted, `body`/`nutrition`/`HYROX_DATA`
  untouched, and **SCHEDULE and TAPER_PLAN byte-identical through the patch.**
  Separately diffed every one of the 50 SCHEDULE days before and after for prescribed type,
  costed `PLAN_INTENSITY` and session count: **exactly one day changed** (21 Oct gains its
  benchmark flag at an unchanged 168). That check caught five keyword collisions my own prose
  had introduced — a stray `TT` that had silently re-costed the 14 Oct ski from 162 to 168,
  and the words `ski erg`, `row`, `lunges` and `roxzone` inventing phantom prescriptions on
  12, 14 and 15 Oct. All five reworded before commit.

---

## 2026-10-08
- adherence: no ACTION REQUIRED and no WATCH. ski **5/2** · hyrox 4/2 · strength 5/4 ·
  run 10/7 · row 1/1 (now on track — last night's erg) · swim 1x/0 · cycle 2/6 · tennis 6/8.
  Benchmarks already due: 28 Sep and 2 Oct **NOTHING LOGGED** (dead structure, already
  addressed), 30 Sep logged, 6 Oct **TRAINED EASY INSTEAD** (Running Z2 10km against a
  prescribed threshold 5×1km), 8 Oct nothing yet — it is 06:08 and that is today's session.
  Next 14d: Wed 14 Oct, Thu 15 Oct, Thu 22 Oct. **Nothing in the fortnight sits on a day he
  does not train**, so no benchmark is pre-deferred.
- readiness: HRV **93 vs baseline 67** (delta **+26**), RHR **44**, respiration 11.0, SpO₂ 97,
  **8h31 asleep** — but only 73 min deep and **40 min REM**, with 398 of light.
  `hrvBaseline` 69 → **67**. LAST_DATA **2026-10-08T06:08Z**, minutes old, sync healthy
  (126 daily rows, 125 sleep rows, contiguous).
- decision: CHANGED — **the ski erg stops hanging off the evening class and moves onto the
  Wednesday gym trip, as a prescribed session, in weeks 6 and 7.** The class line on 14 and
  21 Oct becomes `note:true`. Also one factual correction to today's roxzone line, whose
  readiness clause had gone stale overnight, and the host rule written into the Base I note
  and the week-2 block comment as block policy. **Week 5 is not touched** — every edit lands
  on 14 Oct, 21 Oct, or is a correction to text on today's line that changes no duration, no
  intensity and no day.
- why: **he made the gym trip last night and the plan had nothing for him to do on the erg.**
  7 Oct the class did not run — its third Wednesday prescription in succession that it did
  not, and there has been **no class on any day since 25 Sep**. He went anyway: in at 18:49,
  erg at 19:07, lifting at 19:19. That is the same shape as 30 Sep (erg at 18:33, lifting at
  18:57), both after a daytime match. **So the Wednesday-evening gym trip is 2-for-2 and the
  class is 0-for-3.** The trip was always the host; the class never was. And because the only
  ski instruction anywhere in the plan was a `note:true` line conditional on that class, on a
  night he had an erg under his hands **the plan said nothing, and he rowed — 10min, 2400m.**
  Row is top 11.4% and the skill is explicit that it is a strength to defend, not to train;
  ski is **top 29.8%, his weakest element anywhere in the race**, with 3:54 fresh in July
  against 4:18 raced in Athens — **24 seconds already proven his.** Right instinct, wrong
  lane, and that is a missing line rather than a bad call.
- **this reverses the 28 Sep decision, deliberately.** That run put ski back on the Wednesday
  class on the premise that the class was *the most reliably attended thing in his week*
  (hyrox 8/2 at 45 days, 10/2 at 90). The premise was about the class existing, not about it
  landing on a Wednesday, and it has decayed: 23 Sep, 30 Sep and 7 Oct all prescribed, none
  ran, and nothing has run anywhere in thirteen days. Ten days of evidence against one
  inference is the trade this file exists to make.
- the content: **6×500m @ 1:59 off 90s**, which is the Copenhagen target split of 3:58 per
  1000m asked six times in succession. It deliberately does not duplicate Monday. Monday is
  the **fade** across 1000m reps off running legs (5 Oct: 4:02 / 4:19 / 4:24). Wednesday is
  whether the target split **repeats at all** in short reps — rep 6 against rep 1. Nothing
  tests his ceiling, which he has cleared three times (3:54 fresh, 3:57 off a 93-min match,
  4:02 off running legs). And it lands in the evening of the day whose late morning holds the
  KEY RUN, which makes it **compromised ski by construction** — the only kind the skill says
  is worth training for him, and 30 Sep is the proof that tired legs cost his ski almost
  nothing. **Ski goes from 2 forward prescriptions in 18 days to 4 in 14 (12, 14, 19, 21 Oct),
  all four bolted to trips he makes unprompted.** Verified against `adherence.py`'s own
  parser, which now tags 14 and 21 Oct `ski` and correctly tags neither as `row` — the
  `over row` clause is stripped by its REJECTED rule, as designed.
- why the class becomes a note and not a deletion: the line literally reads *whichever evening
  it runs*. That is a reminder, not a session, and the rule is explicit that such a line needs
  `note:true` or the engine charges it as load and `adherence.py` counts it as prescribed —
  which is exactly what has been happening, three Wednesdays out of three. **This is the same
  treatment tennis already gets, for the same reason: other people decide whether it happens.**
  He goes when it runs and the sync absorbs it as unplanned load. Net effect on 14 Oct's
  projection is **downward** — a ~60min hyrox cost at 156 bpm comes off, a 20min erg at 162
  goes on — so this adds a priority exposure while reducing projected load, in a week whose
  governor is already pinned.
- physiology — **the week's question got its answer, and the answer is recovered.** 6 Oct said
  *expect it low again tomorrow; judge the week on Thursday, not today.* This is Thursday.
  HRV **93 against 67 is +26**, the largest positive delta in seven days and the first
  double-digit positive since 5 Oct (+11); the run was −20, −45, 0, +11, −23, −13, **+26**.
  RHR **44, inside his 38–46 range**, and the 2–3 Oct excursion signature (RHR 54 then 62,
  zero REM two nights running) is absent. So the suppression on 6–7 Oct was Monday's bill
  arriving on schedule, not the excursion returning. `easeHard` does **not** fire today, which
  matters because the first roxzone baseline he has ever taken is today's session and
  yesterday's run had to write a clause to protect its timing from that gate — the clause is
  now moot, and I corrected the line rather than leave it asserting an HRV of 56 against 69 on
  the morning he reads it.
- **one thing I do not like and am only flagging: 40 minutes of REM.** Second consecutive low
  night (64, then 40) and the lowest in the 21-day window, on 8h31 in bed with 398 of light —
  so the sleep architecture does not explain the HRV rebound and the two signals disagree.
  RHR says nothing is wrong (44, and 40/40/43/44/44 across five days). The trailing 7-day raw
  HRV mean is **69.7**, against 73.3 yesterday and 85.3 for 24–30 Sep, so the raw signal is
  still drifting down underneath a good single reading. Not actionable on one night against
  one good morning; it is the thing I would read first tomorrow.
- what I deliberately did NOT touch:
  - **Week 5, structurally.** He is four days into it. The only week-5 edit is a correction of
    stale numbers on today's line — same duration, same intensity, same day, and it still says
    keep all eight transitions and keep the clock. HRV is **above** baseline, so there is no
    physiological case for rewriting a week in progress and the brief forbids a preference one.
  - **Mon 12 Oct's erg, and yesterday's trigger on it.** The trigger was: if 12 Oct logs no
    ski, the erg leaves the gym trip for a running session. It stands verbatim. What changed is
    that it is **no longer the whole of the ski plan** — 14 Oct now carries one too, so a blank
    Monday no longer means a blank week.
  - **TAPER_PLAN bands.** Base I 350–460 stands, and the 4 Oct trigger to drop the floor is now
    **dead**: week 5 is at **388 after three days** and cleared the 350 floor on Wednesday, so
    it cannot fire Sunday. See watching for the ceiling, which is the live question now.
  - **The phase.** Base I · Aerobic is right — 170 days to Copenhagen, week 4 of a six-week
    base block. What moved is where one session sits, not what the block is doing.
  - **STATION_TARGETS / RACE_BUDGET / RACE_GAINS.** Nothing has been trained since yesterday
    that could move a target: a 2h25 match, a 10min erg, 48min of lifting. Ski erg still the
    weakest element (top 29.8%, target 3:58 from 4:18), running still the weakest block
    (27.7%), roxzone still the cheapest 92 seconds — and still unmeasured until this morning.
  - **`isTennis` (src/App.jsx:1123).** Still `=== "tennis"` against 60 rows typed `Tennis V2`,
    still costing a planned tennis session 100.9 TRIMP against a real median of 39.0, still
    marking every tennis day missed. Third run in a row recording it. It sits outside the edit
    surface this Routine is given, so I have not touched it. **One-word fix: `/^tennis/`.**
- watching:
  - **the Base I CEILING, not the floor — this is the new one.** Delivered weeks run 447 /
    357 / 327 / **388 after three days of week 5**, which is his fastest start in the window
    and already above the 350 floor with Thu, Fri, Sat and Sun unwritten. Two of those three
    days were tennis doubles (2h20 and 2h25) that the plan never asked for, which is the
    design working — but if week 5 closes **above 460** then the ceiling is set below what he
    absorbs in an ordinary tennis-heavy week, and the governor has spent the week trimming
    real sessions against a ceiling that is too low rather than an estimator that is too high.
    **Resolves Sunday 11 Oct; decide it on Monday's run.** I will not move a band on a partial
    week, and I will not move it on the projection — only on what closed.
  - **ski 5/2, and whether the new Wednesday slot is taken.** Three of the five prescriptions
    are dead structure ageing out 14–19 Oct; on live structure he is 2-for-2 (30 Sep 3:57,
    5 Oct 4:02/4:19/4:24). **What would make me act: if 14 Oct logs no ski despite the gym
    trip happening, then the host theory is wrong and not just the venue** — at which point
    the erg goes inside a running session as a pre-run piece, which is the 12 Oct trigger
    applied to both days rather than one. If 14 Oct *does* log ski, the next question is
    whether 1:59 held to rep 6, because 21 Oct is written not to progress until it has.
  - **row 1/1 and swim 1x/0.** Row is satisfied and stays out of the forward plan on purpose:
    top 11.4% is a strength to defend under fatigue, not a block to spend. Swim ages out
    13 Oct, never prescribed forward, no action.
  - **the baseline.** 91 → 88 → 79 → 83 → 75 → 69 → **67**, still falling, but today's raw 93
    is the second-highest reading in seven days and RHR is in range. Yesterday's trigger
    — *still falling on 9 Oct with RHR drifting above 46* — **did not fire**: RHR is 44.
    It carries forward unchanged to 10 Oct. 46 is still the line.
  - **protein 83g on 7 Oct**, his lowest in the 21-day window and less than half the 181g the
    day before, on a night he lifted for 48 minutes. One day is noise and his week is otherwise
    123–200g; worth a word only because weight has gone 76.2 → 76.8 and body fat 15.1 → 15.3
    over four days. No action, no plan change.
- consecutive NO CHANGE runs preceding this one: **zero.** The last NO CHANGE entry is 25 Sep.
- verification: `npm run build` clean (**447.04 kB**, from 441.27 — plan text only; 13
  insertions / 6 deletions in src/App.jsx, every hunk at line 1337 or below, nothing within
  1000 lines of the machine-written constants). **11/11** patch anchors. SCHEDULE still parses
  as **50 days**, TAPER_PLAN as **18 blocks**, daily rows with wrong indent **0**.
  Round-trip `update.patch()` against a copy of the real src/App.jsx: **18/18 pass** — TODAY
  advanced, wellness and sleep rows written, weight upserted, CSV row upserted, all daily and
  sleep rows keep their 4-space indent, no row lost (126→127 daily, 125→126 sleep), dates
  unique and sorted, and **SCHEDULE and TAPER_PLAN byte-identical through the patch.**

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

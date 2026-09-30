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

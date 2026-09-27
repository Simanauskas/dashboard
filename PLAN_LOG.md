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

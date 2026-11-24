---
name: mfp-log-meal
description: Log Simas Simanauskas's meals into his MyFitnessPal food diary from a typed description ("Lunch: 200g chicken breast, 150g rice, 1 tbsp olive oil", "had 2 eggs and toast for breakfast", "add a banana to snacks"), via the mfp-log.yml GitHub Actions workflow and mfp_log.py in Simanauskas/dashboard. Use whenever he asks to add, log or track food/meals/calories/macros in MyFitnessPal or MFP, to show what's in today's MFP diary, or to remove/fix an entry he (or you) logged. Not for nutrition goals/targets (mfp_goals.py, simas-fit-update) or coaching (simas-hyrox).
---

# Log meals into MyFitnessPal

He types what he ate; you write it to his MFP diary **in one workflow run**
and report. Speed matters — he waits in chat. Target: under a minute from his
message to the reply. Built 24 Nov 2026; reworked the same day after a
2-item meal took 4 minutes (three runs + long fixed waits).

## How it works

The MFP token only exists inside GitHub Actions (MFP_TOKEN, minted hourly by
the auth.simas.fit Worker — see mfp.py), so every call runs there:

- Repo `Simanauskas/dashboard`, workflow **`mfp-log.yml`** (ref `main`),
  script `mfp_log.py`. A run takes ~12 s end to end (~3 s of script).
- Inputs: `action` (`apply | dry-run | find | show | undo | probe`), `spec`
  (meal JSON), `query` (find: `"chicken breast; rice"`, undo: `"id1,id2"`),
  `date` (YYYY-MM-DD, blank = today in Vilnius).
- No GitHub tool in the session → say so and give him the inputs to paste
  into Actions → MFP log meal → Run workflow.

## The fast path (default — one run)

1. Build the spec straight from his message, using `q` with the food's
   distinguishing words (`"quinoa cooked"`, `"tuna canned water"`,
   `"chicken breast"`). `q` auto-picks: the food he has logged most in the
   last 45 days whose name contains all the words, else the first verified
   MFP search hit. His repeat foods resolve to exactly what he used before.
2. Dispatch **`action: apply`** directly — no find, no dry run.
   `actions_run_trigger` (`method: run_workflow`, ref `main`).
3. Wait **15 s** (Bash `until` loop on the clock; plain `sleep` is blocked),
   then `actions_list` → `list_workflow_runs` (resource_id `mfp-log.yml`,
   perPage 1) — if not `completed`, wait 5 s and re-check — then
   `list_workflow_jobs` → `get_job_logs` (`return_content: true`,
   `tail_lines: 20`). Make the three calls back to back, no commentary between.
4. Check the printed lines (`meal amount → food [history|search id=…]
   servings × serving = kcal · P C F`) and the final
   `✓ N entries written and read back (… kcal; DATE now … kcal) · ids: …`.
   Sanity-check each kcal (200 g chicken breast ≈ 300–330; 1 tbsp oil ≈ 120;
   250 g cooked quinoa ≈ 300). If a pick is wrong (wrong food, raw vs
   cooked, absurd kcal), `undo` that id and `apply` a corrected item with an
   `id` from `find` — a fix costs one or two more runs, rarer than paying a
   find + dry-run on every meal.
5. Report a short table: food | amount | kcal | P/C/F, meal total, day total.

## When to use find / dry-run instead

Only when a food is genuinely new and ambiguous (a branded/local product he
hasn't logged, "a sandwich from Caffeine"), or he asks to see options first.
Then: `find` (one run, all queries at once: `"a; b; c"`) → pick ids → `apply`.
Skip the dry run unless he asked for a preview. In `find` output prefer
`[history]` foods, then ✓verified search results with sane macros; avoid
`⚠old copy` (stale version, MFP may reject it).

## The spec

```json
{"date": "2026-11-24", "meal": "Lunch", "items": [
  {"id": "164248067900917", "amount": 200, "unit": "g"},
  {"id": "235164391106421", "amount": 150, "unit": "g"},
  {"q": "olive oil", "amount": 1, "unit": "tbsp"},
  {"q": "banana", "amount": 1},
  {"id": "…", "amount": 2, "serving": 3, "meal": "Snacks"}
]}
```

- `q` (auto-pick, see the fast path) or `id` (from find, or a previous run's
  `[history id=…]` line). Ids he has used: cooked quinoa 63657357528429,
  canned tuna in water 194215936902901 (1 can = serving 0, "1 can (6.5 oz), drained").
- `amount` + `unit`: g, kg, oz, lb, ml, l, tbsp, tsp, cup, or a count unit
  matched against the food's serving names (`egg`, `slice`, `large`, `scoop`).
  No unit / `serving` = that many of the food's first serving size.
  Conversions use MFP's gram_weight per serving, so 150 g of a food listed
  only in cups works.
- `serving`: index (from find) to force a serving size; `amount` is then the
  number of those servings.
- `meal`: Breakfast | Lunch | Dinner | Snacks (top level, per item override).
  If he doesn't say, infer from his words, else from the Vilnius time:
  before 11:00 Breakfast, 11–16 Lunch, 16–21 Dinner, otherwise Snacks.
- `date` blank = today (Vilnius). "Yesterday" → pass the date.
- Several meals at once → one spec, per-item `meal`.

## Other actions

- `show` (+ `date`): the day's entries with meal, amount, kcal and entry id.
- `undo`, `query: "uuid1,uuid2"`: deletes those entries (DELETE /v2/diary/id,
  ✓ on 204). Use `show` first to get ids. To *change* an entry, undo it and
  apply the corrected one.
- `probe`: read-only API shape check; use if writes start failing oddly.

## API notes (private MFP API, observed Nov 2026)

- Search: `GET api.myfitnesspal.com/v2/search/nutrition?q=…` (items carry
  serving_sizes + nutritional_contents). Food by id: `GET /v2/foods?ids=…`.
- Write: `POST /v2/diary` `{"items":[{"type":"food_entry","date","meal_name",
  "servings","food":{"id","version"},"serving_size":{"value","unit",
  "nutrition_multiplier"}}]}` → 200/201 with the new entry id. The food
  version must be current, hence the fresh `/v2/foods` lookup each time.
- Entry nutrition = food nutritional_contents × serving nutrition_multiplier ×
  servings.
- The dashboard picks new entries up on its next MFP poll (≤10 min).
- The repo is public: the workflow log shows food names (he OK'd that,
  24 Nov 2026). Nothing is committed.
- 401/403 → token problem: the Worker's hourly MFP refresh (simas-fit-update).

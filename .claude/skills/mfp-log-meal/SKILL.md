---
name: mfp-log-meal
description: Log Simas Simanauskas's meals into his MyFitnessPal food diary from a typed description ("Lunch: 200g chicken breast, 150g rice, 1 tbsp olive oil", "had 2 eggs and toast for breakfast", "add a banana to snacks"), via the mfp-log.yml GitHub Actions workflow and mfp_log.py in Simanauskas/dashboard. Use whenever he asks to add, log or track food/meals/calories/macros in MyFitnessPal or MFP, to show what's in today's MFP diary, or to remove/fix an entry he (or you) logged. Not for nutrition goals/targets (mfp_goals.py, simas-fit-update) or coaching (simas-hyrox).
---

# Log meals into MyFitnessPal

He types what he ate; you resolve each food to an MFP food, dry-run it, write
it, and confirm it read back. Just do it — no need to ask first unless a food
or amount is genuinely ambiguous. Built 24 Nov 2026.

## How it works

The MFP token (MFP_TOKEN, minted hourly by the auth.simas.fit Worker — see
mfp.py) only exists inside GitHub Actions, so every call runs there:

- Repo `Simanauskas/dashboard`, workflow **`mfp-log.yml`** (ref `main`),
  script `mfp_log.py`. Dispatch with the GitHub MCP `actions_run_trigger`
  (`method: run_workflow`), then `actions_list` → `list_workflow_runs`
  (resource_id `mfp-log.yml`, perPage 1) → `list_workflow_jobs` →
  `get_job_logs` (`return_content: true`, `tail_lines` ~80). A run takes
  ~20–30 s (it reads 45 days of diary history); wait ~45 s before looking
  (a Bash `until` loop on the clock — plain `sleep` is blocked).
- Inputs: `action` (`find | dry-run | apply | show | undo | probe`), `spec`
  (meal JSON), `query` (find: `"chicken breast; rice"`, undo: `"id1,id2"`),
  `date` (YYYY-MM-DD, blank = today in Vilnius).
- No GitHub tool in the session → say so and give him the inputs to paste
  into Actions → MFP log meal → Run workflow.

## Steps

1. **Find** (skip when every food is obviously in his history or trivially
   generic): `action: find`, `query: "food a; food b; …"`. For each query it
   lists up to 5 candidates — `[history]` (foods he has logged in the last 45
   days, most-logged first) then `[search]` (MFP search, verified first) —
   with id and every serving size's macros.
2. **Pick** one id per food. Prefer, in order: his own history food (he chose
   it before, often a Lithuanian/local product), a ✓verified search result
   whose macros look right, a generic. Check raw vs cooked matches what he
   said (rice/pasta/meat weights are usually cooked unless he says raw).
   Avoid foods marked `⚠old copy` (stale version; MFP may reject the write).
3. **Dry run**: `action: dry-run` with the spec. It prints each line as
   `meal  amount → food [source id] servings × serving size = kcal · P C F`
   and a total. Sanity-check the kcal (200 g chicken breast ≈ 300–330, not
   3000; 1 tbsp oil ≈ 120).
4. **Apply**: identical spec, `action: apply`. Success is
   `✓ N entries written and read back (… kcal; DATE now … kcal) · ids: …`.
   Anything else → report the log line, don't retry blindly (a failed run
   stops at the first rejected item and prints which were already written).
5. **Report** a short table: food | amount | kcal | P/C/F, the meal total, and
   the day's new total. Keep the entry ids (in the apply log) in case he
   wants one undone.

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

- `id` (from find) or `q` (auto-pick: best history match, else first
  verified search hit — fine for unambiguous foods, check the dry run).
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

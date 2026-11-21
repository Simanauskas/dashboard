#!/usr/bin/env python3
"""Write the dashboard's Fuel targets into MyFitnessPal as the day's goals.

MFP Premium stores goals as dated versions (`valid_from` → `valid_to`) with one
goal per weekday. Each run writes a new version valid from today whose seven
weekday slots hold today's live target and the planned targets for the next six
days, from scripts/fuel_target.mjs. Past days keep the goals they had.

Only energy, carbohydrates, protein and fat are changed; everything else in the
current goal (micronutrients, exercise-calorie settings, groups) is copied as is.

    python3 mfp_goals.py --verify            # no-op write: today's goals, unchanged
    python3 mfp_goals.py --apply targets.json
    python3 mfp_goals.py --apply targets.json --dry-run

Writes nothing when the targets already match what MFP holds, so an hourly
run is a write only when the day actually moved. After a write it reads the
goal back and fails loudly if it did not land — the API is MFP's private one.
"""
from __future__ import annotations
import argparse, copy, datetime, json, sys

import mfp

MACROS = ("energy", "carbohydrates", "protein", "fat")


def current_item(s, date_str):
    data = mfp._get(s, "/v2/nutrient-goals", [("date", date_str)])
    items = data.get("items") or []
    if not items:
        raise RuntimeError("no nutrient goal in force today — set one in the MFP app first")
    return items[0]


def macros_of(goal):
    return {"energy": round(mfp._num(goal.get("energy")) or 0),
            "carbohydrates": round(goal.get("carbohydrates") or 0),
            "protein": round(goal.get("protein") or 0),
            "fat": round(goal.get("fat") or 0)}


def slots(item):
    return {(d.get("day_of_week") or "").lower(): macros_of(d) for d in item.get("daily_goals") or []}


def set_macros(goal, m):
    goal["energy"] = {"value": float(m["energy"]), "unit": "calories"}
    for k in ("carbohydrates", "protein", "fat"):
        goal[k] = float(m[k])


def build(item, by_weekday, today):
    new = {k: copy.deepcopy(v) for k, v in item.items()
           if k in ("default_goal", "daily_goals", "default_group_id")}
    new["valid_from"] = today
    for d in new.get("daily_goals") or []:
        m = by_weekday.get((d.get("day_of_week") or "").lower())
        if m:
            set_macros(d, m)
    if today_m := by_weekday.get(datetime.date.fromisoformat(today).strftime("%A").lower()):
        set_macros(new["default_goal"], today_m)
    return new


def exercise_report(s, days=7):
    """Read-only: do exercise entries reach the MFP diary (e.g. via the Garmin
    integration)? MFP adds them to 'remaining', and with the goal's
    assign_exercise_energy set it adds them to the macro goals too — which would
    count training twice, since the dashboard target already includes it.
    Prints counts and calories only."""
    n = kcal = 0
    for i in range(days):
        d = (datetime.date.today() - datetime.timedelta(days=i)).isoformat()
        try:
            data = mfp._get(s, "/v2/diary", [("entry_date", d), ("types", "exercise_entry")])
        except Exception as e:
            print(f"  exercise check {d}: {e}"); continue
        for it in data.get("items") or []:
            if it.get("type", "exercise_entry") == "exercise_entry":
                n += 1
                kcal += mfp._num((it.get("energy") or {})) or 0
    print(f"exercise entries in the MFP diary, last {days} days: {n} ({round(kcal)} kcal)")
    return n


def post(s, item):
    r = s.post(mfp.API + "/v2/nutrient-goals", json={"item": item}, timeout=30)
    if not r.ok:
        raise RuntimeError(f"POST /v2/nutrient-goals → {r.status_code}: {r.text[:300]}")


def main():
    p = argparse.ArgumentParser()
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--verify", action="store_true")
    g.add_argument("--apply")
    p.add_argument("--dry-run", action="store_true")
    a = p.parse_args()

    tok = mfp.load_token()
    if not tok:
        print("MFP_TOKEN not set — skipping"); return 0
    s = mfp._session(tok)
    today = datetime.date.today().isoformat()
    item = current_item(s, today)
    have = slots(item)

    if a.verify:
        print(f"goal in force: valid {item.get('valid_from')} → {item.get('valid_to')}, "
              f"exercise energy: {(item.get('default_goal') or {}).get('assign_exercise_energy')}")
        exercise_report(s)
        want = have
    else:
        targets = json.loads(open(a.apply, encoding="utf-8").read())
        want = dict(have)
        for t in targets:
            dow = datetime.date.fromisoformat(t["date"]).strftime("%A").lower()
            want[dow] = {"energy": t["kcal"], "carbohydrates": t["carbs"],
                         "protein": t["protein"], "fat": t["fat"]}

    for dow in ("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"):
        h, w = have.get(dow), want.get(dow)
        mark = "  " if h == w else "→ "
        print(f"{mark}{dow:9s} {h} → {w}" if h != w else f"{mark}{dow:9s} {h}")

    if not a.verify and want == have:
        print("MFP goals already match the dashboard — nothing to write"); return 0
    if a.dry_run:
        print("dry run — nothing written"); return 0

    post(s, build(item, want, today))
    back = current_item(s, today)
    got = slots(back)
    if got != want:
        print(f"::error::MFP accepted the write but reads back different goals: {got}")
        return 1
    print(f"✓ MFP goals written and read back (valid from {back.get('valid_from')})")
    return 0


if __name__ == "__main__":
    sys.exit(main())

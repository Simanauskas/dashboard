#!/usr/bin/env python3
"""Log meals into the MyFitnessPal diary — typed in chat, written by Actions.

Uses the same private API and MFP_TOKEN as mfp.py (see there for how the token
is kept alive). Foods are resolved against what Simas has logged before first
(his own history is the most accurate source), then MFP's food search.

    python3 mfp_log.py --probe                      # read-only: API shapes, search endpoints
    python3 mfp_log.py --find "chicken breast; rice"
    python3 mfp_log.py --spec spec.json             # resolve + print the plan, write nothing
    python3 mfp_log.py --spec spec.json --apply     # write, then read back
    python3 mfp_log.py --show [--date YYYY-MM-DD]   # the day's entries with their ids
    python3 mfp_log.py --undo "uuid1,uuid2"         # delete entries by id

The spec (a file path or inline JSON):

    {"date": "2026-11-24", "meal": "Lunch", "items": [
       {"q": "chicken breast", "amount": 200, "unit": "g"},
       {"id": "123456789", "amount": 1.5, "unit": "cup"},
       {"q": "banana", "amount": 1}                      # 1 of its default serving
    ]}

`date` defaults to today (TZ), `meal` to Snacks; an item may override `meal`.
`serving` (an index into the food's serving sizes, as --find prints them)
forces a serving size; otherwise one is chosen from `unit`.
"""
from __future__ import annotations
import argparse, datetime, json, os, pathlib, re, sys
from urllib.parse import quote

import mfp

HISTORY_DAYS = 45
MEALS = ("Breakfast", "Lunch", "Dinner", "Snacks")

# Grams / millilitres per unit, for converting between what he types and what
# the food's serving sizes are expressed in.
MASS = {"g": 1.0, "gram": 1.0, "grams": 1.0, "gr": 1.0, "kg": 1000.0,
        "oz": 28.3495, "ounce": 28.3495, "ounces": 28.3495, "lb": 453.592, "lbs": 453.592}
VOLUME = {"ml": 1.0, "milliliter": 1.0, "millilitre": 1.0, "milliliters": 1.0, "millilitres": 1.0,
          "l": 1000.0, "liter": 1000.0, "litre": 1000.0, "dl": 100.0, "cl": 10.0,
          "fl oz": 29.5735, "tbsp": 15.0, "tablespoon": 15.0, "tablespoons": 15.0,
          "tsp": 5.0, "teaspoon": 5.0, "teaspoons": 5.0, "cup": 240.0, "cups": 240.0}


# ── API ──────────────────────────────────────────────────────────────────────

def session():
    tok = mfp.load_token()
    if not tok:
        sys.exit("MFP_TOKEN not set — MyFitnessPal not connected")
    return mfp._session(tok)


def diary(s, date_str):
    data = mfp._get(s, "/v2/diary", [("entry_date", date_str), ("types", "food_entry"),
                                     ("fields[]", "nutritional_contents")])
    return [i for i in data.get("items", []) if i.get("type", "food_entry") == "food_entry"]


def food(s, fid, fallback=None):
    """Fresh food record — the diary rejects an entry whose version is stale.
    Some foods he logged long ago no longer resolve by id; then the copy carried
    in his diary entry (`fallback`) is used as is."""
    data = mfp._get(s, "/v2/foods", [("ids", str(fid))])
    items = data.get("items") or []
    if items:
        return items[0]
    if fallback and fallback.get("version") and fallback.get("serving_sizes"):
        return dict(fallback, _stale=True)
    raise RuntimeError(f"food {fid} not found")


SEARCHES = [
    # (label, url, params) — tried in order; the first that returns foods wins.
    ("v2/search/nutrition", mfp.API + "/v2/search/nutrition",
     lambda q: [("q", q), ("max_items", "10"), ("fields[]", "nutritional_contents"),
                ("fields[]", "serving_sizes")]),
    ("v2/nutrition", mfp.API + "/v2/nutrition",
     lambda q: [("q", q), ("max_items", "10")]),
    ("public/nutrition", mfp.API + "/public/nutrition",
     lambda q: [("q", q), ("page", "1"), ("per_page", "10")]),
    ("www/api/nutrition", "https://www.myfitnesspal.com/api/nutrition",
     lambda q: [("query", q), ("offset", "0"), ("limit", "10"), ("lang", "en-US")]),
]


def _foods_in(data):
    """Pull food dicts out of a search response, whatever it is wrapped in."""
    out = []
    items = data.get("items") if isinstance(data, dict) else data
    for it in items or []:
        if not isinstance(it, dict):
            continue
        f = it.get("item") if isinstance(it.get("item"), dict) else it
        if f.get("id") and (f.get("description") or f.get("name")):
            out.append(f)
    return out


_search_ok = None


def search(s, q):
    global _search_ok
    order = [x for x in SEARCHES if _search_ok in (None, x[0])]
    for label, url, params in order:
        try:
            r = s.get(url, params=params(q), timeout=30)
            if not r.ok or not r.headers.get("Content-Type", "").startswith("application/json"):
                continue
            foods = _foods_in(r.json())
        except Exception:
            continue
        if foods:
            _search_ok = label
            # Keep MFP's relevance order, but verified entries first.
            return sorted(foods, key=lambda f: not f.get("verified"))
    return []


def post_entry(s, entry):
    r = s.post(mfp.API + "/v2/diary", json={"items": [entry]},
               headers={"Content-Type": "application/json"}, timeout=30)
    if not r.ok:
        raise RuntimeError(f"POST /v2/diary → {r.status_code}: {r.text[:400]}")
    try:
        return ((r.json().get("items") or [{}])[0]).get("id")
    except ValueError:
        return None


def delete_entry(s, uuid):
    r = s.delete(mfp.API + f"/v2/diary/{quote(uuid)}", timeout=30)
    return r.status_code in (200, 204), r.status_code, r.text[:200]


# ── history ──────────────────────────────────────────────────────────────────

def history(s, today, days=HISTORY_DAYS):
    """Foods he has logged recently: {id: {food, count, meals, last_serving}}."""
    seen = {}
    for i in range(days):
        d = (today - datetime.timedelta(days=i)).isoformat()
        try:
            items = diary(s, d)
        except mfp.AuthError:
            raise
        except Exception as e:
            print(f"  · history {d}: {e}")
            continue
        for it in items:
            f = it.get("food") if isinstance(it.get("food"), dict) else {}
            fid = f.get("id")
            if not fid:
                continue
            h = seen.setdefault(str(fid), {"food": f, "count": 0, "meals": set(),
                                           "last": it})
            h["count"] += 1
            if it.get("meal_name"):
                h["meals"].add(it["meal_name"])
    return seen


def _words(t):
    return re.findall(r"[a-z0-9ąčęėįšųūž]+", (t or "").lower())


def match_history(hist, q):
    qw = _words(q)
    if not qw:
        return []
    out = []
    for fid, h in hist.items():
        f = h["food"]
        text = " ".join(_words(f.get("description")) + _words(f.get("brand_name")))
        if all(w in text for w in qw):
            out.append((h["count"], fid, h))
    out.sort(key=lambda x: -x[0])
    return [(fid, h) for _, fid, h in out]


# ── servings and nutrition ───────────────────────────────────────────────────

CANON = {"gram": "g", "grams": "g", "gr": "g", "kilogram": "kg", "kilograms": "kg",
         "milligram": "mg", "milligrams": "mg", "ounce": "oz", "ounces": "oz", "wt. oz": "oz",
         "pound": "lb", "pounds": "lb", "lbs": "lb", "milliliter": "ml", "millilitre": "ml",
         "milliliters": "ml", "millilitres": "ml", "liter": "l", "litre": "l",
         "tablespoon": "tbsp", "tablespoons": "tbsp", "tbs": "tbsp", "teaspoon": "tsp",
         "teaspoons": "tsp", "cups": "cup"}


def _unit_key(u):
    u = (u or "").strip().lower().rstrip(".")
    u = re.sub(r"\(s\)$", "", u).strip()             # "oz(s)" -> "oz"
    return CANON.get(u, u)


def amount_of(ss, kind):
    """Grams (kind 'g') or millilitres (kind 'ml') one unit of serving size ss
    stands for, or None. MFP gives gram_weight on most serving sizes; parsing
    the unit text ("1 slice (28g)") is the fallback."""
    unit = _unit_key(ss.get("unit"))
    val = float(ss.get("value") or 1)
    if kind == "g":
        if ss.get("gram_weight"):
            return float(ss["gram_weight"])
        if unit in MASS:
            return MASS[unit] * val
    if kind == "ml" and unit in VOLUME:
        return VOLUME[unit] * val
    m = re.search(r"([\d.]+)\s*(g|gram|grams|ml|oz)\b", unit)
    if m and (m.group(2) == "ml") == (kind == "ml"):
        lead = re.match(r"\s*([\d.]+)\s+[a-z]", unit)
        base = float(lead.group(1)) if lead and "(" in unit else 1.0
        return float(m.group(1)) * MASS.get(m.group(2), 1.0) * val / base
    return None


def choose_serving(f, amount, unit, force=None):
    """(serving_size, servings) for `amount` `unit` of food f."""
    sizes = f.get("serving_sizes") or []
    if not sizes:
        raise RuntimeError("food has no serving sizes")
    if force is not None:
        ss = sizes[int(force)]
        return ss, float(amount)
    u = _unit_key(unit)
    if u in ("", "serving", "servings", "x", "portion"):
        return sizes[0], float(amount)
    want = ("g", MASS[u] * amount) if u in MASS else ("ml", VOLUME[u] * amount) if u in VOLUME else None
    if want:
        # Exact unit first, "1 g" style preferred (keeps his number), then any
        # serving convertible through its gram weight.
        same = [ss for ss in sizes if _unit_key(ss.get("unit")) == u]
        same.sort(key=lambda ss: float(ss.get("value") or 1) != 1.0)
        for ss in same:
            return ss, round(float(amount) / float(ss.get("value") or 1), 3)
        for ss in sizes:
            per = amount_of(ss, want[0])
            if per:
                return ss, round(want[1] / per, 3)
        if want[0] == "ml":                               # 1 ml ≈ 1 g for drinks
            for ss in sizes:
                per = amount_of(ss, "g")
                if per:
                    return ss, round(want[1] / per, 3)
        raise RuntimeError(f"no serving size convertible from {unit} — "
                           f"sizes: {[sz_label(x) for x in sizes]}")
    # A count unit ("egg", "slice", "large", "scoop"): match by name.
    for ss in sizes:
        su = _unit_key(ss.get("unit"))
        if u in su or su in u:
            return ss, round(float(amount) / float(ss.get("value") or 1), 3)
    raise RuntimeError(f"no '{unit}' serving — sizes: {[sz_label(x) for x in sizes]}")


def sz_label(ss):
    v = ss.get("value")
    return f"{v:g} {ss.get('unit')}" if isinstance(v, (int, float)) else str(ss.get("unit"))


NUTR = (("energy", "kcal"), ("protein", "P"), ("carbohydrates", "C"), ("fat", "F"))


def nutrition(f, ss, servings):
    nc = f.get("nutritional_contents") or {}
    k = float(ss.get("nutrition_multiplier") or 1) * float(servings)
    return {lab: round((mfp._num(nc.get(src)) or 0) * k, 1) for src, lab in NUTR}


def fmt_n(n):
    return f"{round(n['kcal'])} kcal · P{n['P']:g} C{n['C']:g} F{n['F']:g}"


def food_label(f):
    b = f.get("brand_name")
    return (f"{f.get('description') or f.get('name')}" + (f" ({b})" if b else "")
            + (" ⚠old copy — MFP may reject it" if f.get("_stale") else ""))


# ── commands ─────────────────────────────────────────────────────────────────

def today_local():
    return datetime.date.today()


def cmd_probe(s):
    today = today_local()
    print("== diary item shape (most recent day with entries)")
    sample = None
    for i in range(14):
        items = diary(s, (today - datetime.timedelta(days=i)).isoformat())
        if items:
            sample = items[0]
            break
    if sample:
        print("keys:", json.dumps(mfp.schema_hint(sample)))
        for k in ("food", "serving_size"):
            if isinstance(sample.get(k), dict):
                print(f"{k}:", json.dumps(sample[k])[:800])
        print("servings:", sample.get("servings"), "meal_name:", sample.get("meal_name"),
              "meal_position:", sample.get("meal_position"))
        fid = (sample.get("food") or {}).get("id")
        if fid:
            print(f"== GET /v2/foods?ids={fid}")
            try:
                f = food(s, fid)
                print("keys:", sorted(f))
                print("version:", f.get("version"))
                for x in (f.get("serving_sizes") or [])[:6]:
                    print("  serving_size:", json.dumps(x))
                print("  nutritional_contents:", json.dumps(f.get("nutritional_contents"))[:500])
            except Exception as e:
                print("  ✗", e)
    else:
        print("no entries in the last 14 days")
    print("== search endpoints (query 'banana')")
    for label, url, params in SEARCHES:
        try:
            r = s.get(url, params=params("banana"), timeout=30)
            ct = r.headers.get("Content-Type", "")
            line = f"  {label}: {r.status_code} {ct.split(';')[0]}"
            if r.ok and ct.startswith("application/json"):
                data = r.json()
                foods = _foods_in(data)
                line += f" · top keys {sorted(data) if isinstance(data, dict) else type(data).__name__}"
                line += f" · {len(foods)} foods"
                if foods:
                    line += f" · first: {food_label(foods[0])} keys {sorted(foods[0])}"
            else:
                line += f" · {r.text[:120]!r}"
            print(line)
        except Exception as e:
            print(f"  {label}: ✗ {type(e).__name__}: {e}")
    return 0


def candidates(s, hist, q, n=5):
    out = []
    for fid, h in match_history(hist, q)[:n]:
        out.append(("history", fid, h))
    if len(out) < n:
        for f in search(s, q)[: n - len(out)]:
            if str(f.get("id")) not in {c[1] for c in out}:
                out.append(("search", str(f["id"]), {"food": f}))
    return out


def cmd_find(s, queries):
    hist = history(s, today_local())
    print(f"(history: {len(hist)} distinct foods over {HISTORY_DAYS} days)")
    for q in [x.strip() for x in queries.split(";") if x.strip()]:
        print(f"\n## {q}")
        cs = candidates(s, hist, q)
        if not cs:
            print("  nothing found")
        for src, fid, h in cs:
            try:
                f = food(s, fid, h["food"])
            except Exception as e:
                print(f"  [{src}] id={fid} {food_label(h['food'])} — ✗ {e}")
                continue
            used = f" · logged {h['count']}×" if src == "history" else ""
            used += " · ✓verified" if f.get("verified") else ""
            print(f"  [{src}] id={fid} {food_label(f)}{used}")
            for i, ss in enumerate((f.get("serving_sizes") or [])[:8]):
                print(f"      serving {i}: {sz_label(ss)} = {fmt_n(nutrition(f, ss, 1))}")
    return 0


def load_spec(arg):
    p = pathlib.Path(arg)
    txt = p.read_text(encoding="utf-8") if len(arg) < 300 and p.exists() else arg
    spec = json.loads(txt)
    if isinstance(spec, list):
        spec = {"items": spec}
    return spec


def norm_meal(m, known=()):
    m = (m or "Snacks").strip()
    for k in list(known) + list(MEALS):
        if k.lower() == m.lower() or (m.lower() == "snack" and k.lower() == "snacks"):
            return k
    raise RuntimeError(f"unknown meal '{m}' — use one of {sorted(set(MEALS) | set(known))}")


def cmd_spec(s, spec, apply):
    date = spec.get("date") or today_local().isoformat()
    datetime.date.fromisoformat(date)
    items = spec.get("items") or []
    if not items:
        sys.exit("spec has no items")
    hist = history(s, today_local())
    known = {m for h in hist.values() for m in h["meals"]}

    plan, total = [], {"kcal": 0, "P": 0, "C": 0, "F": 0}
    for it in items:
        meal = norm_meal(it.get("meal") or spec.get("meal"), known)
        if it.get("id"):
            fid, src = str(it["id"]), "id"
            fb = (hist.get(fid) or {}).get("food")
        else:
            cs = candidates(s, hist, it["q"], n=1)
            if not cs:
                raise RuntimeError(f"nothing found for '{it['q']}' — try --find with other words")
            src, fid, h = cs[0]
            fb = h["food"]
        f = food(s, fid, fb)
        ss, servings = choose_serving(f, float(it.get("amount", 1)), it.get("unit", "serving"),
                                      it.get("serving"))
        n = nutrition(f, ss, servings)
        for k in total:
            total[k] += n[k]
        plan.append((meal, f, ss, servings, n, src))
        what = f"{it.get('amount', 1)} {it.get('unit', 'serving')}"
        print(f"  {meal:9s} {what:>12s} → {food_label(f)} [{src} id={fid}] "
              f"{servings:g} × {sz_label(ss)} = {fmt_n(n)}")
    print(f"  {'total':9s} {'':>12s}   {fmt_n({k: round(v, 1) for k, v in total.items()})}")

    if not apply:
        print(f"dry run — nothing written to {date}")
        return 0

    before = {i.get("id") for i in diary(s, date)}
    written = []
    for meal, f, ss, servings, n, _ in plan:
        entry = {
            "type": "food_entry",
            "date": date,
            "meal_name": meal,
            "servings": float(servings),
            "food": {"id": str(f["id"]), "version": str(f["version"])},
            "serving_size": {k: ss[k] for k in ("value", "unit", "nutrition_multiplier") if k in ss},
        }
        try:
            uid = post_entry(s, entry)
        except Exception as e:
            print(f"::error::{e}")
            print(f"stopped after {len(written)} of {len(plan)} written: {written}")
            return 1
        written.append(uid)
        print(f"  ✓ posted {food_label(f)} → {uid}")

    after = diary(s, date)
    new = [i for i in after if i.get("id") not in before]
    got = sum(mfp._num((i.get("nutritional_contents") or {}).get("energy")) or 0 for i in new)
    day = sum(mfp._num((i.get("nutritional_contents") or {}).get("energy")) or 0 for i in after)
    if len(new) != len(plan):
        print(f"::error::posted {len(plan)} but {len(new)} new entries read back on {date}")
        return 1
    print(f"✓ {len(new)} entr{'y' if len(new) == 1 else 'ies'} written and read back "
          f"({round(got)} kcal; {date} now {round(day)} kcal) · ids: {','.join(str(i.get('id')) for i in new)}")
    return 0


def cmd_show(s, date):
    items = diary(s, date)
    print(f"{date}: {len(items)} entries")
    tot = 0
    for it in items:
        r = mfp.entry_row(it)
        tot += r["kcal"] or 0
        print(f"  {r['meal'] or '?':9s} {r['amount'] or '':>14s}  {r['food']}"
              + (f" ({r['brand']})" if r["brand"] else "")
              + f" · {round(r['kcal'] or 0)} kcal · id={it.get('id')}")
    print(f"  total {round(tot)} kcal")
    return 0


def cmd_undo(s, ids):
    bad = 0
    for uid in [x.strip() for x in ids.split(",") if x.strip()]:
        ok, code, txt = delete_entry(s, uid)
        print(f"  {'✓ deleted' if ok else '✗'} {uid} ({code}{'' if ok else ': ' + txt})")
        bad += not ok
    return 1 if bad else 0


def main():
    p = argparse.ArgumentParser()
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--probe", action="store_true")
    g.add_argument("--find")
    g.add_argument("--spec")
    g.add_argument("--show", action="store_true")
    g.add_argument("--undo")
    p.add_argument("--date")
    p.add_argument("--apply", action="store_true")
    a = p.parse_args()
    s = session()
    try:
        if a.probe:
            return cmd_probe(s)
        if a.find:
            return cmd_find(s, a.find)
        if a.show:
            return cmd_show(s, a.date or today_local().isoformat())
        if a.undo:
            return cmd_undo(s, a.undo)
        spec = load_spec(a.spec)
        if a.date and not spec.get("date"):
            spec["date"] = a.date
        return cmd_spec(s, spec, a.apply)
    except mfp.AuthError as e:
        print(f"::error::MyFitnessPal rejected the token ({e}) — reconnect 🍎 in the Sync panel")
        return 1
    except RuntimeError as e:
        print(f"::error::{e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())

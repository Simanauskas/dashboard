#!/usr/bin/env python3
"""Pull daily nutrition totals from MyFitnessPal into HEALTH_DATA.nutrition.

MyFitnessPal's partner API is closed to new developers, so this uses the same
API the MFP website itself calls, authenticated the way the website is.

Auth mirrors the Garmin setup:

  * The long-lived credential is the browser session cookie. It is pasted once
    into the dashboard's Sync panel (🍎 Connect), which sends it to the Worker
    at auth.simas.fit. The Worker keeps it in KV and replays it every hour,
    which is what keeps it alive: MFP re-issues the cookie with a fresh expiry
    on each authenticated visit, and the Worker saves whatever comes back.
  * Each hour the Worker also swaps the cookie for a short-lived API bearer
    token and writes it to the MFP_TOKEN GitHub secret — the MFP equivalent of
    GARTH_OAUTH2. This script only ever sees that token, never the cookie.

The cookie dies only if the Worker stops replaying it for longer than its
lifetime, or MFP logs the session out (password change, "log out everywhere").
Then Connect needs doing again.

    python3 mfp.py                 # fetch the last REFRESH_DAYS + today, patch
    python3 mfp.py --days 30       # wider window (backfill)
    python3 mfp.py --dry-run       # fetch + print, write nothing
    python3 mfp.py --poll          # today only; writes nothing unless it changed

Never fails the job: an MFP outage must not cost the Garmin sync its commit.
Every failure path prints why and exits 0.
"""
from __future__ import annotations
import argparse, datetime, json, os, pathlib, re, sys

import requests

DASHBOARD = pathlib.Path("src/App.jsx")
API = "https://api.myfitnesspal.com"
REFRESH_DAYS = 4          # same window update.py re-checks; entries get edited late
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0 Safari/537.36")

# Written into App.jsx per day. Order is the on-disk field order.
FIELDS = ("kcal", "protein", "carbs", "fat", "fiber", "goal")


class AuthError(Exception):
    pass


# ── fetch ────────────────────────────────────────────────────────────────────

def load_token():
    raw = os.environ.get("MFP_TOKEN", "").strip()
    if not raw:
        return None
    try:
        tok = json.loads(raw)
    except ValueError:
        raise AuthError("MFP_TOKEN secret is not JSON — reconnect from the Sync panel")
    if not tok.get("access_token") or not tok.get("user_id"):
        raise AuthError("MFP_TOKEN secret is missing access_token/user_id")
    exp = tok.get("expires_at")
    if exp and exp < datetime.datetime.utcnow().timestamp():
        # Not fatal on its own — try anyway, the API has the final word — but
        # it means the Worker's hourly mint has stopped, which is worth knowing.
        print(f"⚠ MFP token expired at {datetime.datetime.utcfromtimestamp(exp):%Y-%m-%d %H:%MZ}"
              " — the Worker's hourly refresh is failing (check `wrangler tail` for 'mfp refresh:')")
    return tok


def _session(tok):
    s = requests.Session()
    s.headers.update({
        "Authorization": f"Bearer {tok['access_token']}",
        "mfp-client-id": "mfp-main-js",
        "mfp-user-id": str(tok["user_id"]),
        "Accept": "application/json",
        "User-Agent": UA,
    })
    return s


def _get(s, path, params):
    r = s.get(API + path, params=params, timeout=30)
    if r.status_code in (401, 403):
        raise AuthError(f"{path} → {r.status_code}: {r.text[:200]}")
    if not r.ok:
        raise RuntimeError(f"{path} → {r.status_code}: {r.text[:300]}")
    if not r.headers.get("Content-Type", "").startswith("application/json"):
        # Cloudflare's bot challenge comes back as an HTML 200. Name it, because
        # "Expecting value: line 1 column 1" says nothing useful.
        raise RuntimeError(f"{path} returned {r.headers.get('Content-Type')} instead of JSON "
                           f"(bot challenge?): {r.text[:200]!r}")
    return r.json()


def _num(v):
    """Nutrient values come either bare (12.3) or as {unit, value}."""
    if isinstance(v, dict):
        val = v.get("value")
        if val is None:
            return None
        if (v.get("unit") or "").lower() in ("kilojoules", "kj"):
            return float(val) / 4.184
        return float(val)
    if isinstance(v, (int, float)):
        return float(v)
    return None


def fetch_day(s, date_str):
    """Summed nutrition for one day, or None if nothing was logged."""
    data = _get(s, "/v2/diary", [
        ("entry_date", date_str),
        ("types", "food_entry"),
        ("fields[]", "nutritional_contents"),
    ])
    items = [i for i in data.get("items", []) if i.get("type", "food_entry") == "food_entry"]
    if not items:
        return None

    tot = {"kcal": 0.0, "protein": 0.0, "carbs": 0.0, "fat": 0.0, "fiber": 0.0}
    keys = {"energy": "kcal", "protein": "protein", "carbohydrates": "carbs",
            "fat": "fat", "fiber": "fiber"}
    for it in items:
        nc = it.get("nutritional_contents") or {}
        for src, dst in keys.items():
            v = _num(nc.get(src))
            if v:
                tot[dst] += v
    if not tot["kcal"]:
        # Entries with no energy at all means the response shape is not what
        # this parser expects. Print one item so the next person can see it.
        print(f"  ⚠ {date_str}: {len(items)} entries but 0 kcal — unexpected shape:")
        print("   ", json.dumps(items[0])[:600])
        return None
    return {k: round(v) for k, v in tot.items()}


def fetch_goal(s, date_str):
    """Calorie goal in force on date_str, or None. Best-effort: a goal is a nice
    reference line, not worth failing a day's totals over."""
    try:
        data = _get(s, "/v2/nutrient-goals", [("date", date_str)])
    except AuthError:
        raise
    except Exception as e:
        print(f"  · goal for {date_str} unavailable: {e}")
        return None
    items = data.get("items") or []
    if not items:
        return None
    g = items[0]
    dow = datetime.date.fromisoformat(date_str).strftime("%A").lower()
    for d in g.get("daily_goals") or []:
        if (d.get("day_of_week") or "").lower() == dow:
            v = _num(d.get("energy"))
            if v:
                return round(v)
    v = _num((g.get("default_goal") or {}).get("energy"))
    return round(v) if v else None


def fetch(tok, dates):
    s = _session(tok)
    rows = {}
    for d in dates:
        day = fetch_day(s, d)
        if not day:
            print(f"  · {d}: nothing logged")
            continue
        day["goal"] = fetch_goal(s, d)
        rows[d] = day
        print(f"  ✓ {d}: {day['kcal']} kcal · P{day['protein']} C{day['carbs']} F{day['fat']}"
              + (f" · goal {day['goal']}" if day["goal"] else ""))
    return rows


# ── patch ────────────────────────────────────────────────────────────────────

ARRAY = re.compile(r'(nutrition:\s*\[)(.*?)(\n  \],)', re.DOTALL)
ROW = re.compile(r'\{date:"([\d-]+)"[^}]*\},')


def _row(date_str, r):
    vals = ",".join(f"{k}:{'null' if r.get(k) is None else r[k]}" for k in FIELDS)
    return f'    {{date:"{date_str}",{vals}}},'


def patch(rows, code, synced_at):
    """Upsert rows into HEALTH_DATA.nutrition, keyed by date, inside the array's
    own span (the lesson of the weight bug), and stamp LAST_MFP."""
    m = ARRAY.search(code)
    if not m:
        raise RuntimeError("nutrition array not found in App.jsx — was HEALTH_DATA reshaped?")
    by_date = {}
    for e in ROW.finditer(m.group(2)):
        by_date[e.group(1)] = "    " + e.group(0)
    for d, r in rows.items():
        by_date[d] = _row(d, r)
    body = "".join("\n" + by_date[d] for d in sorted(by_date))
    code = code[:m.start(2)] + body + code[m.end(2):]
    code = re.sub(r'const LAST_MFP  = "[^"]*";', f'const LAST_MFP  = "{synced_at}";', code)
    return code


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--days", type=int, default=REFRESH_DAYS)
    p.add_argument("--dry-run", action="store_true")
    # The 10-minute polls keep the Today fuel card current through the day.
    # Like update.py's poll mode, a poll that finds nothing new writes nothing —
    # not even LAST_MFP — so it cannot turn into a commit every ten minutes.
    p.add_argument("--poll", action="store_true")
    a = p.parse_args()
    if a.poll:
        a.days = 0

    try:
        tok = load_token()
    except AuthError as e:
        print(f"::warning::MyFitnessPal: {e}")
        return 0
    if not tok:
        print("MFP_TOKEN not set — MyFitnessPal not connected yet, skipping")
        return 0

    today = datetime.date.today()
    dates = [(today - datetime.timedelta(days=i)).isoformat() for i in range(a.days, -1, -1)]
    print(f"MyFitnessPal: {dates[0]} → {dates[-1]}")
    try:
        rows = fetch(tok, dates)
    except AuthError as e:
        print(f"::warning::MyFitnessPal rejected the token ({e}). If this persists past the next "
              "hourly refresh, the session cookie has died — tap 🍎 Connect in the Sync panel.")
        return 0
    except Exception as e:
        print(f"::warning::MyFitnessPal fetch failed: {type(e).__name__}: {e}")
        return 0

    if a.dry_run:
        print(json.dumps(rows, indent=1))
        return 0

    now = datetime.datetime.utcnow().replace(microsecond=0, second=0).isoformat() + "Z"
    code = DASHBOARD.read_text(encoding="utf-8")
    try:
        new = patch(rows, code, now)
    except RuntimeError as e:
        print(f"::warning::{e}")
        return 0
    if a.poll and patch(rows, code, "") == patch({}, code, ""):
        print("poll: diary unchanged — leaving the file untouched")
        return 0
    DASHBOARD.write_text(new, encoding="utf-8")
    print(f"✓ Patched {len(rows)} nutrition day(s) into {DASHBOARD}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

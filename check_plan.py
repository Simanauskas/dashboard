#!/usr/bin/env python3
"""Keep SCHEDULE lines short enough to read on a phone before training.

A plan line is two fields and nothing else:

    {type:"plan", text:"Ski 10min · one piece, before the lift · beat 2380m",
                  why:"Your 10-min best has not moved in five weeks."}

    text  what to do                      at most 60 characters
    why   one reason, shown behind a tap  at most 120 characters, optional

A day that asks for nothing is `sessions:[]` — never a line explaining why it
is empty. Everything longer (evidence, history, what earlier runs decided)
belongs in PLAN_LOG.md.

The "three sentences" rule this replaces was a prose limit, and prose limits
drift: lines went from ~23 words a day in September to ~100 in October while
every one of them was still, technically, three sentences. A character count
cannot drift.

    python3 check_plan.py        # exit 1 and list every line over the cap

Only days from SINCE on are checked; older weeks keep their long lines, which
the dashboard clamps to two lines. Calendar fixtures (cal:true) are written
by calendar_sync.py and are exempt.
"""
import pathlib
import re
import sys

DASHBOARD = pathlib.Path("src/App.jsx")
SINCE = "2026-11-09"
TEXT_MAX, WHY_MAX = 60, 120

DAY = re.compile(r'\{ date:"([\d-]+)", dow:"\w+", label:"[^"]*", sessions:\[(.*?)\] \}')
SESSION = re.compile(r'\{type:"\w+"(.*?)\}(?=,\{type:|$)')
FIELD = lambda name: re.compile(name + r':"((?:[^"\\]|\\.)*)"')


def violations(code):
    out = []
    for date, blob in DAY.findall(code):
        if date < SINCE:
            continue
        for body in SESSION.findall(blob):
            if "cal:true" in body:
                continue
            text = FIELD("text").search(body)
            why = FIELD("why").search(body)
            text = text.group(1) if text else ""
            if len(text) > TEXT_MAX:
                out.append((date, "text", len(text), TEXT_MAX, text))
            if re.match(r"\s*nothing (written|asked|today)", text, re.I) or "note:true" in body:
                out.append((date, "empty", len(text), 0, text))
            if why and len(why.group(1)) > WHY_MAX:
                out.append((date, "why", len(why.group(1)), WHY_MAX, why.group(1)))
    return out


def report(bad):
    for date, field, n, cap, value in bad:
        if field == "empty":
            print(f"  {date}  a day that asks for nothing is sessions:[] — delete this line: {value[:50]}…")
        else:
            print(f"  {date}  {field} is {n} chars, cap {cap}: {value[:50]}…")


def main():
    bad = violations(DASHBOARD.read_text(encoding="utf-8"))
    if not bad:
        print(f"plan lines OK (text ≤ {TEXT_MAX}, why ≤ {WHY_MAX}, from {SINCE})")
        return 0
    print(f"PLAN LINES OVER THE CAP — shorten them and move the reasoning to PLAN_LOG.md:")
    report(bad)
    return 1


if __name__ == "__main__":
    sys.exit(main())

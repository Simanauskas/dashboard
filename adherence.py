#!/usr/bin/env python3
"""Planned vs actually-trained, straight out of src/App.jsx.

Why this exists as a script rather than a paragraph of instructions: the daily
re-plan Routine is a cold session every morning with no memory of the previous
run. Any single day, the written plan looks reasonable, so a conservative agent
correctly decides to hold — and did, fourteen mornings running, while ski was
prescribed twice and done zero times. The pattern only exists ACROSS days, and
no individual run can see it.

So the pattern is computed, not noticed. Adherence becomes a number on screen
before the judgement starts.

    python3 adherence.py [--since YYYY-MM-DD] [--days N]

Reads only. Never writes to App.jsx.
"""
from __future__ import annotations
import argparse, csv, datetime, io, pathlib, re, signal, sys

# The Routine is told to run this first and may pipe it. Dying on SIGPIPE
# there would abort the required step, so restore the default handler.
try:
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)
except (AttributeError, ValueError):
    pass

DASHBOARD = pathlib.Path("src/App.jsx")

# (label, pattern matched against the PLAN line, pattern matched against the
# logged activity's "type + title"). Order is most specific first for the same
# reason SESSION_MATCHERS in App.jsx is: the roxzone line says "station → jog →
# station" and a run pattern would otherwise claim it.
SESSION_TYPES = [
    ("ski",      r"\bski\b",                                  r"\bski\b"),
    ("row",      r"\brow(ing)?\b",                            r"\brow(ing)?\b"),
    ("hyrox",    r"hyrox|circle @|roxzone",                   r"hyrox|circle|roxzone"),
    ("strength", r"strength|sled|lunge|pulldown|wall ball",   r"strength"),
    ("swim",     r"\bswim\b",                                 r"\bswim\b"),
    ("cycle",    r"\bspin\b|\bbike\b|cycl",                   r"cycl|bike"),
    ("tennis",   r"tennis",                                   r"tennis"),
    ("run",      r"Z2 run|long run|KEY RUN|\bjog\b|tempo|threshold|strides|\bkm\b",
                 r"running|treadmill"),
]

# A plan line that reminds rather than prescribes — mirrors isInfoLine() in
# App.jsx. Costing these as sessions would inflate every "prescribed" count.
INFO = re.compile(r"\bdebrief\b|\bsee (RACE|TRAIN|BODY|TODAY)\b", re.I)


def load(path=DASHBOARD):
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        sys.exit(f"{path} not found — run this from the repo root.")


def planned_days(code):
    """[(date, [session text, ...])] for every day in SCHEDULE."""
    out = []
    for date, blob in re.findall(
            r'\{ date:"([\d-]+)", dow:"\w+", label:"[^"]*", sessions:\[(.*?)\] \}', code):
        texts = [t for t in re.findall(r'text:"([^"]+)"', blob)
                 if not INFO.search(t) and "note:true" not in blob[:blob.find(t)][-24:]]
        out.append((date, texts))
    return out


def logged_days(code):
    """[(date, 'activity type title')] for every row in CSV_DATA."""
    raw = re.search(r"const CSV_DATA = `(.*?)`;", code, re.S)
    if not raw:
        sys.exit("CSV_DATA not found — has App.jsx been reshaped?")
    out = []
    for r in csv.reader(io.StringIO(raw.group(1).strip())):
        if len(r) > 3 and re.match(r"\d{4}-\d{2}-\d{2}", r[1]):
            out.append((r[1].split(" ")[0], f"{r[0]} {r[3]}"))
    return out


def report(code, since, until):
    plans, logs = planned_days(code), logged_days(code)
    rows, must_act, watch = [], [], []

    for label, ppat, apat in SESSION_TYPES:
        pre = re.compile(ppat, re.I)
        act = re.compile(apat, re.I)
        p_dates = sorted({d for d, texts in plans
                          if since <= d <= until and any(pre.search(t) for t in texts)})
        a_dates = sorted({d for d, what in logs
                          if since <= d <= until and act.search(what)})
        rows.append((label, p_dates, a_dates))
        # The action trigger. 3+ is a hard stop; 2 is a watch, because two
        # misses in three weeks is already a pattern and ski sat at exactly
        # 2-and-0 on the morning this check was written.
        if not a_dates and len(p_dates) >= 2:
            (must_act if len(p_dates) >= 3 else watch).append((label, len(p_dates), p_dates))

    print(f"ADHERENCE  {since} .. {until}\n")
    print(f"{'type':10} {'prescribed':>10} {'done':>5}   verdict")
    print("-" * 64)
    for label, p, a in rows:
        if not p and not a:
            continue
        if p and not a:
            verdict = f"NEVER DONE ({len(p)}x prescribed)"
        elif len(a) >= len(p):
            verdict = "on track" if p else "unprescribed"
        else:
            verdict = f"short by {len(p) - len(a)}"
        print(f"{label:10} {len(p):>10} {len(a):>5}   {verdict}")

    # Benchmarks are named individually because deferring one is the failure
    # mode the plan text itself keeps admitting to ("deferred twice").
    BENCH = re.compile(r"⏱|time trial|\bTT\b")
    done_on = {d for d, _ in logs}
    bench = [(d, t) for d, texts in plans for t in texts
             if since <= d <= until and BENCH.search(t)]
    if bench:
        print("\nBENCHMARKS already due in this window:")
        for d, t in bench:
            print(f"  {d}  {'something logged' if d in done_on else 'NOTHING LOGGED'}  {t[:58]}")

    # Looking forward matters as much: a benchmark landing on a weekday he
    # never trains will be deferred again, and that is decidable in advance.
    horizon = (datetime.date.fromisoformat(until) + datetime.timedelta(days=14)).isoformat()
    soon = [(d, t) for d, texts in plans for t in texts
            if until < d <= horizon and BENCH.search(t)]
    if soon:
        print("\nBENCHMARKS due in the next 14 days:")
        for d, t in soon:
            dow = datetime.date.fromisoformat(d).strftime("%a")
            print(f"  {d} {dow}  {t[:58]}")

    print()
    if must_act:
        print("=" * 64)
        print("ACTION REQUIRED — prescribed 3+ times, done zero times.")
        print("Reschedule it onto a day he actually trains, or take it out of")
        print("the plan. Carrying it forward unchanged is not an option.")
        for label, n, dates in must_act:
            print(f"  {label}: {n}x — {', '.join(dates)}")
        print("=" * 64)
    elif watch:
        print("WATCH — prescribed twice, done zero times. Say in your summary")
        print("why it is still in the plan, or move it.")
        for label, n, dates in watch:
            print(f"  {label}: {n}x — {', '.join(dates)}")
    else:
        print("Every prescribed session type has been trained at least once.")
    return must_act, watch


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--since", help="ISO date; default: --days back from today")
    ap.add_argument("--days", type=int, default=21)
    a = ap.parse_args()
    today = datetime.date.today()
    since = a.since or (today - datetime.timedelta(days=a.days)).isoformat()
    report(load(), since, today.isoformat())

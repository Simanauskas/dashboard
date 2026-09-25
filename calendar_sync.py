#!/usr/bin/env python3
"""Pull confirmed tennis fixtures from iCloud Calendar into SCHEDULE.

Tennis cannot be planned in advance: tournaments and sparring are arranged
with other people and usually confirmed only a few days ahead. So the plan no
longer prescribes it (see the SCHEDULE block comment). This closes the other
half — once a fixture IS in his calendar, it belongs in the plan before it
happens, not only after Garmin syncs it.

Runs inside GitHub Actions, where the Garmin credentials already live and the
network is open. It does not need, and must not be given, a chat-visible
password: ICLOUD_USER and ICLOUD_APP_PASSWORD are repository secrets.

    python3 calendar_sync.py                  # fetch + patch
    python3 calendar_sync.py --dry-run        # fetch + print, write nothing
    python3 calendar_sync.py --from-ics f.ics # parse a local file instead

Naming convention, from the athlete:
    Edvinas🎾               → session with his trainer
    Name Surname🎾<court>   → match or sparring, court number optional

ONLY sessions carrying cal:true are managed here. Hand-authored lines in
SCHEDULE are never read, moved or removed — the whole point is that the two
can coexist on the same day.
"""
from __future__ import annotations
import argparse, datetime, os, re, sys, pathlib

DASHBOARD = pathlib.Path("src/App.jsx")
CALDAV_URL = "https://caldav.icloud.com"
RACKET = "🎾"          # 🎾 — the marker he already types
HORIZON_DAYS = 10


# ── classify ─────────────────────────────────────────────────────────────────
def classify(summary: str):
    """-> (kind, text) for a calendar title, or None if it is not tennis.

    Anything without the racket is not his tennis and is ignored outright;
    that keeps the rest of his calendar out of the training plan.
    """
    s = (summary or "").strip()
    if RACKET not in s:
        return None
    before, _, after = s.partition(RACKET)
    who = before.strip().strip("'\"“”‘’")
    court = after.strip().strip("'\"“”‘’")
    # "Tennis 🎾" names no person; do not read the sport as an opponent.
    if not who or who.lower() in {"tennis", "tenisas", "training", "treniruote"}:
        return ("tennis", "Tennis 🎾")
    # A bare first name is his trainer; a full name is an opponent.
    if " " not in who:
        return ("trainer", f"Tennis 🎾 · session with {who}")
    label = f"Tennis 🎾 · {who}"
    if court:
        label += f" · court {court}" if court.isdigit() else f" · {court}"
    return ("match", label)


# ── fetch ────────────────────────────────────────────────────────────────────
def fetch_caldav(user, password, days):
    """[(date, summary, start)] for VEVENTs in the next `days`, all calendars."""
    import caldav                                    # installed in the workflow
    client = caldav.DAVClient(url=CALDAV_URL, username=user, password=password)
    principal = client.principal()
    start = datetime.datetime.now(datetime.timezone.utc)
    end = start + datetime.timedelta(days=days)
    out = []
    for cal in principal.calendars():
        try:
            found = cal.search(start=start, end=end, event=True, expand=True)
        except Exception as e:                        # a shared or odd calendar
            print(f"  ! skipped calendar {getattr(cal,'name','?')}: {e}")
            continue
        for ev in found:
            out.extend(_from_ical(ev.data))
    return out


def _from_ical(text):
    """Minimal VEVENT reader: SUMMARY + DTSTART. Avoids a second dependency
    and copes with the folded lines iCloud emits."""
    unfolded = re.sub(r"\r?\n[ \t]", "", text or "")
    out = []
    for block in re.findall(r"BEGIN:VEVENT(.*?)END:VEVENT", unfolded, re.S):
        sm = re.search(r"^SUMMARY[^:]*:(.*)$", block, re.M)
        dt = re.search(r"^DTSTART[^:]*:(\d{8})(?:T(\d{2})(\d{2}))?", block, re.M)
        if not (sm and dt):
            continue
        d = dt.group(1)
        iso = f"{d[:4]}-{d[4:6]}-{d[6:]}"
        hhmm = f"{dt.group(2)}:{dt.group(3)}" if dt.group(2) else ""
        out.append((iso, sm.group(1).strip(), hhmm))
    return out


# ── patch ────────────────────────────────────────────────────────────────────
CAL_SESSION = re.compile(r'\{type:"tennis",cal:true,text:"[^"]*"\},?')
DAY = re.compile(r'(\{ date:"([\d-]+)", dow:"\w+", label:"[^"]*", sessions:\[)(.*?)(\] \})')


def patch(events, code):
    """Replace every cal:true tennis line inside the horizon with what the
    calendar now says. Days outside the horizon are untouched, so a fixture
    further out than the scan never gets silently deleted."""
    today = datetime.date.today()
    horizon = (today + datetime.timedelta(days=HORIZON_DAYS)).isoformat()
    by_date = {}
    for iso, summary, hhmm in events:
        hit = classify(summary)
        if not hit:
            continue
        text = hit[1] + (f" · {hhmm}" if hhmm else "")
        by_date.setdefault(iso, []).append(text)

    changed = []

    def one(m):
        head, date, body, tail = m.groups()
        if not (today.isoformat() <= date <= horizon):
            return m.group(0)
        before = body
        body = CAL_SESSION.sub("", body).strip().strip(",")
        fresh = ",".join(f'{{type:"tennis",cal:true,text:"{t}"}}'
                         for t in sorted(set(by_date.get(date, []))))
        parts = [p for p in (fresh, body) if p]
        new = head + ",".join(parts) + tail
        if new != m.group(0):
            changed.append((date, by_date.get(date, [])))
        return new

    return DAY.sub(one, code), changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--from-ics")
    ap.add_argument("--days", type=int, default=HORIZON_DAYS)
    a = ap.parse_args()

    if a.from_ics:
        events = _from_ical(pathlib.Path(a.from_ics).read_text(encoding="utf-8"))
    else:
        user, pw = os.environ.get("ICLOUD_USER"), os.environ.get("ICLOUD_APP_PASSWORD")
        if not (user and pw):
            print("ICLOUD_USER / ICLOUD_APP_PASSWORD not set — skipping calendar sync")
            return 0
        try:
            events = fetch_caldav(user, pw, a.days)
        except Exception as e:
            # Never fail the sync over the calendar: the Garmin half matters more.
            print(f"::warning::calendar sync failed, plan left as-is: {e}")
            return 0

    tennis = [(d, s, t) for d, s, t in events if classify(s)]
    print(f"calendar: {len(events)} events in window, {len(tennis)} tennis")
    for d, s, t in sorted(tennis):
        print(f"  {d} {t or '--:--'}  {s}  ->  {classify(s)[1]}")

    code = DASHBOARD.read_text(encoding="utf-8")
    new, changed = patch(tennis, code)
    if a.dry_run:
        print("\n--dry-run: not writing.", f"{len(changed)} day(s) would change.")
        return 0
    if new != code:
        DASHBOARD.write_text(new, encoding="utf-8")
        print(f"✓ patched {len(changed)} day(s): " +
              ", ".join(d for d, _ in changed))
    else:
        print("no change")
    return 0


if __name__ == "__main__":
    sys.exit(main())

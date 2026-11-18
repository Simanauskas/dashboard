#!/usr/bin/env python3
"""Pull confirmed tennis fixtures from Google Calendar into SCHEDULE.

Tennis cannot be planned in advance: tournaments and sparring are arranged
with other people and usually confirmed only a few days ahead. So the plan no
longer prescribes it (see the SCHEDULE block comment). This closes the other
half — once a fixture IS in his calendar, it belongs in the plan before it
happens, not only after Garmin syncs it.

Runs inside GitHub Actions, where the Garmin credentials already live and the
network is open. The calendar is read through its "secret address in iCal
format" (Google Calendar → Settings → the calendar → Integrate calendar),
stored as the repository secret GCAL_ICS_URL. Several calendars: comma-separate
the URLs. Treat the URL as a password — never paste it in chat or commit it.

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
import argparse, datetime, os, re, sys, pathlib, urllib.request
from zoneinfo import ZoneInfo

DASHBOARD = pathlib.Path("src/App.jsx")
TZ = ZoneInfo("Europe/Vilnius")
RACKET = "🎾"          # 🎾 — the marker he already types
HORIZON_DAYS = 10


# ── classify ─────────────────────────────────────────────────────────────────
# The racket marks a racket session, not necessarily tennis: he types
# "Padelis 🎾👟" for padel. Naming that one "session with Padelis" invented a
# person and mislabelled the sport, so the sport words are recognised first.
SPORTS = {
    "padelis": "Padel", "padel": "Padel",
    "tenisas": "Tennis", "tennis": "Tennis",
    "squash": "Squash", "skvosas": "Squash",
    "badminton": "Badminton", "badmintonas": "Badminton",
}
GENERIC = {"training", "treniruote", "treniruotė", "match", "rungtynes", "rungtynės"}

# Strip emoji and pictographs out of the name part. "Padelis 🎾👟" carries a
# second emoji; a title that is nothing BUT emoji leaves an empty name.
PICTO = re.compile(
    "[\U0001F000-\U0001FAFF\U00002600-\U000027BF\U0000FE00-\U0000FE0F\U00002190-\U000021FF]")


def _norm_cal(name: str) -> str:
    """Calendar names carry emoji — 'Simas👱‍♂️', 'Ilona❤️Simas'. Matching on the
    raw string means retyping a ZWJ sequence into a GitHub secret correctly,
    so compare with the emoji stripped and spaces removed too."""
    # ZWJ and variation selectors glue emoji together ("👱‍♂️" is three code
    # points plus a joiner); strip them too or "Simas👱‍♂️" normalises with an
    # invisible character still on the end and never matches "Simas".
    s = PICTO.sub("", name or "")
    s = re.sub("[\u200b-\u200f\ufe0e\ufe0f\u2640\u2642]", "", s)
    return re.sub(r"\s+", "", s).lower()


def _clean(part: str) -> str:
    return PICTO.sub("", part or "").strip().strip("'\"“”‘’·-–—").strip()


def classify(summary: str):
    """-> (kind, text) for a calendar title, or None if it is not a racket
    session. Anything without the racket is not his training and is ignored
    outright, which keeps the rest of his calendar out of the plan."""
    s = (summary or "").strip()
    if RACKET not in s:
        return None
    # A leading "?" is his marker for a fixture that is not confirmed yet.
    # It still belongs on the board — he wants to see it coming — but it must
    # not read as settled, and the engine costs it at half (see isOptionalLine
    # in App.jsx) because it may not happen.
    tentative = s.lstrip().startswith("?")
    before, _, after = s.lstrip().lstrip("?").partition(RACKET)
    who, court = _clean(before), _clean(after)

    sport = SPORTS.get(who.lower())
    if sport:                                   # the title names the sport
        label = f"{sport} 🎾"
        if court:
            label += f" · court {court}" if court.isdigit() else f" · {court}"
        return ("sport", label + (" · unconfirmed" if tentative else ""))

    # No name, only emoji, a generic word, or something with no real letters
    # in it (the calendar produced a bare "?" once). Do not invent a person.
    if not who or who.lower() in GENERIC or len(re.findall(r"[^\W\d_]", who)) < 2:
        label = "Tennis 🎾"
        if court:
            label += f" · court {court}" if court.isdigit() else f" · {court}"
        return ("tennis", label + (" · unconfirmed" if tentative else ""))

    # A bare first name is his trainer; a full name is an opponent.
    if " " not in who:
        return ("trainer", f"Tennis 🎾 · session with {who}" + (" · unconfirmed" if tentative else ""))
    label = f"Tennis 🎾 · {who}"
    if court:
        label += f" · court {court}" if court.isdigit() else f" · {court}"
    return ("match", label + (" · unconfirmed" if tentative else ""))


# ── fetch ────────────────────────────────────────────────────────────────────
def events_from_ics(text, cal, start, end):
    """[(date, summary, hhmm, cal)] for every occurrence in [start, end).

    Google's feed carries recurring events as a single VEVENT with an RRULE
    (Edvinas is one) and times in UTC, so occurrences are expanded and
    converted to Vilnius local time before the date is taken. A day that is
    off by one near midnight would put a session on the wrong board day."""
    import icalendar, recurring_ical_events
    out = []
    for ev in recurring_ical_events.of(icalendar.Calendar.from_ical(text)).between(start, end):
        summary = str(ev.get("SUMMARY", "")).strip()
        dt = ev.decoded("DTSTART")
        if isinstance(dt, datetime.datetime):
            dt = dt.astimezone(TZ) if dt.tzinfo else dt
            out.append((dt.date().isoformat(), summary, dt.strftime("%H:%M"), cal))
        else:                                         # all-day event
            out.append((dt.isoformat(), summary, "", cal))
    return out


def fetch_google(urls, days):
    """Read each secret-address feed. A failing feed is reported and skipped
    so one bad URL cannot blank the others."""
    start = datetime.datetime.now(TZ).replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + datetime.timedelta(days=days + 1)
    out = []
    for i, url in enumerate(urls, 1):
        label = f"google#{i}"                         # never print the URL
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                text = r.read().decode("utf-8", "replace")
            got = events_from_ics(text, label, start, end)
            print(f"  {label}: {len(got)} events")
            out += got
        except Exception as e:
            print(f"::warning::{label} failed ({type(e).__name__}): feed skipped")
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
    for iso, summary, hhmm, _cal in events:
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
        start = datetime.datetime.now(TZ).replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + datetime.timedelta(days=a.days + 1)
        events = events_from_ics(pathlib.Path(a.from_ics).read_text(encoding="utf-8"),
                                 "local.ics", start, end)
    else:
        urls = [u.strip() for u in os.environ.get("GCAL_ICS_URL", "").split(",") if u.strip()]
        if not urls:
            print("GCAL_ICS_URL not set — skipping calendar sync")
            return 0
        try:
            events = fetch_google(urls, a.days)
        except Exception as e:
            # Never fail the sync over the calendar: the Garmin half matters more.
            print(f"::warning::calendar sync failed, plan left as-is: {e}")
            return 0

    tennis = [e for e in events if classify(e[1])]
    print(f"calendar: {len(events)} events in window, {len(tennis)} racket")
    for d, s, t, cal in sorted(tennis):
        kind, text = classify(s)
        print(f"  {d} {t or '--:--'}  [{cal}] {s!r}  ->  [{kind}] {text}")

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

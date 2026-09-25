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
def fetch_caldav(user, password, days, allow=None):
    """[(date, summary, start)] for VEVENTs in the next `days`.

    `allow` is a set of lower-cased calendar names to read. This account
    shares three calendars — his, his fiancee's, and a joint one — and the
    first live run pulled a padel session off HER calendar into HIS training
    plan. Reading her calendar at all is not something this should do, so the
    allowlist exists; without it the run reads everything and says so loudly.
    """
    import caldav                                    # installed in the workflow
    client = caldav.DAVClient(url=CALDAV_URL, username=user, password=password)
    principal = client.principal()
    start = datetime.datetime.now(datetime.timezone.utc)
    end = start + datetime.timedelta(days=days)
    out = []
    names = []
    for cal in principal.calendars():
        name = str(getattr(cal, "name", "") or "")
        names.append(name)
        if allow is not None and name.lower() not in allow:
            print(f"  – skipping calendar {name!r} (not in ICLOUD_CALENDARS)")
            continue
        try:
            found = cal.search(start=start, end=end, event=True, expand=True)
        except Exception as e:                        # a shared or odd calendar
            print(f"  ! skipped calendar {name!r}: {e}")
            continue
        for ev in found:
            out.extend(_from_ical(ev.data))
    print("  calendars seen: " + ", ".join(repr(n) for n in names))
    if allow is None:
        print("  ::warning::ICLOUD_CALENDARS is not set — reading EVERY shared "
              "calendar, including ones that are not his. Set it to his own.")
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
        raw = os.environ.get("ICLOUD_CALENDARS", "").strip()
        allow = {n.strip().lower() for n in raw.split(",") if n.strip()} or None
        try:
            events = fetch_caldav(user, pw, a.days, allow)
        except Exception as e:
            # Never fail the sync over the calendar: the Garmin half matters more.
            print(f"::warning::calendar sync failed, plan left as-is: {e}")
            return 0

    tennis = [(d, s, t) for d, s, t in events if classify(s)]
    print(f"calendar: {len(events)} events in window, {len(tennis)} tennis")
    for d, s, t in sorted(tennis):
        kind, text = classify(s)
        print(f"  {d} {t or '--:--'}  {s!r}  ->  [{kind}] {text}")

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

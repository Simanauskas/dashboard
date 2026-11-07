#!/usr/bin/env python3
"""
exercise_catalog.py
───────────────────
Saves Garmin's exercise catalog (the names the Sets tab accepts) to
src/log/garmin-exercises.json, so the phone logger's exercise search offers
every Garmin exercise — not just the hand-picked list in src/log/catalog.js.

    python exercise_catalog.py

The catalog is a public file, but connect.garmin.com is reachable only from
GitHub Actions (not from Claude's cloud sessions), so update.yml runs this.
Writes nothing when the catalog is unchanged, and never fails the job: on any
error it keeps the existing file and exits 0.

Format: {"exercises": [["CRUNCH", "CRUNCH"], ["CRUNCH", "BICYCLE_CRUNCH"], …]}
— [category, name] pairs sorted, one per line so diffs stay readable.
"""

from __future__ import annotations
import json
import sys
from pathlib import Path

import requests

CATALOG_URL = "https://connect.garmin.com/web-data/exercises/Exercises.json"
OUT = Path("src/log/garmin-exercises.json")


def render(pairs: list[list[str]]) -> str:
    rows = ",\n".join("  " + json.dumps(p) for p in pairs)
    return '{"exercises": [\n' + rows + "\n]}\n"


def main() -> int:
    try:
        cats = requests.get(CATALOG_URL, timeout=30).json()["categories"]
    except Exception as e:
        print(f"⚠ could not fetch Garmin's exercise catalog ({e}); keeping {OUT}")
        return 0
    pairs = sorted([c, n] for c, v in cats.items() for n in (v.get("exercises") or {}))
    if len(pairs) < 200:      # a truncated or changed response must not wipe the list
        print(f"⚠ catalog has only {len(pairs)} exercises — not trusting it; keeping {OUT}")
        return 0
    text = render(pairs)
    if OUT.exists() and OUT.read_text() == text:
        print(f"exercise catalog unchanged ({len(pairs)} exercises)")
        return 0
    OUT.write_text(text)
    print(f"✓ wrote {OUT}: {len(pairs)} exercises in {len(cats)} categories")
    return 0


if __name__ == "__main__":
    sys.exit(main())

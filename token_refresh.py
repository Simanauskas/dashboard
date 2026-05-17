#!/usr/bin/env python3
"""
Token refresh — simplified for the auth.simas.fit Worker architecture.
The Worker handles all auth renewal. This script just validates the tokens exist.
Manual renewal: visit training.simas.fit → tap 🔑 Renew → enter MFA code.
"""
import garth, os, sys

try:
    garth.resume(os.path.expanduser("~/.garth"))
    # Verify tokens loaded — don't try refresh (Garmin blocks GH Actions IPs)
    if garth.client.oauth2_token and garth.client.oauth1_token:
        print("✓ Tokens loaded from secrets")
    else:
        print("⚠ Tokens incomplete — visit training.simas.fit and tap 🔑 Renew")
        sys.exit(0)  # Don't fail the workflow — update.py will report what it can
except Exception as e:
    print(f"⚠ Token load issue: {e} — visit training.simas.fit and tap 🔑 Renew")
    sys.exit(0)  # Don't fail

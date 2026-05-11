#!/usr/bin/env python3
"""
Standalone token refresh script for GitHub Actions.
Tries refresh with and without MFA token.
"""
import garth, json, os, base64, urllib.request, sys

garth.resume(os.path.expanduser("~/.garth"))

refreshed = False

# Attempt 1: normal refresh
try:
    garth.client.refresh_oauth2()
    garth.save(os.path.expanduser("~/.garth"))
    print("Token refreshed OK (with MFA)")
    refreshed = True
except Exception as e:
    print(f"Refresh with MFA failed: {e}")

# Attempt 2: strip MFA token and retry
if not refreshed:
    try:
        tok = garth.client.oauth1_token
        orig_mfa = tok.mfa_token
        # Temporarily clear MFA token
        object.__setattr__(tok, 'mfa_token', None)
        garth.client.refresh_oauth2()
        object.__setattr__(tok, 'mfa_token', orig_mfa)  # restore
        garth.save(os.path.expanduser("~/.garth"))
        print("Token refreshed OK (without MFA)")
        refreshed = True
    except Exception as e:
        print(f"Refresh without MFA also failed: {e} — using existing tokens")

# Always push current token to GitHub Secrets
try:
    oauth2 = open(os.path.expanduser("~/.garth/oauth2_token.json")).read().strip()
    pat  = os.environ["PAT"]
    repo = os.environ["REPO"]

    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/actions/secrets/public-key",
        headers={"Authorization": f"Bearer {pat}", "Accept": "application/vnd.github+json"}
    )
    key_data = json.loads(urllib.request.urlopen(req).read())
    key_id, pub_key = key_data["key_id"], key_data["key"]

    import subprocess
    subprocess.run([sys.executable, "-m", "pip", "install", "PyNaCl", "-q"])
    from nacl import encoding, public
    pk  = public.PublicKey(pub_key.encode(), encoding.Base64Encoder())
    enc = base64.b64encode(public.SealedBox(pk).encrypt(oauth2.encode())).decode()

    body = json.dumps({"encrypted_value": enc, "key_id": key_id}).encode()
    req2 = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/actions/secrets/GARTH_OAUTH2",
        data=body, method="PUT",
        headers={"Authorization": f"Bearer {pat}", "Accept": "application/vnd.github+json",
                 "Content-Type": "application/json"}
    )
    urllib.request.urlopen(req2)
    print("GARTH_OAUTH2 secret updated in GitHub")
except Exception as e:
    print(f"Secret update failed (non-fatal): {e}")

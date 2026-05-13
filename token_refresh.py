#!/usr/bin/env python3
"""
Fully automatic token refresh for GitHub Actions.
When OAuth exchange fails (Garmin blocks Azure IPs), falls back to:
  1. Full login with email + password
  2. Reads OTP from Gmail via IMAP (using Gmail App Password)
  3. Persists fresh tokens back to GitHub Secrets
"""
import garth, json, os, base64, urllib.request, sys, subprocess, time, re

garth.resume(os.path.expanduser("~/.garth"))
refreshed = False

# ── Attempt 1: OAuth1 exchange ────────────────────────────────────────────────
tok = garth.client.oauth1_token
for label, mfa in [("with MFA", tok.mfa_token), ("without MFA", None)]:
    try:
        object.__setattr__(tok, 'mfa_token', mfa)
        garth.client.refresh_oauth2()
        object.__setattr__(tok, 'mfa_token', tok.mfa_token)
        garth.save(os.path.expanduser("~/.garth"))
        print(f"Token refreshed OK ({label})")
        refreshed = True
        break
    except Exception as e:
        print(f"Exchange {label} failed: {e}")

# ── Attempt 2: Full login + Gmail OTP ────────────────────────────────────────
if not refreshed:
    email    = os.environ.get("GARMIN_EMAIL", "")
    password = os.environ.get("GARMIN_PASSWORD", "")
    gmail_app_password = os.environ.get("GMAIL_APP_PASSWORD", "")

    if not (email and password and gmail_app_password):
        print("Missing credentials — add GARMIN_EMAIL, GARMIN_PASSWORD, GMAIL_APP_PASSWORD to secrets")
    else:
        otp_code = None

        def get_otp_from_gmail():
            """Read Garmin OTP from Gmail via IMAP using App Password."""
            import imaplib, email as emaillib
            print("Waiting 15s for Garmin OTP email to arrive...")
            time.sleep(15)
            for attempt in range(6):  # retry for up to 90s
                try:
                    mail = imaplib.IMAP4_SSL("imap.gmail.com")
                    mail.login("simas.simanauskas@gmail.com", gmail_app_password)
                    mail.select("inbox")
                    # Search for recent Garmin verification emails
                    _, data = mail.search(None, '(FROM "no-reply@garmin.com" SUBJECT "verification" UNSEEN)')
                    ids = data[0].split()
                    if not ids:
                        _, data = mail.search(None, '(FROM "no-reply@garmin.com" UNSEEN SINCE "13-May-2026")')
                        ids = data[0].split()
                    if ids:
                        _, msg_data = mail.fetch(ids[-1], "(RFC822)")
                        msg = emaillib.message_from_bytes(msg_data[0][1])
                        body = ""
                        if msg.is_multipart():
                            for part in msg.walk():
                                if part.get_content_type() == "text/plain":
                                    body = part.get_payload(decode=True).decode()
                                    break
                        else:
                            body = msg.get_payload(decode=True).decode()
                        # Extract 6-digit code
                        codes = re.findall(r'\b(\d{6})\b', body)
                        if codes:
                            mail.store(ids[-1], '+FLAGS', '\\Seen')
                            mail.logout()
                            print(f"Found OTP code in Gmail (attempt {attempt+1})")
                            return codes[0]
                    mail.logout()
                    print(f"No OTP email yet (attempt {attempt+1}/6), waiting 15s...")
                    time.sleep(15)
                except Exception as e:
                    print(f"Gmail IMAP error: {e}")
                    time.sleep(15)
            return None

        try:
            # Trigger login — this will cause Garmin to send the OTP email
            print(f"Starting full Garmin login for {email}...")
            garth.login(email, password, prompt_mfa=get_otp_from_gmail)
            garth.save(os.path.expanduser("~/.garth"))
            print("Token refreshed OK (full login + Gmail OTP)")
            refreshed = True
        except Exception as e:
            print(f"Full login failed: {e}")

# ── Persist tokens to GitHub Secrets ─────────────────────────────────────────
subprocess.run([sys.executable, "-m", "pip", "install", "PyNaCl", "-q"])
from nacl import encoding, public

try:
    pat  = os.environ["PAT"]
    repo = os.environ["REPO"]

    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/actions/secrets/public-key",
        headers={"Authorization": f"Bearer {pat}", "Accept": "application/vnd.github+json"}
    )
    key_data = json.loads(urllib.request.urlopen(req).read())
    key_id, pub_key = key_data["key_id"], key_data["key"]

    def push_secret(name, path):
        val = open(os.path.expanduser(path)).read().strip()
        pk  = public.PublicKey(pub_key.encode(), encoding.Base64Encoder())
        enc = base64.b64encode(public.SealedBox(pk).encrypt(val.encode())).decode()
        body = json.dumps({"encrypted_value": enc, "key_id": key_id}).encode()
        req2 = urllib.request.Request(
            f"https://api.github.com/repos/{repo}/actions/secrets/{name}",
            data=body, method="PUT",
            headers={"Authorization": f"Bearer {pat}", "Accept": "application/vnd.github+json",
                     "Content-Type": "application/json"}
        )
        urllib.request.urlopen(req2)
        print(f"✓ {name} persisted")

    push_secret("GARTH_OAUTH2", "~/.garth/oauth2_token.json")
    push_secret("GARTH_OAUTH1", "~/.garth/oauth1_token.json")

except Exception as e:
    print(f"Secret persistence failed: {e}")

if not refreshed:
    print("⚠ All refresh attempts failed — manual --setup required")
    sys.exit(1)  # fail the workflow step so you notice

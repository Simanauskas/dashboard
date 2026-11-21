# Inbox

One app for WhatsApp, Telegram, Messenger, Instagram and iMessage,
with **one thread per person** no matter which app they write from.

- Each person can have several chats (e.g. WhatsApp + Telegram). Their messages
  are merged into one timeline, each tagged with the app it came from.
- New messages go to the person's **default app**.
- If they wrote to you on another app recently (12 h by default, change it in
  Settings), your reply goes back **there** instead.
- You can always tap "Sending via …" to pick the app by hand. Replying to a
  specific message always goes to the app that message came from.
- No ads, no tracking: everything lives on your own server.

```
 phone / laptop                      your server (Docker)
┌──────────────┐   HTTPS   ┌───────────────────────────────────────────┐
│  Inbox app   │──────────▶│ Synapse (Matrix) ◀─▶ WhatsApp bridge ─────┼─▶ WhatsApp
│ (web app on  │           │        ▲         ◀─▶ Telegram bridge ─────┼─▶ Telegram
│ home screen) │           │        │         ◀─▶ Messenger bridge ────┼─▶ Messenger
└──────────────┘           │    Postgres      ◀─▶ Instagram bridge ────┼─▶ Instagram
                           └───────────────────────────────────────────┘
          iMessage bridge ◀─▶ BlueBubbles app on the Mac ─▶ iMessage
```

The bridges are the open-source [mautrix](https://docs.mau.fi/bridges/) bridges.
The app is in `app/`; the server setup is in `server/`.

## Folders

| Path | What |
|---|---|
| `app/` | The web app (React + Vite). Talks to Matrix directly; no backend of its own. |
| `server/` | `docker-compose.yml` + `setup.sh` for the server. |
| `dev/` | Local test server with a mock bridge (fake contacts on all four apps) and an end-to-end test. |

Which chats belong to the same person, the default app per person and the
reply window are saved on your Matrix account (account data
`fit.simas.inbox.people`), so every device you sign in on sees the same thing.

---

## 1. Set up the server

You need a machine that's always on and has Docker:

- **A small cloud server.** For example, Hetzner CX22 (~€4.50/month, Ubuntu).
  Install Docker with `curl -fsSL https://get.docker.com | sh`.
- **Or the Mac**, if it's new enough to run Docker Desktop. That's free, and
  it's also where iMessage has to run.

Then:

```bash
git clone https://github.com/Simanauskas/inbox && cd inbox/server
cp .env.example .env
nano .env        # set SERVER_NAME, MATRIX_HOST, ADMIN_USER, Telegram keys, tunnel token
./setup.sh       # asks you to choose your password at the end
```

`setup.sh` generates every config file and secret, creates one database per
bridge, wires the bridges into Synapse, creates your account and starts
everything. Re-running it is safe.

### Telegram API keys

Telegram makes each bridge use its own API keys. Go to
<https://my.telegram.org/apps>, log in with your phone number, create an app
(any name), and copy **api_id** and **api_hash** into `.env`.

### Make it reachable over HTTPS (Cloudflare Tunnel, free)

No open ports, no certificates to manage:

1. Cloudflare dashboard → **Zero Trust → Networks → Tunnels → Create a tunnel**
   (type *Cloudflared*). Name it `inbox`.
2. Copy the token from the install command into `CLOUDFLARE_TUNNEL_TOKEN` in `.env`.
3. Add a **Public hostname**: `matrix.simas.fit` → Service `HTTP` → `synapse:8008`.
4. Run `./setup.sh` again (or `docker compose up -d`).

Check it: `https://matrix.simas.fit/_matrix/client/versions` should return JSON.

## 2. Put the app online

Cloudflare Pages, same as your other sites:

- **Create project** → connect `Simanauskas/inbox`, production branch `main`
- **Root directory:** `app` · **Build command:** `npm run build` · **Output:** `dist`
- **Environment variable:** `VITE_HOMESERVER=https://matrix.simas.fit` (pre-fills the login screen)
- **Custom domain:** e.g. `inbox.simas.fit`

On iPhone: open it in Safari → Share → **Add to Home Screen**.

## 3. Connect each app

In the Inbox app go to **Settings → Connected apps** and tap **Open** next
to each app. That opens a chat with the bridge bot:

| App | What to send | Then |
|---|---|---|
| WhatsApp | `login qr` | WhatsApp on your phone → Settings → Linked devices → Link a device → scan the code. History from the last year comes in. |
| Telegram | `login` | Enter your phone number, then the code Telegram sends you (and your 2FA password if you have one). |
| Messenger | `login` | Pick a method. Username and password is easiest. If Facebook complains, use the messenger.com cookie method the bot describes. |
| Instagram | `login` | The bot asks for cookies from instagram.com: log in on a computer, open the browser's developer tools → Application → Cookies, and copy the values it asks for. |

Your chats start appearing within a minute. Then tap the banner
**"N people are on more than one app"** to combine people's chats, and pick
each person's default app.

> WhatsApp, Messenger and Instagram don't officially allow third-party apps.
> The bridges act like a linked device or a browser login. Lots of people
> use them, but expect an occasional "confirm it's you" prompt.

## 4. iMessage

iMessage only exists on Apple devices, so a Mac signed in to your Apple ID
has to stay on. It runs the free **BlueBubbles Server** app, and the iMessage
bridge on your server talks to it. When the server runs on that same Mac,
nothing else is needed.

1. On the Mac, open **Messages** and check you're signed in and can send and receive.
2. Download **BlueBubbles Server** for macOS from <https://bluebubbles.app/downloads/>
   and open it. Give it the permissions it asks for (Full Disk Access, Accessibility).
3. In its setup, choose a **server password**. You don't need its proxy or
   Cloudflare option if the Inbox server runs on the same Mac. Leave the port at `1234`.
4. Put that password in `server/.env` as `BLUEBUBBLES_PASSWORD`, then run `./setup.sh` again.
5. In the Inbox app, Settings → Connected apps → iMessage → **Open**: the bot
   should say it's connected. Chats from the last 90 days come in with their history.

Keep the Mac awake: System Preferences → Battery → Power Adapter → turn on
"Prevent computer from sleeping automatically when the display is off", and
keep the lid open.

**Replies, reactions, read receipts and typing indicators** sent *from* Inbox
need BlueBubbles' optional "Private API". That means switching off a macOS
protection (SIP) on the Mac; BlueBubbles' docs walk through it. Without it,
texts, photos and files work both ways, and you still *see* their reactions
and replies.

**If the server later moves off the Mac** (e.g. to a rented server), turn on
BlueBubbles' Cloudflare option, copy its URL into `BLUEBUBBLES_URL` in `.env`,
and run `./setup.sh` again.

## Updating

```bash
cd server && docker compose pull && docker compose up -d
```

Bridges need updating every few weeks, because the apps change their
protocols. If a bridge stops working, updating usually fixes it.

## Backups

Everything is in `server/data/` (database, configs, media). Back up that
folder, or at least `docker compose exec postgres pg_dumpall -U synapse`.

---

## Developing locally

Needs Docker and Node 20+.

```bash
dev/reset.sh                 # local Synapse on :8008 with fake WhatsApp/Telegram/IG/Messenger chats
cd app && npm install && npm run dev   # http://localhost:5180 → server http://localhost:8008, simas / test1234
npm test                     # unit tests for merging + channel picking
node ../dev/e2e.mjs          # browser test of the whole flow (needs the dev server + npm run dev)
python3 dev/mockbridge.py say whatsapp rokas "hello"   # fake an incoming message
```

## Not done yet

- **Push notifications when the app is closed.** Right now you get
  notifications only while it's open in the background. Next step: a
  push gateway (Sygnal) on the server plus Web Push in the app.
- **Starting a brand-new chat** with someone you've never messaged on that
  app. For now you can do it from the bridge bot (`help` lists the commands).
- **Voice message recording**. Playing voice messages works; recording them doesn't yet.

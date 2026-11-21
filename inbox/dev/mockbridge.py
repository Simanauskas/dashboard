#!/usr/bin/env python3
"""Fake bridge for local development.

Pretends to be the mautrix WhatsApp / Telegram / Instagram / Messenger bridges:
creates "ghost" users, bridged DM rooms (with the same m.bridge state the real
bridges set), a group chat, and a few weeks of history. Uses only the stdlib.

  python3 mockbridge.py seed                      # create everything
  python3 mockbridge.py say whatsapp rokas "hi"   # inbound message, now
  python3 mockbridge.py rooms                     # list seeded rooms

Talks to the dev Synapse on localhost:8008 using the appservice token in
data/mockbridge.yaml.
"""
import json, re, sys, time, urllib.parse, urllib.request, uuid, zlib, struct
from pathlib import Path

HERE = Path(__file__).parent
HS = "http://localhost:8008"
DOMAIN = "inbox.test"
ME = f"@simas:{DOMAIN}"
STATE = HERE / "data" / "mock-state.json"
AS_TOKEN = re.search(r'as_token:\s*"([^"]+)"', (HERE / "data" / "mockbridge.yaml").read_text()).group(1)

NETWORKS = {
    "whatsapp": {"displayname": "WhatsApp", "url": "https://www.whatsapp.com/"},
    "telegram": {"displayname": "Telegram", "url": "https://telegram.org/"},
    "instagram": {"displayname": "Instagram", "url": "https://www.instagram.com/"},
    "facebook": {"displayname": "Messenger", "url": "https://www.messenger.com/"},
}

# person key -> {network: (remote id, display name the network shows)}
PEOPLE = {
    "rokas": {"whatsapp": ("37061234567", "Rokas Petrauskas"), "telegram": ("118822", "Rokas Petrauskas")},
    "ilona": {"whatsapp": ("37069876543", "Ilona"), "instagram": ("ilona.rad", "Ilona"), "facebook": ("10001", "Ilona")},
    "tomas": {"facebook": ("10002", "Tomas Kazlauskas")},
    "mantas": {"telegram": ("553311", "Mantas J."), "instagram": ("mantas_j", "mantas_j")},
    "egle": {"whatsapp": ("37065554433", "Eglė Žemaitė"), "telegram": ("771100", "Egle Zemaite")},
}

DAY = 86400_000


def req(method, path, body=None, user=None, ts=None, token=AS_TOKEN, raw=None, ctype="application/json"):
    q = {}
    if user:
        q["user_id"] = user
    if ts:
        q["ts"] = str(int(ts))
    url = HS + path + (("&" if "?" in path else "?") + urllib.parse.urlencode(q) if q else "")
    data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
    r = urllib.request.Request(url, data=data, method=method,
                               headers={"Authorization": f"Bearer {token}", "Content-Type": ctype})
    try:
        with urllib.request.urlopen(r) as resp:
            return json.loads(resp.read() or b"{}")
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        if "M_USER_IN_USE" in err:
            return {}
        raise SystemExit(f"{method} {path} -> {e.code} {err}")


def ghost(net, rid):
    return f"@{net}_{rid.replace('.', '_')}:{DOMAIN}"


def bot(net):
    return f"@{net}bot:{DOMAIN}"


def ensure_user(uid, name=None):
    req("POST", "/_matrix/client/v3/register", {"type": "m.login.application_service", "username": uid[1:].split(":")[0]})
    if name:
        req("PUT", f"/_matrix/client/v3/profile/{urllib.parse.quote(uid)}/displayname", {"displayname": name}, user=uid)


def bridge_state(net, channel_id, channel_name, room_type):
    content = {
        "bridgebot": bot(net), "creator": bot(net),
        "protocol": {"id": net, "displayname": NETWORKS[net]["displayname"], "external_url": NETWORKS[net]["url"]},
        "channel": {"id": channel_id, "displayname": channel_name},
    }
    if room_type:
        content["com.beeper.room_type"] = room_type
    key = f"fi.mau.{net}://{net}/{channel_id}"
    return [{"type": t, "state_key": key, "content": content} for t in ("m.bridge", "uk.half-shot.bridge")]


def make_room(net, creator, members, name, channel_id, room_type, direct):
    ensure_user(bot(net), f"{NETWORKS[net]['displayname']} bridge bot")
    body = {
        "preset": "private_chat", "invite": [ME, bot(net)] + [m for m in members if m != creator],
        "is_direct": direct, "initial_state": bridge_state(net, channel_id, name, room_type),
    }
    if name and not direct:
        body["name"] = name
    if direct:
        body["name"] = name  # real bridges set the DM room name to the contact name
    room = req("POST", "/_matrix/client/v3/createRoom", body, user=creator)["room_id"]
    for u in [ME, bot(net)] + members:
        if u != creator:
            req("POST", f"/_matrix/client/v3/join/{urllib.parse.quote(room)}", {}, user=u)
    if direct:
        # what double puppeting does: mark it as a DM in the user's m.direct
        cur = {}
        try:
            cur = req("GET", f"/_matrix/client/v3/user/{urllib.parse.quote(ME)}/account_data/m.direct", user=ME)
        except SystemExit:
            pass
        cur.setdefault(creator, []).append(room)
        req("PUT", f"/_matrix/client/v3/user/{urllib.parse.quote(ME)}/account_data/m.direct", cur, user=ME)
    return room


def send(room, sender, content, ts=None):
    txn = uuid.uuid4().hex
    return req("PUT", f"/_matrix/client/v3/rooms/{urllib.parse.quote(room)}/send/m.room.message/{txn}",
               content, user=sender, ts=ts)["event_id"]


def text(body):
    return {"msgtype": "m.text", "body": body}


def png(w, h, rgb):
    raw = b"".join(b"\x00" + bytes(rgb) * w for _ in range(h))
    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xffffffff)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b""))


def upload_image(sender, rgb):
    data = png(320, 200, rgb)
    url = HS + "/_matrix/media/v3/upload?" + urllib.parse.urlencode({"filename": "photo.png", "user_id": sender})
    rq = urllib.request.Request(url, data=data, method="POST", headers={"Authorization": f"Bearer {AS_TOKEN}", "Content-Type": "image/png"})
    with urllib.request.urlopen(rq) as resp:
        mxc = json.loads(resp.read())["content_uri"]
    return {"msgtype": "m.image", "body": "photo.png", "url": mxc,
            "info": {"mimetype": "image/png", "w": 320, "h": 200, "size": len(data)}}


def seed():
    if STATE.exists():
        raise SystemExit("already seeded (delete data/mock-state.json and reset Synapse to reseed)")
    now = time.time() * 1000
    state = {"rooms": {}}
    for person, nets in PEOPLE.items():
        for i, (net, (rid, name)) in enumerate(nets.items()):
            g = ghost(net, rid)
            ensure_user(g, name)
            # every other room omits com.beeper.room_type so the app's DM heuristics get exercised
            room = make_room(net, g, [g], name, rid, "dm" if i % 2 == 0 else None, True)
            state["rooms"][f"{net}:{person}"] = room
            print(f"{net:9} {person:7} {room}")

    def S(key, who, content, days_ago, hours=0):
        room = state["rooms"][key]
        net, person = key.split(":")
        sender = ME if who == "me" else ghost(net, PEOPLE[person][net][0])
        return send(room, sender, text(content) if isinstance(content, str) else content, now - days_ago * DAY + hours * 3600_000)

    S("whatsapp:rokas", "them", "Ar žaidžiam tenisą ketvirtadienį?", 12)
    S("whatsapp:rokas", "me", "Taip, 19:00 SEB arenoje", 12, 0.2)
    S("telegram:rokas", "them", "Sent you the hyrox training plan pdf, check telegram", 9)
    S("telegram:rokas", "me", "Got it, thanks!", 9, 1)
    S("whatsapp:rokas", "them", "Rezultatas 6:4 4:6 10:7 😅", 5)
    S("whatsapp:rokas", "me", "Next week revenge", 5, 0.5)
    S("whatsapp:rokas", "them", upload_image(ghost("whatsapp", "37061234567"), (40, 140, 90)), 2)
    S("telegram:rokas", "them", "Are you in for the sim on Saturday?", 0, -3)

    S("facebook:ilona", "them", "Ką darom savaitgalį?", 20)
    S("whatsapp:ilona", "them", "Nupirk pieno grįžtant 🥛", 3)
    S("whatsapp:ilona", "me", "Gerai!", 3, 0.1)
    S("instagram:ilona", "them", "Look at this place 😍 instagram.com/p/xyz", 1)
    S("instagram:ilona", "me", "Wow, let's go", 1, 0.3)

    S("facebook:tomas", "them", "Labas, ar dar parduodi dviratį?", 30)
    S("facebook:tomas", "me", "Jau pardaviau, sorry", 29)

    S("telegram:mantas", "them", "Bro, sauna after training?", 4)
    S("instagram:mantas", "them", "😂😂 this reel", 2)

    S("whatsapp:egle", "them", "Sveikas! Ar gali atsiųsti sąskaitą?", 6)
    S("telegram:egle", "me", "Atsiunčiau per telegram", 6, 2)

    # a WhatsApp group
    members = [ghost("whatsapp", PEOPLE[p]["whatsapp"][0]) for p in ("rokas", "ilona", "egle")]
    grp = make_room("whatsapp", members[0], members, "Hyrox crew 🏋️", "120363000@g.us", "group", False)
    state["rooms"]["whatsapp:group"] = grp
    send(grp, members[0], text("Who's racing Vilnius?"), now - 1 * DAY)
    send(grp, ME, text("Me! Pro division"), now - 1 * DAY + 600_000)
    send(grp, members[2], text("I'll come cheer 📣"), now - 1 * DAY + 900_000)

    # bridge management room (where you log in to WhatsApp etc.)
    ensure_user(bot("whatsapp"), "WhatsApp bridge bot")
    mgmt = req("POST", "/_matrix/client/v3/createRoom", {"preset": "private_chat", "invite": [ME], "is_direct": True}, user=bot("whatsapp"))["room_id"]
    req("POST", f"/_matrix/client/v3/join/{urllib.parse.quote(mgmt)}", {}, user=ME)
    send(mgmt, bot("whatsapp"), {"msgtype": "m.notice", "body": "Successfully logged in as +37060000000"})
    state["rooms"]["whatsapp:bot"] = mgmt

    STATE.write_text(json.dumps(state, indent=2))
    print("seeded", len(state["rooms"]), "rooms")


def say(net, person, body):
    state = json.loads(STATE.read_text())
    room = state["rooms"][f"{net}:{person}"]
    ev = send(room, ghost(net, PEOPLE[person][net][0]), text(body))
    print(ev)


def messages(net, person, limit=5):
    """Last messages in a seeded room (used by the e2e test to check routing)."""
    state = json.loads(STATE.read_text())
    room = state["rooms"][f"{net}:{person}"]
    r = req("GET", f"/_matrix/client/v3/rooms/{urllib.parse.quote(room)}/messages?dir=b&limit={limit}", user=ME)
    for ev in r["chunk"]:
        if ev["type"] == "m.room.message":
            print(json.dumps({"sender": ev["sender"], "body": ev["content"].get("body")}, ensure_ascii=False))


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "seed"
    if cmd == "seed":
        seed()
    elif cmd == "say":
        say(sys.argv[2], sys.argv[3], " ".join(sys.argv[4:]))
    elif cmd == "rooms":
        print(STATE.read_text())
    elif cmd == "messages":
        messages(sys.argv[2], sys.argv[3])
    else:
        raise SystemExit(__doc__)

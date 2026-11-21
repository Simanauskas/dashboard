import React, { useState } from 'react'
import { go, back } from '../router.js'
import { PEOPLE_TYPE } from '../matrix.js'
import { normConfig } from '../people.js'
import { NetBadge, TopBar } from './common.jsx'

// bot user names the server setup script gives each bridge
const BRIDGES = [
  { net: 'whatsapp', bot: 'whatsappbot', how: 'Send "login qr", then scan the code in WhatsApp: Settings, Linked devices, Link a device.' },
  { net: 'telegram', bot: 'telegrambot', how: 'Send "login" and follow the steps (phone number, then the code Telegram sends you).' },
  { net: 'facebook', bot: 'facebookbot', how: 'Send "login", then pick a method. Username and password is easiest; the setup guide covers the cookie method.' },
  { net: 'instagram', bot: 'instagrambot', how: 'Send "login" and follow the steps. It asks for cookies from instagram.com; the setup guide shows how.' },
  { net: 'imessage', bot: 'imessagebot', how: 'Works through the BlueBubbles app on your Mac. Once that is set up it connects by itself; open this to check it is connected.' },
]
const WINDOWS = [1, 3, 6, 12, 24, 48, 168]

export default function Settings({ ctx }) {
  const { client, model, onLogout } = ctx
  const cfg = normConfig(client.accountData[PEOPLE_TYPE])
  const [perm, setPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported')
  const [busy, setBusy] = useState(null)
  const [err, setErr] = useState(null)
  const server = client.userId.split(':').slice(1).join(':')

  async function openBridge(b) {
    const botId = `@${b.bot}:${server}`
    const existing = model.connections.find((c) => client.rooms[c.rooms[0]]?.members[botId] || client.rooms[c.rooms[0]]?.heroes.includes(botId))
    if (existing) return go('t', existing.key)
    setBusy(b.net)
    setErr(null)
    try {
      const roomId = await client.createDM(botId)
      // wait for the room to show up in sync
      for (let i = 0; i < 40 && !client.rooms[roomId]; i++) await new Promise((r) => setTimeout(r, 250))
      await client.send(roomId, { msgtype: 'm.text', body: 'help' }).catch(() => {})
      go('t', `r:${roomId}`)
    } catch (e) {
      setErr(`Couldn't reach the ${b.net} bridge (${e.message}). Is it running on the server?`)
    } finally { setBusy(null) }
  }

  return (
    <div className="page settings">
      <TopBar onBack={back} title="Settings" />
      <div className="scroll">
        <h3 className="section">Replies</h3>
        <div className="card">
          <label className="setting">
            <span>Reply on the app they last wrote from, if it was within</span>
            <select value={cfg.replyWindowHours} onChange={(e) => client.setAccountData(PEOPLE_TYPE, { ...cfg, replyWindowHours: Number(e.target.value) })}>
              {WINDOWS.map((h) => <option key={h} value={h}>{h < 24 ? `${h} h` : h === 168 ? '1 week' : `${h / 24} days`}</option>)}
            </select>
          </label>
          <p className="hint">After that, new messages go to the person's default app.</p>
        </div>

        <h3 className="section">Notifications</h3>
        <div className="card">
          {perm === 'granted' ? <p>On while the app is open in the background.</p>
            : perm === 'unsupported' ? <p className="muted">This browser doesn't support notifications. On iPhone, add Inbox to your Home Screen first.</p>
            : <button className="wide-btn" onClick={() => Notification.requestPermission().then(setPerm)}>Turn on notifications</button>}
        </div>

        <h3 className="section">Connected apps</h3>
        <p className="hint">Each app is connected through a bridge bot on your server. Open one and follow its instructions to log in.</p>
        {err && <p className="error">{err}</p>}
        <ul className="card-list">
          {BRIDGES.map((b) => (
            <li key={b.net} className="channel-row">
              <NetBadge net={b.net} label />
              <span className="grow muted small">{b.how}</span>
              <button className="pill" disabled={busy === b.net} onClick={() => openBridge(b)}>{busy === b.net ? '…' : 'Open'}</button>
            </li>
          ))}
        </ul>
        {model.connections.length > 0 && <>
          <h3 className="section">Bridge chats</h3>
          <ul className="card-list">
            {model.connections.map((c) => (
              <li key={c.key}><button className="row" onClick={() => go('t', c.key)}><span className="grow">{c.name}</span></button></li>
            ))}
          </ul>
        </>}

        <h3 className="section">Account</h3>
        <div className="card">
          <p>Signed in as <b>{client.userId}</b></p>
          <p className="muted small">{client.baseUrl}</p>
          <button className="wide-btn danger" onClick={async () => { await client.logout(); onLogout() }}>Sign out</button>
        </div>
      </div>
    </div>
  )
}

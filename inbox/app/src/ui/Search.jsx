import React, { useState } from 'react'
import { go, back } from '../router.js'
import { stripReply } from '../people.js'
import { Avatar, NetBadge, TopBar, timeShort } from './common.jsx'

export default function Search({ ctx }) {
  const { client, model } = ctx
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function run(e) {
    e.preventDefault()
    if (!q.trim()) return
    setBusy(true)
    setErr(null)
    try { setResults(await client.search(q.trim())) } catch (er) { setErr(er.message) } finally { setBusy(false) }
  }

  const itemFor = (roomId) => model.items.find((i) => i.rooms.includes(roomId)) || model.connections.find((i) => i.rooms.includes(roomId))

  return (
    <div className="page search-page">
      <TopBar onBack={back} title="Search messages" />
      <form onSubmit={run} className="inbox-tools">
        <input className="search" autoFocus placeholder="Search all apps" value={q} onChange={(e) => setQ(e.target.value)} enterKeyHint="search" />
      </form>
      <div className="scroll">
        {busy && <div className="empty"><div className="spinner" /></div>}
        {err && <p className="error">{err}</p>}
        {results && !busy && !results.length && <p className="empty">No messages found.</p>}
        <ul className="list">
          {(results || []).map(({ result: ev }) => {
            const item = itemFor(ev.room_id)
            if (!item) return null
            const net = model.info[ev.room_id]?.network
            return (
              <li key={ev.event_id}>
                <button className="row" onClick={() => go('t', item.key)}>
                  <Avatar client={client} mxc={item.avatarUrl} name={item.name} size={40} />
                  <div className="row-main">
                    <div className="row-top"><span className="row-name">{item.name}</span><span className="row-time">{timeShort(ev.origin_server_ts)}</span></div>
                    <div className="row-bottom"><NetBadge net={net} /><span className="row-preview">{ev.sender === client.userId ? 'You: ' : ''}{stripReply(ev.content?.body || '')}</span></div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

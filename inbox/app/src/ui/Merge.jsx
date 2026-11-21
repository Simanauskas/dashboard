import React, { useState } from 'react'
import { back } from '../router.js'
import { PEOPLE_TYPE } from '../matrix.js'
import { mergePeople, dismissSuggestion, normConfig } from '../people.js'
import { Avatar, NetBadge, TopBar, identityOf, timeShort } from './common.jsx'

export default function Merge({ ctx }) {
  const { client, sugg } = ctx
  const [err, setErr] = useState(null)

  // apply several suggestions in one account-data write
  function apply(list) {
    let c = normConfig(client.accountData[PEOPLE_TYPE])
    for (const s of list) c = mergePeople(c, s.members, s.name, s.defaultRoom || mostRecentRoom(ctx, s)).config
    client.setAccountData(PEOPLE_TYPE, c).catch((e) => setErr(e.message))
  }

  return (
    <div className="page merge">
      <TopBar onBack={back} title="Combine chats" right={sugg.length > 1 && <button className="text-btn" onClick={() => apply(sugg)}>Combine all</button>} />
      <div className="scroll">
        <p className="hint">These look like the same person on different apps. Combining them gives you one thread with all the history. Pick the app new messages should go to by default.</p>
        {err && <p className="error">{err}</p>}
        {sugg.map((s) => <Suggestion key={s.key} ctx={ctx} s={s} onMerge={(name, def) => apply([{ ...s, name, defaultRoom: def }])}
          onDismiss={() => client.setAccountData(PEOPLE_TYPE, dismissSuggestion(client.accountData[PEOPLE_TYPE], s.key)).catch((e) => setErr(e.message))} />)}
        {!sugg.length && <p className="empty">Nothing to combine right now. You can link chats by hand from a contact's page.</p>}
      </div>
    </div>
  )
}

function mostRecentRoom(ctx, s) {
  return [...s.rooms].sort((a, b) => ctx.model.info[b].lastTs - ctx.model.info[a].lastTs)[0]
}

function Suggestion({ ctx, s, onMerge, onDismiss }) {
  const { client, model } = ctx
  const [name, setName] = useState(s.name)
  const [def, setDef] = useState(() => s.members.find((m) => m.defaultRoom)?.defaultRoom || mostRecentRoom(ctx, s))
  return (
    <div className="card sugg">
      <div className="sugg-head">
        <Avatar client={client} mxc={s.members.find((m) => m.avatarUrl)?.avatarUrl} name={name} size={44} />
        <input className="name-input small" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" />
      </div>
      <ul className="card-list">
        {s.rooms.map((id) => (
          <li key={id} className="channel-row">
            <label className="grow radio">
              <input type="radio" name={`def-${s.key}`} checked={def === id} onChange={() => setDef(id)} />
              <NetBadge net={model.info[id].network} label />
              <span className="grow">{identityOf(client, model.info, id)}<span className="muted small"> · {timeShort(model.info[id].lastTs)}</span></span>
              {def === id && <span className="tag">default</span>}
            </label>
          </li>
        ))}
      </ul>
      <div className="sugg-actions">
        <button className="text-btn" onClick={onDismiss}>Not the same person</button>
        <button className="primary" onClick={() => onMerge(name.trim() || s.name, def)}>Combine</button>
      </div>
    </div>
  )
}

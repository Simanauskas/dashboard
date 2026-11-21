import React, { useEffect, useMemo, useState } from 'react'
import { go, back } from '../router.js'
import { PEOPLE_TYPE } from '../matrix.js'
import { linkRoom, unlinkRoom, setDefault, renamePerson, mergePeople, normName } from '../people.js'
import { Avatar, NetBadge, TopBar, identityOf, timeShort } from './common.jsx'

export default function Person({ ctx, item }) {
  const { client, model } = ctx
  const [name, setName] = useState(item.name)
  const [picking, setPicking] = useState(false)
  const [q, setQ] = useState('')
  const [err, setErr] = useState(null)
  const cfg = client.accountData[PEOPLE_TYPE]
  const save = (c) => client.setAccountData(PEOPLE_TYPE, c).catch((e) => setErr(e.message))

  useEffect(() => { for (const id of item.rooms) client.loadMembers(id) }, [item.key])
  useEffect(() => setName(item.name), [item.name])

  const candidates = useMemo(() => {
    const nq = normName(q)
    return model.items.filter((i) => i.key !== item.key && i.kind === 'person' && (!nq || normName(i.name).includes(nq)))
  }, [model, q, item.key])

  function rename() {
    const n = name.trim()
    if (n && n !== item.name) save(renamePerson(cfg, item, n))
  }

  function link(other) {
    // keep this person's id, pull in all of the other entry's chats
    const { config, personId } = mergePeople(cfg, [item, other], item.name, item.defaultRoom || item.rooms[0])
    save(config)
    setPicking(false)
    go('p', `p:${personId}`)
  }

  function unlink(roomId) {
    if (!item.personId) return
    save(unlinkRoom(cfg, item.personId, roomId))
  }

  return (
    <div className="page person">
      <TopBar onBack={back} title="Contact" right={<button className="text-btn" onClick={() => go('t', item.key)}>Chat</button>} />
      <div className="scroll">
        <div className="person-head">
          <Avatar client={client} mxc={item.avatarUrl} name={item.name} size={80} />
          {item.kind === 'person'
            ? <input className="name-input" value={name} onChange={(e) => setName(e.target.value)} onBlur={rename} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} aria-label="Name" />
            : <h2>{item.name}</h2>}
        </div>
        {err && <p className="error">{err}</p>}

        <h3 className="section">Apps</h3>
        <p className="hint">New messages go to the <b>default</b> app. If they write to you on another app, your reply goes back there.</p>
        <ul className="card-list">
          {item.rooms.map((id) => {
            const info = model.info[id]
            const isDefault = item.defaultRoom === id
            return (
              <li key={id} className="channel-row">
                <NetBadge net={info.network} label />
                <div className="grow">
                  <div>{identityOf(client, model.info, id)}</div>
                  <div className="muted small">Last message {timeShort(info.lastTs) || 'never'}</div>
                </div>
                {item.rooms.length > 1 && (
                  <div className="row-actions">
                    <button className={`pill ${isDefault ? 'on' : ''}`} onClick={() => save(setDefault(cfg, item, id))} aria-pressed={isDefault}>
                      {isDefault ? 'Default' : 'Make default'}
                    </button>
                    {item.personId && <button className="text-btn danger" onClick={() => unlink(id)}>Unlink</button>}
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {item.kind === 'person' && (picking ? (
          <div className="picker">
            <input className="search" autoFocus placeholder="Search chats to add" value={q} onChange={(e) => setQ(e.target.value)} />
            <ul className="list">
              {candidates.slice(0, 50).map((i) => (
                <li key={i.key}>
                  <button className="row" onClick={() => link(i)}>
                    <Avatar client={client} mxc={i.avatarUrl} name={i.name} size={36} />
                    <div className="row-main"><div className="row-top"><span className="row-name">{i.name}</span></div>
                      <div className="row-bottom"><span className="nets">{i.networks.map((n) => <NetBadge key={n} net={n} label />)}</span></div></div>
                  </button>
                </li>
              ))}
            </ul>
            <button className="text-btn" onClick={() => setPicking(false)}>Cancel</button>
          </div>
        ) : (
          <button className="wide-btn" onClick={() => setPicking(true)}>+ Add a chat from another app</button>
        ))}
      </div>
    </div>
  )
}

import React, { useMemo, useState } from 'react'
import { go } from '../router.js'
import { previewText, normName } from '../people.js'
import { Avatar, NetBadge, TopBar, Icon, timeShort } from './common.jsx'

export default function Inbox({ ctx, selected }) {
  const { client, model, sugg } = ctx
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')

  const nets = useMemo(() => [...new Set(model.items.flatMap((i) => i.networks))], [model])
  const items = useMemo(() => {
    const nq = normName(q)
    return model.items.filter((i) => {
      if (filter === 'unread' && !i.unread) return false
      if (filter === 'groups' && i.kind !== 'group') return false
      if (!['all', 'unread', 'groups'].includes(filter) && !i.networks.includes(filter)) return false
      return !nq || normName(i.name).includes(nq)
    })
  }, [model, q, filter])

  return (
    <div className="page inbox">
      <TopBar
        title="Inbox"
        right={<>
          <button className="icon-btn" onClick={() => go('search')} aria-label="Search messages"><Icon name="search" /></button>
          <button className="icon-btn" onClick={() => go('settings')} aria-label="Settings"><Icon name="gear" /></button>
        </>}
      />
      <StatusLine client={client} />
      <div className="inbox-tools">
        <input className="search" placeholder="Find a person" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="chips">
          {['all', 'unread', ...nets, 'groups'].map((f) => (
            <button key={f} className={`chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : f === 'groups' ? 'Groups' : <NetBadge net={f} label />}
            </button>
          ))}
        </div>
      </div>
      {sugg.length > 0 && (
        <button className="banner" onClick={() => go('merge')}>
          <Icon name="people" />
          <span><b>{sugg.length} {sugg.length === 1 ? 'person is' : 'people are'} on more than one app.</b> Combine their chats into one thread.</span>
        </button>
      )}
      <ul className="list">
        {items.map((i) => (
          <li key={i.key}>
            <button className={`row ${selected === i.key ? 'selected' : ''}`} onClick={() => go('t', i.key)}>
              <Avatar client={client} mxc={i.avatarUrl} name={i.name} />
              <div className="row-main">
                <div className="row-top">
                  <span className={`row-name ${i.unread ? 'bold' : ''}`}>{i.name}</span>
                  <span className="row-time">{timeShort(i.lastTs)}</span>
                </div>
                <div className="row-bottom">
                  <span className="nets">{i.networks.map((n) => <NetBadge key={n} net={n} />)}</span>
                  <span className={`row-preview ${i.unread ? 'bold' : ''}`}>{i.typing ? <i>typing…</i> : previewText(i.lastEvent, client.userId)}</span>
                  {i.unread > 0 && <span className="badge">{i.unread}</span>}
                </div>
              </div>
            </button>
          </li>
        ))}
        {client.synced && !items.length && (
          <li className="empty">{model.items.length ? 'No matches.' : <>No chats yet. Connect an app in <a href="#/settings">Settings</a>.</>}</li>
        )}
        {!client.synced && <li className="empty"><div className="spinner" /></li>}
      </ul>
    </div>
  )
}

function StatusLine({ client }) {
  if (client.status === 'live' || client.status === 'connecting') return null
  return <div className="status-line">{client.status === 'offline' ? 'Offline. Reconnecting…' : 'Server error. Retrying…'}</div>
}

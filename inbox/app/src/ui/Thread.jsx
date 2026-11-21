import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { go, back } from '../router.js'
import { chooseChannel, mergedTimeline, stripReply, previewText } from '../people.js'
import { networkInfo } from '../networks.js'
import { Avatar, NetBadge, TopBar, Icon, useMedia, ago, identityOf } from './common.jsx'

// manual channel picks survive navigating away and back (per person, this session)
const overrides = new Map()
const QUICK = ['👍', '❤️', '😂', '😮', '😢', '🙏']

export default function Thread({ ctx, item }) {
  const { client, model } = ctx
  const rooms = client.rooms
  const me = client.userId
  const multi = item.rooms.length > 1
  const isGroup = item.kind === 'group'
  const { entries, hasMore } = mergedTimeline(item, rooms)
  const scroller = useRef(null)
  const atBottom = useRef(true)
  const [loading, setLoading] = useState(false)
  const [replyTo, setReplyTo] = useState(null) // { ev, roomId }
  const [active, setActive] = useState(null) // event id with open action bar
  const [, tick] = useState(0)

  const override = overrides.get(item.key)
  const choice = chooseChannel(item, rooms, me, { override, windowHours: model.config.replyWindowHours })
  const target = replyTo?.roomId || choice.roomId

  async function loadOlder() {
    if (loading) return
    const pending = item.rooms.map((id) => rooms[id]).filter((r) => r && !r.reachedStart)
    if (!pending.length) return
    // the room whose loaded history ends most recently is the one holding the view back
    const oldest = (r) => r.timeline.find((e) => !e.local)?.origin_server_ts ?? Infinity
    pending.sort((a, b) => oldest(b) - oldest(a))
    setLoading(true)
    const el = scroller.current
    const before = el ? el.scrollHeight - el.scrollTop : 0
    try { await client.paginate(pending[0].id) } catch {}
    setLoading(false)
    requestAnimationFrame(() => { if (el && !atBottom.current) el.scrollTop = el.scrollHeight - before })
  }

  // fill the screen with history on open
  useEffect(() => {
    if (entries.length < 25 && hasMore && !loading) loadOlder()
  })

  // stick to the bottom as messages arrive
  useLayoutEffect(() => {
    const el = scroller.current
    if (el && atBottom.current) el.scrollTop = el.scrollHeight
  })

  // read receipts while you're looking at it (bridges pass them on to the apps)
  useEffect(() => {
    if (document.visibilityState !== 'visible') return
    for (const id of item.rooms) if (rooms[id]) client.markRead(id)
  }, [ctx.version, item.key])
  useEffect(() => {
    const on = () => { if (document.visibilityState === 'visible') for (const id of item.rooms) client.markRead(id) }
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [item.key])

  // refresh "2h ago" labels
  useEffect(() => { const t = setInterval(() => tick((x) => x + 1), 60000); return () => clearInterval(t) }, [])

  function onScroll(e) {
    const el = e.currentTarget
    atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    if (el.scrollTop < 200 && hasMore) loadOlder()
  }

  const typing = item.rooms.flatMap((id) => (rooms[id]?.typing || []).filter((u) => u !== me).map((u) => ({ u, id })))
  const sub = multi ? item.networks.map((n) => <NetBadge key={n} net={n} />) : <NetBadge net={model.info[item.rooms[0]]?.network} label />

  return (
    <div className="page thread">
      <TopBar onBack={back}>
        <button className="thread-head" onClick={() => go('p', item.key)}>
          <Avatar client={client} mxc={item.avatarUrl} name={item.name} size={36} />
          <div>
            <h1>{item.name}</h1>
            <div className="thread-sub">{typing.length ? <i>typing…</i> : sub}</div>
          </div>
        </button>
      </TopBar>
      <div className="timeline" ref={scroller} onScroll={onScroll} onClick={() => setActive(null)}>
        {hasMore ? <div className="older">{loading ? <div className="spinner small" /> : <button onClick={loadOlder}>Load older messages</button>}</div>
          : <div className="older muted">Start of your history</div>}
        {entries.map((en, idx) => {
          const prev = entries[idx - 1]
          const next = entries[idx + 1]
          const day = !prev || new Date(prev.ev.origin_server_ts).toDateString() !== new Date(en.ev.origin_server_ts).toDateString()
          const switched = multi && (!prev || prev.roomId !== en.roomId || day)
          const first = day || switched || !prev || prev.ev.sender !== en.ev.sender || en.ev.origin_server_ts - prev.ev.origin_server_ts > 300000
          const last = !next || next.ev.sender !== en.ev.sender || next.roomId !== en.roomId || next.ev.origin_server_ts - en.ev.origin_server_ts > 300000
          return (
            <React.Fragment key={en.ev.event_id}>
              {day && <div className="day"><span>{dayLabel(en.ev.origin_server_ts)}</span></div>}
              <Bubble
                ctx={ctx} en={en} mine={en.ev.sender === me} first={first} last={last} showNet={switched} multi={multi}
                showSender={isGroup && first && en.ev.sender !== me}
                open={active === en.ev.event_id}
                onToggle={(e) => { e.stopPropagation(); setActive(active === en.ev.event_id ? null : en.ev.event_id) }}
                onReply={() => { setReplyTo(en); setActive(null) }}
                onReact={(k) => { client.react(en.roomId, en.ev.event_id, k).catch(() => {}); setActive(null) }}
              />
            </React.Fragment>
          )
        })}
        {typing.length > 0 && <div className="typing"><span /><span /><span /></div>}
      </div>
      <Composer
        ctx={ctx} item={item} target={target} choice={choice} replyTo={replyTo} multi={multi}
        onPick={(roomId) => { overrides.set(item.key, { roomId, ts: Date.now() }); setReplyTo(null); tick((x) => x + 1) }}
        onClearReply={() => setReplyTo(null)}
        onSent={() => { setReplyTo(null); atBottom.current = true }}
      />
    </div>
  )
}

function dayLabel(ts) {
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Today'
  const y = new Date(now); y.setDate(now.getDate() - 1)
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', ...(d.getFullYear() !== now.getFullYear() ? { year: 'numeric' } : {}) })
}

function Bubble({ ctx, en, mine, first, last, showNet, multi, showSender, open, onToggle, onReply, onReact }) {
  const { client, model } = ctx
  const { ev, roomId, reactions } = en
  const room = client.rooms[roomId]
  const net = model.info[roomId]?.network
  const c = ev.content || {}
  const notice = c.msgtype === 'm.notice' && !mine
  const replyId = c['m.relates_to']?.['m.in_reply_to']?.event_id
  const quoted = replyId ? room?.byId[replyId] : null
  const time = new Date(ev.origin_server_ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`msg ${mine ? 'out' : 'in'} ${first ? 'first' : ''} ${last ? 'last' : ''} ${notice ? 'notice' : ''}`} style={{ '--net': networkInfo(net).color }}>
      {showNet && <div className="msg-net"><NetBadge net={net} label /></div>}
      {showSender && <div className="msg-sender">{room?.members[ev.sender]?.displayname || ev.sender}</div>}
      <div className="bubble" onClick={onToggle}>
        {replyId && (
          <div className="quote">{quoted ? previewText(quoted, client.userId).replace(/^You: /, '') : 'Replying to an earlier message'}</div>
        )}
        <MessageBody client={client} ev={ev} />
        <span className="meta">
          {ev.edited && 'edited · '}
          {time}
          {multi && <i className="dot" title={networkInfo(net).name} />}
          {ev.status === 'sending' && ' · sending'}
        </span>
      </div>
      {ev.status === 'failed' && (
        <button className="failed" onClick={() => client.retry(roomId, ev.event_id).catch(() => {})}>Not sent. Tap to retry</button>
      )}
      {reactions && (
        <div className="reactions">
          {Object.values(reactions).map((r) => <span key={r.key} className={r.senders.includes(client.userId) ? 'mine' : ''}>{r.key}{r.count > 1 && ` ${r.count}`}</span>)}
        </div>
      )}
      {open && !ev.local && (
        <div className="actions" onClick={(e) => e.stopPropagation()}>
          {QUICK.map((k) => <button key={k} onClick={() => onReact(k)}>{k}</button>)}
          <button onClick={onReply} aria-label="Reply"><Icon name="reply" size={18} /></button>
          {c.body && <button onClick={() => navigator.clipboard?.writeText(stripReply(c.body))}>Copy</button>}
        </div>
      )}
    </div>
  )
}

function MessageBody({ client, ev }) {
  const c = ev.content || {}
  if (ev.redacted || ev.unsigned?.redacted_because) return <span className="muted"><i>Message deleted</i></span>
  if (ev.type === 'm.sticker') return <Img client={client} c={c} sticker />
  switch (c.msgtype) {
    case 'm.image': return <><Img client={client} c={c} />{caption(c)}</>
    case 'm.video': return <><Video client={client} c={c} />{caption(c)}</>
    case 'm.audio': return <Audio client={client} c={c} />
    case 'm.file': return <FileLink client={client} c={c} />
    case 'm.location': return <a href={geoLink(c.geo_uri)} target="_blank" rel="noreferrer">📍 {c.body || 'Location'}</a>
    case 'm.emote': return <span className="text"><i>* {c.body}</i></span>
    default: return <span className="text">{linkify(stripReply(c.body || ''))}</span>
  }
}

// Bridges put the file name in body; if there's a separate caption, show it.
function caption(c) {
  const cap = c.filename && c.body && c.body !== c.filename ? c.body : null
  return cap ? <span className="text">{linkify(cap)}</span> : null
}

function Img({ client, c, sticker }) {
  const thumb = useMedia(client, c.info?.thumbnail_url || c.url, 640)
  const w = c.info?.w || 320
  const h = c.info?.h || 240
  const ratio = Math.min(1, (sticker ? 160 : 280) / w)
  return (
    <button className={`media ${sticker ? 'sticker' : ''}`} style={{ width: w * ratio, aspectRatio: `${w} / ${h}` }}
      onClick={(e) => { e.stopPropagation(); client.mediaUrl(c.url, { download: true })?.then((u) => window.open(u, '_blank')) }}>
      {thumb ? <img src={thumb} alt={c.body || ''} /> : <span className="spinner small" />}
    </button>
  )
}

function Video({ client, c }) {
  const [src, setSrc] = useState(null)
  const poster = useMedia(client, c.info?.thumbnail_url, 640)
  if (src) return <video className="media-video" src={src} controls autoPlay playsInline />
  return (
    <button className="media video-ph" onClick={(e) => { e.stopPropagation(); client.mediaUrl(c.url, { download: true })?.then(setSrc) }}>
      {poster && <img src={poster} alt="" />}<span className="play">▶</span>
    </button>
  )
}

function Audio({ client, c }) {
  const [src, setSrc] = useState(null)
  useEffect(() => { client.mediaUrl(c.url, { download: true })?.then(setSrc).catch(() => {}) }, [c.url])
  const voice = c['org.matrix.msc3245.voice'] !== undefined
  return <div className="audio">{voice ? '🎤' : '🎵'} {src ? <audio src={src} controls preload="metadata" onClick={(e) => e.stopPropagation()} /> : <span className="spinner small" />}</div>
}

function FileLink({ client, c }) {
  const size = c.info?.size ? ` · ${(c.info.size / 1024 / 1024).toFixed(1)} MB` : ''
  return (
    <button className="file" onClick={(e) => {
      e.stopPropagation()
      client.mediaUrl(c.url, { download: true })?.then((u) => { const a = document.createElement('a'); a.href = u; a.download = c.filename || c.body || 'file'; a.click() })
    }}>📎 {c.filename || c.body}{size}</button>
  )
}

function geoLink(uri) {
  const m = /geo:([-\d.]+),([-\d.]+)/.exec(uri || '')
  return m ? `https://maps.apple.com/?ll=${m[1]},${m[2]}` : '#'
}

function linkify(text) {
  const parts = text.split(/(https?:\/\/[^\s]+|(?:www\.|[a-z0-9-]+\.(?:com|lt|org|net|io|me|fit)\/)[^\s]*)/gi)
  return parts.map((p, i) => (i % 2 ? <a key={i} href={p.startsWith('http') ? p : 'https://' + p} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{p}</a> : p))
}

function Composer({ ctx, item, target, choice, replyTo, multi, onPick, onClearReply, onSent }) {
  const { client, model } = ctx
  const [text, setText] = useState('')
  const [menu, setMenu] = useState(false)
  const [err, setErr] = useState(null)
  const fileInput = useRef(null)
  const typingAt = useRef(0)
  const area = useRef(null)
  const net = model.info[target]?.network

  useEffect(() => {
    const el = area.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [text])

  function onChange(e) {
    setText(e.target.value)
    if (Date.now() - typingAt.current > 4000 && e.target.value) { typingAt.current = Date.now(); client.typing(target, true) }
  }

  async function send() {
    const body = text.trim()
    if (!body) return
    setText('')
    setErr(null)
    typingAt.current = 0
    client.typing(target, false)
    const content = { msgtype: 'm.text', body }
    if (replyTo && replyTo.roomId === target) content['m.relates_to'] = { 'm.in_reply_to': { event_id: replyTo.ev.event_id } }
    onSent()
    try { await client.send(target, content) } catch (e) { setErr(`Couldn't send: ${e.message}`) }
  }

  async function onFiles(e) {
    const files = [...e.target.files]
    e.target.value = ''
    onSent()
    for (const f of files) {
      try { await client.sendFile(target, f) } catch (er) { setErr(`Couldn't send ${f.name}: ${er.message}`) }
    }
  }

  const why = replyTo ? 'replying to this message'
    : choice.reason === 'recent' ? `${item.name.split(' ')[0]} wrote here ${ago(choice.ts)}`
    : choice.reason === 'default' ? 'default'
    : choice.reason === 'picked' ? 'you picked this'
    : choice.reason === 'last' ? 'last used' : ''

  return (
    <div className="composer">
      {replyTo && (
        <div className="reply-bar">
          <Icon name="reply" size={16} />
          <span>{previewText(replyTo.ev, client.userId)}</span>
          <button className="icon-btn" onClick={onClearReply} aria-label="Cancel reply"><Icon name="close" size={16} /></button>
        </div>
      )}
      {multi && (
        <div className="channel-bar">
          <button className="channel" onClick={() => setMenu(!menu)} aria-haspopup="menu" aria-expanded={menu}>
            Sending via <NetBadge net={net} label /> <Icon name="chevron" size={16} />
          </button>
          <span className="why">{why}</span>
          {menu && (
            <div className="menu" role="menu">
              {item.rooms.map((id) => {
                const n = model.info[id]?.network
                return (
                  <button key={id} role="menuitemradio" aria-checked={id === target} className={id === target ? 'on' : ''} onClick={() => { onPick(id); setMenu(false) }}>
                    <NetBadge net={n} label />
                    <span className="menu-id">{identityOf(client, model.info, id)}</span>
                    {item.defaultRoom === id && <span className="tag">default</span>}
                    {id === target && <Icon name="check" size={16} />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
      {err && <div className="error small">{err}</div>}
      <div className="compose-row">
        <button className="icon-btn" onClick={() => fileInput.current?.click()} aria-label="Attach"><Icon name="attach" /></button>
        <input ref={fileInput} type="file" multiple hidden onChange={onFiles} />
        <textarea
          ref={area} rows={1} value={text} onChange={onChange}
          placeholder={`Message on ${networkInfo(net).name}`}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !matchMedia('(pointer: coarse)').matches) { e.preventDefault(); send() } }}
        />
        <button className="send" onClick={send} disabled={!text.trim()} aria-label="Send" style={{ '--net': networkInfo(net).color }}><Icon name="send" /></button>
      </div>
    </div>
  )
}

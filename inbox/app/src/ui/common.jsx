import React, { useEffect, useState } from 'react'
import { networkInfo } from '../networks.js'

const COLORS = ['#e8590c', '#1c7ed6', '#2b8a3e', '#c2255c', '#7048e8', '#0c8599', '#e67700', '#5c940d']

export function Avatar({ client, mxc, name, size = 44 }) {
  const url = useMedia(client, mxc, size * 2)
  const initials = (name || '?').replace(/[^\p{L}\p{N} ]/gu, '').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'
  let h = 0
  for (const ch of name || '') h = (h * 31 + ch.codePointAt(0)) >>> 0
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, background: url ? 'transparent' : COLORS[h % COLORS.length] }}>
      {url ? <img src={url} alt="" /> : initials}
    </div>
  )
}

export function useMedia(client, mxc, width) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    let live = true
    setUrl(null)
    const p = client.mediaUrl(mxc, width ? { width, height: width } : {})
    p?.then((u) => live && setUrl(u)).catch(() => {})
    return () => { live = false }
  }, [client, mxc, width])
  return url
}

export function NetBadge({ net, label = false, title }) {
  const n = networkInfo(net)
  return (
    <span className={`net ${label ? 'net-label' : ''}`} style={{ '--net': n.color }} title={title || n.name}>
      {label ? n.name : n.short}
    </span>
  )
}

export function TopBar({ title, onBack, right, children }) {
  return (
    <header className="topbar">
      {onBack && <button className="icon-btn back" onClick={onBack} aria-label="Back"><Icon name="back" /></button>}
      <div className="topbar-title">{children || <h1>{title}</h1>}</div>
      <div className="topbar-right">{right}</div>
    </header>
  )
}

const PATHS = {
  back: 'M15 5l-7 7 7 7',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3',
  gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  send: 'M5 12l14-7-5 15-3-6-6-2z',
  attach: 'M21 11.5l-8.5 8.5a5 5 0 0 1-7-7L14 4.5a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7.5',
  chevron: 'M6 9l6 6 6-6',
  reply: 'M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z',
  close: 'M6 6l12 12M18 6L6 18',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  people: 'M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3.5 3.5 0 0 1 0 6.8',
  check: 'M5 12l5 5 9-10',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
}

export function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}

export function timeShort(ts, now = Date.now()) {
  if (!ts) return ''
  const d = new Date(ts)
  const today = new Date(now)
  if (d.toDateString() === today.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const diff = (now - ts) / 86400_000
  if (diff < 6) return d.toLocaleDateString([], { weekday: 'short' })
  if (d.getFullYear() === today.getFullYear()) return d.toLocaleDateString([], { day: 'numeric', month: 'short' })
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: '2-digit' })
}

export function ago(ts, now = Date.now()) {
  const m = Math.round((now - ts) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}

// what to show as "who is this on that app": phone, username, or the chat name
export function identityOf(client, info, roomId) {
  const i = info[roomId]
  if (!i) return ''
  if (i.phone) return '+' + i.phone
  const room = client.rooms[roomId]
  const dn = i.remote && room?.members[i.remote]?.displayname
  return dn || i.title
}

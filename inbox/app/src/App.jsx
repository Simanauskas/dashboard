import React, { useEffect, useMemo, useState, useSyncExternalStore, useCallback } from 'react'
import { Client, PEOPLE_TYPE } from './matrix.js'
import { buildModel, suggestions, previewText } from './people.js'
import { networkInfo } from './networks.js'
import Login from './ui/Login.jsx'
import Inbox from './ui/Inbox.jsx'
import Thread from './ui/Thread.jsx'
import Person from './ui/Person.jsx'
import Merge from './ui/Merge.jsx'
import Settings from './ui/Settings.jsx'
import Search from './ui/Search.jsx'

const SESSION_KEY = 'inbox.session'

function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) } catch { return null }
}

export default function App() {
  const [session, setSession] = useState(loadSession)
  if (!session) {
    return <Login onLogin={(s) => { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)) } catch {} setSession(s) }} />
  }
  return <Main key={session.accessToken} session={session} onLogout={() => { try { localStorage.removeItem(SESSION_KEY) } catch {} setSession(null) }} />
}

function useHashRoute() {
  const parse = () => {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''))
    const [view, ...rest] = h.split('/')
    return { view: view || 'inbox', arg: rest.join('/') || null }
  }
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}


function Main({ session, onLogout }) {
  const client = useMemo(() => new Client(session), [session])
  const version = useSyncExternalStore(client.subscribe, client.getVersion)
  const route = useHashRoute()
  const [wide, setWide] = useState(() => matchMedia('(min-width: 900px)').matches)

  useEffect(() => {
    const mq = matchMedia('(min-width: 900px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const model = useMemo(
    () => buildModel(client.rooms, client.accountData, client.userId, client.accountData[PEOPLE_TYPE]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version],
  )
  const sugg = useMemo(() => suggestions(model), [model])

  const findItem = useCallback((key) => {
    if (!key) return null
    const exact = model.items.find((i) => i.key === key) || model.connections.find((i) => i.key === key)
    if (exact) return exact
    // a room that has since been merged into a person
    const roomId = key.startsWith('r:') ? key.slice(2) : null
    return roomId ? model.items.find((i) => i.rooms.includes(roomId)) || null : null
  }, [model])

  // desktop notifications while the app is open but in the background
  useEffect(() => {
    client.onLoggedOut = onLogout
    client.onMessage = (room, ev) => {
      if (document.visibilityState === 'visible' || typeof Notification === 'undefined' || Notification.permission !== 'granted') return
      const m = buildModel(client.rooms, client.accountData, client.userId, client.accountData[PEOPLE_TYPE])
      const item = m.items.find((i) => i.rooms.includes(room.id))
      if (!item) return
      const title = `${item.name} · ${networkInfo(m.info[room.id].network).name}`
      navigator.serviceWorker?.getRegistration().then((reg) => {
        const opts = { body: previewText(ev, client.userId), tag: item.key, data: { hash: `#/t/${encodeURIComponent(item.key)}` } }
        if (reg) reg.showNotification(title, opts)
        else new Notification(title, opts)
      })
    }
    client.start()
    return () => client.stop()
  }, [client, onLogout])

  const totalUnread = model.items.reduce((s, i) => s + i.unread, 0)
  useEffect(() => {
    document.title = totalUnread ? `(${totalUnread}) Inbox` : 'Inbox'
    navigator.setAppBadge?.(totalUnread || undefined)?.catch?.(() => {})
  }, [totalUnread])

  const ctx = { client, model, sugg, findItem, wide, route, version, onLogout }
  let page = null
  const item = route.arg ? findItem(route.arg) : null
  if (route.view === 't' && item) page = <Thread key={item.key} ctx={ctx} item={item} />
  else if (route.view === 'p' && item) page = <Person key={item.key} ctx={ctx} item={item} />
  else if (route.view === 'merge') page = <Merge ctx={ctx} />
  else if (route.view === 'settings') page = <Settings ctx={ctx} />
  else if (route.view === 'search') page = <Search ctx={ctx} />
  else if ((route.view === 't' || route.view === 'p') && !client.synced) page = <div className="empty-pane"><div className="spinner" /></div>

  if (wide) {
    return (
      <div className="app split">
        <aside className="list-pane"><Inbox ctx={ctx} selected={item?.key} /></aside>
        <main className="detail-pane">{page || <div className="empty-pane"><p>Pick a conversation</p></div>}</main>
      </div>
    )
  }
  return <div className="app">{page || <Inbox ctx={ctx} />}</div>
}

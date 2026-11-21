// Turns bridged rooms into people: one entry per person, however many apps
// they message you on. Pure functions so they can be unit tested.
import { networkOf, isBotUser, phoneFromUser } from './networks.js'

export const DEFAULT_CONFIG = { version: 1, people: {}, dismissed: [], replyWindowHours: 12 }

export function normConfig(c) {
  return { ...DEFAULT_CONFIG, ...(c || {}), people: { ...((c && c.people) || {}) }, dismissed: [...((c && c.dismissed) || [])] }
}

export function isDisplayable(ev) {
  if (ev.redacted || ev.unsigned?.redacted_because) return ev.type === 'm.room.message' || ev.type === 'm.sticker'
  if (ev.type === 'm.sticker') return true
  if (ev.type !== 'm.room.message') return false
  const rel = ev.content?.['m.relates_to']
  if (rel?.rel_type === 'm.replace') return false
  return !!ev.content?.msgtype
}

export function otherMembers(room, me) {
  const ids = new Set([...(room.heroes || [])])
  for (const [uid, m] of Object.entries(room.members || {})) if (m.membership === 'join' || m.membership === 'invite') ids.add(uid)
  ids.delete(me)
  return [...ids]
}

export function remoteUser(room, me) {
  const others = otherMembers(room, me).filter((u) => !isBotUser(u) && u !== room.bridge?.bridgebot)
  return others[0] || null
}

export function directRoomIds(accountData) {
  const set = new Set()
  for (const list of Object.values(accountData?.['m.direct'] || {})) for (const id of list) set.add(id)
  return set
}

// dm | group | connection | other
export function classifyRoom(room, me, direct) {
  const others = otherMembers(room, me)
  const humans = others.filter((u) => !isBotUser(u) && u !== room.bridge?.bridgebot)
  if (room.roomType === 'm.space') return 'space'
  // bridgev2 sets room_type.v2 to dm / group_dm / space (omitted for groups), and room_type "dm" for both kinds of DM
  const v2 = room.bridge?.['com.beeper.room_type.v2']
  const type = v2 === 'group_dm' ? 'group' : v2 || room.bridge?.['com.beeper.room_type']
  if (!room.bridge) {
    if (others.length && humans.length === 0) return 'connection'
    if (humans.length === 0 && room.joinedCount <= 1) return 'connection'
    return direct.has(room.id) && humans.length === 1 ? 'dm' : humans.length === 1 && room.joinedCount <= 2 ? 'dm' : 'other'
  }
  // the iMessage bridge says directly whether a chat is a group
  const imGroup = room.bridge?.channel?.['fi.mau.imessage.is_group']
  if (imGroup !== undefined && !type) return imGroup ? 'group' : 'dm'
  if (type === 'dm') return 'dm'
  if (type === 'group' || type === 'space') return type === 'space' ? 'space' : 'group'
  if (direct.has(room.id) && humans.length <= 1) return 'dm'
  return humans.length === 1 && (room.joinedCount || 0) <= 3 ? 'dm' : 'group'
}

export function roomTitle(room, me) {
  if (room.name) return room.name
  const u = remoteUser(room, me) || otherMembers(room, me)[0]
  return (u && room.members[u]?.displayname) || u || 'Chat'
}

export function lastMessage(room) {
  for (let i = room.timeline.length - 1; i >= 0; i--) if (isDisplayable(room.timeline[i])) return room.timeline[i]
  return null
}

export function lastActivity(room) {
  const m = lastMessage(room)
  return m ? m.origin_server_ts : room.createTs || 0
}

export function unreadCount(room, me) {
  const receipt = room.receipts?.[me]
  const idx = receipt ? room.timeline.findIndex((e) => e.event_id === receipt) : -1
  if (idx < 0) return room.notificationCount || 0
  let n = 0
  for (let i = idx + 1; i < room.timeline.length; i++) {
    const e = room.timeline[i]
    if (e.sender !== me && isDisplayable(e)) n++
  }
  return Math.max(n, room.notificationCount || 0)
}

export function normName(s) {
  return (s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

// Everything the inbox list needs, built from the client's rooms + saved people.
export function buildModel(rooms, accountData, me, rawConfig) {
  const config = normConfig(rawConfig)
  const direct = directRoomIds(accountData)
  const info = {} // roomId -> { kind, network, title, remote, phone, lastTs }
  for (const room of Object.values(rooms)) {
    if (room.membership !== 'join') continue
    const kind = classifyRoom(room, me, direct)
    const remote = kind === 'dm' ? remoteUser(room, me) : null
    info[room.id] = {
      kind, network: networkOf(room), title: roomTitle(room, me), remote,
      phone: remote ? phoneFromUser(remote) : null, lastTs: lastActivity(room),
    }
  }

  const owner = {} // roomId -> personId
  const people = []
  for (const [pid, p] of Object.entries(config.people)) {
    const prs = (p.rooms || []).filter((id) => info[id] && !owner[id])
    for (const id of prs) owner[id] = pid
    if (prs.length) people.push({ pid, p, rooms: prs })
  }

  const items = []
  for (const { pid, p, rooms: prs } of people) {
    items.push(makeItem(`p:${pid}`, 'person', p.name || info[prs[0]].title, prs, rooms, info, me, { personId: pid, defaultRoom: prs.includes(p.defaultRoom) ? p.defaultRoom : null }))
  }
  const connections = []
  for (const [id, i] of Object.entries(info)) {
    if (owner[id]) continue
    if (i.kind === 'connection') { connections.push(makeItem(`r:${id}`, 'connection', i.title, [id], rooms, info, me)); continue }
    if (i.kind === 'space') continue
    items.push(makeItem(`r:${id}`, i.kind === 'dm' ? 'person' : 'group', i.title, [id], rooms, info, me))
  }
  items.sort((a, b) => b.lastTs - a.lastTs)
  return { items, connections, info, config, owner }
}

function makeItem(key, kind, name, roomIds, rooms, info, me, extra = {}) {
  let last = null
  let lastRoom = null
  let unread = 0
  let avatarUrl = null
  let typing = false
  for (const id of roomIds) {
    const r = rooms[id]
    const m = lastMessage(r)
    if (m && (!last || m.origin_server_ts > last.origin_server_ts)) { last = m; lastRoom = id }
    unread += unreadCount(r, me)
    if (!avatarUrl && r.avatarUrl) avatarUrl = r.avatarUrl
    if ((r.typing || []).some((u) => u !== me)) typing = true
  }
  const sorted = [...roomIds].sort((a, b) => info[b].lastTs - info[a].lastTs)
  return {
    key, kind, name, rooms: sorted, lastEvent: last, lastRoom, unread, avatarUrl, typing,
    lastTs: last ? last.origin_server_ts : Math.max(0, ...roomIds.map((id) => info[id].lastTs)),
    networks: [...new Set(sorted.map((id) => info[id].network))],
    personId: null, defaultRoom: null, ...extra,
  }
}

// People who look like the same person on different apps.
export function suggestions(model) {
  const { items, info, config } = model
  const people = items.filter((i) => i.kind === 'person')
  const parent = new Map(people.map((p) => [p.key, p.key]))
  const find = (k) => (parent.get(k) === k ? k : (parent.set(k, find(parent.get(k))), parent.get(k)))
  const union = (a, b) => parent.set(find(a), find(b))
  const byName = new Map()
  const byPhone = new Map()
  for (const p of people) {
    const keys = new Set([normName(p.name), ...p.rooms.map((id) => normName(info[id].title))].filter((k) => k.length >= 2))
    for (const k of keys) { if (byName.has(k)) union(p.key, byName.get(k)); else byName.set(k, p.key) }
    for (const id of p.rooms) {
      const ph = info[id].phone
      if (!ph) continue
      const tail = ph.slice(-9)
      if (byPhone.has(tail)) union(p.key, byPhone.get(tail)); else byPhone.set(tail, p.key)
    }
  }
  const groups = new Map()
  for (const p of people) {
    const root = find(p.key)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root).push(p)
  }
  const dismissed = new Set(config.dismissed)
  const out = []
  for (const members of groups.values()) {
    if (members.length < 2) continue
    const rooms = members.flatMap((m) => m.rooms).sort()
    const key = rooms.join('|')
    if (dismissed.has(key)) continue
    // prefer an existing person's name, then the longest name
    const named = members.find((m) => m.personId)
    // ...then the longest name, preferring the spelling with diacritics (Eglė over Egle)
    const score = (n) => n.length * 10 + (n.match(/[^\x00-\x7f]/g) || []).length
    const name = named?.name || [...members].sort((a, b) => score(b.name) - score(a.name))[0].name
    out.push({ key, name, members, rooms })
  }
  return out
}

// --- config edits (return new config objects) ---
const newId = () => Math.random().toString(36).slice(2, 10)

export function mergePeople(rawConfig, members, name, defaultRoom) {
  const c = normConfig(rawConfig)
  const pids = members.map((m) => m.personId).filter(Boolean)
  const pid = pids[0] || newId()
  const rooms = [...new Set(members.flatMap((m) => m.rooms))]
  for (const other of pids.slice(1)) delete c.people[other]
  c.people[pid] = { ...(c.people[pid] || {}), name, rooms, defaultRoom: defaultRoom || c.people[pid]?.defaultRoom || null }
  return { config: c, personId: pid }
}

export function linkRoom(rawConfig, item, roomId) {
  const c = normConfig(rawConfig)
  for (const p of Object.values(c.people)) p.rooms = (p.rooms || []).filter((r) => r !== roomId)
  const { config, personId } = mergePeople(c, [item, { rooms: [roomId] }], item.name, item.defaultRoom)
  return { config: prune(config), personId }
}

export function unlinkRoom(rawConfig, personId, roomId) {
  const c = normConfig(rawConfig)
  const p = c.people[personId]
  if (!p) return c
  p.rooms = p.rooms.filter((r) => r !== roomId)
  if (p.defaultRoom === roomId) p.defaultRoom = null
  return prune(c)
}

// make sure an item has a saved person (needed before renaming / choosing a default)
export function ensurePerson(rawConfig, item) {
  if (item.personId) return { config: normConfig(rawConfig), personId: item.personId }
  return mergePeople(rawConfig, [item], item.name, null)
}

export function setDefault(rawConfig, item, roomId) {
  const { config, personId } = ensurePerson(rawConfig, item)
  config.people[personId].defaultRoom = roomId
  return config
}

export function renamePerson(rawConfig, item, name) {
  const { config, personId } = ensurePerson(rawConfig, item)
  config.people[personId].name = name
  return config
}

export function dismissSuggestion(rawConfig, key) {
  const c = normConfig(rawConfig)
  if (!c.dismissed.includes(key)) c.dismissed.push(key)
  return c
}

function prune(c) {
  for (const [pid, p] of Object.entries(c.people)) if (!p.rooms?.length) delete c.people[pid]
  return c
}

// --- which app a new message goes out on ---
// 1. a channel you picked by hand in this conversation (until they write from another one)
// 2. where they last wrote to you, if that was within the reply window
// 3. the person's default channel
// 4. where they last wrote to you / where you last talked
export function chooseChannel(item, rooms, me, { override, windowHours = 12, now = Date.now() } = {}) {
  const ids = item.rooms
  if (ids.length === 1) return { roomId: ids[0], reason: 'only' }
  let inbound = null
  for (const id of ids) {
    const tl = rooms[id]?.timeline || []
    for (let i = tl.length - 1; i >= 0; i--) {
      const e = tl[i]
      if (e.sender !== me && isDisplayable(e)) {
        if (!inbound || e.origin_server_ts > inbound.ts) inbound = { roomId: id, ts: e.origin_server_ts }
        break
      }
    }
  }
  if (override && ids.includes(override.roomId) && (!inbound || inbound.ts <= override.ts || inbound.roomId === override.roomId)) {
    return { roomId: override.roomId, reason: 'picked' }
  }
  if (inbound && now - inbound.ts < windowHours * 3600_000) return { roomId: inbound.roomId, reason: 'recent', ts: inbound.ts }
  if (item.defaultRoom && ids.includes(item.defaultRoom)) return { roomId: item.defaultRoom, reason: 'default' }
  if (inbound) return { roomId: inbound.roomId, reason: 'last', ts: inbound.ts }
  return { roomId: item.lastRoom || ids[0], reason: 'last' }
}

// The merged timeline: messages from all of a person's rooms, in time order.
// Stops at the newest "oldest loaded message" among rooms that still have
// older history, so we never show a gap as if nothing was said there.
export function mergedTimeline(item, rooms) {
  let cutoff = 0
  const all = []
  for (const id of item.rooms) {
    const r = rooms[id]
    if (!r) continue
    const tl = r.timeline.filter((e) => !e.local || e.status !== 'sent')
    if (!r.reachedStart) {
      const oldest = tl.find((e) => !e.local)
      if (oldest) cutoff = Math.max(cutoff, oldest.origin_server_ts)
    }
    for (const e of tl) all.push({ ev: e, roomId: id })
  }
  const relations = collectRelations(item.rooms.map((id) => rooms[id]).filter(Boolean))
  return {
    cutoff,
    entries: all
      .filter(({ ev }) => ev.origin_server_ts >= cutoff && isDisplayable(ev))
      .map(({ ev, roomId }) => ({ ev: applyEdits(ev, relations), roomId, reactions: relations.reactions[ev.event_id] || null }))
      .sort((a, b) => a.ev.origin_server_ts - b.ev.origin_server_ts),
    hasMore: item.rooms.some((id) => rooms[id] && !rooms[id].reachedStart),
  }
}

function collectRelations(roomList) {
  const edits = {}
  const reactions = {}
  const redacted = new Set()
  for (const r of roomList) {
    for (const e of r.timeline) {
      if (e.type === 'm.room.redaction') redacted.add(e.redacts)
    }
    for (const e of r.timeline) {
      const rel = e.content?.['m.relates_to']
      if (!rel || redacted.has(e.event_id)) continue
      if (rel.rel_type === 'm.replace' && e.content['m.new_content']) {
        const prev = edits[rel.event_id]
        if (!prev || prev.origin_server_ts < e.origin_server_ts) edits[rel.event_id] = e
      } else if (e.type === 'm.reaction' && rel.rel_type === 'm.annotation') {
        const map = (reactions[rel.event_id] ||= {})
        const entry = (map[rel.key] ||= { key: rel.key, count: 0, senders: [] })
        entry.count++
        entry.senders.push(e.sender)
      }
    }
  }
  return { edits, reactions }
}

function applyEdits(ev, { edits }) {
  const ed = edits[ev.event_id]
  if (!ed) return ev
  return { ...ev, content: { ...ed.content['m.new_content'], 'm.relates_to': ev.content['m.relates_to'] }, edited: true }
}

export function previewText(ev, me) {
  if (!ev) return ''
  const you = ev.sender === me ? 'You: ' : ''
  if (ev.redacted || ev.unsigned?.redacted_because) return you + 'Message deleted'
  if (ev.type === 'm.sticker') return you + 'Sticker'
  const c = ev.content || {}
  const kinds = { 'm.image': '📷 Photo', 'm.video': '🎥 Video', 'm.audio': c['org.matrix.msc3245.voice'] ? '🎤 Voice message' : '🎵 Audio', 'm.file': '📎 ' + (c.body || 'File'), 'm.location': '📍 Location' }
  return you + (kinds[c.msgtype] || stripReply(c.body || ''))
}

// Remove the "> <@user> quoted text" fallback bridges put in front of replies.
export function stripReply(body) {
  if (!body.startsWith('> ')) return body
  const lines = body.split('\n')
  let i = 0
  while (i < lines.length && lines[i].startsWith('>')) i++
  if (lines[i] === '') i++
  return lines.slice(i).join('\n')
}

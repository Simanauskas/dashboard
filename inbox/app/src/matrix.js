// A small Matrix client: just what the inbox needs. Rooms on your own server
// are unencrypted (the bridges run there), so there is no crypto here.

const SYNC_FILTER = {
  room: {
    timeline: { limit: 20 },
    state: { lazy_load_members: true },
    ephemeral: { types: ['m.receipt', 'm.typing'] },
    account_data: { types: ['m.fully_read'] },
  },
  presence: { not_types: ['*'] },
}

export const PEOPLE_TYPE = 'fit.simas.inbox.people'
export const SETTINGS_TYPE = 'fit.simas.inbox.settings'

const txnId = () => `inbox${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

export class MatrixError extends Error {
  constructor(status, body) {
    super(body?.error || `HTTP ${status}`)
    this.status = status
    this.errcode = body?.errcode
  }
}

export async function login(baseUrl, user, password) {
  baseUrl = baseUrl.replace(/\/+$/, '')
  const r = await fetch(`${baseUrl}/_matrix/client/v3/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'm.login.password',
      identifier: { type: 'm.id.user', user },
      password,
      initial_device_display_name: 'Inbox',
    }),
  })
  const body = await r.json().catch(() => ({}))
  if (!r.ok) throw new MatrixError(r.status, body)
  return { baseUrl, userId: body.user_id, accessToken: body.access_token, deviceId: body.device_id }
}

function newRoom(id) {
  return {
    id,
    membership: 'join',
    name: null,
    avatarUrl: null,
    bridge: null, // content of m.bridge / uk.half-shot.bridge
    members: {}, // userId -> { displayname, avatarUrl, membership }
    heroes: [],
    joinedCount: 0,
    timeline: [], // sorted events (incl. local echoes)
    byId: {},
    prevBatch: null,
    reachedStart: false,
    notificationCount: 0,
    receipts: {}, // userId -> eventId (m.read)
    fullyRead: null,
    typing: [],
    createTs: 0,
  }
}

export class Client {
  constructor(session) {
    this.baseUrl = session.baseUrl
    this.userId = session.userId
    this.token = session.accessToken
    this.rooms = {}
    this.accountData = {}
    this.version = 0
    this.listeners = new Set()
    this.status = 'connecting' // connecting | live | offline | error
    this.synced = false
    this.media = new Map()
    this.stopped = false
    this.onLoggedOut = null
    this.onMessage = null // (room, event) for new inbound messages after first sync
  }

  // --- store plumbing ---
  subscribe = (fn) => { this.listeners.add(fn); return () => this.listeners.delete(fn) }
  getVersion = () => this.version
  emit() { this.version++; for (const fn of this.listeners) fn() }

  // --- HTTP ---
  async api(method, path, body, { query, raw, contentType } = {}) {
    const qs = query ? '?' + new URLSearchParams(query) : ''
    const r = await fetch(this.baseUrl + path + qs, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...(raw ? { 'Content-Type': contentType || 'application/octet-stream' } : body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: raw || (body ? JSON.stringify(body) : undefined),
    })
    const data = await r.json().catch(() => ({}))
    if (!r.ok) {
      if (r.status === 401 && data.errcode === 'M_UNKNOWN_TOKEN') { this.stop(); this.onLoggedOut?.() }
      throw new MatrixError(r.status, data)
    }
    return data
  }

  // --- sync loop ---
  async start() {
    let since = null
    let backoff = 1000
    let filterId
    try {
      filterId = (await this.api('POST', `/_matrix/client/v3/user/${enc(this.userId)}/filter`, SYNC_FILTER)).filter_id
    } catch { filterId = JSON.stringify(SYNC_FILTER) }
    while (!this.stopped) {
      try {
        const query = { filter: filterId, timeout: since ? '30000' : '0' }
        if (since) query.since = since
        const res = await this.api('GET', '/_matrix/client/v3/sync', null, { query })
        this.applySync(res, !since)
        since = res.next_batch
        backoff = 1000
        if (this.status !== 'live' || !this.synced) { this.status = 'live'; this.synced = true; this.emit() }
      } catch (e) {
        if (this.stopped) return
        this.status = e instanceof MatrixError ? 'error' : 'offline'
        this.emit()
        await sleep(backoff)
        backoff = Math.min(backoff * 2, 30000)
      }
    }
  }

  stop() { this.stopped = true }

  applySync(res, initial) {
    for (const ev of res.account_data?.events || []) this.accountData[ev.type] = ev.content
    const join = res.rooms?.join || {}
    for (const [id, r] of Object.entries(join)) {
      const room = this.rooms[id] || (this.rooms[id] = newRoom(id))
      room.membership = 'join'
      for (const ev of r.state?.events || []) this.applyState(room, ev)
      if (r.summary) {
        if (r.summary['m.heroes']) room.heroes = r.summary['m.heroes']
        if (r.summary['m.joined_member_count'] != null) room.joinedCount = r.summary['m.joined_member_count']
      }
      const tl = r.timeline || {}
      if (tl.limited) {
        // gap: drop what we had (keep unsent local echoes) and restart from here
        room.timeline = room.timeline.filter((e) => e.local && e.status !== 'sent')
        room.byId = Object.fromEntries(room.timeline.map((e) => [e.event_id, e]))
        room.reachedStart = false
      }
      if (tl.prev_batch && (tl.limited || !room.prevBatch)) room.prevBatch = tl.prev_batch
      for (const ev of tl.events || []) {
        if (ev.state_key !== undefined) this.applyState(room, ev)
        const isNew = this.addEvent(room, ev)
        if (isNew && !initial && ev.sender !== this.userId && isMessage(ev)) this.onMessage?.(room, ev)
      }
      if (r.unread_notifications) room.notificationCount = r.unread_notifications.notification_count || 0
      for (const ev of r.ephemeral?.events || []) {
        if (ev.type === 'm.typing') room.typing = ev.content.user_ids || []
        if (ev.type === 'm.receipt') {
          for (const [eid, types] of Object.entries(ev.content)) {
            for (const uid of Object.keys(types['m.read'] || {})) room.receipts[uid] = eid
          }
        }
      }
      for (const ev of r.account_data?.events || []) if (ev.type === 'm.fully_read') room.fullyRead = ev.content.event_id
    }
    // This is your own server and only the bridges can invite you, so accept every invite.
    for (const id of Object.keys(res.rooms?.invite || {})) {
      this.api('POST', `/_matrix/client/v3/join/${enc(id)}`, {}).catch(() => {})
    }
    for (const id of Object.keys(res.rooms?.leave || {})) {
      if (this.rooms[id]) this.rooms[id].membership = 'leave'
    }
    this.emit()
  }

  applyState(room, ev) {
    const c = ev.content || {}
    switch (ev.type) {
      case 'm.room.name': room.name = c.name || null; break
      case 'm.room.avatar': room.avatarUrl = c.url || null; break
      case 'm.room.create': room.createTs = ev.origin_server_ts || 0; room.roomType = c.type || null; break
      case 'm.bridge':
        room.bridge = { ...c, stateKey: ev.state_key }
        break
      case 'uk.half-shot.bridge':
        if (!room.bridge) room.bridge = { ...c, stateKey: ev.state_key }
        break
      case 'm.room.member':
        room.members[ev.state_key] = { displayname: c.displayname, avatarUrl: c.avatar_url, membership: c.membership }
        break
    }
  }

  // returns true if this was an event we hadn't seen
  addEvent(room, ev) {
    const txn = ev.unsigned?.transaction_id
    if (txn) {
      const echo = room.byId[txn]
      if (echo) {
        room.timeline = room.timeline.filter((e) => e !== echo)
        delete room.byId[txn]
      }
    }
    if (room.byId[ev.event_id]) return false
    room.byId[ev.event_id] = ev
    // insert sorted (almost always at the end)
    const t = room.timeline
    let i = t.length
    while (i > 0 && (t[i - 1].origin_server_ts || 0) > (ev.origin_server_ts || 0)) i--
    t.splice(i, 0, ev)
    if (ev.type === 'm.room.redaction' && room.byId[ev.redacts]) {
      room.byId[ev.redacts] = { ...room.byId[ev.redacts], redacted: true }
      room.timeline = room.timeline.map((e) => (e.event_id === ev.redacts ? room.byId[ev.redacts] : e))
    }
    return true
  }

  async paginate(roomId, limit = 30) {
    const room = this.rooms[roomId]
    if (!room || room.reachedStart || room.paginating) return
    room.paginating = true
    try {
      const query = { dir: 'b', limit: String(limit), filter: JSON.stringify({ lazy_load_members: true }) }
      if (room.prevBatch) query.from = room.prevBatch
      const res = await this.api('GET', `/_matrix/client/v3/rooms/${enc(roomId)}/messages`, null, { query })
      for (const ev of res.state || []) this.applyState(room, ev)
      for (const ev of res.chunk || []) {
        if (ev.type === 'm.room.member') this.applyState(room, ev)
        this.addEvent(room, ev)
      }
      room.prevBatch = res.end || null
      if (!res.end || !(res.chunk || []).length) room.reachedStart = true
    } finally {
      room.paginating = false
      this.emit()
    }
  }

  async loadMembers(roomId) {
    const room = this.rooms[roomId]
    if (!room || room.membersLoaded) return
    room.membersLoaded = true
    try {
      const res = await this.api('GET', `/_matrix/client/v3/rooms/${enc(roomId)}/joined_members`)
      for (const [uid, m] of Object.entries(res.joined || {})) {
        room.members[uid] = { ...room.members[uid], displayname: m.display_name, avatarUrl: m.avatar_url, membership: 'join' }
      }
      this.emit()
    } catch { room.membersLoaded = false }
  }

  // --- sending ---
  async send(roomId, content, type = 'm.room.message') {
    const room = this.rooms[roomId]
    const id = txnId()
    const echo = {
      event_id: id, local: true, status: 'sending', type, sender: this.userId,
      content, origin_server_ts: Date.now(), room_id: roomId,
    }
    this.addEvent(room, echo)
    this.emit()
    try {
      const res = await this.api('PUT', `/_matrix/client/v3/rooms/${enc(roomId)}/send/${type}/${id}`, content)
      if (room.byId[id]) { room.byId[id].status = 'sent'; room.byId[id].realId = res.event_id }
      this.emit()
      return res.event_id
    } catch (e) {
      if (room.byId[id]) room.byId[id].status = 'failed'
      this.emit()
      throw e
    }
  }

  async retry(roomId, echoId) {
    const room = this.rooms[roomId]
    const ev = room?.byId[echoId]
    if (!ev) return
    room.timeline = room.timeline.filter((e) => e !== ev)
    delete room.byId[echoId]
    return this.send(roomId, ev.content, ev.type)
  }

  async upload(file) {
    const res = await this.api('POST', '/_matrix/media/v3/upload', null, {
      query: { filename: file.name || 'file' }, raw: file, contentType: file.type || 'application/octet-stream',
    })
    return res.content_uri
  }

  async sendFile(roomId, file) {
    const url = await this.upload(file)
    const info = { mimetype: file.type, size: file.size }
    let msgtype = 'm.file'
    if (file.type.startsWith('image/')) {
      msgtype = 'm.image'
      const dims = await imageSize(file).catch(() => null)
      if (dims) Object.assign(info, dims)
    } else if (file.type.startsWith('video/')) msgtype = 'm.video'
    else if (file.type.startsWith('audio/')) msgtype = 'm.audio'
    return this.send(roomId, { msgtype, body: file.name || 'file', url, info })
  }

  react(roomId, eventId, key) {
    return this.send(roomId, { 'm.relates_to': { rel_type: 'm.annotation', event_id: eventId, key } }, 'm.reaction')
  }

  typing(roomId, on) {
    return this.api('PUT', `/_matrix/client/v3/rooms/${enc(roomId)}/typing/${enc(this.userId)}`,
      on ? { typing: true, timeout: 6000 } : { typing: false }).catch(() => {})
  }

  async markRead(roomId) {
    const room = this.rooms[roomId]
    const last = [...(room?.timeline || [])].reverse().find((e) => !e.local)
    if (!last || (room.receipts[this.userId] === last.event_id && !room.notificationCount)) return
    room.receipts[this.userId] = last.event_id
    room.notificationCount = 0
    this.emit()
    await this.api('POST', `/_matrix/client/v3/rooms/${enc(roomId)}/read_markers`, {
      'm.fully_read': last.event_id, 'm.read': last.event_id,
    }).catch(() => {})
  }

  async setAccountData(type, content) {
    this.accountData[type] = content
    this.emit()
    await this.api('PUT', `/_matrix/client/v3/user/${enc(this.userId)}/account_data/${type}`, content)
  }

  search(term) {
    return this.api('POST', '/_matrix/client/v3/search', {
      search_categories: { room_events: { search_term: term, order_by: 'recent', keys: ['content.body'] } },
    }).then((r) => r.search_categories?.room_events?.results || [])
  }

  async createDM(userId) {
    const res = await this.api('POST', '/_matrix/client/v3/createRoom', { preset: 'trusted_private_chat', invite: [userId], is_direct: true })
    return res.room_id
  }

  logout() {
    this.stop()
    return this.api('POST', '/_matrix/client/v3/logout', {}).catch(() => {})
  }

  // --- media (authenticated media: needs the token, so fetch into blob URLs) ---
  mediaUrl(mxc, { width, height, download } = {}) {
    if (!mxc?.startsWith('mxc://')) return null
    const key = `${mxc}|${width || ''}|${download ? 'd' : ''}`
    if (this.media.has(key)) return this.media.get(key)
    const [server, id] = mxc.slice(6).split('/')
    const path = width && !download
      ? `/_matrix/client/v1/media/thumbnail/${enc(server)}/${enc(id)}?width=${width}&height=${height || width}&method=scale`
      : `/_matrix/client/v1/media/download/${enc(server)}/${enc(id)}`
    const p = fetch(this.baseUrl + path, { headers: { Authorization: `Bearer ${this.token}` } })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(r.status))))
      .then((b) => URL.createObjectURL(b))
      .catch((e) => { this.media.delete(key); throw e })
    this.media.set(key, p)
    return p
  }
}

export function isMessage(ev) {
  return (ev.type === 'm.room.message' || ev.type === 'm.sticker') && !isEdit(ev)
}
export function isEdit(ev) {
  return ev.content?.['m.relates_to']?.rel_type === 'm.replace'
}

const enc = encodeURIComponent
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function imageSize(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => { resolve({ w: img.naturalWidth, h: img.naturalHeight }); URL.revokeObjectURL(img.src) }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

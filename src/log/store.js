// Local persistence + delivery for the logger.
//
// Everything is saved on the phone first (localStorage), on every keystroke,
// so a locked screen, a reload or no signal in the gym loses nothing. Sending
// is a separate step that is retried until GitHub accepts it.
const KEY = "simaslog.v1"
const REPO = "Simanauskas/dashboard"
const WORKFLOW = "log-session.yml"
const WORKER = "https://auth.simas.fit/log"

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}
function write(db) {
  try { localStorage.setItem(KEY, JSON.stringify(db)) } catch { /* private mode: keep in memory */ }
}

let db = { entries: {}, settings: { mode: "github", token: "" }, ...read() }
db.entries = db.entries || {}
const listeners = new Set()
const emit = () => { write(db); listeners.forEach(f => f()) }

export const store = {
  subscribe(f) { listeners.add(f); return () => listeners.delete(f) },
  get entries() { return db.entries },
  get settings() { return db.settings },
  setSettings(p) { db = { ...db, settings: { ...db.settings, ...p } }; emit() },
  put(session, patch = {}) {
    const prev = db.entries[session.id] || {}
    db = { ...db, entries: { ...db.entries, [session.id]: { ...prev, ...patch, session } } }
    emit()
  },
  patch(id, patch) {
    if (!db.entries[id]) return
    db = { ...db, entries: { ...db.entries, [id]: { ...db.entries[id], ...patch } } }
    emit()
  },
  remove(id) {
    const e = { ...db.entries }; delete e[id]
    db = { ...db, entries: e }; emit()
  },
}

async function dispatch(inputs) {
  const { mode, token } = db.settings
  if (!token) throw new Error("add your token in Settings")
  if (mode === "worker") {
    const r = await fetch(WORKER, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(inputs),
    })
    if (!r.ok) throw new Error(`worker ${r.status}: ${(await r.text()).slice(0, 120)}`)
    return
  }
  const r = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`, {
    method: "POST",
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ref: "main", inputs }),
  })
  if (r.status !== 204) throw new Error(`GitHub ${r.status}: ${(await r.text()).slice(0, 120)}`)
}

// What leaves the phone: placeholders dropped, half-typed numbers ("72,5") made numbers.
const NUMERIC = new Set(["kg", "n", "m", "sec", "spm", "damper", "rest_sec", "total_sec", "rpe"])
function clean(k, v) {
  if (k === "ph" || k === "target") return undefined
  if (NUMERIC.has(k) && typeof v === "string") {
    const x = Number(v.replace(",", "."))
    return v.trim() === "" || isNaN(x) ? null : x
  }
  return v
}

const inflight = new Set()

export async function send(id) {
  const e = db.entries[id]
  if (!e || inflight.has(id)) return
  inflight.add(id)
  store.patch(id, { sync: "sending", error: "" })
  try {
    await dispatch({ action: "save", id, session: JSON.stringify(e.session, clean), activity_id: "" })
    store.patch(id, { sync: "sent", sentAt: new Date().toISOString(), remote: null })
  } catch (err) {
    store.patch(id, { sync: "queued", error: err.message || String(err) })
  } finally {
    inflight.delete(id)
  }
}

export async function sendAction(action, id, activityId = "") {
  await dispatch({ action, id, session: "", activity_id: activityId })
  store.patch(id, { sync: "sent", sentAt: new Date().toISOString(), remote: null })
}

// Retry everything still queued (on open, and whenever the phone gets signal back).
export function flush() {
  for (const [id, e] of Object.entries(db.entries))
    if (e.sync === "queued" || e.sync === "sending") send(id)
}

// Live Garmin status from the session file the workflow committed.
export async function fetchStatus(id) {
  const { mode, token } = db.settings
  try {
    const r = mode === "github" && token
      ? await fetch(`https://api.github.com/repos/${REPO}/contents/data/sessions/${id}.json?ref=main`,
          { headers: { Accept: "application/vnd.github.raw+json", Authorization: `Bearer ${token}` }, cache: "no-store" })
      : await fetch(`https://raw.githubusercontent.com/${REPO}/main/data/sessions/${id}.json`, { cache: "no-store" })
    if (!r.ok) return null
    const s = await r.json()
    const st = s.status || {}
    store.patch(id, { remote: { state: st.state, garmin_id: st.garmin_id, message: st.message, checked: Date.now() } })
    return st
  } catch { return null }
}

export async function testToken() {
  const { mode, token } = db.settings
  if (mode === "worker") {
    const r = await fetch(WORKER, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: "{}" })
    return r.status === 400 ? "token accepted" : `worker said ${r.status}`
  }
  const r = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}`,
    { headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}` } })
  if (r.ok) return "token works — workflow found"
  if (r.status === 404) return "token works, but log-session.yml isn't on main yet"
  return `GitHub said ${r.status}`
}

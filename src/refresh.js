// Keeps the home-screen app current. Shared by the dashboard (/) and the logger
// (/log/), loaded by both entry points.
//
// Why it is needed: the data is baked into the build, and the sync redeploys
// the site a few times an hour. iOS freezes a home-screen app instead of
// closing it, so without this it keeps showing whatever it had when last opened.
//
//  1. Pull down from the top of any screen: asks the Worker for a fresh Garmin
//     sync (the same call as the Sync tab's Refresh button), reloads at once,
//     and the watcher below picks the new data up when the deploy lands.
//  2. Version watcher: /version.json (written at build time) says which build
//     is live. Checked when the app comes back to the front and every 2 minutes
//     while it is open. If a newer build exists: after coming back from the
//     background it reloads by itself (nothing on screen yet to lose); while
//     you are using the app it shows a "New data · tap to update" pill instead.
//  3. After a pull, the watcher polls every 10 s for up to 3 minutes and
//     reloads by itself when the synced data arrives.
//
// Reloading is safe: the logger saves every keystroke to localStorage, and the
// dashboard remembers its tab (see App.jsx).
const WORKER = "https://auth.simas.fit"
const BUILD = typeof __BUILD_ID__ === "undefined" ? "dev" : __BUILD_ID__
const SYNC_KEY = "refresh.lastSync"      // localStorage: throttle across reloads
const WAIT_KEY = "refresh.waitingSince"  // sessionStorage: a pull is waiting on a sync

const PULL_AT = 64        // px of indicator travel that counts as "pulled"
const SYNC_EVERY = 3 * 60e3
const WAIT_FOR = 3 * 60e3
const SLOW_POLL = 2 * 60e3
const FAST_POLL = 10e3

const get = (store, k) => { try { return store.getItem(k) } catch { return null } }
const put = (store, k, v) => { try { store.setItem(k, v) } catch { /* private mode: do without */ } }

async function liveBuild() {
  try {
    const r = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" })
    const b = r.ok ? (await r.json()).build : null
    return typeof b === "string" ? b : null
  } catch { return null }     // offline: nothing to compare, nothing to do
}

// Fire-and-forget; at most once per SYNC_EVERY so repeated pulls don't pile up Garmin syncs.
function requestSync() {
  const last = Number(get(localStorage, SYNC_KEY)) || 0
  if (Date.now() - last < SYNC_EVERY) return
  put(localStorage, SYNC_KEY, String(Date.now()))
  fetch(`${WORKER}/refresh`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "activities" }), keepalive: true,
  }).catch(() => {})
}

const CSS = `
html, body { overscroll-behavior-y: none; }
#ptr { position: fixed; left: 50%; top: 0; z-index: 2147483000; width: 38px; height: 38px; margin-left: -19px;
  border-radius: 50%; display: grid; place-items: center; background: #172136; color: #c4b5fd;
  border: 1px solid #2f3d5a; box-shadow: 0 6px 18px rgba(0,0,0,.45); opacity: 0; pointer-events: none;
  transform: translateY(-60px); }
#ptr.settle { transition: transform .22s ease, opacity .22s ease; }
#ptr svg { width: 20px; height: 20px; transition: transform .15s ease; }
#ptr.ready svg { transform: rotate(180deg); }
#ptr.busy svg { animation: ptr-spin .8s linear infinite; }
@keyframes ptr-spin { to { transform: rotate(360deg); } }
#refresh-pill { position: fixed; left: 50%; transform: translateX(-50%); z-index: 2147483000;
  top: calc(env(safe-area-inset-top, 0px) + 64px); max-width: calc(100vw - 32px);
  font: 700 12.5px/1 -apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif; letter-spacing: .01em;
  padding: 10px 15px; border-radius: 999px; background: #8b5cf6; color: #fff; border: 0;
  box-shadow: 0 8px 22px rgba(0,0,0,.5); white-space: nowrap; }
#refresh-pill.quiet { background: #172136; color: #c4b5fd; border: 1px solid #2f3d5a; pointer-events: none; }
`

export function installRefresh({ canReload = () => true } = {}) {
  const style = document.createElement("style"); style.textContent = CSS; document.head.append(style)
  const ptr = document.createElement("div"); ptr.id = "ptr"
  ptr.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>'
  document.body.append(ptr)
  const safeTop = (() => { const d = document.createElement("div"); d.style.cssText = "position:fixed;top:env(safe-area-inset-top,0px)"; document.body.append(d); const v = d.getBoundingClientRect().top; d.remove(); return v })()
  const place = y => { ptr.style.transform = `translateY(${safeTop + 8 + y - 60}px)` }   // y: 0 → just off-screen, 60 → fully shown

  // ── pull down from the top ────────────────────────────────────────────────
  let y0 = 0, x0 = 0, pull = 0, tracking = false, busy = false
  const blocked = el => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName) || n.isContentEditable || n.dataset?.noPtr != null) return true
      const oy = getComputedStyle(n).overflowY
      if ((oy === "auto" || oy === "scroll") && n.scrollTop > 0) return true   // inner list scrolled down
    }
    return false
  }
  addEventListener("touchstart", e => {
    tracking = !busy && e.touches.length === 1 && (document.scrollingElement?.scrollTop || 0) <= 0 && !blocked(e.target)
    if (!tracking) return
    y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; pull = 0
  }, { passive: true })
  addEventListener("touchmove", e => {
    if (!tracking) return
    const dy = e.touches[0].clientY - y0, dx = e.touches[0].clientX - x0
    if (pull === 0 && (dy <= 0 || Math.abs(dx) > Math.abs(dy))) { if (dy < -6 || Math.abs(dx) > 10) tracking = false; return }
    if ((document.scrollingElement?.scrollTop || 0) > 0) { tracking = false; ptr.classList.remove("ready"); ptr.style.opacity = 0; return }
    pull = Math.max(0, dy * 0.55)
    ptr.classList.remove("settle")
    ptr.style.opacity = Math.min(1, pull / 30)
    place(Math.min(pull, PULL_AT + 20))
    ptr.classList.toggle("ready", pull >= PULL_AT)
  }, { passive: true })
  const release = () => {
    if (!tracking) return
    tracking = false
    ptr.classList.add("settle")
    if (pull >= PULL_AT) {
      busy = true
      ptr.classList.remove("ready"); ptr.classList.add("busy"); place(PULL_AT)
      requestSync()
      put(sessionStorage, WAIT_KEY, String(Date.now()))
      setTimeout(() => location.reload(), 450)
    } else { ptr.style.opacity = 0; place(0) }
    pull = 0
  }
  addEventListener("touchend", release, { passive: true })
  addEventListener("touchcancel", release, { passive: true })

  // ── is there a newer build? ───────────────────────────────────────────────
  let pill = null, newer = false, hiddenAt = 0, lastCheck = 0
  const showPill = (text, quiet, onClick) => {
    if (!pill) { pill = document.createElement(onClick ? "button" : "div"); pill.id = "refresh-pill"; document.body.append(pill) }
    pill.className = quiet ? "quiet" : ""; pill.textContent = text
    pill.onclick = onClick || null
  }
  const hidePill = () => { pill?.remove(); pill = null }
  const waiting = () => { const t = Number(get(sessionStorage, WAIT_KEY)) || 0; return t && Date.now() - t < WAIT_FOR ? t : 0 }
  const editing = () => /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "")

  async function check({ resumed = false } = {}) {
    if (document.hidden || Date.now() - lastCheck < 5e3) return
    lastCheck = Date.now()
    const live = await liveBuild()
    if (live && live !== BUILD) newer = true
    if (newer) {
      // Reload by itself when that cannot cost anything: just back from the
      // background, or he asked for fresh data with a pull. Otherwise offer it.
      if ((resumed || waiting()) && canReload() && !editing()) { sessionStorage.removeItem(WAIT_KEY); location.reload(); return }
      showPill("New data · tap to update", false, () => location.reload())
    } else if (waiting()) showPill("Syncing Garmin…", true)
    else hidePill()
  }

  const tick = () => { check(); setTimeout(tick, waiting() ? FAST_POLL : SLOW_POLL) }
  setTimeout(tick, waiting() ? 2e3 : SLOW_POLL)
  if (waiting()) showPill("Syncing Garmin…", true)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { hiddenAt = Date.now(); return }
    check({ resumed: Date.now() - hiddenAt > 20e3 })
  })
  addEventListener("pageshow", e => { if (e.persisted) check({ resumed: true }) })
  addEventListener("online", () => check())
}

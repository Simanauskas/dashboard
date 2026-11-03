// Keeps the logger openable with no signal. Pages: network first (the bot
// deploys hourly, so fresh HTML matters), falling back to the cached copy.
// Hashed assets: cache first — their names change whenever their content does.
const CACHE = "log-v1"

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["/log/", "/log/manifest.webmanifest", "/log/icon-180.png"])).then(() => self.skipWaiting()))
})
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener("fetch", e => {
  const req = e.request
  if (req.method !== "GET") return
  const url = new URL(req.url)
  if (url.origin !== location.origin) return
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put("/log/", copy)); return r
    }).catch(() => caches.match("/log/")))
    return
  }
  if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/log/")) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)) }
      return r
    })))
  }
})

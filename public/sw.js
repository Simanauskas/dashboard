// One service worker for the whole app: the dashboard (/) and the logger (/log/).
// Pages: network first (the sync bot redeploys many times a day, so fresh HTML
// matters), falling back to the last copy — so both open with no signal, the
// dashboard showing the data it had when it was last online.
// Hashed assets: cache first — their names change whenever their content does.
const CACHE = "app-v1"
const shell = path => (path.startsWith("/log") ? "/log/" : "/")

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(["/", "/log/", "/manifest.webmanifest", "/log/icon-180.png"]))
    .then(() => self.skipWaiting()))
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
    const key = shell(url.pathname)
    e.respondWith(fetch(req).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(key, copy)) }
      return r
    }).catch(() => caches.match(key)))
    return
  }
  if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/log/")) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)) }
      return r
    })))
  }
})

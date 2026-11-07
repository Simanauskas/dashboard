import React from "react"
import { createRoot } from "react-dom/client"
import LogApp from "./LogApp.jsx"
import "./log.css"

// iOS home-screen apps (his iPhone 15 Pro, Nov 2026) sometimes report a
// viewport 59pt shorter than the screen, and switch back to full height later
// without telling anyone. Fixed elements sit on the viewport's bottom, so the
// tab bar floated above an empty strip — or, with a stale correction, below the
// screen. So the gap is re-measured on every resize/scroll/visibility change
// and twice a second, and the CSS pulls the bars down by the current gap.
// Home-screen app, portrait, plausible gap only; 0 everywhere else.
function fixViewportGap() {
  const standalone = navigator.standalone || matchMedia("(display-mode: standalone)").matches
  const portrait = innerHeight > innerWidth
  const gap = Math.round(Math.max(screen.height, screen.width) - innerHeight)
  const use = standalone && portrait && gap > 0 && gap < 120 ? gap : 0
  if (window.__viewport?.gap !== use) document.documentElement.style.setProperty("--vgap", `${use}px`)
  window.__viewport = { standalone: !!standalone, screen: Math.max(screen.height, screen.width), inner: innerHeight, gap: use }
}
fixViewportGap()
for (const ev of ["resize", "scroll", "pageshow", "focus"]) addEventListener(ev, fixViewportGap, { passive: true })
visualViewport?.addEventListener("resize", fixViewportGap)
document.addEventListener("visibilitychange", fixViewportGap)
setInterval(fixViewportGap, 500)

createRoot(document.getElementById("root")).render(<LogApp />)

// Offline shell: the gym often has no signal. Logs themselves live in
// localStorage; the service worker only keeps the app itself loadable.
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("/log/sw.js", { scope: "/log/" }).catch(() => {})
}

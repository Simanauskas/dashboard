import React from "react"
import { createRoot } from "react-dom/client"
import LogApp from "./LogApp.jsx"
import "./log.css"

// iOS home-screen apps (seen on his iPhone 15 Pro, Nov 2026) report a viewport
// ~59pt shorter than the screen AND a bottom safe-area inset that is 59pt too
// big (93 instead of 34), which made the tab bar ~60pt too tall. The bar is in
// the right place; only its padding is wrong. Measure the excess and let the
// CSS (--sab in log.css) take it off. Home-screen app, portrait, plausible gap only.
function fixViewportGap() {
  const standalone = navigator.standalone || matchMedia("(display-mode: standalone)").matches
  const portrait = innerHeight > innerWidth
  const gap = Math.round(Math.max(screen.height, screen.width) - innerHeight)
  const use = standalone && portrait && gap > 0 && gap < 120 ? gap : 0
  document.documentElement.style.setProperty("--vgap", `${use}px`)
  window.__viewport = { standalone: !!standalone, screen: Math.max(screen.height, screen.width), inner: innerHeight, gap: use }
}
fixViewportGap()
addEventListener("resize", fixViewportGap)
addEventListener("orientationchange", () => setTimeout(fixViewportGap, 300))

createRoot(document.getElementById("root")).render(<LogApp />)

// Offline shell: the gym often has no signal. Logs themselves live in
// localStorage; the service worker only keeps the app itself loadable.
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("/log/sw.js", { scope: "/log/" }).catch(() => {})
}

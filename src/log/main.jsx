import React from "react"
import { createRoot } from "react-dom/client"
import LogApp from "./LogApp.jsx"
import "./log.css"

// iOS home-screen apps can report a viewport shorter than the screen (by about
// the status-bar height), which floats the fixed tab bar above an empty strip.
// Measure the gap and let the CSS pull the bar down by it. Only in the
// home-screen app, in portrait, and only for a plausible gap.
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

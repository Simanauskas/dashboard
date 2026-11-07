import React from "react"
import { createRoot } from "react-dom/client"
import LogApp from "./LogApp.jsx"
import "./log.css"

// Viewport numbers for the Settings diagnostics line only — nothing is moved.
// (Moving the bars by a measured gap made iOS resize in a loop; the fix is CSS:
// see `html { min-height … }` in log.css.)
function readViewport() {
  const standalone = navigator.standalone || matchMedia("(display-mode: standalone)").matches
  window.__viewport = { standalone: !!standalone, screen: Math.max(screen.height, screen.width), inner: innerHeight }
}
readViewport()
addEventListener("resize", readViewport, { passive: true })

createRoot(document.getElementById("root")).render(<LogApp />)

// Offline shell: the gym often has no signal. Logs themselves live in
// localStorage; the service worker only keeps the app itself loadable.
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("/log/sw.js", { scope: "/log/" }).catch(() => {})
}

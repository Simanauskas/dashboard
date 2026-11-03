import React from "react"
import { createRoot } from "react-dom/client"
import LogApp from "./LogApp.jsx"
import "./log.css"

createRoot(document.getElementById("root")).render(<LogApp />)

// Offline shell: the gym often has no signal. Logs themselves live in
// localStorage; the service worker only keeps the app itself loadable.
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("/log/sw.js", { scope: "/log/" }).catch(() => {})
}

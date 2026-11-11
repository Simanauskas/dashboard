import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// The app-wide service worker (public/sw.js): keeps the dashboard and the
// logger openable from the home screen with no signal.
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {})
}

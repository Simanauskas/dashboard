import React, { useState } from 'react'
import { login } from '../matrix.js'

const DEFAULT_SERVER = import.meta.env.VITE_HOMESERVER || ''

export default function Login({ onLogin }) {
  const [server, setServer] = useState(() => { try { return localStorage.getItem('inbox.server') || DEFAULT_SERVER } catch { return DEFAULT_SERVER } })
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      let base = server.trim()
      if (!/^https?:\/\//.test(base)) base = 'https://' + base
      const s = await login(base, user.trim(), password)
      try { localStorage.setItem('inbox.server', base) } catch {}
      onLogin(s)
    } catch (err) {
      setError(err.status === 403 ? 'Wrong username or password.' : `Couldn't sign in: ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login">
      <form onSubmit={submit} className="card">
        <img src="/icon.svg" alt="" width="64" height="64" />
        <h1>Inbox</h1>
        <p className="muted">All your chats, one thread per person.</p>
        <label>Server<input value={server} onChange={(e) => setServer(e.target.value)} placeholder="https://matrix.example.com" autoCapitalize="off" autoCorrect="off" required /></label>
        <label>Username<input value={user} onChange={(e) => setUser(e.target.value)} autoCapitalize="off" autoCorrect="off" autoComplete="username" required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}

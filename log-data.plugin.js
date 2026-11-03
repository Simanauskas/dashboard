// Build-time data for the phone logger (/log).
//
// Exposes `virtual:log-data` — a small JSON module computed from what is
// already in the repo, so the logger never has to download the 400 KB
// dashboard bundle or call Garmin:
//   types     — activity types done in the last 365 days, with counts
//   opponents — names from past tennis activities ("Name🎾score")
//   fixtures  — upcoming tennis fixtures that calendar_sync.py wrote to SCHEDULE
//   sessions  — the last 80 logged sessions (data/sessions/*.json) with their
//               Garmin status, used for "last time" prefill and history
// The garmin-bot commits hourly, so every deploy carries fresh data.
import fs from 'node:fs'
import path from 'node:path'

const ID = 'virtual:log-data'

function build(root) {
  const app = fs.readFileSync(path.join(root, 'src/App.jsx'), 'utf8')
  const cutoff = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10)
  const counts = {}
  const opponents = new Map()
  const csv = (app.match(/const CSV_DATA = `([\s\S]*?)`;/) || [, ''])[1]
  for (const line of csv.split('\n')) {
    const m = line.match(/^"([^"]+)","(\d{4}-\d{2}-\d{2})[^"]*","[^"]*","([^"]*)"/)
    if (!m) continue
    const [, type, date, name] = m
    if (date >= cutoff) counts[type] = (counts[type] || 0) + 1
    const opp = name.includes('🎾') ? name.split('🎾')[0].trim() : ''
    if (opp && /\s/.test(opp)) opponents.set(opp, Math.max(opponents.get(opp) || '', date))
  }
  const fixtures = []
  for (const m of app.matchAll(/date:"(\d{4}-\d{2}-\d{2})"[^\n]*?\{type:"tennis",cal:true,text:"([^"]*)"\}/g)) {
    const who = (m[2].split('·')[1] || '').trim()
    if (who && !/^court/i.test(who)) fixtures.push({ date: m[1], opponent: who })
  }
  const dir = path.join(root, 'data/sessions')
  const sessions = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().slice(-80).map(f => {
        try {
          const s = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
          const st = s.status || {}
          delete s.status
          return { ...s, status: { state: st.state, garmin_id: st.garmin_id, message: st.message } }
        } catch { return null }
      }).filter(Boolean)
    : []
  return {
    built: new Date().toISOString(),
    types: Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([type, n]) => ({ type, n })),
    opponents: [...opponents.entries()].sort((a, b) => (a[1] < b[1] ? 1 : -1)).map(([n]) => n).slice(0, 40),
    fixtures,
    sessions,
  }
}

export default function logData() {
  let root = process.cwd()
  return {
    name: 'log-data',
    configResolved(c) { root = c.root },
    resolveId(id) { return id === ID ? '\0' + ID : null },
    load(id) {
      if (id !== '\0' + ID) return null
      return `export default ${JSON.stringify(build(root))}`
    },
  }
}

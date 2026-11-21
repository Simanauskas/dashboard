// Build-time data for the Runs screen (src/Runs.jsx).
//
// `virtual:runs-index` is the small list (data/runs/index.json). The per-second
// detail for each run (data/runs/<id>.json, ~100-200 KB) is NOT bundled: it is
// emitted as a static file at /runs-data/<id>.json and fetched when a run is
// opened. Written by run_analysis.py / runs_sync.py. In dev the same URLs are
// served straight from data/runs/.
import fs from 'node:fs'
import path from 'node:path'

const ID = 'virtual:runs-index'

export default function runsData() {
  let root = process.cwd()
  const dir = () => path.join(root, 'data/runs')
  return {
    name: 'runs-data',
    configResolved(c) { root = c.root },
    resolveId(id) { return id === ID ? '\0' + ID : null },
    load(id) {
      if (id !== '\0' + ID) return null
      const f = path.join(dir(), 'index.json')
      return `export default ${fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '[]'}`
    },
    generateBundle() {
      if (!fs.existsSync(dir())) return
      for (const f of fs.readdirSync(dir())) {
        if (/^\d+\.json$/.test(f)) {
          this.emitFile({ type: 'asset', fileName: `runs-data/${f}`, source: fs.readFileSync(path.join(dir(), f)) })
        }
      }
    },
    configureServer(server) {
      server.middlewares.use('/runs-data', (req, res, next) => {
        const f = path.join(dir(), path.basename((req.url || '').split('?')[0]))
        if (!fs.existsSync(f)) return next()
        res.setHeader('Content-Type', 'application/json')
        res.end(fs.readFileSync(f))
      })
    },
  }
}

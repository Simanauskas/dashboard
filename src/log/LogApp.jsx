import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import DATA from "virtual:log-data"
import { exByName, searchExercises, STRENGTH_TEMPLATES, RUN_TEMPLATES, HYROX_TEMPLATE, CIRCUIT_TEMPLATES, TILES, otherOptions } from "./catalog.js"
import { store, send, sendAction, flush, fetchStatus, testToken } from "./store.js"

// ── helpers ─────────────────────────────────────────────────────────────────
const pad = n => String(n).padStart(2, "0")
function isoLocal(d = new Date()) {
  const off = -d.getTimezoneOffset(), s = off >= 0 ? "+" : "-", a = Math.abs(off)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${s}${pad(a / 60 | 0)}:${pad(a % 60)}`
}
const clock = sec => {
  if (sec == null || isNaN(sec)) return ""
  sec = Math.round(sec); const h = sec / 3600 | 0, m = (sec % 3600) / 60 | 0, s = sec % 60
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}
// "10:00", "10.00", "1:02:30" → seconds. A bare number is minutes (or seconds when plain="sec").
function parseTime(t, plain = "min") {
  t = String(t || "").trim().replace(",", ".")
  if (!t) return null
  const parts = t.split(/[:.]/).map(Number)
  if (parts.some(isNaN)) return null
  if (parts.length === 1) return plain === "sec" ? parts[0] : parts[0] * 60
  return parts.reduce((acc, p) => acc * 60 + p, 0)
}
const numOrNull = v => (v === "" || v == null || isNaN(Number(String(v).replace(",", "."))) ? null : Number(String(v).replace(",", ".")))
const fmtKg = v => (v == null ? "BW" : `${v}`)
const dayName = iso => new Date(iso).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })
const timeOf = iso => (iso || "").slice(11, 16)
const sortedSessions = list => [...list].sort((a, b) => ((a.start || "") < (b.start || "") ? 1 : -1))

const OTHER = otherOptions(DATA.types)
const OPTIONS = [...TILES.Indoors, ...TILES.Outdoors, ...OTHER]
// Treadmill and bike distances are typed in km; everything is stored in metres.
const MACHINE = {
  SkiErg: { unit: "m", pace: "500" }, Row: { unit: "m", pace: "500" }, BikeErg: { unit: "m", pace: "500" },
  Treadmill: { unit: "km", pace: "km", total: true }, Bike: { unit: "km", pace: "kmh" },
}
const paceText = (machine, m, sec) => {
  if (!m || !sec) return ""
  const k = (MACHINE[machine] || MACHINE.SkiErg).pace
  return k === "km" ? `${clock(sec * 1000 / m)}/km` : k === "kmh" ? `${(m / sec * 3.6).toFixed(1)} km/h` : `${clock(sec * 500 / m)}/500m`
}

function useStore() {
  return useSyncExternalStore(store.subscribe, () => store.entries)
}

// All sessions this phone knows about: its own, plus ones the build carried in.
function allSessions(entries) {
  const map = new Map(DATA.sessions.map(s => [s.id, s]))
  for (const e of Object.values(entries)) map.set(e.session.id, e.session)
  return sortedSessions([...map.values()])
}

function lastExercise(entries, name, beforeStart) {
  const n = name.toLowerCase()
  for (const s of allSessions(entries)) {
    if (s.kind !== "strength" || (beforeStart && s.start >= beforeStart)) continue
    const ex = (s.exercises || []).find(e => e.name.toLowerCase() === n && e.sets?.some(x => x.n != null))
    if (ex) return ex.sets.filter(x => x.n != null || x.kg != null)
  }
  return null
}

// `pick` is a name (templates, history) or an entry chosen in the picker.
// Custom exercises he added before (not in Garmin's list), from strength and
// circuit sessions on this phone and in the repo — offered again in search.
function customExercises(entries) {
  const seen = new Map()
  for (const s of allSessions(entries))
    for (const e of [...(s.exercises || []), ...(s.circuit?.stations || [])])
      if (!e.cat && e.name && !seen.has(e.name.toLowerCase()))
        seen.set(e.name.toLowerCase(), { name: e.name, cat: null, gname: null, unit: e.unit || "reps", catLabel: "your custom" })
  return [...seen.values()]
}

// Distinct workout names of past sessions of a kind, newest first.
function pastWorkouts(entries, kind, builtIn, selfId) {
  const out = new Map()
  for (const s of allSessions(entries))
    if (s.kind === kind && s.template && s.id !== selfId && !builtIn[s.template] && !out.has(s.template)) out.set(s.template, s)
  return [...out.values()].slice(0, 6)
}

function newStation(pick, n = null, kg = null) {
  const c = (typeof pick === "object" && pick) || exByName(pick) || { name: pick, cat: null, gname: null, unit: "reps" }
  return { name: c.name, cat: c.cat, gname: c.gname, unit: c.unit, n, kg }
}

function newExercise(entries, pick, tpl = {}) {
  const name = typeof pick === "string" ? pick : pick.name
  const cat = (typeof pick === "object" && pick) || exByName(name) || { name, cat: null, gname: null, unit: "reps" }
  const last = lastExercise(entries, cat.name)
  const seed = last || (tpl.seed ? Array.from({ length: tpl.seed.sets }, () => ({ kg: tpl.seed.kg, n: tpl.seed.n })) : [{ kg: null, n: null }])
  return {
    name: cat.name, cat: cat.cat, gname: cat.gname, unit: cat.unit, target: tpl.target || "",
    sets: seed.map(s => ({ kg: null, n: null, ph: { kg: s.kg, n: s.n } })),
  }
}

function initSession(entries, opt) {
  const now = new Date(), start = isoLocal(now)
  // Unique on this phone: a second session of the same kind in the same minute
  // gets "-2" — reusing an id would overwrite the first log.
  const stem = `${start.slice(0, 10)}-${pad(now.getHours())}${pad(now.getMinutes())}-${opt.key}`.toLowerCase().replace(/[^a-z0-9-]/g, "")
  const taken = new Set([...Object.keys(entries), ...DATA.sessions.map(x => x.id)])
  let id = stem
  for (let k = 2; taken.has(id); k++) id = `${stem}-${k}`
  const base = { v: 1, id, kind: opt.kind, activity: opt.label, start, end: null, rpe: null, notes: "", title: "" }
  if (opt.typeKeys) base.type_keys = opt.typeKeys
  if (opt.kind === "strength") return { ...base, template: null, exercises: [] }
  if (opt.kind === "circuit") return { ...base, template: null, circuit: { stations: [], rounds: [], total_sec: null } }
  if (opt.kind === "erg") {
    const last = allSessions(entries).find(s => s.kind === "erg" && s.erg?.machine === opt.machine)
    const erg = { machine: opt.machine, rest_sec: null,
      pieces: (last?.erg?.pieces?.length ? last.erg.pieces : [{}]).map(p => ({ m: null, sec: null, spm: null, ph: { m: p.m, sec: p.sec } })) }
    if (MACHINE[opt.machine]?.unit === "m") erg.damper = last?.erg?.damper ?? null
    if (MACHINE[opt.machine]?.total) erg.total_sec = null
    return { ...base, erg }
  }
  if (opt.kind === "run") {
    const dow = now.getDay()
    const tpl = dow === 2 ? "Speed session" : dow === 4 ? "Easy run" : dow === 6 ? "Long run" : "Other run"
    return { ...base, template: tpl, run: { plan: RUN_TEMPLATES[tpl].options[0] || "", reps: [] } }
  }
  if (opt.kind === "tennis") {
    const today = start.slice(0, 10)
    const fx = DATA.fixtures.find(f => f.date === today)
    return { ...base, tennis: { opponent: fx?.opponent || "", mode: fx ? "match" : "sparring", score: "", plus: [], minus: [] } }
  }
  if (opt.kind === "hyrox") {
    const { rounds, stations } = HYROX_TEMPLATE
    return { ...base, template: "Hyrox stations", hyrox: { stations: [...stations], rounds: Array.from({ length: rounds }, () => stations.map(() => null)), total_sec: null } }
  }
  return base
}

// ── status ──────────────────────────────────────────────────────────────────
function status(entry, built) {
  const remote = entry?.remote || built?.status
  if (entry && (entry.sync === "draft" || !entry.sync)) return entry.sentAt ? { tone: "warn", text: "edited · not sent yet" } : { tone: "mute", text: "draft · saved on this phone" }
  if (entry?.sync === "queued") return { tone: "warn", text: "waiting for signal", detail: entry.error }
  if (entry?.sync === "sending") return { tone: "info", text: "sending…" }
  if (!remote?.state) return { tone: "info", text: "sent · waiting for Garmin" }
  if (remote.state === "applied") return { tone: "ok", text: "✓ in Garmin", detail: remote.message !== "ok" ? remote.message : "", garmin: remote.garmin_id }
  if (remote.state === "pending") return { tone: "info", text: "waiting for the Garmin activity", detail: "matched on the next sync after the watch uploads" }
  if (remote.state === "undone") return { tone: "mute", text: "undone in Garmin" }
  return { tone: "bad", text: remote.state === "no_match" ? "no Garmin activity found" : "Garmin write failed", detail: remote.message }
}

// ── small UI pieces ─────────────────────────────────────────────────────────
function Chips({ value, options, onChange }) {
  return <div className="chips">{options.map(o => {
    const [v, l] = Array.isArray(o) ? o : [o, o]
    return <button key={v} type="button" className={"chip" + (value === v ? " on" : "")} onClick={() => onChange(value === v ? null : v)}>{l}</button>
  })}</div>
}

function TimeInput({ value, onChange, plain = "min", placeholder, className = "" }) {
  const [text, setText] = useState(value != null ? clock(value) : "")
  useEffect(() => { setText(value != null ? clock(value) : "") }, [value])
  return <input className={"in " + className} inputMode="decimal" placeholder={placeholder} value={text}
    onChange={e => setText(e.target.value)} onBlur={() => { const s = parseTime(text, plain); onChange(s); setText(s != null ? clock(s) : "") }} />
}

function NumInput({ value, onChange, placeholder, className = "" }) {
  return <input className={"in " + className} inputMode="decimal" placeholder={placeholder ?? ""}
    value={value ?? ""} onChange={e => onChange(e.target.value === "" ? null : e.target.value)}
    onBlur={e => onChange(numOrNull(e.target.value))} />
}

const Field = ({ label, children, hint }) => (
  <label className="field"><span className="lbl">{label}</span>{children}{hint && <span className="hint">{hint}</span>}</label>
)

// ── strength ────────────────────────────────────────────────────────────────
function StrengthForm({ s, set, entries }) {
  if (!s.template) {
    const past = pastWorkouts(entries, "strength", STRENGTH_TEMPLATES, s.id)
    return <div className="card">
      <div className="h">Which workout?</div>
      <div className="grid2">
        {Object.keys(STRENGTH_TEMPLATES).map(t => <button key={t} className="big" onClick={() =>
          set({ ...s, template: t, exercises: STRENGTH_TEMPLATES[t].map(x => newExercise(entries, x.name, x)) })}>{t}</button>)}
        {past.map(p => <button key={p.template} className="big" onClick={() =>
          set({ ...s, template: p.template, exercises: p.exercises.map(e => newExercise(entries, e.cat ? e : e.name)) })}>Repeat “{p.template}”</button>)}
      </div>
      <div className="hint">Name a workout at the top and it's offered here next time.</div>
    </div>
  }
  const upd = (i, e) => set({ ...s, exercises: s.exercises.map((x, j) => (j === i ? e : x)) })
  return <>
    <div className="row between">
      <input className="in title" value={s.template} onChange={e => set({ ...s, template: e.target.value })} aria-label="Workout name" />
    </div>
    {s.exercises.map((e, i) => <ExerciseCard key={i} e={e} entries={entries} start={s.start}
      onChange={x => upd(i, x)} onRemove={() => set({ ...s, exercises: s.exercises.filter((_, j) => j !== i) })} />)}
    <AddExercise onAdd={pick => set({ ...s, exercises: [...s.exercises, newExercise(entries, pick)] })} />
  </>
}

// Exercise search over Garmin's whole catalog. Tapping a result uses Garmin's
// exercise (it lands in the Sets tab). "Add as custom" is offered only when the
// search finds nothing; a custom exercise goes to the notes only.
function ExercisePicker({ value = "", onPick, placeholder, className = "", clearOnPick = false }) {
  const entries = useStore()
  const [text, setText] = useState(value)
  const [open, setOpen] = useState(false)
  useEffect(() => { setText(value) }, [value])
  const q = text.trim()
  const customs = useMemo(() => customExercises(entries), [entries])
  const results = useMemo(() => {
    if (!q) return []
    const words = q.toLowerCase().split(/\s+/)
    const mine = customs.filter(c => words.every(w => c.name.toLowerCase().includes(w)))
    return [...mine, ...searchExercises(q)].slice(0, 8)
  }, [q, customs])
  const exact = q && (exByName(q) || customs.find(c => c.name.toLowerCase() === q.toLowerCase()))
  const choose = entry => {
    onPick(entry)
    setText(clearOnPick ? "" : entry.name)
    setOpen(false)
  }
  const custom = () => choose({ name: q, cat: null, gname: null, unit: "reps" })
  const keep = ev => ev.preventDefault()          // keep focus while tapping a result
  return <div className="picker">
    <input className={"in " + className} placeholder={placeholder} value={text} autoComplete="off" autoCorrect="off" spellCheck={false}
      enterKeyHint="done"
      onFocus={() => setOpen(true)}
      onChange={ev => { setText(ev.target.value); setOpen(true) }}
      onKeyDown={ev => {
        if (ev.key !== "Enter" || !q) return
        ev.preventDefault()
        choose(exact || results[0] || { name: q, cat: null, gname: null, unit: "reps" })
      }}
      onBlur={() => {
        setOpen(false)
        if (clearOnPick || q === value) return
        // Tapped away without choosing: an exact Garmin name is taken, text with
        // no matches becomes custom, anything else goes back to what it was.
        if (exact) choose(exact)
        else if (q && !results.length) custom()
        else setText(value)
      }} />
    {open && q && <div className="sugg" onPointerDown={keep} onMouseDown={keep}>
      {results.map(r => <button type="button" key={`${r.cat}/${r.gname}/${r.name}`} onClick={() => choose(r)}>
        <span>{r.name}</span><small>{r.catLabel}</small>
      </button>)}
      {!results.length && <button type="button" className="custom" onClick={custom}>
        <span>+ Add “{q}” as custom</span><small>not in Garmin — notes only</small>
      </button>}
    </div>}
  </div>
}

function AddExercise({ onAdd }) {
  return <div className="card">
    <ExercisePicker placeholder="Add exercise — type to search Garmin's list" clearOnPick onPick={onAdd} />
  </div>
}

function ExerciseCard({ e, onChange, onRemove, entries, start }) {
  const unitLbl = { reps: "reps", m: "m", s: "sec" }[e.unit]
  const last = useMemo(() => lastExercise(entries, e.name, start), [entries, e.name, start])
  const setSet = (k, p) => onChange({ ...e, sets: e.sets.map((x, j) => (j === k ? { ...x, ...p } : x)) })
  const rename = c => onChange({ ...e, name: c.name, cat: c.cat, gname: c.gname, unit: c.cat ? c.unit : e.unit })
  return <div className="card">
    <div className="row">
      <div className="grow"><ExercisePicker className="exname" value={e.name} onPick={rename} /></div>
      <button className="x" onClick={onRemove} aria-label="Remove exercise">✕</button>
    </div>
    <div className="meta">
      {e.target && <span>plan {e.target}</span>}
      {last && <span>last {fmtKg(last[0].kg)}{last[0].kg != null ? "kg" : ""} × {last.map(x => x.n).join("·")}</span>}
      {!e.cat && <span className="warn">not in Garmin's list — notes only</span>}
    </div>
    <Chips value={e.unit} options={[["reps", "reps"], ["m", "metres"], ["s", "seconds"]]} onChange={u => u && onChange({ ...e, unit: u })} />
    {e.sets.map((x, k) => {
      const done = x.n != null || x.kg != null
      return <div className={"setrow" + (done ? " done" : "")} key={k}>
        <span className="idx">{k + 1}</span>
        <NumInput className="kg" value={x.kg} placeholder={x.ph?.kg ?? "kg"} onChange={v => setSet(k, { kg: v })} />
        <span className="u">kg ×</span>
        <NumInput className="reps" value={x.n} placeholder={x.ph?.n ?? unitLbl} onChange={v => setSet(k, { n: v })} />
        <span className="u">{unitLbl}</span>
        <button className={"tick" + (done ? " on" : "")} aria-label="Same as shown"
          onClick={() => setSet(k, done ? { kg: null, n: null } : { kg: x.ph?.kg ?? null, n: x.ph?.n ?? null })}>✓</button>
        <button className="x sm" onClick={() => onChange({ ...e, sets: e.sets.filter((_, j) => j !== k) })} aria-label="Remove set">✕</button>
      </div>
    })}
    <button className="btn ghost" onClick={() => {
      const prev = e.sets[e.sets.length - 1] || {}
      onChange({ ...e, sets: [...e.sets, { kg: null, n: null, ph: { kg: prev.kg ?? prev.ph?.kg ?? null, n: prev.n ?? prev.ph?.n ?? null } }] })
    }}>+ set</button>
  </div>
}

// ── erg ─────────────────────────────────────────────────────────────────────
function ErgForm({ s, set }) {
  const e = s.erg
  const cfg = MACHINE[e.machine] || MACHINE.SkiErg
  const km = cfg.unit === "km"
  const label = { Treadmill: "Indoor run", Bike: "Indoor bike" }[e.machine] || e.machine
  const up = p => set({ ...s, erg: { ...e, ...p } })
  const setP = (i, p) => up({ pieces: e.pieces.map((x, j) => (j === i ? { ...x, ...p } : x)) })
  const tot = e.pieces.reduce((a, p) => ({ m: a.m + (p.m || 0), sec: a.sec + (p.sec || 0) }), { m: 0, sec: 0 })
  const shown = (m, ph) => (m == null ? null : km && typeof m === "number" ? +(m / 1000).toFixed(3) : m)
  const dist = m => (km ? `${+(m / 1000).toFixed(2)} km` : `${m} m`)
  return <div className="card">
    <div className="h">{label} {km ? "segments" : "pieces"}</div>
    {e.pieces.map((p, i) => <div className="ergrow" key={i}>
      <span className="idx">{i + 1}</span>
      <KmInput km={km} value={p.m} placeholder={p.ph?.m != null ? String(shown(p.ph.m)) : km ? "km" : "metres"} onChange={v => setP(i, { m: v })} />
      <span className="u">{km ? "km" : "m"}</span>
      <TimeInput className="t" value={p.sec} placeholder={p.ph?.sec ? clock(p.ph.sec) : "time"} onChange={v => setP(i, { sec: v })} />
      {!km && <NumInput className="spm" value={p.spm} placeholder="spm" onChange={v => setP(i, { spm: v })} />}
      <span className="pace">{paceText(e.machine, p.m, p.sec)}</span>
      {e.pieces.length > 1 && <button className="x sm" onClick={() => up({ pieces: e.pieces.filter((_, j) => j !== i) })}>✕</button>}
    </div>)}
    <button className="btn ghost" onClick={() => {
      const prev = e.pieces[e.pieces.length - 1] || {}
      up({ pieces: [...e.pieces, { m: null, sec: null, spm: null, ph: { m: prev.m ?? prev.ph?.m, sec: prev.sec ?? prev.ph?.sec } }] })
    }}>{km ? "+ segment" : "+ piece"}</button>
    {!km && <div className="grid2">
      <Field label="Damper"><NumInput value={e.damper} onChange={v => up({ damper: v })} /></Field>
      <Field label="Rest between"><TimeInput value={e.rest_sec} plain="sec" placeholder="e.g. 1:30" onChange={v => up({ rest_sec: v })} /></Field>
    </div>}
    {cfg.total && <Field label="Total time on the treadmill" hint="replaces the time Garmin recorded — blank = the segments added up">
      <TimeInput value={e.total_sec} placeholder={tot.sec ? clock(tot.sec) : "e.g. 32:10"} onChange={v => up({ total_sec: v })} />
    </Field>}
    {tot.m > 0 && <div className="total">{dist(tot.m)} · {clock(cfg.total && e.total_sec ? e.total_sec : tot.sec)}{tot.sec ? ` · ${paceText(e.machine, tot.m, tot.sec)}` : ""}</div>}
    <div className="hint">Time: 10:00 or 10.00 — a plain number is minutes. {km ? "Distance (and for the treadmill, time) replaces what Garmin recorded." : "Distance goes into Garmin's distance field."}</div>
  </div>
}

// Distance input in km (treadmill, bike) or metres; always stores metres.
function KmInput({ km, value, onChange, placeholder }) {
  const [text, setText] = useState(value == null ? "" : km ? String(+(value / 1000).toFixed(3)) : String(value))
  useEffect(() => { setText(value == null ? "" : km ? String(+(value / 1000).toFixed(3)) : String(value)) }, [value, km])
  return <input className="in m" inputMode="decimal" placeholder={placeholder} value={text}
    onChange={ev => setText(ev.target.value)}
    onBlur={() => { const v = numOrNull(text); onChange(v == null ? null : km ? Math.round(v * 1000) : v) }} />
}

// ── circuit ─────────────────────────────────────────────────────────────────
// HIIT on the watch. Stations are Garmin exercises (or his customs); every
// station of every round becomes a set in the HIIT activity's Sets tab.
function CircuitForm({ s, set, entries }) {
  const c = s.circuit
  if (!s.template) {
    const past = pastWorkouts(entries, "circuit", CIRCUIT_TEMPLATES, s.id)
    const start = (template, stations, rounds) => set({ ...s, template,
      circuit: { stations, rounds: Array.from({ length: rounds }, () => stations.map(() => null)), total_sec: null } })
    return <div className="card">
      <div className="h">Which workout?</div>
      <div className="grid2">
        {Object.entries(CIRCUIT_TEMPLATES).map(([t, w]) => {
          // Done before? Start from last time's stations and loads.
          const prev = allSessions(entries).find(x => x.kind === "circuit" && x.template === t && x.id !== s.id && x.circuit?.stations?.length)
          return <button key={t} className="big" onClick={() => prev
            ? start(t, prev.circuit.stations.map(x => ({ ...x })), prev.circuit.rounds.length || w.rounds)
            : start(t, w.stations.map(([n, amt]) => newStation(n, amt)), w.rounds)}>{t}</button>
        })}
        {past.map(p => <button key={p.template} className="big"
          onClick={() => start(p.template, p.circuit.stations.map(x => ({ ...x })), p.circuit.rounds.length || 3)}>Repeat “{p.template}”</button>)}
        <button className="big" onClick={() => start("Circuit", [], 3)}>Empty</button>
      </div>
      <div className="hint">Record it as <b>HIIT</b> on the watch. Name a workout at the top and it's offered here next time.</div>
    </div>
  }
  const up = p => set({ ...s, circuit: { ...c, ...p } })
  const setSt = (j, p) => up({ stations: c.stations.map((x, k) => (k === j ? { ...x, ...p } : x)) })
  const sum = c.rounds.flat().reduce((a, x) => a + (x || 0), 0)
  return <>
    <div className="row between">
      <input className="in title" value={s.template} onChange={e => set({ ...s, template: e.target.value })} aria-label="Workout name" />
    </div>
    <div className="card">
      <div className="row between">
        <div className="h">{c.rounds.length} rounds</div>
        <div className="row">
          <button className="x" aria-label="One round less" onClick={() => c.rounds.length > 1 && up({ rounds: c.rounds.slice(0, -1) })}>−</button>
          <button className="x" aria-label="One round more" onClick={() => up({ rounds: [...c.rounds, c.stations.map(() => null)] })}>+</button>
        </div>
      </div>
      <div className="hint">Split times per round are optional.</div>
    </div>
    {c.stations.map((st, j) => <div className="card" key={j}>
      <div className="row">
        <div className="grow"><ExercisePicker className="exname" value={st.name}
          onPick={pick => setSt(j, { name: pick.name, cat: pick.cat, gname: pick.gname, unit: pick.cat ? pick.unit : st.unit })} /></div>
        <button className="x" aria-label="Remove station" onClick={() => up({ stations: c.stations.filter((_, k) => k !== j), rounds: c.rounds.map(r => r.filter((_, k) => k !== j)) })}>✕</button>
      </div>
      {!st.cat && <div className="meta"><span className="warn">not in Garmin's list — notes only</span></div>}
      <div className="setrow">
        <NumInput className="reps" value={st.n} placeholder="amount" onChange={v => setSt(j, { n: v })} />
        <Chips value={st.unit} options={[["m", "m"], ["reps", "reps"], ["s", "sec"]]} onChange={u => u && setSt(j, { unit: u })} />
        <NumInput className="kg" value={st.kg} placeholder="kg" onChange={v => setSt(j, { kg: v })} />
      </div>
      <div className="hxrow" style={{ gridTemplateColumns: `repeat(${c.rounds.length}, minmax(0,1fr))` }}>
        {c.rounds.map((row, r) => <TimeInput key={r} className="cell" value={row[j]} placeholder={`R${r + 1}`}
          onChange={v => up({ rounds: c.rounds.map((rw, k) => (k === r ? rw.map((x, q) => (q === j ? v : x)) : rw)) })} />)}
      </div>
    </div>)}
    <div className="card">
      <ExercisePicker placeholder="Add station — type to search Garmin's list" clearOnPick
        onPick={pick => up({ stations: [...c.stations, newStation(pick)], rounds: c.rounds.map(r => [...r, null]) })} />
    </div>
    <div className="card">
      <Field label="Total time" hint={sum ? `splits add up to ${clock(sum)}` : "or leave blank"}>
        <TimeInput value={c.total_sec} placeholder={sum ? clock(sum) : "e.g. 41:20"} onChange={v => up({ total_sec: v })} />
      </Field>
    </div>
  </>
}

// ── run ─────────────────────────────────────────────────────────────────────
function RunForm({ s, set, entries }) {
  const r = s.run
  const up = p => set({ ...s, run: { ...r, ...p } })
  const tpl = RUN_TEMPLATES[s.template] || RUN_TEMPLATES["Other run"]
  const nReps = (r.plan.match(/^(\d+)\s*[×x]/) || [])[1]
  const reps = nReps ? Array.from({ length: +nReps }, (_, i) => r.reps[i] ?? null) : r.reps
  return <div className="card">
    <Chips value={s.template} options={Object.keys(RUN_TEMPLATES)} onChange={t => t && set({ ...s, template: t, run: { ...r, plan: RUN_TEMPLATES[t].options[0] || "" } })} />
    {tpl.goal && <div className="hint">{tpl.goal}</div>}
    {tpl.options.length > 1 && <Chips value={r.plan} options={tpl.options} onChange={p => p && up({ plan: p })} />}
    <Field label="Session"><input className="in" value={r.plan} onChange={e => up({ plan: e.target.value })} placeholder="e.g. 6×400m @ 5K pace" /></Field>
    {nReps && <>
      <div className="lbl">Rep times</div>
      <div className="reps">{reps.map((t, i) => <TimeInput key={i} className="rep" plain="sec" value={t} placeholder={`#${i + 1}`}
        onChange={v => { const a = [...reps]; a[i] = v; up({ reps: a }) }} />)}</div>
      <div className="hint">1:22 or 1.22 — a plain number is seconds.</div>
    </>}
  </div>
}

// ── tennis ──────────────────────────────────────────────────────────────────
function TennisForm({ s, set }) {
  const t = s.tennis
  const up = p => set({ ...s, tennis: { ...t, ...p } })
  const today = s.start.slice(0, 10)
  const names = [...new Set([...DATA.fixtures.filter(f => f.date === today).map(f => f.opponent), ...DATA.opponents])]
  const lines = v => v.split("\n")
  return <div className="card">
    <Chips value={t.mode} options={[["match", "Match"], ["sparring", "Sparring"], ["training", "Training"]]} onChange={m => m && up({ mode: m })} />
    <Field label="Opponent / coach"><input className="in" list="opps" value={t.opponent} onChange={e => up({ opponent: e.target.value })} /></Field>
    <datalist id="opps">{names.map(n => <option key={n} value={n} />)}</datalist>
    <Field label="Score (yours first)" hint="6:4 3:6 10:8 · set tiebreak 7:6(2)"><input className="in" value={t.score} onChange={e => up({ score: e.target.value })} /></Field>
    <Field label="+ went well (one per line)"><textarea className="in" rows={3} value={t.plus.join("\n")} onChange={e => up({ plus: lines(e.target.value) })} placeholder="fh good at the start" /></Field>
    <Field label="− didn't (one per line)"><textarea className="in" rows={3} value={t.minus.join("\n")} onChange={e => up({ minus: lines(e.target.value) })} placeholder="serve toss" /></Field>
  </div>
}

// ── hyrox stations ──────────────────────────────────────────────────────────
function HyroxForm({ s, set }) {
  const h = s.hyrox
  const up = p => set({ ...s, hyrox: { ...h, ...p } })
  const sum = h.rounds.flat().reduce((a, x) => a + (x || 0), 0)
  return <div className="card">
    <div className="h">{h.rounds.length} rounds · minimal rest</div>
    {h.stations.map((st, j) => <div className="hxst" key={j}>
      <input className="in st" value={st} aria-label="Station"
        onChange={e => up({ stations: h.stations.map((x, k) => (k === j ? e.target.value : x)) })} />
      <div className="hxrow" style={{ gridTemplateColumns: `repeat(${h.rounds.length}, minmax(0,1fr))` }}>
        {h.rounds.map((row, r) => <TimeInput key={r} className="cell" value={row[j]} placeholder={`R${r + 1}`}
          onChange={v => up({ rounds: h.rounds.map((rw, k) => (k === r ? rw.map((x, q) => (q === j ? v : x)) : rw)) })} />)}
      </div>
    </div>)}
    <div className="row gap">
      <button className="btn ghost" onClick={() => up({ rounds: [...h.rounds, h.stations.map(() => null)] })}>+ round</button>
      {h.rounds.length > 1 && <button className="btn ghost" onClick={() => up({ rounds: h.rounds.slice(0, -1) })}>− round</button>}
      <button className="btn ghost" onClick={() => up({ stations: [...h.stations, "Station"], rounds: h.rounds.map(r => [...r, null]) })}>+ station</button>
    </div>
    <Field label="Total time" hint={sum ? `splits add up to ${clock(sum)}` : "or leave blank and log splits"}>
      <TimeInput value={h.total_sec} placeholder={sum ? clock(sum) : "e.g. 52:10"} onChange={v => up({ total_sec: v })} />
    </Field>
  </div>
}

// ── editor ──────────────────────────────────────────────────────────────────
function Editor({ id, go }) {
  const entries = useStore()
  const entry = entries[id]
  const built = DATA.sessions.find(x => x.id === id)
  const [showOther, setShowOther] = useState(false)
  const s = entry?.session
  const set = next => store.put(next, { sync: "draft" })

  const begin = opt => {
    const ses = initSession(entries, opt)
    store.put(ses, { sync: "draft" })
    go("edit", ses.id)
  }
  if (!s) {
    return <div className="page">
      <Top title="New session" onBack={() => go("home")} />
      {Object.entries(TILES).map(([group, tiles]) => <div key={group}>
        <div className="sec">{group}</div>
        <div className="tiles">{tiles.map(o => <button key={o.key} className="tile" onClick={() => begin(o)}>
          <span className="ic" aria-hidden="true">{o.icon}</span><b>{o.label}</b>{o.sub && <small>{o.sub}</small>}
        </button>)}</div>
      </div>)}
      {OTHER.length > 0 && <>
        <button className="link" onClick={() => setShowOther(v => !v)}>{showOther ? "Hide other activities" : "Other…"}</button>
        {showOther && <div className="tiles">{OTHER.map(o => <button key={o.key} className="tile sm" onClick={() => begin(o)}>
          <b>{o.label}</b><small>{o.n}× last year</small>
        </button>)}</div>}
      </>}
    </div>
  }
  const st = status(entry, built)
  const save = () => {
    const end = new Date(), start = new Date(s.start)
    const fixed = { ...s, end: end - start > 4 * 3600e3 || end < start ? null : isoLocal(end) }
    store.put(fixed, { sync: "queued" })
    send(fixed.id)
    go("home")
  }
  const Form = { strength: StrengthForm, circuit: CircuitForm, erg: ErgForm, run: RunForm, tennis: TennisForm, hyrox: HyroxForm }[s.kind]
  return <div className="page has-bar">
    <Top title={s.activity} sub={`${dayName(s.start)} · ${timeOf(s.start)}`} onBack={() => go("home")} />
    <div className={"status " + st.tone}>{st.text}{st.detail ? <small> — {st.detail}</small> : null}</div>
    {Form && <Form s={s} set={set} entries={entries} />}
    <div className="card">
      <div className="lbl">How hard (RPE)</div>
      <Chips value={s.rpe} options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => [n, String(n)])} onChange={v => set({ ...s, rpe: v })} />
      <Field label="Notes"><textarea className="in" rows={3} value={s.notes} onChange={e => set({ ...s, notes: e.target.value })} placeholder="how it felt, pain, conditions…" /></Field>
      <details>
        <summary>Garmin name & time</summary>
        <Field label="Activity name in Garmin" hint="blank = built from the log"><input className="in" value={s.title} onChange={e => set({ ...s, title: e.target.value })} /></Field>
        <Field label="Started" hint="used to find the watch activity — fix it if you log afterwards">
          <input className="in" type="datetime-local" value={s.start.slice(0, 16)} onChange={e => {
            const d = new Date(e.target.value); if (!isNaN(d)) set({ ...s, start: isoLocal(d) })
          }} />
        </Field>
      </details>
    </div>
    {st.garmin && <div className="card">
      <a className="btn ghost" href={`https://connect.garmin.com/modern/activity/${st.garmin}`} target="_blank" rel="noreferrer">Open in Garmin Connect</a>
      <div className="row gap">
        <button className="btn ghost grow" onClick={async () => {
          if (!confirm("Restore the Garmin activity's original name, description and sets?")) return
          try { await sendAction("undo", s.id) } catch (e) { alert(e.message) }
        }}>Undo Garmin write</button>
        <button className="btn ghost grow" onClick={async () => {
          const aid = prompt("Garmin activity id to use instead (from its URL):")
          if (!aid || !/^\d+$/.test(aid.trim())) return
          try { await sendAction("rematch", s.id, aid.trim()) } catch (e) { alert(e.message) }
        }}>Wrong activity…</button>
      </div>
    </div>}
    <button className="link danger" onClick={() => { if (confirm("Delete this log from the phone?")) { store.remove(s.id); go("home") } }}>Delete from phone</button>
    <div className="bar"><button className="btn primary" onClick={save}>{entry.sentAt ? "Save changes & update Garmin" : "Save & send to Garmin"}</button></div>
  </div>
}

// ── home / settings ─────────────────────────────────────────────────────────
function Top({ title, sub, onBack, right }) {
  return <header className="top">
    {onBack ? <button className="back" onClick={onBack} aria-label="Back">‹</button> : <span className="logo">LOG</span>}
    <div className="tt"><div className="t1">{title}</div>{sub && <div className="t2">{sub}</div>}</div>
    {right || <span style={{ width: 36 }} />}
  </header>
}

function Home({ go }) {
  const entries = useStore()
  useEffect(() => {
    flush()
    const cutoff = Date.now() - 3 * 864e5
    for (const e of Object.values(entries))
      if (e.sync === "sent" && Date.parse(e.sentAt) > cutoff && e.remote?.state !== "applied") fetchStatus(e.session.id)
    const on = () => flush()
    window.addEventListener("online", on)
    return () => window.removeEventListener("online", on)
  }, [])
  const list = allSessions(entries).slice(0, 40)
  const drafts = list.filter(s => entries[s.id] && (!entries[s.id].sync || entries[s.id].sync === "draft"))
  return <div className="page">
    <Top title="Training log" right={<button className="back" onClick={() => go("settings")} aria-label="Settings">⚙︎</button>} />
    {!store.settings.token && <div className="status warn" onClick={() => go("settings")}>Add your LOG_TOKEN in ⚙︎ Settings so logs can reach Garmin.</div>}
    <button className="btn primary huge" onClick={() => go("new")}>+ New session</button>
    {drafts.length > 0 && <div className="sec">In progress</div>}
    {drafts.map(s => <Item key={s.id} s={s} entry={entries[s.id]} go={go} />)}
    <div className="sec">Recent</div>
    {list.filter(s => !drafts.includes(s)).map(s => <Item key={s.id} s={s} entry={entries[s.id]} go={go} />)}
    {list.length === 0 && <div className="hint c">Nothing logged yet.</div>}
  </div>
}

function summary(s) {
  if (s.kind === "strength") return `${s.template || "Strength"} · ${(s.exercises || []).filter(e => e.sets?.some(x => x.n != null)).length} exercises`
  if (s.kind === "erg") {
    const m = (s.erg?.pieces || []).reduce((a, p) => a + (p.m || 0), 0)
    const label = { Treadmill: "Indoor run", Bike: "Indoor bike" }[s.erg?.machine] || s.erg?.machine
    return `${label} ${m ? (MACHINE[s.erg?.machine]?.unit === "km" ? `${+(m / 1000).toFixed(2)} km` : `${m} m`) : ""}`
  }
  if (s.kind === "circuit") return `${s.template || "Circuit"} · ${s.circuit?.rounds?.length || 0} rounds`
  if (s.kind === "run") return s.run?.plan || s.template
  if (s.kind === "tennis") return [s.tennis?.opponent, s.tennis?.score || s.tennis?.mode].filter(Boolean).join(" · ")
  if (s.kind === "hyrox") return `Hyrox stations · ${s.hyrox?.rounds?.length} rounds`
  return s.activity
}

function Item({ s, entry, go }) {
  const st = status(entry, DATA.sessions.find(x => x.id === s.id))
  return <button className="item" onClick={() => {
    if (!entry) store.put(s, { sync: "sent", sentAt: s.received || s.start, remote: s.status })
    go("edit", s.id)
  }}>
    <div className="row between"><b>{summary(s)}</b><span className="when">{dayName(s.start)} {timeOf(s.start)}</span></div>
    <span className={"pill " + st.tone}>{st.text}</span>
  </button>
}

function Settings({ go }) {
  const st = useSyncExternalStore(store.subscribe, () => store.settings)
  const [msg, setMsg] = useState("")
  return <div className="page">
    <Top title="Settings" onBack={() => go("home")} />
    <div className="card">
      <Field label="Send logs via">
        <Chips value={st.mode} options={[["worker", "auth.simas.fit"], ["github", "GitHub (fallback)"]]} onChange={m => m && store.setSettings({ mode: m })} />
      </Field>
      <Field label={st.mode === "github" ? "GitHub fine-grained token" : "LOG_TOKEN"}
        hint={st.mode === "github"
          ? "github.com → Settings → Developer settings → Fine-grained tokens. Repository: Simanauskas/dashboard only. Permissions: Actions = Read and write, Contents = Read. Stored only on this phone."
          : "The LOG_TOKEN secret set on the Worker (in your password manager). Stored only on this phone."}>
        <input className="in" type="password" autoComplete="off" value={st.token} onChange={e => store.setSettings({ token: e.target.value.trim() })} />
      </Field>
      <button className="btn" onClick={async () => { setMsg("checking…"); try { setMsg(await testToken()) } catch (e) { setMsg(e.message) } }}>Test</button>
      {msg && <div className="hint">{msg}</div>}
    </div>
    <div className="card hint">
      Install: open this page in Safari → Share → <b>Add to Home Screen</b>.<br />
      Data built {new Date(DATA.built).toLocaleString()} · {DATA.sessions.length} sessions synced from the repo.
    </div>
  </div>
}

export default function LogApp() {
  const [route, setRoute] = useState(() => {
    const [screen, id] = (location.hash.slice(1) || "home").split("/")
    return { screen, id }
  })
  const go = (screen, id) => {
    const r = { screen, id }
    history.pushState(r, "", `#${screen}${id ? "/" + id : ""}`)
    setRoute(r)
    window.scrollTo(0, 0)
  }
  useEffect(() => {
    const pop = () => { const [screen, id] = (location.hash.slice(1) || "home").split("/"); setRoute({ screen, id }) }
    window.addEventListener("popstate", pop)
    return () => window.removeEventListener("popstate", pop)
  }, [])
  if (route.screen === "settings") return <Settings go={go} />
  if (route.screen === "new") return <Editor id={null} go={go} />
  if (route.screen === "edit" && route.id) return <Editor id={route.id} go={go} />
  return <Home go={go} />
}

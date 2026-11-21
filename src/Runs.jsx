// Runs screen — second-by-second analysis of every run (data/runs/*.json, written
// by run_analysis.py). Two views: SESSION (any run: chart, reps, recovery, form
// under fatigue, compared with earlier sessions of the same kind) and Z2 BASE
// (aerobic efficiency + decoupling of the easy runs over time).
//
// Takes the dashboard's own UI pieces as `ui` so it carries no copy of the design
// system and App.jsx needs no export changes.
import { useState, useEffect, useMemo, useRef } from "react";
import runsIndex from "virtual:runs-index";

const pace = (m) => {
  if (m == null) return "–";
  let s = Math.round(m * 60);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const fmtDur = (s) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`; };
const fmtDate = (iso) => new Date(iso + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" });
const f1 = (v, d = 1) => (v == null ? "–" : Number(v).toFixed(d));
const sgn = (v, d = 1) => (v == null ? "–" : `${v > 0 ? "+" : ""}${Number(v).toFixed(d)}`);

// What each row of the rep table shows. `better` says which direction is an improvement.
const ROWS = [
  ["pace", "Pace /km", pace, null],
  ["hr_avg", "Avg HR", (v) => f1(v, 0), null],
  ["hr_max", "Max HR", (v) => f1(v, 0), null],
  ["hr_drift", "HR drift (2nd−1st half)", (v) => sgn(v, 1), null],
  ["cadence_spm", "Cadence spm", (v) => f1(v, 1), null],
  ["stride_length_m", "Stride m", (v) => f1(v, 2), null],
  ["vertical_oscillation_mm", "Vert. osc. mm", (v) => f1(v, 1), null],
  ["vertical_ratio_pct", "Vert. ratio %", (v) => f1(v, 2), null],
  ["ground_contact_ms", "GCT ms", (v) => f1(v, 0), null],
  ["gct_balance_left_pct", "GCT balance L %", (v) => f1(v, 1), null],
  ["power_w", "Power W", (v) => f1(v, 0), null],
];

const roll = (a, n) => a.map((_, i) => {
  let s = 0, c = 0;
  for (let j = Math.max(0, i - n); j <= Math.min(a.length - 1, i + n); j++) if (a[j] != null) { s += a[j]; c++; }
  return c ? s / c : null;
});

function useWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(640);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.floor(e.contentRect.width))));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/* ── chart: HR / pace / cadence over time, reps shaded ─────────────────────── */
function RunChart({ run, ui }) {
  const { T } = ui;
  const [ref, W] = useWidth();
  const [hover, setHover] = useState(null);
  const s = run.series;
  const n = s.t.length;
  const hr = useMemo(() => roll(s.hr, 2), [run]);
  const paceS = useMemo(() => roll(s.spd.map((v) => (v > 0.8 ? v : null)), 7).map((v) => (v ? 1000 / v / 60 : null)).map((p) => (p && p < 8.5 ? p : null)), [run]);
  const cad = useMemo(() => roll(s.cad.map((v) => (v > 120 ? v : null)), 7), [run]);
  const hasPace = !run.treadmill && paceS.some((p) => p != null);
  const belt = run.segments.filter((g) => g.belt_kmh);
  const panels = [
    { key: "hr", label: "HR bpm", data: hr, color: T.bad, h: 120, fmt: (v) => Math.round(v) },
    { key: "pace", label: "Pace /km", data: hasPace ? paceS : null, color: T.info, h: 110, fmt: pace, invert: true },
    { key: "cad", label: "Cadence spm", data: cad, color: T.ok, h: 80, fmt: (v) => Math.round(v) },
  ];
  const padL = 40, padR = 8, gap = 18;
  const tMax = s.t[n - 1];
  const x = (t) => padL + (t / tMax) * (W - padL - padR);
  const total = panels.reduce((a, p) => a + p.h + gap, 0) + 30;
  let y0 = 18;
  const bands = run.class === "intervals" ? run.segments : [];
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const t = ((e.clientX - r.left - padL) / (W - padL - padR)) * tMax;
    setHover(Math.max(0, Math.min(n - 1, Math.round(t))));
  };
  const pt = hover != null ? { t: s.t[hover], hr: s.hr[hover], p: paceS[hover], cad: s.cad[hover], pw: s.pw[hover], gct: s.gct[hover], vr: s.vr[hover] } : null;
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width={W} height={total} style={{ display: "block", touchAction: "pan-y" }} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        {panels.map((p) => {
          const top = y0; y0 += p.h + gap;
          const vals = p.data ? p.data.filter((v) => v != null) : [];
          let lo = vals.length ? Math.min(...vals) : 0, hi = vals.length ? Math.max(...vals) : 1;
          if (p.key === "pace" && vals.length) {
            const sv = [...vals].sort((a, b) => a - b);
            lo = sv[Math.floor(sv.length * 0.02)] - 0.1; hi = Math.max(sv[Math.floor(sv.length * 0.97)] + 0.1, lo + 0.8);
          } else if (p.key === "pace") { lo = 4; hi = 6; } else { const m = (hi - lo) * 0.08 || 1; lo -= m; hi += m; }
          if (p.key === "cad") { lo = Math.max(lo, 140); }
          const yy = (v0) => { const v = p.key === "pace" ? Math.min(hi, Math.max(lo, v0)) : v0; return top + (p.invert ? (v - lo) / (hi - lo) 
            : 1 - (v - lo) / (hi - lo)) * p.h; };
          let d = "", pen = false;
          if (p.data) p.data.forEach((v, i) => { if (v == null) { pen = false; return; } d += `${pen ? "L" : "M"}${x(s.t[i]).toFixed(1)},${yy(v).toFixed(1)}`; pen = true; });
          const ticks = [lo, (lo + hi) / 2, hi];
          return (
            <g key={p.key}>
              <rect x={padL} y={top} width={W - padL - padR} height={p.h} fill="none" stroke={T.lineDim} />
              {p.key === "hr" && (() => { const a = Math.max(lo, 156), b = Math.min(hi, 177); return b > a ? <rect x={padL} y={yy(b)} width={W - padL - padR} height={yy(a) - yy(b)} fill={T.warn} opacity="0.07" /> : null; })()}
              {bands.map((g, i) => <rect key={i} x={x(g.start_s)} y={top} width={Math.max(1, x(g.start_s + g.dur_s) - x(g.start_s))} height={p.h} fill={T.accent} opacity="0.10" />)}
              {p.key === "pace" && belt.map((g, i) => <line key={i} x1={x(g.start_s)} x2={x(g.start_s + g.dur_s)} y1={yy(g.pace)} y2={yy(g.pace)} stroke={T.info} strokeWidth="2" />)}
              {p.data && <path d={d} fill="none" stroke={p.color} strokeWidth="1.3" strokeLinejoin="round" />}
              {!p.data && !belt.length && <text x={padL + 10} y={top + p.h / 2 + 4} fill={T.ink3} fontSize="11">{run.treadmill ? "No GPS pace on a treadmill" : "No pace data"}</text>}
              {(p.data || belt.length > 0) && ticks.map((v, i) => <text key={i} x={padL - 5} y={yy(v) + 3} fill={T.ink3} fontSize="9.5" textAnchor="end">{p.fmt(v)}</text>)}
              <text x={padL} y={top - 5} fill={T.ink3} fontSize="9.5" fontWeight="700">{p.label}</text>
            </g>
          );
        })}
        {[0, 0.25, 0.5, 0.75, 1].map((f) => <text key={f} x={x(f * tMax)} y={total - 3} fill={T.ink3} fontSize="9.5" textAnchor={f === 1 ? "end" : f === 0 ? "start" : "middle"}>{Math.round((f * tMax) / 60)}′</text>)}
        {pt && <line x1={x(pt.t)} x2={x(pt.t)} y1={0} y2={total - 16} stroke={T.ink2} strokeDasharray="3 3" opacity="0.7" />}
      </svg>
      <div className="num" style={{ fontSize: 11, color: T.ink2, minHeight: 18, marginTop: 4 }}>
        {pt ? `${Math.floor(pt.t / 60)}:${String(pt.t % 60).padStart(2, "0")} · ♥ ${pt.hr ?? "–"} · ${pt.p ? pace(pt.p) + "/km" : "–"} · ${pt.cad ? Math.round(pt.cad) + " spm" : "–"}${pt.pw ? " · " + pt.pw + " W" : ""}${pt.gct ? " · GCT " + Math.round(pt.gct) + " ms" : ""}` : <span style={{ color: T.ink3 }}>Touch the chart for second-by-second values{bands.length ? " · shaded = reps" : ""} · amber = threshold HR 156–177</span>}
      </div>
    </div>
  );
}

/* ── rep table ─────────────────────────────────────────────────────────────── */
function SegTable({ run, ui }) {
  const { T } = ui;
  const segs = run.segments;
  const multi = segs.length > 1;
  const td = { padding: "6px 8px", textAlign: "right", fontSize: 12, whiteSpace: "nowrap" };
  return (
    <div className="scroll-x">
      <table className="num" style={{ borderCollapse: "collapse", width: "100%", minWidth: 320 }}>
        <thead>
          <tr style={{ color: T.ink3, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <th style={{ ...td, textAlign: "left" }}></th>
            {segs.map((_, i) => <th key={i} style={td}>{run.class === "intervals" ? `Rep ${i + 1}` : "Block"}</th>)}
            {multi && <th style={td}>Δ</th>}
          </tr>
        </thead>
        <tbody>
          {ROWS.filter(([k]) => segs.some((g) => g[k] != null)).map(([k, label, f]) => {
            const first = segs[0][k], last = segs[segs.length - 1][k];
            const diff = k === "pace" ? (first != null && last != null ? `${last - first > 0 ? "+" : "−"}${Math.abs(Math.round((last - first) * 60))} s` : "–") : k === "hr_drift" ? "" : first != null && last != null ? `${sgn(last - first, k === "gct_balance_left_pct" || k === "vertical_ratio_pct" || k === "stride_length_m" ? 2 : 1)}` : "–";
            return (
              <tr key={k} style={{ borderTop: `1px solid ${T.lineDim}` }}>
                <td style={{ ...td, textAlign: "left", color: T.ink2, fontSize: 11.5 }}>{label}</td>
                {segs.map((g, i) => <td key={i} style={{ ...td, color: T.ink, fontWeight: 600 }}>{f(g[k])}</td>)}
                {multi && <td style={{ ...td, color: T.ink2 }}>{diff}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── session view ──────────────────────────────────────────────────────────── */
const CLASS_TONE = { intervals: "accent", z2: "ok", steady: "info", other: "mute" };

function SessionView({ ui }) {
  const { Card, Sec, Chip, Stat, Empty, Tag, T } = ui;
  const list = runsIndex;
  const [sel, setSel] = useState(list[0]?.id);
  const [cache, setCache] = useState({});
  const [err, setErr] = useState(null);
  useEffect(() => {
    if (!sel || cache[sel]) return;
    setErr(null);
    fetch(`/runs-data/${sel}.json`).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((j) => setCache((c) => ({ ...c, [sel]: j })))
      .catch((e) => setErr(String(e.message || e)));
  }, [sel]);
  if (!list.length) return <Card><Empty>No runs analysed yet. They appear after the next sync.</Empty></Card>;
  const run = cache[sel];
  const meta = list.find((r) => r.id === sel);
  const similar = run && run.class === "intervals" ? list.filter((r) => r.class === "intervals" && r.id !== sel && r.n_segments >= 2 && r.n_segments === run.segments.length) : [];
  return (
    <div>
      <div className="scroll-x no-bar" style={{ display: "flex", gap: 7, marginBottom: 16 }}>
        {list.filter((r) => r.class !== "other").slice(0, 24).map((r) => (
          <Chip key={r.id} active={sel === r.id} tone={CLASS_TONE[r.class] || "mute"} onClick={() => setSel(r.id)} title={r.name}>
            {fmtDate(r.date)} · {r.class === "intervals" ? `${r.n_segments}×` : r.class === "z2" ? "Z2" : "run"}
          </Chip>
        ))}
      </div>
      {!run && !err && <Card><Empty>Loading {meta?.name}…</Empty></Card>}
      {err && <Card><Empty>Could not load this run ({err}).</Empty></Card>}
      {run && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.ink }}>{run.name}</div>
            <Tag tone={CLASS_TONE[run.class]}>{run.class}</Tag>
            {run.treadmill && <Tag tone="warn">treadmill</Tag>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 16 }}>
            <Stat label="Time" value={fmtDur(run.duration_s)} sub={fmtDate(run.date)} />
            <Stat label="Distance" value={run.treadmill ? "–" : f1((run.distance_m || 0) / 1000, 2)} unit={run.treadmill ? "" : "km"} sub={run.treadmill ? "footpod unreliable" : undefined} />
            <Stat label="Avg HR" value={f1(run.hr_avg, 0)} unit="bpm" sub={`max ${run.hr_max}`} />
            {run.aerobic && <Stat label="Decoupling" value={sgn(run.aerobic.decoupling_pct, 1)} unit="%" tone={run.aerobic.decoupling_pct < 5 ? "ok" : run.aerobic.decoupling_pct < 8 ? "warn" : "bad"} sub="Pa:HR, 2nd vs 1st half" />}
          </div>
          <Sec title="Heart rate · pace · cadence"><Card pad={12}><RunChart run={run} ui={ui} /></Card></Sec>
          {run.segments.length > 0 && (
            <Sec title={run.class === "intervals" ? "Per rep" : "Steady block"} sub={run.class === "intervals" ? undefined : "After the first 10 minutes of warm-up"}>
              <Card pad={10}><SegTable run={run} ui={ui} /></Card>
              {run.treadmill && run.segments.some((g) => g.belt_kmh) && <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 6 }}>Pace on the treadmill is the belt speed from the activity name — the watch's own distance under-reads it. Stride length and power are also footpod estimates, so don't compare them with outdoor runs.</div>}
            </Sec>
          )}
          {run.rests.length > 0 && (
            <Sec title="Recovery" sub="HR drop during each rest">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
                {run.rests.map((r) => <Stat key={r.after} label={`Rest ${r.after} · ${r.dur_s}s`} value={`−${r.drop}`} unit="bpm" tone={r.drop >= 50 ? "ok" : "warn"} sub={`${r.hr_end_rep} → ${r.hr_min} low · ${r.hr_start_next} at next rep`} />)}
              </div>
            </Sec>
          )}
          {run.fatigue_pct && (
            <Sec title="Form under fatigue" sub={`Last rep vs first rep`}>
              <Card pad={14}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "8px 18px" }}>
                  {[["hr_avg", "Avg HR"], ["cadence_spm", "Cadence"], ["stride_length_m", "Stride"], ["vertical_oscillation_mm", "Vert. osc."], ["vertical_ratio_pct", "Vert. ratio"], ["ground_contact_ms", "GCT"], ["gct_balance_left_pct", "GCT balance"], ["power_w", "Power"]].map(([k, l]) => {
                    const v = run.fatigue_pct[k];
                    return <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}><span style={{ color: T.ink2 }}>{l}</span><span className="num" style={{ fontWeight: 700, color: v == null ? T.ink3 : Math.abs(v) < 1.5 ? T.ink : T.accentIn }}>{v == null ? "–" : `${sgn(v, 1)}%`}</span></div>;
                  })}
                </div>
                <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 10 }}>Flat form with rising HR is normal cardiac drift; form that fades while pace holds is the thing to watch.</div>
              </Card>
            </Sec>
          )}
          {similar.length > 0 && (
            <Sec title="Earlier sessions of the same shape" sub="Per-rep avg HR · cadence">
              <Card pad={10}>
                <div className="scroll-x"><table className="num" style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
                  <tbody>
                    {[run.id, ...similar.map((r) => r.id)].map((id) => {
                      const m = list.find((r) => r.id === id);
                      return <SimilarRow key={id} id={id} m={m} cur={id === run.id} cache={cache} setCache={setCache} ui={ui} />;
                    })}
                  </tbody>
                </table></div>
              </Card>
            </Sec>
          )}
        </>
      )}
    </div>
  );
}

function SimilarRow({ id, m, cur, cache, setCache, ui }) {
  const { T } = ui;
  const r = cache[id];
  useEffect(() => {
    if (r) return;
    fetch(`/runs-data/${id}.json`).then((x) => x.json()).then((j) => setCache((c) => ({ ...c, [id]: j }))).catch(() => {});
  }, [id]);
  const td = { padding: "6px 8px", whiteSpace: "nowrap", color: cur ? T.ink : T.ink2, fontWeight: cur ? 700 : 500 };
  return (
    <tr style={{ borderTop: `1px solid ${T.lineDim}` }}>
      <td style={td}>{fmtDate(m.date)}{m.treadmill ? " · treadmill" : ""}</td>
      <td style={td}>{r ? r.segments.map((g) => `${pace(g.pace)}`).join(" · ") : "…"}</td>
      <td style={td}>{r ? "♥ " + r.segments.map((g) => Math.round(g.hr_avg)).join(" · ") : ""}</td>
      <td style={td}>{r ? r.segments.map((g) => Math.round(g.cadence_spm)).join(" · ") + " spm" : ""}</td>
    </tr>
  );
}

/* ── Z2 base view ──────────────────────────────────────────────────────────── */
function Z2Base({ ui }) {
  const { Card, Sec, Stat, Empty, T } = ui;
  const [ref, W] = useWidth();
  const [hov, setHov] = useState(null);
  const outdoor = runsIndex.filter((r) => r.class === "z2" && !r.treadmill && r.aerobic).sort((a, b) => a.date.localeCompare(b.date));
  const tread = runsIndex.filter((r) => r.class === "z2" && r.treadmill);
  if (outdoor.length < 2) return <Card><Empty>Need at least 2 outdoor Z2 runs to show a trend.</Empty></Card>;
  const H = 150, padL = 38, padR = 10, padT = 12, padB = 22;
  const ef = outdoor.map((r) => r.aerobic.ef);
  const lo = Math.min(...ef) - 0.03, hi = Math.max(...ef) + 0.03;
  const x = (i) => padL + (outdoor.length === 1 ? 0 : (i / (outdoor.length - 1)) * (W - padL - padR));
  const y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
  const path = outdoor.map((r, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(r.aerobic.ef).toFixed(1)}`).join("");
  const first = outdoor[0], last = outdoor[outdoor.length - 1];
  const best = outdoor.reduce((a, b) => (b.aerobic.ef > a.aerobic.ef ? b : a));
  const dEf = ((last.aerobic.ef / first.aerobic.ef - 1) * 100);
  const dec = (v) => (v < 5 ? "ok" : v < 8 ? "warn" : "bad");
  const h = hov != null ? outdoor[hov] : null;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, marginBottom: 16 }}>
        <Stat label="Efficiency now" value={f1(last.aerobic.ef, 3)} sub={`${fmtDate(last.date)} · ${pace(last.pace)}/km @ ♥${Math.round(last.seg_hr)}`} />
        <Stat label="Since first" value={sgn(dEf, 1)} unit="%" tone={dEf > 1 ? "ok" : dEf < -1 ? "bad" : "ink"} sub={`from ${fmtDate(first.date)}`} />
        <Stat label="Best" value={f1(best.aerobic.ef, 3)} sub={fmtDate(best.date)} />
        <Stat label="Decoupling now" value={sgn(last.aerobic.decoupling_pct, 1)} unit="%" tone={dec(last.aerobic.decoupling_pct)} sub="under 5% = aerobically solid" />
      </div>
      <Sec title="Aerobic efficiency" sub="Metres per minute per heartbeat on outdoor Z2 runs · higher = fitter">
        <Card pad={12}>
          <div ref={ref}>
            <svg width={W} height={H} onPointerLeave={() => setHov(null)} style={{ display: "block" }}>
              {[lo, (lo + hi) / 2, hi].map((v, i) => <g key={i}><line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} stroke={T.lineDim} /><text x={padL - 5} y={y(v) + 3} fill={T.ink3} fontSize="9.5" textAnchor="end">{v.toFixed(2)}</text></g>)}
              <path d={path} fill="none" stroke={T.ok} strokeWidth="1.8" />
              {outdoor.map((r, i) => <circle key={r.id} cx={x(i)} cy={y(r.aerobic.ef)} r={hov === i ? 5 : 3.5} fill={T.ok} onPointerEnter={() => setHov(i)} onPointerDown={() => setHov(i)} />)}
              {outdoor.map((r, i) => (i % Math.ceil(outdoor.length / 6) === 0 || i === outdoor.length - 1) && <text key={r.id} x={x(i)} y={H - 6} fill={T.ink3} fontSize="9.5" textAnchor={i === outdoor.length - 1 ? "end" : i === 0 ? "start" : "middle"}>{fmtDate(r.date)}</text>)}
            </svg>
          </div>
          <div className="num" style={{ fontSize: 11, color: T.ink2, minHeight: 18 }}>{h ? `${fmtDate(h.date)} · ${h.name.trim()} · ${pace(h.pace)}/km @ ♥${Math.round(h.seg_hr)} · EF ${h.aerobic.ef.toFixed(3)} · decoupling ${sgn(h.aerobic.decoupling_pct, 1)}%` : <span style={{ color: T.ink3 }}>Touch a point</span>}</div>
        </Card>
      </Sec>
      <Sec title="Runs" sub="Warm-up (first 10 min) excluded. Decoupling = how much efficiency drops from first to second half.">
        <Card pad={10}>
          <div className="scroll-x"><table className="num" style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
            <thead><tr style={{ color: T.ink3, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>{["Date", "Pace", "HR", "EF", "Decoupling"].map((h, i) => <th key={h} style={{ padding: "6px 8px", textAlign: i ? "right" : "left" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[...outdoor].reverse().map((r) => (
                <tr key={r.id} style={{ borderTop: `1px solid ${T.lineDim}` }}>
                  <td style={{ padding: "6px 8px", color: T.ink2 }}>{fmtDate(r.date)}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>{pace(r.pace)}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right" }}>{Math.round(r.seg_hr)}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", fontWeight: 700 }}>{r.aerobic.ef.toFixed(3)}</td>
                  <td style={{ padding: "6px 8px", textAlign: "right", color: { ok: T.ok, warn: T.warn, bad: T.bad }[dec(r.aerobic.decoupling_pct)] }}>{sgn(r.aerobic.decoupling_pct, 1)}%</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </Card>
        {tread.length > 0 && <div style={{ fontSize: 10.5, color: T.ink3, marginTop: 6 }}>{tread.length} treadmill Z2 run{tread.length > 1 ? "s" : ""} left out: no GPS pace to measure efficiency with. Open them under Session for HR, cadence and form.</div>}
      </Sec>
    </div>
  );
}

export default function RunsView({ ui }) {
  const { SubNav } = ui;
  const [tab, setTab] = useState(() => { try { return sessionStorage.getItem("runs.tab") || "session"; } catch { return "session"; } });
  const set = (v) => { setTab(v); try { sessionStorage.setItem("runs.tab", v); } catch {} };
  return (
    <div>
      <SubNav items={[["session", "SESSION"], ["z2", "Z2 BASE"]]} value={tab} onChange={set} />
      {tab === "session" ? <SessionView ui={ui} /> : <Z2Base ui={ui} />}
    </div>
  );
}

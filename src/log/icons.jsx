// Line icons for the New session tiles (24×24, stroke = currentColor), drawn
// for this app so they match the dashboard's ink-on-slate style. The emojis in
// catalog.js TILES stay for the Log list.
const P = {
  strength: <>
    <path d="M2.5 12h19" />
    <rect x="5" y="7" width="3" height="10" rx="1" />
    <rect x="16" y="7" width="3" height="10" rx="1" />
    <path d="M3 9.5v5M21 9.5v5" />
  </>,
  circuit: <>
    <path d="M4.5 11.5a7.5 7.5 0 0 1 13-4.6l1.8 1.9" />
    <path d="M19.5 4.5v4.5H15" />
    <path d="M19.5 12.5a7.5 7.5 0 0 1-13 4.6l-1.8-1.9" />
    <path d="M4.5 19.5V15H9" />
  </>,
  treadmill: <>
    <circle cx="10" cy="4" r="1.6" />
    <path d="M9.6 6.4 8.4 11l2.6 2.2v3.3" />
    <path d="M8.4 11 6 13.6" />
    <path d="M9.2 8.2l2.9 1.4 1.8-1.2" />
    <path d="M3 20h13.5l2.5-3.5" />
    <path d="M19 16.5 17.6 8h2.4" />
  </>,
  bike: <>
    <circle cx="7" cy="14.5" r="3.5" />
    <path d="M7 14.5h7.5" />
    <path d="M9.5 6.5h4M11.5 6.5l1.5 8" />
    <path d="M16.5 5.5h2.5M17.8 5.5l-1.6 9" />
    <path d="M13 14.5l-1 5M16.2 14.5l1.3 5M3.5 20h17" />
  </>,
  skierg: <>
    <path d="M12 3v18M8 21h8" />
    <path d="M8 4.5h8" />
    <path d="M9 4.5v7.5M15 4.5v7.5" />
    <path d="M7.5 12.5h3M13.5 12.5h3" />
  </>,
  row: <>
    <circle cx="18" cy="11" r="3.2" />
    <path d="M3 17h17" />
    <path d="M6 14.5h4" />
    <path d="M14.8 11H11" />
    <path d="M5 20l1-3M19 20l-1-3M15 17l1.5-3" />
  </>,
  tennis: <>
    <ellipse cx="10" cy="10" rx="4.6" ry="6" transform="rotate(-45 10 10)" />
    <path d="M13.3 13.3 19.5 19.5" />
    <path d="M7.5 9.5l5-5M9.6 11.6l4.4-4.4" />
    <circle cx="18.5" cy="5.5" r="2" />
  </>,
  running: <>
    <path d="M3.5 17V10.5l3-1.2 1.8 2 2.8-1.4 1.9 2.8 6 2.2a1.9 1.9 0 0 1-.6 3.6H4.4a.9.9 0 0 1-.9-.9z" />
    <path d="M3.5 17.5h16.5" />
    <path d="M9.5 12.3l1-1M11.7 13.4l1-1" />
  </>,
  cycling: <>
    <circle cx="6" cy="16" r="3.5" />
    <circle cx="18" cy="16" r="3.5" />
    <path d="M6 16l3.8-6.5h5.4L18 16M9.8 9.5 12.6 16H6" />
    <path d="M8.5 7h3M15.2 9.5 14.4 6.5h2" />
  </>,
  other: <>
    <circle cx="7" cy="7" r="1.8" /><circle cx="17" cy="7" r="1.8" />
    <circle cx="7" cy="17" r="1.8" /><circle cx="17" cy="17" r="1.8" />
  </>,
}

export function TileIcon({ name }) {
  return <svg className="glyph" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[name] || P.other}</svg>
}

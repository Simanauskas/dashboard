// Which app a bridged room belongs to, and how to show it.

export const NETWORKS = {
  whatsapp: { name: 'WhatsApp', short: 'WA', color: '#25a244' },
  telegram: { name: 'Telegram', short: 'TG', color: '#2a9fd8' },
  facebook: { name: 'Messenger', short: 'FB', color: '#7b4dff' },
  instagram: { name: 'Instagram', short: 'IG', color: '#e1306c' },
  imessage: { name: 'iMessage', short: 'iM', color: '#1f8fff' },
  signal: { name: 'Signal', short: 'SG', color: '#3a76f0' },
  matrix: { name: 'Matrix', short: 'MX', color: '#6b7280' },
}

const ALIASES = { facebookgo: 'facebook', instagramgo: 'instagram', messenger: 'facebook', meta: 'facebook', 'facebook-tor': 'facebook', fb: 'facebook', ig: 'instagram', bluebubbles: 'imessage', sms: 'imessage' }

export function networkOf(room) {
  const id = room?.bridge?.protocol?.id?.toLowerCase()
  if (id) return ALIASES[id] || (NETWORKS[id] ? id : guessFromText(id) || 'matrix')
  // no bridge info: guess from who is in the room
  for (const uid of [...(room?.heroes || []), ...Object.keys(room?.members || {})]) {
    const g = guessFromUser(uid)
    if (g) return g
  }
  return 'matrix'
}

export function networkInfo(key) {
  return NETWORKS[key] || NETWORKS.matrix
}

function guessFromText(s) {
  for (const k of Object.keys(NETWORKS)) if (s.includes(k)) return k
  for (const [a, k] of Object.entries(ALIASES)) if (s.includes(a)) return k
  return null
}

export function guessFromUser(uid) {
  const local = uid?.slice(1).split(':')[0].toLowerCase() || ''
  const prefix = local.split('_')[0].replace(/bot$/, '')
  return ALIASES[prefix] || (NETWORKS[prefix] && prefix !== 'matrix' ? prefix : null)
}

export function isBotUser(uid) {
  const local = uid?.slice(1).split(':')[0].toLowerCase() || ''
  return /bot$/.test(local) && !local.includes('_')
}

// A phone number hidden in a ghost user id, e.g. @whatsapp_37061234567:server
export function phoneFromUser(uid) {
  const local = uid?.slice(1).split(':')[0] || ''
  const net = guessFromUser(uid)
  if (net !== 'whatsapp' && net !== 'imessage' && net !== 'signal') return null
  const digits = local.slice(local.indexOf('_') + 1).replace(/^(tel|sms)[_=]/, '').replace(/\D/g, '')
  return digits.length >= 8 ? digits : null
}

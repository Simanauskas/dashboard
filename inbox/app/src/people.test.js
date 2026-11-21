import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildModel, suggestions, mergePeople, chooseChannel, mergedTimeline, normName, unlinkRoom, stripReply } from './people.js'

const ME = '@simas:x'
const H = 3600_000
let n = 0
const msg = (sender, ts, body = 'hi') => ({ event_id: `$${++n}`, type: 'm.room.message', sender, origin_server_ts: ts, content: { msgtype: 'm.text', body } })

function room(id, net, ghost, name, events, extra = {}) {
  return {
    id, membership: 'join', name, heroes: [ghost, `@${net}bot:x`], joinedCount: 3,
    members: { [ghost]: { displayname: name, membership: 'join' } },
    bridge: { bridgebot: `@${net}bot:x`, protocol: { id: net }, 'com.beeper.room_type': 'dm' },
    timeline: events, receipts: {}, notificationCount: 0, reachedStart: true, ...extra,
  }
}

const now = 1_000_000_000_000
const rooms = {
  wa: room('wa', 'whatsapp', '@whatsapp_37061234567:x', 'Rokas Petrauskas', [msg('@whatsapp_37061234567:x', now - 50 * H), msg(ME, now - 49 * H)]),
  tg: room('tg', 'telegram', '@telegram_1:x', 'Rokas Petrauskas', [msg('@telegram_1:x', now - 2 * H)]),
  ig: room('ig', 'instagram', '@instagram_m:x', 'mantas_j', [msg('@instagram_m:x', now - 30 * H)]),
  tgm: room('tgm', 'telegram', '@telegram_2:x', 'Mantas J.', [msg('@telegram_2:x', now - 40 * H)]),
  solo: room('solo', 'facebook', '@facebook_9:x', 'Tomas', [msg('@facebook_9:x', now - 90 * H)]),
}

test('normName folds diacritics and punctuation', () => {
  assert.equal(normName('Eglė Žemaitė'), 'egle zemaite')
  assert.equal(normName('mantas_j'), normName('Mantas J.'))
})

test('suggests merges by name across apps', () => {
  const model = buildModel(rooms, {}, ME, null)
  const s = suggestions(model)
  const keys = s.map((x) => x.rooms.join(','))
  assert.deepEqual(keys.sort(), ['ig,tgm', 'tg,wa'])
})

test('merged person shows one inbox entry with both apps', () => {
  const model = buildModel(rooms, {}, ME, null)
  const s = suggestions(model).find((x) => x.rooms.includes('wa'))
  const { config } = mergePeople(null, s.members, 'Rokas', 'wa')
  const m2 = buildModel(rooms, {}, ME, config)
  const rokas = m2.items.filter((i) => i.name === 'Rokas')
  assert.equal(rokas.length, 1)
  assert.deepEqual(rokas[0].networks.sort(), ['telegram', 'whatsapp'])
  assert.equal(m2.items.length, 4)
  assert.equal(suggestions(m2).length, 1)
})

test('reply goes where they last wrote, within the window', () => {
  const item = { rooms: ['wa', 'tg'], defaultRoom: 'wa' }
  assert.deepEqual(chooseChannel(item, rooms, ME, { now }).roomId, 'tg')
  // 20h later the Telegram message is outside the 12h window -> default
  assert.equal(chooseChannel(item, rooms, ME, { now: now + 20 * H }).roomId, 'wa')
  assert.equal(chooseChannel(item, rooms, ME, { now: now + 20 * H }).reason, 'default')
})

test('a manual pick sticks until they write from another app', () => {
  const item = { rooms: ['wa', 'tg'], defaultRoom: 'wa' }
  const override = { roomId: 'wa', ts: now }
  assert.equal(chooseChannel(item, rooms, ME, { now, override }).roomId, 'wa')
  const r2 = { ...rooms, tg: { ...rooms.tg, timeline: [...rooms.tg.timeline, msg('@telegram_1:x', now + H)] } }
  assert.equal(chooseChannel(item, r2, ME, { now: now + H, override }).roomId, 'tg')
})

test('no default: falls back to where they last wrote', () => {
  const item = { rooms: ['wa', 'tg'], defaultRoom: null }
  const r = chooseChannel(item, rooms, ME, { now: now + 100 * H })
  assert.equal(r.roomId, 'tg')
  assert.equal(r.reason, 'last')
})

test('merged timeline interleaves by time and respects unloaded history', () => {
  const item = { rooms: ['wa', 'tg'] }
  const t = mergedTimeline(item, rooms)
  assert.deepEqual(t.entries.map((e) => e.roomId), ['wa', 'wa', 'tg'])
  const partial = { ...rooms, tg: { ...rooms.tg, reachedStart: false } }
  const t2 = mergedTimeline(item, partial)
  // telegram has older history not loaded yet -> hide WhatsApp messages older than it
  assert.deepEqual(t2.entries.map((e) => e.roomId), ['tg'])
  assert.equal(t2.hasMore, true)
})

test('unlinking the last room removes the person', () => {
  const { config, personId } = mergePeople(null, [{ rooms: ['wa'] }], 'R', 'wa')
  const c2 = unlinkRoom(config, personId, 'wa')
  assert.deepEqual(c2.people, {})
})

test('stripReply removes quoted fallback', () => {
  assert.equal(stripReply('> <@a:x> hello\n\nthanks'), 'thanks')
  assert.equal(stripReply('plain'), 'plain')
})

test('bridgev2 room types: group DMs and spaces are not people', () => {
  const base = rooms.wa
  const gdm = { ...base, id: 'gdm', bridge: { ...base.bridge, 'com.beeper.room_type': 'dm', 'com.beeper.room_type.v2': 'group_dm' } }
  const space = { ...base, id: 'sp', roomType: 'm.space', bridge: null, heroes: ['@whatsappbot:x'] }
  const fb = { ...rooms.solo, id: 'fbgo', bridge: { ...rooms.solo.bridge, protocol: { id: 'facebookgo' } } }
  const m = buildModel({ gdm, sp: space, fbgo: fb }, {}, ME, null)
  assert.equal(m.info.gdm.kind, 'group')
  assert.equal(m.info.sp.kind, 'space')
  assert.equal(m.connections.length, 0)
  assert.equal(m.info.fbgo.network, 'facebook')
})

test('iMessage: is_group flag and escaped phone numbers', async () => {
  const { phoneFromUser } = await import('./networks.js')
  assert.equal(phoneFromUser('@imessage_37061234567:x'), '37061234567')
  assert.equal(phoneFromUser('@imessage_tel=3a=2b37061234567:x'), '37061234567')
  assert.equal(phoneFromUser('@imessage_rokas=40gmail.com:x'), null)
  const im = (id, isGroup) => ({ ...rooms.wa, id, heroes: ['@imessage_37061234567:x', '@imessagebot:x'],
    bridge: { bridgebot: '@imessagebot:x', protocol: { id: 'imessage' }, channel: { 'fi.mau.imessage.is_group': isGroup } } })
  const m = buildModel({ a: im('a', false), b: im('b', true) }, {}, ME, null)
  assert.equal(m.info.a.kind, 'dm')
  assert.equal(m.info.a.network, 'imessage')
  assert.equal(m.info.a.phone, '37061234567')
  assert.equal(m.info.b.kind, 'group')
})

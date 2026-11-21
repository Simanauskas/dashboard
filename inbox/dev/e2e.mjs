// End-to-end check against the dev Synapse + mock bridge.
//   node dev/e2e.mjs [screenshot-dir]
import { createRequire } from 'node:module'
const { chromium, devices } = createRequire(import.meta.url)('playwright')
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const out = process.argv[2] || path.join(here, 'shots')
const APP = process.env.APP_URL || 'http://localhost:5180'
const mock = (...a) => execFileSync('python3', [path.join(here, 'mockbridge.py'), ...a], { encoding: 'utf8' })
const assert = (c, m) => { if (!c) throw new Error('FAIL: ' + m); console.log('ok -', m) }

const browser = await chromium.launch()
const ctx = await browser.newContext({ ...devices['iPhone 13'] })
const page = await ctx.newPage()
page.on('pageerror', (e) => console.log('PAGE ERROR', e.message))
await page.goto(APP)
await page.getByLabel('Server').fill('http://localhost:8008')
await page.getByLabel('Username').fill('simas')
await page.getByLabel('Password').fill('test1234')
await page.getByRole('button', { name: 'Sign in' }).click()
await page.getByText('Hyrox crew').waitFor()
await page.waitForTimeout(500)
await page.screenshot({ path: `${out}/1-inbox.png` })
assert(await page.getByText(/people are on more than one app/).isVisible(), 'merge suggestions banner shows')

await page.getByText(/people are on more than one app/).click()
await page.getByRole('button', { name: 'Combine' }).first().waitFor()
await page.screenshot({ path: `${out}/2-combine.png`, fullPage: true })
const cards = await page.locator('.sugg').count()
assert(cards === 4, `4 suggestions (Rokas, Ilona, Mantas, Eglė) – got ${cards}`)
await page.getByRole('button', { name: 'Combine all' }).click()
await page.getByText('Nothing to combine right now').waitFor()
await page.getByLabel('Back').click()

const rows = await page.locator('.list .row').count()
assert(rows === 6, `inbox has 6 entries after merging (4 people + Tomas + group) – got ${rows}`)
await page.screenshot({ path: `${out}/3-inbox-merged.png` })

await page.locator('.row', { hasText: 'Rokas' }).click()
await page.locator('.channel').waitFor()
await page.waitForTimeout(800)
assert((await page.locator('.channel').innerText()).includes('Telegram'), 'reply goes to Telegram (Rokas wrote there 3h ago)')
assert((await page.locator('.msg-net').count()) >= 3, 'merged thread shows app switches')
await page.screenshot({ path: `${out}/4-thread.png` })

await page.getByPlaceholder(/Message on/).fill('Yes, count me in for Saturday')
await page.getByLabel('Send').click()
await page.waitForTimeout(1200)
assert(mock('messages', 'telegram', 'rokas').includes('count me in'), 'message landed in the Telegram chat')
assert(!mock('messages', 'whatsapp', 'rokas').includes('count me in'), '...and not in WhatsApp')

mock('say', 'whatsapp', 'rokas', 'Also bring the sled straps pls')
await page.getByText('Also bring the sled straps').waitFor()
await page.waitForTimeout(300)
assert((await page.locator('.channel').innerText()).includes('WhatsApp'), 'after he writes on WhatsApp, reply switches to WhatsApp')
await page.screenshot({ path: `${out}/5-thread-switch.png` })

await page.locator('.channel').click()
await page.screenshot({ path: `${out}/6-channel-menu.png` })
await page.getByRole('menuitemradio', { name: /Telegram/ }).click()
assert((await page.locator('.channel').innerText()).includes('Telegram'), 'manual pick to Telegram sticks')

await page.locator('.thread-head').click()
await page.getByText('Make default').first().waitFor()
await page.screenshot({ path: `${out}/7-person.png` })

await page.goto(APP + '/#/settings')
await page.getByText('Connected apps').waitFor()
await page.screenshot({ path: `${out}/8-settings.png`, fullPage: true })

// desktop layout (fresh context; give the first sync a moment to pick up the merge)
const desk = await browser.newContext({ viewport: { width: 1280, height: 800 }, storageState: await ctx.storageState() })
const dp = await desk.newPage()
await dp.goto(APP)
await dp.waitForTimeout(1500)
await dp.locator('.row', { hasText: 'Ilona' }).click()
await dp.waitForTimeout(800)
assert((await dp.locator('.msg-net').count()) >= 3, 'desktop: Ilona thread merges WhatsApp, Instagram and Messenger')
await dp.screenshot({ path: `${out}/9-desktop.png` })
await browser.close()
console.log('all checks passed')

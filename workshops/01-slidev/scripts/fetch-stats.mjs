#!/usr/bin/env node
/*
 * Pull usage statistics from the Booked reservation system and write
 * ../stats.json, which the deck renders via <StatCards> and <UsageBars>.
 *
 * AGGREGATES ONLY. We never store names or who-booked-what, only counts, hours,
 * and a distinct-user tally. Same auth/VPN constraints as fetch-equipment.mjs:
 * run on the NYU VPN (or the self-hosted MEG Workstation runner). Configure in
 * .env (gitignored):
 *   BOOKED_API_URL=https://corelabs.abudhabi.nyu.edu/Services
 *   BOOKED_API_ID, BOOKED_API_KEY
 *   STATS_MONTHS   (optional, default 12)
 *
 * Reservations are fetched in monthly windows (bounded responses) and deduped by
 * referenceNumber. On any failure it leaves the existing stats.json untouched so
 * the build never breaks; a 401/403 usually means the API key lacks reservation
 * (admin) scope.
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'stats.json')

function loadEnv(file) {
  if (!existsSync(file)) return
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let val = line.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = val
  }
}
loadEnv(join(__dirname, '..', '.env'))

function fail(...lines) {
  for (const l of lines) if (l) console.error(l)
  console.error('Leaving stats.json unchanged.')
  process.exit(1)
}

const { BOOKED_API_URL, BOOKED_API_ID, BOOKED_API_KEY } = process.env
const MONTHS = Number(process.env.STATS_MONTHS || 12)

if (!BOOKED_API_URL || !BOOKED_API_ID || !BOOKED_API_KEY) {
  fail('Missing env. Set BOOKED_API_URL, BOOKED_API_ID, BOOKED_API_KEY.')
}

const base = BOOKED_API_URL.replace(/\/+$/, '')
const headers = {
  'X-Booked-ApiId': BOOKED_API_ID,
  'X-Booked-ApiKey': BOOKED_API_KEY,
  Accept: 'application/json',
}

// Booked wants ISO 8601 with an explicit offset, e.g. 2025-01-01T00:00:00+0000.
function isoOffset(d) {
  return d.toISOString().slice(0, 19) + '+0000'
}

// Skip obvious non-instrument / noise resources so stats aren't polluted.
const isJunk = (name) => !name || /\b(copy|deleted|test)\b/i.test(name)

const now = new Date()
const windowStart = new Date(now)
windowStart.setMonth(windowStart.getMonth() - MONTHS)

const seen = new Set() // referenceNumber dedupe across overlapping windows
const hoursByResource = new Map()
const users = new Set()
const monthly = new Map() // 'YYYY-MM' -> hours
const resourcesUsed = new Set()
let totalHours = 0
let totalReservations = 0

for (let i = 0; i < MONTHS; i++) {
  const s = new Date(windowStart)
  s.setMonth(windowStart.getMonth() + i)
  const e = new Date(s)
  e.setMonth(s.getMonth() + 1)

  const url =
    `${base}/Reservations/` +
    `?startDateTime=${encodeURIComponent(isoOffset(s))}` +
    `&endDateTime=${encodeURIComponent(isoOffset(e))}`

  let res
  try {
    res = await fetch(url, { headers })
  } catch (err) {
    fail(`Could not reach Booked: ${err.message}`, 'Are you on the NYU VPN?')
  }
  if (!res.ok) {
    const hint =
      res.status === 401 || res.status === 403
        ? 'The API key likely lacks reservation (admin) scope.'
        : ''
    fail(`Reservations API returned ${res.status} ${res.statusText}.`, hint)
  }
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    fail('Reservations did not return JSON:', '  ' + text.slice(0, 200).replace(/\s+/g, ' ').trim())
  }

  for (const r of data.reservations ?? []) {
    const ref = r.referenceNumber || `${r.resourceId}|${r.startDate}|${r.userId}`
    if (seen.has(ref)) continue
    seen.add(ref)

    const start = new Date(r.startDate)
    const end = new Date(r.endDate)
    const h = (end - start) / 3.6e6
    if (!(h > 0) || h > 24 * 60) continue // skip zero/negative/absurd durations

    const name = r.resourceName || `#${r.resourceId}`
    if (isJunk(name)) continue

    totalReservations++
    totalHours += h
    hoursByResource.set(name, (hoursByResource.get(name) || 0) + h)
    resourcesUsed.add(name)
    if (r.userId != null) users.add(String(r.userId))
    const mk = start.toISOString().slice(0, 7)
    monthly.set(mk, (monthly.get(mk) || 0) + h)
  }
}

if (totalReservations === 0) {
  fail('No reservations returned for the window. Check the date range and API access.')
}

const topByHours = [...hoursByResource.entries()]
  .map(([name, hours]) => ({ name, hours: Math.round(hours) }))
  .sort((a, b) => b.hours - a.hours)
  .slice(0, 10)

const monthlyHours = [...monthly.entries()]
  .sort()
  .map(([month, hours]) => ({ month, hours: Math.round(hours) }))

const stats = {
  source: 'Booked (Web Services /Reservations/)',
  fetchedAt: new Date().toISOString(),
  windowStart: windowStart.toISOString().slice(0, 10),
  windowEnd: now.toISOString().slice(0, 10),
  totals: {
    reservations: totalReservations,
    bookedHours: Math.round(totalHours),
    distinctUsers: users.size,
    instrumentsUsed: resourcesUsed.size,
  },
  topByHours,
  monthlyHours,
}

writeFileSync(OUT, JSON.stringify(stats, null, 2) + '\n')
console.log(
  `Wrote stats.json: ${totalReservations} reservations, ${Math.round(totalHours)} h, ` +
    `${users.size} users, top ${topByHours.length} instruments.`,
)

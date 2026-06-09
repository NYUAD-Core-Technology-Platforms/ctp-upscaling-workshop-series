#!/usr/bin/env node
/*
 * Pull lab-equipment (resource) names from the Booked reservation system and
 * write them to ../equipment.json, which the deck renders via <EquipmentList>.
 *
 * IMPORTANT: Booked (corelabs.abudhabi.nyu.edu) is behind the NYU VPN.
 * GitHub-HOSTED runners cannot reach it. Run this LOCALLY on the VPN and commit
 * the result, or on a SELF-HOSTED runner on the NYU network (the lab's calendar
 * sync uses one labeled "MEG Workstation").
 *
 * Auth: Booked API-key authentication. Send X-Booked-ApiId and X-Booked-ApiKey
 * headers on every request. Find the Id/Key in Booked under Profile > API Access
 * (per Booked's own Help > API > Authentication docs). These are the lab's
 * BOOKED_API_ID / BOOKED_API_KEY. Configure in .env (gitignored):
 *   BOOKED_API_URL=https://corelabs.abudhabi.nyu.edu/Services   (clean URLs, no index.php)
 *   BOOKED_API_ID=...
 *   BOOKED_API_KEY=...
 *
 * Fallback (only resources that currently have bookings, not the full catalog):
 *   BOOKED_ICS_URL=...icskey=...   (the lab's calendar-sync feed)
 *
 * On any failure it leaves the existing equipment.json untouched so a build
 * never breaks. Keep a sensible sample committed as the fallback.
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'equipment.json')

// Load .env (KEY=VALUE lines) without a dependency, so `npm run data` works
// from any shell (PowerShell, bash, ...). Real environment vars win over the file.
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
  console.error('Leaving equipment.json unchanged.')
  process.exit(1)
}

function writeEquipment(equipment, source) {
  if (equipment.length === 0) fail('No equipment names found.')
  // Skip rewrite if the list is unchanged, so the fetchedAt timestamp alone
  // does not create noise commits / redeploys on scheduled runs.
  if (existsSync(OUT)) {
    try {
      const prev = JSON.parse(readFileSync(OUT, 'utf8'))
      if (
        Array.isArray(prev.equipment) &&
        prev.equipment.length === equipment.length &&
        prev.equipment.every((v, i) => v === equipment[i])
      ) {
        console.log(`Equipment unchanged (${equipment.length} items); equipment.json left as-is.`)
        return
      }
    } catch {
      /* unreadable/invalid existing file: fall through and overwrite */
    }
  }
  writeFileSync(
    OUT,
    JSON.stringify(
      { source, fetchedAt: new Date().toISOString(), equipment },
      null,
      2,
    ) + '\n',
  )
  console.log(`Wrote ${equipment.length} equipment names to equipment.json`)
}

const { BOOKED_API_URL, BOOKED_API_ID, BOOKED_API_KEY, BOOKED_ICS_URL } = process.env

// ---- Mode 1 (primary): Web Services API, API-key headers -> FULL catalog ----
if (BOOKED_API_URL && BOOKED_API_ID && BOOKED_API_KEY) {
  const base = BOOKED_API_URL.replace(/\/+$/, '')
  let res
  try {
    res = await fetch(`${base}/Resources/`, {
      headers: {
        'X-Booked-ApiId': BOOKED_API_ID,
        'X-Booked-ApiKey': BOOKED_API_KEY,
        Accept: 'application/json',
      },
    })
  } catch (err) {
    fail(`Could not reach Booked: ${err.message}`, 'Are you on the NYU VPN?')
  }
  if (!res.ok) {
    const hint =
      res.status === 401
        ? 'Unauthorized: check BOOKED_API_ID / BOOKED_API_KEY (Booked > Profile > API Access).'
        : ''
    fail(`Booked API returned ${res.status} ${res.statusText}.`, hint)
  }
  const body = await res.text()
  let data
  try {
    data = JSON.parse(body)
  } catch {
    fail('Booked did not return JSON:', '  ' + body.slice(0, 200).replace(/\s+/g, ' ').trim())
  }
  const equipment = (data.resources ?? [])
    .map((r) => r.name)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
  writeEquipment(equipment, 'Booked (Web Services /Resources/)')
}

// ---- Mode 2 (fallback): ICS feed -> only resources with bookings ------------
else if (BOOKED_ICS_URL) {
  let res
  try {
    res = await fetch(BOOKED_ICS_URL)
  } catch (err) {
    fail(`Could not reach Booked: ${err.message}`, 'Are you on the NYU VPN?')
  }
  if (!res.ok) {
    fail(`ICS feed returned ${res.status} ${res.statusText}.`, 'Check BOOKED_ICS_URL / icskey.')
  }
  const ics = (await res.text()).replace(/\r?\n[ \t]/g, '') // unfold RFC 5545
  const unescape = (s) =>
    s
      .replace(/\\n/gi, ' ')
      .replace(/\\,/g, ',')
      .replace(/\\;/g, ';')
      .replace(/\\\\/g, '\\')
      .trim()
  const names = new Set()
  for (const m of ics.matchAll(/^LOCATION:(.*)$/gm)) {
    const v = unescape(m[1])
    if (v) names.add(v)
  }
  const equipment = [...names].sort((a, b) => a.localeCompare(b))
  writeEquipment(equipment, 'Booked (ICS feed, resources with bookings)')
}

// ---- No config -------------------------------------------------------------
else {
  fail(
    'Missing env. For the full catalog set:',
    '  BOOKED_API_URL + BOOKED_API_ID + BOOKED_API_KEY',
    'Or, for resources-with-bookings only: BOOKED_ICS_URL',
  )
}

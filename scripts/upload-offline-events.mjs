#!/usr/bin/env node

/**
 * Upload offline events to Meta Conversions API.
 *
 * This script reads the offline events dataset, hashes user data,
 * and sends the batch directly to the Graph API — no running server needed.
 *
 * Usage:
 *   node scripts/upload-offline-events.mjs
 *   node scripts/upload-offline-events.mjs --dry-run   # preview payload without sending
 *
 * Requires CAPI_ACCESS_TOKEN and VITE_META_PIXEL_ID in .env
 */

import 'dotenv/config'
import crypto from 'crypto'
import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ── Config ───────────────────────────────────────────────────────────────────

const GRAPH_API_VERSION = 'v23.0'
const ACCESS_TOKEN = process.env.CAPI_ACCESS_TOKEN
const PIXEL_ID = process.env.VITE_META_PIXEL_ID
const TEST_EVENT_CODE = process.env.VITE_CAPI_TEST_EVENT_CODE || ''
const DRY_RUN = process.argv.includes('--dry-run')

if (!ACCESS_TOKEN || !PIXEL_ID) {
  console.error('❌  Missing CAPI_ACCESS_TOKEN or VITE_META_PIXEL_ID in .env')
  process.exit(1)
}

// ── Hashing helpers (mirrors api/offline-capi.js) ────────────────────────────

const sha256 = (value) =>
  crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex')

const HASH_FIELD_MAP = {
  email: 'em',
  first_name: 'fn',
  last_name: 'ln',
  phone: 'ph',
  gender: 'gen',
  date_of_birth: 'db',
  city: 'ct',
  state: 'st',
  zip: 'zp',
  country: 'country',
}

const PASSTHROUGH_FIELD_MAP = {
  external_id: 'external_id',
  madid: 'madid',
  lead_id: 'lead_id',
}

const buildUserData = (userData = {}) => {
  const result = {}
  for (const [key, value] of Object.entries(userData)) {
    if (!value) continue
    if (key in HASH_FIELD_MAP) {
      const capiKey = HASH_FIELD_MAP[key]
      const values = Array.isArray(value) ? value : [value]
      result[capiKey] = values.filter(Boolean).map((v) => sha256(v))
    } else if (key in PASSTHROUGH_FIELD_MAP) {
      const capiKey = PASSTHROUGH_FIELD_MAP[key]
      const values = Array.isArray(value) ? value : [value]
      result[capiKey] = values.filter(Boolean)
    }
  }
  return result
}

// ── Load offline events dataset ──────────────────────────────────────────────

// We can't directly import the ESM dataset (it uses import from './products'),
// so we inline the products then evaluate the events at build time.
// Simpler approach: re-declare the product prices/ids and build events here.

const __dirname = dirname(fileURLToPath(import.meta.url))
const productsPath = resolve(__dirname, '../src/data/products.js')
const productsSource = readFileSync(productsPath, 'utf-8')

// Quick extraction: strip the `export` keyword and evaluate
const productsCode = productsSource.replace(/^export\s+/m, '')
const products = new Function(`${productsCode}; return products;`)()

const hoursAgo = (h) => Math.floor(Date.now() / 1000) - h * 3600

const offlineEvents = [
  {
    event_name: 'Purchase',
    event_time: hoursAgo(2),
    action_source: 'physical_store',
    order_id: 'OFF-10001',
    user_data: {
      email: ['jane.doe@example.com'],
      phone: ['+6591234567'],
      first_name: 'Jane',
      last_name: 'Doe',
      gender: 'f',
      date_of_birth: '19900315',
      city: 'Singapore',
      state: 'SG',
      zip: '018956',
      country: 'sg',
      external_id: 'cust-001',
    },
    custom_data: {
      currency: 'USD',
      value: products[0].price,
      content_type: 'product',
      contents: [{ id: products[0].id, quantity: 1, price: products[0].price, brand: 'AudioTech', category: products[0].category }],
    },
  },
  {
    event_name: 'Purchase',
    event_time: hoursAgo(6),
    action_source: 'physical_store',
    order_id: 'OFF-10002',
    user_data: {
      email: ['john.smith@example.com'],
      phone: ['+6598765432', '+6561234567'],
      first_name: 'John',
      last_name: 'Smith',
      gender: 'm',
      date_of_birth: '19851220',
      city: 'Singapore',
      state: 'SG',
      zip: '049315',
      country: 'sg',
      external_id: 'cust-002',
    },
    custom_data: {
      currency: 'USD',
      value: products[1].price + products[5].price,
      content_type: 'product',
      contents: [
        { id: products[1].id, quantity: 1, price: products[1].price, brand: 'TimeCraft', category: products[1].category },
        { id: products[5].id, quantity: 2, price: products[5].price, brand: 'HydroFlask', category: products[5].category },
      ],
    },
  },
  {
    event_name: 'Purchase',
    event_time: hoursAgo(18),
    action_source: 'phone_call',
    order_id: 'OFF-10003',
    user_data: {
      email: ['alice.tan@example.com'],
      phone: ['+6581112222'],
      first_name: 'Alice',
      last_name: 'Tan',
      gender: 'f',
      date_of_birth: '19921108',
      city: 'Singapore',
      state: 'SG',
      zip: '238801',
      country: 'sg',
      external_id: 'cust-003',
    },
    custom_data: {
      currency: 'USD',
      value: products[3].price,
      content_type: 'product',
      contents: [{ id: products[3].id, quantity: 1, price: products[3].price, brand: 'KeyMaster', category: products[3].category }],
    },
  },
  {
    event_name: 'Purchase',
    event_time: hoursAgo(30),
    action_source: 'physical_store',
    order_id: 'OFF-10004',
    user_data: {
      email: ['bob.lee@example.com'],
      phone: ['+6599887766'],
      first_name: 'Bob',
      last_name: 'Lee',
      gender: 'm',
      date_of_birth: '19880704',
      city: 'Singapore',
      state: 'SG',
      zip: '179101',
      country: 'sg',
      external_id: 'cust-004',
    },
    custom_data: {
      currency: 'USD',
      value: products[2].price + products[4].price,
      content_type: 'product',
      contents: [
        { id: products[2].id, quantity: 1, price: products[2].price, brand: 'BrewCo', category: products[2].category },
        { id: products[4].id, quantity: 1, price: products[4].price, brand: 'CanvasCo', category: products[4].category },
      ],
    },
  },
  {
    event_name: 'Purchase',
    event_time: hoursAgo(48),
    action_source: 'physical_store',
    order_id: 'OFF-10005',
    user_data: {
      email: ['carol.wong@example.com'],
      phone: ['+6587654321', '+6590001111'],
      first_name: 'Carol',
      last_name: 'Wong',
      gender: 'f',
      date_of_birth: '19950501',
      city: 'Singapore',
      state: 'SG',
      zip: '048580',
      country: 'sg',
      external_id: 'cust-005',
    },
    custom_data: {
      currency: 'USD',
      value: products[0].price + products[3].price + products[5].price,
      content_type: 'product',
      contents: [
        { id: products[0].id, quantity: 1, price: products[0].price, brand: 'AudioTech', category: products[0].category },
        { id: products[3].id, quantity: 1, price: products[3].price, brand: 'KeyMaster', category: products[3].category },
        { id: products[5].id, quantity: 3, price: products[5].price, brand: 'HydroFlask', category: products[5].category },
      ],
    },
  },
  {
    event_name: 'Lead',
    event_time: hoursAgo(12),
    action_source: 'phone_call',
    user_data: {
      email: ['dave.lim@example.com'],
      phone: ['+6512345678'],
      first_name: 'Dave',
      last_name: 'Lim',
      gender: 'm',
      date_of_birth: '19970823',
      city: 'Singapore',
      state: 'SG',
      zip: '188065',
      country: 'sg',
      external_id: 'cust-006',
    },
    custom_data: {
      currency: 'USD',
      value: products[0].price,
      content_type: 'product',
      contents: [{ id: products[0].id, quantity: 1, price: products[0].price, brand: 'AudioTech', category: products[0].category }],
    },
  },
]

// ── Build CAPI payload ───────────────────────────────────────────────────────

const data = offlineEvents.map((evt) => {
  const entry = {
    event_name: evt.event_name,
    event_time: evt.event_time,
    event_id: randomUUID(),
    action_source: evt.action_source,
    user_data: buildUserData(evt.user_data),
    custom_data: evt.custom_data,
  }
  if (evt.order_id) entry.order_id = evt.order_id
  if (evt.item_number) entry.item_number = evt.item_number
  return entry
})

const payload = { data }
if (TEST_EVENT_CODE) {
  payload.test_event_code = TEST_EVENT_CODE
}

// ── Send or preview ──────────────────────────────────────────────────────────

console.log(`\n📦  ${data.length} offline events prepared for pixel ${PIXEL_ID}`)
if (TEST_EVENT_CODE) {
  console.log(`🧪  Test event code: ${TEST_EVENT_CODE}`)
}

if (DRY_RUN) {
  console.log('\n🔍  DRY RUN — payload preview:\n')
  console.log(JSON.stringify(payload, null, 2))
  process.exit(0)
}

console.log('🚀  Uploading to Conversions API...\n')

const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`

try {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const result = await response.json()

  if (!response.ok) {
    console.error('❌  CAPI error:', JSON.stringify(result, null, 2))
    process.exit(1)
  }

  console.log('✅  Success!')
  console.log(`    Events received: ${result.events_received ?? data.length}`)
  if (result.messages) {
    console.log('    Messages:', result.messages)
  }
} catch (err) {
  console.error('❌  Network error:', err.message)
  process.exit(1)
}

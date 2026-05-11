#!/usr/bin/env node

/**
 * Create a simple single-image campaign via the Meta Marketing API
 * using product 3 (prod-003 — Portable Espresso Maker) as the creative.
 *
 * Steps:
 *   1. Create a Campaign        (PAUSED) — "API demo campaign"
 *   2. Download + upload image  → returns image_hash
 *   3. Create an Ad Set         (PAUSED, linked to campaign)
 *   4. Create an Ad Creative    (single-image, link ad)
 *   5. Create an Ad             (PAUSED, linked to ad set + creative)
 *
 * Everything is created in PAUSED state so nothing accidentally spends money.
 *
 * Usage:
 *   node scripts/create-single-image-campaign.mjs
 *   node scripts/create-single-image-campaign.mjs --dry-run
 *   node scripts/create-single-image-campaign.mjs --product=prod-003
 *
 * Required .env:
 *   META_AD_ACCOUNT_ID   e.g. act_123456789
 *   META_ACCESS_TOKEN    user/system-user token with ads_management
 *   META_PAGE_ID         Facebook Page ID to use as the ad's page actor
 *
 * Optional .env:
 *   META_PIXEL_ID        pixel to track conversions on the ad
 */

import 'dotenv/config'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ── Config ───────────────────────────────────────────────────────────────────

const GRAPH_API_VERSION = 'v23.0'
const BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`
const CAMPAIGN_NAME = 'API demo campaign'

const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN
const PAGE_ID = process.env.META_PAGE_ID
const PIXEL_ID = process.env.META_PIXEL_ID || process.env.VITE_META_PIXEL_ID

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const productArg = args.find((a) => a.startsWith('--product='))
const PRODUCT_ID = productArg ? productArg.slice('--product='.length) : 'prod-003'

// ── Validation ───────────────────────────────────────────────────────────────

const missing = []
if (!AD_ACCOUNT_ID) missing.push('META_AD_ACCOUNT_ID')
if (!ACCESS_TOKEN) missing.push('META_ACCESS_TOKEN')
if (!PAGE_ID) missing.push('META_PAGE_ID')
if (missing.length) {
  console.error(`❌  Missing env vars: ${missing.join(', ')}`)
  process.exit(1)
}
if (!AD_ACCOUNT_ID.startsWith('act_')) {
  console.error(`❌  META_AD_ACCOUNT_ID must start with "act_" (got: ${AD_ACCOUNT_ID})`)
  process.exit(1)
}

// ── Load product ─────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const productsPath = resolve(__dirname, '../src/data/products.json')
const products = JSON.parse(readFileSync(productsPath, 'utf-8'))
const product = products.find((p) => p.id === PRODUCT_ID)

if (!product) {
  console.error(`❌  Product "${PRODUCT_ID}" not found in products.json`)
  console.error(`    Available: ${products.map((p) => p.id).join(', ')}`)
  process.exit(1)
}

console.log(`📦  Using product: ${product.id} — ${product.title}`)

// ── Helpers ──────────────────────────────────────────────────────────────────

const post = async (path, body, { multipart = false } = {}) => {
  const url = `${BASE}/${path}`
  let init
  let finalUrl = url
  if (multipart) {
    init = { method: 'POST', body }
    finalUrl = `${url}?access_token=${ACCESS_TOKEN}`
  } else {
    init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, access_token: ACCESS_TOKEN }),
    }
  }
  const res = await fetch(finalUrl, init)
  const json = await res.json()
  if (!res.ok) {
    console.error(`\n❌  POST ${path} failed:`)
    console.error(JSON.stringify(json, null, 2))
    process.exit(1)
  }
  return json
}

// ── Build payloads ───────────────────────────────────────────────────────────

const CAMPAIGN_PAYLOAD = {
  name: CAMPAIGN_NAME,
  objective: 'OUTCOME_TRAFFIC',
  status: 'PAUSED',
  special_ad_categories: [],
  buying_type: 'AUCTION',
}

const adSetPayload = (campaignId) => ({
  name: `${CAMPAIGN_NAME} – Ad Set`,
  campaign_id: campaignId,
  status: 'PAUSED',
  daily_budget: 1000, // in cents → $10/day
  billing_event: 'IMPRESSIONS',
  optimization_goal: 'LINK_CLICKS',
  bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
  // Start tomorrow, run for 7 days
  start_time: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  end_time: new Date(Date.now() + 8 * 24 * 3600 * 1000).toISOString(),
  targeting: {
    geo_locations: { countries: ['US'] },
    age_min: 18,
    age_max: 65,
    publisher_platforms: ['facebook', 'instagram'],
    facebook_positions: ['feed'],
    instagram_positions: ['stream'],
    device_platforms: ['mobile', 'desktop'],
  },
})

const creativePayload = (imageHash) => ({
  name: `${CAMPAIGN_NAME} – Creative (${product.id})`,
  object_story_spec: {
    page_id: PAGE_ID,
    link_data: {
      message: product.description,
      link: product.link,
      name: product.title,
      description: `${product.currency} ${product.sale_price ?? product.price}`,
      image_hash: imageHash,
      call_to_action: {
        type: 'SHOP_NOW',
        value: { link: product.link },
      },
    },
  },
  degrees_of_freedom_spec: {
    creative_features_spec: {
      standard_enhancements: { enroll_status: 'OPT_OUT' },
    },
  },
})

const adPayload = (adSetId, creativeId) => {
  const body = {
    name: `${CAMPAIGN_NAME} – Ad (${product.id})`,
    adset_id: adSetId,
    creative: { creative_id: creativeId },
    status: 'PAUSED',
  }
  if (PIXEL_ID) {
    body.tracking_specs = [
      {
        'action.type': ['offsite_conversion'],
        fb_pixel: [PIXEL_ID],
      },
    ]
  }
  return body
}

// ── Dry run ──────────────────────────────────────────────────────────────────

if (DRY_RUN) {
  console.log(`\n🔍  DRY RUN — would create on ${AD_ACCOUNT_ID}:\n`)
  console.log('1) Campaign:\n', JSON.stringify(CAMPAIGN_PAYLOAD, null, 2))
  console.log('\n2) Image upload from URL:', product.image_link)
  console.log('\n3) Ad Set:\n', JSON.stringify(adSetPayload('<campaign_id>'), null, 2))
  console.log('\n4) Creative:\n', JSON.stringify(creativePayload('<image_hash>'), null, 2))
  console.log(
    '\n5) Ad:\n',
    JSON.stringify(adPayload('<adset_id>', '<creative_id>'), null, 2),
  )
  process.exit(0)
}

// ── Execute ──────────────────────────────────────────────────────────────────

console.log(`\n🚀  Creating "${CAMPAIGN_NAME}" on ${AD_ACCOUNT_ID}\n`)

// 1. Campaign
console.log('1️⃣   Creating campaign...')
const campaign = await post(`${AD_ACCOUNT_ID}/campaigns`, CAMPAIGN_PAYLOAD)
console.log(`     ✅ campaign_id = ${campaign.id}`)

// 2. Download image, then upload to ad account
console.log(`2️⃣   Downloading image: ${product.image_link}`)
const imgRes = await fetch(product.image_link)
if (!imgRes.ok) {
  console.error(`❌  Failed to download image: HTTP ${imgRes.status}`)
  process.exit(1)
}
const imgArrayBuffer = await imgRes.arrayBuffer()
const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
const ext = contentType.includes('png') ? 'png' : 'jpg'
const fileName = `${product.id}.${ext}`

console.log(`     uploading to ${AD_ACCOUNT_ID}/adimages...`)
const form = new FormData()
form.append('source', new Blob([imgArrayBuffer], { type: contentType }), fileName)
const imageRes = await post(`${AD_ACCOUNT_ID}/adimages`, form, { multipart: true })

// Response shape: { images: { "<filename>": { hash: "...", url: "..." } } }
const imagesMap = imageRes.images || {}
const firstKey = Object.keys(imagesMap)[0]
const imageHash = imagesMap[firstKey]?.hash
if (!imageHash) {
  console.error('❌  No image hash returned:', JSON.stringify(imageRes, null, 2))
  process.exit(1)
}
console.log(`     ✅ image_hash = ${imageHash}`)

// 3. Ad Set
console.log('3️⃣   Creating ad set...')
const adSet = await post(`${AD_ACCOUNT_ID}/adsets`, adSetPayload(campaign.id))
console.log(`     ✅ adset_id = ${adSet.id}`)

// 4. Creative
console.log('4️⃣   Creating ad creative...')
const creative = await post(`${AD_ACCOUNT_ID}/adcreatives`, creativePayload(imageHash))
console.log(`     ✅ creative_id = ${creative.id}`)

// 5. Ad
console.log('5️⃣   Creating ad...')
const ad = await post(`${AD_ACCOUNT_ID}/ads`, adPayload(adSet.id, creative.id))
console.log(`     ✅ ad_id = ${ad.id}`)

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('\n🎉  Done! All assets created in PAUSED state.\n')
console.log('   Campaign : ', campaign.id, `(${CAMPAIGN_NAME})`)
console.log('   Ad Set   : ', adSet.id)
console.log('   Creative : ', creative.id)
console.log('   Ad       : ', ad.id)
console.log('   Image    : ', imageHash)
console.log('   Product  : ', `${product.id} — ${product.title}`)
console.log(
  `\n   View in Ads Manager:\n   https://business.facebook.com/adsmanager/manage/campaigns?act=${AD_ACCOUNT_ID.replace('act_', '')}&selected_campaign_ids=${campaign.id}\n`,
)

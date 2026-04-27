import crypto from 'crypto'
import { pickBy, mapKeys, mapValues, omitBy, isNil } from 'es-toolkit'

const GRAPH_API_VERSION = 'v23.0'

const sha256 = (value) =>
  crypto
    .createHash('sha256')
    .update(value.trim().toLowerCase())
    .digest('hex')

// hashing parameters can be found here : https://developers.facebook.com/documentation/ads-commerce/conversions-api/parameters
const CAPI_FIELD_MAP = {
  email: 'em',
  first_name: 'fn',
  last_name: 'ln',
  phone: 'ph',
  city: 'ct',
  state: 'st',
  zip: 'zp',
  country: 'country',
}

const hashUserData = (userData = {}) => {
  const relevant = pickBy(userData, (value, key) => Boolean(value) && key in CAPI_FIELD_MAP)
  return mapValues(
    mapKeys(relevant, (_value, key) => CAPI_FIELD_MAP[key]),
    (value) => sha256(value),
  )
}

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const accessToken = process.env.CAPI_ACCESS_TOKEN
  const pixelId = process.env.VITE_META_PIXEL_ID

  if (!accessToken || !pixelId) {
    return res.status(500).json({ error: 'CAPI not configured — missing CAPI_ACCESS_TOKEN or VITE_META_PIXEL_ID' })
  }

  try {
    const { event_name, event_id, params = {}, user_data = {}, fbc, fbp, event_source_url, test_event_code } = req.body

    if (!event_name || !event_id) {
      return res.status(400).json({ error: 'event_name and event_id are required' })
    }

    // Server-side signals
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress
    const clientUserAgent = req.headers['user-agent']

    const hashedUserData = {
      ...hashUserData(user_data),
      client_ip_address: clientIp,
      client_user_agent: clientUserAgent,
      fbc,
      fbp,
    }

    const eventData = omitBy(
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url,
        action_source: 'website',
        user_data: hashedUserData,
        custom_data: params,
      },
      isNil,
    )

    const payload = { data: [eventData] }

    if (test_event_code) {
      payload.test_event_code = test_event_code
    }

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('CAPI error:', result)
      return res.status(response.status).json({ error: 'CAPI request failed', details: result })
    }

    return res.status(200).json({ success: true, ...result })
  } catch (err) {
    console.error('CAPI handler error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

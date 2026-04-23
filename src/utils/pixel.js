import { v4 as uuidv4 } from 'uuid'

// Meta Pixel event log — shared across the app
export const eventLog = []

export function generateEventId() {
  return uuidv4()
}

function log(eventName, params) {
  const entry = {
    id: Date.now() + Math.random(),
    ts: new Date().toLocaleTimeString(),
    event: eventName,
    params,
  }
  eventLog.unshift(entry)
  // Cap at 50 entries
  if (eventLog.length > 50) eventLog.pop()
  // Notify subscribers
  subscribers.forEach((fn) => fn([...eventLog]))
}

const subscribers = new Set()
export function subscribeEventLog(fn) {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

function fbq(...args) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args)
  }
}

export function initPixel(pixelId) {
  if (!pixelId || typeof window === 'undefined') return
  if (window._pixelInitialized) return
  window._pixelInitialized = true

  /* eslint-disable */
  ;(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */

  window.fbq.disablePushState = true
  window.fbq('init', pixelId)
}

// ─── Standard Events ──────────────────────────────────────────────────────────

export function trackPageView({ eventID } = {}) {
  fbq('track', 'PageView', {}, { eventID })
  log('PageView', { eventID })
}

export function trackViewContent({ content_ids, content_name, content_type, value, currency, eventID }) {
  const params = {
    content_ids,
    content_name,
    content_type: content_type || 'product',
    value,
    currency: currency || 'USD',
  }
  fbq('track', 'ViewContent', params, { eventID })
  log('ViewContent', { ...params, eventID })
}

export function trackAddToCart({ content_ids, content_name, value, currency, quantity, eventID }) {
  const params = { content_ids, content_name, value, currency: currency || 'USD', quantity: quantity || 1 }
  fbq('track', 'AddToCart', params, { eventID })
  log('AddToCart', { ...params, eventID })
}

export function trackAddToWishlist({ content_ids, content_name, value, currency, eventID }) {
  const params = { content_ids, content_name, value, currency: currency || 'USD' }
  fbq('track', 'AddToWishlist', params, { eventID })
  log('AddToWishlist', { ...params, eventID })
}

export function trackInitiateCheckout({ content_ids, num_items, value, currency, eventID }) {
  const params = { content_ids, num_items, value, currency: currency || 'USD' }
  fbq('track', 'InitiateCheckout', params, { eventID })
  log('InitiateCheckout', { ...params, eventID })
}

export function trackAddPaymentInfo({ content_ids, value, currency, eventID }) {
  const params = { content_ids, value, currency: currency || 'USD' }
  fbq('track', 'AddPaymentInfo', params, { eventID })
  log('AddPaymentInfo', { ...params, eventID })
}

export function trackPurchase({ content_ids, num_items, value, currency, eventID }) {
  const params = { content_ids, num_items, value: Number(value.toFixed(2)), currency: currency || 'USD' }
  fbq('track', 'Purchase', params, { eventID })
  log('Purchase', { ...params, eventID })
}

export function trackSearch({ search_string, eventID }) {
  const params = { search_string }
  fbq('track', 'Search', params, { eventID })
  log('Search', { ...params, eventID })
}

export function trackLead({ eventID } = {}) {
  fbq('track', 'Lead', {}, { eventID })
  log('Lead', { eventID })
}

export function trackCompleteRegistration({ eventID } = {}) {
  fbq('track', 'CompleteRegistration', {}, { eventID })
  log('CompleteRegistration', { eventID })
}

// ─── Custom Events ───────────────────────────────────────────────────────────

export function trackPortableEspressoMakerViewProduct(product, eventID) {
  const params = {
    event_name: 'PortableEspressoMaker_ViewProduct',
    content_type: 'product',
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    value: product.price,
    currency: 'SGD',
  }
  fbq('trackCustom', 'PortableEspressoMaker_ViewProduct', params, { eventID })
  log('PortableEspressoMaker_ViewProduct', { ...params, eventID })
}

// ─── Custom Conversions ──────────────────────────────────────────────────────
// Purchase_PortableEspressoMaker: fires when a Purchase contains prod-003

export function trackPurchasePortableEspressoMaker({ content_ids, num_items, value, currency, eventID }) {
  if (!content_ids || !content_ids.includes('prod-003')) return
  const params = {
    content_ids: ['prod-003'],
    num_items,
    value: Number(value.toFixed(2)),
    currency: currency || 'SGD',
    custom_conversion: 'Purchase_PortableEspressoMaker',
  }
  fbq('trackCustom', 'Purchase_PortableEspressoMaker', params, { eventID })
  log('Purchase_PortableEspressoMaker', { ...params, eventID })
}

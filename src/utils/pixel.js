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

  window.fbq('init', pixelId)
}

// ─── Standard Events ──────────────────────────────────────────────────────────

export function trackPageView({ event_id } = {}) {
  fbq('track', 'PageView', {}, { eventID: event_id })
  log('PageView', { event_id })
  return { event_name: 'PageView', event_id }
}

export function trackViewContent({ content_ids, content_name, content_type, value, currency, event_id }) {
  const params = {
    content_ids,
    content_name,
    content_type: content_type || 'product',
    value,
    currency: currency || 'USD',
  }
  fbq('track', 'ViewContent', params, { eventID: event_id })
  log('ViewContent', { ...params, event_id })
  return { event_name: 'ViewContent', event_id, params }
}

export function trackAddToCart({ content_ids, content_name, value, currency, quantity, event_id }) {
  const params = { content_ids, content_name, value, currency: currency || 'USD', quantity: quantity || 1 }
  fbq('track', 'AddToCart', params, { eventID: event_id })
  log('AddToCart', { ...params, event_id })
  return { event_name: 'AddToCart', event_id, params }
}

export function trackAddToWishlist({ content_ids, content_name, value, currency, event_id }) {
  const params = { content_ids, content_name, value, currency: currency || 'USD' }
  fbq('track', 'AddToWishlist', params, { eventID: event_id })
  log('AddToWishlist', { ...params, event_id })
  return { event_name: 'AddToWishlist', event_id, params }
}

export function trackInitiateCheckout({ content_ids, num_items, value, currency, event_id }) {
  const params = { content_ids, num_items, value, currency: currency || 'USD' }
  fbq('track', 'InitiateCheckout', params, { eventID: event_id })
  log('InitiateCheckout', { ...params, event_id })
  return { event_name: 'InitiateCheckout', event_id, params }
}

export function trackAddPaymentInfo({ content_ids, value, currency, event_id }) {
  const params = { content_ids, value, currency: currency || 'USD' }
  fbq('track', 'AddPaymentInfo', params, { eventID: event_id })
  log('AddPaymentInfo', { ...params, event_id })
  return { event_name: 'AddPaymentInfo', event_id, params }
}

export function trackPurchase({ content_ids, num_items, value, currency, event_id }) {
  const params = { content_ids, num_items, value: Number(value.toFixed(2)), currency: currency || 'USD' }
  fbq('track', 'Purchase', params, { eventID: event_id })
  log('Purchase', { ...params, event_id })
  return { event_name: 'Purchase', event_id, params }
}

export function trackSearch({ search_string, event_id }) {
  const params = { search_string }
  fbq('track', 'Search', params, { eventID: event_id })
  log('Search', { ...params, event_id })
  return { event_name: 'Search', event_id, params }
}

export function trackLead({ event_id } = {}) {
  fbq('track', 'Lead', {}, { eventID: event_id })
  log('Lead', { event_id })
  return { event_name: 'Lead', event_id }
}

export function trackCompleteRegistration({ event_id } = {}) {
  fbq('track', 'CompleteRegistration', {}, { eventID: event_id })
  log('CompleteRegistration', { event_id })
  return { event_name: 'CompleteRegistration', event_id }
}

// ─── Custom Events ───────────────────────────────────────────────────────────

export function trackPortableEspressoMakerViewProduct(product, event_id) {
  const params = {
    event_name: 'PortableEspressoMaker_ViewProduct',
    content_type: 'product',
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    value: product.price,
    currency: 'SGD',
  }
  fbq('trackCustom', 'PortableEspressoMaker_ViewProduct', params, { eventID: event_id })
  log('PortableEspressoMaker_ViewProduct', { ...params, event_id })
  return { event_name: 'PortableEspressoMaker_ViewProduct', event_id, params }
}

// ─── Custom Conversions ──────────────────────────────────────────────────────
// Purchase_PortableEspressoMaker: fires when a Purchase contains prod-003

export function trackPurchasePortableEspressoMaker({ content_ids, num_items, value, currency, event_id }) {
  if (!content_ids || !content_ids.includes('prod-003')) return
  const params = {
    content_ids: ['prod-003'],
    num_items,
    value: Number(value.toFixed(2)),
    currency: currency || 'SGD',
    custom_conversion: 'Purchase_PortableEspressoMaker',
  }
  fbq('trackCustom', 'Purchase_PortableEspressoMaker', params, { eventID: event_id })
  log('Purchase_PortableEspressoMaker', { ...params, event_id })
  return { event_name: 'Purchase_PortableEspressoMaker', event_id, params }
}

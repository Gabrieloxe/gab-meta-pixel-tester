// Meta Pixel event log — shared across the app
export const eventLog = []

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

export function trackPageView() {
  fbq('track', 'PageView')
  log('PageView', {})
}

export function trackViewContent({ content_ids, content_name, content_type, value, currency }) {
  const params = { content_ids, content_name, content_type: content_type || 'product', value, currency: currency || 'USD' }
  fbq('track', 'ViewContent', params)
  log('ViewContent', params)
}

export function trackAddToCart({ content_ids, content_name, value, currency, quantity }) {
  const params = { content_ids, content_name, value, currency: currency || 'USD', quantity: quantity || 1 }
  fbq('track', 'AddToCart', params)
  log('AddToCart', params)
}

export function trackAddToWishlist({ content_ids, content_name, value, currency }) {
  const params = { content_ids, content_name, value, currency: currency || 'USD' }
  fbq('track', 'AddToWishlist', params)
  log('AddToWishlist', params)
}

export function trackInitiateCheckout({ content_ids, num_items, value, currency }) {
  const params = { content_ids, num_items, value, currency: currency || 'USD' }
  fbq('track', 'InitiateCheckout', params)
  log('InitiateCheckout', params)
}

export function trackAddPaymentInfo({ content_ids, value, currency }) {
  const params = { content_ids, value, currency: currency || 'USD' }
  fbq('track', 'AddPaymentInfo', params)
  log('AddPaymentInfo', params)
}

export function trackPurchase({ content_ids, num_items, value, currency }) {
  const params = { content_ids, num_items, value: Number(value.toFixed(2)), currency: currency || 'USD' }
  fbq('track', 'Purchase', params)
  log('Purchase', params)
}

export function trackSearch({ search_string }) {
  const params = { search_string }
  fbq('track', 'Search', params)
  log('Search', params)
}

export function trackLead() {
  fbq('track', 'Lead')
  log('Lead', {})
}

export function trackCompleteRegistration() {
  fbq('track', 'CompleteRegistration')
  log('CompleteRegistration', {})
}

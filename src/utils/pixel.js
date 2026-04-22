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

  // noscript fallback for users with JS disabled
  const noscript = document.createElement('noscript')
  const img = document.createElement('img')
  img.height = 1
  img.width = 1
  img.style.display = 'none'
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`
  noscript.appendChild(img)
  document.head.appendChild(noscript)
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

// ─── Custom Events ───────────────────────────────────────────────────────────

export function trackPortableEspressoMakerViewProduct(product) {
  const params = {
    event_name: 'PortableEspressoMaker_ViewProduct',
    content_type: 'product',
    content_ids: [product.id],
    content_name: product.name,
    content_category: product.category,
    value: product.price,
    currency: 'SGD',
  }
  fbq('trackCustom', 'PortableEspressoMaker_ViewProduct', params)
  log('PortableEspressoMaker_ViewProduct', params)
}

// ─── Custom Conversions ──────────────────────────────────────────────────────
// Purchase_PortableEspressoMaker: fires when a Purchase contains prod-003

export function trackPurchasePortableEspressoMaker({ content_ids, num_items, value, currency }) {
  if (!content_ids || !content_ids.includes('prod-003')) return
  const params = {
    content_ids: ['prod-003'],
    num_items,
    value: Number(value.toFixed(2)),
    currency: currency || 'SGD',
    custom_conversion: 'Purchase_PortableEspressoMaker',
  }
  fbq('trackCustom', 'Purchase_PortableEspressoMaker', params)
  log('Purchase_PortableEspressoMaker', params)
}

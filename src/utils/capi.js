import { omitBy, isNil } from 'es-toolkit'

const TEST_EVENT_CODE = import.meta.env.VITE_CAPI_TEST_EVENT_CODE || ''

/**
 * Send an event to the server-side CAPI endpoint.
 * Fire-and-forget — errors are logged but never block the UI.
 */
export const sendServerEvent = ({ event_name, event_id, params = {}, user_data = {} }) => {
  const body = omitBy(
    {
      event_name,
      event_id,
      params,
      user_data,
      event_source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      test_event_code: TEST_EVENT_CODE || undefined,
    },
    isNil,
  )

  fetch('/api/capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((err) => console.warn('[CAPI]', event_name, 'server error:', err))
      }
      console.debug('[CAPI]', event_name, 'sent successfully')
    })
    .catch((err) => console.warn('[CAPI]', event_name, 'network error:', err.message))
}

import { useState } from 'react'
import { usePixel } from '../context/PixelContext'

const EVENT_COLORS = {
  PageView: '#6366f1',
  ViewContent: '#0ea5e9',
  AddToCart: '#10b981',
  AddToWishlist: '#f59e0b',
  InitiateCheckout: '#8b5cf6',
  AddPaymentInfo: '#ec4899',
  Purchase: '#ef4444',
  Search: '#64748b',
  Lead: '#06b6d4',
  CompleteRegistration: '#84cc16',
}

export default function PixelEventLog() {
  const { pixelId, applyPixelId, initialized, log } = usePixel()
  const [input, setInput] = useState(pixelId)
  const [collapsed, setCollapsed] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    applyPixelId(input)
  }

  return (
    <aside className={`event-log-panel ${collapsed ? 'collapsed' : ''}`}>
      <div className="event-log-header" onClick={() => setCollapsed((c) => !c)}>
        <span>
          <span className={`pixel-dot ${initialized ? 'active' : ''}`} />
          Meta Pixel Event Log
        </span>
        <span className="collapse-btn">{collapsed ? '▲' : '▼'}</span>
      </div>

      {!collapsed && (
        <>
          <form className="pixel-id-form" onSubmit={handleSave}>
            <input
              type="text"
              placeholder="Enter Pixel ID…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Apply</button>
          </form>

          {initialized ? (
            <p className="pixel-status ok">Pixel {pixelId} active</p>
          ) : (
            <p className="pixel-status warn">No Pixel ID set — events logged locally only</p>
          )}

          <ul className="event-list">
            {log.length === 0 && (
              <li className="event-empty">No events yet. Interact with the shop!</li>
            )}
            {log.map((entry) => (
              <li key={entry.id} className="event-item">
                <span
                  className="event-name"
                  style={{ color: EVENT_COLORS[entry.event] || '#fff' }}
                >
                  {entry.event}
                </span>
                <span className="event-ts">{entry.ts}</span>
                {Object.keys(entry.params).length > 0 && (
                  <pre className="event-params">
                    {JSON.stringify(entry.params, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}

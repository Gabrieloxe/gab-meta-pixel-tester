import { useState } from 'react'
import { usePixel } from '../context/PixelContext'

const EVENT_COLORS = {
  PageView: 'badge-primary',
  ViewContent: 'badge-info',
  AddToCart: 'badge-success',
  AddToWishlist: 'badge-warning',
  InitiateCheckout: 'badge-secondary',
  AddPaymentInfo: 'badge-accent',
  Purchase: 'badge-error',
  Search: 'badge-ghost',
  Lead: 'badge-info',
  CompleteRegistration: 'badge-success',
}

export default function PixelEventLog() {
  const { pixelId, applyPixelId, initialized, log } = usePixel()
  const [input, setInput] = useState(pixelId)
  const [open, setOpen] = useState(true)

  function handleSave(e) {
    e.preventDefault()
    applyPixelId(input)
  }

  return (
    <aside className={`shrink-0 bg-base-200 border-l border-base-300 sticky top-16 h-[calc(100vh-4rem)] flex flex-col transition-all duration-200 ${open ? 'w-80' : 'w-12'}`}>

      {/* Header toggle */}
      <div
        className="flex items-center justify-between px-3 py-3 bg-base-300 border-b border-base-300 cursor-pointer select-none shrink-0"
        onClick={() => setOpen((o) => !o)}
      >
        {open && (
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${initialized ? 'bg-success shadow-[0_0_6px] shadow-success' : 'bg-base-content/30'}`} />
            <span className="text-xs font-semibold truncate">Meta Pixel Event Log</span>
          </div>
        )}
        <button className="btn btn-ghost btn-xs btn-square ml-auto">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <>
          {/* Pixel ID form */}
          <div className="p-3 border-b border-base-300 shrink-0">
            <form className="join w-full" onSubmit={handleSave}>
              <input
                className="input input-bordered input-sm join-item w-full text-xs"
                type="text"
                placeholder="Enter Pixel ID…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm join-item">
                Apply
              </button>
            </form>
            <div className={`mt-2 text-xs ${initialized ? 'text-success' : 'text-warning'}`}>
              {initialized
                ? `● Pixel ${pixelId} active`
                : '● No Pixel ID — events logged locally only'}
            </div>
          </div>

          {/* Event list */}
          <ul className="flex flex-col gap-2 p-3 overflow-y-auto flex-1">
            {log.length === 0 && (
              <li className="text-center text-base-content/40 text-sm py-8">
                No events yet.<br />Interact with the shop!
              </li>
            )}
            {log.map((entry) => (
              <li key={entry.id} className="card bg-base-300 border border-base-content/10 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`badge badge-sm ${EVENT_COLORS[entry.event] ?? 'badge-ghost'}`}>
                    {entry.event}
                  </span>
                  <span className="text-xs text-base-content/40">{entry.ts}</span>
                </div>
                {Object.keys(entry.params).length > 0 && (
                  <pre className="text-xs text-base-content/60 whitespace-pre-wrap break-all leading-relaxed mt-1">
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

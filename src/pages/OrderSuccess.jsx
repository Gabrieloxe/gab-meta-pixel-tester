import { Link } from 'react-router-dom'
import { generateEventId, trackCompleteRegistration } from '../utils/pixel'

export const OrderSuccess = () => (
  <main className="min-h-[70vh] flex items-center justify-center p-6">
    <div className="card card-bordered bg-base-200 max-w-md w-full shadow-xl">
      <div className="card-body items-center text-center gap-5">
        <div className="avatar placeholder">
          <div className="bg-success text-success-content w-20 rounded-full">
            <span className="text-4xl">✓</span>
          </div>
        </div>
        <h1 className="card-title text-2xl">Order Placed!</h1>
        <p className="text-base-content/70">
          Your test order was successful. <kbd className="kbd kbd-sm">Purchase</kbd> and{' '}
          <kbd className="kbd kbd-sm">AddPaymentInfo</kbd> events have been fired.
        </p>
        <p className="text-sm text-base-content/50">
          Check the Pixel Event Log panel and your Facebook Events Manager to verify the events.
        </p>

        <div className="divider my-0 w-full" />

        <div className="flex flex-col gap-2 w-full">
          <p className="text-xs text-base-content/40 uppercase tracking-widest font-semibold">Fire more events</p>
          <button
            className="btn btn-outline btn-sm w-full"
            onClick={() => trackCompleteRegistration({ event_id: generateEventId() })}
          >
            Fire <kbd className="kbd kbd-sm">CompleteRegistration</kbd>
          </button>
        </div>

        <Link to="/" className="btn btn-primary w-full">
          Continue Shopping
        </Link>
      </div>
    </div>
  </main>
)

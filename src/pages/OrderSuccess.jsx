import { Link } from 'react-router-dom'
import { generateEventId, trackCompleteRegistration } from '../utils/pixel'

export default function OrderSuccess() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="card bg-base-200 border border-base-300 max-w-md w-full shadow-xl">
        <div className="card-body items-center text-center gap-5">
          <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center text-4xl text-success-content">
            ✓
          </div>
          <h1 className="card-title text-2xl">Order Placed!</h1>
          <p className="text-base-content/70">
            Your test order was successful. <code className="bg-base-300 px-1 rounded">Purchase</code> and{' '}
            <code className="bg-base-300 px-1 rounded">AddPaymentInfo</code> events have been fired.
          </p>
          <p className="text-sm text-base-content/50">
            Check the Pixel Event Log panel and your Facebook Events Manager to verify the events.
          </p>

          <div className="divider my-0 w-full" />

          <div className="flex flex-col gap-2 w-full">
            <p className="text-xs text-base-content/40 uppercase tracking-widest font-semibold">Fire more events</p>
            <button
              className="btn btn-outline btn-sm w-full"
              onClick={() => trackCompleteRegistration({ eventID: generateEventId() })}
            >
              Fire <code className="mx-1">CompleteRegistration</code>
            </button>
          </div>

          <Link to="/" className="btn btn-primary w-full">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}

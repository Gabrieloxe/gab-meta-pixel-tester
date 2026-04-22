import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { trackCompleteRegistration } from '../utils/pixel'

export default function OrderSuccess() {
  useEffect(() => {
    // Optionally fire CompleteRegistration for new-user flows
  }, [])

  return (
    <main className="page-success">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Order Placed!</h1>
        <p>
          Your test order was successful. <code>Purchase</code> and{' '}
          <code>AddPaymentInfo</code> events have been fired.
        </p>
        <p>Check the Pixel Event Log panel and your Facebook Events Manager to verify.</p>

        <div className="success-actions">
          <Link to="/" className="btn-add-cart">Continue Shopping</Link>
          <button
            className="btn-wishlist-text"
            onClick={() => {
              trackCompleteRegistration()
            }}
          >
            Fire CompleteRegistration
          </button>
        </div>
      </div>
    </main>
  )
}

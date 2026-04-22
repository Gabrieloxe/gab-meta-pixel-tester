import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { trackPageView, trackAddPaymentInfo, trackPurchase } from '../utils/pixel'

export default function CheckoutPage() {
  const { items, total, dispatch } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState('info') // 'info' | 'payment'
  const [form, setForm] = useState({ name: '', email: '', address: '', card: '' })

  useEffect(() => {
    trackPageView()
  }, [])

  if (items.length === 0) {
    navigate('/')
    return null
  }

  function handleInfoSubmit(e) {
    e.preventDefault()
    setStep('payment')
  }

  function handlePaymentSubmit(e) {
    e.preventDefault()
    trackAddPaymentInfo({
      content_ids: items.map((i) => i.id),
      value: total,
    })
    trackPurchase({
      content_ids: items.map((i) => i.id),
      num_items: items.reduce((s, i) => s + i.qty, 0),
      value: total,
    })
    dispatch({ type: 'CLEAR' })
    navigate('/order-success')
  }

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  return (
    <main className="page-checkout">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-form-wrap">
          <div className="checkout-steps">
            <span className={step === 'info' ? 'active' : 'done'}>1. Shipping Info</span>
            <span className={step === 'payment' ? 'active' : ''}>2. Payment</span>
          </div>

          {step === 'info' && (
            <form onSubmit={handleInfoSubmit} className="checkout-form">
              <label>
                Full Name
                <input required value={form.name} onChange={update('name')} placeholder="Jane Doe" />
              </label>
              <label>
                Email
                <input required type="email" value={form.email} onChange={update('email')} placeholder="jane@example.com" />
              </label>
              <label>
                Shipping Address
                <input required value={form.address} onChange={update('address')} placeholder="123 Main St, City, Country" />
              </label>
              <button type="submit" className="btn-checkout">Continue to Payment</button>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="checkout-form">
              <label>
                Card Number
                <input
                  required
                  value={form.card}
                  onChange={update('card')}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                />
              </label>
              <div className="card-row">
                <label>
                  Expiry
                  <input required placeholder="MM/YY" maxLength={5} />
                </label>
                <label>
                  CVV
                  <input required placeholder="123" maxLength={4} />
                </label>
              </div>
              <button type="submit" className="btn-checkout">
                Place Order — ${total.toFixed(2)}
              </button>
              <p className="pixel-note">
                Fires <code>AddPaymentInfo</code> + <code>Purchase</code> on submit
              </p>
            </form>
          )}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          {items.map((i) => (
            <div key={i.id} className="summary-row">
              <span>{i.name} × {i.qty}</span>
              <span>${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  )
}

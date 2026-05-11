import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sumBy } from 'es-toolkit'
import { useCart } from '../context/CartContext'
import {
  generateEventId,
  trackPageView,
  trackAddPaymentInfo,
  trackPurchase,
  trackPurchasePortableEspressoMaker,
} from '../utils/pixel'

export const CheckoutPage = () => {
  const { items, total, dispatch } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', address: '', card: '' })

  useEffect(() => {
    trackPageView({ event_id: generateEventId() })
  }, [])

  if (items.length === 0) {
    navigate('/')
    return null
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleInfoSubmit = (e) => {
    e.preventDefault()
    setStep(1)
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    const contentIds = items.map((i) => i.id)
    const numItems = sumBy(items, (i) => i.qty)
    const currency = items[0]?.currency

    const nameParts = form.name.trim().split(/\s+/)
    const user_data = {
      email: form.email,
      first_name: nameParts[0] || '',
      last_name: nameParts.slice(1).join(' ') || '',
    }

    trackAddPaymentInfo({ content_ids: contentIds, value: total, currency, event_id: generateEventId(), user_data })
    trackPurchase({
      content_ids: contentIds,
      content_type: 'product',
      num_items: numItems,
      value: total,
      currency,
      event_id: generateEventId(),
      user_data,
    })
    trackPurchasePortableEspressoMaker({
      content_ids: contentIds,
      num_items: numItems,
      value: total,
      currency,
      event_id: generateEventId(),
      user_data,
    })
    dispatch({ type: 'CLEAR' })
    navigate('/order-success')
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <ul className="steps w-full mb-8">
        <li className={`step ${step >= 0 ? 'step-primary' : ''}`}>Shipping</li>
        <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Payment</li>
        <li className="step">Confirmation</li>
      </ul>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          {step === 0 && (
            <form onSubmit={handleInfoSubmit} className="card card-bordered bg-base-200">
              <div className="card-body gap-4">
                <h2 className="card-title">Shipping Information</h2>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Full Name</legend>
                  <input required className="input input-bordered w-full" placeholder="Jane Doe" value={form.name} onChange={update('name')} />
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Email</legend>
                  <input required type="email" className="input input-bordered w-full" placeholder="jane@example.com" value={form.email} onChange={update('email')} />
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Shipping Address</legend>
                  <input required className="input input-bordered w-full" placeholder="123 Main St, City, Country" value={form.address} onChange={update('address')} />
                </fieldset>
                <div className="card-actions justify-end pt-2">
                  <button type="submit" className="btn btn-primary">Continue to Payment →</button>
                </div>
              </div>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handlePaymentSubmit} className="card card-bordered bg-base-200">
              <div className="card-body gap-4">
                <h2 className="card-title">Payment Details</h2>
                <div className="alert alert-info text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-5 shrink-0 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  This is a test checkout — no real charge will occur.
                </div>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Card Number</legend>
                  <input required className="input input-bordered w-full font-mono" placeholder="4242 4242 4242 4242" maxLength={19} value={form.card} onChange={update('card')} />
                </fieldset>
                <div className="grid grid-cols-2 gap-4">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Expiry</legend>
                    <input required className="input input-bordered font-mono" placeholder="MM/YY" maxLength={5} />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">CVV</legend>
                    <input required className="input input-bordered font-mono" placeholder="123" maxLength={4} />
                  </fieldset>
                </div>
                <div className="card-actions justify-between pt-2">
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                  <button type="submit" className="btn btn-success">Place Order — ${total.toFixed(2)}</button>
                </div>
                <p className="text-xs text-center text-base-content/40">
                  Fires <kbd className="kbd kbd-sm">AddPaymentInfo</kbd> + <kbd className="kbd kbd-sm">Purchase</kbd> on submit
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="card card-bordered bg-base-200 sticky top-20">
          <div className="card-body gap-3">
            <h2 className="card-title text-base">Order Summary</h2>
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm text-base-content/70">
                <span className="truncate mr-2">{i.title} × {i.qty}</span>
                <span className="shrink-0">${((i.sale_price || i.price) * i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="divider my-0" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

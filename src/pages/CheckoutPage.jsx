import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { generateEventId, trackPageView, trackAddPaymentInfo, trackPurchase, trackPurchasePortableEspressoMaker } from '../utils/pixel'

export default function CheckoutPage() {
  const { items, total, dispatch } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0) // 0 = shipping, 1 = payment
  const [form, setForm] = useState({ name: '', email: '', address: '', card: '' })

  useEffect(() => { trackPageView({ eventID: generateEventId() }) }, [])

  if (items.length === 0) { navigate('/'); return null }

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function handleInfoSubmit(e) {
    e.preventDefault()
    setStep(1)
  }

  function handlePaymentSubmit(e) {
    e.preventDefault()
    const contentIds = items.map((i) => i.id)
    const numItems = items.reduce((s, i) => s + i.qty, 0)
    trackAddPaymentInfo({ content_ids: contentIds, value: total, eventID: generateEventId() })
    trackPurchase({ content_ids: contentIds, num_items: numItems, value: total, eventID: generateEventId() })
    trackPurchasePortableEspressoMaker({ content_ids: contentIds, num_items: numItems, value: total, eventID: generateEventId() })
    dispatch({ type: 'CLEAR' })
    navigate('/order-success')
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Steps */}
      <ul className="steps w-full mb-8">
        <li className={`step ${step >= 0 ? 'step-primary' : ''}`}>Shipping</li>
        <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Payment</li>
        <li className="step">Confirmation</li>
      </ul>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 0 && (
            <form onSubmit={handleInfoSubmit} className="card bg-base-200 border border-base-300">
              <div className="card-body gap-4">
                <h2 className="card-title">Shipping Information</h2>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Full Name</legend>
                  <input required className="input w-full border border-base-300 focus:outline-none focus:border-primary" placeholder="Jane Doe" value={form.name} onChange={update('name')} />
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Email</legend>
                  <input required type="email" className="input w-full border border-base-300 focus:outline-none focus:border-primary" placeholder="jane@example.com" value={form.email} onChange={update('email')} />
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Shipping Address</legend>
                  <input required className="input w-full border border-base-300 focus:outline-none focus:border-primary" placeholder="123 Main St, City, Country" value={form.address} onChange={update('address')} />
                </fieldset>
                <div className="card-actions justify-end pt-2">
                  <button type="submit" className="btn btn-primary">Continue to Payment →</button>
                </div>
              </div>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handlePaymentSubmit} className="card bg-base-200 border border-base-300">
              <div className="card-body gap-4">
                <h2 className="card-title">Payment Details</h2>
                <div className="alert alert-info text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="size-5 shrink-0 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  This is a test checkout — no real charge will occur.
                </div>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Card Number</legend>
                  <input required className="input w-full font-mono border border-base-300 focus:outline-none focus:border-primary" placeholder="4242 4242 4242 4242" maxLength={19} value={form.card} onChange={update('card')} />
                </fieldset>
                <div className="grid grid-cols-2 gap-4">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Expiry</legend>
                    <input required className="input font-mono border border-base-300 focus:outline-none focus:border-primary" placeholder="MM/YY" maxLength={5} />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">CVV</legend>
                    <input required className="input font-mono border border-base-300 focus:outline-none focus:border-primary" placeholder="123" maxLength={4} />
                  </fieldset>
                </div>
                <div className="card-actions justify-between pt-2">
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>← Back</button>
                  <button type="submit" className="btn btn-success">
                    Place Order — ${total.toFixed(2)}
                  </button>
                </div>
                <p className="text-xs text-center text-base-content/40">
                  Fires <code className="bg-base-300 px-1 rounded">AddPaymentInfo</code> + <code className="bg-base-300 px-1 rounded">Purchase</code> on submit
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Summary */}
        <div className="card bg-base-200 border border-base-300 sticky top-20">
          <div className="card-body gap-3">
            <h2 className="card-title text-base">Order Summary</h2>
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm text-base-content/70">
                <span className="truncate mr-2">{i.name} × {i.qty}</span>
                <span className="shrink-0">${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="divider my-0" />
            <div className="flex justify-between font-bold">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

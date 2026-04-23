import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { generateEventId, trackPageView, trackInitiateCheckout } from '../utils/pixel'

export default function CartPage() {
  const { items, total, dispatch } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    trackPageView({ eventID: generateEventId() })
  }, [])

  function handleCheckout() {
    const eventID = generateEventId()
    trackInitiateCheckout({
      content_ids: items.map((i) => i.id),
      num_items: items.reduce((s, i) => s + i.qty, 0),
      value: total,
      eventID,
    })
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <main className="p-6 flex flex-col items-center gap-6 pt-24">
        <div className="text-6xl">🛒</div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.id} className="card bg-base-200 border border-base-300 flex-row">
              <figure className="w-24 shrink-0">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-l-2xl" />
              </figure>
              <div className="card-body p-4 gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/product/${item.id}`}
                      className="font-semibold hover:text-primary transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                    <div className="badge badge-outline badge-xs mt-1">{item.category}</div>
                  </div>
                  <button
                    className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-error"
                    onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="join">
                    <button
                      className="btn btn-xs btn-outline join-item"
                      onClick={() =>
                        item.qty > 1
                          ? dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 })
                          : dispatch({ type: 'REMOVE', id: item.id })
                      }
                    >
                      −
                    </button>
                    <span className="btn btn-xs btn-outline join-item no-animation pointer-events-none">
                      {item.qty}
                    </span>
                    <button
                      className="btn btn-xs btn-outline join-item"
                      onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })}
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="card bg-base-200 border border-base-300 sticky top-20">
          <div className="card-body gap-4">
            <h2 className="card-title text-base">Order Summary</h2>
            <div className="flex justify-between text-sm text-base-content/60">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-base-content/60">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <div className="divider my-0" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary w-full" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <p className="text-xs text-center text-base-content/40">
              Fires <code className="bg-base-300 px-1 rounded">InitiateCheckout</code> on click
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

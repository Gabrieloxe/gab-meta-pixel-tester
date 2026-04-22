import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { trackPageView, trackInitiateCheckout } from '../utils/pixel'

export default function CartPage() {
  const { items, total, dispatch } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    trackPageView()
  }, [])

  function handleCheckout() {
    trackInitiateCheckout({
      content_ids: items.map((i) => i.id),
      num_items: items.reduce((s, i) => s + i.qty, 0),
      value: total,
    })
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <main className="page-cart empty">
        <h1>Your cart is empty</h1>
        <Link to="/" className="btn-add-cart">Continue Shopping</Link>
      </main>
    )
  }

  return (
    <main className="page-cart">
      <h1>Your Cart</h1>

      <div className="cart-layout">
        <ul className="cart-items">
          {items.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`}>{item.name}</Link>
                <span className="product-category">{item.category}</span>
              </div>
              <div className="cart-item-controls">
                <button
                  onClick={() =>
                    item.qty > 1
                      ? dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty - 1 })
                      : dispatch({ type: 'REMOVE', id: item.id })
                  }
                >
                  −
                </button>
                <span>{item.qty}</span>
                <button onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.qty + 1 })}>
                  +
                </button>
              </div>
              <span className="cart-item-price">${(item.price * item.qty).toFixed(2)}</span>
              <button className="cart-remove" onClick={() => dispatch({ type: 'REMOVE', id: item.id })}>
                ✕
              </button>
            </li>
          ))}
        </ul>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="btn-checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <p className="pixel-note">
            Fires <code>InitiateCheckout</code> on checkout click
          </p>
        </div>
      </div>
    </main>
  )
}

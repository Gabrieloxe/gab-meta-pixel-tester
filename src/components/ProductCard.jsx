import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { trackAddToCart, trackAddToWishlist } from '../utils/pixel'

export default function ProductCard({ product }) {
  const { dispatch } = useCart()
  const [wished, setWished] = useState(false)
  const discount =
    product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

  function handleAddToCart(e) {
    e.preventDefault()
    dispatch({ type: 'ADD', product })
    trackAddToCart({ content_ids: [product.id], content_name: product.name, value: product.price, quantity: 1 })
  }

  function handleWishlist(e) {
    e.preventDefault()
    setWished((w) => !w)
    trackAddToWishlist({ content_ids: [product.id], content_name: product.name, value: product.price })
  }

  const stars = Math.round(product.rating)

  return (
    <Link
      to={`/product/${product.id}`}
      className="card bg-base-200 border border-base-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
    >
      <figure className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && <span className="badge badge-error absolute top-2 left-2 font-bold">-{discount}%</span>}
        <button
          className={`btn btn-circle btn-sm absolute top-2 right-2 backdrop-blur-sm ${wished ? 'btn-error' : 'btn-ghost bg-base-100/30'}`}
          title="Add to Wishlist"
          onClick={handleWishlist}
        >
          {wished ? '♥' : '♡'}
        </button>
      </figure>

      <div className="card-body p-4 gap-2">
        <div className="badge badge-outline badge-sm">{product.category}</div>
        <h3 className="card-title text-sm font-semibold leading-snug">{product.name}</h3>

        <div className="flex items-center gap-1 text-warning text-sm">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>{i < stars ? '★' : '☆'}</span>
          ))}
          <span className="text-base-content/50 text-xs ml-1">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          {discount > 0 && (
            <span className="text-sm text-base-content/40 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        <button className="btn btn-primary btn-sm w-full" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </Link>
  )
}

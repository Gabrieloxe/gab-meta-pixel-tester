import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { trackViewContent, trackAddToCart, trackAddToWishlist } from '../utils/pixel'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dispatch, items } = useCart()
  const product = products.find((p) => p.id === id)

  useEffect(() => {
    if (!product) return
    trackViewContent({ content_ids: [product.id], content_name: product.name, content_type: 'product', value: product.price })
  }, [product])

  if (!product) {
    return (
      <main className="p-6">
        <div className="alert alert-warning max-w-sm">
          Product not found.
          <button className="btn btn-sm btn-ghost" onClick={() => navigate('/')}>Go back</button>
        </div>
      </main>
    )
  }

  const inCart = items.some((i) => i.id === product.id)
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0
  const stars = Math.round(product.rating)

  function handleAddToCart() {
    dispatch({ type: 'ADD', product })
    trackAddToCart({ content_ids: [product.id], content_name: product.name, value: product.price, quantity: 1 })
  }

  function handleWishlist() {
    trackAddToWishlist({ content_ids: [product.id], content_name: product.name, value: product.price })
  }

  function handleBuyNow() {
    dispatch({ type: 'ADD', product })
    trackAddToCart({ content_ids: [product.id], content_name: product.name, value: product.price, quantity: 1 })
    navigate('/cart')
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <button className="btn btn-ghost btn-sm mb-6" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {discount > 0 && (
            <span className="badge badge-error absolute top-3 left-3 font-bold text-sm px-3 py-1">-{discount}%</span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="badge badge-outline">{product.category}</div>
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-1 text-warning">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>{i < stars ? '★' : '☆'}</span>
            ))}
            <span className="text-sm text-base-content/50 ml-2">
              {product.rating} ({product.reviews.toLocaleString()} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold">${product.price.toFixed(2)}</span>
            {discount > 0 && (
              <span className="text-lg text-base-content/40 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="text-base-content/70 leading-relaxed">{product.description}</p>

          {product.stock <= 10 && (
            <div className="badge badge-warning gap-1">
              Only {product.stock} left in stock
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary flex-1" onClick={handleAddToCart}>
              {inCart ? 'Add More to Cart' : 'Add to Cart'}
            </button>
            <button className="btn btn-success flex-1" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="btn btn-ghost btn-outline" onClick={handleWishlist}>
              ♡ Wishlist
            </button>
          </div>

          {/* Pixel event reference */}
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body p-4 gap-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-base-content/40">Events fired on this page</h4>
              <ul className="flex flex-col gap-1">
                {[
                  ['ViewContent', 'on page load'],
                  ['AddToCart', 'on Add to Cart / Buy Now'],
                  ['AddToWishlist', 'on Wishlist button'],
                ].map(([ev, when]) => (
                  <li key={ev} className="text-sm text-base-content/60">
                    <span className="badge badge-outline badge-xs mr-2">{ev}</span>{when}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

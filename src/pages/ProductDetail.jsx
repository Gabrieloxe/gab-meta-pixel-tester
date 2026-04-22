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
    trackViewContent({
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
    })
  }, [product])

  if (!product) {
    return (
      <main className="page-detail">
        <p>Product not found. <button onClick={() => navigate('/')}>Go back</button></p>
      </main>
    )
  }

  const inCart = items.some((i) => i.id === product.id)
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  function handleAddToCart() {
    dispatch({ type: 'ADD', product })
    trackAddToCart({
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      quantity: 1,
    })
  }

  function handleWishlist() {
    trackAddToWishlist({
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
    })
  }

  function handleBuyNow() {
    dispatch({ type: 'ADD', product })
    trackAddToCart({
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      quantity: 1,
    })
    navigate('/cart')
  }

  return (
    <main className="page-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-layout">
        <div className="detail-img-wrap">
          <img src={product.image} alt={product.name} />
          {discount > 0 && <span className="badge-discount large">-{discount}%</span>}
        </div>

        <div className="detail-info">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="product-rating">
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            <span>{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
          </div>

          <div className="detail-price">
            <span className="price-current large">${product.price.toFixed(2)}</span>
            {discount > 0 && (
              <span className="price-original">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <p className="detail-description">{product.description}</p>

          <p className="stock-info">
            {product.stock <= 10
              ? `Only ${product.stock} left in stock!`
              : 'In stock'}
          </p>

          <div className="detail-actions">
            <button className="btn-add-cart large" onClick={handleAddToCart}>
              {inCart ? 'Add More to Cart' : 'Add to Cart'}
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="btn-wishlist-text" onClick={handleWishlist}>
              ♡ Add to Wishlist
            </button>
          </div>

          <div className="pixel-events-fired">
            <h4>Events fired on this page</h4>
            <ul>
              <li><code>ViewContent</code> — fired on page load</li>
              <li><code>AddToCart</code> — fired on "Add to Cart" / "Buy Now"</li>
              <li><code>AddToWishlist</code> — fired on "Add to Wishlist"</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

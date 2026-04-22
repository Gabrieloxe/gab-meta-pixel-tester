import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { trackAddToCart, trackAddToWishlist } from '../utils/pixel'

export default function ProductCard({ product }) {
  const { dispatch } = useCart()
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  function handleAddToCart(e) {
    e.preventDefault()
    dispatch({ type: 'ADD', product })
    trackAddToCart({
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      quantity: 1,
    })
  }

  function handleWishlist(e) {
    e.preventDefault()
    trackAddToWishlist({
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
    })
    // Visual feedback via CSS class toggle
    e.currentTarget.classList.toggle('wished')
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {discount > 0 && <span className="badge-discount">-{discount}%</span>}
        <button className="btn-wishlist" title="Add to Wishlist" onClick={handleWishlist}>
          ♡
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
          <span>{product.rating} ({product.reviews.toLocaleString()})</span>
        </div>
        <div className="product-price">
          <span className="price-current">${product.price.toFixed(2)}</span>
          {discount > 0 && (
            <span className="price-original">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <button className="btn-add-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </Link>
  )
}

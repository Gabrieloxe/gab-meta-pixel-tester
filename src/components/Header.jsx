import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { trackSearch } from '../utils/pixel'

export default function Header() {
  const { count } = useCart()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    trackSearch({ search_string: query.trim() })
    navigate(`/?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          PixelShop
          <span className="logo-badge">Meta Pixel Tester</span>
        </Link>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <nav className="header-nav">
          <Link to="/">Shop</Link>
          <Link to="/cart" className="cart-link">
            Cart
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}

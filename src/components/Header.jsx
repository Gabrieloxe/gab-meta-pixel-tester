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
    <header className="navbar bg-base-200/90 backdrop-blur-md border-b border-base-300 sticky top-0 z-50 px-4 gap-4">
      <div className="navbar-start">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">PixelShop</span>
          <span className="badge badge-primary badge-sm font-semibold">Meta Pixel Tester</span>
        </Link>
      </div>

      <div className="navbar-center flex-1 max-w-md">
        <form className="join w-full" onSubmit={handleSearch}>
          <input
            className="input input-bordered join-item w-full"
            type="text"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary join-item">
            Search
          </button>
        </form>
      </div>

      <div className="navbar-end gap-2">
        <Link to="/" className="btn btn-ghost btn-sm">Shop</Link>
        <Link to="/cart" className="btn btn-ghost btn-sm indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 7h11.8M9 20a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
          {count > 0 && (
            <span className="indicator-item badge badge-error badge-sm">{count}</span>
          )}
        </Link>
      </div>
    </header>
  )
}

import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { generateEventId, trackSearch } from '../utils/pixel'

export const Header = () => {
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    setQuery(searchParams.get('search') || '')
  }, [searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    const term = query.trim()
    if (!term) {
      if (location.pathname === '/') {
        setSearchParams((prev) => {
          prev.delete('search')
          return prev
        })
      }
      return
    }
    const event_id = generateEventId()
    trackSearch({ search_string: term, event_id })
    if (location.pathname === '/') {
      setSearchParams((prev) => {
        prev.set('search', term)
        return prev
      })
    } else {
      navigate(`/?search=${encodeURIComponent(term)}`)
    }
  }

  return (
    <header className="navbar bg-base-200/90 backdrop-blur-md border-b border-base-300 sticky top-0 z-50">
      <div className="navbar-start">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">PixelShop</span>
          <span className="badge badge-primary badge-sm font-semibold hidden sm:inline-flex">Meta Pixel Tester</span>
        </Link>
      </div>

      <div className="navbar-center">
        <form className="join" onSubmit={handleSearch}>
          <input
            className="input input-bordered join-item w-64"
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
        <Link to="/" className="btn btn-ghost btn-sm">
          Shop
        </Link>
        <Link to="/cart" className="btn btn-ghost btn-sm indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 7h11.8M9 20a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
          </svg>
          {count > 0 && <span className="indicator-item badge badge-error badge-sm">{count}</span>}
        </Link>
      </div>
    </header>
  )
}

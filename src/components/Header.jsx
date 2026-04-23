import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { generateEventId, trackSearch } from '../utils/pixel'

export default function Header() {
  const { count } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') || '')

  // Keep input in sync with URL when the search param changes
  useEffect(() => {
    setQuery(searchParams.get('search') || '')
  }, [searchParams])

  function handleSearch(e) {
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
    const eventID = generateEventId()
    trackSearch({ search_string: term, eventID })
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
    <header className="navbar bg-base-200/90 backdrop-blur-md border-b border-base-300 sticky top-0 z-50 px-4 gap-4">
      <div className="navbar-start shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">PixelShop</span>
          <span className="badge badge-primary badge-sm font-semibold hidden sm:inline-flex">Meta Pixel Tester</span>
        </Link>
      </div>

      <div className="flex-1 flex justify-center px-4">
        <form className="flex w-full max-w-md" onSubmit={handleSearch}>
          <input
            className="flex-1 h-12 px-4 rounded-l-lg bg-base-100 border border-base-300 border-r-0 text-sm placeholder:text-base-content/40 focus:outline-none focus:border-primary"
            type="text"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary rounded-l-none h-12 min-h-12">
            Search
          </button>
        </form>
      </div>

      <div className="navbar-end shrink-0 gap-2">
        <Link to="/" className="btn btn-ghost btn-sm">
          Shop
        </Link>
        <Link to="/cart" className="btn btn-ghost btn-sm indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 7h11.8M9 20a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z"
            />
          </svg>
          {count > 0 && <span className="indicator-item badge badge-error badge-sm">{count}</span>}
        </Link>
      </div>
    </header>
  )
}

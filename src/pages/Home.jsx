import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import { trackPageView } from '../utils/pixel'

const CATEGORIES = ['All', ...new Set(products.map((p) => p.category))]

export default function Home() {
  const [params, setParams] = useSearchParams()
  const search = params.get('search') || ''
  const category = params.get('category') || 'All'

  useEffect(() => {
    trackPageView()
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === 'All' || p.category === category
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    })
  }, [search, category])

  function setCategory(cat) {
    setParams(cat === 'All' ? {} : { category: cat })
  }

  return (
    <main className="page-home">
      <section className="hero">
        <h1>Test Every Meta Pixel Event</h1>
        <p>Browse, wishlist, add to cart, and purchase to fire real Pixel events in your browser.</p>
      </section>

      <div className="filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
        {search && (
          <span className="search-tag">
            Results for "{search}"
            <button onClick={() => setParams({})}>✕</button>
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="empty-msg">No products found.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  )
}

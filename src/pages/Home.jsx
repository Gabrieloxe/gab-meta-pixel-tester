import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { generateEventId, trackPageView } from '../utils/pixel'

export const Home = () => {
  const { products, loading } = useProducts()
  const [params, setParams] = useSearchParams()
  const search = params.get('search') || ''
  const category = params.get('category') || 'All'

  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.product_type))], [products])

  useEffect(() => {
    trackPageView({ event_id: generateEventId() })
  }, [])

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        const matchCat = category === 'All' || p.product_type === category
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
      }),
    [products, search, category],
  )

  const setCategory = (cat) => {
    setParams(cat === 'All' ? {} : { category: cat })
  }

  if (loading) {
    return (
      <main className="p-6 max-w-6xl mx-auto flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </main>
    )
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="hero bg-base-200 rounded-2xl mb-8">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Test Every Meta Pixel Event
            </h1>
            <p className="text-base-content/60 mt-2 max-w-lg mx-auto">
              Browse, wishlist, add to cart, and purchase to fire real Pixel events live in your browser.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`btn btn-sm rounded-full ${category === cat ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
        {search && (
          <div className="badge badge-outline gap-2 py-3 px-3">
            "{search}"
            <button className="btn btn-ghost btn-xs btn-circle" onClick={() => setParams({})}>
              ✕
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-base-content/40 py-20">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  )
}

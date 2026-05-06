import { useState, useEffect } from 'react'

let cache = null

export function useProducts() {
  const [products, setProducts] = useState(cache || [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) return
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        cache = data
        setProducts(data)
      })
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}

import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const products = require('../src/data/products.json')

const COLUMNS = ['id', 'title', 'description', 'availability', 'condition', 'price', 'sale_price', 'currency', 'link', 'image_link', 'brand', 'product_type', 'rating', 'reviews', 'stock']

const escapeCSV = (value) => {
  if (value == null) return ''
  const str = String(value)
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str
}

export default (_req, res) => {
  const header = COLUMNS.join(',')
  const rows = products.map((p) =>
    COLUMNS.map((col) => escapeCSV(p[col])).join(',')
  )

  const csv = [header, ...rows].join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="products.csv"')
  res.status(200).send(csv)
}

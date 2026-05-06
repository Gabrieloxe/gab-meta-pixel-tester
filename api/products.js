import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const products = require('../src/data/products.json')

export default (_req, res) => {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.status(200).json(products)
}

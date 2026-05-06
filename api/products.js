import { products } from '../src/data/products.js'

export default (_req, res) => {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.status(200).json(products)
}

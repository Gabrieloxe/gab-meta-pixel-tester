import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { PixelProvider } from './context/PixelContext'
import Header from './components/Header'
import PixelEventLog from './components/PixelEventLog'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccess from './pages/OrderSuccess'

export default function App() {
  return (
    <BrowserRouter>
      <PixelProvider>
        <CartProvider>
          <div className="app-layout">
            <Header />
            <div className="app-body">
              <div className="main-area">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                </Routes>
              </div>
              <PixelEventLog />
            </div>
          </div>
        </CartProvider>
      </PixelProvider>
    </BrowserRouter>
  )
}

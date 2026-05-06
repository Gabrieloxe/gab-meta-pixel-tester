import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { PixelProvider } from './context/PixelContext'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { ProductDetail } from './pages/ProductDetail'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderSuccess } from './pages/OrderSuccess'

export const App = () => (
  <BrowserRouter>
    <PixelProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
        </div>
      </CartProvider>
    </PixelProvider>
  </BrowserRouter>
)

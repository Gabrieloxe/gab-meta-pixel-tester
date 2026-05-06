import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find((i) => i.id === action.product.id)
      if (existing) {
        return state.map((i) => (i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...state, { ...action.product, qty: 1 }]
    }
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'UPDATE_QTY':
      return state.map((i) => (i.id === action.id ? { ...i, qty: action.qty } : i))
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, [])

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return <CartContext.Provider value={{ items, total, count, dispatch }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)

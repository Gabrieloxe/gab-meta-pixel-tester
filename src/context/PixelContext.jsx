import { createContext, useContext, useState } from 'react'
import { initPixel } from '../utils/pixel'

const PixelContext = createContext(null)

export const PixelProvider = ({ children }) => {
  const [pixelId, setPixelIdState] = useState(() => {
    const id = localStorage.getItem('pixelId') || import.meta.env.VITE_META_PIXEL_ID || ''
    if (id) initPixel(id)
    return id
  })
  const [initialized, setInitialized] = useState(() => !!pixelId)

  const applyPixelId = (id) => {
    const trimmed = id.trim()
    setPixelIdState(trimmed)
    localStorage.setItem('pixelId', trimmed)
    if (trimmed) {
      window._pixelInitialized = false
      initPixel(trimmed)
      setInitialized(true)
    } else {
      setInitialized(false)
    }
  }

  return <PixelContext.Provider value={{ pixelId, applyPixelId, initialized }}>{children}</PixelContext.Provider>
}

export const usePixel = () => useContext(PixelContext)

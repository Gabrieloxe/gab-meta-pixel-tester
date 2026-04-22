import { createContext, useContext, useEffect, useState } from 'react'
import { initPixel, subscribeEventLog, eventLog, trackPageView } from '../utils/pixel'

const PixelContext = createContext(null)

export function PixelProvider({ children }) {
  const [pixelId, setPixelIdState] = useState(
    () => localStorage.getItem('pixelId') || import.meta.env.VITE_PIXEL_ID || ''
  )
  const [initialized, setInitialized] = useState(false)
  const [log, setLog] = useState([...eventLog])

  useEffect(() => {
    const unsub = subscribeEventLog(setLog)
    return unsub
  }, [])

  function applyPixelId(id) {
    const trimmed = id.trim()
    setPixelIdState(trimmed)
    localStorage.setItem('pixelId', trimmed)
    if (trimmed) {
      window._pixelInitialized = false
      initPixel(trimmed)
      trackPageView()
      setInitialized(true)
    } else {
      setInitialized(false)
    }
  }

  useEffect(() => {
    if (pixelId) {
      initPixel(pixelId)
      trackPageView()
      setInitialized(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PixelContext.Provider value={{ pixelId, applyPixelId, initialized, log }}>
      {children}
    </PixelContext.Provider>
  )
}

export function usePixel() {
  return useContext(PixelContext)
}

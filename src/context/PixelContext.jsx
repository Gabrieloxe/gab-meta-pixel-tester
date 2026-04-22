import { createContext, useContext, useEffect, useState } from 'react'
import { initPixel, subscribeEventLog, eventLog } from '../utils/pixel'

const PixelContext = createContext(null)

export function PixelProvider({ children }) {
  const [pixelId, setPixelIdState] = useState(() => {
    const id = localStorage.getItem('pixelId') || import.meta.env.VITE_PIXEL_ID || ''
    if (id) initPixel(id)
    return id
  })
  const [initialized, setInitialized] = useState(() => !!pixelId)
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
      setInitialized(true)
    } else {
      setInitialized(false)
    }
  }

  return (
    <PixelContext.Provider value={{ pixelId, applyPixelId, initialized, log }}>
      {children}
    </PixelContext.Provider>
  )
}

export function usePixel() {
  return useContext(PixelContext)
}

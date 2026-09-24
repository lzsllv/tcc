import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/PageTransition.css'

export default function PageTransition({ children }) {
  const location = useLocation()
  const [visible, setVisible] = useState(true)
  const prevKey = useRef(location.key)

  useEffect(() => {
    if (location.key === prevKey.current) return
    prevKey.current = location.key

    setVisible(false)
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [location.key])

  return (
    <div className={`page-transition ${visible ? 'page-transition--visible' : 'page-transition--hidden'}`}>
      {children}
    </div>
  )
}

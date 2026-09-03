import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/PageTransition.css'

/**
 * PageTransition — fade suave entre rotas
 * Envolva o <Routes> com este componente em App.jsx:
 *
 *   <PageTransition>
 *     <Routes> ... </Routes>
 *   </PageTransition>
 */
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

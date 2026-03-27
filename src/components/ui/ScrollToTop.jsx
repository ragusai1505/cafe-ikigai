import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-24 z-40 w-10 h-10 rounded-full bg-coffee-800 hover:bg-coffee-600 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
      aria-label="Scroll to top"
      style={{ animation: 'fadeIn 0.3s ease' }}
    >
      <ChevronUp size={18} />
    </button>
  )
}

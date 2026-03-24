import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Coffee, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
      transparent ? 'bg-transparent' : 'bg-white/96 backdrop-blur-md shadow-sm border-b border-coffee-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-coffee-gradient flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <Coffee size={16} className="text-amber-100" />
            </div>
            <div className="leading-none">
              <div className={`font-display text-lg font-bold leading-tight transition-colors ${transparent ? 'text-white' : 'text-coffee-900'}`}>
                Cafe Ikigai
              </div>
              <div className={`text-[10px] font-mono tracking-[0.2em] uppercase transition-colors ${transparent ? 'text-amber-200/80' : 'text-coffee-400'}`}>
                Kondapur · Hyd
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to} className={`relative text-sm font-medium tracking-wide transition-colors group ${
                  transparent
                    ? active ? 'text-amber-300' : 'text-white/90 hover:text-white'
                    : active ? 'text-coffee-600' : 'text-coffee-700 hover:text-coffee-500'
                }`}>
                  {label}
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-coffee-400 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              )
            })}

            {isAdmin ? (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/admin" className="flex items-center gap-1.5 bg-coffee-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-coffee-700 transition-colors shadow-sm">
                  <ShieldCheck size={14} /> Dashboard
                </Link>
                <button onClick={logout} className={`text-sm transition-colors ${transparent ? 'text-white/60 hover:text-white' : 'text-coffee-400 hover:text-coffee-600'}`}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login" className={`ml-2 text-sm font-medium px-4 py-1.5 rounded-full border transition-all ${
                transparent
                  ? 'border-white/30 text-white/80 hover:bg-white/10 hover:border-white/50'
                  : 'border-coffee-200 text-coffee-600 hover:bg-coffee-50 hover:border-coffee-400'
              }`}>
                Admin
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'text-coffee-800 hover:bg-coffee-50'}`}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-coffee-100 shadow-xl animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === to ? 'bg-coffee-50 text-coffee-700' : 'text-coffee-800 hover:bg-coffee-50'
              }`}>
                {label}
              </Link>
            ))}
            <div className="border-t border-coffee-100 mt-2 pt-2">
              {isAdmin ? (
                <>
                  <Link to="/admin" className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium bg-coffee-600 text-white mb-1">
                    <ShieldCheck size={14} /> Admin Dashboard
                  </Link>
                  <button onClick={logout} className="py-2.5 px-4 text-sm text-coffee-400 w-full text-left">Logout</button>
                </>
              ) : (
                <Link to="/admin/login" className="py-2.5 px-4 rounded-xl text-sm font-medium border border-coffee-200 text-coffee-600 block text-center">
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

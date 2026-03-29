import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShieldCheck } from 'lucide-react'
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
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setOpen(false), [location.pathname])

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent
        ? 'bg-transparent'
        : 'bg-white shadow-sm border-b border-blush-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src="/logo.png" alt="Café Ikigai"
              className={`h-10 md:h-12 w-auto object-contain transition-all group-hover:scale-105 ${transparent ? '' : ''}`}
              style={transparent ? {filter:'brightness(0) invert(1)'} : {}} />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link key={to} to={to}
                  className={`relative text-sm font-medium tracking-wide transition-colors group ${
                    transparent
                      ? active ? 'text-blush-200' : 'text-white/85 hover:text-white'
                      : active ? 'text-brand-600' : 'text-brand-700 hover:text-brand-500'
                  }`}>
                  {label}
                  <span className={`absolute -bottom-0.5 left-0 h-0.5 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    style={{background: transparent ? 'rgba(242,196,206,0.8)' : '#8B3A52'}} />
                </Link>
              )
            })}

            {isAdmin ? (
              <div className="flex items-center gap-3 ml-1">
                <Link to="/admin"
                  className="flex items-center gap-1.5 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm"
                  style={{background:'#8B3A52'}}>
                  <ShieldCheck size={14} /> Dashboard
                </Link>
                <button onClick={logout}
                  className={`text-sm transition-colors ${transparent ? 'text-white/60 hover:text-white' : 'text-brand-400 hover:text-brand-600'}`}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/admin/login"
                className={`ml-1 text-sm font-medium px-4 py-1.5 rounded-full border transition-all ${
                  transparent
                    ? 'border-white/25 text-white/80 hover:bg-white/10'
                    : 'border-brand-300 text-brand-600 hover:bg-blush-50'
                }`}>
                Admin
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-brand-800'}`}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-blush-100 shadow-xl animate-fade-in">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            <div className="flex justify-center mb-3 pb-3 border-b border-blush-100">
              <img src="/logo.png" alt="Café Ikigai" className="h-10 w-auto" />
            </div>
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === to ? 'text-brand-700' : 'text-brand-800 hover:text-brand-600'
                }`}
                style={location.pathname === to ? {background:'#fdf0f3'} : {}}>
                {label}
              </Link>
            ))}
            <div className="border-t border-blush-100 mt-2 pt-2">
              {isAdmin ? (
                <>
                  <Link to="/admin" className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-white mb-1" style={{background:'#8B3A52'}}>
                    <ShieldCheck size={14} /> Admin Dashboard
                  </Link>
                  <button onClick={logout} className="py-2.5 px-4 text-sm text-brand-400 w-full text-left">Logout</button>
                </>
              ) : (
                <Link to="/admin/login" className="py-2.5 px-4 rounded-xl text-sm font-medium border border-brand-200 text-brand-600 block text-center">
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

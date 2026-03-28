import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Plus, LogOut, ExternalLink, ShieldCheck, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/add', icon: Plus, label: 'Add Item' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <div className="min-h-screen bg-blush-50 flex" style={{background:'#fdf4f6'}}>
      <aside className="w-60 bg-white border-r border-blush-100 flex flex-col fixed left-0 top-0 bottom-0 z-40 shadow-sm">
        <div className="p-6 border-b border-blush-100">
          <Link to="/" className="block mb-3">
            <img src="/logo.png" alt="Café Ikigai" className="h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-1.5 bg-blush-50 rounded-lg px-3 py-1.5">
            <ShieldCheck size={12} className="text-brand-500" />
            <span className="text-brand-500 text-xs font-mono">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label, exact }) => (
            <Link key={to} to={to}
              className={`admin-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(to, exact) ? 'active' : 'text-brand-600'}`}>
              <Icon size={17} /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-blush-100 space-y-2">
          <div className="px-3 py-2">
            <div className="text-xs font-mono text-brand-400 truncate">{user?.email}</div>
          </div>
          <a href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-500 hover:bg-blush-50 w-full transition-colors">
            <ExternalLink size={15} /> View Site
          </a>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 w-full transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 ml-60">{children}</div>
    </div>
  )
}

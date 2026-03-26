import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Plus, Coffee, LogOut, ExternalLink, ShieldCheck, Settings } from 'lucide-react'
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
    <div className="min-h-screen bg-coffee-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-coffee-100 flex flex-col fixed left-0 top-0 bottom-0 z-40 shadow-sm">
        {/* Brand */}
        <div className="p-6 border-b border-coffee-100">
          <Link to="/" className="flex items-center gap-2.5 group mb-1">
            <div className="w-8 h-8 rounded-full bg-coffee-gradient flex items-center justify-center">
              <Coffee size={14} className="text-amber-100" />
            </div>
            <span className="font-display text-base font-bold text-coffee-900">Cafe Ikigai</span>
          </Link>
          <div className="flex items-center gap-1.5 mt-3 bg-coffee-50 rounded-lg px-3 py-1.5">
            <ShieldCheck size={12} className="text-coffee-500" />
            <span className="text-coffee-500 text-[11px] font-mono">Admin Panel</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label, exact }) => (
            <Link key={to} to={to}
              className={`admin-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${isActive(to, exact) ? 'active text-coffee-600' : 'text-coffee-600'}`}>
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User + actions */}
        <div className="p-4 border-t border-coffee-100 space-y-2">
          <div className="px-3 py-2">
            <div className="text-xs font-mono text-coffee-400 truncate">{user?.email}</div>
          </div>
          <Link to="/" target="_blank"
            className="admin-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-coffee-500 w-full">
            <ExternalLink size={15} /> View Site
          </Link>
          <button onClick={handleLogout}
            className="admin-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 w-full transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-60">
        {children}
      </div>
    </div>
  )
}

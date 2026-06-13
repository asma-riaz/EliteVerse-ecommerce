// src/components/layout/AdminSidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Package, Tag, ShoppingBag, Users, LogOut, ShoppingCart } from 'lucide-react'

const links = [
  { to: '/admin',          label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products',   icon: Package },
  { to: '/admin/orders',   label: 'Orders',     icon: ShoppingBag },
  { to: '/admin/customers',label: 'Customers',  icon: Users },
]

export default function AdminSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="w-60 min-h-screen bg-stone-900 text-stone-300 flex flex-col">
      <div className="p-5 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <ShoppingCart size={16} className="text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-base"> EliteVerse</span>
            <p className="text-xs text-stone-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-stone-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive ? 'bg-orange-500 text-white font-semibold' : 'hover:bg-stone-800 hover:text-white'
              }`}>
            <Icon size={17} />{label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-stone-800">
        <NavLink to="/" className="flex items-center gap-2 px-3 py-2 text-sm text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg mb-1">
          Back to Store
        </NavLink>
        <button onClick={() => { logout(); navigate('/') }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition-all">
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  )
}

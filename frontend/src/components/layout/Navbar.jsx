// src/components/layout/Navbar.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { ShoppingBag, Search, User, Menu, X, Heart, LogOut, LayoutDashboard, Package } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [userMenu, setUserMenu] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) { navigate(`/products?search=${search}`); setSearch('') }
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-stone-900">EliteVerse</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-sm font-medium text-stone-600 hover:text-orange-500 transition-colors">All Products</Link>
            <Link to="/products?category=electronics" className="text-sm font-medium text-stone-600 hover:text-orange-500 transition-colors">Electronics</Link>
            <Link to="/products?category=fashion" className="text-sm font-medium text-stone-600 hover:text-orange-500 transition-colors">Fashion</Link>
            <Link to="/products?category=home-living" className="text-sm font-medium text-stone-600 hover:text-orange-500 transition-colors">Home</Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xs mx-6">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                className="input pl-9 py-2 text-sm" />
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors">
              <ShoppingBag size={20} className="text-stone-700" />
              {cart.count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cart.count > 9 ? '9+' : cart.count}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist" className="p-2 rounded-xl hover:bg-stone-100 transition-colors hidden sm:block">
                <Heart size={20} className="text-stone-700" />
              </Link>
            )}

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors">
                  <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-stone-700 max-w-[80px] truncate">{user.name}</span>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-stone-100 py-1 z-50">
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
                      <Package size={15} /> My Orders
                    </Link>
                    <Link to="/profile" onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50">
                      <User size={15} /> Profile
                    </Link>
                    <hr className="my-1 border-stone-100" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-stone-100">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 py-4 space-y-3 fade-up">
            <form onSubmit={handleSearch} className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                className="input pl-9 py-2 text-sm" />
            </form>
            {['/', '/products', '/products?category=electronics', '/products?category=fashion'].map((path, i) => (
              <Link key={i} to={path} onClick={() => setMenuOpen(false)}
                className="block text-sm font-medium text-stone-600 hover:text-orange-500 py-1">
                {['Home', 'All Products', 'Electronics', 'Fashion'][i]}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-ghost flex-1 text-center">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

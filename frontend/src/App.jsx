// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public pages
import Home          from './pages/Home'
import Products      from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login         from './pages/Login'
import Register      from './pages/Register'

// Customer pages
import Cart      from './pages/Cart'
import Checkout  from './pages/Checkout'
import Orders    from './pages/Orders'
import Wishlist  from './pages/Wishlist'
import Profile   from './pages/Profile'

// Admin pages
import AdminDashboard  from './pages/admin/Dashboard'
import AdminProducts   from './pages/admin/AdminProducts'
import AdminOrders     from './pages/admin/AdminOrders'
import AdminCustomers  from './pages/admin/AdminCustomers'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: '12px', fontSize: '14px' } }} />
          <Routes>
            {/* Public */}
            <Route path="/"              element={<Home />} />
            <Route path="/products"      element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />

            {/* Protected - Customer */}
            <Route path="/cart"     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders"   element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Protected - Admin */}
            <Route path="/admin"           element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products"  element={<ProtectedRoute role="admin"><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/orders"    element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute role="admin"><AdminCustomers /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

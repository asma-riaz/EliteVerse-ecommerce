// src/pages/Wishlist.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import api from '../utils/api'
import { formatPrice } from '../utils/helpers'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  const fetchWishlist = () => {
    api.get('/orders/wishlist.php').then(r => {
      setItems(r.data)
      setLoading(false)
    })
  }

  useEffect(() => { fetchWishlist() }, [])

  const removeFromWishlist = async (productId) => {
    await api.delete(`/orders/wishlist.php?product_id=${productId}`)
    toast.success('Removed from wishlist')
    fetchWishlist()
  }

  const moveToCart = async (productId) => {
    const ok = await addToCart(productId)
    if (ok) { toast.success('Moved to cart!'); removeFromWishlist(productId) }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-display font-bold text-stone-900 mb-6 flex items-center gap-2">
          <Heart size={24} className="text-red-500 fill-red-500" /> My Wishlist ({items.length})
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="card animate-pulse aspect-square" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="card p-16 text-center text-stone-400">
            <Heart size={48} className="mx-auto mb-4 opacity-20" />
            <h2 className="text-lg font-display font-bold text-stone-900 mb-2">Your wishlist is empty</h2>
            <Link to="/products" className="btn-primary mt-2 inline-block">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className="card overflow-hidden group product-card">
                <div className="relative aspect-square bg-stone-50">
                  <Link to={`/product/${item.slug}`}>
                    <img src={item.image_url} alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <button onClick={() => removeFromWishlist(item.product_id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-3">
                  <Link to={`/product/${item.slug}`}>
                    <p className="text-sm font-semibold text-stone-800 line-clamp-2 mb-2">{item.name}</p>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-500 text-sm">{formatPrice(item.sale_price || item.price)}</span>
                    <button onClick={() => moveToCart(item.product_id)}
                      className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors">
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

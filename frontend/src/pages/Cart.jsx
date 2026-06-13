// src/pages/Cart.jsx
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/helpers'
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react'

export default function Cart() {
  const { cart, updateQty, removeItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const shipping = cart.subtotal > 5000 ? 0 : 150
  const total = cart.subtotal + shipping

  if (!user) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-24 text-stone-400">
        <ShoppingBag size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-medium">Please login to view your cart</p>
        <Link to="/login" className="btn-primary mt-4">Login</Link>
      </div>
      <Footer />
    </div>
  )

  if (cart.items.length === 0) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-24 text-stone-400">
        <ShoppingBag size={56} className="mb-4 opacity-20" />
        <h2 className="text-xl font-display font-bold text-stone-900 mb-2">Your cart is empty</h2>
        <p className="text-sm mb-6">Start shopping to add items to your cart</p>
        <Link to="/products" className="btn-primary flex items-center gap-2">Browse Products <ArrowRight size={16} /></Link>
      </div>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-display font-bold text-stone-900 mb-6">Shopping Cart ({cart.count} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.items.map(item => (
              <div key={item.id} className="card p-4 flex gap-4 items-center">
                <Link to={`/product/${item.id}`}>
                  <img src={item.image_url} alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-stone-50 flex-shrink-0" />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 text-sm line-clamp-2">{item.name}</p>
                  <p className="text-orange-500 font-bold mt-1">{formatPrice(item.sale_price || item.price)}</p>
                  {item.sale_price && <p className="text-xs text-stone-400 line-through">{formatPrice(item.price)}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}
                    className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 text-stone-600">
                    <Minus size={13} />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, Math.min(item.stock, item.quantity + 1))}
                    className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 text-stone-600">
                    <Plus size={13} />
                  </button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="font-bold text-stone-900 text-sm">{formatPrice((item.sale_price || item.price) * item.quantity)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 mt-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card p-5 h-fit sticky top-24">
            <h2 className="font-display font-bold text-stone-900 text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between"><span className="text-stone-500">Subtotal</span><span className="font-medium">{formatPrice(cart.subtotal)}</span></div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              {cart.subtotal < 5000 && (
                <p className="text-xs text-stone-400 bg-orange-50 px-3 py-2 rounded-lg">
                  Add {formatPrice(5000 - cart.subtotal)} more for free shipping!
                </p>
              )}
              <div className="border-t border-stone-100 pt-3 flex justify-between font-display font-bold text-stone-900 text-base">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <Link to="/products" className="btn-ghost w-full text-center mt-2 block">Continue Shopping</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

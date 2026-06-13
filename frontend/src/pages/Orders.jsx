// src/pages/Orders.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import api from '../utils/api'
import { formatPrice, orderStatusColor } from '../utils/helpers'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/orders/index.php').then(r => {
      setOrders(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const loadItems = async (orderId) => {
    if (expanded === orderId) { setExpanded(null); return }
    const { data } = await api.get(`/orders/index.php?id=${orderId}`)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, items: data.items } : o))
    setExpanded(orderId)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-display font-bold text-stone-900 mb-6">My Orders</h1>

        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card p-5 animate-pulse h-24" />)}</div>
        ) : orders.length === 0 ? (
          <div className="card p-16 text-center text-stone-400">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <h2 className="text-lg font-display font-bold text-stone-900 mb-2">No orders yet</h2>
            <p className="text-sm mb-4">You haven't placed any orders. Start shopping!</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="card overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-bold text-stone-900 text-sm">{order.order_number}</p>
                      <span className={orderStatusColor(order.status)}>{order.status}</span>
                    </div>
                    <p className="text-xs text-stone-400">{new Date(order.created_at).toLocaleDateString('en-PK', { dateStyle: 'medium' })}</p>
                    <p className="text-xs text-stone-500 mt-1">Payment: <span className="capitalize">{order.payment_method?.toUpperCase()}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-stone-900">{formatPrice(order.total_amount)}</p>
                    <p className="text-xs text-stone-400 mb-2">incl. shipping</p>
                    <button onClick={() => loadItems(order.id)}
                      className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium ml-auto">
                      {expanded === order.id ? <><ChevronUp size={14} />Hide Items</> : <><ChevronDown size={14} />View Items</>}
                    </button>
                  </div>
                </div>

                {expanded === order.id && order.items && (
                  <div className="border-t border-stone-100 p-5 bg-stone-50 space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.product_image} alt={item.product_name}
                          className="w-12 h-12 object-cover rounded-xl bg-white" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-stone-800">{item.product_name}</p>
                          <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-stone-900">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-stone-200 text-xs text-stone-500">
                      <p> Shipping to: {order.shipping_address}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

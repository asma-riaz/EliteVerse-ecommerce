// src/pages/admin/AdminOrders.jsx
import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/layout/AdminSidebar'
import api from '../../utils/api'
import { formatPrice, orderStatusColor } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

const statuses = ['pending','processing','shipped','delivered','cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    const { data } = await api.get('/orders/index.php')
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

const loadItems = async (orderId) => {
    if (expanded === orderId) { setExpanded(null); return }
    const { data } = await api.get(`/orders/index.php?id=${orderId}`)
    const items = data?.items || []
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, items } : o))
    setExpanded(orderId)
}

  const updateStatus = async (id, status) => {
    try {
      await api.put('/orders/index.php', { id, status })
      toast.success('Order status updated')
      fetchOrders()
    } catch { toast.error('Failed to update') }
  }

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter
    const matchSearch = o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
                        o.customer_name?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-stone-900">Orders</h1>
          <p className="text-stone-400 text-sm mt-1">{orders.length} total orders</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
              className="input pl-9 py-2 text-sm w-56" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', ...statuses].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${filter === s ? 'bg-orange-500 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card p-5 animate-pulse h-16" />)}</div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {['Order','Customer','Date','Total','Payment','Status','Update'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map(o => (
                  <>
                    <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-stone-900 text-xs">{o.order_number}</p>
                        <button onClick={() => loadItems(o.id)} className="text-orange-500 hover:text-orange-600 text-xs flex items-center gap-1 mt-0.5">
                          {expanded === o.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Items
                        </button>
                      </td>
                      <td className="px-4 py-3 text-stone-700">{o.customer_name}</td>
                      <td className="px-4 py-3 text-stone-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-bold text-stone-900">{formatPrice(o.total_amount)}</td>
                      <td className="px-4 py-3 text-stone-500 text-xs uppercase">{o.payment_method}</td>
                      <td className="px-4 py-3"><span className={orderStatusColor(o.status)}>{o.status}</span></td>
                      <td className="px-4 py-3">
                        <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                          className="text-xs border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400">
                          {statuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                      </td>
                    </tr>
                    {expanded === o.id && o.items && (
                      <tr key={`${o.id}-items`}>
                        <td colSpan={7} className="px-4 py-3 bg-orange-50">
                          <div className="space-y-2">
                            {o.items.map(item => (
                              <div key={item.id} className="flex items-center gap-3 text-sm">
                                <img src={item.product_image} alt={item.product_name} className="w-8 h-8 object-cover rounded-lg" />
                                <span className="font-medium text-stone-800">{item.product_name}</span>
                                <span className="text-stone-400">x{item.quantity}</span>
                                <span className="text-stone-700 font-semibold">{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                            <p className="text-xs text-stone-500 mt-1"> {o.shipping_address}</p>
                            {o.payment_method === 'card' && o.card_details && (() => {
                                const card = typeof o.card_details === 'string'
                                ? JSON.parse(o.card_details)
                                : o.card_details
                              return (
                                  <div className="mt-2 text-xs text-stone-600 bg-white rounded-lg p-2 border border-orange-100 space-y-0.5">
                                    <p className="font-semibold text-stone-700">Card Details</p>
                                    <p>Name: {card.card_name}</p>
                                    <p>Number: {card.card_number}</p>
                                    <p>Expiry: {card.expiry}</p>
                                  </div>
                              )
                            })()}
                                  </div>
                        </td>
                      </tr>
                    )}  
                  </>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-stone-400">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

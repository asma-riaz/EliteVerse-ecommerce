// src/pages/admin/AdminCustomers.jsx
import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/layout/AdminSidebar'
import api from '../../utils/api'
import { Search, Users } from 'lucide-react'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch users who are customers via dashboard stats approach
    api.get('/admin/dashboard.php').then(() => {
      // We'll list from a direct query via orders to infer customers
      setLoading(false)
    })
    // Use the auth endpoint to get customers
    api.get('/patients/get_all.php').catch(() => {})
    // Actually call our own endpoint
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      // We re-use the admin dashboard but extract unique customers from orders
      const { data } = await api.get('/orders/index.php')
      // Extract unique customers from orders
      const seen = new Set()
      const unique = []
      data.forEach(o => {
        if (!seen.has(o.customer_name)) {
          seen.add(o.customer_name)
          unique.push({ name: o.customer_name, orders: data.filter(x => x.customer_name === o.customer_name).length })
        }
      })
      setCustomers(unique)
      setLoading(false)
    } catch { setLoading(false) }
  }

  const filtered = customers.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-stone-900">Customers</h1>
            <p className="text-stone-400 text-sm mt-1">{customers.length} customers found</p>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
              className="input pl-9 py-2 text-sm w-56" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="card p-5 animate-pulse h-24" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center text-stone-400">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">No customers yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((c, i) => (
              <div key={i} className="card p-5">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg font-display mb-3">
                  {c.name?.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold text-stone-900 truncate">{c.name}</p>
                <p className="text-xs text-stone-400 mt-1">{c.orders} order{c.orders !== 1 ? 's' : ''}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// src/pages/admin/Dashboard.jsx
import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/layout/AdminSidebar'
import api from '../../utils/api'
import { formatPrice, orderStatusColor } from '../../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, Clock } from 'lucide-react'

const COLORS = ['#f59e0b','#3b82f6','#8b5cf6','#10b981','#ef4444']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard.php').then(r => {
      setData(r.data)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    </div>
  )

  const statCards = [
    { label: 'Total Revenue',   value: formatPrice(data.stats.total_revenue),  icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Total Orders',    value: data.stats.total_orders,                 icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { label: 'Customers',       value: data.stats.total_customers,              icon: Users,       color: 'bg-purple-100 text-purple-600' },
    { label: 'Active Products', value: data.stats.total_products,               icon: Package,     color: 'bg-orange-100 text-orange-600' },
    { label: 'Pending Orders',  value: data.stats.pending_orders,               icon: Clock,       color: 'bg-amber-100 text-amber-600' },
    { label: 'Low Stock Items', value: data.stats.low_stock,                    icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
  ]

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-stone-900">Dashboard</h1>
            <p className="text-stone-400 text-sm mt-1">EliteVerse store overview</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {statCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card p-5">
                <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-display font-bold text-stone-900">{value}</p>
                <p className="text-xs text-stone-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <div className="card p-5">
              <h3 className="font-display font-bold text-stone-900 mb-4">Monthly Revenue</h3>
              {data.monthly.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.monthly}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => formatPrice(v)} />
                    <Bar dataKey="revenue" fill="#f97316" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-stone-400 text-sm py-10 text-center">No data yet</p>}
            </div>

            <div className="card p-5">
              <h3 className="font-display font-bold text-stone-900 mb-4">Orders by Status</h3>
              {data.byStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data.byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={75} label>
                      {data.byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-stone-400 text-sm py-10 text-center">No orders yet</p>}
            </div>
          </div>

          {/* Top Products + Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="card p-5">
              <h3 className="font-display font-bold text-stone-900 mb-4">Top Selling Products</h3>
              <div className="space-y-3">
                {data.topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-stone-50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{p.name}</p>
                      <p className="text-xs text-stone-400">{p.sold} sold</p>
                    </div>
                    <p className="text-sm font-bold text-stone-900">{formatPrice(p.revenue)}</p>
                  </div>
                ))}
                {!data.topProducts.length && <p className="text-stone-400 text-sm">No sales yet</p>}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-display font-bold text-stone-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {data.recent.map(o => (
                  <div key={o.id} className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-stone-800">{o.order_number}</p>
                      <p className="text-xs text-stone-400">{o.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-stone-900">{formatPrice(o.total_amount)}</p>
                      <span className={orderStatusColor(o.status)}>{o.status}</span>
                    </div>
                  </div>
                ))}
                {!data.recent.length && <p className="text-stone-400 text-sm">No orders yet</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

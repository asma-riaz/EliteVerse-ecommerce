// src/pages/admin/AdminProducts.jsx
import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/layout/AdminSidebar'
import api from '../../utils/api'
import { formatPrice } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react'

const emptyForm = { name:'', category_id:'', description:'', price:'', sale_price:'', stock:'', image_url:'', featured:0, status:'active' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchAll = async () => {
    const [pRes, cRes] = await Promise.all([
      api.get('/products/manage.php'),
      api.get('/categories/index.php')
    ])
    setProducts(pRes.data)
    setCategories(cRes.data)
  }

  useEffect(() => { fetchAll() }, [])

  const openAdd = () => { setForm(emptyForm); setModal('add') }
  const openEdit = (p) => { setForm({ ...p, sale_price: p.sale_price || '' }); setModal('edit') }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal === 'add') await api.post('/products/manage.php', form)
      else await api.put('/products/manage.php', form)
      toast.success(modal === 'add' ? 'Product added!' : 'Product updated!')
      setModal(null)
      fetchAll()
    } catch (err) { toast.error(err.response?.data?.error || 'Failed') }
    setSaving(false)
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await api.delete(`/products/manage.php?id=${id}`)
      toast.success('Product deleted')
      fetchAll()
    } catch { toast.error('Failed to delete') }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-stone-900">Products</h1>
            <p className="text-stone-400 text-sm mt-1">{products.length} total products</p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="p-4 border-b border-stone-100">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                className="input pl-9 py-2 text-sm" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {['Product','Category','Price','Stock','Status','Featured','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-stone-100" />
                        <span className="font-medium text-stone-900 text-sm line-clamp-1 max-w-[180px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-500">{p.category_name}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-stone-900">{formatPrice(p.sale_price || p.price)}</p>
                      {p.sale_price && <p className="text-xs text-stone-400 line-through">{formatPrice(p.price)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${p.stock <= 5 ? 'text-red-500' : 'text-stone-700'}`}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${p.featured ? 'text-orange-500' : 'text-stone-300'}`}>{p.featured ? '★ Yes' : 'No'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-stone-400">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h2 className="font-display font-bold text-stone-900">{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={() => setModal(null)}><X size={20} className="text-stone-400" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Product Name *</label>
                  <input value={form.name} onChange={e => setForm({...form,name:e.target.value})} className="input" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Category *</label>
                  <select value={form.category_id} onChange={e => setForm({...form,category_id:e.target.value})} className="input" required>
                    <option value="">Select</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm({...form,status:e.target.value})} className="input">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Price (PKR) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form,price:e.target.value})} className="input" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Sale Price</label>
                  <input type="number" value={form.sale_price} onChange={e => setForm({...form,sale_price:e.target.value})} className="input" placeholder="Optional" />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Stock</label>
                  <input type="number" value={form.stock} onChange={e => setForm({...form,stock:e.target.value})} className="input" />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Featured</label>
                  <select value={form.featured} onChange={e => setForm({...form,featured:Number(e.target.value)})} className="input">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Image URL</label>
                  <input value={form.image_url} onChange={e => setForm({...form,image_url:e.target.value})} className="input" placeholder="https://..." />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-stone-600 mb-1 block">Description</label>
                  <textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})} className="input" rows={3} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : 'Save Product'}</button>
                <button type="button" onClick={() => setModal(null)} className="btn-outline flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

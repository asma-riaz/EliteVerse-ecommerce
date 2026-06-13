// src/pages/Profile.jsx
import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { User, Save } from 'lucide-react'

export default function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/auth/profile.php', form)
      const updated = { ...user, ...form }
      login(updated, localStorage.getItem('token'))
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-display font-bold text-stone-900 mb-6">My Profile</h1>
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-2xl font-display">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-display font-bold text-stone-900">{user?.name}</p>
              <p className="text-stone-400 text-sm">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full capitalize">{user?.role}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Email (read-only)</label>
              <input value={user?.email} className="input bg-stone-50 text-stone-400" readOnly />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input" placeholder="0300-1234567" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Save size={16} />{loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

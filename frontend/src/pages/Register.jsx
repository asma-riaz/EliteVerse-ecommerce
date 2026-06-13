// src/pages/Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { ShoppingBag } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register.php', form)
      login(data.user, data.token)
      toast.success('Account created! Welcome to EliteVerse')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-orange-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={24} className="text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white">Join EliteVerse</h1>
          <p className="text-stone-400 mt-1">Create your free account</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Full Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="input" placeholder="Your full name" required />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Email Address *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Phone Number</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="input" placeholder="0300-1234567" />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Password *</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="input" placeholder="Min 6 characters" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center text-stone-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { ShoppingBag, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login.php', form)
      login(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
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
          <h1 className="text-3xl font-display font-bold text-white">Welcome Back</h1>
          <p className="text-stone-400 mt-1">Sign in to your EliteVerse account</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-sm text-center text-stone-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

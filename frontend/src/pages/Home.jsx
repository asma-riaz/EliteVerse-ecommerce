// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/common/ProductCard'
import api from '../utils/api'
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, ChevronRight } from 'lucide-react'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products/get_all.php?featured=1&limit=8'),
      api.get('/categories/index.php')
    ]).then(([pRes, cRes]) => {
      setFeatured(pRes.data.products)
      setCategories(cRes.data.slice(0,5))
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-800 to-orange-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Elevate Your <span className="text-orange-400"> Everyday</span> 
              </h1>
              <p className="text-stone-300 text-base sm:text-lg mb-8 leading-relaxed max-w-md">
                Premium products. Trusted quality. Delivered to your doorstep.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/products" className="btn-primary text-base px-6 py-3 flex items-center gap-2">
                  Shop Now <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {featured.slice(0,3).map((p, i) => (
                <Link key={p.id} to={`/product/${p.slug}`}
                  className={`relative overflow-hidden rounded-2xl bg-stone-700/50 aspect-square group ${i === 0 ? 'col-span-2 aspect-video' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}>
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-semibold text-sm bg-black/40 backdrop-blur px-3 py-1.5 rounded-lg truncate">{p.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'On orders above PKR 5000' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{title}</p>
                  <p className="text-xs text-stone-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-stone-900">Shop by Category</h2>
          <Link to="/products" className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1 font-medium">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`}
              className="relative overflow-hidden rounded-2xl aspect-square group card">
              <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-semibold text-sm">{cat.name}</p>
                
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-stone-900">Featured Products</h2>
          <Link to="/products" className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1 font-medium">
            See All <ChevronRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse"><div className="bg-stone-100 aspect-square rounded-t-2xl" /><div className="p-4 space-y-2"><div className="h-3 bg-stone-100 rounded w-1/2" /><div className="h-4 bg-stone-100 rounded" /><div className="h-4 bg-stone-100 rounded w-1/3" /></div></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">Ready to Start Shopping?</h2>
          <p className="text-orange-100 mb-6">Create an account and get exclusive deals on your first order.</p>
          <Link to="/register" className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:shadow-lg transition-all">
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

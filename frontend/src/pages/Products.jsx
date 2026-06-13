// src/pages/Products.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/common/ProductCard'
import api from '../utils/api'
import { SlidersHorizontal, X } from 'lucide-react'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const category = searchParams.get('category') || ''
  const search   = searchParams.get('search')   || ''
  const sort     = searchParams.get('sort')      || 'newest'
  const page     = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    api.get('/categories/index.php').then(r => setCategories(r.data))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: 12 })
    if (category) params.set('category', category)
    if (search)   params.set('search', search)
    if (sort)     params.set('sort', sort)
    api.get(`/products/get_all.php?${params}`).then(r => {
      setProducts(r.data.products)
      setTotal(r.data.total)
      setTotalPages(r.data.total_pages)
      setLoading(false)
    })
  }, [category, search, sort, page])

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    p.delete('page')
    setSearchParams(p)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-stone-900">
              {search ? `Results for "${search}"` : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
            </h1>
            <p className="text-stone-400 text-sm mt-1">{total} products found</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={e => setParam('sort', e.target.value)} className="input text-sm py-2 w-36">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="sm:hidden btn-outline py-2 px-3">
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-52 flex-shrink-0`}>
            <div className="card p-4 sticky top-24">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-stone-900 text-sm">Categories</h3>
                {category && <button onClick={() => setParam('category', '')} className="text-xs text-orange-500 hover:text-orange-600">Clear</button>}
              </div>
              <ul className="space-y-1">
                <li>
                  <button onClick={() => setParam('category', '')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-orange-500 text-white font-medium' : 'text-stone-600 hover:bg-stone-50'}`}>
                    All Products
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button onClick={() => setParam('category', cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${category === cat.slug ? 'bg-orange-500 text-white font-medium' : 'text-stone-600 hover:bg-stone-50'}`}>
                      <span>{cat.name}</span>
                      
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active filters */}
            {(category || search) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search && <span className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  Search: {search} <button onClick={() => setParam('search', '')}><X size={12} /></button></span>}
                {category && <span className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs px-3 py-1.5 rounded-full font-medium capitalize">
                  {category.replace('-', ' ')} <button onClick={() => setParam('category', '')}><X size={12} /></button></span>}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="bg-stone-100 aspect-square rounded-t-2xl" />
                    <div className="p-4 space-y-2"><div className="h-3 bg-stone-100 rounded w-1/2" /><div className="h-4 bg-stone-100 rounded" /></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-stone-400">
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-1">Try a different search or category</p>
              </div>
            ) : (
              <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setParam('page', String(i+1))}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i+1 ? 'bg-orange-500 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-orange-300'}`}>
                        {i+1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

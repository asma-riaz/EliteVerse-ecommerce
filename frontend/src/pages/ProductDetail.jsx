// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/common/ProductCard'
import StarRating from '../components/common/StarRating'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { formatPrice, discount, orderStatusColor } from '../utils/helpers'
import toast from 'react-hot-toast'
import { ShoppingCart, Heart, ArrowLeft, Package, Star, ChevronRight } from 'lucide-react'

export default function ProductDetail() {
  const { slug } = useParams()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [tab, setTab] = useState('desc')
  const [review, setReview] = useState({ rating: 0, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`/products/get_single.php?slug=${slug}`).then(r => {
      setProduct(r.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  const handleAddToCart = async () => {
    if (!user) return toast.error('Please login to add to cart')
    setAdding(true)
    const ok = await addToCart(product.id, qty)
    if (ok) toast.success('Added to cart!'); else toast.error('Failed to add')
    setAdding(false)
  }

  const handleWishlist = async () => {
    if (!user) return toast.error('Please login first')
    try {
      await api.post('/orders/wishlist.php', { product_id: product.id })
      toast.success('Added to wishlist!')
    } catch { toast.error('Already in wishlist') }
  }

  const handleReview = async e => {
    e.preventDefault()
    if (!user) return toast.error('Please login to review')
    if (!review.rating) return toast.error('Please select a rating')
    setSubmittingReview(true)
    try {
      await api.post('/products/review.php', { product_id: product.id, ...review })
      toast.success('Review submitted!')
      setReview({ rating: 0, comment: '' })
      const r = await api.get(`/products/get_single.php?slug=${slug}`)
      setProduct(r.data)
    } catch { toast.error('Failed to submit review') }
    setSubmittingReview(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" /></div>
  if (!product) return <div className="min-h-screen flex items-center justify-center"><p className="text-stone-400">Product not found</p></div>

  const disc = discount(product.price, product.sale_price)
  const effectivePrice = product.sale_price || product.price

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-orange-500">Products</Link>
          <ChevronRight size={12} />
          <Link to={`/products?category=${product.category_slug}`} className="hover:text-orange-500">{product.category_name}</Link>
          <ChevronRight size={12} />
          <span className="text-stone-600 truncate max-w-[150px]">{product.name}</span>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden bg-stone-50 aspect-square">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            {disc > 0 && <span className="absolute top-4 left-4 bg-orange-500 text-white font-bold px-3 py-1 rounded-xl text-sm">-{disc}% OFF</span>}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs text-orange-500 font-semibold uppercase tracking-wider mb-2">{product.category_name}</p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={Math.round(Number(product.avg_rating))} />
              <span className="text-sm text-stone-400">({product.review_count} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-display font-bold text-stone-900">{formatPrice(effectivePrice)}</span>
              {product.sale_price && <span className="text-xl text-stone-400 line-through">{formatPrice(product.price)}</span>}
              {disc > 0 && <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-0.5 rounded-lg">Save {disc}%</span>}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <Package size={16} className={product.stock > 0 ? 'text-green-500' : 'text-red-500'} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>

            {/* Qty */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-stone-700">Quantity:</span>
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-3 py-2 hover:bg-stone-50 text-stone-600 font-bold">−</button>
                  <span className="px-4 py-2 text-sm font-semibold border-x border-stone-200">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="px-3 py-2 hover:bg-stone-50 text-stone-600 font-bold">+</button>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} disabled={adding || product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
                <ShoppingCart size={18} />
                {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button onClick={handleWishlist} className="btn-outline px-4 py-3">
                <Heart size={18} />
              </button>
            </div>

            {/* Details */}
            <div className="bg-stone-50 rounded-2xl p-4 text-sm text-stone-600 space-y-2">
              <p>Free delivery on orders above PKR 5,000</p>
              <p>Easy 30-day returns</p>
              <p>100% authentic products guaranteed</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-10">
          <div className="flex border-b border-stone-100">
            {['desc','reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-medium capitalize transition-colors ${tab === t ? 'text-orange-500 border-b-2 border-orange-500' : 'text-stone-400 hover:text-stone-700'}`}>
                {t === 'desc' ? 'Description' : `Reviews (${product.review_count})`}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab === 'desc' ? (
              <p className="text-stone-600 leading-relaxed">{product.description || 'No description available.'}</p>
            ) : (
              <div>
                {product.reviews?.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {product.reviews.map(r => (
                      <div key={r.id} className="flex gap-4 pb-4 border-b border-stone-100">
                        <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
                          {r.user_name?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-stone-800 text-sm">{r.user_name}</span>
                            <StarRating rating={r.rating} size={14} />
                          </div>
                          <p className="text-stone-600 text-sm">{r.comment}</p>
                          <p className="text-stone-400 text-xs mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-stone-400 text-sm mb-6">No reviews yet. Be the first!</p>}

                {user && (
                  <form onSubmit={handleReview} className="bg-stone-50 rounded-2xl p-5">
                    <h4 className="font-semibold text-stone-900 mb-3">Write a Review</h4>
                    <StarRating rating={review.rating} onRate={r => setReview({...review, rating: r})} />
                    <textarea value={review.comment} onChange={e => setReview({...review, comment: e.target.value})}
                      className="input mt-3" rows={3} placeholder="Share your experience..." />
                    <button type="submit" disabled={submittingReview} className="btn-primary mt-3">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {product.related?.length > 0 && (
          <div>
            <h2 className="text-xl font-display font-bold text-stone-900 mb-5">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {product.related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

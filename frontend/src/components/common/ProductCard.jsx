// src/components/common/ProductCard.jsx
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { formatPrice, discount } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const disc = discount(product.price, product.sale_price)
  const effectivePrice = product.sale_price || product.price

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to add to cart'); return }
    const ok = await addToCart(product.id)
    if (ok) toast.success('Added to cart!')
    else toast.error('Failed to add to cart')
  }

  return (
    <Link to={`/product/${product.slug}`} className="product-card card block overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden bg-stone-50 aspect-square">
        <img src={product.image_url} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image' }} />
        {disc > 0 && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{disc}%</span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-stone-500 font-semibold text-sm">Out of Stock</span>
          </div>
        )}
        <button onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-9 h-9 bg-white shadow-md rounded-full flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200">
          <ShoppingCart size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-stone-400 mb-1">{product.category_name}</p>
        <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 leading-snug mb-2">{product.name}</h3>

        {/* Rating */}
        {Number(product.avg_rating) > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-stone-500">{Number(product.avg_rating).toFixed(1)} ({product.review_count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900 text-sm">{formatPrice(effectivePrice)}</span>
          {product.sale_price && (
            <span className="text-xs text-stone-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

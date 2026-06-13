// src/components/common/StarRating.jsx
import { Star } from 'lucide-react'

export default function StarRating({ rating, onRate, size = 18 }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onRate?.(s)}
          className={`transition-colors ${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}>
          <Star size={size}
            className={s <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'} />
        </button>
      ))}
    </div>
  )
}

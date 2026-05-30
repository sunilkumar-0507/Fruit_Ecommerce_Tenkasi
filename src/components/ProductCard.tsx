import { Heart, Plus } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '#/data/products'

interface ProductCardProps extends Product {
  onAddToCart?: (id: string) => void
}

export default function ProductCard({
  id,
  name,
  nameTamil,
  category,
  price,
  originalPrice,
  image,
  typeBadge,
  rating,
  reviews,
  unit,
  onAddToCart,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-[#f5f0e8]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount badge - top left */}
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
          {discount}% OFF
        </div>

        {/* Type badge - top right */}
        {typeBadge && (
          <div className="absolute top-3 right-3 bg-white/90 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-gray-200">
            {typeBadge}
          </div>
        )}

        {/* Wishlist button - right center, visible on hover */}
        <button
          type="button"
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label={isFavorite ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
        >
          <Heart
            size={15}
            className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'}
          />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category */}
        <p className="text-[#2f6a4a] text-xs font-bold tracking-widest uppercase mb-1">
          {category}
        </p>

        {/* Product Name */}
        <h3 className="font-serif text-base font-semibold text-gray-900 leading-snug mb-0.5">
          {name}
        </h3>

        {/* Tamil Name */}
        <p className="text-gray-400 text-xs mb-2">{nameTamil}</p>

        {/* Rating + Chemical Free */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-gray-700 text-xs font-semibold">{rating}</span>
            <span className="text-gray-400 text-xs">({reviews})</span>
          </div>
          <span className="text-[#2f6a4a] text-xs font-medium bg-[#e7f3ec] px-2 py-0.5 rounded-full">
            Chemical Free
          </span>
        </div>

        {/* Price + Add Button */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-gray-900">₹{price}</span>
              <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
            </div>
            <p className="text-gray-400 text-xs">{unit}</p>
          </div>
          <button
            type="button"
            onClick={() => onAddToCart?.(id)}
            className="w-10 h-10 bg-[#2f6a4a] text-white rounded-full flex items-center justify-center hover:bg-[#1f4a2f] transition-colors shadow-md hover:shadow-lg hover:scale-110 active:scale-95 transition-transform"
            aria-label={`Add ${name} to cart`}
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Product } from '#/data/products'
import { useCart } from '#/context/CartContext'
import { useFav } from '#/context/FavContext'
import TiIcon from '#/components/TiIcon'

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
}: Product) {
  const { addToCart } = useCart()
  const { toggle, isFav } = useFav()
  const fav = isFav(id)
  const [added, setAdded] = useState(false)
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)

  function handleAdd() {
    addToCart({ id, name, nameTamil, category, image, price, unit })
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
      {/* Image — click to go to product detail */}
      <Link to="/product/$productId" params={{ productId: id }} className="no-underline block relative h-56 overflow-hidden bg-[#f5f0e8]">
        <img
          src={image}
          alt={name}
          className="product-img-enhance w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
          {discount}% OFF
        </div>
        {typeBadge && (
          <div className="absolute top-3 right-3 bg-white/90 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-gray-200">
            {typeBadge}
          </div>
        )}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggle({ id, name, nameTamil, image, price, unit, category }) }}
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-200 z-10 ${fav ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          aria-label={fav ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
        >
          <TiIcon name="heart" size={15} className={fav ? 'text-red-500' : 'text-gray-500'} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[#3d7a20] text-xs font-bold tracking-widest uppercase mb-1">{category}</p>
        <h3 className="font-serif text-base font-semibold text-gray-900 leading-snug mb-0.5">{name}</h3>
        <p className="text-gray-400 text-xs mb-2">{nameTamil}</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-gray-700 text-xs font-semibold">{rating}</span>
            <span className="text-gray-400 text-xs">({reviews})</span>
          </div>
          <span className="text-[#3d7a20] text-xs font-medium bg-[#fdf4e8] px-2 py-0.5 rounded-full">
            Chemical Free
          </span>
        </div>
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
            onClick={handleAdd}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
              added
                ? 'bg-emerald-500 scale-110'
                : 'bg-[#3d7a20] hover:bg-[#2a5a14] hover:scale-110 active:scale-95'
            }`}
            aria-label={`Add ${name} to cart`}
          >
            <TiIcon name={added ? 'check' : 'plus'} size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

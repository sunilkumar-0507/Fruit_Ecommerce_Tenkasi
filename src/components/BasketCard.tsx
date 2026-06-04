import { useCart } from '#/context/CartContext'
import type { BasketEntry } from '#/context/BasketContext'
import TiIcon from './TiIcon'

export function ImageCollage({ images, name }: { images: string[]; name: string }) {
  const imgs = images.length > 0 ? images : ['/images/categories/fruit-baskets.jpg']

  if (imgs.length === 1) {
    return (
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden">
        <img src={imgs[0]} alt={name} className="w-full h-full object-cover" />
      </div>
    )
  }
  if (imgs.length === 2) {
    return (
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden grid grid-cols-2 gap-0.5">
        {imgs.map((img, i) => (
          <img key={i} src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
        ))}
      </div>
    )
  }
  if (imgs.length === 3) {
    return (
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden grid grid-cols-2 gap-0.5">
        <img src={imgs[0]} alt={`${name} 1`} className="w-full h-full object-cover row-span-2" />
        <img src={imgs[1]} alt={`${name} 2`} className="w-full h-full object-cover" />
        <img src={imgs[2]} alt={`${name} 3`} className="w-full h-full object-cover" />
      </div>
    )
  }
  return (
    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden grid grid-cols-2 grid-rows-2 gap-0.5">
      {imgs.slice(0, 3).map((img, i) => (
        <img key={i} src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
      ))}
      <div className="relative overflow-hidden">
        <img src={imgs[3]} alt={`${name} 4`} className="w-full h-full object-cover" />
        {imgs.length > 4 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-sm">+{imgs.length - 4}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function BasketCard({ basket }: { basket: BasketEntry }) {
  const { addToCart } = useCart()

  function handleAdd() {
    addToCart({
      id: basket.id,
      name: basket.name,
      nameTamil: '',
      category: 'Fruit Baskets',
      image: basket.images[0] ?? '/images/categories/fruit-baskets.jpg',
      price: basket.price,
      unit: '1 basket',
    })
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col">
      <div className="p-3">
        <ImageCollage images={basket.images} name={basket.name} />
      </div>
      <div className="px-4 pb-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <TiIcon name="gift" size={11} className="text-[#f5821f]" />
          <span className="text-[#3d7a20] text-[10px] font-bold tracking-widest uppercase">Combo / Basket</span>
        </div>
        <h3 className="font-serif text-base font-semibold text-gray-900 leading-snug mb-1">{basket.name}</h3>
        <p className="text-gray-400 text-xs leading-relaxed mb-2 line-clamp-2">{basket.description}</p>
        <p className="text-[10px] text-gray-500 bg-[#f5f0e8] rounded-lg px-2 py-1.5 mb-3 leading-relaxed">
          <span className="font-semibold text-[#3d7a20]">Includes: </span>
          {basket.items}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xl font-bold text-gray-900">₹{basket.price}</span>
            <p className="text-gray-400 text-xs">per basket</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="w-10 h-10 rounded-full bg-[#3d7a20] hover:bg-[#2a5a14] hover:scale-110 active:scale-95 flex items-center justify-center shadow-md transition-all duration-300"
            aria-label={`Add ${basket.name} to cart`}
          >
            <TiIcon name="plus" size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

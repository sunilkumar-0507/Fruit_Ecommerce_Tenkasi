import { Link } from '@tanstack/react-router'

interface CategoryCardProps {
  name: string
  image: string
  productCount: number
}

export default function CategoryCard({ name, image, productCount }: CategoryCardProps) {
  return (
    <Link to="/shop" search={{ category: name }} className="group cursor-pointer no-underline">
      <div className="relative h-44 rounded-2xl overflow-hidden bg-[#fdf4e8] mb-3 hover:shadow-lg transition-all duration-300">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          width={300}
          height={176}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      <h3 className="font-serif text-sm font-semibold text-[#3d7a20] text-center mb-0.5">
        {name}
      </h3>
      <p className="text-xs text-gray-400 text-center">{productCount} products</p>
    </Link>
  )
}

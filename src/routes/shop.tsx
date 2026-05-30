import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import ProductCard from '#/components/ProductCard'
import { PRODUCTS, SHOP_CATEGORIES } from '#/data/products'
import { useAuthGuard } from '#/hooks/useAuthGuard'

export const Route = createFileRoute('/shop')({ component: ShopPage })

function ShopPage() {
  const user = useAuthGuard()
  const [activeCategory, setActiveCategory] = useState('All')

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f4]">
        <div className="w-10 h-10 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filtered =
    activeCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-[#faf9f4]">
      {/* Page Header */}
      <section className="bg-[#f5f0e8] px-4 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2f6a4a] text-xs font-bold tracking-widest uppercase mb-2">
            The Orchard
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            All fruits
          </h1>
          <p className="text-gray-500 max-w-xl leading-relaxed">
            From mountain hill bananas to Kabul pomegranates — every fruit traceable to a farmer we know by name.
          </p>
        </div>
      </section>

      {/* Category Filter + Sort */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-gray-200 px-4 py-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Category tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 pr-4">
            {SHOP_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#2f6a4a] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Filter */}
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0 ml-4"
          >
            <SlidersHorizontal size={16} />
            Sort &amp; Filter
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

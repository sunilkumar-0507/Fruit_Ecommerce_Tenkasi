import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import ProductCard from '#/components/ProductCard'
import { PRODUCTS, SHOP_CATEGORIES } from '#/data/products'
import type { Product } from '#/data/products'
import { useAuthGuard } from '#/hooks/useAuthGuard'
import { api, isApiMode, type ProductDto, type ProductDtoPagedResult, type CategoryDto } from '#/lib/apiClient'

export const Route = createFileRoute('/shop')({ component: ShopPage })

function mapProduct(p: ProductDto): Product {
  const primary = (p.images ?? []).find((i) => i.isPrimary) ?? (p.images ?? [])[0]
  return {
    id: p.id,
    name: p.nameEn ?? '',
    nameTamil: p.nameTa ?? '',
    category: p.category?.nameEn ?? '',
    categorySlug: p.category?.slug ?? '',
    price: p.price,
    originalPrice: p.price,
    image: primary?.url ?? '/images/products/p-mango.jpg',
    rating: p.rating ?? 4.5,
    reviews: 0,
    unit: 'per unit',
    featured: false,
  }
}

function ShopPage() {
  const user = useAuthGuard()
  const [activeCategory, setActiveCategory] = useState('All')
  const [products, setProducts] = useState<Product[]>(isApiMode() ? [] : PRODUCTS)
  const [categories, setCategories] = useState<string[]>(isApiMode() ? ['All'] : SHOP_CATEGORIES)
  const [loading, setLoading] = useState(isApiMode())
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isApiMode()) return
    setLoading(true)
    Promise.all([
      api.get<ProductDtoPagedResult>('/api/Products?PageSize=100'),
      api.get<CategoryDto[]>('/api/Categories'),
    ])
      .then(([result, cats]) => {
        setProducts((result.items ?? []).map(mapProduct))
        setCategories(['All', ...cats.map((c) => c.nameEn ?? '').filter(Boolean)])
      })
      .catch(() => setError('Failed to load products. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f4]">
        <div className="w-10 h-10 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filtered =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

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
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 pr-4">
            {categories.map((cat) => (
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
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-500">
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
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

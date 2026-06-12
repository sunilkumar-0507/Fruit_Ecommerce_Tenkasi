import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import TiIcon from '#/components/TiIcon'
import ProductCard from '#/components/ProductCard'
import { BasketCard } from '#/components/BasketCard'
import { PRODUCTS, SHOP_CATEGORIES } from '#/data/products'
import type { Product } from '#/data/products'
import { useAuthGuard } from '#/hooks/useAuthGuard'
import { useBaskets } from '#/context/BasketContext'
import { api, isApiMode, type ProductDto, type ProductDtoPagedResult } from '#/lib/apiClient'
import { extractFruitType } from '#/lib/fruitKeywords'

function isSeasonalCat(nameEn: string | null, slug: string | null) {
  return (nameEn ?? '').toLowerCase().includes('seasonal') || (slug ?? '').toLowerCase().includes('seasonal')
}

export const Route = createFileRoute('/shop')({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === 'string' ? search.category : '',
  }),
  component: ShopPage,
})

function mapProduct(p: ProductDto): Product {
  const primary = (p.images ?? []).find((i) => i.isPrimary) ?? (p.images ?? [])[0]
  return {
    id: p.id,
    slug: p.slug ?? undefined,
    name: p.nameEn ?? '',
    nameTamil: p.nameTa ?? '',
    category: p.category?.nameEn ?? '',
    categorySlug: p.category?.slug ?? '',
    price: p.price,
    originalPrice: p.originalPrice ?? p.price,
    image: primary?.url ?? '/images/products/p-mango.jpg',
    rating: p.rating ?? 4.5,
    reviews: 0,
    unit: 'per unit',
    featured: false,
  }
}

const ALL_CATEGORIES = ['All', 'Combos & Baskets', ...SHOP_CATEGORIES.filter((c) => c !== 'All')]

function ShopPage() {
  const user = useAuthGuard()
  const { baskets } = useBaskets()
  const { category: initialCategory } = Route.useSearch()
  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All')
  const [products, setProducts] = useState<Product[]>(isApiMode() ? [] : PRODUCTS)
  const [categories, setCategories] = useState<string[]>(isApiMode() ? ['All', 'Combos & Baskets'] : ALL_CATEGORIES)
  const [loading, setLoading] = useState(isApiMode())
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isApiMode()) return
    setLoading(true)
    api.get<ProductDtoPagedResult>('/api/Products?PageSize=100')
      .then((result) => {
        // Exclude seasonal-category products — those belong on /seasonal
        const mapped = (result.items ?? [])
          .filter((p) => !isSeasonalCat(p.category?.nameEn ?? null, p.category?.slug ?? null))
          .map(mapProduct)
        setProducts(mapped)
        // Build filter tabs from fruit-type keywords in product names
        const seen = new Set<string>()
        for (const p of mapped) {
          const key = extractFruitType(p.name) ?? p.category
          if (key) seen.add(key)
        }
        setCategories(['All', 'Combos & Baskets', ...Array.from(seen)])
      })
      .catch(() => setError('Failed to load products. Please refresh.'))
      .finally(() => setLoading(false))
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f4]">
        <div className="w-10 h-10 border-2 border-[#3d7a20] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const showCombos = activeCategory === 'Combos & Baskets'
  const filtered = showCombos
    ? []
    : activeCategory === 'All'
      ? products
      : products.filter((p) => (extractFruitType(p.name) ?? p.category) === activeCategory)

  return (
    <main className="min-h-screen bg-[#faf9f4]">
      {/* Page Header */}
      <section className="bg-[#f5f0e8] px-4 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#3d7a20] text-xs font-bold tracking-widest uppercase mb-2">
            The Orchard
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
            {showCombos ? 'Combos & Baskets' : 'All fruits'}
          </h1>
          <p className="text-gray-500 max-w-xl leading-relaxed">
            {showCombos
              ? 'Curated fruit combos and gift baskets — hand-assembled with the finest produce.'
              : 'From mountain hill bananas to Kabul pomegranates — every fruit traceable to a farmer we know by name.'}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-gray-200 px-4 py-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 pr-4">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 flex items-center gap-1.5 ${
                  activeCategory === cat
                    ? 'bg-[#3d7a20] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat === 'Combos & Baskets' && (
                  <TiIcon name="gift" size={13} className={activeCategory === cat ? 'text-white' : 'text-[#f5821f]'} />
                )}
                {cat}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0 ml-4"
          >
            <TiIcon name="settings" size={15} className="text-gray-500" />
            Sort &amp; Filter
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-2 border-[#3d7a20] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-500">
            <p>{error}</p>
          </div>
        ) : showCombos ? (
          baskets.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <TiIcon name="gift" size={48} className="text-gray-200 mb-4" />
              <p className="text-lg">No combos available yet.</p>
              <p className="text-sm mt-1">Check back soon or ask admin to add combos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {baskets.map((b) => (
                <BasketCard key={b.id} basket={b} />
              ))}
            </div>
          )
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

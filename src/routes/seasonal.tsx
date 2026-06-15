import { createFileRoute, Link } from '@tanstack/react-router'
import { Leaf, Zap, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import ProductCard from '#/components/ProductCard'
import { PRODUCTS } from '#/data/products'
import type { Product } from '#/data/products'
import { api, isApiMode, type ProductDto, type ProductDtoPagedResult } from '#/lib/apiClient'

export const Route = createFileRoute('/seasonal')({ component: SeasonalPage })

const SEASONS = [
  {
    name: 'Summer',
    period: 'March – June',
    icon: <Sun size={22} className="text-yellow-500" />,
    desc: 'Peak mango season. Alphonso, Banganapalli, and hill-grown varieties at their sweetest.',
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    name: 'Monsoon',
    period: 'July – September',
    icon: <Leaf size={22} className="text-emerald-500" />,
    desc: 'Jackfruit, guava, and fresh papaya flood the orchards after the first rains.',
    color: 'bg-emerald-50 border-emerald-200',
  },
  {
    name: 'Winter',
    period: 'October – February',
    icon: <Zap size={22} className="text-blue-500" />,
    desc: 'Strawberries, grapes, and pomegranates. The sweetest time of the year.',
    color: 'bg-blue-50 border-blue-200',
  },
]

function isSeasonalCat(nameEn: string | null, slug: string | null) {
  return (nameEn ?? '').toLowerCase().includes('seasonal') || (slug ?? '').toLowerCase().includes('seasonal')
}

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
    unit: 'per kg',
    featured: false,
  }
}

const DEMO_SEASONAL = PRODUCTS.filter((p) => p.seasonal || p.categorySlug === 'seasonal-fruits')

function SeasonalPage() {
  const [products, setProducts] = useState<Product[]>(isApiMode() ? [] : DEMO_SEASONAL)
  const [loading, setLoading] = useState(isApiMode())

  useEffect(() => {
    if (!isApiMode()) return
    api.get<ProductDtoPagedResult>('/api/Products?PageSize=100')
      .then((result) => {
        const seasonal = (result.items ?? [])
          .filter((p) => isSeasonalCat(p.category?.nameEn ?? null, p.category?.slug ?? null))
          .map(mapProduct)
        setProducts(seasonal)
      })
      .catch(() => setProducts(DEMO_SEASONAL))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-[#faf9f4]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0c1d2b] to-[#3d7a20] text-white px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#f5821f] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#4fb8b2] blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-[#f5821f] text-xs font-bold tracking-widest uppercase mb-3">
            The Harvest Calendar
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold mb-4">
            Seasonal Fruits
          </h1>
          <p className="text-white/80 max-w-xl mx-auto text-lg leading-relaxed">
            Nature's finest, picked at the right moment. We follow the seasons so every fruit reaches you at peak flavour.
          </p>
        </div>
      </section>

      {/* Season Cards */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {SEASONS.map((s) => (
              <div key={s.name} className={`rounded-2xl border p-6 ${s.color}`}>
                <div className="flex items-center gap-3 mb-3">
                  {s.icon}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-900">{s.name}</h3>
                    <p className="text-xs text-gray-500">{s.period}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Current Season Banner */}
          <div className="bg-[#3d7a20] rounded-3xl p-8 sm:p-12 text-white mb-14 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[#f5821f] text-xs font-bold tracking-widest uppercase mb-2">
                Now in Season
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Summer Harvest 2026</h2>
              <p className="text-white/80 max-w-lg">
                Mangoes, watermelons, and fresh pineapples from the Tenkasi foothills — harvested daily at sunrise.
              </p>
            </div>
            <Link
              to="/shop"
              className="flex-shrink-0 bg-[#f5821f] text-[#0c1d2b] px-8 py-3 rounded-full font-bold hover:bg-[#f59a2e] transition-colors no-underline whitespace-nowrap"
            >
              Shop Now
            </Link>
          </div>

          {/* Seasonal Products */}
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-serif text-3xl font-bold text-gray-900">
              In season right now
            </h2>
            {!loading && products.length > 0 && (
              <p className="text-sm text-gray-400">{products.length} product{products.length !== 1 ? 's' : ''}</p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-2 border-[#3d7a20] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No seasonal products right now.</p>
              <p className="text-sm mt-1 mb-6">The admin can mark products as seasonal from the admin panel.</p>
              <Link
                to="/shop"
                className="inline-block bg-[#3d7a20] text-white px-6 py-2.5 rounded-full text-sm font-semibold no-underline hover:bg-[#2a5a14] transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Harvest Alerts CTA */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
            Never miss a harvest
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Get notified when your favourite seasonal fruit is in stock.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] transition-colors"
            />
            <button
              type="button"
              className="px-5 py-3 bg-[#3d7a20] text-white rounded-xl text-sm font-semibold hover:bg-[#2a5a14] transition-colors"
            >
              Alert me
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { Gift, Star, Truck } from 'lucide-react'
import ProductCard from '#/components/ProductCard'
import { PRODUCTS } from '#/data/products'
import { useAuthGuard } from '#/hooks/useAuthGuard'

export const Route = createFileRoute('/baskets')({ component: BasketsPage })

const OCCASIONS = [
  { label: 'Pongal', emoji: '🌾' },
  { label: 'Diwali', emoji: '🪔' },
  { label: 'Onam', emoji: '🌸' },
  { label: 'Wedding', emoji: '💍' },
  { label: 'Corporate', emoji: '🏢' },
  { label: 'Birthday', emoji: '🎂' },
]

const FEATURES = [
  {
    icon: <Gift size={24} className="text-[#2f6a4a]" />,
    title: 'Hand-arranged',
    desc: 'Each basket is hand-assembled by our team with care and attention to detail.',
  },
  {
    icon: <Star size={24} className="text-[#2f6a4a]" />,
    title: 'Premium selection',
    desc: 'Only the finest, ripest fruits hand-picked from trusted farmers make it in.',
  },
  {
    icon: <Truck size={24} className="text-[#2f6a4a]" />,
    title: 'Same-day delivery',
    desc: 'Order by noon for same-day delivery wrapped in traditional banana leaves.',
  },
]

const basketProducts = PRODUCTS.filter((p) => p.isBasket)
const addOnProducts = PRODUCTS.filter((p) => p.categorySlug === 'dry-fruits')

function BasketsPage() {
  const user = useAuthGuard()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f4]">
        <div className="w-10 h-10 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf9f4]">
      {/* Hero */}
      <section className="bg-[#f5f0e8] px-4 py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[#2f6a4a] text-xs font-bold tracking-widest uppercase mb-3">
              Festival &amp; Gift Baskets
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-gray-900 mb-4">
              Give the gift<br />of freshness
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
              Curated fruit hampers for every occasion — wrapped in banana leaves and tied with raffia, the Tenkasi way.
            </p>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <span
                  key={o.label}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700 hover:border-[#2f6a4a] hover:text-[#2f6a4a] transition-colors cursor-pointer"
                >
                  <span>{o.emoji}</span>
                  {o.label}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-square max-w-sm mx-auto shadow-xl">
              <img
                src="/images/categories/fruit-baskets.jpg"
                alt="Fruit basket"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#2f6a4a] text-white px-4 py-3 rounded-2xl shadow-lg">
              <p className="text-xs font-bold text-[#d4af37] tracking-wide">FREE DELIVERY</p>
              <p className="text-sm font-semibold">On orders above ₹999</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-11 h-11 bg-[#e7f3ec] rounded-xl flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{f.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Basket Products */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Our Baskets</h2>
          <p className="text-gray-500 mb-8">Curated for every occasion and budget</p>

          {basketProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
              {basketProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
              {PRODUCTS.slice(6, 9).map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}

          {/* Custom Basket CTA */}
          <div className="bg-gradient-to-r from-[#2f6a4a] to-[#4fb8b2] rounded-3xl p-10 text-white text-center mb-14">
            <h2 className="font-serif text-3xl font-bold mb-3">Build Your Own Basket</h2>
            <p className="text-white/80 max-w-md mx-auto mb-6 text-sm leading-relaxed">
              Choose your fruits, select the size, add a personalised message. We'll take care of the rest.
            </p>
            <button
              type="button"
              className="bg-white text-[#2f6a4a] px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Customise Basket
            </button>
          </div>

          {/* Add-on dry fruits */}
          {addOnProducts.length > 0 && (
            <>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                Add dry fruits to your basket
              </h2>
              <p className="text-gray-500 mb-6 text-sm">Premium dry fruits — perfect alongside any basket</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {addOnProducts.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Bulk Orders */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Bulk &amp; Corporate Orders</h2>
          <p className="text-gray-500 text-sm mb-6">
            Ordering 20+ baskets? We offer custom branding, volume pricing, and dedicated delivery slots.
          </p>
          <Link
            to="/shop"
            className="inline-block border-2 border-[#2f6a4a] text-[#2f6a4a] px-8 py-3 rounded-full font-semibold hover:bg-[#2f6a4a] hover:text-white transition-colors no-underline"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  )
}

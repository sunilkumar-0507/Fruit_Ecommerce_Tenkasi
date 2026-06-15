import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import TiIcon from '#/components/TiIcon'
import { BasketCard } from '#/components/BasketCard'
import { useBaskets } from '#/context/BasketContext'
import { useCart } from '#/context/CartContext'
import { PRODUCTS } from '#/data/products'
import type { Product } from '#/data/products'

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
    icon: <TiIcon name="gift" size={24} className="text-[#3d7a20]" />,
    title: 'Hand-arranged',
    desc: 'Each basket is hand-assembled by our team with care and attention to detail.',
  },
  {
    icon: <TiIcon name="star" size={24} className="text-[#3d7a20]" />,
    title: 'Premium selection',
    desc: 'Only the finest, ripest fruits hand-picked from trusted farmers make it in.',
  },
  {
    icon: <TiIcon name="truck" size={24} className="text-[#3d7a20]" />,
    title: 'Fast delivery',
    desc: 'Quick delivery wrapped in traditional banana leaves, fresh to your door.',
  },
]

// ─── Custom Basket Builder Modal ─────────────────────────────────────────────

function CustomBasketModal({ onClose }: { onClose: () => void }) {
  const { addToCart } = useCart()
  const [selected, setSelected] = useState<Record<string, number>>({})

  function increment(p: Product) {
    setSelected((prev) => ({ ...prev, [p.id]: (prev[p.id] || 0) + 1 }))
  }

  function decrement(p: Product) {
    setSelected((prev) => {
      const next = { ...prev }
      if ((next[p.id] || 0) <= 1) delete next[p.id]
      else next[p.id] = next[p.id] - 1
      return next
    })
  }

  const selectedItems = PRODUCTS.filter((p) => (selected[p.id] || 0) > 0)
  const total = selectedItems.reduce((sum, p) => sum + p.price * selected[p.id], 0)

  function handleAddToCart() {
    selectedItems.forEach((p) => {
      const qty = selected[p.id]
      for (let i = 0; i < qty; i++) {
        addToCart({ id: p.id, name: p.name, nameTamil: p.nameTamil, category: p.category, image: p.image, price: p.price, unit: p.unit })
      }
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-4xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900">Build Your Basket</h2>
            <p className="text-gray-400 text-sm">Select fruits and quantities for your custom hamper</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition" aria-label="Close">
            <TiIcon name="close" size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Product grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRODUCTS.map((p) => {
                const qty = selected[p.id] || 0
                return (
                  <div
                    key={p.id}
                    className={`rounded-xl border p-3 transition-all ${qty > 0 ? 'border-[#3d7a20] bg-[#f0f9f4]' : 'border-gray-100 bg-white'}`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-xs font-semibold text-gray-900 leading-tight mb-0.5 truncate">{p.name}</h4>
                    <p className="text-[#3d7a20] text-xs font-bold mb-2">
                      ₹{p.price}<span className="text-gray-400 font-normal"> /{p.unit}</span>
                    </p>
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => increment(p)}
                        className="w-full py-1.5 rounded-lg bg-[#3d7a20] text-white text-xs font-bold hover:bg-[#2a5a14] transition"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center justify-between gap-1">
                        <button
                          type="button"
                          onClick={() => decrement(p)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                          aria-label="Decrease"
                        >
                          <TiIcon name="minus" size={11} className="text-gray-700" />
                        </button>
                        <span className="text-sm font-bold text-[#3d7a20] min-w-[1.5rem] text-center">{qty}</span>
                        <button
                          type="button"
                          onClick={() => increment(p)}
                          className="w-7 h-7 rounded-lg bg-[#3d7a20] hover:bg-[#2a5a14] flex items-center justify-center transition"
                          aria-label="Increase"
                        >
                          <TiIcon name="plus" size={11} className="text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary sidebar — desktop only */}
          {selectedItems.length > 0 && (
            <div className="hidden sm:flex flex-col w-64 border-l border-gray-100 flex-shrink-0">
              <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Your basket
                  <span className="ml-1.5 bg-[#fdf4e8] text-[#3d7a20] text-xs font-bold px-2 py-0.5 rounded-full">{selectedItems.length}</span>
                </h3>
              </div>
              <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {selectedItems.map((p) => (
                  <li key={p.id} className="flex items-center gap-2.5 px-4 py-2.5">
                    <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-gray-400">× {selected[p.id]}</p>
                    </div>
                    <p className="text-xs font-bold text-[#3d7a20] flex-shrink-0">₹{p.price * selected[p.id]}</p>
                  </li>
                ))}
              </ul>
              <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-base font-bold text-gray-900">₹{total}</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#3d7a20] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#2a5a14] transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile bottom bar */}
        <div className={`sm:hidden border-t border-gray-100 p-4 flex-shrink-0 ${selectedItems.length === 0 ? 'hidden' : 'flex'} items-center gap-3`}>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected</p>
            <p className="text-xs text-gray-400">Total: <span className="font-bold text-[#3d7a20]">₹{total}</span></p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-[#3d7a20] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2a5a14] transition flex-shrink-0"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function BasketsPage() {
  const { baskets } = useBaskets()
  const [showCustomModal, setShowCustomModal] = useState(false)

  return (
    <main className="min-h-screen bg-[#faf9f4]">
      {/* Hero */}
      <section className="bg-[#f5f0e8] px-4 py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[#3d7a20] text-xs font-bold tracking-widest uppercase mb-3">
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
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-700 hover:border-[#3d7a20] hover:text-[#3d7a20] transition-colors cursor-pointer"
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
            <div className="absolute -bottom-4 -left-4 bg-[#3d7a20] text-white px-4 py-3 rounded-2xl shadow-lg">
              <p className="text-xs font-bold text-[#f5821f] tracking-wide">FREE DELIVERY</p>
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
              <div className="w-11 h-11 bg-[#fdf4e8] rounded-xl flex items-center justify-center flex-shrink-0">
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

      {/* Basket Products from context */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Our Baskets</h2>
          <p className="text-gray-500 mb-8">Curated for every occasion and budget</p>

          {baskets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
              {baskets.map((b) => (
                <BasketCard key={b.id} basket={b} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400 mb-14">
              <TiIcon name="gift" size={48} className="text-gray-200 mb-3" />
              <p>No baskets available yet. Check back soon!</p>
            </div>
          )}

          {/* Custom Basket CTA */}
          <div className="bg-gradient-to-r from-[#3d7a20] to-[#4fb8b2] rounded-3xl p-10 text-white text-center mb-14">
            <h2 className="font-serif text-3xl font-bold mb-3">Build Your Own Basket</h2>
            <p className="text-white/80 max-w-md mx-auto mb-6 text-sm leading-relaxed">
              Pick fruits you love, set the quantities, and we'll pack it fresh. Your custom basket, your way.
            </p>
            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="bg-white text-[#3d7a20] px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Customise Basket
            </button>
          </div>
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
            className="inline-block border-2 border-[#3d7a20] text-[#3d7a20] px-8 py-3 rounded-full font-semibold hover:bg-[#3d7a20] hover:text-white transition-colors no-underline"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Custom Basket Modal */}
      {showCustomModal && <CustomBasketModal onClose={() => setShowCustomModal(false)} />}
    </main>
  )
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useAuthGuard } from '#/hooks/useAuthGuard'
import { useCart } from '#/context/CartContext'

export const Route = createFileRoute('/cart')({ component: CartPage })

const DELIVERY_FEE = 49

function CartPage() {
  const user = useAuthGuard()
  const { items, updateQty, removeItem } = useCart()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f4]">
        <div className="w-10 h-10 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const total = subtotal + DELIVERY_FEE

  return (
    <main className="min-h-screen bg-[#faf9f4]">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-1">
            Your basket
          </h1>
          <p className="text-[#2f6a4a] text-sm font-medium">
            {items.length} item{items.length !== 1 ? 's' : ''} · wrapped in banana leaf
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🛒</p>
            <p className="text-gray-400 text-lg mb-6">Your basket is empty.</p>
            <Link
              to="/shop"
              className="inline-block bg-[#2f6a4a] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1f4a2f] transition-colors no-underline"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm border border-gray-100">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5f0e8]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#2f6a4a] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-0.5">{item.category}</p>
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-gray-400 text-xs">{item.unit}</p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 rounded-full px-2 sm:px-3 py-1.5 flex-shrink-0">
                    <button type="button" onClick={() => updateQty(item.id, -1)} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors" aria-label="Decrease quantity">
                      <Minus size={13} />
                    </button>
                    <span className="text-sm font-semibold text-gray-800 w-4 sm:w-5 text-center">{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.id, 1)} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors" aria-label="Increase quantity">
                      <Plus size={13} />
                    </button>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-gray-900 w-14 sm:w-16 text-right flex-shrink-0">₹{item.price * item.qty}</p>
                  <button type="button" onClick={() => removeItem(item.id)} className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0" aria-label={`Remove ${item.name}`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-28">
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-5">Order summary</h2>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-gray-900">₹{DELIVERY_FEE}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Banana leaf wrap</span>
                    <span className="text-[#2f6a4a] font-medium">Complimentary</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">₹{total}</span>
                  </div>
                </div>
                <button type="button" className="w-full bg-[#2f6a4a] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1f4a2f] transition-colors">
                  Proceed to Checkout
                </button>
                <Link to="/shop" className="block text-center mt-4 text-sm text-[#2f6a4a] font-medium hover:underline no-underline">
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Trash2, Plus, Minus, X, MapPin, ChevronLeft,
  Check, Package, ShoppingBag,
} from 'lucide-react'
import { useAuthGuard } from '#/hooks/useAuthGuard'
import { useCart } from '#/context/CartContext'
import { useOrders, type Address } from '#/context/OrderContext'
import { useAuth } from '#/context/AuthContext'

export const Route = createFileRoute('/cart')({ component: CartPage })

const DELIVERY_FEE = 49

const STATES = [
  'Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana',
  'Maharashtra', 'Delhi', 'Gujarat', 'Rajasthan', 'West Bengal', 'Other',
]

// ─── Checkout modal ──────────────────────────────────────────────────────────

type CheckoutStep = 'address' | 'add-address' | 'confirm' | 'success'

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
        selected ? 'border-[#2f6a4a]' : 'border-gray-300'
      }`}
    >
      {selected && <div className="w-2 h-2 rounded-full bg-[#2f6a4a]" />}
    </div>
  )
}

function AddressCard({ address, selected, onSelect }: {
  address: Address
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected ? 'border-[#2f6a4a] bg-[#f0f8f4]' : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <RadioDot selected={selected} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <p className="font-semibold text-gray-900 text-sm">{address.name}</p>
            {address.isDefault && (
              <span className="text-[10px] font-bold bg-[#2f6a4a] text-white px-2 py-0.5 rounded-full tracking-wide">
                DEFAULT
              </span>
            )}
          </div>
          <p className="text-gray-500 text-xs mb-1">{address.phone}</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ''}
            {', '}{address.city}, {address.state} — {address.pincode}
          </p>
        </div>
      </div>
    </button>
  )
}

function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { addresses, addAddress, placeOrder } = useOrders()
  const { items, clearCart } = useCart()
  const { user } = useAuth()

  const [step, setStep] = useState<CheckoutStep>(
    addresses.length > 0 ? 'address' : 'add-address',
  )
  const [selectedAddr, setSelectedAddr] = useState<Address | null>(
    addresses.find((a) => a.isDefault) ?? addresses[0] ?? null,
  )
  const [orderId, setOrderId] = useState('')

  const emptyForm = {
    name: user?.name ?? '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    pincode: '',
    state: 'Tamil Nadu',
    isDefault: addresses.length === 0,
  }
  const [form, setForm] = useState(emptyForm)

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + DELIVERY_FEE

  function setF(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }))
  }

  function handleSaveAddress() {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.pincode) return
    const saved = addAddress(form)
    setSelectedAddr(saved)
    setStep('confirm')
  }

  function handlePlaceOrder() {
    if (!selectedAddr || !user) return
    const order = placeOrder({
      items,
      address: selectedAddr,
      subtotal,
      delivery: DELIVERY_FEE,
      total,
      customerName: user.name,
      customerEmail: user.email,
    })
    setOrderId(order.id)
    clearCart()
    setStep('success')
  }

  const formValid = form.name && form.phone && form.line1 && form.city && form.pincode

  const STEP_TITLE: Record<CheckoutStep, string> = {
    address: 'Select delivery address',
    'add-address': 'Add new address',
    confirm: 'Order summary',
    success: '',
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={step !== 'success' ? onClose : undefined}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        {step !== 'success' && (
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 flex-shrink-0">
            {((step === 'add-address' && addresses.length > 0) || step === 'confirm') && (
              <button
                type="button"
                onClick={() => setStep('address')}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Back"
              >
                <ChevronLeft size={18} className="text-gray-500" />
              </button>
            )}
            <h2 className="font-serif text-lg font-bold text-gray-900 flex-1">
              {STEP_TITLE[step]}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">

          {/* ── Step: Select address ── */}
          {step === 'address' && (
            <div className="p-5 space-y-3">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  selected={selectedAddr?.id === addr.id}
                  onSelect={() => setSelectedAddr(addr)}
                />
              ))}

              <button
                type="button"
                onClick={() => { setForm(emptyForm); setStep('add-address') }}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-[#2f6a4a]/40 text-[#2f6a4a] hover:border-[#2f6a4a] hover:bg-[#f0f8f4] transition-colors"
              >
                <Plus size={18} />
                <span className="text-sm font-semibold">Add a new address</span>
              </button>

              <div className="pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => selectedAddr && setStep('confirm')}
                  disabled={!selectedAddr}
                  className="w-full bg-[#2f6a4a] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1f4a2f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Deliver here
                </button>
              </div>
            </div>
          )}

          {/* ── Step: Add address form ── */}
          {step === 'add-address' && (
            <div className="p-5 space-y-4 pb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={setF('name')}
                    placeholder="Ravi Kumar"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.phone}
                    onChange={setF('phone')}
                    placeholder="+91 98400 12345"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Flat / House No., Building <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.line1}
                  onChange={setF('line1')}
                  placeholder="12, Banana Street, West Block"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Area / Street / Locality
                </label>
                <input
                  value={form.line2}
                  onChange={setF('line2')}
                  placeholder="Near Market Road, Tenkasi"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.city}
                    onChange={setF('city')}
                    placeholder="Tenkasi"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.pincode}
                    onChange={setF('pincode')}
                    placeholder="627811"
                    maxLength={6}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  State
                </label>
                <select
                  value={form.state}
                  onChange={setF('state')}
                  title="State"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition bg-white"
                >
                  {STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, isDefault: !p.isDefault }))}
                className="flex items-center gap-2.5 py-1 w-full text-left"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    form.isDefault ? 'bg-[#2f6a4a] border-[#2f6a4a]' : 'border-gray-300'
                  }`}
                >
                  {form.isDefault && <Check size={10} strokeWidth={3} className="text-white" />}
                </div>
                <span className="text-sm text-gray-700">Use as default address</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAddress}
                disabled={!formValid}
                className="w-full bg-[#2f6a4a] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1f4a2f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save and deliver here
              </button>
            </div>
          )}

          {/* ── Step: Confirm order ── */}
          {step === 'confirm' && selectedAddr && (
            <div className="p-5 pb-6">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Delivery Address
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="text-xs font-semibold text-[#2f6a4a] hover:underline"
                  >
                    Change
                  </button>
                </div>
                <div className="bg-[#f5f9f7] rounded-xl p-4 flex items-start gap-3">
                  <MapPin size={16} className="text-[#2f6a4a] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {selectedAddr.name}
                      <span className="text-gray-400 font-normal"> · </span>
                      {selectedAddr.phone}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">
                      {selectedAddr.line1}
                      {selectedAddr.line2 ? `, ${selectedAddr.line2}` : ''}<br />
                      {selectedAddr.city}, {selectedAddr.state} — {selectedAddr.pincode}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                  Your Items ({items.length})
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f5f0e8] flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.qty} × ₹{item.price}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                        ₹{item.price * item.qty}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2.5">
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
                <div className="border-t border-gray-200 pt-2.5 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">₹{total}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="w-full bg-[#2f6a4a] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1f4a2f] transition-colors"
              >
                Place Order · ₹{total}
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                Estimated delivery: Today by 7 PM
              </p>
            </div>
          )}

          {/* ── Step: Success ── */}
          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-[#e7f3ec] rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-[#2f6a4a]/10">
                <Check size={36} className="text-[#2f6a4a]" strokeWidth={2.5} />
              </div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-1">Order Placed!</h2>
              <p className="text-gray-500 text-sm mb-3">Your fresh fruits are on their way 🎉</p>
              <p className="text-[#2f6a4a] font-mono font-bold text-lg mb-1">{orderId}</p>
              <p className="text-gray-400 text-xs mb-5">You'll receive a confirmation shortly</p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-6 bg-gray-50 rounded-xl py-3">
                <Package size={14} />
                <span>Estimated delivery: Today by 7 PM</span>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-[#2f6a4a] text-[#2f6a4a] py-3 rounded-xl font-semibold text-sm hover:bg-[#f0f8f4] transition-colors"
                >
                  Close
                </button>
                <Link
                  to="/shop"
                  onClick={onClose}
                  className="flex-1 bg-[#2f6a4a] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1f4a2f] transition-colors text-center no-underline flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={15} />
                  Shop More
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Cart page ───────────────────────────────────────────────────────────────

function CartPage() {
  const user = useAuthGuard()
  const { items, updateQty, removeItem } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

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
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm border border-gray-100"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5f0e8]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#2f6a4a] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-0.5">
                      {item.category}
                    </p>
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{item.unit}</p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 rounded-full px-2 sm:px-3 py-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-sm font-semibold text-gray-800 w-4 sm:w-5 text-center">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-gray-900 w-14 sm:w-16 text-right flex-shrink-0">
                    ₹{item.price * item.qty}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
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
                <button
                  type="button"
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-[#2f6a4a] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1f4a2f] transition-colors"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/shop"
                  className="block text-center mt-4 text-sm text-[#2f6a4a] font-medium hover:underline no-underline"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </main>
  )
}

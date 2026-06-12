import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuthGuard } from '#/hooks/useAuthGuard'
import TiIcon from '#/components/TiIcon'
import { api, isApiMode, type OrderDto, ORDER_STATUS } from '#/lib/apiClient'

export const Route = createFileRoute('/orders')({ component: OrdersPage })

const ACTIVE_STATUSES = new Set([1, 2, 3])
const DONE_STATUSES   = new Set([4, 5])

function statusStyle(status: number) {
  const map: Record<number, string> = {
    1: 'bg-amber-100 text-amber-700',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-indigo-100 text-indigo-700',
    4: 'bg-emerald-100 text-emerald-700',
    5: 'bg-red-100 text-red-700',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function OrderCard({ order, onCancel }: { order: OrderDto; onCancel: (id: string) => void }) {
  const [cancelling, setCancelling] = useState(false)
  const canCancel = order.status === 1 || order.status === 2
  const date = new Date(order.createdAtUtc).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  async function handleCancel() {
    if (!window.confirm('Cancel this order?')) return
    setCancelling(true)
    try {
      await api.post<OrderDto>(`/api/Orders/${order.id}/cancel`, {})
      onCancel(order.id)
    } catch {
      setCancelling(false)
    }
  }

  const items = order.items ?? []

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div>
          <p className="font-mono text-xs font-bold text-gray-600 mb-0.5">
            {order.orderNumber ?? order.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusStyle(order.status)}`}>
            {ORDER_STATUS[order.status] ?? 'Unknown'}
          </span>
          {canCancel && (
            <button
              type="button"
              onClick={() => void handleCancel()}
              disabled={cancelling}
              className="text-xs font-semibold text-red-600 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling…' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-4">
        {items.length > 0 ? (
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 w-5 flex-shrink-0">{item.quantity}×</span>
                  <span className="text-gray-700 truncate">{item.productName ?? item.productId}</span>
                </div>
                <span className="font-semibold text-gray-900 ml-4 flex-shrink-0">
                  ₹{(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 mb-4 italic">No item details available.</p>
        )}
        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <span className="text-sm text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''}</span>
          <div>
            <span className="text-xs text-gray-400 mr-1">Total</span>
            <span className="font-bold text-gray-900">₹{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrdersPage() {
  const user = useAuthGuard()
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [loading, setLoading] = useState(isApiMode())
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'current' | 'previous'>('current')

  useEffect(() => {
    if (!user || !isApiMode()) { setLoading(false); return }
    api.get<OrderDto[]>('/api/Orders')
      .then(setOrders)
      .catch(() => setError('Failed to load orders. Please refresh.'))
      .finally(() => setLoading(false))
  }, [user])

  function handleCancel(id: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 5 } : o))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f4]">
        <div className="w-10 h-10 border-2 border-[#3d7a20] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const currentOrders  = orders.filter((o) => ACTIVE_STATUSES.has(o.status))
  const previousOrders = orders.filter((o) => DONE_STATUSES.has(o.status))
  const shown = tab === 'current' ? currentOrders : previousOrders

  return (
    <main className="min-h-screen bg-[#faf9f4]">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Back + title */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/shop" className="p-2 hover:bg-gray-100 rounded-lg transition no-underline">
            <TiIcon name="angle-left" size={18} className="text-gray-500" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-400 text-sm">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {(['current', 'previous'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'current'
                ? `Current Orders (${currentOrders.length})`
                : `Order History (${previousOrders.length})`}
            </button>
          ))}
        </div>

        {!isApiMode() && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 mb-6">
            Demo mode — order history is only available when connected to the live API.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-[#3d7a20] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 text-sm">{error}</div>
        ) : shown.length === 0 ? (
          <div className="text-center py-24">
            <TiIcon name="bag" size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium text-lg">
              {tab === 'current' ? 'No active orders' : 'No order history yet'}
            </p>
            <p className="text-gray-400 text-sm mt-1 mb-6">
              {tab === 'current'
                ? 'Your pending, confirmed and shipped orders will appear here.'
                : 'Delivered and cancelled orders will show up here.'}
            </p>
            <Link
              to="/shop"
              className="inline-block bg-[#3d7a20] text-white px-6 py-2.5 rounded-full text-sm font-semibold no-underline hover:bg-[#2a5a14] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {shown.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={handleCancel} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

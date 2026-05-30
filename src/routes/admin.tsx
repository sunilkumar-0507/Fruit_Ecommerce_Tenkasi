import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthGuard } from '#/hooks/useAuthGuard'
import {
  LayoutDashboard, Package, ShoppingBag, Users, Truck, Leaf, Settings,
  Search, Bell, Plus, TrendingUp, TrendingDown, ChevronDown,
  Pencil, Trash2, Eye, Star, MapPin, Phone, Save, Building2,
  CheckCircle2, AlertTriangle, Clock, XCircle, Award,
} from 'lucide-react'

export const Route = createFileRoute('/admin')({ component: AdminPage })

// ─── Static data ────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Inventory', icon: Package },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Customers', icon: Users },
  { label: 'Delivery', icon: Truck },
  { label: 'Farmers', icon: Leaf },
  { label: 'Settings', icon: Settings },
]

const TOP_SELLERS = [
  { rank: 1, name: 'Banganapalli Mango', category: 'Mangoes', revenue: 14000, sold: 50, image: '/images/products/p-mango.jpg' },
  { rank: 2, name: 'Malai Vazhaipalam', category: 'Banana', revenue: 3570, sold: 42, image: '/images/products/p-banana.jpg' },
  { rank: 3, name: 'Kabul Ruby Pomeg…', category: 'Imported Fruits', revenue: 8160, sold: 34, image: '/images/products/p-pomegranate.jpg' },
  { rank: 4, name: 'Alangulam Guava', category: 'Organic Fruits', revenue: 2400, sold: 20, image: '/images/products/p-guava.jpg' },
]

const CHART_DATA = [10, 14, 9, 18, 12, 22, 16, 25, 19, 28, 24, 30]
const CHART_LABELS = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21']

const INVENTORY = [
  { id: '1', name: 'Banganapalli Mango', category: 'Mangoes', price: 280, stock: 142, image: '/images/products/p-mango.jpg' },
  { id: '2', name: 'Malai Vazhaipalam', category: 'Banana', price: 85, stock: 8, image: '/images/products/p-banana.jpg' },
  { id: '3', name: 'Kabul Ruby Pomegranate', category: 'Imported Fruits', price: 240, stock: 0, image: '/images/products/p-pomegranate.jpg' },
  { id: '4', name: 'Alangulam Guava', category: 'Organic Fruits', price: 120, stock: 65, image: '/images/products/p-guava.jpg' },
  { id: '5', name: 'Kilakarai Watermelon', category: 'Seasonal Fruits', price: 60, stock: 34, image: '/images/products/p-watermelon.jpg' },
  { id: '6', name: 'Panneer Grapes', category: 'Organic Fruits', price: 180, stock: 12, image: '/images/products/p-grapes.jpg' },
  { id: '7', name: 'Pongal Festival Basket', category: 'Fruit Baskets', price: 1450, stock: 22, image: '/images/categories/fruit-baskets.jpg' },
  { id: '8', name: 'Heritage Dry Fruit Mix', category: 'Dry Fruits', price: 540, stock: 38, image: '/images/categories/dry-fruits.jpg' },
  { id: '9', name: 'Imam Pasand Mango', category: 'Mangoes', price: 320, stock: 55, image: '/images/products/p-mango.jpg' },
  { id: '10', name: 'Nendran Banana', category: 'Banana', price: 120, stock: 0, image: '/images/products/p-banana.jpg' },
  { id: '11', name: 'Fresh Strawberries', category: 'Seasonal Fruits', price: 280, stock: 15, image: '/images/products/p-strawberries.jpg' },
  { id: '12', name: 'Sweet Valencia Oranges', category: 'Imported Fruits', price: 349, stock: 40, image: '/images/products/p-oranges.jpg' },
]

const ORDERS = [
  { id: '#TF-1284', customer: 'Priya Sharma', date: '21 May 2026', items: 3, amount: 640, status: 'Delivered' },
  { id: '#TF-1283', customer: 'Murugan P.', date: '21 May 2026', items: 2, amount: 1240, status: 'Processing' },
  { id: '#TF-1282', customer: 'Kavitha R.', date: '20 May 2026', items: 1, amount: 320, status: 'Delivered' },
  { id: '#TF-1281', customer: 'Ravi Kumar', date: '20 May 2026', items: 4, amount: 850, status: 'Delivered' },
  { id: '#TF-1280', customer: 'Anitha S.', date: '19 May 2026', items: 1, amount: 2200, status: 'Delivered' },
  { id: '#TF-1279', customer: 'Senthil K.', date: '19 May 2026', items: 2, amount: 480, status: 'Cancelled' },
  { id: '#TF-1278', customer: 'Vijaya L.', date: '18 May 2026', items: 3, amount: 760, status: 'Delivered' },
  { id: '#TF-1277', customer: 'Ramesh B.', date: '18 May 2026', items: 1, amount: 1450, status: 'Processing' },
]

const CUSTOMERS = [
  { id: '1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 94400 55555', orders: 24, spend: 12400, joined: 'Jan 2025', type: 'VIP' },
  { id: '2', name: 'Murugan P.', email: 'murugan@example.com', phone: '+91 94400 11111', orders: 3, spend: 2840, joined: 'Apr 2026', type: 'Regular' },
  { id: '3', name: 'Kavitha R.', email: 'kavitha@example.com', phone: '+91 99400 22222', orders: 15, spend: 7200, joined: 'Mar 2025', type: 'VIP' },
  { id: '4', name: 'Ravi Kumar', email: 'ravi@example.com', phone: '+91 98765 33333', orders: 8, spend: 4100, joined: 'Sep 2025', type: 'Regular' },
  { id: '5', name: 'Anitha S.', email: 'anitha@example.com', phone: '+91 91100 44444', orders: 1, spend: 2200, joined: 'May 2026', type: 'New' },
  { id: '6', name: 'Senthil K.', email: 'senthil@example.com', phone: '+91 97700 66666', orders: 5, spend: 2150, joined: 'Nov 2025', type: 'Regular' },
]

const DELIVERIES = [
  { id: '#TF-1283', customer: 'Murugan P.', area: 'Madurai', driver: 'Selvam R.', eta: '2:30 PM', status: 'In Transit' },
  { id: '#TF-1277', customer: 'Vijaya L.', area: 'Chennai', driver: 'Arjun M.', eta: '3:15 PM', status: 'In Transit' },
  { id: '#TF-1280', customer: 'Anitha S.', area: 'Coimbatore', driver: 'Kumar S.', eta: 'Done', status: 'Delivered' },
  { id: '#TF-1284', customer: 'Priya Sharma', area: 'Trichy', driver: 'Assigning…', eta: '4:00 PM', status: 'Pending' },
  { id: '#TF-1278', customer: 'Ramesh B.', area: 'Salem', driver: 'Bala T.', eta: 'Done', status: 'Delivered' },
]

const FARMERS = [
  { id: '1', name: 'Murugesan P.', village: 'Tenkasi', produce: 'Mango, Banana', supply: '800 kg/wk', rating: 4.9, phone: '+91 94433 00001', active: true },
  { id: '2', name: 'Rajan T.', village: 'Courtallam', produce: 'Guava, Papaya', supply: '450 kg/wk', rating: 4.7, phone: '+91 94433 00002', active: true },
  { id: '3', name: 'Selvam K.', village: 'Alangulam', produce: 'Banana, Jackfruit', supply: '600 kg/wk', rating: 4.8, phone: '+91 94433 00003', active: true },
  { id: '4', name: 'Lakshmi A.', village: 'Kadayanallur', produce: 'Pomegranate, Grapes', supply: '300 kg/wk', rating: 4.6, phone: '+91 94433 00004', active: false },
  { id: '5', name: 'Kumar M.', village: 'Sankarankovil', produce: 'Watermelon, Pineapple', supply: '500 kg/wk', rating: 4.5, phone: '+91 94433 00005', active: true },
  { id: '6', name: 'Pandian S.', village: 'Tirunelveli', produce: 'Dry Fruits, Seasonal', supply: '250 kg/wk', rating: 4.7, phone: '+91 94433 00006', active: true },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function stockStatus(stock: number) {
  if (stock === 0) return { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' }
  if (stock < 20) return { label: 'Low Stock', cls: 'bg-amber-100 text-amber-700' }
  return { label: 'In Stock', cls: 'bg-emerald-100 text-emerald-700' }
}

function orderStatusStyle(status: string) {
  const map: Record<string, string> = {
    Delivered: 'bg-emerald-100 text-emerald-700',
    Processing: 'bg-blue-100 text-blue-700',
    Pending: 'bg-amber-100 text-amber-700',
    Cancelled: 'bg-red-100 text-red-700',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function deliveryStatusStyle(status: string) {
  const map: Record<string, string> = {
    'In Transit': 'bg-blue-100 text-blue-700',
    Delivered: 'bg-emerald-100 text-emerald-700',
    Pending: 'bg-amber-100 text-amber-700',
    Failed: 'bg-red-100 text-red-700',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  )
}

// ─── Panel: Overview ────────────────────────────────────────────────────────

function OverviewPanel() {
  const [timePeriod, setTimePeriod] = useState('Last 7 days')
  const [chartView, setChartView] = useState<'Day' | 'Week' | 'Month'>('Week')
  const chartMax = Math.max(...CHART_DATA)

  return (
    <div className="px-6 py-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#2f6a4a] uppercase mb-1">Wednesday, 21 May 2026</p>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">Good morning, Arun</h1>
          <p className="text-gray-500 text-sm">3 trucks loading · 84 orders queued for dispatch</p>
        </div>
        <div className="relative mt-1">
          <select
            title="Time period"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="appearance-none border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white pr-8 outline-none cursor-pointer"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Revenue', value: '₹4.82 L', change: '+18.4%', up: true, sub: 'vs last week' },
          { label: 'Orders', value: '1,284', change: '+9.2%', up: true, sub: '212 today' },
          { label: 'Avg Basket', value: '₹376', change: '-2.1%', up: false, sub: '12 items avg' },
          { label: 'Active Customers', value: '8,940', change: '+24.6%', up: true, sub: '642 new' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <div className="flex items-center gap-1.5">
              {stat.up ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-red-500" />}
              <span className={`text-sm font-semibold ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>{stat.change}</span>
              <span className="text-xs text-gray-400">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Top Sellers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Daily sales</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 12 days · ₹ in thousands</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {(['Day', 'Week', 'Month'] as const).map((v) => (
                <button
                  type="button"
                  key={v}
                  onClick={() => setChartView(v)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${chartView === v ? 'bg-[#2f6a4a] text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-36 mt-2">
            {CHART_DATA.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-[#2f6a4a] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${(val / chartMax) * 100}%` }}
                />
                <span className="text-[10px] text-gray-400">{CHART_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Top sellers</h3>
          <div className="space-y-3">
            {TOP_SELLERS.map((item) => (
              <div key={item.rank} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4 flex-shrink-0">{item.rank}</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#f5f0e8] flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-[#2f6a4a]">{item.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">₹{item.revenue.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-400">{item.sold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Panel: Inventory ───────────────────────────────────────────────────────

function InventoryPanel() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saved, setSaved] = useState(false)

  const filtered = INVENTORY.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()),
  )

  function handleSave() {
    setSaved(true)
    setTimeout(() => { setSaved(false); setShowForm(false) }, 1500)
  }

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 text-sm mt-0.5">{INVENTORY.length} products · {INVENTORY.filter(p => p.stock === 0).length} out of stock</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#2f6a4a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1f4a2f] transition-colors"
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2 w-72 mb-5">
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((item) => {
              const s = stockStatus(item.stock)
              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#f5f0e8] flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.category}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{item.price}</td>
                  <td className="px-4 py-3 text-right text-gray-700 font-medium">
                    {item.stock === 0 ? '—' : item.stock}
                    {item.stock > 0 && item.stock < 20 && (
                      <AlertTriangle size={12} className="inline ml-1 text-amber-500" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" className="p-1.5 text-gray-400 hover:text-[#2f6a4a] hover:bg-[#e7f3ec] rounded-lg transition-colors" aria-label="Edit">
                        <Pencil size={14} />
                      </button>
                      <button type="button" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-60 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl font-bold text-gray-900 mb-5">Add New Product</h2>
            <div className="space-y-4">
              {[
                { label: 'Product Name', placeholder: 'e.g. Alphonso Mango' },
                { label: 'Tamil Name', placeholder: 'e.g. ஆல்பன்சோ மாம்பழம்' },
                { label: 'Category', placeholder: 'e.g. Mangoes' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] transition"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" placeholder="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock (units)</label>
                  <input type="number" placeholder="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] transition" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="flex-1 py-2.5 bg-[#2f6a4a] text-white rounded-xl text-sm font-semibold hover:bg-[#1f4a2f] transition">
                {saved ? '✓ Saved!' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Panel: Orders ──────────────────────────────────────────────────────────

function OrdersPanel() {
  const [filter, setFilter] = useState('All')
  const statuses = ['All', 'Processing', 'Pending', 'Delivered', 'Cancelled']

  const filtered = filter === 'All' ? ORDERS : ORDERS.filter((o) => o.status === filter)

  const statusIcon = (s: string) => {
    if (s === 'Delivered') return <CheckCircle2 size={13} className="text-emerald-500" />
    if (s === 'Processing') return <Clock size={13} className="text-blue-500" />
    if (s === 'Cancelled') return <XCircle size={13} className="text-red-500" />
    return <AlertTriangle size={13} className="text-amber-500" />
  }

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{ORDERS.length} orders · {ORDERS.filter(o => o.status === 'Processing').length} in progress</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto">
        {statuses.map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setFilter(s)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
              filter === s ? 'bg-[#2f6a4a] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{order.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{order.customer}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{order.date}</td>
                <td className="px-4 py-3 text-center text-gray-700">{order.items}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{order.amount}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${orderStatusStyle(order.status)}`}>
                    {statusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button type="button" className="p-1.5 text-gray-400 hover:text-[#2f6a4a] hover:bg-[#e7f3ec] rounded-lg transition-colors" aria-label="View order">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Panel: Customers ───────────────────────────────────────────────────────

function CustomersPanel() {
  const [search, setSearch] = useState('')
  const filtered = CUSTOMERS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()),
  )

  function typeBadge(type: string) {
    if (type === 'VIP') return 'bg-amber-100 text-amber-700'
    if (type === 'New') return 'bg-[#e7f3ec] text-[#2f6a4a]'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{CUSTOMERS.length} registered · {CUSTOMERS.filter(c => c.type === 'VIP').length} VIP</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: '8,940', icon: <Users size={18} className="text-[#2f6a4a]" /> },
          { label: 'VIP', value: '642', icon: <Award size={18} className="text-amber-500" /> },
          { label: 'New this month', value: '128', icon: <TrendingUp size={18} className="text-emerald-500" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">{s.icon}</div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2 w-72 mb-5">
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Orders</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Spend</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#e7f3ec] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#2f6a4a] font-bold text-sm">{c.name.charAt(0)}</span>
                    </div>
                    <span className="font-medium text-gray-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-xs text-gray-500"><Mail size={11} />{c.email}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400"><Phone size={11} />{c.phone}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">{c.orders}</td>
                <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{c.spend.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${typeBadge(c.type)}`}>
                    {c.type === 'VIP' && <Award size={10} />}
                    {c.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Panel: Delivery ────────────────────────────────────────────────────────

function DeliveryPanel() {
  const inTransit = DELIVERIES.filter((d) => d.status === 'In Transit').length
  const delivered = DELIVERIES.filter((d) => d.status === 'Delivered').length
  const pending = DELIVERIES.filter((d) => d.status === 'Pending').length

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Delivery</h1>
        <p className="text-gray-500 text-sm mt-0.5">Live dispatch board · {DELIVERIES.length} active routes today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'In Transit', value: inTransit, cls: 'text-blue-600', bg: 'bg-blue-50', icon: <Truck size={18} className="text-blue-500" /> },
          { label: 'Delivered Today', value: delivered, cls: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle2 size={18} className="text-emerald-500" /> },
          { label: 'Pending', value: pending, cls: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={18} className="text-amber-500" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>{s.icon}</div>
            <div>
              <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Area</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Driver</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ETA</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {DELIVERIES.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{d.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{d.customer}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-500 text-xs"><MapPin size={11} />{d.area}</div>
                </td>
                <td className="px-4 py-3 text-gray-700 text-sm">{d.driver}</td>
                <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{d.eta}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${deliveryStatusStyle(d.status)}`}>{d.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Panel: Farmers ─────────────────────────────────────────────────────────

function FarmersPanel() {
  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Farmers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{FARMERS.length} partner farmers · {FARMERS.filter(f => f.active).length} active this month</p>
        </div>
        <button type="button" className="flex items-center gap-2 bg-[#2f6a4a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1f4a2f] transition-colors">
          <Plus size={15} />
          Add Farmer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Partners', value: '240+', icon: <Leaf size={18} className="text-[#2f6a4a]" /> },
          { label: 'Active This Month', value: '186', icon: <TrendingUp size={18} className="text-emerald-500" /> },
          { label: 'Avg Rating', value: '4.7 ★', icon: <Star size={18} className="text-amber-500" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">{s.icon}</div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Farmer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Village</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Produce</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Weekly Supply</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {FARMERS.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#e7f3ec] rounded-full flex items-center justify-center flex-shrink-0">
                      <Leaf size={14} className="text-[#2f6a4a]" />
                    </div>
                    <span className="font-medium text-gray-900">{f.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  <div className="flex items-center gap-1"><MapPin size={11} />{f.village}</div>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{f.produce}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">{f.supply}</td>
                <td className="px-4 py-3 text-center"><Stars rating={f.rating} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500"><Phone size={11} />{f.phone}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${f.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {f.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Panel: Settings ────────────────────────────────────────────────────────

function SettingsPanel() {
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({ newOrder: true, lowStock: true, newCustomer: false, dailyReport: true })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="px-6 py-6 max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Business Information */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <Building2 size={18} className="text-[#2f6a4a]" />
          <h2 className="font-semibold text-gray-900">Business Information</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Shop Name', value: 'Tenkasi Fresh Fruits' },
            { label: 'Business Email', value: 'admin@tenakasifresh.com' },
            { label: 'Phone Number', value: '+91 98400 12345' },
            { label: 'GST Number', value: '33ABCDE1234F1Z5' },
            { label: 'FSSAI License', value: '22824105000124' },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input
                type="text"
                title={f.label}
                defaultValue={f.value}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition"
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Address</label>
            <input
              type="text"
              title="Address"
              defaultValue="12, Market Road, Tenkasi, Tamil Nadu 627811"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition"
            />
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <Truck size={18} className="text-[#2f6a4a]" />
          <h2 className="font-semibold text-gray-900">Delivery Settings</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Minimum Order (₹)', value: '200' },
            { label: 'Standard Delivery Fee (₹)', value: '49' },
            { label: 'Free Delivery Above (₹)', value: '599' },
            { label: 'Delivery Radius (km)', value: '50' },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input
                type="number"
                title={f.label}
                defaultValue={f.value}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell size={18} className="text-[#2f6a4a]" />
          <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: 'newOrder' as const, label: 'New Order Alert', desc: 'Notify when a new order is placed' },
            { key: 'lowStock' as const, label: 'Low Stock Alert', desc: 'Warn when a product falls below 20 units' },
            { key: 'newCustomer' as const, label: 'New Customer Registration', desc: 'Notify when a new customer signs up' },
            { key: 'dailyReport' as const, label: 'Daily Sales Report (Email)', desc: 'Receive a summary each morning at 8 AM' },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-gray-900">{n.label}</p>
                <p className="text-xs text-gray-500">{n.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifs[n.key] ? 'bg-[#2f6a4a]' : 'bg-gray-200'}`}
                aria-label={n.label}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifs[n.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="flex items-center gap-2 bg-[#2f6a4a] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1f4a2f] transition-colors"
      >
        <Save size={15} />
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}

// ─── Main AdminPage ──────────────────────────────────────────────────────────

function AdminPage() {
  const user = useAuthGuard('admin')
  const [activeNav, setActiveNav] = useState('Overview')

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f5f5f0]">
        <div className="w-10 h-10 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#f5f5f0] z-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1a3d2b] flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 bg-[#d4af37] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[#1a3d2b] font-bold text-sm font-serif leading-none">த</span>
            </div>
            <span className="font-serif text-white font-bold text-sm">Tenkasi Fresh</span>
          </div>
          <p className="text-white/40 text-[10px] tracking-widest uppercase ml-11">Admin Console</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeNav === label ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-white/30 text-[10px]">v1.0.0 · Demo Mode</p>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2 max-w-md">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search orders, products, customers..."
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button type="button" className="relative p-2 hover:bg-gray-100 rounded-lg" aria-label="Notifications">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#2f6a4a] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
                <p className="text-xs text-gray-500">Admin · Tenkasi</p>
              </div>
            </div>
          </div>
        </header>

        {/* Panel */}
        <div className="flex-1 overflow-y-auto">
          {activeNav === 'Overview' && <OverviewPanel />}
          {activeNav === 'Inventory' && <InventoryPanel />}
          {activeNav === 'Orders' && <OrdersPanel />}
          {activeNav === 'Customers' && <CustomersPanel />}
          {activeNav === 'Delivery' && <DeliveryPanel />}
          {activeNav === 'Farmers' && <FarmersPanel />}
          {activeNav === 'Settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  )
}

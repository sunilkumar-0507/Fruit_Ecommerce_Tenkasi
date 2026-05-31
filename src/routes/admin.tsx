import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthGuard } from '#/hooks/useAuthGuard'
import { useOrders } from '#/context/OrderContext'
import {
  LayoutDashboard, Package, ShoppingBag, Truck, Leaf, Settings,
  Search, Bell, Plus, TrendingUp, TrendingDown, ChevronDown,
  Pencil, Trash2, Eye, Star, MapPin, Phone, Save, Building2,
  CheckCircle2, AlertTriangle, Clock, XCircle, Award, Menu, X,
} from 'lucide-react'

export const Route = createFileRoute('/admin')({ component: AdminPage })

const NAV_ITEMS = [
  { label: 'Overview',   icon: LayoutDashboard },
  { label: 'Inventory',  icon: Package },
  { label: 'Orders',     icon: ShoppingBag },
  { label: 'Delivery',   icon: Truck },
  { label: 'Farmers',    icon: Leaf },
  { label: 'Settings',   icon: Settings },
]

const TOP_SELLERS = [
  { rank: 1, name: 'Banganapalli Mango', category: 'Mangoes', revenue: 14000, sold: 50, image: '/images/products/p-mango.jpg' },
  { rank: 2, name: 'Malai Vazhaipalam', category: 'Banana', revenue: 3570, sold: 42, image: '/images/products/p-banana.jpg' },
  { rank: 3, name: 'Kabul Ruby Pomeg…', category: 'Imported Fruits', revenue: 8160, sold: 34, image: '/images/products/p-pomegranate.jpg' },
  { rank: 4, name: 'Alangulam Guava', category: 'Organic Fruits', revenue: 2400, sold: 20, image: '/images/products/p-guava.jpg' },
]

const CHART_DATA = [10, 14, 9, 18, 12, 22, 16, 25, 19, 28, 24, 30]
const CHART_LABELS = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21']

const INVENTORY_INIT = [
  { id: '1',  name: 'Banganapalli Mango',     category: 'Mangoes',         price: 280,  stock: 142, image: '/images/products/p-mango.jpg' },
  { id: '2',  name: 'Malai Vazhaipalam',       category: 'Banana',          price: 85,   stock: 8,   image: '/images/products/p-banana.jpg' },
  { id: '3',  name: 'Kabul Ruby Pomegranate',  category: 'Imported Fruits', price: 240,  stock: 0,   image: '/images/products/p-pomegranate.jpg' },
  { id: '4',  name: 'Alangulam Guava',         category: 'Organic Fruits',  price: 120,  stock: 65,  image: '/images/products/p-guava.jpg' },
  { id: '5',  name: 'Kilakarai Watermelon',    category: 'Seasonal Fruits', price: 60,   stock: 34,  image: '/images/products/p-watermelon.jpg' },
  { id: '6',  name: 'Panneer Grapes',          category: 'Organic Fruits',  price: 180,  stock: 12,  image: '/images/products/p-grapes.jpg' },
  { id: '7',  name: 'Pongal Festival Basket',  category: 'Fruit Baskets',   price: 1450, stock: 22,  image: '/images/categories/fruit-baskets.jpg' },
  { id: '8',  name: 'Heritage Dry Fruit Mix',  category: 'Dry Fruits',      price: 540,  stock: 38,  image: '/images/categories/dry-fruits.jpg' },
  { id: '9',  name: 'Imam Pasand Mango',       category: 'Mangoes',         price: 320,  stock: 55,  image: '/images/products/p-mango.jpg' },
  { id: '10', name: 'Nendran Banana',          category: 'Banana',          price: 120,  stock: 0,   image: '/images/products/p-banana.jpg' },
]

const ORDERS = [
  { id: '#TF-1284', customer: 'Priya Sharma', date: '21 May 2026', items: 3, amount: 640,  status: 'Delivered' },
  { id: '#TF-1283', customer: 'Murugan P.',   date: '21 May 2026', items: 2, amount: 1240, status: 'Processing' },
  { id: '#TF-1282', customer: 'Kavitha R.',   date: '20 May 2026', items: 1, amount: 320,  status: 'Delivered' },
  { id: '#TF-1281', customer: 'Ravi Kumar',   date: '20 May 2026', items: 4, amount: 850,  status: 'Delivered' },
  { id: '#TF-1280', customer: 'Anitha S.',    date: '19 May 2026', items: 1, amount: 2200, status: 'Delivered' },
  { id: '#TF-1279', customer: 'Senthil K.',   date: '19 May 2026', items: 2, amount: 480,  status: 'Cancelled' },
]

const DELIVERIES = [
  { id: '#TF-1283', customer: 'Murugan P.',   area: 'Madurai',    driver: 'Selvam R.',  eta: '2:30 PM', status: 'In Transit' },
  { id: '#TF-1277', customer: 'Vijaya L.',     area: 'Chennai',    driver: 'Arjun M.',   eta: '3:15 PM', status: 'In Transit' },
  { id: '#TF-1280', customer: 'Anitha S.',     area: 'Coimbatore', driver: 'Kumar S.',   eta: 'Done',    status: 'Delivered' },
  { id: '#TF-1284', customer: 'Priya Sharma',  area: 'Trichy',     driver: 'Assigning…', eta: '4:00 PM', status: 'Pending' },
  { id: '#TF-1278', customer: 'Ramesh B.',     area: 'Salem',      driver: 'Bala T.',    eta: 'Done',    status: 'Delivered' },
]

const FARMERS = [
  { id: '1', name: 'Murugesan P.', village: 'Tenkasi',        produce: 'Mango, Banana',            supply: '800 kg/wk', rating: 4.9, phone: '+91 94433 00001', active: true },
  { id: '2', name: 'Rajan T.',     village: 'Courtallam',     produce: 'Guava, Papaya',            supply: '450 kg/wk', rating: 4.7, phone: '+91 94433 00002', active: true },
  { id: '3', name: 'Selvam K.',    village: 'Alangulam',      produce: 'Banana, Jackfruit',        supply: '600 kg/wk', rating: 4.8, phone: '+91 94433 00003', active: true },
  { id: '4', name: 'Lakshmi A.',   village: 'Kadayanallur',   produce: 'Pomegranate, Grapes',      supply: '300 kg/wk', rating: 4.6, phone: '+91 94433 00004', active: false },
  { id: '5', name: 'Kumar M.',     village: 'Sankarankovil',  produce: 'Watermelon, Pineapple',    supply: '500 kg/wk', rating: 4.5, phone: '+91 94433 00005', active: true },
  { id: '6', name: 'Pandian S.',   village: 'Tirunelveli',    produce: 'Dry Fruits, Seasonal',     supply: '250 kg/wk', rating: 4.7, phone: '+91 94433 00006', active: true },
]

const CATEGORIES = ['Mangoes', 'Banana', 'Organic Fruits', 'Imported Fruits', 'Seasonal Fruits', 'Dry Fruits', 'Fruit Baskets']

// ─── Helpers ────────────────────────────────────────────────────────────────

function stockStatus(stock: number) {
  if (stock === 0)  return { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' }
  if (stock < 20)   return { label: 'Low Stock',    cls: 'bg-amber-100 text-amber-700' }
  return                   { label: 'In Stock',     cls: 'bg-emerald-100 text-emerald-700' }
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
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  )
}

// ─── Add Product Modal ───────────────────────────────────────────────────────

interface AddProductModalProps {
  onClose: () => void
  onSave: (p: typeof INVENTORY_INIT[0]) => void
}

function AddProductModal({ onClose, onSave }: AddProductModalProps) {
  const [form, setForm] = useState({ name: '', nameTamil: '', category: CATEGORIES[0], price: '', stock: '', unit: 'per kg', image: '' })
  const [saved, setSaved] = useState(false)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }))
  }

  function handleSave() {
    if (!form.name || !form.price || !form.stock) return
    setSaved(true)
    setTimeout(() => {
      onSave({
        id: String(Date.now()),
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image || '/images/products/p-mango.jpg',
      })
      onClose()
    }, 900)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900">Add New Product</h2>
            <p className="text-gray-400 text-xs mt-0.5">Fill in the details below to add to inventory</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={set('name')} placeholder="e.g. Alphonso Mango" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>

          {/* Tamil Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tamil Name</label>
            <input type="text" value={form.nameTamil} onChange={set('nameTamil')} placeholder="e.g. ஆல்பன்சோ மாம்பழம்" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={set('category')} title="Category" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition bg-white appearance-none">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
              <input type="number" value={form.price} onChange={set('price')} placeholder="0" min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock (units) <span className="text-red-500">*</span></label>
              <input type="number" value={form.stock} onChange={set('stock')} placeholder="0" min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit</label>
            <input type="text" value={form.unit} onChange={set('unit')} placeholder="e.g. per kg, per dozen" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="text" value={form.image} onChange={set('image')} placeholder="/images/products/p-mango.jpg" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 sm:p-6 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!form.name || !form.price || !form.stock}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              saved ? 'bg-emerald-500 text-white' : 'bg-[#2f6a4a] text-white hover:bg-[#1f4a2f] disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {saved ? '✓ Product Added!' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Panel: Overview ────────────────────────────────────────────────────────

function OverviewPanel() {
  const { orders: contextOrders } = useOrders()
  const [timePeriod, setTimePeriod] = useState('Last 7 days')
  const [chartView, setChartView] = useState<'Day' | 'Week' | 'Month'>('Week')

  const STATIC_REVENUE = 482000
  const STATIC_ORDERS  = 1284
  const realRevenue    = contextOrders.reduce((s, o) => s + o.total, 0)
  const totalRevenue   = STATIC_REVENUE + realRevenue
  const totalOrders    = STATIC_ORDERS + contextOrders.length

  function fmtRevenue(n: number) {
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`
    return `₹${n.toLocaleString('en-IN')}`
  }

  const stats = [
    { label: 'Revenue',          value: fmtRevenue(totalRevenue), change: '+18.4%', up: true,  sub: 'vs last week' },
    { label: 'Orders',           value: totalOrders.toLocaleString('en-IN'), change: '+9.2%', up: true, sub: `${212 + contextOrders.length} today` },
    { label: 'Avg Basket',       value: '₹376',    change: '-2.1%',  up: false, sub: '12 items avg' },
    { label: 'Active Customers', value: '8,940',   change: '+24.6%', up: true,  sub: '642 new' },
  ]

  // Merge chart: last bar gets today's real orders (each order ≈ ₹ subtotal / 1000)
  const chartData = CHART_DATA.map((v, i) =>
    i === CHART_DATA.length - 1 ? v + Math.round(realRevenue / 1000) : v,
  )
  const chartMax = Math.max(...chartData)

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#2f6a4a] uppercase mb-1">Wednesday, 21 May 2026</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Good morning, Arun</h1>
          <p className="text-gray-500 text-sm">3 trucks loading · {84 + contextOrders.length} orders queued</p>
        </div>
        <div className="relative">
          <select title="Time period" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="appearance-none border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white pr-8 outline-none cursor-pointer">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-2">{stat.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {stat.up ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-red-500" />}
              <span className={`text-sm font-semibold ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>{stat.change}</span>
              <span className="text-xs text-gray-400 hidden sm:inline">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent live orders banner */}
      {contextOrders.length > 0 && (
        <div className="mb-4 bg-[#e7f3ec] border border-[#2f6a4a]/20 rounded-xl p-4">
          <p className="text-xs font-bold text-[#2f6a4a] uppercase tracking-widest mb-2">
            New Orders Today ({contextOrders.length})
          </p>
          <div className="space-y-2">
            {contextOrders.slice(0, 3).map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm">
                <span className="font-mono text-xs font-semibold text-gray-600">{o.id}</span>
                <span className="text-gray-700 font-medium truncate flex-1 px-3">{o.customerName}</span>
                <span className="font-bold text-gray-900">₹{o.total}</span>
                <span className="ml-3 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Daily sales</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 12 days · ₹ in thousands</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {(['Day', 'Week', 'Month'] as const).map((v) => (
                <button type="button" key={v} onClick={() => setChartView(v)} className={`px-2 sm:px-3 py-1 rounded-md text-xs font-medium transition-colors ${chartView === v ? 'bg-[#2f6a4a] text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1 sm:gap-1.5 h-32 sm:h-36 mt-2">
            {chartData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-sm transition-opacity ${i === chartData.length - 1 && contextOrders.length > 0 ? 'bg-[#d4af37] opacity-90 hover:opacity-100' : 'bg-[#2f6a4a] opacity-80 hover:opacity-100'}`}
                  style={{ height: `${(val / chartMax) * 100}%` }}
                />
                <span className="text-[9px] sm:text-[10px] text-gray-400">{CHART_LABELS[i]}</span>
              </div>
            ))}
          </div>
          {contextOrders.length > 0 && (
            <p className="text-[10px] text-[#d4af37] font-semibold mt-2 text-right">
              ★ Today's bar includes {contextOrders.length} live order{contextOrders.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
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
  const [showModal, setShowModal] = useState(false)
  const [inventory, setInventory] = useState(INVENTORY_INIT)

  const filtered = inventory.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()),
  )

  function handleAddProduct(p: typeof INVENTORY_INIT[0]) {
    setInventory((prev) => [p, ...prev])
  }

  function handleDelete(id: string) {
    setInventory((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 text-sm mt-0.5">{inventory.length} products · {inventory.filter(p => p.stock === 0).length} out of stock</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#2f6a4a] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1f4a2f] transition-colors self-start sm:self-auto"
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2 w-full sm:w-72 mb-5">
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
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
                    {item.stock > 0 && item.stock < 20 && <AlertTriangle size={12} className="inline ml-1 text-amber-500" />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" className="p-1.5 text-gray-400 hover:text-[#2f6a4a] hover:bg-[#e7f3ec] rounded-lg transition-colors" aria-label="Edit"><Pencil size={14} /></button>
                      <button type="button" onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && <AddProductModal onClose={() => setShowModal(false)} onSave={handleAddProduct} />}
    </div>
  )
}

// ─── Panel: Orders ──────────────────────────────────────────────────────────

function OrdersPanel() {
  const { orders: contextOrders } = useOrders()
  const [filter, setFilter] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const statuses = ['All', 'Processing', 'Pending', 'Delivered', 'Cancelled']

  // Merge real (context) orders first, then static demo orders
  const allOrders = [
    ...contextOrders.map((o) => ({
      id: o.id,
      customer: o.customerName,
      date: o.date,
      itemCount: o.items.length,
      amount: o.total,
      status: o.status as string,
      address: o.address,
      items: o.items,
      isReal: true,
    })),
    ...ORDERS.map((o) => ({
      id: o.id,
      customer: o.customer,
      date: o.date,
      itemCount: o.items,
      amount: o.amount,
      status: o.status,
      address: null as null,
      items: [] as typeof contextOrders[0]['items'],
      isReal: false,
    })),
  ]

  const filtered = filter === 'All' ? allOrders : allOrders.filter((o) => o.status === filter)
  const processingCount = allOrders.filter((o) => o.status === 'Processing').length

  const statusIcon = (s: string) => {
    if (s === 'Delivered')  return <CheckCircle2 size={13} className="text-emerald-500" />
    if (s === 'Processing') return <Clock size={13} className="text-blue-500" />
    if (s === 'Cancelled')  return <XCircle size={13} className="text-red-500" />
    return <AlertTriangle size={13} className="text-amber-500" />
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {allOrders.length} orders · {processingCount} in progress
          {contextOrders.length > 0 && (
            <span className="ml-2 text-[#2f6a4a] font-semibold">· {contextOrders.length} new live</span>
          )}
        </p>
      </div>
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button type="button" key={s} onClick={() => setFilter(s)} className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${filter === s ? 'bg-[#2f6a4a] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((order) => (
              <>
                <tr
                  key={order.id}
                  className={`hover:bg-gray-50/50 transition-colors ${order.isReal ? 'bg-[#f9fef9]' : ''}`}
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">
                    <div className="flex items-center gap-1.5">
                      {order.id}
                      {order.isReal && <span className="w-1.5 h-1.5 rounded-full bg-[#2f6a4a] flex-shrink-0" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 text-sm">{order.customer}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{order.date}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{order.itemCount}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{order.amount}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${orderStatusStyle(order.status)}`}>
                      {statusIcon(order.status)}
                      <span className="hidden sm:inline">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                      className={`p-1.5 rounded-lg transition-colors ${expandedId === order.id ? 'text-[#2f6a4a] bg-[#e7f3ec]' : 'text-gray-400 hover:text-[#2f6a4a] hover:bg-[#e7f3ec]'}`}
                      aria-label="View order details"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>

                {/* Expanded address + items row */}
                {expandedId === order.id && (
                  <tr key={`${order.id}-detail`} className="bg-[#f5f9f7]">
                    <td colSpan={7} className="px-4 py-4">
                      {order.address ? (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Shipping Address</p>
                            <div className="flex items-start gap-2">
                              <MapPin size={14} className="text-[#2f6a4a] mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{order.address.name} · {order.address.phone}</p>
                                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                  {order.address.line1}
                                  {order.address.line2 ? `, ${order.address.line2}` : ''}<br />
                                  {order.address.city}, {order.address.state} — {order.address.pincode}
                                </p>
                              </div>
                            </div>
                          </div>
                          {order.items.length > 0 && (
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Items Ordered</p>
                              <div className="space-y-1.5">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="font-semibold text-gray-800">{item.qty}×</span>
                                    <span className="truncate">{item.name}</span>
                                    <span className="ml-auto font-semibold text-gray-900 flex-shrink-0">₹{item.price * item.qty}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No address details for demo orders.</p>
                      )}
                    </td>
                  </tr>
                )}
              </>
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
  const pending   = DELIVERIES.filter((d) => d.status === 'Pending').length

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Delivery</h1>
        <p className="text-gray-500 text-sm mt-0.5">Live dispatch board · {DELIVERIES.length} active routes today</p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'In Transit',      value: inTransit, cls: 'text-blue-600',    bg: 'bg-blue-50',    icon: <Truck size={18} className="text-blue-500" /> },
          { label: 'Delivered Today', value: delivered, cls: 'text-emerald-600', bg: 'bg-emerald-50', icon: <CheckCircle2 size={18} className="text-emerald-500" /> },
          { label: 'Pending',         value: pending,   cls: 'text-amber-600',   bg: 'bg-amber-50',   icon: <Clock size={18} className="text-amber-500" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${s.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className={`text-xl sm:text-2xl font-bold ${s.cls}`}>{s.value}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Area</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Driver</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ETA</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {DELIVERIES.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{d.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900 text-sm">{d.customer}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center gap-1 text-gray-500 text-xs"><MapPin size={11} />{d.area}</div>
                </td>
                <td className="px-4 py-3 text-gray-700 text-sm hidden md:table-cell">{d.driver}</td>
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
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Farmers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{FARMERS.length} partner farmers · {FARMERS.filter(f => f.active).length} active this month</p>
        </div>
        <button type="button" className="flex items-center gap-2 bg-[#2f6a4a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1f4a2f] transition-colors self-start sm:self-auto">
          <Plus size={15} />
          Add Farmer
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Partners',     value: '240+',  icon: <Leaf size={18} className="text-[#2f6a4a]" /> },
          { label: 'Active This Month',  value: '186',   icon: <TrendingUp size={18} className="text-emerald-500" /> },
          { label: 'Avg Rating',         value: '4.7 ★', icon: <Award size={18} className="text-amber-500" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">{s.icon}</div>
            <div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[520px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Farmer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Village</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Produce</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Weekly Supply</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Contact</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {FARMERS.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#e7f3ec] rounded-full flex items-center justify-center flex-shrink-0"><Leaf size={14} className="text-[#2f6a4a]" /></div>
                    <span className="font-medium text-gray-900 text-sm">{f.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell"><div className="flex items-center gap-1"><MapPin size={11} />{f.village}</div></td>
                <td className="px-4 py-3 text-gray-600 text-xs">{f.produce}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 hidden md:table-cell">{f.supply}</td>
                <td className="px-4 py-3 text-center"><Stars rating={f.rating} /></td>
                <td className="px-4 py-3 hidden lg:table-cell"><div className="flex items-center gap-1 text-xs text-gray-500"><Phone size={11} />{f.phone}</div></td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${f.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{f.active ? 'Active' : 'Inactive'}</span>
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
    <div className="p-4 sm:p-6 max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-5"><Building2 size={18} className="text-[#2f6a4a]" /><h2 className="font-semibold text-gray-900">Business Information</h2></div>
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
              <input type="text" title={f.label} defaultValue={f.value} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Address</label>
            <input type="text" title="Address" defaultValue="12, Market Road, Tenkasi, Tamil Nadu 627811" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-5"><Truck size={18} className="text-[#2f6a4a]" /><h2 className="font-semibold text-gray-900">Delivery Settings</h2></div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Minimum Order (₹)', value: '200' },
            { label: 'Standard Delivery Fee (₹)', value: '49' },
            { label: 'Free Delivery Above (₹)', value: '599' },
            { label: 'Delivery Radius (km)', value: '50' },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type="number" title={f.label} defaultValue={f.value} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-5"><Bell size={18} className="text-[#2f6a4a]" /><h2 className="font-semibold text-gray-900">Notification Preferences</h2></div>
        <div className="space-y-4">
          {[
            { key: 'newOrder' as const,     label: 'New Order Alert',              desc: 'Notify when a new order is placed' },
            { key: 'lowStock' as const,     label: 'Low Stock Alert',              desc: 'Warn when a product falls below 20 units' },
            { key: 'newCustomer' as const,  label: 'New Customer Registration',    desc: 'Notify when a new customer signs up' },
            { key: 'dailyReport' as const,  label: 'Daily Sales Report (Email)',   desc: 'Receive a summary each morning at 8 AM' },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-gray-900">{n.label}</p>
                <p className="text-xs text-gray-500">{n.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notifs[n.key] ? 'bg-[#2f6a4a]' : 'bg-gray-200'}`}
                aria-label={n.label}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifs[n.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="button" onClick={handleSave} className="flex items-center gap-2 bg-[#2f6a4a] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1f4a2f] transition-colors">
        <Save size={15} />
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}

// ─── Sidebar content ─────────────────────────────────────────────────────────

function SidebarContent({ activeNav, setActiveNav, onNavClick }: {
  activeNav: string
  setActiveNav: (v: string) => void
  onNavClick?: () => void
  user: { name: string }
}) {
  return (
    <>
      <div className="px-5 py-5 border-b border-white/10">
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
            onClick={() => { setActiveNav(label); onNavClick?.() }}
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
    </>
  )
}

// ─── Main AdminPage ──────────────────────────────────────────────────────────

function AdminPage() {
  const user = useAuthGuard('admin')
  const [activeNav, setActiveNav] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f5f5f0]">
        <div className="w-10 h-10 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#f5f5f0] z-50 flex overflow-hidden">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop: flex item | mobile: fixed drawer */}
      <aside className={[
        'bg-[#1a3d2b] flex flex-col overflow-y-auto transition-transform duration-300',
        'fixed inset-y-0 left-0 z-50 w-64 md:relative md:w-56 md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}>
        <SidebarContent activeNav={activeNav} setActiveNav={setActiveNav} onNavClick={() => setSidebarOpen(false)} user={user} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Open sidebar"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2 max-w-md">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Search orders, products..." className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button type="button" className="relative p-2 hover:bg-gray-100 rounded-lg flex-shrink-0" aria-label="Notifications">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#2f6a4a] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
                <p className="text-xs text-gray-500">Admin · Tenkasi</p>
              </div>
            </div>
          </div>
        </header>

        {/* Panel */}
        <div className="flex-1 overflow-y-auto">
          {activeNav === 'Overview'   && <OverviewPanel />}
          {activeNav === 'Inventory'  && <InventoryPanel />}
          {activeNav === 'Orders'     && <OrdersPanel />}
          {activeNav === 'Delivery'   && <DeliveryPanel />}
          {activeNav === 'Farmers'    && <FarmersPanel />}
          {activeNav === 'Settings'   && <SettingsPanel />}
        </div>
      </div>
    </div>
  )
}

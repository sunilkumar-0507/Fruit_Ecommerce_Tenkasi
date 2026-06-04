import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, Fragment, useRef } from 'react'
import { useAuthGuard } from '#/hooks/useAuthGuard'
import TiIcon from '#/components/TiIcon'
import { ImageCollage } from '#/components/BasketCard'
import { useBaskets, type BasketEntry } from '#/context/BasketContext'
import { PRODUCTS } from '#/data/products'
import {
  api, isApiMode, getStoredToken, uploadProductImage,
  type ProductDto, type ProductDtoPagedResult,
  type CategoryDto, type OrderDto, type OrderDtoPagedResult,
  ORDER_STATUS,
} from '#/lib/apiClient'
import {
  loadPrefs, savePrefs, isEmailJsConfigured, sendTestEmail,
  notifyLowStock, maybeSendDailyReport,
  type NotifPrefs,
} from '#/services/notificationService'

export const Route = createFileRoute('/admin')({ component: AdminPage })

const NAV_ICONS: Record<string, string> = {
  Overview:  'dashboard',
  Inventory: 'package',
  Discounts: 'tag',
  Seasonal:  'shine',
  Baskets:   'gift',
  Orders:    'bag',
  Delivery:  'truck',
  Farmers:   'layers',
  Settings:  'settings',
}

const NAV_ITEMS = [
  { label: 'Overview' },
  { label: 'Inventory' },
  { label: 'Discounts' },
  { label: 'Seasonal' },
  { label: 'Baskets' },
  { label: 'Orders' },
  { label: 'Delivery' },
  { label: 'Farmers' },
  { label: 'Settings' },
]

const OVERVIEW_PERIODS = ['Today', 'Last 7 days', 'Last 30 days'] as const
type OverviewPeriod = typeof OVERVIEW_PERIODS[number]

// TODO: replace PERIOD_DATA with a real /api/admin/analytics endpoint when available
const PERIOD_DATA: Record<OverviewPeriod, {
  revenue:  { value: string; change: string; up: boolean; sub: string }
  orders:   { value: string; change: string; up: boolean; sub: string }
  sales:    { value: string; change: string; up: boolean; sub: string }
  chartData:   number[]
  chartLabels: string[]
  topSellers: Array<{ rank: number; name: string; category: string; revenue: number; sold: number; image: string }>
}> = {
  Today: {
    revenue:  { value: '₹12,400',  change: '+6.2%',  up: true, sub: 'total today' },
    orders:   { value: '28',       change: '+12.5%', up: true, sub: 'placed today' },
    sales:    { value: '24',       change: '+8.3%',  up: true, sub: 'delivered today' },
    chartData:   [3, 5, 8, 12, 7, 9, 11, 8],
    chartLabels: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'],
    topSellers: [
      { rank: 1, name: 'Tenkasi Local Mango', category: 'Mangoes',         revenue: 560, sold: 2, image: '/images/categories/mangoes.jpg' },
      { rank: 2, name: 'Fresh Rambutan',      category: 'Imported Fruits', revenue: 440, sold: 2, image: '/images/products/wa2-rambutan.jpeg' },
      { rank: 3, name: 'Ruby Pomegranate',    category: 'Imported Fruits', revenue: 480, sold: 2, image: '/images/categories/p-pomegranate.jpg' },
      { rank: 4, name: 'Dragon Fruit',        category: 'Imported Fruits', revenue: 380, sold: 1, image: '/images/products/wa2-dragon-fruit.jpeg' },
    ],
  },
  'Last 7 days': {
    revenue:  { value: '₹84,600',  change: '+18.4%', up: true, sub: 'vs prev week' },
    orders:   { value: '212',      change: '+9.2%',  up: true, sub: 'placed' },
    sales:    { value: '198',      change: '+11.4%', up: true, sub: 'delivered' },
    chartData:   [10, 14, 9, 18, 12, 22, 16],
    chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    topSellers: [
      { rank: 1, name: 'Tenkasi Local Mango', category: 'Mangoes',         revenue: 3267, sold: 12, image: '/images/categories/mangoes.jpg' },
      { rank: 2, name: 'Fresh Rambutan',      category: 'Imported Fruits', revenue: 2053, sold: 9,  image: '/images/products/wa2-rambutan.jpeg' },
      { rank: 3, name: 'Ruby Pomegranate',    category: 'Imported Fruits', revenue: 1904, sold: 8,  image: '/images/categories/p-pomegranate.jpg' },
      { rank: 4, name: 'Dragon Fruit',        category: 'Imported Fruits', revenue: 1773, sold: 5,  image: '/images/products/wa2-dragon-fruit.jpeg' },
    ],
  },
  'Last 30 days': {
    revenue:  { value: '₹4.82 L',  change: '+22.1%', up: true, sub: 'vs prev month' },
    orders:   { value: '1,284',    change: '+15.3%', up: true, sub: 'placed' },
    sales:    { value: '1,190',    change: '+14.8%', up: true, sub: 'delivered' },
    chartData:   [8,12,10,15,11,18,14,20,16,22,19,25,21,17,23,28,24,26,22,29,18,24,27,30,25,28,26,31,29,33],
    chartLabels: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'],
    topSellers: [
      { rank: 1, name: 'Tenkasi Local Mango', category: 'Mangoes',         revenue: 14000, sold: 50, image: '/images/categories/mangoes.jpg' },
      { rank: 2, name: 'Fresh Rambutan',      category: 'Imported Fruits', revenue: 8800,  sold: 40, image: '/images/products/wa2-rambutan.jpeg' },
      { rank: 3, name: 'Ruby Pomegranate',    category: 'Imported Fruits', revenue: 8160,  sold: 34, image: '/images/categories/p-pomegranate.jpg' },
      { rank: 4, name: 'Dragon Fruit',        category: 'Imported Fruits', revenue: 7600,  sold: 20, image: '/images/products/wa2-dragon-fruit.jpeg' },
    ],
  },
}

// Static fallback inventory for demo mode
const INVENTORY_INIT: InventoryRow[] = [
  { id: '1',  name: 'Tenkasi Local Mango',     category: 'Mangoes',         price: 280,  stock: 142, image: '/images/categories/mangoes.jpg',          discount: 10 },
  { id: '2',  name: 'Fresh Rambutan',          category: 'Imported Fruits', price: 220,  stock: 8,   image: '/images/products/wa2-rambutan.jpeg',        discount: 0  },
  { id: '3',  name: 'Ruby Pomegranate',        category: 'Imported Fruits', price: 240,  stock: 0,   image: '/images/categories/p-pomegranate.jpg',      discount: 15 },
  { id: '4',  name: 'Green Rose Apple',        category: 'Organic Fruits',  price: 120,  stock: 65,  image: '/images/products/wa2-green-jambu.jpeg',     discount: 0  },
  { id: '5',  name: 'Soursop (Sitaphal)',       category: 'Seasonal Fruits', price: 180,  stock: 34,  image: '/images/products/wa2-soursop.jpeg',         discount: 20 },
  { id: '6',  name: 'Passion Fruit',           category: 'Imported Fruits', price: 260,  stock: 12,  image: '/images/products/wa2-passion-fruit.jpeg',   discount: 0  },
  { id: '7',  name: 'Pongal Festival Basket',  category: 'Fruit Baskets',   price: 1450, stock: 22,  image: '/images/categories/fruit-baskets.jpg',      discount: 5  },
  { id: '8',  name: 'Premium Durian',          category: 'Imported Fruits', price: 1800, stock: 38,  image: '/images/products/wa2-durian.jpeg',          discount: 0  },
  { id: '17', name: 'Wild Jackfruit',            category: 'Seasonal Fruits', price: 160,  stock: 45,  image: '/images/products/wa2-Iyany.jpeg',           discount: 0  },
  { id: '18', name: 'Nendran Banana',          category: 'Organic Fruits',  price: 60,   stock: 200, image: '/images/categories/banana.jpg',             discount: 5  },
]

const ORDERS_STATIC = [
  { id: '#TF-1284', customer: 'Priya Sharma', date: '21 May 2026', items: 3, amount: 640,  status: 'Delivered',  address: '12, Anna Nagar, Chennai – 600 040' },
  { id: '#TF-1283', customer: 'Murugan P.',   date: '21 May 2026', items: 2, amount: 1240, status: 'Confirmed', address: '45, Ganesh St, Madurai – 625 001' },
  { id: '#TF-1282', customer: 'Kavitha R.',   date: '20 May 2026', items: 1, amount: 320,  status: 'Delivered',  address: '7, RS Puram, Coimbatore – 641 002' },
  { id: '#TF-1281', customer: 'Ravi Kumar',   date: '20 May 2026', items: 4, amount: 850,  status: 'Delivered',  address: '3, Main Rd, Tenkasi – 627 811' },
]

const DELIVERIES = [
  { id: '#TF-1283', customer: 'Murugan P.',   area: 'Madurai',    address: '45, Ganesh St, Madurai – 625 001',             driver: 'Selvam R.',  eta: '2:30 PM', status: 'In Transit' },
  { id: '#TF-1277', customer: 'Vijaya L.',     area: 'Chennai',    address: '12, Anna Nagar, Chennai – 600 040',            driver: 'Arjun M.',   eta: '3:15 PM', status: 'In Transit' },
  { id: '#TF-1280', customer: 'Anitha S.',     area: 'Coimbatore', address: '7, RS Puram, Coimbatore – 641 002',            driver: 'Kumar S.',   eta: 'Done',    status: 'Delivered' },
  { id: '#TF-1284', customer: 'Priya Sharma',  area: 'Trichy',     address: '3, Srirangam Rd, Trichy – 620 006',           driver: 'Assigning…', eta: '4:00 PM', status: 'Pending' },
  { id: '#TF-1278', customer: 'Ramesh B.',     area: 'Salem',      address: '18, Omalur Main Rd, Salem – 636 004',         driver: 'Bala T.',    eta: 'Done',    status: 'Delivered' },
]

const FARMERS = [
  { id: '1', name: 'Murugesan P.', village: 'Tenkasi',        produce: 'Mango, Banana',            supply: '800 kg/wk', rating: 4.9, phone: '+91 94433 00001', active: true },
  { id: '2', name: 'Rajan T.',     village: 'Courtallam',     produce: 'Guava, Papaya',            supply: '450 kg/wk', rating: 4.7, phone: '+91 94433 00002', active: true },
  { id: '3', name: 'Selvam K.',    village: 'Alangulam',      produce: 'Banana, Jackfruit',        supply: '600 kg/wk', rating: 4.8, phone: '+91 94433 00003', active: true },
  { id: '4', name: 'Lakshmi A.',   village: 'Kadayanallur',   produce: 'Pomegranate, Grapes',      supply: '300 kg/wk', rating: 4.6, phone: '+91 94433 00004', active: false },
  { id: '5', name: 'Kumar M.',     village: 'Sankarankovil',  produce: 'Watermelon, Pineapple',    supply: '500 kg/wk', rating: 4.5, phone: '+91 94433 00005', active: true },
  { id: '6', name: 'Pandian S.',   village: 'Tirunelveli',    produce: 'Dry Fruits, Seasonal',     supply: '250 kg/wk', rating: 4.7, phone: '+91 94433 00006', active: true },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stockStatus(stock: number) {
  if (stock === 0) return { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' }
  if (stock < 20)  return { label: 'Low Stock',    cls: 'bg-amber-100 text-amber-700' }
  return                  { label: 'In Stock',     cls: 'bg-emerald-100 text-emerald-700' }
}

function orderStatusStyle(status: string) {
  const map: Record<string, string> = {
    Delivered:  'bg-emerald-100 text-emerald-700',
    Confirmed: 'bg-blue-100 text-blue-700',
    Pending:    'bg-amber-100 text-amber-700',
    Cancelled:  'bg-red-100 text-red-700',
    Shipped:    'bg-indigo-100 text-indigo-700',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function deliveryStatusStyle(status: string) {
  const map: Record<string, string> = {
    'In Transit': 'bg-blue-100 text-blue-700',
    Delivered:    'bg-emerald-100 text-emerald-700',
    Pending:      'bg-amber-100 text-amber-700',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <TiIcon key={s} name="star" size={12} className={s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'} />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  )
}

// ─── Map API → inventory row ──────────────────────────────────────────────────

type InventoryRow = { id: string; name: string; nameTa?: string | null; category: string; price: number; originalPrice?: number; stock: number; image: string; discount?: number; descriptionEn?: string | null; aboutEn?: string | null; usageEn?: string | null; benefitsEn?: string | null }

function mapApiProduct(p: ProductDto): InventoryRow {
  const primary = (p.images ?? []).find((i) => i.isPrimary) ?? (p.images ?? [])[0]
  return {
    id: p.id,
    name: p.nameEn ?? '',
    nameTa: p.nameTa,
    category: p.category?.nameEn ?? '',
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    stock: p.stockQuantity,
    image: primary?.url ?? '/images/categories/mangoes.jpg',
    descriptionEn: p.descriptionEn,
    aboutEn: p.aboutEn,
    usageEn: p.usageEn,
    benefitsEn: p.benefitsEn,
  }
}

// ─── Image Upload Field ───────────────────────────────────────────────────────

function ProductImageField({
  value,
  onChange,
  onUploadingChange,
}: {
  value: string
  onChange: (url: string) => void
  onUploadingChange: (v: boolean) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (isApiMode()) {
      setUploading(true)
      onUploadingChange(true)
      setUploadError(null)
      try {
        const url = await uploadProductImage(file)
        onChange(url)
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Upload failed')
      } finally {
        setUploading(false)
        onUploadingChange(false)
      }
    } else {
      onChange(URL.createObjectURL(file))
    }
  }

  function handleRemove() {
    onChange('')
    setUploadError(null)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Product Image <span className="text-gray-400 font-normal">(optional)</span>
      </label>
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => void handleFile(e)} className="hidden" aria-label="Upload product image" />
      {uploading ? (
        <div className="flex items-center gap-3 py-4 px-3 border border-gray-200 rounded-xl">
          <div className="w-5 h-5 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span className="text-sm text-gray-500">Uploading image…</span>
        </div>
      ) : value ? (
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f5f0e8] flex-shrink-0 border border-gray-200">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-1.5">
            <button type="button" onClick={() => inputRef.current?.click()} className="px-4 py-2 border border-[#2f6a4a] text-[#2f6a4a] rounded-lg text-sm font-medium hover:bg-[#2f6a4a]/5 transition">
              Change Image
            </button>
            <button type="button" onClick={handleRemove} className="px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm hover:border-red-300 hover:text-red-500 transition">
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-[#2f6a4a] hover:text-[#2f6a4a] transition"
        >
          <TiIcon name="import" size={24} />
          <span className="font-medium">Click to choose from device</span>
          <span className="text-xs text-gray-300">JPG, PNG, WEBP supported</span>
        </button>
      )}
      {uploadError && (
        <p className="mt-1.5 text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  )
}

// ─── Add Product Modal ────────────────────────────────────────────────────────

function AddProductModal({
  onClose,
  onSave,
  apiCategories,
}: {
  onClose: () => void
  onSave: (p: InventoryRow) => void
  apiCategories: CategoryDto[]
}) {
  const defaultCatId = apiCategories[0]?.id ?? ''
  const [form, setForm] = useState({
    nameEn: '', nameTa: '', categoryId: defaultCatId,
    price: '', originalPrice: '', stock: '', image: '', description: '',
    aboutEn: '', usageEn: '', benefitsEn: '',
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }))
  }

  async function handleSave() {
    if (!form.nameEn || !form.price || !form.stock) return
    setSaving(true)
    setSaveError('')

    const stockNum = Number(form.stock)
    const cat = apiCategories.find((c) => c.id === form.categoryId)

    if (isApiMode() && getStoredToken()) {
      try {
        const dto = await api.post<ProductDto>('/api/admin/products', {
          nameEn: form.nameEn,
          nameTa: form.nameTa || null,
          descriptionEn: form.description || null,
          descriptionTa: null,
          aboutEn: form.aboutEn || null,
          aboutTa: null,
          usageEn: form.usageEn || null,
          usageTa: null,
          benefitsEn: form.benefitsEn || null,
          benefitsTa: null,
          price: Number(form.price),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
          stockQuantity: stockNum,
          categoryId: form.categoryId,
          images: form.image ? [{ url: form.image, altText: form.nameEn, isPrimary: true }] : [],
        })
        if (stockNum < 20) void notifyLowStock({ name: form.nameEn, stock: stockNum, category: cat?.nameEn })
        setSaved(true)
        setTimeout(() => { onSave(mapApiProduct(dto)); onClose() }, 900)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to save product'
        setSaveError(msg)
        setSaving(false)
      }
      return
    }

    // Demo fallback
    if (stockNum < 20) void notifyLowStock({ name: form.nameEn, stock: stockNum, category: cat?.nameEn })
    setSaved(true)
    setTimeout(() => {
      onSave({
        id: String(Date.now()),
        name: form.nameEn,
        category: cat?.nameEn ?? form.categoryId,
        price: Number(form.price),
        stock: stockNum,
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
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900">Add New Product</h2>
            <p className="text-gray-400 text-xs mt-0.5">Fill in the details below to add to inventory</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close">
            <TiIcon name="close" size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name (English) <span className="text-red-500">*</span></label>
            <input type="text" value={form.nameEn} onChange={set('nameEn')} placeholder="e.g. Alphonso Mango" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tamil Name</label>
            <input type="text" value={form.nameTa} onChange={set('nameTa')} placeholder="e.g. ஆல்பன்சோ மாம்பழம்" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            {apiCategories.length > 0 ? (
              <select value={form.categoryId} onChange={set('categoryId')} title="Category" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition bg-white appearance-none">
                {apiCategories.map((c) => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
              </select>
            ) : (
              <input type="text" value={form.categoryId} onChange={set('categoryId')} placeholder="Category name" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
              <input type="number" value={form.price} onChange={set('price')} placeholder="0" min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">MRP (₹) <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="number" value={form.originalPrice} onChange={set('originalPrice')} placeholder="0" min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock (units) <span className="text-red-500">*</span></label>
              <input type="number" value={form.stock} onChange={set('stock')} placeholder="0" min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
          </div>
          <ProductImageField value={form.image} onChange={(url) => setForm((p) => ({ ...p, image: url }))} onUploadingChange={setUploading} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={form.description} onChange={set('description')} placeholder="Brief description of the product…" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">About <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={form.aboutEn} onChange={set('aboutEn')} placeholder="Background, origin, farming story…" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">How to Use <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={form.usageEn} onChange={set('usageEn')} placeholder="Storage, preparation, serving suggestions…" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Benefits <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={form.benefitsEn} onChange={set('benefitsEn')} placeholder="Health benefits, nutritional highlights…" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition resize-none" />
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-gray-100 space-y-3">
          {saveError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{saveError}</p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!form.nameEn || !form.price || !form.stock || (isApiMode() && !form.categoryId) || saving || uploading}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                saved ? 'bg-emerald-500 text-white' : 'bg-[#2f6a4a] text-white hover:bg-[#1f4a2f] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {saved ? '✓ Product Added!' : saving ? 'Saving…' : uploading ? 'Uploading…' : 'Save Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Edit Product Modal ───────────────────────────────────────────────────────

function EditProductModal({
  product,
  onClose,
  onSave,
  apiCategories,
}: {
  product: InventoryRow
  onClose: () => void
  onSave: (p: InventoryRow) => void
  apiCategories: CategoryDto[]
}) {
  const matchedCatId = apiCategories.find((c) => c.nameEn === product.category)?.id ?? product.category
  const [form, setForm] = useState({
    nameEn: product.name,
    nameTa: product.nameTa ?? '',
    categoryId: matchedCatId,
    price: String(product.price),
    originalPrice: product.originalPrice ? String(product.originalPrice) : '',
    stock: String(product.stock),
    image: product.image,
    description: product.descriptionEn ?? '',
    aboutEn: product.aboutEn ?? '',
    usageEn: product.usageEn ?? '',
    benefitsEn: product.benefitsEn ?? '',
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }))
  }

  async function handleSave() {
    if (!form.nameEn || !form.price || !form.stock) return
    setSaving(true)
    setSaveError('')

    const stockNum = Number(form.stock)
    const cat = apiCategories.find((c) => c.id === form.categoryId)

    if (isApiMode() && getStoredToken()) {
      try {
        const dto = await api.put<ProductDto>(`/api/admin/products/${product.id}`, {
          nameEn: form.nameEn,
          nameTa: form.nameTa || null,
          descriptionEn: form.description || null,
          descriptionTa: null,
          aboutEn: form.aboutEn || null,
          aboutTa: null,
          usageEn: form.usageEn || null,
          usageTa: null,
          benefitsEn: form.benefitsEn || null,
          benefitsTa: null,
          price: Number(form.price),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
          stockQuantity: stockNum,
          categoryId: form.categoryId,
          images: form.image ? [{ url: form.image, altText: form.nameEn, isPrimary: true }] : [],
        })
        if (stockNum < 20) void notifyLowStock({ name: form.nameEn, stock: stockNum, category: cat?.nameEn })
        setSaved(true)
        setTimeout(() => { onSave(mapApiProduct(dto)); onClose() }, 900)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to save product'
        setSaveError(msg)
        setSaving(false)
      }
      return
    }

    if (stockNum < 20) void notifyLowStock({ name: form.nameEn, stock: stockNum, category: cat?.nameEn })
    setSaved(true)
    setTimeout(() => {
      onSave({
        ...product,
        name: form.nameEn,
        category: cat?.nameEn ?? form.categoryId,
        price: Number(form.price),
        stock: stockNum,
        image: form.image,
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
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900">Edit Product</h2>
            <p className="text-gray-400 text-xs mt-0.5">Update the details for {product.name}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close">
            <TiIcon name="close" size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
            <input type="text" value={form.nameEn} onChange={set('nameEn')} placeholder="e.g. Alphonso Mango" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tamil Name</label>
            <input type="text" value={form.nameTa} onChange={set('nameTa')} placeholder="e.g. ஆல்பன்சோ மாம்பழம்" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            {apiCategories.length > 0 ? (
              <select value={form.categoryId} onChange={set('categoryId')} title="Category" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition bg-white appearance-none">
                {apiCategories.map((c) => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
              </select>
            ) : (
              <input type="text" value={form.categoryId} onChange={set('categoryId')} placeholder="Category name" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
              <input type="number" value={form.price} onChange={set('price')} min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">MRP (₹) <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="number" value={form.originalPrice} onChange={set('originalPrice')} placeholder="0" min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock (units) <span className="text-red-500">*</span></label>
              <input type="number" value={form.stock} onChange={set('stock')} min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
          </div>
          <ProductImageField value={form.image} onChange={(url) => setForm((p) => ({ ...p, image: url }))} onUploadingChange={setUploading} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={form.description} onChange={set('description')} placeholder="Brief description of the product…" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">About <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={form.aboutEn} onChange={set('aboutEn')} placeholder="Background, origin, farming story…" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">How to Use <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={form.usageEn} onChange={set('usageEn')} placeholder="Storage, preparation, serving suggestions…" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Benefits <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea value={form.benefitsEn} onChange={set('benefitsEn')} placeholder="Health benefits, nutritional highlights…" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition resize-none" />
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-gray-100 space-y-3">
          {saveError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{saveError}</p>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={!form.nameEn || !form.price || !form.stock || saving || uploading}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                saved ? 'bg-emerald-500 text-white' : 'bg-[#2f6a4a] text-white hover:bg-[#1f4a2f] disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {saved ? '✓ Saved!' : saving ? 'Saving…' : uploading ? 'Uploading…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Overview stats from real orders ─────────────────────────────────────────

function buildApiStats(orders: OrderDto[], period: OverviewPeriod) {
  const now = new Date()
  const dayMs = 864e5

  function filterRange(daysBack: number, endDaysBack: number) {
    const endMs = endDaysBack === 0 ? now.getTime() : now.getTime() - endDaysBack * dayMs
    const startMs = now.getTime() - daysBack * dayMs
    return orders.filter((o) => { const t = new Date(o.createdAtUtc).getTime(); return t >= startMs && t <= endMs })
  }
  function todaySet() { return orders.filter((o) => new Date(o.createdAtUtc).toDateString() === now.toDateString()) }
  function yesterdaySet() {
    const y = new Date(now); y.setDate(now.getDate() - 1)
    return orders.filter((o) => new Date(o.createdAtUtc).toDateString() === y.toDateString())
  }

  const cur  = period === 'Today' ? todaySet()  : period === 'Last 7 days' ? filterRange(7, 0)  : filterRange(30, 0)
  const prev = period === 'Today' ? yesterdaySet() : period === 'Last 7 days' ? filterRange(14, 7) : filterRange(60, 30)

  const curRev  = cur.reduce((s, o) => s + o.total, 0)
  const prevRev = prev.reduce((s, o) => s + o.total, 0)
  const curOrd  = cur.length;  const prevOrd  = prev.length
  const curSal  = cur.filter((o) => o.status === 4).length
  const prevSal = prev.filter((o) => o.status === 4).length

  function pct(a: number, b: number) {
    if (b === 0) return { change: a > 0 ? 'new' : '–', up: true as boolean }
    const p = ((a - b) / b) * 100
    return { change: `${p >= 0 ? '+' : ''}${p.toFixed(1)}%`, up: p >= 0 }
  }
  function fmtRev(v: number): string {
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)} L`
    if (v >= 1000)   return `₹${v.toLocaleString('en-IN')}`
    return `₹${v}`
  }

  // Chart
  let chartData: number[] = []; let chartLabels: string[] = []
  if (period === 'Today') {
    const b: Record<number, number> = {}
    cur.forEach((o) => { const h = new Date(o.createdAtUtc).getHours(); b[h] = (b[h] ?? 0) + o.total })
    for (let h = 8; h <= Math.max(16, now.getHours()); h++) {
      chartLabels.push(h === 12 ? '12pm' : h < 12 ? `${h}am` : `${h - 12}pm`)
      chartData.push(+(((b[h] ?? 0) / 1000).toFixed(1)))
    }
  } else {
    const b: Record<string, number> = {}
    cur.forEach((o) => { const k = new Date(o.createdAtUtc).toDateString(); b[k] = (b[k] ?? 0) + o.total })
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const count = period === 'Last 7 days' ? 7 : 30
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i)
      chartLabels.push(period === 'Last 7 days' ? DAYS[d.getDay()] : String(d.getDate()))
      chartData.push(+(((b[d.toDateString()] ?? 0) / 1000).toFixed(1)))
    }
  }

  // Top sellers
  const pm: Record<string, { name: string; revenue: number; sold: number }> = {}
  cur.forEach((o) =>
    (o.items ?? []).forEach((item) => {
      if (!pm[item.productId]) pm[item.productId] = { name: item.productName ?? '–', revenue: 0, sold: 0 }
      pm[item.productId].revenue += item.unitPrice * item.quantity
      pm[item.productId].sold   += item.quantity
    }),
  )
  const topSellers = Object.values(pm)
    .sort((a, b) => b.revenue - a.revenue).slice(0, 4)
    .map((v, i) => ({ rank: i + 1, name: v.name, category: '–', revenue: Math.round(v.revenue), sold: v.sold, image: '/images/categories/mangoes.jpg' }))

  const sub = period === 'Today' ? 'today' : period === 'Last 7 days' ? 'vs prev week' : 'vs prev month'
  return {
    revenue:    { value: fmtRev(curRev), ...pct(curRev, prevRev), sub: `total · ${sub}` },
    orders:     { value: String(curOrd), ...pct(curOrd, prevOrd), sub: `placed · ${sub}` },
    sales:      { value: String(curSal), ...pct(curSal, prevSal), sub: `delivered · ${sub}` },
    chartData, chartLabels,
    topSellers: topSellers.length > 0 ? topSellers : PERIOD_DATA[period].topSellers,
  }
}

// ─── Panel: Overview ──────────────────────────────────────────────────────────

function OverviewPanel() {
  const [period, setPeriod] = useState<OverviewPeriod>('Last 7 days')
  const [apiOrders, setApiOrders] = useState<OrderDto[]>([])
  const [apiLoading, setApiLoading] = useState(isApiMode())

  useEffect(() => {
    if (!isApiMode() || !getStoredToken()) return
    api.get<OrderDtoPagedResult>('/api/admin/orders?pageSize=500')
      .then((r) => setApiOrders(r.items ?? []))
      .catch(() => {})
      .finally(() => setApiLoading(false))
  }, [])

  // Auto-send daily report on first admin visit after 8 AM
  useEffect(() => {
    const today = PERIOD_DATA['Today']
    void maybeSendDailyReport({
      revenue:    today.revenue.value,
      orders:     today.orders.value,
      delivered:  today.sales.value,
      topProduct: today.topSellers[0]?.name ?? 'N/A',
    })
  }, [])

  const data = isApiMode() && !apiLoading ? buildApiStats(apiOrders, period) : PERIOD_DATA[period]
  const chartMax = data.chartData.length > 0 ? Math.max(...data.chartData) || 1 : 1
  const recentOrders = apiOrders.slice(0, 3)

  return (
    <div className="p-4 sm:p-6">
      {/* Header + period filter */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#2f6a4a] uppercase mb-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Overview</h1>
          <p className="text-gray-500 text-sm">
            {isApiMode() ? `${apiOrders.length} orders loaded from DB` : '3 trucks loading · 84 orders queued'}
          </p>
        </div>
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5 self-start flex-shrink-0">
          {OVERVIEW_PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                period === p ? 'bg-[#2f6a4a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 3 stat cards: Revenue · Total Orders · Total Sales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {([
          { label: 'Revenue',      ...data.revenue },
          { label: 'Total Orders', ...data.orders },
          { label: 'Total Sales',  ...data.sales },
        ] as const).map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-2">{stat.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {stat.up
                ? <TiIcon name="stats-up" size={14} className="text-emerald-500" />
                : <TiIcon name="stats-down" size={14} className="text-red-500" />
              }
              <span className={`text-sm font-semibold ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>{stat.change}</span>
              <span className="text-xs text-gray-400 hidden sm:inline">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live API orders banner */}
      {recentOrders.length > 0 && (
        <div className="mb-4 bg-[#e7f3ec] border border-[#2f6a4a]/20 rounded-xl p-4">
          <p className="text-xs font-bold text-[#2f6a4a] uppercase tracking-widest mb-2">
            Recent Orders ({apiOrders.length} total)
          </p>
          <div className="space-y-2">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-sm">
                <span className="font-mono text-xs font-semibold text-gray-600">
                  {o.orderNumber ?? o.id.slice(0, 8)}
                </span>
                <span className="font-bold text-gray-900 ml-auto">₹{o.total.toFixed(2)}</span>
                <span className={`ml-3 text-xs px-2 py-0.5 rounded-full font-semibold ${orderStatusStyle(ORDER_STATUS[o.status] ?? 'Pending')}`}>
                  {ORDER_STATUS[o.status] ?? 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day-by-day sales chart + Top sellers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Day-by-day sales</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {period === 'Today'
                ? 'Hourly · today · ₹ in thousands'
                : period === 'Last 7 days'
                  ? 'Daily · Mon – Sun · ₹ in thousands'
                  : 'Daily · last 30 days · ₹ in thousands'}
            </p>
          </div>
          <div className="flex items-end gap-0.5 sm:gap-1 h-36 sm:h-40">
            {data.chartData.map((val, i) => {
              const showLabel = data.chartLabels.length <= 12 || i % 5 === 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div
                    className="w-full rounded-t-sm bg-[#2f6a4a] opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${(val / chartMax) * 100}%` }}
                    title={`${data.chartLabels[i]}: ₹${val}k`}
                  />
                  <span className={`text-[8px] sm:text-[9px] text-gray-400 ${showLabel ? '' : 'invisible'}`}>
                    {data.chartLabels[i]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Top selling products</h3>
          <div className="space-y-3">
            {data.topSellers.map((item) => (
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

// ─── Panel: Inventory ─────────────────────────────────────────────────────────

function InventoryPanel() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<InventoryRow | null>(null)
  const [inventory, setInventory] = useState<InventoryRow[]>(isApiMode() ? [] : INVENTORY_INIT)
  const [apiCategories, setApiCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(isApiMode())
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!isApiMode() || !getStoredToken()) return
    Promise.all([
      api.get<ProductDtoPagedResult>('/api/admin/products?PageSize=100'),
      api.get<CategoryDto[]>('/api/admin/categories'),
    ])
      .then(([products, cats]) => {
        setInventory((products.items ?? []).map(mapApiProduct))
        setApiCategories(cats)
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to load inventory'
        setLoadError(msg)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = inventory.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()),
  )

  function handleAddProduct(p: InventoryRow) {
    setInventory((prev) => [p, ...prev])
  }

  function handleEditProduct(p: InventoryRow) {
    setInventory((prev) => prev.map((item) => (item.id === p.id ? p : item)))
  }

  function handleDelete(id: string) {
    if (isApiMode() && getStoredToken()) {
      void api.delete(`/api/admin/products/${id}`)
    }
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
          <TiIcon name="plus" size={15} />
          Add Product
        </button>
      </div>

      <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 gap-2 w-full sm:w-72 mb-5">
        <TiIcon name="search" size={15} className="text-gray-400 flex-shrink-0" />
        <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
      </div>

      {loadError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Failed to load inventory: {loadError}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
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
                      {item.stock > 0 && item.stock < 20 && <TiIcon name="alert" size={12} className="inline ml-1 text-amber-500" />}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>{s.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button type="button" onClick={() => setEditingProduct(item)} className="p-1.5 text-gray-400 hover:text-[#2f6a4a] hover:bg-[#e7f3ec] rounded-lg transition-colors" aria-label="Edit"><TiIcon name="pencil" size={14} /></button>
                        <button type="button" onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete"><TiIcon name="trash" size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSave={handleAddProduct}
          apiCategories={apiCategories}
        />
      )}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditProduct}
          apiCategories={apiCategories}
        />
      )}
    </div>
  )
}

// ─── Panel: Orders ────────────────────────────────────────────────────────────

function OrdersPanel() {
  const [filter, setFilter] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [apiOrders, setApiOrders] = useState<OrderDto[]>([])
  const [loading, setLoading] = useState(isApiMode())
  const [loadError, setLoadError] = useState('')
  const statuses = ['All', 'Confirmed', 'Pending', 'Shipped', 'Delivered', 'Cancelled']

  useEffect(() => {
    if (!isApiMode() || !getStoredToken()) return
    api.get<OrderDtoPagedResult>('/api/admin/orders?pageSize=100')
      .then((r) => setApiOrders(r.items ?? []))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to load orders'
        setLoadError(msg)
      })
      .finally(() => setLoading(false))
  }, [])

  // Merge: API orders first, then static demo orders
  const allOrders = isApiMode()
    ? apiOrders.map((o) => ({
        id: o.orderNumber ?? o.id.slice(0, 8).toUpperCase(),
        rawId: o.id,
        customer: `Order ${o.orderNumber ?? o.id.slice(0, 6)}`,
        date: new Date(o.createdAtUtc).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        itemCount: (o.items ?? []).length,
        amount: o.total,
        status: ORDER_STATUS[o.status] ?? 'Pending',
        items: o.items ?? [],
        address: '',
        isReal: true,
      }))
    : ORDERS_STATIC.map((o) => ({
        id: o.id,
        rawId: o.id,
        customer: o.customer,
        date: o.date,
        itemCount: o.items,
        amount: o.amount,
        status: o.status,
        items: [] as OrderDto['items'],
        address: o.address,
        isReal: false,
      }))

  const filtered = filter === 'All' ? allOrders : allOrders.filter((o) => o.status === filter)
  const processingCount = allOrders.filter((o) => o.status === 'Confirmed').length

  const statusIcon = (s: string) => {
    if (s === 'Delivered')  return <TiIcon name="check-box" size={13} className="text-emerald-500" />
    if (s === 'Confirmed') return <TiIcon name="time" size={13} className="text-blue-500" />
    if (s === 'Cancelled')  return <TiIcon name="close" size={13} className="text-red-500" />
    return <TiIcon name="alert" size={13} className="text-amber-500" />
  }

  async function handleStatusChange(rawId: string, newStatus: number) {
    if (!isApiMode() || !getStoredToken()) return
    try {
      await api.patch<OrderDto>(`/api/admin/orders/${rawId}/status`, { status: newStatus })
      setApiOrders((prev) =>
        prev.map((o) => (o.id === rawId ? { ...o, status: newStatus } : o)),
      )
    } catch { /* ignore */ }
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {allOrders.length} orders · {processingCount} in progress
        </p>
      </div>
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button type="button" key={s} onClick={() => setFilter(s)} className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ${filter === s ? 'bg-[#2f6a4a] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>
      {loadError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Failed to load orders: {loadError}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Date</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <Fragment key={order.id}>
                  <tr className={`hover:bg-gray-50/50 transition-colors ${order.isReal ? 'bg-[#f9fef9]' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">
                      <div className="flex items-center gap-1.5">
                        {order.id}
                        {order.isReal && <span className="w-1.5 h-1.5 rounded-full bg-[#2f6a4a] flex-shrink-0" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{order.date}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{order.itemCount ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">₹{order.amount.toFixed ? order.amount.toFixed(2) : order.amount}</td>
                    <td className="px-4 py-3 text-center">
                      {order.isReal && isApiMode() ? (
                        <select
                          value={Object.entries(ORDER_STATUS).find(([, v]) => v === order.status)?.[0] ?? '2'}
                          onChange={(e) => void handleStatusChange(order.rawId, Number(e.target.value))}
                          title="Order status"
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 outline-none cursor-pointer ${orderStatusStyle(order.status)}`}
                        >
                          {Object.entries(ORDER_STATUS).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${orderStatusStyle(order.status)}`}>
                          {statusIcon(order.status)}
                          <span className="hidden sm:inline">{order.status}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        className={`p-1.5 rounded-lg transition-colors ${expandedId === order.id ? 'text-[#2f6a4a] bg-[#e7f3ec]' : 'text-gray-400 hover:text-[#2f6a4a] hover:bg-[#e7f3ec]'}`}
                        aria-label="View order details"
                      >
                        <TiIcon name="eye" size={14} />
                      </button>
                    </td>
                  </tr>

                  {expandedId === order.id && (
                    <tr className="bg-[#f5f9f7]">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="space-y-3">
                          {/* Customer address */}
                          {order.address && (
                            <div className="flex items-start gap-2">
                              <TiIcon name="location-pin" size={13} className="text-[#2f6a4a] flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Delivery Address</p>
                                <p className="text-sm text-gray-700">{order.address}</p>
                              </div>
                            </div>
                          )}
                          {/* Items */}
                          {order.items && order.items.length > 0 ? (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Items Ordered</p>
                              <div className="space-y-1.5">
                                {order.items.map((item) => (
                                  <div key={item.productId} className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="font-semibold text-gray-800">{item.quantity}×</span>
                                    <span className="truncate">{item.productName ?? item.productId}</span>
                                    <span className="ml-auto font-semibold text-gray-900 flex-shrink-0">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            !order.address && <p className="text-xs text-gray-400 italic">No details available.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Panel: Delivery ──────────────────────────────────────────────────────────

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
          { label: 'In Transit',      value: inTransit, cls: 'text-blue-600',    bg: 'bg-blue-50',    icon: <TiIcon name="truck" size={18} className="text-blue-500" /> },
          { label: 'Delivered Today', value: delivered, cls: 'text-emerald-600', bg: 'bg-emerald-50', icon: <TiIcon name="check-box" size={18} className="text-emerald-500" /> },
          { label: 'Pending',         value: pending,   cls: 'text-amber-600',   bg: 'bg-amber-50',   icon: <TiIcon name="time" size={18} className="text-amber-500" /> },
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
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Address</th>
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
                  <div className="flex items-start gap-1 text-xs">
                    <TiIcon name="location-pin" size={11} className="text-[#2f6a4a] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-700">{d.area}</p>
                      <p className="text-gray-400">{d.address}</p>
                    </div>
                  </div>
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

// ─── Panel: Farmers ───────────────────────────────────────────────────────────

function FarmersPanel() {
  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Farmers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{FARMERS.length} partner farmers · {FARMERS.filter(f => f.active).length} active this month</p>
        </div>
        <button type="button" className="flex items-center gap-2 bg-[#2f6a4a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1f4a2f] transition-colors self-start sm:self-auto">
          <TiIcon name="plus" size={15} />
          Add Farmer
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total Partners',    value: '240+',  icon: <TiIcon name="shine" size={18} className="text-[#2f6a4a]" /> },
          { label: 'Active This Month', value: '186',   icon: <TiIcon name="stats-up" size={18} className="text-emerald-500" /> },
          { label: 'Avg Rating',        value: '4.7 ★', icon: <TiIcon name="crown" size={18} className="text-amber-500" /> },
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
                    <div className="w-8 h-8 bg-[#e7f3ec] rounded-full flex items-center justify-center flex-shrink-0"><TiIcon name="shine" size={14} className="text-[#2f6a4a]" /></div>
                    <span className="font-medium text-gray-900 text-sm">{f.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell"><div className="flex items-center gap-1"><TiIcon name="location-pin" size={11} />{f.village}</div></td>
                <td className="px-4 py-3 text-gray-600 text-xs">{f.produce}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900 hidden md:table-cell">{f.supply}</td>
                <td className="px-4 py-3 text-center"><Stars rating={f.rating} /></td>
                <td className="px-4 py-3 hidden lg:table-cell"><div className="flex items-center gap-1 text-xs text-gray-500"><TiIcon name="headphone" size={11} />{f.phone}</div></td>
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

// ─── Panel: Settings ──────────────────────────────────────────────────────────

function SettingsPanel() {
  const [saved, setSaved] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [testError, setTestError] = useState('')
  const [notifs, setNotifs] = useState<NotifPrefs>(() => loadPrefs())
  const emailjsReady = isEmailJsConfigured()

  function handleSave() {
    savePrefs(notifs)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleTestEmail() {
    setTestError('')
    if (!emailjsReady) {
      setTestError('EmailJS credentials not configured — see VITE_EMAILJS_* in .env.local')
      return
    }
    try {
      await sendTestEmail()
      setTestSent(true)
      setTimeout(() => setTestSent(false), 3000)
    } catch {
      setTestError('Failed to send test email. Check your EmailJS credentials.')
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-5"><TiIcon name="home" size={18} className="text-[#2f6a4a]" /><h2 className="font-semibold text-gray-900">Business Information</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Shop Name',       value: 'Tenkasi Fresh Fruits' },
            { label: 'Business Email',  value: 'admin@tenakasifresh.com' },
            { label: 'Phone Number',    value: '+91 7094402579' },
            { label: 'GST Number',      value: '33ABCDE1234F1Z5' },
            { label: 'FSSAI License',   value: '22824105000124' },
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
        <div className="flex items-center gap-2 mb-5"><TiIcon name="truck" size={18} className="text-[#2f6a4a]" /><h2 className="font-semibold text-gray-900">Delivery Settings</h2></div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Minimum Order (₹)',          value: '200' },
            { label: 'Standard Delivery Fee (₹)',  value: '49' },
            { label: 'Free Delivery Above (₹)',    value: '599' },
            { label: 'Delivery Radius (km)',        value: '50' },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <input type="number" title={f.label} defaultValue={f.value} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TiIcon name="bell" size={18} className="text-[#2f6a4a]" />
            <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${emailjsReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {emailjsReady ? 'Email Ready' : 'Email Not Configured'}
          </span>
        </div>

        {/* Admin notification email */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Admin Notification Email
          </label>
          <input
            type="email"
            title="Admin notification email"
            value={notifs.adminEmail}
            onChange={(e) => setNotifs((p) => ({ ...p, adminEmail: e.target.value }))}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition"
            placeholder="admin@example.com"
          />
          <p className="text-[11px] text-gray-400 mt-1">All notification emails will be sent to this address.</p>
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-4">
          {[
            { key: 'newOrder' as const,    label: 'New Order Alert',             desc: 'Email when a customer places a new order' },
            { key: 'lowStock' as const,    label: 'Low Stock Alert',             desc: 'Email when a product stock falls below 20 units' },
            { key: 'newCustomer' as const, label: 'New Customer Registration',   desc: 'Email when a new customer signs up' },
            { key: 'dailyReport' as const, label: 'Daily Sales Report (Email)',  desc: 'Morning summary emailed when you open the admin panel after 8 AM' },
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

        {/* EmailJS status banner */}
        {!emailjsReady && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-amber-800 mb-1">EmailJS not configured</p>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Add these to your <span className="font-mono bg-amber-100 px-1 rounded">.env.local</span> file and restart the dev server:
            </p>
            <pre className="text-[10px] text-amber-900 mt-2 font-mono bg-amber-100 rounded p-2 overflow-x-auto leading-relaxed">{`VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
VITE_EMAILJS_TEMPLATE_ORDER=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_STOCK=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_CUSTOMER=template_xxxxxxx
VITE_EMAILJS_TEMPLATE_REPORT=template_xxxxxxx`}</pre>
            <p className="text-[10px] text-amber-600 mt-2">
              Get your credentials free at <span className="font-semibold">emailjs.com</span> → Email Services → Create Service
            </p>
          </div>
        )}

        {/* Test email button */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => void handleTestEmail()}
            disabled={!emailjsReady}
            className="flex items-center gap-2 border border-[#2f6a4a] text-[#2f6a4a] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2f6a4a]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <TiIcon name="email" size={14} />
            {testSent ? 'Test Email Sent!' : 'Send Test Email'}
          </button>
          {testError && <p className="text-xs text-red-600">{testError}</p>}
          {testSent && <p className="text-xs text-[#2f6a4a]">Check {notifs.adminEmail}</p>}
        </div>
      </div>

      <button type="button" onClick={handleSave} className="flex items-center gap-2 bg-[#2f6a4a] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1f4a2f] transition-colors">
        <TiIcon name="save" size={15} />
        {saved ? 'Preferences Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}

// ─── Panel: Discounts (Coupons) ───────────────────────────────────────────────

interface CouponDto {
  id: string
  code: string
  discountAmount: number
  minimumOrderAmount: number
  startsAtUtc: string
  endsAtUtc: string
  isActive: boolean
}

const COUPONS_DEMO: CouponDto[] = [
  { id: 'c1', code: 'FRESH10',  discountAmount: 10,  minimumOrderAmount: 200,  startsAtUtc: '2026-05-01T00:00:00Z', endsAtUtc: '2026-06-30T23:59:59Z', isActive: true },
  { id: 'c2', code: 'MANGO50',  discountAmount: 50,  minimumOrderAmount: 500,  startsAtUtc: '2026-05-15T00:00:00Z', endsAtUtc: '2026-06-15T23:59:59Z', isActive: true },
  { id: 'c3', code: 'WELCOME20', discountAmount: 20, minimumOrderAmount: 300,  startsAtUtc: '2026-01-01T00:00:00Z', endsAtUtc: '2026-12-31T23:59:59Z', isActive: false },
]

function CouponFormModal({
  coupon,
  onClose,
  onSave,
}: {
  coupon: CouponDto | null
  onClose: () => void
  onSave: (c: CouponDto) => void
}) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    code: coupon?.code ?? '',
    discountAmount: String(coupon?.discountAmount ?? ''),
    minimumOrderAmount: String(coupon?.minimumOrderAmount ?? ''),
    startsAtUtc: coupon ? coupon.startsAtUtc.split('T')[0] : today,
    endsAtUtc: coupon ? coupon.endsAtUtc.split('T')[0] : '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [field]: e.target.value }))
  }

  async function handleSave() {
    if (!form.code || !form.discountAmount || !form.endsAtUtc) return
    setSaving(true)
    const body = {
      code: form.code.toUpperCase(),
      discountAmount: Number(form.discountAmount),
      minimumOrderAmount: Number(form.minimumOrderAmount) || 0,
      startsAtUtc: new Date(form.startsAtUtc).toISOString(),
      endsAtUtc: new Date(form.endsAtUtc + 'T23:59:59').toISOString(),
    }
    try {
      if (isApiMode() && getStoredToken()) {
        const dto = coupon
          ? await api.put<CouponDto>(`/api/admin/coupons/${coupon.id}`, body)
          : await api.post<CouponDto>('/api/admin/coupons', body)
        setSaved(true)
        setTimeout(() => { onSave(dto); onClose() }, 800)
      } else {
        setSaved(true)
        setTimeout(() => {
          onSave({ ...body, id: coupon?.id ?? `c${Date.now()}`, isActive: coupon?.isActive ?? true })
          onClose()
        }, 800)
      }
    } catch {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-serif text-xl font-bold text-gray-900">{coupon ? 'Edit Coupon' : 'Add Coupon'}</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close"><TiIcon name="close" size={18} className="text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code <span className="text-red-500">*</span></label>
            <input type="text" value={form.code} onChange={set('code')} placeholder="e.g. FRESH10" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition uppercase" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount (₹) <span className="text-red-500">*</span></label>
              <input type="number" value={form.discountAmount} onChange={set('discountAmount')} placeholder="0" min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Min. Order (₹)</label>
              <input type="number" value={form.minimumOrderAmount} onChange={set('minimumOrderAmount')} placeholder="0" min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Starts</label>
              <input type="date" value={form.startsAtUtc} onChange={set('startsAtUtc')} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Expires <span className="text-red-500">*</span></label>
              <input type="date" value={form.endsAtUtc} onChange={set('endsAtUtc')} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!form.code || !form.discountAmount || !form.endsAtUtc || saving}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-[#2f6a4a] text-white hover:bg-[#1f4a2f] disabled:opacity-40 disabled:cursor-not-allowed'}`}
          >
            {saved ? '✓ Saved!' : coupon ? 'Save Changes' : 'Add Coupon'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DiscountsPanel() {
  const [coupons, setCoupons] = useState<CouponDto[]>(isApiMode() ? [] : COUPONS_DEMO)
  const [loading, setLoading] = useState(isApiMode())
  const [editingCoupon, setEditingCoupon] = useState<CouponDto | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!isApiMode() || !getStoredToken()) return
    api.get<CouponDto[]>('/api/admin/coupons')
      .then((data) => setCoupons(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleSaveCoupon(c: CouponDto) {
    setCoupons((prev) => {
      const exists = prev.some((x) => x.id === c.id)
      return exists ? prev.map((x) => (x.id === c.id ? c : x)) : [c, ...prev]
    })
  }

  async function handleDelete(id: string) {
    if (isApiMode() && getStoredToken()) {
      try { await api.delete(`/api/admin/coupons/${id}`) } catch { return }
    }
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  const activeCoupons = coupons.filter((c) => c.isActive)

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Discounts &amp; Coupons</h1>
          <p className="text-gray-500 text-sm mt-0.5">{activeCoupons.length} active · {coupons.length} total</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingCoupon(null); setShowModal(true) }}
          className="flex items-center gap-2 bg-[#2f6a4a] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1f4a2f] transition-colors self-start sm:self-auto"
        >
          <TiIcon name="plus" size={15} />
          Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-12">No coupons yet.</p>
        ) : (
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Discount</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Min. Order</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Expires</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-gray-900 text-sm">{c.code}</td>
                  <td className="px-4 py-3 text-right font-semibold text-[#2f6a4a]">₹{c.discountAmount}</td>
                  <td className="px-4 py-3 text-right text-gray-600 hidden sm:table-cell">₹{c.minimumOrderAmount}</td>
                  <td className="px-4 py-3 text-center text-gray-500 text-xs hidden md:table-cell">
                    {new Date(c.endsAtUtc).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button type="button" onClick={() => { setEditingCoupon(c); setShowModal(true) }} className="p-1.5 text-gray-400 hover:text-[#2f6a4a] hover:bg-[#e7f3ec] rounded-lg transition-colors" aria-label="Edit"><TiIcon name="pencil" size={14} /></button>
                      <button type="button" onClick={() => void handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete"><TiIcon name="trash" size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <CouponFormModal
          coupon={editingCoupon}
          onClose={() => setShowModal(false)}
          onSave={handleSaveCoupon}
        />
      )}
    </div>
  )
}

// ─── Panel: Baskets / Combos ──────────────────────────────────────────────────

function AddBasketModal({ onClose, onSave }: { onClose: () => void; onSave: (b: BasketEntry) => void }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', items: '' })
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  function setField(f: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [f]: e.target.value }))
  }

  function handleFileAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const urls = files.map((f) => URL.createObjectURL(f))
    setImageUrls((prev) => [...prev, ...urls].slice(0, 6))
    e.target.value = ''
  }

  function removeImage(idx: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleSave() {
    if (!form.name || !form.price) return
    setSaved(true)
    setTimeout(() => {
      onSave({ id: String(Date.now()), name: form.name, description: form.description, price: Number(form.price), images: imageUrls, items: form.items })
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900">Add Basket / Combo</h2>
            <p className="text-gray-400 text-xs mt-0.5">Create a curated fruit basket or combo</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close"><TiIcon name="close" size={18} className="text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Basket Name <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={setField('name')} placeholder="e.g. Pongal Special Hamper" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
            <input type="number" value={form.price} onChange={setField('price')} placeholder="0" min="0" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Items Included</label>
            <input type="text" value={form.items} onChange={setField('items')} placeholder="e.g. Mango × 4, Banana × 6" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={setField('description')} placeholder="Describe the basket…" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#2f6a4a] focus:ring-2 focus:ring-[#2f6a4a]/10 transition resize-none" />
          </div>
          {/* Multi-image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Images <span className="text-gray-400 font-normal">(up to 6 — will be shown as collage)</span>
            </label>
            <label className="block cursor-pointer">
              <div className="w-full px-3 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-center text-gray-500 hover:border-[#2f6a4a] hover:text-[#2f6a4a] transition">
                + Add images from device
              </div>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileAdd} />
            </label>
            {imageUrls.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-3">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img src={url} alt={`img ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center" aria-label="Remove">
                      <TiIcon name="close" size={10} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {imageUrls.length > 1 && (
              <div className="mt-3">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1.5">Collage preview</p>
                <div className="w-40">
                  <ImageCollage images={imageUrls} name={form.name || 'Basket'} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button type="button" onClick={handleSave} disabled={!form.name || !form.price} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-[#2f6a4a] text-white hover:bg-[#1f4a2f] disabled:opacity-40 disabled:cursor-not-allowed'}`}>
            {saved ? '✓ Basket Added!' : 'Save Basket'}
          </button>
        </div>
      </div>
    </div>
  )
}

function BasketsPanel() {
  const { baskets, addBasket, removeBasket } = useBaskets()
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Baskets &amp; Combos</h1>
          <p className="text-gray-500 text-sm mt-0.5">{baskets.length} active baskets · Multiple images collaged automatically</p>
        </div>
        <button type="button" onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-[#2f6a4a] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1f4a2f] transition-colors self-start sm:self-auto">
          <TiIcon name="plus" size={15} />
          Add Basket
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {baskets.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <ImageCollage images={b.images.length > 0 ? b.images : ['/images/categories/fruit-baskets.jpg']} name={b.name} />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-serif font-bold text-gray-900 text-sm leading-snug">{b.name}</h3>
                <span className="text-[#2f6a4a] font-bold text-sm flex-shrink-0">₹{b.price}</span>
              </div>
              {b.description && <p className="text-gray-500 text-xs leading-relaxed mb-2 line-clamp-2">{b.description}</p>}
              {b.items && (
                <p className="text-[10px] text-gray-400 bg-gray-50 rounded-lg px-2.5 py-1.5 mb-3 leading-relaxed">
                  <span className="font-semibold text-gray-600">Includes: </span>{b.items}
                </p>
              )}
              <div className="flex items-center gap-2">
                {b.images.length > 1 && (
                  <span className="text-[10px] font-bold text-[#2f6a4a] bg-[#e7f3ec] px-2 py-0.5 rounded-full">
                    <TiIcon name="layers" size={9} className="inline mr-0.5" />{b.images.length} images
                  </span>
                )}
                <button type="button" onClick={() => removeBasket(b.id)} className="ml-auto p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition" aria-label="Delete basket">
                  <TiIcon name="trash" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AddBasketModal
          onClose={() => setShowModal(false)}
          onSave={(b) => { addBasket(b); setShowModal(false) }}
        />
      )}
    </div>
  )
}

// ─── Panel: Seasonal ──────────────────────────────────────────────────────────

function SeasonalPanel() {
  type SeasonalEntry = { id: string; name: string; nameTamil: string; category: string; price: number; unit: string; image: string; isSeasonal: boolean }

  const [products, setProducts] = useState<SeasonalEntry[]>(
    isApiMode() ? [] : PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      nameTamil: p.nameTamil,
      category: p.category,
      price: p.price,
      unit: p.unit,
      image: p.image,
      isSeasonal: p.seasonal === true || p.categorySlug === 'seasonal-fruits',
    })),
  )
  const [loading, setLoading] = useState(isApiMode())
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    if (!isApiMode() || !getStoredToken()) return
    api.get<ProductDtoPagedResult>('/api/admin/products?PageSize=100')
      .then((result) => {
        setProducts((result.items ?? []).map((p) => {
          const primary = (p.images ?? []).find((i) => i.isPrimary) ?? (p.images ?? [])[0]
          return {
            id: p.id,
            name: p.nameEn ?? '',
            nameTamil: p.nameTa ?? '',
            category: p.category?.nameEn ?? '',
            price: p.price,
            unit: 'per unit',
            image: primary?.url ?? '/images/categories/mangoes.jpg',
            isSeasonal: false,
          }
        }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function toggle(id: string) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isSeasonal: !p.isSeasonal } : p)))
  }

  const seasonal    = products.filter((p) => p.isSeasonal)
  const nonSeasonal = products.filter((p) => !p.isSeasonal)

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Seasonal Fruits</h1>
          <p className="text-gray-500 text-sm mt-0.5">{loading ? 'Loading…' : `${seasonal.length} products currently in season`}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#2f6a4a] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1f4a2f] transition-colors self-start sm:self-auto"
        >
          <TiIcon name="plus" size={15} />
          Add Seasonal Product
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && <>
      {/* Currently seasonal */}
      <div className="mb-7">
        <p className="text-[10px] font-bold text-[#2f6a4a] uppercase tracking-widest mb-3">
          Currently in Season ({seasonal.length})
        </p>
        {seasonal.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {seasonal.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-[#2f6a4a]/20 p-3 flex items-center gap-3 shadow-sm">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f5f0e8] flex-shrink-0">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 mb-1">{p.nameTamil}</p>
                  <span className="inline-block text-[10px] font-bold text-[#2f6a4a] bg-[#e7f3ec] px-2 py-0.5 rounded-full">
                    Seasonal · ₹{p.price}/{p.unit}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(p.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                  title="Remove from seasonal"
                >
                  <TiIcon name="close" size={15} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
            <p className="text-amber-700 text-sm font-medium">No seasonal products active right now.</p>
          </div>
        )}
      </div>

      {/* Other products — add to seasonal */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Other Products — mark as seasonal ({nonSeasonal.length})
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nonSeasonal.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 shadow-sm">
              <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#f5f0e8] flex-shrink-0">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(p.id)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-[#2f6a4a] border border-[#2f6a4a]/30 hover:bg-[#e7f3ec] rounded-lg text-xs font-semibold transition flex-shrink-0"
              >
                <TiIcon name="plus" size={12} />
                Season
              </button>
            </div>
          ))}
        </div>
      </div>
      </>}

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSave={(newP) => {
            setProducts((prev) => [
              ...prev,
              {
                id: newP.id,
                name: newP.name,
                nameTamil: '',
                category: newP.category,
                price: newP.price,
                unit: '1 kg',
                image: newP.image || '/images/products/wa2-soursop.jpeg',
                isSeasonal: true,
              },
            ])
            setShowAddModal(false)
          }}
          apiCategories={[]}
        />
      )}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

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
          <div className="bg-[#e8f5ec] rounded-xl p-1 flex-shrink-0">
            <img src="/images/products/Logo.jpeg" alt="Tenkasi Fresh" className="w-8 h-8 rounded-lg object-contain" />
          </div>
          <span className="font-serif text-white font-bold text-sm">Tenkasi Fresh</span>
        </div>
        <p className="text-white/40 text-[10px] tracking-widest uppercase ml-11">Admin Console</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label }) => (
          <button
            type="button"
            key={label}
            onClick={() => { setActiveNav(label); onNavClick?.() }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeNav === label ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/8'
            }`}
          >
            <TiIcon name={NAV_ICONS[label] ?? 'layout'} size={17} />
            {label}
          </button>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-white/30 text-[10px]">v1.0.0 · {isApiMode() ? 'API Mode' : 'Demo Mode'}</p>
      </div>
    </>
  )
}

// ─── Main AdminPage ───────────────────────────────────────────────────────────

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

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={[
        'bg-[#1a3d2b] flex flex-col overflow-y-auto transition-transform duration-300',
        'fixed inset-y-0 left-0 z-50 w-64 md:relative md:w-56 md:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}>
        <SidebarContent activeNav={activeNav} setActiveNav={setActiveNav} onNavClick={() => setSidebarOpen(false)} user={user} />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Open sidebar"
          >
            <TiIcon name="menu" size={20} className="text-gray-600" />
          </button>

          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-semibold !text-white hover:!text-white bg-[#2f6a4a] hover:bg-[#1f4a2f] px-3 py-1.5 rounded-lg transition-colors no-underline flex-shrink-0"
          >
            <TiIcon name="angle-left" size={16} />
            <span className="hidden xs:inline sm:inline">Back to Store</span>
          </Link>

          <div className="flex-1 flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2 max-w-md">
            <TiIcon name="search" size={15} className="text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Search orders, products..." className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button type="button" className="relative p-2 hover:bg-gray-100 rounded-lg flex-shrink-0" aria-label="Notifications">
              <TiIcon name="bell" size={18} className="text-gray-600" />
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

        <div className="flex-1 overflow-y-auto">
          {activeNav === 'Overview'   && <OverviewPanel />}
          {activeNav === 'Inventory'  && <InventoryPanel />}
          {activeNav === 'Discounts'  && <DiscountsPanel />}
          {activeNav === 'Seasonal'   && <SeasonalPanel />}
          {activeNav === 'Baskets'    && <BasketsPanel />}
          {activeNav === 'Orders'     && <OrdersPanel />}
          {activeNav === 'Delivery'   && <DeliveryPanel />}
          {activeNav === 'Farmers'    && <FarmersPanel />}
          {activeNav === 'Settings'   && <SettingsPanel />}
        </div>
      </div>
    </div>
  )
}

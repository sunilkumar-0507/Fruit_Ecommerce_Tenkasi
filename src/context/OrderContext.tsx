import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, isApiMode, getStoredToken, type AddressDto, type OrderDto } from '#/lib/apiClient'

export interface Address {
  id: string
  name: string    // stored locally (API doesn't have per-address name)
  phone: string   // stored locally
  line1: string
  line2: string
  city: string
  pincode: string
  state: string
  isDefault: boolean
}

export interface Order {
  id: string           // display ID (orderNumber or UUID slice)
  rawId: string        // UUID from API
  items: Array<{ id: string; name: string; qty: number; price: number; image: string }>
  subtotal: number
  total: number
  customerName: string
  date: string
  status: string
}

interface OrderContextValue {
  orders: Order[]
  addresses: Address[]
  loadAddresses: () => Promise<void>
  addAddress: (a: Omit<Address, 'id'>) => Promise<Address>
  setDefaultAddress: (id: string) => Promise<void>
  placeOrder: (shippingAddressId: string) => Promise<{ id: string }>
}

const OrderContext = createContext<OrderContextValue | null>(null)

// ── Address metadata: stores name/phone locally since API doesn't support them
interface AddrMeta { id: string; name: string; phone: string }

function loadMeta(): AddrMeta[] {
  try { return JSON.parse(localStorage.getItem('tf_addr_meta') ?? '[]') as AddrMeta[] }
  catch { return [] }
}
function saveMeta(m: AddrMeta[]) { localStorage.setItem('tf_addr_meta', JSON.stringify(m)) }

function mergeAddr(dto: AddressDto, meta: AddrMeta[]): Address {
  const m = meta.find((x) => x.id === dto.id)
  return {
    id: dto.id,
    name: m?.name ?? '',
    phone: m?.phone ?? '',
    line1: dto.line1 ?? '',
    line2: dto.line2 ?? '',
    city: dto.city ?? '',
    pincode: dto.postalCode ?? '',
    state: dto.state ?? '',
    isDefault: dto.isDefault,
  }
}

// ── Demo (localStorage) fallback when API is not configured ──────────────────

const ORDERS_KEY = 'tf_orders'
const ADDRS_KEY  = 'tf_addresses'

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

let orderSeq = 1290

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() =>
    isApiMode() ? [] : (load(ORDERS_KEY, []) as Order[]),
  )
  const [addresses, setAddresses] = useState<Address[]>(() =>
    isApiMode() ? [] : (load(ADDRS_KEY, []) as Address[]),
  )

  // Persist demo orders/addresses to localStorage in non-API mode
  useEffect(() => {
    if (!isApiMode()) localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders])
  useEffect(() => {
    if (!isApiMode()) localStorage.setItem(ADDRS_KEY, JSON.stringify(addresses))
  }, [addresses])

  // Load addresses from API on mount when logged in
  useEffect(() => {
    if (!isApiMode() || !getStoredToken()) return
    void loadAddresses()
  }, [])

  async function loadAddresses(): Promise<void> {
    const dtos = await api.get<AddressDto[]>('/api/Addresses')
    const meta = loadMeta()
    setAddresses(dtos.map((d) => mergeAddr(d, meta)))
  }

  async function addAddress(a: Omit<Address, 'id'>): Promise<Address> {
    if (!isApiMode() || !getStoredToken()) {
      // Demo mode: local only
      const addr: Address = { ...a, id: `addr-${Date.now()}` }
      setAddresses((prev) => {
        if (a.isDefault) return [addr, ...prev.map((x) => ({ ...x, isDefault: false }))]
        return [...prev, addr]
      })
      return addr
    }

    const dto = await api.post<AddressDto>('/api/Addresses', {
      line1: a.line1,
      line2: a.line2 || null,
      city: a.city,
      state: a.state,
      postalCode: a.pincode,
      country: 'India',
      isDefault: a.isDefault,
    })

    // Store name+phone metadata locally
    const meta = loadMeta()
    const newMeta = [...meta.filter((m) => m.id !== dto.id), { id: dto.id, name: a.name, phone: a.phone }]
    saveMeta(newMeta)

    const addr = mergeAddr(dto, newMeta)

    setAddresses((prev) => {
      const updated = a.isDefault
        ? prev.map((x) => ({ ...x, isDefault: false }))
        : [...prev]
      return [addr, ...updated.filter((x) => x.id !== addr.id)]
    })

    return addr
  }

  async function setDefaultAddress(id: string): Promise<void> {
    if (!isApiMode() || !getStoredToken()) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
      return
    }
    await api.post<void>(`/api/Addresses/${id}/default`)
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
  }

  async function placeOrder(shippingAddressId: string): Promise<{ id: string }> {
    if (!isApiMode() || !getStoredToken()) {
      // Demo mode: not expected when using API, but fallback
      orderSeq += 1
      return { id: `#TF-${orderSeq}` }
    }

    const dto = await api.post<OrderDto>('/api/Orders', {
      shippingAddressId,
      couponCode: null,
    })

    const displayId = dto.orderNumber ?? `#${dto.id.slice(0, 8).toUpperCase()}`

    const newOrder: Order = {
      id: displayId,
      rawId: dto.id,
      items: (dto.items ?? []).map((it) => ({
        id: it.productId,
        name: it.productName ?? 'Product',
        qty: it.quantity,
        price: it.unitPrice,
        image: '/images/products/p-mango.jpg',
      })),
      subtotal: dto.subtotal,
      total: dto.total,
      customerName: '',
      date: new Date(dto.createdAtUtc).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
      status: 'Processing',
    }

    setOrders((prev) => [newOrder, ...prev])

    return { id: displayId }
  }

  return (
    <OrderContext.Provider value={{ orders, addresses, loadAddresses, addAddress, setDefaultAddress, placeOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}

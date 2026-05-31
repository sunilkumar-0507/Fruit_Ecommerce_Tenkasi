import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { CartItem } from './CartContext'

export interface Address {
  id: string
  name: string
  phone: string
  line1: string
  line2: string
  city: string
  pincode: string
  state: string
  isDefault: boolean
}

export interface Order {
  id: string
  items: CartItem[]
  address: Address
  subtotal: number
  delivery: number
  total: number
  customerName: string
  customerEmail: string
  date: string
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
}

interface OrderContextValue {
  orders: Order[]
  addresses: Address[]
  addAddress: (a: Omit<Address, 'id'>) => Address
  placeOrder: (o: Omit<Order, 'id' | 'date' | 'status'>) => Order
}

const OrderContext = createContext<OrderContextValue | null>(null)

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
  const [orders, setOrders] = useState<Order[]>(() => load(ORDERS_KEY, []))
  const [addresses, setAddresses] = useState<Address[]>(() => load(ADDRS_KEY, []))

  useEffect(() => { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)) }, [orders])
  useEffect(() => { localStorage.setItem(ADDRS_KEY, JSON.stringify(addresses)) }, [addresses])

  function addAddress(a: Omit<Address, 'id'>): Address {
    const addr: Address = { ...a, id: `addr-${Date.now()}` }
    setAddresses((prev) => {
      if (a.isDefault) return [addr, ...prev.map((x) => ({ ...x, isDefault: false }))]
      return [...prev, addr]
    })
    return addr
  }

  function placeOrder(o: Omit<Order, 'id' | 'date' | 'status'>): Order {
    orderSeq += 1
    const order: Order = {
      ...o,
      id: `#TF-${orderSeq}`,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Processing',
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  return (
    <OrderContext.Provider value={{ orders, addresses, addAddress, placeOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used within OrderProvider')
  return ctx
}

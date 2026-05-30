import { createContext, useContext, useState, type ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  nameTamil: string
  category: string
  image: string
  price: number
  unit: string
  qty: number
}

interface CartContextValue {
  items: CartItem[]
  count: number
  addToCart: (product: Omit<CartItem, 'qty'>) => void
  updateQty: (id: string, delta: number) => void
  removeItem: (id: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const INITIAL_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Tenkasi Banganapalli Mango',
    nameTamil: 'மாம்பழம்',
    category: 'Mangoes',
    image: '/images/products/p-mango.jpg',
    price: 280,
    unit: '1 kg',
    qty: 1,
  },
  {
    id: '2',
    name: 'Malai Vazhaipalam',
    nameTamil: 'மலை வாழைப்பழம்',
    category: 'Banana',
    image: '/images/products/p-banana.jpg',
    price: 85,
    unit: '1 dozen',
    qty: 1,
  },
  {
    id: '3',
    name: 'Kabul Ruby Pomegranate',
    nameTamil: 'மாதுளம்பழம்',
    category: 'Imported Fruits',
    image: '/images/products/p-pomegranate.jpg',
    price: 240,
    unit: '1 kg',
    qty: 1,
  },
]

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS)

  function addToCart(product: Omit<CartItem, 'qty'>) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  function updateQty(id: string, delta: number) {
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0),
    )
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const count = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, count, addToCart, updateQty, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

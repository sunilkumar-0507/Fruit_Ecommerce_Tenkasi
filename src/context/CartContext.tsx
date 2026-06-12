import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, isApiMode, getStoredToken, type CartDto } from '#/lib/apiClient'

export interface CartItem {
  id: string          // product UUID
  cartItemId?: string // API cart-item UUID (for update/delete)
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
  addToCart: (product: Omit<CartItem, 'qty' | 'cartItemId'>) => void
  updateQty: (id: string, delta: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // On mount: if using real API and user is logged in, load server cart
  useEffect(() => {
    if (!isApiMode() || !getStoredToken()) return
    api
      .get<CartDto>('/api/Cart')
      .then((cart) => {
        const serverItems = cart.items ?? []
        if (serverItems.length === 0) return
        setItems((prev) => {
          const result: CartItem[] = []
          for (const si of serverItems) {
            const local = prev.find((i) => i.id === si.productId)
            if (local) {
              result.push({ ...local, cartItemId: si.id, qty: si.quantity, price: si.unitPrice })
            } else {
              result.push({
                id: si.productId,
                cartItemId: si.id,
                name: si.productName ?? 'Product',
                nameTamil: '',
                category: '',
                image: '/images/products/mangoes.jpeg',
                price: si.unitPrice,
                unit: 'unit',
                qty: si.quantity,
              })
            }
          }
          return result
        })
      })
      .catch(() => {})
  }, [])

  function addToCart(product: Omit<CartItem, 'qty' | 'cartItemId'>) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { ...product, qty: 1 }]
    })

    if (isApiMode() && getStoredToken()) {
      api
        .post<CartDto>('/api/Cart/items', { productId: product.id, quantity: 1 })
        .then((cart) => {
          const cartItem = (cart.items ?? []).find((ci) => ci.productId === product.id)
          if (cartItem) {
            setItems((prev) =>
              prev.map((i) => (i.id === product.id ? { ...i, cartItemId: cartItem.id } : i)),
            )
          }
        })
        .catch(() => {})
    }
  }

  function updateQty(id: string, delta: number) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item && isApiMode() && getStoredToken() && item.cartItemId) {
        const newQty = item.qty + delta
        if (newQty <= 0) {
          void api.delete(`/api/Cart/items/${item.cartItemId}`)
        } else {
          void api.put<CartDto>(`/api/Cart/items/${item.cartItemId}`, { quantity: newQty })
        }
      }
      return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    })
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item && isApiMode() && getStoredToken() && item.cartItemId) {
        void api.delete(`/api/Cart/items/${item.cartItemId}`)
      }
      return prev.filter((i) => i.id !== id)
    })
  }

  function clearCart() {
    setItems([])
    if (isApiMode() && getStoredToken()) {
      void api.delete('/api/Cart')
    }
  }

  const count = items.length

  return (
    <CartContext.Provider value={{ items, count, addToCart, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

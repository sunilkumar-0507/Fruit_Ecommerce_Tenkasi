import { createContext, useContext, useState, type ReactNode } from 'react'

export type BasketEntry = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  items: string
}

const BASKETS_INIT: BasketEntry[] = [
  {
    id: 'b1',
    name: 'Pongal Festival Basket',
    description: 'Handcrafted festival hamper with premium mangoes, bananas, and pomegranates.',
    price: 1450,
    images: ['/images/categories/fruit-baskets.jpg', '/images/categories/mangoes.jpg', '/images/categories/p-pomegranate.jpg'],
    items: 'Mango × 4, Banana × 6, Pomegranate × 2',
  },
  {
    id: 'b2',
    name: 'Exotic Mix Combo',
    description: 'Imported tropical selection — rambutan, dragon fruit, and mangosteen.',
    price: 850,
    images: ['/images/products/wa2-rambutan.jpeg', '/images/products/wa2-dragon-fruit.jpeg', '/images/products/wa2-mangosteen.jpeg', '/images/categories/p-pomegranate.jpg'],
    items: 'Rambutan × 6, Dragon Fruit × 2, Mangosteen × 3',
  },
]

type BasketContextType = {
  baskets: BasketEntry[]
  addBasket: (b: BasketEntry) => void
  removeBasket: (id: string) => void
}

const BasketCtx = createContext<BasketContextType | null>(null)

export function BasketProvider({ children }: { children: ReactNode }) {
  const [baskets, setBaskets] = useState<BasketEntry[]>(BASKETS_INIT)

  function addBasket(b: BasketEntry) {
    setBaskets((prev) => [b, ...prev])
  }

  function removeBasket(id: string) {
    setBaskets((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <BasketCtx.Provider value={{ baskets, addBasket, removeBasket }}>
      {children}
    </BasketCtx.Provider>
  )
}

export function useBaskets() {
  const ctx = useContext(BasketCtx)
  if (!ctx) throw new Error('useBaskets must be used within BasketProvider')
  return ctx
}

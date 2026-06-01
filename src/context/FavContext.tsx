import { createContext, useContext, useState, type ReactNode } from 'react'

export interface FavItem {
  id: string
  name: string
  nameTamil: string
  image: string
  price: number
  unit: string
  category: string
}

interface FavContextValue {
  items: FavItem[]
  toggle: (item: FavItem) => void
  isFav: (id: string) => boolean
}

const FavContext = createContext<FavContextValue | null>(null)

export function FavProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavItem[]>([])

  function toggle(item: FavItem) {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item],
    )
  }

  function isFav(id: string) {
    return items.some((i) => i.id === id)
  }

  return (
    <FavContext.Provider value={{ items, toggle, isFav }}>
      {children}
    </FavContext.Provider>
  )
}

export function useFav() {
  const ctx = useContext(FavContext)
  if (!ctx) throw new Error('useFav must be used within FavProvider')
  return ctx
}

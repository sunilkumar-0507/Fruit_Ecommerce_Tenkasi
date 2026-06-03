import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, isApiMode, getStoredToken, type ProductDto } from '#/lib/apiClient'

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

function mapDto(p: ProductDto): FavItem {
  const primary = (p.images ?? []).find((i) => i.isPrimary) ?? (p.images ?? [])[0]
  return {
    id: p.id,
    name: p.nameEn ?? '',
    nameTamil: p.nameTa ?? '',
    image: primary?.url ?? '/images/products/p-mango.jpg',
    price: p.price,
    unit: '',
    category: p.category?.nameEn ?? '',
  }
}

export function FavProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavItem[]>([])

  useEffect(() => {
    if (!isApiMode() || !getStoredToken()) return
    api.get<ProductDto[]>('/api/Wishlist')
      .then((dtos) => setItems(dtos.map(mapDto)))
      .catch(() => {})
  }, [])

  function toggle(item: FavItem) {
    const exists = items.some((i) => i.id === item.id)

    if (isApiMode() && getStoredToken()) {
      if (exists) {
        void api.delete(`/api/Wishlist/${item.id}`).catch(() => {})
      } else {
        void api.post<void>(`/api/Wishlist/${item.id}`).catch(() => {})
      }
    }

    setItems((prev) =>
      exists ? prev.filter((i) => i.id !== item.id) : [...prev, item],
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

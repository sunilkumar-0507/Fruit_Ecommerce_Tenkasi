const BASE = (import.meta.env as Record<string, string>).VITE_API_URL ?? 'http://localhost:5294'

export function isApiMode(): boolean {
  return !!(import.meta.env as Record<string, string>).VITE_API_URL
}

export function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem('tf_auth')
    if (!raw) return null
    return (JSON.parse(raw) as { token?: string }).token ?? null
  } catch {
    return null
  }
}

function authHeaders(): Record<string, string> {
  const token = getStoredToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text()
  const data = text ? (JSON.parse(text) as unknown) : null
  if (!res.ok) {
    const msg = (data as { message?: string } | null)?.message ?? `${res.status} ${res.statusText}`
    throw new Error(msg)
  }
  return data as T
}

export const api = {
  get<T>(path: string): Promise<T> {
    return fetch(`${BASE}${path}`, { headers: authHeaders() }).then((r) => handle<T>(r))
  },
  post<T>(path: string, body?: unknown): Promise<T> {
    return fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: authHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then((r) => handle<T>(r))
  },
  put<T>(path: string, body?: unknown): Promise<T> {
    return fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r))
  },
  patch<T>(path: string, body?: unknown): Promise<T> {
    return fetch(`${BASE}${path}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then((r) => handle<T>(r))
  },
  delete<T = void>(path: string): Promise<T> {
    return fetch(`${BASE}${path}`, { method: 'DELETE', headers: authHeaders() }).then((r) =>
      handle<T>(r),
    )
  },
}

// ── API DTO types ─────────────────────────────────────────────────────────────

export interface ProductImageDto {
  id: string
  url: string | null
  altText: string | null
  isPrimary: boolean
}

export interface CategoryDto {
  id: string
  nameEn: string | null
  nameTa: string | null
  slug: string | null
  descriptionEn: string | null
  descriptionTa: string | null
}

export interface ProductDto {
  id: string
  nameEn: string | null
  nameTa: string | null
  slug: string | null
  descriptionEn: string | null
  descriptionTa: string | null
  aboutEn: string | null
  aboutTa: string | null
  usageEn: string | null
  usageTa: string | null
  benefitsEn: string | null
  benefitsTa: string | null
  price: number
  originalPrice?: number | null
  stockQuantity: number
  isOutOfStock: boolean
  category: CategoryDto
  images: ProductImageDto[] | null
  rating: number
}

export interface ProductDtoPagedResult {
  items: ProductDto[] | null
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface CartItemDto {
  id: string
  productId: string
  productName: string | null
  slug: string | null
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface CartDto {
  id: string
  items: CartItemDto[] | null
  total: number
}

export interface OrderItemDto {
  productId: string
  productName: string | null
  unitPrice: number
  quantity: number
}

export interface OrderDto {
  id: string
  orderNumber: string | null
  status: number
  subtotal: number
  discount: number
  total: number
  trackingNumber: string | null
  createdAtUtc: string
  items: OrderItemDto[] | null
}

export interface OrderDtoPagedResult {
  items: OrderDto[] | null
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface AddressDto {
  id: string
  line1: string | null
  line2: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
  isDefault: boolean
}

export async function uploadProductImage(file: File): Promise<string> {
  const token = getStoredToken()
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/api/admin/uploads/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  const data = await res.json() as unknown
  if (!res.ok) throw new Error((data as { message?: string })?.message ?? 'Upload failed')
  return (data as { url: string }).url
}

export const ORDER_STATUS: Record<number, string> = {
  1: 'Pending',
  2: 'Confirmed',
  3: 'Shipped',
  4: 'Delivered',
  5: 'Cancelled',
}

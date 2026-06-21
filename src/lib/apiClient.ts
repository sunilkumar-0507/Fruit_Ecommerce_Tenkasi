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
    const d = data as { message?: string; title?: string; errors?: Record<string, string[]> } | null
    let msg = d?.message ?? d?.title ?? `${res.status} ${res.statusText}`
    if (d?.errors) {
      const details = Object.entries(d.errors)
        .map(([k, v]) => `${k}: ${v.join(', ')}`)
        .join('; ')
      msg = `${msg} — ${details}`
    }
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
  unitType?: 'kg' | 'piece'
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

export interface OrderShippingAddress {
  line1?: string | null
  line2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
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
  customerName?: string | null
  customerPhone?: string | null
  customerEmail?: string | null
  shippingAddress?: OrderShippingAddress | null
  paymentMethod?: string | null
  paymentStatus?: string | null
  paymentTransactionId?: string | null
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

// ── Cashfree online payment ───────────────────────────────────────────────────

export interface PaymentSessionDto {
  orderId: string
  paymentSessionId: string
  cashfreeOrderId: string
  amount: number
}

/** "sandbox" (default) or "production" — controls which Cashfree environment the JS SDK targets. */
export function cashfreeMode(): 'sandbox' | 'production' {
  return (import.meta.env as Record<string, string>).VITE_CASHFREE_MODE === 'production'
    ? 'production'
    : 'sandbox'
}

/** Creates a Cashfree payment session for an existing online order. */
export function createPaymentSession(
  orderId: string,
  body: { customerName?: string; customerPhone?: string },
): Promise<PaymentSessionDto> {
  return api.post<PaymentSessionDto>(`/api/payments/${orderId}/session`, body)
}

/** Asks the backend to verify payment with Cashfree and persist the transaction id; returns the updated order. */
export function verifyPayment(orderId: string): Promise<OrderDto> {
  return api.post<OrderDto>(`/api/payments/${orderId}/verify`, {})
}

/**
 * Opens Cashfree's seamless on-site checkout (modal) for the given session.
 * The SDK is imported dynamically so it never runs during SSR (it is browser-only).
 * Resolves once the modal flow completes; the caller should then verify server-side.
 */
export async function launchCashfreeCheckout(paymentSessionId: string): Promise<void> {
  const { load } = await import('@cashfreepayments/cashfree-js')
  const cashfree = await load({ mode: cashfreeMode() })
  if (!cashfree) throw new Error('Payment could not be started in this environment.')
  await cashfree.checkout({ paymentSessionId, redirectTarget: '_modal' })
}

export const ORDER_STATUS: Record<number, string> = {
  1: 'Pending',
  2: 'Confirmed',
  3: 'Shipped',
  4: 'Delivered',
  5: 'Cancelled',
}

export interface FarmerDto {
  id: string
  name: string | null
  village: string | null
  produce: string | null
  weeklySupplyKg: number | null
  rating: number | null
  phone: string | null
  isActive: boolean
}

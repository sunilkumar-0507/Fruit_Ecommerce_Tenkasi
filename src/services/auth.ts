import { notifyNewCustomer } from '#/services/notificationService'

export interface User {
  id: string
  name: string
  email?: string
  phone?: string
  role: 'customer' | 'admin'
  token: string
}

export interface LoginPayload {
  phone: string
  password: string
}

export interface RegisterPayload {
  name: string
  phone: string
  password: string
}

interface ApiAuthResponse {
  accessToken: string
  refreshToken: string
  expiresAtUtc: string
  user: {
    id: string
    fullName: string | null
    email: string | null
    phoneNumber: string | null
    emailConfirmed: boolean
    roles: string[] | null
  }
}

const BASE = (import.meta.env as Record<string, string>).VITE_API_URL ?? ''

// ── Demo users (used only when VITE_API_URL is not set) ─────────────────────

const DEMO_USERS: User[] = [
  {
    id: 'admin-001',
    name: 'Arun Kumar',
    phone: '9709402579',
    role: 'admin',
    token: 'demo-admin-token',
  },
  {
    id: 'cust-001',
    name: 'Priya Sharma',
    phone: '9500000001',
    role: 'customer',
    token: 'demo-customer-token',
  },
]

const DEMO_PASSWORDS: Record<string, string> = {
  '9709402579': 'admin123',
  '9500000001': 'customer123',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  })
  const data = await res.json()
  if (!res.ok) throw new Error((data as { message?: string }).message ?? 'Request failed')
  return data as T
}

function mapAuthResponse(r: ApiAuthResponse): User {
  const roles = r.user.roles ?? []
  return {
    id: r.user.id,
    name: r.user.fullName ?? r.user.phoneNumber ?? '',
    email: r.user.email ?? undefined,
    phone: r.user.phoneNumber ?? undefined,
    role: roles.some((x) => x.toLowerCase() === 'admin') ? 'admin' : 'customer',
    token: r.accessToken,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function loginUser(payload: LoginPayload): Promise<User> {
  if (!BASE) {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        const user = DEMO_USERS.find((u) => u.phone === payload.phone)
        if (!user || DEMO_PASSWORDS[payload.phone] !== payload.password) {
          reject(new Error('Invalid mobile number or password'))
          return
        }
        resolve(user)
      }, 600),
    )
  }
  return request<ApiAuthResponse>('/api/Auth/login', {
    method: 'POST',
    // TODO: remove email once backend accepts phoneNumber directly
    body: JSON.stringify({ email: `${payload.phone}@ph.tenkasifresh.in`, phoneNumber: payload.phone, password: payload.password }),
  }).then((r) => {
    if (r.refreshToken) localStorage.setItem('tf_refresh', r.refreshToken)
    return mapAuthResponse(r)
  })
}

export function registerUser(payload: RegisterPayload): Promise<User> {
  if (!BASE) {
    return new Promise((resolve) =>
      setTimeout(() => {
        const user: User = {
          id: `cust-${Date.now()}`,
          name: payload.name,
          phone: payload.phone,
          role: 'customer',
          token: `demo-token-${Date.now()}`,
        }
        void notifyNewCustomer({ name: user.name, phone: user.phone })
        resolve(user)
      }, 800),
    )
  }
  return request<ApiAuthResponse>('/api/Auth/register', {
    method: 'POST',
    // TODO: remove email once backend accepts phoneNumber directly
    body: JSON.stringify({
      fullName: payload.name,
      email: `${payload.phone}@ph.tenkasifresh.in`,
      password: payload.password,
      phoneNumber: payload.phone,
    }),
  }).then((r) => {
    if (r.refreshToken) localStorage.setItem('tf_refresh', r.refreshToken)
    const user = mapAuthResponse(r)
    void notifyNewCustomer({ name: user.name, phone: user.phone })
    return user
  })
}

export function requestPasswordOtp(phone: string): Promise<void> {
  if (!BASE) {
    return new Promise<void>((resolve) => setTimeout(resolve, 600))
  }
  return request<void>('/api/Auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber: phone }),
  })
}

export function verifyPasswordOtp(phone: string, otp: string): Promise<{ token: string }> {
  if (!BASE) {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        if (otp === '123456') resolve({ token: `demo-reset-${phone}` })
        else reject(new Error('Invalid OTP. Try 123456 in demo mode.'))
      }, 600),
    )
  }
  return request<{ token: string }>('/api/Auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phoneNumber: phone, otp }),
  })
}

export function resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
  if (!BASE) {
    return new Promise<void>((resolve) => setTimeout(resolve, 600))
  }
  return request<void>('/api/Auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  })
}

export function logoutUser(): Promise<void> {
  const refreshToken = localStorage.getItem('tf_refresh') ?? ''
  localStorage.removeItem('tf_refresh')
  if (!BASE) return Promise.resolve()
  return request<void>('/api/Auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  }).catch(() => {})
}

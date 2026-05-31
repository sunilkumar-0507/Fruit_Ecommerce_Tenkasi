export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
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
    email: 'admin@tenakasifresh.com',
    phone: '+91 98400 12345',
    role: 'admin',
    token: 'demo-admin-token',
  },
  {
    id: 'cust-001',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 94400 55555',
    role: 'customer',
    token: 'demo-customer-token',
  },
]

const DEMO_PASSWORDS: Record<string, string> = {
  'admin@tenakasifresh.com': 'admin123',
  'priya@example.com': 'customer123',
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
    name: r.user.fullName ?? r.user.email ?? '',
    email: r.user.email ?? '',
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
        const user = DEMO_USERS.find((u) => u.email === payload.email)
        if (!user || DEMO_PASSWORDS[payload.email] !== payload.password) {
          reject(new Error('Invalid email or password'))
          return
        }
        resolve(user)
      }, 600),
    )
  }
  return request<ApiAuthResponse>('/api/Auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: payload.email, password: payload.password }),
  }).then((r) => {
    if (r.refreshToken) localStorage.setItem('tf_refresh', r.refreshToken)
    return mapAuthResponse(r)
  })
}

export function registerUser(payload: RegisterPayload): Promise<User> {
  if (!BASE) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            id: `cust-${Date.now()}`,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            role: 'customer',
            token: `demo-token-${Date.now()}`,
          }),
        800,
      ),
    )
  }
  return request<ApiAuthResponse>('/api/Auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: payload.name,
      email: payload.email,
      password: payload.password,
      phoneNumber: payload.phone,
    }),
  }).then((r) => {
    if (r.refreshToken) localStorage.setItem('tf_refresh', r.refreshToken)
    return mapAuthResponse(r)
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

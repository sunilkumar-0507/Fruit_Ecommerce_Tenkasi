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

const BASE = (import.meta.env as Record<string, string>).VITE_API_URL ?? ''

// Demo users — active only when VITE_API_URL is not set
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

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  })
  const data = await res.json()
  if (!res.ok) throw new Error((data as { message?: string }).message ?? 'Request failed')
  return data as T
}

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
  return request<User>('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) })
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
  return request<User>('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) })
}

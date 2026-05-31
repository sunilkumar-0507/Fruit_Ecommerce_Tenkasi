import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '#/services/auth'
import { logoutUser } from '#/services/auth'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'tf_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setUser(JSON.parse(stored) as User)
    } catch {
      // ignore corrupt storage
    }
    setLoading(false)
  }, [])

  function login(u: User) {
    setUser(u)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  }

  function logout() {
    void logoutUser()
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: user?.role === 'admin', login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

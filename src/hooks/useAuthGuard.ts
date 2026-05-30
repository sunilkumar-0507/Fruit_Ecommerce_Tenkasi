import { useEffect } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useAuth } from '#/context/AuthContext'
import type { User } from '#/services/auth'

export function useAuthGuard(requiredRole?: 'admin'): User | null {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (loading) return
    if (!user) {
      void navigate({ to: '/login', search: { redirect: location.pathname } as never })
      return
    }
    if (requiredRole === 'admin' && user.role !== 'admin') {
      void navigate({ to: '/' })
    }
  }, [user, loading])

  if (loading || !user) return null
  if (requiredRole === 'admin' && user.role !== 'admin') return null
  return user
}

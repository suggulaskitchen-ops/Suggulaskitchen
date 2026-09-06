import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { adminLogin, adminLogout, getCurrentAdmin } from '../services/supabase/adminApi'
import { supabase } from '../services/supabase/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    getCurrentAdmin()
      .then((user) => {
        if (mounted) setIsAdminAuthenticated(Boolean(user))
      })
      .catch(() => {
        if (mounted) setIsAdminAuthenticated(false)
      })
      .finally(() => {
        if (mounted) setIsAuthLoading(false)
      })

    const { data } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (mounted) setIsAdminAuthenticated(Boolean(session?.user))
    }) ?? { data: null }

    return () => {
      mounted = false
      data?.subscription.unsubscribe()
    }
  }, [])

  const login = async (username, password) => {
    try {
      await adminLogin(username, password)
      setIsAdminAuthenticated(true)
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    await adminLogout()
    setIsAdminAuthenticated(false)
  }

  const value = useMemo(
    () => ({ isAdminAuthenticated, isAuthLoading, login, logout }),
    [isAdminAuthenticated, isAuthLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

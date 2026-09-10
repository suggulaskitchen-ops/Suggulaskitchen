import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { adminLogin, adminLogout, getCurrentAdmin } from '../services/supabase/adminApi'
import { supabase } from '../services/supabase/supabaseClient'

const AuthContext = createContext(null)
const INACTIVITY_TIMEOUT = 10 * 60 * 1000
const LAST_ACTIVITY_KEY = 'suggulas-admin-last-activity'

export function AuthProvider({ children }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const inactivityTimer = useRef(null)

  const clearInactivityTimer = () => {
    if (inactivityTimer.current) {
      window.clearTimeout(inactivityTimer.current)
      inactivityTimer.current = null
    }
  }

  useEffect(() => {
    let mounted = true

    async function restoreSession() {
      try {
        const user = await getCurrentAdmin()
        const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_KEY))
        const sessionIsCurrent = user && lastActivity && Date.now() - lastActivity < INACTIVITY_TIMEOUT

        if (user && !sessionIsCurrent) {
          await adminLogout()
          localStorage.removeItem(LAST_ACTIVITY_KEY)
        }

        if (mounted) setIsAdminAuthenticated(Boolean(user && sessionIsCurrent))
      } catch {
        localStorage.removeItem(LAST_ACTIVITY_KEY)
        if (mounted) setIsAdminAuthenticated(false)
      } finally {
        if (mounted) setIsAuthLoading(false)
      }
    }

    restoreSession()

    const { data } = supabase?.auth.onAuthStateChange((_event, session) => {
      if (mounted) setIsAdminAuthenticated(Boolean(session?.user))
    }) ?? { data: null }

    return () => {
      mounted = false
      data?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isAdminAuthenticated) {
      clearInactivityTimer()
      return undefined
    }

    const resetInactivityTimer = () => {
      const now = Date.now()
      const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY))
      // Throttle timer updates to once per second to prevent event spam (mousemove, scroll)
      if (last && now - last < 1000 && inactivityTimer.current) return

      clearInactivityTimer()
      localStorage.setItem(LAST_ACTIVITY_KEY, String(now))
      inactivityTimer.current = window.setTimeout(async () => {
        try {
          await adminLogout()
        } finally {
          localStorage.removeItem(LAST_ACTIVITY_KEY)
          setIsAdminAuthenticated(false)
        }
      }, INACTIVITY_TIMEOUT)
    }

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetInactivityTimer))
    resetInactivityTimer()

    return () => {
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetInactivityTimer))
      clearInactivityTimer()
    }
  }, [isAdminAuthenticated])

  const login = async (username, password) => {
    try {
      await adminLogin(username, password)
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
      setIsAdminAuthenticated(true)
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    try {
      await adminLogout()
    } finally {
      localStorage.removeItem(LAST_ACTIVITY_KEY)
      setIsAdminAuthenticated(false)
    }
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

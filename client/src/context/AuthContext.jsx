import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'
const STORAGE_KEY = 'suggula_admin_auth'

export function AuthProvider({ children }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const login = async (username, password) => {
    const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD
    if (isValid) {
      setIsAdminAuthenticated(true)
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
      } catch {
        // ignore
      }
    }
    return isValid
  }

  const logout = () => {
    setIsAdminAuthenticated(false)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const value = useMemo(
    () => ({ isAdminAuthenticated, login, logout }),
    [isAdminAuthenticated]
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

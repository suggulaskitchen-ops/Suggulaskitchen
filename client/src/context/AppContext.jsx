import { createContext, useContext, useMemo, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [appData, setAppData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const value = useMemo(
    () => ({ appData, setAppData, loading, setLoading, error, setError }),
    [appData, loading, error]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

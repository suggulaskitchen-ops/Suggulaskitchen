import { useEffect } from 'react'
import { fetchAppData } from '../services/api'
import { useAppContext } from '../context/AppContext'

export function useFetchAppData() {
  const { appData, setAppData, setLoading, setError } = useAppContext()

  useEffect(() => {
    if (appData.products && appData.categories && appData.businessInfo) {
      return undefined
    }

    let mounted = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchAppData()
        if (mounted) setAppData(data)
      } catch (error) {
        if (mounted) setError(error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [appData, setAppData, setLoading, setError])
}

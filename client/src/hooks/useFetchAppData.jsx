import { useEffect } from 'react'
import { fetchAppData } from '../services/api'
import { useAppContext } from '../context/AppContext'

export function useFetchAppData() {
  const { setAppData, setLoading, setError } = useAppContext()

  useEffect(() => {
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

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') load()
    }

    window.addEventListener('focus', refreshWhenVisible)
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      mounted = false
      window.removeEventListener('focus', refreshWhenVisible)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [setAppData, setLoading, setError])
}

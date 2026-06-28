import { useEffect } from 'react'
import { fetchAppData } from '../services/api'
import { useAppContext } from '../context/AppContext'

export function useFetchAppData() {
  const { setAppData, setLoading, setError } = useAppContext()

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await fetchAppData()
        setAppData(data)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [setAppData, setLoading, setError])
}

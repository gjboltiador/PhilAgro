import { useState, useEffect, useCallback } from 'react'
import { ValidIdType } from '@/lib/valid-id-types-dao'

interface UseValidIdTypesReturn {
  validIdTypes: ValidIdType[]
  loading: boolean
  error: string | null
  refreshValidIdTypes: () => Promise<void>
}

export function useValidIdTypes(activeOnly: boolean = true): UseValidIdTypesReturn {
  const [validIdTypes, setValidIdTypes] = useState<ValidIdType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchValidIdTypes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (!activeOnly) {
        queryParams.append('active_only', 'false')
      }

      const response = await fetch(`/api/valid-id-types?${queryParams.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch valid ID types')
      }

      setValidIdTypes(result.data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch valid ID types')
      console.error('Error fetching valid ID types:', err)
    } finally {
      setLoading(false)
    }
  }, [activeOnly])

  const refreshValidIdTypes = useCallback(async () => {
    await fetchValidIdTypes()
  }, [fetchValidIdTypes])

  useEffect(() => {
    fetchValidIdTypes()
  }, [fetchValidIdTypes])

  return {
    validIdTypes,
    loading,
    error,
    refreshValidIdTypes
  }
}

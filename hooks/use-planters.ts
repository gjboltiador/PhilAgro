import { useState, useEffect, useCallback } from 'react'
import { Planter, CreatePlanterRequest, UpdatePlanterRequest } from '@/lib/planters-dao'

interface UsePlantersFilters {
  status?: 'active' | 'inactive'
  sugar_mill_id?: number
  association_id?: number
  search?: string
  limit?: number
  offset?: number
}

interface UsePlantersReturn {
  planters: Planter[]
  loading: boolean
  error: string | null
  createPlanter: (data: CreatePlanterRequest) => Promise<Planter | null>
  updatePlanter: (data: UpdatePlanterRequest) => Promise<Planter | null>
  deletePlanter: (id: number) => Promise<boolean>
  getPlanterById: (id: number) => Promise<Planter | null>
  refreshPlanters: () => Promise<void>
  statistics: {
    total: number
    active: number
    inactive: number
    byGender: Record<string, number>
    bySugarMill: Record<string, number>
    byAssociation: Record<string, number>
  } | null
  loadingStatistics: boolean
}

export function usePlanters(filters?: UsePlantersFilters): UsePlantersReturn {
  const [planters, setPlanters] = useState<Planter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statistics, setStatistics] = useState<UsePlantersReturn['statistics']>(null)
  const [loadingStatistics, setLoadingStatistics] = useState(false)

  const fetchPlanters = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const queryParams = new URLSearchParams()
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.sugar_mill_id) queryParams.append('sugar_mill_id', filters.sugar_mill_id.toString())
      if (filters?.association_id) queryParams.append('association_id', filters.association_id.toString())
      if (filters?.search) queryParams.append('search', filters.search)
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())
      if (filters?.offset) queryParams.append('offset', filters.offset.toString())

      const response = await fetch(`/api/planters?${queryParams.toString()}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch planters')
      }

      setPlanters(result.data || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch planters')
      console.error('Error fetching planters:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchStatistics = useCallback(async () => {
    try {
      setLoadingStatistics(true)
      setError(null)

      const response = await fetch('/api/planters/statistics')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch statistics')
      }

      setStatistics(result.data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch statistics')
      console.error('Error fetching statistics:', err)
    } finally {
      setLoadingStatistics(false)
    }
  }, [])

  const createPlanter = useCallback(async (data: CreatePlanterRequest): Promise<Planter | null> => {
    try {
      setError(null)

      const response = await fetch('/api/planters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create planter')
      }

      // Refresh the planters list
      await fetchPlanters()
      await fetchStatistics()

      return result.data
    } catch (err: any) {
      setError(err.message || 'Failed to create planter')
      console.error('Error creating planter:', err)
      return null
    }
  }, [fetchPlanters, fetchStatistics])

  const updatePlanter = useCallback(async (data: UpdatePlanterRequest): Promise<Planter | null> => {
    try {
      setError(null)

      const response = await fetch(`/api/planters/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update planter')
      }

      // Update the planters list
      setPlanters(prev => 
        prev.map(planter => 
          planter.id === data.id ? result.data : planter
        )
      )

      return result.data
    } catch (err: any) {
      setError(err.message || 'Failed to update planter')
      console.error('Error updating planter:', err)
      return null
    }
  }, [])

  const deletePlanter = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null)

      const response = await fetch(`/api/planters/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete planter')
      }

      // Remove from the planters list
      setPlanters(prev => prev.filter(planter => planter.id !== id))
      
      // Refresh statistics
      await fetchStatistics()

      return true
    } catch (err: any) {
      setError(err.message || 'Failed to delete planter')
      console.error('Error deleting planter:', err)
      return false
    }
  }, [fetchStatistics])

  const getPlanterById = useCallback(async (id: number): Promise<Planter | null> => {
    try {
      setError(null)

      const response = await fetch(`/api/planters/${id}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch planter')
      }

      return result.data
    } catch (err: any) {
      setError(err.message || 'Failed to fetch planter')
      console.error('Error fetching planter:', err)
      return null
    }
  }, [])

  const refreshPlanters = useCallback(async () => {
    await Promise.all([fetchPlanters(), fetchStatistics()])
  }, [fetchPlanters, fetchStatistics])

  useEffect(() => {
    fetchPlanters()
    fetchStatistics()
  }, [fetchPlanters, fetchStatistics])

  return {
    planters,
    loading,
    error,
    createPlanter,
    updatePlanter,
    deletePlanter,
    getPlanterById,
    refreshPlanters,
    statistics,
    loadingStatistics
  }
}

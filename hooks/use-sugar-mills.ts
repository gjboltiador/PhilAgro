import { useState, useEffect, useCallback } from 'react'
import { 
  SugarMill, 
  CreateSugarMillRequest, 
  UpdateSugarMillRequest, 
  SugarMillFilters,
  SugarMillStatistics 
} from '@/lib/sugar-mills-dao'

/**
 * Custom hook for managing sugar mills
 * Implements proper error handling, loading states, and optimistic updates
 * Following React best practices for state management
 */

export interface UseSugarMillsReturn {
  // Data
  sugarMills: SugarMill[]
  statistics: SugarMillStatistics | null
  provinces: string[]
  cities: string[]
  
  // Loading states
  loading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  
  // Error states
  error: string | null
  validationErrors: Record<string, string>
  
  // Actions
  fetchSugarMills: (filters?: SugarMillFilters) => Promise<void>
  fetchStatistics: () => Promise<void>
  fetchLocations: (province?: string) => Promise<void>
  createSugarMill: (data: CreateSugarMillRequest) => Promise<SugarMill | null>
  updateSugarMill: (data: UpdateSugarMillRequest) => Promise<SugarMill | null>
  deleteSugarMill: (id: number) => Promise<boolean>
  
  // Utilities
  clearError: () => void
  clearValidationErrors: () => void
  getSugarMillById: (id: number) => SugarMill | undefined
}

export function useSugarMills(): UseSugarMillsReturn {
  // State management
  const [sugarMills, setSugarMills] = useState<SugarMill[]>([])
  const [statistics, setStatistics] = useState<SugarMillStatistics | null>(null)
  const [provinces, setProvinces] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  
  // Loading states
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Error states
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  /**
   * Fetch all sugar mills with optional filtering
   */
  const fetchSugarMills = useCallback(async (filters?: SugarMillFilters) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.operating_status) params.append('operating_status', filters.operating_status)
      if (filters?.province) params.append('province', filters.province)
      if (filters?.city) params.append('city', filters.city)
      if (filters?.search) params.append('search', filters.search)
      
      const response = await fetch(`/api/sugar-mills?${params.toString()}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch sugar mills')
      }
      
      setSugarMills(result.data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sugar mills')
      console.error('Error fetching sugar mills:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch sugar mills statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch('/api/sugar-mills/statistics')
      const result = await response.json()
      
      if (result.success) {
        setStatistics(result.data)
      }
    } catch (err: any) {
      console.error('Error fetching statistics:', err)
    }
  }, [])

  /**
   * Fetch location data (provinces and cities)
   */
  const fetchLocations = useCallback(async (province?: string) => {
    try {
      const params = new URLSearchParams()
      if (province) params.append('province', province)
      
      const response = await fetch(`/api/sugar-mills/locations?${params.toString()}`)
      const result = await response.json()
      
      if (result.success) {
        setProvinces(result.data.provinces)
        setCities(result.data.cities)
      }
    } catch (err: any) {
      console.error('Error fetching locations:', err)
    }
  }, [])

  /**
   * Create a new sugar mill
   */
  const createSugarMill = useCallback(async (data: CreateSugarMillRequest): Promise<SugarMill | null> => {
    setCreating(true)
    setError(null)
    setValidationErrors({})
    
    try {
      const response = await fetch('/api/sugar-mills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!result.success) {
        if (result.field) {
          setValidationErrors({ [result.field]: result.message })
        } else {
          setError(result.message || 'Failed to create sugar mill')
        }
        return null
      }
      
      // Optimistic update
      setSugarMills(prev => [result.data, ...prev])
      
      // Refresh statistics
      fetchStatistics()
      
      return result.data
    } catch (err: any) {
      setError(err.message || 'Failed to create sugar mill')
      console.error('Error creating sugar mill:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [fetchStatistics])

  /**
   * Update an existing sugar mill
   */
  const updateSugarMill = useCallback(async (data: UpdateSugarMillRequest): Promise<SugarMill | null> => {
    if (!data.id) {
      setError('Sugar mill ID is required for update')
      return null
    }

    setUpdating(true)
    setError(null)
    setValidationErrors({})
    
    try {
      const response = await fetch(`/api/sugar-mills/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (!result.success) {
        if (result.field) {
          setValidationErrors({ [result.field]: result.message })
        } else {
          setError(result.message || 'Failed to update sugar mill')
        }
        return null
      }
      
      // Optimistic update
      setSugarMills(prev => 
        prev.map(mill => mill.id === data.id ? result.data : mill)
      )
      
      return result.data
    } catch (err: any) {
      setError(err.message || 'Failed to update sugar mill')
      console.error('Error updating sugar mill:', err)
      return null
    } finally {
      setUpdating(false)
    }
  }, [])

  /**
   * Delete a sugar mill
   */
  const deleteSugarMill = useCallback(async (id: number): Promise<boolean> => {
    setDeleting(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/sugar-mills/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (!result.success) {
        setError(result.message || 'Failed to delete sugar mill')
        return false
      }
      
      // Optimistic update - remove from list
      setSugarMills(prev => prev.filter(mill => mill.id !== id))
      
      // Refresh statistics
      fetchStatistics()
      
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to delete sugar mill')
      console.error('Error deleting sugar mill:', err)
      return false
    } finally {
      setDeleting(false)
    }
  }, [fetchStatistics])

  /**
   * Utility functions
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearValidationErrors = useCallback(() => {
    setValidationErrors({})
  }, [])

  const getSugarMillById = useCallback((id: number): SugarMill | undefined => {
    return sugarMills.find(mill => mill.id === id)
  }, [sugarMills])

  // Initial data fetch
  useEffect(() => {
    fetchSugarMills()
    fetchStatistics()
    fetchLocations()
  }, [fetchSugarMills, fetchStatistics, fetchLocations])

  return {
    // Data
    sugarMills,
    statistics,
    provinces,
    cities,
    
    // Loading states
    loading,
    creating,
    updating,
    deleting,
    
    // Error states
    error,
    validationErrors,
    
    // Actions
    fetchSugarMills,
    fetchStatistics,
    fetchLocations,
    createSugarMill,
    updateSugarMill,
    deleteSugarMill,
    
    // Utilities
    clearError,
    clearValidationErrors,
    getSugarMillById,
  }
}

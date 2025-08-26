import { useState, useEffect, useCallback } from 'react'
import { Association, CreateAssociationRequest, UpdateAssociationRequest } from '@/lib/database'

/**
 * Custom hook for managing associations
 * Implements proper error handling, loading states, and optimistic updates
 * Following React best practices for state management
 */

export interface AssociationFilters {
  status?: 'active' | 'inactive'
  crop_year?: string
  search?: string
}

export interface AssociationStatistics {
  total: number
  active: number
  inactive: number
  byType: Record<string, number>
}

export interface UseAssociationsReturn {
  // Data
  associations: Association[]
  statistics: AssociationStatistics | null
  
  // Loading states
  loading: boolean
  creating: boolean
  updating: boolean
  deleting: boolean
  
  // Error states
  error: string | null
  validationErrors: Record<string, string>
  
  // Actions
  fetchAssociations: (filters?: AssociationFilters) => Promise<void>
  fetchStatistics: () => Promise<void>
  createAssociation: (data: CreateAssociationRequest) => Promise<Association | null>
  updateAssociation: (data: UpdateAssociationRequest) => Promise<Association | null>
  deleteAssociation: (id: number) => Promise<boolean>
  
  // Utilities
  clearError: () => void
  clearValidationErrors: () => void
  getAssociationById: (id: number) => Association | undefined
}

export function useAssociations(): UseAssociationsReturn {
  // State management
  const [associations, setAssociations] = useState<Association[]>([])
  const [statistics, setStatistics] = useState<AssociationStatistics | null>(null)
  
  // Loading states
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Error states
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  /**
   * Fetch all associations with optional filtering
   */
  const fetchAssociations = useCallback(async (filters?: AssociationFilters) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.crop_year) params.append('crop_year', filters.crop_year)
      if (filters?.search) params.append('search', filters.search)
      
      const response = await fetch(`/api/associations?${params.toString()}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch associations')
      }
      
      setAssociations(result.data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch associations')
      console.error('Error fetching associations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch association statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch('/api/associations/statistics')
      const result = await response.json()
      
      if (result.success) {
        setStatistics(result.data)
      }
    } catch (err: any) {
      console.error('Error fetching statistics:', err)
    }
  }, [])

  /**
   * Create a new association
   */
  const createAssociation = useCallback(async (data: CreateAssociationRequest): Promise<Association | null> => {
    setCreating(true)
    setError(null)
    setValidationErrors({})
    
    try {
      const response = await fetch('/api/associations', {
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
          setError(result.message || 'Failed to create association')
        }
        return null
      }
      
      // Optimistic update
      setAssociations(prev => [result.data, ...prev])
      
      // Refresh statistics
      fetchStatistics()
      
      return result.data
    } catch (err: any) {
      setError(err.message || 'Failed to create association')
      console.error('Error creating association:', err)
      return null
    } finally {
      setCreating(false)
    }
  }, [fetchStatistics])

  /**
   * Update an existing association
   */
  const updateAssociation = useCallback(async (data: UpdateAssociationRequest): Promise<Association | null> => {
    if (!data.id) {
      setError('Association ID is required for update')
      return null
    }

    setUpdating(true)
    setError(null)
    setValidationErrors({})
    
    try {
      const response = await fetch(`/api/associations/${data.id}`, {
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
          setError(result.message || 'Failed to update association')
        }
        return null
      }
      
      // Optimistic update
      setAssociations(prev => 
        prev.map(assoc => assoc.id === data.id ? result.data : assoc)
      )
      
      return result.data
    } catch (err: any) {
      setError(err.message || 'Failed to update association')
      console.error('Error updating association:', err)
      return null
    } finally {
      setUpdating(false)
    }
  }, [])

  /**
   * Delete an association (soft delete)
   */
  const deleteAssociation = useCallback(async (id: number): Promise<boolean> => {
    setDeleting(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/associations/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (!result.success) {
        setError(result.message || 'Failed to delete association')
        return false
      }
      
      // Optimistic update - mark as inactive instead of removing
      setAssociations(prev => 
        prev.map(assoc => 
          assoc.id === id ? { ...assoc, status: 'inactive' as const } : assoc
        )
      )
      
      // Refresh statistics
      fetchStatistics()
      
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to delete association')
      console.error('Error deleting association:', err)
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

  const getAssociationById = useCallback((id: number): Association | undefined => {
    return associations.find(assoc => assoc.id === id)
  }, [associations])

  // Initial data fetch
  useEffect(() => {
    fetchAssociations()
    fetchStatistics()
  }, [fetchAssociations, fetchStatistics])

  return {
    // Data
    associations,
    statistics,
    
    // Loading states
    loading,
    creating,
    updating,
    deleting,
    
    // Error states
    error,
    validationErrors,
    
    // Actions
    fetchAssociations,
    fetchStatistics,
    createAssociation,
    updateAssociation,
    deleteAssociation,
    
    // Utilities
    clearError,
    clearValidationErrors,
    getAssociationById,
  }
}

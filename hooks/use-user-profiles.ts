import { useState, useEffect, useCallback } from 'react'
import { UserProfile, CreateUserProfileRequest, UpdateUserProfileRequest } from '@/lib/user-profiles-dao'

/**
 * Custom hook for managing user profiles
 * Implements proper error handling, loading states, and CRUD operations
 */

export interface UserProfileFilters {
  status?: 'Active' | 'Inactive'
  user_type?: string
  association_id?: number
  search?: string
}

export interface UseUserProfilesReturn {
  // Data
  userProfiles: UserProfile[]
  currentProfile: UserProfile | null
  
  // Loading states
  loading: boolean
  saving: boolean
  
  // Error states
  error: string | null
  validationErrors: Record<string, string>
  
  // Actions
  fetchUserProfiles: (filters?: UserProfileFilters) => Promise<void>
  fetchUserProfile: (userId: number) => Promise<UserProfile | null>
  fetchUserProfileByEmail: (email: string) => Promise<UserProfile | null>
  createUserProfile: (data: CreateUserProfileRequest) => Promise<UserProfile | null>
  updateUserProfile: (data: UpdateUserProfileRequest) => Promise<UserProfile | null>
  changePassword: (userId: number, currentPassword: string, newPassword: string) => Promise<boolean>
  
  // Utilities
  clearError: () => void
  clearValidationErrors: () => void
  setCurrentProfile: (profile: UserProfile | null) => void
}

export function useUserProfiles(): UseUserProfilesReturn {
  // State management
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([])
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null)
  
  // Loading states
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Error states
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  /**
   * Fetch all user profiles with optional filtering
   */
  const fetchUserProfiles = useCallback(async (filters?: UserProfileFilters) => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.user_type) params.append('user_type', filters.user_type)
      if (filters?.association_id) params.append('association_id', filters.association_id.toString())
      if (filters?.search) params.append('search', filters.search)
      
      const response = await fetch(`/api/user-profiles?${params.toString()}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch user profiles')
      }
      
      setUserProfiles(result.data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user profiles')
      console.error('Error fetching user profiles:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch a single user profile by ID
   */
  const fetchUserProfile = useCallback(async (userId: number): Promise<UserProfile | null> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/user-profiles/${userId}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch user profile')
      }
      
      return result.data
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user profile')
      console.error('Error fetching user profile:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch single user profile by email
   */
  const fetchUserProfileByEmail = useCallback(async (email: string): Promise<UserProfile | null> => {
    setLoading(true)
    setError(null)
    
    try {
      // Use search filter to find user by email
      const response = await fetch(`/api/user-profiles?search=${encodeURIComponent(email)}`)
      const result = await response.json()
      
      if (!result.success) {
        if (response.status === 404) {
          // User not found is not an error in this context
          return null
        }
        throw new Error(result.message || 'Failed to fetch user profile')
      }
      
      // Find exact email match from search results
      const profiles = result.data
      const exactMatch = profiles.find((profile: UserProfile) => 
        profile.email.toLowerCase() === email.toLowerCase()
      )
      
      if (exactMatch) {
        setCurrentProfile(exactMatch)
        return exactMatch
      }
      return null
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user profile')
      console.error('Error fetching user profile by email:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create new user profile
   */
  const createUserProfile = useCallback(async (data: CreateUserProfileRequest): Promise<UserProfile | null> => {
    setSaving(true)
    setError(null)
    setValidationErrors({})
    
    try {
      const response = await fetch('/api/user-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (!result.success) {
        if (result.validationErrors) {
          setValidationErrors(result.validationErrors)
        }
        throw new Error(result.message || 'Failed to create profile')
      }
      
      const newProfile = result.data
      setCurrentProfile(newProfile)
      
      // Update the profiles list if it's loaded
      setUserProfiles(prev => [...prev, newProfile])
      
      return newProfile
      
    } catch (err: any) {
      setError(err.message || 'Failed to create user profile')
      console.error('Error creating user profile:', err)
      return null
    } finally {
      setSaving(false)
    }
  }, [])

  /**
   * Update a user profile
   */
  const updateUserProfile = useCallback(async (data: UpdateUserProfileRequest): Promise<UserProfile | null> => {
    setSaving(true)
    setError(null)
    setValidationErrors({})
    
    try {
      const response = await fetch(`/api/user-profiles/${data.user_id}`, {
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
          setError(result.message || 'Failed to update user profile')
        }
        return null
      }
      
      // Update current profile if it's the same user
      if (currentProfile && currentProfile.user_id === data.user_id) {
        setCurrentProfile(result.data)
      }
      
      // Update in profiles list
      setUserProfiles(prev => 
        prev.map(profile => profile.user_id === data.user_id ? result.data : profile)
      )
      
      return result.data
    } catch (err: any) {
      setError(err.message || 'Failed to update user profile')
      console.error('Error updating user profile:', err)
      return null
    } finally {
      setSaving(false)
    }
  }, [currentProfile])

  /**
   * Change user password
   */
  const changePassword = useCallback(async (
    userId: number, 
    currentPassword: string, 
    newPassword: string
  ): Promise<boolean> => {
    setSaving(true)
    setError(null)
    setValidationErrors({})
    
    try {
      const response = await fetch(`/api/user-profiles/${userId}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        }),
      })
      
      const result = await response.json()
      
      if (!result.success) {
        if (result.field) {
          setValidationErrors({ [result.field]: result.message })
        } else {
          setError(result.message || 'Failed to change password')
        }
        return false
      }
      
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to change password')
      console.error('Error changing password:', err)
      return false
    } finally {
      setSaving(false)
    }
  }, [])

  /**
   * Upload profile image
   */
  const uploadProfileImage = useCallback(async (
    file: File, 
    type: 'profile' | 'id'
  ): Promise<string | null> => {
    setSaving(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('type', type)
      
      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to upload image')
      }
      
      return result.data.url
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
      console.error('Error uploading image:', err)
      return null
    } finally {
      setSaving(false)
    }
  }, [])

  /**
   * Utility functions
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearValidationErrors = useCallback(() => {
    setValidationErrors({})
  }, [])

  return {
    // Data
    userProfiles,
    currentProfile,
    
    // Loading states
    loading,
    saving,
    
    // Error states
    error,
    validationErrors,
    
    // Actions
    fetchUserProfiles,
    fetchUserProfile,
    fetchUserProfileByEmail,
    createUserProfile,
    updateUserProfile,
    changePassword,
    
    // Utilities
    clearError,
    clearValidationErrors,
    setCurrentProfile,
  }
}

"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  role: string
  name: string
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Role permissions mapping based on user_type from user_profiles table
const rolePermissions: Record<string, string[]> = {
  // Legacy roles (for backward compatibility)
  admin: [
    "all",
    "user_management",
    "system_configuration",
    "reports_analytics",
    "farm_management",
    "equipment_management",
    "production_reports",
    "financial_management",
    "price_management",
    "communication_management"
  ],
  manager: [
    "farm_management",
    "equipment_management",
    "production_reports",
    "financial_management",
    "price_management",
    "communication_management",
    "user_view"
  ],
  operator: [
    "equipment_operation",
    "field_work_tracking",
    "maintenance_reports",
    "time_tracking",
    "basic_reports"
  ],
  planner: [
    "production_planning",
    "scheduling",
    "resource_allocation",
    "progress_monitoring",
    "basic_reports"
  ],
  analyst: [
    "data_analysis",
    "report_generation",
    "performance_metrics",
    "trend_analysis",
    "basic_reports"
  ],
  viewer: [
    "view_reports",
    "basic_information",
    "price_lists",
    "news_updates"
  ],
  
  // User types from user_profiles table
  administrator: [
    "all",
    "user_management",
    "system_configuration",
    "reports_analytics",
    "farm_management",
    "equipment_management",
    "production_reports",
    "financial_management",
    "price_management",
    "communication_management",
    "equipment_operation",
    "field_work_tracking",
    "maintenance_reports",
    "time_tracking",
    "basic_reports",
    "view_reports",
    "production_planning",
    "scheduling",
    "resource_allocation",
    "progress_monitoring",
    "data_analysis",
    "report_generation",
    "performance_metrics",
    "trend_analysis",
    "basic_information",
    "price_lists",
    "news_updates"
  ],
  association_member: [
    "farm_management",
    "production_reports",
    "financial_management",
    "price_management",
    "communication_management",
    "basic_reports",
    "view_reports"
  ],
  unaffiliated: [
    "basic_reports",
    "view_reports",
    "basic_information",
    "price_lists",
    "news_updates"
  ],
  hauler: [
    "equipment_operation",
    "field_work_tracking",
    "maintenance_reports",
    "time_tracking",
    "basic_reports"
  ],
  planter: [
    "production_planning",
    "scheduling",
    "resource_allocation",
    "progress_monitoring",
    "basic_reports"
  ],
  supplier: [
    "financial_management",
    "price_management",
    "communication_management",
    "basic_reports"
  ],
  tractor_operator: [
    "equipment_operation",
    "field_work_tracking",
    "maintenance_reports",
    "time_tracking",
    "basic_reports"
  ],
  driver: [
    "equipment_operation",
    "field_work_tracking",
    "time_tracking",
    "basic_reports"
  ]
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Check for existing session on mount
    const userRole = localStorage.getItem("userRole")
    const userEmail = localStorage.getItem("userEmail")
    
    if (userRole && userEmail) {
      const mockUser: User = {
        id: "1",
        email: userEmail,
        role: userRole,
        name: userEmail.split('@')[0],
        permissions: rolePermissions[userRole] || []
      }
      setUser(mockUser)
      setIsAuthenticated(true)
    }
    setIsInitialized(true)
  }, [])

  const login = async (email: string, password: string, role: string = "") => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Login failed')
      }

      if (!result.success) {
        throw new Error(result.message || 'Login failed')
      }

      const userData = result.data
      
      // Create user object with permissions
      const user: User = {
        id: userData.id.toString(),
        email: userData.email,
        role: userData.role,
        name: userData.name,
        permissions: rolePermissions[userData.role] || []
      }
      
      // Store in localStorage for persistence
      localStorage.setItem("userRole", userData.role)
      localStorage.setItem("userEmail", userData.email)
      localStorage.setItem("userId", userData.id.toString())
      
      setUser(user)
      setIsAuthenticated(true)
      
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Login failed. Please try again.')
    }
  }

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    sessionStorage.clear()
    
    // Reset user state
    setUser(null)
    setIsAuthenticated(false)
    
    // Redirect to landing with login dialog
    if (typeof window !== 'undefined') {
      window.location.href = '/?login=1'
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return user.permissions.includes("all") || user.permissions.includes(permission)
  }

  const hasRole = (role: string): boolean => {
    if (!user) return false
    return user.role === role
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasRole,
    isInitialized
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
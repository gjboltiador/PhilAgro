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

// Role permissions mapping
const rolePermissions: Record<string, string[]> = {
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

  const login = async (email: string, password: string, role: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockUser: User = {
      id: "1",
      email,
      role,
      name: email.split('@')[0],
      permissions: rolePermissions[role] || []
    }
    
    // Store in localStorage for persistence
    localStorage.setItem("userRole", role)
    localStorage.setItem("userEmail", email)
    
    setUser(mockUser)
    setIsAuthenticated(true)
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
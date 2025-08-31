"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UserProfile {
  user_id: number
  first_name: string
  last_name: string
  email: string
  user_type: string
  status: string
}

export function UserManagementSimple() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user-profiles')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Filter users based on current filter
  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true
    if (filter === 'active') return user.status === 'Active'
    if (filter === 'inactive') return user.status === 'Inactive'
    return true
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management (Simple)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div 
              className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                filter === 'all' 
                  ? 'bg-blue-100 border-2 border-blue-300' 
                  : 'bg-blue-50 hover:bg-blue-100'
              }`}
              onClick={() => setFilter('all')}
            >
              <div className="text-2xl font-bold text-blue-800">{users.length}</div>
              <div className="text-sm text-blue-600">Total Users</div>
              {filter === 'all' && <div className="text-xs text-blue-500 mt-1">✓ Selected</div>}
            </div>
            <div 
              className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                filter === 'active' 
                  ? 'bg-green-100 border-2 border-green-300' 
                  : 'bg-green-50 hover:bg-green-100'
              }`}
              onClick={() => setFilter('active')}
            >
              <div className="text-2xl font-bold text-green-800">
                {users.filter(u => u.status === 'Active').length}
              </div>
              <div className="text-sm text-green-600">Active Users</div>
              {filter === 'active' && <div className="text-xs text-green-500 mt-1">✓ Selected</div>}
            </div>
            <div 
              className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                filter === 'inactive' 
                  ? 'bg-red-100 border-2 border-red-300' 
                  : 'bg-red-50 hover:bg-red-100'
              }`}
              onClick={() => setFilter('inactive')}
            >
              <div className="text-2xl font-bold text-red-800">
                {users.filter(u => u.status === 'Inactive').length}
              </div>
              <div className="text-sm text-red-600">Inactive Users</div>
              {filter === 'inactive' && <div className="text-xs text-red-500 mt-1">✓ Selected</div>}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                {filter === 'all' && 'All Users'}
                {filter === 'active' && 'Active Users'}
                {filter === 'inactive' && 'Inactive Users'}
                <span className="text-sm text-gray-500 ml-2">
                  ({filteredUsers.length} users)
                </span>
              </h4>
              {filter !== 'all' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setFilter('all')}
                  className="text-xs"
                >
                  Show All
                </Button>
              )}
            </div>
            {filteredUsers.slice(0, 10).map((user) => (
              <div key={user.user_id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium">{user.first_name} {user.last_name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {user.user_type}
                  </span>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No {filter === 'active' ? 'active' : filter === 'inactive' ? 'inactive' : ''} users found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


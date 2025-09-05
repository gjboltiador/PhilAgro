 "use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye, UserPlus, Shield, Users, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface UserProfile {
  user_id: number
  first_name: string
  middle_name?: string
  last_name: string
  email: string
  phone_number?: string
  address?: string
  user_type: 'Association Member' | 'Unaffiliated' | 'Hauler' | 'Planter' | 'Supplier' | 'Tractor Operator' | 'Driver' | 'Administrator'
  association_id?: number
  association_name?: string
  status: 'Active' | 'Inactive'
  created_at: string
  updated_at: string
  id_type?: string
  id_number?: string
  profile_picture?: string
  avatar?: string
  id_image?: string
}

interface Association {
  association_id: number
  name: string
}

export function UserManagement() {
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [associations, setAssociations] = useState<Association[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    user_type: "Unaffiliated" as UserProfile['user_type'],
    association_id: "",
    status: "Active" as UserProfile['status'],
    id_type: "Others",
    id_number: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Check permissions
  if (!hasPermission("user_management")) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access User Management.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Fetch users and associations
  useEffect(() => {
    fetchUsers()
    fetchAssociations()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/user-profiles')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data || [])
      } else {
        setError('Failed to fetch users')
      }
    } catch (error) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const fetchAssociations = async () => {
    try {
      const response = await fetch('/api/associations')
      if (response.ok) {
        const data = await response.json()
        setAssociations(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch associations:', error)
    }
  }

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/user-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          association_id: formData.association_id ? parseInt(formData.association_id) : null,
          password_hash: "temp_password_hash" // Will be set by the API
        })
      })

      if (response.ok) {
        setSuccess('User created successfully')
        setShowCreateDialog(false)
        resetForm()
        fetchUsers()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create user')
      }
    } catch (error) {
      setError('Failed to create user')
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/user-profiles/${selectedUser.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          association_id: formData.association_id ? parseInt(formData.association_id) : null
        })
      })

      if (response.ok) {
        setSuccess('User updated successfully')
        setShowEditDialog(false)
        resetForm()
        fetchUsers()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update user')
      }
    } catch (error) {
      setError('Failed to update user')
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/user-profiles/${selectedUser.user_id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSuccess('User deleted successfully')
        setShowDeleteDialog(false)
        fetchUsers()
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to delete user')
      }
    } catch (error) {
      setError('Failed to delete user')
    }
  }

  const resetForm = () => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      user_type: "Unaffiliated",
      association_id: "",
      status: "Active",
      id_type: "Others",
      id_number: ""
    })
    setError("")
    setSuccess("")
  }

  const openEditDialog = (user: UserProfile) => {
    setSelectedUser(user)
    setFormData({
      first_name: user.first_name,
      middle_name: user.middle_name || "",
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number || "",
      address: user.address || "",
      user_type: user.user_type,
      association_id: user.association_id?.toString() || "",
      status: user.status,
      id_type: user.id_type || "Others",
      id_number: user.id_number || ""
    })
    setShowEditDialog(true)
  }

  const openViewDialog = (user: UserProfile) => {
    setSelectedUser(user)
    setShowViewDialog(true)
  }

  const openDeleteDialog = (user: UserProfile) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesUserType = userTypeFilter === "all" || user.user_type === userTypeFilter

    return matchesSearch && matchesStatus && matchesUserType
  })

  const getUserTypeColor = (userType: string) => {
    const colors: Record<string, string> = {
      'Administrator': 'bg-red-100 text-red-800',
      'Association Member': 'bg-blue-100 text-blue-800',
      'Unaffiliated': 'bg-gray-100 text-gray-800',
      'Hauler': 'bg-orange-100 text-orange-800',
      'Planter': 'bg-green-100 text-green-800',
      'Supplier': 'bg-purple-100 text-purple-800',
      'Tractor Operator': 'bg-yellow-100 text-yellow-800',
      'Driver': 'bg-indigo-100 text-indigo-800'
    }
    return colors[userType] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-farm-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-farm-green-800">User Management</h1>
          <p className="text-farm-green-600">Manage system users and role-based permissions</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-farm-green-600 hover:bg-farm-green-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-farm-green-800">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-farm-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'Active').length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'Inactive').length}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Types</p>
                <p className="text-2xl font-bold text-blue-600">{new Set(users.map(u => u.user_type)).size}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>User Type</Label>
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Association Member">Association Member</SelectItem>
                  <SelectItem value="Unaffiliated">Unaffiliated</SelectItem>
                  <SelectItem value="Hauler">Hauler</SelectItem>
                  <SelectItem value="Planter">Planter</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Tractor Operator">Tractor Operator</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setUserTypeFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-700">ID</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Phone</th>
                  <th className="text-left p-3 font-semibold text-gray-700">User Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Association</th>
                  <th className="text-left p-3 font-semibold text-gray-700">ID Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Created</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.user_id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-gray-600 font-mono">
                      #{user.user_id}
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900">{user.first_name} {user.middle_name} {user.last_name}</div>
                        {user.id_number && (
                          <div className="text-xs text-gray-500">ID: {user.id_number}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-700">{user.email}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {user.phone_number || '-'}
                    </td>
                    <td className="p-3">
                      <Badge className={getUserTypeColor(user.user_type)}>
                        {user.user_type}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      {user.association_name || 'Unaffiliated'}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {user.id_type || '-'}
                    </td>
                    <td className="p-3">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewDialog(user)}
                          title="View Details"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                          title="Edit User"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(user)}
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm">Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="middle_name">Middle Name</Label>
              <Input
                id="middle_name"
                value={formData.middle_name}
                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="user_type">User Type *</Label>
              <Select value={formData.user_type} onValueChange={(value: UserProfile['user_type']) => setFormData({ ...formData, user_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Association Member">Association Member</SelectItem>
                  <SelectItem value="Unaffiliated">Unaffiliated</SelectItem>
                  <SelectItem value="Hauler">Hauler</SelectItem>
                  <SelectItem value="Planter">Planter</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Tractor Operator">Tractor Operator</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="association_id">Association</Label>
              <Select value={formData.association_id} onValueChange={(value) => setFormData({ ...formData, association_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select association" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Unaffiliated)</SelectItem>
                  {associations.map((association) => (
                    <SelectItem key={association.association_id} value={association.association_id?.toString() || ""}>
                      {association.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: UserProfile['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="id_type">ID Type</Label>
              <Select value={formData.id_type} onValueChange={(value) => setFormData({ ...formData, id_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Driver_License">Driver License</SelectItem>
                  <SelectItem value="TIN_ID">TIN ID</SelectItem>
                  <SelectItem value="Passport">Passport</SelectItem>
                  <SelectItem value="National_ID">National ID</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="id_number">ID Number</Label>
              <Input
                id="id_number"
                value={formData.id_number}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} className="bg-farm-green-600 hover:bg-farm-green-700">
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit_first_name">First Name *</Label>
              <Input
                id="edit_first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_middle_name">Middle Name</Label>
              <Input
                id="edit_middle_name"
                value={formData.middle_name}
                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_last_name">Last Name *</Label>
              <Input
                id="edit_last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_email">Email *</Label>
              <Input
                id="edit_email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit_phone_number">Phone Number</Label>
              <Input
                id="edit_phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_user_type">User Type *</Label>
              <Select value={formData.user_type} onValueChange={(value: UserProfile['user_type']) => setFormData({ ...formData, user_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Association Member">Association Member</SelectItem>
                  <SelectItem value="Unaffiliated">Unaffiliated</SelectItem>
                  <SelectItem value="Hauler">Hauler</SelectItem>
                  <SelectItem value="Planter">Planter</SelectItem>
                  <SelectItem value="Supplier">Supplier</SelectItem>
                  <SelectItem value="Tractor Operator">Tractor Operator</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_association_id">Association</Label>
              <Select value={formData.association_id} onValueChange={(value) => setFormData({ ...formData, association_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select association" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Unaffiliated)</SelectItem>
                  {associations.map((association) => (
                    <SelectItem key={association.association_id} value={association.association_id?.toString() || ""}>
                      {association.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: UserProfile['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_id_type">ID Type</Label>
              <Select value={formData.id_type} onValueChange={(value) => setFormData({ ...formData, id_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Driver_License">Driver License</SelectItem>
                  <SelectItem value="TIN_ID">TIN ID</SelectItem>
                  <SelectItem value="Passport">Passport</SelectItem>
                  <SelectItem value="National_ID">National ID</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_id_number">ID Number</Label>
              <Input
                id="edit_id_number"
                value={formData.id_number}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="edit_address">Address</Label>
            <Textarea
              id="edit_address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} className="bg-farm-green-600 hover:bg-farm-green-700">
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-medium">User ID</Label>
                <p className="text-sm text-gray-600">#{selectedUser.user_id}</p>
              </div>
              <div>
                <Label className="font-medium">Full Name</Label>
                <p>{selectedUser.first_name} {selectedUser.middle_name} {selectedUser.last_name}</p>
              </div>
              <div>
                <Label className="font-medium">Email</Label>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <Label className="font-medium">Phone Number</Label>
                <p>{selectedUser.phone_number || 'Not provided'}</p>
              </div>
              <div>
                <Label className="font-medium">User Type</Label>
                <Badge className={getUserTypeColor(selectedUser.user_type)}>
                  {selectedUser.user_type}
                </Badge>
              </div>
              <div>
                <Label className="font-medium">Status</Label>
                <Badge className={getStatusColor(selectedUser.status)}>
                  {selectedUser.status}
                </Badge>
              </div>
              <div>
                <Label className="font-medium">Association</Label>
                <p>{selectedUser.association_name || 'Unaffiliated'}</p>
              </div>
              <div>
                <Label className="font-medium">ID Type</Label>
                <p>{selectedUser.id_type || 'Not specified'}</p>
              </div>
              <div>
                <Label className="font-medium">ID Number</Label>
                <p>{selectedUser.id_number || 'Not provided'}</p>
              </div>
              <div>
                <Label className="font-medium">Profile Picture</Label>
                <p>{selectedUser.profile_picture || 'default_profile.png'}</p>
              </div>
              <div>
                <Label className="font-medium">Avatar</Label>
                <p>{selectedUser.avatar || 'default_avatar.png'}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="font-medium">Address</Label>
                <p className="whitespace-pre-wrap">{selectedUser.address || 'Not provided'}</p>
              </div>
              <div>
                <Label className="font-medium">Created</Label>
                <p>{new Date(selectedUser.created_at).toLocaleString()}</p>
              </div>
              <div>
                <Label className="font-medium">Last Updated</Label>
                <p>{new Date(selectedUser.updated_at).toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.first_name} {selectedUser?.last_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}



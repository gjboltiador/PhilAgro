"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, Plus, Edit, Trash2, Search, Lock, Unlock, Phone, User, IdCard, Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type SystemUserStatus = "active" | "inactive"

interface SystemUserRecord {
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
  role: string
  status: SystemUserStatus
  profileInfo: {
    department?: string
    position?: string
    location?: string
    employeeId?: string
    dateOfBirth?: string
    address?: string
    emergencyContact?: string
    emergencyContactNumber?: string
  }
  otpSettings: {
    enabled: boolean
    lastVerified?: string
    preferredMethod: 'sms' | 'email'
  }
  createdAt: string
  updatedAt?: string
}

const LOCAL_STORAGE_KEY = "systemUsers"
const DEFAULT_ROLES = ["admin", "manager", "operator", "planner", "analyst", "viewer"]

function generateId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function loadUsers(): SystemUserRecord[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    const users = JSON.parse(raw) as any[]
    
    // Migrate old user data to new structure
    return users.map(user => migrateUserData(user))
  } catch {
    return []
  }
}

function migrateUserData(user: any): SystemUserRecord {
  // If user already has the new structure, return as is
  if (user.firstName && user.lastName && user.profileInfo && user.otpSettings) {
    return user as SystemUserRecord
  }
  
  // Migrate old structure to new structure
  const nameParts = (user.name || '').split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''
  
  return {
    id: user.id,
    firstName,
    lastName,
    email: user.email || '',
    contactNumber: user.contactNumber || '+63 917 000 0000',
    role: user.role || 'viewer',
    status: user.status || 'active',
    profileInfo: {
      department: user.department || undefined,
      position: user.position || undefined,
      location: user.location || undefined,
      employeeId: user.employeeId || `EMP${user.id.slice(-3)}`,
      dateOfBirth: user.dateOfBirth || undefined,
      address: user.address || undefined,
      emergencyContact: user.emergencyContact || undefined,
      emergencyContactNumber: user.emergencyContactNumber || undefined,
    },
    otpSettings: {
      enabled: user.otpEnabled || false,
      preferredMethod: user.otpMethod || 'sms',
      lastVerified: user.lastOtpVerified || undefined
    },
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || undefined
  }
}

function saveUsers(users: SystemUserRecord[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users))
}

function ensureSeedData(): SystemUserRecord[] {
  const existing = loadUsers()
  if (existing.length > 0) return existing
  const seeded: SystemUserRecord[] = [
    { 
      id: generateId(), 
      firstName: "System", 
      lastName: "Administrator", 
      email: "admin@example.com", 
      contactNumber: "+63 917 123 4567",
      role: "admin", 
      status: "active", 
      profileInfo: {
        department: "IT",
        position: "System Administrator",
        location: "Main Office",
        employeeId: "EMP001"
      },
      otpSettings: {
        enabled: true,
        preferredMethod: 'sms'
      },
      createdAt: new Date().toISOString() 
    },
    { 
      id: generateId(), 
      firstName: "Operations", 
      lastName: "Manager", 
      email: "manager@example.com", 
      contactNumber: "+63 917 234 5678",
      role: "manager", 
      status: "active", 
      profileInfo: {
        department: "Operations",
        position: "Operations Manager",
        location: "Field Office",
        employeeId: "EMP002"
      },
      otpSettings: {
        enabled: true,
        preferredMethod: 'sms'
      },
      createdAt: new Date().toISOString() 
    },
    { 
      id: generateId(), 
      firstName: "Field", 
      lastName: "Operator", 
      email: "operator@example.com", 
      contactNumber: "+63 917 345 6789",
      role: "operator", 
      status: "inactive", 
      profileInfo: {
        department: "Field Operations",
        position: "Field Operator",
        location: "Remote Site",
        employeeId: "EMP003"
      },
      otpSettings: {
        enabled: false,
        preferredMethod: 'sms'
      },
      createdAt: new Date().toISOString() 
    },
  ]
  saveUsers(seeded)
  return seeded
}

function roleBadge(role: string) {
  const map: Record<string, string> = {
    admin: "bg-red-100 text-red-700",
    manager: "bg-blue-100 text-blue-700",
    operator: "bg-green-100 text-green-800",
    planner: "bg-purple-100 text-purple-700",
    analyst: "bg-amber-100 text-amber-700",
    viewer: "bg-gray-100 text-gray-700",
  }
  const cls = map[role] || "bg-gray-100 text-gray-700"
  return <Badge className={cls}>{role}</Badge>
}

export function UserManagement() {
  const { user, hasPermission } = useAuth()
  const canManage = hasPermission("user_management")

  const [users, setUsers] = useState<SystemUserRecord[]>([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<SystemUserStatus | "all">("all")
  const [activeTab, setActiveTab] = useState("users")

  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState<null | SystemUserRecord>(null)

  useEffect(() => {
    const loadedUsers = ensureSeedData()
    setUsers(loadedUsers)
    // Save migrated data back to localStorage to persist the new structure
    saveUsers(loadedUsers)
  }, [])

  const filtered = useMemo(() => {
    return users.filter(u => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.contactNumber.includes(search) ||
        (u.profileInfo?.employeeId && u.profileInfo.employeeId.toLowerCase().includes(search.toLowerCase()))
      const matchesRole = roleFilter === "all" || u.role === roleFilter
      const matchesStatus = statusFilter === "all" || u.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  function createUser(payload: Omit<SystemUserRecord, "id" | "createdAt">) {
    const next: SystemUserRecord = { ...payload, id: generateId(), createdAt: new Date().toISOString() }
    const nextUsers = [next, ...users]
    setUsers(nextUsers)
    saveUsers(nextUsers)
  }

  function updateUser(id: string, patch: Partial<SystemUserRecord>) {
    const nextUsers = users.map(u => (u.id === id ? { ...u, ...patch } : u))
    setUsers(nextUsers)
    saveUsers(nextUsers)
  }

  function removeUser(id: string) {
    const nextUsers = users.filter(u => u.id !== id)
    setUsers(nextUsers)
    saveUsers(nextUsers)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              User Management
            </CardTitle>
            <CardDescription>Manage system users and role-based permissions</CardDescription>
          </div>
          <Button onClick={() => setShowCreate(true)} title={canManage ? "Add a new user" : "You have read-only access"}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canManage && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 flex items-center gap-2">
            <Shield className="h-4 w-4" />
            You have read-only access. Contact an administrator for user management permissions.
          </div>
        )}

        <Tabs defaultValue="users" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search name, email, phone, or employee ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {DEFAULT_ROLES.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>OTP Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="font-medium">{u.firstName} {u.lastName}</div>
                        <div className="text-xs text-gray-500">ID: {u.profileInfo?.employeeId || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {u.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {u.contactNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{roleBadge(u.role)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{u.profileInfo?.department || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{u.profileInfo?.position || ''}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {u.otpSettings?.enabled ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Enabled
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {u.otpSettings?.preferredMethod?.toUpperCase() || 'SMS'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {u.status === "active" ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowEdit(u)}
                            disabled={!canManage}
                            title={canManage ? "Edit user" : "Insufficient permissions"}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateUser(u.id, { status: u.status === "active" ? "inactive" : "active" })}
                            disabled={!canManage}
                            title={u.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {u.status === "active" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeUser(u.id)}
                            disabled={!canManage}
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-gray-500">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="roles">
            <div className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle>Available Roles</CardTitle>
                  <CardDescription>Predefined roles used for role-based access control</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {DEFAULT_ROLES.map((r) => (
                    <div key={r} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span className="font-medium capitalize">{r}</span>
                      </div>
                      {roleBadge(r)}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <div className="text-xs text-gray-500">Permissions are determined by role in this version. Customize in a backend later.</div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create user dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>Create a new system user with detailed profile information</DialogDescription>
            </DialogHeader>
            {!canManage && (
              <div className="mb-3 rounded-md border border-yellow-200 bg-yellow-50 p-2 text-sm text-yellow-800">
                You have read-only access. Ask an administrator to grant the "user_management" permission.
              </div>
            )}
            <UserForm
              onSubmit={(data) => {
                createUser(data)
                setShowCreate(false)
              }}
              onCancel={() => setShowCreate(false)}
              roles={DEFAULT_ROLES}
              disabled={!canManage}
            />
          </DialogContent>
        </Dialog>

        {/* Edit user dialog */}
        <Dialog open={!!showEdit} onOpenChange={(o) => !o && setShowEdit(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user details, profile information, and security settings</DialogDescription>
            </DialogHeader>
            {showEdit && (
              <UserForm
                initial={showEdit}
                onSubmit={(data) => {
                  updateUser(showEdit.id, data)
                  setShowEdit(null)
                }}
                onCancel={() => setShowEdit(null)}
                roles={DEFAULT_ROLES}
                disabled={!canManage}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

function isValidEmail(email: string): boolean {
  return /.+@.+\..+/.test(email)
}

function UserForm({
  initial,
  onSubmit,
  onCancel,
  roles,
  disabled,
}: {
  initial?: Partial<SystemUserRecord>
  onSubmit: (data: Omit<SystemUserRecord, "id" | "createdAt">) => void
  onCancel: () => void
  roles: string[]
  disabled?: boolean
}) {
  // Basic Info
  const [firstName, setFirstName] = useState(initial?.firstName || "")
  const [lastName, setLastName] = useState(initial?.lastName || "")
  const [email, setEmail] = useState(initial?.email || "")
  const [contactNumber, setContactNumber] = useState(initial?.contactNumber || "")
  const [role, setRole] = useState(initial?.role || roles[0])
  const [status, setStatus] = useState<SystemUserStatus>((initial?.status as SystemUserStatus) || "active")
  
  // Profile Info
  const [department, setDepartment] = useState(initial?.profileInfo?.department || "")
  const [position, setPosition] = useState(initial?.profileInfo?.position || "")
  const [location, setLocation] = useState(initial?.profileInfo?.location || "")
  const [employeeId, setEmployeeId] = useState(initial?.profileInfo?.employeeId || "")
  const [dateOfBirth, setDateOfBirth] = useState(initial?.profileInfo?.dateOfBirth || "")
  const [address, setAddress] = useState(initial?.profileInfo?.address || "")
  const [emergencyContact, setEmergencyContact] = useState(initial?.profileInfo?.emergencyContact || "")
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(initial?.profileInfo?.emergencyContactNumber || "")
  
  // OTP Settings
  const [otpEnabled, setOtpEnabled] = useState(initial?.otpSettings?.enabled || false)
  const [otpMethod, setOtpMethod] = useState<'sms' | 'email'>(initial?.otpSettings?.preferredMethod || 'sms')
  
  const [error, setError] = useState<string>("")
  const [activeTab, setActiveTab] = useState("basic")

  function isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  }

  function handleSubmit() {
    if (!firstName.trim()) return setError("First name is required")
    if (!lastName.trim()) return setError("Last name is required")
    if (!email.trim() || !isValidEmail(email)) return setError("Valid email is required")
    if (!contactNumber.trim() || !isValidPhoneNumber(contactNumber)) return setError("Valid contact number is required")
    if (!role) return setError("Role is required")
    
    setError("")
    
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      role,
      status,
      profileInfo: {
        department: department.trim() || undefined,
        position: position.trim() || undefined,
        location: location.trim() || undefined,
        employeeId: employeeId.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
        address: address.trim() || undefined,
        emergencyContact: emergencyContact.trim() || undefined,
        emergencyContactNumber: emergencyContactNumber.trim() || undefined,
      },
      otpSettings: {
        enabled: otpEnabled,
        preferredMethod: otpMethod
      },
      updatedAt: new Date().toISOString()
    }
    
    onSubmit(userData)
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
      <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  disabled={disabled}
                  placeholder="Enter first name" 
                />
        </div>
        <div className="space-y-1">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  disabled={disabled}
                  placeholder="Enter last name" 
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={disabled}
                placeholder="user@example.com" 
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input 
                id="contactNumber" 
                value={contactNumber} 
                onChange={(e) => setContactNumber(e.target.value)} 
                disabled={disabled}
                placeholder="+63 917 123 4567" 
              />
              <div className="text-xs text-gray-500">Required for OTP verification</div>
        </div>
            
            <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
                <Label htmlFor="role">Role *</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
              
        <div className="space-y-1">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as SystemUserStatus)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input 
                  id="employeeId" 
                  value={employeeId} 
                  onChange={(e) => setEmployeeId(e.target.value)} 
                  disabled={disabled}
                  placeholder="EMP001" 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date" 
                  value={dateOfBirth} 
                  onChange={(e) => setDateOfBirth(e.target.value)} 
                  disabled={disabled}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="department">Department</Label>
                <Input 
                  id="department" 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  disabled={disabled}
                  placeholder="IT Department" 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="position">Position</Label>
                <Input 
                  id="position" 
                  value={position} 
                  onChange={(e) => setPosition(e.target.value)} 
                  disabled={disabled}
                  placeholder="System Administrator" 
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="location">Work Location</Label>
              <Input 
                id="location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                disabled={disabled}
                placeholder="Main Office, Field Site, Remote" 
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                disabled={disabled}
                placeholder="Complete address" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input 
                  id="emergencyContact" 
                  value={emergencyContact} 
                  onChange={(e) => setEmergencyContact(e.target.value)} 
                  disabled={disabled}
                  placeholder="Emergency contact name" 
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
                <Input 
                  id="emergencyContactNumber" 
                  value={emergencyContactNumber} 
                  onChange={(e) => setEmergencyContactNumber(e.target.value)} 
                  disabled={disabled}
                  placeholder="+63 917 123 4567" 
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-base">OTP Authentication</div>
                <div className="text-sm text-gray-500">
                  Enable one-time password verification for enhanced security
                </div>
              </div>
              <Select value={otpEnabled ? "enabled" : "disabled"} onValueChange={(v) => setOtpEnabled(v === "enabled")}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {otpEnabled && (
              <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <div className="space-y-1">
                  <Label htmlFor="otpMethod">Preferred OTP Method</Label>
                  <Select value={otpMethod} onValueChange={(v) => setOtpMethod(v as 'sms' | 'email')}>
                    <SelectTrigger id="otpMethod">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS (Text Message)</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4" />
                    <span>SMS will be sent to: {contactNumber || 'No contact number'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email will be sent to: {email || 'No email'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={disabled}>Save User</Button>
      </div>
    </div>
  )
}

export default UserManagement



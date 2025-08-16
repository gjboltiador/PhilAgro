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
import { Shield, Users, Plus, Edit, Trash2, Search, Lock, Unlock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type SystemUserStatus = "active" | "inactive"

interface SystemUserRecord {
  id: string
  name: string
  email: string
  role: string
  status: SystemUserStatus
  createdAt: string
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
    return JSON.parse(raw) as SystemUserRecord[]
  } catch {
    return []
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
    { id: generateId(), name: "System Administrator", email: "admin@example.com", role: "admin", status: "active", createdAt: new Date().toISOString() },
    { id: generateId(), name: "Operations Manager", email: "manager@example.com", role: "manager", status: "active", createdAt: new Date().toISOString() },
    { id: generateId(), name: "Field Operator", email: "operator@example.com", role: "operator", status: "inactive", createdAt: new Date().toISOString() },
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
    setUsers(ensureSeedData())
  }, [])

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
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
                  placeholder="Search name or email"
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
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{roleBadge(u.role)}</TableCell>
                      <TableCell>
                        {u.status === "active" ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
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
                      <TableCell colSpan={6} className="text-center text-sm text-gray-500">
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>Create a new system user</DialogDescription>
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user details and role</DialogDescription>
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
  const [name, setName] = useState(initial?.name || "")
  const [email, setEmail] = useState(initial?.email || "")
  const [role, setRole] = useState(initial?.role || roles[0])
  const [status, setStatus] = useState<SystemUserStatus>((initial?.status as SystemUserStatus) || "active")
  const [error, setError] = useState<string>("")

  function handleSubmit() {
    if (!name.trim()) return setError("Name is required")
    if (!email.trim() || !isValidEmail(email)) return setError("Valid email is required")
    if (!role) return setError("Role is required")
    setError("")
    onSubmit({ name: name.trim(), email: email.trim(), role, status })
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>
      )}
      <div className="grid gap-3">
        <div className="space-y-1">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={disabled} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={disabled} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="role">Role</Label>
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
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={disabled}>Save</Button>
      </div>
    </div>
  )
}

export default UserManagement



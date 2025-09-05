"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/sidebar-navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useAssociations } from "@/hooks/use-associations"
import { useSugarMills } from "@/hooks/use-sugar-mills"
import { SugarMill, CreateSugarMillRequest, UpdateSugarMillRequest } from "@/lib/sugar-mills-dao"
import { LogoUpload } from "@/components/logo-upload"
import { Loader2 } from "lucide-react"
import { UserManagementSimple } from "@/components/user-management-simple"
import { Association } from "@/lib/database"
import { ProfileSettingsDialog } from "@/components/profile-settings-dialog"
import { useProfileDialog } from "@/hooks/use-profile-dialog"
import { SugarMillForm } from "@/components/sugar-mill-form"



// Planter membership data structure
interface PlanterMembership {
  id: string
  planterCode: string
  planterName: string
  associationId: string
  associationName: string
  membershipDate: string
  duesStatus: "paid" | "pending" | "overdue"
  lastPaymentDate: string
  cropYear: string
  hasDeliveries: boolean
  deliveryCount: number
  totalDelivered: number
  canTransfer: boolean
  transferRestrictionReason: string
}

// Sugar mills data now comes from database via useSugarMills hook

// Mock data removed - now using real database data via useAssociations hook

// Mock data for planter memberships
const planterMemberships: PlanterMembership[] = [
  {
    id: "MEM-001",
    planterCode: "HDJ/Abuso, Mercy R.",
    planterName: "Abuso, Mercy R.",
    associationId: "ASSO-001",
    associationName: "NOSPA",
    membershipDate: "2024-01-15",
    duesStatus: "paid",
    lastPaymentDate: "2024-01-15",
    cropYear: "2024-2025",
    hasDeliveries: true,
    deliveryCount: 5,
    totalDelivered: 45.2,
    canTransfer: false,
    transferRestrictionReason: "Has deliveries in current crop year"
  },
  {
    id: "MEM-002",
    planterCode: "HDJ/Acabal, Maximiano C.",
    planterName: "Acabal, Maximiano C.",
    associationId: "ASSO-002",
    associationName: "BASUCO",
    membershipDate: "2024-01-20",
    duesStatus: "pending",
    lastPaymentDate: "",
    cropYear: "2024-2025",
    hasDeliveries: false,
    deliveryCount: 0,
    totalDelivered: 0,
    canTransfer: true,
    transferRestrictionReason: ""
  },
  {
    id: "MEM-003",
    planterCode: "HDJ/Aguilar, Harry N.",
    planterName: "Aguilar, Harry N.",
    associationId: "ASSO-001",
    associationName: "NOSPA",
    membershipDate: "2024-01-25",
    duesStatus: "overdue",
    lastPaymentDate: "2023-12-15",
    cropYear: "2024-2025",
    hasDeliveries: true,
    deliveryCount: 3,
    totalDelivered: 28.7,
    canTransfer: false,
    transferRestrictionReason: "Has deliveries in current crop year"
  }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [selectedAssociation, setSelectedAssociation] = useState<any>(null)
  const { isOpen: isProfileDialogOpen, openDialog: openProfileDialog, closeDialog: closeProfileDialog } = useProfileDialog()
  const [selectedSugarMill, setSelectedSugarMill] = useState<SugarMill | null>(null)
  const [showAddAssociation, setShowAddAssociation] = useState(false)
  const [showEditAssociation, setShowEditAssociation] = useState(false)
  const [showDeleteAssociation, setShowDeleteAssociation] = useState(false)
  const [showAddSugarMill, setShowAddSugarMill] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sugarMillSearchQuery, setSugarMillSearchQuery] = useState("")
  const [sugarMillFilterStatus, setSugarMillFilterStatus] = useState("all")
  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    address: "",
    contact_person: "",
    phone: "",
    contact_email: "",
    website: "",
    logo_url: "",
    registration_number: "",
    tax_id: "",
    dues_amount: 0,
    dues_frequency: "annually" as "monthly" | "quarterly" | "annually",
    crop_year: "2024-2025",
    status: "active" as "active" | "inactive",
    member_count: 0
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)

  // Use the associations hook for database integration
  const {
    associations: associationsData,
    loading: associationsLoading,
    creating,
    updating,
    deleting,
    error: associationsError,
    validationErrors,
    createAssociation,
    updateAssociation,
    deleteAssociation,
    clearError,
    clearValidationErrors
  } = useAssociations()

  // Use the sugar mills hook for database integration
  const {
    sugarMills,
    statistics: sugarMillStats,
    provinces,
    cities,
    loading: sugarMillsLoading,
    creating: creatingSugarMill,
    updating: updatingSugarMill,
    deleting: deletingSugarMill,
    error: sugarMillsError,
    validationErrors: sugarMillsValidationErrors,
    createSugarMill,
    updateSugarMill,
    deleteSugarMill,
    clearError: clearSugarMillsError,
    clearValidationErrors: clearSugarMillsValidationErrors,
    fetchLocations
  } = useSugarMills()

  // Component is now using real database data via useAssociations hook

  const getDuesStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTransferStatusBadge = (canTransfer: boolean, reason: string) => {
    if (canTransfer) {
      return <Badge className="bg-green-100 text-green-800">Can Transfer</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800" title={reason}>Restricted</Badge>
    }
  }

  const getOperatingStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>
      case "seasonal":
        return <Badge className="bg-blue-100 text-blue-800">Seasonal</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // CRUD Operations for Associations
  const resetForm = () => {
    setFormData({
      name: "",
      short_name: "",
      address: "",
      contact_person: "",
      phone: "",
      contact_email: "",
      website: "",
      logo_url: "",
      registration_number: "",
      tax_id: "",
      dues_amount: 0,
      dues_frequency: "annually",
      crop_year: "2024-2025",
      status: "active",
      member_count: 0
    })
    setLogoFile(null)
    clearValidationErrors()
    clearError()
  }

  const handleAddAssociation = () => {
    resetForm()
    setSelectedAssociation(null)
    setShowAddAssociation(true)
  }

  const handleEditAssociation = (association: any) => {
    setFormData({
      name: association.name || "",
      short_name: association.short_name || "",
      address: association.address || "",
      contact_person: association.contact_person || "",
      phone: association.phone || "",
      contact_email: association.contact_email || "",
      website: association.website || "",
      logo_url: association.logo_url || "",
      registration_number: association.registration_number || "",
      tax_id: association.tax_id || "",
      dues_amount: association.dues_amount || 0,
      dues_frequency: association.dues_frequency || "annually",
      crop_year: association.crop_year || "2024-2025",
      status: association.status || "active",
      member_count: association.member_count || 0
    })
    setLogoFile(null)
    setSelectedAssociation(association)
    setShowEditAssociation(true)
  }

  const handleDeleteAssociation = (association: any) => {
    setSelectedAssociation(association)
    setShowDeleteAssociation(true)
  }

  const submitAssociation = async () => {
    try {
      let logoUrl = formData.logo_url

      // Upload logo if a new file is selected
      if (logoFile) {
        const logoFormData = new FormData()
        logoFormData.append('logo', logoFile)

        const uploadResponse = await fetch('/api/upload/association-logo', {
          method: 'POST',
          body: logoFormData
        })

        const uploadResult = await uploadResponse.json()
        if (uploadResult.success) {
          logoUrl = uploadResult.data.url
        } else {
          throw new Error(uploadResult.error || 'Failed to upload logo')
        }
      }

      const submissionData = {
        ...formData,
        logo_url: logoUrl
      }

      if (selectedAssociation) {
        // Edit existing association
        const result = await updateAssociation({ 
          id: selectedAssociation.id,
          ...submissionData 
        })
        if (result) {
          setShowEditAssociation(false)
          resetForm()
          setSelectedAssociation(null)
        }
      } else {
        // Add new association
        const result = await createAssociation(submissionData)
        if (result) {
          setShowAddAssociation(false)
          resetForm()
        }
      }
    } catch (error) {
      console.error('Error submitting association:', error)
    }
  }

  const handleLogoChange = (logoUrl: string | null, file: File | null) => {
    setLogoFile(file)
    if (logoUrl && !file) {
      // User is setting existing URL
      setFormData(prev => ({ ...prev, logo_url: logoUrl }))
    } else if (file) {
      // User selected new file
      setFormData(prev => ({ ...prev, logo_url: "" })) // Will be set after upload
    } else {
      // User removed logo
      setFormData(prev => ({ ...prev, logo_url: "" }))
    }
  }

  const confirmDeleteAssociation = async () => {
    if (selectedAssociation) {
      const success = await deleteAssociation(selectedAssociation.id)
      if (success) {
        setShowDeleteAssociation(false)
        setSelectedAssociation(null)
      }
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear validation error for this field
    if (validationErrors[field]) {
      clearValidationErrors()
    }
  }

  // Sugar mill handlers
  const handleSugarMillSubmit = async (data: CreateSugarMillRequest | UpdateSugarMillRequest) => {
    if ('id' in data) {
      // Update operation
      const result = await updateSugarMill(data as UpdateSugarMillRequest)
      if (result) {
        setSelectedSugarMill(null)
        clearSugarMillsValidationErrors()
      }
    } else {
      // Create operation
      const result = await createSugarMill(data as CreateSugarMillRequest)
      if (result) {
        setShowAddSugarMill(false)
        clearSugarMillsValidationErrors()
      }
    }
  }

  const handleDeleteSugarMill = async (id: number) => {
    if (confirm('Are you sure you want to delete this sugar mill? This action cannot be undone.')) {
      await deleteSugarMill(id)
    }
  }

  const filteredMemberships = planterMemberships.filter(membership => {
    const matchesSearch = membership.planterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         membership.planterCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         membership.associationName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || membership.duesStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredSugarMills = sugarMills.filter(mill => {
    const matchesSearch = mill.full_name.toLowerCase().includes(sugarMillSearchQuery.toLowerCase()) ||
                         mill.short_name.toLowerCase().includes(sugarMillSearchQuery.toLowerCase()) ||
                         mill.plant_code.toLowerCase().includes(sugarMillSearchQuery.toLowerCase()) ||
                         mill.city.toLowerCase().includes(sugarMillSearchQuery.toLowerCase())
    const matchesStatus = sugarMillFilterStatus === "all" || mill.operating_status === sugarMillFilterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <ProtectedRoute requiredPermission="system_configuration">
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        </div>

        <Tabs defaultValue="general" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 md:w-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="sugar-mills">Sugar Mills</TabsTrigger>
            <TabsTrigger value="associations">Associations</TabsTrigger>
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>Update your organization details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input id="org-name" defaultValue="Phil Agro-Industrial Technologist Agriculture" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-shortname">Short Name</Label>
                    <Input id="org-shortname" defaultValue="Phil Agro" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-address">Address</Label>
                  <Textarea id="org-address" defaultValue="123 Agriculture Road, Manila, Philippines" />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="org-email">Email</Label>
                    <Input id="org-email" type="email" defaultValue="contact@philagro.org" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-phone">Phone</Label>
                    <Input id="org-phone" defaultValue="+63 2 8123 4567" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Configure regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="asia_manila">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia_manila">Asia/Manila (GMT+8)</SelectItem>
                        <SelectItem value="asia_singapore">Asia/Singapore (GMT+8)</SelectItem>
                        <SelectItem value="asia_tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="php">
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="php">Philippine Peso (₱)</SelectItem>
                        <SelectItem value="usd">US Dollar ($)</SelectItem>
                        <SelectItem value="eur">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="measurement">Measurement System</Label>
                    <Select defaultValue="metric">
                      <SelectTrigger id="measurement">
                        <SelectValue placeholder="Select measurement system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (kg, tons)</SelectItem>
                        <SelectItem value="imperial">Imperial (lbs, tons)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Sugar Mills Management Tab */}
          <TabsContent value="sugar-mills" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Sugar Mills & Plants</h3>
                <p className="text-sm text-gray-600">Manage sugar milling facilities and their operational details</p>
              </div>
              <Button onClick={() => setShowAddSugarMill(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sugar Mill
              </Button>
            </div>

            {/* Search and Filter Controls */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search sugar mills, plant codes, cities..."
                      value={sugarMillSearchQuery}
                      onChange={(e) => setSugarMillSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={sugarMillFilterStatus} onValueChange={setSugarMillFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Sugar Mills Grid View */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSugarMills.map((mill) => (
                <Card key={mill.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-green-600" />
                        <div>
                          <CardTitle className="text-lg">{mill.plant_code}</CardTitle>
                          <CardDescription className="text-sm">{mill.short_name}</CardDescription>
                        </div>
                      </div>
                      {getOperatingStatusBadge(mill.operating_status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{mill.full_name}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{mill.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{mill.city}, {mill.province}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{mill.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{mill.email}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-semibold">{mill.capacity?.toLocaleString() || 'N/A'} {mill.capacity_unit}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Crop Year:</span>
                        <span>{mill.crop_year}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Manager:</span>
                        <span className="text-xs">{mill.manager_name}</span>
                      </div>
                    </div>




                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedSugarMill(mill)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDeleteSugarMill(mill.id)}
                      disabled={deletingSugarMill}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Sugar Mills Table View */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Sugar Mills Information</CardTitle>
                <CardDescription>
                  Complete information about all registered sugar milling facilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plant Code</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Operating Status</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSugarMills.map((mill) => (
                        <TableRow key={mill.id}>
                          <TableCell className="font-medium">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {mill.plant_code}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{mill.short_name}</div>
                              <div className="text-sm text-gray-500">{mill.full_name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{mill.city}, {mill.province}</div>
                              <div className="text-xs text-gray-500">{mill.address}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">
                              {mill.capacity?.toLocaleString() || 'N/A'} {mill.capacity_unit}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getOperatingStatusBadge(mill.operating_status)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{mill.manager_name}</div>
                              <div className="text-xs text-gray-500">{mill.manager_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{mill.phone}</div>
                              <div className="text-xs text-gray-500">{mill.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedSugarMill(mill)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteSugarMill(mill.id)}
                                disabled={deletingSugarMill}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Sugar Mill Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-800">{filteredSugarMills.length}</div>
                      <div className="text-sm text-green-600">Total Sugar Mills</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-800">
                        {filteredSugarMills.filter(m => m.operating_status === "operational").length}
                      </div>
                      <div className="text-sm text-blue-600">Operational</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold text-yellow-800">
                        {filteredSugarMills.filter(m => m.operating_status === "maintenance").length}
                      </div>
                      <div className="text-sm text-yellow-600">Under Maintenance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-800">
                        {filteredSugarMills.reduce((total, mill) => total + (mill.capacity || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-600">Total Capacity (tons)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sugar Mill Form Dialog */}
            <Dialog open={showAddSugarMill} onOpenChange={setShowAddSugarMill}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Sugar Mill</DialogTitle>
                  <DialogDescription>
                    Add a new sugar milling facility to the system
                  </DialogDescription>
                </DialogHeader>
                <SugarMillForm
                  onSubmit={handleSugarMillSubmit}
                  loading={creatingSugarMill}
                  validationErrors={sugarMillsValidationErrors}
                  onClearValidationErrors={clearSugarMillsValidationErrors}
                />
              </DialogContent>
            </Dialog>

            {/* Edit Sugar Mill Dialog */}
            <Dialog open={!!selectedSugarMill} onOpenChange={() => setSelectedSugarMill(null)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Sugar Mill</DialogTitle>
                  <DialogDescription>
                    Update the details for {selectedSugarMill?.short_name}
                  </DialogDescription>
                </DialogHeader>
                <SugarMillForm
                  initialData={selectedSugarMill || undefined}
                  onSubmit={handleSugarMillSubmit}
                  loading={updatingSugarMill}
                  validationErrors={sugarMillsValidationErrors}
                  onClearValidationErrors={clearSugarMillsValidationErrors}
                />
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Associations Management Tab */}
          <TabsContent value="associations" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Sugar Farmers Associations</h3>
                <p className="text-sm text-gray-600">Manage sugar farmers associations and their details</p>
              </div>
              <Button onClick={handleAddAssociation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Association
              </Button>
            </div>

            {/* Loading State */}
            {associationsLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading associations...</span>
              </div>
            )}

            {/* Error State */}
            {associationsError && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading associations</h3>
                    <p className="mt-1 text-sm text-red-700">{associationsError}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2" 
                      onClick={clearError}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Associations Grid */}
            {!associationsLoading && !associationsError && (
              <div className="grid gap-4 md:grid-cols-3">
                {associationsData.length === 0 ? (
                  <div className="col-span-3 text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No associations found</h3>
                    <p className="text-gray-600 mb-4">Get started by adding your first sugar farmers association.</p>
                    <Button onClick={handleAddAssociation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Association
                    </Button>
                  </div>
                ) : (
                  associationsData.map((association) => (
                    <Card key={association.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {association.logo_url ? (
                              <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
                                <img
                                  src={association.logo_url}
                                  alt={`${association.name} logo`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement
                                    const fallback = target.nextElementSibling as HTMLElement
                                    target.style.display = 'none'
                                    if (fallback) fallback.style.display = 'flex'
                                  }}
                                />
                                <div className="w-full h-full bg-gray-100 items-center justify-center hidden">
                                  <Building2 className="h-5 w-5 text-gray-400" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Building2 className="h-5 w-5 text-blue-600" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-lg truncate">{association.short_name || association.name}</CardTitle>
                              <CardDescription className="line-clamp-1">{association.name}</CardDescription>
                            </div>
                          </div>
                          <Badge variant={association.status === "active" ? "default" : "secondary"}>
                            {association.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          {association.address && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700 line-clamp-1">{association.address}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{association.member_count || 0} members</span>
                          </div>
                          {association.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">{association.phone}</span>
                            </div>
                          )}
                          {association.contact_email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700 line-clamp-1">{association.contact_email}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Association Dues:</span>
                            <span className="font-semibold">₱{(association.dues_amount || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Frequency:</span>
                            <span className="capitalize">{association.dues_frequency || 'annually'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Crop Year:</span>
                            <span>{association.crop_year_label || association.crop_year || '2024-2025'}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1" 
                          onClick={() => handleEditAssociation(association)}
                          disabled={updating}
                        >
                          {updating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Edit className="h-4 w-4 mr-2" />}
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Users className="h-4 w-4 mr-2" />
                          Members
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700" 
                          onClick={() => handleDeleteAssociation(association)}
                          disabled={deleting}
                        >
                          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Add/Edit Association Modal */}
            <Dialog open={showAddAssociation || showEditAssociation} onOpenChange={(open) => {
              if (!open) {
                setShowAddAssociation(false)
                setShowEditAssociation(false)
                resetForm()
                setSelectedAssociation(null)
              }
            }}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {selectedAssociation ? "Edit Association" : "Add New Association"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedAssociation ? "Update association information and settings." : "Enter the details for the new sugar farmers association."}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  {/* Logo Upload Section */}
                  <div className="border-b pb-4">
                    <LogoUpload
                      currentLogoUrl={formData.logo_url}
                      onLogoChange={handleLogoChange}
                      entityName="Association"
                      disabled={creating || updating}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="association-name">Association Name</Label>
                      <Input 
                        id="association-name"
                        placeholder="Enter full association name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={validationErrors.name ? "border-red-500" : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="association-shortname">Short Name / Acronym</Label>
                      <Input 
                        id="association-shortname"
                        placeholder="e.g., NOSPA, BASUCO"
                        value={formData.short_name}
                        onChange={(e) => handleInputChange("short_name", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="association-address">Complete Address</Label>
                    <Textarea 
                      id="association-address"
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contact-person">Contact Person</Label>
                      <Input 
                        id="contact-person"
                        placeholder="Full name of contact person"
                        value={formData.contact_person}
                        onChange={(e) => handleInputChange("contact_person", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        placeholder="+63 35 123 4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="contact@association.org"
                        value={formData.contact_email}
                        onChange={(e) => handleInputChange("contact_email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website"
                        placeholder="www.association.org"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="registration-number">Registration Number</Label>
                      <Input 
                        id="registration-number"
                        placeholder="SEC-2024-001234"
                        value={formData.registration_number}
                        onChange={(e) => handleInputChange("registration_number", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-id">Tax ID / TIN</Label>
                      <Input 
                        id="tax-id"
                        placeholder="123-456-789-000"
                        value={formData.tax_id}
                        onChange={(e) => handleInputChange("tax_id", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="dues-amount">Association Dues (₱)</Label>
                      <Input 
                        id="dues-amount"
                        type="number"
                        placeholder="5000"
                        value={formData.dues_amount}
                        onChange={(e) => handleInputChange("dues_amount", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dues-frequency">Dues Frequency</Label>
                      <Select value={formData.dues_frequency} onValueChange={(value) => handleInputChange("dues_frequency", value)}>
                        <SelectTrigger id="dues-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-count">Member Count</Label>
                      <Input 
                        id="member-count"
                        type="number"
                        placeholder="0"
                        value={formData.member_count}
                        onChange={(e) => handleInputChange("member_count", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="crop-year">Crop Year</Label>
                      <Select value={formData.crop_year} onValueChange={(value) => handleInputChange("crop_year", value)}>
                        <SelectTrigger id="crop-year">
                          <SelectValue placeholder="Select crop year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-2025">2024-2025</SelectItem>
                          <SelectItem value="2025-2026">2025-2026</SelectItem>
                          <SelectItem value="2023-2024">2023-2024</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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

                {/* Validation Errors */}
                {Object.keys(validationErrors).length > 0 && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <ul className="space-y-1">
                            {Object.entries(validationErrors).map(([field, message]) => (
                              <li key={field}>• {message}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setShowAddAssociation(false)
                    setShowEditAssociation(false)
                    resetForm()
                    setSelectedAssociation(null)
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={submitAssociation} 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={creating || updating}
                  >
                    {creating || updating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {selectedAssociation ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      selectedAssociation ? "Update Association" : "Add Association"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={showDeleteAssociation} onOpenChange={setShowDeleteAssociation}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Delete Association
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>{selectedAssociation?.name}</strong>? 
                    This action cannot be undone and will remove all association data including member records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => {
                    setShowDeleteAssociation(false)
                    setSelectedAssociation(null)
                  }}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={confirmDeleteAssociation}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Association
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsContent>

          {/* Memberships Management Tab */}
          <TabsContent value="memberships" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Planter Memberships</h3>
                <p className="text-sm text-gray-600">Manage planter association memberships and transfer restrictions</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search planters, associations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Memberships Table */}
            <Card>
              <CardHeader>
                <CardTitle>Membership Details</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Can transfer: {filteredMemberships.filter(m => m.canTransfer).length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span>Transfer restricted: {filteredMemberships.filter(m => !m.canTransfer).length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span>With deliveries: {filteredMemberships.filter(m => m.hasDeliveries).length}</span>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Planter Code</TableHead>
                        <TableHead>Planter Name</TableHead>
                        <TableHead>Association</TableHead>
                        <TableHead>Membership Date</TableHead>
                        <TableHead>Dues Status</TableHead>
                        <TableHead>Deliveries</TableHead>
                        <TableHead>Transfer Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMemberships.map((membership) => (
                        <TableRow key={membership.id}>
                          <TableCell className="font-medium">{membership.planterCode}</TableCell>
                          <TableCell>{membership.planterName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {membership.associationName}
                            </Badge>
                          </TableCell>
                          <TableCell>{membership.membershipDate}</TableCell>
                          <TableCell>{getDuesStatusBadge(membership.duesStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{membership.deliveryCount} deliveries</span>
                              {membership.hasDeliveries && (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  {membership.totalDelivered.toFixed(1)} tons
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTransferStatusBadge(membership.canTransfer, membership.transferRestrictionReason)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={!membership.canTransfer}
                                onClick={() => setShowTransferModal(true)}
                                title={membership.transferRestrictionReason}
                              >
                                Transfer
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Transfer Rules Information */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Important Transfer Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-orange-700">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Single Association Rule:</strong> Planters can be a member of only one association for each crop year.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Resignation Requirement:</strong> Planter must resign from current association before joining another.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Delivery Restriction:</strong> If planter has deliveries registered to an association, transfer is blocked until end of crop year.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>Crop Year Lock:</strong> All transfers are restricted during active crop year for planters with deliveries.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage system users and permissions</CardDescription>
              </CardHeader>
            </Card>
            <UserManagementSimple />
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">System settings functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Settings Dialog */}
      <ProfileSettingsDialog 
        open={isProfileDialogOpen} 
        onOpenChange={closeProfileDialog} 
      />
    </DashboardLayout>
    </ProtectedRoute>
  )
}

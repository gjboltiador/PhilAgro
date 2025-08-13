"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/sidebar-navigation"
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

// Association data structure
interface Association {
  id: string
  name: string
  shortName: string
  address: string
  contactPerson: string
  phone: string
  email: string
  website: string
  registrationNumber: string
  taxId: string
  duesAmount: number
  duesFrequency: "monthly" | "quarterly" | "annually"
  cropYear: string
  status: "active" | "inactive"
  memberCount: number
  createdAt: string
}

// Sugar Mill data structure
interface SugarMill {
  id: string
  plantCode: string
  fullName: string
  shortName: string
  description: string
  address: string
  city: string
  province: string
  postalCode: string
  contactPerson: string
  phone: string
  email: string
  website: string
  registrationNumber: string
  taxId: string
  capacity: number
  capacityUnit: "tons" | "metric tons"
  operatingStatus: "operational" | "maintenance" | "closed" | "seasonal"
  cropYear: string
  startDate: string
  endDate: string
  managerName: string
  managerPhone: string
  managerEmail: string
  coordinates: {
    latitude: number
    longitude: number
  }
  facilities: string[]
  certifications: string[]
  createdAt: string
  updatedAt: string
}

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

// Mock data for sugar mills
const sugarMills: SugarMill[] = [
  {
    id: "MILL-001",
    plantCode: "URSUMCO",
    fullName: "United Robina Sugar Milling Corporation",
    shortName: "URSUMCO",
    description: "A leading sugar milling company in Negros Oriental, specializing in high-quality sugar production with state-of-the-art processing facilities.",
    address: "Sugar Mill Complex, Barangay Tubod",
    city: "Dumaguete City",
    province: "Negros Oriental",
    postalCode: "6200",
    contactPerson: "Engr. Roberto Santos",
    phone: "+63 35 123 4567",
    email: "info@ursumco.com.ph",
    website: "www.ursumco.com.ph",
    registrationNumber: "SEC-2024-001234",
    taxId: "123-456-789-000",
    capacity: 8000,
    capacityUnit: "tons",
    operatingStatus: "operational",
    cropYear: "2024-2025",
    startDate: "2024-09-01",
    endDate: "2025-05-31",
    managerName: "Engr. Roberto Santos",
    managerPhone: "+63 35 123 4567",
    managerEmail: "roberto.santos@ursumco.com.ph",
    coordinates: {
      latitude: 9.3077,
      longitude: 123.3054
    },
    facilities: ["Sugar Processing", "Molasses Storage", "Quality Control Lab", "Warehouse", "Loading Bay"],
    certifications: ["ISO 9001:2015", "HACCP", "GMP", "Organic Certification"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: "MILL-002",
    plantCode: "SONEDCO",
    fullName: "Southern Negros Development Corporation",
    shortName: "SONEDCO",
    description: "Premier sugar milling facility serving the southern region of Negros Oriental with advanced processing technology.",
    address: "Industrial Zone, Barangay Poblacion",
    city: "Bayawan City",
    province: "Negros Oriental",
    postalCode: "6221",
    contactPerson: "Ms. Maria Garcia",
    phone: "+63 35 234 5678",
    email: "contact@sonedco.com.ph",
    website: "www.sonedco.com.ph",
    registrationNumber: "SEC-2024-002345",
    taxId: "234-567-890-000",
    capacity: 6500,
    capacityUnit: "tons",
    operatingStatus: "operational",
    cropYear: "2024-2025",
    startDate: "2024-09-01",
    endDate: "2025-05-31",
    managerName: "Ms. Maria Garcia",
    managerPhone: "+63 35 234 5678",
    managerEmail: "maria.garcia@sonedco.com.ph",
    coordinates: {
      latitude: 9.3644,
      longitude: 122.8044
    },
    facilities: ["Sugar Processing", "Molasses Storage", "Quality Control Lab", "Warehouse", "Loading Bay", "Research Lab"],
    certifications: ["ISO 9001:2015", "HACCP", "GMP", "Fair Trade Certified"],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20"
  },
  {
    id: "MILL-003",
    plantCode: "TOLONG",
    fullName: "Tolong Sugar Milling Company",
    shortName: "TOLONG",
    description: "Established sugar mill serving the central region with reliable processing and quality assurance.",
    address: "Sugar Mill Road, Barangay Central",
    city: "Tolong",
    province: "Negros Oriental",
    postalCode: "6210",
    contactPerson: "Mr. Pedro Reyes",
    phone: "+63 35 345 6789",
    email: "info@tolong.com.ph",
    website: "www.tolong.com.ph",
    registrationNumber: "SEC-2024-003456",
    taxId: "345-678-901-000",
    capacity: 4500,
    capacityUnit: "tons",
    operatingStatus: "operational",
    cropYear: "2024-2025",
    startDate: "2024-09-01",
    endDate: "2025-05-31",
    managerName: "Mr. Pedro Reyes",
    managerPhone: "+63 35 345 6789",
    managerEmail: "pedro.reyes@tolong.com.ph",
    coordinates: {
      latitude: 9.5000,
      longitude: 123.2000
    },
    facilities: ["Sugar Processing", "Molasses Storage", "Quality Control Lab", "Warehouse"],
    certifications: ["ISO 9001:2015", "HACCP", "GMP"],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01"
  },
  {
    id: "MILL-004",
    plantCode: "BUGAY",
    fullName: "Bugay Sugar Milling Corporation",
    shortName: "BUGAY",
    description: "Modern sugar processing facility with advanced technology and sustainable practices.",
    address: "Industrial Complex, Barangay Bugay",
    city: "Mabinay",
    province: "Negros Oriental",
    postalCode: "6208",
    contactPerson: "Engr. Ana Lopez",
    phone: "+63 35 456 7890",
    email: "info@bugay.com.ph",
    website: "www.bugay.com.ph",
    registrationNumber: "SEC-2024-004567",
    taxId: "456-789-012-000",
    capacity: 5500,
    capacityUnit: "tons",
    operatingStatus: "operational",
    cropYear: "2024-2025",
    startDate: "2024-09-01",
    endDate: "2025-05-31",
    managerName: "Engr. Ana Lopez",
    managerPhone: "+63 35 456 7890",
    managerEmail: "ana.lopez@bugay.com.ph",
    coordinates: {
      latitude: 9.8000,
      longitude: 122.9000
    },
    facilities: ["Sugar Processing", "Molasses Storage", "Quality Control Lab", "Warehouse", "Loading Bay", "Environmental Lab"],
    certifications: ["ISO 9001:2015", "HACCP", "GMP", "Environmental Management System"],
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15"
  },
  {
    id: "MILL-005",
    plantCode: "CAB",
    fullName: "Central Azucarera de Bais",
    shortName: "CAB",
    description: "Historic sugar mill with modern upgrades, serving the Bais region with quality sugar production.",
    address: "Sugar Mill Complex, Barangay Bais",
    city: "Bais City",
    province: "Negros Oriental",
    postalCode: "6206",
    contactPerson: "Mr. Carlos Mendoza",
    phone: "+63 35 567 8901",
    email: "info@cab.com.ph",
    website: "www.cab.com.ph",
    registrationNumber: "SEC-2024-005678",
    taxId: "567-890-123-000",
    capacity: 7000,
    capacityUnit: "tons",
    operatingStatus: "operational",
    cropYear: "2024-2025",
    startDate: "2024-09-01",
    endDate: "2025-05-31",
    managerName: "Mr. Carlos Mendoza",
    managerPhone: "+63 35 567 8901",
    managerEmail: "carlos.mendoza@cab.com.ph",
    coordinates: {
      latitude: 9.6000,
      longitude: 123.1000
    },
    facilities: ["Sugar Processing", "Molasses Storage", "Quality Control Lab", "Warehouse", "Loading Bay", "Historical Museum"],
    certifications: ["ISO 9001:2015", "HACCP", "GMP", "Heritage Site"],
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01"
  }
]

// Mock data for associations
const associations: Association[] = [
  {
    id: "ASSO-001",
    name: "Negros Oriental Sugar Planters Association",
    shortName: "NOSPA",
    address: "123 Sugar Avenue, Dumaguete City, Negros Oriental",
    contactPerson: "Juan Dela Cruz",
    phone: "+63 35 123 4567",
    email: "info@nospa.org.ph",
    website: "www.nospa.org.ph",
    registrationNumber: "SEC-2024-001234",
    taxId: "123-456-789-000",
    duesAmount: 5000,
    duesFrequency: "annually",
    cropYear: "2024-2025",
    status: "active",
    memberCount: 1250,
    createdAt: "2024-01-15"
  },
  {
    id: "ASSO-002",
    name: "Bayawan Sugar Farmers Cooperative",
    shortName: "BASUCO",
    address: "456 Cooperative Street, Bayawan City, Negros Oriental",
    contactPerson: "Maria Santos",
    phone: "+63 35 234 5678",
    email: "contact@basuco.org.ph",
    website: "www.basuco.org.ph",
    registrationNumber: "SEC-2024-002345",
    taxId: "234-567-890-000",
    duesAmount: 3500,
    duesFrequency: "quarterly",
    cropYear: "2024-2025",
    status: "active",
    memberCount: 890,
    createdAt: "2024-01-20"
  },
  {
    id: "ASSO-003",
    name: "Mabinay Sugar Planters Union",
    shortName: "MASPU",
    address: "789 Union Road, Mabinay, Negros Oriental",
    contactPerson: "Pedro Reyes",
    phone: "+63 35 345 6789",
    email: "info@maspu.org.ph",
    website: "www.maspu.org.ph",
    registrationNumber: "SEC-2024-003456",
    taxId: "345-678-901-000",
    duesAmount: 4000,
    duesFrequency: "annually",
    cropYear: "2024-2025",
    status: "active",
    memberCount: 650,
    createdAt: "2024-02-01"
  }
]

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
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null)
  const [selectedSugarMill, setSelectedSugarMill] = useState<SugarMill | null>(null)
  const [showAddAssociation, setShowAddAssociation] = useState(false)
  const [showAddSugarMill, setShowAddSugarMill] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sugarMillSearchQuery, setSugarMillSearchQuery] = useState("")
  const [sugarMillFilterStatus, setSugarMillFilterStatus] = useState("all")

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

  const filteredMemberships = planterMemberships.filter(membership => {
    const matchesSearch = membership.planterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         membership.planterCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         membership.associationName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || membership.duesStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const filteredSugarMills = sugarMills.filter(mill => {
    const matchesSearch = mill.fullName.toLowerCase().includes(sugarMillSearchQuery.toLowerCase()) ||
                         mill.shortName.toLowerCase().includes(sugarMillSearchQuery.toLowerCase()) ||
                         mill.plantCode.toLowerCase().includes(sugarMillSearchQuery.toLowerCase()) ||
                         mill.city.toLowerCase().includes(sugarMillSearchQuery.toLowerCase())
    const matchesStatus = sugarMillFilterStatus === "all" || mill.operatingStatus === sugarMillFilterStatus
    return matchesSearch && matchesStatus
  })

  return (
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
                          <CardTitle className="text-lg">{mill.plantCode}</CardTitle>
                          <CardDescription className="text-sm">{mill.shortName}</CardDescription>
                        </div>
                      </div>
                      {getOperatingStatusBadge(mill.operatingStatus)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{mill.fullName}</h4>
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
                        <span className="font-semibold">{mill.capacity.toLocaleString()} {mill.capacityUnit}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Crop Year:</span>
                        <span>{mill.cropYear}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Manager:</span>
                        <span className="text-xs">{mill.managerName}</span>
                      </div>
                    </div>

                    {/* Facilities */}
                    <div className="border-t pt-3">
                      <div className="text-xs text-gray-600 mb-2">Facilities:</div>
                      <div className="flex flex-wrap gap-1">
                        {mill.facilities.slice(0, 3).map((facility, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                            {facility}
                          </Badge>
                        ))}
                        {mill.facilities.length > 3 && (
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            +{mill.facilities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="border-t pt-3">
                      <div className="text-xs text-gray-600 mb-2">Certifications:</div>
                      <div className="flex flex-wrap gap-1">
                        {mill.certifications.slice(0, 2).map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {cert}
                          </Badge>
                        ))}
                        {mill.certifications.length > 2 && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            +{mill.certifications.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Building2 className="h-4 w-4 mr-2" />
                      Details
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
                              {mill.plantCode}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{mill.shortName}</div>
                              <div className="text-sm text-gray-500">{mill.fullName}</div>
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
                              {mill.capacity.toLocaleString()} {mill.capacityUnit}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getOperatingStatusBadge(mill.operatingStatus)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{mill.managerName}</div>
                              <div className="text-xs text-gray-500">{mill.managerEmail}</div>
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
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Building2 className="h-4 w-4" />
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
                        {filteredSugarMills.filter(m => m.operatingStatus === "operational").length}
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
                        {filteredSugarMills.filter(m => m.operatingStatus === "maintenance").length}
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
                        {filteredSugarMills.reduce((total, mill) => total + mill.capacity, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-600">Total Capacity (tons)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Associations Management Tab */}
          <TabsContent value="associations" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Sugar Farmers Associations</h3>
                <p className="text-sm text-gray-600">Manage sugar farmers associations and their details</p>
              </div>
              <Button onClick={() => setShowAddAssociation(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Association
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {associations.map((association) => (
                <Card key={association.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">{association.shortName}</CardTitle>
                          <CardDescription>{association.name}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={association.status === "active" ? "default" : "secondary"}>
                        {association.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{association.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{association.memberCount} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{association.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">{association.email}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Association Dues:</span>
                        <span className="font-semibold">₱{association.duesAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="capitalize">{association.duesFrequency}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Crop Year:</span>
                        <span>{association.cropYear}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Members
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Association Details Modal would go here */}
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
              <CardContent>
                <p className="text-gray-600">User management functionality will be implemented here.</p>
              </CardContent>
            </Card>
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
    </DashboardLayout>
  )
}

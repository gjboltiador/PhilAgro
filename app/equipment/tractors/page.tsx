"use client"

import { DashboardLayout } from "@/components/sidebar-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Tractor, 
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Search,
  Filter,
  Plus,
  MoreVertical,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings,
  Navigation,
  Calculator,
  Map,
  Square,
  Download,
  Upload,
  Play,
  Pause,
  RefreshCw
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface TractorData {
  id: string
  model: string
  type: string
  horsepower: number
  implements: string[]
  operator: string
  status: "working" | "available" | "maintenance"
  areaWorked: number
  ratePerHa: number
}

interface BookingData {
  id: string
  tractor: string
  tractorModel: string
  client: string
  fieldLocation: string
  coordinates: string
  operation: string
  estimatedArea: number
  estimatedCost: number
  status: "confirmed" | "in-progress" | "completed" | "cancelled"
}

interface OperatorData {
  id: string
  name: string
  license: string
  licenseExpiry: string
  specialization: string
  experience: number
  assignedTractor: string
  status: "active" | "available" | "off-duty"
}

interface TractorLocation {
  id: string
  tractorId: string
  model: string
  operator: string
  latitude: number
  longitude: number
  speed: number
  heading: number
  status: "working" | "moving" | "stopped" | "maintenance"
  timestamp: string
  fieldId?: string
  fieldName?: string
  operation?: string
  estimatedCompletion?: string
  areaCompleted?: number
}

interface FieldOperation {
  id: string
  tractorId: string
  model: string
  operator: string
  fieldName: string
  operation: string
  startTime: string
  estimatedEndTime: string
  status: "active" | "completed" | "cancelled"
  waypoints: Array<{
    latitude: number
    longitude: number
    timestamp: string
  }>
}

export default function TractorRentals() {
  const [activeTab, setActiveTab] = useState("tractors")
  const [searchQuery, setSearchQuery] = useState("")

  // Map and tracking states
  const [isClient, setIsClient] = useState(false)
  const [mapView, setMapView] = useState("satellite")
  const [zoomLevel, setZoomLevel] = useState(10) // Zoom level for ~10km radius view
  const [isTrackingActive, setIsTrackingActive] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5))
  const [selectedTractor, setSelectedTractor] = useState<string>("all")
  const [showHistoricalView, setShowHistoricalView] = useState(false)
  
  // Current location coordinates (Bayawan City)
  const currentLocation = {
    latitude: 9.3654, // Bayawan City, Negros Oriental coordinates
    longitude: 122.8047
  }

  // Mock data
  const tractors: TractorData[] = [
    {
      id: "TCR-001",
      model: "John Deere 5E",
      type: "Utility Tractor",
      horsepower: 75,
      implements: ["Plow", "Harrow", "Rotavator"],
      operator: "Miguel Santos",
      status: "working",
      areaWorked: 58.2,
      ratePerHa: 2500
    },
    {
      id: "TCR-002",
      model: "Kubota M7060",
      type: "Mid-Size Tractor",
      horsepower: 70,
      implements: ["Rotavator", "Seeder"],
      operator: "Carlos Reyes",
      status: "available",
      areaWorked: 44.7,
      ratePerHa: 2200
    },
    {
      id: "TCR-003",
      model: "Massey Ferguson 4707",
      type: "Compact Tractor",
      horsepower: 65,
      implements: ["Mower", "Sprayer"],
      operator: "Jose Cruz",
      status: "maintenance",
      areaWorked: 101.8,
      ratePerHa: 2000
    }
  ]

  const bookings: BookingData[] = [
    {
      id: "TB-001",
      tractor: "TCR-001",
      tractorModel: "John Deere 5E",
      client: "Hacienda San Miguel",
      fieldLocation: "Lot 15, Barangay Manapla",
      coordinates: "10.7202° N, 122.9637° E",
      operation: "Land Preparation",
      estimatedArea: 12.5,
      estimatedCost: 31250,
      status: "confirmed"
    },
    {
      id: "TB-002",
      tractor: "TCR-002",
      tractorModel: "Kubota M7060",
      client: "Batangas Sugar Estate",
      fieldLocation: "Block C, Lipa City",
      coordinates: "14.1647° N, 121.1650° E",
      operation: "Planting",
      estimatedArea: 8.3,
      estimatedCost: 18260,
      status: "in-progress"
    }
  ]

  const operators: OperatorData[] = [
    {
      id: "OP-001",
      name: "Miguel Santos",
      license: "TO-12345",
      licenseExpiry: "Dec 31, 2025",
      specialization: "Land Preparation",
      experience: 8,
      assignedTractor: "TCR-001",
      status: "active"
    },
    {
      id: "OP-002",
      name: "Carlos Reyes",
      license: "TO-67890",
      licenseExpiry: "Jun 15, 2026",
      specialization: "Planting & Seeding",
      experience: 12,
      assignedTractor: "TCR-002",
      status: "available"
    }
  ]

  // Mock tractor location data (real-time)
  const tractorLocations: TractorLocation[] = [
    {
      id: "loc-001",
      tractorId: "TCR-001",
      model: "John Deere 5E",
      operator: "Miguel Santos",
      latitude: 9.3654,
      longitude: 122.8047,
      speed: 8,
      heading: 180,
      status: "working",
      timestamp: new Date().toISOString(),
      fieldId: "FLD-001",
      fieldName: "Hacienda San Miguel - Lot 15",
      operation: "Land Preparation",
      estimatedCompletion: "16:30",
      areaCompleted: 8.5
    },
    {
      id: "loc-002",
      tractorId: "TCR-002",
      model: "Kubota M7060",
      operator: "Carlos Reyes",
      latitude: 9.3754,
      longitude: 122.8147,
      speed: 0,
      heading: 90,
      status: "stopped",
      timestamp: new Date().toISOString(),
      fieldId: "FLD-002",
      fieldName: "Batangas Sugar Estate - Block C",
      operation: "Planting",
      estimatedCompletion: "17:45",
      areaCompleted: 5.2
    },
    {
      id: "loc-003",
      tractorId: "TCR-003",
      model: "Massey Ferguson 4707",
      operator: "Jose Cruz",
      latitude: 9.3554,
      longitude: 122.7947,
      speed: 12,
      heading: 270,
      status: "moving",
      timestamp: new Date().toISOString(),
      fieldId: "FLD-003",
      fieldName: "Tayawan Farms - Section A",
      operation: "Mowing",
      estimatedCompletion: "15:20",
      areaCompleted: 3.8
    }
  ]

  // Mock field operation data
  const fieldOperations: FieldOperation[] = [
    {
      id: "FO-001",
      tractorId: "TCR-001",
      model: "John Deere 5E",
      operator: "Miguel Santos",
      fieldName: "Hacienda San Miguel - Lot 15",
      operation: "Land Preparation",
      startTime: "2024-01-20T08:00:00Z",
      estimatedEndTime: "2024-01-20T16:30:00Z",
      status: "active",
      waypoints: [
        { latitude: 9.3654, longitude: 122.8047, timestamp: "2024-01-20T08:00:00Z" },
        { latitude: 9.3655, longitude: 122.8048, timestamp: "2024-01-20T10:30:00Z" },
        { latitude: 9.3656, longitude: 122.8049, timestamp: "2024-01-20T12:45:00Z" }
      ]
    },
    {
      id: "FO-002",
      tractorId: "TCR-002",
      model: "Kubota M7060",
      operator: "Carlos Reyes",
      fieldName: "Batangas Sugar Estate - Block C",
      operation: "Planting",
      startTime: "2024-01-20T09:00:00Z",
      estimatedEndTime: "2024-01-20T17:45:00Z",
      status: "active",
      waypoints: [
        { latitude: 9.3754, longitude: 122.8147, timestamp: "2024-01-20T09:00:00Z" },
        { latitude: 9.3755, longitude: 122.8148, timestamp: "2024-01-20T11:15:00Z" },
        { latitude: 9.3756, longitude: 122.8149, timestamp: "2024-01-20T13:30:00Z" }
      ]
    }
  ]

  // Map helper functions
  const switchMapLayer = (view: string) => {
    setMapView(view)
  }

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20))
  }

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 8))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "working":
        return <Badge className="bg-amber-200 text-amber-800">Working</Badge>
      case "available":
        return <Badge className="bg-green-500 text-white">Available</Badge>
      case "maintenance":
        return <Badge className="bg-red-500 text-white">Maintenance</Badge>
      case "confirmed":
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-200 text-blue-800">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>
      case "off-duty":
        return <Badge className="bg-gray-200 text-gray-800">Off Duty</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTractorStatusBadge = (status: string) => {
    switch (status) {
      case "working":
        return <Badge className="bg-amber-500 text-white">Working</Badge>
      case "moving":
        return <Badge className="bg-green-500 text-white">Moving</Badge>
      case "stopped":
        return <Badge className="bg-yellow-500 text-white">Stopped</Badge>
      case "maintenance":
        return <Badge className="bg-red-500 text-white">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  const stats = {
    totalTractors: 8,
    workingTractors: 3,
    availableTractors: 4,
    maintenanceTractors: 1,
    areaWorked: 204.7,
    revenue: 456750,
    activeOperators: 12,
    onFieldOperators: 8,
    standbyOperators: 4
  }

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-farm-green-800">Tractor Rentals</h1>
            <p className="text-sm sm:text-base text-farm-green-600">Manage tractor fleet, field operations, and area-based pricing</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-farm-green-200 text-gray-700 hover:bg-farm-green-50 rounded-lg px-4 py-2 text-xs sm:text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Field Map</span>
              <span className="sm:hidden">Map</span>
            </Button>
            <Button className="bg-farm-green-600 hover:bg-farm-green-700 text-white rounded-lg px-4 py-2 text-xs sm:text-sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">+ Add Tractor</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-green-50 border-green-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Total Tractors</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                <Tractor className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-farm-green-800">{stats.totalTractors}</div>
              <p className="text-xs text-farm-green-600">
                {stats.workingTractors} working, {stats.availableTractors} available, {stats.maintenanceTractors} maintenance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Area Worked</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-farm-green-800">{stats.areaWorked} ha</div>
              <p className="text-xs text-farm-green-600">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Revenue</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-farm-green-800">₱{stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-farm-green-600">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Active Operators</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-farm-green-800">{stats.activeOperators}</div>
              <p className="text-xs text-farm-green-600">
                {stats.onFieldOperators} on field, {stats.standbyOperators} standby
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-6 border border-farm-green-200 p-1">
            <TabsTrigger 
              value="tractors" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Tractors
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="operators" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Operators
            </TabsTrigger>
            <TabsTrigger 
              value="field-areas" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Field Areas
            </TabsTrigger>
            <TabsTrigger 
              value="tracking" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Tracking
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Tractors Tab */}
          <TabsContent value="tractors" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-green-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-farm-green-800 text-xl sm:text-2xl font-bold">
                  Tractor Fleet Management
                </CardTitle>
                <CardDescription className="text-farm-green-600 text-sm sm:text-base">
                  Manage tractor details, implements, and field operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 sm:left-4 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <Input
                        placeholder="Search tractors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 sm:pl-12 py-2 sm:py-3 rounded-lg border-gray-200 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="border-farm-green-200 text-farm-green-700 hover:bg-farm-green-50 rounded-lg px-4 sm:px-6 py-2 text-xs sm:text-sm">
                    <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-green-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Tractor ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Model/Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Implements</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Operator</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Area Worked</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Rate/ha</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {tractors.map((tractor) => (
                          <tr key={tractor.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-800">{tractor.id}</td>
                            <td className="py-3 px-4 text-gray-700">
                              <div>{tractor.model}</div>
                              <div className="text-sm text-gray-600">{tractor.type} - {tractor.horsepower} HP</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="flex flex-wrap gap-1">
                                {tractor.implements.slice(0, 2).map((impl, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {impl}
                                  </Badge>
                                ))}
                                {tractor.implements.length > 2 && (
                                  <Badge variant="outline" className="text-xs">+{tractor.implements.length - 2}</Badge>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">{tractor.operator}</td>
                            <td className="py-3 px-4">
                              {getStatusBadge(tractor.status)}
                            </td>
                            <td className="py-3 px-4 text-gray-700">{tractor.areaWorked} ha</td>
                            <td className="py-3 px-4 text-gray-700">₱{tractor.ratePerHa.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-3 p-3">
                    {tractors.map((tractor) => (
                      <Card key={tractor.id} className="border-green-200 hover:bg-green-50/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                  <Tractor className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">{tractor.id}</h3>
                                  <p className="text-sm text-gray-600">{tractor.model}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-green-600 font-medium">Type:</span>
                                  <p className="text-gray-700">{tractor.type} - {tractor.horsepower} HP</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Operator:</span>
                                  <p className="text-gray-700">{tractor.operator}</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Area Worked:</span>
                                  <p className="text-gray-700">{tractor.areaWorked} ha</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Rate/ha:</span>
                                  <p className="text-gray-700">₱{tractor.ratePerHa.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Status:</span>
                                  <div className="mt-1">
                                    {getStatusBadge(tractor.status)}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Implements:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {tractor.implements.slice(0, 2).map((impl, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {impl}
                                      </Badge>
                                    ))}
                                    {tractor.implements.length > 2 && (
                                      <Badge variant="outline" className="text-xs">+{tractor.implements.length - 2}</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-orange-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-orange-800 text-xl sm:text-2xl font-bold">
                  Field Operation Bookings
                </CardTitle>
                <CardDescription className="text-orange-600 text-sm sm:text-base">
                  Manage tractor bookings with area-based pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-orange-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Booking ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Tractor</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Field Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Operation</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Est. Area</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Est. Cost</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{booking.id}</td>
                          <td className="py-3 px-4 text-gray-700">
                            <div className="font-medium">{booking.tractor}</div>
                            <div className="text-sm text-gray-600">{booking.tractorModel}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{booking.client}</td>
                          <td className="py-3 px-4 text-gray-700">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-500" />
                              <span>{booking.fieldLocation}</span>
                            </div>
                            <div className="text-sm text-gray-600">{booking.coordinates}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{booking.operation}</td>
                          <td className="py-3 px-4 text-gray-700">{booking.estimatedArea} ha</td>
                          <td className="py-3 px-4 text-gray-700">₱{booking.estimatedCost.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {getStatusBadge(booking.status)}
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operators Tab */}
          <TabsContent value="operators" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-blue-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-800 text-xl sm:text-2xl font-bold">
                  Tractor Operators
                </CardTitle>
                <CardDescription className="text-blue-600 text-sm sm:text-base">
                  Manage operator details and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-blue-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Operator ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">License</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Specialization</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Experience</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned Tractor</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {operators.map((operator) => (
                        <tr key={operator.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{operator.id}</td>
                          <td className="py-3 px-4 text-gray-700">{operator.name}</td>
                          <td className="py-3 px-4 text-gray-700">
                            <div>{operator.license}</div>
                            <div className="text-sm text-gray-600">Exp: {operator.licenseExpiry}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{operator.specialization}</td>
                          <td className="py-3 px-4 text-gray-700">{operator.experience} years</td>
                          <td className="py-3 px-4 text-gray-700">{operator.assignedTractor}</td>
                          <td className="py-3 px-4">
                            {getStatusBadge(operator.status)}
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Field Areas Tab */}
          <TabsContent value="field-areas" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-green-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-farm-green-800 text-xl sm:text-2xl font-bold">
                  Field Area Computation
                </CardTitle>
                <CardDescription className="text-farm-green-600 text-sm sm:text-base">
                  GPS-based area calculation and field mapping
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Navigation className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">GPS Field Mapping</h3>
                      <p className="text-green-600">Real-time GPS tracking for accurate area computation and field boundary mapping</p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white mt-4">
                      View Field Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4 mt-6">
            {/* Header with Controls */}
            <Card className="border-green-200 rounded-xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-farm-green-800">
                      <MapPin className="h-5 w-5" />
                      Tractor Tracking & Field Operations
                    </CardTitle>
                    <CardDescription>Real-time tracking and field operation monitoring</CardDescription>
                  </div>
                  {isClient && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsTrackingActive(!isTrackingActive)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        {isTrackingActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {isTrackingActive ? 'Pause' : 'Resume'} Tracking
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowHistoricalView(!showHistoricalView)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {showHistoricalView ? 'Live View' : 'Historical View'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                {isClient && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <Label htmlFor="tractor-filter" className="text-sm font-medium text-gray-700">Tractor</Label>
                      <Select value={selectedTractor} onValueChange={setSelectedTractor}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="All Tractors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tractors</SelectItem>
                          {tractors.map(tractor => (
                            <SelectItem key={tractor.id} value={tractor.id}>
                              {tractor.model} - {tractor.operator}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="date-filter" className="text-sm font-medium text-gray-700">Date</Label>
                      <Input
                        id="date-filter"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time-filter" className="text-sm font-medium text-gray-700">Time</Label>
                      <Input
                        id="time-filter"
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => {
                          // Apply filters logic here
                          console.log('Applying filters:', { selectedTractor, selectedDate, selectedTime })
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                )}

                {/* Interactive Map */}
                <Card className="border-gray-200 rounded-xl">
                  <CardHeader>
                    <CardTitle>Real-Time Tractor Tracking Map</CardTitle>
                    <CardDescription>Live GPS tracking with satellite imagery and field operation monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className="relative h-[600px] bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-gray-200 overflow-hidden"
                      onWheel={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        
                        const zoomSensitivity = 0.5
                        const delta = e.deltaY * zoomSensitivity
                        
                        if (delta < 0) {
                          zoomIn()
                        } else if (delta > 0) {
                          zoomOut()
                        }
                      }}
                    >
                      {/* Real Map Background */}
                      <div className="absolute inset-0">
                        {/* Overlay to hide "View larger map" link */}
                        <div className="absolute top-0 left-0 w-32 h-12 bg-transparent z-10 pointer-events-none"></div>
                        
                        {/* SINGLE MAP IFRAME - Only one renders at a time */}
                        {isClient ? (() => {
                          return (
                            <div className="relative w-full h-full">
                              {/* Overlay to hide "View larger map" link in Google Maps iframe */}
                              <div className="absolute top-0 left-0 w-32 h-12 bg-transparent z-10 pointer-events-none"></div>
                              <iframe
                                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${Math.pow(2, 20 - zoomLevel)}!2d${currentLocation.longitude}!3d${currentLocation.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sph!4v1234567890&t=s&maptype=satellite`}
                                className="w-full h-full border-0 transition-opacity duration-200"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                key={`satellite-${zoomLevel}`}
                              />
                            </div>
                          )
                        })() : (
                          // Loading state while client is initializing
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                              <p className="text-sm text-gray-600">Loading map...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Map Controls Overlay */}
                      {isClient && (
                        <>
                          <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg opacity-50 cursor-not-allowed"
                              disabled
                              title="Street view temporarily disabled"
                            >
                              <Navigation className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className={`${mapView === 'satellite' ? 'bg-green-100 text-green-800' : 'bg-white/90 backdrop-blur-sm hover:bg-white'} shadow-lg`}
                              onClick={() => switchMapLayer('satellite')}
                            >
                              <Map className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className={`${mapView === 'hybrid' ? 'bg-green-100 text-green-800' : 'bg-white/90 backdrop-blur-sm hover:bg-white'} shadow-lg`}
                              onClick={() => switchMapLayer('hybrid')}
                            >
                              <Square className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}

                      {/* Tractor Location Markers */}
                      {tractorLocations.map((tractor) => (
                        <div
                          key={tractor.id}
                          className="absolute z-[1000] transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${((tractor.longitude - (currentLocation.longitude - 0.05)) / 0.1) * 100 + 20}%`,
                            top: `${((currentLocation.latitude + 0.05 - tractor.latitude) / 0.1) * 100}%`
                          }}
                        >
                          <div className="relative">
                            {/* Tractor Icon */}
                            <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                              <Tractor className="h-4 w-4 text-white" />
                            </div>
                            
                            {/* Status Indicator */}
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              tractor.status === 'working' ? 'bg-amber-500' :
                              tractor.status === 'moving' ? 'bg-green-500' :
                              tractor.status === 'stopped' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[250px] opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                              <div className="text-sm font-semibold text-gray-800">{tractor.model}</div>
                              <div className="text-xs text-gray-600">Operator: {tractor.operator}</div>
                              <div className="text-xs text-gray-600">Speed: {tractor.speed} km/h</div>
                              <div className="text-xs text-gray-600">Status: {tractor.status}</div>
                              {tractor.fieldName && (
                                <div className="text-xs text-gray-600">Field: {tractor.fieldName}</div>
                              )}
                              {tractor.operation && (
                                <div className="text-xs text-gray-600">Operation: {tractor.operation}</div>
                              )}
                              {tractor.areaCompleted && (
                                <div className="text-xs text-gray-600">Area Completed: {tractor.areaCompleted} ha</div>
                              )}
                              {tractor.estimatedCompletion && (
                                <div className="text-xs text-gray-600">ETA: {tractor.estimatedCompletion}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Legend */}
                      <div className="absolute bottom-4 right-4 transform -translate-x-20 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
                        <div className="text-sm font-semibold mb-2">Tractor Status</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span>Working</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Moving</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Stopped</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Maintenance</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tractor Status Table */}
                <Card className="border-gray-200 rounded-xl">
                  <CardHeader>
                    <CardTitle>Live Tractor Status</CardTitle>
                    <CardDescription>Real-time status of all tractors in the fleet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-green-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Tractor</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Operator</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Speed</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Field</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Operation</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Area Completed</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">ETA</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Last Update</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tractorLocations.map((tractor) => (
                            <tr key={tractor.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium text-gray-800">{tractor.model}</td>
                              <td className="py-3 px-4 text-gray-700">{tractor.operator}</td>
                              <td className="py-3 px-4">{getTractorStatusBadge(tractor.status)}</td>
                              <td className="py-3 px-4 text-gray-700">{tractor.speed} km/h</td>
                              <td className="py-3 px-4 text-gray-700">
                                {tractor.latitude.toFixed(4)}, {tractor.longitude.toFixed(4)}
                              </td>
                              <td className="py-3 px-4 text-gray-700">{tractor.fieldName || '-'}</td>
                              <td className="py-3 px-4 text-gray-700">{tractor.operation || '-'}</td>
                              <td className="py-3 px-4 text-gray-700">{tractor.areaCompleted ? `${tractor.areaCompleted} ha` : '-'}</td>
                              <td className="py-3 px-4 text-gray-700">{tractor.estimatedCompletion || '-'}</td>
                              <td className="py-3 px-4 text-gray-700">
                                {new Date(tractor.timestamp).toLocaleTimeString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-orange-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-orange-800 text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Billing & Cost Summary
                </CardTitle>
                <CardDescription className="text-orange-600 text-sm sm:text-base">
                  Area-based pricing and billing management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-orange-800">Total Area Worked</div>
                        <div className="text-2xl font-bold text-orange-800">{stats.areaWorked} ha</div>
                        <div className="text-xs text-orange-600">This month</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-orange-800">Average Rate</div>
                        <div className="text-2xl font-bold text-orange-800">₱2,230/ha</div>
                        <div className="text-xs text-orange-600">Per hectare</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-orange-800">Total Revenue</div>
                        <div className="text-2xl font-bold text-orange-800">₱{stats.revenue.toLocaleString()}</div>
                        <div className="text-xs text-orange-600">This month</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">Recent Billing Summary</h3>
                  <div className="bg-white border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">TB-001 - Hacienda San Miguel</span>
                        <Badge className="bg-green-500 text-white">Completed</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Rate: ₱2,500/ha</div>
                        <div className="text-lg font-bold text-gray-800">₱32,000</div>
                        <div className="text-xs text-gray-500">Jul 16, 2024</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Tractor:</span>
                        <span className="ml-2 text-gray-800">TCR-001 (John Deere 5E)</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Operation:</span>
                        <span className="ml-2 text-gray-800">Land Preparation</span>
                      </div>
                      <div>
                        <span className="text-gray-600">GPS Area:</span>
                        <span className="ml-2 text-gray-800">12.8 hectares (actual)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 
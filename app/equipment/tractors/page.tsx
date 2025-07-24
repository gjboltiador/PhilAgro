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
  Calculator
} from "lucide-react"
import { useState } from "react"

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

export default function TractorRentals() {
  const [activeTab, setActiveTab] = useState("tractors")
  const [searchQuery, setSearchQuery] = useState("")

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
      <div className="p-6 space-y-6">
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
          <TabsList className="grid w-full grid-cols-5 border border-farm-green-200 p-1">
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
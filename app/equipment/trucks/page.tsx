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
  Truck, 
  Calendar,
  Users,
  MapPin,
  FileText,
  DollarSign,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreVertical
} from "lucide-react"
import { useState } from "react"

interface TruckData {
  id: string
  plateNumber: string
  type: string
  model: string
  capacity: number
  driver: string
  status: "available" | "on-route" | "maintenance"
  orExpiry: string
  crExpiry: string
}

interface BookingData {
  id: string
  planterName: string
  origin: string
  destination: string
  date: string
  tonnage: number
  status: "pending" | "approved" | "in-progress" | "completed"
  assignedTruck: string
  assignedDriver: string
}

interface DriverData {
  id: string
  name: string
  contact: string
  licenseNumber: string
  status: "on-duty" | "off-duty"
  assignedTruck: string
  totalTrips: number
  rating: number
}

export default function TruckRentals() {
  const [activeTab, setActiveTab] = useState("trucks")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const trucks: TruckData[] = [
    {
      id: "TRK-001",
      plateNumber: "ABC-1234",
      type: "10-Wheeler",
      model: "Isuzu ELF",
      capacity: 5,
      driver: "Juan Santos",
      status: "available",
      orExpiry: "Dec 15, 2024",
      crExpiry: "Mar 20, 2025"
    },
    {
      id: "TRK-002",
      plateNumber: "DEF-5678",
      type: "6-Wheeler",
      model: "Mitsubishi Fuso Canter",
      capacity: 3,
      driver: "Pedro Cruz",
      status: "on-route",
      orExpiry: "Nov 30, 2024",
      crExpiry: "Jan 15, 2025"
    },
    {
      id: "TRK-003",
      plateNumber: "GHI-9012",
      type: "4-Wheeler",
      model: "Toyota Dyna",
      capacity: 2,
      driver: "Maria Lopez",
      status: "maintenance",
      orExpiry: "Oct 10, 2024",
      crExpiry: "Feb 28, 2025"
    }
  ]

  const bookings: BookingData[] = [
    {
      id: "BK001",
      planterName: "Juan Dela Cruz",
      origin: "Farm A - Tarlac",
      destination: "Mill B - Pampanga",
      date: "2024-01-20",
      tonnage: 25,
      status: "approved",
      assignedTruck: "TRK-001",
      assignedDriver: "Juan Santos"
    },
    {
      id: "BK002",
      planterName: "Maria Santos",
      origin: "Farm C - Bulacan",
      destination: "Warehouse D - Manila",
      date: "2024-01-21",
      tonnage: 30,
      status: "in-progress",
      assignedTruck: "TRK-002",
      assignedDriver: "Pedro Cruz"
    }
  ]

  const drivers: DriverData[] = [
    {
      id: "DRV001",
      name: "Juan Santos",
      contact: "+63 912 345 6789",
      licenseNumber: "L123456789",
      status: "on-duty",
      assignedTruck: "TRK-001",
      totalTrips: 45,
      rating: 4.8
    },
    {
      id: "DRV002",
      name: "Pedro Cruz",
      contact: "+63 923 456 7890",
      licenseNumber: "L987654321",
      status: "on-duty",
      assignedTruck: "TRK-002",
      totalTrips: 32,
      rating: 4.5
    },
    {
      id: "DRV003",
      name: "Maria Lopez",
      contact: "+63 934 567 8901",
      licenseNumber: "L456789123",
      status: "off-duty",
      assignedTruck: "TRK-003",
      totalTrips: 28,
      rating: 4.2
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "on-route":
        return <Badge className="bg-orange-100 text-orange-800">On Route</Badge>
      case "maintenance":
        return <Badge className="bg-red-100 text-red-800">Maintenance</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "on-duty":
        return <Badge className="bg-green-100 text-green-800">On Duty</Badge>
      case "off-duty":
        return <Badge className="bg-gray-100 text-gray-800">Off Duty</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const stats = {
    totalTrucks: 12,
    availableTrucks: 3,
    onRouteTrucks: 6,
    maintenanceTrucks: 3,
    activeBookings: 8,
    todayBookings: 3,
    weeklyBookings: 5,
    revenue: 125000,
    activeDrivers: 15,
    onDutyDrivers: 12,
    offDutyDrivers: 3
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-orange-800">Truck Rentals</h1>
            <p className="text-sm sm:text-base text-orange-600">Manage truck fleet, bookings, and operations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-orange-200 text-gray-700 hover:bg-orange-50 rounded-lg px-4 py-2 text-xs sm:text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View Calendar</span>
              <span className="sm:hidden">Calendar</span>
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 text-xs sm:text-sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Truck</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-amber-50 border-amber-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-orange-800">Total Trucks</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-200">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-orange-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-orange-800">{stats.totalTrucks}</div>
              <p className="text-xs text-orange-600">
                {stats.availableTrucks} available, {stats.onRouteTrucks} on route, {stats.maintenanceTrucks} maintenance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-orange-800">Active Bookings</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-200">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-orange-800">{stats.activeBookings}</div>
              <p className="text-xs text-orange-600">
                Today: {stats.todayBookings}, This week: {stats.weeklyBookings}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Revenue</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-200">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-800">₱{stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-green-600">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-800">Active Drivers</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-200">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-blue-800">{stats.activeDrivers}</div>
              <p className="text-xs text-blue-600">
                {stats.onDutyDrivers} on duty, {stats.offDutyDrivers} off duty
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-5 border border-orange-200 p-1">
            <TabsTrigger 
              value="trucks" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Trucks
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="drivers" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Drivers
            </TabsTrigger>
            <TabsTrigger 
              value="routes" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Routes
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              History
            </TabsTrigger>
          </TabsList>

          {/* Trucks Tab */}
          <TabsContent value="trucks" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-amber-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-orange-800 text-xl sm:text-2xl font-bold">
                  Truck Fleet Management
                </CardTitle>
                <CardDescription className="text-orange-600 text-sm sm:text-base">
                  Manage truck details, registrations, and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 sm:left-4 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <Input
                        placeholder="Search trucks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 sm:pl-12 py-2 sm:py-3 rounded-lg border-gray-200 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 rounded-lg px-4 sm:px-6 py-2 text-xs sm:text-sm">
                    <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-amber-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Truck ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Plate Number</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Type/Model</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Capacity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Driver</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">OR/CR Expiry</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">TRK-001</td>
                        <td className="py-3 px-4 text-gray-700">ABC-1234</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div>10-Wheeler</div>
                          <div className="text-sm text-gray-600">Isuzu ELF</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">5 tons</td>
                        <td className="py-3 px-4 text-gray-700">Juan Santos</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                            Available
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <div>OR: Dec 15, 2024</div>
                          <div>CR: Mar 20, 2025</div>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">TRK-002</td>
                        <td className="py-3 px-4 text-gray-700">DEF-5678</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div>6-Wheeler</div>
                          <div className="text-sm text-gray-600">Mitsubishi Fuso Canter</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">3 tons</td>
                        <td className="py-3 px-4 text-gray-700">Pedro Cruz</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-amber-200 text-amber-800 px-4 py-1.5 rounded-full text-sm font-medium">
                            On Route
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <div>OR: Nov 30, 2024</div>
                          <div>CR: Jan 15, 2025</div>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">TRK-003</td>
                        <td className="py-3 px-4 text-gray-700">GHI-9012</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div>4-Wheeler</div>
                          <div className="text-sm text-gray-600">Toyota Dyna</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">2 tons</td>
                        <td className="py-3 px-4 text-gray-700">Maria Lopez</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                            Maintenance
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <div>OR: Oct 10, 2024</div>
                          <div>CR: Feb 28, 2025</div>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4 mt-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-orange-800 text-2xl font-bold">
                  Booking Management
                </CardTitle>
                <CardDescription className="text-orange-600">
                  Manage truck bookings and scheduling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Booking ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Truck</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Route</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Schedule</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Cargo</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">BK-001</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div className="font-medium">TRK-001</div>
                          <div className="text-sm text-gray-600">ABC-1234</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">Sugar Mill Corp</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span>Negros → Manila</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          <div>Jul 15,</div>
                          <div>2024</div>
                          <div className="text-sm text-gray-600">08:00 AM</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">Raw Sugar - 4.5 tons</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">
                            Confirmed
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">BK-002</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div className="font-medium">TRK-002</div>
                          <div className="text-sm text-gray-600">DEF-5678</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">Batangas Planters</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-500" />
                            <span>Batangas → Quezon City</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          <div>Jul 16,</div>
                          <div>2024</div>
                          <div className="text-sm text-gray-600">06:00 AM</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">Brown Sugar - 2.8 tons</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-amber-200 text-amber-800 px-4 py-1.5 rounded-full text-sm font-medium">
                            In Transit
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-4 mt-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 text-2xl font-bold">
                  Driver Management
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Manage driver details and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Driver ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">License</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned Truck</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">DRV-001</td>
                        <td className="py-3 px-4 text-gray-700">Juan Santos</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div>N01-12-345678</div>
                          <div className="text-sm text-gray-600">Exp: Dec 31, 2025</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          <div>+63 917 123 4567</div>
                          <div className="text-sm text-gray-600">Bacolod City, Negros Occidental</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">TRK-001</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Active
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">DRV-002</td>
                        <td className="py-3 px-4 text-gray-700">Pedro Cruz</td>
                        <td className="py-3 px-4 text-gray-700">
                          <div>N02-34-567890</div>
                          <div className="text-sm text-gray-600">Exp: Jun 15, 2026</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          <div>+63 918 234 5678</div>
                          <div className="text-sm text-gray-600">Lipa City, Batangas</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">TRK-002</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                            On Route
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Route Monitoring
                </CardTitle>
                <CardDescription>Real-time tracking and route optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">Interactive Route Map</h3>
                      <p className="text-green-600">Real-time GPS tracking and route optimization will be displayed here</p>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 text-white mt-4">
                      View Live Map
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Trucking History
                </CardTitle>
                <CardDescription>Complete history of all trucking operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-farm-green-400" />
                        <Input
                          placeholder="Search history..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clock className="h-8 w-8 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-orange-800 mb-2">Trucking History</h3>
                        <p className="text-orange-600">Detailed history of all completed trips, maintenance records, and operational data will be displayed here.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-2">Total Trips</h4>
                      <div className="text-2xl font-bold text-orange-800">1,247</div>
                    </div>
                    
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-2">Distance Covered</h4>
                      <div className="text-2xl font-bold text-orange-800">45,678 km</div>
                    </div>
                    
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-2">Cargo Delivered</h4>
                      <div className="text-2xl font-bold text-orange-800">2,345 tons</div>
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
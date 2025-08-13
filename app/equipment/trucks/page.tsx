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
  MoreVertical,
  Navigation,
  Map,
  Square,
  Download,
  Upload,
  Play,
  Pause,
  RefreshCw
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

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

interface TruckLocation {
  id: string
  truckId: string
  plateNumber: string
  driver: string
  latitude: number
  longitude: number
  speed: number
  heading: number
  status: "moving" | "stopped" | "loading" | "unloading"
  timestamp: string
  routeId?: string
  destination?: string
  estimatedArrival?: string
}

interface RouteData {
  id: string
  truckId: string
  plateNumber: string
  driver: string
  origin: string
  destination: string
  startTime: string
  estimatedEndTime: string
  status: "active" | "completed" | "cancelled"
  waypoints: Array<{
    latitude: number
    longitude: number
    timestamp: string
  }>
}

export default function TruckRentals() {
  const [activeTab, setActiveTab] = useState("trucks")
  const [searchQuery, setSearchQuery] = useState("")

  // Map and tracking states
  const [isClient, setIsClient] = useState(false)
  const [mapView, setMapView] = useState("satellite")
  const [zoomLevel, setZoomLevel] = useState(10) // Zoom level for ~10km radius view
  const [isTrackingActive, setIsTrackingActive] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5))
  const [selectedTruck, setSelectedTruck] = useState<string>("all")
  const [showHistoricalView, setShowHistoricalView] = useState(false)
  
  // Current location coordinates (you can update these to your actual location)
  const currentLocation = {
    latitude: 9.3654, // Bayawan City, Negros Oriental coordinates
    longitude: 122.8047
  }

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

  // Mock truck location data (real-time)
  const truckLocations: TruckLocation[] = [
    {
      id: "loc-001",
      truckId: "TRK-001",
      plateNumber: "ABC-1234",
      driver: "Juan Santos",
      latitude: 14.5995,
      longitude: 120.9842,
      speed: 45,
      heading: 180,
      status: "moving",
      timestamp: new Date().toISOString(),
      routeId: "RT-001",
      destination: "Mill B - Pampanga",
      estimatedArrival: "14:30"
    },
    {
      id: "loc-002",
      truckId: "TRK-002",
      plateNumber: "DEF-5678",
      driver: "Pedro Cruz",
      latitude: 15.0794,
      longitude: 120.6200,
      speed: 0,
      heading: 90,
      status: "loading",
      timestamp: new Date().toISOString(),
      routeId: "RT-002",
      destination: "Warehouse D - Manila",
      estimatedArrival: "16:45"
    },
    {
      id: "loc-003",
      truckId: "TRK-003",
      plateNumber: "GHI-9012",
      driver: "Maria Lopez",
      latitude: 14.6091,
      longitude: 121.0223,
      speed: 35,
      heading: 270,
      status: "moving",
      timestamp: new Date().toISOString(),
      routeId: "RT-003",
      destination: "Farm A - Tarlac",
      estimatedArrival: "15:20"
    }
  ]

  // Mock route data
  const routes: RouteData[] = [
    {
      id: "RT-001",
      truckId: "TRK-001",
      plateNumber: "ABC-1234",
      driver: "Juan Santos",
      origin: "Farm A - Tarlac",
      destination: "Mill B - Pampanga",
      startTime: "2024-01-20T08:00:00Z",
      estimatedEndTime: "2024-01-20T14:30:00Z",
      status: "active",
      waypoints: [
        { latitude: 15.4791, longitude: 120.5969, timestamp: "2024-01-20T08:00:00Z" },
        { latitude: 15.0794, longitude: 120.6200, timestamp: "2024-01-20T10:30:00Z" },
        { latitude: 14.5995, longitude: 120.9842, timestamp: "2024-01-20T12:45:00Z" }
      ]
    },
    {
      id: "RT-002",
      truckId: "TRK-002",
      plateNumber: "DEF-5678",
      driver: "Pedro Cruz",
      origin: "Farm C - Bulacan",
      destination: "Warehouse D - Manila",
      startTime: "2024-01-20T09:00:00Z",
      estimatedEndTime: "2024-01-20T16:45:00Z",
      status: "active",
      waypoints: [
        { latitude: 14.7944, longitude: 120.8795, timestamp: "2024-01-20T09:00:00Z" },
        { latitude: 14.6091, longitude: 121.0223, timestamp: "2024-01-20T11:15:00Z" },
        { latitude: 15.0794, longitude: 120.6200, timestamp: "2024-01-20T13:30:00Z" }
      ]
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

  const getTruckStatusBadge = (status: string) => {
    switch (status) {
      case "moving":
        return <Badge className="bg-green-500 text-white">Moving</Badge>
      case "stopped":
        return <Badge className="bg-yellow-500 text-white">Stopped</Badge>
      case "loading":
        return <Badge className="bg-blue-500 text-white">Loading</Badge>
      case "unloading":
        return <Badge className="bg-purple-500 text-white">Unloading</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

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
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-orange-800">Truck Rentals</h1>
            <p className="text-sm sm:text-base text-orange-600">Manage truck fleet, bookings, and operations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-orange-200 text-gray-700 hover:bg-orange-50 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View Calendar</span>
              <span className="sm:hidden">Calendar</span>
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Truck</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4 sm:mb-6">
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
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
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

                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-3">
                    {/* Truck Card 1 */}
                    <Card className="border-amber-200 hover:bg-amber-50/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                <Truck className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800">TRK-001</h3>
                                <p className="text-sm text-gray-600">ABC-1234</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-amber-600 font-medium">Type:</span>
                                <p className="text-gray-700">10-Wheeler</p>
                                <p className="text-xs text-gray-500">Isuzu ELF</p>
                              </div>
                              <div>
                                <span className="text-amber-600 font-medium">Capacity:</span>
                                <p className="text-gray-700">5 tons</p>
                              </div>
                              <div>
                                <span className="text-amber-600 font-medium">Driver:</span>
                                <p className="text-gray-700">Juan Santos</p>
                              </div>
                              <div>
                                <span className="text-amber-600 font-medium">Status:</span>
                                <div className="mt-1">
                                  <Badge className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                    Available
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>OR: Dec 15, 2024</div>
                              <div>CR: Mar 20, 2025</div>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Truck Card 2 */}
                    <Card className="border-amber-200 hover:bg-amber-50/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                <Truck className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800">TRK-002</h3>
                                <p className="text-sm text-gray-600">DEF-5678</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-amber-600 font-medium">Type:</span>
                                <p className="text-gray-700">6-Wheeler</p>
                                <p className="text-xs text-gray-500">Mitsubishi Fuso Canter</p>
                              </div>
                              <div>
                                <span className="text-amber-600 font-medium">Capacity:</span>
                                <p className="text-gray-700">3 tons</p>
                              </div>
                              <div>
                                <span className="text-amber-600 font-medium">Driver:</span>
                                <p className="text-gray-700">Pedro Cruz</p>
                              </div>
                              <div>
                                <span className="text-amber-600 font-medium">Status:</span>
                                <div className="mt-1">
                                  <Badge className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs">
                                    On Route
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>OR: Nov 30, 2024</div>
                              <div>CR: Jan 15, 2025</div>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Truck Card 3 */}
                    <Card className="border-amber-200 hover:bg-amber-50/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                <Truck className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800">TRK-003</h3>
                                <p className="text-sm text-gray-600">GHI-9012</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-amber-600 font-medium">Type:</span>
                                <p className="text-gray-700">4-Wheeler</p>
                                <p className="text-xs text-gray-500">Toyota Dyna</p>
                              </div>
                              <div>
                                <span className="text-amber-600 font-medium">Capacity:</span>
                                <p className="text-gray-700">2 tons</p>
                              </div>
                              <div>
                                <span className="text-amber-600 font-medium">Driver:</span>
                                <p className="text-gray-700">Maria Lopez</p>
                              </div>
                              <div>
                                <span className="text-amber-600 font-medium">Status:</span>
                                <div className="mt-1">
                                  <Badge className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                    Maintenance
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>OR: Oct 10, 2024</div>
                              <div>CR: Feb 28, 2025</div>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
            {/* Header with Controls */}
            <Card className="border-orange-200 rounded-xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <MapPin className="h-5 w-5" />
                      Route Monitoring
                    </CardTitle>
                    <CardDescription>Real-time tracking and route optimization</CardDescription>
                  </div>
                  {isClient && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsTrackingActive(!isTrackingActive)}
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      >
                        {isTrackingActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {isTrackingActive ? 'Pause' : 'Resume'} Tracking
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowHistoricalView(!showHistoricalView)}
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {showHistoricalView ? 'Live View' : 'Historical View'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
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
                      <Label htmlFor="truck-filter" className="text-sm font-medium text-gray-700">Truck</Label>
                      <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="All Trucks" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Trucks</SelectItem>
                          {trucks.map(truck => (
                            <SelectItem key={truck.id} value={truck.id}>
                              {truck.plateNumber} - {truck.driver}
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
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => {
                          // Apply filters logic here
                          console.log('Applying filters:', { selectedTruck, selectedDate, selectedTime })
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
                    <CardTitle>Real-Time Truck Tracking Map</CardTitle>
                    <CardDescription>Live GPS tracking with satellite imagery and route optimization</CardDescription>
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
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
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
                              className={`${mapView === 'satellite' ? 'bg-orange-100 text-orange-800' : 'bg-white/90 backdrop-blur-sm hover:bg-white'} shadow-lg`}
                              onClick={() => switchMapLayer('satellite')}
                            >
                              <Map className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className={`${mapView === 'hybrid' ? 'bg-orange-100 text-orange-800' : 'bg-white/90 backdrop-blur-sm hover:bg-white'} shadow-lg`}
                              onClick={() => switchMapLayer('hybrid')}
                            >
                              <Square className="h-4 w-4" />
                            </Button>
                          </div>


                        </>
                      )}

                      {/* Truck Location Markers */}
                      {truckLocations.map((truck) => (
                        <div
                          key={truck.id}
                          className="absolute z-[1000] transform -translate-x-1/2 -translate-y-1/2"
                                                                                style={{
                            left: `${((truck.longitude - (currentLocation.longitude - 0.05)) / 0.1) * 100 + 20}%`,
                            top: `${((currentLocation.latitude + 0.05 - truck.latitude) / 0.1) * 100}%`
                          }}
                        >
                          <div className="relative">
                            {/* Truck Icon */}
                            <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                              <Truck className="h-4 w-4 text-white" />
                            </div>
                            
                            {/* Status Indicator */}
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              truck.status === 'moving' ? 'bg-green-500' :
                              truck.status === 'stopped' ? 'bg-yellow-500' :
                              truck.status === 'loading' ? 'bg-blue-500' :
                              'bg-purple-500'
                            }`}></div>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px] opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                              <div className="text-sm font-semibold text-gray-800">{truck.plateNumber}</div>
                              <div className="text-xs text-gray-600">Driver: {truck.driver}</div>
                              <div className="text-xs text-gray-600">Speed: {truck.speed} km/h</div>
                              <div className="text-xs text-gray-600">Status: {truck.status}</div>
                              {truck.destination && (
                                <div className="text-xs text-gray-600">To: {truck.destination}</div>
                              )}
                              {truck.estimatedArrival && (
                                <div className="text-xs text-gray-600">ETA: {truck.estimatedArrival}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Legend */}
                      <div className="absolute bottom-4 right-4 transform -translate-x-20 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
                        <div className="text-sm font-semibold mb-2">Truck Status</div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Moving</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Stopped</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Loading</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span>Unloading</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Truck Status Table */}
                <Card className="border-gray-200 rounded-xl">
                  <CardHeader>
                    <CardTitle>Live Truck Status</CardTitle>
                    <CardDescription>Real-time status of all trucks in the fleet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-orange-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Truck</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Driver</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Speed</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Destination</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">ETA</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Last Update</th>
                          </tr>
                        </thead>
                        <tbody>
                          {truckLocations.map((truck) => (
                            <tr key={truck.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium text-gray-800">{truck.plateNumber}</td>
                              <td className="py-3 px-4 text-gray-700">{truck.driver}</td>
                              <td className="py-3 px-4">{getTruckStatusBadge(truck.status)}</td>
                              <td className="py-3 px-4 text-gray-700">{truck.speed} km/h</td>
                              <td className="py-3 px-4 text-gray-700">
                                {truck.latitude.toFixed(4)}, {truck.longitude.toFixed(4)}
                              </td>
                              <td className="py-3 px-4 text-gray-700">{truck.destination || '-'}</td>
                              <td className="py-3 px-4 text-gray-700">{truck.estimatedArrival || '-'}</td>
                              <td className="py-3 px-4 text-gray-700">
                                {new Date(truck.timestamp).toLocaleTimeString()}
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
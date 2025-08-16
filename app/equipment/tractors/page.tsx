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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TractorManagement } from "@/components/tractor-management"
import { OperatorManagement } from "@/components/operator-management"
import { ProtectedRoute } from "@/components/protected-route"
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
  RefreshCw,
  Edit,
  Eye,
  Trash2
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

interface PlanterData {
  id: string
  planterCode: string
  planterName: string
  contactNumber: string
  email: string
  address: string
  registrationDate: string
  status: "active" | "inactive"
  farms: Array<{
    id: string
    sitio: string
    barangay: string
    municipality: string
    province: string
    hectarage: number
    cropType: string
  }>
}

interface ComprehensiveBookingData {
  id: string
  planterId: string
  planterCode: string
  planterName: string
  contactNumber: string
  farmAddress: {
    sitio: string
    barangay: string
    municipality: string
    province: string
  }
  fieldLocation: string
  coordinates: string
  operation: string
  estimatedArea: number
  ratePerHa: number
  estimatedCost: number
  assignedTractor: string
  assignedOperator: string
  date: string
  status: "pending" | "approved" | "in-progress" | "completed" | "cancelled"
  notes: string
}

interface TractorRate {
  tractorType: string
  baseRate: number
  operationRates: { [operation: string]: number }
  locationRates: { [municipality: string]: number }
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

  // Map and tracking states
  const [isClient, setIsClient] = useState(false)
  const [mapView, setMapView] = useState("satellite")
  const [zoomLevel, setZoomLevel] = useState(10) // Zoom level for ~10km radius view
  const [isTrackingActive, setIsTrackingActive] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5))
  const [selectedTractor, setSelectedTractor] = useState<string>("all")
  const [showHistoricalView, setShowHistoricalView] = useState(false)
  
  // Booking management states
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false)
  const [isViewBookingModalOpen, setIsViewBookingModalOpen] = useState(false)
  const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false)
  const [isDeleteBookingModalOpen, setIsDeleteBookingModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<ComprehensiveBookingData | null>(null)
  const [newBooking, setNewBooking] = useState<Partial<ComprehensiveBookingData>>({
    planterId: "",
    planterCode: "",
    planterName: "",
    contactNumber: "",
    farmAddress: {
      sitio: "",
      barangay: "",
      municipality: "",
      province: ""
    },
    fieldLocation: "",
    coordinates: "",
    operation: "",
    estimatedArea: 0,
    assignedTractor: "",
    assignedOperator: "",
    date: "",
    notes: ""
  })

  // Planter search states
  const [planterSearchQuery, setPlanterSearchQuery] = useState("")
  const [isPlanterSearchOpen, setIsPlanterSearchOpen] = useState(false)
  const [selectedPlanter, setSelectedPlanter] = useState<PlanterData | null>(null)
  
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

  // Mock planter database
  const planters: PlanterData[] = [
    {
      id: "PLT001",
      planterCode: "PLT-2024-001",
      planterName: "Juan Dela Cruz",
      contactNumber: "+63 912 345 6789",
      email: "juan.delacruz@email.com",
      address: "123 Main Street, Bayawan City, Negros Oriental",
      registrationDate: "2024-01-15",
      status: "active",
      farms: [
        {
          id: "FARM001",
          sitio: "Sitio Malipayon",
          barangay: "Barangay San Jose",
          municipality: "Bayawan City",
          province: "Negros Oriental",
          hectarage: 25.5,
          cropType: "Sugarcane"
        },
        {
          id: "FARM002",
          sitio: "Sitio Kalipay",
          barangay: "Barangay San Isidro",
          municipality: "Dumaguete City",
          province: "Negros Oriental",
          hectarage: 15.2,
          cropType: "Sugarcane"
        }
      ]
    },
    {
      id: "PLT002",
      planterCode: "PLT-2024-002",
      planterName: "Maria Santos",
      contactNumber: "+63 923 456 7890",
      email: "maria.santos@email.com",
      address: "456 Farm Road, Dumaguete City, Negros Oriental",
      registrationDate: "2024-01-10",
      status: "active",
      farms: [
        {
          id: "FARM003",
          sitio: "Sitio Kalipay",
          barangay: "Barangay San Isidro",
          municipality: "Dumaguete City",
          province: "Negros Oriental",
          hectarage: 30.0,
          cropType: "Sugarcane"
        }
      ]
    },
    {
      id: "PLT003",
      planterCode: "PLT-2024-003",
      planterName: "Pedro Martinez",
      contactNumber: "+63 934 567 8901",
      email: "pedro.martinez@email.com",
      address: "789 Rural Avenue, Siaton, Negros Oriental",
      registrationDate: "2024-01-20",
      status: "active",
      farms: [
        {
          id: "FARM004",
          sitio: "Sitio Masaya",
          barangay: "Barangay San Miguel",
          municipality: "Siaton",
          province: "Negros Oriental",
          hectarage: 20.0,
          cropType: "Sugarcane"
        }
      ]
    }
  ]

  const comprehensiveBookings: ComprehensiveBookingData[] = [
    {
      id: "TB001",
      planterId: "PLT001",
      planterCode: "PLT-2024-001",
      planterName: "Juan Dela Cruz",
      contactNumber: "+63 912 345 6789",
      farmAddress: {
        sitio: "Sitio Malipayon",
        barangay: "Barangay San Jose",
        municipality: "Bayawan City",
        province: "Negros Oriental"
      },
      fieldLocation: "Lot 15, Barangay San Jose",
      coordinates: "9.3654° N, 122.8047° E",
      operation: "Land Preparation",
      estimatedArea: 12.5,
      ratePerHa: 2500,
      estimatedCost: 31250,
      assignedTractor: "TCR-001",
      assignedOperator: "Miguel Santos",
      date: "2024-01-20",
      status: "approved",
      notes: "Land preparation for sugarcane planting season"
    },
    {
      id: "TB002",
      planterId: "PLT002",
      planterCode: "PLT-2024-002",
      planterName: "Maria Santos",
      contactNumber: "+63 923 456 7890",
      farmAddress: {
        sitio: "Sitio Kalipay",
        barangay: "Barangay San Isidro",
        municipality: "Dumaguete City",
        province: "Negros Oriental"
      },
      fieldLocation: "Block A, Barangay San Isidro",
      coordinates: "9.3103° N, 123.3087° E",
      operation: "Planting",
      estimatedArea: 8.3,
      ratePerHa: 2200,
      estimatedCost: 18260,
      assignedTractor: "TCR-002",
      assignedOperator: "Carlos Reyes",
      date: "2024-01-21",
      status: "in-progress",
      notes: "Sugarcane planting operation"
    },
    {
      id: "TB003",
      planterId: "PLT003",
      planterCode: "PLT-2024-003",
      planterName: "Pedro Martinez",
      contactNumber: "+63 934 567 8901",
      farmAddress: {
        sitio: "Sitio Masaya",
        barangay: "Barangay San Miguel",
        municipality: "Siaton",
        province: "Negros Oriental"
      },
      fieldLocation: "Field 3, Barangay San Miguel",
      coordinates: "9.0622° N, 123.0967° E",
      operation: "Harrowing",
      estimatedArea: 15.0,
      ratePerHa: 2000,
      estimatedCost: 30000,
      assignedTractor: "",
      assignedOperator: "",
      date: "2024-01-22",
      status: "pending",
      notes: "Pending tractor assignment for harrowing operation"
    }
  ]

  const tractorRates: TractorRate[] = [
    {
      tractorType: "Utility Tractor",
      baseRate: 2000,
      operationRates: {
        "Land Preparation": 500,
        "Harrowing": 300,
        "Planting": 400,
        "Cultivation": 350,
        "Harvesting": 600,
        "Spraying": 250
      },
      locationRates: {
        "Bayawan City": 200,
        "Dumaguete City": 150,
        "Siaton": 180,
        "Valencia": 250,
        "Tanjay": 220
      }
    },
    {
      tractorType: "Mid-Size Tractor",
      baseRate: 1800,
      operationRates: {
        "Land Preparation": 450,
        "Harrowing": 280,
        "Planting": 380,
        "Cultivation": 320,
        "Harvesting": 550,
        "Spraying": 230
      },
      locationRates: {
        "Bayawan City": 180,
        "Dumaguete City": 130,
        "Siaton": 160,
        "Valencia": 220,
        "Tanjay": 200
      }
    },
    {
      tractorType: "Compact Tractor",
      baseRate: 1600,
      operationRates: {
        "Land Preparation": 400,
        "Harrowing": 250,
        "Planting": 350,
        "Cultivation": 300,
        "Harvesting": 500,
        "Spraying": 200
      },
      locationRates: {
        "Bayawan City": 160,
        "Dumaguete City": 120,
        "Siaton": 140,
        "Valencia": 200,
        "Tanjay": 180
      }
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

  // Calculate tractor rate based on tractor type, operation, and location
  const calculateTractorRate = (tractorType: string, operation: string, municipality: string, area: number): number => {
    const rate = tractorRates.find(r => r.tractorType === tractorType)
    if (!rate) return 0

    const baseRate = rate.baseRate
    const operationRate = rate.operationRates[operation] || 0
    const locationRate = rate.locationRates[municipality] || 0

    return baseRate + operationRate + locationRate
  }

  // Handle planter selection
  const handlePlanterSelection = (planter: PlanterData) => {
    setSelectedPlanter(planter)
    
    // Auto-fill the booking form with planter information
    setNewBooking({
      ...newBooking,
      planterId: planter.id,
      planterCode: planter.planterCode,
      planterName: planter.planterName,
      contactNumber: planter.contactNumber
    })

    // If the planter has farms, auto-fill the first farm's address
    if (planter.farms.length > 0) {
      const firstFarm = planter.farms[0]
      setNewBooking(prev => ({
        ...prev,
        farmAddress: {
          sitio: firstFarm.sitio,
          barangay: firstFarm.barangay,
          municipality: firstFarm.municipality,
          province: firstFarm.province
        }
      }))
    }

    setIsPlanterSearchOpen(false)
  }

  // Handle edit booking
  const handleEditBooking = (booking: ComprehensiveBookingData) => {
    setSelectedBooking(booking)
    
    // Find the planter for this booking
    const planter = planters.find(p => p.id === booking.planterId)
    if (planter) {
      setSelectedPlanter(planter)
    }
    
    setIsEditBookingModalOpen(true)
  }

  // Handle update booking
  const handleUpdateBooking = async () => {
    if (!selectedBooking) return

    try {
      // Validate required fields
      if (!selectedBooking.planterId || !selectedBooking.planterCode || 
          !selectedBooking.farmAddress?.municipality || !selectedBooking.operation || 
          !selectedBooking.date || !selectedBooking.estimatedArea || !selectedBooking.status) {
        alert("Please fill in all required fields")
        return
      }

      // Recalculate rate if tractor, operation, or location changed
      if (selectedBooking.assignedTractor && selectedBooking.farmAddress?.municipality && selectedBooking.operation) {
        const selectedTractor = tractors.find(t => t.id === selectedBooking.assignedTractor)
        if (selectedTractor) {
          const newRate = calculateTractorRate(
            selectedTractor.type, 
            selectedBooking.operation, 
            selectedBooking.farmAddress.municipality, 
            selectedBooking.estimatedArea
          )
          const newEstimatedCost = newRate * selectedBooking.estimatedArea
          
          setSelectedBooking(prev => ({
            ...prev!,
            ratePerHa: newRate,
            estimatedCost: newEstimatedCost
          }))
        }
      }

      // In a real application, you would send this to your API
      console.log("Updating booking:", selectedBooking)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Close modal
      setIsEditBookingModalOpen(false)
      setSelectedBooking(null)
      setSelectedPlanter(null)
      
      alert("Booking updated successfully!")
      
    } catch (error) {
      console.error("Error updating booking:", error)
      alert("Error updating booking. Please try again.")
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
    <ProtectedRoute requiredPermission="equipment_operation">
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-green-800">Tractor Rentals</h1>
            <p className="text-sm sm:text-base text-green-600">Manage tractor fleet, field operations, and area-based pricing</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-green-200 text-gray-700 hover:bg-green-50 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View Calendar</span>
              <span className="sm:hidden">Calendar</span>
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add Tractor</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-green-50 border-green-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Total Tractors</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-200">
                <Tractor className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-800">{stats.totalTractors}</div>
              <p className="text-xs text-green-600">
                {stats.workingTractors} working, {stats.availableTractors} available, {stats.maintenanceTractors} maintenance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Area Worked</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-200">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-800">{stats.areaWorked} ha</div>
              <p className="text-xs text-green-600">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Revenue</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-200">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-800">₱{stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-green-600">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Active Operators</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-200">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-800">{stats.activeOperators}</div>
              <p className="text-xs text-green-600">
                {stats.onFieldOperators} on field, {stats.standbyOperators} standby
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-6 border border-green-200 p-1">
            <TabsTrigger 
              value="tractors" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Tractors
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger 
              value="operators" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Operators
            </TabsTrigger>
            <TabsTrigger 
              value="field-areas" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Field Areas
            </TabsTrigger>
            <TabsTrigger 
              value="tracking" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Tracking
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Tractors Tab */}
          <TabsContent value="tractors" className="space-y-4 sm:space-y-6 mt-6">
            <TractorManagement />
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-green-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-green-800 text-2xl font-bold">
                      Comprehensive Field Operation Bookings
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      Manage tractor bookings with detailed planter information, area-based pricing, and field operations
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setIsAddBookingModalOpen(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Booking
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('/equipment/tractors/booking/calendar', '_blank')}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendar View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Booking ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Planter</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned Tractor</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Farm Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Operation</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date & Time</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Area</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Rate</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comprehensiveBookings.map((booking) => {
                        const assignedTractor = tractors.find(t => t.id === booking.assignedTractor)
                        return (
                          <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-800">{booking.id}</td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="font-medium">{booking.planterName}</div>
                              <div className="text-sm text-gray-600">{booking.contactNumber}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="font-medium">{assignedTractor?.model || 'Unassigned'}</div>
                              <div className="text-sm text-gray-600">{assignedTractor?.type || ''}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="text-sm">
                                {booking.farmAddress.sitio}, {booking.farmAddress.barangay}
                              </div>
                              <div className="text-sm text-gray-600">{booking.farmAddress.municipality}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <Badge variant="outline" className="text-xs">
                                {booking.operation}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="text-sm">{new Date(booking.date).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-600">08:00 AM</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="font-medium">{booking.estimatedArea} ha</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="font-medium">₱{booking.ratePerHa.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">Total: ₱{booking.estimatedCost.toLocaleString()}</div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge 
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  booking.status === 'approved' ? 'bg-green-500 text-white' :
                                  booking.status === 'pending' ? 'bg-yellow-500 text-white' :
                                  booking.status === 'in-progress' ? 'bg-blue-500 text-white' :
                                  booking.status === 'completed' ? 'bg-gray-500 text-white' :
                                  'bg-red-500 text-white'
                                }`}
                              >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedBooking(booking)
                                    setIsViewBookingModalOpen(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditBooking(booking)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    setSelectedBooking(booking)
                                    setIsDeleteBookingModalOpen(true)
                                  }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operators Tab */}
          <TabsContent value="operators" className="space-y-4 sm:space-y-6 mt-6">
            <OperatorManagement 
              tractors={tractors.map(t => ({ id: t.id, model: t.model }))}
            />
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

        {/* Comprehensive Booking Modals */}
        
        {/* Add Booking Modal */}
        <Dialog open={isAddBookingModalOpen} onOpenChange={setIsAddBookingModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-800">
                <Plus className="h-5 w-5" />
                New Field Operation Booking
              </DialogTitle>
              <DialogDescription>
                Create a new tractor booking with comprehensive planter details and area-based pricing.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Planter Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Planter Selection</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planterCode" className="text-sm font-medium">
                      Planter Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="planterCode"
                      placeholder="PLT-2024-001"
                      value={newBooking.planterCode || ""}
                      onChange={(e) => setNewBooking({...newBooking, planterCode: e.target.value})}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planterId" className="text-sm font-medium">
                      Planter ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="planterId"
                      placeholder="PLT001"
                      value={newBooking.planterId || ""}
                      onChange={(e) => setNewBooking({...newBooking, planterId: e.target.value})}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Search Planter
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPlanterSearchOpen(true)}
                      className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {selectedPlanter ? selectedPlanter.planterName : "Select Planter"}
                    </Button>
                  </div>
                </div>
                
                {/* Selected Planter Information */}
                {selectedPlanter && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-green-800">Planter Name</Label>
                        <div className="text-lg font-semibold text-green-800">{selectedPlanter.planterName}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-green-800">Contact Number</Label>
                        <div className="text-lg text-green-800">{selectedPlanter.contactNumber}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-green-800">Email</Label>
                        <div className="text-lg text-green-800">{selectedPlanter.email}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-green-800">Registration Date</Label>
                        <div className="text-lg text-green-800">{new Date(selectedPlanter.registrationDate).toLocaleDateString()}</div>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-green-800">Address</Label>
                        <div className="text-lg text-green-800">{selectedPlanter.address}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Farm Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Farm Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sitio" className="text-sm font-medium">
                      Sitio <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="sitio"
                      placeholder="Sitio Malipayon"
                      value={newBooking.farmAddress?.sitio || ""}
                      onChange={(e) => setNewBooking({
                        ...newBooking, 
                        farmAddress: {...newBooking.farmAddress!, sitio: e.target.value}
                      })}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barangay" className="text-sm font-medium">
                      Barangay <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="barangay"
                      placeholder="Barangay San Jose"
                      value={newBooking.farmAddress?.barangay || ""}
                      onChange={(e) => setNewBooking({
                        ...newBooking, 
                        farmAddress: {...newBooking.farmAddress!, barangay: e.target.value}
                      })}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipality" className="text-sm font-medium">
                      Municipality <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={newBooking.farmAddress?.municipality || ""} 
                      onValueChange={(value) => setNewBooking({
                        ...newBooking, 
                        farmAddress: {...newBooking.farmAddress!, municipality: value}
                      })}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select municipality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bayawan City">Bayawan City</SelectItem>
                        <SelectItem value="Dumaguete City">Dumaguete City</SelectItem>
                        <SelectItem value="Siaton">Siaton</SelectItem>
                        <SelectItem value="Valencia">Valencia</SelectItem>
                        <SelectItem value="Tanjay">Tanjay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province" className="text-sm font-medium">
                      Province <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="province"
                      placeholder="Negros Oriental"
                      value={newBooking.farmAddress?.province || ""}
                      onChange={(e) => setNewBooking({
                        ...newBooking, 
                        farmAddress: {...newBooking.farmAddress!, province: e.target.value}
                      })}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Field Operation Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Field Operation Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fieldLocation" className="text-sm font-medium">
                      Field Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fieldLocation"
                      placeholder="Lot 15, Barangay San Jose"
                      value={newBooking.fieldLocation || ""}
                      onChange={(e) => setNewBooking({...newBooking, fieldLocation: e.target.value})}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordinates" className="text-sm font-medium">
                      GPS Coordinates
                    </Label>
                    <Input
                      id="coordinates"
                      placeholder="9.3654° N, 122.8047° E"
                      value={newBooking.coordinates || ""}
                      onChange={(e) => setNewBooking({...newBooking, coordinates: e.target.value})}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="operation" className="text-sm font-medium">
                      Field Operation <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={newBooking.operation || ""} 
                      onValueChange={(value) => setNewBooking({...newBooking, operation: value})}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Land Preparation">Land Preparation</SelectItem>
                        <SelectItem value="Harrowing">Harrowing</SelectItem>
                        <SelectItem value="Planting">Planting</SelectItem>
                        <SelectItem value="Cultivation">Cultivation</SelectItem>
                        <SelectItem value="Harvesting">Harvesting</SelectItem>
                        <SelectItem value="Spraying">Spraying</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedArea" className="text-sm font-medium">
                      Estimated Area (hectares) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="estimatedArea"
                      type="number"
                      placeholder="12.5"
                      value={newBooking.estimatedArea || ""}
                      onChange={(e) => setNewBooking({...newBooking, estimatedArea: parseFloat(e.target.value) || 0})}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={newBooking.date || ""}
                      onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTractor" className="text-sm font-medium">
                      Assign Tractor
                    </Label>
                    <Select 
                      value={newBooking.assignedTractor || ""} 
                      onValueChange={(value) => setNewBooking({...newBooking, assignedTractor: value})}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                        <SelectValue placeholder="Select tractor (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {tractors.filter(t => t.status === 'available').map((tractor) => (
                          <SelectItem key={tractor.id} value={tractor.id}>
                            {tractor.model} - {tractor.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Rate Calculation Preview */}
              {newBooking.assignedTractor && newBooking.farmAddress?.municipality && newBooking.operation && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Rate Calculation</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(() => {
                        const selectedTractor = tractors.find(t => t.id === newBooking.assignedTractor)
                        const area = newBooking.estimatedArea || 0
                        const rate = selectedTractor && newBooking.farmAddress?.municipality && newBooking.operation ? 
                          calculateTractorRate(selectedTractor.type, newBooking.operation, newBooking.farmAddress.municipality, area) : 0
                        return (
                          <>
                            <div>
                              <div className="text-sm font-medium text-green-800">Rate per Hectare</div>
                              <div className="text-lg font-bold text-green-800">₱{rate.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-green-800">Total Cost</div>
                              <div className="text-lg font-bold text-green-800">₱{(rate * area).toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-green-800">Tractor Type</div>
                              <div className="text-sm text-gray-600">{selectedTractor?.type}</div>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about the field operation..."
                  value={newBooking.notes || ""}
                  onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  // Handle booking creation
                  console.log("Creating booking:", newBooking)
                  setIsAddBookingModalOpen(false)
                }}
              >
                Create Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Booking Modal */}
        <Dialog open={isViewBookingModalOpen} onOpenChange={setIsViewBookingModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-800">
                <Eye className="h-5 w-5" />
                Field Operation Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Booking ID</Label>
                    <div className="text-lg font-semibold">{selectedBooking.id}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedBooking.status === 'approved' ? 'bg-green-500 text-white' :
                        selectedBooking.status === 'pending' ? 'bg-yellow-500 text-white' :
                        selectedBooking.status === 'in-progress' ? 'bg-blue-500 text-white' :
                        selectedBooking.status === 'completed' ? 'bg-gray-500 text-white' :
                        'bg-red-500 text-white'
                      }`}
                    >
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Planter Code</Label>
                    <div className="text-lg">{selectedBooking.planterCode}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Planter ID</Label>
                    <div className="text-lg">{selectedBooking.planterId}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Planter Name</Label>
                    <div className="text-lg">{selectedBooking.planterName}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Contact Number</Label>
                    <div className="text-lg">{selectedBooking.contactNumber}</div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-medium text-gray-600">Farm Address</Label>
                    <div className="text-lg">
                      {selectedBooking.farmAddress.sitio}, {selectedBooking.farmAddress.barangay}<br />
                      {selectedBooking.farmAddress.municipality}, {selectedBooking.farmAddress.province}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Field Location</Label>
                    <div className="text-lg">{selectedBooking.fieldLocation}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Operation</Label>
                    <div className="text-lg font-semibold">{selectedBooking.operation}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date</Label>
                    <div className="text-lg">{new Date(selectedBooking.date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Estimated Area</Label>
                    <div className="text-lg">{selectedBooking.estimatedArea} hectares</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Rate per Hectare</Label>
                    <div className="text-lg">₱{selectedBooking.ratePerHa.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Total Cost</Label>
                    <div className="text-lg font-bold text-green-800">₱{selectedBooking.estimatedCost.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Assigned Tractor</Label>
                    <div className="text-lg">{selectedBooking.assignedTractor || 'Unassigned'}</div>
                  </div>
                  {selectedBooking.notes && (
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-600">Notes</Label>
                      <div className="text-lg bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewBookingModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Booking Modal */}
        <Dialog open={isEditBookingModalOpen} onOpenChange={setIsEditBookingModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-800">
                <Edit className="h-5 w-5" />
                Edit Field Operation Booking
              </DialogTitle>
              <DialogDescription>
                Update field operation details and recalculate area-based pricing if needed.
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-6 py-4">
                {/* Planter Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Planter Selection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editPlanterCode" className="text-sm font-medium">
                        Planter Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="editPlanterCode"
                        placeholder="PLT-2024-001"
                        value={selectedBooking.planterCode || ""}
                        onChange={(e) => setSelectedBooking({...selectedBooking, planterCode: e.target.value})}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editPlanterId" className="text-sm font-medium">
                        Planter ID <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="editPlanterId"
                        placeholder="PLT001"
                        value={selectedBooking.planterId || ""}
                        onChange={(e) => setSelectedBooking({...selectedBooking, planterId: e.target.value})}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Search Planter
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPlanterSearchOpen(true)}
                        className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {selectedPlanter ? selectedPlanter.planterName : "Select Planter"}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Selected Planter Information */}
                  {selectedPlanter && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-green-800">Planter Name</Label>
                          <div className="text-lg font-semibold text-green-800">{selectedPlanter.planterName}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-green-800">Contact Number</Label>
                          <div className="text-lg text-green-800">{selectedPlanter.contactNumber}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-green-800">Email</Label>
                          <div className="text-lg text-green-800">{selectedPlanter.email}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-green-800">Registration Date</Label>
                          <div className="text-lg text-green-800">{new Date(selectedPlanter.registrationDate).toLocaleDateString()}</div>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-green-800">Address</Label>
                          <div className="text-lg text-green-800">{selectedPlanter.address}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Farm Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Farm Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editSitio" className="text-sm font-medium">
                        Sitio <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="editSitio"
                        placeholder="Sitio Malipayon"
                        value={selectedBooking.farmAddress?.sitio || ""}
                        onChange={(e) => setSelectedBooking({
                          ...selectedBooking, 
                          farmAddress: {...selectedBooking.farmAddress!, sitio: e.target.value}
                        })}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editBarangay" className="text-sm font-medium">
                        Barangay <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="editBarangay"
                        placeholder="Barangay San Jose"
                        value={selectedBooking.farmAddress?.barangay || ""}
                        onChange={(e) => setSelectedBooking({
                          ...selectedBooking, 
                          farmAddress: {...selectedBooking.farmAddress!, barangay: e.target.value}
                        })}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editMunicipality" className="text-sm font-medium">
                        Municipality <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={selectedBooking.farmAddress?.municipality || ""} 
                        onValueChange={(value) => setSelectedBooking({
                          ...selectedBooking, 
                          farmAddress: {...selectedBooking.farmAddress!, municipality: value}
                        })}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select municipality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bayawan City">Bayawan City</SelectItem>
                          <SelectItem value="Dumaguete City">Dumaguete City</SelectItem>
                          <SelectItem value="Siaton">Siaton</SelectItem>
                          <SelectItem value="Valencia">Valencia</SelectItem>
                          <SelectItem value="Tanjay">Tanjay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editProvince" className="text-sm font-medium">
                        Province <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="editProvince"
                        placeholder="Negros Oriental"
                        value={selectedBooking.farmAddress?.province || ""}
                        onChange={(e) => setSelectedBooking({
                          ...selectedBooking, 
                          farmAddress: {...selectedBooking.farmAddress!, province: e.target.value}
                        })}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Field Operation Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Field Operation Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editFieldLocation" className="text-sm font-medium">
                        Field Location <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="editFieldLocation"
                        placeholder="Lot 15, Barangay San Jose"
                        value={selectedBooking.fieldLocation || ""}
                        onChange={(e) => setSelectedBooking({...selectedBooking, fieldLocation: e.target.value})}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editCoordinates" className="text-sm font-medium">
                        GPS Coordinates
                      </Label>
                      <Input
                        id="editCoordinates"
                        placeholder="9.3654° N, 122.8047° E"
                        value={selectedBooking.coordinates || ""}
                        onChange={(e) => setSelectedBooking({...selectedBooking, coordinates: e.target.value})}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editOperation" className="text-sm font-medium">
                        Field Operation <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={selectedBooking.operation || ""} 
                        onValueChange={(value) => setSelectedBooking({...selectedBooking, operation: value})}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Land Preparation">Land Preparation</SelectItem>
                          <SelectItem value="Harrowing">Harrowing</SelectItem>
                          <SelectItem value="Planting">Planting</SelectItem>
                          <SelectItem value="Cultivation">Cultivation</SelectItem>
                          <SelectItem value="Harvesting">Harvesting</SelectItem>
                          <SelectItem value="Spraying">Spraying</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editEstimatedArea" className="text-sm font-medium">
                        Estimated Area (hectares) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="editEstimatedArea"
                        type="number"
                        placeholder="12.5"
                        value={selectedBooking.estimatedArea || ""}
                        onChange={(e) => setSelectedBooking({...selectedBooking, estimatedArea: parseFloat(e.target.value) || 0})}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editDate" className="text-sm font-medium">
                        Date <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="editDate"
                        type="date"
                        value={selectedBooking.date || ""}
                        onChange={(e) => setSelectedBooking({...selectedBooking, date: e.target.value})}
                        className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editAssignedTractor" className="text-sm font-medium">
                        Assign Tractor
                      </Label>
                      <Select 
                        value={selectedBooking.assignedTractor || ""} 
                        onValueChange={(value) => setSelectedBooking({...selectedBooking, assignedTractor: value})}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select tractor (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {tractors.map((tractor) => (
                            <SelectItem key={tractor.id} value={tractor.id}>
                              {tractor.model} - {tractor.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editStatus" className="text-sm font-medium">
                        Status <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={selectedBooking.status || ""} 
                        onValueChange={(value) => setSelectedBooking({...selectedBooking, status: value as any})}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Rate Calculation Preview */}
                {selectedBooking.assignedTractor && selectedBooking.farmAddress?.municipality && selectedBooking.operation && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Rate Calculation</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(() => {
                          const selectedTractor = tractors.find(t => t.id === selectedBooking.assignedTractor)
                          const area = selectedBooking.estimatedArea || 0
                          const rate = selectedTractor && selectedBooking.farmAddress?.municipality && selectedBooking.operation ? 
                            calculateTractorRate(selectedTractor.type, selectedBooking.operation, selectedBooking.farmAddress.municipality, area) : 0
                          return (
                            <>
                              <div>
                                <div className="text-sm font-medium text-green-800">Rate per Hectare</div>
                                <div className="text-lg font-bold text-green-800">₱{rate.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-green-800">Total Cost</div>
                                <div className="text-lg font-bold text-green-800">₱{(rate * area).toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-green-800">Tractor Type</div>
                                <div className="text-sm text-gray-600">{selectedTractor?.type}</div>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="editNotes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <Textarea
                    id="editNotes"
                    placeholder="Additional notes about the field operation..."
                    value={selectedBooking.notes || ""}
                    onChange={(e) => setSelectedBooking({...selectedBooking, notes: e.target.value})}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleUpdateBooking}
              >
                Update Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Booking Modal */}
        <Dialog open={isDeleteBookingModalOpen} onOpenChange={setIsDeleteBookingModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Delete Field Operation Booking
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this field operation booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="font-medium text-red-800">Booking ID: {selectedBooking.id}</div>
                  <div className="text-red-600">Planter: {selectedBooking.planterName}</div>
                  <div className="text-red-600">Operation: {selectedBooking.operation}</div>
                  <div className="text-red-600">Date: {new Date(selectedBooking.date).toLocaleDateString()}</div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  // Handle booking deletion
                  console.log("Deleting booking:", selectedBooking?.id)
                  setIsDeleteBookingModalOpen(false)
                }}
              >
                Delete Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Planter Search Modal */}
        <Dialog open={isPlanterSearchOpen} onOpenChange={setIsPlanterSearchOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-800">
                <Search className="h-5 w-5" />
                Search Registered Planters
              </DialogTitle>
              <DialogDescription>
                Search and select a registered planter from the database.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by planter name, code, or contact number..."
                  value={planterSearchQuery}
                  onChange={(e) => setPlanterSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Planter List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {planters
                  .filter(planter => 
                    planter.planterName.toLowerCase().includes(planterSearchQuery.toLowerCase()) ||
                    planter.planterCode.toLowerCase().includes(planterSearchQuery.toLowerCase()) ||
                    planter.contactNumber.includes(planterSearchQuery)
                  )
                  .map((planter) => (
                    <div
                      key={planter.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePlanterSelection(planter)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-lg">{planter.planterName}</div>
                            <Badge variant="outline" className="text-xs">
                              {planter.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Code:</strong> {planter.planterCode} | <strong>ID:</strong> {planter.id}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Contact:</strong> {planter.contactNumber} | <strong>Email:</strong> {planter.email}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Address:</strong> {planter.address}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>Farms:</strong> {planter.farms.length} farm(s) | <strong>Registration:</strong> {new Date(planter.registrationDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {planter.farms.length} Farm{planter.farms.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {planters.filter(planter => 
                planter.planterName.toLowerCase().includes(planterSearchQuery.toLowerCase()) ||
                planter.planterCode.toLowerCase().includes(planterSearchQuery.toLowerCase()) ||
                planter.contactNumber.includes(planterSearchQuery)
              ).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <div className="text-lg font-medium">No planters found</div>
                  <div className="text-sm">Try adjusting your search criteria</div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPlanterSearchOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
} 
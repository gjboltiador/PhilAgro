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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  RefreshCw,
  Save,
  X,
  Camera,
  Image as ImageIcon
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface TruckData {
  id: string
  plateNumber: string
  type: string
  model: string
  capacity: number
  underloadCapacity: number
  driver: string
  status: "available" | "on-route" | "maintenance"
  orExpiry: string
  crExpiry: string
  year: string
  color: string
  engineNumber: string
  chassisNumber: string
  fuelType: string
  transmission: string
  images: string[]
  notes: string
  maintenanceHistory?: { date: string; type: string; description: string; cost: number; }[]
  performanceStats?: { totalTrips: number; totalDistance: number; averageFuelConsumption: number; lastMaintenance: string; }
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
  destinationMill: string
  date: string
  tonnage: number
  status: "pending" | "approved" | "in-progress" | "completed" | "cancelled"
  assignedTruck: string
  assignedDriver: string
  rate: number
  totalAmount: number
  notes: string
}

interface TruckRate {
  truckType: string
  baseRate: number
  locationRates: { [municipality: string]: number }
  destinationRates: { [mill: string]: number }
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
  const [isAddTruckModalOpen, setIsAddTruckModalOpen] = useState(false)
  const [isEditTruckModalOpen, setIsEditTruckModalOpen] = useState(false)
  const [isDeleteTruckModalOpen, setIsDeleteTruckModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingTruck, setEditingTruck] = useState<TruckData | null>(null)
  const [deletingTruck, setDeletingTruck] = useState<TruckData | null>(null)

  // Add Truck Form State
  const [newTruck, setNewTruck] = useState({
    plateNumber: "",
    type: "",
    model: "",
    capacity: "",
    underloadCapacity: "",
    driver: "unassigned",
    orExpiry: "",
    crExpiry: "",
    year: "",
    color: "",
    engineNumber: "",
    chassisNumber: "",
    fuelType: "",
    transmission: "",
    notes: ""
  })

  // Image upload state
  const [truckImages, setTruckImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [editTruckImages, setEditTruckImages] = useState<File[]>([])
  const [editImagePreviewUrls, setEditImagePreviewUrls] = useState<string[]>([])
  
  // OR/CR document upload state
  const [orDocument, setOrDocument] = useState<File | null>(null)
  const [orPreviewUrl, setOrPreviewUrl] = useState<string>("")
  const [crDocument, setCrDocument] = useState<File | null>(null)
  const [crPreviewUrl, setCrPreviewUrl] = useState<string>("")
  const [editOrDocument, setEditOrDocument] = useState<File | null>(null)
  const [editOrPreviewUrl, setEditOrPreviewUrl] = useState<string>("")
  const [editCrDocument, setEditCrDocument] = useState<File | null>(null)
  const [editCrPreviewUrl, setEditCrPreviewUrl] = useState<string>("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)
  const orFileInputRef = useRef<HTMLInputElement>(null)
  const crFileInputRef = useRef<HTMLInputElement>(null)
  const editOrFileInputRef = useRef<HTMLInputElement>(null)
  const editCrFileInputRef = useRef<HTMLInputElement>(null)

  // Map and tracking states
  const [isClient, setIsClient] = useState(false)
  const [mapView, setMapView] = useState("satellite")
  const [zoomLevel, setZoomLevel] = useState(10) // Zoom level for ~10km radius view
  const [isTrackingActive, setIsTrackingActive] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().split(' ')[0].substring(0, 5))
  const [selectedTruck, setSelectedTruck] = useState<string>("all")
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
    destinationMill: "",
    date: "",
    tonnage: 0,
    assignedTruck: "",
    assignedDriver: "",
    notes: ""
  })

  // Planter search states
  const [planterSearchQuery, setPlanterSearchQuery] = useState("")
  const [isPlanterSearchOpen, setIsPlanterSearchOpen] = useState(false)
  const [selectedPlanter, setSelectedPlanter] = useState<PlanterData | null>(null)
  
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
      underloadCapacity: 3,
      driver: "Juan Santos",
      status: "available",
      orExpiry: "Dec 15, 2024",
      crExpiry: "Mar 20, 2025",
      year: "2020",
      color: "White",
      engineNumber: "ENG-2020-001",
      chassisNumber: "CHS-2020-001",
      fuelType: "Diesel",
      transmission: "Manual",
      images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
      notes: "Good condition, regularly maintained. Excellent for long-distance hauls to sugar mills.",
      maintenanceHistory: [
        { date: "2024-01-15", type: "Oil Change", description: "Regular oil change and filter replacement", cost: 2500 },
        { date: "2023-12-20", type: "Brake Service", description: "Brake pad replacement and brake fluid check", cost: 8000 },
        { date: "2023-11-10", type: "Tire Replacement", description: "Replaced all 6 tires with new ones", cost: 45000 }
      ],
      performanceStats: {
        totalTrips: 156,
        totalDistance: 45000,
        averageFuelConsumption: 8.5,
        lastMaintenance: "2024-01-15"
      }
    },
    {
      id: "TRK-002",
      plateNumber: "DEF-5678",
      type: "6-Wheeler",
      model: "Mitsubishi Fuso Canter",
      capacity: 3,
      underloadCapacity: 2,
      driver: "Pedro Cruz",
      status: "on-route",
      orExpiry: "Nov 30, 2024",
      crExpiry: "Jan 15, 2025",
      year: "2019",
      color: "Blue",
      engineNumber: "ENG-2019-002",
      chassisNumber: "CHS-2019-002",
      fuelType: "Diesel",
      transmission: "Manual",
      images: ["/placeholder.jpg", "/placeholder.jpg"],
      notes: "Reliable truck for medium-distance hauls. Recently serviced.",
      maintenanceHistory: [
        { date: "2024-01-10", type: "General Service", description: "Complete engine tune-up and inspection", cost: 12000 },
        { date: "2023-11-25", type: "Battery Replacement", description: "Replaced old battery with new one", cost: 3500 }
      ],
      performanceStats: {
        totalTrips: 89,
        totalDistance: 28000,
        averageFuelConsumption: 7.2,
        lastMaintenance: "2024-01-10"
      }
    },
    {
      id: "TRK-003",
      plateNumber: "GHI-9012",
      type: "4-Wheeler",
      model: "Toyota Dyna",
      capacity: 2,
      underloadCapacity: 1,
      driver: "Maria Lopez",
      status: "maintenance",
      orExpiry: "Oct 10, 2024",
      crExpiry: "Feb 28, 2025",
      year: "2021",
      color: "Red",
      engineNumber: "ENG-2021-003",
      chassisNumber: "CHS-2021-003",
      fuelType: "Diesel",
      transmission: "Manual",
      images: ["/placeholder.jpg"],
      notes: "Currently under maintenance. Engine overhaul in progress.",
      maintenanceHistory: [
        { date: "2024-01-20", type: "Engine Overhaul", description: "Major engine repair and parts replacement", cost: 85000 },
        { date: "2023-10-15", type: "Suspension Repair", description: "Front suspension system repair", cost: 15000 }
      ],
      performanceStats: {
        totalTrips: 67,
        totalDistance: 18000,
        averageFuelConsumption: 6.8,
        lastMaintenance: "2024-01-20"
      }
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
    },
    {
      id: "PLT004",
      planterCode: "PLT-2024-004",
      planterName: "Ana Rodriguez",
      contactNumber: "+63 945 678 9012",
      email: "ana.rodriguez@email.com",
      address: "321 Valley Road, Valencia, Negros Oriental",
      registrationDate: "2024-01-25",
      status: "active",
      farms: [
        {
          id: "FARM005",
          sitio: "Sitio Bukid",
          barangay: "Barangay San Antonio",
          municipality: "Valencia",
          province: "Negros Oriental",
          hectarage: 18.5,
          cropType: "Sugarcane"
        }
      ]
    },
    {
      id: "PLT005",
      planterCode: "PLT-2024-005",
      planterName: "Carlos Fernandez",
      contactNumber: "+63 956 789 0123",
      email: "carlos.fernandez@email.com",
      address: "654 Coastal Drive, Tanjay, Negros Oriental",
      registrationDate: "2024-01-30",
      status: "active",
      farms: [
        {
          id: "FARM006",
          sitio: "Sitio Dagat",
          barangay: "Barangay San Pedro",
          municipality: "Tanjay",
          province: "Negros Oriental",
          hectarage: 22.0,
          cropType: "Sugarcane"
        }
      ]
    }
  ]

  const comprehensiveBookings: ComprehensiveBookingData[] = [
    {
      id: "BK001",
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
      destinationMill: "TOLONG",
      date: "2024-01-20",
      tonnage: 25,
      status: "approved",
      assignedTruck: "TRK-001",
      assignedDriver: "Juan Santos",
      rate: 8500,
      totalAmount: 212500,
      notes: "Sugarcane hauling from Bayawan to Tolong Sugar Mill"
    },
    {
      id: "BK002",
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
      destinationMill: "SONEDCO",
      date: "2024-01-21",
      tonnage: 30,
      status: "in-progress",
      assignedTruck: "TRK-002",
      assignedDriver: "Pedro Cruz",
      rate: 9200,
      totalAmount: 276000,
      notes: "Sugarcane transport to SONEDCO mill"
    },
    {
      id: "BK003",
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
      destinationMill: "URSUMCO",
      date: "2024-01-22",
      tonnage: 20,
      status: "pending",
      assignedTruck: "",
      assignedDriver: "",
      rate: 7800,
      totalAmount: 156000,
      notes: "Pending approval for URSUMCO delivery"
    }
  ]

  const truckRates: TruckRate[] = [
    {
      truckType: "10-Wheeler",
      baseRate: 8000,
      locationRates: {
        "Bayawan City": 500,
        "Dumaguete City": 300,
        "Siaton": 400,
        "Valencia": 600,
        "Tanjay": 450
      },
      destinationRates: {
        "TOLONG": 1000,
        "SONEDCO": 1200,
        "URSUMCO": 800,
        "BUGAY": 1500,
        "CAB": 900
      }
    },
    {
      truckType: "6-Wheeler",
      baseRate: 6500,
      locationRates: {
        "Bayawan City": 400,
        "Dumaguete City": 250,
        "Siaton": 350,
        "Valencia": 500,
        "Tanjay": 400
      },
      destinationRates: {
        "TOLONG": 800,
        "SONEDCO": 1000,
        "URSUMCO": 700,
        "BUGAY": 1200,
        "CAB": 750
      }
    },
    {
      truckType: "4-Wheeler",
      baseRate: 5000,
      locationRates: {
        "Bayawan City": 300,
        "Dumaguete City": 200,
        "Siaton": 250,
        "Valencia": 400,
        "Tanjay": 300
      },
      destinationRates: {
        "TOLONG": 600,
        "SONEDCO": 800,
        "URSUMCO": 500,
        "BUGAY": 1000,
        "CAB": 600
      }
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

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewTruck(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const validFiles = newFiles.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length !== newFiles.length) {
      alert('Some files were rejected. Please ensure all files are images and under 5MB.')
    }

    if (truckImages.length + validFiles.length > 5) {
      alert('Maximum 5 images allowed. Please remove some images first.')
      return
    }

    setTruckImages(prev => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })

    // Clear the input value to allow re-uploading the same file
    event.target.value = ''
  }

  // Handle edit image upload
  const handleEditImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const validFiles = newFiles.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length !== newFiles.length) {
      alert('Some files were rejected. Please ensure all files are images and under 5MB.')
    }

    if (editTruckImages.length + validFiles.length > 5) {
      alert('Maximum 5 images allowed. Please remove some images first.')
      return
    }

    setEditTruckImages(prev => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditImagePreviewUrls(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })

    // Clear the input value to allow re-uploading the same file
    event.target.value = ''
  }

  // Handle OR document upload
  const handleOrDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
    const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit

    if (!isValidType || !isValidSize) {
      alert('Please upload an image or PDF file under 10MB.')
      return
    }

    setOrDocument(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setOrPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Clear the input value to allow re-uploading the same file
    event.target.value = ''
  }

  // Handle CR document upload
  const handleCrDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
    const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit

    if (!isValidType || !isValidSize) {
      alert('Please upload an image or PDF file under 10MB.')
      return
    }

    setCrDocument(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setCrPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Clear the input value to allow re-uploading the same file
    event.target.value = ''
  }

  // Handle edit OR document upload
  const handleEditOrDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
    const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit

    if (!isValidType || !isValidSize) {
      alert('Please upload an image or PDF file under 10MB.')
      return
    }

    setEditOrDocument(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setEditOrPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Clear the input value to allow re-uploading the same file
    event.target.value = ''
  }

  // Handle edit CR document upload
  const handleEditCrDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
    const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit

    if (!isValidType || !isValidSize) {
      alert('Please upload an image or PDF file under 10MB.')
      return
    }

    setEditCrDocument(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setEditCrPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Clear the input value to allow re-uploading the same file
    event.target.value = ''
  }

  // Remove image
  const removeImage = (index: number) => {
    setTruckImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  // Remove edit image
  const removeEditImage = (index: number) => {
    setEditTruckImages(prev => prev.filter((_, i) => i !== index))
    setEditImagePreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  // Remove OR document
  const removeOrDocument = () => {
    setOrDocument(null)
    setOrPreviewUrl("")
  }

  // Remove CR document
  const removeCrDocument = () => {
    setCrDocument(null)
    setCrPreviewUrl("")
  }

  // Remove edit OR document
  const removeEditOrDocument = () => {
    setEditOrDocument(null)
    setEditOrPreviewUrl("")
  }

  // Remove edit CR document
  const removeEditCrDocument = () => {
    setEditCrDocument(null)
    setEditCrPreviewUrl("")
  }

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const triggerEditFileInput = () => {
    editFileInputRef.current?.click()
  }

  const triggerOrFileInput = () => {
    orFileInputRef.current?.click()
  }

  const triggerCrFileInput = () => {
    crFileInputRef.current?.click()
  }

  const triggerEditOrFileInput = () => {
    editOrFileInputRef.current?.click()
  }

  const triggerEditCrFileInput = () => {
    editCrFileInputRef.current?.click()
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please ensure all files are images and under 5MB.')
    }

    if (truckImages.length + validFiles.length > 5) {
      alert('Maximum 5 images allowed. Please remove some images first.')
      return
    }

    setTruckImages(prev => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // Handle edit drag and drop
  const handleEditDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB limit
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please ensure all files are images and under 5MB.')
    }

    if (editTruckImages.length + validFiles.length > 5) {
      alert('Maximum 5 images allowed. Please remove some images first.')
      return
    }

    setEditTruckImages(prev => [...prev, ...validFiles])

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditImagePreviewUrls(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // Edit and Delete Functions
  const handleEditTruck = (truck: TruckData) => {
    setEditingTruck(truck)
    setNewTruck({
      plateNumber: truck.plateNumber,
      type: truck.type,
      model: truck.model,
      capacity: truck.capacity.toString(),
      underloadCapacity: truck.underloadCapacity.toString(),
      driver: truck.driver === "Unassigned" ? "unassigned" : truck.driver,
      orExpiry: truck.orExpiry,
      crExpiry: truck.crExpiry,
      year: "",
      color: "",
      engineNumber: "",
      chassisNumber: "",
      fuelType: "",
      transmission: "",
      notes: ""
    })
    setIsEditTruckModalOpen(true)
  }

  const handleDeleteTruck = (truck: TruckData) => {
    setDeletingTruck(truck)
    setIsDeleteTruckModalOpen(true)
  }

  const confirmDeleteTruck = async () => {
    if (!deletingTruck) return

    setIsSubmitting(true)
    try {
      // In a real application, you would send this to your API
      console.log("Deleting truck:", deletingTruck)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove from local state (in real app, this would be handled by API response)
      // trucks = trucks.filter(t => t.id !== deletingTruck.id)
      
      setIsDeleteTruckModalOpen(false)
      setDeletingTruck(null)
      
      alert("Truck deleted successfully!")
      
    } catch (error) {
      console.error("Error deleting truck:", error)
      alert("Error deleting truck. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTruck = async () => {
    if (!editingTruck) return

    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!newTruck.plateNumber || !newTruck.type || !newTruck.model || !newTruck.capacity || !newTruck.underloadCapacity) {
        alert("Please fill in all required fields")
        return
      }

      // Create updated truck object
      const updatedTruck: TruckData = {
        ...editingTruck,
        plateNumber: newTruck.plateNumber,
        type: newTruck.type,
        model: newTruck.model,
        capacity: parseInt(newTruck.capacity),
        underloadCapacity: parseInt(newTruck.underloadCapacity),
        driver: newTruck.driver === "unassigned" ? "Unassigned" : newTruck.driver,
        orExpiry: newTruck.orExpiry,
        crExpiry: newTruck.crExpiry,
        year: newTruck.year,
        color: newTruck.color,
        engineNumber: newTruck.engineNumber,
        chassisNumber: newTruck.chassisNumber,
        fuelType: newTruck.fuelType,
        transmission: newTruck.transmission,
        notes: newTruck.notes
      }

             // In a real application, you would send this to your API
       console.log("Updating truck:", updatedTruck)
       console.log("Updated images:", editTruckImages)
       console.log("Updated OR document:", editOrDocument)
       console.log("Updated CR document:", editCrDocument)
       console.log("Updated notes:", newTruck.notes)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form and close modal
      setNewTruck({
        plateNumber: "",
        type: "",
        model: "",
        capacity: "",
        underloadCapacity: "",
        driver: "unassigned",
        orExpiry: "",
        crExpiry: "",
        year: "",
        color: "",
        engineNumber: "",
        chassisNumber: "",
        fuelType: "",
        transmission: "",
        notes: ""
      })
      
      // Reset images and documents
      setEditTruckImages([])
      setEditImagePreviewUrls([])
      setEditOrDocument(null)
      setEditOrPreviewUrl("")
      setEditCrDocument(null)
      setEditCrPreviewUrl("")
      
      setIsEditTruckModalOpen(false)
      setEditingTruck(null)
      
      alert("Truck updated successfully!")
      
    } catch (error) {
      console.error("Error updating truck:", error)
      alert("Error updating truck. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form submission
  const handleAddTruck = async () => {
    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!newTruck.plateNumber || !newTruck.type || !newTruck.model || !newTruck.capacity || !newTruck.underloadCapacity) {
        alert("Please fill in all required fields")
        return
      }

      // Generate new truck ID
      const newTruckId = `TRK-${String(trucks.length + 1).padStart(3, '0')}`
      
             // Create new truck object
       const truckToAdd: TruckData = {
         id: newTruckId,
         plateNumber: newTruck.plateNumber,
         type: newTruck.type,
         model: newTruck.model,
         capacity: parseInt(newTruck.capacity),
         underloadCapacity: parseInt(newTruck.underloadCapacity),
         driver: newTruck.driver === "unassigned" ? "Unassigned" : newTruck.driver || "Unassigned",
         status: "available",
         orExpiry: newTruck.orExpiry,
         crExpiry: newTruck.crExpiry,
         year: newTruck.year,
         color: newTruck.color,
         engineNumber: newTruck.engineNumber,
         chassisNumber: newTruck.chassisNumber,
         fuelType: newTruck.fuelType,
         transmission: newTruck.transmission,
         images: imagePreviewUrls,
         notes: newTruck.notes,
         maintenanceHistory: [],
         performanceStats: {
           totalTrips: 0,
           totalDistance: 0,
           averageFuelConsumption: 0,
           lastMaintenance: new Date().toISOString().split('T')[0]
         }
       }

             // In a real application, you would send this to your API
       console.log("Adding new truck:", truckToAdd)
       console.log("Uploaded images:", truckImages)
       console.log("OR document:", orDocument)
       console.log("CR document:", crDocument)
       console.log("Notes:", newTruck.notes)
       
       // Simulate API call delay
       await new Promise(resolve => setTimeout(resolve, 1000))
      
                    // Reset form and close modal
       setNewTruck({
         plateNumber: "",
         type: "",
         model: "",
         capacity: "",
         underloadCapacity: "",
         driver: "unassigned",
         orExpiry: "",
         crExpiry: "",
         year: "",
         color: "",
         engineNumber: "",
         chassisNumber: "",
         fuelType: "",
         transmission: "",
         notes: ""
       })
        
       // Reset images and documents
       setTruckImages([])
       setImagePreviewUrls([])
       setOrDocument(null)
       setOrPreviewUrl("")
       setCrDocument(null)
       setCrPreviewUrl("")
      
      setIsAddTruckModalOpen(false)
      
      // Show success message (in a real app, you'd use a toast notification)
      alert("Truck added successfully!")
      
    } catch (error) {
      console.error("Error adding truck:", error)
      alert("Error adding truck. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form when modal closes
  const handleModalClose = () => {
    setNewTruck({
      plateNumber: "",
      type: "",
      model: "",
      capacity: "",
      underloadCapacity: "",
      driver: "unassigned",
      orExpiry: "",
      crExpiry: "",
      year: "",
      color: "",
      engineNumber: "",
      chassisNumber: "",
      fuelType: "",
      transmission: "",
      notes: ""
    })
    // Reset images and documents
    setTruckImages([])
    setImagePreviewUrls([])
    setOrDocument(null)
    setOrPreviewUrl("")
    setCrDocument(null)
    setCrPreviewUrl("")
    setIsAddTruckModalOpen(false)
  }

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Calculate booking rate based on truck type, location, and destination
  const calculateRate = (truckType: string, municipality: string, destination: string, tonnage: number): number => {
    const rate = truckRates.find(r => r.truckType === truckType)
    if (!rate) return 0

    const baseRate = rate.baseRate
    const locationRate = rate.locationRates[municipality] || 0
    const destinationRate = rate.destinationRates[destination] || 0

    return baseRate + locationRate + destinationRate
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
          !selectedBooking.farmAddress?.municipality || !selectedBooking.destinationMill || 
          !selectedBooking.date || !selectedBooking.tonnage || !selectedBooking.status) {
        alert("Please fill in all required fields")
        return
      }

      // Recalculate rate if truck, location, or destination changed
      if (selectedBooking.assignedTruck && selectedBooking.farmAddress?.municipality && selectedBooking.destinationMill) {
        const selectedTruck = trucks.find(t => t.id === selectedBooking.assignedTruck)
        if (selectedTruck) {
          const newRate = calculateRate(
            selectedTruck.type, 
            selectedBooking.farmAddress.municipality, 
            selectedBooking.destinationMill, 
            selectedBooking.tonnage
          )
          const newTotalAmount = newRate * selectedBooking.tonnage
          
          setSelectedBooking(prev => ({
            ...prev!,
            rate: newRate,
            totalAmount: newTotalAmount
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
            
            {/* Add Truck Button with Modal */}
            <Dialog open={isAddTruckModalOpen} onOpenChange={setIsAddTruckModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm"
                  onClick={() => setIsAddTruckModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Truck</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-orange-800">
                    <Truck className="h-5 w-5" />
                    Add New Truck
                  </DialogTitle>
                  <DialogDescription>
                    Enter the details for the new truck to add it to your fleet.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="plateNumber" className="text-sm font-medium">
                          Plate Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="plateNumber"
                          placeholder="ABC-1234"
                          value={newTruck.plateNumber}
                          onChange={(e) => handleInputChange("plateNumber", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-sm font-medium">
                          Truck Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={newTruck.type} onValueChange={(value) => handleInputChange("type", value)}>
                          <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder="Select truck type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4-Wheeler">4-Wheeler</SelectItem>
                            <SelectItem value="6-Wheeler">6-Wheeler</SelectItem>
                            <SelectItem value="8-Wheeler">8-Wheeler</SelectItem>
                            <SelectItem value="10-Wheeler">10-Wheeler</SelectItem>
                            <SelectItem value="12-Wheeler">12-Wheeler</SelectItem>
                            <SelectItem value="Tanker">Tanker</SelectItem>
                            <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="model" className="text-sm font-medium">
                          Model <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="model"
                          placeholder="e.g., Isuzu ELF, Mitsubishi Fuso"
                          value={newTruck.model}
                          onChange={(e) => handleInputChange("model", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="capacity" className="text-sm font-medium">
                          Capacity (tons) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="capacity"
                          type="number"
                          placeholder="5"
                          value={newTruck.capacity}
                          onChange={(e) => handleInputChange("capacity", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="underloadCapacity" className="text-sm font-medium">
                          Underload Capacity (Sugar Cane Hauling) (tons) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="underloadCapacity"
                          type="number"
                          placeholder="3"
                          value={newTruck.underloadCapacity}
                          onChange={(e) => handleInputChange("underloadCapacity", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="year" className="text-sm font-medium">
                          Year
                        </Label>
                        <Input
                          id="year"
                          type="number"
                          placeholder="2020"
                          value={newTruck.year}
                          onChange={(e) => handleInputChange("year", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="color" className="text-sm font-medium">
                          Color
                        </Label>
                        <Input
                          id="color"
                          placeholder="White"
                          value={newTruck.color}
                          onChange={(e) => handleInputChange("color", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Driver Assignment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Driver Assignment</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="driver" className="text-sm font-medium">
                        Assign Driver
                      </Label>
                                              <Select value={newTruck.driver} onValueChange={(value) => handleInputChange("driver", value)}>
                          <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder="Select driver or leave unassigned" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {drivers.map(driver => (
                              <SelectItem key={driver.id} value={driver.name}>
                                {driver.name} - {driver.licenseNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    </div>
                  </div>
                  
                  {/* Technical Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Technical Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="engineNumber" className="text-sm font-medium">
                          Engine Number
                        </Label>
                        <Input
                          id="engineNumber"
                          placeholder="Engine serial number"
                          value={newTruck.engineNumber}
                          onChange={(e) => handleInputChange("engineNumber", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="chassisNumber" className="text-sm font-medium">
                          Chassis Number
                        </Label>
                        <Input
                          id="chassisNumber"
                          placeholder="Chassis serial number"
                          value={newTruck.chassisNumber}
                          onChange={(e) => handleInputChange("chassisNumber", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fuelType" className="text-sm font-medium">
                          Fuel Type
                        </Label>
                        <Select value={newTruck.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
                          <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Gasoline">Gasoline</SelectItem>
                            <SelectItem value="LPG">LPG</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="transmission" className="text-sm font-medium">
                          Transmission
                        </Label>
                        <Select value={newTruck.transmission} onValueChange={(value) => handleInputChange("transmission", value)}>
                          <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder="Select transmission type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Registration Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Registration Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="orExpiry" className="text-sm font-medium">
                          OR Expiry Date
                        </Label>
                        <Input
                          id="orExpiry"
                          type="date"
                          value={newTruck.orExpiry}
                          onChange={(e) => handleInputChange("orExpiry", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="crExpiry" className="text-sm font-medium">
                          CR Expiry Date
                        </Label>
                        <Input
                          id="crExpiry"
                          type="date"
                          value={newTruck.crExpiry}
                          onChange={(e) => handleInputChange("crExpiry", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* OR/CR Documents */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Registration Documents</h3>
                    <p className="text-sm text-gray-600">Upload OR and CR documents for historical records</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* OR Document */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">
                          Official Receipt (OR) Document
                        </Label>
                        
                        <input
                          ref={orFileInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleOrDocumentUpload}
                          className="hidden"
                        />
                        
                        {!orPreviewUrl ? (
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors cursor-pointer"
                            onClick={triggerOrFileInput}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-center">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-orange-600" />
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Upload OR Document</p>
                                <p className="text-xs text-gray-500 mt-1">Click to browse or drag & drop</p>
                                <p className="text-xs text-gray-400">Image or PDF, max 10MB</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="relative">
                              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                {orDocument?.type === 'application/pdf' ? (
                                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                                    <div className="text-center">
                                      <FileText className="h-12 w-12 text-red-500 mx-auto mb-2" />
                                      <p className="text-sm font-medium text-gray-700">PDF Document</p>
                                      <p className="text-xs text-gray-500">{orDocument.name}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={orPreviewUrl}
                                    alt="OR Document"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeOrDocument}
                                className="absolute top-2 right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-600">
                              <p className="font-medium">{orDocument?.name}</p>
                              <p>{orDocument?.size ? (orDocument.size / (1024 * 1024)).toFixed(1) : '0'} MB</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CR Document */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">
                          Certificate of Registration (CR) Document
                        </Label>
                        
                        <input
                          ref={crFileInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleCrDocumentUpload}
                          className="hidden"
                        />
                        
                        {!crPreviewUrl ? (
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors cursor-pointer"
                            onClick={triggerCrFileInput}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-center">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-orange-600" />
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Upload CR Document</p>
                                <p className="text-xs text-gray-500 mt-1">Click to browse or drag & drop</p>
                                <p className="text-xs text-gray-400">Image or PDF, max 10MB</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="relative">
                              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                {crDocument?.type === 'application/pdf' ? (
                                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                                    <div className="text-center">
                                      <FileText className="h-12 w-12 text-red-500 mx-auto mb-2" />
                                      <p className="text-sm font-medium text-gray-700">PDF Document</p>
                                      <p className="text-xs text-gray-500">{crDocument.name}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={crPreviewUrl}
                                    alt="CR Document"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeCrDocument}
                                className="absolute top-2 right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-600">
                              <p className="font-medium">{crDocument?.name}</p>
                              <p>{crDocument?.size ? (crDocument.size / (1024 * 1024)).toFixed(1) : '0'} MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Truck Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Truck Images</h3>
                    
                    <div className="space-y-4">
                                             {/* Upload Area */}
                       <div 
                         className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer"
                         onDragOver={handleDragOver}
                         onDrop={handleDrop}
                         onClick={triggerFileInput}
                       >
                         <input
                           ref={fileInputRef}
                           type="file"
                           multiple
                           accept="image/*"
                           onChange={handleImageUpload}
                           className="hidden"
                         />
                         
                         <div className="space-y-3">
                           <div className="flex justify-center">
                             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                               <Camera className="h-6 w-6 text-orange-600" />
                             </div>
                           </div>
                           
                           <div>
                             <p className="text-sm font-medium text-gray-700">
                               Upload truck images
                             </p>
                             <p className="text-xs text-gray-500 mt-1">
                               Drag & drop images here or click to browse
                             </p>
                             <p className="text-xs text-gray-400 mt-1">
                               PNG, JPG, JPEG up to 5MB each. Maximum 5 images.
                             </p>
                           </div>
                           
                           <Button
                             type="button"
                             variant="outline"
                             onClick={(e) => {
                               e.stopPropagation()
                               triggerFileInput()
                             }}
                             className="border-orange-200 text-orange-700 hover:bg-orange-50"
                           >
                             <Upload className="h-4 w-4 mr-2" />
                             Choose Images
                           </Button>
                         </div>
                       </div>

                                             {/* Image Previews */}
                       {imagePreviewUrls.length > 0 && (
                         <div className="space-y-3">
                           <div className="flex items-center justify-between">
                             <h4 className="text-sm font-medium text-gray-700">
                               Uploaded Images ({imagePreviewUrls.length}/5)
                             </h4>
                             <Button
                               type="button"
                               variant="outline"
                               size="sm"
                               onClick={() => {
                                 setTruckImages([])
                                 setImagePreviewUrls([])
                               }}
                               className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                             >
                               <Trash2 className="h-3 w-3 mr-1" />
                               Clear All
                             </Button>
                           </div>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                             {imagePreviewUrls.map((url, index) => (
                               <div key={index} className="relative group">
                                 <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                   <img
                                     src={url}
                                     alt={`Truck image ${index + 1}`}
                                     className="w-full h-full object-cover"
                                   />
                                 </div>
                                 <Button
                                   type="button"
                                   variant="destructive"
                                   size="sm"
                                   onClick={() => removeImage(index)}
                                   className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                                 >
                                   <X className="h-3 w-3" />
                                 </Button>
                                 <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded truncate">
                                   {truckImages[index]?.name || `Image ${index + 1}`}
                                 </div>
                                 <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                   {(truckImages[index]?.size / (1024 * 1024)).toFixed(1)}MB
                                 </div>
                               </div>
                             ))}
                           </div>
                           
                           {/* Image Summary */}
                           <div className="bg-gray-50 rounded-lg p-3">
                             <div className="flex items-center justify-between text-sm">
                               <span className="text-gray-600">Total size:</span>
                               <span className="font-medium">
                                 {(truckImages.reduce((total, file) => total + file.size, 0) / (1024 * 1024)).toFixed(1)} MB
                               </span>
                             </div>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Notes</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information about the truck..."
                        value={newTruck.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleModalClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddTruck}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Add Truck
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Truck Modal */}
            <Dialog open={isEditTruckModalOpen} onOpenChange={setIsEditTruckModalOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-orange-800">
                    <Edit className="h-5 w-5" />
                    Edit Truck
                  </DialogTitle>
                  <DialogDescription>
                    Update the details for truck {editingTruck?.plateNumber}.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-plateNumber" className="text-sm font-medium">
                          Plate Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="edit-plateNumber"
                          placeholder="ABC-1234"
                          value={newTruck.plateNumber}
                          onChange={(e) => handleInputChange("plateNumber", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-type" className="text-sm font-medium">
                          Truck Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={newTruck.type} onValueChange={(value) => handleInputChange("type", value)}>
                          <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder="Select truck type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4-Wheeler">4-Wheeler</SelectItem>
                            <SelectItem value="6-Wheeler">6-Wheeler</SelectItem>
                            <SelectItem value="8-Wheeler">8-Wheeler</SelectItem>
                            <SelectItem value="10-Wheeler">10-Wheeler</SelectItem>
                            <SelectItem value="12-Wheeler">12-Wheeler</SelectItem>
                            <SelectItem value="Tanker">Tanker</SelectItem>
                            <SelectItem value="Refrigerated">Refrigerated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-model" className="text-sm font-medium">
                          Model <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="edit-model"
                          placeholder="e.g., Isuzu ELF, Mitsubishi Fuso"
                          value={newTruck.model}
                          onChange={(e) => handleInputChange("model", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-capacity" className="text-sm font-medium">
                          Capacity (tons) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="edit-capacity"
                          type="number"
                          placeholder="5"
                          value={newTruck.capacity}
                          onChange={(e) => handleInputChange("capacity", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-underloadCapacity" className="text-sm font-medium">
                          Underload Capacity (Sugar Cane Hauling) (tons) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="edit-underloadCapacity"
                          type="number"
                          placeholder="3"
                          value={newTruck.underloadCapacity}
                          onChange={(e) => handleInputChange("underloadCapacity", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Driver Assignment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Driver Assignment</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-driver" className="text-sm font-medium">
                        Assign Driver
                      </Label>
                      <Select value={newTruck.driver} onValueChange={(value) => handleInputChange("driver", value)}>
                        <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="Select driver or leave unassigned" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {drivers.map(driver => (
                            <SelectItem key={driver.id} value={driver.name}>
                              {driver.name} - {driver.licenseNumber}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Registration Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Registration Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-orExpiry" className="text-sm font-medium">
                          OR Expiry Date
                        </Label>
                        <Input
                          id="edit-orExpiry"
                          type="date"
                          value={newTruck.orExpiry}
                          onChange={(e) => handleInputChange("orExpiry", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-crExpiry" className="text-sm font-medium">
                          CR Expiry Date
                        </Label>
                        <Input
                          id="edit-crExpiry"
                          type="date"
                          value={newTruck.crExpiry}
                          onChange={(e) => handleInputChange("crExpiry", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Registration Documents */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Registration Documents</h3>
                    <p className="text-sm text-gray-600">Upload OR and CR documents for historical records</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* OR Document */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">
                          Official Receipt (OR) Document
                        </Label>
                        
                        <input
                          ref={editOrFileInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleEditOrDocumentUpload}
                          className="hidden"
                        />
                        
                        {!editOrPreviewUrl ? (
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors cursor-pointer"
                            onClick={triggerEditOrFileInput}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-center">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-orange-600" />
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Upload OR Document</p>
                                <p className="text-xs text-gray-500 mt-1">Click to browse or drag & drop</p>
                                <p className="text-xs text-gray-400">Image or PDF, max 10MB</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="relative">
                              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                {editOrDocument?.type === 'application/pdf' ? (
                                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                                    <div className="text-center">
                                      <FileText className="h-12 w-12 text-red-500 mx-auto mb-2" />
                                      <p className="text-sm font-medium text-gray-700">PDF Document</p>
                                      <p className="text-xs text-gray-500">{editOrDocument.name}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={editOrPreviewUrl}
                                    alt="OR Document"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeEditOrDocument}
                                className="absolute top-2 right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-600">
                              <p className="font-medium">{editOrDocument?.name}</p>
                              <p>{editOrDocument?.size ? (editOrDocument.size / (1024 * 1024)).toFixed(1) : '0'} MB</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CR Document */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">
                          Certificate of Registration (CR) Document
                        </Label>
                        
                        <input
                          ref={editCrFileInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleEditCrDocumentUpload}
                          className="hidden"
                        />
                        
                        {!editCrPreviewUrl ? (
                          <div 
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors cursor-pointer"
                            onClick={triggerEditCrFileInput}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-center">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-orange-600" />
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Upload CR Document</p>
                                <p className="text-xs text-gray-500 mt-1">Click to browse or drag & drop</p>
                                <p className="text-xs text-gray-400">Image or PDF, max 10MB</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="relative">
                              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                {editCrDocument?.type === 'application/pdf' ? (
                                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                                    <div className="text-center">
                                      <FileText className="h-12 w-12 text-red-500 mx-auto mb-2" />
                                      <p className="text-sm font-medium text-gray-700">PDF Document</p>
                                      <p className="text-xs text-gray-500">{editCrDocument.name}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={editCrPreviewUrl}
                                    alt="CR Document"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={removeEditCrDocument}
                                className="absolute top-2 right-2 w-6 h-6 p-0 bg-red-500 hover:bg-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-xs text-gray-600">
                              <p className="font-medium">{editCrDocument?.name}</p>
                              <p>{editCrDocument?.size ? (editCrDocument.size / (1024 * 1024)).toFixed(1) : '0'} MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Technical Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-year" className="text-sm font-medium">
                          Year
                        </Label>
                        <Input
                          id="edit-year"
                          type="number"
                          placeholder="2020"
                          value={newTruck.year}
                          onChange={(e) => handleInputChange("year", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-color" className="text-sm font-medium">
                          Color
                        </Label>
                        <Input
                          id="edit-color"
                          placeholder="White"
                          value={newTruck.color}
                          onChange={(e) => handleInputChange("color", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-engineNumber" className="text-sm font-medium">
                          Engine Number
                        </Label>
                        <Input
                          id="edit-engineNumber"
                          placeholder="Engine serial number"
                          value={newTruck.engineNumber}
                          onChange={(e) => handleInputChange("engineNumber", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-chassisNumber" className="text-sm font-medium">
                          Chassis Number
                        </Label>
                        <Input
                          id="edit-chassisNumber"
                          placeholder="Chassis serial number"
                          value={newTruck.chassisNumber}
                          onChange={(e) => handleInputChange("chassisNumber", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-fuelType" className="text-sm font-medium">
                          Fuel Type
                        </Label>
                        <Select value={newTruck.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
                          <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Gasoline">Gasoline</SelectItem>
                            <SelectItem value="LPG">LPG</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-transmission" className="text-sm font-medium">
                          Transmission
                        </Label>
                        <Select value={newTruck.transmission} onValueChange={(value) => handleInputChange("transmission", value)}>
                          <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder="Select transmission type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Truck Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Truck Images</h3>
                    
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleEditDrop}
                        onClick={triggerEditFileInput}
                      >
                        <input
                          ref={editFileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleEditImageUpload}
                          className="hidden"
                        />
                        
                        <div className="space-y-3">
                          <div className="flex justify-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                              <Camera className="h-6 w-6 text-orange-600" />
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              Upload truck images
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Drag & drop images here or click to browse
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PNG, JPG, JPEG up to 5MB each. Maximum 5 images.
                            </p>
                          </div>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              triggerEditFileInput()
                            }}
                            className="border-orange-200 text-orange-700 hover:bg-orange-50"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Images
                          </Button>
                        </div>
                      </div>

                      {/* Image Previews */}
                      {editImagePreviewUrls.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-700">
                              Uploaded Images ({editImagePreviewUrls.length}/5)
                            </h4>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditTruckImages([])
                                setEditImagePreviewUrls([])
                              }}
                              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Clear All
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {editImagePreviewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                  <img
                                    src={url}
                                    alt={`Truck image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeEditImage(index)}
                                  className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                                <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded truncate">
                                  {editTruckImages[index]?.name || `Image ${index + 1}`}
                                </div>
                                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                  {(editTruckImages[index]?.size / (1024 * 1024)).toFixed(1)}MB
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Image Summary */}
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Total size:</span>
                              <span className="font-medium">
                                {(editTruckImages.reduce((total, file) => total + file.size, 0) / (1024 * 1024)).toFixed(1)} MB
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Notes</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-notes" className="text-sm font-medium">
                        Notes
                      </Label>
                      <Textarea
                        id="edit-notes"
                        placeholder="Any additional information about the truck..."
                        value={newTruck.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditTruckModalOpen(false)
                      setEditingTruck(null)
                    }}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateTruck}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Truck
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Truck Confirmation Modal */}
            <Dialog open={isDeleteTruckModalOpen} onOpenChange={setIsDeleteTruckModalOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-5 w-5" />
                    Delete Truck
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete truck {deletingTruck?.plateNumber}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Warning</h4>
                        <p className="text-sm text-red-600 mt-1">
                          Deleting this truck will remove all associated data including bookings, maintenance records, and images.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDeleteTruckModalOpen(false)
                      setDeletingTruck(null)
                    }}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDeleteTruck}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Truck
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Underload Capacity</th>
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
                          <td className="py-3 px-4 text-gray-700">3 tons</td>
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
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleEditTruck(trucks[0])}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteTruck(trucks[0])}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
                          <td className="py-3 px-4 text-gray-700">2 tons</td>
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
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleEditTruck(trucks[1])}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteTruck(trucks[1])}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
                          <td className="py-3 px-4 text-gray-700">1 ton</td>
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
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleEditTruck(trucks[2])}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteTruck(trucks[2])}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
                                <span className="text-amber-600 font-medium">Underload:</span>
                                <p className="text-gray-700">3 tons</p>
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
                                <span className="text-amber-600 font-medium">Underload:</span>
                                <p className="text-gray-700">2 tons</p>
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
                                <span className="text-amber-600 font-medium">Underload:</span>
                                <p className="text-gray-700">1 ton</p>
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-orange-800 text-2xl font-bold">
                      Comprehensive Booking Management
                    </CardTitle>
                    <CardDescription className="text-orange-600">
                      Manage truck bookings with detailed truck information, rate calculation, and scheduling
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setIsAddBookingModalOpen(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Booking
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('/equipment/trucks/booking/calendar', '_blank')}
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
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned Truck</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Farm Location</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Destination Mill</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date & Time</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Tonnage</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Rate</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comprehensiveBookings.map((booking) => {
                        const assignedTruck = trucks.find(t => t.id === booking.assignedTruck)
                        return (
                          <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-800">{booking.id}</td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="font-medium">{booking.planterName}</div>
                              <div className="text-sm text-gray-600">{booking.contactNumber}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="font-medium">{assignedTruck?.plateNumber || 'Unassigned'}</div>
                              <div className="text-sm text-gray-600">{assignedTruck?.type || ''}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="text-sm">
                                {booking.farmAddress.sitio}, {booking.farmAddress.barangay}
                              </div>
                              <div className="text-sm text-gray-600">{booking.farmAddress.municipality}</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <Badge variant="outline" className="text-xs">
                                {booking.destinationMill}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="text-sm">{new Date(booking.date).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-600">08:00 AM</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="font-medium">{booking.tonnage} tons</div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">
                              <div className="font-medium">₱{booking.rate.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">Total: ₱{booking.totalAmount.toLocaleString()}</div>
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

        {/* Comprehensive Booking Modals */}
        
        {/* Add Booking Modal */}
        <Dialog open={isAddBookingModalOpen} onOpenChange={setIsAddBookingModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-orange-800">
                <Plus className="h-5 w-5" />
                New Booking
              </DialogTitle>
              <DialogDescription>
                Create a new truck booking with comprehensive details and rate calculation.
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
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                      className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                      <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
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
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destinationMill" className="text-sm font-medium">
                      Destination Sugar Mill <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={newBooking.destinationMill || ""} 
                      onValueChange={(value) => setNewBooking({...newBooking, destinationMill: value})}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Select destination mill" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TOLONG">TOLONG</SelectItem>
                        <SelectItem value="SONEDCO">SONEDCO</SelectItem>
                        <SelectItem value="URSUMCO">URSUMCO</SelectItem>
                        <SelectItem value="BUGAY">BUGAY</SelectItem>
                        <SelectItem value="CAB">CAB</SelectItem>
                      </SelectContent>
                    </Select>
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
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tonnage" className="text-sm font-medium">
                      Tonnage (tons) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="tonnage"
                      type="number"
                      placeholder="25"
                      value={newBooking.tonnage || ""}
                      onChange={(e) => setNewBooking({...newBooking, tonnage: parseInt(e.target.value) || 0})}
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedTruck" className="text-sm font-medium">
                      Assign Truck
                    </Label>
                    <Select 
                      value={newBooking.assignedTruck || ""} 
                      onValueChange={(value) => setNewBooking({...newBooking, assignedTruck: value})}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Select truck (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {trucks.filter(t => t.status === 'available').map((truck) => (
                          <SelectItem key={truck.id} value={truck.id}>
                            {truck.plateNumber} - {truck.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Rate Calculation Preview */}
              {newBooking.assignedTruck && newBooking.farmAddress?.municipality && newBooking.destinationMill && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Rate Calculation</h3>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(() => {
                        const selectedTruck = trucks.find(t => t.id === newBooking.assignedTruck)
                        const tonnage = newBooking.tonnage || 0
                        const rate = selectedTruck && newBooking.farmAddress?.municipality && newBooking.destinationMill ? 
                          calculateRate(selectedTruck.type, newBooking.farmAddress.municipality, newBooking.destinationMill, tonnage) : 0
                        return (
                          <>
                            <div>
                              <div className="text-sm font-medium text-orange-800">Base Rate</div>
                              <div className="text-lg font-bold text-orange-800">₱{rate.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-orange-800">Total Amount</div>
                              <div className="text-lg font-bold text-orange-800">₱{(rate * tonnage).toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-orange-800">Truck Type</div>
                              <div className="text-sm text-gray-600">{selectedTruck?.type}</div>
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
                  placeholder="Additional notes about the booking..."
                  value={newBooking.notes || ""}
                  onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
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
              <DialogTitle className="flex items-center gap-2 text-orange-800">
                <Eye className="h-5 w-5" />
                Booking Details
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
                    <Label className="text-sm font-medium text-gray-600">Destination Mill</Label>
                    <div className="text-lg font-semibold">{selectedBooking.destinationMill}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date</Label>
                    <div className="text-lg">{new Date(selectedBooking.date).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Tonnage</Label>
                    <div className="text-lg">{selectedBooking.tonnage} tons</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Rate per Ton</Label>
                    <div className="text-lg">₱{selectedBooking.rate.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Total Amount</Label>
                    <div className="text-lg font-bold text-orange-800">₱{selectedBooking.totalAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Assigned Truck</Label>
                    <div className="text-lg">{selectedBooking.assignedTruck || 'Unassigned'}</div>
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
              <DialogTitle className="flex items-center gap-2 text-orange-800">
                <Edit className="h-5 w-5" />
                Edit Booking
              </DialogTitle>
              <DialogDescription>
                Update booking details and recalculate rates if needed.
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
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                        className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                        <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
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
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Booking Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editDestinationMill" className="text-sm font-medium">
                        Destination Sugar Mill <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={selectedBooking.destinationMill || ""} 
                        onValueChange={(value) => setSelectedBooking({...selectedBooking, destinationMill: value})}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="Select destination mill" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TOLONG">TOLONG</SelectItem>
                          <SelectItem value="SONEDCO">SONEDCO</SelectItem>
                          <SelectItem value="URSUMCO">URSUMCO</SelectItem>
                          <SelectItem value="BUGAY">BUGAY</SelectItem>
                          <SelectItem value="CAB">CAB</SelectItem>
                        </SelectContent>
                      </Select>
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
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editTonnage" className="text-sm font-medium">
                        Tonnage (tons) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="editTonnage"
                        type="number"
                        placeholder="25"
                        value={selectedBooking.tonnage || ""}
                        onChange={(e) => setSelectedBooking({...selectedBooking, tonnage: parseInt(e.target.value) || 0})}
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editAssignedTruck" className="text-sm font-medium">
                        Assign Truck
                      </Label>
                      <Select 
                        value={selectedBooking.assignedTruck || ""} 
                        onValueChange={(value) => setSelectedBooking({...selectedBooking, assignedTruck: value})}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                          <SelectValue placeholder="Select truck (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {trucks.map((truck) => (
                            <SelectItem key={truck.id} value={truck.id}>
                              {truck.plateNumber} - {truck.type}
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
                        <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
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
                {selectedBooking.assignedTruck && selectedBooking.farmAddress?.municipality && selectedBooking.destinationMill && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Rate Calculation</h3>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(() => {
                          const selectedTruck = trucks.find(t => t.id === selectedBooking.assignedTruck)
                          const tonnage = selectedBooking.tonnage || 0
                          const rate = selectedTruck && selectedBooking.farmAddress?.municipality && selectedBooking.destinationMill ? 
                            calculateRate(selectedTruck.type, selectedBooking.farmAddress.municipality, selectedBooking.destinationMill, tonnage) : 0
                          return (
                            <>
                              <div>
                                <div className="text-sm font-medium text-orange-800">Base Rate</div>
                                <div className="text-lg font-bold text-orange-800">₱{rate.toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-orange-800">Total Amount</div>
                                <div className="text-lg font-bold text-orange-800">₱{(rate * tonnage).toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-orange-800">Truck Type</div>
                                <div className="text-sm text-gray-600">{selectedTruck?.type}</div>
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
                    placeholder="Additional notes about the booking..."
                    value={selectedBooking.notes || ""}
                    onChange={(e) => setSelectedBooking({...selectedBooking, notes: e.target.value})}
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                className="bg-orange-600 hover:bg-orange-700"
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
                Delete Booking
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="font-medium text-red-800">Booking ID: {selectedBooking.id}</div>
                  <div className="text-red-600">Planter: {selectedBooking.planterName}</div>
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
              <DialogTitle className="flex items-center gap-2 text-orange-800">
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
                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
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
                          <div className="text-sm font-medium text-orange-600">
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
  )
} 
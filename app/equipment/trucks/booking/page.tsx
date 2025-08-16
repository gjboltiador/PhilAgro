"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/sidebar-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Truck, 
  Calendar,
  MapPin,
  DollarSign,
  Plus,
  Search,
  Filter,
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
  Save,
  X,
  Camera,
  Image as ImageIcon,
  FileText,
  Calculator,
  Route
} from "lucide-react"
import TruckDetailsModal from "@/components/truck-details-modal"
import { ProtectedRoute } from "@/components/protected-route"
import RateCalculator from "@/components/rate-calculator"

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
}

interface BookingData {
  id: string
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
  locationRates: {
    [municipality: string]: number
  }
  destinationRates: {
    [mill: string]: number
  }
}

export default function TruckBookingManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false)
  const [isViewBookingModalOpen, setIsViewBookingModalOpen] = useState(false)
  const [isTruckDetailsModalOpen, setIsTruckDetailsModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [selectedTruck, setSelectedTruck] = useState<TruckData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Booking form state
  const [newBooking, setNewBooking] = useState({
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
    tonnage: "",
    assignedTruck: "",
    notes: ""
  })

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
        {
          date: "2024-01-15",
          type: "Oil Change",
          description: "Regular oil change and filter replacement",
          cost: 2500
        },
        {
          date: "2023-12-20",
          type: "Brake Service",
          description: "Brake pad replacement and brake fluid check",
          cost: 8000
        },
        {
          date: "2023-11-10",
          type: "Tire Replacement",
          description: "Replaced all 6 tires with new ones",
          cost: 45000
        }
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
      status: "available",
      orExpiry: "Nov 30, 2024",
      crExpiry: "Jan 15, 2025",
      year: "2019",
      color: "Blue",
      engineNumber: "ENG-2019-002",
      chassisNumber: "CHS-2019-002",
      fuelType: "Diesel",
      transmission: "Manual",
      images: ["/placeholder.jpg", "/placeholder.jpg"],
      notes: "Reliable truck for short hauls. Good fuel efficiency and easy to maneuver.",
      maintenanceHistory: [
        {
          date: "2024-01-10",
          type: "General Service",
          description: "Complete vehicle inspection and minor repairs",
          cost: 3500
        },
        {
          date: "2023-12-05",
          type: "Battery Replacement",
          description: "Replaced old battery with new one",
          cost: 12000
        }
      ],
      performanceStats: {
        totalTrips: 89,
        totalDistance: 28000,
        averageFuelConsumption: 10.2,
        lastMaintenance: "2024-01-10"
      }
    },
    {
      id: "TRK-003",
      plateNumber: "GHI-9012",
      type: "4-Wheeler",
      model: "Toyota Dyna",
      capacity: 2,
      underloadCapacity: 1.5,
      driver: "Maria Lopez",
      status: "available",
      orExpiry: "Oct 10, 2024",
      crExpiry: "Feb 28, 2025",
      year: "2021",
      color: "Red",
      engineNumber: "ENG-2021-003",
      chassisNumber: "CHS-2021-003",
      fuelType: "Diesel",
      transmission: "Manual",
      images: ["/placeholder.jpg"],
      notes: "Compact truck perfect for narrow farm roads and small loads.",
      maintenanceHistory: [
        {
          date: "2024-01-05",
          type: "Oil Change",
          description: "Regular maintenance service",
          cost: 1800
        }
      ],
      performanceStats: {
        totalTrips: 67,
        totalDistance: 15000,
        averageFuelConsumption: 12.5,
        lastMaintenance: "2024-01-05"
      }
    }
  ]

  const bookings: BookingData[] = [
    {
      id: "BK001",
      planterName: "Juan Dela Cruz",
      contactNumber: "+63 912 345 6789",
      farmAddress: {
        sitio: "Purok 1",
        barangay: "San Jose",
        municipality: "Kabankalan",
        province: "Negros Occidental"
      },
      destinationMill: "TOLONG",
      date: "2024-01-20",
      tonnage: 25,
      status: "approved",
      assignedTruck: "TRK-001",
      assignedDriver: "Juan Santos",
      rate: 2500,
      totalAmount: 62500,
      notes: "Sugarcane harvest ready for transport"
    },
    {
      id: "BK002",
      planterName: "Maria Santos",
      contactNumber: "+63 923 456 7890",
      farmAddress: {
        sitio: "Purok 3",
        barangay: "Binalbagan",
        municipality: "Binalbagan",
        province: "Negros Occidental"
      },
      destinationMill: "SONEDCO",
      date: "2024-01-21",
      tonnage: 30,
      status: "in-progress",
      assignedTruck: "TRK-002",
      assignedDriver: "Pedro Cruz",
      rate: 2800,
      totalAmount: 84000,
      notes: "Urgent delivery required"
    }
  ]

  const truckRates: TruckRate[] = [
    {
      truckType: "4-Wheeler",
      baseRate: 1500,
      locationRates: {
        "Kabankalan": 200,
        "Binalbagan": 300,
        "Himamaylan": 250,
        "Sipalay": 400
      },
      destinationRates: {
        "TOLONG": 500,
        "SONEDCO": 600,
        "URSUMCO": 700,
        "BUGAY": 450,
        "CAB": 550
      }
    },
    {
      truckType: "6-Wheeler",
      baseRate: 2000,
      locationRates: {
        "Kabankalan": 250,
        "Binalbagan": 350,
        "Himamaylan": 300,
        "Sipalay": 450
      },
      destinationRates: {
        "TOLONG": 600,
        "SONEDCO": 700,
        "URSUMCO": 800,
        "BUGAY": 550,
        "CAB": 650
      }
    },
    {
      truckType: "10-Wheeler",
      baseRate: 2500,
      locationRates: {
        "Kabankalan": 300,
        "Binalbagan": 400,
        "Himamaylan": 350,
        "Sipalay": 500
      },
      destinationRates: {
        "TOLONG": 700,
        "SONEDCO": 800,
        "URSUMCO": 900,
        "BUGAY": 650,
        "CAB": 750
      }
    }
  ]

  const municipalities = ["Kabankalan", "Binalbagan", "Himamaylan", "Sipalay", "Cauayan", "Ilog"]
  const sugarMills = ["TOLONG", "SONEDCO", "URSUMCO", "BUGAY", "CAB", "VICTORIAS", "SAN CARLOS"]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calculateRate = (truckType: string, municipality: string, destination: string) => {
    const rate = truckRates.find(r => r.truckType === truckType)
    if (!rate) return 0

    const baseRate = rate.baseRate
    const locationRate = rate.locationRates[municipality] || 0
    const destinationRate = rate.destinationRates[destination] || 0

    return baseRate + locationRate + destinationRate
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setNewBooking(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setNewBooking(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleAddBooking = async () => {
    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!newBooking.planterName || !newBooking.contactNumber || !newBooking.destinationMill || !newBooking.date || !newBooking.tonnage || !newBooking.assignedTruck) {
        alert("Please fill in all required fields")
        return
      }

      const selectedTruck = trucks.find(t => t.id === newBooking.assignedTruck)
      if (!selectedTruck) {
        alert("Please select a valid truck")
        return
      }

      const rate = calculateRate(selectedTruck.type, newBooking.farmAddress.municipality, newBooking.destinationMill)
      const totalAmount = rate * parseInt(newBooking.tonnage)

      const bookingToAdd: BookingData = {
        id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
        planterName: newBooking.planterName,
        contactNumber: newBooking.contactNumber,
        farmAddress: newBooking.farmAddress,
        destinationMill: newBooking.destinationMill,
        date: newBooking.date,
        tonnage: parseInt(newBooking.tonnage),
        status: "pending",
        assignedTruck: newBooking.assignedTruck,
        assignedDriver: selectedTruck.driver,
        rate: rate,
        totalAmount: totalAmount,
        notes: newBooking.notes
      }

      console.log("Adding new booking:", bookingToAdd)
      
      // Reset form
      setNewBooking({
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
        tonnage: "",
        assignedTruck: "",
        notes: ""
      })
      
      setIsAddBookingModalOpen(false)
      alert("Booking added successfully!")
      
    } catch (error) {
      console.error("Error adding booking:", error)
      alert("Error adding booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewBooking = (booking: BookingData) => {
    setSelectedBooking(booking)
    setIsViewBookingModalOpen(true)
  }

  const handleViewTruckDetails = (truck: TruckData) => {
    setSelectedTruck(truck)
    setIsTruckDetailsModalOpen(true)
  }

  const handleSelectTruck = (truck: TruckData) => {
    setNewBooking(prev => ({
      ...prev,
      assignedTruck: truck.id
    }))
    setIsTruckDetailsModalOpen(false)
  }

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === "pending").length,
    approvedBookings: bookings.filter(b => b.status === "approved").length,
    inProgressBookings: bookings.filter(b => b.status === "in-progress").length,
    completedBookings: bookings.filter(b => b.status === "completed").length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0)
  }

  return (
    <ProtectedRoute requiredPermission="equipment_operation">
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-orange-800">Truck Booking Management</h1>
            <p className="text-sm sm:text-base text-orange-600">Manage truck bookings and scheduling for sugarcane hauling</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-orange-200 text-gray-700 hover:bg-orange-50 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View Calendar</span>
              <span className="sm:hidden">Calendar</span>
            </Button>
            
            {/* Add Booking Button */}
            <Dialog open={isAddBookingModalOpen} onOpenChange={setIsAddBookingModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm"
                  onClick={() => setIsAddBookingModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">New Booking</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-orange-800">
                    <Calendar className="h-5 w-5" />
                    New Truck Booking
                  </DialogTitle>
                  <DialogDescription>
                    Create a new booking for sugarcane hauling service.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Planter Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Planter Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="planterName" className="text-sm font-medium">
                          Planter Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="planterName"
                          placeholder="Juan Dela Cruz"
                          value={newBooking.planterName}
                          onChange={(e) => handleInputChange("planterName", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber" className="text-sm font-medium">
                          Contact Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="contactNumber"
                          placeholder="+63 912 345 6789"
                          value={newBooking.contactNumber}
                          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Farm Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Farm Address</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sitio" className="text-sm font-medium">
                          Sitio/Purok
                        </Label>
                        <Input
                          id="sitio"
                          placeholder="Purok 1"
                          value={newBooking.farmAddress.sitio}
                          onChange={(e) => handleInputChange("farmAddress.sitio", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="barangay" className="text-sm font-medium">
                          Barangay
                        </Label>
                        <Input
                          id="barangay"
                          placeholder="San Jose"
                          value={newBooking.farmAddress.barangay}
                          onChange={(e) => handleInputChange("farmAddress.barangay", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="municipality" className="text-sm font-medium">
                          Municipality <span className="text-red-500">*</span>
                        </Label>
                        <Select value={newBooking.farmAddress.municipality} onValueChange={(value) => handleInputChange("farmAddress.municipality", value)}>
                          <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder="Select municipality" />
                          </SelectTrigger>
                          <SelectContent>
                            {municipalities.map(municipality => (
                              <SelectItem key={municipality} value={municipality}>
                                {municipality}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="province" className="text-sm font-medium">
                          Province
                        </Label>
                        <Input
                          id="province"
                          placeholder="Negros Occidental"
                          value={newBooking.farmAddress.province}
                          onChange={(e) => handleInputChange("farmAddress.province", e.target.value)}
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
                        <Select value={newBooking.destinationMill} onValueChange={(value) => handleInputChange("destinationMill", value)}>
                          <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder="Select sugar mill" />
                          </SelectTrigger>
                          <SelectContent>
                            {sugarMills.map(mill => (
                              <SelectItem key={mill} value={mill}>
                                {mill}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm font-medium">
                          Booking Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={newBooking.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
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
                          value={newBooking.tonnage}
                          onChange={(e) => handleInputChange("tonnage", e.target.value)}
                          className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      
                                             <div className="space-y-2">
                         <Label htmlFor="assignedTruck" className="text-sm font-medium">
                           Assign Truck <span className="text-red-500">*</span>
                         </Label>
                         <div className="space-y-2">
                           <Select value={newBooking.assignedTruck} onValueChange={(value) => handleInputChange("assignedTruck", value)}>
                             <SelectTrigger className="border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                               <SelectValue placeholder="Select truck" />
                             </SelectTrigger>
                             <SelectContent>
                               {trucks.filter(t => t.status === "available").map(truck => (
                                 <SelectItem key={truck.id} value={truck.id}>
                                   {truck.plateNumber} - {truck.type} ({truck.underloadCapacity} tons underload)
                                 </SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                           {newBooking.assignedTruck && (
                             <div className="flex items-center gap-2">
                               <Button
                                 type="button"
                                 variant="outline"
                                 size="sm"
                                 onClick={() => {
                                   const truck = trucks.find(t => t.id === newBooking.assignedTruck)
                                   if (truck) handleViewTruckDetails(truck)
                                 }}
                                 className="text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300"
                               >
                                 <Eye className="h-3 w-3 mr-1" />
                                 View Truck Details
                               </Button>
                             </div>
                           )}
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* Rate Calculation Preview */}
                  {newBooking.assignedTruck && newBooking.farmAddress.municipality && newBooking.destinationMill && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Rate Calculation</h3>
                      
                      {(() => {
                        const selectedTruck = trucks.find(t => t.id === newBooking.assignedTruck)
                        const tonnage = parseInt(newBooking.tonnage) || 0
                        
                        return selectedTruck ? (
                          <RateCalculator
                            truckType={selectedTruck.type}
                            municipality={newBooking.farmAddress.municipality}
                            destination={newBooking.destinationMill}
                            tonnage={tonnage}
                            rates={truckRates}
                            showBreakdown={true}
                          />
                        ) : null
                      })()}
                    </div>
                  )}

                  {/* Additional Notes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Notes</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information about the booking..."
                        value={newBooking.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddBookingModalOpen(false)}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddBooking}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Booking
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
              <CardTitle className="text-xs sm:text-sm font-medium text-orange-800">Total Bookings</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-200">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-orange-800">{stats.totalBookings}</div>
              <p className="text-xs text-orange-600">
                {stats.pendingBookings} pending, {stats.approvedBookings} approved
              </p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-orange-800">In Progress</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-200">
                <Route className="h-4 w-4 sm:h-5 sm:w-5 text-orange-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-orange-800">{stats.inProgressBookings}</div>
              <p className="text-xs text-orange-600">
                Active deliveries
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Completed</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-200">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-800">{stats.completedBookings}</div>
              <p className="text-xs text-green-600">Successful deliveries</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-800">Total Revenue</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-200">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-blue-800">₱{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-blue-600">From all bookings</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card className="border-amber-200 rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-orange-800 text-xl sm:text-2xl font-bold">
              Booking Management
            </CardTitle>
            <CardDescription className="text-orange-600 text-sm sm:text-base">
              Manage truck bookings and scheduling for sugarcane hauling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Input
                    placeholder="Search bookings..."
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
                    <th className="text-left py-3 px-4 font-medium text-orange-800">Booking ID</th>
                    <th className="text-left py-3 px-4 font-medium text-orange-800">Planter</th>
                    <th className="text-left py-3 px-4 font-medium text-orange-800">Farm Location</th>
                    <th className="text-left py-3 px-4 font-medium text-orange-800">Destination</th>
                    <th className="text-left py-3 px-4 font-medium text-orange-800">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-orange-800">Tonnage</th>
                    <th className="text-left py-3 px-4 font-medium text-orange-800">Truck</th>
                    <th className="text-left py-3 px-4 font-medium text-orange-800">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-orange-800">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-orange-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-orange-50/50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{booking.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        <div>
                          <div className="font-medium">{booking.planterName}</div>
                          <div className="text-xs text-gray-500">{booking.contactNumber}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        <div>
                          <div className="font-medium">{booking.farmAddress.municipality}</div>
                          <div className="text-xs text-gray-500">{booking.farmAddress.barangay}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{booking.destinationMill}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{booking.tonnage} tons</td>
                                             <td className="py-3 px-4 text-sm text-gray-700">
                         <div>
                           <div className="font-medium">{trucks.find(t => t.id === booking.assignedTruck)?.plateNumber}</div>
                           <div className="text-xs text-gray-500">{trucks.find(t => t.id === booking.assignedTruck)?.type}</div>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => {
                               const truck = trucks.find(t => t.id === booking.assignedTruck)
                               if (truck) handleViewTruckDetails(truck)
                             }}
                             className="mt-1 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                           >
                             <Eye className="h-3 w-3 mr-1" />
                             View Details
                           </Button>
                         </div>
                       </td>
                      <td className="py-3 px-4 text-sm text-gray-700">₱{booking.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm">{getStatusBadge(booking.status)}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewBooking(booking)}
                            className="border-orange-200 text-orange-700 hover:bg-orange-50"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* View Booking Modal */}
        <Dialog open={isViewBookingModalOpen} onOpenChange={setIsViewBookingModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-orange-800">
                <Eye className="h-5 w-5" />
                Booking Details
              </DialogTitle>
              <DialogDescription>
                View detailed information about booking {selectedBooking?.id}.
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Planter Information</h3>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Name:</span> {selectedBooking.planterName}</p>
                      <p className="text-sm"><span className="font-medium">Contact:</span> {selectedBooking.contactNumber}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Farm Address</h3>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Sitio:</span> {selectedBooking.farmAddress.sitio}</p>
                      <p className="text-sm"><span className="font-medium">Barangay:</span> {selectedBooking.farmAddress.barangay}</p>
                      <p className="text-sm"><span className="font-medium">Municipality:</span> {selectedBooking.farmAddress.municipality}</p>
                      <p className="text-sm"><span className="font-medium">Province:</span> {selectedBooking.farmAddress.province}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Booking Details</h3>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Destination:</span> {selectedBooking.destinationMill}</p>
                      <p className="text-sm"><span className="font-medium">Date:</span> {new Date(selectedBooking.date).toLocaleDateString()}</p>
                      <p className="text-sm"><span className="font-medium">Tonnage:</span> {selectedBooking.tonnage} tons</p>
                      <p className="text-sm"><span className="font-medium">Rate per ton:</span> ₱{selectedBooking.rate}</p>
                      <p className="text-sm"><span className="font-medium">Total Amount:</span> ₱{selectedBooking.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Assigned Resources</h3>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Truck:</span> {trucks.find(t => t.id === selectedBooking.assignedTruck)?.plateNumber}</p>
                      <p className="text-sm"><span className="font-medium">Truck Type:</span> {trucks.find(t => t.id === selectedBooking.assignedTruck)?.type}</p>
                      <p className="text-sm"><span className="font-medium">Driver:</span> {selectedBooking.assignedDriver}</p>
                      <p className="text-sm"><span className="font-medium">Status:</span> {getStatusBadge(selectedBooking.status)}</p>
                    </div>
                  </div>
                </div>
                
                {selectedBooking.notes && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Notes</h3>
                    <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewBookingModalOpen(false)}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
                 </Dialog>

         {/* Truck Details Modal */}
         <TruckDetailsModal
           truck={selectedTruck}
           isOpen={isTruckDetailsModalOpen}
           onClose={() => setIsTruckDetailsModalOpen(false)}
           onSelect={handleSelectTruck}
           showSelectButton={isAddBookingModalOpen}
         />
       </div>
     </DashboardLayout>
     </ProtectedRoute>
   )
 }

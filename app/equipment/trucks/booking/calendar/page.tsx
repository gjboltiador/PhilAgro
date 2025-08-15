"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/sidebar-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Calendar as CalendarIcon,
  Truck,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Filter,
  Download
} from "lucide-react"

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

interface TruckData {
  id: string
  plateNumber: string
  type: string
  model: string
  capacity: number
  underloadCapacity: number
  driver: string
  status: "available" | "on-route" | "maintenance"
}

export default function BookingCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTruck, setSelectedTruck] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isViewBookingModalOpen, setIsViewBookingModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)

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
      status: "available"
    },
    {
      id: "TRK-002",
      plateNumber: "DEF-5678",
      type: "6-Wheeler",
      model: "Mitsubishi Fuso Canter",
      capacity: 3,
      underloadCapacity: 2,
      driver: "Pedro Cruz",
      status: "on-route"
    },
    {
      id: "TRK-003",
      plateNumber: "GHI-9012",
      type: "4-Wheeler",
      model: "Toyota Dyna",
      capacity: 2,
      underloadCapacity: 1.5,
      driver: "Maria Lopez",
      status: "available"
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
    },
    {
      id: "BK003",
      planterName: "Pedro Reyes",
      contactNumber: "+63 934 567 8901",
      farmAddress: {
        sitio: "Purok 2",
        barangay: "Himamaylan",
        municipality: "Himamaylan",
        province: "Negros Occidental"
      },
      destinationMill: "URSUMCO",
      date: "2024-01-22",
      tonnage: 20,
      status: "pending",
      assignedTruck: "TRK-003",
      assignedDriver: "Maria Lopez",
      rate: 2200,
      totalAmount: 44000,
      notes: "Small farm harvest"
    }
  ]

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

  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0]
      const matchesDate = bookingDate === dateString
      const matchesTruck = selectedTruck === "all" || booking.assignedTruck === selectedTruck
      const matchesStatus = selectedStatus === "all" || booking.status === selectedStatus
      return matchesDate && matchesTruck && matchesStatus
    })
  }

  const getBookingsForMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date)
      return bookingDate.getFullYear() === year && bookingDate.getMonth() === month
    })
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleViewBooking = (booking: BookingData) => {
    setSelectedBooking(booking)
    setIsViewBookingModalOpen(true)
  }

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === "pending").length,
    approvedBookings: bookings.filter(b => b.status === "approved").length,
    inProgressBookings: bookings.filter(b => b.status === "in-progress").length,
    completedBookings: bookings.filter(b => b.status === "completed").length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalAmount, 0)
  }

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : []
  const monthBookings = date ? getBookingsForMonth(date) : []

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-orange-800">Booking Calendar</h1>
            <p className="text-sm sm:text-base text-orange-600">View and manage truck bookings in calendar format</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-orange-200 text-gray-700 hover:bg-orange-50 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Booking</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <Card className="bg-amber-50 border-amber-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-orange-800">Total Bookings</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-200">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-700" />
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
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-700" />
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
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
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
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-blue-800">₱{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-blue-600">From all bookings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Calendar */}
          <Card className="col-span-3 md:col-span-1 border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-lg min-h-[600px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-orange-800">Calendar</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 border-orange-300 hover:bg-orange-100 bg-transparent"
                    onClick={() => {
                      const newDate = new Date(date || new Date())
                      newDate.setMonth(newDate.getMonth() - 1)
                      setDate(newDate)
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 border-orange-300 hover:bg-orange-100 bg-transparent"
                    onClick={() => {
                      const newDate = new Date(date || new Date())
                      newDate.setMonth(newDate.getMonth() + 1)
                      setDate(newDate)
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="text-orange-600">Select a date to view bookings</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="w-full h-full flex-1 flex flex-col p-4">
                <div className="w-full h-full flex-1 bg-white rounded-lg border border-orange-200 overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="w-full h-full flex-1"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full h-full",
                      month: "space-y-4 w-full h-full flex-1",
                      caption: "flex justify-center pt-1 relative items-center w-full",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1 flex-1",
                      head_row: "flex w-full",
                      head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] text-center",
                      row: "flex w-full mt-2 flex-1",
                      cell: "h-12 w-full text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent hover:text-accent-foreground",
                      day_selected: "bg-orange-500 text-white hover:bg-orange-600 hover:text-white focus:bg-orange-500 focus:text-white",
                      day_today: "bg-orange-100 text-orange-800",
                      day_outside: "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                    modifiers={{
                      booked: monthBookings.map((booking) => new Date(booking.date)),
                    }}
                    modifiersStyles={{
                      booked: {
                        fontWeight: "bold",
                        backgroundColor: "hsl(var(--orange-100))",
                        color: "hsl(var(--orange-700))",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="mt-auto p-4 border-t border-orange-200 bg-orange-50 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-orange-700">Filter:</span>
                    <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                      <SelectTrigger className="w-[160px] border-orange-300 bg-white rounded-md">
                        <SelectValue placeholder="Truck" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Trucks</SelectItem>
                        {trucks.map(truck => (
                          <SelectItem key={truck.id} value={truck.id}>
                            {truck.plateNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-300 border border-orange-400"></div>
                      <span className="text-xs font-medium text-orange-700">Has Bookings</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Schedule */}
          <Card className="col-span-3 md:col-span-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-orange-800">
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
              <CardDescription className="text-orange-600">
                Truck bookings for the selected date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateBookings.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col rounded-lg border border-orange-200 p-4 sm:flex-row sm:items-center bg-gradient-to-r from-white to-orange-50"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-orange-800">{booking.planterName}</h4>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="text-sm text-orange-600">{booking.farmAddress.municipality} → {booking.destinationMill}</p>
                        <p className="text-sm text-orange-700">Truck: {trucks.find(t => t.id === booking.assignedTruck)?.plateNumber} • {booking.tonnage} tons</p>
                        <p className="text-sm text-orange-600">Amount: ₱{booking.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="mt-4 flex justify-end gap-2 sm:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewBooking(booking)}
                          className="border-orange-300 hover:bg-orange-100 bg-transparent"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-orange-300">
                  <CalendarIcon className="h-8 w-8 text-orange-400 mb-2" />
                  <p className="text-sm text-muted-foreground">No bookings for this date</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-orange-300 hover:bg-orange-100 bg-transparent"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Booking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

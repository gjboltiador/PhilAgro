"use client"

import { useState } from "react"
import { 
  Truck, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  X,
  Save,
  Camera,
  Settings,
  Gauge,
  Weight,
  Calendar,
  FileText,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

interface TruckSpecs {
  id: string
  plateNumber: string
  truckType: "10-wheeler-long-bed" | "10-wheeler-dump" | "6-wheeler" | "4-wheeler"
  brand: string
  model: string
  year: number
  engine: {
    type: string
    displacement: string
    horsepower: number
    fuelType: "diesel" | "gasoline"
  }
  capacity: {
    tonnage: number
    volume: number
    unit: "tons" | "cubic-meters"
  }
  dimensions: {
    length: number
    width: number
    height: number
    unit: "meters"
  }
  tires: {
    front: string
    rear: string
    spare: string
  }
  registration: {
    orNumber: string
    orExpiry: string
    crNumber: string
    crExpiry: string
    insuranceExpiry: string
  }
  maintenance: {
    lastService: string
    nextService: string
    mileage: number
    status: "good" | "needs-service" | "maintenance"
  }
  images: string[]
  status: "available" | "on-route" | "maintenance" | "retired"
  driver?: string
  notes?: string
}

const mockTrucks: TruckSpecs[] = [
  {
    id: "TRK-001",
    plateNumber: "ABC-1234",
    truckType: "10-wheeler-long-bed",
    brand: "Isuzu",
    model: "ELF",
    year: 2022,
    engine: {
      type: "4HK1-TCS",
      displacement: "5.2L",
      horsepower: 190,
      fuelType: "diesel"
    },
    capacity: {
      tonnage: 10,
      volume: 25,
      unit: "tons"
    },
    dimensions: {
      length: 12.5,
      width: 2.5,
      height: 3.2,
      unit: "meters"
    },
    tires: {
      front: "295/80R22.5",
      rear: "295/80R22.5",
      spare: "295/80R22.5"
    },
    registration: {
      orNumber: "OR-2024-001234",
      orExpiry: "2024-12-15",
      crNumber: "CR-2024-001234",
      crExpiry: "2025-03-20",
      insuranceExpiry: "2024-11-30"
    },
    maintenance: {
      lastService: "2024-01-15",
      nextService: "2024-04-15",
      mileage: 45000,
      status: "good"
    },
    images: ["/truck1-front.jpg", "/truck1-side.jpg", "/truck1-rear.jpg"],
    status: "available",
    driver: "Juan Santos",
    notes: "Excellent condition, recently serviced"
  },
  {
    id: "TRK-002",
    plateNumber: "DEF-5678",
    truckType: "6-wheeler",
    brand: "Mitsubishi",
    model: "Fuso Canter",
    year: 2021,
    engine: {
      type: "4P10-T5",
      displacement: "3.0L",
      horsepower: 150,
      fuelType: "diesel"
    },
    capacity: {
      tonnage: 6,
      volume: 15,
      unit: "tons"
    },
    dimensions: {
      length: 8.5,
      width: 2.3,
      height: 2.8,
      unit: "meters"
    },
    tires: {
      front: "215/75R17.5",
      rear: "215/75R17.5",
      spare: "215/75R17.5"
    },
    registration: {
      orNumber: "OR-2024-005678",
      orExpiry: "2024-11-30",
      crNumber: "CR-2024-005678",
      crExpiry: "2025-01-15",
      insuranceExpiry: "2024-10-31"
    },
    maintenance: {
      lastService: "2024-01-10",
      nextService: "2024-04-10",
      mileage: 38000,
      status: "needs-service"
    },
    images: ["/truck2-front.jpg", "/truck2-side.jpg"],
    status: "on-route",
    driver: "Pedro Cruz",
    notes: "Needs brake inspection"
  }
]

export function TruckManagement() {
  const [trucks, setTrucks] = useState<TruckSpecs[]>(mockTrucks)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTruck, setSelectedTruck] = useState<TruckSpecs | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const getTruckTypeLabel = (type: string) => {
    switch (type) {
      case "10-wheeler-long-bed": return "10 Wheeler - Long Bed"
      case "10-wheeler-dump": return "10 Wheeler - Dump Truck"
      case "6-wheeler": return "6 Wheeler"
      case "4-wheeler": return "4 Wheeler"
      default: return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "on-route":
        return <Badge className="bg-orange-100 text-orange-800">On Route</Badge>
      case "maintenance":
        return <Badge className="bg-red-100 text-red-800">Maintenance</Badge>
      case "retired":
        return <Badge className="bg-gray-100 text-gray-800">Retired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleAddTruck = (truckData: TruckSpecs) => {
    setTrucks([...trucks, truckData])
    setIsAddDialogOpen(false)
  }

  const handleEditTruck = (truckData: TruckSpecs) => {
    setTrucks(trucks.map(truck => truck.id === truckData.id ? truckData : truck))
    setIsEditDialogOpen(false)
    setSelectedTruck(null)
  }

  const handleDeleteTruck = (truckId: string) => {
    setTrucks(trucks.filter(truck => truck.id !== truckId))
  }

  const filteredTrucks = trucks.filter(truck =>
    truck.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    truck.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    truck.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    truck.driver?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-800">Truck Fleet Management</h2>
          <p className="text-orange-600">Manage truck details, specifications, and maintenance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Truck
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Truck</DialogTitle>
              <DialogDescription>
                Enter detailed truck specifications and information
              </DialogDescription>
            </DialogHeader>
            <TruckForm 
              onSubmit={handleAddTruck}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search trucks by plate number, brand, model, or driver..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="on-route">On Route</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Trucks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrucks.map((truck) => (
          <Card key={truck.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{truck.plateNumber}</CardTitle>
                  <CardDescription>
                    {truck.brand} {truck.model} ({truck.year})
                  </CardDescription>
                </div>
                {getStatusBadge(truck.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Truck Image Placeholder */}
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Truck Image</p>
                </div>
              </div>

              {/* Key Specifications */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-gray-500">Type</Label>
                  <p className="font-medium">{getTruckTypeLabel(truck.truckType)}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Capacity</Label>
                  <p className="font-medium">{truck.capacity.tonnage} tons</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Engine</Label>
                  <p className="font-medium">{truck.engine.type}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Driver</Label>
                  <p className="font-medium">{truck.driver || "Unassigned"}</p>
                </div>
              </div>

              {/* Maintenance Status */}
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {truck.maintenance.status === "good" ? "Good Condition" : 
                   truck.maintenance.status === "needs-service" ? "Needs Service" : 
                   "Under Maintenance"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Dialog open={isEditDialogOpen && selectedTruck?.id === truck.id} onOpenChange={(open) => {
                  setIsEditDialogOpen(open)
                  if (!open) setSelectedTruck(null)
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedTruck(truck)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Truck - {truck.plateNumber}</DialogTitle>
                      <DialogDescription>
                        Update truck specifications and information
                      </DialogDescription>
                    </DialogHeader>
                    <TruckForm 
                      truck={truck}
                      onSubmit={handleEditTruck}
                      onCancel={() => {
                        setIsEditDialogOpen(false)
                        setSelectedTruck(null)
                      }}
                    />
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Truck</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete truck {truck.plateNumber}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteTruck(truck.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface TruckFormProps {
  truck?: TruckSpecs
  onSubmit: (truck: TruckSpecs) => void
  onCancel: () => void
}

function TruckForm({ truck, onSubmit, onCancel }: TruckFormProps) {
  const [formData, setFormData] = useState<TruckSpecs>(truck || {
    id: "",
    plateNumber: "",
    truckType: "6-wheeler",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    engine: {
      type: "",
      displacement: "",
      horsepower: 0,
      fuelType: "diesel"
    },
    capacity: {
      tonnage: 0,
      volume: 0,
      unit: "tons"
    },
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: "meters"
    },
    tires: {
      front: "",
      rear: "",
      spare: ""
    },
    registration: {
      orNumber: "",
      orExpiry: "",
      crNumber: "",
      crExpiry: "",
      insuranceExpiry: ""
    },
    maintenance: {
      lastService: "",
      nextService: "",
      mileage: 0,
      status: "good"
    },
    images: [],
    status: "available",
    driver: "",
    notes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!truck) {
      // Generate new ID for new truck
      formData.id = `TRK-${Date.now()}`
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plateNumber">Plate Number</Label>
              <Input
                id="plateNumber"
                value={formData.plateNumber}
                onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="truckType">Truck Type</Label>
              <Select value={formData.truckType} onValueChange={(value: any) => setFormData({...formData, truckType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10-wheeler-long-bed">10 Wheeler - Long Bed</SelectItem>
                  <SelectItem value="10-wheeler-dump">10 Wheeler - Dump Truck</SelectItem>
                  <SelectItem value="6-wheeler">6 Wheeler</SelectItem>
                  <SelectItem value="4-wheeler">4 Wheeler</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="driver">Assigned Driver</Label>
            <Input
              id="driver"
              value={formData.driver}
              onChange={(e) => setFormData({...formData, driver: e.target.value})}
            />
          </div>
        </div>

        {/* Engine Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Engine Specifications</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="engineType">Engine Type</Label>
              <Input
                id="engineType"
                value={formData.engine.type}
                onChange={(e) => setFormData({
                  ...formData, 
                  engine: {...formData.engine, type: e.target.value}
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="displacement">Displacement</Label>
              <Input
                id="displacement"
                value={formData.engine.displacement}
                onChange={(e) => setFormData({
                  ...formData, 
                  engine: {...formData.engine, displacement: e.target.value}
                })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="horsepower">Horsepower</Label>
              <Input
                id="horsepower"
                type="number"
                value={formData.engine.horsepower}
                onChange={(e) => setFormData({
                  ...formData, 
                  engine: {...formData.engine, horsepower: parseInt(e.target.value)}
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={formData.engine.fuelType} onValueChange={(value: any) => setFormData({
                ...formData, 
                engine: {...formData.engine, fuelType: value}
              })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capacity & Dimensions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Capacity & Dimensions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tonnage">Tonnage Capacity</Label>
              <Input
                id="tonnage"
                type="number"
                value={formData.capacity.tonnage}
                onChange={(e) => setFormData({
                  ...formData, 
                  capacity: {...formData.capacity, tonnage: parseInt(e.target.value)}
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="volume">Volume Capacity</Label>
              <Input
                id="volume"
                type="number"
                value={formData.capacity.volume}
                onChange={(e) => setFormData({
                  ...formData, 
                  capacity: {...formData.capacity, volume: parseInt(e.target.value)}
                })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="length">Length (m)</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                value={formData.dimensions.length}
                onChange={(e) => setFormData({
                  ...formData, 
                  dimensions: {...formData.dimensions, length: parseFloat(e.target.value)}
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="width">Width (m)</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                value={formData.dimensions.width}
                onChange={(e) => setFormData({
                  ...formData, 
                  dimensions: {...formData.dimensions, width: parseFloat(e.target.value)}
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="height">Height (m)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.dimensions.height}
                onChange={(e) => setFormData({
                  ...formData, 
                  dimensions: {...formData.dimensions, height: parseFloat(e.target.value)}
                })}
                required
              />
            </div>
          </div>
        </div>

        {/* Tire Specifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tire Specifications</h3>
          
          <div>
            <Label htmlFor="frontTires">Front Tires</Label>
            <Input
              id="frontTires"
              value={formData.tires.front}
              onChange={(e) => setFormData({
                ...formData, 
                tires: {...formData.tires, front: e.target.value}
              })}
              placeholder="e.g., 295/80R22.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="rearTires">Rear Tires</Label>
            <Input
              id="rearTires"
              value={formData.tires.rear}
              onChange={(e) => setFormData({
                ...formData, 
                tires: {...formData.tires, rear: e.target.value}
              })}
              placeholder="e.g., 295/80R22.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="spareTire">Spare Tire</Label>
            <Input
              id="spareTire"
              value={formData.tires.spare}
              onChange={(e) => setFormData({
                ...formData, 
                tires: {...formData.tires, spare: e.target.value}
              })}
              placeholder="e.g., 295/80R22.5"
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Registration Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orNumber">OR Number</Label>
              <Input
                id="orNumber"
                value={formData.registration.orNumber}
                onChange={(e) => setFormData({
                  ...formData, 
                  registration: {...formData.registration, orNumber: e.target.value}
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="orExpiry">OR Expiry Date</Label>
              <Input
                id="orExpiry"
                type="date"
                value={formData.registration.orExpiry}
                onChange={(e) => setFormData({
                  ...formData, 
                  registration: {...formData.registration, orExpiry: e.target.value}
                })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="crNumber">CR Number</Label>
              <Input
                id="crNumber"
                value={formData.registration.crNumber}
                onChange={(e) => setFormData({
                  ...formData, 
                  registration: {...formData.registration, crNumber: e.target.value}
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="crExpiry">CR Expiry Date</Label>
              <Input
                id="crExpiry"
                type="date"
                value={formData.registration.crExpiry}
                onChange={(e) => setFormData({
                  ...formData, 
                  registration: {...formData.registration, crExpiry: e.target.value}
                })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="insuranceExpiry">Insurance Expiry Date</Label>
            <Input
              id="insuranceExpiry"
              type="date"
              value={formData.registration.insuranceExpiry}
              onChange={(e) => setFormData({
                ...formData, 
                registration: {...formData.registration, insuranceExpiry: e.target.value}
              })}
              required
            />
          </div>
        </div>

        {/* Maintenance Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Maintenance Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lastService">Last Service Date</Label>
              <Input
                id="lastService"
                type="date"
                value={formData.maintenance.lastService}
                onChange={(e) => setFormData({
                  ...formData, 
                  maintenance: {...formData.maintenance, lastService: e.target.value}
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="nextService">Next Service Date</Label>
              <Input
                id="nextService"
                type="date"
                value={formData.maintenance.nextService}
                onChange={(e) => setFormData({
                  ...formData, 
                  maintenance: {...formData.maintenance, nextService: e.target.value}
                })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.maintenance.mileage}
                onChange={(e) => setFormData({
                  ...formData, 
                  maintenance: {...formData.maintenance, mileage: parseInt(e.target.value)}
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="maintenanceStatus">Maintenance Status</Label>
              <Select value={formData.maintenance.status} onValueChange={(value: any) => setFormData({
                ...formData, 
                maintenance: {...formData.maintenance, status: value}
              })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Good Condition</SelectItem>
                  <SelectItem value="needs-service">Needs Service</SelectItem>
                  <SelectItem value="maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Truck Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Truck Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Front View</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
            </div>
          </div>
          <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Side View</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
            </div>
          </div>
          <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Rear View</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Enter any additional notes about the truck..."
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          <Save className="h-4 w-4 mr-2" />
          {truck ? 'Update Truck' : 'Add Truck'}
        </Button>
      </div>
    </form>
  )
}


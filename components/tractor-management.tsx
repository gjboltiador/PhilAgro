"use client"

import { useState } from "react"
import { 
  Tractor, 
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
  Calendar,
  FileText,
  AlertCircle,
  Wrench,
  User,
  Search,
  Filter
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

interface TractorSpecs {
  id: string
  model: string
  type: "utility" | "mid-size" | "compact" | "row-crop" | "specialty"
  brand: string
  year: number
  horsepower: number
  engine: {
    type: string
    displacement: string
    fuelType: "diesel" | "gasoline"
    transmission: "manual" | "automatic" | "hydrostatic"
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
  }
  implements: string[]
  maintenance: {
    lastService: string
    nextService: string
    hours: number
    status: "good" | "needs-service" | "maintenance"
  }
  images: string[]
  status: "available" | "working" | "maintenance" | "retired"
  operator?: string
  ratePerHa: number
  notes?: string
}

const mockTractors: TractorSpecs[] = [
  {
    id: "TCR-001",
    model: "John Deere 5E",
    type: "utility",
    brand: "John Deere",
    year: 2022,
    horsepower: 75,
    engine: {
      type: "4-cylinder",
      displacement: "2.9L",
      fuelType: "diesel",
      transmission: "manual"
    },
    dimensions: {
      length: 3.8,
      width: 2.1,
      height: 2.4,
      unit: "meters"
    },
    tires: {
      front: "7.50-16",
      rear: "14.9-28"
    },
    implements: ["Plow", "Harrow", "Rotavator", "Seeder"],
    maintenance: {
      lastService: "2024-01-15",
      nextService: "2024-04-15",
      hours: 1250,
      status: "good"
    },
    images: [],
    status: "working",
    operator: "Miguel Santos",
    ratePerHa: 2500,
    notes: "Excellent condition, recently serviced"
  },
  {
    id: "TCR-002",
    model: "Kubota M7060",
    type: "mid-size",
    brand: "Kubota",
    year: 2021,
    horsepower: 70,
    engine: {
      type: "4-cylinder",
      displacement: "3.3L",
      fuelType: "diesel",
      transmission: "hydrostatic"
    },
    dimensions: {
      length: 3.6,
      width: 2.0,
      height: 2.3,
      unit: "meters"
    },
    tires: {
      front: "7.50-16",
      rear: "13.6-28"
    },
    implements: ["Rotavator", "Seeder", "Sprayer"],
    maintenance: {
      lastService: "2024-01-10",
      nextService: "2024-04-10",
      hours: 980,
      status: "good"
    },
    images: [],
    status: "available",
    operator: "Carlos Reyes",
    ratePerHa: 2200,
    notes: "Reliable workhorse"
  }
]

export function TractorManagement() {
  const [tractors, setTractors] = useState<TractorSpecs[]>(mockTractors)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedTractor, setSelectedTractor] = useState<TractorSpecs | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const getTractorTypeLabel = (type: string) => {
    switch (type) {
      case "utility": return "Utility Tractor"
      case "mid-size": return "Mid-Size Tractor"
      case "compact": return "Compact Tractor"
      case "row-crop": return "Row-Crop Tractor"
      case "specialty": return "Specialty Tractor"
      default: return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "working":
        return <Badge className="bg-amber-100 text-amber-800">Working</Badge>
      case "maintenance":
        return <Badge className="bg-red-100 text-red-800">Maintenance</Badge>
      case "retired":
        return <Badge className="bg-gray-100 text-gray-800">Retired</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleAddTractor = (tractorData: TractorSpecs) => {
    setTractors([...tractors, tractorData])
    setIsAddDialogOpen(false)
  }

  const handleEditTractor = (tractorData: TractorSpecs) => {
    setTractors(tractors.map(tractor => tractor.id === tractorData.id ? tractorData : tractor))
    setIsEditDialogOpen(false)
    setSelectedTractor(null)
  }

  const handleDeleteTractor = (tractorId: string) => {
    setTractors(tractors.filter(tractor => tractor.id !== tractorId))
  }

  const filteredTractors = tractors.filter(tractor =>
    tractor.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tractor.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tractor.operator?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="border-green-200 rounded-xl shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-green-800 text-xl sm:text-2xl font-bold">
              Tractor Fleet Management
            </CardTitle>
            <CardDescription className="text-green-600 text-sm sm:text-base">
              Manage tractor details, specifications, and maintenance
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Tractor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Tractor</DialogTitle>
                <DialogDescription>
                  Enter detailed tractor specifications and information
                </DialogDescription>
              </DialogHeader>
              <TractorForm 
                onSubmit={handleAddTractor}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                placeholder="Search tractors by model, brand, or operator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 py-2 sm:py-3 rounded-lg border-gray-200 text-sm sm:text-base"
              />
            </div>
          </div>
          <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 rounded-lg px-4 sm:px-6 py-2 text-xs sm:text-sm">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Filter
          </Button>
        </div>

        {/* Tractors Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-green-50">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tractor ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Model</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">HP</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Operator</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Rate/ha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Hours</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTractors.map((tractor) => (
                <tr key={tractor.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{tractor.id}</td>
                  <td className="py-3 px-4 text-gray-700">
                    <div className="font-medium">{tractor.model}</div>
                    <div className="text-sm text-gray-600">{tractor.brand}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{getTractorTypeLabel(tractor.type)}</td>
                  <td className="py-3 px-4 text-gray-700">{tractor.horsepower} HP</td>
                  <td className="py-3 px-4 text-gray-700">{tractor.operator || "Unassigned"}</td>
                  <td className="py-3 px-4">
                    {getStatusBadge(tractor.status)}
                  </td>
                  <td className="py-3 px-4 text-gray-700">₱{tractor.ratePerHa.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">{tractor.maintenance.hours}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Dialog open={isEditDialogOpen && selectedTractor?.id === tractor.id} onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setSelectedTractor(null)
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedTractor(tractor)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Tractor - {tractor.model}</DialogTitle>
                            <DialogDescription>
                              Update tractor specifications and information
                            </DialogDescription>
                          </DialogHeader>
                          <TractorForm 
                            tractor={tractor}
                            onSubmit={handleEditTractor}
                            onCancel={() => {
                              setIsEditDialogOpen(false)
                              setSelectedTractor(null)
                            }}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Tractor</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {tractor.model}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteTractor(tractor.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

interface TractorFormProps {
  tractor?: TractorSpecs
  onSubmit: (tractor: TractorSpecs) => void
  onCancel: () => void
}

function TractorForm({ tractor, onSubmit, onCancel }: TractorFormProps) {
  const [formData, setFormData] = useState<TractorSpecs>(tractor || {
    id: "",
    model: "",
    type: "utility",
    brand: "",
    year: new Date().getFullYear(),
    horsepower: 0,
    engine: {
      type: "",
      displacement: "",
      fuelType: "diesel",
      transmission: "manual"
    },
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: "meters"
    },
    tires: {
      front: "",
      rear: ""
    },
    implements: [],
    maintenance: {
      lastService: "",
      nextService: "",
      hours: 0,
      status: "good"
    },
    images: [],
    status: "available",
    operator: "",
    ratePerHa: 0,
    notes: ""
  })

  const [newImplement, setNewImplement] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tractor) {
      // Generate new ID for new tractor
      formData.id = `TCR-${Date.now()}`
    }
    onSubmit(formData)
  }

  const addImplement = () => {
    if (newImplement.trim() && !formData.implements.includes(newImplement.trim())) {
      setFormData({
        ...formData,
        implements: [...formData.implements, newImplement.trim()]
      })
      setNewImplement("")
    }
  }

  const removeImplement = (implement: string) => {
    setFormData({
      ...formData,
      implements: formData.implements.filter(impl => impl !== implement)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="type">Tractor Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utility">Utility Tractor</SelectItem>
                  <SelectItem value="mid-size">Mid-Size Tractor</SelectItem>
                  <SelectItem value="compact">Compact Tractor</SelectItem>
                  <SelectItem value="row-crop">Row-Crop Tractor</SelectItem>
                  <SelectItem value="specialty">Specialty Tractor</SelectItem>
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
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                required
              />
            </div>
            <div>
              <Label htmlFor="horsepower">Horsepower</Label>
              <Input
                id="horsepower"
                type="number"
                value={formData.horsepower}
                onChange={(e) => setFormData({...formData, horsepower: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operator">Assigned Operator</Label>
              <Input
                id="operator"
                value={formData.operator}
                onChange={(e) => setFormData({...formData, operator: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="ratePerHa">Rate per Hectare (₱)</Label>
              <Input
                id="ratePerHa"
                type="number"
                value={formData.ratePerHa}
                onChange={(e) => setFormData({...formData, ratePerHa: parseInt(e.target.value)})}
                required
              />
            </div>
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
            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.engine.transmission} onValueChange={(value: any) => setFormData({
                ...formData, 
                engine: {...formData.engine, transmission: value}
              })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="hydrostatic">Hydrostatic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dimensions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dimensions</h3>
          
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
              placeholder="e.g., 7.50-16"
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
              placeholder="e.g., 14.9-28"
              required
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Implements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Implements</h3>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add implement..."
                value={newImplement}
                onChange={(e) => setNewImplement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImplement())}
              />
              <Button type="button" variant="outline" onClick={addImplement}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.implements.map((implement, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {implement}
                  <button
                    type="button"
                    onClick={() => removeImplement(implement)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
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
              <Label htmlFor="hours">Current Hours</Label>
              <Input
                id="hours"
                type="number"
                value={formData.maintenance.hours}
                onChange={(e) => setFormData({
                  ...formData, 
                  maintenance: {...formData.maintenance, hours: parseInt(e.target.value)}
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

      {/* Tractor Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tractor Images</h3>
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
          placeholder="Enter any additional notes about the tractor..."
          rows={3}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-green-500 hover:bg-green-600">
          <Save className="h-4 w-4 mr-2" />
          {tractor ? 'Update Tractor' : 'Add Tractor'}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Truck, 
  Calendar,
  MapPin,
  FileText,
  Settings,
  Fuel,
  Gauge,
  Car,
  Image as ImageIcon,
  X,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"

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
  maintenanceHistory?: {
    date: string
    type: string
    description: string
    cost: number
  }[]
  performanceStats?: {
    totalTrips: number
    totalDistance: number
    averageFuelConsumption: number
    lastMaintenance: string
  }
}

interface TruckDetailsModalProps {
  truck: TruckData | null
  isOpen: boolean
  onClose: () => void
  onSelect?: (truck: TruckData) => void
  showSelectButton?: boolean
}

export default function TruckDetailsModal({ 
  truck, 
  isOpen, 
  onClose, 
  onSelect, 
  showSelectButton = false 
}: TruckDetailsModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!truck) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Available</Badge>
      case "on-route":
        return <Badge className="bg-orange-100 text-orange-800">On Route</Badge>
      case "maintenance":
        return <Badge className="bg-red-100 text-red-800">Maintenance</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "on-route":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "maintenance":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isDocumentExpiring = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-800">
            <Truck className="h-5 w-5" />
            Truck Details - {truck.plateNumber}
          </DialogTitle>
          <DialogDescription>
            Comprehensive information about {truck.plateNumber} - {truck.type}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Header with Status */}
          <div className="flex items-center justify-between bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Truck className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-orange-800">{truck.plateNumber}</h3>
                <p className="text-sm text-orange-600">{truck.type} • {truck.model}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(truck.status)}
              {getStatusBadge(truck.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Truck Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Plate Number</p>
                      <p className="text-sm text-gray-900 font-semibold">{truck.plateNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Truck Type</p>
                      <p className="text-sm text-gray-900">{truck.type}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Model</p>
                      <p className="text-sm text-gray-900">{truck.model}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Year</p>
                      <p className="text-sm text-gray-900">{truck.year}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Color</p>
                      <p className="text-sm text-gray-900">{truck.color}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Assigned Driver</p>
                      <p className="text-sm text-gray-900">{truck.driver}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Information */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <Gauge className="h-5 w-5" />
                    Capacity & Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Maximum Capacity</p>
                      <p className="text-sm text-gray-900 font-semibold">{truck.capacity} tons</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Underload Capacity (Sugar Cane)</p>
                      <p className="text-sm text-gray-900 font-semibold text-orange-600">{truck.underloadCapacity} tons</p>
                    </div>
                  </div>
                  
                  {truck.performanceStats && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Statistics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Total Trips</p>
                          <p className="text-sm text-gray-900">{truck.performanceStats.totalTrips}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Total Distance</p>
                          <p className="text-sm text-gray-900">{truck.performanceStats.totalDistance} km</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Avg Fuel Consumption</p>
                          <p className="text-sm text-gray-900">{truck.performanceStats.averageFuelConsumption} km/L</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">Last Maintenance</p>
                          <p className="text-sm text-gray-900">{formatDate(truck.performanceStats.lastMaintenance)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technical Specifications */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Technical Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Engine Number</p>
                      <p className="text-sm text-gray-900 font-mono">{truck.engineNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Chassis Number</p>
                      <p className="text-sm text-gray-900 font-mono">{truck.chassisNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Fuel Type</p>
                      <p className="text-sm text-gray-900 flex items-center gap-2">
                        <Fuel className="h-4 w-4" />
                        {truck.fuelType}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Transmission</p>
                      <p className="text-sm text-gray-900">{truck.transmission}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Registration Documents */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Registration Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`space-y-2 p-3 rounded-lg border ${isDocumentExpiring(truck.orExpiry) ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">Official Receipt (OR)</p>
                        {isDocumentExpiring(truck.orExpiry) ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-900">Expires: {formatDate(truck.orExpiry)}</p>
                      {isDocumentExpiring(truck.orExpiry) && (
                        <p className="text-xs text-red-600">Expiring soon!</p>
                      )}
                    </div>
                    
                    <div className={`space-y-2 p-3 rounded-lg border ${isDocumentExpiring(truck.crExpiry) ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">Certificate of Registration (CR)</p>
                        {isDocumentExpiring(truck.crExpiry) ? (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-900">Expires: {formatDate(truck.crExpiry)}</p>
                      {isDocumentExpiring(truck.crExpiry) && (
                        <p className="text-xs text-red-600">Expiring soon!</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Maintenance History */}
              {truck.maintenanceHistory && truck.maintenanceHistory.length > 0 && (
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-800 flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Recent Maintenance History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {truck.maintenanceHistory.slice(0, 3).map((maintenance, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{maintenance.type}</p>
                            <p className="text-xs text-gray-600">{maintenance.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(maintenance.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">₱{maintenance.cost.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {truck.notes && (
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-800">Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">{truck.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Images and Actions */}
            <div className="space-y-6">
              {/* Truck Images */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Truck Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {truck.images && truck.images.length > 0 ? (
                    <>
                      {/* Main Image */}
                      <div className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={truck.images[selectedImageIndex]}
                          alt={`Truck ${truck.plateNumber} - Image ${selectedImageIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Thumbnail Gallery */}
                      {truck.images.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                          {truck.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                                selectedImageIndex === index 
                                  ? 'border-orange-500' 
                                  : 'border-gray-200 hover:border-orange-300'
                              }`}
                            >
                              <img
                                src={image}
                                alt={`Truck ${truck.plateNumber} - Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Image {selectedImageIndex + 1} of {truck.images.length}</span>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No images available</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Details
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    Track Location
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Maintenance History
                  </Button>
                  
                  {showSelectButton && onSelect && (
                    <>
                      <Separator />
                      <Button 
                        onClick={() => onSelect(truck)}
                        className="w-full bg-orange-500 hover:bg-orange-600"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Select This Truck
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Status Summary */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Status Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Status</span>
                    {getStatusBadge(truck.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Capacity</span>
                    <span className="text-sm font-medium">{truck.capacity} tons</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Underload Capacity</span>
                    <span className="text-sm font-medium text-orange-600">{truck.underloadCapacity} tons</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Driver</span>
                    <span className="text-sm font-medium">{truck.driver}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

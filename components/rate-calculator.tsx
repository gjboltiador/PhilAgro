"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator,
  Truck,
  MapPin,
  Building,
  DollarSign,
  Info
} from "lucide-react"

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

interface RateCalculatorProps {
  truckType: string
  municipality: string
  destination: string
  tonnage: number
  rates: TruckRate[]
  showBreakdown?: boolean
}

export default function RateCalculator({ 
  truckType, 
  municipality, 
  destination, 
  tonnage, 
  rates,
  showBreakdown = true 
}: RateCalculatorProps) {
  const rate = rates.find(r => r.truckType === truckType)
  
  if (!rate) {
    return (
      <Card className="border-orange-200">
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <Calculator className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Select truck type to calculate rates</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const baseRate = rate.baseRate
  const locationRate = rate.locationRates[municipality] || 0
  const destinationRate = rate.destinationRates[destination] || 0
  const totalRatePerTon = baseRate + locationRate + destinationRate
  const totalAmount = totalRatePerTon * tonnage

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Rate Calculation
        </CardTitle>
        <CardDescription>
          Detailed breakdown of trucking rates for sugarcane hauling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-800">Total Rate per Ton</span>
            <span className="text-lg font-bold text-orange-800">₱{totalRatePerTon.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-600">Total Amount ({tonnage} tons)</span>
            <span className="text-xl font-bold text-orange-800">₱{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {showBreakdown && (
          <>
            {/* Rate Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Rate Breakdown
              </h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Base Rate ({truckType})</span>
                  </div>
                  <span className="text-sm font-medium">₱{baseRate.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Location Rate ({municipality})</span>
                  </div>
                  <span className="text-sm font-medium">₱{locationRate.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Destination Rate ({destination})</span>
                  </div>
                  <span className="text-sm font-medium">₱{destinationRate.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rate Factors */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Rate Factors</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Truck className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-blue-800">Truck Type</p>
                  <p className="text-sm text-blue-600">{truckType}</p>
                  <p className="text-xs text-blue-500">Base: ₱{baseRate.toLocaleString()}</p>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <MapPin className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-green-800">Location</p>
                  <p className="text-sm text-green-600">{municipality}</p>
                  <p className="text-xs text-green-500">+₱{locationRate.toLocaleString()}</p>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <Building className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs font-medium text-purple-800">Destination</p>
                  <p className="text-sm text-purple-600">{destination}</p>
                  <p className="text-xs text-purple-500">+₱{destinationRate.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Rate Information */}
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rate Information</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Base rates vary by truck type and capacity</p>
                <p>• Location rates depend on distance from service area</p>
                <p>• Destination rates vary by sugar mill location</p>
                <p>• Rates are per ton of sugarcane hauled</p>
                <p>• All rates include fuel, driver, and operational costs</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

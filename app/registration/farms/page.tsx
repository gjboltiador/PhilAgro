"use client"

import { DashboardLayout } from "@/components/sidebar-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Leaf,
  Tractor,
  Sprout,
  Droplets,
  Scissors,
  MapPin,
  TrendingUp,
  DollarSign,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Thermometer,
  Cloud,
  CloudRain,
  Sun,
  BarChart3,
  Package,
  Scale,
  Percent,
  Edit,
  Trash2
} from "lucide-react"
import { useState } from "react"

// Mock data for farm management
const farmData = {
  currentSeason: "2024-2025",
  totalFarmArea: 15.5,
  plantedArea: 12.3,
  expectedYield: 85,
  estimatedRevenue: 2100000,
  weather: {
    temperature: 28,
    rainfall: 12,
    humidity: 75,
    condition: "Partly Cloudy"
  },
  progress: {
    landPreparation: 100,
    planting: 85,
    fertilizer: 60,
    harvesting: 0
  }
}

const farmBlocks = [
  {
    id: "block-a",
    name: "Block A",
    area: 4.2,
    soilType: "Clay Loam",
    gpsCoordinates: "10.6918° N, 122.9745° E",
    status: "planted",
    plantedDate: "2024-01-15",
    variety: "Phil 2000",
    expectedYield: 85
  },
  {
    id: "block-b",
    name: "Block B",
    area: 3.8,
    soilType: "Sandy Loam",
    gpsCoordinates: "10.6920° N, 122.9748° E",
    status: "planted",
    plantedDate: "2024-01-20",
    variety: "Phil 2000",
    expectedYield: 82
  },
  {
    id: "block-c",
    name: "Block C",
    area: 4.3,
    soilType: "Clay Loam",
    gpsCoordinates: "10.6915° N, 122.9742° E",
    status: "preparing",
    plantedDate: null,
    variety: null,
    expectedYield: null
  }
]

const landPrepTasks = [
  {
    id: "task-1",
    name: "Land Clearing",
    status: "completed",
    cost: 15000,
    date: "2024-01-10",
    description: "Removal of existing vegetation and debris"
  },
  {
    id: "task-2",
    name: "Plowing",
    status: "completed",
    cost: 8000,
    date: "2024-01-12",
    description: "Primary tillage to break soil"
  },
  {
    id: "task-3",
    name: "Harrowing",
    status: "completed",
    cost: 5000,
    date: "2024-01-14",
    description: "Secondary tillage for fine soil preparation"
  },
  {
    id: "task-4",
    name: "Furrowing",
    status: "in-progress",
    cost: 3000,
    date: "2024-01-16",
    description: "Creating planting rows"
  },
  {
    id: "task-5",
    name: "Drainage Setup",
    status: "pending",
    cost: 12000,
    date: null,
    description: "Installation of drainage systems"
  },
  {
    id: "task-6",
    name: "Final Inspection",
    status: "pending",
    cost: 2000,
    date: null,
    description: "Quality check before planting"
  }
]

const plantingData = [
  {
    id: "plant-1",
    block: "Block A",
    area: 4.2,
    variety: "Phil 2000",
    method: "Manual Planting",
    seedRate: 8.0,
    spacing: "1.2m x 0.3m",
    cost: 25000,
    supplier: "DA Seed Center",
    plantingDate: "2024-01-15",
    germination: 88,
    notes: "Good soil moisture, optimal weather conditions"
  },
  {
    id: "plant-2",
    block: "Block B",
    area: 3.8,
    variety: "Phil 2000",
    method: "Manual Planting",
    seedRate: 8.0,
    spacing: "1.2m x 0.3m",
    cost: 22000,
    supplier: "DA Seed Center",
    plantingDate: "2024-01-20",
    germination: 92,
    notes: "Excellent germination rate, healthy seedlings"
  }
]

const fertilizerData = [
  {
    id: "fert-1",
    block: "Block A",
    applicationDate: "2024-02-15",
    fertilizerType: "14-14-14",
    applicationRate: "300 kg/ha",
    cost: 15000,
    method: "Broadcast",
    status: "completed",
    notes: "Applied after soil test results"
  },
  {
    id: "fert-2",
    block: "Block B",
    applicationDate: "2024-02-20",
    fertilizerType: "14-14-14",
    applicationRate: "300 kg/ha",
    cost: 15000,
    method: "Broadcast",
    status: "completed",
    notes: "Applied after soil test results"
  }
]

const soilTests = [
  {
    block: "Block A",
    testedDate: "2024-01-20",
    ph: 6.2,
    organicMatter: 2.8,
    nitrogen: 45,
    phosphorus: 25,
    potassium: 180,
    recommendation: "Apply balanced fertilizer 14-14-14"
  },
  {
    block: "Block B",
    testedDate: "2024-01-22",
    ph: 5.8,
    organicMatter: 2.3,
    nitrogen: 38,
    phosphorus: 18,
    potassium: 165,
    recommendation: "Apply lime and phosphorus-rich fertilizer"
  }
]

const harvestingData = [
  {
    id: "harvest-1",
    block: "Block A",
    harvestDate: "2024-11-15",
    yield: 85.2,
    brix: 18.5,
    quality: "Premium",
    revenue: 127800,
    cost: 15000,
    profit: 112800
  },
  {
    id: "harvest-2",
    block: "Block B",
    harvestDate: "2024-11-20",
    yield: 78.8,
    brix: 17.8,
    quality: "Standard",
    revenue: 118200,
    cost: 14000,
    profit: 104200
  }
]

export default function FarmManagement() {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeStage, setActiveStage] = useState("planting")

  const [showAddBlock, setShowAddBlock] = useState(false)
  const [showAddPlanting, setShowAddPlanting] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "planted":
        return <Badge className="bg-green-100 text-green-800">Planted</Badge>
      case "preparing":
        return <Badge className="bg-orange-100 text-orange-800">Preparing</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-farm-green-800">Sugarcane Farm Management</h1>
            <p className="text-sm sm:text-base text-farm-green-600">Complete lifecycle management for your sugarcane farm</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              Current Season {farmData.currentSeason}
            </Badge>
            <Badge className="bg-green-500 text-white">Active Farm</Badge>
          </div>
        </div>

        {/* Farm Stages Progress */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-green-200 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Tractor className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Land Preparation</p>
                  <div className="mt-1 h-1 bg-gray-200 rounded-full">
                    <div className="h-1 bg-green-500 rounded-full" style={{ width: `${farmData.progress.landPreparation}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Sprout className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Sugarcane Planting</p>
                  <div className="mt-1 h-1 bg-gray-200 rounded-full">
                    <div className="h-1 bg-green-500 rounded-full" style={{ width: `${farmData.progress.planting}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Droplets className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Fertilizer Management</p>
                  <div className="mt-1 h-1 bg-gray-200 rounded-full">
                    <div className="h-1 bg-green-500 rounded-full" style={{ width: `${farmData.progress.fertilizer}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Scissors className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Harvesting</p>
                  <div className="mt-1 h-1 bg-gray-200 rounded-full">
                    <div className="h-1 bg-green-500 rounded-full" style={{ width: `${farmData.progress.harvesting}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeStage} onValueChange={setActiveStage} className="w-full">
          <TabsList className="grid w-full grid-cols-4 border border-farm-green-200 p-1">
            <TabsTrigger 
              value="land-prep" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              <Tractor className="h-4 w-4 mr-2" />
              Land Prep
            </TabsTrigger>
            <TabsTrigger 
              value="planting" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              <Sprout className="h-4 w-4 mr-2" />
              Planting
            </TabsTrigger>
            <TabsTrigger 
              value="fertilizer" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              <Droplets className="h-4 w-4 mr-2" />
              Fertilizer
            </TabsTrigger>
            <TabsTrigger 
              value="harvesting" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              <Scissors className="h-4 w-4 mr-2" />
              Harvesting
            </TabsTrigger>
          </TabsList>

          {/* Sub Tabs */}
          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 border border-farm-green-200 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="farm-area" className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white">
                  <MapPin className="h-4 w-4 mr-2" />
                  Farm Area
                </TabsTrigger>
                <TabsTrigger value="land-prep" className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white">
                  <Tractor className="h-4 w-4 mr-2" />
                  Land Prep
                </TabsTrigger>
                <TabsTrigger value="planting" className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white">
                  <Sprout className="h-4 w-4 mr-2" />
                  Planting
                </TabsTrigger>
                <TabsTrigger value="fertilizer" className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white">
                  <Droplets className="h-4 w-4 mr-2" />
                  Fertilizer
                </TabsTrigger>
                <TabsTrigger value="harvesting" className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white">
                  <Scissors className="h-4 w-4 mr-2" />
                  Harvesting
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-green-50 border-green-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Total Farm Area</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">{farmData.totalFarmArea} ha</div>
                      <p className="text-xs text-farm-green-600">Total area</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Planted Area</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">{farmData.plantedArea} ha</div>
                      <p className="text-xs text-farm-green-600">Currently planted</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Expected Yield</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">{farmData.expectedYield} tons/ha</div>
                      <p className="text-xs text-farm-green-600">Average yield</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-50 border-orange-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Est. Revenue</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">₱{(farmData.estimatedRevenue / 1000000).toFixed(1)}M</div>
                      <p className="text-xs text-farm-green-600">Expected revenue</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Weather and Progress Cards - Above Future Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Weather Only */}
                  <div className="h-full">
                    <Card className="border-blue-200 rounded-xl h-full">
                      <CardHeader>
                        <CardTitle className="text-blue-800 text-lg font-bold">Current Weather Conditions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-700">Temperature</span>
                          </div>
                          <span className="font-medium">{farmData.weather.temperature}°C</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CloudRain className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-700">Rainfall (24h)</span>
                          </div>
                          <span className="font-medium">{farmData.weather.rainfall}mm</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-700">Humidity</span>
                          </div>
                          <span className="font-medium">{farmData.weather.humidity}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-700">Condition</span>
                          </div>
                          <span className="font-medium">{farmData.weather.condition}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Progress Only */}
                  <div className="h-full">
                    <Card className="border-green-200 rounded-xl h-full">
                      <CardHeader>
                        <CardTitle className="text-green-800 text-lg font-bold">Farm Progress Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Land Preparation</span>
                            <span className="text-sm font-medium text-green-600">{farmData.progress.landPreparation}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${farmData.progress.landPreparation}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Planting</span>
                            <span className="text-sm font-medium text-green-600">{farmData.progress.planting}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${farmData.progress.planting}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Fertilizer Application</span>
                            <span className="text-sm font-medium text-green-600">{farmData.progress.fertilizer}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${farmData.progress.fertilizer}%` }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Harvesting</span>
                            <span className="text-sm font-medium text-green-600">{farmData.progress.harvesting}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: `${farmData.progress.harvesting}%` }}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent Farm Activities */}
                <Card className="border-gray-200 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-600" />
                      <CardTitle className="text-gray-800 text-lg font-bold">Recent Farm Activities</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">DATE</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ACTIVITY</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">CURRENT CROP</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">AREA</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">STATUS</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">2024-01-15</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Fertilizer Application</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Sugarcane</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Block A (3.2 ha)</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">Edit</button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">2024-01-12</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Irrigation</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Sugarcane</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Block B (2.8 ha)</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">Edit</button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">2024-01-10</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Pest Control</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Sugarcane</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Block C (4.1 ha)</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">Edit</button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">2024-01-08</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Soil Testing</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Sugarcane</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Block D (2.5 ha)</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pending</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">Edit</button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Farm Area Tab */}
              <TabsContent value="farm-area" className="space-y-6 mt-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-green-50 border-green-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Total Area</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">12.6 ha</div>
                      <p className="text-xs text-farm-green-600">Total farm area</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Total Blocks</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">4</div>
                      <p className="text-xs text-farm-green-600">Farm blocks</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Planted Area</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">3.2 ha</div>
                      <p className="text-xs text-farm-green-600">Currently planted</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Available Area</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">2.5 ha</div>
                      <p className="text-xs text-farm-green-600">Ready for planting</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Add New Farm Block Form */}
                <Card className="border-green-200 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-green-800 text-lg font-bold">+ Add New Farm Block</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <Label htmlFor="blockName" className="text-sm font-medium text-gray-700">Block Name</Label>
                        <Input
                          id="blockName"
                          placeholder="e.g., Block E"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="area" className="text-sm font-medium text-gray-700">Area (hectares)</Label>
                        <Input
                          id="area"
                          type="number"
                          defaultValue="0.0"
                          step="0.1"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="soilType" className="text-sm font-medium text-gray-700">Soil Type</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select soil type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clay-loam">Clay Loam</SelectItem>
                            <SelectItem value="sandy-loam">Sandy Loam</SelectItem>
                            <SelectItem value="silty-clay">Silty Clay</SelectItem>
                            <SelectItem value="loam">Loam</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="gpsCoordinates" className="text-sm font-medium text-gray-700">GPS Coordinates</Label>
                        <Input
                          id="gpsCoordinates"
                          defaultValue="10.6918° N, 122.9745° E"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Block
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Farm Blocks Overview Table */}
                <Card className="border-gray-200 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <CardTitle className="text-gray-800 text-lg font-bold">Farm Blocks Overview</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">BLOCK NAME</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">AREA (HA)</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">SOIL TYPE</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">GPS COORDINATES</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">STATUS</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">CURRENT CROP</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">Block A</td>
                            <td className="py-3 px-4 text-sm text-gray-700">3.2 ha</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Clay Loam</td>
                            <td className="py-3 px-4 text-sm text-gray-700">10.6918° N, 122.9745° E</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-green-100 text-green-700 border-green-200">Planted</Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">Sugarcane</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="text-gray-600 hover:text-gray-800">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">Block B</td>
                            <td className="py-3 px-4 text-sm text-gray-700">2.8 ha</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Sandy Loam</td>
                            <td className="py-3 px-4 text-sm text-gray-700">10.6920° N, 122.9750° E</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">Prepared</Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">-</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="text-gray-600 hover:text-gray-800">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">Block C</td>
                            <td className="py-3 px-4 text-sm text-gray-700">4.1 ha</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Silty Clay</td>
                            <td className="py-3 px-4 text-sm text-gray-700">10.6915° N, 122.9740° E</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Harvested</Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">Sugarcane</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="text-gray-600 hover:text-gray-800">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-700">Block D</td>
                            <td className="py-3 px-4 text-sm text-gray-700">2.5 ha</td>
                            <td className="py-3 px-4 text-sm text-gray-700">Loam</td>
                            <td className="py-3 px-4 text-sm text-gray-700">10.6922° N, 122.9748° E</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-gray-100 text-gray-700 border-gray-200">Available</Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">-</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button className="text-gray-600 hover:text-gray-800">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-800">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Land Prep Tab */}
              <TabsContent value="land-prep" className="space-y-6 mt-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-green-50 border-green-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Completed Tasks</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">2/6</div>
                      <p className="text-xs text-farm-green-600">Tasks completed</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Progress</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">33%</div>
                      <p className="text-xs text-farm-green-600">Overall progress</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Total Cost</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">₱28,500</div>
                      <p className="text-xs text-farm-green-600">Budget allocated</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Spent</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">₱13,000</div>
                      <p className="text-xs text-farm-green-600">Amount spent</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Land Preparation Progress */}
                <Card className="border-green-200 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Tractor className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-green-800 text-lg font-bold">Land Preparation Progress</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                          <span className="text-sm font-medium text-green-600">33%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full">
                          <div className="h-3 bg-green-500 rounded-full" style={{ width: "33%" }}></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">2 of 6 tasks completed • ₱13,000 of ₱28,500 spent</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add New Preparation Task Form */}
                <Card className="border-blue-200 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-blue-800 text-lg font-bold">Add New Preparation Task</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="taskName" className="text-sm font-medium text-gray-700">Task Name</Label>
                        <Input
                          id="taskName"
                          placeholder="e.g., Irrigation Channel Preparation"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="estimatedCost" className="text-sm font-medium text-gray-700">Estimated Cost (₱)</Label>
                        <Input
                          id="estimatedCost"
                          type="number"
                          defaultValue="0"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Detailed description of the task"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="equipment" className="text-sm font-medium text-gray-700">Equipment Needed</Label>
                        <Input
                          id="equipment"
                          placeholder="e.g., Tractor, Hand tools"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="operator" className="text-sm font-medium text-gray-700">Operator/Worker</Label>
                        <Input
                          id="operator"
                          placeholder="Name of operator"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="area" className="text-sm font-medium text-gray-700">Area</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-green-300">
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="block-a">Block A</SelectItem>
                            <SelectItem value="block-b">Block B</SelectItem>
                            <SelectItem value="block-c">Block C</SelectItem>
                            <SelectItem value="block-d">Block D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="scheduledDate" className="text-sm font-medium text-gray-700">Scheduled Date</Label>
                        <div className="relative mt-1">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="scheduledDate"
                            placeholder="Pick a date"
                            className="pl-10 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>
                                             <div className="md:col-span-2 flex justify-end">
                         <Button className="bg-blue-600 hover:bg-blue-700">
                           Add Task
                         </Button>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 {/* Land Preparation Tasks Table */}
                 <Card className="border-gray-200 rounded-xl">
                   <CardHeader>
                     <div className="flex items-center gap-2">
                       <CheckCircle className="h-5 w-5 text-gray-600" />
                       <CardTitle className="text-gray-800 text-lg font-bold">Land Preparation Tasks</CardTitle>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <div className="overflow-x-auto">
                       <table className="w-full">
                         <thead>
                           <tr className="border-b border-gray-200">
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">STATUS</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">TASK</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">AREA</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">EQUIPMENT</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">OPERATOR</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">DATE</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">COST</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                           <tr className="hover:bg-gray-50">
                             <td className="py-3 px-4">
                               <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                 <CheckCircle className="h-3 w-3 text-white" />
                               </div>
                             </td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                   <Tractor className="h-3 w-3 text-green-600" />
                                 </div>
                                 <div>
                                   <div className="text-sm font-medium text-gray-700">Land Clearing</div>
                                   <div className="text-xs text-gray-500">Remove weeds, debris, and old crop residues</div>
                                 </div>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">Block A (3.2 ha)</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Hand tools, Brush cutter</td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                   <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                 </div>
                                 <span className="text-sm text-gray-700">Juan Dela Cruz</span>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">2024-01-05</td>
                             <td className="py-3 px-4 text-sm text-gray-700">₱5,000</td>
                           </tr>
                           <tr className="hover:bg-gray-50">
                             <td className="py-3 px-4">
                               <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                 <CheckCircle className="h-3 w-3 text-white" />
                               </div>
                             </td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                   <Tractor className="h-3 w-3 text-green-600" />
                                 </div>
                                 <div>
                                   <div className="text-sm font-medium text-gray-700">Primary Tillage (Plowing)</div>
                                   <div className="text-xs text-gray-500">Deep plowing to break hardpan and improve soil structure</div>
                                 </div>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">Block A (3.2 ha)</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Tractor with moldboard plow</td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                   <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                 </div>
                                 <span className="text-sm text-gray-700">Pedro Santos</span>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">2024-01-08</td>
                             <td className="py-3 px-4 text-sm text-gray-700">₱8,000</td>
                           </tr>
                           <tr className="hover:bg-gray-50">
                             <td className="py-3 px-4">
                               <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                             </td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                   <Tractor className="h-3 w-3 text-green-600" />
                                 </div>
                                 <div>
                                   <div className="text-sm font-medium text-gray-700">Secondary Tillage (Harrowing)</div>
                                   <div className="text-xs text-gray-500">Break clods and prepare fine seedbed</div>
                                 </div>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">Block A (3.2 ha)</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Tractor with disc harrow</td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                   <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                 </div>
                                 <span className="text-sm text-gray-700">Maria Garcia</span>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">2024-01-12</td>
                             <td className="py-3 px-4 text-sm text-gray-700">₱6,000</td>
                           </tr>
                           <tr className="hover:bg-gray-50">
                             <td className="py-3 px-4">
                               <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                             </td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                   <Tractor className="h-3 w-3 text-green-600" />
                                 </div>
                                 <div>
                                   <div className="text-sm font-medium text-gray-700">Leveling</div>
                                   <div className="text-xs text-gray-500">Level the field for proper water distribution</div>
                                 </div>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">Block A (3.2 ha)</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Land leveler</td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                   <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                 </div>
                                 <span className="text-sm text-gray-700">Jose Rodriguez</span>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">2024-01-15</td>
                             <td className="py-3 px-4 text-sm text-gray-700">₱4,000</td>
                           </tr>
                           <tr className="hover:bg-gray-50">
                             <td className="py-3 px-4">
                               <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                             </td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                   <Tractor className="h-3 w-3 text-green-600" />
                                 </div>
                                 <div>
                                   <div className="text-sm font-medium text-gray-700">Furrow Making</div>
                                   <div className="text-xs text-gray-500">Create furrows for sugarcane planting</div>
                                 </div>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">Block A (3.2 ha)</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Furrower</td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                   <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                 </div>
                                 <span className="text-sm text-gray-700">Ana Reyes</span>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">2024-01-18</td>
                             <td className="py-3 px-4 text-sm text-gray-700">₱3,500</td>
                           </tr>
                           <tr className="hover:bg-gray-50">
                             <td className="py-3 px-4">
                               <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                             </td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                   <Tractor className="h-3 w-3 text-green-600" />
                                 </div>
                                 <div>
                                   <div className="text-sm font-medium text-gray-700">Soil Testing</div>
                                   <div className="text-xs text-gray-500">Test soil pH, nutrients, and organic matter</div>
                                 </div>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">Block A (3.2 ha)</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Soil testing kit</td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                   <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                 </div>
                                 <span className="text-sm text-gray-700">Lab Technician</span>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">2024-01-20</td>
                             <td className="py-3 px-4 text-sm text-gray-700">₱2,000</td>
                           </tr>
                         </tbody>
                       </table>
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>

              {/* Planting Tab */}
              <TabsContent value="planting" className="space-y-6 mt-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-green-50 border-green-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Planted Area</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">6.0 ha</div>
                      <p className="text-xs text-farm-green-600">Total planted area</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Avg. Germination</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">88%</div>
                      <p className="text-xs text-farm-green-600">Average rate</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Total Cost</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">₱53,000</div>
                      <p className="text-xs text-farm-green-600">Total planting cost</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Varieties Used</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <Package className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">2</div>
                      <p className="text-xs text-farm-green-600">Different varieties</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Record New Planting Form */}
                <Card className="border-green-200 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sprout className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-green-800 text-lg font-bold">Record New Planting</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="farmBlock" className="text-sm font-medium text-gray-700">Farm Block</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select block" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="block-a">Block A</SelectItem>
                            <SelectItem value="block-b">Block B</SelectItem>
                            <SelectItem value="block-c">Block C</SelectItem>
                            <SelectItem value="block-d">Block D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="area" className="text-sm font-medium text-gray-700">Area (hectares)</Label>
                        <Input
                          id="area"
                          type="number"
                          defaultValue="0.0"
                          step="0.1"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="variety" className="text-sm font-medium text-gray-700">Sugarcane Variety</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select variety" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phil-2000">Phil 2000</SelectItem>
                            <SelectItem value="phil-2001">Phil 2001</SelectItem>
                            <SelectItem value="phil-2002">Phil 2002</SelectItem>
                            <SelectItem value="phil-2003">Phil 2003</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="plantingMethod" className="text-sm font-medium text-gray-700">Planting Method</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual Planting</SelectItem>
                            <SelectItem value="mechanical">Mechanical Planting</SelectItem>
                            <SelectItem value="semi-mechanical">Semi-mechanical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="seedRate" className="text-sm font-medium text-gray-700">Seed Rate (tons/ha)</Label>
                        <Input
                          id="seedRate"
                          type="number"
                          defaultValue="8.0"
                          step="0.1"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="plantSpacing" className="text-sm font-medium text-gray-700">Plant Spacing</Label>
                        <Input
                          id="plantSpacing"
                          defaultValue="1.2m x 0.3m"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cost" className="text-sm font-medium text-gray-700">Cost (₱)</Label>
                        <Input
                          id="cost"
                          type="number"
                          defaultValue="25000"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seedSupplier" className="text-sm font-medium text-gray-700">Seed Supplier</Label>
                        <Input
                          id="seedSupplier"
                          defaultValue="DA Seed Center"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="plantingDate" className="text-sm font-medium text-gray-700">Planting Date</Label>
                        <div className="relative mt-1">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="plantingDate"
                            placeholder="Pick a date"
                            className="pl-10 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Additional notes about planting conditions, weather, etc."
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          rows={3}
                        />
                      </div>
                                             <div className="md:col-span-3 flex justify-end">
                         <Button className="bg-green-600 hover:bg-green-700">
                           <Sprout className="h-4 w-4 mr-2" />
                           Record Planting
                         </Button>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 {/* Planting Records Table */}
                 <Card className="border-gray-200 rounded-xl">
                   <CardHeader>
                     <div className="flex items-center gap-2">
                       <Leaf className="h-5 w-5 text-green-600" />
                       <CardTitle className="text-gray-800 text-lg font-bold">Planting Records</CardTitle>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <div className="overflow-x-auto">
                       <table className="w-full">
                         <thead>
                           <tr className="border-b border-gray-200">
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">BLOCK</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">VARIETY</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">AREA</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">METHOD</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">SEED RATE</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">SPACING</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">DATE</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">GERMINATION</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">COST</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">STATUS</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                           <tr className="hover:bg-gray-50">
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <MapPin className="h-4 w-4 text-gray-500" />
                                 <span className="text-sm text-gray-700">Block A</span>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">Phil 8013</td>
                             <td className="py-3 px-4 text-sm text-gray-700">3.2 ha</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Manual</td>
                             <td className="py-3 px-4 text-sm text-gray-700">8 t/ha</td>
                             <td className="py-3 px-4 text-sm text-gray-700">1.2m x 0.3m</td>
                             <td className="py-3 px-4 text-sm text-gray-700">2024-01-25</td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <span className="text-sm font-medium text-gray-700">85%</span>
                                 <div className="w-16 h-2 bg-gray-200 rounded-full">
                                   <div className="h-2 bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                                 </div>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">₱25,000</td>
                             <td className="py-3 px-4">
                               <Badge className="bg-blue-100 text-blue-700 border-blue-200">Planted</Badge>
                             </td>
                           </tr>
                           <tr className="hover:bg-gray-50">
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <MapPin className="h-4 w-4 text-gray-500" />
                                 <span className="text-sm text-gray-700">Block B</span>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">Phil 2000-118</td>
                             <td className="py-3 px-4 text-sm text-gray-700">2.8 ha</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Mechanized</td>
                             <td className="py-3 px-4 text-sm text-gray-700">10 t/ha</td>
                             <td className="py-3 px-4 text-sm text-gray-700">1.5m x 0.25m</td>
                             <td className="py-3 px-4 text-sm text-gray-700">2024-02-01</td>
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <span className="text-sm font-medium text-gray-700">90%</span>
                                 <div className="w-16 h-2 bg-gray-200 rounded-full">
                                   <div className="h-2 bg-green-500 rounded-full" style={{ width: "90%" }}></div>
                                 </div>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">₱28,000</td>
                             <td className="py-3 px-4">
                               <Badge className="bg-green-100 text-green-700 border-green-200">Germinating</Badge>
                             </td>
                           </tr>
                         </tbody>
                       </table>
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>

              {/* Fertilizer Tab */}
              <TabsContent value="fertilizer" className="space-y-6 mt-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-green-800">Fertilizer Management</h2>
                    <p className="text-green-600 text-sm">Track fertilizer applications and soil health</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Application
                  </Button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-green-50 border-green-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Treated Area</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">6.0 ha</div>
                      <p className="text-xs text-farm-green-600">Total treated area</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Applications</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">1/2</div>
                      <p className="text-xs text-farm-green-600">Applications completed</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Total Cost</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">₱30,000</div>
                      <p className="text-xs text-farm-green-600">Total fertilizer cost</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Soil Tests</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">2</div>
                      <p className="text-xs text-farm-green-600">Tests completed</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Add New Fertilizer Application Form */}
                <Card className="border-gray-200 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-gray-800 text-lg font-bold">Add New Fertilizer Application</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="farmBlock" className="text-sm font-medium text-gray-700">Farm Block</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select block" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="block-a">Block A</SelectItem>
                            <SelectItem value="block-b">Block B</SelectItem>
                            <SelectItem value="block-c">Block C</SelectItem>
                            <SelectItem value="block-d">Block D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="area" className="text-sm font-medium text-gray-700">Area (hectares)</Label>
                        <Input
                          id="area"
                          type="number"
                          placeholder="0.0"
                          step="0.1"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fertilizerType" className="text-sm font-medium text-gray-700">Fertilizer Type</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="npk-14-14-14">NPK 14-14-14</SelectItem>
                            <SelectItem value="urea">Urea</SelectItem>
                            <SelectItem value="complete">Complete Fertilizer</SelectItem>
                            <SelectItem value="organic">Organic Fertilizer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="applicationMethod" className="text-sm font-medium text-gray-700">Application Method</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="broadcast">Broadcast</SelectItem>
                            <SelectItem value="band">Band Application</SelectItem>
                            <SelectItem value="foliar">Foliar Spray</SelectItem>
                            <SelectItem value="drip">Drip Irrigation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="applicationDate" className="text-sm font-medium text-gray-700">Date</Label>
                        <Input
                          id="applicationDate"
                          type="date"
                          placeholder="YYYY-MM-DD"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cost" className="text-sm font-medium text-gray-700">Cost (₱)</Label>
                        <Input
                          id="cost"
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any additional notes..."
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Droplets className="h-4 w-4 mr-2" />
                          Record Application
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Soil Test Results */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Block A */}
                  <Card className="border-gray-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">Block A</CardTitle>
                      <CardDescription>Tested: 2024-01-20</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">pH Level</span>
                          <span className="text-sm font-medium text-green-600">6.2</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Organic Matter</span>
                          <span className="text-sm font-medium text-green-600">2.8%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Nutrient Levels (ppm)</div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-green-600">Nitrogen (N): 45</div>
                          <div className="text-green-600">Phosphorus (P): 25</div>
                          <div className="text-green-600">Potassium (K): 180</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-yellow-700">
                        <AlertCircle className="h-4 w-4" />
                        Apply balanced fertilizer 14-14-14
                      </div>
                    </CardContent>
                  </Card>

                  {/* Block B */}
                  <Card className="border-gray-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">Block B</CardTitle>
                      <CardDescription>Tested: 2024-01-22</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">pH Level</span>
                          <span className="text-sm font-medium text-orange-600">5.8</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-orange-500 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Organic Matter</span>
                          <span className="text-sm font-medium text-orange-600">2.3%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-orange-500 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Nutrient Levels (ppm)</div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-red-600">Nitrogen (N): 38</div>
                          <div className="text-red-600">Phosphorus (P): 18</div>
                          <div className="text-green-600">Potassium (K): 165</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-yellow-700">
                        <AlertCircle className="h-4 w-4" />
                        Apply lime and phosphorus-rich fertilizer
                      </div>
                                         </CardContent>
                   </Card>
                 </div>

                 {/* Schedule Fertilizer Application */}
                 <Card className="border-green-200 rounded-xl">
                   <CardHeader>
                     <div className="flex items-center gap-2">
                       <Leaf className="h-5 w-5 text-green-600" />
                       <CardTitle className="text-green-800 text-lg font-bold">Schedule Fertilizer Application</CardTitle>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <Label htmlFor="scheduleBlock" className="text-sm font-medium text-gray-700">Farm Block</Label>
                         <Select>
                           <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                             <SelectValue placeholder="Select block" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="block-a">Block A</SelectItem>
                             <SelectItem value="block-b">Block B</SelectItem>
                             <SelectItem value="block-c">Block C</SelectItem>
                             <SelectItem value="block-d">Block D</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       <div>
                         <Label htmlFor="scheduleArea" className="text-sm font-medium text-gray-700">Area (hectares)</Label>
                         <Input
                           id="scheduleArea"
                           type="number"
                           defaultValue="0.0"
                           step="0.1"
                           className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                         />
                       </div>
                       <div>
                         <Label htmlFor="scheduleFertilizerType" className="text-sm font-medium text-gray-700">Fertilizer Type</Label>
                         <Select>
                           <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                             <SelectValue placeholder="Select fertilizer" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="14-14-14">14-14-14 Complete</SelectItem>
                             <SelectItem value="urea">Urea (46-0-0)</SelectItem>
                             <SelectItem value="npk">NPK 16-16-16</SelectItem>
                             <SelectItem value="organic">Organic Fertilizer</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       <div>
                         <Label htmlFor="applicationRate" className="text-sm font-medium text-gray-700">Application Rate (kg/ha)</Label>
                         <Input
                           id="applicationRate"
                           type="number"
                           defaultValue="300"
                           className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                         />
                       </div>
                       <div>
                         <Label htmlFor="scheduleMethod" className="text-sm font-medium text-gray-700">Application Method</Label>
                         <Select>
                           <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                             <SelectValue placeholder="Select method" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="broadcasting">Broadcasting</SelectItem>
                             <SelectItem value="side-dressing">Side dressing</SelectItem>
                             <SelectItem value="band-application">Band Application</SelectItem>
                             <SelectItem value="foliar">Foliar Spray</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       <div>
                         <Label htmlFor="scheduleDate" className="text-sm font-medium text-gray-700">Application Date</Label>
                         <div className="relative mt-1">
                           <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                           <Input
                             id="scheduleDate"
                             placeholder="Pick a date"
                             className="pl-10 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                           />
                         </div>
                       </div>
                       <div>
                         <Label htmlFor="scheduleCost" className="text-sm font-medium text-gray-700">Cost (₱)</Label>
                         <Input
                           id="scheduleCost"
                           type="number"
                           defaultValue="18000"
                           className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                         />
                       </div>
                       <div>
                         <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">Supplier</Label>
                         <Input
                           id="supplier"
                           defaultValue="Philsaga Mining Corp"
                           className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                         />
                       </div>
                       <div className="md:col-span-2">
                         <Label htmlFor="scheduleNotes" className="text-sm font-medium text-gray-700">Notes</Label>
                         <Textarea
                           id="scheduleNotes"
                           placeholder="Additional notes about application conditions, weather, etc."
                           className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                           rows={3}
                         />
                       </div>
                       <div className="md:col-span-2 flex justify-end">
                         <Button className="bg-green-600 hover:bg-green-700">
                           <Leaf className="h-4 w-4 mr-2" />
                           Schedule Application
                         </Button>
                       </div>
                     </div>
                   </CardContent>
                 </Card>

                 {/* Fertilizer Applications Table */}
                 <Card className="border-gray-200 rounded-xl">
                   <CardHeader>
                     <div className="flex items-center gap-2">
                       <TrendingUp className="h-5 w-5 text-gray-600" />
                       <CardTitle className="text-gray-800 text-lg font-bold">Fertilizer Applications</CardTitle>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <div className="overflow-x-auto">
                       <table className="w-full">
                         <thead>
                           <tr className="border-b border-gray-200">
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">BLOCK</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">FERTILIZER TYPE</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">AREA</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">RATE</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">METHOD</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">DATE</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">COST</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">SUPPLIER</th>
                             <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">STATUS</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                           <tr className="hover:bg-gray-50">
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <MapPin className="h-4 w-4 text-gray-500" />
                                 <span className="text-sm text-gray-700">Block A</span>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">14-14-14 Complete</td>
                             <td className="py-3 px-4 text-sm text-gray-700">3.2 ha</td>
                             <td className="py-3 px-4 text-sm text-gray-700">300 kg/ha</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Broadcasting</td>
                             <td className="py-3 px-4 text-sm text-gray-700">2024-02-01</td>
                             <td className="py-3 px-4 text-sm text-gray-700">₱18,000</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Philsaga Mining Corp</td>
                             <td className="py-3 px-4">
                               <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>
                             </td>
                           </tr>
                           <tr className="hover:bg-gray-50">
                             <td className="py-3 px-4">
                               <div className="flex items-center gap-2">
                                 <MapPin className="h-4 w-4 text-gray-500" />
                                 <span className="text-sm text-gray-700">Block B</span>
                               </div>
                             </td>
                             <td className="py-3 px-4 text-sm text-gray-700">Urea (46-0-0)</td>
                             <td className="py-3 px-4 text-sm text-gray-700">2.8 ha</td>
                             <td className="py-3 px-4 text-sm text-gray-700">150 kg/ha</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Side dressing</td>
                             <td className="py-3 px-4 text-sm text-gray-700">2024-02-05</td>
                             <td className="py-3 px-4 text-sm text-gray-700">₱12,000</td>
                             <td className="py-3 px-4 text-sm text-gray-700">Atlas Fertilizer Corp</td>
                             <td className="py-3 px-4">
                               <Badge className="bg-blue-100 text-blue-700 border-blue-200">Scheduled</Badge>
                             </td>
                           </tr>
                         </tbody>
                       </table>
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>

              {/* Harvesting Tab */}
              <TabsContent value="harvesting" className="space-y-6 mt-6">
                {/* Harvesting KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-green-50 border-green-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Total Yield</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">492.6 tons</div>
                      <p className="text-xs text-farm-green-600">Total harvested yield</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Avg. Yield/Ha</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">81.8 tons</div>
                      <p className="text-xs text-farm-green-600">Average yield per hectare</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Total Revenue</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">₱738,840</div>
                      <p className="text-xs text-farm-green-600">Total harvest revenue</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Avg. Brix</CardTitle>
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                        <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-lg sm:text-2xl font-bold text-farm-green-800">18.1%</div>
                      <p className="text-xs text-farm-green-600">Average sugar content</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Record New Harvest Form */}
                <Card className="border-orange-200 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Scissors className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-orange-800 text-lg font-bold">Record New Harvest</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="harvestBlock" className="text-sm font-medium text-gray-700">Farm Block</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select block" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="block-a">Block A</SelectItem>
                            <SelectItem value="block-b">Block B</SelectItem>
                            <SelectItem value="block-c">Block C</SelectItem>
                            <SelectItem value="block-d">Block D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="harvestArea" className="text-sm font-medium text-gray-700">Area (hectares)</Label>
                        <Input
                          id="harvestArea"
                          type="number"
                          defaultValue="0.0"
                          step="0.1"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="yieldPerHectare" className="text-sm font-medium text-gray-700">Yield per Hectare (tons)</Label>
                        <Input
                          id="yieldPerHectare"
                          type="number"
                          defaultValue="80.0"
                          step="0.1"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="brix" className="text-sm font-medium text-gray-700">Brix (%)</Label>
                        <Input
                          id="brix"
                          type="number"
                          defaultValue="18.0"
                          step="0.1"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pol" className="text-sm font-medium text-gray-700">Pol (%)</Label>
                        <Input
                          id="pol"
                          type="number"
                          defaultValue="14.0"
                          step="0.1"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="purity" className="text-sm font-medium text-gray-700">Purity (%)</Label>
                        <Input
                          id="purity"
                          type="number"
                          defaultValue="75.0"
                          step="0.1"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="harvestMethod" className="text-sm font-medium text-gray-700">Harvest Method</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual Harvesting</SelectItem>
                            <SelectItem value="mechanical">Mechanical Harvesting</SelectItem>
                            <SelectItem value="combine">Combine Harvester</SelectItem>
                            <SelectItem value="chopper">Chopper Harvester</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="millDestination" className="text-sm font-medium text-gray-700">Mill Destination</Label>
                        <Select>
                          <SelectTrigger className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select mill" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mill-1">San Carlos Mill</SelectItem>
                            <SelectItem value="mill-2">Bacolod Mill</SelectItem>
                            <SelectItem value="mill-3">Iloilo Mill</SelectItem>
                            <SelectItem value="mill-4">Negros Mill</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="truckNumber" className="text-sm font-medium text-gray-700">Truck Number</Label>
                        <Input
                          id="truckNumber"
                          defaultValue="ABC-123"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="harvestingCost" className="text-sm font-medium text-gray-700">Harvesting Cost (₱)</Label>
                        <Input
                          id="harvestingCost"
                          type="number"
                          defaultValue="45000"
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="harvestDate" className="text-sm font-medium text-gray-700">Harvest Date</Label>
                        <div className="relative mt-1">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="harvestDate"
                            placeholder="Pick a date"
                            className="pl-10 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="harvestNotes" className="text-sm font-medium text-gray-700">Notes</Label>
                        <Textarea
                          id="harvestNotes"
                          placeholder="Additional notes about harvest conditions, weather, etc."
                          className="mt-1 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <Button className="bg-orange-600 hover:bg-orange-700">
                          <Scissors className="h-4 w-4 mr-2" />
                          Record Harvest
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 rounded-xl shadow-md">
                  <CardHeader>
                    <CardTitle className="text-orange-800 text-xl sm:text-2xl font-bold">Harvesting & Yield</CardTitle>
                    <CardDescription className="text-orange-600 text-sm sm:text-base">
                      Track harvesting activities and yield data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {harvestingData.map((harvest) => (
                        <div key={harvest.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-800">{harvest.block}</h3>
                            <Badge className="bg-green-100 text-green-800">{harvest.quality}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Yield:</span>
                              <span className="font-medium ml-2">{harvest.yield} tons</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Brix:</span>
                              <span className="font-medium ml-2">{harvest.brix}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Revenue:</span>
                              <span className="font-medium ml-2">₱{harvest.revenue.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Profit:</span>
                              <span className="font-medium ml-2 text-green-600">₱{harvest.profit.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">Harvested: {harvest.harvestDate}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Harvest Records Table */}
                <Card className="border-gray-200 rounded-xl">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-gray-600" />
                      <CardTitle className="text-gray-800 text-lg font-bold">Harvest Records</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">BLOCK</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">AREA (HA)</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">HARVEST DATE</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">YIELD (T/HA)</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">TOTAL YIELD (T)</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">QUALITY</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">MILL</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">REVENUE (₱)</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">COST (₱)</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">PROFIT (₱)</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">Block A</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">3.2</td>
                            <td className="py-3 px-4 text-sm text-gray-700">2024-03-15</td>
                            <td className="py-3 px-4 text-sm text-gray-700">85.5</td>
                            <td className="py-3 px-4 text-sm text-gray-700">273.6</td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="text-xs text-gray-600">Brix: 18.5%</div>
                                <div className="text-xs text-gray-600">Pol: 14.2%</div>
                                <div className="text-xs text-gray-600">Purity: 76.8%</div>
                                <div className="w-16 h-6 bg-green-500 rounded-full"></div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                <div>
                                  <div className="text-sm text-gray-700">Central Azucarera Don Pedro</div>
                                  <div className="text-xs text-gray-500">ABC-123</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-green-600 font-medium">₱410,400</td>
                            <td className="py-3 px-4 text-sm text-red-600 font-medium">₱45,000</td>
                            <td className="py-3 px-4 text-sm text-green-600 font-medium">₱365,400</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-green-100 text-green-700 border-green-200">Complete</Badge>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700">Block B</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">2.8</td>
                            <td className="py-3 px-4 text-sm text-gray-700">2024-03-20</td>
                            <td className="py-3 px-4 text-sm text-gray-700">78.2</td>
                            <td className="py-3 px-4 text-sm text-gray-700">219.0</td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="text-xs text-gray-600">Brix: 17.8%</div>
                                <div className="text-xs text-gray-600">Pol: 13.8%</div>
                                <div className="text-xs text-gray-600">Purity: 77.5%</div>
                                <Badge className="bg-green-500 text-white text-xs">Grade B</Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                <div>
                                  <div className="text-sm text-gray-700">Victorias Milling Company</div>
                                  <div className="text-xs text-gray-500">DEF-456</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-green-600 font-medium">₱328,440</td>
                            <td className="py-3 px-4 text-sm text-red-600 font-medium">₱38,000</td>
                            <td className="py-3 px-4 text-sm text-green-600 font-medium">₱290,440</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">In-transit</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 
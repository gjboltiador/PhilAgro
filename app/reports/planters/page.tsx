"use client"

import { DashboardLayout } from "@/components/sidebar-navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  BarChart3, 
  TrendingUp,
  DollarSign,
  Package,
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Scale,
  Truck,
  Sprout,
  CreditCard,
  Gift,
  Navigation,
  AlertCircle,
  CheckCircle,
  Clock,
  Wheat
} from "lucide-react"
import { useState } from "react"

interface ProductionData {
  id: string
  planterName: string
  farmLocation: string
  harvestDate: string
  grossCane: number
  netCane: number
  sugarContent: number
  molassesContent: number
  trashContent: number
  status: "processing" | "completed" | "pending"
}

interface PesadaData {
  id: string
  planterName: string
  pesadaNumber: string
  weighingDate: string
  grossWeight: number
  tareWeight: number
  netWeight: number
  vehiclePlate: string
  driverName: string
  status: "weighed" | "processed" | "completed"
}

interface BillingData {
  id: string
  planterName: string
  grossAmount: number
  deductions: {
    equipmentRental: number
    fertilizer: number
    loans: number
    processing: number
    transportation: number
  }
  netAmount: number
  paymentStatus: "pending" | "partial" | "completed"
}

// Detailed sugar production data for the first tab
const detailedProductionData = [
  {
    sugarMill: "URSUMCO",
    planterCode: "HDJ/Abuso, Mercy R.",
    planterName: "Abuso, Mercy R.",
    location: "Danawan, Mabinay",
    truckPlateNo: "ML B10",
    grossWeight: 22.940,
    tareWeight: 15.740,
    grossCane: 7.200,
    trashPercent: 3,
    tonsTrash: 0.216,
    netWeight: 6.984,
    temp: "",
    polRdg: 69.7,
    brix: 21.4,
    corBrix: 21.4,
    polPercent: 18.7,
    appPty: 87.4,
    lkgTc: 13.69,
    calculatedSugar: 13.69,
    tonsBrix: 1.495,
    tonsPol: 1.168,
    tonsMol: 0.327,
    caneType: "FC",
    dateTime: "01/01/1900 14:40",
    status: "completed"
  },
  {
    sugarMill: "SONEDCO",
    planterCode: "HDJ/Acabal, Maximiano C.",
    planterName: "Acabal, Maximiano C.",
    location: "Lapay, Bayawan City",
    truckPlateNo: "GBU 472",
    grossWeight: 25.120,
    tareWeight: 16.800,
    grossCane: 8.320,
    trashPercent: 6,
    tonsTrash: 0.499,
    netWeight: 7.821,
    temp: "",
    polRdg: 71.2,
    brix: 22.1,
    corBrix: 22.1,
    polPercent: 19.2,
    appPty: 86.9,
    lkgTc: 14.85,
    calculatedSugar: 14.85,
    tonsBrix: 1.839,
    tonsPol: 1.502,
    tonsMol: 0.337,
    caneType: "FC",
    dateTime: "01/01/1900 18:15",
    status: "completed"
  },
  {
    sugarMill: "TOLONG",
    planterCode: "HDJ/Aguilar, Harry N.",
    planterName: "Aguilar, Harry N.",
    location: "Villasol, Bayawan City",
    truckPlateNo: "TRB B3",
    grossWeight: 28.450,
    tareWeight: 17.200,
    grossCane: 11.250,
    trashPercent: 4,
    tonsTrash: 0.450,
    netWeight: 10.800,
    temp: "",
    polRdg: 70.8,
    brix: 21.8,
    corBrix: 21.8,
    polPercent: 19.0,
    appPty: 87.2,
    lkgTc: 14.25,
    calculatedSugar: 14.25,
    tonsBrix: 2.453,
    tonsPol: 1.938,
    tonsMol: 0.515,
    caneType: "FC",
    dateTime: "01/01/1900 19:25",
    status: "processing"
  },
  {
    sugarMill: "BUGAY",
    planterCode: "HDJ/Angca, Restituto O.",
    planterName: "Angca, Restituto O.",
    location: "Ganas, Tara, Mabinay",
    truckPlateNo: "TCP-835",
    grossWeight: 30.200,
    tareWeight: 15.475,
    grossCane: 14.725,
    trashPercent: 6,
    tonsTrash: 0.883,
    netWeight: 13.842,
    temp: "",
    polRdg: 72.5,
    brix: 23.2,
    corBrix: 23.2,
    polPercent: 20.1,
    appPty: 86.6,
    lkgTc: 16.85,
    calculatedSugar: 27.68,
    tonsBrix: 3.184,
    tonsPol: 2.421,
    tonsMol: 0.763,
    caneType: "FC",
    dateTime: "01/01/1900 19:50",
    status: "completed"
  },
  {
    sugarMill: "CAB",
    planterCode: "HDJ/Angca, Restituto O.",
    planterName: "Angca, Restituto O.",
    location: "Ganas, Tara, Mabinay",
    truckPlateNo: "TCP358",
    grossWeight: 32.100,
    tareWeight: 16.200,
    grossCane: 15.900,
    trashPercent: 5,
    tonsTrash: 0.795,
    netWeight: 15.105,
    temp: "",
    polRdg: 73.1,
    brix: 23.8,
    corBrix: 23.8,
    polPercent: 20.8,
    appPty: 87.4,
    lkgTc: 17.95,
    calculatedSugar: 32.71,
    tonsBrix: 3.592,
    tonsPol: 2.814,
    tonsMol: 0.778,
    caneType: "FC",
    dateTime: "01/01/1900 01:50",
    status: "completed"
  },
  {
    sugarMill: "URSUMCO",
    planterCode: "HDJ/Ayunting, Myrna R.",
    planterName: "Ayunting, Myrna R.",
    location: "Banaybanay, Bayawan City",
    truckPlateNo: "GHN-467",
    grossWeight: 26.800,
    tareWeight: 15.600,
    grossCane: 11.200,
    trashPercent: 3,
    tonsTrash: 0.336,
    netWeight: 10.864,
    temp: "",
    polRdg: 71.8,
    brix: 22.5,
    corBrix: 22.5,
    polPercent: 19.5,
    appPty: 86.7,
    lkgTc: 15.20,
    calculatedSugar: 15.20,
    tonsBrix: 2.520,
    tonsPol: 1.993,
    tonsMol: 0.527,
    caneType: "FC",
    dateTime: "01/01/1900 06:50",
    status: "pending"
  },
  {
    sugarMill: "SONEDCO",
    planterCode: "HDJ/Baal, Rosalie L.",
    planterName: "Baal, Rosalie L.",
    location: "Banaybanay, Bayawan City",
    truckPlateNo: "NDW 861",
    grossWeight: 31.500,
    tareWeight: 16.700,
    grossCane: 14.800,
    trashPercent: 6,
    tonsTrash: 0.888,
    netWeight: 13.912,
    temp: "",
    polRdg: 72.8,
    brix: 23.5,
    corBrix: 23.5,
    polPercent: 20.1,
    appPty: 85.5,
    lkgTc: 17.20,
    calculatedSugar: 29.77,
    tonsBrix: 3.339,
    tonsPol: 2.570,
    tonsMol: 0.769,
    caneType: "FC",
    dateTime: "01/01/1900 03:15",
    status: "completed"
  }
]

export default function PlantersProductionReport() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for other tabs
  const productionData: ProductionData[] = [
    {
      id: "PRD-001",
      planterName: "Juan Dela Cruz",
      farmLocation: "Farm A - Tarlac",
      harvestDate: "2024-01-15",
      grossCane: 150.5,
      netCane: 142.3,
      sugarContent: 12.5,
      molassesContent: 3.2,
      trashContent: 2.1,
      status: "completed"
    },
    {
      id: "PRD-002",
      planterName: "Maria Santos",
      farmLocation: "Farm B - Batangas",
      harvestDate: "2024-01-18",
      grossCane: 200.8,
      netCane: 189.2,
      sugarContent: 13.1,
      molassesContent: 3.5,
      trashContent: 1.8,
      status: "processing"
    }
  ]

  const pesadaData: PesadaData[] = [
    {
      id: "PES-001",
      planterName: "Juan Dela Cruz",
      pesadaNumber: "PES-2024-001",
      weighingDate: "2024-01-15",
      grossWeight: 25.5,
      tareWeight: 8.2,
      netWeight: 17.3,
      vehiclePlate: "ABC-1234",
      driverName: "Pedro Reyes",
      status: "completed"
    },
    {
      id: "PES-002",
      planterName: "Maria Santos",
      pesadaNumber: "PES-2024-002",
      weighingDate: "2024-01-18",
      grossWeight: 30.2,
      tareWeight: 9.1,
      netWeight: 21.1,
      vehiclePlate: "DEF-5678",
      driverName: "Carlos Cruz",
      status: "processed"
    }
  ]

  const billingData: BillingData[] = [
    {
      id: "BIL-001",
      planterName: "Juan Dela Cruz",
      grossAmount: 45000,
      deductions: {
        equipmentRental: 5000,
        fertilizer: 3000,
        loans: 2000,
        processing: 1500,
        transportation: 1000
      },
      netAmount: 32500,
      paymentStatus: "completed"
    },
    {
      id: "BIL-002",
      planterName: "Maria Santos",
      grossAmount: 60000,
      deductions: {
        equipmentRental: 6000,
        fertilizer: 4000,
        loans: 3000,
        processing: 2000,
        transportation: 1500
      },
      netAmount: 43500,
      paymentStatus: "partial"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-200 text-blue-800">Processing</Badge>
      case "pending":
        return <Badge className="bg-yellow-200 text-yellow-800">Pending</Badge>
      case "weighed":
        return <Badge className="bg-green-500 text-white">Weighed</Badge>
      case "processed":
        return <Badge className="bg-blue-200 text-blue-800">Processed</Badge>
      case "partial":
        return <Badge className="bg-orange-200 text-orange-800">Partial</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const stats = {
    totalProduction: 1250.5,
    netCane: 1180.2,
    sugarProduction: 147.8,
    molassesProduction: 37.9,
    averageTrashContent: 2.1,
    totalRevenue: 1250000,
    totalDeductions: 180000,
    netEarnings: 1070000
  }

  return (
    <ProtectedRoute requiredPermission="production_reports">
    <DashboardLayout>
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-farm-green-800">Planters Production Report</h1>
            <p className="text-sm sm:text-base text-farm-green-600">Manage sugar production, molasses, and financial tracking</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-farm-green-200 text-gray-700 hover:bg-farm-green-50 rounded-lg px-4 py-2 text-xs sm:text-sm">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export Report</span>
              <span className="sm:hidden">Export</span>
            </Button>
            <Button className="bg-farm-green-600 hover:bg-farm-green-700 text-white rounded-lg px-4 py-2 text-xs sm:text-sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">+ Add Production</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-green-50 border-green-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Total Production</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-farm-green-800">{stats.totalProduction.toLocaleString()} tons</div>
              <p className="text-xs text-farm-green-600">Gross cane production</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Net Cane</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-farm-green-800">{stats.netCane.toLocaleString()} tons</div>
              <p className="text-xs text-farm-green-600">After deductions</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Sugar Production</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-farm-green-800">{stats.sugarProduction.toLocaleString()} tons</div>
              <p className="text-xs text-farm-green-600">Total sugar output</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200 rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-800">Net Earnings</CardTitle>
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-farm-green-800">₱{stats.netEarnings.toLocaleString()}</div>
              <p className="text-xs text-farm-green-600">After all deductions</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-5 border border-farm-green-200 p-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="sugar-molasses" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Sugar & Molasses
            </TabsTrigger>
            <TabsTrigger 
              value="quality" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Quality
            </TabsTrigger>
            <TabsTrigger 
              value="pesada" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Pesada
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="data-[state=active]:bg-farm-green-500 data-[state=active]:text-white"
            >
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Production Overview Tab - Detailed Sugar Production */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-green-200 rounded-xl shadow-md">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-farm-green-800 text-xl sm:text-2xl font-bold">
                      Detailed Sugar Production Report
                    </CardTitle>
                    <CardDescription className="text-farm-green-600 text-sm sm:text-base">
                      Comprehensive sugar production tracking with laboratory analysis
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search planters..."
                        className="pl-10 w-full sm:w-64 border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="border-farm-green-200">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left p-3 font-medium text-gray-700">Plant or Sugar Mill</th>
                          <th className="text-left p-3 font-medium text-gray-700">Planter Code</th>
                          <th className="text-left p-3 font-medium text-gray-700">Planter's Name</th>
                          <th className="text-left p-3 font-medium text-gray-700">Location</th>
                          <th className="text-left p-3 font-medium text-gray-700">Truck Plate No.</th>
                          <th className="text-left p-3 font-medium text-gray-700">Gross Weight</th>
                          <th className="text-left p-3 font-medium text-gray-700">Tare Weight</th>
                          <th className="text-left p-3 font-medium text-gray-700">Gross Cane</th>
                          <th className="text-left p-3 font-medium text-gray-700">% Trash</th>
                          <th className="text-left p-3 font-medium text-gray-700">Tons Trash</th>
                          <th className="text-left p-3 font-medium text-gray-700">Net Weight</th>
                          <th className="text-left p-3 font-medium text-gray-700">Temp</th>
                          <th className="text-left p-3 font-medium text-gray-700">Pol Rdg</th>
                          <th className="text-left p-3 font-medium text-gray-700">Brix</th>
                          <th className="text-left p-3 font-medium text-gray-700">Cor Brix</th>
                          <th className="text-left p-3 font-medium text-gray-700">% Pol</th>
                          <th className="text-left p-3 font-medium text-gray-700">App Pty</th>
                          <th className="text-left p-3 font-medium text-gray-700">LKg/TC</th>
                          <th className="text-left p-3 font-medium text-gray-700">Calculated Sugar</th>
                          <th className="text-left p-3 font-medium text-gray-700">Tons Brix</th>
                          <th className="text-left p-3 font-medium text-gray-700">Tons Pol</th>
                          <th className="text-left p-3 font-medium text-gray-700">Tons Mol</th>
                          <th className="text-left p-3 font-medium text-gray-700">Cane Type</th>
                          <th className="text-left p-3 font-medium text-gray-700">Date Time</th>
                          <th className="text-left p-3 font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedProductionData.map((entry, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 text-gray-900 font-medium">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {entry.sugarMill}
                              </Badge>
                            </td>
                            <td className="p-3 text-gray-900 font-medium">{entry.planterCode}</td>
                            <td className="p-3 text-gray-900">{entry.planterName}</td>
                            <td className="p-3 text-gray-700">{entry.location}</td>
                            <td className="p-3 text-gray-900 font-medium">{entry.truckPlateNo}</td>
                            <td className="p-3 text-gray-700">{entry.grossWeight.toFixed(3)}</td>
                            <td className="p-3 text-gray-700">{entry.tareWeight.toFixed(3)}</td>
                            <td className="p-3 text-gray-900 font-medium">{entry.grossCane.toFixed(3)}</td>
                            <td className="p-3 text-gray-700">{entry.trashPercent}%</td>
                            <td className="p-3 text-gray-700">{entry.tonsTrash.toFixed(3)}</td>
                            <td className="p-3 text-gray-900 font-medium">{entry.netWeight.toFixed(3)}</td>
                            <td className="p-3 text-gray-500">{entry.temp || "-"}</td>
                            <td className="p-3 text-gray-700">{entry.polRdg.toFixed(1)}</td>
                            <td className="p-3 text-gray-700">{entry.brix.toFixed(1)}</td>
                            <td className="p-3 text-gray-700">{entry.corBrix.toFixed(1)}</td>
                            <td className="p-3 text-gray-700">{entry.polPercent.toFixed(1)}%</td>
                            <td className="p-3 text-gray-700">{entry.appPty.toFixed(1)}</td>
                            <td className="p-3 text-gray-700">{entry.lkgTc.toFixed(2)}</td>
                            <td className="p-3 text-green-700 font-medium">{entry.calculatedSugar.toFixed(2)}</td>
                            <td className="p-3 text-gray-700">{entry.tonsBrix.toFixed(3)}</td>
                            <td className="p-3 text-gray-700">{entry.tonsPol.toFixed(3)}</td>
                            <td className="p-3 text-gray-700">{entry.tonsMol.toFixed(3)}</td>
                            <td className="p-3">
                              <Badge variant={entry.caneType === "FC" ? "default" : "secondary"} className="text-xs">
                                {entry.caneType}
                              </Badge>
                            </td>
                            <td className="p-3 text-gray-600 text-xs">{entry.dateTime}</td>
                            <td className="p-3">
                              <Badge 
                                variant={
                                  entry.status === "completed" ? "default" : 
                                  entry.status === "processing" ? "secondary" : "outline"
                                }
                                className={
                                  entry.status === "completed" ? "bg-green-100 text-green-800" :
                                  entry.status === "processing" ? "bg-blue-100 text-blue-800" :
                                  "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {entry.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-3 p-3">
                    {detailedProductionData.map((entry, index) => (
                      <Card key={index} className="border-green-200 hover:bg-green-50/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                  <Wheat className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">{entry.planterName}</h3>
                                  <p className="text-sm text-gray-600">{entry.planterCode}</p>
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 mt-1">
                                    {entry.sugarMill}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-green-600 font-medium">Location:</span>
                                  <p className="text-gray-700">{entry.location}</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Truck:</span>
                                  <p className="text-gray-700">{entry.truckPlateNo}</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Net Weight:</span>
                                  <p className="text-gray-700 font-medium">{entry.netWeight.toFixed(3)} tons</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Sugar:</span>
                                  <p className="text-green-700 font-medium">{entry.calculatedSugar.toFixed(2)} tons</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Cane Type:</span>
                                  <div className="mt-1">
                                    <Badge variant={entry.caneType === "FC" ? "default" : "secondary"} className="text-xs">
                                      {entry.caneType}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Status:</span>
                                  <div className="mt-1">
                                    <Badge 
                                      variant={
                                        entry.status === "completed" ? "default" : 
                                        entry.status === "processing" ? "secondary" : "outline"
                                      }
                                      className={
                                        entry.status === "completed" ? "bg-green-100 text-green-800" :
                                        entry.status === "processing" ? "bg-blue-100 text-blue-800" :
                                        "bg-yellow-100 text-yellow-800"
                                      }
                                    >
                                      {entry.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-500">
                                {entry.dateTime}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sugar & Molasses Tab */}
          <TabsContent value="sugar-molasses" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-yellow-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-yellow-800 text-xl sm:text-2xl font-bold">
                  Sugar & Molasses Production
                </CardTitle>
                <CardDescription className="text-yellow-600 text-sm sm:text-base">
                  Track sugar and molasses production metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-800">Sugar Production</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-800">Total Sugar Yield</span>
                        <span className="text-lg font-bold text-yellow-800">{stats.sugarProduction} tons</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-yellow-600">Average Sugar Content</span>
                        <span className="text-sm font-medium text-yellow-800">12.8%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-yellow-600">Processing Efficiency</span>
                        <span className="text-sm font-medium text-yellow-800">94.2%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-yellow-800">Molasses Production</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-800">Total Molasses Yield</span>
                        <span className="text-lg font-bold text-yellow-800">{stats.molassesProduction} tons</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-yellow-600">Average Molasses Content</span>
                        <span className="text-sm font-medium text-yellow-800">3.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-yellow-600">Quality Grade</span>
                        <span className="text-sm font-medium text-yellow-800">A+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Metrics Tab */}
          <TabsContent value="quality" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-blue-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-blue-800 text-xl sm:text-2xl font-bold">
                  Quality Metrics & Analysis
                </CardTitle>
                <CardDescription className="text-blue-600 text-sm sm:text-base">
                  Trash content analysis and quality grading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-800">Trash Content Analysis</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800">Average Trash Content</span>
                        <span className="text-lg font-bold text-blue-800">{stats.averageTrashContent}%</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-600">Acceptable Range</span>
                        <span className="text-sm font-medium text-blue-800">≤ 3.0%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">Rejection Rate</span>
                        <span className="text-sm font-medium text-blue-800">2.1%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-800">Quality Standards</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800">Sugar Quality Grade</span>
                        <span className="text-sm font-medium text-blue-800">Premium</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-600">Brix Measurement</span>
                        <span className="text-sm font-medium text-blue-800">18.5°</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">Purity Level</span>
                        <span className="text-sm font-medium text-blue-800">96.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pesada Buying Tab */}
          <TabsContent value="pesada" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-orange-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-orange-800 text-xl sm:text-2xl font-bold">
                  Pesada Buying Station
                </CardTitle>
                <CardDescription className="text-orange-600 text-sm sm:text-base">
                  Weighing station data and batch tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-orange-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Pesada #</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Planter</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Weighing Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Gross Weight</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Tare Weight</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Net Weight</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Vehicle</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Driver</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pesadaData.map((pesada) => (
                        <tr key={pesada.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{pesada.pesadaNumber}</td>
                          <td className="py-3 px-4 text-gray-700">{pesada.planterName}</td>
                          <td className="py-3 px-4 text-gray-700">{pesada.weighingDate}</td>
                          <td className="py-3 px-4 text-gray-700">{pesada.grossWeight} tons</td>
                          <td className="py-3 px-4 text-gray-700">{pesada.tareWeight} tons</td>
                          <td className="py-3 px-4 text-gray-700">{pesada.netWeight} tons</td>
                          <td className="py-3 px-4 text-gray-700">{pesada.vehiclePlate}</td>
                          <td className="py-3 px-4 text-gray-700">{pesada.driverName}</td>
                          <td className="py-3 px-4">
                            {getStatusBadge(pesada.status)}
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-green-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-green-800 text-xl sm:text-2xl font-bold">
                  Billing & Deductions Summary
                </CardTitle>
                <CardDescription className="text-green-600 text-sm sm:text-base">
                  Complete financial breakdown and payment tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-green-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Planter</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Gross Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Equipment Rental</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Fertilizer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Loans</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Processing</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Transportation</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Net Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingData.map((billing) => (
                        <tr key={billing.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-800">{billing.planterName}</td>
                          <td className="py-3 px-4 text-gray-700">₱{billing.grossAmount.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-700">₱{billing.deductions.equipmentRental.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-700">₱{billing.deductions.fertilizer.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-700">₱{billing.deductions.loans.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-700">₱{billing.deductions.processing.toLocaleString()}</td>
                          <td className="py-3 px-4 text-gray-700">₱{billing.deductions.transportation.toLocaleString()}</td>
                          <td className="py-3 px-4 font-medium text-gray-800">₱{billing.netAmount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {getStatusBadge(billing.paymentStatus)}
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  )
} 
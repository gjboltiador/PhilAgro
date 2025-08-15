"use client"

import { DashboardLayout } from "@/components/sidebar-navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  MapPin,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  LineChart,
  PieChart,
  AlertCircle,
  CheckCircle,
  Clock,
  Building
} from "lucide-react"
import { useState } from "react"

interface SugarPrice {
  id: string
  sugarMill: string
  weekEnding: string
  rawSugarPrice: number
  refinedSugarPrice: number
  molassesPrice: number
  trend: "up" | "down" | "stable"
  change: number
  changePercent: number
  volume: number
  lastUpdated: string
}

interface MarketTrend {
  period: string
  averagePrice: number
  volume: number
  trend: "up" | "down" | "stable"
}

export default function SugarPricesPage() {
  const [activeTab, setActiveTab] = useState("current")
  const [selectedMill, setSelectedMill] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("week")

  // Mock sugar price data
  const sugarPrices: SugarPrice[] = [
    {
      id: "SP-001",
      sugarMill: "URSUMCO",
      weekEnding: "2024-01-20",
      rawSugarPrice: 1850.00,
      refinedSugarPrice: 2100.00,
      molassesPrice: 850.00,
      trend: "up",
      change: 25.00,
      changePercent: 1.37,
      volume: 1250,
      lastUpdated: "2024-01-20T10:30:00Z"
    },
    {
      id: "SP-002",
      sugarMill: "SONEDCO",
      weekEnding: "2024-01-20",
      rawSugarPrice: 1820.00,
      refinedSugarPrice: 2080.00,
      molassesPrice: 820.00,
      trend: "down",
      change: -15.00,
      changePercent: -0.82,
      volume: 980,
      lastUpdated: "2024-01-20T10:30:00Z"
    },
    {
      id: "SP-003",
      sugarMill: "TOLONG",
      weekEnding: "2024-01-20",
      rawSugarPrice: 1880.00,
      refinedSugarPrice: 2120.00,
      molassesPrice: 880.00,
      trend: "up",
      change: 35.00,
      changePercent: 1.89,
      volume: 750,
      lastUpdated: "2024-01-20T10:30:00Z"
    },
    {
      id: "SP-004",
      sugarMill: "BUGAY",
      weekEnding: "2024-01-20",
      rawSugarPrice: 1800.00,
      refinedSugarPrice: 2050.00,
      molassesPrice: 800.00,
      trend: "stable",
      change: 0.00,
      changePercent: 0.00,
      volume: 650,
      lastUpdated: "2024-01-20T10:30:00Z"
    },
    {
      id: "SP-005",
      sugarMill: "CAB",
      weekEnding: "2024-01-20",
      rawSugarPrice: 1870.00,
      refinedSugarPrice: 2110.00,
      molassesPrice: 870.00,
      trend: "up",
      change: 20.00,
      changePercent: 1.08,
      volume: 890,
      lastUpdated: "2024-01-20T10:30:00Z"
    }
  ]

  const marketTrends: MarketTrend[] = [
    { period: "This Week", averagePrice: 1844.00, volume: 4520, trend: "up" },
    { period: "Last Week", averagePrice: 1820.00, volume: 4380, trend: "up" },
    { period: "This Month", averagePrice: 1815.00, volume: 18500, trend: "up" },
    { period: "Last Month", averagePrice: 1790.00, volume: 17200, trend: "down" }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "up":
        return <Badge className="bg-green-100 text-green-800">↗ Up</Badge>
      case "down":
        return <Badge className="bg-red-100 text-red-800">↘ Down</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">→ Stable</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <ProtectedRoute requiredPermission="price_lists">
      <DashboardLayout>
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-green-800">Sugar Price List</h1>
              <p className="text-sm sm:text-base text-green-600">Real-time sugar prices and market trends</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Price History</span>
                <span className="sm:hidden">History</span>
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export Prices</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>

          {/* Market Overview Cards */}
          <div className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
            <Card className="bg-green-50 border-green-200 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-green-800">Average Raw Sugar</CardTitle>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-green-200">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-green-800">₱1,844.00</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +1.32% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-blue-800">Average Refined Sugar</CardTitle>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-blue-200">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-blue-800">₱2,092.00</div>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +1.45% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-orange-800">Total Volume</CardTitle>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-orange-200">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-orange-800">4,520 MT</div>
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +3.2% from last week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-purple-800">Active Mills</CardTitle>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-purple-200">
                  <Building className="h-4 w-4 sm:h-5 sm:w-5 text-purple-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-purple-800">5</div>
                <p className="text-xs text-purple-600">All mills reporting</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 border border-green-200 p-1">
              <TabsTrigger value="current" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <DollarSign className="h-4 w-4 mr-2" />
                Current Prices
              </TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Market Trends
              </TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Price Analysis
              </TabsTrigger>
            </TabsList>

            {/* Current Prices Tab */}
            <TabsContent value="current" className="space-y-4 mt-6">
              {/* Filters */}
              <Card className="border-green-200 rounded-xl">
                <CardHeader>
                  <CardTitle className="text-green-800">Price Filters</CardTitle>
                  <CardDescription>Filter prices by sugar mill and time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="mill-filter" className="text-sm font-medium text-gray-700">Sugar Mill</Label>
                      <Select value={selectedMill} onValueChange={setSelectedMill}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="All Mills" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sugar Mills</SelectItem>
                          <SelectItem value="URSUMCO">URSUMCO</SelectItem>
                          <SelectItem value="SONEDCO">SONEDCO</SelectItem>
                          <SelectItem value="TOLONG">TOLONG</SelectItem>
                          <SelectItem value="BUGAY">BUGAY</SelectItem>
                          <SelectItem value="CAB">CAB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="period-filter" className="text-sm font-medium text-gray-700">Time Period</Label>
                      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Prices
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Table */}
              <Card className="border-gray-200 rounded-xl">
                <CardHeader>
                  <CardTitle>Current Sugar Prices</CardTitle>
                  <CardDescription>Latest prices as of {new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-green-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Sugar Mill</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Week Ending</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Raw Sugar</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Refined Sugar</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Molasses</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Trend</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Change</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Volume (MT)</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sugarPrices.map((price) => (
                          <tr key={price.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-800">{price.sugarMill}</td>
                            <td className="py-3 px-4 text-gray-700">{new Date(price.weekEnding).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-gray-700 font-medium">{formatCurrency(price.rawSugarPrice)}</td>
                            <td className="py-3 px-4 text-gray-700 font-medium">{formatCurrency(price.refinedSugarPrice)}</td>
                            <td className="py-3 px-4 text-gray-700 font-medium">{formatCurrency(price.molassesPrice)}</td>
                            <td className="py-3 px-4">{getTrendBadge(price.trend)}</td>
                            <td className="py-3 px-4 text-gray-700">
                              <span className={`font-medium ${price.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {price.change >= 0 ? '+' : ''}{formatCurrency(price.change)}
                              </span>
                              <div className="text-xs text-gray-500">
                                ({price.changePercent >= 0 ? '+' : ''}{price.changePercent}%)
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-700">{price.volume.toLocaleString()}</td>
                            <td className="py-3 px-4 text-gray-700">
                              {new Date(price.lastUpdated).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Market Trends Tab */}
            <TabsContent value="trends" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Overview */}
                <Card className="border-green-200 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-green-800">Market Trend Overview</CardTitle>
                    <CardDescription>Price trends over different time periods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketTrends.map((trend, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {getTrendIcon(trend.trend)}
                            <div>
                              <div className="font-medium text-gray-900">{trend.period}</div>
                              <div className="text-sm text-gray-600">Volume: {trend.volume.toLocaleString()} MT</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-900">{formatCurrency(trend.averagePrice)}</div>
                            <div className="text-sm text-gray-600">Average Price</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Price Comparison */}
                <Card className="border-green-200 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-green-800">Price Comparison</CardTitle>
                    <CardDescription>Compare prices across different sugar mills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sugarPrices.slice(0, 3).map((price) => (
                        <div key={price.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Building className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium text-gray-900">{price.sugarMill}</div>
                              <div className="text-sm text-gray-600">Raw Sugar</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-900">{formatCurrency(price.rawSugarPrice)}</div>
                            <div className={`text-sm ${price.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {price.change >= 0 ? '+' : ''}{price.changePercent}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Price Analysis Tab */}
            <TabsContent value="analysis" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Price Distribution */}
                <Card className="border-green-200 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-green-800">Price Distribution</CardTitle>
                    <CardDescription>Raw sugar price ranges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Highest</span>
                        <span className="font-medium text-green-600">₱1,880.00 (TOLONG)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average</span>
                        <span className="font-medium text-blue-600">₱1,844.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Lowest</span>
                        <span className="font-medium text-red-600">₱1,800.00 (BUGAY)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Range</span>
                        <span className="font-medium text-gray-900">₱80.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Indicators */}
                <Card className="border-green-200 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-green-800">Market Indicators</CardTitle>
                    <CardDescription>Key market metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Market Volatility</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Supply Status</span>
                        <Badge className="bg-green-100 text-green-800">Stable</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Demand Trend</span>
                        <Badge className="bg-blue-100 text-blue-800">Increasing</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Price Stability</span>
                        <Badge className="bg-green-100 text-green-800">Good</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Forecast */}
                <Card className="border-green-200 rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-green-800">Price Forecast</CardTitle>
                    <CardDescription>Next week's projected prices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Raw Sugar</span>
                        <span className="font-medium text-green-600">₱1,860.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Refined Sugar</span>
                        <span className="font-medium text-blue-600">₱2,110.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Molasses</span>
                        <span className="font-medium text-orange-600">₱860.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Trend</span>
                        <Badge className="bg-green-100 text-green-800">↗ Upward</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
} 
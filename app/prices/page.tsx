"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Bell, Download, RefreshCw, TrendingDown, TrendingUp } from "lucide-react"
import { SugarPriceChart } from "@/components/sugar-price-chart"
import { PriceAlerts } from "@/components/price-alerts"

export default function SugarPricesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("1month")
  const [selectedGrade, setSelectedGrade] = useState("all")

  const currentPrices = [
    {
      grade: "Raw Sugar",
      currentPrice: 2850,
      previousPrice: 2780,
      change: 2.5,
      volume: "1,250 MT",
      lastUpdated: "Jul 12, 2024 - 3:30 PM",
      market: "Manila",
    },
    {
      grade: "Refined Sugar",
      currentPrice: 3200,
      previousPrice: 3150,
      change: 1.6,
      volume: "890 MT",
      lastUpdated: "Jul 12, 2024 - 3:30 PM",
      market: "Manila",
    },
    {
      grade: "Brown Sugar",
      currentPrice: 2950,
      previousPrice: 3000,
      change: -1.7,
      volume: "650 MT",
      lastUpdated: "Jul 12, 2024 - 3:30 PM",
      market: "Manila",
    },
    {
      grade: "Muscovado",
      currentPrice: 3500,
      previousPrice: 3450,
      change: 1.4,
      volume: "320 MT",
      lastUpdated: "Jul 12, 2024 - 3:30 PM",
      market: "Bacolod",
    },
  ]

  const weeklyData = [
    { week: "Week 1 - Jul", rawSugar: 2780, refinedSugar: 3150, brownSugar: 3000 },
    { week: "Week 2 - Jul", rawSugar: 2820, refinedSugar: 3180, brownSugar: 2980 },
    { week: "Week 3 - Jul", rawSugar: 2850, refinedSugar: 3200, brownSugar: 2950 },
  ]

  const priceHistory = [
    { date: "Jul 12, 2024", rawSugar: 2850, refinedSugar: 3200, brownSugar: 2950, muscovado: 3500 },
    { date: "Jul 11, 2024", rawSugar: 2830, refinedSugar: 3180, brownSugar: 2970, muscovado: 3480 },
    { date: "Jul 10, 2024", rawSugar: 2810, refinedSugar: 3160, brownSugar: 2990, muscovado: 3460 },
    { date: "Jul 9, 2024", rawSugar: 2800, refinedSugar: 3150, brownSugar: 3000, muscovado: 3450 },
    { date: "Jul 8, 2024", rawSugar: 2780, refinedSugar: 3140, brownSugar: 3010, muscovado: 3440 },
  ]

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Sugar Prices Monitoring</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Prices
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button size="sm">
              <Bell className="mr-2 h-4 w-4" />
              Set Price Alert
            </Button>
          </div>
        </div>

        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertTitle>Market Update</AlertTitle>
          <AlertDescription>
            Sugar prices have shown an upward trend this week, with raw sugar increasing by 2.5%. Market conditions
            remain favorable for planters.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱3,125</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +1.8% from last week
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Highest Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱3,500</div>
              <p className="text-xs text-muted-foreground">Muscovado - Bacolod</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,110 MT</div>
              <p className="text-xs text-muted-foreground">Today's trading volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Market Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="text-sm">Active</Badge>
              <p className="text-xs text-muted-foreground mt-1">Last updated: 3:30 PM</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="space-y-4">
          <TabsList>
            <TabsTrigger value="current">Current Prices</TabsTrigger>
            <TabsTrigger value="trends">Price Trends</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Sugar Prices</CardTitle>
                <CardDescription>Real-time sugar prices across different grades and markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Grade</TableHead>
                          <TableHead>Current Price</TableHead>
                          <TableHead>Previous Price</TableHead>
                          <TableHead>Change</TableHead>
                          <TableHead>Volume</TableHead>
                          <TableHead>Market</TableHead>
                          <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPrices.map((price) => (
                          <TableRow key={price.grade}>
                            <TableCell className="font-medium">{price.grade}</TableCell>
                            <TableCell className="font-bold">₱{price.currentPrice.toLocaleString()}</TableCell>
                            <TableCell>₱{price.previousPrice.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {price.change > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-red-600" />
                                )}
                                <Badge variant={price.change > 0 ? "default" : "destructive"} className="text-xs">
                                  {price.change > 0 ? "+" : ""}
                                  {price.change}%
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{price.volume}</TableCell>
                            <TableCell>{price.market}</TableCell>
                            <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                              {price.lastUpdated}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-3 p-3">
                    {currentPrices.map((price) => (
                      <Card key={price.grade} className="border-gray-200 hover:bg-gray-50/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                  <TrendingUp className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">{price.grade}</h3>
                                  <p className="text-sm text-gray-600">{price.market}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-blue-600 font-medium">Current:</span>
                                  <p className="text-lg font-bold text-gray-800">₱{price.currentPrice.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-blue-600 font-medium">Previous:</span>
                                  <p className="text-gray-700">₱{price.previousPrice.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-blue-600 font-medium">Volume:</span>
                                  <p className="text-gray-700">{price.volume}</p>
                                </div>
                                <div>
                                  <span className="text-blue-600 font-medium">Change:</span>
                                  <div className="flex items-center gap-1 mt-1">
                                    {price.change > 0 ? (
                                      <TrendingUp className="h-3 w-3 text-green-600" />
                                    ) : (
                                      <TrendingDown className="h-3 w-3 text-red-600" />
                                    )}
                                    <Badge variant={price.change > 0 ? "default" : "destructive"} className="text-xs">
                                      {price.change > 0 ? "+" : ""}
                                      {price.change}%
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-500">
                                Updated: {price.lastUpdated}
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

          <TabsContent value="trends" className="space-y-4">
            <div className="flex items-center gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1week">Last Week</SelectItem>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="raw">Raw Sugar</SelectItem>
                  <SelectItem value="refined">Refined Sugar</SelectItem>
                  <SelectItem value="brown">Brown Sugar</SelectItem>
                  <SelectItem value="muscovado">Muscovado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Price Trends Chart</CardTitle>
                <CardDescription>Sugar price movements over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <SugarPriceChart period={selectedPeriod} grade={selectedGrade} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>Weekly price averages for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week</TableHead>
                        <TableHead>Raw Sugar</TableHead>
                        <TableHead>Refined Sugar</TableHead>
                        <TableHead>Brown Sugar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weeklyData.map((week) => (
                        <TableRow key={week.week}>
                          <TableCell className="font-medium">{week.week}</TableCell>
                          <TableCell>₱{week.rawSugar.toLocaleString()}</TableCell>
                          <TableCell>₱{week.refinedSugar.toLocaleString()}</TableCell>
                          <TableCell>₱{week.brownSugar.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Price History</CardTitle>
                <CardDescription>Historical sugar prices for the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Raw Sugar</TableHead>
                        <TableHead>Refined Sugar</TableHead>
                        <TableHead>Brown Sugar</TableHead>
                        <TableHead>Muscovado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priceHistory.map((day) => (
                        <TableRow key={day.date}>
                          <TableCell className="font-medium">{day.date}</TableCell>
                          <TableCell>₱{day.rawSugar.toLocaleString()}</TableCell>
                          <TableCell>₱{day.refinedSugar.toLocaleString()}</TableCell>
                          <TableCell>₱{day.brownSugar.toLocaleString()}</TableCell>
                          <TableCell>₱{day.muscovado.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex items-center justify-end space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <PriceAlerts />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

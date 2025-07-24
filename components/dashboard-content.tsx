"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, Calendar, Leaf, LineChart, Tractor, Truck, TrendingUp, Users, Wheat, Sprout } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RecentRegistrations } from "@/components/recent-registrations"
import { EquipmentBookings } from "@/components/equipment-bookings"
import { ProductionChart } from "@/components/production-chart"
import { SugarPricesWidget } from "@/components/sugar-prices-widget"

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-4 p-4 sm:p-6 lg:p-8">
      {/* Header Section - Mobile First */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-farm-green-800">Farm Dashboard</h1>
          <p className="text-sm sm:text-base text-farm-green-600">Welcome to Phil Agro-Industrial Management System</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex border-farm-green-300 hover:bg-farm-green-100 bg-transparent text-xs sm:text-sm"
          >
            <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Filter by Date</span>
            <span className="sm:hidden">Filter</span>
          </Button>
          <Button size="sm" className="bg-farm-green-600 hover:bg-farm-green-700 text-xs sm:text-sm">
            <LineChart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Generate Report</span>
            <span className="sm:hidden">Report</span>
          </Button>
        </div>
      </div>

      {/* Tabs Navigation - Mobile Responsive */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-farm-green-100 border border-farm-green-200">
          <TabsTrigger
            value="overview"
            className="text-xs sm:text-sm data-[state=active]:bg-farm-green-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="registrations"
            className="text-xs sm:text-sm data-[state=active]:bg-farm-green-600 data-[state=active]:text-white"
          >
            Registrations
          </TabsTrigger>
          <TabsTrigger
            value="equipment"
            className="text-xs sm:text-sm data-[state=active]:bg-farm-green-600 data-[state=active]:text-white"
          >
            Equipment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Metric Cards - Mobile First Grid */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card className="border-farm-green-200 bg-gradient-to-br from-white to-farm-green-50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-farm-green-700">Total Planters</CardTitle>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-green-200">
                  <Wheat className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-farm-green-800">1,248</div>
                <p className="text-xs text-farm-green-600">+12% from last month</p>
              </CardContent>
            </Card>
            <Card className="border-farm-sky-200 bg-gradient-to-br from-white to-farm-sky-50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-farm-sky-700">Registered Farmers</CardTitle>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-sky-200">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-farm-sky-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-farm-sky-800">3,427</div>
                <p className="text-xs text-farm-sky-600">+8% from last month</p>
              </CardContent>
            </Card>
            <Card className="border-farm-earth-200 bg-gradient-to-br from-white to-farm-earth-50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-farm-earth-700">Equipment Bookings</CardTitle>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-earth-200">
                  <Tractor className="h-4 w-4 sm:h-5 sm:w-5 text-farm-earth-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-farm-earth-800">573</div>
                <p className="text-xs text-farm-earth-600">+19% from last month</p>
              </CardContent>
            </Card>
            <Card className="border-farm-gold-200 bg-gradient-to-br from-white to-farm-gold-50 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-farm-gold-700">Hauling Operations</CardTitle>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-farm-gold-200">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-farm-gold-700" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-farm-gold-800">892</div>
                <p className="text-xs text-farm-gold-600">+4% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts & Widgets Section - Mobile Responsive */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="col-span-1 lg:col-span-2 border-farm-green-200 bg-gradient-to-br from-white to-farm-green-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-farm-green-800 text-sm sm:text-base">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-600" />
                  Production Chart
                </CardTitle>
                <CardDescription className="text-farm-green-600 text-xs sm:text-sm">Monthly production analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductionChart />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-farm-green-300 hover:bg-farm-green-100 bg-transparent text-xs sm:text-sm">
                  <Link href="/reports/production" className="w-full">
                    View Detailed Report
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="col-span-1 lg:col-span-2 border-farm-sky-200 bg-gradient-to-br from-white to-farm-sky-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-farm-sky-800 text-sm sm:text-base">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-farm-sky-600" />
                  Sugar Prices
                </CardTitle>
                <CardDescription className="text-farm-sky-600 text-xs sm:text-sm">Current market prices</CardDescription>
              </CardHeader>
              <CardContent>
                <SugarPricesWidget />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-farm-sky-300 hover:bg-farm-sky-100 bg-transparent text-xs sm:text-sm">
                  <Link href="/prices" className="w-full">
                    View All Prices
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="col-span-1 lg:col-span-2 border-farm-earth-200 bg-gradient-to-br from-white to-farm-earth-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-farm-earth-800 text-sm sm:text-base">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-farm-earth-600" />
                  Recent Registrations
                </CardTitle>
                <CardDescription className="text-farm-earth-600 text-xs sm:text-sm">Latest user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentRegistrations />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-farm-earth-300 hover:bg-farm-earth-100 bg-transparent text-xs sm:text-sm">
                  <Link href="/registration" className="w-full">
                    View All Registrations
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="col-span-1 lg:col-span-2 border-farm-gold-200 bg-gradient-to-br from-white to-farm-gold-50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-farm-gold-800 text-sm sm:text-base">
                  <Tractor className="h-4 w-4 sm:h-5 sm:w-5 text-farm-gold-600" />
                  Equipment Bookings
                </CardTitle>
                <CardDescription className="text-farm-gold-600 text-xs sm:text-sm">Upcoming equipment rentals</CardDescription>
              </CardHeader>
              <CardContent>
                <EquipmentBookings />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-farm-gold-300 hover:bg-farm-gold-100 bg-transparent text-xs sm:text-sm">
                  <Link href="/equipment/calendar" className="w-full">
                    View Booking Calendar
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registrations" className="space-y-4 sm:space-y-6">
          <Card className="border-farm-green-200 bg-gradient-to-br from-white to-farm-green-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-farm-green-800 text-sm sm:text-base">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-600" />
                Registration Management
              </CardTitle>
              <CardDescription className="text-farm-green-600 text-xs sm:text-sm">
                Manage planters, farmers, and haulers registrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                <Card className="border-farm-green-200 bg-gradient-to-br from-farm-green-50 to-farm-green-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-lg flex items-center gap-2 text-farm-green-800">
                      <Wheat className="h-4 w-4 sm:h-5 sm:w-5" />
                      Planters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-farm-green-600">Manage sugar planters registration and profiles</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-farm-green-300 hover:bg-farm-green-200 bg-transparent text-xs sm:text-sm"
                    >
                      <Link href="/registration/planters" className="w-full">
                        Manage Planters
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="border-farm-sky-200 bg-gradient-to-br from-farm-sky-50 to-farm-sky-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-lg flex items-center gap-2 text-farm-sky-800">
                      <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
                      Farmers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-farm-sky-600">Manage farmers registration and profiles</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-farm-sky-300 hover:bg-farm-sky-200 bg-transparent text-xs sm:text-sm"
                    >
                      <Link href="/registration/farmers" className="w-full">
                        Manage Farmers
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="border-farm-earth-200 bg-gradient-to-br from-farm-earth-50 to-farm-earth-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-lg flex items-center gap-2 text-farm-earth-800">
                      <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                      Haulers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-farm-earth-600">Manage haulers registration and profiles</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-farm-earth-300 hover:bg-farm-earth-200 bg-transparent text-xs sm:text-sm"
                    >
                      <Link href="/registration/haulers" className="w-full">
                        Manage Haulers
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="space-y-4 sm:space-y-6">
          <Card className="border-farm-green-200 bg-gradient-to-br from-white to-farm-green-50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-farm-green-800 text-sm sm:text-base">
                <Tractor className="h-4 w-4 sm:h-5 sm:w-5 text-farm-green-600" />
                Equipment Management
              </CardTitle>
              <CardDescription className="text-farm-green-600 text-xs sm:text-sm">
                Manage equipment rentals and bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-farm-green-200 bg-gradient-to-br from-farm-green-50 to-farm-green-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-lg flex items-center gap-2 text-farm-green-800">
                      <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                      Trucks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-farm-green-600">Manage truck rentals and bookings</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-farm-green-300 hover:bg-farm-green-200 bg-transparent text-xs sm:text-sm"
                    >
                      <Link href="/equipment/trucks" className="w-full">
                        Manage Trucks
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="border-farm-sky-200 bg-gradient-to-br from-farm-sky-50 to-farm-sky-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-lg flex items-center gap-2 text-farm-sky-800">
                      <Tractor className="h-4 w-4 sm:h-5 sm:w-5" />
                      Tractors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-farm-sky-600">Manage tractor rentals and bookings</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-farm-sky-300 hover:bg-farm-sky-200 bg-transparent text-xs sm:text-sm"
                    >
                      <Link href="/equipment/tractors" className="w-full">
                        Manage Tractors
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="border-farm-earth-200 bg-gradient-to-br from-farm-earth-50 to-farm-earth-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-lg flex items-center gap-2 text-farm-earth-800">
                      <Sprout className="h-4 w-4 sm:h-5 sm:w-5" />
                      Other Equipment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-farm-earth-600">Manage other equipment rentals</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-farm-earth-300 hover:bg-farm-earth-200 bg-transparent text-xs sm:text-sm"
                    >
                      <Link href="/equipment/other" className="w-full">
                        Manage Equipment
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="border-farm-gold-200 bg-gradient-to-br from-farm-gold-50 to-farm-gold-100 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-lg flex items-center gap-2 text-farm-gold-800">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      Booking Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-farm-gold-600">View and manage booking calendar</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-farm-gold-300 hover:bg-farm-gold-200 bg-transparent text-xs sm:text-sm"
                    >
                      <Link href="/equipment/calendar" className="w-full">
                        View Calendar
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

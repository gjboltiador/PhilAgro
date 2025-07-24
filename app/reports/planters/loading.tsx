import { DashboardLayout } from "@/components/sidebar-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Scale,
  Package,
  DollarSign,
  FileText,
  Plus
} from "lucide-react"

export default function PlantersProductionLoading() {
  return (
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
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
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
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
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
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-28" />
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
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs value="overview" className="w-full mb-6">
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-6">
            <Card className="border-green-200 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-farm-green-800 text-xl sm:text-2xl font-bold">
                  Production Overview
                </CardTitle>
                <CardDescription className="text-farm-green-600 text-sm sm:text-base">
                  Complete production tracking and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex-1">
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-10 w-20" />
                </div>

                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-6" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 
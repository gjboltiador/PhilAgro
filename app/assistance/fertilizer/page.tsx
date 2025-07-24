import { DashboardLayout } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Plus, Search, Sprout } from "lucide-react"

export default function FertilizerAssistancePage() {
  const programs = [
    {
      id: "FA-2024-01",
      name: "Nitrogen Boost Program",
      type: "Urea",
      allocation: "500 tons",
      distributed: "320 tons",
      beneficiaries: 245,
      status: "Active",
    },
    {
      id: "FA-2024-02",
      name: "Complete NPK Support",
      type: "14-14-14",
      allocation: "350 tons",
      distributed: "210 tons",
      beneficiaries: 180,
      status: "Active",
    },
    {
      id: "FA-2024-03",
      name: "Phosphate Enhancement",
      type: "0-18-0",
      allocation: "200 tons",
      distributed: "120 tons",
      beneficiaries: 95,
      status: "Active",
    },
    {
      id: "FA-2024-04",
      name: "Potassium Supplement",
      type: "0-0-60",
      allocation: "150 tons",
      distributed: "80 tons",
      beneficiaries: 75,
      status: "Active",
    },
    {
      id: "FA-2023-05",
      name: "Organic Matter Program",
      type: "Compost",
      allocation: "300 tons",
      distributed: "300 tons",
      beneficiaries: 210,
      status: "Completed",
    },
  ]

  const recentDistributions = [
    {
      date: "Jul 10, 2024",
      program: "Nitrogen Boost Program",
      recipient: "Juan Dela Cruz",
      location: "Negros Occidental",
      quantity: "500 kg",
      status: "Delivered",
    },
    {
      date: "Jul 9, 2024",
      program: "Complete NPK Support",
      recipient: "Maria Santos",
      location: "Batangas",
      quantity: "350 kg",
      status: "Delivered",
    },
    {
      date: "Jul 8, 2024",
      program: "Phosphate Enhancement",
      recipient: "Pedro Reyes",
      location: "Iloilo",
      quantity: "400 kg",
      status: "In Transit",
    },
    {
      date: "Jul 7, 2024",
      program: "Nitrogen Boost Program",
      recipient: "Ana Gonzales",
      location: "Tarlac",
      quantity: "500 kg",
      status: "Delivered",
    },
    {
      date: "Jul 6, 2024",
      program: "Potassium Supplement",
      recipient: "Carlos Mendoza",
      location: "Pampanga",
      quantity: "300 kg",
      status: "Delivered",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Fertilizer Assistance</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assistance Program
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,500 tons</div>
              <p className="text-xs text-muted-foreground">For current fiscal year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Distributed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,030 tons</div>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={68} className="h-2" />
                <span className="text-xs text-muted-foreground">68%</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">805</div>
              <p className="text-xs text-muted-foreground">Across all programs</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="programs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="programs">Assistance Programs</TabsTrigger>
            <TabsTrigger value="distributions">Recent Distributions</TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fertilizer Assistance Programs</CardTitle>
                <CardDescription>Manage and monitor fertilizer distribution programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full items-center gap-2 sm:max-w-sm">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search programs..." className="h-9" />
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto h-9 gap-1 bg-transparent">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Program Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Allocation</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Beneficiaries</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {programs.map((program) => (
                            <TableRow key={program.id}>
                              <TableCell className="font-medium">{program.id}</TableCell>
                              <TableCell>{program.name}</TableCell>
                              <TableCell>{program.type}</TableCell>
                              <TableCell>{program.allocation}</TableCell>
                              <TableCell>
                                <div className="flex w-full max-w-[100px] items-center gap-2">
                                  <Progress
                                    value={
                                      (Number.parseInt(program.distributed) / Number.parseInt(program.allocation)) * 100
                                    }
                                    className="h-2"
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {Math.round(
                                      (Number.parseInt(program.distributed) / Number.parseInt(program.allocation)) * 100,
                                    )}
                                    %
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{program.beneficiaries}</TableCell>
                              <TableCell>
                                <Badge variant={program.status === "Active" ? "default" : "secondary"}>
                                  {program.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="md:hidden space-y-3 p-3">
                      {programs.map((program) => (
                        <Card key={program.id} className="border-green-200 hover:bg-green-50/30 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                    <Sprout className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-800">{program.name}</h3>
                                    <p className="text-sm text-gray-600">{program.id}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-green-600 font-medium">Type:</span>
                                    <p className="text-gray-700">{program.type}</p>
                                  </div>
                                  <div>
                                    <span className="text-green-600 font-medium">Allocation:</span>
                                    <p className="text-gray-700">{program.allocation}</p>
                                  </div>
                                  <div>
                                    <span className="text-green-600 font-medium">Beneficiaries:</span>
                                    <p className="text-gray-700">{program.beneficiaries}</p>
                                  </div>
                                  <div>
                                    <span className="text-green-600 font-medium">Status:</span>
                                    <div className="mt-1">
                                      <Badge variant={program.status === "Active" ? "default" : "secondary"}>
                                        {program.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-green-600 font-medium">Progress:</span>
                                    <span className="text-gray-600">
                                      {Math.round(
                                        (Number.parseInt(program.distributed) / Number.parseInt(program.allocation)) * 100,
                                      )}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={
                                      (Number.parseInt(program.distributed) / Number.parseInt(program.allocation)) * 100
                                    }
                                    className="h-2"
                                  />
                                  <p className="text-xs text-gray-500">
                                    {program.distributed} of {program.allocation} distributed
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distributions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Fertilizer Distributions</CardTitle>
                <CardDescription>Track recent fertilizer deliveries to beneficiaries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Program</TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentDistributions.map((distribution, index) => (
                          <TableRow key={index}>
                            <TableCell>{distribution.date}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{distribution.program}</TableCell>
                            <TableCell>{distribution.recipient}</TableCell>
                            <TableCell>{distribution.location}</TableCell>
                            <TableCell>{distribution.quantity}</TableCell>
                            <TableCell>
                              <Badge variant={distribution.status === "Delivered" ? "default" : "outline"}>
                                {distribution.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-3 p-3">
                    {recentDistributions.map((distribution, index) => (
                      <Card key={index} className="border-green-200 hover:bg-green-50/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                  <Sprout className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">{distribution.recipient}</h3>
                                  <p className="text-sm text-gray-600">{distribution.program}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-green-600 font-medium">Date:</span>
                                  <p className="text-gray-700">{distribution.date}</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Quantity:</span>
                                  <p className="text-gray-700">{distribution.quantity}</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Location:</span>
                                  <p className="text-gray-700">{distribution.location}</p>
                                </div>
                                <div>
                                  <span className="text-green-600 font-medium">Status:</span>
                                  <div className="mt-1">
                                    <Badge variant={distribution.status === "Delivered" ? "default" : "outline"}>
                                      {distribution.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

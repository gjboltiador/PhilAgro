import { DashboardLayout } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react"

export default function PlantersRegistrationPage() {
  const planters = [
    {
      id: "P-1001",
      name: "Juan Dela Cruz",
      location: "Negros Occidental",
      area: "25 hectares",
      registrationDate: "Jan 15, 2024",
      status: "Active",
    },
    {
      id: "P-1002",
      name: "Maria Santos",
      location: "Batangas",
      area: "18 hectares",
      registrationDate: "Feb 3, 2024",
      status: "Active",
    },
    {
      id: "P-1003",
      name: "Pedro Reyes",
      location: "Iloilo",
      area: "32 hectares",
      registrationDate: "Mar 12, 2024",
      status: "Active",
    },
    {
      id: "P-1004",
      name: "Ana Gonzales",
      location: "Tarlac",
      area: "15 hectares",
      registrationDate: "Apr 5, 2024",
      status: "Pending",
    },
    {
      id: "P-1005",
      name: "Carlos Mendoza",
      location: "Pampanga",
      area: "22 hectares",
      registrationDate: "Apr 18, 2024",
      status: "Inactive",
    },
    {
      id: "P-1006",
      name: "Sofia Lim",
      location: "Bukidnon",
      area: "40 hectares",
      registrationDate: "May 2, 2024",
      status: "Active",
    },
    {
      id: "P-1007",
      name: "Miguel Tan",
      location: "Davao",
      area: "28 hectares",
      registrationDate: "May 20, 2024",
      status: "Pending",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-farm-green-800">Planters Registration</h1>
            <p className="text-farm-green-600">Manage and view all registered sugar planters</p>
          </div>
          <Button className="bg-farm-green-600 hover:bg-farm-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Register New Planter
          </Button>
        </div>

        <Card className="border-farm-green-200 bg-gradient-to-br from-white to-farm-green-50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-farm-green-800">Registered Planters</CardTitle>
            <CardDescription className="text-farm-green-600">
              Manage and view all registered sugar planters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full items-center gap-2 sm:max-w-sm">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search planters..." className="h-9 border-farm-green-300" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto h-9 gap-1 border-farm-green-300 hover:bg-farm-green-100 bg-transparent"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>

              <div className="rounded-md border border-farm-green-200 bg-white/50">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="hidden md:table-cell">Area</TableHead>
                      <TableHead className="hidden md:table-cell">Registration Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {planters.map((planter) => (
                      <TableRow key={planter.id} className="hover:bg-farm-green-50/50">
                        <TableCell className="font-medium">{planter.id}</TableCell>
                        <TableCell>{planter.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{planter.location}</TableCell>
                        <TableCell className="hidden md:table-cell">{planter.area}</TableCell>
                        <TableCell className="hidden md:table-cell">{planter.registrationDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              planter.status === "Active"
                                ? "default"
                                : planter.status === "Pending"
                                  ? "outline"
                                  : "secondary"
                            }
                            className={planter.status === "Active" ? "bg-farm-green-600 hover:bg-farm-green-700" : ""}
                          >
                            {planter.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Registration</DropdownMenuItem>
                              <DropdownMenuItem>Production History</DropdownMenuItem>
                              <DropdownMenuItem>Assistance Records</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" size="sm" disabled className="border-farm-green-300 bg-transparent">
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-farm-green-300 hover:bg-farm-green-100 bg-transparent"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

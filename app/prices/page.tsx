"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Bell, 
  Download, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Save,
  X
} from "lucide-react"
import { SugarPriceChart } from "@/components/sugar-price-chart"
import { PriceAlerts } from "@/components/price-alerts"
import { ProtectedRoute } from "@/components/protected-route"

// Interfaces
interface SugarPrice {
  id: string
  weekEnding: string
  sugarMillId: string
  sugarMillName: string
  sugarMillCode: string
  rawSugarPrice: number
  refinedSugarPrice: number
  brownSugarPrice: number
  muscovadoPrice: number
  notes: string
  createdBy: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'draft' | 'archived'
}

interface SugarMill {
  id: string
  name: string
  code: string
  location: string
  status: 'operational' | 'maintenance' | 'inactive'
}

export default function SugarPricesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("1month")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedSugarMill, setSelectedSugarMill] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  
  // CRUD States
  const [sugarPrices, setSugarPrices] = useState<SugarPrice[]>([])
  const [sugarMills, setSugarMills] = useState<SugarMill[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState<SugarPrice | null>(null)
  const [formData, setFormData] = useState({
    weekEnding: "",
    sugarMillId: "",
    rawSugarPrice: "",
    refinedSugarPrice: "",
    brownSugarPrice: "",
    muscovadoPrice: "",
    notes: ""
  })

  // Mock data for sugar mills
  const mockSugarMills: SugarMill[] = [
    { id: "1", name: "URSUMCO", code: "URS", location: "Negros Occidental", status: "operational" },
    { id: "2", name: "SONEDCO", code: "SON", location: "Negros Occidental", status: "operational" },
    { id: "3", name: "TOLONG", code: "TOL", location: "Negros Occidental", status: "operational" },
    { id: "4", name: "BUGAY", code: "BUG", location: "Negros Occidental", status: "operational" },
    { id: "5", name: "CAB", code: "CAB", location: "Negros Occidental", status: "operational" },
  ]

  // Mock data for sugar prices
  const mockSugarPrices: SugarPrice[] = [
    {
      id: "1",
      weekEnding: "2024-07-14",
      sugarMillId: "1",
      sugarMillName: "URSUMCO",
      sugarMillCode: "URS",
      rawSugarPrice: 2850,
      refinedSugarPrice: 3200,
      brownSugarPrice: 2950,
      muscovadoPrice: 3500,
      notes: "Strong market demand for raw sugar",
      createdBy: "Admin User",
      createdAt: "2024-07-12T10:30:00Z",
      updatedAt: "2024-07-12T10:30:00Z",
      status: "active"
    },
    {
      id: "2",
      weekEnding: "2024-07-14",
      sugarMillId: "2",
      sugarMillName: "SONEDCO",
      sugarMillCode: "SON",
      rawSugarPrice: 2820,
      refinedSugarPrice: 3180,
      brownSugarPrice: 2920,
      muscovadoPrice: 3480,
      notes: "Stable pricing across all grades",
      createdBy: "Admin User",
      createdAt: "2024-07-12T11:15:00Z",
      updatedAt: "2024-07-12T11:15:00Z",
      status: "active"
    },
    {
      id: "3",
      weekEnding: "2024-07-07",
      sugarMillId: "1",
      sugarMillName: "URSUMCO",
      sugarMillCode: "URS",
      rawSugarPrice: 2780,
      refinedSugarPrice: 3150,
      brownSugarPrice: 2900,
      muscovadoPrice: 3450,
      notes: "Previous week pricing",
      createdBy: "Admin User",
      createdAt: "2024-07-05T09:45:00Z",
      updatedAt: "2024-07-05T09:45:00Z",
      status: "active"
    },
    {
      id: "4",
      weekEnding: "2024-07-07",
      sugarMillId: "3",
      sugarMillName: "TOLONG",
      sugarMillCode: "TOL",
      rawSugarPrice: 2800,
      refinedSugarPrice: 3160,
      brownSugarPrice: 2910,
      muscovadoPrice: 3460,
      notes: "Competitive pricing strategy",
      createdBy: "Admin User",
      createdAt: "2024-07-05T10:20:00Z",
      updatedAt: "2024-07-05T10:20:00Z",
      status: "active"
    },
  ]

  // Initialize data
  useEffect(() => {
    setSugarMills(mockSugarMills)
    setSugarPrices(mockSugarPrices)
  }, [])

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatWeekEnding = (dateString: string) => {
    const date = new Date(dateString)
    const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)
    return `Week ${weekNumber} - ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Draft</Badge>
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredSugarPrices = sugarPrices.filter(price => {
    const matchesSearch = price.sugarMillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         price.weekEnding.includes(searchQuery) ||
                         price.notes.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSugarMill = selectedSugarMill === "all" || price.sugarMillId === selectedSugarMill
    const matchesStatus = filterStatus === "all" || price.status === filterStatus
    return matchesSearch && matchesSugarMill && matchesStatus
  })

  // CRUD Operations
  const handleAddPrice = () => {
    const newPrice: SugarPrice = {
      id: Date.now().toString(),
      weekEnding: formData.weekEnding,
      sugarMillId: formData.sugarMillId,
      sugarMillName: sugarMills.find(mill => mill.id === formData.sugarMillId)?.name || "",
      sugarMillCode: sugarMills.find(mill => mill.id === formData.sugarMillId)?.code || "",
      rawSugarPrice: parseFloat(formData.rawSugarPrice) || 0,
      refinedSugarPrice: parseFloat(formData.refinedSugarPrice) || 0,
      brownSugarPrice: parseFloat(formData.brownSugarPrice) || 0,
      muscovadoPrice: parseFloat(formData.muscovadoPrice) || 0,
      notes: formData.notes,
      createdBy: "Admin User",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active"
    }
    
    setSugarPrices([...sugarPrices, newPrice])
    setShowAddDialog(false)
    resetForm()
  }

  const handleEditPrice = () => {
    if (!selectedPrice) return
    
    const updatedPrices = sugarPrices.map(price => 
      price.id === selectedPrice.id 
        ? {
            ...price,
            weekEnding: formData.weekEnding,
            sugarMillId: formData.sugarMillId,
            sugarMillName: sugarMills.find(mill => mill.id === formData.sugarMillId)?.name || "",
            sugarMillCode: sugarMills.find(mill => mill.id === formData.sugarMillId)?.code || "",
            rawSugarPrice: parseFloat(formData.rawSugarPrice) || 0,
            refinedSugarPrice: parseFloat(formData.refinedSugarPrice) || 0,
            brownSugarPrice: parseFloat(formData.brownSugarPrice) || 0,
            muscovadoPrice: parseFloat(formData.muscovadoPrice) || 0,
            notes: formData.notes,
            updatedAt: new Date().toISOString()
          }
        : price
    )
    
    setSugarPrices(updatedPrices)
    setShowEditDialog(false)
    setSelectedPrice(null)
    resetForm()
  }

  const handleDeletePrice = () => {
    if (!selectedPrice) return
    
    setSugarPrices(sugarPrices.filter(price => price.id !== selectedPrice.id))
    setShowDeleteDialog(false)
    setSelectedPrice(null)
  }

  const resetForm = () => {
    setFormData({
      weekEnding: "",
      sugarMillId: "",
      rawSugarPrice: "",
      refinedSugarPrice: "",
      brownSugarPrice: "",
      muscovadoPrice: "",
      notes: ""
    })
  }

  const openEditDialog = (price: SugarPrice) => {
    setSelectedPrice(price)
    setFormData({
      weekEnding: price.weekEnding,
      sugarMillId: price.sugarMillId,
      rawSugarPrice: price.rawSugarPrice.toString(),
      refinedSugarPrice: price.refinedSugarPrice.toString(),
      brownSugarPrice: price.brownSugarPrice.toString(),
      muscovadoPrice: price.muscovadoPrice.toString(),
      notes: price.notes
    })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (price: SugarPrice) => {
    setSelectedPrice(price)
    setShowDeleteDialog(true)
  }

  // Statistics
  const totalPrices = sugarPrices.length
  const activePrices = sugarPrices.filter(price => price.status === 'active').length
  const averageRawPrice = sugarPrices.length > 0 
    ? sugarPrices.reduce((sum, price) => sum + price.rawSugarPrice, 0) / sugarPrices.length 
    : 0
  const latestWeek = sugarPrices.length > 0 
    ? sugarPrices.reduce((latest, price) => price.weekEnding > latest ? price.weekEnding : latest, sugarPrices[0].weekEnding)
    : ""

  return (
    <ProtectedRoute requiredPermission="price_management">
      <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Sugar Prices Management</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Price
            </Button>
          </div>
        </div>

        <Alert>
          <TrendingUp className="h-4 w-4" />
          <AlertTitle>Price Management</AlertTitle>
          <AlertDescription>
            Manage sugar prices for different sugar mills by week ending. Each sugar mill can have different prices for the same week ending.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Price Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPrices}</div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                {activePrices} active
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Raw Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱{averageRawPrice.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all mills</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sugar Mills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sugarMills.length}</div>
              <p className="text-xs text-muted-foreground">Operational mills</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Latest Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{latestWeek ? formatWeekEnding(latestWeek) : "No data"}</div>
              <p className="text-xs text-muted-foreground">Most recent pricing</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="manage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="manage">Price Management</TabsTrigger>
            <TabsTrigger value="trends">Price Trends</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            {/* Search and Filter Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Price Management</CardTitle>
                <CardDescription>Add, edit, and manage sugar prices by week ending and sugar mill</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by sugar mill, week ending, or notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedSugarMill} onValueChange={setSelectedSugarMill}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Sugar Mills" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sugar Mills</SelectItem>
                      {sugarMills.map((mill) => (
                        <SelectItem key={mill.id} value={mill.id}>
                          {mill.name} ({mill.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Management Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week Ending</TableHead>
                        <TableHead>Sugar Mill</TableHead>
                        <TableHead>Raw Sugar</TableHead>
                        <TableHead>Refined Sugar</TableHead>
                        <TableHead>Brown Sugar</TableHead>
                        <TableHead>Muscovado</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSugarPrices.map((price) => (
                        <TableRow key={price.id}>
                          <TableCell className="font-medium">
                            {formatWeekEnding(price.weekEnding)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{price.sugarMillName}</div>
                              <div className="text-sm text-muted-foreground">{price.sugarMillCode}</div>
                            </div>
                          </TableCell>
                          <TableCell>₱{price.rawSugarPrice.toLocaleString()}</TableCell>
                          <TableCell>₱{price.refinedSugarPrice.toLocaleString()}</TableCell>
                          <TableCell>₱{price.brownSugarPrice.toLocaleString()}</TableCell>
                          <TableCell>₱{price.muscovadoPrice.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(price.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(price.updatedAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(price)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteDialog(price)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredSugarPrices.length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sugar prices found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery || selectedSugarMill !== "all" || filterStatus !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Get started by adding your first sugar price entry."}
                    </p>
                    <Button onClick={() => setShowAddDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Sugar Price
                    </Button>
                  </div>
                )}
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
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Price History</CardTitle>
                <CardDescription>Historical sugar prices by sugar mill</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week Ending</TableHead>
                        <TableHead>Sugar Mill</TableHead>
                        <TableHead>Raw Sugar</TableHead>
                        <TableHead>Refined Sugar</TableHead>
                        <TableHead>Brown Sugar</TableHead>
                        <TableHead>Muscovado</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sugarPrices.slice(0, 10).map((price) => (
                        <TableRow key={price.id}>
                          <TableCell className="font-medium">
                            {formatWeekEnding(price.weekEnding)}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{price.sugarMillName}</div>
                              <div className="text-sm text-muted-foreground">{price.sugarMillCode}</div>
                            </div>
                          </TableCell>
                          <TableCell>₱{price.rawSugarPrice.toLocaleString()}</TableCell>
                          <TableCell>₱{price.refinedSugarPrice.toLocaleString()}</TableCell>
                          <TableCell>₱{price.brownSugarPrice.toLocaleString()}</TableCell>
                          <TableCell>₱{price.muscovadoPrice.toLocaleString()}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={price.notes}>
                            {price.notes}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <PriceAlerts />
          </TabsContent>
        </Tabs>

        {/* Add Price Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Sugar Price</DialogTitle>
              <DialogDescription>
                Add new sugar prices for a specific week ending and sugar mill.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weekEnding">Week Ending</Label>
                  <Input
                    id="weekEnding"
                    type="date"
                    value={formData.weekEnding}
                    onChange={(e) => setFormData({...formData, weekEnding: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sugarMill">Sugar Mill</Label>
                  <Select value={formData.sugarMillId} onValueChange={(value) => setFormData({...formData, sugarMillId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sugar mill" />
                    </SelectTrigger>
                    <SelectContent>
                      {sugarMills.map((mill) => (
                        <SelectItem key={mill.id} value={mill.id}>
                          {mill.name} ({mill.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rawSugar">Raw Sugar Price (₱)</Label>
                  <Input
                    id="rawSugar"
                    type="number"
                    placeholder="0.00"
                    value={formData.rawSugarPrice}
                    onChange={(e) => setFormData({...formData, rawSugarPrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refinedSugar">Refined Sugar Price (₱)</Label>
                  <Input
                    id="refinedSugar"
                    type="number"
                    placeholder="0.00"
                    value={formData.refinedSugarPrice}
                    onChange={(e) => setFormData({...formData, refinedSugarPrice: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brownSugar">Brown Sugar Price (₱)</Label>
                  <Input
                    id="brownSugar"
                    type="number"
                    placeholder="0.00"
                    value={formData.brownSugarPrice}
                    onChange={(e) => setFormData({...formData, brownSugarPrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="muscovado">Muscovado Price (₱)</Label>
                  <Input
                    id="muscovado"
                    type="number"
                    placeholder="0.00"
                    value={formData.muscovadoPrice}
                    onChange={(e) => setFormData({...formData, muscovadoPrice: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about the pricing..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPrice}>
                <Save className="mr-2 h-4 w-4" />
                Add Price
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Price Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Sugar Price</DialogTitle>
              <DialogDescription>
                Update sugar prices for the selected entry.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editWeekEnding">Week Ending</Label>
                  <Input
                    id="editWeekEnding"
                    type="date"
                    value={formData.weekEnding}
                    onChange={(e) => setFormData({...formData, weekEnding: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editSugarMill">Sugar Mill</Label>
                  <Select value={formData.sugarMillId} onValueChange={(value) => setFormData({...formData, sugarMillId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sugar mill" />
                    </SelectTrigger>
                    <SelectContent>
                      {sugarMills.map((mill) => (
                        <SelectItem key={mill.id} value={mill.id}>
                          {mill.name} ({mill.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editRawSugar">Raw Sugar Price (₱)</Label>
                  <Input
                    id="editRawSugar"
                    type="number"
                    placeholder="0.00"
                    value={formData.rawSugarPrice}
                    onChange={(e) => setFormData({...formData, rawSugarPrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRefinedSugar">Refined Sugar Price (₱)</Label>
                  <Input
                    id="editRefinedSugar"
                    type="number"
                    placeholder="0.00"
                    value={formData.refinedSugarPrice}
                    onChange={(e) => setFormData({...formData, refinedSugarPrice: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editBrownSugar">Brown Sugar Price (₱)</Label>
                  <Input
                    id="editBrownSugar"
                    type="number"
                    placeholder="0.00"
                    value={formData.brownSugarPrice}
                    onChange={(e) => setFormData({...formData, brownSugarPrice: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editMuscovado">Muscovado Price (₱)</Label>
                  <Input
                    id="editMuscovado"
                    type="number"
                    placeholder="0.00"
                    value={formData.muscovadoPrice}
                    onChange={(e) => setFormData({...formData, muscovadoPrice: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNotes">Notes</Label>
                <Textarea
                  id="editNotes"
                  placeholder="Add any additional notes about the pricing..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditPrice}>
                <Save className="mr-2 h-4 w-4" />
                Update Price
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Sugar Price</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this sugar price entry? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedPrice && (
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800">Entry to be deleted:</span>
                  </div>
                  <div className="text-sm text-red-700">
                    <p><strong>Week Ending:</strong> {formatWeekEnding(selectedPrice.weekEnding)}</p>
                    <p><strong>Sugar Mill:</strong> {selectedPrice.sugarMillName} ({selectedPrice.sugarMillCode})</p>
                    <p><strong>Raw Sugar:</strong> ₱{selectedPrice.rawSugarPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePrice}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Price
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

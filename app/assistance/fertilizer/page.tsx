"use client"

import { DashboardLayout } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Plus, Search, Sprout } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo, useState } from "react"
import { FertilizerCatalog } from "@/components/fertilizer-catalog"
import { ProtectedRoute } from "@/components/protected-route"

export default function FertilizerAssistancePage() {
  // Catalogs
  const fertilizerCatalog = [
    { id: "urea", name: "Urea (46-0-0)", unit: "bag (50kg)", price: 1500 },
    { id: "npk141414", name: "Complete (14-14-14)", unit: "bag (50kg)", price: 1550 },
    { id: "dap01846", name: "DAP (18-46-0)", unit: "bag (50kg)", price: 1800 },
    { id: "mop0060", name: "MOP (0-0-60)", unit: "bag (50kg)", price: 1750 },
    { id: "organic", name: "Organic Compost", unit: "bag (40kg)", price: 350 },
  ]

  const suppliers = [
    { id: "own", name: "Own Supply (Warehouse)" },
    { id: "sup-agrimax", name: "AgriMax Trading" },
    { id: "sup-growmore", name: "GrowMore Agri Supply" },
    { id: "sup-greenleaf", name: "GreenLeaf Fertilizers" },
  ]

  type PaymentMode = "cash" | "30d" | "60d" | "installment"
  const paymentModes: { id: PaymentMode; label: string; interestRate: number }[] = [
    { id: "cash", label: "Cash (0% interest)", interestRate: 0 },
    { id: "30d", label: "30 days (2%)", interestRate: 0.02 },
    { id: "60d", label: "60 days (4%)", interestRate: 0.04 },
    { id: "installment", label: "Installment (Monthly 1.5% x 6)", interestRate: 0.09 },
  ]

  type LineItem = { productId: string; quantity: number; unitPrice: number }
  type Application = {
    id: string
    planterCode: string
    planterName: string
    municipality: string
    supplierType: "own" | "external"
    supplierId: string
    paymentMode: PaymentMode
    items: LineItem[]
    notes?: string
    createdAt: string
    status: "pending" | "approved" | "released"
  }

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

  // Applications state
  const [applications, setApplications] = useState<Application[]>([])
  const [newApp, setNewApp] = useState<Partial<Application>>({
    planterCode: "",
    planterName: "",
    municipality: "",
    supplierType: "own",
    supplierId: "own",
    paymentMode: "cash",
    items: [{ productId: "urea", quantity: 0, unitPrice: 1500 }],
    notes: "",
  })

  const lineItems = (newApp.items || []) as LineItem[]
  const currency = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "PHP", maximumFractionDigits: 2 })
  const subtotal = useMemo(() => lineItems.reduce((sum, li) => sum + (li.quantity || 0) * (li.unitPrice || 0), 0), [lineItems])
  const interestRate = useMemo(() => paymentModes.find(p => p.id === newApp.paymentMode)?.interestRate || 0, [newApp.paymentMode])
  const interest = useMemo(() => subtotal * interestRate, [subtotal, interestRate])
  const grandTotal = useMemo(() => subtotal + interest, [subtotal, interest])

  function updateItem(index: number, patch: Partial<LineItem>) {
    const next = [...lineItems]
    next[index] = { ...next[index], ...patch }
    setNewApp({ ...newApp, items: next })
  }
  function addItem() {
    setNewApp({ ...newApp, items: [...lineItems, { productId: fertilizerCatalog[0].id, quantity: 0, unitPrice: fertilizerCatalog[0].price }] })
  }
  function removeItem(index: number) {
    const next = lineItems.filter((_, i) => i !== index)
    setNewApp({ ...newApp, items: next })
  }
  function submitApplication() {
    if (!newApp.planterName || !newApp.planterCode) return
    const app: Application = {
      id: `FA-${Date.now()}`,
      planterCode: newApp.planterCode!,
      planterName: newApp.planterName!,
      municipality: newApp.municipality || "",
      supplierType: newApp.supplierType || "own",
      supplierId: newApp.supplierId || "own",
      paymentMode: newApp.paymentMode || "cash",
      items: lineItems,
      notes: newApp.notes || "",
      createdAt: new Date().toISOString(),
      status: "pending",
    }
    setApplications(prev => [app, ...prev])
    setNewApp({ planterCode: "", planterName: "", municipality: "", supplierType: "own", supplierId: "own", paymentMode: "cash", items: [{ productId: "urea", quantity: 0, unitPrice: 1500 }], notes: "" })
  }

  return (
    <ProtectedRoute requiredPermission="farm_management">
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

        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="programs">Assistance Programs</TabsTrigger>
            <TabsTrigger value="distributions">Recent Distributions</TabsTrigger>
            <TabsTrigger value="catalog">Fertilizers & Herbicides</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fertilizer Assistance Application</CardTitle>
                <CardDescription>Apply fertilizer support for planters, select suppliers and payment mode with automatic computations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Planter Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Planter Code</label>
                    <Input value={newApp.planterCode || ""} onChange={(e) => setNewApp({ ...newApp, planterCode: e.target.value })} placeholder="PLT-2024-001" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Planter Name</label>
                    <Input value={newApp.planterName || ""} onChange={(e) => setNewApp({ ...newApp, planterName: e.target.value })} placeholder="Juan Dela Cruz" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Municipality</label>
                    <Input value={newApp.municipality || ""} onChange={(e) => setNewApp({ ...newApp, municipality: e.target.value })} placeholder="Bayawan City" />
                  </div>
                </div>

                {/* Supplier and Payment */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Supplier Type</label>
                    <Select value={newApp.supplierType || "own"} onValueChange={(v: any) => setNewApp({ ...newApp, supplierType: v, supplierId: v === "own" ? "own" : suppliers[1].id })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="own">Own Supplies (Warehouse)</SelectItem>
                        <SelectItem value="external">Outside Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Supplier</label>
                    <Select value={newApp.supplierId || "own"} onValueChange={(v: any) => setNewApp({ ...newApp, supplierId: v })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers
                          .filter(s => (newApp.supplierType || "own") === "own" ? s.id === "own" : s.id !== "own")
                          .map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mode of Payment</label>
                    <Select value={newApp.paymentMode || "cash"} onValueChange={(v: any) => setNewApp({ ...newApp, paymentMode: v })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentModes.map(m => (
                          <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Line Items */}
                <div className="rounded-md border">
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fertilizer</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Line Total</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lineItems.map((li, idx) => {
                          const product = fertilizerCatalog.find(p => p.id === li.productId) || fertilizerCatalog[0]
                          return (
                            <TableRow key={idx}>
                              <TableCell className="min-w-[220px]">
                                <Select value={li.productId} onValueChange={(v: any) => updateItem(idx, { productId: v, unitPrice: fertilizerCatalog.find(p => p.id === v)?.price || 0 })}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fertilizerCatalog.map(p => (
                                      <SelectItem key={p.id} value={p.id}>{p.name} • {p.unit}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="min-w-[140px]">
                                <Input type="number" value={li.unitPrice} onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value || 0) })} />
                              </TableCell>
                              <TableCell className="min-w-[120px]">
                                <Input type="number" value={li.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value || 0) })} />
                              </TableCell>
                              <TableCell className="min-w-[160px] font-medium">{currency((li.quantity || 0) * (li.unitPrice || 0))}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm" onClick={() => removeItem(idx)}>Remove</Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="p-3">
                    <Button variant="outline" size="sm" onClick={addItem}>Add Item</Button>
                  </div>
                </div>

                {/* Totals */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-start-3 border rounded-md p-4 bg-green-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="font-semibold">{currency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">Interest ({Math.round(interestRate * 100)}%)</span>
                      <span className="font-semibold">{currency(interest)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3 border-t pt-3">
                      <span className="text-sm text-gray-700">Grand Total</span>
                      <span className="text-lg font-bold">{currency(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Input value={newApp.notes || ""} onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })} placeholder="Any additional remarks..." />
                  </div>
                  <div className="flex items-end justify-end">
                    <Button onClick={submitApplication} className="bg-green-600 hover:bg-green-700">Submit Application</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <Card>
              <CardHeader>
                <CardTitle>Submitted Applications</CardTitle>
                <CardDescription>Track applications and computed totals.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Planter</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((a) => {
                        const supplierName = suppliers.find(s => s.id === a.supplierId)?.name || "-"
                        const pm = paymentModes.find(p => p.id === a.paymentMode)?.label || a.paymentMode
                        const total = a.items.reduce((s, li) => s + li.quantity * li.unitPrice, 0)
                        const interestR = paymentModes.find(p => p.id === a.paymentMode)?.interestRate || 0
                        const grand = total + total * interestR
                        return (
                          <TableRow key={a.id}>
                            <TableCell className="font-medium">{a.id}</TableCell>
                            <TableCell>{a.planterName} ({a.planterCode})</TableCell>
                            <TableCell>{supplierName}</TableCell>
                            <TableCell>{pm}</TableCell>
                            <TableCell>{a.items.length}</TableCell>
                            <TableCell className="font-semibold">{currency(grand)}</TableCell>
                            <TableCell>
                              <Badge variant={a.status === "pending" ? "secondary" : "default"}>{a.status}</Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {applications.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-sm text-gray-500 py-6">No applications yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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

          <TabsContent value="catalog" className="space-y-4">
            <FertilizerCatalog />
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
    </ProtectedRoute>
  )
}

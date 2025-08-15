"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { UploadZone } from "@/components/ui/upload-zone"
import { Plus, Edit, Trash2, PackagePlus, Warehouse, DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react"

type ProductType = "fertilizer" | "herbicide"

type Supplier = {
  id: string
  name: string
  contact?: string
  phone?: string
  address?: string
}

type Product = {
  id: string
  sku: string
  name: string
  type: ProductType
  gradeOrIngredient?: string
  form?: string
  unit: string
  unitPrice: number
  supplierId: string
  images: string[]
  description?: string
  quantityOnHand: number
  createdAt: string
}

type MovementType = "in" | "out" | "adjustment"
type InventoryMovement = {
  id: string
  productId: string
  type: MovementType
  quantity: number
  unitCost?: number
  reference?: string
  note?: string
  date: string
  supplierId?: string
}

export function FertilizerCatalog() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [activeTab, setActiveTab] = useState("products")
  const [search, setSearch] = useState("")

  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAdjustOpen, setIsAdjustOpen] = useState(false)
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null)
  const [toDeleteProduct, setToDeleteProduct] = useState<Product | null>(null)

  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  // Load from localStorage with sensible seeds when empty
  useEffect(() => {
    try {
      const sStr = localStorage.getItem("fert:suppliers")
      const pStr = localStorage.getItem("fert:products")
      const mStr = localStorage.getItem("fert:movements")

      const seedSuppliers: Supplier[] = [
        { id: "own", name: "Own Supply (Warehouse)", contact: "Warehouse Manager", phone: "+63 912 111 2222" },
        { id: "sup-agrimax", name: "AgriMax Trading", contact: "Anna Reyes", phone: "+63 917 333 4444", address: "Dumaguete City" },
        { id: "sup-growmore", name: "GrowMore Agri Supply", contact: "Mark Cruz", phone: "+63 918 555 6666", address: "Bacolod City" },
      ]

      const seedProducts: Product[] = [
        { id: "PRD-UREA-001", sku: "UREA-50KG", name: "Urea (46-0-0)", type: "fertilizer", gradeOrIngredient: "46-0-0", form: "Granular", unit: "bag (50kg)", unitPrice: 1500, supplierId: "own", images: ["/placeholder.jpg"], description: "High-nitrogen fertilizer for vegetative growth", quantityOnHand: 120, createdAt: new Date().toISOString() },
        { id: "PRD-NPK14-001", sku: "NPK-14-14-14", name: "Complete 14-14-14", type: "fertilizer", gradeOrIngredient: "14-14-14", form: "Granular", unit: "bag (50kg)", unitPrice: 1550, supplierId: "sup-agrimax", images: ["/placeholder.jpg"], description: "Balanced NPK for general-purpose fertilization", quantityOnHand: 75, createdAt: new Date().toISOString() },
        { id: "PRD-GLYPH-001", sku: "HERB-GLYPH48", name: "Glyphosate 48% SL", type: "herbicide", gradeOrIngredient: "Glyphosate 48%", form: "Liquid", unit: "liter", unitPrice: 420, supplierId: "sup-growmore", images: ["/placeholder.jpg"], description: "Systemic non-selective herbicide", quantityOnHand: 200, createdAt: new Date().toISOString() },
      ]

      const today = new Date()
      const seedMovements: InventoryMovement[] = [
        { id: "MV-001", productId: "PRD-UREA-001", type: "in", quantity: 100, unitCost: 1400, reference: "DR-1001", note: "Initial stock", date: today.toISOString(), supplierId: "own" },
        { id: "MV-002", productId: "PRD-NPK14-001", type: "in", quantity: 80, unitCost: 1500, reference: "INV-2002", note: "Supplier delivery", date: today.toISOString(), supplierId: "sup-agrimax" },
        { id: "MV-003", productId: "PRD-GLYPH-001", type: "out", quantity: 20, reference: "REL-0003", note: "Released for assistance", date: today.toISOString(), supplierId: "sup-growmore" },
      ]

      const parsedSuppliers: Supplier[] = sStr ? JSON.parse(sStr) : []
      const parsedProducts: Product[] = pStr ? JSON.parse(pStr) : []
      const parsedMovements: InventoryMovement[] = mStr ? JSON.parse(mStr) : []

      const useSeedSuppliers = parsedSuppliers.length === 0
      const useSeedProducts = parsedProducts.length === 0
      const useSeedMovements = parsedMovements.length === 0

      setSuppliers(useSeedSuppliers ? seedSuppliers : parsedSuppliers)
      setProducts(useSeedProducts ? seedProducts : parsedProducts)
      setMovements(useSeedMovements ? seedMovements : parsedMovements)
    } catch {
      const fallbackSuppliers: Supplier[] = [
        { id: "own", name: "Own Supply (Warehouse)" },
        { id: "sup-agrimax", name: "AgriMax Trading" },
        { id: "sup-growmore", name: "GrowMore Agri Supply" },
      ]
      setSuppliers(fallbackSuppliers)
      setProducts([])
      setMovements([])
    }
  }, [])

  useEffect(() => { localStorage.setItem("fert:suppliers", JSON.stringify(suppliers)) }, [suppliers])
  useEffect(() => { localStorage.setItem("fert:products", JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem("fert:movements", JSON.stringify(movements)) }, [movements])

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.gradeOrIngredient || "").toLowerCase().includes(q)
    )
  }, [products, search])

  function supplierName(id: string) {
    return suppliers.find(s => s.id === id)?.name || "-"
  }

  function upsertProduct(prod: Product) {
    setProducts(prev => {
      const exists = prev.some(p => p.id === prod.id)
      if (exists) return prev.map(p => p.id === prod.id ? prod : p)
      return [prod, ...prev]
    })
    setIsAddProductOpen(false)
    setEditingProduct(null)
  }

  function deleteProduct(id: string) {
    setProducts(prev => prev.filter(p => p.id !== id))
    setToDeleteProduct(null)
  }

  function applyMovement(product: Product, data: { type: MovementType; quantity: number; unitCost?: number; reference?: string; note?: string; date: string; supplierId?: string }) {
    const qty = Number(data.quantity || 0)
    const nextQty = data.type === "in" ? product.quantityOnHand + qty : data.type === "out" ? product.quantityOnHand - qty : qty
    const updated: Product = { ...product, quantityOnHand: Math.max(nextQty, 0) }
    setProducts(prev => prev.map(p => p.id === product.id ? updated : p))
    setMovements(prev => [{ id: `MV-${Date.now()}`, productId: product.id, ...data }, ...prev])
    setIsAdjustOpen(false)
    setAdjustProduct(null)
  }

  function upsertSupplier(s: Supplier) {
    setSuppliers(prev => {
      const exists = prev.some(x => x.id === s.id)
      if (exists) return prev.map(x => x.id === s.id ? s : x)
      return [s, ...prev]
    })
    setIsAddSupplierOpen(false)
    setEditingSupplier(null)
  }

  return (
    <Card className="border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl text-green-800">Fertilizers & Herbicides Catalog</CardTitle>
            <CardDescription>Register products, manage suppliers, and track inventory.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { setEditingSupplier(null); setIsAddSupplierOpen(true) }}>
              <Warehouse className="h-4 w-4 mr-2" /> Add Supplier
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => { setEditingProduct(null); setIsAddProductOpen(true) }}>
              <PackagePlus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Movements</TabsTrigger>
          </TabsList>

          {/* Products */}
          <TabsContent value="products" className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Grade/Ingredient</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> Price</div>
                    </TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden border">
                          {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{p.sku}</TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        <Badge className={p.type === "fertilizer" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>{p.type}</Badge>
                      </TableCell>
                      <TableCell>{p.gradeOrIngredient || "-"}</TableCell>
                      <TableCell>{supplierName(p.supplierId)}</TableCell>
                      <TableCell>₱ {p.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>{p.quantityOnHand}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" onClick={() => { setEditingProduct(p); setIsAddProductOpen(true) }}><Edit className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" onClick={() => { setAdjustProduct(p); setIsAdjustOpen(true) }} title="Adjust Stock"><ArrowUpRight className="h-4 w-4" /></Button>
                          <Button variant="outline" size="sm" className="text-red-600" onClick={() => setToDeleteProduct(p)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-sm text-gray-500 py-6">No products found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Suppliers */}
          <TabsContent value="suppliers" className="space-y-4 mt-4">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.contact || "-"}</TableCell>
                      <TableCell>{s.phone || "-"}</TableCell>
                      <TableCell>{s.address || "-"}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => { setEditingSupplier(s); setIsAddSupplierOpen(true) }}><Edit className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Movements */}
          <TabsContent value="inventory" className="space-y-4 mt-4">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map(m => {
                    const prod = products.find(p => p.id === m.productId)
                    return (
                      <TableRow key={m.id}>
                        <TableCell>{new Date(m.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{prod?.name || m.productId}</TableCell>
                        <TableCell>
                          <Badge className={m.type === "in" ? "bg-green-100 text-green-800" : m.type === "out" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>{m.type}</Badge>
                        </TableCell>
                        <TableCell>{m.quantity}</TableCell>
                        <TableCell>{m.unitCost ? `₱ ${m.unitCost.toLocaleString()}` : "-"}</TableCell>
                        <TableCell>{m.reference || "-"}</TableCell>
                        <TableCell>{m.note || "-"}</TableCell>
                      </TableRow>
                    )
                  })}
                  {movements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-gray-500 py-6">No inventory movements yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>Register fertilizers and herbicides with images, supplier and pricing.</DialogDescription>
          </DialogHeader>
          <ProductForm 
            product={editingProduct || undefined}
            suppliers={suppliers}
            onSubmit={upsertProduct}
            onCancel={() => { setIsAddProductOpen(false); setEditingProduct(null) }}
          />
        </DialogContent>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">Adjust Stock - {adjustProduct?.name}</DialogTitle>
          </DialogHeader>
          {adjustProduct && (
            <AdjustStockForm 
              product={adjustProduct}
              suppliers={suppliers}
              onSubmit={(data) => applyMovement(adjustProduct, data)}
              onCancel={() => { setIsAdjustOpen(false); setAdjustProduct(null) }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
          </DialogHeader>
          <SupplierForm 
            supplier={editingSupplier || undefined}
            onSubmit={upsertSupplier}
            onCancel={() => { setIsAddSupplierOpen(false); setEditingSupplier(null) }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete product confirm */}
      <AlertDialog open={!!toDeleteProduct} onOpenChange={(o) => { if (!o) setToDeleteProduct(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete {toDeleteProduct?.name}? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => toDeleteProduct && deleteProduct(toDeleteProduct.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

interface ProductFormProps {
  product?: Product
  suppliers: Supplier[]
  onSubmit: (product: Product) => void
  onCancel: () => void
}

function ProductForm({ product, suppliers, onSubmit, onCancel }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [form, setForm] = useState<Product>(product || {
    id: "",
    sku: "",
    name: "",
    type: "fertilizer",
    gradeOrIngredient: "",
    form: "Granular",
    unit: "bag (50kg)",
    unitPrice: 0,
    supplierId: suppliers[0]?.id || "own",
    images: [],
    description: "",
    quantityOnHand: 0,
    createdAt: new Date().toISOString(),
  })

  useEffect(() => { setForm(prev => ({ ...prev, id: prev.id || (product?.id ?? `PRD-${Date.now()}`) })) }, [product])
  useEffect(() => { setForm(prev => ({ ...prev, images })) }, [images])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.sku) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fertilizer">Fertilizer</SelectItem>
                <SelectItem value="herbicide">Herbicide</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="grade">NPK Grade / Active Ingredient</Label>
            <Input id="grade" value={form.gradeOrIngredient || ""} onChange={(e) => setForm({ ...form, gradeOrIngredient: e.target.value })} placeholder="e.g., 14-14-14 or Glyphosate 48%" />
          </div>
          <div>
            <Label htmlFor="form">Form</Label>
            <Input id="form" value={form.form || ""} onChange={(e) => setForm({ ...form, form: e.target.value })} placeholder="Granular / Liquid" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="bag (50kg) / liter / kg" />
          </div>
          <div>
            <Label htmlFor="price">Unit Price (₱)</Label>
            <Input id="price" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value || 0) })} />
          </div>
          <div>
            <Label>Supplier</Label>
            <Select value={form.supplierId} onValueChange={(v: any) => setForm({ ...form, supplierId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {suppliers.map(s => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description or usage notes" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Images</Label>
        <UploadZone 
          title="Upload product images"
          color={form.type === "fertilizer" ? "green" : "blue"}
          multiple
          maxFiles={5}
          onChange={(files) => {
            const readers = files.map(f => new Promise<string>((resolve) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.readAsDataURL(f) }))
            Promise.all(readers).then((urls) => setImages(urls))
          }}
          enableCapture
          captureMode="environment"
          note="PNG, JPG up to 5MB. Maximum 5 images."
        />
        <div className="flex gap-2 flex-wrap mt-2">
          {images.map((src, i) => (
            <div key={i} className="w-20 h-20 rounded border overflow-hidden">
              <img src={src} alt={`image-${i}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">{product ? "Update Product" : "Add Product"}</Button>
      </div>
    </form>
  )
}

interface AdjustStockFormProps {
  product: Product
  suppliers: Supplier[]
  onSubmit: (movement: { type: MovementType; quantity: number; unitCost?: number; reference?: string; note?: string; date: string; supplierId?: string }) => void
  onCancel: () => void
}

function AdjustStockForm({ product, suppliers, onSubmit, onCancel }: AdjustStockFormProps) {
  const [type, setType] = useState<MovementType>("in")
  const [quantity, setQuantity] = useState(0)
  const [unitCost, setUnitCost] = useState<number | undefined>(undefined)
  const [reference, setReference] = useState("")
  const [note, setNote] = useState("")
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10))
  const [supplierId, setSupplierId] = useState<string>(suppliers[0]?.id || "own")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ type, quantity, unitCost, reference, note, date, supplierId })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Movement Type</Label>
          <Select value={type} onValueChange={(v: any) => setType(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="in">Stock In</SelectItem>
              <SelectItem value="out">Stock Out</SelectItem>
              <SelectItem value="adjustment">Set to Quantity</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Quantity</Label>
          <Input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value || 0))} />
        </div>
        <div>
          <Label>Unit Cost (₱)</Label>
          <Input type="number" value={unitCost ?? ""} onChange={(e) => setUnitCost(Number(e.target.value || 0))} />
        </div>
        <div>
          <Label>Supplier</Label>
          <Select value={supplierId} onValueChange={(v: any) => setSupplierId(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {suppliers.map(s => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label>Reference</Label>
          <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Invoice/DR No." />
        </div>
        <div className="md:col-span-2">
          <Label>Note</Label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          {type === "in" ? <ArrowDownLeft className="h-4 w-4 mr-2" /> : <ArrowUpRight className="h-4 w-4 mr-2" />}
          Apply
        </Button>
      </div>
    </form>
  )
}

interface SupplierFormProps {
  supplier?: Supplier
  onSubmit: (supplier: Supplier) => void
  onCancel: () => void
}

function SupplierForm({ supplier, onSubmit, onCancel }: SupplierFormProps) {
  const [form, setForm] = useState<Supplier>(supplier || { id: "", name: "", contact: "", phone: "", address: "" })
  useEffect(() => { setForm(prev => ({ ...prev, id: prev.id || (supplier?.id ?? `SUP-${Date.now()}`) })) }, [supplier])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) return
    onSubmit(form)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="sname">Supplier Name</Label>
        <Input id="sname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contact">Contact Person</Label>
          <Input id="contact" value={form.contact || ""} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
      </div>
      <div>
        <Label htmlFor="addr">Address</Label>
        <Input id="addr" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">{supplier ? "Update Supplier" : "Add Supplier"}</Button>
      </div>
    </form>
  )
}

export default FertilizerCatalog



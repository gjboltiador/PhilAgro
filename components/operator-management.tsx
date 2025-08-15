"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Upload, Camera, Save, X } from "lucide-react"
import { UploadZone } from "@/components/ui/upload-zone"

type TractorOption = { id: string; model: string }

type Operator = {
  id: string
  fullName: string
  contactNumber: string
  address?: string
  specialization?: string
  experienceYears?: number
  status: "active" | "available" | "off-duty"
  assignedTractorId?: string
  photos?: {
    operatorPhotoDataUrl?: string
  }
}

interface OperatorManagementProps {
  tractors: TractorOption[]
}

export function OperatorManagement({ tractors }: OperatorManagementProps) {
  const [operators, setOperators] = useState<Operator[]>([])
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selected, setSelected] = useState<Operator | null>(null)
  const [toDelete, setToDelete] = useState<Operator | null>(null)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("operator-management:list") : null
    if (stored) {
      try {
        setOperators(JSON.parse(stored))
      } catch {
        setOperators([])
      }
    } else {
      setOperators([
        {
          id: "OPR-" + Date.now().toString().slice(-6),
          fullName: "Juan Dela Cruz",
          contactNumber: "+63 912 222 3333",
          address: "Bayawan City, Negros Oriental",
          specialization: "Harrowing / Plowing",
          experienceYears: 5,
          status: "active",
          assignedTractorId: tractors[0]?.id,
          photos: {},
        },
      ])
    }
  }, [tractors])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("operator-management:list", JSON.stringify(operators))
    }
  }, [operators])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return operators
    return operators.filter(op =>
      op.fullName.toLowerCase().includes(q) ||
      (op.assignedTractorId && tractors.find(t => t.id === op.assignedTractorId)?.model.toLowerCase().includes(q)) ||
      (op.specialization || "").toLowerCase().includes(q)
    )
  }, [operators, tractors, search])

  function handleAdd(op: Operator) {
    setOperators(prev => [...prev, op])
    setIsAddOpen(false)
  }

  function handleUpdate(op: Operator) {
    setOperators(prev => prev.map(o => o.id === op.id ? op : o))
    setIsEditOpen(false)
    setSelected(null)
  }

  function handleDelete(id: string) {
    setOperators(prev => prev.filter(o => o.id !== id))
    setToDelete(null)
  }

  function statusBadge(status: Operator["status"]) {
    if (status === "active") return <Badge className="bg-green-100 text-green-800">Active</Badge>
    if (status === "available") return <Badge className="bg-blue-100 text-blue-800">Available</Badge>
    return <Badge className="bg-amber-100 text-amber-800">Off Duty</Badge>
  }

  return (
    <Card className="border-green-200">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-green-800 text-2xl font-bold">Operator Management</CardTitle>
            <CardDescription className="text-green-600">Manage operator details and assignments</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Search operators..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-60" />
            <Button onClick={() => setIsAddOpen(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Operator
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Operator</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Specialization</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Experience</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned Tractor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((op) => {
                const tractor = op.assignedTractorId ? tractors.find(t => t.id === op.assignedTractorId) : undefined
                return (
                  <tr key={op.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border">
                          {op.photos?.operatorPhotoDataUrl ? (
                            <img src={op.photos.operatorPhotoDataUrl} alt={op.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{op.fullName}</div>
                          <div className="text-xs text-gray-500">{statusBadge(op.status)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <div>{op.contactNumber}</div>
                      {op.address && <div className="text-xs text-gray-500">{op.address}</div>}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{op.specialization || "-"}</td>
                    <td className="py-3 px-4 text-gray-700">{op.experienceYears ?? 0} yrs</td>
                    <td className="py-3 px-4 text-gray-700">{tractor ? tractor.model : "Unassigned"}</td>
                    <td className="py-3 px-4">{statusBadge(op.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => { setSelected(op); setIsEditOpen(true) }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setToDelete(op)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td className="py-8 text-center text-gray-500" colSpan={7}>No operators found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-800">
                <Plus className="h-5 w-5" />
                Add Operator
              </DialogTitle>
              <DialogDescription>Enter operator details and assignments.</DialogDescription>
            </DialogHeader>
            <OperatorForm 
              tractors={tractors}
              onSubmit={handleAdd}
              onCancel={() => setIsAddOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-800">
                <Edit className="h-5 w-5" />
                Edit Operator
              </DialogTitle>
              <DialogDescription>Update operator details and assignments.</DialogDescription>
            </DialogHeader>
            {selected && (
              <OperatorForm 
                operator={selected}
                tractors={tractors}
                onSubmit={handleUpdate}
                onCancel={() => { setIsEditOpen(false); setSelected(null) }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={!!toDelete} onOpenChange={(open) => { if (!open) setToDelete(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Operator</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete operator {toDelete?.fullName}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => toDelete && handleDelete(toDelete.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

interface OperatorFormProps {
  operator?: Operator
  tractors: TractorOption[]
  onSubmit: (op: Operator) => void
  onCancel: () => void
}

function OperatorForm({ operator, tractors, onSubmit, onCancel }: OperatorFormProps) {
  const [formData, setFormData] = useState<Operator>(
    operator || {
      id: "",
      fullName: "",
      contactNumber: "",
      address: "",
      specialization: "",
      experienceYears: 0,
      status: "active",
      assignedTractorId: undefined,
      photos: {},
    }
  )

  const hiddenFileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setFormData(prev => ({ ...prev, id: prev.id || (operator?.id ?? `OPR-${Date.now()}`) }))
  }, [operator])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.fullName) return
    onSubmit(formData)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        photos: { ...prev.photos, operatorPhotoDataUrl: String(reader.result) },
      }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="contact">Contact Number</Label>
            <Input id="contact" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={formData.address || ""} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div>
            <Label>Operator Photo</Label>
            <div className="mt-2">
              <UploadZone 
                title="Upload operator photo"
                color="green"
                multiple={false}
                onChange={(files) => {
                  const f = files[0]
                  if (!f) return
                  const reader = new FileReader()
                  reader.onload = () => setFormData(prev => ({ ...prev, photos: { ...prev.photos, operatorPhotoDataUrl: String(reader.result) } }))
                  reader.readAsDataURL(f)
                }}
                enableCapture
                captureMode="user"
                note="PNG, JPG up to 5MB."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Assignment & Role</h3>
          <div>
            <Label htmlFor="specialization">Specialization</Label>
            <Input id="specialization" value={formData.specialization || ""} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} placeholder="e.g., Plowing, Harrowing" />
          </div>
          <div>
            <Label htmlFor="experience">Experience (years)</Label>
            <Input id="experience" type="number" value={formData.experienceYears ?? 0} onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value || 0) })} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="off-duty">Off Duty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="assignedTractor">Assign Tractor</Label>
            <Select value={formData.assignedTractorId ?? "unassigned"} onValueChange={(v: any) => setFormData({ ...formData, assignedTractorId: v === "unassigned" ? undefined : v })}>
              <SelectTrigger>
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {tractors.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" /> {operator ? "Update Operator" : "Add Operator"}
        </Button>
      </div>
    </form>
  )
}

export default OperatorManagement



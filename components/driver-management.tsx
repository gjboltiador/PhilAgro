"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { 
  Badge,
} from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { 
  Plus, Edit, Trash2, Camera, Upload, Save, X, AlertCircle 
} from "lucide-react"
import { UploadZone } from "@/components/ui/upload-zone"

type TruckOption = { id: string; plateNumber: string }

type Driver = {
  id: string
  fullName: string
  contactNumber: string
  address?: string
  status: "active" | "on-leave" | "suspended"
  assignedTruckId?: string
  license: {
    number: string
    expiryDate: string
    restrictions?: string
    licenseClass?: string
  }
  photos?: {
    driverPhotoDataUrl?: string
    licensePhotoDataUrl?: string
  }
}

interface DriverManagementProps {
  trucks: TruckOption[]
}

export function DriverManagement({ trucks }: DriverManagementProps) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [search, setSearch] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selected, setSelected] = useState<Driver | null>(null)
  const [toDelete, setToDelete] = useState<Driver | null>(null)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("driver-management:list") : null
    if (stored) {
      try {
        setDrivers(JSON.parse(stored))
      } catch {
        setDrivers([])
      }
    } else {
      // Seed with sample
      setDrivers([
        {
          id: "DRV-" + Date.now().toString().slice(-6),
          fullName: "Juan Santos",
          contactNumber: "+63 917 123 4567",
          address: "Bacolod City, Negros Occidental",
          status: "active",
          assignedTruckId: trucks[0]?.id,
          license: {
            number: "N01-12-345678",
            expiryDate: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split("T")[0],
            restrictions: "A, B",
            licenseClass: "Professional",
          },
          photos: {},
        },
      ])
    }
  }, [trucks])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("driver-management:list", JSON.stringify(drivers))
    }
  }, [drivers])

  const filteredDrivers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return drivers
    return drivers.filter((d) =>
      d.fullName.toLowerCase().includes(q) ||
      d.license.number.toLowerCase().includes(q) ||
      (d.assignedTruckId && trucks.find(t => t.id === d.assignedTruckId)?.plateNumber.toLowerCase().includes(q))
    )
  }, [drivers, search, trucks])

  function getExpiryBadge(expiry: string) {
    const today = new Date()
    const exp = new Date(expiry)
    const days = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (isNaN(days)) return <Badge variant="secondary">Unknown</Badge>
    if (days < 0) return <Badge className="bg-red-100 text-red-800">Expired</Badge>
    if (days <= 30) return <Badge className="bg-amber-100 text-amber-800">Expiring</Badge>
    return <Badge className="bg-green-100 text-green-800">Valid</Badge>
  }

  function handleAdd(driver: Driver) {
    setDrivers((prev) => [...prev, driver])
    setIsAddOpen(false)
  }

  function handleUpdate(driver: Driver) {
    setDrivers((prev) => prev.map((d) => (d.id === driver.id ? driver : d)))
    setIsEditOpen(false)
    setSelected(null)
  }

  function handleDelete(id: string) {
    setDrivers((prev) => prev.filter((d) => d.id !== id))
    setToDelete(null)
  }


  return (
    <Card className="border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-blue-800 text-2xl font-bold">Driver Management</CardTitle>
            <CardDescription className="text-blue-600">Manage driver details and assignments</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search drivers by name, license or truck..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-60"
            />
            <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Driver</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">License</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Expiry</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Restrictions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Assigned Truck</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((d) => {
                const truck = d.assignedTruckId ? trucks.find(t => t.id === d.assignedTruckId) : undefined
                return (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border">
                          {d.photos?.driverPhotoDataUrl ? (
                            <img src={d.photos.driverPhotoDataUrl} alt={d.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{d.fullName}</div>
                          <div className="text-xs text-gray-500">
                            {d.status === "active" && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                            {d.status === "on-leave" && <Badge className="bg-amber-100 text-amber-800">On Leave</Badge>}
                            {d.status === "suspended" && <Badge className="bg-red-100 text-red-800">Suspended</Badge>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <div>{d.contactNumber}</div>
                      {d.address && <div className="text-xs text-gray-500">{d.address}</div>}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <div className="font-mono text-sm">{d.license.number}</div>
                      <div className="mt-1 w-16 h-10 rounded bg-gray-100 overflow-hidden border">
                        {d.photos?.licensePhotoDataUrl ? (
                          <img src={d.photos.licensePhotoDataUrl} alt="License" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700">{d.license.expiryDate || "-"}</span>
                        {getExpiryBadge(d.license.expiryDate)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{d.license.restrictions || "-"}</td>
                    <td className="py-3 px-4 text-gray-700">{truck ? `${truck.plateNumber}` : "Unassigned"}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" size="sm" 
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => { setSelected(d); setIsEditOpen(true) }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setToDelete(d)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filteredDrivers.length === 0 && (
                <tr>
                  <td className="py-8 text-center text-gray-500" colSpan={7}>No drivers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-800">
                <Plus className="h-5 w-5" />
                Add Driver
              </DialogTitle>
              <DialogDescription>Enter driver details, license and assignments.</DialogDescription>
            </DialogHeader>
            <DriverForm 
              trucks={trucks}
              onSubmit={(data) => handleAdd(data)}
              onCancel={() => setIsAddOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-800">
                <Edit className="h-5 w-5" />
                Edit Driver
              </DialogTitle>
              <DialogDescription>Update driver details, license and assignments.</DialogDescription>
            </DialogHeader>
            {selected && (
              <DriverForm 
                driver={selected}
                trucks={trucks}
                onSubmit={(data) => handleUpdate(data)}
                onCancel={() => { setIsEditOpen(false); setSelected(null) }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirm */}
        <AlertDialog open={!!toDelete} onOpenChange={(open) => { if (!open) setToDelete(null) }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Driver</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete driver {toDelete?.fullName}? This action cannot be undone.
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

interface DriverFormProps {
  driver?: Driver
  trucks: TruckOption[]
  onSubmit: (driver: Driver) => void
  onCancel: () => void
}

function DriverForm({ driver, trucks, onSubmit, onCancel }: DriverFormProps) {
  const [formData, setFormData] = useState<Driver>(
    driver || {
      id: "",
      fullName: "",
      contactNumber: "",
      address: "",
      status: "active",
      assignedTruckId: undefined,
      license: {
        number: "",
        expiryDate: "",
        restrictions: "",
        licenseClass: "Professional",
      },
      photos: {},
    }
  )

  // For taking snapshot, the capture occurs via global camera modal; we handle upload here
  const hiddenDriverFileRef = useRef<HTMLInputElement | null>(null)
  const hiddenLicenseFileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setFormData((prev) => ({ ...prev, id: prev.id || (driver?.id ?? `DRV-${Date.now()}`) }))
  }, [driver])

  const isExpired = useMemo(() => {
    if (!formData.license.expiryDate) return false
    return new Date(formData.license.expiryDate) < new Date()
  }, [formData.license.expiryDate])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.fullName || !formData.license.number || !formData.license.expiryDate) return
    onSubmit(formData)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, target: "driver" | "license") {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        photos: {
          ...prev.photos,
          driverPhotoDataUrl: target === "driver" ? String(reader.result) : prev.photos?.driverPhotoDataUrl,
          licensePhotoDataUrl: target === "license" ? String(reader.result) : prev.photos?.licensePhotoDataUrl,
        },
      }))
    }
    reader.readAsDataURL(file)
  }

  // Bridge to capture from the global camera: open camera and then intercept a frame using a temporary hidden video in that modal
  // Simpler approach: open camera and instruct user to use native upload with capture attribute on mobile; also provide manual upload.

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
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Driver Photo</Label>
            <div className="mt-2">
              <UploadZone 
                title="Upload driver photo"
                color="blue"
                multiple={false}
                onChange={(files) => {
                  const f = files[0]
                  if (!f) return
                  const reader = new FileReader()
                  reader.onload = () => setFormData(prev => ({ ...prev, photos: { ...prev.photos, driverPhotoDataUrl: String(reader.result) } }))
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
          <h3 className="text-lg font-semibold">License Information</h3>
          <div>
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input id="licenseNumber" value={formData.license.number} onChange={(e) => setFormData({ ...formData, license: { ...formData.license, number: e.target.value } })} required />
          </div>
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input id="expiryDate" type="date" value={formData.license.expiryDate} onChange={(e) => setFormData({ ...formData, license: { ...formData.license, expiryDate: e.target.value } })} required />
            {isExpired && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                <AlertCircle className="h-4 w-4" /> License is expired
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="licenseClass">License Class</Label>
            <Input id="licenseClass" value={formData.license.licenseClass || ""} onChange={(e) => setFormData({ ...formData, license: { ...formData.license, licenseClass: e.target.value } })} placeholder="e.g., Non-Professional / Professional" />
          </div>
          <div>
            <Label htmlFor="restrictions">Restrictions</Label>
            <Input id="restrictions" value={formData.license.restrictions || ""} onChange={(e) => setFormData({ ...formData, license: { ...formData.license, restrictions: e.target.value } })} placeholder="e.g., A, B" />
          </div>
          <div>
            <Label>License Image</Label>
            <div className="mt-2">
              <UploadZone 
                title="Upload driver's license image"
                color="orange"
                multiple={false}
                onChange={(files) => {
                  const f = files[0]
                  if (!f) return
                  const reader = new FileReader()
                  reader.onload = () => setFormData(prev => ({ ...prev, photos: { ...prev.photos, licensePhotoDataUrl: String(reader.result) } }))
                  reader.readAsDataURL(f)
                }}
                enableCapture
                captureMode="environment"
                note="PNG, JPG up to 5MB."
              />
            </div>
          </div>

          {driver && (
            <div>
              <Label htmlFor="assignedTruck">Assign Truck</Label>
              <Select value={formData.assignedTruckId ?? "unassigned"} onValueChange={(v: any) => setFormData({ ...formData, assignedTruckId: v === "unassigned" ? undefined : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {trucks.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.plateNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" /> {driver ? "Update Driver" : "Add Driver"}
        </Button>
      </div>
    </form>
  )
}

export default DriverManagement



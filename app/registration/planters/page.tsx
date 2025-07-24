"use client"

import { DashboardLayout } from "@/components/sidebar-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, MoreHorizontal, Plus, Search, User, MapPin, Upload, Camera, FileImage } from "lucide-react"
import { useState } from "react"

export default function PlantersRegistrationPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    contactNumber: "+63 912 345 6789",
    emailAddress: "farmer@example.com",
    completeAddress: "",
    barangay: "",
    municipality: "",
    province: "",
    profilePicture: null as File | null,
    validIdType: "",
    validIdNumber: "",
    validIdPicture: null as File | null
  })

  const provinces = [
    "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay", "Antique", "Apayao", "Aurora", "Basilan", "Bataan", "Batanes", "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan", "Cagayan", "Camarines Norte", "Camarines Sur", "Camiguin", "Capiz", "Catanduanes", "Cavite", "Cebu", "Cotabato", "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union", "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte", "Maguindanao", "Marinduque", "Masbate", "Metro Manila", "Misamis Occidental", "Misamis Oriental", "Mountain Province", "Negros Occidental", "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Pampanga", "Pangasinan", "Quezon", "Quirino", "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon", "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu", "Surigao del Norte", "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"
  ]

  const validIdTypes = [
    "Philippine Passport",
    "Driver's License",
    "SSS ID",
    "GSIS ID",
    "PhilHealth ID",
    "TIN ID",
    "Postal ID",
    "Voter's ID",
    "Senior Citizen ID",
    "UMID (Unified Multi-Purpose ID)",
    "PRC ID",
    "OWWA ID",
    "OFW ID",
    "Seaman's Book",
    "Alien Certificate of Registration (ACR)",
    "Certificate of Naturalization",
    "Other Government-Issued ID"
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    handleFileChange("profilePicture", file)
  }

  const handleValidIdUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    handleFileChange("validIdPicture", file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    setIsDialogOpen(false)
    // Reset form
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      contactNumber: "+63 912 345 6789",
      emailAddress: "farmer@example.com",
      completeAddress: "",
      barangay: "",
      municipality: "",
      province: "",
      profilePicture: null,
      validIdType: "",
      validIdNumber: "",
      validIdPicture: null
    })
  }

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-farm-green-600 hover:bg-farm-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Register New Planter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] mx-auto overflow-y-auto">
              <div className="p-6 py-8 custom-scrollbar">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-farm-green-800">Register New Planter</DialogTitle>
                <DialogDescription className="text-farm-green-600">
                  Enter the planter's personal and address information
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6 pr-2">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-farm-green-200">
                    <User className="h-5 w-5 text-farm-green-600" />
                    <h3 className="text-lg font-semibold text-farm-green-800">Personal Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="middleName" className="text-sm font-medium text-gray-700">
                        Middle Name
                      </Label>
                      <Input
                        id="middleName"
                        placeholder="Enter middle name"
                        value={formData.middleName}
                        onChange={(e) => handleInputChange("middleName", e.target.value)}
                        className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700">
                        Contact Number *
                      </Label>
                      <Input
                        id="contactNumber"
                        type="tel"
                        value={formData.contactNumber}
                        onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                        className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emailAddress" className="text-sm font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="emailAddress"
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                        className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Picture Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-farm-green-200">
                    <Camera className="h-5 w-5 text-farm-green-600" />
                    <h3 className="text-lg font-semibold text-farm-green-800">Profile Picture</h3>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                        {formData.profilePicture ? (
                          <img
                            src={URL.createObjectURL(formData.profilePicture)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <Label htmlFor="profilePicture" className="text-sm font-medium text-gray-700 mb-2 block">
                        Upload Profile Picture *
                      </Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          id="profilePicture"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="profilePicture"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-farm-green-600 text-white rounded-lg hover:bg-farm-green-700 transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Choose Photo
                        </label>
                        <span className="text-sm text-gray-500">
                          {formData.profilePicture ? formData.profilePicture.name : "No file chosen"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Accepted formats: JPG, PNG, GIF. Max size: 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Valid ID Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-farm-green-200">
                    <FileImage className="h-5 w-5 text-farm-green-600" />
                    <h3 className="text-lg font-semibold text-farm-green-800">Valid ID Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="validIdType" className="text-sm font-medium text-gray-700">
                        Valid ID Type *
                      </Label>
                      <Select value={formData.validIdType} onValueChange={(value) => handleInputChange("validIdType", value)}>
                        <SelectTrigger className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select valid ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          {validIdTypes.map((idType) => (
                            <SelectItem key={idType} value={idType}>
                              {idType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="validIdNumber" className="text-sm font-medium text-gray-700">
                        ID Number *
                      </Label>
                      <Input
                        id="validIdNumber"
                        placeholder="Enter ID number"
                        value={formData.validIdNumber}
                        onChange={(e) => handleInputChange("validIdNumber", e.target.value)}
                        className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="validIdPicture" className="text-sm font-medium text-gray-700">
                      Upload Valid ID Picture *
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-farm-green-400 transition-colors">
                      <input
                        type="file"
                        id="validIdPicture"
                        accept="image/*"
                        onChange={handleValidIdUpload}
                        className="hidden"
                      />
                      <label htmlFor="validIdPicture" className="cursor-pointer">
                        <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-farm-green-600">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-xs text-gray-500">
                          {formData.validIdPicture ? formData.validIdPicture.name : "PNG, JPG, GIF up to 10MB"}
                        </div>
                      </label>
                    </div>
                    
                    {formData.validIdPicture && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
                        <div className="max-w-xs border rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(formData.validIdPicture)}
                            alt="Valid ID"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-farm-green-200">
                    <MapPin className="h-5 w-5 text-farm-green-600" />
                    <h3 className="text-lg font-semibold text-farm-green-800">Address Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="completeAddress" className="text-sm font-medium text-gray-700">
                        Complete Address *
                      </Label>
                      <Textarea
                        id="completeAddress"
                        placeholder="House No., Street, Subdivision"
                        value={formData.completeAddress}
                        onChange={(e) => handleInputChange("completeAddress", e.target.value)}
                        className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[80px]"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="barangay" className="text-sm font-medium text-gray-700">
                          Barangay *
                        </Label>
                        <Input
                          id="barangay"
                          placeholder="Enter barangay"
                          value={formData.barangay}
                          onChange={(e) => handleInputChange("barangay", e.target.value)}
                          className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="municipality" className="text-sm font-medium text-gray-700">
                          Municipality/City *
                        </Label>
                        <Input
                          id="municipality"
                          placeholder="Enter municipality/city"
                          value={formData.municipality}
                          onChange={(e) => handleInputChange("municipality", e.target.value)}
                          className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                          Province *
                        </Label>
                        <Select value={formData.province} onValueChange={(value) => handleInputChange("province", value)}>
                          <SelectTrigger className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            {provinces.map((province) => (
                              <SelectItem key={province} value={province}>
                                {province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-farm-green-600 hover:bg-farm-green-700 text-white"
                  >
                    Register Planter
                  </Button>
                </div>
              </form>
              </div>
            </DialogContent>
          </Dialog>
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

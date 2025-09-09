"use client"

import { DashboardLayout } from "@/components/sidebar-navigation"
import { ProtectedRoute } from "@/components/protected-route"
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
import { Filter, MoreHorizontal, Plus, Search, User, MapPin, Upload, Camera, FileImage, Building2, Users, AlertTriangle, Edit, Trash2, Eye, Loader2, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { usePlanters } from "@/hooks/use-planters"
import { useValidIdTypes } from "@/hooks/use-valid-id-types"
import { Planter, CreatePlanterRequest } from "@/lib/planters-dao"
import { useToast } from "@/hooks/use-toast"

// Sugar Mill data structure (matching API response)
interface SugarMill {
  id: number
  plant_code: string
  full_name: string
  short_name: string
  city: string
  province: string
  operating_status: "operational" | "maintenance" | "closed" | "seasonal"
}

// Association data structure (matching database schema)
interface Association {
  id: number
  name: string
  short_name: string
  contact_email?: string
  contact_person?: string
  phone?: string
  address?: string
  website?: string
  logo_url?: string
  registration_number?: string
  tax_id?: string
  dues_amount?: number
  dues_frequency?: 'Annually' | 'Quarterly' | 'Monthly'
  crop_year?: string
  crop_year_label?: string
  assoc_type: 'cooperative' | 'association' | 'union' | 'federation' | 'company' | 'other'
  status: 'Active' | 'Inactive'
  member_count?: number
  created_at: Date
  updated_at: Date
}

export default function PlantersRegistrationPage() {
  const { toast } = useToast()
  const { planters, loading, error, createPlanter, updatePlanter, deletePlanter, refreshPlanters } = usePlanters()
  const { validIdTypes, loading: loadingValidIdTypes, error: validIdTypesError } = useValidIdTypes()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingPlanter, setEditingPlanter] = useState<Planter | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("all")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successTitle, setSuccessTitle] = useState("")
  const [showMainSuccessMessage, setShowMainSuccessMessage] = useState(false)
  const [mainSuccessMessage, setMainSuccessMessage] = useState("")
  
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    gender: "",
    birthDate: "",
    contactNumber: "",
    emailAddress: "",
    completeAddress: "",
    barangay: "",
    municipality: "",
    province: "",
    profilePicture: null as File | null,
    idType: "",
    validIdNumber: "",
    validIdPicture: null as File | null,
    sugarMillId: "",
    sugarMillCode: "",
    associationId: "",
    associationName: "",
    farmSize: ""
  })

  const provinces = [
    "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan", "Albay", "Antique", "Apayao", "Aurora", "Basilan", "Bataan", "Batanes", "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan", "Cagayan", "Camarines Norte", "Camarines Sur", "Camiguin", "Capiz", "Catanduanes", "Cavite", "Cebu", "Cotabato", "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental", "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union", "Laguna", "Lanao del Norte", "Lanao del Sur", "Leyte", "Maguindanao", "Marinduque", "Masbate", "Metro Manila", "Misamis Occidental", "Misamis Oriental", "Mountain Province", "Negros Occidental", "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Pampanga", "Pangasinan", "Quezon", "Quirino", "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon", "South Cotabato", "Southern Leyte", "Sultan Kudarat", "Sulu", "Surigao del Norte", "Surigao del Sur", "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"
  ]

  // Valid ID types are now fetched from the database via API

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ]

  const suffixOptions = [
    "Jr.",
    "Sr.",
    "II",
    "III",
    "IV",
    "V"
  ]

  // State for Sugar Mills and Associations from database
  const [sugarMills, setSugarMills] = useState<SugarMill[]>([])
  const [associations, setAssociations] = useState<Association[]>([])
  const [loadingSugarMills, setLoadingSugarMills] = useState(false)
  const [loadingAssociations, setLoadingAssociations] = useState(false)

  // Fetch Sugar Mills from database
  const fetchSugarMills = async () => {
    try {
      setLoadingSugarMills(true)
      const response = await fetch('/api/sugar-mills')
      const result = await response.json()
      
      if (result.success) {
        console.log('Sugar Mills fetched:', result.data)
        setSugarMills(result.data || [])
      } else {
        console.error('Failed to fetch sugar mills:', result.message)
        toast({
          title: "Error",
          description: "Failed to load sugar mills",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching sugar mills:', error)
      toast({
        title: "Error",
        description: "Failed to load sugar mills",
        variant: "destructive",
      })
    } finally {
      setLoadingSugarMills(false)
    }
  }

  // Fetch Associations from database
  const fetchAssociations = async () => {
    try {
      setLoadingAssociations(true)
      const response = await fetch('/api/associations')
      const result = await response.json()
      
      if (result.success) {
        console.log('Associations fetched:', result.data)
        setAssociations(result.data || [])
      } else {
        console.error('Failed to fetch associations:', result.message)
        toast({
          title: "Error",
          description: "Failed to load associations",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching associations:', error)
      toast({
        title: "Error",
        description: "Failed to load associations",
        variant: "destructive",
      })
    } finally {
      setLoadingAssociations(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchSugarMills()
    fetchAssociations()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // If sugar mill is changed, reset association selection
    if (field === "sugarMillId") {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        associationId: "",
        associationName: ""
      }))
    }
  }

  // Get filtered associations (all active associations)
  const getFilteredAssociations = () => {
    return associations.filter(association => 
      association.status === "Active"
    )
  }

  // Get selected sugar mill details
  const getSelectedSugarMill = () => {
    return sugarMills.find(mill => mill.id?.toString() === formData.sugarMillId)
  }

  // Get selected association details
  const getSelectedAssociation = () => {
    return associations.find(association => association.id?.toString() === formData.associationId)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Combine address fields into single address field for database
      const combinedAddress = [
        formData.completeAddress,
        formData.barangay,
        formData.municipality,
        formData.province
      ].filter(Boolean).join(', ')

      const planterData: CreatePlanterRequest = {
        first_name: formData.firstName,
        middle_name: formData.middleName || undefined,
        last_name: formData.lastName,
        suffix: formData.suffix || undefined,
        gender: formData.gender as 'male' | 'female' | 'other',
        birthdate: formData.birthDate || undefined,
        address: combinedAddress || formData.completeAddress, // Use combined address or fallback to complete address
        contact_number: formData.contactNumber || undefined,
        email: formData.emailAddress || undefined,
        id_type: formData.idType ? parseInt(formData.idType) : undefined,
        id_number: formData.validIdNumber || undefined,
        farm_size: formData.farmSize ? parseFloat(formData.farmSize) : undefined,
        sugar_mill_id: formData.sugarMillId ? parseInt(formData.sugarMillId) : undefined,
        association_id: formData.associationId ? parseInt(formData.associationId) : undefined,
        status: 'active'
      }

      if (isEditMode && editingPlanter) {
        await updatePlanter({
          id: editingPlanter.id,
          ...planterData
        })
        setSuccessTitle("✅ Planter Updated Successfully!")
        setSuccessMessage(`Planter "${editingPlanter.first_name} ${editingPlanter.last_name}" has been updated successfully!`)
        setShowSuccessModal(true)
        setMainSuccessMessage(`✅ ${editingPlanter.first_name} ${editingPlanter.last_name}'s information has been updated`)
        setShowMainSuccessMessage(true)
        toast({
          title: "✅ Planter Updated",
          description: `Successfully updated ${editingPlanter.first_name} ${editingPlanter.last_name}'s information`,
        })
      } else {
        await createPlanter(planterData)
        setSuccessTitle("🎉 Planter Registered Successfully!")
        setSuccessMessage(`New planter "${formData.firstName} ${formData.lastName}" has been registered successfully!`)
        setShowSuccessModal(true)
        setMainSuccessMessage(`🎉 ${formData.firstName} ${formData.lastName} has been registered as a new planter`)
        setShowMainSuccessMessage(true)
        toast({
          title: "🎉 Planter Registered",
          description: `Successfully registered ${formData.firstName} ${formData.lastName} as a new planter`,
        })
      }

      // Close the form dialog immediately to show success modal
      setIsDialogOpen(false)
      resetForm()

      // Clear main success message after a delay
      setTimeout(() => {
        setShowMainSuccessMessage(false)
        setMainSuccessMessage("")
      }, 5000) // Show main success message for 5 seconds
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save planter",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      gender: "",
      birthDate: "",
      contactNumber: "",
      emailAddress: "",
      completeAddress: "",
      barangay: "",
      municipality: "",
      province: "",
      profilePicture: null,
      idType: "",
      validIdNumber: "",
      validIdPicture: null,
      sugarMillId: "",
      sugarMillCode: "",
      associationId: "",
      associationName: "",
      farmSize: ""
    })
    setIsEditMode(false)
    setEditingPlanter(null)
  }

  // Function to parse address into components
  const parseAddress = (address: string) => {
    if (!address) return { completeAddress: "", barangay: "", municipality: "", province: "" }
    
    // Try to parse address components from the stored address
    // This is a simple parsing - you might want to improve this based on your data format
    const parts = address.split(',').map(part => part.trim())
    
    // If we have 4 parts, assume: complete address, barangay, municipality, province
    if (parts.length >= 4) {
      return {
        completeAddress: parts[0],
        barangay: parts[1],
        municipality: parts[2],
        province: parts[3]
      }
    }
    
    // If we have 3 parts, assume: barangay, municipality, province
    if (parts.length === 3) {
      return {
        completeAddress: "",
        barangay: parts[0],
        municipality: parts[1],
        province: parts[2]
      }
    }
    
    // Default: put everything in complete address
    return {
      completeAddress: address,
      barangay: "",
      municipality: "",
      province: ""
    }
  }

  const handleEditPlanter = (planter: Planter) => {
    setEditingPlanter(planter)
    setIsEditMode(true)
    
    // Refresh data to ensure we have the latest sugar mills and associations
    fetchSugarMills()
    fetchAssociations()
    
    // Format birthdate for input field (YYYY-MM-DD format)
    const formatDateForInput = (dateString: string | undefined) => {
      if (!dateString) return ""
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ""
        return date.toISOString().split('T')[0] // Returns YYYY-MM-DD
      } catch {
        return ""
      }
    }
    
    // Parse the address into components
    const addressComponents = parseAddress(planter.address)
    
    setFormData({
      firstName: planter.first_name,
      middleName: planter.middle_name || "",
      lastName: planter.last_name,
      suffix: planter.suffix || "",
      gender: planter.gender,
      birthDate: formatDateForInput(planter.birthdate),
      contactNumber: planter.contact_number || "",
      emailAddress: planter.email || "",
      completeAddress: addressComponents.completeAddress,
      barangay: addressComponents.barangay,
      municipality: addressComponents.municipality,
      province: addressComponents.province,
      profilePicture: null,
      idType: planter.id_type?.toString() || "", // Using id_type from database
      validIdNumber: planter.id_number || "",
      validIdPicture: null,
      sugarMillId: planter.sugar_mill_id?.toString() || "",
      sugarMillCode: planter.sugar_mill_code || "",
      associationId: planter.association_id?.toString() || "",
      associationName: planter.association_name || "",
      farmSize: planter.farm_size?.toString() || ""
    })
    setIsDialogOpen(true)
  }

  const handleDeletePlanter = async (planter: Planter) => {
    if (window.confirm(`Are you sure you want to delete ${planter.full_name}?`)) {
      const success = await deletePlanter(planter.id)
      if (success) {
        toast({
          title: "Success",
          description: "Planter deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to delete planter",
          variant: "destructive",
        })
      }
    }
  }

  const handleViewPlanter = (planter: Planter) => {
    // TODO: Implement view planter details
    console.log("View planter:", planter)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setSuccessMessage("")
    setSuccessTitle("")
  }

  // Filter planters based on search and status
  const filteredPlanters = planters.filter(planter => {
    const matchesSearch = !searchTerm || 
      planter.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planter.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planter.contact_number?.includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || planter.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <ProtectedRoute requiredPermission="farm_management">
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6 md:p-8">
        {/* Main Success Message */}
        {showMainSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <p className="text-green-800 font-medium">{mainSuccessMessage}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-farm-green-800">Planters Registration</h1>
            <p className="text-farm-green-600">Manage and view all registered sugar planters</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="bg-farm-green-600 hover:bg-farm-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Register New Planter
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto sm:max-w-3xl">
              
              <div className="p-6 py-8 custom-scrollbar">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-farm-green-800">
                  {isEditMode ? "Edit Planter" : "Register New Planter"}
                </DialogTitle>
                <DialogDescription className="text-farm-green-600">
                  {isEditMode ? "Update the planter's information" : "Enter the planter's personal and address information"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6 pr-2">
                {/* Loading Overlay */}
                {isSubmitting && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-40 rounded-lg">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-farm-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {isEditMode ? "Updating planter details..." : "Saving planter details..."}
                      </p>
                    </div>
                  </div>
                )}
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
                        disabled={isSubmitting}
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
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="suffix" className="text-sm font-medium text-gray-700">
                        Suffix
                      </Label>
                      <Select value={formData.suffix} onValueChange={(value) => handleInputChange("suffix", value)}>
                        <SelectTrigger className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select suffix" />
                        </SelectTrigger>
                        <SelectContent>
                          {suffixOptions.map((suffix) => (
                            <SelectItem key={suffix} value={suffix}>
                              {suffix}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                        Gender *
                      </Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((gender) => (
                            <SelectItem key={gender.value} value={gender.value}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                        Birth Date *
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
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
                      <Select 
                        value={formData.idType} 
                        onValueChange={(value) => handleInputChange("idType", value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select valid ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          {loadingValidIdTypes ? (
                            <SelectItem value="" disabled>Loading...</SelectItem>
                          ) : validIdTypesError ? (
                            <SelectItem value="" disabled>Error loading ID types</SelectItem>
                          ) : (
                            validIdTypes.map((idType) => (
                              <SelectItem key={idType.id} value={idType.id.toString()}>
                                {idType.name}
                              </SelectItem>
                            ))
                          )}
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

                {/* Sugar Mill and Association Selection Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-farm-green-200">
                    <Building2 className="h-5 w-5 text-farm-green-600" />
                    <h3 className="text-lg font-semibold text-farm-green-800">Sugar Mill & Association</h3>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Important Business Rules:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Planters can only be members of one association per crop year</li>
                          <li>• Only active associations are available for selection</li>
                          <li>• Membership transfer is restricted during active crop year if deliveries exist</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sugarMill" className="text-sm font-medium text-gray-700">
                        Sugar Mill *
                      </Label>
                      <Select 
                        value={formData.sugarMillId} 
                        onValueChange={(value) => handleInputChange("sugarMillId", value)}
                        disabled={loadingSugarMills}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder={loadingSugarMills ? "Loading..." : "Select Sugar Mill"} />
                        </SelectTrigger>
                        <SelectContent>
                          {sugarMills
                            .filter(mill => mill.operating_status === "operational")
                            .map((mill) => (
                              <SelectItem key={mill.id} value={mill.id.toString()}>
                                {mill.plant_code}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {getSelectedSugarMill() && (
                        <div className="text-xs text-gray-600 mt-1 space-y-1">
                          <div>
                            <span className="font-medium">Full Name:</span> {getSelectedSugarMill()?.full_name}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span> {getSelectedSugarMill()?.city}, {getSelectedSugarMill()?.province}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="association" className="text-sm font-medium text-gray-700">
                        Association *
                      </Label>
                      <Select 
                        value={formData.associationId} 
                        onValueChange={(value) => {
                          const association = associations.find(a => a.id?.toString() === value)
                          setFormData(prev => ({
                            ...prev,
                            associationId: value,
                            associationName: association?.name || ""
                          }))
                        }}
                        disabled={loadingAssociations}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder={
                            loadingAssociations ? "Loading..." : "Select Association"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {getFilteredAssociations().map((association) => (
                            <SelectItem key={association.id} value={association.id?.toString() || ""}>
                              {association.short_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {getFilteredAssociations().length === 0 && !loadingAssociations && (
                        <div className="text-xs text-red-600 mt-1">
                          No active associations available
                        </div>
                      )}
                      {getSelectedAssociation() && (
                        <div className="text-xs text-gray-600 mt-1 space-y-1">
                          <div>
                            <span className="font-medium">Full Name:</span> {getSelectedAssociation()?.name}
                          </div>
                          <div>
                            <span className="font-medium">Address:</span> {getSelectedAssociation()?.address}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cropYear" className="text-sm font-medium text-gray-700">
                        Crop Year *
                      </Label>
                      <Select 
                        value="2024-2025" 
                        onValueChange={(value) => console.log('Crop year selected:', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-farm-green-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select Crop Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024-2025">2024-2025</SelectItem>
                          <SelectItem value="2025-2026">2025-2026</SelectItem>
                          <SelectItem value="2026-2027">2026-2027</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Registration Summary
                      </Label>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                        {formData.sugarMillId && formData.associationId ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{getSelectedSugarMill()?.plant_code}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">{getSelectedAssociation()?.short_name}</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-2">
                              Crop Year: 2024-2025
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            Select Sugar Mill and Association to see summary
                          </div>
                        )}
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
                    disabled={isSubmitting}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-farm-green-600 hover:bg-farm-green-700 text-white disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditMode ? "Updating..." : "Registering..."}
                      </>
                    ) : (
                      <>
                        {isEditMode ? "Update Planter" : "Register Planter"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
              </div>
            </DialogContent>
          </Dialog>

          {/* Success Modal Dialog */}
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="sr-only">{successTitle}</DialogTitle>
              </DialogHeader>
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {successTitle}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {successMessage}
                </p>
                <Button 
                  onClick={handleSuccessModalClose}
                  className="bg-farm-green-600 hover:bg-farm-green-700 text-white px-6"
                >
                  OK
                </Button>
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
                  <Input 
                    placeholder="Search planters..." 
                    className="h-9 border-farm-green-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={(value: "active" | "inactive" | "all") => setStatusFilter(value)}>
                    <SelectTrigger className="w-[140px] h-9 border-farm-green-300">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1 border-farm-green-300 hover:bg-farm-green-100 bg-transparent"
                  >
                    <Filter className="h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-farm-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-farm-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Planters</p>
                        <p className="text-2xl font-bold text-farm-green-800">{planters.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-farm-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Active</p>
                        <p className="text-2xl font-bold text-green-800">{planters.filter(p => p.status === 'active').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-farm-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">With Sugar Mill</p>
                        <p className="text-2xl font-bold text-blue-800">{planters.filter(p => p.sugar_mill_id).length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-farm-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">With Association</p>
                        <p className="text-2xl font-bold text-purple-800">{planters.filter(p => p.association_id).length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border border-farm-green-200 bg-white/50">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Farm Size</TableHead>
                        <TableHead>Sugar Mill</TableHead>
                        <TableHead>Association</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPlanters.map((planter) => (
                        <TableRow key={planter.id} className="hover:bg-farm-green-50/50">
                          <TableCell className="font-medium">{planter.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{planter.full_name}</div>
                              <div className="text-sm text-gray-500">{planter.gender}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              {planter.contact_number && (
                                <div className="text-sm">{planter.contact_number}</div>
                              )}
                              {planter.email && (
                                <div className="text-sm text-gray-500">{planter.email}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-[200px] truncate" title={planter.address}>
                              {planter.address}
                            </div>
                          </TableCell>
                          <TableCell>
                            {planter.farm_size ? `${planter.farm_size} hectares` : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {planter.sugar_mill_code ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {planter.sugar_mill_code}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {planter.association_name ? (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {planter.association_short_name || planter.association_name}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={planter.status === "active" ? "default" : "secondary"}
                              className={planter.status === "active" ? "bg-farm-green-600 hover:bg-farm-green-700" : ""}
                            >
                              {planter.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(planter.created_at).toLocaleDateString()}
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
                                <DropdownMenuItem onClick={() => handleViewPlanter(planter)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditPlanter(planter)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Registration
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Production History
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Assistance Records
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeletePlanter(planter)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden space-y-3 p-3">
                  {filteredPlanters.map((planter) => (
                    <Card key={planter.id} className="border-farm-green-200 hover:bg-farm-green-50/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-farm-green-100">
                                <User className="h-4 w-4 text-farm-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-farm-green-800">{planter.full_name}</h3>
                                <p className="text-sm text-farm-green-600">ID: {planter.id}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-farm-green-600 font-medium">Contact:</span>
                                <p className="text-gray-700">{planter.contact_number || 'N/A'}</p>
                              </div>
                              <div>
                                <span className="text-farm-green-600 font-medium">Email:</span>
                                <p className="text-gray-700">{planter.email || 'N/A'}</p>
                              </div>
                              <div>
                                <span className="text-farm-green-600 font-medium">Farm Size:</span>
                                <p className="text-gray-700">{planter.farm_size ? `${planter.farm_size} hectares` : 'N/A'}</p>
                              </div>
                              <div>
                                <span className="text-farm-green-600 font-medium">Sugar Mill:</span>
                                <div className="mt-1">
                                  {planter.sugar_mill_code ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                      {planter.sugar_mill_code}
                                    </Badge>
                                  ) : (
                                    <span className="text-gray-400 text-xs">N/A</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-farm-green-600 font-medium">Association:</span>
                                <div className="mt-1">
                                  {planter.association_name ? (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                                      {planter.association_short_name || planter.association_name}
                                    </Badge>
                                  ) : (
                                    <span className="text-gray-400 text-xs">N/A</span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="text-farm-green-600 font-medium">Status:</span>
                                <div className="mt-1">
                                  <Badge
                                    variant={planter.status === "active" ? "default" : "secondary"}
                                    className={planter.status === "active" ? "bg-farm-green-600 hover:bg-farm-green-700" : ""}
                                  >
                                    {planter.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="col-span-2">
                                <span className="text-farm-green-600 font-medium">Address:</span>
                                <p className="text-gray-700 text-xs">{planter.address}</p>
                              </div>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewPlanter(planter)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditPlanter(planter)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Registration
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Production History
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Assistance Records
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeletePlanter(planter)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
    </ProtectedRoute>
  )
}

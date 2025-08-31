"use client"

import { useState, useEffect } from "react"
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Eye,
  EyeOff,
  Key,
  Activity,
  Save,
  X,
  CreditCard,
  FileText,
  Upload,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useUserProfiles } from "@/hooks/use-user-profiles"
import { useAssociations } from "@/hooks/use-associations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProfileData {
  user_id?: number
  first_name: string
  middle_name: string
  last_name: string
  email: string
  password_hash?: string
  profile_picture: string
  avatar: string
  id_type: 'Driver_License' | 'TIN_ID' | 'Passport' | 'National_ID' | 'Others'
  id_number: string
  id_image: string
  phone_number: string
  address: string
  user_type: 'Association Member' | 'Unaffiliated' | 'Hauler' | 'Planter' | 'Supplier' | 'Tractor Operator' | 'Driver'
  association_id: number | null
  status: 'Active' | 'Inactive'
  created_at?: string
  updated_at?: string
}

interface SecuritySettings {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  smsAuth: boolean
  emailAuth: boolean
}

interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  marketing: boolean
}

interface DisplaySettings {
  darkMode: boolean
  compactView: boolean
}

interface ProfileSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileSettingsDialog({ open, onOpenChange }: ProfileSettingsDialogProps) {
  const { user } = useAuth()
  const { 
    currentProfile, 
    saving, 
    error: profileError, 
    validationErrors, 
    updateUserProfile, 
    createUserProfile,
    changePassword, 
    clearError, 
    clearValidationErrors,
    setCurrentProfile,
    fetchUserProfile,
    fetchUserProfileByEmail
  } = useUserProfiles()
  
  // Load associations for association selection
  const { associations: associationsData, loading: associationsLoading } = useAssociations()
  
  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: user?.name?.split(' ')[0] || "Godfrey",
    middle_name: "",
    last_name: user?.name?.split(' ').slice(1).join(' ') || "J. Boltiador",
    email: user?.email || "godfrey.boltiador@philagro.com",
    profile_picture: "default_profile.png",
    avatar: "default_avatar.png",
    id_type: "Others",
    id_number: "",
    id_image: "",
    phone_number: "+63 912 345 6789",
    address: "Bacolod City, Negros Occidental",
    user_type: "Unaffiliated",
    association_id: null,
    status: "Active"
  })

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    smsAuth: false,
    emailAuth: true
  })

  // Notification settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    marketing: false
  })

  // Display settings state
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    darkMode: false,
    compactView: false
  })

  // Form states
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("personal")
  
  // Tab-specific editing states
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingSecurity, setIsEditingSecurity] = useState(false)
  const [isEditingPreferences, setIsEditingPreferences] = useState(false)
  const [isEditingBilling, setIsEditingBilling] = useState(false)
  
  // Tab-specific saving states
  const [isSavingPersonal, setIsSavingPersonal] = useState(false)
  const [isSavingSecurity, setIsSavingSecurity] = useState(false)
  const [isSavingPreferences, setIsSavingPreferences] = useState(false)
  const [isSavingBilling, setIsSavingBilling] = useState(false)

  // Avatar upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  
  // ID document upload
  const [idImageFile, setIdImageFile] = useState<File | null>(null)

  // Load user profile when dialog opens
  useEffect(() => {
    if (open && user?.email) {
      // Try to fetch the user's profile from database
      fetchUserProfileByEmail(user.email).then((profile) => {
        if (profile) {
          // User has a profile in database, load it
          setProfileData({
            user_id: profile.user_id,
            first_name: profile.first_name,
            middle_name: profile.middle_name || "",
            last_name: profile.last_name,
            email: profile.email,
            password_hash: profile.password_hash,
            profile_picture: profile.profile_picture || "default_profile.png",
            avatar: profile.avatar || "default_avatar.png",
            id_type: profile.id_type || "Others",
            id_number: profile.id_number || "",
            id_image: profile.id_image || "",
            phone_number: profile.phone_number || "",
            address: profile.address || "",
            user_type: profile.user_type || "Unaffiliated",
            association_id: profile.association_id || null,
            status: profile.status || "Active",
            created_at: profile.created_at?.toString(),
            updated_at: profile.updated_at?.toString()
          })
        } else {
          // No profile found, keep default values but update email
          setProfileData(prev => ({
            ...prev,
            email: user.email || "",
            first_name: user.name?.split(' ')[0] || "",
            last_name: user.name?.split(' ').slice(1).join(' ') || ""
          }))
        }
      }).catch((error) => {
        console.error('Error loading user profile:', error)
        // Keep default values on error
      })
    }
  }, [open, user?.email, fetchUserProfileByEmail])

  const handleProfileChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSecurityChange = (field: keyof SecuritySettings, value: string | boolean) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const handleDisplayChange = (field: keyof DisplaySettings, value: boolean) => {
    setDisplaySettings(prev => ({ ...prev, [field]: value }))
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'Please select a valid image file' }))
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, avatar: 'Image size must be less than 5MB' }))
        return
      }

      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setErrors(prev => ({ ...prev, avatar: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Profile validation
    if (!profileData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }
    if (!profileData.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    }
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!profileData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required'
    }

    // Security validation (only if changing password)
    if (securitySettings.newPassword) {
      if (!securitySettings.currentPassword) {
        newErrors.currentPassword = 'Current password is required'
      }
      if (securitySettings.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters'
      }
      if (securitySettings.newPassword !== securitySettings.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    try {
      // Handle avatar upload if file is selected
      let profilePictureUrl = profileData.profile_picture
      if (avatarFile) {
        // Upload profile picture
        const uploadFormData = new FormData()
        uploadFormData.append('image', avatarFile)
        uploadFormData.append('type', 'profile')

        const uploadResponse = await fetch('/api/upload/profile-image', {
          method: 'POST',
          body: uploadFormData
        })

        const uploadResult = await uploadResponse.json()
        if (uploadResult.success) {
          profilePictureUrl = uploadResult.data.url
        } else {
          throw new Error(uploadResult.error || 'Failed to upload profile picture')
        }
      }

      // Handle ID image upload if file is selected
      let idImageUrl = profileData.id_image
      if (idImageFile) {
        // Upload ID image
        const uploadFormData = new FormData()
        uploadFormData.append('image', idImageFile)
        uploadFormData.append('type', 'id')

        const uploadResponse = await fetch('/api/upload/profile-image', {
          method: 'POST',
          body: uploadFormData
        })

        const uploadResult = await uploadResponse.json()
        if (uploadResult.success) {
          idImageUrl = uploadResult.data.url
        } else {
          throw new Error(uploadResult.error || 'Failed to upload ID image')
        }
      }

      // Save profile data
      if (currentProfile?.user_id || profileData.user_id) {
        // Update existing profile
        const updateData = {
          user_id: currentProfile?.user_id || profileData.user_id!,
          ...profileData,
          profile_picture: profilePictureUrl,
          id_image: idImageUrl,
          association_id: profileData.association_id || undefined,
        }

        const updatedProfile = await updateUserProfile(updateData)
        if (updatedProfile) {
          setProfileData({
            ...profileData,
            profile_picture: profilePictureUrl,
            id_image: idImageUrl
          })
        }
      } else {
        // Create new profile
        const createData = {
          ...profileData,
          profile_picture: profilePictureUrl,
          id_image: idImageUrl,
          password_hash: 'temp_password_hash', // This should be handled by auth system
          association_id: profileData.association_id || undefined,
        }

        const newProfile = await createUserProfile(createData)
        if (newProfile) {
          setProfileData({
            ...profileData,
            user_id: newProfile.user_id,
            profile_picture: profilePictureUrl,
            id_image: idImageUrl
          })
          setCurrentProfile(newProfile)
        }
      }

      // Handle password change if requested
      if (securitySettings.newPassword && currentProfile) {
        const passwordChanged = await changePassword(
          currentProfile.user_id,
          securitySettings.currentPassword,
          securitySettings.newPassword
        )
        
        if (passwordChanged) {
          setSecuritySettings({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            smsAuth: securitySettings.smsAuth,
            emailAuth: securitySettings.emailAuth
          })
        }
      }

      setIsEditing(false)
      setAvatarFile(null)
      setAvatarPreview(null)
      setIdImageFile(null)
      
      // Show success message
      setErrors(prev => ({ ...prev, general: "", success: "Profile updated successfully!" }))
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setErrors(prev => ({ ...prev, success: "" }))
      }, 3000)
      
    } catch (error: any) {
      console.error('Error saving profile:', error)
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || profileError || 'Failed to save changes. Please try again.',
        success: ""
      }))
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setErrors({})
    // Reset form data to original values
    setProfileData({
      first_name: user?.name?.split(' ')[0] || "Godfrey",
      middle_name: "",
      last_name: user?.name?.split(' ').slice(1).join(' ') || "J. Boltiador",
      email: user?.email || "godfrey.boltiador@philagro.com",
      profile_picture: "default_profile.png",
      avatar: "default_avatar.png",
      id_type: "Others",
      id_number: "",
      id_image: "",
      phone_number: "+63 912 345 6789",
      address: "Bacolod City, Negros Occidental",
      user_type: "Unaffiliated",
      association_id: null,
      status: "Active"
    })
    setAvatarFile(null)
    setAvatarPreview(null)
    setIdImageFile(null)
  }

  // Tab-specific save functions
  const handleSavePersonal = async () => {
    // Validate personal fields
    const personalErrors: Record<string, string> = {}
    if (!profileData.first_name.trim()) {
      personalErrors.first_name = 'First name is required'
    }
    if (!profileData.last_name.trim()) {
      personalErrors.last_name = 'Last name is required'
    }
    if (!profileData.email.trim()) {
      personalErrors.email = 'Email is required'
    }
    if (!profileData.phone_number.trim()) {
      personalErrors.phone_number = 'Phone number is required'
    }

    if (Object.keys(personalErrors).length > 0) {
      setErrors(personalErrors)
      return
    }

    setIsSavingPersonal(true)
    try {
      // Handle avatar upload if file is selected
      let profilePictureUrl = profileData.profile_picture
      if (avatarFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('image', avatarFile)
        uploadFormData.append('type', 'profile')

        const uploadResponse = await fetch('/api/upload/profile-image', {
          method: 'POST',
          body: uploadFormData
        })

        const uploadResult = await uploadResponse.json()
        if (uploadResult.success) {
          profilePictureUrl = uploadResult.data.url
        } else {
          throw new Error(uploadResult.error || 'Failed to upload profile picture')
        }
      }

      // Handle ID image upload if file is selected
      let idImageUrl = profileData.id_image
      if (idImageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('image', idImageFile)
        uploadFormData.append('type', 'id')

        const uploadResponse = await fetch('/api/upload/profile-image', {
          method: 'POST',
          body: uploadFormData
        })

        const uploadResult = await uploadResponse.json()
        if (uploadResult.success) {
          idImageUrl = uploadResult.data.url
        } else {
          throw new Error(uploadResult.error || 'Failed to upload ID image')
        }
      }

      // Save personal profile data
      if (currentProfile?.user_id || profileData.user_id) {
        const updateData = {
          user_id: currentProfile?.user_id || profileData.user_id!,
          first_name: profileData.first_name,
          middle_name: profileData.middle_name,
          last_name: profileData.last_name,
          email: profileData.email,
          profile_picture: profilePictureUrl,
          avatar: profileData.avatar,
          id_type: profileData.id_type,
          id_number: profileData.id_number,
          id_image: idImageUrl,
          phone_number: profileData.phone_number,
          address: profileData.address,
          user_type: profileData.user_type,
          association_id: profileData.association_id || undefined,
          status: profileData.status
        }

        const updatedProfile = await updateUserProfile(updateData)
        if (updatedProfile) {
          setProfileData(prev => ({
            ...prev,
            profile_picture: profilePictureUrl,
            id_image: idImageUrl
          }))
        }
      } else {
        // Create new profile
        const createData = {
          first_name: profileData.first_name,
          middle_name: profileData.middle_name,
          last_name: profileData.last_name,
          email: profileData.email,
          password_hash: 'temp_password_hash',
          profile_picture: profilePictureUrl,
          avatar: profileData.avatar,
          id_type: profileData.id_type,
          id_number: profileData.id_number,
          id_image: idImageUrl,
          phone_number: profileData.phone_number,
          address: profileData.address,
          user_type: profileData.user_type,
          association_id: profileData.association_id || undefined,
          status: profileData.status
        }

        const newProfile = await createUserProfile(createData)
        if (newProfile) {
          setProfileData(prev => ({
            ...prev,
            user_id: newProfile.user_id,
            profile_picture: profilePictureUrl,
            id_image: idImageUrl
          }))
          setCurrentProfile(newProfile)
        }
      }

      setIsEditingPersonal(false)
      setAvatarFile(null)
      setAvatarPreview(null)
      setIdImageFile(null)
      setErrors(prev => ({ ...prev, general: "", success: "Personal information saved successfully!" }))
      
      setTimeout(() => {
        setErrors(prev => ({ ...prev, success: "" }))
      }, 3000)

    } catch (error: any) {
      console.error('Error saving personal information:', error)
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Failed to save personal information. Please try again.',
        success: ""
      }))
    } finally {
      setIsSavingPersonal(false)
    }
  }

  const handleCancelPersonal = () => {
    setIsEditingPersonal(false)
    setErrors({})
    setAvatarFile(null)
    setAvatarPreview(null)
    setIdImageFile(null)
    // Reload original profile data if needed
  }

  const handleSaveSecurity = async () => {
    // Validate security fields
    const securityErrors: Record<string, string> = {}
    if (securitySettings.newPassword && !securitySettings.currentPassword) {
      securityErrors.currentPassword = 'Current password is required'
    }
    if (securitySettings.newPassword && securitySettings.newPassword.length < 6) {
      securityErrors.newPassword = 'Password must be at least 6 characters'
    }
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      securityErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(securityErrors).length > 0) {
      setErrors(securityErrors)
      return
    }

    setIsSavingSecurity(true)
    try {
      // Handle password change if requested
      if (securitySettings.newPassword && currentProfile) {
        const passwordChanged = await changePassword(
          currentProfile.user_id,
          securitySettings.currentPassword,
          securitySettings.newPassword
        )
        
        if (passwordChanged) {
          setSecuritySettings({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            smsAuth: securitySettings.smsAuth,
            emailAuth: securitySettings.emailAuth
          })
        }
      }

      setIsEditingSecurity(false)
      setErrors(prev => ({ ...prev, general: "", success: "Security settings saved successfully!" }))
      
      setTimeout(() => {
        setErrors(prev => ({ ...prev, success: "" }))
      }, 3000)

    } catch (error: any) {
      console.error('Error saving security settings:', error)
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Failed to save security settings. Please try again.',
        success: ""
      }))
    } finally {
      setIsSavingSecurity(false)
    }
  }

  const handleCancelSecurity = () => {
    setIsEditingSecurity(false)
    setErrors({})
    setSecuritySettings({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      smsAuth: securitySettings.smsAuth,
      emailAuth: securitySettings.emailAuth
    })
  }

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true)
    try {
      // Save preferences (in a real app, this would call an API)
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000))

      setIsEditingPreferences(false)
      setErrors(prev => ({ ...prev, general: "", success: "Preferences saved successfully!" }))
      
      setTimeout(() => {
        setErrors(prev => ({ ...prev, success: "" }))
      }, 3000)

    } catch (error: any) {
      console.error('Error saving preferences:', error)
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Failed to save preferences. Please try again.',
        success: ""
      }))
    } finally {
      setIsSavingPreferences(false)
    }
  }

  const handleCancelPreferences = () => {
    setIsEditingPreferences(false)
    setErrors({})
    // Reset preferences to original values if needed
  }

  const handleSaveBilling = async () => {
    setIsSavingBilling(true)
    try {
      // Save billing info (in a real app, this would call an API)
      // For now, just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000))

      setIsEditingBilling(false)
      setErrors(prev => ({ ...prev, general: "", success: "Billing information saved successfully!" }))
      
      setTimeout(() => {
        setErrors(prev => ({ ...prev, success: "" }))
      }, 3000)

    } catch (error: any) {
      console.error('Error saving billing information:', error)
      setErrors(prev => ({ 
        ...prev, 
        general: error.message || 'Failed to save billing information. Please try again.',
        success: ""
      }))
    } finally {
      setIsSavingBilling(false)
    }
  }

  const handleCancelBilling = () => {
    setIsEditingBilling(false)
    setErrors({})
    // Reset billing info to original values if needed
  }

  const getInitials = () => {
    return `${profileData.first_name[0] || 'G'}${profileData.last_name[0] || 'B'}`
  }

  const getFullName = () => {
    const middle = profileData.middle_name ? ` ${profileData.middle_name}` : ''
    return `${profileData.first_name}${middle} ${profileData.last_name}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-green-800">Profile Settings</DialogTitle>
          <DialogDescription>
            Manage your account and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white border rounded-lg p-6 sticky top-0 max-h-[calc(90vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage src={avatarPreview || profileData.avatar} alt="Profile" />
                      <AvatarFallback className="bg-green-500 text-white text-2xl font-medium">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors">
                            <Upload className="h-4 w-4" />
                          </div>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  {errors.avatar && (
                    <p className="text-red-500 text-xs mt-2">{errors.avatar}</p>
                  )}
                  
                  <h3 className="text-xl font-semibold mt-4">
                    {getFullName()}
                  </h3>
                  <p className="text-gray-600">{profileData.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {user?.role || "System Administrator"}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-green-500" />
                    <span>{profileData.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span>{profileData.address || 'No address provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-green-500" />
                    <span>{profileData.user_type}</span>
                  </div>
                  {profileData.association_id && (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-green-500" />
                      <span>{associationsData?.find(a => a.id === profileData.association_id)?.name || 'Association'}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>Joined January 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span>Last login: 2 hours ago</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-center text-sm text-gray-500">
                  Use the tabs on the right to edit specific sections of your profile.
                </div>
              </div>
            </div>

            {/* Settings Tabs */}
            <div className="lg:col-span-2">
              <div className="bg-white border rounded-lg p-6 max-h-[calc(90vh-12rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                
                {errors.general && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {errors.general}
                  </div>
                )}

                {errors.success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                    {errors.success}
                  </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-base font-medium">Personal Information</h4>
                      {!isEditingPersonal && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingPersonal(true)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={profileData.first_name}
                          onChange={(e) => handleProfileChange('first_name', e.target.value)}
                          disabled={!isEditingPersonal}
                          className={errors.first_name ? 'border-red-500' : ''}
                        />
                        {errors.first_name && (
                          <p className="text-red-500 text-xs">{errors.first_name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input
                          id="middleName"
                          value={profileData.middle_name}
                          onChange={(e) => handleProfileChange('middle_name', e.target.value)}
                          disabled={!isEditingPersonal}
                          placeholder="Optional"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={profileData.last_name}
                          onChange={(e) => handleProfileChange('last_name', e.target.value)}
                          disabled={!isEditingPersonal}
                          className={errors.last_name ? 'border-red-500' : ''}
                        />
                        {errors.last_name && (
                          <p className="text-red-500 text-xs">{errors.last_name}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        disabled={!isEditing}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={profileData.phone_number}
                        onChange={(e) => handleProfileChange('phone_number', e.target.value)}
                        disabled={!isEditing}
                        className={errors.phone_number ? 'border-red-500' : ''}
                        placeholder="+63 912 345 6789"
                      />
                      {errors.phone_number && (
                        <p className="text-red-500 text-xs">{errors.phone_number}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => handleProfileChange('address', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Complete address"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="userType">User Type</Label>
                        <Select 
                          value={profileData.user_type} 
                          onValueChange={(value) => handleProfileChange('user_type', value)}
                          disabled={!isEditingPersonal}
                        >
                          <SelectTrigger id="userType">
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Association Member">Association Member</SelectItem>
                            <SelectItem value="Unaffiliated">Unaffiliated</SelectItem>
                            <SelectItem value="Hauler">Hauler</SelectItem>
                            <SelectItem value="Planter">Planter</SelectItem>
                            <SelectItem value="Supplier">Supplier</SelectItem>
                            <SelectItem value="Tractor Operator">Tractor Operator</SelectItem>
                            <SelectItem value="Driver">Driver</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="idType">ID Type</Label>
                        <Select 
                          value={profileData.id_type} 
                          onValueChange={(value) => handleProfileChange('id_type', value)}
                          disabled={!isEditingPersonal}
                        >
                          <SelectTrigger id="idType">
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Driver_License">Driver's License</SelectItem>
                            <SelectItem value="TIN_ID">TIN ID</SelectItem>
                            <SelectItem value="Passport">Passport</SelectItem>
                            <SelectItem value="National_ID">National ID</SelectItem>
                            <SelectItem value="Others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input
                        id="idNumber"
                        value={profileData.id_number}
                        onChange={(e) => handleProfileChange('id_number', e.target.value)}
                        disabled={!isEditing}
                        placeholder={`Enter your ${profileData.id_type.replace('_', ' ')} number`}
                        className={errors.id_number ? 'border-red-500' : ''}
                      />
                      {errors.id_number && (
                        <p className="text-red-500 text-xs">{errors.id_number}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Enter the number/code from your selected ID type
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="association">Association</Label>
                        <Select 
                          value={profileData.association_id?.toString() || "0"} 
                          onValueChange={(value) => handleProfileChange('association_id', value === "0" ? null : parseInt(value))}
                          disabled={!isEditing || associationsLoading}
                        >
                          <SelectTrigger id="association">
                            <SelectValue placeholder={associationsLoading ? "Loading..." : "Select association (Optional)"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">None (Unaffiliated)</SelectItem>
                            {associationsData?.map((association) => (
                              <SelectItem key={association.id} value={association.id.toString()}>
                                {association.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Account Status</Label>
                        <Select 
                          value={profileData.status} 
                          onValueChange={(value) => handleProfileChange('status', value)}
                          disabled={!isEditingPersonal}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="idImage">ID Document Upload</Label>
                      <Input
                        id="idImage"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            // Validate file type and size
                            if (!file.type.match(/^(image\/|application\/pdf)/)) {
                              setErrors(prev => ({ ...prev, id_image: 'Please select an image or PDF file' }))
                              return
                            }
                            
                            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                              setErrors(prev => ({ ...prev, id_image: 'File size must be less than 5MB' }))
                              return
                            }
                            
                            setIdImageFile(file)
                            handleProfileChange('id_image', file.name)
                            setErrors(prev => ({ ...prev, id_image: "" }))
                          }
                        }}
                        disabled={!isEditing}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      <p className="text-xs text-gray-500">
                        Upload a copy of your {profileData.id_type.replace('_', ' ')} (Image or PDF, max 5MB)
                      </p>
                      {profileData.id_image && (
                        <p className="text-xs text-green-600">
                          Current file: {profileData.id_image}
                        </p>
                      )}
                      {errors.id_image && (
                        <p className="text-red-500 text-xs">{errors.id_image}</p>
                      )}
                    </div>

                    {/* Personal Tab Bottom Buttons */}
                    {isEditingPersonal && (
                      <div className="flex justify-end gap-2 pt-6 border-t">
                        <Button 
                          variant="outline" 
                          onClick={handleCancelPersonal}
                          disabled={isSavingPersonal}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSavePersonal}
                          disabled={isSavingPersonal}
                        >
                          {isSavingPersonal ? (
                            <>
                              <Activity className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="security" className="space-y-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-base font-medium">Security Settings</h4>
                      {!isEditingSecurity && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingSecurity(true)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-sm font-medium">Change Password</h5>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={securitySettings.currentPassword}
                            onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                            disabled={!isEditingSecurity}
                            placeholder="Enter current password"
                            className={errors.currentPassword ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={!isEditingSecurity}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.currentPassword && (
                          <p className="text-red-500 text-xs">{errors.currentPassword}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={securitySettings.newPassword}
                          onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                          disabled={!isEditingSecurity}
                          placeholder="Enter new password"
                          className={errors.newPassword ? 'border-red-500' : ''}
                        />
                        {errors.newPassword && (
                          <p className="text-red-500 text-xs">{errors.newPassword}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={securitySettings.confirmPassword}
                          onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                          disabled={!isEditingSecurity}
                          placeholder="Confirm new password"
                          className={errors.confirmPassword ? 'border-red-500' : ''}
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="text-base font-medium">Two-Factor Authentication</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">SMS Authentication</p>
                            <p className="text-xs text-gray-600">Receive codes via SMS</p>
                          </div>
                          <Switch
                            checked={securitySettings.smsAuth}
                            onCheckedChange={(checked) => handleSecurityChange('smsAuth', checked)}
                            disabled={!isEditingSecurity}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Email Authentication</p>
                            <p className="text-xs text-gray-600">Receive codes via email</p>
                          </div>
                          <Switch
                            checked={securitySettings.emailAuth}
                            onCheckedChange={(checked) => handleSecurityChange('emailAuth', checked)}
                            disabled={!isEditingSecurity}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Security Tab Bottom Buttons */}
                    {isEditingSecurity && (
                      <div className="flex justify-end gap-2 pt-6 border-t">
                        <Button 
                          variant="outline" 
                          onClick={handleCancelSecurity}
                          disabled={isSavingSecurity}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSaveSecurity}
                          disabled={isSavingSecurity}
                        >
                          {isSavingSecurity ? (
                            <>
                              <Activity className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="preferences" className="space-y-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-base font-medium">Preferences</h4>
                      {!isEditingPreferences && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingPreferences(true)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-4">Notifications</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Email Notifications</p>
                            <p className="text-xs text-gray-600">Receive updates via email</p>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                            disabled={!isEditingPreferences}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">SMS Notifications</p>
                            <p className="text-xs text-gray-600">Receive updates via SMS</p>
                          </div>
                          <Switch
                            checked={notifications.sms}
                            onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                            disabled={!isEditingPreferences}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Push Notifications</p>
                            <p className="text-xs text-gray-600">Receive browser notifications</p>
                          </div>
                          <Switch
                            checked={notifications.push}
                            onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                            disabled={!isEditingPreferences}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Marketing Emails</p>
                            <p className="text-xs text-gray-600">Receive promotional content</p>
                          </div>
                          <Switch
                            checked={notifications.marketing}
                            onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                            disabled={!isEditingPreferences}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-base font-medium mb-4">Display</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Dark Mode</p>
                            <p className="text-xs text-gray-600">Use dark theme</p>
                          </div>
                          <Switch
                            checked={displaySettings.darkMode}
                            onCheckedChange={(checked) => handleDisplayChange('darkMode', checked)}
                            disabled={!isEditingPreferences}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">Compact View</p>
                            <p className="text-xs text-gray-600">Use compact layout</p>
                          </div>
                          <Switch
                            checked={displaySettings.compactView}
                            onCheckedChange={(checked) => handleDisplayChange('compactView', checked)}
                            disabled={!isEditingPreferences}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preferences Tab Bottom Buttons */}
                    {isEditingPreferences && (
                      <div className="flex justify-end gap-2 pt-6 border-t">
                        <Button 
                          variant="outline" 
                          onClick={handleCancelPreferences}
                          disabled={isSavingPreferences}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSavePreferences}
                          disabled={isSavingPreferences}
                        >
                          {isSavingPreferences ? (
                            <>
                              <Activity className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="billing" className="space-y-6 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-base font-medium">Billing & Subscription</h4>
                      {!isEditingBilling && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingBilling(true)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-4">Subscription</h5>
                      <div className="p-4 border rounded-lg bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">Phil Agro Pro</p>
                            <p className="text-sm text-gray-600">Premium subscription</p>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Next billing: January 15, 2025
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled={!isEditingBilling}>Change Plan</Button>
                          <Button variant="outline" size="sm" disabled={!isEditingBilling}>Cancel Subscription</Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-base font-medium mb-4">Payment Methods</h4>
                      <div className="p-3 border rounded-lg mb-3">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">•••• •••• •••• 1234</p>
                            <p className="text-xs text-gray-600">Expires 12/25</p>
                          </div>
                          <Button variant="outline" size="sm" disabled={!isEditingBilling}>Edit</Button>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" disabled={!isEditingBilling}>
                        Add Payment Method
                      </Button>
                    </div>

                    {/* Billing Tab Bottom Buttons */}
                    {isEditingBilling && (
                      <div className="flex justify-end gap-2 pt-6 border-t">
                        <Button 
                          variant="outline" 
                          onClick={handleCancelBilling}
                          disabled={isSavingBilling}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSaveBilling}
                          disabled={isSavingBilling}
                        >
                          {isSavingBilling ? (
                            <>
                              <Activity className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

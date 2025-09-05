'use client'

import { useState, useEffect } from 'react'
import { SugarMill, CreateSugarMillRequest, UpdateSugarMillRequest } from '@/lib/sugar-mills-dao'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSugarMills } from '@/hooks/use-sugar-mills'

interface SugarMillFormProps {
  initialData?: SugarMill
  onSubmit: (data: CreateSugarMillRequest | UpdateSugarMillRequest) => Promise<void>
  loading?: boolean
  validationErrors?: Record<string, string>
  onClearValidationErrors?: () => void
}

export function SugarMillForm({
  initialData,
  onSubmit,
  loading = false,
  validationErrors = {},
  onClearValidationErrors
}: SugarMillFormProps) {
  const { provinces, cities, fetchLocations } = useSugarMills()
  
  const [formData, setFormData] = useState<CreateSugarMillRequest>({
    plant_code: '',
    full_name: '',
    short_name: '',
    description: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    contact_person: '',
    phone: '',
    email: '',
    website: '',
    registration_number: '',
    tax_id: '',
    capacity: undefined,
    capacity_unit: 'tons',
    operating_status: 'operational',
    crop_year: '2024-2025',
    start_date: '',
    end_date: '',
    manager_name: '',
    manager_phone: '',
    manager_email: '',
    latitude: undefined,
    longitude: undefined
  })

  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [isInitializing, setIsInitializing] = useState(false)

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      setIsInitializing(true)
      setFormData({
        plant_code: initialData.plant_code,
        full_name: initialData.full_name,
        short_name: initialData.short_name,
        description: initialData.description || '',
        address: initialData.address || '',
        city: initialData.city,
        province: initialData.province,
        postal_code: initialData.postal_code || '',
        contact_person: initialData.contact_person || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        website: initialData.website || '',
        registration_number: initialData.registration_number || '',
        tax_id: initialData.tax_id || '',
        capacity: initialData.capacity || undefined,
        capacity_unit: initialData.capacity_unit,
        operating_status: initialData.operating_status,
        crop_year: initialData.crop_year,
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        manager_name: initialData.manager_name || '',
        manager_phone: initialData.manager_phone || '',
        manager_email: initialData.manager_email || '',
        latitude: initialData.latitude || undefined,
        longitude: initialData.longitude || undefined
      })
      setSelectedProvince(initialData.province)
      setSelectedCity(initialData.city)
      setIsInitializing(false)
    }
  }, [initialData])

  // Fetch cities when province changes
  useEffect(() => {
    if (selectedProvince && !isInitializing) {
      fetchLocations(selectedProvince)
      setFormData(prev => ({ ...prev, province: selectedProvince, city: '' }))
      setSelectedCity('')
    }
  }, [selectedProvince, fetchLocations, isInitializing])

  // Update city when selected
  useEffect(() => {
    if (selectedCity) {
      setFormData(prev => ({ ...prev, city: selectedCity }))
    }
  }, [selectedCity])

  const handleInputChange = (field: keyof CreateSugarMillRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error for this field
    if (validationErrors[field] && onClearValidationErrors) {
      onClearValidationErrors()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      capacity: formData.capacity ? Number(formData.capacity) : undefined,
      latitude: formData.latitude ? Number(formData.latitude) : undefined,
      longitude: formData.longitude ? Number(formData.longitude) : undefined
    }

    if (initialData) {
      await onSubmit({ ...submitData, id: initialData.id } as UpdateSugarMillRequest)
    } else {
      await onSubmit(submitData)
    }
  }

  const getFieldError = (field: string) => {
    return validationErrors[field]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Essential details about the sugar mill
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plant_code">Plant Code *</Label>
              <Input
                id="plant_code"
                value={formData.plant_code}
                onChange={(e) => handleInputChange('plant_code', e.target.value)}
                placeholder="e.g., URSUMCO"
                className={getFieldError('plant_code') ? 'border-red-500' : ''}
              />
              {getFieldError('plant_code') && (
                <Alert variant="destructive">
                  <AlertDescription>{getFieldError('plant_code')}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="short_name">Short Name *</Label>
              <Input
                id="short_name"
                value={formData.short_name}
                onChange={(e) => handleInputChange('short_name', e.target.value)}
                placeholder="e.g., URSUMCO"
                className={getFieldError('short_name') ? 'border-red-500' : ''}
              />
              {getFieldError('short_name') && (
                <Alert variant="destructive">
                  <AlertDescription>{getFieldError('short_name')}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="e.g., United Robina Sugar Milling Corporation"
              className={getFieldError('full_name') ? 'border-red-500' : ''}
            />
            {getFieldError('full_name') && (
              <Alert variant="destructive">
                <AlertDescription>{getFieldError('full_name')}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed description of the sugar mill facility"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle>Location Information</CardTitle>
          <CardDescription>
            Physical location and address details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Street address"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                <SelectTrigger className={getFieldError('province') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map(province => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('province') && (
                <Alert variant="destructive">
                  <AlertDescription>{getFieldError('province')}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className={getFieldError('city') ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('city') && (
                <Alert variant="destructive">
                  <AlertDescription>{getFieldError('city')}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="e.g., 6200"
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="e.g., 9.3077"
                className={getFieldError('latitude') ? 'border-red-500' : ''}
              />
              {getFieldError('latitude') && (
                <Alert variant="destructive">
                  <AlertDescription>{getFieldError('latitude')}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="e.g., 123.3054"
                className={getFieldError('longitude') ? 'border-red-500' : ''}
              />
              {getFieldError('longitude') && (
                <Alert variant="destructive">
                  <AlertDescription>{getFieldError('longitude')}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Primary contact details for the sugar mill
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => handleInputChange('contact_person', e.target.value)}
                placeholder="Primary contact person name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="e.g., +63 35 422 1234"
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="e.g., info@ursumco.com"
                className={getFieldError('email') ? 'border-red-500' : ''}
              />
              {getFieldError('email') && (
                <Alert variant="destructive">
                  <AlertDescription>{getFieldError('email')}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="e.g., https://www.ursumco.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Legal and registration details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="registration_number">Registration Number</Label>
              <Input
                id="registration_number"
                value={formData.registration_number}
                onChange={(e) => handleInputChange('registration_number', e.target.value)}
                placeholder="Business registration number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input
                id="tax_id"
                value={formData.tax_id}
                onChange={(e) => handleInputChange('tax_id', e.target.value)}
                placeholder="Tax identification number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Information */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Information</CardTitle>
          <CardDescription>
            Capacity, status, and operational details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                step="0.01"
                value={formData.capacity || ''}
                onChange={(e) => handleInputChange('capacity', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="e.g., 5000"
                className={getFieldError('capacity') ? 'border-red-500' : ''}
              />
              {getFieldError('capacity') && (
                <Alert variant="destructive">
                  <AlertDescription>{getFieldError('capacity')}</AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity_unit">Capacity Unit</Label>
              <Select value={formData.capacity_unit} onValueChange={(value) => handleInputChange('capacity_unit', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tons">Tons</SelectItem>
                  <SelectItem value="metric_tons">Metric Tons</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="operating_status">Operating Status</Label>
              <Select value={formData.operating_status} onValueChange={(value) => handleInputChange('operating_status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="crop_year">Crop Year</Label>
              <Input
                id="crop_year"
                value={formData.crop_year}
                onChange={(e) => handleInputChange('crop_year', e.target.value)}
                placeholder="e.g., 2024-2025"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Manager Information */}
      <Card>
        <CardHeader>
          <CardTitle>Manager Information</CardTitle>
          <CardDescription>
            Details about the facility manager
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="manager_name">Manager Name</Label>
              <Input
                id="manager_name"
                value={formData.manager_name}
                onChange={(e) => handleInputChange('manager_name', e.target.value)}
                placeholder="Facility manager name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager_phone">Manager Phone</Label>
              <Input
                id="manager_phone"
                value={formData.manager_phone}
                onChange={(e) => handleInputChange('manager_phone', e.target.value)}
                placeholder="e.g., +63 35 422 1234"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="manager_email">Manager Email</Label>
            <Input
              id="manager_email"
              type="email"
              value={formData.manager_email}
              onChange={(e) => handleInputChange('manager_email', e.target.value)}
              placeholder="e.g., manager@ursumco.com"
              className={getFieldError('manager_email') ? 'border-red-500' : ''}
            />
            {getFieldError('manager_email') && (
              <Alert variant="destructive">
                <AlertDescription>{getFieldError('manager_email')}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Sugar Mill' : 'Create Sugar Mill'}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle,
  AlertTriangle 
} from "lucide-react"
import Image from "next/image"

interface LogoUploadProps {
  currentLogoUrl?: string | null
  onLogoChange: (logoUrl: string | null, file: File | null) => void
  entityName?: string
  maxSizeKB?: number
  className?: string
  disabled?: boolean
}

export function LogoUpload({ 
  currentLogoUrl, 
  onLogoChange, 
  entityName = "Association",
  maxSizeKB = 2048, // 2MB default
  className = "",
  disabled = false
}: LogoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    }

    // Check file size
    const maxSizeBytes = maxSizeKB * 1024
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeKB}KB (${(maxSizeKB / 1024).toFixed(1)}MB)`
    }

    return null
  }

  const handleFileSelect = async (file: File) => {
    setError(null)
    
    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)

    try {
      // Create preview URL
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      
      // For now, we'll just pass the file to the parent component
      // In a real implementation, you might upload to a cloud service here
      onLogoChange(objectUrl, file)
      
    } catch (err: any) {
      setError(err.message || 'Failed to process image')
      setPreviewUrl(currentLogoUrl || null)
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }

  const removeLogo = () => {
    setPreviewUrl(null)
    setError(null)
    onLogoChange(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label className="text-sm font-medium">
          {entityName} Logo
        </Label>
        <p className="text-xs text-gray-600 mt-1">
          Upload a logo for this {entityName.toLowerCase()}. Recommended size: 200x200px or larger.
        </p>
      </div>

      {/* Current Logo Display */}
      {previewUrl && (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                <Image
                  src={previewUrl}
                  alt={`${entityName} logo`}
                  fill
                  className="object-cover"
                  onError={() => {
                    setError('Failed to load image')
                    setPreviewUrl(null)
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Logo uploaded</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Click "Change Logo" to upload a different image
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeLogo}
                disabled={disabled || uploading}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card 
        className={`relative transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        } ${disabled ? 'opacity-50' : 'cursor-pointer hover:border-gray-400'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!disabled ? openFileDialog : undefined}
      >
        <CardContent className="p-6">
          <div className="text-center">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">Processing image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {previewUrl ? 'Change Logo' : 'Upload Logo'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Drag and drop or click to browse
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  <p>JPEG, PNG, GIF, WebP up to {(maxSizeKB / 1024).toFixed(1)}MB</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Helper Text */}
      <div className="text-xs text-gray-500">
        <p>• Use high-quality images for best results</p>
        <p>• Square images (1:1 ratio) work best for logos</p>
        <p>• Transparent backgrounds (PNG) are recommended</p>
      </div>
    </div>
  )
}

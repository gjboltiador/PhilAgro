"use client"

import React, { useCallback, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload } from "lucide-react"

type AccentColor = "orange" | "green" | "blue" | "gray"

interface UploadZoneProps {
  title: string
  subtitle?: string
  note?: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSizeMB?: number
  color?: AccentColor
  onChange: (files: File[]) => void
  enableCapture?: boolean
  captureMode?: "user" | "environment"
}

export function UploadZone({
  title,
  subtitle,
  note,
  accept = "image/*",
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 5,
  color = "gray",
  onChange,
  enableCapture = true,
  captureMode = "user",
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const captureRef = useRef<HTMLInputElement | null>(null)

  const colors = useMemo(() => {
    switch (color) {
      case "orange":
        return {
          border: "border-orange-200",
          iconBg: "bg-orange-100",
          icon: "text-orange-600",
          title: "text-orange-800",
          text: "text-orange-600",
          button: "bg-orange-500 hover:bg-orange-600",
        }
      case "green":
        return {
          border: "border-green-200",
          iconBg: "bg-green-100",
          icon: "text-green-600",
          title: "text-green-800",
          text: "text-green-600",
          button: "bg-green-600 hover:bg-green-700",
        }
      case "blue":
        return {
          border: "border-blue-200",
          iconBg: "bg-blue-100",
          icon: "text-blue-600",
          title: "text-blue-800",
          text: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
        }
      default:
        return {
          border: "border-gray-200",
          iconBg: "bg-gray-100",
          icon: "text-gray-600",
          title: "text-gray-800",
          text: "text-gray-600",
          button: "bg-gray-600 hover:bg-gray-700",
        }
    }
  }, [color])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    let fileArray = Array.from(files)
    if (!multiple) fileArray = fileArray.slice(0, 1)
    if (fileArray.length > (maxFiles || 999)) fileArray = fileArray.slice(0, maxFiles)
    const valid = fileArray.filter((f) => (maxSizeMB ? f.size <= maxSizeMB * 1024 * 1024 : true))
    onChange(valid)
  }, [multiple, maxFiles, maxSizeMB, onChange])

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    handleFiles(e.dataTransfer.files)
  }

  const onBrowse = () => inputRef.current?.click()
  const onCapture = () => captureRef.current?.click()

  return (
    <div
      className={`rounded-xl border-2 border-dashed ${colors.border} bg-white/60 p-6`}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy" }}
      onDrop={onDrop}
      role="region"
      aria-label={title}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-14 h-14 rounded-full ${colors.iconBg} flex items-center justify-center mb-3`}>
          <Camera className={`h-6 w-6 ${colors.icon}`} />
        </div>
        <div className={`font-medium ${colors.title}`}>{title}</div>
        <div className={`text-sm mt-1 ${colors.text}`}>
          {subtitle || (multiple ? "Drag & drop images here or click to browse" : "Drag & drop an image here or click to browse")}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {note || `PNG, JPG, JPEG up to ${maxSizeMB}MB each. Maximum ${maxFiles} ${multiple ? "images" : "image"}.`}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button type="button" variant="outline" onClick={onBrowse}>
            <Upload className="h-4 w-4 mr-2" /> {multiple ? "Choose Images" : "Choose Image"}
          </Button>
          {enableCapture && (
            <>
              <input
                ref={captureRef}
                type="file"
                accept={accept}
                multiple={false}
                className="hidden"
                capture={captureMode}
                onChange={(e) => handleFiles(e.target.files)}
              />
              <Button type="button" variant="outline" onClick={onCapture}>
                <Camera className="h-4 w-4 mr-2" /> Capture
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadZone



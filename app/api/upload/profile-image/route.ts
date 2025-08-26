import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export const runtime = "nodejs"

/**
 * POST /api/upload/profile-image
 * Upload profile picture or ID image
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const type = formData.get('type') as string // 'profile' or 'id'
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    if (!type || !['profile', 'id'].includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid image type. Must be "profile" or "id"'
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.'
      }, { status: 400 })
    }

    // Validate file size (5MB limit for profile images, 10MB for ID images)
    const maxSize = type === 'profile' ? 5 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB.`
      }, { status: 400 })
    }

    // Create unique filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const fileName = `${randomUUID()}.${fileExtension}`
    
    // Create upload directory if it doesn't exist
    const subDir = type === 'profile' ? 'profiles' : 'id-documents'
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'users', subDir)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)
    
    // Return the public URL
    const publicUrl = `/uploads/users/${subDir}/${fileName}`
    
    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        imageType: type
      },
      message: `${type === 'profile' ? 'Profile picture' : 'ID document'} uploaded successfully`
    })

  } catch (error) {
    console.error('Profile image upload error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to upload image',
      message: 'An unexpected error occurred during upload'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/upload/profile-image
 * Delete profile image
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    const type = searchParams.get('type') as string
    
    if (!filename) {
      return NextResponse.json({
        success: false,
        error: 'No filename provided'
      }, { status: 400 })
    }

    if (!type || !['profile', 'id'].includes(type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid image type'
      }, { status: 400 })
    }

    // Security check: ensure filename doesn't contain path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid filename'
      }, { status: 400 })
    }

    const subDir = type === 'profile' ? 'profiles' : 'id-documents'
    const filePath = join(process.cwd(), 'public', 'uploads', 'users', subDir, filename)
    
    try {
      const fs = require('fs').promises
      await fs.unlink(filePath)
      
      return NextResponse.json({
        success: true,
        message: `${type === 'profile' ? 'Profile picture' : 'ID document'} deleted successfully`
      })
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({
          success: true,
          message: 'File not found (may have been already deleted)'
        })
      }
      throw error
    }

  } catch (error) {
    console.error('Profile image deletion error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete image',
      message: 'An unexpected error occurred during deletion'
    }, { status: 500 })
  }
}

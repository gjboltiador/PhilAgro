import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export const runtime = "nodejs"

/**
 * POST /api/upload/association-logo
 * Upload association logo image
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('logo') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
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

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 2MB.'
      }, { status: 400 })
    }

    // Create unique filename
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const fileName = `${randomUUID()}.${fileExtension}`
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'associations', 'logos')
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
    const publicUrl = `/uploads/associations/logos/${fileName}`
    
    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type
      },
      message: 'Logo uploaded successfully'
    })

  } catch (error) {
    console.error('Logo upload error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to upload logo',
      message: 'An unexpected error occurred during upload'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/upload/association-logo
 * Delete association logo image
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json({
        success: false,
        error: 'No filename provided'
      }, { status: 400 })
    }

    // Security check: ensure filename doesn't contain path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid filename'
      }, { status: 400 })
    }

    const filePath = join(process.cwd(), 'public', 'uploads', 'associations', 'logos', filename)
    
    try {
      const fs = require('fs').promises
      await fs.unlink(filePath)
      
      return NextResponse.json({
        success: true,
        message: 'Logo deleted successfully'
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
    console.error('Logo deletion error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete logo',
      message: 'An unexpected error occurred during deletion'
    }, { status: 500 })
  }
}

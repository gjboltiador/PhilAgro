import { NextRequest, NextResponse } from 'next/server'
import { userProfilesDAO } from '@/lib/user-profiles-dao'
import { DatabaseError, ValidationError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * GET /api/user-profiles/[id]
 * Get a specific user profile by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      }, { status: 400 })
    }

    const userProfile = await userProfilesDAO.getById(userId)
    
    if (!userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'User profile not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: userProfile
    })

  } catch (error) {
    console.error('GET /api/user-profiles/[id] error:', error)
    
    if (error instanceof DatabaseError) {
      return NextResponse.json({
        success: false,
        error: 'Database operation failed',
        message: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 })
  }
}

/**
 * PUT /api/user-profiles/[id]
 * Update a user profile
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      }, { status: 400 })
    }

    const body = await request.json()
    const updateData = { user_id: userId, ...body }

    const updatedUserProfile = await userProfilesDAO.update(updateData)
    
    return NextResponse.json({
      success: true,
      data: updatedUserProfile,
      message: 'User profile updated successfully'
    })

  } catch (error) {
    console.error('PUT /api/user-profiles/[id] error:', error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: error.message,
        field: error.field
      }, { status: 400 })
    }

    if (error instanceof DatabaseError) {
      return NextResponse.json({
        success: false,
        error: 'Database operation failed',
        message: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/user-profiles/[id]
 * Soft delete a user profile (set status to Inactive)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    
    if (isNaN(userId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user ID',
        message: 'User ID must be a number'
      }, { status: 400 })
    }

    const success = await userProfilesDAO.delete(userId)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'User profile not found or already deleted'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'User profile deleted successfully'
    })

  } catch (error) {
    console.error('DELETE /api/user-profiles/[id] error:', error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: error.message,
        field: error.field
      }, { status: 400 })
    }

    if (error instanceof DatabaseError) {
      return NextResponse.json({
        success: false,
        error: 'Database operation failed',
        message: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { userProfilesDAO } from '@/lib/user-profiles-dao'
import { DatabaseError, ValidationError } from '@/lib/database'
import bcrypt from 'bcryptjs'

export const runtime = "nodejs"

/**
 * POST /api/user-profiles/[id]/change-password
 * Change user password
 */
export async function POST(
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
    const { current_password, new_password } = body

    if (!current_password) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Current password is required'
      }, { status: 400 })
    }

    if (!new_password) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'New password is required'
      }, { status: 400 })
    }

    if (new_password.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'New password must be at least 8 characters long'
      }, { status: 400 })
    }

    // Get current user profile
    const userProfile = await userProfilesDAO.getById(userId)
    if (!userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'User profile not found'
      }, { status: 404 })
    }

    // Get user with password hash
    const userWithPassword = await userProfilesDAO.getByEmail(userProfile.email)
    if (!userWithPassword) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'User profile not found'
      }, { status: 404 })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, userWithPassword.password_hash)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials',
        message: 'Current password is incorrect'
      }, { status: 400 })
    }

    // Hash new password
    const saltRounds = 12
    const newPasswordHash = await bcrypt.hash(new_password, saltRounds)

    // Change password
    const success = await userProfilesDAO.changePassword({
      user_id: userId,
      current_password,
      new_password: newPasswordHash
    })

    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Update failed',
        message: 'Failed to change password'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('POST /api/user-profiles/[id]/change-password error:', error)
    
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

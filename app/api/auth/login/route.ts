import { NextRequest, NextResponse } from 'next/server'
import { userProfilesDAO } from '@/lib/user-profiles-dao'
import bcrypt from 'bcryptjs'
import { DatabaseError, ValidationError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Email and password are required'
      }, { status: 400 })
    }

    // Find user by email
    const userProfile = await userProfilesDAO.getByEmail(email)
    
    if (!userProfile) {
      return NextResponse.json({
        success: false,
        error: 'Authentication failed',
        message: 'Invalid email or password'
      }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userProfile.password_hash)
    
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Authentication failed',
        message: 'Invalid email or password'
      }, { status: 401 })
    }

    // Check if user is active
    if (userProfile.status !== 'Active') {
      return NextResponse.json({
        success: false,
        error: 'Account disabled',
        message: 'Your account has been deactivated. Please contact support.'
      }, { status: 403 })
    }

    // Use the user_type from the profile as the role
    // Convert user_type to role format (e.g., "Association Member" -> "association_member")
    const userRole = userProfile.user_type.toLowerCase().replace(/\s+/g, '_')

    // Create user session data (without sensitive information)
    const userData = {
      id: userProfile.user_id,
      email: userProfile.email,
      name: `${userProfile.first_name} ${userProfile.last_name}`,
      role: userRole,
      user_type: userProfile.user_type,
      association_id: userProfile.association_id,
      status: userProfile.status
    }

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('POST /api/auth/login error:', error)
    
    if (error instanceof DatabaseError) {
      return NextResponse.json({
        success: false,
        error: 'Database operation failed',
        message: error.message
      }, { status: 500 })
    }

    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: error.message
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred during login'
    }, { status: 500 })
  }
}

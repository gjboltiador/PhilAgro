import { NextRequest, NextResponse } from 'next/server'
import { userProfilesDAO } from '@/lib/user-profiles-dao'
import bcrypt from 'bcryptjs'
import { DatabaseError, ValidationError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * POST /api/users/create-admin
 * Create an administrator user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Email and password are required'
      }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if user already exists
    const existingUser = await userProfilesDAO.getByEmail(email)
    
    if (existingUser) {
      // Update existing user to be administrator
      const updatedUser = await userProfilesDAO.update(existingUser.user_id, {
        first_name: firstName || existingUser.first_name,
        last_name: lastName || existingUser.last_name,
        password_hash: hashedPassword,
        user_type: 'Administrator',
        status: 'Active'
      })

      return NextResponse.json({
        success: true,
        data: {
          user_id: updatedUser.user_id,
          email: updatedUser.email,
          user_type: updatedUser.user_type,
          status: updatedUser.status
        },
        message: 'Administrator user updated successfully'
      })
    } else {
      // Create new administrator user
      const newUser = await userProfilesDAO.create({
        first_name: firstName || 'System',
        last_name: lastName || 'Administrator',
        email: email,
        password_hash: hashedPassword,
        user_type: 'Administrator',
        status: 'Active'
      })

      return NextResponse.json({
        success: true,
        data: {
          user_id: newUser.user_id,
          email: newUser.email,
          user_type: newUser.user_type,
          status: newUser.status
        },
        message: 'Administrator user created successfully'
      })
    }

  } catch (error) {
    console.error('POST /api/users/create-admin error:', error)
    
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
      message: 'An unexpected error occurred while creating administrator user'
    }, { status: 500 })
  }
}



import { NextRequest, NextResponse } from 'next/server'
import { userProfilesDAO } from '@/lib/user-profiles-dao'
import { DatabaseError, ValidationError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * GET /api/user-profiles
 * Fetch all user profiles with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      status: searchParams.get('status') as 'Active' | 'Inactive' | undefined,
      user_type: searchParams.get('user_type') || undefined,
      association_id: searchParams.get('association_id') ? parseInt(searchParams.get('association_id')!) : undefined,
      search: searchParams.get('search') || undefined
    }

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters]
      }
    })

    const userProfiles = await userProfilesDAO.getAll(filters)
    
    return NextResponse.json({
      success: true,
      data: userProfiles,
      count: userProfiles.length
    })

  } catch (error) {
    console.error('GET /api/user-profiles error:', error)
    
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
 * POST /api/user-profiles
 * Create a new user profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.first_name) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'First name is required'
      }, { status: 400 })
    }

    if (!body.last_name) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Last name is required'
      }, { status: 400 })
    }

    if (!body.email) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Email is required'
      }, { status: 400 })
    }

    if (!body.password_hash) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Password is required'
      }, { status: 400 })
    }

    const newUserProfile = await userProfilesDAO.create(body)
    
    return NextResponse.json({
      success: true,
      data: newUserProfile,
      message: 'User profile created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/user-profiles error:', error)
    
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

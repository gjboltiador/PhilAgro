import { NextRequest, NextResponse } from 'next/server'
import { associationsDAO } from '@/lib/associations-dao'
import { DatabaseError, ValidationError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * GET /api/associations
 * Fetch all associations with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      status: searchParams.get('status') as 'active' | 'inactive' | undefined,
      crop_year: searchParams.get('crop_year') || undefined,
      search: searchParams.get('search') || undefined
    }

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters]
      }
    })

    const associations = await associationsDAO.getAll(filters)
    
    return NextResponse.json({
      success: true,
      data: associations,
      count: associations.length
    })

  } catch (error) {
    console.error('GET /api/associations error:', error)
    
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
 * POST /api/associations
 * Create a new association
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Association name is required'
      }, { status: 400 })
    }

    const newAssociation = await associationsDAO.create(body)
    
    return NextResponse.json({
      success: true,
      data: newAssociation,
      message: 'Association created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/associations error:', error)
    
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

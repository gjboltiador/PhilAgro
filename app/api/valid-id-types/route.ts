import { NextRequest, NextResponse } from 'next/server'
import { validIdTypesDAO, CreateValidIdTypeRequest } from '@/lib/valid-id-types-dao'
import { DatabaseError, ValidationError } from '@/lib/database'

/**
 * GET /api/valid-id-types
 * Get all valid ID types
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active_only') !== 'false' // Default to true

    const validIdTypes = await validIdTypesDAO.getAll(activeOnly)

    return NextResponse.json({
      success: true,
      data: validIdTypes,
      count: validIdTypes.length
    })

  } catch (error: any) {
    console.error('Error fetching valid ID types:', error)
    
    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database error', 
          message: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error', 
        message: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/valid-id-types
 * Create a new valid ID type
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          message: 'Name is required' 
        },
        { status: 400 }
      )
    }

    const validIdTypeData: CreateValidIdTypeRequest = {
      name: body.name,
      description: body.description || undefined,
      is_active: body.is_active !== undefined ? body.is_active : true
    }

    const newValidIdType = await validIdTypesDAO.create(validIdTypeData)

    return NextResponse.json({
      success: true,
      data: newValidIdType,
      message: 'Valid ID type created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating valid ID type:', error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          message: error.message,
          field: error.field
        },
        { status: 400 }
      )
    }

    if (error instanceof DatabaseError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database error', 
          message: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error', 
        message: error.message 
      },
      { status: 500 }
    )
  }
}

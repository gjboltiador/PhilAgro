import { NextRequest, NextResponse } from 'next/server'
import { plantersDAO, CreatePlanterRequest } from '@/lib/planters-dao'
import { DatabaseError, ValidationError } from '@/lib/database'

/**
 * GET /api/planters
 * Get all planters with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      status: searchParams.get('status') as 'active' | 'inactive' | undefined,
      sugar_mill_id: searchParams.get('sugar_mill_id') ? parseInt(searchParams.get('sugar_mill_id')!) : undefined,
      association_id: searchParams.get('association_id') ? parseInt(searchParams.get('association_id')!) : undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
    }

    // Remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    )

    const planters = await plantersDAO.getAll(cleanFilters)

    return NextResponse.json({
      success: true,
      data: planters,
      count: planters.length
    })

  } catch (error: any) {
    console.error('Error fetching planters:', error)
    
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
 * POST /api/planters
 * Create a new planter
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.first_name || !body.last_name || !body.gender || !body.address) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          message: 'Required fields: first_name, last_name, gender, address' 
        },
        { status: 400 }
      )
    }

    const planterData: CreatePlanterRequest = {
      user_id: body.user_id || undefined,
      sugar_mill_id: body.sugar_mill_id || undefined,
      association_id: body.association_id || undefined,
      first_name: body.first_name,
      middle_name: body.middle_name || undefined,
      last_name: body.last_name,
      suffix: body.suffix || undefined,
      gender: body.gender,
      birthdate: body.birthdate || undefined,
      address: body.address,
      contact_number: body.contact_number || undefined,
      email: body.email || undefined,
      profile_picture: body.profile_picture || undefined,
      id_type: body.id_type || undefined,
      id_number: body.id_number || undefined,
      id_picture: body.id_picture || undefined,
      farm_size: body.farm_size || undefined,
      latitude: body.latitude || undefined,
      longitude: body.longitude || undefined,
      status: body.status || 'active',
      created_by_user_id: body.created_by_user_id || undefined
    }

    const newPlanter = await plantersDAO.create(planterData)

    return NextResponse.json({
      success: true,
      data: newPlanter,
      message: 'Planter created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating planter:', error)
    
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

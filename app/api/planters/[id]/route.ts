import { NextRequest, NextResponse } from 'next/server'
import { plantersDAO, UpdatePlanterRequest } from '@/lib/planters-dao'
import { DatabaseError, ValidationError } from '@/lib/database'

/**
 * GET /api/planters/[id]
 * Get planter by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          message: 'Invalid planter ID' 
        },
        { status: 400 }
      )
    }

    const planter = await plantersDAO.getById(id)

    if (!planter) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Not found', 
          message: 'Planter not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: planter
    })

  } catch (error: any) {
    console.error('Error fetching planter:', error)
    
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
 * PUT /api/planters/[id]
 * Update planter by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          message: 'Invalid planter ID' 
        },
        { status: 400 }
      )
    }

    const body = await request.json()

    const updateData: UpdatePlanterRequest = {
      id,
      user_id: body.user_id !== undefined ? body.user_id : undefined,
      sugar_mill_id: body.sugar_mill_id !== undefined ? body.sugar_mill_id : undefined,
      association_id: body.association_id !== undefined ? body.association_id : undefined,
      first_name: body.first_name || undefined,
      middle_name: body.middle_name !== undefined ? body.middle_name : undefined,
      last_name: body.last_name || undefined,
      suffix: body.suffix !== undefined ? body.suffix : undefined,
      gender: body.gender || undefined,
      birthdate: body.birthdate !== undefined ? body.birthdate : undefined,
      address: body.address || undefined,
      contact_number: body.contact_number !== undefined ? body.contact_number : undefined,
      email: body.email !== undefined ? body.email : undefined,
      profile_picture: body.profile_picture !== undefined ? body.profile_picture : undefined,
      id_type: body.id_type !== undefined ? body.id_type : undefined,
      id_number: body.id_number !== undefined ? body.id_number : undefined,
      id_picture: body.id_picture !== undefined ? body.id_picture : undefined,
      farm_size: body.farm_size !== undefined ? body.farm_size : undefined,
      latitude: body.latitude !== undefined ? body.latitude : undefined,
      longitude: body.longitude !== undefined ? body.longitude : undefined,
      status: body.status || undefined,
      updated_by_user_id: body.updated_by_user_id || undefined
    }

    const updatedPlanter = await plantersDAO.update(updateData)

    return NextResponse.json({
      success: true,
      data: updatedPlanter,
      message: 'Planter updated successfully'
    })

  } catch (error: any) {
    console.error('Error updating planter:', error)
    
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

/**
 * DELETE /api/planters/[id]
 * Delete planter by ID (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error', 
          message: 'Invalid planter ID' 
        },
        { status: 400 }
      )
    }

    await plantersDAO.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Planter deleted successfully'
    })

  } catch (error: any) {
    console.error('Error deleting planter:', error)
    
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

import { NextRequest, NextResponse } from 'next/server'
import { associationsDAO } from '@/lib/associations-dao'
import { DatabaseError, ValidationError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * GET /api/associations/[id]
 * Fetch a specific association by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Association ID must be a valid number'
      }, { status: 400 })
    }

    const association = await associationsDAO.getById(id)
    
    if (!association) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Association not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: association
    })

  } catch (error) {
    console.error(`GET /api/associations/${params.id} error:`, error)
    
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
 * PUT /api/associations/[id]
 * Update an existing association
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Association ID must be a valid number'
      }, { status: 400 })
    }

    const body = await request.json()
    const updateData = { ...body, id }

    const updatedAssociation = await associationsDAO.update(updateData)
    
    return NextResponse.json({
      success: true,
      data: updatedAssociation,
      message: 'Association updated successfully'
    })

  } catch (error) {
    console.error(`PUT /api/associations/${params.id} error:`, error)
    
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
 * DELETE /api/associations/[id]
 * Delete an association (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Association ID must be a valid number'
      }, { status: 400 })
    }

    await associationsDAO.delete(id)
    
    return NextResponse.json({
      success: true,
      message: 'Association deleted successfully'
    })

  } catch (error) {
    console.error(`DELETE /api/associations/${params.id} error:`, error)
    
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

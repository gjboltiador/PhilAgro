import { NextRequest, NextResponse } from 'next/server'
import { sugarMillsDAO } from '@/lib/sugar-mills-dao'
import { DatabaseError, ValidationError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * GET /api/sugar-mills/[id]
 * Fetch a specific sugar mill by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid sugar mill ID'
      }, { status: 400 })
    }

    const sugarMill = await sugarMillsDAO.getById(id)
    
    if (!sugarMill) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: 'Sugar mill not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: sugarMill
    })

  } catch (error) {
    console.error('GET /api/sugar-mills/[id] error:', error)
    
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
 * PUT /api/sugar-mills/[id]
 * Update a specific sugar mill
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid sugar mill ID'
      }, { status: 400 })
    }

    const body = await request.json()
    const updateData = { ...body, id }

    const updatedSugarMill = await sugarMillsDAO.update(updateData)
    
    return NextResponse.json({
      success: true,
      data: updatedSugarMill,
      message: 'Sugar mill updated successfully'
    })

  } catch (error) {
    console.error('PUT /api/sugar-mills/[id] error:', error)
    
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
 * DELETE /api/sugar-mills/[id]
 * Delete a specific sugar mill
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params
    const id = parseInt(idParam)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid sugar mill ID'
      }, { status: 400 })
    }

    await sugarMillsDAO.delete(id)
    
    return NextResponse.json({
      success: true,
      message: 'Sugar mill deleted successfully'
    })

  } catch (error) {
    console.error('DELETE /api/sugar-mills/[id] error:', error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: error.message
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

import { NextRequest, NextResponse } from 'next/server'
import { sugarMillsDAO } from '@/lib/sugar-mills-dao'
import { DatabaseError, ValidationError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * GET /api/sugar-mills
 * Fetch all sugar mills with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      operating_status: searchParams.get('operating_status') as 'operational' | 'maintenance' | 'closed' | 'seasonal' | undefined,
      province: searchParams.get('province') || undefined,
      city: searchParams.get('city') || undefined,
      search: searchParams.get('search') || undefined
    }

    // Remove undefined values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters]
      }
    })

    const sugarMills = await sugarMillsDAO.getAll(filters)
    
    return NextResponse.json({
      success: true,
      data: sugarMills,
      count: sugarMills.length
    })

  } catch (error) {
    console.error('GET /api/sugar-mills error:', error)
    
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
 * POST /api/sugar-mills
 * Create a new sugar mill
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.plant_code) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Plant code is required'
      }, { status: 400 })
    }

    if (!body.full_name) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Full name is required'
      }, { status: 400 })
    }

    if (!body.short_name) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Short name is required'
      }, { status: 400 })
    }

    if (!body.city) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'City is required'
      }, { status: 400 })
    }

    if (!body.province) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Province is required'
      }, { status: 400 })
    }

    const newSugarMill = await sugarMillsDAO.create(body)
    
    return NextResponse.json({
      success: true,
      data: newSugarMill,
      message: 'Sugar mill created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('POST /api/sugar-mills error:', error)
    
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

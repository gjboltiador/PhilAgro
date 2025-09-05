import { NextRequest, NextResponse } from 'next/server'
import { sugarMillsDAO } from '@/lib/sugar-mills-dao'
import { DatabaseError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * GET /api/sugar-mills/locations
 * Fetch location data for filtering (provinces and cities)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const province = searchParams.get('province') || undefined

    const [provinces, cities] = await Promise.all([
      sugarMillsDAO.getProvinces(),
      sugarMillsDAO.getCities(province)
    ])
    
    return NextResponse.json({
      success: true,
      data: {
        provinces,
        cities
      }
    })

  } catch (error) {
    console.error('GET /api/sugar-mills/locations error:', error)
    
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

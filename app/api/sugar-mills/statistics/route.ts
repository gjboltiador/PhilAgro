import { NextRequest, NextResponse } from 'next/server'
import { sugarMillsDAO } from '@/lib/sugar-mills-dao'
import { DatabaseError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * GET /api/sugar-mills/statistics
 * Fetch sugar mills statistics
 */
export async function GET(request: NextRequest) {
  try {
    const statistics = await sugarMillsDAO.getStatistics()
    
    return NextResponse.json({
      success: true,
      data: statistics
    })

  } catch (error) {
    console.error('GET /api/sugar-mills/statistics error:', error)
    
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

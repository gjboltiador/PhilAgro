import { NextResponse } from 'next/server'
import { associationsDAO } from '@/lib/associations-dao'
import { DatabaseError } from '@/lib/database'

export const runtime = "nodejs"

/**
 * GET /api/associations/statistics
 * Get association statistics for dashboard
 */
export async function GET() {
  try {
    const statistics = await associationsDAO.getStatistics()
    
    return NextResponse.json({
      success: true,
      data: statistics
    })

  } catch (error) {
    console.error('GET /api/associations/statistics error:', error)
    
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

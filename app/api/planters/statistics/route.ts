import { NextRequest, NextResponse } from 'next/server'
import { plantersDAO } from '@/lib/planters-dao'
import { DatabaseError } from '@/lib/database'

/**
 * GET /api/planters/statistics
 * Get planter statistics
 */
export async function GET(request: NextRequest) {
  try {
    const statistics = await plantersDAO.getStatistics()

    return NextResponse.json({
      success: true,
      data: statistics
    })

  } catch (error: any) {
    console.error('Error fetching planter statistics:', error)
    
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


import { useState } from 'react'

/**
 * Custom hook for testing database connection
 * Provides loading state and connection status
 */
export interface DatabaseTestResult {
  success: boolean
  message: string
  details?: {
    host?: string
    database?: string
    responseTime?: number
  }
}

export function useDatabaseTest() {
  const [testing, setTesting] = useState(false)
  const [lastResult, setLastResult] = useState<DatabaseTestResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async (): Promise<DatabaseTestResult> => {
    setTesting(true)
    setError(null)
    
    const startTime = Date.now()
    
    try {
      const response = await fetch('/api/test-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      const responseTime = Date.now() - startTime
      
      const testResult: DatabaseTestResult = {
        success: result.ok || false,
        message: result.ok 
          ? `Database connection successful (${responseTime}ms)`
          : result.error || 'Connection failed',
        details: {
          responseTime,
          host: 'localhost', // Could be extracted from connection string
          database: 'philagrotech'
        }
      }
      
      setLastResult(testResult)
      
      if (!result.ok) {
        setError(result.error || 'Unknown error occurred')
      }
      
      return testResult
      
    } catch (err: any) {
      const testResult: DatabaseTestResult = {
        success: false,
        message: `Connection error: ${err.message || 'Network error'}`,
      }
      
      setLastResult(testResult)
      setError(err.message || 'Network error')
      
      return testResult
    } finally {
      setTesting(false)
    }
  }

  const clearResult = () => {
    setLastResult(null)
    setError(null)
  }

  return {
    testing,
    lastResult,
    error,
    testConnection,
    clearResult
  }
}

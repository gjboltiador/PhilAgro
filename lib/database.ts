import { createConnection, Connection, RowDataPacket, OkPacket } from 'mysql2/promise'

/**
 * Database utility class following singleton pattern for connection management
 * Following best practices for maintainability and performance
 */
class DatabaseManager {
  private static instance: DatabaseManager
  private connection: Connection | null = null

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  /**
   * Get database connection with automatic reconnection
   */
  public async getConnection(): Promise<Connection> {
    if (!this.connection) {
      const databaseUrl = process.env.DATABASE_URL
      if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set')
      }
      this.connection = await createConnection(databaseUrl)
    }
    return this.connection
  }

  /**
   * Execute a query with proper error handling and type safety
   */
  public async query<T extends RowDataPacket[]>(
    sql: string, 
    params?: any[]
  ): Promise<T> {
    const connection = await this.getConnection()
    try {
      const [rows] = await connection.execute<T>(sql, params)
      return rows
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  }

  /**
   * Execute an insert/update/delete query
   */
  public async execute(sql: string, params?: any[]): Promise<OkPacket> {
    const connection = await this.getConnection()
    try {
      const [result] = await connection.execute<OkPacket>(sql, params)
      return result
    } catch (error) {
      console.error('Database execute error:', error)
      throw error
    }
  }

  /**
   * Close the database connection
   */
  public async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end()
      this.connection = null
    }
  }

  /**
   * Start a transaction for multiple related operations
   */
  public async transaction<T>(
    callback: (connection: Connection) => Promise<T>
  ): Promise<T> {
    const connection = await this.getConnection()
    await connection.beginTransaction()
    
    try {
      const result = await callback(connection)
      await connection.commit()
      return result
    } catch (error) {
      await connection.rollback()
      throw error
    }
  }
}

// Export singleton instance
export const db = DatabaseManager.getInstance()

/**
 * Database error types for better error handling
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public errno?: number,
    public sqlState?: string
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

/**
 * Validation error for business logic violations
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Type definitions for associations
 */
export interface Association {
  id: number
  name: string
  short_name?: string
  contact_email?: string
  contact_person?: string
  phone?: string
  address?: string
  website?: string
  logo_url?: string
  registration_number?: string
  tax_id?: string
  dues_amount?: number
  dues_frequency?: 'monthly' | 'quarterly' | 'annually'
  crop_year?: string | number
  crop_year_label?: string
  assoc_type: 'cooperative' | 'association' | 'union' | 'federation' | 'company' | 'other'
  status: 'active' | 'inactive'
  member_count?: number
  created_at: Date
  updated_at: Date
}

export interface CreateAssociationRequest {
  name: string
  short_name?: string
  contact_email?: string
  contact_person?: string
  phone?: string
  address?: string
  website?: string
  logo_url?: string
  registration_number?: string
  tax_id?: string
  dues_amount?: number
  dues_frequency?: 'monthly' | 'quarterly' | 'annually'
  crop_year?: string
  assoc_type?: 'cooperative' | 'association' | 'union' | 'federation' | 'company' | 'other'
  status?: 'active' | 'inactive'
  member_count?: number
}

export interface UpdateAssociationRequest extends Partial<CreateAssociationRequest> {
  id: number
}

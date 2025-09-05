import { RowDataPacket } from 'mysql2/promise'
import { 
  db, 
  DatabaseError, 
  ValidationError
} from './database'

/**
 * Planter data structure matching the database schema
 */
export interface Planter {
  id: number
  user_id?: number
  sugar_mill_id?: number
  association_id?: number
  first_name: string
  middle_name?: string
  last_name: string
  suffix?: string
  gender: 'male' | 'female' | 'other'
  birthdate?: string
  address: string
  contact_number?: string
  email?: string
  profile_picture?: string
  id_type?: string
  id_number?: string
  id_picture?: string
  farm_size?: number
  latitude?: number
  longitude?: number
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
  created_by_user_id?: number
  updated_by_user_id?: number
  
  // Joined fields
  sugar_mill_name?: string
  sugar_mill_code?: string
  association_name?: string
  association_short_name?: string
  full_name?: string
}

export interface CreatePlanterRequest {
  user_id?: number
  sugar_mill_id?: number
  association_id?: number
  first_name: string
  middle_name?: string
  last_name: string
  suffix?: string
  gender: 'male' | 'female' | 'other'
  birthdate?: string
  address: string
  contact_number?: string
  email?: string
  profile_picture?: string
  id_type?: string
  id_number?: string
  id_picture?: string
  farm_size?: number
  latitude?: number
  longitude?: number
  status?: 'active' | 'inactive'
  created_by_user_id?: number
}

export interface UpdatePlanterRequest extends Partial<CreatePlanterRequest> {
  id: number
  updated_by_user_id?: number
}

/**
 * Data Access Object for Planters
 * Implements repository pattern for clean separation of concerns
 */
export class PlantersDAO {
  
  /**
   * Get all planters with optional filtering and joins
   */
  public async getAll(filters?: {
    status?: 'active' | 'inactive'
    sugar_mill_id?: number
    association_id?: number
    search?: string
    limit?: number
    offset?: number
  }): Promise<Planter[]> {
    let sql = `
      SELECT 
        p.id,
        p.user_id,
        p.sugar_mill_id,
        p.association_id,
        p.first_name,
        p.middle_name,
        p.last_name,
        p.suffix,
        p.gender,
        p.birthdate,
        p.address,
        p.contact_number,
        p.email,
        p.profile_picture,
        p.id_type,
        p.id_number,
        p.id_picture,
        p.farm_size,
        p.latitude,
        p.longitude,
        p.status,
        p.created_at,
        p.updated_at,
        p.created_by_user_id,
        p.updated_by_user_id,
        CONCAT(p.first_name, ' ', COALESCE(p.middle_name, ''), ' ', p.last_name, ' ', COALESCE(p.suffix, '')) as full_name,
        sm.plant_code as sugar_mill_code,
        sm.full_name as sugar_mill_name,
        a.association_name,
        a.short_name as association_short_name
      FROM planters p
      LEFT JOIN sugar_mills sm ON p.sugar_mill_id = sm.id
      LEFT JOIN associations a ON p.association_id = a.association_id
      WHERE 1=1
    `
    const params: any[] = []

    if (filters?.status) {
      sql += ' AND p.status = ?'
      params.push(filters.status)
    }

    if (filters?.sugar_mill_id) {
      sql += ' AND p.sugar_mill_id = ?'
      params.push(filters.sugar_mill_id)
    }

    if (filters?.association_id) {
      sql += ' AND p.association_id = ?'
      params.push(filters.association_id)
    }

    if (filters?.search) {
      sql += ` AND (
        p.first_name LIKE ? OR 
        p.last_name LIKE ? OR 
        p.email LIKE ? OR 
        p.contact_number LIKE ? OR
        CONCAT(p.first_name, ' ', p.last_name) LIKE ?
      )`
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm)
    }

    sql += ' ORDER BY p.created_at DESC'

    if (filters?.limit) {
      sql += ' LIMIT ?'
      params.push(filters.limit)
      
      if (filters?.offset) {
        sql += ' OFFSET ?'
        params.push(filters.offset)
      }
    }

    try {
      const rows = await db.query<(Planter & RowDataPacket)[]>(sql, params)
      return rows
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to fetch planters',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Get planter by ID
   */
  public async getById(id: number): Promise<Planter | null> {
    const sql = `
      SELECT 
        p.id,
        p.user_id,
        p.sugar_mill_id,
        p.association_id,
        p.first_name,
        p.middle_name,
        p.last_name,
        p.suffix,
        p.gender,
        p.birthdate,
        p.address,
        p.contact_number,
        p.email,
        p.profile_picture,
        p.id_type,
        p.id_number,
        p.id_picture,
        p.farm_size,
        p.latitude,
        p.longitude,
        p.status,
        p.created_at,
        p.updated_at,
        p.created_by_user_id,
        p.updated_by_user_id,
        CONCAT(p.first_name, ' ', COALESCE(p.middle_name, ''), ' ', p.last_name, ' ', COALESCE(p.suffix, '')) as full_name,
        sm.plant_code as sugar_mill_code,
        sm.full_name as sugar_mill_name,
        a.association_name,
        a.short_name as association_short_name
      FROM planters p
      LEFT JOIN sugar_mills sm ON p.sugar_mill_id = sm.id
      LEFT JOIN associations a ON p.association_id = a.association_id
      WHERE p.id = ?
    `

    try {
      const rows = await db.query<(Planter & RowDataPacket)[]>(sql, [id])
      return rows.length > 0 ? rows[0] : null
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch planter with ID ${id}`,
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Create new planter with validation
   */
  public async create(data: CreatePlanterRequest): Promise<Planter> {
    // Validation
    this.validatePlanterData(data)
    
    // Check for duplicate email if provided
    if (data.email) {
      await this.checkEmailUniqueness(data.email)
    }

    const sql = `
      INSERT INTO planters (
        user_id, sugar_mill_id, association_id, first_name, middle_name, last_name, suffix,
        gender, birthdate, address, contact_number, email, profile_picture, id_type, id_number,
        id_picture, farm_size, latitude, longitude, status, created_by_user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      data.user_id || null,
      data.sugar_mill_id || null,
      data.association_id || null,
      data.first_name.trim(),
      data.middle_name?.trim() || null,
      data.last_name.trim(),
      data.suffix?.trim() || null,
      data.gender,
      data.birthdate || null,
      data.address.trim(),
      data.contact_number?.trim() || null,
      data.email?.trim() || null,
      data.profile_picture || null,
      data.id_type?.trim() || null,
      data.id_number?.trim() || null,
      data.id_picture || null,
      data.farm_size || null,
      data.latitude || null,
      data.longitude || null,
      data.status || 'active',
      data.created_by_user_id || null
    ]

    try {
      const result = await db.execute(sql, params)
      const newPlanter = await this.getById(result.insertId)
      
      if (!newPlanter) {
        throw new DatabaseError('Failed to retrieve created planter')
      }

      return newPlanter
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ValidationError('Email address already exists', 'email')
      }
      throw new DatabaseError(
        'Failed to create planter',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Update existing planter
   */
  public async update(data: UpdatePlanterRequest): Promise<Planter> {
    if (!data.id) {
      throw new ValidationError('Planter ID is required for update', 'id')
    }

    // Check if planter exists
    const existing = await this.getById(data.id)
    if (!existing) {
      throw new ValidationError(`Planter with ID ${data.id} not found`, 'id')
    }

    // Validate updated data
    if (data.first_name || data.last_name || data.gender || data.address) {
      this.validatePlanterData({
        first_name: data.first_name || existing.first_name,
        last_name: data.last_name || existing.last_name,
        gender: data.gender || existing.gender,
        address: data.address || existing.address
      } as CreatePlanterRequest)
    }

    // Check email uniqueness if email is being updated
    if (data.email && data.email !== existing.email) {
      await this.checkEmailUniqueness(data.email, data.id)
    }

    // Build dynamic update query
    const updateFields: string[] = []
    const params: any[] = []

    // Map frontend field names to database field names
    const fieldMappings: { [key: string]: string } = {
      'user_id': 'user_id',
      'sugar_mill_id': 'sugar_mill_id',
      'association_id': 'association_id',
      'first_name': 'first_name',
      'middle_name': 'middle_name',
      'last_name': 'last_name',
      'suffix': 'suffix',
      'gender': 'gender',
      'birthdate': 'birthdate',
      'address': 'address',
      'contact_number': 'contact_number',
      'email': 'email',
      'profile_picture': 'profile_picture',
      'id_type': 'id_type',
      'id_number': 'id_number',
      'id_picture': 'id_picture',
      'farm_size': 'farm_size',
      'latitude': 'latitude',
      'longitude': 'longitude',
      'status': 'status',
      'updated_by_user_id': 'updated_by_user_id'
    }

    Object.keys(fieldMappings).forEach(frontendField => {
      if (data[frontendField as keyof UpdatePlanterRequest] !== undefined) {
        const dbField = fieldMappings[frontendField]
        updateFields.push(`${dbField} = ?`)
        params.push(data[frontendField as keyof UpdatePlanterRequest])
      }
    })

    if (updateFields.length === 0) {
      throw new ValidationError('No fields to update', 'general')
    }

    params.push(data.id)

    const sql = `
      UPDATE planters 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `

    try {
      await db.execute(sql, params)
      const updatedPlanter = await this.getById(data.id)
      
      if (!updatedPlanter) {
        throw new DatabaseError('Failed to retrieve updated planter')
      }

      return updatedPlanter
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ValidationError('Email address already exists', 'email')
      }
      throw new DatabaseError(
        'Failed to update planter',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Delete planter (soft delete by setting status to inactive)
   */
  public async delete(id: number): Promise<void> {
    // Check if planter exists
    const existing = await this.getById(id)
    if (!existing) {
      throw new ValidationError(`Planter with ID ${id} not found`, 'id')
    }

    try {
      // Soft delete by setting status to inactive
      await db.execute(
        'UPDATE planters SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['inactive', id]
      )
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to delete planter',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Hard delete planter (use with caution)
   */
  public async hardDelete(id: number): Promise<void> {
    // Check if planter exists
    const existing = await this.getById(id)
    if (!existing) {
      throw new ValidationError(`Planter with ID ${id} not found`, 'id')
    }

    try {
      await db.execute('DELETE FROM planters WHERE id = ?', [id])
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to permanently delete planter',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Get planter statistics
   */
  public async getStatistics(): Promise<{
    total: number
    active: number
    inactive: number
    byGender: Record<string, number>
    bySugarMill: Record<string, number>
    byAssociation: Record<string, number>
  }> {
    try {
      const totalResult = await db.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM planters'
      )
      
      const statusResult = await db.query<RowDataPacket[]>(
        'SELECT status, COUNT(*) as count FROM planters GROUP BY status'
      )
      
      const genderResult = await db.query<RowDataPacket[]>(
        'SELECT gender, COUNT(*) as count FROM planters GROUP BY gender'
      )
      
      const sugarMillResult = await db.query<RowDataPacket[]>(`
        SELECT 
          COALESCE(sm.plant_code, 'No Sugar Mill') as sugar_mill_name,
          COUNT(*) as count
        FROM planters p
        LEFT JOIN sugar_mills sm ON p.sugar_mill_id = sm.id
        GROUP BY p.sugar_mill_id, sm.plant_code
      `)
      
      const associationResult = await db.query<RowDataPacket[]>(`
        SELECT 
          COALESCE(a.association_name, 'No Association') as association_name,
          COUNT(*) as count
        FROM planters p
        LEFT JOIN associations a ON p.association_id = a.association_id
        GROUP BY p.association_id, a.association_name
      `)

      const stats = {
        total: totalResult[0].count,
        active: 0,
        inactive: 0,
        byGender: {} as Record<string, number>,
        bySugarMill: {} as Record<string, number>,
        byAssociation: {} as Record<string, number>
      }

      statusResult.forEach(row => {
        if (row.status === 'active') stats.active = row.count
        if (row.status === 'inactive') stats.inactive = row.count
      })

      genderResult.forEach(row => {
        stats.byGender[row.gender] = row.count
      })

      sugarMillResult.forEach(row => {
        stats.bySugarMill[row.sugar_mill_name] = row.count
      })

      associationResult.forEach(row => {
        stats.byAssociation[row.association_name] = row.count
      })

      return stats
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch planter statistics: ${error.message || 'Unknown error'}`,
        error.code || 'UNKNOWN_ERROR',
        error.errno || 0,
        error.sqlState || 'UNKNOWN_STATE'
      )
    }
  }

  /**
   * Private validation methods
   */
  private validatePlanterData(data: CreatePlanterRequest): void {
    if (!data.first_name || data.first_name.trim().length === 0) {
      throw new ValidationError('First name is required', 'first_name')
    }

    if (!data.last_name || data.last_name.trim().length === 0) {
      throw new ValidationError('Last name is required', 'last_name')
    }

    if (!data.gender) {
      throw new ValidationError('Gender is required', 'gender')
    }

    if (!['male', 'female', 'other'].includes(data.gender)) {
      throw new ValidationError('Invalid gender value', 'gender')
    }

    if (!data.address || data.address.trim().length === 0) {
      throw new ValidationError('Address is required', 'address')
    }

    if (data.email && !this.isValidEmail(data.email)) {
      throw new ValidationError('Invalid email format', 'email')
    }

    if (data.farm_size && data.farm_size < 0) {
      throw new ValidationError('Farm size cannot be negative', 'farm_size')
    }

    if (data.birthdate && !this.isValidDate(data.birthdate)) {
      throw new ValidationError('Invalid birthdate format', 'birthdate')
    }
  }

  private async checkEmailUniqueness(email: string, excludeId?: number): Promise<void> {
    let sql = 'SELECT id FROM planters WHERE email = ?'
    const params = [email]

    if (excludeId) {
      sql += ' AND id != ?'
      params.push(excludeId)
    }

    const rows = await db.query<RowDataPacket[]>(sql, params)
    if (rows.length > 0) {
      throw new ValidationError('Email address already exists', 'email')
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date.getTime())
  }
}

// Export singleton instance
export const plantersDAO = new PlantersDAO()

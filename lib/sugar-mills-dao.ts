import { RowDataPacket } from 'mysql2/promise'
import { 
  db, 
  DatabaseError, 
  ValidationError
} from './database'

/**
 * Sugar Mill interface matching the database schema
 */
export interface SugarMill {
  id: number
  plant_code: string
  full_name: string
  short_name: string
  description?: string
  address?: string
  city: string
  province: string
  postal_code?: string
  contact_person?: string
  phone?: string
  email?: string
  website?: string
  registration_number?: string
  tax_id?: string
  capacity?: number
  capacity_unit: 'tons' | 'metric_tons'
  operating_status: 'operational' | 'maintenance' | 'closed' | 'seasonal'
  crop_year: string
  start_date?: string
  end_date?: string
  manager_name?: string
  manager_phone?: string
  manager_email?: string
  latitude?: number
  longitude?: number
  created_at: Date
  updated_at: Date
}

export interface CreateSugarMillRequest {
  plant_code: string
  full_name: string
  short_name: string
  description?: string
  address?: string
  city: string
  province: string
  postal_code?: string
  contact_person?: string
  phone?: string
  email?: string
  website?: string
  registration_number?: string
  tax_id?: string
  capacity?: number
  capacity_unit?: 'tons' | 'metric_tons'
  operating_status?: 'operational' | 'maintenance' | 'closed' | 'seasonal'
  crop_year?: string
  start_date?: string
  end_date?: string
  manager_name?: string
  manager_phone?: string
  manager_email?: string
  latitude?: number
  longitude?: number
}

export interface UpdateSugarMillRequest extends Partial<CreateSugarMillRequest> {
  id: number
}

export interface SugarMillFilters {
  operating_status?: 'operational' | 'maintenance' | 'closed' | 'seasonal'
  province?: string
  city?: string
  search?: string
}

export interface SugarMillStatistics {
  total: number
  operational: number
  maintenance: number
  closed: number
  seasonal: number
  byProvince: Record<string, number>
  totalCapacity: number
}

/**
 * Data Access Object for Sugar Mills
 * Implements repository pattern for clean separation of concerns
 * Follows SOLID principles for maintainability
 */
export class SugarMillsDAO {
  
  /**
   * Get all sugar mills with optional filtering
   */
  public async getAll(filters?: SugarMillFilters): Promise<SugarMill[]> {
    let sql = `
      SELECT 
        id,
        plant_code,
        full_name,
        short_name,
        description,
        address,
        city,
        province,
        postal_code,
        contact_person,
        phone,
        email,
        website,
        registration_number,
        tax_id,
        capacity,
        capacity_unit,
        operating_status,
        crop_year,
        start_date,
        end_date,
        manager_name,
        manager_phone,
        manager_email,
        latitude,
        longitude,
        created_at,
        updated_at
      FROM sugar_mills
      WHERE 1=1
    `
    const params: any[] = []

    if (filters?.operating_status) {
      sql += ' AND operating_status = ?'
      params.push(filters.operating_status)
    }

    if (filters?.province) {
      sql += ' AND province = ?'
      params.push(filters.province)
    }

    if (filters?.city) {
      sql += ' AND city = ?'
      params.push(filters.city)
    }

    if (filters?.search) {
      sql += ' AND (full_name LIKE ? OR short_name LIKE ? OR plant_code LIKE ? OR contact_person LIKE ?)'
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }

    sql += ' ORDER BY created_at DESC'

    try {
      const rows = await db.query<(SugarMill & RowDataPacket)[]>(sql, params)
      return rows
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to fetch sugar mills',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Get sugar mill by ID
   */
  public async getById(id: number): Promise<SugarMill | null> {
    const sql = `
      SELECT 
        id,
        plant_code,
        full_name,
        short_name,
        description,
        address,
        city,
        province,
        postal_code,
        contact_person,
        phone,
        email,
        website,
        registration_number,
        tax_id,
        capacity,
        capacity_unit,
        operating_status,
        crop_year,
        start_date,
        end_date,
        manager_name,
        manager_phone,
        manager_email,
        latitude,
        longitude,
        created_at,
        updated_at
      FROM sugar_mills
      WHERE id = ?
    `

    try {
      const rows = await db.query<(SugarMill & RowDataPacket)[]>(sql, [id])
      return rows.length > 0 ? rows[0] : null
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch sugar mill with ID ${id}`,
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Get sugar mill by plant code
   */
  public async getByPlantCode(plantCode: string): Promise<SugarMill | null> {
    const sql = `
      SELECT 
        id,
        plant_code,
        full_name,
        short_name,
        description,
        address,
        city,
        province,
        postal_code,
        contact_person,
        phone,
        email,
        website,
        registration_number,
        tax_id,
        capacity,
        capacity_unit,
        operating_status,
        crop_year,
        start_date,
        end_date,
        manager_name,
        manager_phone,
        manager_email,
        latitude,
        longitude,
        created_at,
        updated_at
      FROM sugar_mills
      WHERE plant_code = ?
    `

    try {
      const rows = await db.query<(SugarMill & RowDataPacket)[]>(sql, [plantCode])
      return rows.length > 0 ? rows[0] : null
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch sugar mill with plant code ${plantCode}`,
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Create new sugar mill with validation
   */
  public async create(data: CreateSugarMillRequest): Promise<SugarMill> {
    // Validation
    this.validateSugarMillData(data)
    
    // Check for duplicate plant code
    await this.checkPlantCodeUniqueness(data.plant_code)

    const sql = `
      INSERT INTO sugar_mills (
        plant_code, full_name, short_name, description, address, city, province,
        postal_code, contact_person, phone, email, website, registration_number,
        tax_id, capacity, capacity_unit, operating_status, crop_year, start_date,
        end_date, manager_name, manager_phone, manager_email, latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      data.plant_code,
      data.full_name,
      data.short_name,
      data.description || null,
      data.address || null,
      data.city,
      data.province,
      data.postal_code || null,
      data.contact_person || null,
      data.phone || null,
      data.email || null,
      data.website || null,
      data.registration_number || null,
      data.tax_id || null,
      data.capacity || null,
      data.capacity_unit || 'tons',
      data.operating_status || 'operational',
      data.crop_year || '2024-2025',
      data.start_date && data.start_date.trim() !== '' ? data.start_date : null,
      data.end_date && data.end_date.trim() !== '' ? data.end_date : null,
      data.manager_name || null,
      data.manager_phone || null,
      data.manager_email || null,
      data.latitude || null,
      data.longitude || null
    ]

    try {
      const result = await db.execute(sql, params)
      const newSugarMill = await this.getById(result.insertId)
      
      if (!newSugarMill) {
        throw new DatabaseError('Failed to retrieve created sugar mill')
      }

      return newSugarMill
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ValidationError('Plant code already exists', 'plant_code')
      }
      throw new DatabaseError(
        'Failed to create sugar mill',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Update existing sugar mill
   */
  public async update(data: UpdateSugarMillRequest): Promise<SugarMill> {
    if (!data.id) {
      throw new ValidationError('Sugar mill ID is required for update', 'id')
    }

    // Check if sugar mill exists
    const existing = await this.getById(data.id)
    if (!existing) {
      throw new ValidationError(`Sugar mill with ID ${data.id} not found`, 'id')
    }

    // Validate updated data - merge with existing data for validation
    const dataToValidate = { ...existing, ...data }
    this.validateSugarMillData(dataToValidate as CreateSugarMillRequest)
    
    // Check plant code uniqueness if plant code is being changed
    if (data.plant_code && data.plant_code !== existing.plant_code) {
      await this.checkPlantCodeUniqueness(data.plant_code, data.id)
    }

    // Build dynamic update query
    const updateFields: string[] = []
    const params: any[] = []

    // Map frontend field names to database field names
    const fieldMappings: { [key: string]: string } = {
      'plant_code': 'plant_code',
      'full_name': 'full_name',
      'short_name': 'short_name',
      'description': 'description',
      'address': 'address',
      'city': 'city',
      'province': 'province',
      'postal_code': 'postal_code',
      'contact_person': 'contact_person',
      'phone': 'phone',
      'email': 'email',
      'website': 'website',
      'registration_number': 'registration_number',
      'tax_id': 'tax_id',
      'capacity': 'capacity',
      'capacity_unit': 'capacity_unit',
      'operating_status': 'operating_status',
      'crop_year': 'crop_year',
      'start_date': 'start_date',
      'end_date': 'end_date',
      'manager_name': 'manager_name',
      'manager_phone': 'manager_phone',
      'manager_email': 'manager_email',
      'latitude': 'latitude',
      'longitude': 'longitude'
    }

    Object.keys(fieldMappings).forEach(frontendField => {
      if (data[frontendField as keyof UpdateSugarMillRequest] !== undefined) {
        const dbField = fieldMappings[frontendField]
        updateFields.push(`${dbField} = ?`)
        
        let value = data[frontendField as keyof UpdateSugarMillRequest]
        
        // Convert empty strings to null for date fields
        if ((frontendField === 'start_date' || frontendField === 'end_date') && value === '') {
          value = null
        }
        
        params.push(value)
      }
    })

    if (updateFields.length === 0) {
      throw new ValidationError('No fields to update', 'general')
    }

    params.push(data.id)

    const sql = `
      UPDATE sugar_mills 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `

    try {
      await db.execute(sql, params)
      const updatedSugarMill = await this.getById(data.id)
      
      if (!updatedSugarMill) {
        throw new DatabaseError('Failed to retrieve updated sugar mill')
      }

      return updatedSugarMill
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ValidationError('Plant code already exists', 'plant_code')
      }
      throw new DatabaseError(
        'Failed to update sugar mill',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Delete sugar mill (hard delete)
   */
  public async delete(id: number): Promise<void> {
    // Check if sugar mill exists
    const existing = await this.getById(id)
    if (!existing) {
      throw new ValidationError(`Sugar mill with ID ${id} not found`, 'id')
    }

    try {
      await db.execute('DELETE FROM sugar_mills WHERE id = ?', [id])
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to delete sugar mill',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Get sugar mill statistics
   */
  public async getStatistics(): Promise<SugarMillStatistics> {
    try {
      const totalResult = await db.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM sugar_mills'
      )
      
      const statusResult = await db.query<RowDataPacket[]>(
        'SELECT operating_status, COUNT(*) as count FROM sugar_mills GROUP BY operating_status'
      )
      
      const provinceResult = await db.query<RowDataPacket[]>(
        'SELECT province, COUNT(*) as count FROM sugar_mills GROUP BY province'
      )
      
      const capacityResult = await db.query<RowDataPacket[]>(
        'SELECT SUM(capacity) as total_capacity FROM sugar_mills WHERE capacity IS NOT NULL'
      )

      const stats: SugarMillStatistics = {
        total: totalResult[0].count,
        operational: 0,
        maintenance: 0,
        closed: 0,
        seasonal: 0,
        byProvince: {},
        totalCapacity: capacityResult[0].total_capacity || 0
      }

      statusResult.forEach(row => {
        switch (row.operating_status) {
          case 'operational':
            stats.operational = row.count
            break
          case 'maintenance':
            stats.maintenance = row.count
            break
          case 'closed':
            stats.closed = row.count
            break
          case 'seasonal':
            stats.seasonal = row.count
            break
        }
      })

      provinceResult.forEach(row => {
        stats.byProvince[row.province] = row.count
      })

      return stats
    } catch (error: any) {
      console.error('Sugar mill statistics error:', error)
      throw new DatabaseError(
        `Failed to fetch sugar mill statistics: ${error.message || 'Unknown error'}`,
        error.code || 'UNKNOWN_ERROR',
        error.errno || 0,
        error.sqlState || 'UNKNOWN_STATE'
      )
    }
  }

  /**
   * Get unique provinces for filtering
   */
  public async getProvinces(): Promise<string[]> {
    try {
      const result = await db.query<RowDataPacket[]>(
        'SELECT DISTINCT province FROM sugar_mills ORDER BY province'
      )
      return result.map(row => row.province)
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to fetch provinces',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Get unique cities for filtering
   */
  public async getCities(province?: string): Promise<string[]> {
    try {
      let sql = 'SELECT DISTINCT city FROM sugar_mills'
      const params: any[] = []

      if (province) {
        sql += ' WHERE province = ?'
        params.push(province)
      }

      sql += ' ORDER BY city'

      const result = await db.query<RowDataPacket[]>(sql, params)
      return result.map(row => row.city)
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to fetch cities',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Private validation methods
   */
  private validateSugarMillData(data: CreateSugarMillRequest): void {
    if (!data.plant_code || data.plant_code.trim().length === 0) {
      throw new ValidationError('Plant code is required', 'plant_code')
    }

    if (data.plant_code.length > 50) {
      throw new ValidationError('Plant code must be less than 50 characters', 'plant_code')
    }

    if (!data.full_name || data.full_name.trim().length === 0) {
      throw new ValidationError('Full name is required', 'full_name')
    }

    if (data.full_name.length > 255) {
      throw new ValidationError('Full name must be less than 255 characters', 'full_name')
    }

    if (!data.short_name || data.short_name.trim().length === 0) {
      throw new ValidationError('Short name is required', 'short_name')
    }

    if (data.short_name.length > 100) {
      throw new ValidationError('Short name must be less than 100 characters', 'short_name')
    }

    if (!data.city || data.city.trim().length === 0) {
      throw new ValidationError('City is required', 'city')
    }

    if (!data.province || data.province.trim().length === 0) {
      throw new ValidationError('Province is required', 'province')
    }

    if (data.email && !this.isValidEmail(data.email)) {
      throw new ValidationError('Invalid email format', 'email')
    }

    if (data.manager_email && !this.isValidEmail(data.manager_email)) {
      throw new ValidationError('Invalid manager email format', 'manager_email')
    }

    if (data.capacity && data.capacity < 0) {
      throw new ValidationError('Capacity cannot be negative', 'capacity')
    }

    if (data.latitude && (data.latitude < -90 || data.latitude > 90)) {
      throw new ValidationError('Latitude must be between -90 and 90', 'latitude')
    }

    if (data.longitude && (data.longitude < -180 || data.longitude > 180)) {
      throw new ValidationError('Longitude must be between -180 and 180', 'longitude')
    }
  }

  private async checkPlantCodeUniqueness(plantCode: string, excludeId?: number): Promise<void> {
    let sql = 'SELECT id FROM sugar_mills WHERE plant_code = ?'
    const params = [plantCode]

    if (excludeId) {
      sql += ' AND id != ?'
      params.push(excludeId)
    }

    const rows = await db.query<RowDataPacket[]>(sql, params)
    if (rows.length > 0) {
      throw new ValidationError('Plant code already exists', 'plant_code')
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// Export singleton instance
export const sugarMillsDAO = new SugarMillsDAO()

import { RowDataPacket } from 'mysql2/promise'
import { 
  db, 
  DatabaseError, 
  ValidationError, 
  Association, 
  CreateAssociationRequest, 
  UpdateAssociationRequest 
} from './database'

/**
 * Data Access Object for Associations
 * Implements repository pattern for clean separation of concerns
 * Follows SOLID principles for maintainability
 */
export class AssociationsDAO {
  
  /**
   * Get all associations with optional filtering
   */
  public async getAll(filters?: {
    status?: 'active' | 'inactive'
    crop_year?: string
    search?: string
  }): Promise<Association[]> {
    let sql = `
      SELECT 
        a.association_id as id, 
        a.association_name as name, 
        a.short_name, 
        a.email as contact_email, 
        a.contact_person, 
        a.phone_number as phone, 
        a.address,
        a.website, 
        a.logo as logo_url,
        a.registration_number, 
        a.tax_id, 
        a.dues_amount, 
        a.dues_frequency,
        a.crop_year_id as crop_year, 
        cy.label as crop_year_label,
        'association' as assoc_type, 
        a.status, 
        a.member_count, 
        a.created_at, 
        a.updated_at
      FROM associations a
      LEFT JOIN crop_years cy ON a.crop_year_id = cy.crop_year_id
      WHERE 1=1
    `
    const params: any[] = []

    if (filters?.status) {
      sql += ' AND a.status = ?'
      params.push(filters.status === 'active' ? 'Active' : 'Inactive')
    }

    if (filters?.crop_year) {
      sql += ' AND a.crop_year_id = ?'
      params.push(filters.crop_year)
    }

    if (filters?.search) {
      sql += ' AND (a.association_name LIKE ? OR a.short_name LIKE ? OR a.contact_person LIKE ?)'
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    sql += ' ORDER BY a.created_at DESC'

    try {
      const rows = await db.query<(Association & RowDataPacket)[]>(sql, params)
      return rows
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to fetch associations',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Get association by ID
   */
  public async getById(id: number): Promise<Association | null> {
    const sql = `
      SELECT 
        a.association_id as id, 
        a.association_name as name, 
        a.short_name, 
        a.email as contact_email, 
        a.contact_person, 
        a.phone_number as phone, 
        a.address,
        a.website, 
        a.logo as logo_url,
        a.registration_number, 
        a.tax_id, 
        a.dues_amount, 
        a.dues_frequency,
        a.crop_year_id as crop_year, 
        cy.label as crop_year_label,
        'association' as assoc_type, 
        a.status, 
        a.member_count, 
        a.created_at, 
        a.updated_at
      FROM associations a
      LEFT JOIN crop_years cy ON a.crop_year_id = cy.crop_year_id
      WHERE a.association_id = ?
    `

    try {
      const rows = await db.query<(Association & RowDataPacket)[]>(sql, [id])
      return rows.length > 0 ? rows[0] : null
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch association with ID ${id}`,
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Create new association with validation
   */
  public async create(data: CreateAssociationRequest): Promise<Association> {
    // Validation
    this.validateAssociationData(data)
    
    // Check for duplicate name
    await this.checkNameUniqueness(data.name)

    // Get the default or latest crop year
    let cropYearId = 1 // Default fallback
    try {
      const [cropYearResult] = await db.query<RowDataPacket[]>(
        'SELECT crop_year_id FROM crop_years ORDER BY crop_year_id DESC LIMIT 1'
      )
      if (cropYearResult.length > 0) {
        cropYearId = cropYearResult[0].crop_year_id
      }
    } catch (error) {
      console.log('Using default crop_year_id = 1')
    }

    const sql = `
      INSERT INTO associations (
        association_name, short_name, email, contact_person, phone_number, address,
        website, logo, registration_number, tax_id, dues_amount, dues_frequency,
        crop_year_id, status, member_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      data.name,
      data.short_name || null,
      data.contact_email || null,
      data.contact_person || null,
      data.phone || null,
      data.address || null,
      data.website || null,
      (data as any).logo_url || null,
      data.registration_number || null,
      data.tax_id || null,
      data.dues_amount || 0,
      data.dues_frequency === 'monthly' ? 'Monthly' : data.dues_frequency === 'quarterly' ? 'Quarterly' : 'Annually',
      cropYearId,
      data.status === 'inactive' ? 'Inactive' : 'Active',
      data.member_count || 0
    ]

    try {
      const result = await db.execute(sql, params)
      const newAssociation = await this.getById(result.insertId)
      
      if (!newAssociation) {
        throw new DatabaseError('Failed to retrieve created association')
      }

      return newAssociation
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ValidationError('Association name already exists', 'name')
      }
      throw new DatabaseError(
        'Failed to create association',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Update existing association
   */
  public async update(data: UpdateAssociationRequest): Promise<Association> {
    if (!data.id) {
      throw new ValidationError('Association ID is required for update', 'id')
    }

    // Check if association exists
    const existing = await this.getById(data.id)
    if (!existing) {
      throw new ValidationError(`Association with ID ${data.id} not found`, 'id')
    }

    // Validate updated data
    if (data.name) {
      this.validateAssociationData({ name: data.name } as CreateAssociationRequest)
      
      // Check name uniqueness if name is being changed
      if (data.name !== existing.name) {
        await this.checkNameUniqueness(data.name, data.id)
      }
    }

    // Build dynamic update query
    const updateFields: string[] = []
    const params: any[] = []

    // Map frontend field names to database field names
    const fieldMappings: { [key: string]: string } = {
      'name': 'association_name',
      'short_name': 'short_name',
      'contact_email': 'email',
      'contact_person': 'contact_person',
      'phone': 'phone_number',
      'address': 'address',
      'website': 'website',
      'logo_url': 'logo',
      'registration_number': 'registration_number',
      'tax_id': 'tax_id',
      'dues_amount': 'dues_amount',
      'dues_frequency': 'dues_frequency',
      'crop_year': 'crop_year_id',
      'status': 'status',
      'member_count': 'member_count'
    }

    Object.keys(fieldMappings).forEach(frontendField => {
      if (data[frontendField as keyof UpdateAssociationRequest] !== undefined) {
        const dbField = fieldMappings[frontendField]
        updateFields.push(`${dbField} = ?`)
        
        let value = data[frontendField as keyof UpdateAssociationRequest]
        
        // Transform values for database
        if (frontendField === 'dues_frequency') {
          value = value === 'monthly' ? 'Monthly' : value === 'quarterly' ? 'Quarterly' : 'Annually'
        } else if (frontendField === 'status') {
          value = value === 'inactive' ? 'Inactive' : 'Active'
        }
        
        params.push(value)
      }
    })

    if (updateFields.length === 0) {
      throw new ValidationError('No fields to update', 'general')
    }

    params.push(data.id)

    const sql = `
      UPDATE associations 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE association_id = ?
    `

    try {
      await db.execute(sql, params)
      const updatedAssociation = await this.getById(data.id)
      
      if (!updatedAssociation) {
        throw new DatabaseError('Failed to retrieve updated association')
      }

      return updatedAssociation
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ValidationError('Association name already exists', 'name')
      }
      throw new DatabaseError(
        'Failed to update association',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Delete association (soft delete by setting status to inactive)
   */
  public async delete(id: number): Promise<void> {
    // Check if association exists
    const existing = await this.getById(id)
    if (!existing) {
      throw new ValidationError(`Association with ID ${id} not found`, 'id')
    }

    // Check for dependencies (planters, equipment, etc.)
    await this.checkDependencies(id)

    try {
      // Soft delete by setting status to inactive
      await db.execute(
        'UPDATE associations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE association_id = ?',
        ['Inactive', id]
      )
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to delete association',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Hard delete association (use with caution)
   */
  public async hardDelete(id: number): Promise<void> {
    // Check if association exists
    const existing = await this.getById(id)
    if (!existing) {
      throw new ValidationError(`Association with ID ${id} not found`, 'id')
    }

    // Check for dependencies
    await this.checkDependencies(id)

    try {
      await db.execute('DELETE FROM associations WHERE association_id = ?', [id])
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to permanently delete association',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Get association statistics
   */
  public async getStatistics(): Promise<{
    total: number
    active: number
    inactive: number
    byType: Record<string, number>
  }> {
    try {
      const totalResult = await db.query<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM associations'
      )
      
      const statusResult = await db.query<RowDataPacket[]>(
        'SELECT status, COUNT(*) as count FROM associations GROUP BY status'
      )
      
      // Since the actual table doesn't have assoc_type column, we'll provide a default type distribution
      // All associations in this table are sugar farmer associations
      const stats = {
        total: totalResult[0].count,
        active: 0,
        inactive: 0,
        byType: {
          'association': totalResult[0].count  // All entries are associations
        } as Record<string, number>
      }

      statusResult.forEach(row => {
        if (row.status === 'Active') stats.active = row.count
        if (row.status === 'Inactive') stats.inactive = row.count
      })

      return stats
    } catch (error: any) {
      console.error('Association statistics error:', error)
      throw new DatabaseError(
        `Failed to fetch association statistics: ${error.message || 'Unknown error'}`,
        error.code || 'UNKNOWN_ERROR',
        error.errno || 0,
        error.sqlState || 'UNKNOWN_STATE'
      )
    }
  }

  /**
   * Private validation methods
   */
  private validateAssociationData(data: CreateAssociationRequest): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Association name is required', 'name')
    }

    if (data.name.length > 255) {
      throw new ValidationError('Association name must be less than 255 characters', 'name')
    }

    if (data.contact_email && !this.isValidEmail(data.contact_email)) {
      throw new ValidationError('Invalid email format', 'contact_email')
    }

    if (data.dues_amount && data.dues_amount < 0) {
      throw new ValidationError('Dues amount cannot be negative', 'dues_amount')
    }

    if (data.member_count && data.member_count < 0) {
      throw new ValidationError('Member count cannot be negative', 'member_count')
    }
  }

  private async checkNameUniqueness(name: string, excludeId?: number): Promise<void> {
    let sql = 'SELECT association_id FROM associations WHERE association_name = ?'
    const params = [name]

    if (excludeId) {
      sql += ' AND association_id != ?'
      params.push(excludeId)
    }

    const rows = await db.query<RowDataPacket[]>(sql, params)
    if (rows.length > 0) {
      throw new ValidationError('Association name already exists', 'name')
    }
  }

  private async checkDependencies(id: number): Promise<void> {
    // Check for active memberships
    const [memberships] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM planter_memberships WHERE association_id = ?',
      [id]
    )

    if (memberships[0].count > 0) {
      throw new ValidationError(
        'Cannot delete association with active member records',
        'dependencies'
      )
    }

    // Check for equipment assignments
    const [equipment] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM trucks WHERE association_id = ? UNION ALL SELECT COUNT(*) as count FROM tractors WHERE association_id = ? UNION ALL SELECT COUNT(*) as count FROM equipment WHERE association_id = ?',
      [id, id, id]
    )

    const totalEquipment = equipment.reduce((sum: number, row: any) => sum + row.count, 0)
    if (totalEquipment > 0) {
      throw new ValidationError(
        'Cannot delete association with assigned equipment',
        'dependencies'
      )
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// Export singleton instance
export const associationsDAO = new AssociationsDAO()

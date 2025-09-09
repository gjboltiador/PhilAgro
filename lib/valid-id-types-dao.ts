import { RowDataPacket } from 'mysql2/promise'
import { 
  db, 
  DatabaseError, 
  ValidationError
} from './database'

/**
 * Valid ID Type data structure
 */
export interface ValidIdType {
  id: number
  name: string
  description?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateValidIdTypeRequest {
  name: string
  description?: string
  is_active?: boolean
}

export interface UpdateValidIdTypeRequest extends Partial<CreateValidIdTypeRequest> {
  id: number
}

/**
 * Data Access Object for Valid ID Types
 */
export class ValidIdTypesDAO {
  
  /**
   * Get all valid ID types
   */
  public async getAll(activeOnly: boolean = true): Promise<ValidIdType[]> {
    let sql = `
      SELECT 
        id,
        name,
        description,
        is_active,
        created_at,
        updated_at
      FROM valid_id_types
      WHERE 1=1
    `
    const params: any[] = []

    if (activeOnly) {
      sql += ' AND is_active = ?'
      params.push(true)
    }

    sql += ' ORDER BY name ASC'

    try {
      const rows = await db.query<(ValidIdType & RowDataPacket)[]>(sql, params)
      return rows
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to fetch valid ID types',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Get valid ID type by ID
   */
  public async getById(id: number): Promise<ValidIdType | null> {
    const sql = `
      SELECT 
        id,
        name,
        description,
        is_active,
        created_at,
        updated_at
      FROM valid_id_types
      WHERE id = ?
    `

    try {
      const rows = await db.query<(ValidIdType & RowDataPacket)[]>(sql, [id])
      return rows.length > 0 ? rows[0] : null
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch valid ID type with ID ${id}`,
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Get valid ID type by name
   */
  public async getByName(name: string): Promise<ValidIdType | null> {
    const sql = `
      SELECT 
        id,
        name,
        description,
        is_active,
        created_at,
        updated_at
      FROM valid_id_types
      WHERE name = ?
    `

    try {
      const rows = await db.query<(ValidIdType & RowDataPacket)[]>(sql, [name])
      return rows.length > 0 ? rows[0] : null
    } catch (error: any) {
      throw new DatabaseError(
        `Failed to fetch valid ID type with name ${name}`,
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Create new valid ID type
   */
  public async create(data: CreateValidIdTypeRequest): Promise<ValidIdType> {
    // Validation
    if (!data.name || data.name.trim().length === 0) {
      throw new ValidationError('Name is required', 'name')
    }

    // Check for duplicate name
    const existing = await this.getByName(data.name.trim())
    if (existing) {
      throw new ValidationError('Valid ID type with this name already exists', 'name')
    }

    const sql = `
      INSERT INTO valid_id_types (name, description, is_active)
      VALUES (?, ?, ?)
    `

    const params = [
      data.name.trim(),
      data.description?.trim() || null,
      data.is_active !== undefined ? data.is_active : true
    ]

    try {
      const result = await db.execute(sql, params)
      const newValidIdType = await this.getById(result.insertId)
      
      if (!newValidIdType) {
        throw new DatabaseError('Failed to retrieve created valid ID type')
      }

      return newValidIdType
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ValidationError('Valid ID type with this name already exists', 'name')
      }
      throw new DatabaseError(
        'Failed to create valid ID type',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Update existing valid ID type
   */
  public async update(data: UpdateValidIdTypeRequest): Promise<ValidIdType> {
    if (!data.id) {
      throw new ValidationError('Valid ID type ID is required for update', 'id')
    }

    // Check if valid ID type exists
    const existing = await this.getById(data.id)
    if (!existing) {
      throw new ValidationError(`Valid ID type with ID ${data.id} not found`, 'id')
    }

    // Check for duplicate name if name is being updated
    if (data.name && data.name !== existing.name) {
      const duplicate = await this.getByName(data.name)
      if (duplicate) {
        throw new ValidationError('Valid ID type with this name already exists', 'name')
      }
    }

    // Build dynamic update query
    const updateFields: string[] = []
    const params: any[] = []

    if (data.name !== undefined) {
      updateFields.push('name = ?')
      params.push(data.name.trim())
    }

    if (data.description !== undefined) {
      updateFields.push('description = ?')
      params.push(data.description?.trim() || null)
    }

    if (data.is_active !== undefined) {
      updateFields.push('is_active = ?')
      params.push(data.is_active)
    }

    if (updateFields.length === 0) {
      throw new ValidationError('No fields to update', 'general')
    }

    params.push(data.id)

    const sql = `
      UPDATE valid_id_types 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `

    try {
      await db.execute(sql, params)
      const updatedValidIdType = await this.getById(data.id)
      
      if (!updatedValidIdType) {
        throw new DatabaseError('Failed to retrieve updated valid ID type')
      }

      return updatedValidIdType
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ValidationError('Valid ID type with this name already exists', 'name')
      }
      throw new DatabaseError(
        'Failed to update valid ID type',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Delete valid ID type (soft delete by setting is_active to false)
   */
  public async delete(id: number): Promise<void> {
    // Check if valid ID type exists
    const existing = await this.getById(id)
    if (!existing) {
      throw new ValidationError(`Valid ID type with ID ${id} not found`, 'id')
    }

    try {
      // Soft delete by setting is_active to false
      await db.execute(
        'UPDATE valid_id_types SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [false, id]
      )
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to delete valid ID type',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }

  /**
   * Hard delete valid ID type (use with caution)
   */
  public async hardDelete(id: number): Promise<void> {
    // Check if valid ID type exists
    const existing = await this.getById(id)
    if (!existing) {
      throw new ValidationError(`Valid ID type with ID ${id} not found`, 'id')
    }

    try {
      await db.execute('DELETE FROM valid_id_types WHERE id = ?', [id])
    } catch (error: any) {
      throw new DatabaseError(
        'Failed to permanently delete valid ID type',
        error.code,
        error.errno,
        error.sqlState
      )
    }
  }
}

// Export singleton instance
export const validIdTypesDAO = new ValidIdTypesDAO()

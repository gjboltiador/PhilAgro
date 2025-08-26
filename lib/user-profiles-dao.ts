import { db, DatabaseError, ValidationError } from './database'
import { RowDataPacket, ResultSetHeader } from 'mysql2'

export interface UserProfile {
  user_id: number
  first_name: string
  middle_name?: string
  last_name: string
  email: string
  password_hash: string
  profile_picture?: string
  avatar?: string
  id_type?: 'Driver_License' | 'TIN_ID' | 'Passport' | 'National_ID' | 'Others'
  id_image?: string
  phone_number?: string
  address?: string
  user_type: 'Association Member' | 'Unaffiliated' | 'Hauler' | 'Planter' | 'Supplier' | 'Tractor Operator' | 'Driver'
  association_id?: number
  status: 'Active' | 'Inactive'
  created_at: Date
  updated_at: Date
  
  // Joined fields
  association_name?: string
  full_name?: string
}

export interface CreateUserProfileRequest {
  first_name: string
  middle_name?: string
  last_name: string
  email: string
  password_hash: string
  profile_picture?: string
  avatar?: string
  id_type?: 'Driver_License' | 'TIN_ID' | 'Passport' | 'National_ID' | 'Others'
  id_image?: string
  phone_number?: string
  address?: string
  user_type?: 'Association Member' | 'Unaffiliated' | 'Hauler' | 'Planter' | 'Supplier' | 'Tractor Operator' | 'Driver'
  association_id?: number
  status?: 'Active' | 'Inactive'
}

export interface UpdateUserProfileRequest {
  user_id: number
  first_name?: string
  middle_name?: string
  last_name?: string
  email?: string
  profile_picture?: string
  avatar?: string
  id_type?: 'Driver_License' | 'TIN_ID' | 'Passport' | 'National_ID' | 'Others'
  id_image?: string
  phone_number?: string
  address?: string
  user_type?: 'Association Member' | 'Unaffiliated' | 'Hauler' | 'Planter' | 'Supplier' | 'Tractor Operator' | 'Driver'
  association_id?: number
  status?: 'Active' | 'Inactive'
}

export interface ChangePasswordRequest {
  user_id: number
  current_password: string
  new_password: string
}

class UserProfilesDAO {
  
  /**
   * Get all user profiles with optional filtering
   */
  public async getAll(filters?: {
    status?: 'Active' | 'Inactive'
    user_type?: string
    association_id?: number
    search?: string
  }): Promise<UserProfile[]> {
    let sql = `
      SELECT 
        up.user_id,
        up.first_name,
        up.middle_name,
        up.last_name,
        CONCAT(up.first_name, ' ', COALESCE(up.middle_name, ''), ' ', up.last_name) as full_name,
        up.email,
        up.profile_picture,
        up.avatar,
        up.id_type,
        up.id_image,
        up.phone_number,
        up.address,
        up.user_type,
        up.association_id,
        up.status,
        up.created_at,
        up.updated_at,
        a.association_name
      FROM user_profiles up
      LEFT JOIN associations a ON up.association_id = a.association_id
      WHERE 1=1
    `
    const params: any[] = []

    if (filters?.status) {
      sql += ' AND up.status = ?'
      params.push(filters.status)
    }

    if (filters?.user_type) {
      sql += ' AND up.user_type = ?'
      params.push(filters.user_type)
    }

    if (filters?.association_id) {
      sql += ' AND up.association_id = ?'
      params.push(filters.association_id)
    }

    if (filters?.search) {
      sql += ` AND (
        up.first_name LIKE ? OR 
        up.last_name LIKE ? OR 
        up.email LIKE ? OR 
        up.phone_number LIKE ?
      )`
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm, searchTerm, searchTerm)
    }

    sql += ' ORDER BY up.created_at DESC'

    try {
      const rows = await db.query<(UserProfile & RowDataPacket)[]>(sql, params)
      return rows
    } catch (error: any) {
      throw new DatabaseError(`Failed to fetch user profiles: ${error.message}`, error)
    }
  }

  /**
   * Get user profile by ID
   */
  public async getById(user_id: number): Promise<UserProfile | null> {
    const sql = `
      SELECT 
        up.user_id,
        up.first_name,
        up.middle_name,
        up.last_name,
        CONCAT(up.first_name, ' ', COALESCE(up.middle_name, ''), ' ', up.last_name) as full_name,
        up.email,
        up.profile_picture,
        up.avatar,
        up.id_type,
        up.id_image,
        up.phone_number,
        up.address,
        up.user_type,
        up.association_id,
        up.status,
        up.created_at,
        up.updated_at,
        a.association_name
      FROM user_profiles up
      LEFT JOIN associations a ON up.association_id = a.association_id
      WHERE up.user_id = ?
    `

    try {
      const rows = await db.query<(UserProfile & RowDataPacket)[]>(sql, [user_id])
      return rows.length > 0 ? rows[0] : null
    } catch (error: any) {
      throw new DatabaseError(`Failed to fetch user profile: ${error.message}`, error)
    }
  }

  /**
   * Get user profile by email
   */
  public async getByEmail(email: string): Promise<UserProfile | null> {
    const sql = `
      SELECT 
        up.user_id,
        up.first_name,
        up.middle_name,
        up.last_name,
        CONCAT(up.first_name, ' ', COALESCE(up.middle_name, ''), ' ', up.last_name) as full_name,
        up.email,
        up.password_hash,
        up.profile_picture,
        up.avatar,
        up.id_type,
        up.id_image,
        up.phone_number,
        up.address,
        up.user_type,
        up.association_id,
        up.status,
        up.created_at,
        up.updated_at,
        a.association_name
      FROM user_profiles up
      LEFT JOIN associations a ON up.association_id = a.association_id
      WHERE up.email = ?
    `

    try {
      const rows = await db.query<(UserProfile & RowDataPacket)[]>(sql, [email])
      return rows.length > 0 ? rows[0] : null
    } catch (error: any) {
      throw new DatabaseError(`Failed to fetch user profile by email: ${error.message}`, error)
    }
  }

  /**
   * Create a new user profile
   */
  public async create(data: CreateUserProfileRequest): Promise<UserProfile> {
    // Validate required fields
    if (!data.first_name?.trim()) {
      throw new ValidationError('First name is required', 'first_name')
    }
    if (!data.last_name?.trim()) {
      throw new ValidationError('Last name is required', 'last_name')
    }
    if (!data.email?.trim()) {
      throw new ValidationError('Email is required', 'email')
    }
    if (!data.password_hash?.trim()) {
      throw new ValidationError('Password is required', 'password')
    }

    // Check email uniqueness
    const existingUser = await this.getByEmail(data.email)
    if (existingUser) {
      throw new ValidationError('Email address is already in use', 'email')
    }

    const sql = `
      INSERT INTO user_profiles (
        first_name, middle_name, last_name, email, password_hash,
        profile_picture, avatar, id_type, id_image, phone_number, address,
        user_type, association_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      data.first_name.trim(),
      data.middle_name?.trim() || null,
      data.last_name.trim(),
      data.email.trim(),
      data.password_hash,
      data.profile_picture || 'default_profile.png',
      data.avatar || 'default_avatar.png',
      data.id_type || 'Others',
      data.id_image || null,
      data.phone_number?.trim() || null,
      data.address?.trim() || null,
      data.user_type || 'Unaffiliated',
      data.association_id || null,
      data.status || 'Active'
    ]

    try {
      const result = await db.execute(sql, params)
      const newUser = await this.getById(result.insertId)
      
      if (!newUser) {
        throw new Error('Failed to retrieve created user profile')
      }

      return newUser
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error
      }
      throw new DatabaseError(`Failed to create user profile: ${error.message}`, error)
    }
  }

  /**
   * Update user profile
   */
  public async update(data: UpdateUserProfileRequest): Promise<UserProfile> {
    const { user_id, ...updateFields } = data

    if (!user_id) {
      throw new ValidationError('User ID is required', 'user_id')
    }

    // Check if user exists
    const existingUser = await this.getById(user_id)
    if (!existingUser) {
      throw new ValidationError('User profile not found', 'user_id')
    }

    // Check email uniqueness if email is being updated
    if (updateFields.email && updateFields.email !== existingUser.email) {
      const emailExists = await this.getByEmail(updateFields.email)
      if (emailExists) {
        throw new ValidationError('Email address is already in use', 'email')
      }
    }

    // Build dynamic update query
    const updateColumns: string[] = []
    const params: any[] = []

    Object.entries(updateFields).forEach(([key, value]) => {
      if (value !== undefined) {
        updateColumns.push(`${key} = ?`)
        params.push(value)
      }
    })

    if (updateColumns.length === 0) {
      return existingUser // No changes to make
    }

    // Add updated_at
    updateColumns.push('updated_at = CURRENT_TIMESTAMP')
    params.push(user_id)

    const sql = `UPDATE user_profiles SET ${updateColumns.join(', ')} WHERE user_id = ?`

    try {
      await db.execute(sql, params)
      
      const updatedUser = await this.getById(user_id)
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user profile')
      }

      return updatedUser
    } catch (error: any) {
      if (error instanceof ValidationError) {
        throw error
      }
      throw new DatabaseError(`Failed to update user profile: ${error.message}`, error)
    }
  }

  /**
   * Change user password
   */
  public async changePassword(data: ChangePasswordRequest): Promise<boolean> {
    const { user_id, current_password, new_password } = data

    if (!user_id) {
      throw new ValidationError('User ID is required', 'user_id')
    }
    if (!current_password) {
      throw new ValidationError('Current password is required', 'current_password')
    }
    if (!new_password) {
      throw new ValidationError('New password is required', 'new_password')
    }

    // Get current user with password hash
    const user = await this.getByEmail((await this.getById(user_id))?.email || '')
    if (!user) {
      throw new ValidationError('User not found', 'user_id')
    }

    // In a real implementation, you would verify the current password hash here
    // For now, we'll assume the verification is done at the API level

    const sql = 'UPDATE user_profiles SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'

    try {
      await db.execute(sql, [new_password, user_id])
      return true
    } catch (error: any) {
      throw new DatabaseError(`Failed to change password: ${error.message}`, error)
    }
  }

  /**
   * Soft delete user profile (set status to Inactive)
   */
  public async delete(user_id: number): Promise<boolean> {
    if (!user_id) {
      throw new ValidationError('User ID is required', 'user_id')
    }

    const sql = 'UPDATE user_profiles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'

    try {
      const result = await db.execute(sql, ['Inactive', user_id])
      return result.affectedRows > 0
    } catch (error: any) {
      throw new DatabaseError(`Failed to delete user profile: ${error.message}`, error)
    }
  }

  /**
   * Get user statistics
   */
  public async getStatistics(): Promise<{
    total: number
    active: number
    inactive: number
    byUserType: Record<string, number>
    byAssociation: Record<string, number>
  }> {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'Inactive' THEN 1 ELSE 0 END) as inactive,
        user_type,
        COALESCE(a.association_name, 'No Association') as association_name,
        COUNT(*) as count
      FROM user_profiles up
      LEFT JOIN associations a ON up.association_id = a.association_id
      GROUP BY user_type, association_name
    `

    try {
      const rows = await db.query<RowDataPacket[]>(sql)
      
      const stats = {
        total: 0,
        active: 0,
        inactive: 0,
        byUserType: {} as Record<string, number>,
        byAssociation: {} as Record<string, number>
      }

      rows.forEach(row => {
        stats.total = Math.max(stats.total, row.total)
        stats.active = Math.max(stats.active, row.active)
        stats.inactive = Math.max(stats.inactive, row.inactive)
        stats.byUserType[row.user_type] = (stats.byUserType[row.user_type] || 0) + row.count
        stats.byAssociation[row.association_name] = (stats.byAssociation[row.association_name] || 0) + row.count
      })

      return stats
    } catch (error: any) {
      throw new DatabaseError(`Failed to get user statistics: ${error.message}`, error)
    }
  }
}

export const userProfilesDAO = new UserProfilesDAO()

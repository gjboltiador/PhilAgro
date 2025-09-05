# Planters System Database Design Documentation

## Overview

This document provides a comprehensive analysis of the planters registration system and the database schema designed to support it. The system is based on the analysis of the planters registration page (`app/registration/planters/page.tsx`) and integrates with existing database structures.

## System Architecture

### Core Entities

The planters system consists of four main entities with well-defined relationships:

1. **Sugar Mills** - Processing facilities
2. **Associations** - Cooperatives and farmer organizations
3. **Planters** - Individual farmers/sugar planters
4. **Planter Memberships** - Crop year-based memberships
5. **Planter Farms** - Individual farm properties

## Database Schema Analysis

### 1. Sugar Mills Table

**Purpose**: Stores information about sugar processing facilities

**Key Fields**:
- `plant_code` - Unique identifier (e.g., URSUMCO, SONEDCO)
- `full_name` - Complete legal name
- `short_name` - Abbreviated name for display
- `operating_status` - Current operational status
- `city`, `province` - Location information
- `capacity` - Milling capacity
- `crop_year` - Current crop year

**Relationships**:
- One-to-Many with Associations
- One-to-Many with Planter Memberships

### 2. Associations Table (Enhanced)

**Purpose**: Represents farmer cooperatives and organizations

**Key Fields**:
- `name` - Association name
- `short_name` - Abbreviated name
- `sugar_mill_id` - Associated sugar mill
- `assoc_type` - Type (cooperative, association, union, etc.)
- `status` - Active/inactive status
- `member_count` - Number of members

**Relationships**:
- Many-to-One with Sugar Mills
- One-to-Many with Planter Memberships

### 3. Planters Table (Main Entity)

**Purpose**: Stores individual planter/farmer information

**Key Fields from Registration Form**:

#### Personal Information
- `first_name`, `middle_name`, `last_name`
- `contact_number`, `email_address`
- `profile_picture_url`

#### Valid ID Information
- `valid_id_type` - ENUM with all valid ID types from form
- `valid_id_number`
- `valid_id_image_url`

#### Address Information
- `complete_address` - Full address text
- `barangay`, `municipality`, `province`

#### Business Relationships
- `sugar_mill_id` - Associated sugar mill
- `association_id` - Associated association
- `crop_year` - Current crop year

#### Farm Information
- `total_farm_area` - Total area in hectares
- `sugarcane_area` - Sugarcane area in hectares
- `other_crops_area` - Other crops area

#### Status and Registration
- `status` - active, pending, inactive, suspended
- `membership_status` - member, unaffiliated, pending_membership
- `registration_date`

#### Emergency Contact
- `emergency_contact_name`
- `emergency_contact_number`
- `emergency_contact_relationship`

**Relationships**:
- Many-to-One with Users (optional)
- Many-to-One with Sugar Mills
- Many-to-One with Associations
- One-to-Many with Planter Memberships
- One-to-Many with Planter Farms

### 4. Planter Memberships Table

**Purpose**: Manages crop year-based memberships with business rules

**Key Features**:
- **Exclusivity Rule**: One membership per planter per crop year
- **Transfer Restrictions**: Tracks if planter can transfer associations
- **Delivery Tracking**: Monitors deliveries and restrictions
- **Financial Management**: Dues status and payment tracking

**Key Fields**:
- `planter_id`, `association_id`, `sugar_mill_id`
- `crop_year` - Enforces crop year exclusivity
- `membership_status` - active, inactive, suspended, terminated
- `dues_status` - paid, pending, overdue, waived
- `has_deliveries` - Boolean flag for delivery restrictions
- `can_transfer` - Boolean for transfer restrictions
- `total_delivered` - Total tons delivered

**Business Rules**:
1. A planter can only be a member of one association per crop year
2. If a planter has made deliveries, transfer restrictions apply
3. Membership status affects delivery eligibility

### 5. Planter Farms Table

**Purpose**: Manages individual farm properties

**Key Fields**:
- `planter_id` - Owner of the farm
- `farm_name`, `farm_code` - Farm identification
- `total_area`, `sugarcane_area`, `other_crops_area`
- `soil_type`, `irrigation_type`
- `farm_status` - active, inactive, fallow

## Relationships and Constraints

### Primary Relationships

```
Sugar Mills (1) ←→ (Many) Associations
Sugar Mills (1) ←→ (Many) Planter Memberships
Associations (1) ←→ (Many) Planter Memberships
Planters (1) ←→ (Many) Planter Memberships
Planters (1) ←→ (Many) Planter Farms
Users (1) ←→ (0..1) Planters
```

### Business Rule Constraints

1. **Crop Year Exclusivity**: 
   - Unique constraint on `(planter_id, crop_year)` in planter_memberships
   - Ensures one membership per planter per crop year

2. **Transfer Restrictions**:
   - If `has_deliveries = TRUE`, then `can_transfer = FALSE`
   - Enforced at application level with database triggers

3. **Association-Sugar Mill Alignment**:
   - Association must be associated with the same sugar mill as the membership
   - Enforced through foreign key relationships

4. **Status Consistency**:
   - Planter status affects membership eligibility
   - Membership status affects delivery eligibility

## Data Flow from Registration Form

### Form Fields Mapping

| Form Field | Database Field | Table | Notes |
|------------|----------------|-------|-------|
| firstName | first_name | planters | Required |
| middleName | middle_name | planters | Optional |
| lastName | last_name | planters | Required |
| contactNumber | contact_number | planters | Required |
| emailAddress | email_address | planters | Optional |
| profilePicture | profile_picture_url | planters | File upload |
| validIdType | valid_id_type | planters | ENUM validation |
| validIdNumber | valid_id_number | planters | Required with ID type |
| validIdPicture | valid_id_image_url | planters | File upload |
| completeAddress | complete_address | planters | Required |
| barangay | barangay | planters | Required |
| municipality | municipality | planters | Required |
| province | province | planters | Required |
| sugarMillId | sugar_mill_id | planters | Required |
| associationId | association_id | planters | Required |
| cropYear | crop_year | planters | Default: 2024-2025 |

### Registration Process

1. **Form Validation**: All required fields validated
2. **Sugar Mill Selection**: User selects from operational sugar mills
3. **Association Filtering**: Associations filtered by selected sugar mill
4. **Planter Creation**: New planter record created
5. **Membership Creation**: Planter membership record created
6. **Farm Creation**: Farm record created (if farm details provided)

## Indexes and Performance

### Primary Indexes

```sql
-- Planters table
idx_planters_user (user_id)
idx_planters_sugar_mill (sugar_mill_id)
idx_planters_association (association_id)
idx_planters_status (status)
idx_planters_composite_status (status, membership_status)
idx_planters_location (province, municipality)
idx_planters_name (last_name, first_name)

-- Memberships table
idx_memberships_planter (planter_id)
idx_memberships_association (association_id)
idx_memberships_sugar_mill (sugar_mill_id)
idx_memberships_crop_year (crop_year)
idx_memberships_composite_status (membership_status, dues_status)

-- Farms table
idx_farms_planter (planter_id)
idx_farms_location (province, municipality)
idx_farms_composite_status (farm_status, province)
```

### Query Optimization

1. **Registration Lookups**: Optimized for sugar mill and association filtering
2. **Status Queries**: Composite indexes for status-based filtering
3. **Location Queries**: Geographic indexes for location-based searches
4. **Membership Queries**: Optimized for crop year and status filtering

## Sample Data Structure

### Sugar Mills
- URSUMCO (United Robina Sugar Milling Corporation)
- SONEDCO (Southern Negros Development Corporation)
- TOLONG (Tolong Sugar Milling Company)
- BUGAY (Bugay Sugar Milling Corporation)
- CAB (Central Azucarera de Bais)

### Associations
- NOSPA (Negros Oriental Sugar Planters Association) → URSUMCO
- BASUCO (Bayawan Sugar Farmers Cooperative) → SONEDCO
- MASPU (Mabinay Sugar Planters Union) → BUGAY
- TOSPA (Tolong Sugar Planters Association) → TOLONG

### Sample Planters
- P-1001: Juan Dela Cruz (NOSPA, URSUMCO)
- P-1002: Maria Santos (BASUCO, SONEDCO)
- P-1003: Pedro Reyes (TOSPA, TOLONG)
- P-1004: Ana Gonzales (MASPU, BUGAY) - Pending
- P-1005: Carlos Mendoza (BASUCO, CAB) - Inactive

## Business Logic Implementation

### Registration Validation

1. **Sugar Mill Validation**: Must be operational
2. **Association Validation**: Must be accredited and associated with selected sugar mill
3. **ID Validation**: Valid ID type and number required
4. **Address Validation**: Complete address information required
5. **Contact Validation**: Valid phone number format

### Membership Management

1. **Crop Year Exclusivity**: Enforced at database level
2. **Transfer Restrictions**: Applied when deliveries exist
3. **Status Transitions**: Controlled state machine
4. **Dues Management**: Automated status updates

### Delivery Tracking

1. **Membership Requirement**: Active membership required for deliveries
2. **Transfer Lock**: Deliveries prevent association transfers
3. **Volume Tracking**: Total delivered tracked per membership

## Security Considerations

### Data Protection

1. **Personal Information**: Encrypted storage for sensitive data
2. **File Uploads**: Secure file storage for images
3. **Access Control**: Role-based access to planter data
4. **Audit Trail**: Complete audit logging for all changes

### Validation

1. **Input Validation**: All form inputs validated
2. **Business Rule Validation**: Complex business rules enforced
3. **Referential Integrity**: Foreign key constraints maintained
4. **Data Consistency**: Transaction-based operations

## Migration Strategy

### Deployment Steps

1. **Run Migration Script**: Execute comprehensive migration
2. **Verify Data Integrity**: Check all relationships
3. **Update Application Code**: Implement new data access patterns
4. **Test Registration Flow**: Validate complete registration process
5. **Performance Testing**: Verify query performance

### Rollback Plan

1. **Backup Current Data**: Full database backup
2. **Migration Rollback**: Script to revert changes
3. **Data Recovery**: Restore from backup if needed
4. **Application Rollback**: Revert to previous version

## Conclusion

The comprehensive planters system provides a robust foundation for managing sugar planter registrations with proper business rule enforcement, data integrity, and performance optimization. The system supports the complex relationships between sugar mills, associations, and planters while maintaining data consistency and business logic compliance.

The database design ensures scalability, maintainability, and compliance with agricultural business requirements while providing a solid foundation for future enhancements and integrations.

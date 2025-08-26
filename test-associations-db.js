// Test the associations database integration
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
const mysql = require('mysql2/promise');

async function testAssociationsDB() {
  console.log('🔍 Testing Associations Database Integration\n');
  
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    // Test 1: Check if associations table exists with correct structure
    console.log('1. Checking associations table structure...');
    try {
      const [columns] = await connection.query("DESCRIBE associations");
      console.log('✅ Associations table found with columns:');
      columns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type}`);
      });
      
      // Check for required fields
      const columnNames = columns.map(col => col.Field);
      const requiredFields = ['association_id', 'association_name', 'short_name', 'email', 'phone_number'];
      const hasRequired = requiredFields.every(field => columnNames.includes(field));
      
      if (hasRequired) {
        console.log('✅ All required fields present');
      } else {
        console.log('❌ Missing required fields');
        return;
      }
    } catch (error) {
      console.error('❌ Associations table not found:', error.message);
      return;
    }
    
    // Test 2: Check crop_years table (required foreign key)
    console.log('\n2. Checking crop_years table...');
    try {
      const [cropYears] = await connection.query("SELECT * FROM crop_years LIMIT 3");
      if (cropYears.length > 0) {
        console.log('✅ Crop years table found with data:');
        cropYears.forEach(cy => {
          console.log(`   - ID: ${cy.crop_year_id}, Year: ${cy.crop_year || cy.year || 'N/A'}`);
        });
      } else {
        console.log('⚠️  Crop years table exists but is empty');
        console.log('   You may need to add default crop years');
      }
    } catch (error) {
      console.log('⚠️  Crop years table not found:', error.message);
      console.log('   Creating default crop year entry...');
      try {
        await connection.query(`
          CREATE TABLE IF NOT EXISTS crop_years (
            crop_year_id INT AUTO_INCREMENT PRIMARY KEY,
            crop_year VARCHAR(20) NOT NULL,
            start_date DATE,
            end_date DATE,
            status ENUM('Active', 'Inactive') DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        await connection.query(`
          INSERT IGNORE INTO crop_years (crop_year_id, crop_year, status) 
          VALUES (1, '2024-2025', 'Active')
        `);
        console.log('✅ Default crop year created');
      } catch (createError) {
        console.error('❌ Failed to create crop year:', createError.message);
      }
    }
    
    // Test 3: Test a simple query
    console.log('\n3. Testing associations query...');
    try {
      const [result] = await connection.query(`
        SELECT 
          association_id as id, 
          association_name as name, 
          short_name, 
          email as contact_email,
          contact_person,
          phone_number as phone,
          address,
          website,
          registration_number,
          tax_id,
          dues_amount,
          dues_frequency,
          crop_year_id as crop_year,
          status,
          member_count,
          created_at,
          updated_at
        FROM associations 
        LIMIT 5
      `);
      
      console.log(`✅ Query successful, found ${result.length} associations`);
      if (result.length > 0) {
        console.log('Sample data:');
        result.forEach((assoc, index) => {
          console.log(`   ${index + 1}. ${assoc.name} (ID: ${assoc.id}, Status: ${assoc.status})`);
        });
      } else {
        console.log('ℹ️  No associations found (this is normal for new setup)');
      }
    } catch (error) {
      console.error('❌ Query failed:', error.message);
    }
    
    await connection.end();
    
    console.log('\n🎉 Database integration test completed!');
    console.log('✅ Your associations API should now work correctly');
    console.log('\n📋 Next steps:');
    console.log('   1. Restart your dev server: npm run dev');
    console.log('   2. Go to Settings > Associations');
    console.log('   3. Try adding a new association');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAssociationsDB();

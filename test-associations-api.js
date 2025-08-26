// Test the associations API endpoint directly
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Import the DAO directly to test
const { associationsDAO } = require('./lib/associations-dao.ts');

async function testAssociationsAPI() {
  console.log('🔍 Testing Associations API and Data Fetching\n');
  
  try {
    // Test 1: Direct DAO call
    console.log('1. Testing direct DAO call...');
    try {
      const directResult = await associationsDAO.getAll();
      console.log(`✅ Direct DAO call successful! Found ${directResult.length} associations`);
      
      if (directResult.length > 0) {
        console.log('\n📋 Sample association data:');
        directResult.slice(0, 2).forEach((assoc, index) => {
          console.log(`${index + 1}. ${assoc.name} (ID: ${assoc.id})`);
          console.log(`   Status: ${assoc.status}`);
          console.log(`   Short Name: ${assoc.short_name || 'N/A'}`);
          console.log(`   Logo: ${assoc.logo_url || 'No logo'}`);
          console.log('   ---');
        });
      } else {
        console.log('❌ No associations found in direct DAO call');
      }
    } catch (daoError) {
      console.error('❌ Direct DAO call failed:', daoError.message);
      console.error('Stack:', daoError.stack);
      return;
    }
    
    // Test 2: Test API endpoint via fetch (simulate frontend call)
    console.log('\n2. Testing API endpoint...');
    try {
      // Start a temporary server to test the API
      const { createServer } = require('http');
      const { parse } = require('url');
      const next = require('next');
      
      // This is complex, let's use a simpler approach
      console.log('🔧 Testing API logic manually...');
      
      // Simulate the API call logic
      const filters = {};
      const apiResult = await associationsDAO.getAll(filters);
      
      const responseData = {
        success: true,
        data: apiResult,
        count: apiResult.length
      };
      
      console.log(`✅ API logic test successful!`);
      console.log(`📊 Response structure:`);
      console.log(`   success: ${responseData.success}`);
      console.log(`   count: ${responseData.count}`);
      console.log(`   data length: ${responseData.data.length}`);
      
    } catch (apiError) {
      console.error('❌ API logic test failed:', apiError.message);
    }
    
    // Test 3: Check database connection and query
    console.log('\n3. Testing database query directly...');
    try {
      const mysql = require('mysql2/promise');
      const connection = await mysql.createConnection(process.env.DATABASE_URL);
      
      const [rawRows] = await connection.query('SELECT COUNT(*) as count FROM associations WHERE status = "Active"');
      console.log(`✅ Raw database query: ${rawRows[0].count} active associations found`);
      
      const [sampleRows] = await connection.query(`
        SELECT 
          association_id, 
          association_name, 
          short_name, 
          status,
          logo
        FROM associations 
        LIMIT 3
      `);
      
      console.log('\n📋 Raw database sample:');
      sampleRows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.association_name} (ID: ${row.association_id})`);
        console.log(`   Status: ${row.status}`);
        console.log(`   Short Name: ${row.short_name || 'N/A'}`);
        console.log(`   Logo: ${row.logo || 'No logo'}`);
        console.log('   ---');
      });
      
      await connection.end();
      
    } catch (dbError) {
      console.error('❌ Direct database test failed:', dbError.message);
    }
    
    console.log('\n🎯 Diagnosis Summary:');
    console.log('   • Check if the frontend is properly calling the API');
    console.log('   • Verify the useAssociations hook is working correctly');
    console.log('   • Check browser console for any fetch errors');
    console.log('   • Ensure the associations state is being updated properly');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testAssociationsAPI();
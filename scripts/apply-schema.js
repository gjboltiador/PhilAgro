/*
  Applies db/schema.sql to the database pointed to by DATABASE_URL.
*/

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
const mysql = require('mysql2/promise')

async function main() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set.');
    process.exit(1)
  }
  const schemaPath = path.resolve(process.cwd(), 'db', 'schema.sql')
  if (!fs.existsSync(schemaPath)) {
    console.error('Schema file not found at db/schema.sql')
    process.exit(1)
  }
  const sql = fs.readFileSync(schemaPath, 'utf8')
  const statements = sql
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  const connection = await mysql.createConnection({ uri: databaseUrl, multipleStatements: true })
  try {
    for (const stmt of statements) {
      try {
        await connection.query(stmt)
      } catch (e) {
        console.error('Failed on statement:\n', stmt)
        throw e
      }
    }
    console.log('Schema applied successfully.')
  } finally {
    await connection.end()
  }
}

main().catch((err) => {
  console.error('Failed applying schema:', err.message)
  process.exit(2)
})



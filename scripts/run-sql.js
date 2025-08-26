/*
  Runs a .sql file against the database specified by DATABASE_URL.
  Usage: node scripts/run-sql.js path/to/file.sql
*/

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
const mysql = require('mysql2/promise')

async function main() {
  const fileArg = process.argv[2]
  if (!fileArg) {
    console.error('Usage: node scripts/run-sql.js path/to/file.sql')
    process.exit(1)
  }
  const sqlPath = path.resolve(process.cwd(), fileArg)
  if (!fs.existsSync(sqlPath)) {
    console.error('SQL file not found:', sqlPath)
    process.exit(1)
  }
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set.')
    process.exit(1)
  }
  const raw = fs.readFileSync(sqlPath, 'utf8')
  const statements = raw
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  const connection = await mysql.createConnection({ uri: databaseUrl, multipleStatements: true })
  try {
    for (const stmt of statements) {
      await connection.query(stmt)
    }
    console.log('Executed SQL file successfully:', fileArg)
  } finally {
    await connection.end()
  }
}

main().catch((err) => {
  console.error('Failed executing SQL file:', err.message)
  process.exit(2)
})



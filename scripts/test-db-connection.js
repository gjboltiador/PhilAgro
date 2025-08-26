/*
  Simple MariaDB/MySQL connection test.
  Reads DATABASE_URL from .env.local and attempts a connection.
*/

const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
const mysql = require('mysql2/promise');

(async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set. Please define it in .env.local');
    process.exit(1);
  }

  let connection;
  try {
    connection = await mysql.createConnection(databaseUrl);
    const [rows] = await connection.query('SELECT 1 AS ok');
    console.log('Database connection successful. Test query result:', rows[0]);
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Database connection failed.');
    console.error('Message:', error.message);
    if (error && error.code) console.error('Code:', error.code);
    if (error && error.errno) console.error('Errno:', error.errno);
    process.exit(2);
  }
})();



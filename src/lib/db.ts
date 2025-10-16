import mysql from 'mysql2/promise';

// Create a connection pool (more efficient than single connections)
// A pool manages multiple connections to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // Maximum number of connections in the pool
  queueLimit: 0
});

export default pool;
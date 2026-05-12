/**
 * Database Configuration Module
 * 
 * PURPOSE: 
 * This module establishes and manages the MySQL database connection.
 * It uses mysql2 library which provides promise-based queries and connection pooling
 * for better performance and resource management.
 * 
 * WHY CONNECTION POOLING?
 * - Connection pooling maintains a pool of open database connections
 * - When a query is needed, it uses an available connection from the pool
 * - This is much faster than creating a new connection for each query
 * - Reduces server load and improves performance significantly
 * 
 * ERROR HANDLING:
 * - Errors are logged immediately for debugging
 * - Connection is tested on startup to ensure database is accessible
 * - If connection fails, the application will not start
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database Connection Pool Configuration
// Pool: Multiple connections managed automatically for better performance
const connectionPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,        // Maximum 10 simultaneous connections
  queueLimit: 0,              // Unlimited waiting connections in queue
  enableKeepAlive: true,      // Keep connections alive
  keepAliveInitialDelayMs: 0  // Prevent connection timeout
});

/**
 * Test Database Connection
 * 
 * This function verifies that the database connection is working properly
 * It's called on server startup to ensure the database is accessible
 * If this fails, there's no point starting the API server
 */
async function testDatabaseConnection(retries = 5, delay = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await connectionPool.getConnection();
      console.log('✓ Database connection successful');
      connection.release();
      return;
    } catch (error) {
      console.error(
        `✗ Database connection attempt ${attempt}/${retries} failed: ${error.message}`
      );
      if (attempt < retries) {
        console.log(`  ↻ Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        console.error(
          '✗ All database connection attempts exhausted. Server will keep running but DB queries will fail until MySQL is reachable.'
        );
      }
    }
  }
}

// Test connection immediately
testDatabaseConnection();

export default connectionPool;

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
async function testDatabaseConnection() {
  try {
    const connection = await connectionPool.getConnection();
    console.log('✓ Database connection successful');
    connection.release();
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1); // Exit application if database connection fails
  }
}

// Test connection immediately
testDatabaseConnection();

export default connectionPool;

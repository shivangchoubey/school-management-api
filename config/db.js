// config/db.js – Database connection with support for Railway's DATABASE_URL

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database Connection Pool Configuration
 * ---------------------------------------------------------------
 * This module reads database credentials in two ways:
 *   1. Individual DB_* environment variables (local .env file).
 *   2. A single DATABASE_URL string (Railway injects when a MySQL plugin is added).
 * If DATABASE_URL is present, its values override the individual vars.
 */

let dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
};

if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    dbConfig = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.replace(/^\//, ''), // strip leading '/'
      port: parseInt(url.port, 10) || 3306,
    };
  } catch (err) {
    console.error('✗ Failed to parse DATABASE_URL:', err.message);
    // fall back to the individual DB_* vars
  }
}

const connectionPool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  waitForConnections: true,
  connectionLimit: 10,        // max concurrent connections
  queueLimit: 0,              // unlimited waiting connections
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

/**
 * Test Database Connection – called on server start.
 */
async function testDatabaseConnection() {
  try {
    const connection = await connectionPool.getConnection();
    console.log('✓ Database connection successful');
    connection.release();
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
}

testDatabaseConnection();

export default connectionPool;

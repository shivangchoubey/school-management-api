/**
 * School Data Model
 * 
 * PURPOSE:
 * This module handles all database operations related to schools.
 * It acts as a bridge between the application logic and the database.
 * 
 * SEPARATION OF CONCERNS:
 * - Controllers: Handle HTTP requests and responses
 * - Models: Handle database operations
 * - Routes: Define API endpoints
 * This separation makes code more maintainable and testable
 * 
 * WHY THIS STRUCTURE:
 * - Database logic is centralized and reusable
 * - Easy to modify database queries without affecting other parts
 * - Each module has a single responsibility (Single Responsibility Principle)
 */

import db from '../config/db.js';

/**
 * Add a new school to the database
 * 
 * This function takes school information and inserts it into the schools table.
 * Using parameterized queries prevents SQL injection attacks.
 * 
 * WHY PARAMETERIZED QUERIES?
 * - Values are separated from SQL code
 * - Special characters in data cannot break the SQL syntax
 * - Example: If name contains ', it won't cause SQL injection
 * 
 * @param {Object} schoolData - School information
 * @param {string} schoolData.name - School name
 * @param {string} schoolData.address - School address
 * @param {number} schoolData.latitude - School latitude
 * @param {number} schoolData.longitude - School longitude
 * @returns {Promise<Object>} Result with insertId
 */
async function addSchool(schoolData) {
  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  
  const values = [
    schoolData.name,
    schoolData.address,
    schoolData.latitude,
    schoolData.longitude
  ];

  try {
    const connection = await db.getConnection();
    const [result] = await connection.execute(query, values);
    connection.release();
    
    return {
      success: true,
      schoolId: result.insertId,
      message: 'School added successfully'
    };
  } catch (error) {
    throw new Error(`Database Error: ${error.message}`);
  }
}

/**
 * Retrieve all schools from the database
 * 
 * Fetches complete information about all schools stored in the system.
 * This data will be sorted by proximity in the controller layer.
 * 
 * WHY SORTING IN APPLICATION LAYER?
 * - Distance calculation requires latitude/longitude of both user and school
 * - SQL doesn't have built-in Haversine formula
 * - We fetch data first, then calculate and sort in application layer
 * - This is a common pattern for geospatial queries without specialized databases
 * 
 * @returns {Promise<Array>} Array of all schools with their details
 */
async function getAllSchools() {
  const query = 'SELECT id, name, address, latitude, longitude FROM schools ORDER BY name ASC';

  try {
    const connection = await db.getConnection();
    const [schools] = await connection.execute(query);
    connection.release();
    
    return schools;
  } catch (error) {
    throw new Error(`Database Error: ${error.message}`);
  }
}

/**
 * Check if school exists by ID
 * 
 * Utility function to verify if a school ID exists in database
 * Useful for validation before performing operations
 * 
 * @param {number} schoolId - School ID to check
 * @returns {Promise<boolean>} True if school exists, false otherwise
 */
async function schoolExists(schoolId) {
  const query = 'SELECT id FROM schools WHERE id = ? LIMIT 1';

  try {
    const connection = await db.getConnection();
    const [result] = await connection.execute(query, [schoolId]);
    connection.release();
    
    return result.length > 0;
  } catch (error) {
    throw new Error(`Database Error: ${error.message}`);
  }
}

export {
  addSchool,
  getAllSchools,
  schoolExists
};

/**
 * School Management API - Database Schema
 * 
 * This SQL script creates the database and tables needed for the application
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open MySQL Workbench or command line
 * 2. Create a new database or use existing one
 * 3. Copy and paste this entire script
 * 4. Execute the script to create the schema
 * 5. Update .env file with database name and credentials
 * 
 * TESTING SETUP:
 * After creating the tables, you can add test data using the INSERT statements below
 */

-- ============================================================================
-- CREATE DATABASE
-- ============================================================================

-- Create the database if it doesn't exist
-- This prevents errors if database already exists
CREATE DATABASE IF NOT EXISTS school_management;

-- Use the newly created database for all subsequent commands
USE school_management;

-- ============================================================================
-- CREATE SCHOOLS TABLE
-- ============================================================================

/**
 * SCHOOLS TABLE
 * 
 * Stores information about all schools in the system
 * 
 * COLUMNS EXPLANATION:
 * - id: Unique identifier (PRIMARY KEY)
 *   - AUTO_INCREMENT: Automatically assigns unique number to each row
 *   - UNIQUE and NOT NULL: Ensures no duplicates
 * 
 * - name: School name
 *   - VARCHAR(100): String up to 100 characters
 *   - NOT NULL: This field is mandatory
 * 
 * - address: Complete address of school
 *   - VARCHAR(200): String up to 200 characters
 *   - NOT NULL: This field is mandatory
 * 
 * - latitude: Geographic latitude coordinate
 *   - FLOAT: Decimal number for precise location
 *   - NOT NULL: This field is mandatory
 *   - CHECK: Ensures value is between -90 and 90
 * 
 * - longitude: Geographic longitude coordinate
 *   - FLOAT: Decimal number for precise location
 *   - NOT NULL: This field is mandatory
 *   - CHECK: Ensures value is between -180 and 180
 * 
 * - created_at: Timestamp when record was created
 *   - TIMESTAMP: Automatically records date and time
 *   - DEFAULT CURRENT_TIMESTAMP: Automatically sets to current time
 * 
 * - updated_at: Timestamp when record was last modified
 *   - TIMESTAMP: Automatically records date and time
 *   - ON UPDATE CURRENT_TIMESTAMP: Automatically updates to current time
 * 
 * WHY CONSTRAINTS?
 * - NOT NULL: Ensures critical data is always present
 * - CHECK: Validates geographic coordinates at database level
 * - This prevents invalid data from entering the system
 */

CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(200) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Constraints to ensure data validity
  CHECK (latitude >= -90 AND latitude <= 90),
  CHECK (longitude >= -180 AND longitude <= 180)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- CREATE INDEX FOR BETTER QUERY PERFORMANCE
-- ============================================================================

/**
 * INDEX ON NAME
 * 
 * Indexes speed up database queries by creating a sorted lookup structure
 * This index helps when:
 * - Searching schools by name
 * - Sorting schools by name
 * 
 * WHY INDEX?
 * - Without index: Database scans all rows (slow)
 * - With index: Database uses binary search (fast)
 * - Trade-off: Slightly slower inserts, much faster selects
 * - Good for frequently searched columns
 */

CREATE INDEX idx_school_name ON schools(name);

-- ============================================================================
-- SAMPLE DATA FOR TESTING
-- ============================================================================

/**
 * TEST DATA
 * 
 * These are sample schools to test the API
 * Includes various locations for testing distance calculation
 * 
 * COORDINATES EXPLANATION:
 * - New York, USA: latitude 40.7128, longitude -74.0060
 * - London, UK: latitude 51.5074, longitude -0.1278
 * - Tokyo, Japan: latitude 35.6762, longitude 139.6503
 * - Sydney, Australia: latitude -33.8688, longitude 151.2093
 * - Mumbai, India: latitude 19.0760, longitude 72.8777
 * 
 * TO INSERT TEST DATA:
 * Uncomment the INSERT statements below and run them
 */

INSERT INTO schools (name, address, latitude, longitude) VALUES 
('Saint Xavier School', '456 Broadway, New York, NY 10013, USA', 40.7180, -74.0020),
('The British School', '3 Grange Road, London, UK', 51.5100, -0.1400),
('Tokyo Metropolitan School', '1-1-1 Chiyoda, Tokyo, Japan', 35.6800, 139.6600),
('Pymble Ladies College', '33 Mona Road, Pymble NSW 2073, Australia', -33.8600, 151.2000),
('Cathedral School Mumbai', 'Bombay Samachar Marg, Fort, Mumbai, India', 19.0800, 72.8900);

-- ============================================================================
-- DISPLAY TABLE STRUCTURE AND DATA
-- ============================================================================

-- Show all schools in the table
-- Verify data was inserted correctly
SELECT * FROM schools;

-- Show table structure
DESCRIBE schools;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

/**
 * These queries help verify the setup is working correctly
 * You can run these to test the database
 */

-- Count total schools
-- SELECT COUNT(*) as total_schools FROM schools;

-- Get school by specific coordinates (New York)
-- SELECT * FROM schools WHERE latitude = 40.7180 AND longitude = -74.0020;

-- Get schools in ascending order by name
-- SELECT * FROM schools ORDER BY name ASC;

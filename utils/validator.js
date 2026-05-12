/**
 * Input Validation Utility Module
 * 
 * PURPOSE:
 * This module provides centralized validation functions for all API inputs.
 * Validation is critical to prevent:
 * - SQL Injection attacks (sanitize inputs)
 * - Invalid data being stored in database
 * - Type mismatches and data corruption
 * - Poor user experience due to incomplete data
 * 
 * WHY VALIDATION IS ESSENTIAL:
 * - Validates data format, type, and range BEFORE database operation
 * - Prevents bad data from entering the system
 * - Returns clear error messages to help clients fix their requests
 * - Reduces database errors and improves application stability
 */

/**
 * Validate School Data
 * 
 * Checks all required fields for adding a school:
 * - name: Must be non-empty string (2-100 characters)
 * - address: Must be non-empty string (5-200 characters)
 * - latitude: Must be valid number between -90 and 90 degrees
 * - longitude: Must be valid number between -180 and 180 degrees
 * 
 * @param {Object} data - School data to validate
 * @returns {Object} { isValid: boolean, errors: Array of error messages }
 */
function validateSchoolData(data) {
  const errors = [];

  // Check if name exists and is valid
  if (!data.name || typeof data.name !== 'string') {
    errors.push('School name is required and must be a string');
  } else if (data.name.trim().length < 2) {
    errors.push('School name must be at least 2 characters long');
  } else if (data.name.length > 100) {
    errors.push('School name must not exceed 100 characters');
  }

  // Check if address exists and is valid
  if (!data.address || typeof data.address !== 'string') {
    errors.push('School address is required and must be a string');
  } else if (data.address.trim().length < 5) {
    errors.push('School address must be at least 5 characters long');
  } else if (data.address.length > 200) {
    errors.push('School address must not exceed 200 characters');
  }

  // Check if latitude is valid geographic coordinate
  // Latitude ranges from -90 (South Pole) to +90 (North Pole)
  if (data.latitude === undefined || data.latitude === null) {
    errors.push('Latitude is required');
  } else if (isNaN(data.latitude)) {
    errors.push('Latitude must be a valid number');
  } else if (data.latitude < -90 || data.latitude > 90) {
    errors.push('Latitude must be between -90 and 90');
  }

  // Check if longitude is valid geographic coordinate
  // Longitude ranges from -180 (West) to +180 (East)
  if (data.longitude === undefined || data.longitude === null) {
    errors.push('Longitude is required');
  } else if (isNaN(data.longitude)) {
    errors.push('Longitude must be a valid number');
  } else if (data.longitude < -180 || data.longitude > 180) {
    errors.push('Longitude must be between -180 and 180');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validate User Location Parameters
 * 
 * Validates the user's latitude and longitude for list schools endpoint
 * Used to calculate distance between user and schools
 * 
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @returns {Object} { isValid: boolean, errors: Array of error messages }
 */
function validateUserLocation(latitude, longitude) {
  const errors = [];

  // Validate latitude
  if (latitude === undefined || latitude === null) {
    errors.push('User latitude is required');
  } else if (isNaN(latitude)) {
    errors.push('User latitude must be a valid number');
  } else if (latitude < -90 || latitude > 90) {
    errors.push('User latitude must be between -90 and 90');
  }

  // Validate longitude
  if (longitude === undefined || longitude === null) {
    errors.push('User longitude is required');
  } else if (isNaN(longitude)) {
    errors.push('User longitude must be a valid number');
  } else if (longitude < -180 || longitude > 180) {
    errors.push('User longitude must be between -180 and 180');
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

export {
  validateSchoolData,
  validateUserLocation
};

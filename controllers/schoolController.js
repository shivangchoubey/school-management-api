/**
 * School Controller
 * 
 * PURPOSE:
 * Controllers handle the business logic of the application.
 * They receive requests from routes, process data using models,
 * and send appropriate responses.
 * 
 * CONTROLLER RESPONSIBILITIES:
 * 1. Validate incoming request data using utility validators
 * 2. Call model functions to perform database operations
 * 3. Process the returned data (e.g., calculate distances, sort results)
 * 4. Send appropriate HTTP responses with correct status codes
 * 5. Handle and return errors in a user-friendly format
 * 
 * WHY THIS SEPARATION?
 * - Business logic is separate from routing logic
 * - Reusable functions that can be called from different routes
 * - Easy to test and maintain
 * - Clear flow: Route → Controller → Model → Database
 */

import * as schoolModel from '../models/schoolModel.js';
import { validateSchoolData, validateUserLocation } from '../utils/validator.js';
import { calculateDistance } from '../utils/distanceCalculator.js';

/**
 * Add School Controller
 * 
 * Handles POST request to add a new school
 * 
 * FLOW:
 * 1. Extract data from request body
 * 2. Validate the data using validator
 * 3. If invalid, return 400 Bad Request with error details
 * 4. If valid, call model to insert into database
 * 5. Return 201 Created with school ID
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function addSchool(req, res) {
  try {
    // Extract data from request body
    const { name, address, latitude, longitude } = req.body;

    // Validate input data
    // Returns { isValid: boolean, errors: Array }
    const validation = validateSchoolData({
      name,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    // If validation fails, return 400 Bad Request with error details
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Validation passed, attempt to add school to database
    const result = await schoolModel.addSchool({
      name: name.trim(),
      address: address.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    // Return 201 Created status with school ID
    res.status(201).json({
      success: true,
      message: result.message,
      schoolId: result.schoolId
    });
  } catch (error) {
    console.error('Add School Error:', error.message);
    
    // Return 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: 'Failed to add school',
      error: error.message
    });
  }
}

/**
 * List Schools by Proximity Controller
 * 
 * Handles GET request to retrieve schools sorted by distance from user location
 * 
 * FLOW:
 * 1. Extract user's latitude and longitude from query parameters
 * 2. Validate user coordinates
 * 3. If invalid, return 400 Bad Request
 * 4. Fetch all schools from database
 * 5. Calculate distance from user to each school
 * 6. Sort schools by distance (nearest first)
 * 7. Return sorted list with distance information
 * 
 * WHY SORT IN APPLICATION LAYER?
 * - Distance calculation using Haversine formula is complex
 * - Most databases don't have built-in geospatial functions
 * - Better performance to calculate in-memory for small datasets
 * - Easier to maintain and modify
 * 
 * @param {Object} req - Express request object with query parameters
 * @param {Object} res - Express response object
 */
async function listSchools(req, res) {
  try {
    // Extract user location from query parameters
    const userLatitude = req.query.latitude;
    const userLongitude = req.query.longitude;

    // Validate user location coordinates
    const validation = validateUserLocation(
      parseFloat(userLatitude),
      parseFloat(userLongitude)
    );

    // If validation fails, return 400 Bad Request
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user location',
        errors: validation.errors
      });
    }

    // Fetch all schools from database
    const schools = await schoolModel.getAllSchools();

    // If no schools exist, return empty list
    if (!schools || schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schools found',
        schools: []
      });
    }

    // Calculate distance from user to each school
    // and add distance information to each school object
    const schoolsWithDistance = schools.map(school => ({
      id: school.id,
      name: school.name,
      address: school.address,
      latitude: school.latitude,
      longitude: school.longitude,
      // Distance calculated using Haversine formula
      distance: calculateDistance(
        parseFloat(userLatitude),
        parseFloat(userLongitude),
        school.latitude,
        school.longitude
      )
    }));

    // Sort schools by distance (nearest first)
    // Why sort ascending? User wants nearest schools first (closest = highest priority)
    const sortedSchools = schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    // Return success response with sorted schools
    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      userLocation: {
        latitude: parseFloat(userLatitude),
        longitude: parseFloat(userLongitude)
      },
      totalSchools: sortedSchools.length,
      schools: sortedSchools
    });
  } catch (error) {
    console.error('List Schools Error:', error.message);
    
    // Return 500 Internal Server Error
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve schools',
      error: error.message
    });
  }
}

export {
  addSchool,
  listSchools
};

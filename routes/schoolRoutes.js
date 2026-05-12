/**
 * School Routes Definition
 * 
 * PURPOSE:
 * Routes define the API endpoints and map them to controller functions.
 * This keeps API structure organized and maintainable.
 * 
 * ROUTE ORGANIZATION:
 * - POST /addSchool - Add a new school
 * - GET /listSchools - Get schools sorted by proximity
 * 
 * BEST PRACTICES USED:
 * - RESTful naming conventions
 * - Appropriate HTTP methods (POST for create, GET for retrieve)
 * - Clear endpoint naming
 * - Centralized route definitions
 */

import express from 'express';
import * as schoolController from '../controllers/schoolController.js';

const router = express.Router();

/**
 * POST /addSchool
 * 
 * Endpoint to add a new school to the database
 * 
 * REQUEST BODY:
 * {
 *   "name": "St. Xavier School",
 *   "address": "123 Main Street, City, Country",
 *   "latitude": 40.7128,
 *   "longitude": -74.0060
 * }
 * 
 * RESPONSE (201 Created):
 * {
 *   "success": true,
 *   "message": "School added successfully",
 *   "schoolId": 1
 * }
 */
router.post('/addSchool', schoolController.addSchool);

/**
 * GET /listSchools
 * 
 * Endpoint to retrieve all schools sorted by proximity to user location
 * 
 * QUERY PARAMETERS:
 * - latitude: User's latitude (required, decimal degrees)
 * - longitude: User's longitude (required, decimal degrees)
 * 
 * EXAMPLE: GET /listSchools?latitude=40.7128&longitude=-74.0060
 * 
 * RESPONSE (200 OK):
 * {
 *   "success": true,
 *   "message": "Schools retrieved successfully",
 *   "userLocation": {
 *     "latitude": 40.7128,
 *     "longitude": -74.0060
 *   },
 *   "totalSchools": 5,
 *   "schools": [
 *     {
 *       "id": 1,
 *       "name": "St. Xavier School",
 *       "address": "123 Main Street, City, Country",
 *       "latitude": 40.7128,
 *       "longitude": -74.0060,
 *       "distance": 0.0
 *     },
 *     {
 *       "id": 2,
 *       "name": "Delhi Public School",
 *       "address": "456 Oak Avenue, City, Country",
 *       "latitude": 40.7256,
 *       "longitude": -74.0144,
 *       "distance": 14.25
 *     }
 *   ]
 * }
 */
router.get('/listSchools', schoolController.listSchools);

export default router;

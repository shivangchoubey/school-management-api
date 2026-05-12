/**
 * Geolocation Distance Calculator
 * 
 * PURPOSE:
 * This module calculates the geographic distance between two coordinate points
 * using the Haversine formula. This is used to sort schools by proximity to user location.
 * 
 * HAVERSINE FORMULA EXPLANATION:
 * The Haversine formula calculates the shortest distance between two points 
 * on a sphere (Earth) given their latitude and longitude.
 * 
 * WHY THIS MATTERS:
 * - Straight line distance calculation would be inaccurate for real-world distances
 * - Haversine accounts for Earth's curvature
 * - Returns distance in kilometers which is practical and understandable
 * 
 * COMMON USES:
 * - Find nearest schools/hospitals/restaurants to user location
 * - Sort results by proximity
 * - Map applications, ride-sharing, etc.
 */

/**
 * Haversine Distance Formula
 * 
 * Calculates the great-circle distance between two points on Earth
 * 
 * FORMULA BREAKDOWN:
 * 1. Convert latitude and longitude from degrees to radians
 * 2. Calculate differences in latitude and longitude
 * 3. Apply Haversine formula using sine and cosine
 * 4. Result is distance in kilometers
 * 
 * @param {number} userLat - User's latitude in decimal degrees
 * @param {number} userLon - User's longitude in decimal degrees
 * @param {number} schoolLat - School's latitude in decimal degrees
 * @param {number} schoolLon - School's longitude in decimal degrees
 * @returns {number} Distance in kilometers
 */
function calculateDistance(userLat, userLon, schoolLat, schoolLon) {
  // Earth's radius in kilometers
  const earthRadiusKm = 6371;

  // Convert degrees to radians (multiply by π/180)
  const dLat = toRadian(schoolLat - userLat);
  const dLon = toRadian(schoolLon - userLon);
  const lat1 = toRadian(userLat);
  const lat2 = toRadian(schoolLat);

  // Haversine Formula
  // This calculates the chord length between two points on a sphere
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * 
    Math.cos(lat1) * Math.cos(lat2);

  // Calculate angular distance (in radians)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate distance by multiplying angular distance with Earth's radius
  const distance = earthRadiusKm * c;

  return parseFloat(distance.toFixed(2)); // Return distance rounded to 2 decimal places
}

/**
 * Convert Degrees to Radians
 * 
 * Trigonometric functions (sin, cos, atan2) work with radians, not degrees
 * So we need to convert latitude/longitude from decimal degrees to radians
 * Formula: radians = degrees * (π / 180)
 * 
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadian(degrees) {
  return (degrees * Math.PI) / 180;
}

export {
  calculateDistance
};

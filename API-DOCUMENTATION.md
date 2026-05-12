# API DOCUMENTATION
## School Management System - Complete Reference

**Version:** 1.0.0  
**Last Updated:** May 11, 2024  
**Base URL:** `http://localhost:3000` (development) or `https://yourdomain.com` (production)

---

## Table of Contents
1. [Authentication](#authentication)
2. [Response Format](#response-format)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Status Codes](#http-status-codes)
7. [Rate Limiting](#rate-limiting)
8. [Versioning](#versioning)

---

## Authentication

### Current Implementation
**Authentication Type:** None (Public API)

The current implementation does not require authentication. All endpoints are publicly accessible.

### For Future Enhancement
To add JWT token authentication:

```javascript
// Example middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
```

---

## Response Format

### Success Response Format

All successful API responses follow this standard structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response-specific data
  },
  "timestamp": "2024-05-11T10:30:00.000Z"
}
```

### Example Success Response

```json
{
  "success": true,
  "message": "School added successfully",
  "schoolId": 1,
  "timestamp": "2024-05-11T10:30:00.000Z"
}
```

### Error Response Format

All error responses follow this standard structure:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Specific error 1",
    "Specific error 2"
  ],
  "timestamp": "2024-05-11T10:30:00.000Z"
}
```

---

## Error Handling

### Error Types & Handling

| Error Type | HTTP Code | Cause | Solution |
|-----------|-----------|-------|----------|
| Validation Error | 400 | Invalid input data | Check field formats and ranges |
| Not Found | 404 | Resource doesn't exist | Verify resource ID |
| Server Error | 500 | Internal server error | Check server logs |
| Database Error | 500 | Database operation failed | Verify database connection |

### Error Response Examples

**Validation Error (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "School name must be at least 2 characters long",
    "Latitude must be between -90 and 90"
  ]
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Failed to add school",
  "error": "Database connection failed"
}
```

---

## API Endpoints

### 1. Health Check

**Description:** Verify API server is running

```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-05-11T10:30:00.000Z"
}
```

**Use Cases:**
- Monitoring and uptime checks
- Load balancer health verification
- CI/CD pipeline validation

---

### 2. Add School

**Description:** Add a new school to the database

```http
POST /api/addSchool
Content-Type: application/json
```

**Request Body:**

| Field | Type | Required | Validation | Example |
|-------|------|----------|-----------|---------|
| name | string | Yes | 2-100 chars | "Delhi Public School" |
| address | string | Yes | 5-200 chars | "123 Education Lane, New Delhi, India" |
| latitude | number | Yes | -90 to 90 | 28.5355 |
| longitude | number | Yes | -180 to 180 | 77.2030 |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Delhi Public School",
    "address": "123 Education Lane, New Delhi, India",
    "latitude": 28.5355,
    "longitude": 77.2030
  }'
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "School added successfully",
  "schoolId": 1
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "School name is required and must be a string",
    "Latitude must be between -90 and 90"
  ]
}
```

**Server Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Failed to add school",
  "error": "Database Error: Connection refused"
}
```

**Response Codes:**
- `201`: School created successfully
- `400`: Validation failed
- `500`: Server error

---

### 3. List Schools by Proximity

**Description:** Retrieve all schools sorted by distance from user location

```http
GET /api/listSchools?latitude={lat}&longitude={lon}
```

**Query Parameters:**

| Parameter | Type | Required | Validation | Example |
|-----------|------|----------|-----------|---------|
| latitude | number | Yes | -90 to 90 | 40.7128 |
| longitude | number | Yes | -180 to 180 | -74.0060 |

**Example Request:**
```bash
curl "http://localhost:3000/api/listSchools?latitude=40.7128&longitude=-74.0060"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "userLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "totalSchools": 2,
  "schools": [
    {
      "id": 1,
      "name": "Saint Xavier School",
      "address": "456 Broadway, New York, NY 10013, USA",
      "latitude": 40.7180,
      "longitude": -74.0020,
      "distance": 0.78
    },
    {
      "id": 2,
      "name": "Cathedral School Mumbai",
      "address": "Bombay Samachar Marg, Fort, Mumbai, India",
      "latitude": 19.0800,
      "longitude": 72.8900,
      "distance": 9225.45
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid user location",
  "errors": [
    "User latitude must be between -90 and 90",
    "User longitude must be between -180 and 180"
  ]
}
```

**Distance Calculation:**
- Uses Haversine formula
- Distance in kilometers
- Accurate to great-circle distance
- Sorted in ascending order (nearest first)

**Response Codes:**
- `200`: Schools retrieved successfully
- `400`: Invalid parameters
- `500`: Server error

---

## Data Models

### School Object

```json
{
  "id": 1,
  "name": "Delhi Public School",
  "address": "123 Education Lane, New Delhi, India",
  "latitude": 28.5355,
  "longitude": 77.2030,
  "created_at": "2024-05-11T10:30:00.000Z",
  "updated_at": "2024-05-11T10:30:00.000Z"
}
```

### School with Distance

```json
{
  "id": 1,
  "name": "Delhi Public School",
  "address": "123 Education Lane, New Delhi, India",
  "latitude": 28.5355,
  "longitude": 77.2030,
  "distance": 0.5
}
```

### User Location Object

```json
{
  "latitude": 28.5355,
  "longitude": 77.2030
}
```

---

## HTTP Status Codes

| Code | Status | Meaning | When Used |
|------|--------|---------|-----------|
| 200 | OK | Successful GET request | List schools successful |
| 201 | Created | Resource created successfully | School added successfully |
| 400 | Bad Request | Invalid request data | Validation failed |
| 404 | Not Found | Resource doesn't exist | Endpoint not found |
| 500 | Internal Server Error | Server error | Database error, unexpected errors |

---

## Rate Limiting

### Current Implementation
Rate limiting is not implemented in the current version.

### For Production

**Recommendation:** Implement express-rate-limit

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);
```

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1620719405
```

---

## Versioning

### Current Version
- **API Version:** 1.0.0
- **Endpoint Prefix:** `/api/`

### Versioning Strategy

For future versions, use URL versioning:

```
GET /api/v1/listSchools     // Version 1
GET /api/v2/listSchools     // Version 2 (future)
```

**Benefits:**
- Backward compatibility
- Gradual migration
- Support multiple versions simultaneously

---

## Common Use Cases

### Use Case 1: Add Multiple Schools

```javascript
const schools = [
  {
    "name": "School 1",
    "address": "Address 1",
    "latitude": 28.5355,
    "longitude": 77.2030
  },
  {
    "name": "School 2",
    "address": "Address 2",
    "latitude": 28.6355,
    "longitude": 77.3030
  }
];

schools.forEach(school => {
  fetch('http://localhost:3000/api/addSchool', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(school)
  })
  .then(res => res.json())
  .then(data => console.log(data));
});
```

### Use Case 2: Find Nearest 5 Schools

```javascript
fetch('http://localhost:3000/api/listSchools?latitude=40.7128&longitude=-74.0060')
  .then(res => res.json())
  .then(data => {
    const nearest5 = data.schools.slice(0, 5);
    console.log('5 Nearest Schools:', nearest5);
  });
```

### Use Case 3: Filter Schools Within 10 KM

```javascript
fetch('http://localhost:3000/api/listSchools?latitude=40.7128&longitude=-74.0060')
  .then(res => res.json())
  .then(data => {
    const within10km = data.schools.filter(s => s.distance <= 10);
    console.log('Schools within 10 KM:', within10km);
  });
```

---

## Best Practices for API Usage

### 1. Always Validate Coordinates

```javascript
const isValidCoordinate = (latitude, longitude) => {
  return latitude >= -90 && latitude <= 90 && 
         longitude >= -180 && longitude <= 180;
};
```

### 2. Handle Errors Gracefully

```javascript
try {
  const response = await fetch(`/api/addSchool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schoolData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error.errors);
    return;
  }
  
  const result = await response.json();
  console.log('Success:', result);
} catch (error) {
  console.error('Network Error:', error);
}
```

### 3. Cache Results

```javascript
let cachedSchools = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getSchoolsWithCache(lat, lon) {
  const now = Date.now();
  
  if (cachedSchools && (now - cacheTime) < CACHE_DURATION) {
    return cachedSchools;
  }
  
  const response = await fetch(
    `/api/listSchools?latitude=${lat}&longitude=${lon}`
  );
  cachedSchools = await response.json();
  cacheTime = now;
  
  return cachedSchools;
}
```

### 4. Use Pagination (if implemented in future)

```javascript
// Example for future pagination support
fetch('/api/listSchools?latitude=40.7128&longitude=-74.0060&page=1&limit=10')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Troubleshooting Guide

### Issue: Getting "Connection refused" error

**Possible Causes:**
- Server not running
- Wrong host/port
- Firewall blocking connection

**Solutions:**
1. Verify server is running: `npm start`
2. Check base URL is correct
3. Check firewall settings

### Issue: Getting "Validation failed" error

**Possible Causes:**
- Missing required fields
- Invalid data types
- Out-of-range values

**Solutions:**
1. Check all required fields are present
2. Verify data types match
3. Validate coordinates are in valid range

### Issue: Getting "Database Error" response

**Possible Causes:**
- Database not running
- Wrong credentials
- Database doesn't exist

**Solutions:**
1. Verify MySQL is running
2. Check .env credentials
3. Verify database exists
4. Check database schema is loaded

---

## Contact & Support

For API issues or questions:
- Check README.md for setup instructions
- Review DEPLOYMENT-GUIDE.md for deployment help
- Check Postman collection for request examples
- Review error messages in API responses

---

**End of API Documentation**

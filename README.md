# School Management API

## 📋 Project Overview

A professional Node.js API for managing school data with geolocation-based proximity sorting. Built using Express.js framework and MySQL database.

**Version:** 1.0.0  
**Environment:** Node.js, Express.js, MySQL  
**Author:** Your Name

---

## ✨ Key Features

- ✅ **Add School API** - Register new schools with location coordinates
- ✅ **List Schools API** - Retrieve schools sorted by proximity to user location
- ✅ **Distance Calculation** - Uses Haversine formula for accurate geographic distance
- ✅ **Input Validation** - Comprehensive validation for all inputs
- ✅ **Error Handling** - Professional error responses with clear messages
- ✅ **Security** - Helmet middleware for security headers, CORS enabled
- ✅ **Scalable Architecture** - Modular structure with separation of concerns

---

## 📁 Project Structure

```
school-management-api/
├── config/
│   └── db.js                 # Database connection configuration
├── controllers/
│   └── schoolController.js   # Business logic for school operations
├── models/
│   └── schoolModel.js        # Database operations
├── routes/
│   └── schoolRoutes.js       # API endpoint definitions
├── utils/
│   ├── validator.js          # Input validation functions
│   └── distanceCalculator.js # Haversine distance calculation
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
├── package.json              # Project dependencies
├── .env.example              # Environment variables template
├── database-schema.sql       # MySQL database schema
├── Postman-Collection.json   # API testing collection
└── README.md                 # This file
```

### 🏗️ Architecture Explanation

**Why This Structure?**

1. **config/db.js** - Centralizes database connection logic
   - Connection pooling for better performance
   - Reusable across entire application

2. **models/schoolModel.js** - Handles all database operations
   - Parameterized queries to prevent SQL injection
   - Separation from business logic

3. **controllers/schoolController.js** - Contains business logic
   - Validates inputs
   - Calls model functions
   - Formats responses

4. **routes/schoolRoutes.js** - Maps HTTP requests to controller functions
   - Clean endpoint definitions
   - Easy to maintain and extend

5. **utils/** - Reusable utility functions
   - Validator functions for consistent validation
   - Distance calculator using Haversine formula

**Benefits:**
- Separation of concerns (each module has single responsibility)
- Easy to test (can test each layer independently)
- Scalable (easy to add new endpoints)
- Maintainable (clear structure and organization)

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL (v5.7 or higher)

### Step 1: Install Dependencies

```bash
cd school-management-api
npm install
```

### Step 2: Database Setup

1. Create MySQL database:
   ```bash
   mysql -u root -p < database-schema.sql
   ```

2. Or manually in MySQL:
   ```sql
   CREATE DATABASE school_management;
   USE school_management;
   -- Copy and paste contents of database-schema.sql
   ```

### Step 3: Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=school_management
   DB_PORT=3306
   PORT=3000
   NODE_ENV=development
   CORS_ORIGIN=*
   ```

### Step 4: Start the Server

```bash
# Production
npm start

# Development with auto-reload
npm run dev
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════════╗
║        School Management API - Server Started               ║
╚════════════════════════════════════════════════════════════╝

✓ Environment: development
✓ Server running on port: 3000
✓ Base URL: http://localhost:3000

📍 Available Endpoints:
   • Health Check: GET http://localhost:3000/health
   • Add School: POST http://localhost:3000/api/addSchool
   • List Schools: GET http://localhost:3000/api/listSchools?latitude=X&longitude=Y
```

---

## 📡 API Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

**Purpose:** Verify server is running

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-05-11T10:30:00.000Z"
}
```

---

### 2. Add School

**Endpoint:** `POST /api/addSchool`

**Request Body:**
```json
{
  "name": "Delhi Public School",
  "address": "123 Education Lane, New Delhi, India",
  "latitude": 28.5355,
  "longitude": 77.2030
}
```

**Field Validation:**
- `name`: String (2-100 characters)
- `address`: String (5-200 characters)
- `latitude`: Number between -90 and 90
- `longitude`: Number between -180 and 180

**Response (201 Created):**
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
    "School name must be at least 2 characters long",
    "Latitude must be between -90 and 90"
  ]
}
```

---

### 3. List Schools by Proximity

**Endpoint:** `GET /api/listSchools?latitude=X&longitude=Y`

**Query Parameters:**
- `latitude` (required): User's latitude (-90 to 90)
- `longitude` (required): User's longitude (-180 to 180)

**Example:**
```
GET /api/listSchools?latitude=40.7128&longitude=-74.0060
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "userLocation": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "totalSchools": 3,
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

**Distance Calculation:**
- Uses Haversine formula for great-circle distance
- Distance is in kilometers
- Schools sorted by distance (nearest first)

---

## 🧮 Distance Calculation (Haversine Formula)

### Why Haversine?

The Haversine formula calculates the shortest distance between two points on a sphere (Earth).

**Formula:**
```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1−a))
distance = R × c
```

Where:
- `lat` = latitude in radians
- `lon` = longitude in radians
- `R` = Earth's radius (6,371 km)
- `Δlat` = difference in latitude
- `Δlon` = difference in longitude

### Example Calculation

User at New York (40.7128°N, 74.0060°W)
School at Mumbai (19.0760°N, 72.8777°E)

Distance ≈ 12,200 km (calculated using Haversine)

---

## 🧪 Testing with Postman

### Import Collection

1. Open Postman
2. Click "Import" → "Choose Files"
3. Select `Postman-Collection.json`
4. Collection is now available

### Set Base URL Variable

1. In Postman, click "Environments" (top right)
2. Edit environment or create new one
3. Set variable: `base_url = http://localhost:3000`

### Test Scenarios Included

- ✅ Health check
- ✅ Add school (valid data)
- ✅ List schools (multiple locations)
- ✅ Error: Missing parameters
- ✅ Error: Out-of-range coordinates
- ✅ Error: Incomplete school data

---

## 📊 Database Schema

### Schools Table

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(200) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (latitude >= -90 AND latitude <= 90),
  CHECK (longitude >= -180 AND longitude <= 180)
);
```

**Field Explanations:**
- `id`: Unique school identifier
- `name`: School name
- `address`: Complete school address
- `latitude`: Geographic latitude coordinate
- `longitude`: Geographic longitude coordinate
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp
- Constraints ensure data validity at database level

---

## 🔒 Security Features

### 1. Helmet Middleware
- Adds security headers
- Prevents XSS attacks
- Disables MIME sniffing
- Prevents clickjacking

### 2. CORS Configuration
- Controlled cross-origin access
- Configurable via environment variables
- Set `CORS_ORIGIN=*` in development, specific domains in production

### 3. Input Validation
- All inputs validated before database operations
- Prevents SQL injection
- Type checking for all fields
- Range validation for coordinates

### 4. Parameterized Queries
- Uses placeholders (?) instead of string concatenation
- Prevents SQL injection attacks
- Database handles special characters safely

---

## 🚢 Deployment Guide

### Option 1: Deploy to Heroku

1. Create Heroku account (heroku.com)
2. Install Heroku CLI
3. Create app:
   ```bash
   heroku create your-app-name
   ```
4. Set environment variables:
   ```bash
   heroku config:set DB_HOST=your_host
   heroku config:set DB_USER=your_user
   heroku config:set DB_PASSWORD=your_password
   heroku config:set DB_NAME=your_db
   heroku config:set NODE_ENV=production
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

### Option 2: Deploy to AWS

1. Create EC2 instance (Ubuntu recommended)
2. Install Node.js, npm, MySQL
3. Clone repository:
   ```bash
   git clone your_repo_url
   cd school-management-api
   npm install
   ```
4. Setup environment variables
5. Start with PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

### Option 3: Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Build and Run:**
```bash
docker build -t school-api .
docker run -p 3000:3000 -e DB_HOST=host.docker.internal school-api
```

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed

**Solution:**
1. Verify MySQL is running
2. Check credentials in `.env` file
3. Ensure database `school_management` exists
4. Test connection:
   ```bash
   mysql -h localhost -u root -p school_management
   ```

### Issue: Port Already in Use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change PORT in .env
PORT=3001
```

### Issue: CORS Error

**Solution:**
1. Check `.env` CORS_ORIGIN setting
2. For development: `CORS_ORIGIN=*`
3. For production: Set specific domain

---

## 📝 API Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET request successful |
| 201 | Created | School added successfully |
| 400 | Bad Request | Validation failed |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Server Error | Database connection failed |

---

## 📚 Useful Geographic Coordinates

For testing purposes:

| City | Latitude | Longitude |
|------|----------|-----------|
| New York | 40.7128 | -74.0060 |
| London | 51.5074 | -0.1278 |
| Tokyo | 35.6762 | 139.6503 |
| Sydney | -33.8688 | 151.2093 |
| Mumbai | 19.0760 | 72.8777 |
| Singapore | 1.3521 | 103.8198 |
| Dubai | 25.2048 | 55.2708 |

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a new branch for features
2. Write clear commit messages
3. Test thoroughly before submitting PR
4. Update documentation

---

## 📄 License

ISC License - Feel free to use in commercial projects

---

## 📞 Support

For issues or questions:
- Check troubleshooting section
- Review error messages in API responses
- Check database logs
- Verify environment configuration

---

**Last Updated:** May 11, 2024  
**Maintained by:** Your Development Team

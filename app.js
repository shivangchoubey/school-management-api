/**
 * Express Application Configuration
 * 
 * PURPOSE:
 * This module sets up and configures the Express application.
 * It includes all middleware, routes, and error handling.
 * 
 * MIDDLEWARE STACK EXPLANATION:
 * 1. Helmet: Adds security headers
 * 2. CORS: Allows cross-origin requests
 * 3. Body-Parser: Parses JSON request bodies
 * 4. Routes: API endpoint definitions
 * 5. Error Handler: Catches and handles errors
 * 
 * MIDDLEWARE ORDER MATTERS:
 * - Security middleware first (Helmet, CORS)
 * - Parsing middleware (Body-Parser)
 * - Routes
 * - Error handling last
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import schoolRoutes from './routes/schoolRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

/**
 * MIDDLEWARE CONFIGURATION
 * 
 * These middleware process every request before it reaches route handlers
 * They can modify request/response objects and perform filtering
 */

// Helmet middleware: Adds various security headers to prevent attacks
// Examples: Prevents clickjacking, ensures HTTPS, disables MIME sniffing
app.use(helmet());

// CORS middleware: Enables Cross-Origin Resource Sharing
// Allows API to be called from different domains (frontend, Postman, etc.)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body-Parser middleware: Parses incoming JSON request bodies
// Converts JSON string to JavaScript object (req.body)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

/**
 * HEALTH CHECK ENDPOINT
 * 
 * Simple endpoint to verify if the API is running and responsive
 * Useful for monitoring and load balancers
 * No business logic, just confirms the server is alive
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * ROUTES REGISTRATION
 * 
 * Import and register all API routes
 * All school-related endpoints are defined in schoolRoutes
 */
app.use('/api', schoolRoutes); // Mount routes at /api prefix

/**
 * ROOT ENDPOINT
 * 
 * Welcome message for API root
 * Provides information about available endpoints
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to School Management API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      addSchool: 'POST /api/addSchool',
      listSchools: 'GET /api/listSchools?latitude=X&longitude=Y'
    },
    documentation: 'See README.md and Postman collection for detailed documentation'
  });
});

/**
 * 404 NOT FOUND HANDLER
 * 
 * Handles requests to undefined endpoints
 * Returns 404 status code with helpful error message
 * This should be the last route defined
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: {
      health: 'GET /health',
      addSchool: 'POST /api/addSchool',
      listSchools: 'GET /api/listSchools'
    }
  });
});

/**
 * GLOBAL ERROR HANDLER
 * 
 * Catches any unhandled errors from routes and middleware
 * Returns consistent error response format
 * This middleware receives 4 parameters (err, req, res, next)
 * Express recognizes this pattern and treats it as error handler
 */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  // Determine status code: use provided status or default to 500
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    timestamp: new Date().toISOString()
  });
});

export default app;

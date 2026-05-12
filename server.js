/**
 * Server Entry Point
 * 
 * PURPOSE:
 * This is the main file that starts the Express server.
 * It's the first file Node.js executes when you run 'npm start' or 'node server.js'
 * 
 * EXECUTION FLOW:
 * 1. Import configuration and Express app
 * 2. Test database connection (already done in config/db.js)
 * 3. Start listening on specified port
 * 4. Display startup messages and available endpoints
 * 
 * WHY SEPARATE SERVER.JS FROM APP.JS?
 * - app.js: Contains Express app configuration (middleware, routes)
 * - server.js: Starts the server and listens on port
 * - This allows app.js to be tested independently without starting the server
 * - Follows industry best practice for application structure
 */

import app from './app.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Extract port from environment variables or use default
// Allows flexibility: production can use port 80, development can use 3000
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start Server
 * 
 * The listen() function:
 * - Binds the server to the specified port
 * - Starts accepting incoming HTTP requests
 * - Callback executes when server is successfully started
 */
const server = app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║        School Management API - Server Started               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log(`✓ Environment: ${NODE_ENV}`);
  console.log(`✓ Server running on port: ${PORT}`);
  console.log(`✓ Base URL: http://localhost:${PORT}\n`);
  
  console.log('📍 Available Endpoints:');
  console.log(`   • Health Check: GET http://localhost:${PORT}/health`);
  console.log(`   • Add School: POST http://localhost:${PORT}/api/addSchool`);
  console.log(`   • List Schools: GET http://localhost:${PORT}/api/listSchools?latitude=X&longitude=Y`);
  console.log(`   • Root: GET http://localhost:${PORT}/\n`);
  
  console.log('💡 Tips:');
  console.log('   • Use Postman collection to test APIs');
  console.log('   • Check .env file for database configuration');
  console.log('   • View README.md for detailed documentation\n');
});

/**
 * GRACEFUL SHUTDOWN HANDLER
 * 
 * When server receives SIGTERM or SIGINT (Ctrl+C), it should:
 * 1. Stop accepting new requests
 * 2. Close database connections
 * 3. Clean up resources
 * 4. Exit gracefully
 * 
 * This prevents data corruption and resource leaks
 */
process.on('SIGTERM', () => {
  console.log('\n⚠ SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠ SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});

/**
 * UNHANDLED ERROR HANDLERS
 * 
 * Catch any errors that weren't handled elsewhere
 * Log them and exit to prevent zombie processes
 */
process.on('uncaughtException', (error) => {
  console.error('✗ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('✗ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

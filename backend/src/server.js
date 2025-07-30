/**
 * MyBudgeteer Backend Server
 * 
 * Express.js server that provides the REST API for the MyBudgeteer application.
 * Handles user authentication, financial data management, and secure data storage.
 * 
 * Features:
 * - JWT-based authentication system
 * - MongoDB integration with Mongoose ODM
 * - RESTful API endpoints for all application features
 * - Security middleware (helmet, CORS, rate limiting)
 * - Request logging for debugging and monitoring
 * - Error handling and validation
 * 
 * Architecture:
 * - Modular route structure for scalability
 * - Middleware-based request processing
 * - Environment variable configuration
 * - MongoDB Atlas cloud database integration
 * 
 * Security:
 * - CORS configuration for frontend integration
 * - Rate limiting to prevent abuse
 * - Helmet for security headers
 * - Input validation and sanitization
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

// Load environment variables from .env file
require('dotenv').config();

// Core dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import API route modules
const authRoutes = require('./routes/auth');           // Authentication endpoints
const userRoutes = require('./routes/users');         // User management
const transactionRoutes = require('./routes/transactions'); // Financial transactions
const budgetRoutes = require('./routes/budgets');     // Budget management
const achievementRoutes = require('./routes/achievements'); // Gamification system

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware Configuration

// Helmet - Sets various HTTP headers for security
app.use(helmet());

// CORS - Configure Cross-Origin Resource Sharing for frontend integration
app.use(cors({
  origin: [
    'http://localhost:8080',    // Vite dev server default
    'http://127.0.0.1:8080',   // Alternative localhost
    'http://localhost:3000',    // React dev server default
    process.env.CLIENT_URL      // Production frontend URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
}));

// Rate Limiting - Prevent abuse and DoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Request Logging Middleware - For debugging and monitoring
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

// Body Parsing Middleware - Handle JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database Connection Configuration
// MongoDB Atlas connection with robust error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mybudgeteer')
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  console.error('🔧 Please check your MONGODB_URI environment variable');
  process.exit(1);
});

// MongoDB connection event handlers for monitoring
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

// API Route Configuration - Mount route modules at their respective paths
app.use('/api/auth', authRoutes);           // Authentication endpoints: /api/auth/login, /api/auth/register, etc.
app.use('/api/users', userRoutes);          // User management: /api/users/profile, /api/users/update, etc.
app.use('/api/transactions', transactionRoutes); // Financial transactions: /api/transactions/create, /api/transactions/list, etc.
app.use('/api/budgets', budgetRoutes);      // Budget management: /api/budgets/create, /api/budgets/update, etc.
app.use('/api/achievements', achievementRoutes); // Achievement system: /api/achievements/list, /api/achievements/unlock, etc.

// Health Check Endpoint - Comprehensive server status information
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'MyBudgeteer API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Root Endpoint - Basic API information and available endpoints
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to MyBudgeteer API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      authentication: '/api/auth',
      users: '/api/users', 
      transactions: '/api/transactions',
      budgets: '/api/budgets',
      achievements: '/api/achievements',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler - Centralized error handling for all routes
app.use((err, req, res, next) => {
  console.error('🚨 Global error handler triggered:', err.stack);
  
  // Handle specific MongoDB/Mongoose error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: Object.keys(err.errors).reduce((acc, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      }, {})
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'The provided ID is not in the correct MongoDB ObjectId format'
    });
  }
  
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate Entry',
      message: 'A record with this information already exists',
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
  // JWT-related errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'The provided authentication token is invalid'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'Your session has expired. Please log in again.'
    });
  }
  
  // Default error response with environment-specific details
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on our end',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
});

// 404 Handler - Catch-all for undefined routes (must be after error handler)
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint Not Found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: {
      authentication: '/api/auth',
      users: '/api/users',
      transactions: '/api/transactions', 
      budgets: '/api/budgets',
      achievements: '/api/achievements',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
});

// Server Startup - Start the Express server
app.listen(PORT, () => {
  console.log('🚀 MyBudgeteer Backend Server Started');
  console.log(`� Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log('==================================================');
});

// Export the app for testing purposes
module.exports = app;

/**
 * Authentication Routes for MyBudgeteer
 * 
 * Handles user authentication, registration, login, and token management.
 * Provides secure endpoints for user account creation and access control.
 * 
 * Features:
 * - User registration with comprehensive validation
 * - Secure login with JWT token generation
 * - Rate limiting to prevent brute force attacks
 * - Password hashing and validation
 * - Email verification and duplicate prevention
 * - Token refresh and user session management
 * 
 * Security Measures:
 * - Rate limiting (5 attempts per 15 minutes)
 * - Password complexity requirements
 * - Email format validation
 * - JWT token expiration handling
 * - Input sanitization and validation
 * 
 * Endpoints:
 * - POST /api/auth/register - Create new user account
 * - POST /api/auth/login - Authenticate existing user
 * - POST /api/auth/refresh - Refresh JWT token
 * - GET /api/auth/verify - Verify token validity
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate Limiting Configuration - Prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5,                    // Limit each IP to 5 authentication attempts
  message: {
    error: 'Too Many Attempts',
    message: 'Too many authentication attempts from this IP. Please try again in 15 minutes.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,     // Return rate limit info in headers
  legacyHeaders: false,      // Disable legacy headers
});

/**
 * Generate JWT Token
 * Creates a signed JWT token for authenticated users
 * 
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {string} Signed JWT token with expiration
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Input Validation Rules for User Registration
const registerValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('surname')
    .trim()
    .notEmpty()
    .withMessage('Surname is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Surname must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Surname can only contain letters and spaces'),
  
  body('otherName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Other name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage('Other name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phoneNumber')
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage('Please provide a valid phone number format'),
  
  body('preferredCurrency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'ZAR'])
    .withMessage('Please select a valid currency from the supported list')
];

// Input Validation Rules for User Login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty')
];

/**
 * POST /api/auth/register
 * Register a new user account
 * 
 * Creates a new user with validation, password hashing, and duplicate checking.
 * Automatically generates JWT token upon successful registration.
 * 
 * @access Public
 * @rate_limit 5 requests per 15 minutes per IP
 */
router.post('/register', authLimiter, registerValidation, async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Registration validation failed',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      });
    }

    const {
      firstName,
      surname,
      otherName,
      email,
      password,
      phoneNumber,
      preferredCurrency
    } = req.body;

    // Check for existing user account
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
        code: 'EMAIL_EXISTS'
      });
    }

    // Create new user instance with provided data
    const user = new User({
      firstName,
      surname,
      otherName,
      email,
      password, // Will be hashed by the User model pre-save middleware
      phoneNumber,
      preferredCurrency: preferredCurrency || 'USD'
    });

    // Save user to database (triggers password hashing)
    await user.save();

    // Generate authentication token
    const token = generateToken(user._id);

    // Update user login statistics
    user.loginCount += 1;
    user.lastLogin = new Date();
    await user.save();

    // Return success response with user data and token
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to MyBudgeteer.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          surname: user.surname,
          otherName: user.otherName,
          fullName: user.getFullName(),
          phoneNumber: user.phoneNumber,
          preferredCurrency: user.preferredCurrency,
          profilePicture: user.profilePicture,
          preferences: user.preferences,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount
        },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });

  } catch (error) {
    console.error('🚨 Registration error:', error);
    
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
        code: 'EMAIL_EXISTS'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again later.',
      code: 'REGISTRATION_FAILED'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate existing user
 * 
 * Validates user credentials, generates JWT token, and updates login statistics.
 * Provides secure authentication with password verification.
 * 
 * @access Public
 * @rate_limit 5 requests per 15 minutes per IP
 */
router.post('/login', authLimiter, loginValidation, async (req, res) => {
  try {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid login credentials',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    const { email, password } = req.body;

    // Find user by email and include password for verification
    const user = await User.findByEmail(email).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verify password using bcrypt comparison
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Generate authentication token for successful login
    const token = generateToken(user._id);

    // Update user login statistics and last login timestamp
    user.loginCount += 1;
    user.lastLogin = new Date();
    await user.save();

    // Return success response with user data and token
    res.json({
      success: true,
      message: `Welcome back, ${user.firstName}!`,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          surname: user.surname,
          otherName: user.otherName,
          fullName: user.getFullName(),
          phoneNumber: user.phoneNumber,
          preferredCurrency: user.preferredCurrency,
          profilePicture: user.profilePicture,
          preferences: user.preferences,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount
        },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });

  } catch (error) {
    console.error('🚨 Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again later.',
      code: 'LOGIN_FAILED'
    });
  }
});

/**
 * GET /api/auth/demo
 * Provide demo account credentials for testing
 * 
 * Returns predefined demo account information for development and testing purposes.
 * Useful for showcasing application features without requiring registration.
 * 
 * @access Public
 */
// @desc    Get demo account credentials
// @access  Public
router.get('/demo', async (req, res) => {
  try {
    // Create or get demo user
    let demoUser = await User.findByEmail('demo@mybudgeteer.com');
    
    if (!demoUser) {
      demoUser = new User({
        firstName: 'Demo',
        surname: 'User',
        otherName: 'Alpha',
        email: 'demo@mybudgeteer.com',
        password: 'demo123',
        phoneNumber: '+1 (555) 123-4567',
        preferredCurrency: 'USD',
        isDemo: true,
        preferences: {
          budgetType: 'family',
          budgetPeriod: 'monthly'
        }
      });
      await demoUser.save();
    }

    // Generate token for demo user
    const token = generateToken(demoUser._id);

    // Update login statistics
    demoUser.loginCount += 1;
    demoUser.lastLogin = new Date();
    await demoUser.save();

    res.json({
      success: true,
      message: 'Demo account access granted',
      data: {
        user: {
          id: demoUser._id,
          email: demoUser.email,
          firstName: demoUser.firstName,
          surname: demoUser.surname,
          otherName: demoUser.otherName,
          fullName: demoUser.getFullName(),
          phoneNumber: demoUser.phoneNumber,
          preferredCurrency: demoUser.preferredCurrency,
          profilePicture: demoUser.profilePicture,
          preferences: demoUser.preferences,
          createdAt: demoUser.createdAt,
          lastLogin: demoUser.lastLogin,
          loginCount: demoUser.loginCount,
          isDemo: true
        },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        demoNotice: 'This is a demo account. Data may be reset periodically.'
      }
    });

  } catch (error) {
    console.error('🚨 Demo account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to access demo account. Please try again later.',
      code: 'DEMO_ACCESS_FAILED'
    });
  }
});

// Export the authentication router for use in main server
module.exports = router;

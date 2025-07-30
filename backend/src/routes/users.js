/**
 * User Management Routes for MyBudgeteer
 * 
 * Handles user profile operations, preferences management, and account updates.
 * Provides secure endpoints for authenticated users to manage their accounts.
 * 
 * Features:
 * - User profile retrieval and updates
 * - Profile picture management
 * - Currency preference settings
 * - Account preferences configuration
 * - Personal information management
 * 
 * Security:
 * - JWT authentication required for all endpoints
 * - User-specific data access control
 * - Input validation and sanitization
 * - Secure data handling practices
 * 
 * Endpoints:
 * - GET /api/users/profile - Retrieve user profile
 * - PUT /api/users/profile - Update user profile
 * - PUT /api/users/preferences - Update user preferences
 * - DELETE /api/users/account - Delete user account
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/users/profile
 * Retrieve authenticated user's profile information
 * 
 * Returns complete user profile data including personal information,
 * preferences, and account statistics for the authenticated user.
 * 
 * @access Private (JWT authentication required)
 */
router.get('/profile', auth, async (req, res) => {
  try {
    // Find user by ID from JWT token
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Return complete user profile data
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
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
          loginCount: user.loginCount,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('🚨 Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile. Please try again later.',
      code: 'PROFILE_FETCH_FAILED'
    });
  }
});

/**
 * PUT /api/users/profile
 * Update authenticated user's profile information
 * 
 * Allows users to update their personal information, contact details,
 * and account preferences with validation and security checks.
 * 
 * @access Private (JWT authentication required)
 */
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    // Define allowed fields for profile updates (security measure)
    const allowedUpdates = [
      'firstName',
      'surname', 
      'otherName',
      'phoneNumber',
      'preferredCurrency',
      'profilePicture',
      'preferences'
    ];

    // Filter request body to only include allowed fields
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Validate that there are updates to apply
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
        allowedFields: allowedUpdates
      });
    }

    // Update user profile with validation
    const user = await User.findByIdAndUpdate(
      req.userId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Return updated profile data
    res.json({
      success: true,
      message: 'Profile updated successfully',
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
          loginCount: user.loginCount,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('🚨 Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Profile validation failed',
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update profile. Please try again later.',
      code: 'PROFILE_UPDATE_FAILED'
    });
  }
});

// Export the user management router for use in main server
module.exports = router;

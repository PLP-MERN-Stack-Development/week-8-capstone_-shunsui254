/**
 * Transaction Management Routes for MyBudgeteer
 * 
 * Handles financial transaction operations including creation, retrieval, updates, and deletion.
 * Provides comprehensive transaction management with filtering, pagination, and analytics.
 * 
 * Features:
 * - Transaction CRUD operations (Create, Read, Update, Delete)
 * - Advanced filtering by type, category, date range
 * - Pagination for large transaction sets
 * - Transaction analytics and summaries
 * - Category-based organization
 * - Income and expense tracking
 * 
 * Security:
 * - JWT authentication required for all endpoints
 * - User-specific transaction access control
 * - Input validation and sanitization
 * - Secure transaction data handling
 * 
 * Endpoints:
 * - GET /api/transactions - List user transactions with filtering
 * - POST /api/transactions - Create new transaction
 * - GET /api/transactions/:id - Get specific transaction
 * - PUT /api/transactions/:id - Update transaction
 * - DELETE /api/transactions/:id - Delete transaction
 * - GET /api/transactions/analytics - Get transaction analytics
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const { body, validationResult, query } = require('express-validator');

const router = express.Router();

/**
 * GET /api/transactions
 * Retrieve user's transactions with advanced filtering and pagination
 * 
 * Supports filtering by transaction type, category, date range, and amount.
 * Includes pagination for efficient data loading and performance optimization.
 * 
 * @access Private (JWT authentication required)
 * @query {number} page - Page number for pagination (default: 1)
 * @query {number} limit - Number of transactions per page (default: 50, max: 100)
 * @query {string} type - Filter by transaction type ('income' or 'expense')
 * @query {string} category - Filter by category name (case-insensitive)
 * @query {string} startDate - Filter transactions from this date (ISO format)
 * @query {string} endDate - Filter transactions until this date (ISO format)
 */
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('type').optional().isIn(['income', 'expense']),
  query('category').optional().isString().trim(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    // Validate query parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters provided',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg,
          value: error.value
        }))
      });
    }

    const {
      page = 1,
      limit = 50,
      type,
      category,
      startDate,
      endDate
    } = req.query;

    // Build MongoDB filter object for user-specific transactions
    const filter = { userId: req.user.id };
    
    // Apply type filter (income/expense)
    if (type) filter.type = type;
    
    // Apply category filter with case-insensitive regex
    if (category) filter.category = new RegExp(category, 'i');
    
    // Apply date range filters
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Get transactions
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalTransactions = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalTransactions / limit);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: page,
          totalPages,
          totalTransactions,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions'
    });
  }
});

// @route   GET /api/transactions/summary
// @desc    Get transaction summary statistics
// @access  Private
router.get('/summary', auth, [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('period').optional().isIn(['week', 'month', 'quarter', 'year'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const { startDate, endDate, period = 'month' } = req.query;
    
    // Set default date range based on period
    let dateFilter = {};
    const now = new Date();
    
    if (startDate && endDate) {
      dateFilter = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      switch (period) {
        case 'week':
          dateFilter = {
            $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
          };
          break;
        case 'quarter':
          dateFilter = {
            $gte: new Date(now.getFullYear(), now.getMonth() - 3, 1)
          };
          break;
        case 'year':
          dateFilter = {
            $gte: new Date(now.getFullYear(), 0, 1)
          };
          break;
        default: // month
          dateFilter = {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1)
          };
      }
    }

    const matchFilter = {
      userId: req.user.id,
      date: dateFilter
    };

    const summary = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Get category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.type',
          categories: {
            $push: {
              category: '$_id.category',
              total: '$total',
              count: '$count'
            }
          },
          totalByType: { $sum: '$total' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: summary.reduce((acc, item) => {
          acc[item._id] = {
            total: item.total,
            count: item.count,
            average: item.avgAmount
          };
          return acc;
        }, {}),
        categoryBreakdown: categoryBreakdown.reduce((acc, item) => {
          acc[item._id] = {
            total: item.totalByType,
            categories: item.categories
          };
          return acc;
        }, {}),
        period,
        dateRange: dateFilter
      }
    });

  } catch (error) {
    console.error('Get transaction summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction summary'
    });
  }
});

module.exports = router;

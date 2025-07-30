const express = require('express');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');
const { body, validationResult, query } = require('express-validator');

const router = express.Router();

// @route   GET /api/budgets
// @desc    Get user's budgets
// @access  Private
router.get('/', auth, [
  query('period').optional().isIn(['weekly', 'monthly', 'quarterly', 'yearly']),
  query('isActive').optional().isBoolean()
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

    const { period, isActive } = req.query;
    
    // Build filter
    const filter = { userId: req.user.id };
    if (period) filter.period = period;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const budgets = await Budget.find(filter).sort({ category: 1 });

    res.json({
      success: true,
      data: { budgets }
    });

  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching budgets'
    });
  }
});

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
router.post('/', auth, [
  body('category').isLength({ min: 1, max: 100 }).trim().withMessage('Category is required and must be less than 100 characters'),
  body('budgeted').isFloat({ min: 0 }).withMessage('Budget amount must be a positive number'),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'ZAR', 'KES', 'NGN']),
  body('period').optional().isIn(['weekly', 'monthly', 'quarterly', 'yearly']),
  body('color').optional().isString(),
  body('alertThreshold').optional().isFloat({ min: 0, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if budget for this category already exists
    const existingBudget = await Budget.findOne({
      userId: req.user.id,
      category: req.body.category,
      isActive: true
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: 'An active budget for this category already exists'
      });
    }

    const budget = new Budget({
      ...req.body,
      userId: req.user.id
    });

    await budget.save();

    res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      data: { budget }
    });

  } catch (error) {
    console.error('Create budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating budget'
    });
  }
});

// @route   PUT /api/budgets/:id
// @desc    Update a budget
// @access  Private
router.put('/:id', auth, [
  body('category').optional().isLength({ min: 1, max: 100 }).trim(),
  body('budgeted').optional().isFloat({ min: 0 }),
  body('spent').optional().isFloat({ min: 0 }),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'ZAR', 'KES', 'NGN']),
  body('period').optional().isIn(['weekly', 'monthly', 'quarterly', 'yearly']),
  body('color').optional().isString(),
  body('alertThreshold').optional().isFloat({ min: 0, max: 100 }),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.json({
      success: true,
      message: 'Budget updated successfully',
      data: { budget }
    });

  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating budget'
    });
  }
});

module.exports = router;

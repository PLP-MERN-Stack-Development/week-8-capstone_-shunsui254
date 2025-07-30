const express = require('express');
const Achievement = require('../models/Achievement');
const auth = require('../middleware/auth');
const { query, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/achievements
// @desc    Get user's achievements
// @access  Private
router.get('/', auth, [
  query('category').optional().isIn(['milestones', 'budgeting', 'savings', 'streaks', 'goals', 'social']),
  query('unlocked').optional().isBoolean(),
  query('difficulty').optional().isIn(['bronze', 'silver', 'gold', 'platinum'])
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

    const { category, unlocked, difficulty } = req.query;
    
    // Build filter
    const filter = { userId: req.user.id };
    if (category) filter.category = category;
    if (unlocked !== undefined) filter.unlocked = unlocked === 'true';
    if (difficulty) filter.difficulty = difficulty;

    const achievements = await Achievement.find(filter).sort({ 
      unlocked: -1, 
      unlockedAt: -1,
      difficulty: 1,
      points: -1
    });

    // Calculate stats
    const stats = {
      total: achievements.length,
      unlocked: achievements.filter(a => a.unlocked).length,
      totalPoints: achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0),
      byDifficulty: {
        bronze: achievements.filter(a => a.difficulty === 'bronze' && a.unlocked).length,
        silver: achievements.filter(a => a.difficulty === 'silver' && a.unlocked).length,
        gold: achievements.filter(a => a.difficulty === 'gold' && a.unlocked).length,
        platinum: achievements.filter(a => a.difficulty === 'platinum' && a.unlocked).length,
      },
      byCategory: {}
    };

    // Calculate by category
    ['milestones', 'budgeting', 'savings', 'streaks', 'goals', 'social'].forEach(cat => {
      stats.byCategory[cat] = achievements.filter(a => a.category === cat && a.unlocked).length;
    });

    res.json({
      success: true,
      data: { 
        achievements,
        stats
      }
    });

  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievements'
    });
  }
});

// @route   GET /api/achievements/leaderboard
// @desc    Get achievements leaderboard (demo/sample data)
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    // For demo purposes, return sample leaderboard data
    // In a real app, this would aggregate data from all users
    const leaderboard = [
      { rank: 1, username: 'Demo User', totalPoints: 465, achievementsCount: 6 },
      { rank: 2, username: 'FinanceGuru', totalPoints: 420, achievementsCount: 8 },
      { rank: 3, username: 'BudgetMaster', totalPoints: 380, achievementsCount: 7 },
      { rank: 4, username: 'SavingsHero', totalPoints: 325, achievementsCount: 6 },
      { rank: 5, username: 'MoneyWise', totalPoints: 290, achievementsCount: 5 }
    ];

    res.json({
      success: true,
      data: { leaderboard }
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard'
    });
  }
});

// @route   PUT /api/achievements/:achievementId/progress
// @desc    Update achievement progress
// @access  Private
router.put('/:achievementId/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;

    if (typeof progress !== 'number' || progress < 0) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be a positive number'
      });
    }

    const achievement = await Achievement.findOne({
      userId: req.user.id,
      achievementId: req.params.achievementId
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    // Update progress
    achievement.progress = Math.min(progress, achievement.maxProgress);
    
    // Check if achievement should be unlocked
    if (!achievement.unlocked && achievement.progress >= achievement.maxProgress) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
    }

    await achievement.save();

    res.json({
      success: true,
      message: achievement.unlocked ? 'Achievement unlocked!' : 'Progress updated',
      data: { achievement }
    });

  } catch (error) {
    console.error('Update achievement progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating achievement progress'
    });
  }
});

module.exports = router;

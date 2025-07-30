const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  achievementId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['milestones', 'budgeting', 'savings', 'streaks', 'goals', 'social']
  },
  difficulty: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0
  },
  maxProgress: {
    type: Number,
    required: true,
    min: 1
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date
  },
  requirement: {
    type: String,
    required: true
  },
  icon: {
    type: String, // Store icon name/identifier
    default: 'star'
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Virtual for completion percentage
achievementSchema.virtual('completionPercentage').get(function() {
  return Math.min(100, (this.progress / this.maxProgress) * 100);
});

// Compound index to ensure unique achievements per user
achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
achievementSchema.index({ userId: 1, unlocked: 1 });
achievementSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);

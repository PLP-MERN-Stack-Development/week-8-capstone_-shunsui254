require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Transaction = require('./src/models/Transaction');
const Budget = require('./src/models/Budget');
const Achievement = require('./src/models/Achievement');

// Demo user data
const DEMO_USER_EMAIL = 'demo@mybudgeteer.com';

// Demo transactions data (converted from frontend)
const demoTransactions = [
  // May 2024 - Corporate Job Start
  {
    type: "income",
    amount: 1500,
    description: "Tech Corp Kenya - Software Developer Salary",
    category: "Salary",
    date: new Date("2024-05-30"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: new Date("2024-05-01"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 50,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: new Date("2024-05-05"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 30,
    description: "Water Bill - Nairobi Water",
    category: "Utilities",
    date: new Date("2024-05-05"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 200,
    description: "Groceries - Naivas Supermarket",
    category: "Food & Dining",
    date: new Date("2024-05-08"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 60,
    description: "Matatu & Uber Transport",
    category: "Transportation",
    date: new Date("2024-05-15"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 15,
    description: "Netflix Subscription",
    category: "Entertainment",
    date: new Date("2024-05-10"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 25,
    description: "Mobile Airtime - Safaricom",
    category: "Utilities",
    date: new Date("2024-05-12"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 80,
    description: "Clothes Shopping - CBD",
    category: "Shopping",
    date: new Date("2024-05-20"),
    currency: "USD"
  },
  
  // June 2024
  {
    type: "income",
    amount: 1500,
    description: "Tech Corp Kenya - Software Developer Salary",
    category: "Salary",
    date: new Date("2024-06-30"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: new Date("2024-06-01"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 45,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: new Date("2024-06-05"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 220,
    description: "Groceries - Carrefour",
    category: "Food & Dining",
    date: new Date("2024-06-08"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 65,
    description: "Transport - Monthly",
    category: "Transportation",
    date: new Date("2024-06-15"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 120,
    description: "Weekend Dining Out",
    category: "Food & Dining",
    date: new Date("2024-06-22"),
    currency: "USD"
  },
  
  // July 2024 - More freelance work starts
  {
    type: "income",
    amount: 1500,
    description: "Tech Corp Kenya - Software Developer Salary",
    category: "Salary",
    date: new Date("2024-07-30"),
    currency: "USD"
  },
  {
    type: "income",
    amount: 800,
    description: "Freelance Web Development - Client A",
    category: "Freelance",
    date: new Date("2024-07-15"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: new Date("2024-07-01"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 240,
    description: "Groceries & Food",
    category: "Food & Dining",
    date: new Date("2024-07-08"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 70,
    description: "Transportation",
    category: "Transportation",
    date: new Date("2024-07-15"),
    currency: "USD"
  },
  
  // August 2024 - Transition to full freelance
  {
    type: "income",
    amount: 2200,
    description: "Freelance Development - Multiple Clients",
    category: "Freelance",
    date: new Date("2024-08-15"),
    currency: "USD"
  },
  {
    type: "income",
    amount: 300,
    description: "YouTube Content Creation Revenue",
    category: "Content Creation",
    date: new Date("2024-08-25"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 350,
    description: "Apartment Rent",
    category: "Housing",
    date: new Date("2024-08-01"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 280,
    description: "Food & Groceries",
    category: "Food & Dining",
    date: new Date("2024-08-08"),
    currency: "USD"
  },
  {
    type: "expense",
    amount: 150,
    description: "Content Creation Equipment",
    category: "Business Expenses",
    date: new Date("2024-08-20"),
    currency: "USD"
  }
];

// Demo budgets data
const demoBudgets = [
  {
    category: "Food & Dining",
    budgeted: 600,
    spent: 445.50,
    color: "hsl(210 100% 45%)",
    period: "monthly"
  },
  {
    category: "Transportation",
    budgeted: 300,
    spent: 185.75,
    color: "hsl(145 65% 45%)",
    period: "monthly"
  },
  {
    category: "Entertainment",
    budgeted: 200,
    spent: 89.99,
    color: "hsl(35 90% 55%)",
    period: "monthly"
  },
  {
    category: "Shopping",
    budgeted: 400,
    spent: 321.25,
    color: "hsl(265 60% 50%)",
    period: "monthly"
  },
  {
    category: "Bills & Utilities",
    budgeted: 800,
    spent: 750.00,
    color: "hsl(0 70% 50%)",
    period: "monthly"
  },
  {
    category: "Housing",
    budgeted: 1200,
    spent: 1100.00,
    color: "hsl(280 60% 50%)",
    period: "monthly"
  }
];

// Demo achievements data
const demoAchievements = [
  {
    achievementId: "first_transaction",
    title: "Getting Started",
    description: "Record your first transaction",
    category: "milestones",
    difficulty: "bronze",
    points: 10,
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: new Date("2024-05-01"),
    requirement: "Add 1 transaction",
    icon: "star"
  },
  {
    achievementId: "budget_master",
    title: "Budget Master", 
    description: "Stay within budget for 3 consecutive months",
    category: "budgeting",
    difficulty: "gold",
    points: 100,
    progress: 3,
    maxProgress: 3,
    unlocked: true,
    unlockedAt: new Date("2024-08-15"),
    requirement: "3 months under budget",
    icon: "target"
  },
  {
    achievementId: "savings_hero",
    title: "Savings Hero",
    description: "Save 20% of your income for a month",
    category: "savings",
    difficulty: "silver",
    points: 50,
    progress: 20,
    maxProgress: 20,
    unlocked: true,
    unlockedAt: new Date("2024-07-01"),
    requirement: "Save 20% monthly income",
    icon: "trophy"
  },
  {
    achievementId: "streak_warrior",
    title: "Streak Warrior",
    description: "Track expenses for 30 consecutive days",
    category: "streaks",
    difficulty: "silver",
    points: 75,
    progress: 30,
    maxProgress: 30,
    unlocked: true,
    unlockedAt: new Date("2024-06-01"),
    requirement: "30-day logging streak",
    icon: "zap"
  },
  {
    achievementId: "goal_crusher",
    title: "Goal Crusher",
    description: "Complete 5 financial goals",
    category: "goals",
    difficulty: "gold",
    points: 150,
    progress: 5,
    maxProgress: 5,
    unlocked: true,
    unlockedAt: new Date("2024-08-01"),
    requirement: "Complete 5 goals",
    icon: "trophy"
  },
  {
    achievementId: "high_earner",
    title: "High Earner",
    description: "Earn over $2000 in a single month",
    category: "milestones", 
    difficulty: "silver",
    points: 75,
    progress: 2200,
    maxProgress: 2000,
    unlocked: true,
    unlockedAt: new Date("2024-08-15"),
    requirement: "Earn $2000+ monthly",
    icon: "dollar-sign"
  }
];

async function seedDemoData() {
  try {
    console.log('🌱 Starting demo data seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find demo user
    const demoUser = await User.findOne({ email: DEMO_USER_EMAIL });
    if (!demoUser) {
      console.log('❌ Demo user not found. Please create demo user first.');
      process.exit(1);
    }
    
    console.log(`✅ Found demo user: ${demoUser.email}`);
    
    // Clear existing demo data
    console.log('🧹 Clearing existing demo data...');
    await Transaction.deleteMany({ userId: demoUser._id });
    await Budget.deleteMany({ userId: demoUser._id });
    await Achievement.deleteMany({ userId: demoUser._id });
    console.log('✅ Existing demo data cleared');
    
    // Seed transactions
    console.log('💰 Seeding transactions...');
    const transactionsToInsert = demoTransactions.map(tx => ({
      ...tx,
      userId: demoUser._id
    }));
    
    const insertedTransactions = await Transaction.insertMany(transactionsToInsert);
    console.log(`✅ Inserted ${insertedTransactions.length} transactions`);
    
    // Seed budgets
    console.log('📊 Seeding budgets...');
    const budgetsToInsert = demoBudgets.map(budget => ({
      ...budget,
      userId: demoUser._id,
      currency: demoUser.preferredCurrency || 'USD'
    }));
    
    const insertedBudgets = await Budget.insertMany(budgetsToInsert);
    console.log(`✅ Inserted ${insertedBudgets.length} budgets`);
    
    // Seed achievements
    console.log('🏆 Seeding achievements...');
    const achievementsToInsert = demoAchievements.map(achievement => ({
      ...achievement,
      userId: demoUser._id
    }));
    
    const insertedAchievements = await Achievement.insertMany(achievementsToInsert);
    console.log(`✅ Inserted ${insertedAchievements.length} achievements`);
    
    // Summary
    console.log('\n🎉 Demo data seeding completed successfully!');
    console.log(`📈 Summary for user: ${demoUser.email}`);
    console.log(`   💰 Transactions: ${insertedTransactions.length}`);
    console.log(`   📊 Budgets: ${insertedBudgets.length}`);
    console.log(`   🏆 Achievements: ${insertedAchievements.length}`);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDemoData();
}

module.exports = { seedDemoData };

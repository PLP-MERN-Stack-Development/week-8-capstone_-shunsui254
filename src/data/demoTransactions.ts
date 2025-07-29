// Comprehensive 14-month transaction data for Kenyan freelance programmer demo account
// Journey: Corporate job (first 4 months) -> Freelance + Content Creation (remaining 10 months)

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  category: string;
  date: string;
  currency?: string;
}

// Helper function to generate transaction IDs
let transactionCounter = 1;
const generateId = () => `txn_${transactionCounter++}`;

// Helper function to create date strings
const createDate = (year: number, month: number, day: number) => {
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

export const demoTransactions: Transaction[] = [
  // ===== MONTH 1: May 2024 (Corporate Job Start) =====
  {
    id: generateId(),
    type: "income",
    amount: 1500,
    description: "Tech Corp Kenya - Software Developer Salary",
    category: "Salary",
    date: createDate(2024, 5, 30),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2024, 5, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 50,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2024, 5, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 25,
    description: "Water Bill - Nairobi Water",
    category: "Utilities",
    date: createDate(2024, 5, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 80,
    description: "Internet - Safaricom Fiber 100Mbps",
    category: "Utilities",
    date: createDate(2024, 5, 3),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 200,
    description: "Groceries - Naivas Supermarket",
    category: "Food & Dining",
    date: createDate(2024, 5, 8),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 60,
    description: "Matatu & Uber Transport",
    category: "Transportation",
    date: createDate(2024, 5, 15),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 15,
    description: "Netflix Subscription",
    category: "Entertainment",
    date: createDate(2024, 5, 10),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 25,
    description: "Lunch - Java House",
    category: "Food & Dining",
    date: createDate(2024, 5, 12),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 100,
    description: "Clothes Shopping - Sarit Centre",
    category: "Shopping",
    date: createDate(2024, 5, 20),
    currency: "USD"
  },

  // ===== MONTH 2: June 2024 (Corporate Job) =====
  {
    id: generateId(),
    type: "income",
    amount: 1500,
    description: "Tech Corp Kenya - Software Developer Salary",
    category: "Salary",
    date: createDate(2024, 6, 30),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2024, 6, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 55,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2024, 6, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 25,
    description: "Water Bill - Nairobi Water",
    category: "Utilities",
    date: createDate(2024, 6, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 180,
    description: "Groceries - Carrefour",
    category: "Food & Dining",
    date: createDate(2024, 6, 10),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 120,
    description: "MacBook Pro Repair - iStore Kenya",
    category: "Technology",
    date: createDate(2024, 6, 15),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 30,
    description: "Coffee Dates - Artcaffe",
    category: "Food & Dining",
    date: createDate(2024, 6, 18),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 200,
    description: "Weekend Coding Tutorial - Side Gig",
    category: "Freelance",
    date: createDate(2024, 6, 22),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 65,
    description: "Fuel & Transport",
    category: "Transportation",
    date: createDate(2024, 6, 25),
    currency: "USD"
  },

  // ===== MONTH 3: July 2024 (Corporate Job) =====
  {
    id: generateId(),
    type: "income",
    amount: 1500,
    description: "Tech Corp Kenya - Software Developer Salary",
    category: "Salary",
    date: createDate(2024, 7, 31),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2024, 7, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 48,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2024, 7, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 220,
    description: "Groceries & Household Items",
    category: "Food & Dining",
    date: createDate(2024, 7, 8),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 150,
    description: "iPhone 14 Screen Repair",
    category: "Technology",
    date: createDate(2024, 7, 12),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 300,
    description: "React App Development - Client Project",
    category: "Freelance",
    date: createDate(2024, 7, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 75,
    description: "Dinner & Entertainment - Westlands",
    category: "Entertainment",
    date: createDate(2024, 7, 21),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 40,
    description: "Adobe Creative Suite Subscription",
    category: "Software & Tools",
    date: createDate(2024, 7, 25),
    currency: "USD"
  },

  // ===== MONTH 4: August 2024 (Last Corporate Month) =====
  {
    id: generateId(),
    type: "income",
    amount: 1500,
    description: "Tech Corp Kenya - Final Salary Payment",
    category: "Salary",
    date: createDate(2024, 8, 31),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2024, 8, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 52,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2024, 8, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 190,
    description: "Groceries - Tuskys Supermarket",
    category: "Food & Dining",
    date: createDate(2024, 8, 10),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 400,
    description: "E-commerce Website Build - Final Corporate Side Project",
    category: "Freelance",
    date: createDate(2024, 8, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 200,
    description: "Professional Equipment - External Monitor",
    category: "Technology",
    date: createDate(2024, 8, 28),
    currency: "USD"
  },

  // ===== MONTH 5: September 2024 (Transition to Freelance) =====
  {
    id: generateId(),
    type: "income",
    amount: 800,
    description: "React Dashboard Development - Client A",
    category: "Freelance",
    date: createDate(2024, 9, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 600,
    description: "WordPress Site Customization - Client B",
    category: "Freelance",
    date: createDate(2024, 9, 15),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 45,
    description: "YouTube AdSense Revenue",
    category: "Content Creation",
    date: createDate(2024, 9, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 25,
    description: "TikTok Creator Fund",
    category: "Content Creation",
    date: createDate(2024, 9, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2024, 9, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 47,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2024, 9, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 200,
    description: "Groceries & Supplies",
    category: "Food & Dining",
    date: createDate(2024, 9, 12),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 120,
    description: "Camera Equipment for Content Creation",
    category: "Technology",
    date: createDate(2024, 9, 18),
    currency: "USD"
  },

  // ===== MONTH 6: October 2024 (Building Freelance Portfolio) =====
  {
    id: generateId(),
    type: "income",
    amount: 1200,
    description: "Mobile App Development - Kenyan Startup",
    category: "Freelance",
    date: createDate(2024, 10, 8),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 65,
    description: "YouTube AdSense Revenue",
    category: "Content Creation",
    date: createDate(2024, 10, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 35,
    description: "TikTok Creator Fund",
    category: "Content Creation",
    date: createDate(2024, 10, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 150,
    description: "Instagram Sponsored Post - Tech Product",
    category: "Content Creation",
    date: createDate(2024, 10, 28),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2024, 10, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 55,
    description: "Electricity Bill - KPLC (Higher usage - Home Office)",
    category: "Utilities",
    date: createDate(2024, 10, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 180,
    description: "Groceries - Naivas",
    category: "Food & Dining",
    date: createDate(2024, 10, 10),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 89,
    description: "GitHub Pro + Additional Development Tools",
    category: "Software & Tools",
    date: createDate(2024, 10, 15),
    currency: "USD"
  },

  // ===== MONTH 7: November 2024 (Growing Content Creation) =====
  {
    id: generateId(),
    type: "income",
    amount: 950,
    description: "Next.js SaaS Development - International Client",
    category: "Freelance",
    date: createDate(2024, 11, 12),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 500,
    description: "Code Review & Mentoring Sessions",
    category: "Freelance",
    date: createDate(2024, 11, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 85,
    description: "YouTube AdSense Revenue",
    category: "Content Creation",
    date: createDate(2024, 11, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 45,
    description: "TikTok Creator Fund",
    category: "Content Creation",
    date: createDate(2024, 11, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 200,
    description: "Instagram Brand Partnership - Coding Bootcamp",
    category: "Content Creation",
    date: createDate(2024, 11, 28),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2024, 11, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 60,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2024, 11, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 220,
    description: "Groceries & Household Items",
    category: "Food & Dining",
    date: createDate(2024, 11, 8),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 300,
    description: "Professional Video Equipment Upgrade",
    category: "Technology",
    date: createDate(2024, 11, 22),
    currency: "USD"
  },

  // ===== MONTH 8: December 2024 (Holiday Season Boost) =====
  {
    id: generateId(),
    type: "income",
    amount: 1800,
    description: "Holiday E-commerce Platform Development",
    category: "Freelance",
    date: createDate(2024, 12, 10),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 120,
    description: "YouTube AdSense Revenue - Holiday Content Spike",
    category: "Content Creation",
    date: createDate(2024, 12, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 65,
    description: "TikTok Creator Fund",
    category: "Content Creation",
    date: createDate(2024, 12, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 400,
    description: "Instagram Holiday Campaign - Multiple Brands",
    category: "Content Creation",
    date: createDate(2024, 12, 15),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2024, 12, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 58,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2024, 12, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 300,
    description: "Holiday Shopping & Gifts",
    category: "Shopping",
    date: createDate(2024, 12, 18),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 150,
    description: "Holiday Travel - Upcountry Kenya",
    category: "Transportation",
    date: createDate(2024, 12, 22),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 200,
    description: "Holiday Celebrations & Food",
    category: "Food & Dining",
    date: createDate(2024, 12, 25),
    currency: "USD"
  },

  // ===== MONTH 9: January 2025 (New Year Planning) =====
  {
    id: generateId(),
    type: "income",
    amount: 1100,
    description: "React Native Mobile App - Fintech Startup",
    category: "Freelance",
    date: createDate(2025, 1, 15),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 95,
    description: "YouTube AdSense Revenue",
    category: "Content Creation",
    date: createDate(2025, 1, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 50,
    description: "TikTok Creator Fund",
    category: "Content Creation",
    date: createDate(2025, 1, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 250,
    description: "Instagram New Year Tech Trends Campaign",
    category: "Content Creation",
    date: createDate(2025, 1, 10),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2025, 1, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 62,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2025, 1, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 180,
    description: "Groceries - Post-Holiday Restocking",
    category: "Food & Dining",
    date: createDate(2025, 1, 8),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 200,
    description: "Professional Development - Online Courses",
    category: "Education",
    date: createDate(2025, 1, 12),
    currency: "USD"
  },

  // ===== MONTH 10: February 2025 (Scaling Up) =====
  {
    id: generateId(),
    type: "income",
    amount: 1600,
    description: "Full-Stack Web Platform - US Client",
    category: "Freelance",
    date: createDate(2025, 2, 14),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 110,
    description: "YouTube AdSense Revenue - Channel Growth",
    category: "Content Creation",
    date: createDate(2025, 2, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 60,
    description: "TikTok Creator Fund",
    category: "Content Creation",
    date: createDate(2025, 2, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 350,
    description: "Instagram Valentine's Tech Romance Campaign",
    category: "Content Creation",
    date: createDate(2025, 2, 14),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2025, 2, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 55,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2025, 2, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 190,
    description: "Groceries & Health Supplements",
    category: "Food & Dining",
    date: createDate(2025, 2, 10),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 400,
    description: "MacBook Pro M3 Upgrade - Business Investment",
    category: "Technology",
    date: createDate(2025, 2, 20),
    currency: "USD"
  },

  // ===== MONTH 11: March 2025 (Consistent Growth) =====
  {
    id: generateId(),
    type: "income",
    amount: 1350,
    description: "AI-Powered Analytics Dashboard - European Client",
    category: "Freelance",
    date: createDate(2025, 3, 12),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 450,
    description: "Consulting & Code Architecture Review",
    category: "Freelance",
    date: createDate(2025, 3, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 130,
    description: "YouTube AdSense Revenue",
    category: "Content Creation",
    date: createDate(2025, 3, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 70,
    description: "TikTok Creator Fund",
    category: "Content Creation",
    date: createDate(2025, 3, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 300,
    description: "Instagram Spring Tech Trends Campaign",
    category: "Content Creation",
    date: createDate(2025, 3, 18),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2025, 3, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 58,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2025, 3, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 210,
    description: "Groceries & Premium Organic Food",
    category: "Food & Dining",
    date: createDate(2025, 3, 12),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 150,
    description: "Gym Membership & Personal Trainer - Wellness Focus",
    category: "Health & Fitness",
    date: createDate(2025, 3, 15),
    currency: "USD"
  },

  // ===== MONTH 12: April 2025 (Expanding Services) =====
  {
    id: generateId(),
    type: "income",
    amount: 2200,
    description: "Blockchain DeFi Platform Development",
    category: "Freelance",
    date: createDate(2025, 4, 18),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 145,
    description: "YouTube AdSense Revenue - Record Month",
    category: "Content Creation",
    date: createDate(2025, 4, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 85,
    description: "TikTok Creator Fund",
    category: "Content Creation",
    date: createDate(2025, 4, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 450,
    description: "Instagram Sponsored Content - Crypto/Tech Brands",
    category: "Content Creation",
    date: createDate(2025, 4, 22),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2025, 4, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 60,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2025, 4, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 250,
    description: "Groceries & International Food Imports",
    category: "Food & Dining",
    date: createDate(2025, 4, 10),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 500,
    description: "Professional Camera Setup for YouTube Studio",
    category: "Technology",
    date: createDate(2025, 4, 15),
    currency: "USD"
  },

  // ===== MONTH 13: May 2025 (Peak Performance) =====
  {
    id: generateId(),
    type: "income",
    amount: 1800,
    description: "Enterprise React App - Financial Institution",
    category: "Freelance",
    date: createDate(2025, 5, 10),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 750,
    description: "Technical Writing & Documentation Services",
    category: "Freelance",
    date: createDate(2025, 5, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 160,
    description: "YouTube AdSense Revenue",
    category: "Content Creation",
    date: createDate(2025, 5, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 95,
    description: "TikTok Creator Fund",
    category: "Content Creation",
    date: createDate(2025, 5, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 500,
    description: "Instagram Creator Program + Brand Partnerships",
    category: "Content Creation",
    date: createDate(2025, 5, 28),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2025, 5, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 65,
    description: "Electricity Bill - KPLC (High AC Usage)",
    category: "Utilities",
    date: createDate(2025, 5, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 230,
    description: "Groceries & Meal Prep Services",
    category: "Food & Dining",
    date: createDate(2025, 5, 12),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 800,
    description: "Business Trip - US Tech Conference & Networking",
    category: "Business Travel",
    date: createDate(2025, 5, 25),
    currency: "USD"
  },

  // ===== MONTH 14: June 2025 (Current Month) =====
  {
    id: generateId(),
    type: "income",
    amount: 2500,
    description: "AI SaaS Platform MVP Development",
    category: "Freelance",
    date: createDate(2025, 6, 15),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 180,
    description: "YouTube AdSense Revenue - Peak Performance",
    category: "Content Creation",
    date: createDate(2025, 6, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 105,
    description: "TikTok Creator Fund",
    category: "Content Creation",
    date: createDate(2025, 6, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 600,
    description: "Instagram Brand Ambassador Program - Tech Companies",
    category: "Content Creation",
    date: createDate(2025, 6, 28),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2025, 6, 1),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 70,
    description: "Electricity Bill - KPLC",
    category: "Utilities",
    date: createDate(2025, 6, 5),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 280,
    description: "Premium Groceries & Imported Foods",
    category: "Food & Dining",
    date: createDate(2025, 6, 10),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 1200,
    description: "Down Payment - New Co-working Space Investment",
    category: "Business Investment",
    date: createDate(2025, 6, 20),
    currency: "USD"
  },

  // Recent transactions for July 2025 (current month)
  {
    id: generateId(),
    type: "income",
    amount: 3200,
    description: "Full-Stack E-learning Platform Development",
    category: "Freelance",
    date: createDate(2025, 7, 25),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 45.50,
    description: "Coffee & Lunch - Java House Networking Session",
    category: "Food & Dining",
    date: createDate(2025, 7, 24),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 120,
    description: "GitHub Copilot Pro + Premium Dev Tools Subscription",
    category: "Software & Tools",
    date: createDate(2025, 7, 23),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 25.99,
    description: "Spotify Premium",
    category: "Entertainment",
    date: createDate(2025, 7, 22),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 150,
    description: "Code Review & Technical Consultation",
    category: "Freelance",
    date: createDate(2025, 7, 21),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "income",
    amount: 200,
    description: "YouTube AdSense Revenue - Summer Spike",
    category: "Content Creation",
    date: createDate(2025, 7, 20),
    currency: "USD"
  },
  {
    id: generateId(),
    type: "expense",
    amount: 350,
    description: "Apartment Rent - Kilimani, Nairobi",
    category: "Housing",
    date: createDate(2025, 7, 1),
    currency: "USD"
  }
];

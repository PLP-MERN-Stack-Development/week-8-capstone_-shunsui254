// Utility functions for user data management

export const isDemoAccount = (userEmail?: string): boolean => {
  if (!userEmail) {
    const userStr = localStorage.getItem("mybudgeteer_user");
    if (!userStr) return false;
    
    try {
      const userData = JSON.parse(userStr);
      userEmail = userData.email;
    } catch {
      return false;
    }
  }
  
  return userEmail === "demo@mybudgeteer.com" || userEmail === "cecil@mybudgeteer.com";
};

export const isNewUser = (): boolean => {
  const userStr = localStorage.getItem("mybudgeteer_user");
  if (!userStr) return true;
  
  try {
    const userData = JSON.parse(userStr);
    // Demo accounts should show data, new users should not
    return !isDemoAccount(userData.email);
  } catch {
    return true;
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("mybudgeteer_user");
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getUserDisplayName = (): string => {
  const user = getCurrentUser();
  if (!user) return "User";
  
  return user.fullName || user.name || user.email.split("@")[0];
};

export const formatUserDisplayName = (user: any): string => {
  if (!user) return '';
  
  const parts = [];
  if (user.firstName) parts.push(user.firstName);
  if (user.otherName) parts.push(user.otherName);
  if (user.surname) parts.push(user.surname);
  
  return parts.join(' ') || user.email || 'User';
};

export const getUserInitials = (user: any): string => {
  if (!user) return 'U';
  
  const firstName = user.firstName || '';
  const surname = user.surname || '';
  
  if (firstName && surname) {
    return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  }
  
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }
  
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }
  
  return 'U';
};

export const calculateProfileCompletion = (user: any): number => {
  if (!user) return 0;
  
  const fields = [
    'firstName',
    'surname', 
    'email',
    'phoneNumber',
    'preferredCurrency'
  ];
  
  const completedFields = fields.filter(field => {
    const value = user[field];
    return value && value.toString().trim().length > 0;
  });
  
  return Math.round((completedFields.length / fields.length) * 100);
};

export const getAccountTypeDisplay = (user: any): string => {
  if (!user) return 'Personal';
  
  const budgetType = user.budgetType || user.accountType || 'personal';
  
  switch (budgetType.toLowerCase()) {
    case 'family':
      return 'Family Account';
    case 'business':
      return 'Business Account';
    case 'student':
      return 'Student Account';
    case 'personal':
    default:
      return 'Personal Account';
  }
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true };
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

export const sanitizeUserInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 255); // Limit length
};

export const exportUserData = (user: any, additionalData?: any) => {
  const exportData = {
    userData: user,
    accountSettings: additionalData?.accountSettings || {},
    preferences: additionalData?.preferences || {},
    exportDate: new Date().toISOString(),
    version: '1.0',
    format: 'MyBudgeteer Account Export'
  };
  
  return JSON.stringify(exportData, null, 2);
};

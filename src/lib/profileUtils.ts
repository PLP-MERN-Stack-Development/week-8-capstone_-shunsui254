// Utility functions for profile management
export interface UserProfileData {
  firstName: string;
  surname: string;
  otherName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  joinedDate: string;
}

export interface UserPreferences {
  theme: string;
  currency: string;
  budgetType: string;
  budgetPeriod: string;
  notifications: {
    email: boolean;
    push: boolean;
    security: boolean;
    budget: boolean;
  };
  accessibility: {
    fontSize: string;
    highContrast: boolean;
  };
  language: string;
}

export const loadUserProfile = (): UserProfileData | null => {
  const userStr = localStorage.getItem("mybudgeteer_user");
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    return {
      firstName: user.firstName || "",
      surname: user.surname || "",
      otherName: user.otherName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      profilePicture: user.profilePicture || "",
      joinedDate: user.joinedDate || new Date().toISOString()
    };
  } catch {
    return null;
  }
};

export const saveUserProfile = (profileData: Partial<UserProfileData>): boolean => {
  const userStr = localStorage.getItem("mybudgeteer_user");
  if (!userStr) return false;

  try {
    const user = JSON.parse(userStr);
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem("mybudgeteer_user", JSON.stringify(updatedUser));
    return true;
  } catch {
    return false;
  }
};

export const loadUserPreferences = (): UserPreferences => {
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedCurrency = localStorage.getItem("selectedCurrency") || "USD";
  const savedPreferences = localStorage.getItem("mybudgeteer_preferences");
  
  const defaultPreferences: UserPreferences = {
    theme: savedTheme,
    currency: savedCurrency,
    budgetType: "personal",
    budgetPeriod: "monthly",
    notifications: {
      email: true,
      push: true,
      security: true,
      budget: true
    },
    accessibility: {
      fontSize: "medium",
      highContrast: false
    },
    language: "en"
  };

  if (savedPreferences) {
    try {
      return { ...defaultPreferences, ...JSON.parse(savedPreferences) };
    } catch {
      return defaultPreferences;
    }
  }

  return defaultPreferences;
};

export const saveUserPreferences = (preferences: Partial<UserPreferences>): void => {
  const current = loadUserPreferences();
  const updated = { ...current, ...preferences };
  localStorage.setItem("mybudgeteer_preferences", JSON.stringify(updated));
};

export const calculateProfileCompletion = (profile: UserProfileData): number => {
  const fields = [
    profile.firstName,
    profile.surname,
    profile.email,
    profile.phoneNumber,
    profile.profilePicture
  ];

  const completed = fields.filter(field => field && field.trim() !== "").length;
  return Math.round((completed / fields.length) * 100);
};

export const getUserDisplayName = (profile: UserProfileData): string => {
  const parts = [profile.firstName, profile.otherName, profile.surname].filter(Boolean);
  return parts.join(" ") || profile.email;
};

export const getUserInitials = (profile: UserProfileData): string => {
  if (profile.firstName && profile.surname) {
    return `${profile.firstName.charAt(0)}${profile.surname.charAt(0)}`.toUpperCase();
  }
  if (profile.email) {
    return profile.email.charAt(0).toUpperCase();
  }
  return "U";
};

export const exportUserData = (): void => {
  const profile = loadUserProfile();
  const preferences = loadUserPreferences();
  
  if (!profile) return;

  const exportData = {
    profile,
    preferences,
    exportDate: new Date().toISOString(),
    version: "1.0"
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `mybudgeteer-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

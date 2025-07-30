/**
 * Utility to clear all user-related data from localStorage
 * This ensures new users start with a completely clean slate
 */

export const clearAllUserData = () => {
  // List of all localStorage keys that might contain user data
  const userDataKeys = [
    // User account data
    'mybudgeteer_user',
    'mybudgeteer_preferences', 
    'mybudgeteer_account_settings',
    'mybudgeteer_last_login',
    
    // User preferences
    'selectedCurrency',
    'theme',
    
    // Financial data
    'mybudgeteer_transactions',
    'mybudgeteer_budgets',
    'mybudgeteer_goals',
    'mybudgeteer_categories',
    'mybudgeteer_recurring_transactions',
    
    // Offline/sync data
    'offline_transactions',
    'sync_queue',
    'last_sync_time',
    'pending_changes',
    
    // Analytics and tracking
    'mybudgeteer_analytics',
    'mybudgeteer_achievements',
    'mybudgeteer_milestones',
    
    // Settings and configurations
    'mybudgeteer_notification_settings',
    'mybudgeteer_privacy_settings',
    'mybudgeteer_security_settings',
    'mybudgeteer_export_settings',
    
    // Cache and temporary data
    'mybudgeteer_cache',
    'exchange_rates_cache',
    'last_data_fetch',
    
    // Feature flags and experiments
    'mybudgeteer_feature_flags',
    'mybudgeteer_experiments',
    
    // Dashboard and UI state
    'mybudgeteer_dashboard_layout',
    'mybudgeteer_widget_preferences',
    'mybudgeteer_sidebar_state',
    
    // Reports and exports
    'mybudgeteer_saved_reports',
    'mybudgeteer_export_history',
    
    // Backup and recovery
    'mybudgeteer_backup_data',
    'mybudgeteer_recovery_data',
  ];

  // Clear all user data keys
  userDataKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove localStorage key: ${key}`, error);
    }
  });

  // Also clear any keys that start with 'mybudgeteer_' that we might have missed
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.startsWith('mybudgeteer_') || 
        key.startsWith('offline_') || 
        key.startsWith('sync_') ||
        key.startsWith('exchange_rates_')) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove localStorage key: ${key}`, error);
      }
    }
  });

  console.log('All user data cleared from localStorage');
};

/**
 * Initialize default settings for a new user
 * This sets up minimal required data for the app to function
 */
export const initializeNewUserDefaults = (userEmail: string, preferredCurrency: string = 'USD') => {
  // Only set the selected currency for new users
  // Everything else should be created on-demand or remain empty
  try {
    localStorage.setItem('selectedCurrency', preferredCurrency);
    
    // Set a light theme as default if no theme is set
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'light');
    }
    
    console.log(`Initialized defaults for new user: ${userEmail}`);
  } catch (error) {
    console.warn('Failed to initialize new user defaults', error);
  }
};

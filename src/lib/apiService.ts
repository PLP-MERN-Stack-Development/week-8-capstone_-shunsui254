/**
 * API Service - Centralized HTTP Client for MyBudgeteer
 * 
 * This service provides a unified interface for all API communications
 * with the MyBudgeteer backend server. It handles authentication,
 * request/response formatting, and error handling.
 * 
 * Features:
 * - JWT token management for secure authentication
 * - Type-safe API method definitions
 * - Centralized error handling
 * - Automatic token inclusion in requests
 * - Support for both authenticated and public endpoints
 * 
 * Architecture:
 * - Singleton pattern for consistent state management
 * - Promise-based async operations
 * - TypeScript interfaces for type safety
 * - RESTful API conventions
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

// Backend API base URL configuration
// Uses environment variable in production, falls back to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:5000/api';

// Debug logging for production troubleshooting
console.log('🔧 API Service Configuration:');
console.log('   Environment:', import.meta.env.MODE);
console.log('   VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('   Final API_BASE_URL:', API_BASE_URL);

// Enhanced fetch wrapper with better error handling
const apiRequest = async (url: string, options: RequestInit = {}) => {
  console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    console.log(`📡 API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}:`, errorText);
      throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('🚨 Network Error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network Error: Unable to connect to ${API_BASE_URL}. Please check if the backend server is running.`);
    }
    throw error;
  }
};

// Type definitions for API requests and responses

/** Login request payload */
interface LoginCredentials {
  email: string;
  password: string;
}

/** User registration payload */
interface SignUpData {
  firstName: string;
  surname: string;
  otherName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  preferredCurrency: string;
}

/** Authentication response from server */
interface AuthResponse {
  token: string;  // JWT authentication token
  user: {
    id: string;
    firstName: string;
    surname: string;
    otherName?: string;
    email: string;
    phoneNumber?: string;
    preferredCurrency: string;
    profilePicture?: string;
    createdAt: string;
  };
}

/** Standard API error response */
interface ApiError {
  message: string;
  errors?: string[];  // Validation errors array
}

/**
 * Main API Service Class
 * Handles all HTTP communications with the backend
 */
class ApiService {
  /**
   * Retrieves the stored authentication token
   * @returns JWT token or null if not authenticated
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('mybudgeteer_token');
  }

  /**
   * Constructs headers for API requests including authentication
   * @returns Headers object with Content-Type and Authorization (if authenticated)
   */
  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    console.log('🔍 Processing response:', response.status, response.statusText);
    
    let data;
    try {
      data = await response.json();
      console.log('📄 Response data:', data);
    } catch (jsonError) {
      console.error('❌ Failed to parse JSON:', jsonError);
      throw new Error('Invalid response format');
    }
    
    if (!response.ok) {
      const error: ApiError = data;
      console.error('❌ API Error:', error);
      throw new Error(error.message || 'An error occurred');
    }
    
    // Extract the actual data from the API response structure
    // Backend returns: { success: true, message: "...", data: { user, token } }
    // Frontend expects: { user, token }
    if (data.success && data.data) {
      return data.data as T;
    }
    
    return data;
  }

  // Authentication endpoints
  async signUp(userData: SignUpData): Promise<AuthResponse> {
    const response = await apiRequest(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse<AuthResponse>(response);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    
    return this.handleResponse<AuthResponse>(response);
  }

  async loginDemo(): Promise<AuthResponse> {
    console.log('🔄 Attempting demo login...');
    console.log('📍 API URL:', `${API_BASE_URL}/auth/demo`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/demo`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      
      console.log('📊 Response status:', response.status);
      console.log('📋 Response headers:', [...response.headers.entries()]);
      
      const result = await this.handleResponse<AuthResponse>(response);
      console.log('✅ Demo login successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Demo login failed:', error);
      throw error;
    }
  }

  // User profile endpoints
  async getUserProfile(): Promise<AuthResponse['user']> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    
    return this.handleResponse<AuthResponse['user']>(response);
  }

  async updateUserProfile(updates: Partial<SignUpData>): Promise<AuthResponse['user']> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    
    return this.handleResponse<AuthResponse['user']>(response);
  }

  // Token management
  saveToken(token: string): void {
    localStorage.setItem('mybudgeteer_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('mybudgeteer_token');
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (!token) return false;
    
    try {
      // Basic token validation (check if it's expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; environment: string }> {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
export type { LoginCredentials, SignUpData, AuthResponse, ApiError };

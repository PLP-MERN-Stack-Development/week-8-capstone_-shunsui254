/**
 * MyBudgeteer - Application Entry Point
 * 
 * This is the main entry point for the MyBudgeteer React application.
 * It sets up the root rendering process, error boundaries, and React StrictMode
 * for enhanced development experience and error catching.
 * 
 * Key Features:
 * - Error Boundary: Catches and handles React component errors gracefully
 * - Strict Mode: Enables additional checks and warnings for development
 * - Root Element Validation: Ensures the DOM root element exists before rendering
 * - Production-Ready Error Handling: User-friendly error messages with recovery options
 * 
 * @author Cecil Bezalel
 * @version 1.0.0
 */

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * Error Boundary Component
 * 
 * Provides a fallback UI when React component errors occur during rendering.
 * This prevents the entire application from crashing due to isolated component errors.
 * 
 * Features:
 * - Catches JavaScript errors anywhere in the component tree
 * - Logs error information to console for debugging
 * - Displays user-friendly error message with recovery option
 * - Provides refresh button to allow user to retry
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  /**
   * Catches errors during rendering and updates state to show error UI
   */
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  /**
   * Logs error details for debugging purposes
   * In production, this would typically send errors to a logging service
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('🚨 React Error Boundary caught an error:', error, errorInfo)
    
    // In production, you might want to send this to an error reporting service
    // Example: logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}>
          <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ marginBottom: '30px', maxWidth: '400px', lineHeight: '1.5' }}>
            We apologize for the inconvenience. An unexpected error occurred while loading the application. 
            Please try refreshing the page to continue.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
            🔄 Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Validate root element exists before attempting to render
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error(
    'Failed to find the root element. Please ensure your HTML file includes a div with id="root"'
  )
}

// Create React root and render the application
const root = createRoot(rootElement)

/**
 * Render the complete application with error boundary and strict mode
 * 
 * - StrictMode: Enables additional checks for common mistakes in development
 * - ErrorBoundary: Catches and handles component errors gracefully  
 * - App: The main application component with all routes and providers
 */
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)

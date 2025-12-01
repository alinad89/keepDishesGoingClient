import axios, { type AxiosInstance, type InternalAxiosRequestConfig, AxiosError } from 'axios';
import keycloak from '../keycloak';

// ========================================
// HTTP Client Configuration
// ========================================

/**
 * Axios instance with automatic token management
 *
 * This client automatically:
 * - Refreshes tokens before expiration (30 second buffer)
 * - Injects Bearer token into Authorization header
 * - Handles 401 responses by logging out the user
 * - Logs authentication errors for debugging
 */

// Base URL for API requests from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

// Create Axios instance
const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========================================
// Request Interceptor (Token Injection & Refresh)
// ========================================

/**
 * REQUEST INTERCEPTOR
 *
 * Before every request:
 * 1. Check if user is authenticated
 * 2. Refresh token if it expires in <30 seconds
 * 3. Add Authorization header with Bearer token
 * 4. Log out if token refresh fails
 */
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check if user is authenticated
    if (keycloak.authenticated) {
      try {
        // Refresh token if it expires in less than 30 seconds
        // This prevents token expiration during the API call
        const refreshed = await keycloak.updateToken(30);

        if (refreshed) {
          console.log('[HTTP Client] Token was refreshed');
        }

        // Add Authorization header with current token
        if (keycloak.token) {
          config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
      } catch (error) {
        // Token refresh failed - log out the user
        console.error('[HTTP Client] Failed to refresh token, logging out:', error);
        keycloak.logout();
        throw new Error('Token refresh failed');
      }
    } else {
      // User not authenticated - remove Authorization header if present
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => {
    console.error('[HTTP Client] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ========================================
// Response Interceptor (401 Handler)
// ========================================

/**
 * RESPONSE INTERCEPTOR
 *
 * After every response:
 * - Catch 401 Unauthorized responses
 * - Automatically log out the user on 401 errors
 */
http.interceptors.response.use(
  (response) => {
    // Request succeeded - return response as-is
    return response;
  },
  (error: AxiosError) => {
    // Check if error is 401 Unauthorized
    if (error.response?.status === 401) {
      console.error('[HTTP Client] 401 Unauthorized - logging out user');

      // Log out the user (clears Keycloak session)
      keycloak.logout();
    }

    return Promise.reject(error);
  }
);

// ========================================
// Utility Functions
// ========================================

/**
 * Manually set authentication token
 * (Usually not needed - Keycloak manages tokens automatically)
 *
 * @param token - JWT token to set in Authorization header
 */
export function setAuthToken(token?: string): void {
  if (token) {
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common['Authorization'];
  }
}

/**
 * Manually refresh the authentication token
 *
 * @param minValiditySeconds - Minimum validity time in seconds (default: 30)
 * @returns Promise that resolves to true if token was refreshed
 */
export async function refreshToken(minValiditySeconds: number = 30): Promise<boolean> {
  try {
    const refreshed = await keycloak.updateToken(minValiditySeconds);
    if (refreshed) {
      console.log('[HTTP Client] Token manually refreshed');
    }
    return refreshed;
  } catch (error) {
    console.error('[HTTP Client] Manual token refresh failed:', error);
    keycloak.logout();
    throw error;
  }
}

// Export the configured Axios instance as default
export default http;

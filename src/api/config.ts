import type { ApiErrorResponse } from '../types/api';

// ========================================
// API Configuration
// ========================================

// Base URL for real backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Mock backend URL (JSON Server) - used during development
export const MOCK_API_URL = import.meta.env.VITE_MOCK_API_URL || 'http://localhost:3001';

// Toggle between real and mock API
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const EFFECTIVE_API_URL = USE_MOCK_API ? MOCK_API_URL : API_BASE_URL;

// ========================================
// API Endpoints (Developer BC)
// ========================================

export const DEVELOPER_ENDPOINTS = {
  register: '/developers',
  games: '/games',
  gameById: (id: string) => `/games/${id}`,
  gameStatus: (id: string) => `/games/${id}/status`,
  // For JSON Server mock: use query params instead of nested routes
  gameAchievements: (gameId: string) =>
    USE_MOCK_API ? `/achievements?gameId=${gameId}` : `/games/${gameId}/achievements`,
  gameAchievementById: (gameId: string, achId: string) =>
    USE_MOCK_API ? `/achievements/${achId}` : `/games/${gameId}/achievements/${achId}`,
} as const;

// ========================================
// API Endpoints (Chatbot BC)
// ========================================

export const CHATBOT_ENDPOINTS = {
  platformInfo: '/platform/info',
  chats: '/chats',
  chatById: (id: string) => `/chats/${id}`,
} as const;

// ========================================
// Authentication
// ========================================

/**
 * Get JWT token from storage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Set JWT token in storage
 */
export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

/**
 * Clear JWT token from storage
 */
export function clearAuthToken(): void {
  localStorage.removeItem('auth_token');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

// ========================================
// API Error Class
// ========================================

export class ApiError extends Error {
  status: number;
  error: string;
  apiMessage: string;
  path: string;
  timestamp: string;

  constructor(
    status: number,
    error: string,
    apiMessage: string,
    path: string,
    timestamp: string
  ) {
    super(apiMessage);
    this.name = 'ApiError';
    this.status = status;
    this.error = error;
    this.apiMessage = apiMessage;
    this.path = path;
    this.timestamp = timestamp;
  }

  static fromResponse(errorData: ApiErrorResponse): ApiError {
    return new ApiError(
      errorData.status,
      errorData.error,
      errorData.message,
      errorData.path,
      errorData.timestamp
    );
  }
}

// ========================================
// Helper Functions
// ========================================

/**
 * Build complete URL with base
 */
export function buildUrl(endpoint: string): string {
  const base = EFFECTIVE_API_URL;
  // Remove leading slash from endpoint if base already has trailing slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${base}/${normalizedEndpoint}`;
}

/**
 * Get common headers including auth token
 */
function getHeaders(includeContentType: boolean = true): HeadersInit {
  const headers: HeadersInit = {};

  // Add JWT token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add content type for JSON requests
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

/**
 * Handle API error response
 */
async function handleErrorResponse(response: Response): Promise<never> {
  let errorData: ApiErrorResponse;

  try {
    errorData = await response.json();
  } catch {
    // If response is not JSON, create a generic error
    throw new ApiError(
      response.status,
      response.statusText,
      `HTTP ${response.status}: ${response.statusText}`,
      response.url,
      new Date().toISOString()
    );
  }

  throw ApiError.fromResponse(errorData);
}

// ========================================
// Generic Fetch Wrapper (JSON)
// ========================================

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = buildUrl(endpoint);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options?.headers,
      },
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Handle errors
    if (!response.ok) {
      await handleErrorResponse(response);
    }

    // Parse and return JSON
    return await response.json();
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap other errors
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// ========================================
// Multipart Form Data Fetch Wrapper
// ========================================

/**
 * Upload files with form data
 * Note: Don't set Content-Type header - browser will set it with boundary
 */
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PATCH' = 'POST'
): Promise<T> {
  const url = buildUrl(endpoint);

  // Get headers WITHOUT Content-Type (browser sets it for multipart)
  const headers: HeadersInit = {};
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: formData,
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Handle errors
    if (!response.ok) {
      await handleErrorResponse(response);
    }

    // Parse and return JSON
    return await response.json();
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap other errors
    console.error('API Upload Error:', error);
    throw error;
  }
}

// ========================================
// HTTP Method Helpers
// ========================================

export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'GET' });
}

export async function apiPost<T>(
  endpoint: string,
  body?: any
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T>(
  endpoint: string,
  body?: any
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'DELETE' });
}

import type { ApiErrorResponse } from '../types/api-error.types';
import keycloak from '../keycloak';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const MOCK_API_URL = import.meta.env.VITE_MOCK_API_URL || 'http://localhost:3001';

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const EFFECTIVE_API_URL = USE_MOCK_API ? MOCK_API_URL : API_BASE_URL;

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


export const CHATBOT_ENDPOINTS = {
  platformInfo: '/platform/info',
  chats: '/chats',
  chatById: (id: string) => `/chats/${id}`,
} as const;

export const PLATFORM_ENDPOINTS = {
  players: '/players',
  allPlayers: '/players',
  lobbies: '/lobbies',
  myLobby: '/lobbies/me',
  lobbyStatus: '/lobbies/me/status',
} as const;

export const SOCIAL_ENDPOINTS = {
  lobbyInvitations: '/lobby-invitations',
  myLobbyInvitations: '/lobby-invitations/me',
  acceptLobbyInvitation: (id: string) => `/lobby-invitations/${id}/accepted`,
  friendLists: '/friend-lists',
  friendRequests: '/friend-requests',
  myFriendRequests: '/friend-requests/me',
  acceptFriendRequest: (id: string) => `/friend-requests/${id}/accepted`,
} as const;


//Get JWT token from Keycloak
export function getAuthToken(): string | null {
  if (keycloak.authenticated && keycloak.token) {
    return keycloak.token;
  }
  return null;
}

export function setAuthToken(token: string): void {
  console.warn('[API Config] setAuthToken is deprecated - use Keycloak for authentication');
  localStorage.setItem('auth_token', token);
}

export function clearAuthToken(): void {
  console.warn('[API Config] clearAuthToken is deprecated - use keycloak.logout()');
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return keycloak.authenticated === true;
}

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
    // Refresh Keycloak token if it expires in <30 seconds
    if (keycloak.authenticated) {
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
          console.log('[API Config] Token was refreshed before fetch');
        }
      } catch (error) {
        console.error('[API Config] Failed to refresh token:', error);
        keycloak.logout();
        throw new Error('Token refresh failed');
      }
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options?.headers,
      },
    });

    // Handle 204 No Content and 202 Accepted (empty body)
    // TODO: Backend should return 204 instead of 202 for consistency
    if (response.status === 204 || response.status === 202) {
      return undefined as T;
    }

    // Handle 401 Unauthorized - logout user
    /*if (response.status === 401) {
      console.error('[API Config] 401 Unauthorized - logging out user');
      keycloak.logout();
      throw new ApiError(
        401,
        'Unauthorized',
        'Session expired. Please log in again.',
        url,
        new Date().toISOString()
      );
    }

     */

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

  try {
    // Refresh Keycloak token if it expires in <30 seconds
    if (keycloak.authenticated) {
      try {
        const refreshed = await keycloak.updateToken(30);
        if (refreshed) {
          console.log('[API Config] Token was refreshed before upload');
        }
      } catch (error) {
        console.error('[API Config] Failed to refresh token:', error);
        keycloak.logout();
        throw new Error('Token refresh failed');
      }
    }

    // Get headers WITHOUT Content-Type (browser sets it for multipart)
    const headers: HeadersInit = {};
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: formData,
    });

    // Handle 204 No Content and 202 Accepted (empty body)
    // TODO: Backend should return 204 instead of 202 for consistency
    if (response.status === 204 || response.status === 202) {
      return undefined as T;
    }

    // Handle 401 Unauthorized - logout user
    /*if (response.status === 401) {
      console.error('[API Config] 401 Unauthorized - logging out user');
      keycloak.logout();
      throw new ApiError(
        401,
        'Unauthorized',
        'Session expired. Please log in again.',
        url,
        new Date().toISOString()
      );
    }

     */

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
  body?: unknown
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'DELETE' });
}

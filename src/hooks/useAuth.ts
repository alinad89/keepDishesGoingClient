import { useKeycloak } from '@react-keycloak/web';

// ========================================
// Authentication Hook
// ========================================

/**
 * Custom hook to access Keycloak authentication state and user data
 *
 * This hook provides:
 * - Keycloak instance for direct access
 * - Authentication state (initialized, authenticated)
 * - User information from JWT token
 * - Helper functions for authentication actions
 * - Role checking utilities
 *
 * Usage:
 * const { user, isAuthenticated, login, logout, hasRole } = useAuth();
 */

interface UserInfo {
  email?: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  sub?: string; // User ID
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

export function useAuth() {
  const { keycloak, initialized } = useKeycloak();

  // Extract user information from JWT token
  const user: UserInfo | null = keycloak.tokenParsed as UserInfo | null;

  // Check if user is authenticated
  const isAuthenticated = initialized && keycloak.authenticated;

  // Get user email
  const userEmail = user?.email || null;

  // Get username
  const username = user?.preferred_username || user?.name || user?.email || null;

  // Get user ID (subject)
  const userId = user?.sub || null;

  // Login function
  const login = (redirectUri?: string) => {
    keycloak.login({
      redirectUri: redirectUri || `${window.location.origin}/developer/dashboard`,
    });
  };

  // Logout function
  const logout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  // Register function
  const register = (redirectUri?: string) => {
    keycloak.register({
      redirectUri: redirectUri || `${window.location.origin}/developer/dashboard`,
    });
  };

  // Open Keycloak account management page
  const accountManagement = () => {
    keycloak.accountManagement();
  };

  // Check if user has a specific realm role
  const hasRealmRole = (role: string): boolean => {
    return keycloak.hasRealmRole(role);
  };

  // Check if user has a specific resource role
  const hasResourceRole = (role: string, resource?: string): boolean => {
    return keycloak.hasResourceRole(role, resource);
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => hasRealmRole(role));
  };

  // Check if user has all of the specified roles
  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every((role) => hasRealmRole(role));
  };

  // Get all user realm roles
  const realmRoles = user?.realm_access?.roles || [];

  // Get token (useful for debugging)
  const token = keycloak.token || null;

  // Get token expiration time
  const tokenExpiration = keycloak.tokenParsed?.exp
    ? new Date(keycloak.tokenParsed.exp * 1000)
    : null;

  return {
    // Keycloak instance
    keycloak,

    // State
    initialized,
    isAuthenticated,

    // User info
    user,
    userEmail,
    username,
    userId,

    // Actions
    login,
    logout,
    register,
    accountManagement,

    // Role checking
    hasRealmRole,
    hasResourceRole,
    hasAnyRole,
    hasAllRoles,
    realmRoles,

    // Token info
    token,
    tokenExpiration,
  };
}

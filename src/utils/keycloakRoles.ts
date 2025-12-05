import type { KeycloakInstance } from 'keycloak-js';

// ========================================
// Keycloak Role Utilities
// ========================================

/**
 * Role definitions for the application
 */
export const ROLES = {
  DEVELOPER: 'developer',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

/**
 * Check if user has developer role
 */
export function isDeveloper(keycloak: KeycloakInstance): boolean {
  return keycloak.hasRealmRole(ROLES.DEVELOPER);
}

/**
 * Check if user has player role (or no specific role)
 */
export function isPlayer(keycloak: KeycloakInstance): boolean {
  // A player is someone who either has the player role explicitly
  // or doesn't have the developer role
  return !isDeveloper(keycloak);
}

/**
 * Get all roles for the current user
 */
export function getUserRoles(keycloak: KeycloakInstance): string[] {
  if (!keycloak.authenticated || !keycloak.tokenParsed?.realm_access?.roles) {
    return [];
  }
  return keycloak.tokenParsed.realm_access.roles;
}

/**
 * Get user's primary role (highest priority role)
 * Priority: developer > player > none
 */
export function getPrimaryRole(keycloak: KeycloakInstance): UserRole | null {
  if (!keycloak.authenticated) {
    return null;
  }

  if (isDeveloper(keycloak)) {
    return ROLES.DEVELOPER;
  }

  return ROLES.DEVELOPER;
}

/**
 * Get the appropriate dashboard URL for the user based on their role
 */
export function getDashboardUrl(keycloak: KeycloakInstance): string {
  const role = getPrimaryRole(keycloak);

  switch (role) {
    case ROLES.DEVELOPER:
      return '/developer/dashboard';
    default:
      return '/games';
  }
}

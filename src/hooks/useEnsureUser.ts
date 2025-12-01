import { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useMutation } from '@tanstack/react-query';
import { registerDeveloper } from '../api/developers';

// ========================================
// Ensure User Hook
// ========================================

/**
 * Hook that ensures the authenticated user exists in the backend database
 *
 * NOTE: This hook is currently NOT USED in the application.
 * User registration logic has been moved to AuthCallback.tsx to support
 * role-based registration (developers vs players).
 *
 * This hook:
 * - Runs after successful Keycloak authentication
 * - Makes a POST request to register/sync the user with the backend
 * - Creates a developer record if it doesn't exist (backend extracts info from JWT)
 * - Only runs once when the user first authenticates
 *
 * Legacy Usage:
 * Call this hook in a component that wraps protected routes (e.g., App.tsx)
 *
 * useEnsureUser();
 */

export function useEnsureUser() {
  const { keycloak, initialized } = useKeycloak();

  // Mutation to register/sync user with backend
  const { mutate: ensureUser, isPending, isError } = useMutation({
    mutationFn: async () => {
      // Register developer in backend
      // The backend extracts developer info (ID, email, name) from the JWT token
      // and handles this idempotently (creates if not exists, or returns existing)
      const response = await registerDeveloper();

      console.log('[useEnsureUser] Developer registered/synced:', response);
      return response;
    },
    onError: (error) => {
      console.error('[useEnsureUser] Failed to register developer:', error);
      // Don't throw - allow the user to continue even if registration fails
      // The backend API calls will handle the 404 error appropriately
    },
  });

  // Run when Keycloak is initialized and user is authenticated
  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      // Check if we've already synced this session
      const syncKey = `user_synced_${keycloak.tokenParsed?.sub}`;
      const alreadySynced = sessionStorage.getItem(syncKey);

      if (!alreadySynced) {
        console.log('[useEnsureUser] Ensuring user exists in backend...');
        ensureUser();

        // Mark as synced for this session
        sessionStorage.setItem(syncKey, 'true');
      }
    }
  }, [initialized, keycloak.authenticated, keycloak.tokenParsed?.sub, ensureUser]);

  return {
    isPending,
    isError,
  };
}

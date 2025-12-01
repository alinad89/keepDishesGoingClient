import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { registerDeveloper } from '../api/developers';
import { isDeveloper, ROLES } from '../utils/keycloakRoles';

// ========================================
// Authentication Callback Page
// ========================================

/**
 * Callback page after Keycloak authentication
 *
 * This page:
 * - Handles redirect after login/registration
 * - Checks user's Keycloak role
 * - Registers developer in backend if needed
 * - Routes users to appropriate page based on role
 */

export default function AuthCallback() {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get the intended role from query params (set during registration)
  const intendedRole = searchParams.get('role');

  // Check for error in URL (from failed auth)
  // Errors can come as query params OR hash fragments
  const error = searchParams.get('error') ||
    new URLSearchParams(window.location.hash.substring(1)).get('error');

  // Mutation to register developer in backend
  const { mutate: ensureDeveloper } = useMutation({
    mutationFn: async () => {
      const response = await registerDeveloper();
      console.log('[AuthCallback] Developer registered:', response);
      return response;
    },
    onSuccess: () => {
      // Redirect to developer dashboard after successful registration
      navigate('/developer/dashboard');
    },
    onError: (error) => {
      console.error('[AuthCallback] Failed to register developer:', error);
      // Still redirect to dashboard, backend might already have the user
      navigate('/developer/dashboard');
    },
  });

  useEffect(() => {
    console.log('[AuthCallback] State:', {
      initialized,
      authenticated: keycloak.authenticated,
      error,
      currentUrl: window.location.href,
      hash: window.location.hash,
      search: window.location.search,
    });

    // Handle authentication errors
    if (initialized && error) {
      console.error('[AuthCallback] Authentication error detected:', error);
      // Redirect back to auth landing page on error (replace to prevent loop)
      navigate('/auth', { replace: true });
      return;
    }

    if (!initialized) {
      console.log('[AuthCallback] Waiting for Keycloak initialization...');
      return;
    }

    // If not authenticated after initialization, redirect to login
    if (!keycloak.authenticated) {
      console.log('[AuthCallback] Not authenticated after init, redirecting...');
      navigate('/auth', { replace: true });
      return;
    }

    // Check if user has developer role in Keycloak
    const hasDeveloperRole = isDeveloper(keycloak);

    // IMPORTANT: If user registered as developer but doesn't have the role yet,
    // you'll need to handle role assignment in Keycloak first.
    // For now, we'll check both the intended role and actual role.

    if (intendedRole === ROLES.DEVELOPER || hasDeveloperRole) {
      // User is a developer - register in backend and redirect to dashboard
      const syncKey = `user_synced_${keycloak.tokenParsed?.sub}`;
      const alreadySynced = sessionStorage.getItem(syncKey);

      if (!alreadySynced) {
        console.log('[AuthCallback] Registering developer in backend...');
        ensureDeveloper();
        sessionStorage.setItem(syncKey, 'true');
      } else {
        // Already synced, just redirect
        navigate('/developer/dashboard');
      }
    } else {
      // User is a player - redirect to games page
      console.log('[AuthCallback] Player login, redirecting to games...');
      navigate('/games');
    }
  }, [initialized, keycloak.authenticated, keycloak, intendedRole, ensureDeveloper, navigate, error]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Setting up your account...
      </Typography>
    </Box>
  );
}

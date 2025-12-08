import { type ReactNode } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';

// ========================================
// Protected Route Component
// ========================================

/**
 * Protected route component that guards access to developer routes
 *
 * This component:
 * - Shows loading state while Keycloak initializes
 * - Redirects to login if user is not authenticated
 * - Verifies user has developer role
 * - Shows access denied message if user is not a developer
 * - Renders children only when user is authenticated and has developer role
 *
 * Usage:
 * <Protected>
 *   <YourProtectedDeveloperComponent />
 * </Protected>
 */

interface ProtectedProps {
  children: ReactNode;
  requireRole?: string | string[]; // Optional: specify required role(s) (defaults to 'developer')
}

export function Protected({ children, requireRole = 'developer' }: ProtectedProps) {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  // Show loading state while Keycloak is initializing
  if (!initialized) {
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
          Initializing authentication...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!keycloak.authenticated) {
    // Redirect to callback page after successful login
    const redirectUri = `${window.location.origin}/auth/callback`;

    // Trigger Keycloak login flow
    keycloak.login({ redirectUri });

    // Show loading while redirecting to Keycloak
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
          Redirecting to login...
        </Typography>
      </Box>
    );
  }

  // Check if user has required role(s)
  const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
  const hasRequiredRole = roles.some((role) => keycloak.hasRealmRole(role));

  if (!hasRequiredRole) {
    // User is authenticated but doesn't have the required role
    const roleDisplay = roles.length === 1 ? roles[0] : roles.join(' or ');
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: 3,
          px: 3,
          textAlign: 'center',
        }}
      >
        <LockIcon sx={{ fontSize: 80, color: 'error.main' }} />
        <Typography variant="h4" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
          You don't have the required permissions to access this area.
          This section requires the {roleDisplay} role.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/games')}
          sx={{ mt: 2 }}
        >
          Go to Games
        </Button>
      </Box>
    );
  }

  // User is authenticated and has required role - render children
  return <>{children}</>;
}

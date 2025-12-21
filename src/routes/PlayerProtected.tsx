import { type ReactNode } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';

interface PlayerProtectedProps {
  children: ReactNode;
}

export function PlayerProtected({ children }: PlayerProtectedProps) {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

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

  if (!keycloak.authenticated) {
    const redirectUri = `${window.location.origin}/auth/callback`;
    keycloak.login({ redirectUri });

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

  const isAdmin = keycloak.hasRealmRole('admin');
  const isDeveloper = keycloak.hasRealmRole('developer');

  if (isAdmin || isDeveloper) {
    const redirectPath = isAdmin ? '/developer/games' : '/developer/dashboard';
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
          This library is only available to player accounts.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(redirectPath)}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }

  return <>{children}</>;
}

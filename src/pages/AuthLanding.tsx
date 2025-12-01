import { useKeycloak } from '@react-keycloak/web';
import { Box, Button, Container, Typography, Paper, Stack, Divider } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import CodeIcon from '@mui/icons-material/Code';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { getDashboardUrl } from '../utils/keycloakRoles';

// ========================================
// Authentication Landing Page
// ========================================

/**
 * Landing page for authentication
 *
 * This page provides:
 * - Login button that redirects to Keycloak login
 * - Two registration options: Developer and Player
 * - Automatic redirect based on user role if already authenticated
 */

export default function AuthLanding() {
  const { keycloak, initialized } = useKeycloak();
  const navigate = useNavigate();

  // Redirect based on user role if already authenticated
  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      const dashboardUrl = getDashboardUrl(keycloak);
      navigate(dashboardUrl);
    }
  }, [initialized, keycloak.authenticated, navigate, keycloak]);

  // Handle login button click
  const handleLogin = () => {
    // Login will redirect to a callback page that determines routing based on role
    const redirectUri = `${window.location.origin}`;
    keycloak.login({ redirectUri });
  };

  // Handle developer registration
  const handleDeveloperRegister = () => {
    // Register with a redirect URI that includes role information
    const redirectUri = `${window.location.origin}`;
    keycloak.register({ redirectUri });
  };

  // Handle player registration
  const handlePlayerRegister = () => {
    // Register with a redirect URI that includes role information
    const redirectUri = `${window.location.origin}`;
    keycloak.register({ redirectUri });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Hexagon Platform
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your account or create a new one to get started.
          </Typography>

          <Stack spacing={3}>
            {/* Sign In Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleLogin}
              startIcon={<LoginIcon />}
              disabled={!initialized}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #65408d 100%)',
                },
              }}
            >
              Sign In
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Or create a new account
              </Typography>
            </Divider>

            {/* Developer Sign Up */}
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleDeveloperRegister}
              startIcon={<CodeIcon />}
              disabled={!initialized}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderWidth: 2,
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#5568d3',
                  backgroundColor: 'rgba(102, 126, 234, 0.04)',
                },
              }}
            >
              Sign Up as Developer
            </Button>

            {/* Player Sign Up */}
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handlePlayerRegister}
              startIcon={<SportsEsportsIcon />}
              disabled={!initialized}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderWidth: 2,
                borderColor: '#764ba2',
                color: '#764ba2',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: '#65408d',
                  backgroundColor: 'rgba(118, 75, 162, 0.04)',
                },
              }}
            >
              Sign Up as Player
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 4, display: 'block' }}>
            Secure authentication powered by Keycloak
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

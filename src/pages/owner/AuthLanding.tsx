// src/owner/AuthLanding.tsx
import { useKeycloak } from '@react-keycloak/web';
import { Box, Card, CardContent, Typography, Stack, Button } from '@mui/material';

export default function AuthLanding() {
    const { keycloak, initialized } = useKeycloak();
    const afterAuthUri = `${window.location.origin}/owner`;

    const logoutThen = async (next: () => void) => {
        try {
            await keycloak.logout({ redirectUri: `${window.location.origin}/start-owner` });
            // We’ll come back to this page; give the browser a tick and then run next
            setTimeout(next, 50);
        } catch {
            next();
        }
    };

    const signIn = async () => {
        if (!initialized) return;
        await keycloak.login({
            redirectUri: afterAuthUri,
            prompt: 'login',
            scope: 'openid email profile',
        });
    };

    const signUp = async () => {
        if (!initialized) return;

        const goRegister = () =>
            keycloak.register({
                redirectUri: afterAuthUri,
                prompt: 'login', // ensures we’re not auto-logged as someone else
                scope: 'openid email profile',
            });

        if (keycloak.authenticated) {
            // already signed in as someone else -> sign out first
            await logoutThen(goRegister);
        } else {
            await goRegister();
        }
    };

    return (
        <Box sx={{ minHeight: '100svh', display: 'grid', placeItems: 'center', bgcolor: '#0f1115' }}>
            <Card sx={{ width: 460, borderRadius: 4, boxShadow: 8 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ mb: 2, letterSpacing: 1 }}>Keep Dishes Going</Typography>
                    <Typography variant="h6" sx={{ mb: 3 }}>Owner access</Typography>

                    <Stack spacing={1.5}>
                        <Button variant="contained" size="large" onClick={signIn} disabled={!initialized}>
                            Sign in
                        </Button>
                        <Button variant="outlined" size="large" onClick={signUp} disabled={!initialized}>
                            Create account
                        </Button>
                    </Stack>

                    <Typography variant="body2" sx={{ mt: 2, opacity: 0.7 }}>
                        You’ll be redirected to our secure identity page to finish.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}

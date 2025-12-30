import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'
import { theme } from './theme'
import './index.css'
import './styles/PageLayout.css'
import './styles/utilities.css'
import App from './App.tsx'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: true,
        },
    },
})

// Keycloak initialization options
// - onLoad: 'check-sso' checks for existing SSO session without forcing login
// - pkceMethod: 'S256' enables PKCE (Proof Key for Code Exchange) for security
// - checkLoginIframe: false disables iframe-based session checks (can cause issues)
const keycloakInitOptions = {
    onLoad: 'check-sso' as const,
    pkceMethod: 'S256' as const,
    checkLoginIframe: false,
}

// Keycloak event handlers for debugging
const keycloakOnEvent = (event: string, error?: unknown) => {
    console.log('[Keycloak Event]', event, error ? { error } : '');
}

const keycloakOnTokens = (tokens: { token?: string; refreshToken?: string; idToken?: string }) => {
    console.log('[Keycloak Tokens]', {
        hasToken: !!tokens.token,
        hasRefreshToken: !!tokens.refreshToken,
        hasIdToken: !!tokens.idToken,
    });
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={keycloakInitOptions}
            onEvent={keycloakOnEvent}
            onTokens={keycloakOnTokens}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </ThemeProvider>
        </ReactKeycloakProvider>
    </StrictMode>,
)

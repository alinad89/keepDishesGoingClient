import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from "./keycloak.ts";

createRoot(document.getElementById('root')!).render(

    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
            onLoad: 'check-sso',
            pkceMethod: 'S256',
            checkLoginIframe: false,
        }}
        autoRefreshToken={true}
        onTokens={(tokens) => {
            // Automatically refresh token when it's about to expire
            if (tokens.token) {
                // Token will be refreshed automatically by the library
                console.log('Token refreshed');
            }
        }}
    >
        <App/>
    </ReactKeycloakProvider>
)

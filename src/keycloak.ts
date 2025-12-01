import Keycloak from 'keycloak-js';

// ========================================
// Keycloak Configuration
// ========================================

/**
 * Keycloak client instance configuration
 *
 * This initializes the Keycloak client with configuration from environment variables.
 * The client handles OAuth 2.0 / OpenID Connect authentication flow.
 */
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'sillyseal',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'sillyseal-frontend',
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

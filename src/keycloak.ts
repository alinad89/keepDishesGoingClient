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
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

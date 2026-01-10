import Keycloak from 'keycloak-js';

// ========================================
// Keycloak Configuration
// ========================================

/**
 * Keycloak client instance configuration
 *
 * This initializes the Keycloak client with hardcoded configuration.
 * The client handles OAuth 2.0 / OpenID Connect authentication flow.
 */
const keycloakConfig = {
  url: 'http://localhost:8180/',
  realm: 'sillyseal',
  clientId: 'sillyseal-frontend',
};

// Initialize Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;

import http from './http';
import type { RegisterDeveloperResponse } from '../types/api';

/**
 * Register a developer
 * POST /api/developers
 * Developer info is derived from JWT token, no body needed
 *
 * The backend extracts the developer information from the JWT token:
 * - ID: from token 'sub' claim (Keycloak user ID)
 * - Email: from token 'email' claim
 * - Name: from token 'name' or 'preferred_username' claim
 *
 * This endpoint is idempotent - it will create the developer if they don't exist,
 * or return the existing developer if they do.
 */
export async function registerDeveloper(): Promise<RegisterDeveloperResponse> {
  const response = await http.post<RegisterDeveloperResponse>('/developers');
  return response.data;
}

/**
 * Assign a Keycloak role to the current user
 * POST /api/users/assign-role?role={roleName}
 *
 * Note: This endpoint needs to be implemented in your backend.
 * The backend should use Keycloak Admin API to assign the role.
 */
export async function assignUserRole(role: string): Promise<void> {
  await http.post('/users/assign-role', null, {
    params: { role },
  });
}

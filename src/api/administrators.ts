import http from './http';
import type { RegisterAdministratorResponse } from '../types/api';

/**
 * Register an administrator
 * POST /api/admins
 * Administrator info is derived from JWT token, no body needed
 *
 * The backend extracts the administrator information from the JWT token:
 * - ID: from token 'sub' claim (Keycloak user ID)
 * - Email: from token 'email' claim
 * - Sub: from token 'sub' claim
 *
 * This endpoint is idempotent - it will create the administrator if they don't exist,
 * or return the existing administrator if they do.
 */
export async function registerAdministrator(): Promise<RegisterAdministratorResponse> {
  const response = await http.post<RegisterAdministratorResponse>('/admins');
  return response.data;
}

import { DEVELOPER_ENDPOINTS, apiPost } from './config';
import type { RegisterDeveloperResponse } from '../types/api';

/**
 * Register a developer
 * POST /api/developers
 * Developer info is derived from JWT token, no body needed
 */
export async function registerDeveloper(): Promise<RegisterDeveloperResponse> {
  return apiPost<RegisterDeveloperResponse>(DEVELOPER_ENDPOINTS.register);
}

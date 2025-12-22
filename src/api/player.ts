import type { PlayerResponse } from '../types/api';
import { PLATFORM_ENDPOINTS, apiPost } from './config';

// Re-export types for convenience
export type { PlayerResponse };

/**
 * Register a player
 * POST /api/players
 */
export async function registerPlayer(): Promise<PlayerResponse> {
  return await apiPost<PlayerResponse>(PLATFORM_ENDPOINTS.players);
}

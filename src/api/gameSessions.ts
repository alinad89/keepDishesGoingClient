import type { GameSessionListResponse } from '../types/game-session.types';
import { apiGet, PLATFORM_ENDPOINTS } from './config';

/**
 * Fetch finished games for the current user
 * GET /api/game-sessions/me
 */
export async function fetchMyGameSessions(): Promise<GameSessionListResponse> {
  const data = await apiGet<GameSessionListResponse>(PLATFORM_ENDPOINTS.gameSessionsMe);
  return data || [];
}

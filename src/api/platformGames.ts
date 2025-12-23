import type { PlatformGame, PlatformGameDetails } from '../types/game.types';
import { PLATFORM_ENDPOINTS, apiGet } from './config';

// Re-export types for convenience
export type { PlatformGame, PlatformGameDetails };

/**
 * Fetch all platform games
 * GET /api/platform/games
 * No authentication required
 * @param searchQuery Optional search query
 * @param filterBy Optional filter by tags (comma-separated)
 */
export async function fetchPlatformGames(
  searchQuery?: string,
  filterBy?: string
): Promise<PlatformGame[]> {
  let endpoint: string = PLATFORM_ENDPOINTS.platformGames;
  const params = new URLSearchParams();

  if (searchQuery) {
    params.append('searchQuery', searchQuery);
  }

  if (filterBy) {
    params.append('filterBy', filterBy);
  }

  const queryString = params.toString();
  if (queryString) {
    endpoint = `${endpoint}?${queryString}`;
  }

  const data = await apiGet<PlatformGame[]>(endpoint);
  return data || [];
}

/**
 * Fetch a single platform game by ID with achievements
 * GET /api/platform/games/{id}
 * No authentication required
 */
export async function fetchPlatformGameById(gameId: string): Promise<PlatformGameDetails> {
  const data = await apiGet<PlatformGameDetails>(PLATFORM_ENDPOINTS.platformGameById(gameId));
  return data;
}

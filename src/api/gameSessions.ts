import type { GameSessionListResponse, GameSessionDetail } from '../types/game-session.types';
import { apiGet, PLATFORM_ENDPOINTS } from './config';
import { fetchGameLibrary } from './gameLibrary';

/**
 * Fetch detailed information about a specific game session
 * GET /api/games/{gameId}/game-sessions/{sessionId}
 */
export async function fetchGameSessionDetail(gameId: string, sessionId: string): Promise<GameSessionDetail> {
  const data = await apiGet<GameSessionDetail>(PLATFORM_ENDPOINTS.gameSessionDetail(gameId, sessionId));
  return data;
}

/**
 * Fetch finished games for the current user across all owned games
 * First fetches the game library, then fetches sessions for each owned game
 */
export async function fetchMyGameSessions(): Promise<GameSessionListResponse> {
  // Fetch user's game library to get all owned games
  const gameLibrary = await fetchGameLibrary();

  // If user has no games, return empty array
  if (!gameLibrary || gameLibrary.length === 0) {
    return [];
  }

  // Fetch game sessions for each owned game
  const sessionPromises = gameLibrary.map(async (entry) => {
    try {
      const sessions = await apiGet<GameSessionListResponse>(
        PLATFORM_ENDPOINTS.gameSessionsMe(entry.game.id)
      );
      // Add gameId to each session for later detail fetching
      return (sessions || []).map(session => ({
        ...session,
        gameId: entry.game.id
      }));
    } catch (error) {
      console.error(`Failed to fetch sessions for game ${entry.game.id}:`, error);
      return [];
    }
  });

  // Wait for all requests to complete and flatten the results
  const allSessionArrays = await Promise.all(sessionPromises);
  const allSessions = allSessionArrays.flat();

  return allSessions;
}

import { useQuery } from '@tanstack/react-query';
import {
  fetchPlatformGames,
  fetchPlatformGameById,
  type PlatformGame,
  type PlatformGameDetails,
} from '../api/platformGames';
import { ApiError } from '../api/config';

// Re-export types for convenience
export type { PlatformGame, PlatformGameDetails };

/**
 * Hook to fetch all platform games
 * GET /api/platform/games
 * No authentication required
 */
export function usePlatformGames(searchQuery?: string, filterBy?: string) {
  const {
    data: games = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PlatformGame[], Error>({
    queryKey: ['platformGames', searchQuery, filterBy],
    queryFn: () => fetchPlatformGames(searchQuery, filterBy),
  });

  return {
    games,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

/**
 * Hook to fetch a single platform game by ID with achievements
 * GET /api/platform/games/{id}
 * No authentication required
 */
export function usePlatformGame(gameId?: string | null) {
  const {
    data: game = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PlatformGameDetails, Error>({
    queryKey: ['platformGame', gameId],
    queryFn: () => {
      if (!gameId) {
        throw new Error('Game ID is required');
      }
      return fetchPlatformGameById(gameId);
    },
    enabled: Boolean(gameId),
  });

  return {
    game,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

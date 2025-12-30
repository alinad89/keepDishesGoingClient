import { useQuery } from '@tanstack/react-query';
import { fetchMyGameSessions } from '../api/gameSessions';
import type { GameSessionListResponse } from '../types/game-session.types';

/**
 * Hook to fetch current user's finished game sessions
 * GET /api/game-sessions/me
 */
export function useGameSessions(enabled: boolean) {
  const {
    data: gameSessions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<GameSessionListResponse, Error>({
    queryKey: ['gameSessions', 'me'],
    queryFn: fetchMyGameSessions,
    enabled,
  });

  return {
    gameSessions,
    isLoading,
    isError,
    error,
    refetch,
  };
}

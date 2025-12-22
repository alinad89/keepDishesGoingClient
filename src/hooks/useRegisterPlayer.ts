import { useMutation } from '@tanstack/react-query';
import { registerPlayer } from '../api/player';
import type { PlayerResponse } from '../types/api';
import { ApiError } from '../api/config';

/**
 * Hook to register a player
 * POST /api/players
 */
export function useRegisterPlayer() {
  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<PlayerResponse, Error>({
    mutationFn: registerPlayer,
  });

  return {
    registerPlayer: mutate,
    registerPlayerAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

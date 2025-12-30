import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useKeycloak } from '@react-keycloak/web';
import {
  fetchGames,
  fetchGameById,
  createGame,
  updateGame,
  changeGameStatus,
  deleteGame,
  triggerSelfPlay,
  type Game,
  type CreateGameRequest,
  type CreateGameResponse,
  type UpdateGameRequest,
  type ChangeGameStatusRequest,
  type TriggerSelfPlayRequest,
  fetchPublishedGames,
} from '../api/games';
import type {GameStatusAction, PlatformGame} from '../types/game.types';
import { ApiError } from '../api/config';

// Re-export types for convenience
export type {
  Game,
  CreateGameRequest,
  CreateGameResponse,
  UpdateGameRequest,
  ChangeGameStatusRequest,
  GameStatusAction,
  TriggerSelfPlayRequest,
};

export interface PlatformGamesFilters {
  searchQuery?: string;
  filterBy?: string[];
}

/**
 * Hook to fetch all games
 * GET /api/games
 */
export function useGames() {
  const {
    data: games = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Game[], Error>({
    queryKey: ['games'],
    queryFn: fetchGames,
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
 * Hook to fetch platform available games
 * /api/platform/games
 */
export function usePlatformGames(filters: PlatformGamesFilters = {}) {
  const { keycloak, initialized } = useKeycloak();

  const {
    data: games = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PlatformGame[], Error>({
    queryKey: [
      'platformGames',
      filters.searchQuery || '',
      (filters.filterBy || []).join(','),
      keycloak.authenticated ? 'auth' : 'anon',
    ],
    queryFn: () => fetchPublishedGames(filters),
    enabled: initialized,
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
 * Hook to fetch a single game by ID
 * GET /api/games/{id}
 */
export function useGame(gameId?: string | null) {
  const {
    data: game = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Game, Error>({
    queryKey: ['game', gameId],
    queryFn: () => {
      if (!gameId) {
        throw new Error('Game ID is required');
      }
      return fetchGameById(gameId);
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

/**
 * Hook to create a new game
 * POST /api/games
 */
export function useCreateGame() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<CreateGameResponse, Error, CreateGameRequest>({
    mutationFn: (gameData: CreateGameRequest) => createGame(gameData),
    onSuccess: () => {
      // Invalidate games list to refetch with new game
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  return {
    createGame: mutate,
    createGameAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to update an existing game
 * PATCH /api/games/{id}
 */
export function useUpdateGame() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, { gameId: string; updates: UpdateGameRequest }>({
    mutationFn: ({ gameId, updates }) => updateGame(gameId, updates),
    onSuccess: (_, variables) => {
      // Invalidate both the specific game and games list
      queryClient.invalidateQueries({ queryKey: ['game', variables.gameId] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  return {
    updateGame: (gameId: string, updates: UpdateGameRequest) =>
      mutate({ gameId, updates }),
    updateGameAsync: (gameId: string, updates: UpdateGameRequest) =>
      mutateAsync({ gameId, updates }),
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to change game status
 * PATCH /api/games/{id}/status
 */
export function useChangeGameStatus() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, ChangeGameStatusRequest>({
    mutationFn: (request: ChangeGameStatusRequest) => changeGameStatus(request),
    onSuccess: (_, variables) => {
      // Invalidate both the specific game and games list
      queryClient.invalidateQueries({ queryKey: ['game', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  return {
    changeStatus: mutate,
    changeStatusAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to delete a game
 * DELETE /api/games/{id}
 */
export function useDeleteGame() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, string>({
    mutationFn: (gameId: string) => deleteGame(gameId),
    onSuccess: (_, gameId) => {
      // Remove the specific game from cache and invalidate games list
      queryClient.removeQueries({ queryKey: ['game', gameId] });
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
  });

  return {
    deleteGame: mutate,
    deleteGameAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to trigger self-play for a game
 * POST /api/games/{id}/selfplay
 */
export function useTriggerSelfPlay() {
  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, { gameId: string; request: TriggerSelfPlayRequest }>({
    mutationFn: ({ gameId, request }) => triggerSelfPlay(gameId, request),
  });

  return {
    triggerSelfPlay: (gameId: string, request: TriggerSelfPlayRequest) =>
      mutate({ gameId, request }),
    triggerSelfPlayAsync: (gameId: string, request: TriggerSelfPlayRequest) =>
      mutateAsync({ gameId, request }),
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

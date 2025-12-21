import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAchievement,
  deleteAchievement,
  fetchGameAchievements,
  updateAchievement,
} from '../api/achievements';
import type {
  Achievement,
  CreateAchievementRequest,
  CreateAchievementResponse,
  UpdateAchievementRequest,
} from '../types/achievement.types';
import { ApiError } from '../api/config';

/**
 * Hook to fetch achievements for a game
 * GET /api/games/{id}/achievements
 */
export function useGameAchievements(gameId?: string | null) {
  const {
    data: achievements = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Achievement[], Error>({
    queryKey: ['gameAchievements', gameId],
    queryFn: () => {
      if (!gameId) {
        throw new Error('Game ID is required');
      }
      return fetchGameAchievements(gameId);
    },
    enabled: Boolean(gameId),
  });

  return {
    achievements,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

/**
 * Hook to create a new achievement
 * POST /api/games/{id}/achievements
 */
export function useCreateAchievement(gameId: string) {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<CreateAchievementResponse, Error, CreateAchievementRequest>({
    mutationFn: (request) => createAchievement(gameId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameAchievements', gameId] });
    },
  });

  return {
    createAchievementAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to update an achievement
 * PATCH /api/games/{id}/achievements/{achId}
 */
export function useUpdateAchievement(gameId: string) {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, { achievementId: string; updates: UpdateAchievementRequest }>({
    mutationFn: ({ achievementId, updates }) =>
      updateAchievement(gameId, achievementId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameAchievements', gameId] });
    },
  });

  return {
    updateAchievementAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to delete an achievement
 * DELETE /api/games/{id}/achievements/{achId}
 */
export function useDeleteAchievement(gameId: string) {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, string>({
    mutationFn: (achievementId) => deleteAchievement(gameId, achievementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gameAchievements', gameId] });
    },
  });

  return {
    deleteAchievementAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

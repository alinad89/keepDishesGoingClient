import { useQuery } from '@tanstack/react-query';
import { fetchRecommendations } from '../api/recommendations';
import type { RecommendationResponse } from '../types/recommendation.types';
import { ApiError } from '../api/config';
import { useAuth } from './useAuth';

/**
 * Hook to fetch game recommendations for the current player
 * GET /api/recommendations/{playerId}
 */
export function useRecommendations() {
  const { userId, isAuthenticated } = useAuth();

  const {
    data: recommendations = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<RecommendationResponse, Error>({
    queryKey: ['recommendations', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return fetchRecommendations(userId);
    },
    enabled: Boolean(userId) && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  return {
    recommendations,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

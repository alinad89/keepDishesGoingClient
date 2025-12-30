import { apiGet } from './config';
import type { RecommendationResponse } from '../types/recommendation.types';

export type { RecommendationResponse };

export const RECOMMENDATION_ENDPOINTS = {
  byPlayerId: (playerId: string) => `/recommendations/${playerId}`,
} as const;

/**
 * Fetch game recommendations for a player
 * GET /api/recommendations/{playerId}
 */
export async function fetchRecommendations(
  playerId: string
): Promise<RecommendationResponse> {
  const data = await apiGet<RecommendationResponse>(
    RECOMMENDATION_ENDPOINTS.byPlayerId(playerId)
  );
  return data;
}

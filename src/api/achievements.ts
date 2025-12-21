import type {
  Achievement,
  CreateAchievementRequest,
  CreateAchievementResponse,
  UpdateAchievementRequest,
} from '../types/achievement.types';
import { apiDelete, apiGet, apiUpload, DEVELOPER_ENDPOINTS } from './config';

/**
 * Fetch all achievements for a game
 * GET /api/games/{id}/achievements
 */
export async function fetchGameAchievements(gameId: string): Promise<Achievement[]> {
  const data = await apiGet<Achievement[] | undefined>(DEVELOPER_ENDPOINTS.gameAchievements(gameId));
  return data || [];
}

/**
 * Create a new achievement for a game
 * POST /api/games/{id}/achievements
 */
export async function createAchievement(
  gameId: string,
  request: CreateAchievementRequest
): Promise<CreateAchievementResponse> {
  const formData = new FormData();
  formData.append('name', request.name);
  formData.append('instructions', request.instructions);
  formData.append('icon', request.icon);

  return apiUpload<CreateAchievementResponse>(
    DEVELOPER_ENDPOINTS.gameAchievements(gameId),
    formData,
    'POST'
  );
}

/**
 * Update an achievement for a game
 * PATCH /api/games/{id}/achievements/{achId}
 */
export async function updateAchievement(
  gameId: string,
  achievementId: string,
  updates: UpdateAchievementRequest
): Promise<void> {
  const formData = new FormData();

  if (updates.name !== undefined) {
    formData.append('name', updates.name);
  }
  if (updates.instructions !== undefined) {
    formData.append('instructions', updates.instructions);
  }
  if (updates.icon) {
    formData.append('icon', updates.icon);
  }

  await apiUpload<void>(
    DEVELOPER_ENDPOINTS.gameAchievementById(gameId, achievementId),
    formData,
    'PATCH'
  );
}

/**
 * Delete an achievement
 * DELETE /api/games/{id}/achievements/{achId}
 */
export async function deleteAchievement(gameId: string, achievementId: string): Promise<void> {
  await apiDelete<void>(DEVELOPER_ENDPOINTS.gameAchievementById(gameId, achievementId));
}

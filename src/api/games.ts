import type {
  Game,
  CreateGameRequest,
  CreateGameResponse,
  UpdateGameRequest,
  ChangeGameStatusRequest,
} from '../types/api';
import {
  DEVELOPER_ENDPOINTS,
  apiGet,
  apiUpload,
  apiPatch,
  apiDelete,
  apiPost,
  USE_MOCK_API,
} from './config';

// Re-export types for convenience
export type {
  Game,
  CreateGameRequest,
  CreateGameResponse,
  UpdateGameRequest,
  ChangeGameStatusRequest,
};

/**
 * Fetch all games
 * GET /api/games
 */
export async function fetchGames(): Promise<Game[]> {
  const data = await apiGet<Game[]>(DEVELOPER_ENDPOINTS.games);
  return data || [];
}

/**
 * Fetch a single game by ID
 * GET /api/games/{id}
 */
export async function fetchGameById(gameId: string): Promise<Game> {
  const data = await apiGet<Game>(DEVELOPER_ENDPOINTS.gameById(gameId));
  return data;
}

/**
 * Create a new game
 * POST /api/games
 */
export async function createGame(
  gameData: CreateGameRequest
): Promise<CreateGameResponse> {
  // If using mock API, send JSON without files
  if (USE_MOCK_API) {
    // Generate a unique ID and key
    const gameId = `game-${Date.now().toString(36)}`;
    const gameKey = `key-${Date.now().toString(36)}`;

    // Create mock game object with placeholder URLs
    const mockGame = {
      id: gameId,
      key: gameKey,
      name: gameData.metadata.name,
      description: gameData.metadata.description,
      thumbnailUrl: `https://picsum.photos/300/200?random=${Date.now()}`,
      coverImageUrl: `https://picsum.photos/1920/1080?random=${Date.now()}`,
      rules: gameData.metadata.rules,
      shortDescription: gameData.metadata.shortDescription,
      tags: gameData.metadata.tags,
      version: gameData.metadata.version,
      url: gameData.metadata.url || `https://example.com/${gameKey}`,
    };

    // Post to JSON Server as simple JSON
    await apiPost<typeof mockGame>(DEVELOPER_ENDPOINTS.games, mockGame);

    return {
      id: gameId,
      key: gameKey,
    };
  }

  // Real API: Build FormData for multipart upload with metadata as JSON
  const formData = new FormData();

  // Add metadata as JSON blob
  const metadataBlob = new Blob([JSON.stringify(gameData.metadata)], {
    type: 'application/json',
  });
  formData.append('metadata', metadataBlob);

  // Add required files
  formData.append('thumbnail', gameData.thumbnail);
  formData.append('coverImage', gameData.coverImage);

  // Add conditional files based on deployment mode
  if (gameData.deploymentMode === 'backend-zip' && gameData.backendFiles) {
    formData.append('backendFiles', gameData.backendFiles);
  }

  const response = await apiUpload<CreateGameResponse>(
    DEVELOPER_ENDPOINTS.games,
    formData,
    'POST'
  );

  return response;
}

/**
 * Update an existing game
 * PATCH /api/games/{id}
 */
export async function updateGame(
  gameId: string,
  updates: UpdateGameRequest
): Promise<void> {
  // Build FormData for multipart upload
  const formData = new FormData();

  if (updates.description !== undefined) {
    formData.append('description', updates.description);
  }
  if (updates.thumbnail) {
    formData.append('thumbnail', updates.thumbnail);
  }
  if (updates.coverImage) {
    formData.append('coverImage', updates.coverImage);
  }
  if (updates.rules !== undefined) {
    formData.append('rules', updates.rules);
  }
  if (updates.shortDescription !== undefined) {
    formData.append('shortDescription', updates.shortDescription);
  }
  if (updates.tags !== undefined) {
    formData.append('tags', JSON.stringify(updates.tags));
  }
  if (updates.version !== undefined) {
    formData.append('version', updates.version);
  }
  if (updates.backendFiles) {
    formData.append('backendFiles', updates.backendFiles);
  }
  if (updates.frontendFiles) {
    formData.append('frontendFiles', updates.frontendFiles);
  }

  await apiUpload<void>(
    DEVELOPER_ENDPOINTS.gameById(gameId),
    formData,
    'PATCH'
  );
}

/**
 * Change game status
 * PATCH /api/games/{id}/status
 */
export async function changeGameStatus(
  request: ChangeGameStatusRequest
): Promise<void> {
  await apiPatch<void>(DEVELOPER_ENDPOINTS.gameStatus(request.id), request);
}

/**
 * Delete a game
 * DELETE /api/games/{id}
 */
export async function deleteGame(gameId: string): Promise<void> {
  await apiDelete<void>(DEVELOPER_ENDPOINTS.gameById(gameId));
}

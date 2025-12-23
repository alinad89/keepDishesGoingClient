import type {
  CreateLobbyRequest,
  CreateLobbyResponse,
  ChangeLobbyStatusRequest,
  ChangeLobbyModeRequest,
  PlayerResponse,
  MyLobbyResponse,
  MyLobbyBackendResponse,
  LobbyInvitation,
  CreateLobbyInvitationRequest,
  CreateLobbyInvitationResponse,
  Player,
  LobbyMode,
  BackendAiType,
} from '../types/api';
import {
  PLATFORM_ENDPOINTS,
  SOCIAL_ENDPOINTS,
  apiPost,
  apiPatch,
  apiGet,
  apiDelete,
} from './config';

// Re-export types for convenience
export type {
  CreateLobbyRequest,
  CreateLobbyResponse,
  ChangeLobbyStatusRequest,
  ChangeLobbyModeRequest,
  MyLobbyResponse,
  LobbyInvitation,
  CreateLobbyInvitationRequest,
  CreateLobbyInvitationResponse,
  LobbyMode,
};

/**
 * Register a player
 * POST /api/players
 */
export async function registerPlayer(): Promise<PlayerResponse> {
  return await apiPost<PlayerResponse>(PLATFORM_ENDPOINTS.players);
}

/**
 * Create a new lobby
 * POST /api/lobbies
 */
export async function createLobby(
  request: CreateLobbyRequest
): Promise<CreateLobbyResponse> {
  return await apiPost<CreateLobbyResponse>(
    PLATFORM_ENDPOINTS.lobbies,
    request
  );
}

/**
 * Map backend AiType to frontend LobbyMode
 */
function mapAiTypeToLobbyMode(aiType?: BackendAiType): LobbyMode | undefined {
  if (!aiType) return undefined;

  switch (aiType) {
    case 'NONE':
      return 'PVP';
    case 'MCTS':
      return 'PVE_WITH_MCTS';
    case 'ML':
      return 'PVE_WITH_ML';
    default:
      return undefined;
  }
}

/**
 * Get my current lobby
 * GET /api/lobbies/me
 * Returns 204 No Content if not in a lobby
 */
export async function getMyLobby(): Promise<MyLobbyResponse | null> {
  try {
    const result = await apiGet<MyLobbyBackendResponse>(PLATFORM_ENDPOINTS.myLobby);

    if (!result) {
      return null;
    }

    console.log('[API] Backend lobby response:', result);
    console.log('[API] Backend aiType field:', result.aiType);
    console.log('[API] Mapped mode:', mapAiTypeToLobbyMode(result.aiType));

    // Transform backend response to frontend format
    const frontendResponse: MyLobbyResponse = {
      lobbyId: result.lobbyId,
      status: result.status,
      mode: mapAiTypeToLobbyMode(result.aiType),
      game: {
        id: result.game.id,
        name: result.game.name,
        thumbnailUrl: result.game.thumbnailUrl,
      },
      otherParticipants: result.otherParticipants || [],
      isOwner: result.isOwner ?? false,
      gameSessionLink: result.gameSessionLink,
      playerIds: result.playerIds,
    };

    return frontendResponse;
  } catch (error) {
    // 204 No Content or error means no lobby
    return null;
  }
}

/**
 * Change lobby status (e.g., start game)
 * PATCH /api/lobbies/me/status
 */
export async function changeLobbyStatus(
  request: ChangeLobbyStatusRequest
): Promise<void> {
  return await apiPatch<void>(PLATFORM_ENDPOINTS.lobbyStatus, request);
}

/**
 * Change lobby AI type/mode (PvP, PvE with ML, PvE with MCTS)
 * PATCH /api/lobbies/me/ai-type
 */
export async function changeLobbyAiType(
  request: ChangeLobbyModeRequest
): Promise<void> {
  return await apiPatch<void>(PLATFORM_ENDPOINTS.lobbyAiType, request);
}

/**
 * Leave current lobby
 * DELETE /api/lobbies/me
 */
export async function leaveLobby(): Promise<void> {
  return await apiDelete<void>(PLATFORM_ENDPOINTS.myLobby);
}

/**
 * Send a lobby invitation
 * POST /api/lobby-invitations
 */
export async function sendLobbyInvitation(
  request: CreateLobbyInvitationRequest
): Promise<CreateLobbyInvitationResponse> {
  return await apiPost<CreateLobbyInvitationResponse>(
    SOCIAL_ENDPOINTS.lobbyInvitations,
    request
  );
}

/**
 * Get my lobby invitations
 * GET /api/lobby-invitations/me
 */
export async function getMyLobbyInvitations(): Promise<LobbyInvitation[]> {
  try {
    const result = await apiGet<LobbyInvitation[]>(SOCIAL_ENDPOINTS.myLobbyInvitations);

    // Handle 204 No Content (returns undefined)
    if (!result) {
      return [];
    }

    return result;
  } catch (error) {
    return [];
  }
}

/**
 * Accept a lobby invitation
 * PATCH /api/lobby-invitations/{id}/accepted
 */
export async function acceptLobbyInvitation(invitationId: string): Promise<void> {
  return await apiPatch<void>(
    SOCIAL_ENDPOINTS.acceptLobbyInvitation(invitationId)
  );
}

/**
 * Get all players (for invitations)
 * GET /api/players
 * Returns 204 No Content if no players exist
 */
export async function getAllPlayers(): Promise<Player[]> {
  try {
    const result = await apiGet<Player[]>(PLATFORM_ENDPOINTS.allPlayers);
    return result || [];
  } catch (error) {
    return [];
  }
}

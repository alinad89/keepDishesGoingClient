// ========================================
// API Error Response
// ========================================

export interface ApiErrorResponse {
  timestamp: string; // ISO-8601
  status: number;
  error: string; // e.g. "BAD_REQUEST", "NOT_FOUND"
  message: string;
  path: string;
}

// ========================================
// Developer BC Types
// ========================================

// Developer
export interface Developer {
  id: string;
}

export interface RegisterDeveloperResponse {
  id: string;
}

// Game
export interface Game {
  id: string;
  key: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  coverImageUrl: string;
  rules: string;
  shortDescription: string;
  tags: string[];
  version: string;
  url: string;
}

export type DeploymentMode = 'url' | 'backend-zip';

export interface GameMetadata {
  name: string;
  description: string;
  rules: string;
  shortDescription: string;
  tags: string[];
  version: string;
  url: string;
}

export interface CreateGameRequest {
  deploymentMode: DeploymentMode;
  metadata: GameMetadata;
  thumbnail: File;
  coverImage: File;
  backendFiles?: File;
}

export interface CreateGameResponse {
  id: string;
  key: string;
}

export interface UpdateGameRequest {
  description?: string;
  thumbnail?: File;
  coverImage?: File;
  rules?: string;
  shortDescription?: string;
  tags?: string[];
  version?: string;
  backendFiles?: File;
  frontendFiles?: File;
}

export type GameStatusAction =
  | 'MARK-READY-FOR-PUBLISHING'
  | 'MARK-ONLINE'
  | 'MARK-REJECTED';

export interface ChangeGameStatusRequest {
  id: string;
  action: GameStatusAction;
}

// Achievement
export interface Achievement {
  id: string;
  name: string;
  iconUrl: string;
  instructions: string;
}

export interface CreateAchievementRequest {
  name: string;
  icon: File;
  instructions: string;
}

export interface CreateAchievementResponse {
  id: string;
}

export interface UpdateAchievementRequest {
  name?: string;
  icon?: File;
  instructions?: string;
}

// ========================================
// Chatbot BC Types
// ========================================

export interface PlatformInfo {
  gameplayInfo: string;
  navigationInfo: string;
  accountManagement: string;
}

export interface ChatMessage {
  aiMessage: boolean;
  content: string;
}

export interface Chat {
  id: string;
  chatName: string;
  messages: ChatMessage[];
}

export interface ChatListItem {
  id: string;
  chatName: string;
}

export interface CreateMessageRequest {
  message: string;
}

export interface CreateMessageResponse {
  id?: string; // Deprecated: some endpoints might use this
  chatId: string; // The actual field the backend returns
  message?: ChatMessage; // Optional: Backend might include AI response here
}

// ========================================
// Platform BC Types - Lobby
// ========================================

export interface Lobby {
  id: string;
  key: string;
  gameId: string;
  status: 'WAITING' | 'IN_GAME' | 'FINISHED';
  withAi: boolean;
}

export interface CreateLobbyRequest {
  gameId: string;
}

export interface CreateLobbyResponse {
  lobbyId: string;
}

export type LobbyStatusAction = 'START_GAME';

export interface ChangeLobbyStatusRequest {
  action: LobbyStatusAction;
}

export interface PlayerResponse {
  id: string;
}

// ========================================
// Social BC Types - Lobby Invitations
// ========================================

export interface LobbyInvitation {
  id: string;
  sender: PlayerInfo;
  receiver: PlayerInfo;
  lobbyId: string;
  timestamp: string;
}

export interface PlayerInfo {
  id: string;
  username: string;
}

export interface CreateLobbyInvitationRequest {
  receiver: string; // Player ID
  lobby: string; // Lobby ID
}

export interface CreateLobbyInvitationResponse {
  id: string;
}

// Backend response from GET /api/lobbies/me
export interface MyLobbyBackendResponse {
  lobbyId: string;
  key: string;
  gameId: string;
  gameName: string;
  status: 'WAITING' | 'IN_GAME' | 'FINISHED';
  otherParticipants: PlayerInfo[];
  isOwner: boolean;
  gameSessionLink?: string;
  playerIds?: string[];
}

// Frontend lobby response (for UI)
export interface MyLobbyResponse {
  lobbyId: string;
  status: 'WAITING' | 'IN_GAME' | 'FINISHED';
  game: {
    id: string;
    name: string;
    thumbnailUrl?: string;
  };
  otherParticipants?: PlayerInfo[];
  // Only present when status is IN_GAME and user is owner
  gameSessionLink?: string;
  playerIds?: string[];
  isOwner?: boolean;
}

// Friend list types
export interface Friend {
  id: string;
  username: string;
}

// All players list (for invitations)
export interface Player {
  id: string;
  username: string;
  email?: string;
}

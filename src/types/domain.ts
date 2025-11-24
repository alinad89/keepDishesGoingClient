// ========================================
// Enums and Value Types
// ========================================

export type GameTags =
  | 'STRATEGY'
  | 'MULTIPLAYER'
  | 'SCI_FI'
  | 'COMPETITIVE'
  | 'PUZZLE'
  | 'SINGLEPLAYER'
  | 'CASUAL'
  | 'BRAIN_TEASER'
  | 'RACING'
  | 'ACTION'
  | 'RPG'
  | 'ADVENTURE'
  | 'FANTASY'
  | 'STORY_RICH'
  | 'CARD_GAME'
  | 'ROGUELIKE'
  | 'DUNGEON_CRAWLER'
  | 'PROCEDURAL'
  | 'COOP'
  | 'BOARD';

export type GamePublishingStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'RETIRED';

export type LobbyStatus =
  | 'WAITING'
  | 'MATCHED'
  | 'IN_PROGRESS'
  | 'FINISHED';

export type FriendStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED';

export type InvitationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED';

// ========================================
// User and Player Projections
// ========================================

export interface UserProjection {
  id: string; // UUID
  username: string;
  email?: string;
}

export interface Player {
  id: string; // UUID
  username: string;
  email: string;
  gameLibraryId: string; // UUID
  userId: string; // UUID - reference to UserProjection
}

// ========================================
// Game Library (Aggregate)
// ========================================

export interface GameLibrary {
  id: string; // UUID
  playerId: string; // UUID
  games: string[]; // Array of Game IDs (GameProjection references)
  favourites: string[]; // Array of Game IDs (GameProjection references)
  achievementsUnlocked: string[]; // Array of Achievement IDs
}

// ========================================
// Game (Aggregate) and Projections
// ========================================

export interface Game {
  id: string; // UUID
  name: string;
  description: string;
  shortDescription: string;
  coverImageUrl: string;
  thumbnail: string;
  rules: string;
  tags: GameTags[];
  version: string;
  url: string;
  developerName: string;
  status: GamePublishingStatus;
  achievements: string[]; // Array of Achievement IDs (AchievementProjection references)
}

export interface GameProjection {
  id: string; // UUID
  name: string;
  thumbnail: string;
  shortDescription: string;
  tags: GameTags[];
  status: GamePublishingStatus;
}

// ========================================
// Achievement (Value Object) and Projections
// ========================================

export interface Achievement {
  id: string; // UUID
  gameId: string; // UUID
  name: string;
  icon: string;
  instructions: string;
}

export interface AchievementProjection {
  id: string; // UUID
  name: string;
  icon: string;
  instructions: string;
}

export interface PlayerAchievement {
  id: string; // UUID
  playerId: string; // UUID
  achievementId: string; // UUID
  gameId: string; // UUID
  unlockedAt: string; // ISO date string
}

// ========================================
// Lobby
// ========================================

export interface Lobby {
  id: string; // UUID
  gameId: string; // UUID - reference to Game
  players: string[]; // Array of Player IDs
  status: LobbyStatus;
  withAi: boolean;
  gameStateId: string | null; // UUID or null
  createdAt: string; // ISO date string
}

// ========================================
// Game State
// ========================================

export interface GameState {
  id: string; // UUID
  playoutId: string; // UUID
  lobbyId: string; // UUID
  currentTurn?: number;
  startedAt?: string; // ISO date string
  state: Record<string, any>; // Generic state object
}

// ========================================
// Chat and Messages
// ========================================

export interface Chat {
  id: string; // UUID
  lobbyId: string; // UUID
  messages: string[]; // Array of Message IDs
}

export interface Message {
  id: string; // UUID
  chatId: string; // UUID
  senderId: string; // UUID or 'ai-assistant'
  senderName: string;
  content: string;
  timestamp: string; // ISO date string
  aiMessage: boolean;
}

// ========================================
// Friends System
// ========================================

export interface Friend {
  id: string; // UUID
  playerId: string; // UUID
  friendId: string; // UUID
  status: FriendStatus;
  createdAt: string; // ISO date string
  acceptedAt: string | null; // ISO date string or null
}

// ========================================
// Invitations
// ========================================

export interface Invitation {
  id: string; // UUID
  fromPlayerId: string; // UUID
  toPlayerId: string; // UUID
  gameId: string; // UUID
  lobbyId: string; // UUID
  status: InvitationStatus;
  message?: string;
  createdAt: string; // ISO date string
  acceptedAt: string | null; // ISO date string or null
}

// ========================================
// Form DTOs (for creating/updating entities)
// ========================================

export interface CreateGameDto {
  name: string;
  description: string;
  shortDescription: string;
  coverImageUrl: string;
  rules: string;
  tags: GameTags[];
  version: string;
  url: string;
  developerName: string;
}

export interface CreateLobbyDto {
  gameId: string;
  withAi: boolean;
}

export interface SendMessageDto {
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
}

export interface AddFriendDto {
  playerId: string;
  friendId: string;
}

export interface SendInvitationDto {
  fromPlayerId: string;
  toPlayerId: string;
  gameId: string;
  lobbyId: string;
  message?: string;
}

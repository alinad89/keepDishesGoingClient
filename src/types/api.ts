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

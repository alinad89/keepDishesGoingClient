// ========================================
// Game Types (Developer BC)
// ========================================

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
  priceAmount: number;
  status?: 'ONLINE' | 'OFFLINE' | 'READY_FOR_PUBLISHING' | 'REJECTED' | string;
}

export interface PlatformGame {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  coverImageUrl: string;
  rules: string;
  shortDescription: string;
  tags: string[];
  version: string;
  priceAmount: number;
}

// ========================================
// Platform Game Types (for players)
// ========================================

export interface PlatformGameAchievement {
  id: string;
  name: string;
  iconUrl: string;
  instructions: string;
}

export interface PlatformGame {
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

export interface PlatformGameDetails extends PlatformGame {
  achievements: PlatformGameAchievement[];
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
  priceUnits: number;
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
  | 'MARK_READY_FOR_PUBLISHING'
  | 'MARK_ONLINE'
  | 'MARK_REJECTED';

export interface ChangeGameStatusRequest {
  id: string;
  action: GameStatusAction;
}

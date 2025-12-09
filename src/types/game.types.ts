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

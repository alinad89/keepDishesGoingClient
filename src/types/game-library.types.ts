import type { Achievement } from './achievement.types';

// Player-facing library entry returned from GET library endpoint
export interface GameLibraryAchievement extends Achievement {
  achievementsObtained: boolean;
}

export interface GameLibraryGame {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  coverImageUrl: string;
  rules: string;
  shortDescription: string;
  tags: string[];
  version: string;
  achievements: GameLibraryAchievement[];
}

export interface GameLibraryEntry {
  game: GameLibraryGame;
  favourite: boolean;
}

export type GameLibraryResponse = GameLibraryEntry[];

export const POSSIBLE_FAVOURITE_ACTIONS = [
    `MARK_AS_FAVOURITE`, `REMOVE_FROM_FAVOURITE`
]

export interface AddToFavouriteRequest {
    action: `MARK_AS_FAVOURITE` | `REMOVE_FROM_FAVOURITE`;
}

export interface AddGameToLibraryRequest {
    gameId: string;
}
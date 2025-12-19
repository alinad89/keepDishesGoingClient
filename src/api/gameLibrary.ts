import type {
    AddGameToLibraryRequest,
    AddToFavouriteRequest,
    GameLibraryResponse
} from "../types/game-library.types.ts";
import {apiGet, apiPatch, PLATFORM_ENDPOINTS} from "./config.ts";

/**
 * Fetch games from user's game library
 * GET /api/game-libraries/me
 */
export async function fetchGameLibrary(): Promise<GameLibraryResponse> {
    const data = await apiGet<GameLibraryResponse>(PLATFORM_ENDPOINTS.gameLibrary)
    return data;
}

/**
 * Add game to the game library
 * PATCH /api/game-libraries/me/games
 */
export async function addGameToLibrary(request:AddGameToLibraryRequest): Promise<void> {
    await apiPatch(PLATFORM_ENDPOINTS.addGameToLibrary,request)
}

/**
 * Add game to the game library
 * PATCH /api/game-libraries/me/games/{gameId}
 */
export async function addGameToFavourites(gameId: string, request:AddToFavouriteRequest): Promise<void> {
    await apiPatch(PLATFORM_ENDPOINTS.addGameToFavourites(gameId), request)
}
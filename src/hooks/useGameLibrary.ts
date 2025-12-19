import {addGameToFavourites, addGameToLibrary, fetchGameLibrary} from "../api/gameLibrary.ts";
import type {AddGameToLibraryRequest, AddToFavouriteRequest, GameLibraryResponse} from "../types/game-library.types.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

/**
 * Hook to fetch a game library of a current user
 * GET /api/game-libraries/me
 */
export function useGameLibrary() {
    const {
        data:gameLibrary = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<GameLibraryResponse, Error> ({
        queryKey: ['gameLibrary'],
        queryFn: fetchGameLibrary
    });

    return {
        gameLibrary,
        isLoading,
        error,
        isError,
        refetch,
    }
}

/**
 * Hook to add a game to game library
 * GET /api/game-libraries/me/games
 */
export function useAddGameToLibrary() {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending,
        isError,
        error
    } = useMutation<void, Error, AddGameToLibraryRequest>({
        mutationFn: (request) => addGameToLibrary(request),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["gameLibrary"]});
        }
    })
    return {
        addGame: (request:AddGameToLibraryRequest) => mutate(request),
        isPending,
        isError,
        error
    }
}

/**
 * Hook to mark/unmark game as favourite in game library
 * PATCH /api/game-libraries/me/games/{gameId}
 */
export function useAddGameToFavourites() {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending,
        isError,
        error
    } = useMutation<void, Error, {gameId:string, request:AddToFavouriteRequest}>({
        mutationFn: ({gameId, request}) => addGameToFavourites(gameId,
            request),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["gameLibrary"]});
        }
    })
    return {
        addToFavourites: (gameId:string,request:AddToFavouriteRequest) => mutate({gameId,request}),
        isPending,
        isError,
        error
    }
}
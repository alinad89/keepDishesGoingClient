import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLobby,
  changeLobbyStatus,
  registerPlayer,
  getMyLobby,
  leaveLobby,
  sendLobbyInvitation,
  getMyLobbyInvitations,
  acceptLobbyInvitation,
  getAllPlayers,
  type CreateLobbyRequest,
  type CreateLobbyResponse,
  type ChangeLobbyStatusRequest,
  type MyLobbyResponse,
  type LobbyInvitation,
  type CreateLobbyInvitationRequest,
  type CreateLobbyInvitationResponse,
} from '../api/lobbies';
import { ApiError, isAuthenticated } from '../api/config';
import type { Player } from '../types/api';

// Re-export types for convenience
export type {
  CreateLobbyRequest,
  CreateLobbyResponse,
  ChangeLobbyStatusRequest,
  MyLobbyResponse,
  LobbyInvitation,
  CreateLobbyInvitationRequest,
};

/**
 * Hook to register a player
 * POST /api/players
 */
export function useRegisterPlayer() {
  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<{ id: string }, Error, void>({
    mutationFn: () => registerPlayer(),
  });

  return {
    registerPlayer: mutate,
    registerPlayerAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to create a new lobby
 * POST /api/lobbies
 */
export function useCreateLobby() {
  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
    data,
  } = useMutation<CreateLobbyResponse, Error, CreateLobbyRequest>({
    mutationFn: (request: CreateLobbyRequest) => createLobby(request),
  });

  return {
    createLobby: mutate,
    createLobbyAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
    data,
  };
}

/**
 * Hook to change lobby status (e.g., start game)
 * PATCH /api/lobbies/me/status
 */
export function useChangeLobbyStatus() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, ChangeLobbyStatusRequest>({
    mutationFn: (request: ChangeLobbyStatusRequest) => changeLobbyStatus(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLobby'] });
    },
  });

  return {
    changeLobbyStatus: mutate,
    changeLobbyStatusAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to leave current lobby
 * DELETE /api/lobbies/me
 */
export function useLeaveLobby() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, void>({
    mutationFn: () => leaveLobby(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myLobby'] });
    },
  });

  return {
    leaveLobby: mutate,
    leaveLobbyAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to get my current lobby
 * GET /api/lobbies/me
 */
export function useMyLobby() {
  const {
    data: lobby = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<MyLobbyResponse | null, Error>({
    queryKey: ['myLobby'],
    queryFn: getMyLobby,
    refetchInterval: 5000, // Poll every 5 seconds for lobby updates
  });

  return {
    lobby,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

/**
 * Hook to send a lobby invitation
 * POST /api/lobby-invitations
 */
export function useSendLobbyInvitation() {
  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<CreateLobbyInvitationResponse, Error, CreateLobbyInvitationRequest>({
    mutationFn: (request: CreateLobbyInvitationRequest) =>
      sendLobbyInvitation(request),
  });

  return {
    sendInvitation: mutate,
    sendInvitationAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to get my lobby invitations
 * GET /api/lobby-invitations/me
 */
export function useMyLobbyInvitations() {
  const {
    data: invitations = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<LobbyInvitation[], Error>({
    queryKey: ['myLobbyInvitations'],
    queryFn: getMyLobbyInvitations,
    refetchInterval: 5000, // Poll every 5 seconds for new invitations
    enabled: isAuthenticated(), // Only fetch when authenticated
  });

  return {
    invitations,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

/**
 * Hook to accept a lobby invitation
 * PATCH /api/lobby-invitations/{id}/accepted
 */
export function useAcceptLobbyInvitation() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, string>({
    mutationFn: (invitationId: string) => acceptLobbyInvitation(invitationId),
    onSuccess: () => {
      // Refresh lobby invitations and my lobby status
      queryClient.invalidateQueries({ queryKey: ['myLobbyInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['myLobby'] });
    },
  });

  return {
    acceptInvitation: mutate,
    acceptInvitationAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to get all players (for invitations)
 * GET /api/players/all
 */
export function useAllPlayers() {
  const {
    data: players = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Player[], Error>({
    queryKey: ['allPlayers'],
    queryFn: getAllPlayers,
  });

  return {
    players,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

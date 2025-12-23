import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchFriends,
  fetchFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  searchPlayers,
  removeFriend,
  type Friend,
  type FriendRequest,
  type SendFriendRequestBody,
  type SendFriendRequestResponse,
  type Player,
} from '../api/friends';
import { ApiError } from '../api/config';
import { useAuth } from './useAuth';

// Re-export types for convenience
export type { Friend, FriendRequest, SendFriendRequestBody, SendFriendRequestResponse, Player };

/**
 * Hook to fetch friends for the current user
 * GET /api/friend-lists/me
 * Requires JWT authentication
 */
export function useFriends() {
  const { isAuthenticated } = useAuth();

  const {
    data: friends = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Friend[], Error>({
    queryKey: ['friends'],
    queryFn: fetchFriends,
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  return {
    friends,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

/**
 * Hook to fetch friend requests for the current user
 * GET /api/friend-requests/me
 * Requires JWT authentication
 */
export function useFriendRequests() {
  const { isAuthenticated } = useAuth();

  const {
    data: friendRequests = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FriendRequest[], Error>({
    queryKey: ['friendRequests'],
    queryFn: () => {
      console.log('Fetching friend requests...');
      return fetchFriendRequests().catch((err) => {
        console.error('Failed to fetch friend requests:', err);
        throw err;
      });
    },
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  return {
    friendRequests,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

/**
 * Hook to send a friend request
 * POST /api/friend-requests
 * Requires JWT authentication
 */
export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<SendFriendRequestResponse, Error, SendFriendRequestBody>({
    mutationFn: (body: SendFriendRequestBody) => sendFriendRequest(body),
    onSuccess: () => {
      // Invalidate friend requests to refetch
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });

  return {
    sendRequest: mutate,
    sendRequestAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to accept a friend request
 * PATCH /api/friend-requests/{id}/accepted
 * Requires JWT authentication
 */
export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, string>({
    mutationFn: (requestId: string) => acceptFriendRequest(requestId),
    onSuccess: () => {
      // Invalidate both friend requests and friends list
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  return {
    acceptRequest: mutate,
    acceptRequestAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to search for players by username
 * GET /api/players?username=...
 * Requires JWT authentication
 */
export function useSearchPlayers(username: string) {
  const { isAuthenticated } = useAuth();

  const {
    data: players = [],
    isLoading,
    isError,
    error,
  } = useQuery<Player[], Error>({
    queryKey: ['players', username],
    queryFn: () => searchPlayers(username),
    enabled: isAuthenticated && username.length >= 2, // Only search if authenticated AND 2+ characters
  });

  return {
    players,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to remove a friend
 * DELETE /api/friend-lists/me/friends/{playerId}
 * Requires JWT authentication
 */
export function useRemoveFriend() {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<void, Error, string>({
    mutationFn: (playerId: string) => removeFriend(playerId),
    onSuccess: () => {
      // Invalidate friends list to refetch
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  return {
    removeFriend: mutate,
    removeFriendAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

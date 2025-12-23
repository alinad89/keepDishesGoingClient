import type {
  Friend,
  FriendRequest,
  SendFriendRequestBody,
  SendFriendRequestResponse,
  Player,
} from '../types/friend.types';
import { apiGet, apiPost, apiPatch, apiDelete } from './config';

// Re-export types for convenience
export type { Friend, FriendRequest, SendFriendRequestBody, SendFriendRequestResponse, Player };

/**
 * Fetch friends for the current user
 * GET /api/friend-lists/me
 * Requires JWT authentication
 */
export async function fetchFriends(): Promise<Friend[]> {
  const data = await apiGet<Friend[]>('/friend-lists/me');
  return data || [];
}

/**
 * Fetch friend requests for the current user
 * GET /api/friend-requests/me
 * Requires JWT authentication
 */
export async function fetchFriendRequests(): Promise<FriendRequest[]> {
  const data = await apiGet<FriendRequest[]>('/friend-requests/me');
  return data || [];
}

/**
 * Send a friend request to a user
 * POST /api/friend-requests
 * Requires JWT authentication
 */
export async function sendFriendRequest(
  body: SendFriendRequestBody
): Promise<SendFriendRequestResponse> {
  const data = await apiPost<SendFriendRequestResponse>('/friend-requests', body);
  return data;
}

/**
 * Accept a friend request
 * PATCH /api/friend-requests/{id}/accepted
 * Requires JWT authentication
 */
export async function acceptFriendRequest(requestId: string): Promise<void> {
  await apiPatch<void>(`/friend-requests/${requestId}/accepted`);
}

/**
 * Search for players by username
 * GET /api/players?username=...
 * Requires JWT authentication
 */
export async function searchPlayers(username: string): Promise<Player[]> {
  const params = new URLSearchParams({ username });
  const data = await apiGet<Player[]>(`/players?${params.toString()}`);
  return data || [];
}

/**
 * Remove a friend from the current user's friend list
 * DELETE /api/friend-lists/me/friends/{playerId}
 * Requires JWT authentication
 */
export async function removeFriend(playerId: string): Promise<void> {
  await apiDelete<void>(`/friend-lists/me/friends/${playerId}`);
}

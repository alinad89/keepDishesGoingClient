import type {
  CreateMessageRequest,
  CreateMessageResponse,
  ChatListItem,
  Chat,
} from '../types/api';
import { CHATBOT_ENDPOINTS, apiPost, apiGet } from './config';

/**
 * Get all chats for the authenticated user
 * GET /api/chats
 */
export async function fetchChats(): Promise<ChatListItem[]> {
  const data = await apiGet<ChatListItem[]>(CHATBOT_ENDPOINTS.chats);
  return data || [];
}

/**
 * Get a specific chat by ID with all messages
 * GET /api/chats/{id}
 */
export async function fetchChatById(chatId: string): Promise<Chat> {
  return apiGet<Chat>(CHATBOT_ENDPOINTS.chatById(chatId));
}

/**
 * Create a new message in a new chat
 * POST /api/chats
 */
export async function createNewChat(
  request: CreateMessageRequest
): Promise<CreateMessageResponse> {
  return apiPost<CreateMessageResponse>(CHATBOT_ENDPOINTS.chats, request);
}

/**
 * Create a new message in an existing chat
 * POST /api/chats/{id}
 */
export async function sendMessageToChat(
  chatId: string,
  request: CreateMessageRequest
): Promise<CreateMessageResponse> {
  return apiPost<CreateMessageResponse>(
    CHATBOT_ENDPOINTS.chatById(chatId),
    request
  );
}

import type {
  CreateMessageRequest,
  CreateMessageResponse,
  ChatListItem,
  Chat,
  RagVaultContent,
  UpdateRagVaultRequest,
  UpdateRagVaultResponse,
} from '../types/chat.types';
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

/**
 * Get RAG vault content (Admin only)
 * GET /api/chats/rag-vault
 */
export async function getRagVault(): Promise<RagVaultContent> {
  return apiGet<RagVaultContent>(CHATBOT_ENDPOINTS.ragVault);
}

/**
 * Update RAG vault content (Admin only)
 * POST /api/chats/rag-vault
 */
export async function updateRagVault(
  request: UpdateRagVaultRequest
): Promise<UpdateRagVaultResponse> {
  return apiPost<UpdateRagVaultResponse>(CHATBOT_ENDPOINTS.ragVault, request);
}

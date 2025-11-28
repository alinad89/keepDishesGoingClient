import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createNewChat,
  sendMessageToChat,
  fetchChats,
  fetchChatById,
} from '../api/chats';
import type {
  CreateMessageRequest,
  CreateMessageResponse,
  ChatListItem,
  Chat,
} from '../types/api';
import { ApiError } from '../api/config';

/**
 * Hook to fetch all chats for authenticated user
 * GET /api/chats
 */
export function useChatList() {
  const {
    data: chats = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ChatListItem[], Error>({
    queryKey: ['chats'],
    queryFn: fetchChats,
    // Always fetch since backend uses hardcoded user
  });

  return {
    chats,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

/**
 * Hook to fetch a single chat by ID with messages
 * GET /api/chats/{id}
 */
export function useChatDetails(chatId: string | null) {
  const {
    data: chat = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Chat, Error>({
    queryKey: ['chat', chatId],
    queryFn: () => {
      if (!chatId) {
        throw new Error('Chat ID is required');
      }
      return fetchChatById(chatId);
    },
    enabled: Boolean(chatId),
  });

  return {
    chat,
    loading: isLoading,
    error: error instanceof ApiError ? error : null,
    isError,
    refetch,
  };
}

/**
 * Hook to create a new chat with a message
 * POST /api/chats
 */
export function useCreateChat() {
  const queryClient = useQueryClient();
  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<CreateMessageResponse, Error, CreateMessageRequest>({
    mutationFn: (request: CreateMessageRequest) => createNewChat(request),
    onSuccess: () => {
      // Invalidate chat list to refetch with new chat
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  return {
    createChat: mutate,
    createChatAsync: mutateAsync,
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

/**
 * Hook to send a message to an existing chat
 * POST /api/chats/{id}
 */
export function useSendMessage() {
  const queryClient = useQueryClient();
  const {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<
    CreateMessageResponse,
    Error,
    { chatId: string; message: CreateMessageRequest }
  >({
    mutationFn: ({ chatId, message }) => sendMessageToChat(chatId, message),
    onSuccess: (_, variables) => {
      // Invalidate the specific chat to refetch messages
      queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId] });
    },
  });

  return {
    sendMessage: (chatId: string, message: CreateMessageRequest) =>
      mutate({ chatId, message }),
    sendMessageAsync: (chatId: string, message: CreateMessageRequest) =>
      mutateAsync({ chatId, message }),
    loading: isPending,
    error: error instanceof ApiError ? error : null,
    isError,
  };
}

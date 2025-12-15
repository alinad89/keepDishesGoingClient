import { useState, useRef, useEffect, useCallback } from 'react';
import { useCreateChat, useSendMessage, useChatList, useChatDetails } from './useChats';
import { useWebSocket } from './useWebSocket';
import { fetchChatById } from '../api/chats';
import type { ChatMessage } from '../types/chat.types';

interface UseChatManagerOptions {
  enabled: boolean;
}

export function useChatManager({ enabled }: UseChatManagerOptions) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const pollTimeoutRef = useRef<number | null>(null);

  // Fetch chat list
  const { chats, refetch: refetchChats } = useChatList();

  // Fetch selected chat details
  const { chat: selectedChat } = useChatDetails(selectedChatId);

  const { createChatAsync, loading: createLoading } = useCreateChat();
  const { sendMessageAsync, loading: sendLoading } = useSendMessage();

  const loading = createLoading || sendLoading;

  // Poll for messages as fallback if WebSocket doesn't deliver them
  const schedulePollForMessages = useCallback((chatIdToPoll: string) => {
    console.log('[useChatManager] Scheduling poll for chat:', chatIdToPoll);

    // Clear any existing poll timeout
    if (pollTimeoutRef.current !== null) {
      clearTimeout(pollTimeoutRef.current);
    }

    let pollAttempt = 0;
    const maxPollAttempts = 8; // Increased attempts
    const initialPollDelay = 500; // Start polling faster (500ms)
    const pollInterval = 1500; // Subsequent polls every 1.5s

    const pollForMessages = async () => {
      pollAttempt++;
      console.log(`[useChatManager] Polling for messages in chat: ${chatIdToPoll} (attempt ${pollAttempt}/${maxPollAttempts})`);

      try {
        const chatData = await fetchChatById(chatIdToPoll);
        if (chatData) {
          console.log('[useChatManager] Poll result - found', chatData.messages.length, 'messages');

          setMessages((currentMessages) => {
            // Check if we have more messages or new AI messages
            const hasNewMessages = chatData.messages.length > currentMessages.length;
            const hasNewAiMessage = chatData.messages.some(
              (msg) => msg.aiMessage && !currentMessages.some(
                (currentMsg) => currentMsg.aiMessage && currentMsg.content === msg.content
              )
            );

            if (hasNewMessages || hasNewAiMessage) {
              console.log('[useChatManager] New AI message found via polling, updating messages');
              return chatData.messages;
            }

            // Continue polling if no AI response yet and we haven't exceeded max attempts
            if (pollAttempt < maxPollAttempts) {
              const lastMessage = chatData.messages[chatData.messages.length - 1];
              const waitingForAiResponse = lastMessage && !lastMessage.aiMessage;

              if (waitingForAiResponse) {
                console.log(`[useChatManager] Still waiting for AI response, scheduling poll attempt ${pollAttempt + 1}`);
                pollTimeoutRef.current = window.setTimeout(pollForMessages, pollInterval);
              } else {
                console.log('[useChatManager] AI response already present, stopping polls');
              }
            } else {
              console.log('[useChatManager] Max poll attempts reached, stopping');
            }

            return currentMessages;
          });
        }
      } catch (error) {
        console.error('[useChatManager] Failed to poll for messages:', error);
        // Retry polling even on error if we haven't exceeded max attempts
        if (pollAttempt < maxPollAttempts) {
          pollTimeoutRef.current = window.setTimeout(pollForMessages, pollInterval);
        }
      }
    };

    // Start first poll quickly for new chats
    pollTimeoutRef.current = window.setTimeout(pollForMessages, initialPollDelay);
  }, []);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback(
    (data: { chatId: string; message: ChatMessage }) => {
      console.log('[useChatManager] WebSocket message received:', data);

      // Cancel any pending polls since we got the message
      if (pollTimeoutRef.current !== null) {
        console.log('[useChatManager] Canceling scheduled poll - message received via WebSocket');
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }

      // Add AI response to messages (with deduplication)
      setMessages((prev) => {
        // Check if this exact message already exists (prevent duplicates)
        const isDuplicate = prev.some(
          (msg) => msg.aiMessage === data.message.aiMessage && msg.content === data.message.content
        );

        if (isDuplicate) {
          console.log('[useChatManager] Duplicate message detected, skipping');
          return prev;
        }

        console.log('[useChatManager] Adding new message to state. Current messages:', prev.length);
        return [...prev, data.message];
      });

      // Update chatId if this is a new chat
      if (!chatId && data.chatId) {
        console.log('[useChatManager] Updating chatId from WebSocket:', data.chatId);
        setChatId(data.chatId);
      }
    },
    [chatId]
  );

  // WebSocket connection
  const { isConnected, error: wsError } = useWebSocket({
    enabled,
    chatId,
    onMessage: handleWebSocketMessage,
  });

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat && selectedChatId) {
      console.log('Loading chat:', selectedChatId, 'with', selectedChat.messages.length, 'messages');
      setMessages(selectedChat.messages);
      setChatId(selectedChatId);
    }
  }, [selectedChat, selectedChatId]);

  // Cleanup poll timeout on unmount
  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current !== null) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  // Handle selecting a chat from history
  const handleSelectChat = useCallback((chatIdToSelect: string) => {
    console.log('Selecting chat:', chatIdToSelect);
    setSelectedChatId(chatIdToSelect);
  }, []);

  // Handle starting a new chat
  const handleNewChat = useCallback(() => {
    setSelectedChatId(null);
    setChatId(null);
    setMessages([]);
  }, []);

  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || loading) return;

    const userMessage: ChatMessage = {
      aiMessage: false,
      content: message.trim(),
    };

    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    try {
      if (!chatId) {
        // Create new chat
        console.log('Creating new chat...');
        const response = await createChatAsync({ message: userMessage.content });
        const newChatId = response.chatId;
        console.log('Chat created with ID:', newChatId);

        // Set chatId first to enable WebSocket connection
        setChatId(newChatId);
        setSelectedChatId(newChatId);
        refetchChats();

        // For new chats, WebSocket message was likely sent before we subscribed
        // So we always use polling as fallback to ensure we get the AI response
        console.log('Scheduling poll for new chat to catch AI response...');
        schedulePollForMessages(newChatId);
      } else {
        // Send to existing chat (WebSocket already connected)
        console.log('Sending message to chat:', chatId);
        const response = await sendMessageAsync(chatId, { message: userMessage.content });
        console.log('Message sent, response:', response);

        // For existing chats, WebSocket should deliver the message
        // But we still schedule polling as a safety fallback
        console.log('Waiting for AI response via WebSocket (with polling fallback)...');
        schedulePollForMessages(chatId);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => [
        ...prev,
        {
          aiMessage: true,
          content: 'Sorry, there was an error sending your message. Please try again.',
        },
      ]);
    }
  }, [message, loading, chatId, createChatAsync, sendMessageAsync, refetchChats, schedulePollForMessages]);

  return {
    // State
    message,
    messages,
    chatId,
    selectedChatId,
    chats,
    loading,
    isConnected,
    wsError,

    // Actions
    setMessage,
    handleSendMessage,
    handleSelectChat,
    handleNewChat,
  };
}

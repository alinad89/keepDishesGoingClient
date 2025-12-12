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
    const maxPollAttempts = 5;
    const pollInterval = 2000;

    const pollForMessages = async () => {
      pollAttempt++;
      console.log(`[useChatManager] Polling for messages in chat: ${chatIdToPoll} (attempt ${pollAttempt}/${maxPollAttempts})`);

      try {
        const chatData = await fetchChatById(chatIdToPoll);
        if (chatData) {
          console.log('[useChatManager] Poll result - found', chatData.messages.length, 'messages');

          setMessages((currentMessages) => {
            const hasNewMessages = chatData.messages.some(
              (msg, index) => msg.aiMessage && (!currentMessages[index] || currentMessages[index].content !== msg.content)
            );

            if (hasNewMessages || chatData.messages.length > currentMessages.length) {
              console.log('[useChatManager] Updating messages from poll');
              return chatData.messages;
            }

            if (pollAttempt < maxPollAttempts) {
              console.log(`[useChatManager] No new messages yet, scheduling poll attempt ${pollAttempt + 1}`);
              pollTimeoutRef.current = window.setTimeout(pollForMessages, pollInterval);
            } else {
              console.log('[useChatManager] Max poll attempts reached, stopping');
            }

            return currentMessages;
          });
        }
      } catch (error) {
        console.error('[useChatManager] Failed to poll for messages:', error);
      }
    };

    pollTimeoutRef.current = window.setTimeout(pollForMessages, pollInterval);
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

      // Add AI response to messages
      setMessages((prev) => {
        console.log('[useChatManager] Adding message to state. Current messages:', prev.length);
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
    if (selectedChat) {
      console.log('Loading chat:', selectedChat.id, 'with', selectedChat.messages.length, 'messages');
      setMessages(selectedChat.messages);
      setChatId(selectedChat.id);
    }
  }, [selectedChat]);

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

        setChatId(newChatId);
        setSelectedChatId(newChatId);
        refetchChats();

        // Fallback: add AI response from HTTP if available
        if (response.message) {
          console.log('Adding AI response from HTTP response:', response.message);
          setMessages((prev) => [...prev, response.message!]);
        } else {
          console.log('Waiting for AI response via WebSocket...');
          schedulePollForMessages(newChatId);
        }
      } else {
        // Send to existing chat
        console.log('Sending message to chat:', chatId);
        const response = await sendMessageAsync(chatId, { message: userMessage.content });
        console.log('Message sent, response:', response);

        // Fallback: add AI response from HTTP if available
        if (response.message) {
          console.log('Adding AI response from HTTP response:', response.message);
          setMessages((prev) => [...prev, response.message!]);
        } else {
          console.log('Waiting for AI response via WebSocket...');
          schedulePollForMessages(chatId);
        }
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

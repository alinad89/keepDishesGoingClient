import { useState, useRef, useEffect, useCallback } from 'react';
import { useCreateChat, useSendMessage, useChatList, useChatDetails } from '../hooks/useChats';
import { useWebSocket } from '../hooks/useWebSocket';
import { fetchChatById } from '../api/chats';
import type { ChatMessage } from '../types/api';
import Button from './Button';
import './ChatBox.css';

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollTimeoutRef = useRef<number | null>(null);

  // Fetch chat list (backend uses hardcoded user)
  const { chats, refetch: refetchChats } = useChatList();

  // Fetch selected chat details
  const { chat: selectedChat, refetch: refetchChatDetails } = useChatDetails(selectedChatId);

  const { createChatAsync, loading: createLoading } = useCreateChat();
  const { sendMessageAsync, loading: sendLoading } = useSendMessage();

  const loading = createLoading || sendLoading;

  // WebSocket connection - only when chat is open
  const handleWebSocketMessage = useCallback(
    (data: { chatId: string; message: ChatMessage }) => {
      console.log('[ChatBox] WebSocket message received:', data);

      // Cancel any pending polls since we got the message
      if (pollTimeoutRef.current !== null) {
        console.log('[ChatBox] Canceling scheduled poll - message received via WebSocket');
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }

      // Add AI response to messages
      setMessages((prev) => {
        console.log('[ChatBox] Adding message to state. Current messages:', prev.length);
        return [...prev, data.message];
      });

      // Update chatId if this is a new chat
      if (!chatId && data.chatId) {
        console.log('[ChatBox] Updating chatId from WebSocket:', data.chatId);
        setChatId(data.chatId);
      }
    },
    [chatId]
  );

  // WebSocket with STOMP/SockJS client
  const { isConnected, error: wsError } = useWebSocket({
    enabled: isOpen,
    chatId: chatId,
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup poll timeout on unmount
  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current !== null) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  // Handle selecting a chat from history
  const handleSelectChat = (chatIdToSelect: string) => {
    console.log('Selecting chat:', chatIdToSelect);
    setSelectedChatId(chatIdToSelect);
  };

  // Handle starting a new chat
  const handleNewChat = () => {
    setSelectedChatId(null);
    setChatId(null);
    setMessages([]);
  };

  // Truncate chat name for display
  const truncateChatName = (name: string, maxLength: number = 35) => {
    if (!name || name.trim() === '') return 'Untitled Chat';
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  // Poll for messages as fallback if WebSocket doesn't deliver them
  const schedulePollForMessages = useCallback((chatIdToPoll: string) => {
    console.log('[ChatBox] Scheduling poll for chat:', chatIdToPoll);

    // Clear any existing poll timeout
    if (pollTimeoutRef.current !== null) {
      clearTimeout(pollTimeoutRef.current);
    }

    let pollAttempt = 0;
    const maxPollAttempts = 5; // Poll up to 5 times
    const pollInterval = 2000; // Poll every 2 seconds

    const pollForMessages = async () => {
      pollAttempt++;
      console.log(`[ChatBox] Polling for messages in chat: ${chatIdToPoll} (attempt ${pollAttempt}/${maxPollAttempts})`);

      try {
        // Fetch the chat directly by ID instead of using refetchChatDetails
        const chatData = await fetchChatById(chatIdToPoll);
        if (chatData) {
          console.log('[ChatBox] Poll result - found', chatData.messages.length, 'messages');
          console.log('[ChatBox] Poll messages:', chatData.messages);

          // Always update with the server's version of messages
          setMessages((currentMessages) => {
            // Check if there are any new AI messages
            const hasNewMessages = chatData.messages.some(
              (msg, index) => msg.aiMessage && (!currentMessages[index] || currentMessages[index].content !== msg.content)
            );

            if (hasNewMessages || chatData.messages.length > currentMessages.length) {
              console.log('[ChatBox] Updating messages from poll (had', currentMessages.length, 'now have', chatData.messages.length, ')');
              return chatData.messages;
            }

            // If no new messages and we haven't exceeded max attempts, schedule another poll
            if (pollAttempt < maxPollAttempts) {
              console.log(`[ChatBox] No new messages yet, scheduling poll attempt ${pollAttempt + 1}/${maxPollAttempts}`);
              pollTimeoutRef.current = window.setTimeout(pollForMessages, pollInterval);
            } else {
              console.log('[ChatBox] Max poll attempts reached, stopping');
            }

            return currentMessages;
          });
        }
      } catch (error) {
        console.error('[ChatBox] Failed to poll for messages:', error);
      }
    };

    // Start first poll after 2 seconds
    pollTimeoutRef.current = window.setTimeout(pollForMessages, pollInterval);
  }, []);

  const handleSendMessage = async () => {
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
        // Create new chat via HTTP POST
        console.log('Creating new chat...');
        const response = await createChatAsync({ message: userMessage.content });
        const newChatId = response.chatId || response.id; // Backend returns chatId
        console.log('Chat created with ID:', newChatId);
        console.log('Response:', response);

        setChatId(newChatId);
        setSelectedChatId(newChatId);

        // Refetch chat list to show new chat
        refetchChats();

        // FALLBACK: If response includes the AI message, add it immediately
        // This handles cases where WebSocket isn't connected yet
        if (response.message && response.message.aiMessage) {
          console.log('Adding AI response from HTTP response:', response.message);
          setMessages((prev) => [...prev, response.message]);
        } else {
          console.log('Waiting for AI response via WebSocket...');
          // Schedule a poll as fallback in case WebSocket misses the message
          schedulePollForMessages(newChatId);
        }
      } else {
        // Send to existing chat via HTTP POST
        console.log('Sending message to chat:', chatId);
        const response = await sendMessageAsync(chatId, { message: userMessage.content });
        console.log('Message sent, response:', response);

        // FALLBACK: If response includes the AI message, add it immediately
        if (response.message && response.message.aiMessage) {
          console.log('Adding AI response from HTTP response:', response.message);
          setMessages((prev) => [...prev, response.message]);
        } else {
          console.log('Waiting for AI response via WebSocket...');
          // Schedule a poll as fallback in case WebSocket misses the message
          schedulePollForMessages(chatId);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error to user
      setMessages((prev) => [
        ...prev,
        {
          aiMessage: true,
          content: 'Sorry, there was an error sending your message. Please try again.',
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button className="chatbox-toggle" onClick={() => setIsOpen(true)} aria-label="Open chat">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="chatbox-container">
      {/* Sidebar - Always show since backend uses hardcoded user */}
      <div className="chatbox-sidebar">
        <div className="chatbox-sidebar-header">
          <h4 className="chatbox-sidebar-title">Chat History</h4>
          <button className="chatbox-new-chat-btn" onClick={handleNewChat} title="New Chat">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        <div className="chatbox-chat-list">
          {chats.length === 0 ? (
            <div className="chatbox-no-chats">No chats yet</div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                className={`chatbox-chat-item ${selectedChatId === chat.id ? 'chatbox-chat-item-active' : ''}`}
                onClick={() => handleSelectChat(chat.id)}
                title={chat.chatName || 'Untitled Chat'}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="chatbox-chat-name">
                  {truncateChatName(chat.chatName)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="chatbox-main">
        <div className="chatbox-header">
          <div className="chatbox-header-left">
            <h3 className="chatbox-header-title">Chat Assistant</h3>
            <span
              className={`chatbox-status ${isConnected ? 'chatbox-status-connected' : 'chatbox-status-disconnected'}`}
              title={isConnected ? 'Connected' : wsError || 'Disconnected'}
            >
              ●
            </span>
          </div>
          <button className="chatbox-close-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="chatbox-messages">
          {messages.length === 0 ? (
            <div className="chatbox-empty">
              <p>Start a conversation! Ask me anything.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbox-message ${msg.aiMessage ? 'chatbox-message-ai' : 'chatbox-message-user'}`}
              >
                <div
                  className={`chatbox-message-content ${msg.aiMessage ? 'chatbox-message-content-ai' : 'chatbox-message-content-user'}`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbox-input-container">
          <input
            type="text"
            className="chatbox-input"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={loading || !message.trim()}
            className="chatbox-send-btn"
          >
            {loading ? '...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}

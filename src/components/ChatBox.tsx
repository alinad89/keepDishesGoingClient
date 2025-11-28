import { useState, useRef, useEffect, useCallback, CSSProperties } from 'react';
import { useCreateChat, useSendMessage, useChatList, useChatDetails } from '../hooks/useChats';
import { useWebSocket } from '../hooks/useWebSocket';
import { fetchChatById } from '../api/chats';
import type { ChatMessage } from '../types/api';
import Button from './Button';

// Styles
const styles: Record<string, CSSProperties> = {
  toggle: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'var(--accent)',
    border: 'none',
    color: 'var(--text-color)',
    cursor: 'pointer',
    boxShadow: '0 4px 12px var(--shadow-color)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '680px',
    height: '550px',
    background: 'var(--bg-color)',
    border: '1px solid var(--card-border)',
    borderRadius: '12px',
    boxShadow: '0 8px 24px var(--shadow-color)',
    display: 'flex',
    flexDirection: 'row',
    zIndex: 1000,
    overflow: 'hidden',
  },
  sidebar: {
    width: '260px',
    background: 'var(--card-bg)',
    borderRight: '1px solid var(--card-border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid var(--card-border)',
  },
  sidebarTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-color)',
  },
  newChatBtn: {
    background: 'transparent',
    border: '1px solid var(--card-border)',
    color: 'var(--text-color)',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  chatList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px',
  },
  noChats: {
    padding: '20px',
    textAlign: 'center',
    color: 'var(--muted-text)',
    fontSize: '14px',
  },
  chatItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: 'var(--text-color)',
    cursor: 'pointer',
    transition: 'background 0.2s',
    textAlign: 'left',
    marginBottom: '4px',
  },
  chatItemActive: {
    background: 'var(--accent)',
    color: 'var(--text-color)',
  },
  chatName: {
    flex: 1,
    fontSize: '14px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'var(--accent)',
    color: 'var(--text-color)',
    borderBottom: '1px solid var(--card-border)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
  },
  status: {
    fontSize: '12px',
    cursor: 'help',
  },
  statusConnected: {
    color: '#4ade80',
    animation: 'pulse 2s ease-in-out infinite',
  },
  statusDisconnected: {
    color: '#f87171',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-color)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--muted-text)',
    textAlign: 'center',
    padding: '20px',
  },
  message: {
    display: 'flex',
    maxWidth: '80%',
  },
  messageUser: {
    alignSelf: 'flex-end',
  },
  messageAi: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    padding: '10px 14px',
    borderRadius: '12px',
    wordWrap: 'break-word',
    lineHeight: 1.5,
    fontSize: '14px',
  },
  messageContentUser: {
    background: 'var(--accent)',
    color: 'var(--text-color)',
    borderBottomRightRadius: '4px',
  },
  messageContentAi: {
    background: 'var(--card-bg)',
    color: 'var(--text-color)',
    borderBottomLeftRadius: '4px',
    border: '1px solid var(--card-border)',
  },
  inputContainer: {
    display: 'flex',
    gap: '8px',
    padding: '16px',
    borderTop: '1px solid var(--card-border)',
    background: 'var(--bg-color)',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid var(--card-border)',
    borderRadius: '8px',
    background: 'var(--card-bg)',
    color: 'var(--text-color)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  sendBtn: {
    padding: '10px 20px',
    minWidth: '70px',
    fontSize: '14px',
  },
};

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [hoveredNewChatBtn, setHoveredNewChatBtn] = useState(false);
  const [hoveredChatItem, setHoveredChatItem] = useState<string | null>(null);
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
      <button
        style={styles.toggle}
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
      >
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
    <div style={styles.container}>
      {/* Sidebar - Always show since backend uses hardcoded user */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h4 style={styles.sidebarTitle}>Chat History</h4>
          <button
            style={{
              ...styles.newChatBtn,
              ...(hoveredNewChatBtn ? { background: 'var(--accent)', borderColor: 'var(--accent)' } : {}),
            }}
            onClick={handleNewChat}
            onMouseEnter={() => setHoveredNewChatBtn(true)}
            onMouseLeave={() => setHoveredNewChatBtn(false)}
            title="New Chat"
          >
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
        <div style={styles.chatList}>
          {chats.length === 0 ? (
            <div style={styles.noChats}>No chats yet</div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                style={{
                  ...styles.chatItem,
                  ...(selectedChatId === chat.id ? styles.chatItemActive : {}),
                  ...(hoveredChatItem === chat.id && selectedChatId !== chat.id ? { background: 'var(--bg-color)' } : {}),
                }}
                onClick={() => handleSelectChat(chat.id)}
                onMouseEnter={() => setHoveredChatItem(chat.id)}
                onMouseLeave={() => setHoveredChatItem(null)}
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
                <span style={styles.chatName}>
                  {truncateChatName(chat.chatName)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div style={styles.main}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h3 style={styles.headerTitle}>Chat Assistant</h3>
            <span
              style={{
                ...styles.status,
                ...(isConnected ? styles.statusConnected : styles.statusDisconnected),
              }}
              title={isConnected ? 'Connected' : wsError || 'Disconnected'}
            >
              ●
            </span>
          </div>
          <button
            style={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
            aria-label="Close chat"
          >
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

        <div style={styles.messages}>
          {messages.length === 0 ? (
            <div style={styles.empty}>
              <p>Start a conversation! Ask me anything.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  ...(msg.aiMessage ? styles.messageAi : styles.messageUser),
                }}
              >
                <div
                  style={{
                    ...styles.messageContent,
                    ...(msg.aiMessage ? styles.messageContentAi : styles.messageContentUser),
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <input
            type="text"
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor = 'var(--accent)';
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = 'var(--card-border)';
            }}
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={loading || !message.trim()}
            className="chatbox-send-btn"
            style={styles.sendBtn}
          >
            {loading ? '...' : 'Send'}
          </Button>
        </div>
      </div>
    </div>
  );
}

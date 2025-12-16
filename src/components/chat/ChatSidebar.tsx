import type { ChatListItem } from '../../types/chat.types';

interface ChatSidebarProps {
  chats: ChatListItem[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

function truncateChatName(name: string, maxLength: number = 35) {
  if (!name || name.trim() === '') return 'Untitled Chat';
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength) + '...';
}

export function ChatSidebar({ chats, selectedChatId, onSelectChat, onNewChat }: ChatSidebarProps) {
  return (
    <div className="chatbox-sidebar">
      <div className="chatbox-sidebar-header">
        <h4 className="chatbox-sidebar-title">Chat History</h4>
        <button className="chatbox-new-chat-btn" onClick={onNewChat} title="New Chat">
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
        <button
          className="chatbox-chat-item chatbox-new-chat-tile"
          onClick={onNewChat}
          title="Start a new chat"
        >
          <div className="chatbox-new-chat-icon">+</div>
          <span className="chatbox-chat-name">New Chat</span>
        </button>
        {chats.length === 0 ? (
          <div className="chatbox-no-chats">No chats yet</div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              className={`chatbox-chat-item ${selectedChatId === chat.id ? 'chatbox-chat-item-active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
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
  );
}

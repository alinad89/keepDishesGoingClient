interface ChatHeaderProps {
  isConnected: boolean;
  wsError: string | null;
  onClose: () => void;
}

export function ChatHeader({ isConnected, wsError, onClose }: ChatHeaderProps) {
  return (
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
      <button className="chatbox-close-btn" onClick={onClose} aria-label="Close chat">
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
  );
}

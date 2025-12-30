import Button from '../ui/Button';

interface ChatInputProps {
  message: string;
  loading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export function ChatInput({ message, loading, onMessageChange, onSendMessage }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="chatbox-input-container">
      <input
        type="text"
        className="chatbox-input"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />
      <Button
        variant="primary"
        onClick={onSendMessage}
        disabled={loading || !message.trim()}
        className="chatbox-send-btn"
      >
        {loading ? '...' : 'Send'}
      </Button>
    </div>
  );
}

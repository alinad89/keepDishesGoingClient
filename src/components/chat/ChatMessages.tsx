import { useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/chat.types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  waitingForResponse: boolean;
}

export function ChatMessages({ messages, waitingForResponse }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
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
      {waitingForResponse && (
        <div className="chatbox-message chatbox-message-ai">
          <div className="chatbox-message-content chatbox-message-content-ai">
            <div className="chatbox-typing-indicator" aria-label="Assistant is typing">
              <span className="chatbox-typing-dot" />
              <span className="chatbox-typing-dot" />
              <span className="chatbox-typing-dot" />
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

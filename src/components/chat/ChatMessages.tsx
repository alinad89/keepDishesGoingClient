import { useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types/chat.types';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
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
      <div ref={messagesEndRef} />
    </div>
  );
}

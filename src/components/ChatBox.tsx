import { useState } from 'react';
import { useChatManager } from '../hooks/useChatManager';
import { ChatToggleButton } from './chat/ChatToggleButton';
import { ChatSidebar } from './chat/ChatSidebar';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';
import './ChatBox.css';

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    message,
    messages,
    selectedChatId,
    chats,
    loading,
    waitingForResponse,
    isConnected,
    wsError,
    setMessage,
    handleSendMessage,
    handleSelectChat,
    handleNewChat,
  } = useChatManager({ enabled: isOpen });

  if (!isOpen) {
    return <ChatToggleButton onClick={() => setIsOpen(true)} />;
  }

  return (
    <div className="chatbox-container">
      <ChatSidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <div className="chatbox-main">
        <ChatHeader
          isConnected={isConnected}
          wsError={wsError}
          onClose={() => setIsOpen(false)}
        />

        <ChatMessages messages={messages} waitingForResponse={waitingForResponse} />

        <ChatInput
          message={message}
          loading={loading}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

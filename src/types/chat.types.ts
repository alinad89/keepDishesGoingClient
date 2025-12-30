// ========================================
// Chat Types (Chatbot BC)
// ========================================

export interface PlatformInfo {
  gameplayInfo: string;
  navigationInfo: string;
  accountManagement: string;
}

export interface ChatMessage {
  aiMessage: boolean;
  content: string;
}

export interface Chat {
  id: string;
  chatName: string;
  messages: ChatMessage[];
}

export interface ChatListItem {
  id: string;
  chatName: string;
}

export interface CreateMessageRequest {
  message: string;
}

export interface CreateMessageResponse {
  id?: string; // Deprecated: some endpoints might use this
  chatId: string; // The actual field the backend returns
  message?: ChatMessage; // Optional: Backend might include AI response here
}

// ========================================
// RAG Vault Types
// ========================================

export interface RagVaultContent {
  content: string[];
  total_chunks: number;
}

export interface UpdateRagVaultRequest {
  content: string;
  auto_chunk: boolean;
}

export interface UpdateRagVaultResponse {
  chunks_added: number;
  message: string;
}

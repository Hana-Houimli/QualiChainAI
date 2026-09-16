import { apiRequest } from './api';

import type {
  ChatResponse,
  Conversation,
  ConversationData,
} from "../types"

export const chatService = {
  getConversations(): Promise<Conversation[]> {
    return apiRequest<Conversation[]>(
      '/conversations'
    );
  },

  getConversation(
    conversationId: string
  ): Promise<ConversationData> {
    return apiRequest<ConversationData>(
      `/conversations/${conversationId}`
    );
  },

  sendMessage(
    question: string,
    conversationId: string
  ): Promise<ChatResponse> {
    return apiRequest<ChatResponse>(
      '/chat',
      {
        method: 'POST',
        body: JSON.stringify({
          question,
          conversation_id: conversationId,
        }),
      }
    );
  },

  deleteConversation(
    conversationId: string
  ) {
    return apiRequest<{ message: string }>(
      `/conversations/${conversationId}`,
      {
        method: 'DELETE',
      }
    );
  },
};
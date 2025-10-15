import { create } from 'zustand';

/**
 * Chat Store - Zustand state management for chat messages
 *
 * Message Structure (Phase 1):
 *   {
 *     sender: 'user' | 'agent',
 *     content: string | Array<ContentPart>
 *   }
 *
 * ContentPart:
 *   { type: 'text', content: string }
 *   | { type: 'component', componentType: string, id: string, data: object }
 *
 * User messages: content is always a string
 * Agent messages: content can be string (Phase 0) or Array<ContentPart> (Phase 1)
 */
const useChatStore = create((set) => ({
  messages: [],
  isStreaming: false,

  // Add a user message to the chat
  addUserMessage: (content) => {
    set((state) => ({
      messages: [...state.messages, { sender: 'user', content }],
    }));
  },

  // Start a new agent message (empty content array for Phase 1)
  startAgentMessage: () => {
    set((state) => ({
      messages: [...state.messages, { sender: 'agent', content: [] }],
    }));
  },

  // Update the last agent message with new content (for streaming)
  // content can be: string (Phase 0) or Array<ContentPart> (Phase 1)
  updateAgentMessage: (content) => {
    set((state) => {
      const newMessages = [...state.messages];
      const lastMessage = newMessages[newMessages.length - 1];

      if (lastMessage && lastMessage.sender === 'agent') {
        lastMessage.content = content;
      }

      return { messages: newMessages };
    });
  },

  // Set the streaming state
  setIsStreaming: (isStreaming) => {
    set({ isStreaming });
  },
}));

export default useChatStore;

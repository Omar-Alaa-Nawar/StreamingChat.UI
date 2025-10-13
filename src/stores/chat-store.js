import { create } from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  isStreaming: false,

  // Add a user message to the chat
  addUserMessage: (content) => {
    set((state) => ({
      messages: [...state.messages, { sender: 'user', content }],
    }));
  },

  // Start a new agent message (empty content initially)
  startAgentMessage: () => {
    set((state) => ({
      messages: [...state.messages, { sender: 'agent', content: '' }],
    }));
  },

  // Update the last agent message with new content (for streaming)
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

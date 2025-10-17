import { create } from 'zustand';

/**
 * Chat Store - Zustand state management for chat messages
 *
 * Message Structure (Phase 1):
 *   {
 *     sender: 'user' | 'agent',
 *     content: string | Array<ContentPart>,
 *     isEdited: boolean (optional) // Phase 6.13: Track if message was edited
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
  isWaiting: false, // Phase 5: Waiting for first stream chunk (LLM processing)

  // Phase 6.11: Toast notifications
  toasts: [], // Array of toast notifications

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

  // Phase 5: Set waiting state (before first stream chunk arrives)
  setIsWaiting: (isWaiting) => {
    set({ isWaiting });
  },

  // Phase 6.11: Toast management
  showToast: (toast) => {
    const id = Date.now() + Math.random(); // Unique ID
    const newToast = {
      id,
      message: toast.message || 'Notification',
      type: toast.type || 'info',
      duration: toast.duration !== undefined ? toast.duration : 3000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    return id;
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },

  // Phase 6.12: Get last user message for regeneration
  getLastUserMessage: () => {
    const state = useChatStore.getState();
    // Find the last user message
    for (let i = state.messages.length - 1; i >= 0; i--) {
      if (state.messages[i].sender === 'user') {
        return state.messages[i].content;
      }
    }
    return null;
  },

  // Phase 6.12: Remove last agent message for regeneration
  removeLastAgentMessage: () => {
    set((state) => {
      const messages = [...state.messages];
      // Remove from end while messages are from agent
      while (messages.length > 0 && messages[messages.length - 1].sender === 'agent') {
        messages.pop();
      }
      return { messages };
    });
  },

  // Phase 6.13: Update a specific user message by index and mark as edited
  updateUserMessage: (index, newContent) => {
    set((state) => {
      const messages = [...state.messages];
      if (messages[index] && messages[index].sender === 'user') {
        messages[index].content = newContent;
        messages[index].isEdited = true; // Mark as edited
      }
      return { messages };
    });
  },

  // Phase 6.13: Remove all messages after a specific index (for edit and regenerate)
  removeMessagesAfterIndex: (index) => {
    set((state) => ({
      messages: state.messages.slice(0, index + 1),
    }));
  },

  // Phase 6.13: Update message and regenerate (ChatGPT-style)
  // This replaces the message in-place and removes everything after it
  updateAndRegenerateFromIndex: (index, newContent) => {
    set((state) => {
      const messages = [...state.messages];
      if (messages[index] && messages[index].sender === 'user') {
        // Update the message content and mark as edited
        messages[index].content = newContent;
        messages[index].isEdited = true;
        // Remove all messages after this one (the old responses)
        return { messages: messages.slice(0, index + 1) };
      }
      return { messages };
    });
  },
}));

export default useChatStore;

import React from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import SuggestedPrompts from "./SuggestedPrompts";
import useChat from "../hooks/useChat";
import useChatStore from "../stores/chat-store";

/**
 * ChatContainer Component
 *
 * Phase 6.10 Updates:
 * - Smart suggested prompts positioning (compact mode when chat active)
 * - Fixed layout: only MessageList scrolls, prompts and input stay fixed
 * - Proper flex layout with overflow handling
 * - Theme-aware background colors
 */
const ChatContainer = () => {
  const { handleSubmit } = useChat();
  const messages = useChatStore((state) => state.messages);

  const handlePromptSelect = (prompt) => {
    handleSubmit(prompt);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Messages - Scrollable area */}
      <MessageList />

      {/* Suggested Prompts - Always visible, adapts layout */}
      <SuggestedPrompts onSelect={handlePromptSelect} compact={hasMessages} />

      {/* Input - Fixed at bottom */}
      <ChatInput />
    </div>
  );
};

export default ChatContainer;

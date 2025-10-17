import React, { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator"; // Phase 5
import useChatStore from "../stores/chat-store";
import useChat from "../hooks/useChat";
import { MessageCircle, Sparkles, Zap, Bot } from "lucide-react";

const MessageList = () => {
  const messages = useChatStore((state) => state.messages);
  const isWaiting = useChatStore((state) => state.isWaiting); // Phase 5
  const getLastUserMessage = useChatStore((state) => state.getLastUserMessage);
  const removeLastAgentMessage = useChatStore((state) => state.removeLastAgentMessage);
  const updateUserMessage = useChatStore((state) => state.updateUserMessage);
  const removeMessagesAfterIndex = useChatStore((state) => state.removeMessagesAfterIndex);
  const showToast = useChatStore((state) => state.showToast);
  const messagesEndRef = useRef(null);
  const { handleSubmit } = useChat();

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Phase 6.12: Regenerate last agent response
  const handleRegenerate = async () => {
    const lastUserMessage = getLastUserMessage();

    if (!lastUserMessage) {
      showToast({
        message: "No message to regenerate",
        type: "warning",
        duration: 2000,
      });
      return;
    }

    // Remove last agent message(s)
    removeLastAgentMessage();

    // Resend the last user message (skip adding it since it's already there)
    await handleSubmit(lastUserMessage, { skipAddingUserMessage: true });

    showToast({
      message: "Regenerating response...",
      type: "info",
      duration: 2000,
    });
  };

  // Phase 6.13: Edit user message and regenerate conversation from that point
  // ChatGPT-style: replaces message in-place, removes all after it, regenerates
  const handleEditMessage = async (messageIndex, newContent) => {
    // Update the user message in-place and mark as edited
    updateUserMessage(messageIndex, newContent);

    // Remove all messages after this one (including agent responses)
    removeMessagesAfterIndex(messageIndex);

    // Resend the edited message to regenerate the conversation
    // Skip adding a new user message since we already updated it in-place
    await handleSubmit(newContent, { skipAddingUserMessage: true });

    showToast({
      message: "Message updated. Generating new response...",
      type: "success",
      duration: 2000,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500 dark:text-gray-400">
            <div className="relative mb-6">
              {/* Animated background circles */}
              <div className="absolute inset-0 animate-ping-slow opacity-20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"></div>
              </div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Welcome to StreamForge
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
              <span role="img" aria-label="spark">
                💬
              </span>{" "}
              Start by typing a message or selecting a suggested prompt below.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full max-w-2xl">
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    Real-time Streaming
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Watch responses appear word-by-word
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    AI Powered
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Advanced language understanding
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    Interactive
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Stop streaming anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-6">
            {messages.map((message, index) => {
              // Check if this is the last agent message
              const isLastAgentMessage =
                message.sender === "agent" &&
                index === messages.length - 1;

              return (
                <Message
                  key={index}
                  message={message}
                  messageIndex={index}
                  isLastAgentMessage={isLastAgentMessage}
                  onRegenerate={handleRegenerate}
                  onEdit={handleEditMessage}
                />
              );
            })}

            {/* Phase 5: Show typing indicator while waiting for first stream chunk */}
            <AnimatePresence mode="wait">
              {isWaiting && (
                <div
                  key="typing-indicator"
                  className="flex justify-start mb-4 animate-fadeIn"
                >
                  <div className="flex gap-3 max-w-[80%]">
                    {/* Avatar - same as assistant messages */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
                      <Bot className="w-5 h-5 text-white" />
                    </div>

                    {/* Typing indicator bubble */}
                    <div className="flex flex-col">
                      <div className="px-4 py-3 rounded-2xl shadow-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm">
                        <TypingIndicator />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;

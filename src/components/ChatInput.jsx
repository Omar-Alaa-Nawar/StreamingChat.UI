import React, { useState } from "react";
import { Send, Square, Sparkles } from "lucide-react";
import useChatStore from "../stores/chat-store";
import useChat from "../hooks/useChat";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const isStreaming = useChatStore((state) => state.isStreaming);
  const { handleSubmit, stopStreaming } = useChat();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    handleSubmit(input);
    setInput("");
  };

  const onStop = () => {
    stopStreaming();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 transition-colors"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          {/* Input Container */}
          <div className="flex-1 relative">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isStreaming}
                placeholder={
                  isStreaming ? "AI is thinking..." : "Ask me anything..."
                }
                className="w-full px-5 py-4 pr-12 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-2xl
                         focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50
                         disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-500 dark:disabled:text-gray-500
                         transition-all duration-200 text-[15px] shadow-sm
                         text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
              {!isStreaming && input.trim() && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles className="w-5 h-5 text-indigo-400 dark:text-indigo-300 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              className="group px-6 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white
                       rounded-2xl hover:from-red-600 hover:to-rose-700
                       transition-all duration-200 flex items-center gap-2 shadow-lg
                       hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Square
                size={20}
                className="group-hover:rotate-90 transition-transform duration-200"
              />
              <span className="font-medium">Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="group px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                       rounded-2xl hover:from-blue-600 hover:to-indigo-700
                       disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                       dark:disabled:from-gray-700 dark:disabled:to-gray-600 dark:disabled:text-gray-400
                       transition-all duration-200 flex items-center gap-2 shadow-lg
                       hover:shadow-xl hover:scale-105 active:scale-95 disabled:scale-100 disabled:shadow-sm"
            >
              <Send
                size={20}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              />
              <span className="font-medium">Send</span>
            </button>
          )}
        </div>

        {/* Helper Text */}
        <div className="mt-3 px-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            Powered by StreamForge AI
          </span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;

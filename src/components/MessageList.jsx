import React, { useEffect, useRef } from 'react';
import Message from './Message';
import TypingIndicator from './TypingIndicator'; // Phase 5
import useChatStore from '../stores/chat-store';
import { MessageCircle, Sparkles, Zap, Bot } from 'lucide-react';

const MessageList = () => {
  const messages = useChatStore((state) => state.messages);
  const isWaiting = useChatStore((state) => state.isWaiting); // Phase 5
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
            <div className="relative mb-6">
              {/* Animated background circles */}
              <div className="absolute inset-0 animate-ping-slow opacity-20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"></div>
              </div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to StreamForge</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Experience real-time AI responses. Start a conversation and watch the magic happen!
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full max-w-2xl">
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">Real-time Streaming</h3>
                  <p className="text-xs text-gray-500 mt-1">Watch responses appear word-by-word</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">AI Powered</h3>
                  <p className="text-xs text-gray-500 mt-1">Advanced language understanding</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">Interactive</h3>
                  <p className="text-xs text-gray-500 mt-1">Stop streaming anytime</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}

            {/* Phase 5: Show typing indicator while waiting for first stream chunk */}
            {isWaiting && (
              <div className="flex justify-start mb-4 animate-fadeIn">
                <div className="flex gap-3 max-w-[80%]">
                  {/* Avatar - same as assistant messages */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>

                  {/* Typing indicator bubble */}
                  <div className="flex flex-col">
                    <div className="px-4 py-3 rounded-2xl shadow-sm bg-white text-gray-800 border border-gray-100 rounded-tl-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;

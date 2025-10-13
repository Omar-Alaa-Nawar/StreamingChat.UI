import React from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Bot } from 'lucide-react';

const ChatContainer = () => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header with Gradient */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="relative px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">StreamForge</h1>
              <p className="text-sm text-blue-100 font-medium">AI Streaming Chat</p>
            </div>
          </div>
        </div>
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <ChatInput />
    </div>
  );
};

export default ChatContainer;

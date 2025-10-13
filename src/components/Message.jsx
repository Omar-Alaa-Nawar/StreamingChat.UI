import React from 'react';
import { User, Bot } from 'lucide-react';

const Message = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
    >
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md'
            : 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-md'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isUser
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-sm'
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
            }`}
          >
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;

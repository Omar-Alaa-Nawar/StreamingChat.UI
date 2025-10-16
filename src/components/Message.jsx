import React from "react";
import { User, Bot } from "lucide-react";
import ComponentRegistry from "./ComponentRegistry";

/**
 * Message Component - Renders chat messages with support for mixed content
 *
 * Phase 0 (backwards compatible): content is a string
 * Phase 1: content is an array of ContentPart objects
 *
 * ContentPart:
 *   { type: 'text', content: string }
 *   | { type: 'component', componentType: string, id: string, data: object }
 */
const Message = ({ message }) => {
  const isUser = message.sender === "user";
  const { content } = message;

  // Render content based on type
  const renderContent = () => {
    // Backwards compatibility: Handle string content (Phase 0)
    if (typeof content === "string") {
      return (
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      );
    }

    // Phase 1: Handle array of content parts
    if (Array.isArray(content)) {
      return (
        <div>
          {content.map((part, index) => {
            // Render text part inline
            if (part.type === "text") {
              return (
                <span
                  key={index}
                  className="text-[15px] leading-relaxed whitespace-pre-wrap break-words"
                >
                  {part.content}
                </span>
              );
            }

            // Render component part as nested card
            if (part.type === "component") {
              const Component = ComponentRegistry[part.componentType];

              if (!Component) {
                console.warn(`Unknown component type: ${part.componentType}`);
                return (
                  <div
                    key={part.id}
                    className="my-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    Unknown component: {part.componentType}
                  </div>
                );
              }

              return <Component key={part.id} id={part.id} data={part.data} />;
            }

            // Render streaming component (incomplete JSON)
            if (part.type === "component-streaming") {
              const Component = ComponentRegistry[part.componentType];

              if (!Component) {
                return (
                  <div
                    key={part.id}
                    className="my-2 text-sm text-gray-400 dark:text-gray-500 animate-pulse"
                  >
                    Loading component...
                  </div>
                );
              }

              return (
                <Component
                  key={part.id}
                  id={part.id}
                  data={part.data}
                  isStreaming={true}
                />
              );
            }

            return null;
          })}
        </div>
      );
    }

    // Fallback for unexpected content type
    return (
      <p className="text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">
        [Invalid message content]
      </p>
    );
  };

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4 animate-fadeIn`}
    >
      <div
        className={`flex gap-3 max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md"
              : "bg-gradient-to-br from-purple-500 to-pink-600 shadow-md"
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div className="flex flex-col">
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm transition-colors ${
              isUser
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-sm"
                : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm"
            }`}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;

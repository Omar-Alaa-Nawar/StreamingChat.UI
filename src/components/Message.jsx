import React, { useState, useRef, useEffect } from "react";
import { User, Bot, Copy, Check, RefreshCw, Edit2, X, Send } from "lucide-react";
import ComponentRegistry from "./ComponentRegistry";
import useChatStore from "../stores/chat-store";
import MarkdownRenderer from "./MarkdownRenderer";

/**
 * Message Component - Renders chat messages with support for mixed content
 *
 * Phase 0 (backwards compatible): content is a string
 * Phase 1: content is an array of ContentPart objects
 *
 * ContentPart:
 *   { type: 'text', content: string }
 *   | { type: 'component', componentType: string, id: string, data: object }
 *
 * Phase 6.11: Added copy button with toast feedback
 * Phase 6.12: Added regenerate button for agent messages
 * Phase 6.13: Added edit button for user messages
 */
const Message = ({ message, isLastAgentMessage, onRegenerate, messageIndex, onEdit }) => {
  const isUser = message.sender === "user";
  const { content } = message;
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const editTextareaRef = useRef(null);
  const showToast = useChatStore((state) => state.showToast);
  const isStreaming = useChatStore((state) => state.isStreaming);

  // Auto-focus and auto-resize textarea when entering edit mode
  useEffect(() => {
    if (isEditing && editTextareaRef.current) {
      editTextareaRef.current.focus();
      // Set cursor to end
      editTextareaRef.current.selectionStart = editTextareaRef.current.value.length;
      editTextareaRef.current.selectionEnd = editTextareaRef.current.value.length;
      // Auto-resize
      editTextareaRef.current.style.height = "auto";
      editTextareaRef.current.style.height = editTextareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  // Extract text content for copying
  const getTextContent = () => {
    if (typeof content === "string") {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .filter((part) => part.type === "text")
        .map((part) => part.content)
        .join("");
    }

    return "";
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    const textToCopy = getTextContent();

    if (!textToCopy) {
      showToast({
        message: "No text to copy",
        type: "warning",
        duration: 2000,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast({
        message: "Copied to clipboard!",
        type: "success",
        duration: 2000,
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast({
        message: "Failed to copy",
        type: "error",
        duration: 2000,
      });
    }
  };

  // Handle edit mode for user messages
  const handleEditClick = () => {
    const textContent = getTextContent();
    setEditedContent(textContent);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent("");
  };

  const handleSaveEdit = () => {
    const trimmedContent = editedContent.trim();

    if (!trimmedContent) {
      showToast({
        message: "Message cannot be empty",
        type: "warning",
        duration: 2000,
      });
      return;
    }

    if (trimmedContent === getTextContent()) {
      // No changes made
      setIsEditing(false);
      return;
    }

    // Call the onEdit handler passed from MessageList
    if (onEdit) {
      onEdit(messageIndex, trimmedContent);
    }

    setIsEditing(false);
  };

  const handleEditKeyDown = (e) => {
    // Ctrl/Cmd + Enter to save
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSaveEdit();
    }
    // Escape to cancel
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  // Render content based on type
  const renderContent = () => {
    // Backwards compatibility: Handle string content (Phase 0)
    // Phase 6.12: Render as markdown for rich formatting
    if (typeof content === "string") {
      // User messages: render as plain text with whitespace preserved
      if (isUser) {
        return (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        );
      }
      // Agent messages: render as markdown for rich formatting
      return <MarkdownRenderer content={content} />;
    }

    // Phase 1: Handle array of content parts
    if (Array.isArray(content)) {
      return (
        <div>
          {content.map((part, index) => {
            // Render text part with markdown for agent messages
            if (part.type === "text") {
              if (isUser) {
                return (
                  <span
                    key={index}
                    className="text-[15px] leading-relaxed whitespace-pre-wrap break-words"
                  >
                    {part.content}
                  </span>
                );
              }
              // Agent text: render as markdown
              return (
                <div key={index}>
                  <MarkdownRenderer content={part.content} />
                </div>
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
        <div className="flex flex-col group">
          {isEditing ? (
            // Edit mode - show textarea
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-indigo-400 dark:border-indigo-500 p-3 w-full">
              <textarea
                ref={editTextareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100
                         focus:outline-none resize-none min-h-[60px] max-h-[300px] overflow-y-auto
                         text-[15px] leading-relaxed"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 300) + "px";
                }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block">
                  Ctrl+Enter to save • Esc to cancel
                </span>
                <div className="flex gap-1.5 justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium
                             bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400
                             hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium
                             bg-indigo-500 text-white hover:bg-indigo-600 transition-colors whitespace-nowrap"
                  >
                    <Send className="w-3 h-3" />
                    <span>Save & Regenerate</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // View mode - show normal message
            <div className="flex flex-col gap-1">
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm transition-colors ${
                  isUser
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-sm"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm"
                }`}
              >
                {renderContent()}
              </div>

              {/* Phase 6.13: Show "edited" indicator for edited messages */}
              {message.isEdited && (
                <span className="text-xs text-gray-400 dark:text-gray-500 italic px-2">
                  (edited)
                </span>
              )}
            </div>
          )}

          {/* Action Buttons - Shows on hover (hide when editing) */}
          {!isEditing && (
            <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200
                  ${
                    copied
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400`}
                aria-label={copied ? "Copied" : "Copy message"}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Edit Button - Only for user messages */}
              {isUser && !isStreaming && onEdit && (
                <button
                  onClick={handleEditClick}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200
                    bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400
                    hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  aria-label="Edit message"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}

              {/* Regenerate Button - Only for last agent message */}
              {!isUser && isLastAgentMessage && !isStreaming && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200
                    bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400
                    hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  aria-label="Regenerate response"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;

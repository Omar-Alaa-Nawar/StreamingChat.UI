import { useRef } from "react";
import useChatStore from "../stores/chat-store";
import logger from "../utils/logger";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8001";

const useChat = () => {
  const abortControllerRef = useRef(null);

  const {
    addUserMessage,
    startAgentMessage,
    updateAgentMessage,
    setIsStreaming,
  } = useChatStore();

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const fetchChatStream = async (userInput) => {
    try {
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      const response = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userInput }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await processStream(response.body);
    } catch (error) {
      // Don't show error for user-initiated abort
      if (error.name === "AbortError") {
        logger.info("[STREAM]", "Stream stopped by user");
      } else {
        logger.error("[STREAM]", "Error fetching chat stream:", error);
        // You could update the store with an error message here
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  /**
   * Parse buffer for $$ delimited components
   * Returns array of content parts: { type: 'text' | 'component', ... }
   * Handles incomplete component JSON during streaming
   */
  const parseBufferForComponents = (buffer) => {
    logger.debug(
      "[PARSE]",
      "Buffer length:",
      buffer.length,
      "First 100 chars:",
      buffer.substring(0, 100)
    );

    const parts = [];
    let lastMatchEnd = 0;

    // Regex to find $$...$$ blocks (double dollar signs - matching backend)
    const componentRegex = /\$\$(.*?)\$\$/gs;
    let match;

    // Find all complete component blocks
    while ((match = componentRegex.exec(buffer)) !== null) {
      logger.debug(
        "[PARSE]",
        "Found complete component at index:",
        match.index
      );
      // Add text before component (if any)
      if (match.index > lastMatchEnd) {
        const textContent = buffer.substring(lastMatchEnd, match.index);
        if (textContent) {
          parts.push({ type: "text", content: textContent });
        }
      }

      // Try to parse component JSON
      try {
        const componentData = JSON.parse(match[1]);
        logger.debug(
          "[PARSE]",
          "Parsed component:",
          componentData.type,
          componentData.id
        );

        // Validate component structure
        if (componentData.type && componentData.id && componentData.data) {
          parts.push({
            type: "component",
            componentType: componentData.type,
            id: componentData.id,
            data: componentData.data,
          });
          logger.debug("[PARSE]", "Added complete component");
        } else {
          logger.debug(
            "[PARSE]",
            "Invalid component structure, treating as text"
          );
          // Invalid structure, treat as text
          parts.push({ type: "text", content: match[0] });
        }
      } catch (e) {
        logger.debug("[PARSE]", "JSON parse failed:", e.message);
        // JSON parse failed, treat as text
        parts.push({ type: "text", content: match[0] });
      }

      lastMatchEnd = match.index + match[0].length;
    }

    // Check for incomplete component (starts with $$ but not closed yet)
    // We need to find the FIRST $$ after lastMatchEnd that doesn't have a closing $$
    const remainingBuffer = buffer.substring(lastMatchEnd);
    const firstDollarDollar = remainingBuffer.indexOf("$$");
    logger.debug(
      "[PARSE]",
      "Checking for incomplete component. firstDollarDollar in remaining:",
      firstDollarDollar,
      "lastMatchEnd:",
      lastMatchEnd
    );

    if (firstDollarDollar !== -1) {
      const incompleteStart = lastMatchEnd + firstDollarDollar;
      // Check if there's a closing $$ after this opening $$
      const hasClosing =
        remainingBuffer.indexOf("$$", firstDollarDollar + 2) !== -1;
      logger.debug("[PARSE]", "Has closing $$:", hasClosing);

      if (!hasClosing) {
        // We have an incomplete component, show text up to $$
        if (incompleteStart > lastMatchEnd) {
          const textContent = buffer.substring(lastMatchEnd, incompleteStart);
          if (textContent) {
            parts.push({ type: "text", content: textContent });
            logger.debug("[PARSE]", "Added text before incomplete component");
          }
        }

        // Try to parse incomplete JSON as streaming component
        const incompleteJson = buffer.substring(incompleteStart + 2);
        logger.debug(
          "[PARSE]",
          "Incomplete JSON:",
          incompleteJson.substring(0, 50)
        );

        if (incompleteJson.trim()) {
          try {
            const partialData = JSON.parse(incompleteJson + '}"}');
            logger.debug(
              "[PARSE]",
              "Streaming component with partial data:",
              partialData
            );
            // We have some parseable data, show as streaming component
            parts.push({
              type: "component-streaming",
              componentType: partialData.type || "SimpleComponent",
              id: partialData.id || "streaming",
              data: partialData.data || {},
              rawJson: incompleteJson,
            });
            logger.debug("[PARSE]", "Added streaming component");
          } catch (e) {
            logger.debug(
              "[PARSE]",
              "Could not parse incomplete JSON yet, showing as text"
            );
            // Not enough JSON yet, show as text
            parts.push({ type: "text", content: "$$" + incompleteJson });
          }
        }
      } else {
        // Add remaining text after last complete component
        if (lastMatchEnd < buffer.length) {
          const textContent = buffer.substring(lastMatchEnd);
          if (textContent) {
            parts.push({ type: "text", content: textContent });
          }
        }
      }
    } else {
      // No incomplete component, add remaining text
      if (lastMatchEnd < buffer.length) {
        const textContent = buffer.substring(lastMatchEnd);
        if (textContent) {
          parts.push({ type: "text", content: textContent });
        }
      }
    }

    logger.debug("[PARSE]", "Returning", parts.length, "parts");
    return parts;
  };

  const processStream = async (readableStream) => {
    const reader = readableStream.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          logger.debug("[STREAM]", "Stream complete");
          break;
        }

        // Decode the chunk and add to buffer
        const chunk = decoder.decode(value, { stream: true });
        logger.debug(
          "[STREAM]",
          "Raw chunk size:",
          value.length,
          "Decoded chunk:",
          chunk
        );
        buffer += chunk;
        logger.debug(
          "[STREAM]",
          "Received chunk, buffer length:",
          buffer.length,
          "New chars:",
          chunk.length
        );

        // Parse buffer for components and text
        const contentParts = parseBufferForComponents(buffer);
        logger.debug("[STREAM]", "Parsed into", contentParts.length, "parts");

        // Update the agent message with parsed content
        updateAgentMessage(contentParts);
      }
    } catch (error) {
      logger.error("[STREAM]", "Error:", error);
      // Re-throw to be caught by fetchChatStream
      throw error;
    } finally {
      reader.releaseLock();
    }
  };

  const handleSubmit = async (userInput) => {
    if (!userInput.trim()) return;

    // Add user message to chat
    addUserMessage(userInput);

    // Start streaming
    setIsStreaming(true);

    // Create empty agent message
    startAgentMessage();

    // Fetch and process stream
    await fetchChatStream(userInput);
  };

  return {
    handleSubmit,
    stopStreaming,
  };
};

export default useChat;

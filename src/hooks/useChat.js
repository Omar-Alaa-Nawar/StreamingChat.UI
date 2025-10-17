import { useRef } from "react";
import useChatStore from "../stores/chat-store";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8001";

const useChat = () => {
  const abortControllerRef = useRef(null);

  const {
    addUserMessage,
    startAgentMessage,
    updateAgentMessage,
    setIsStreaming,
    setIsWaiting, // Phase 5: Typing indicator state
  } = useChatStore();

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsWaiting(false); // Phase 5: Clear waiting state when stopped
  };

  const fetchChatStream = async (userInput) => {
    try {
      // Phase 5: Show typing indicator immediately
      setIsWaiting(true);

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
        console.log("Stream stopped by user");
      } else {
        console.error("Error fetching chat stream:", error);
        // You could update the store with an error message here
      }
    } finally {
      setIsStreaming(false);
      setIsWaiting(false); // Phase 5: Clear waiting state when done
      abortControllerRef.current = null;
    }
  };

  /**
   * Generate a fast hash for a row array
   * Uses simple string concatenation with a delimiter to avoid JSON.stringify overhead
   */
  const hashRow = (row) => {
    return row.map((cell) => String(cell ?? "")).join("|");
  };

  /**
   * Smart merge for component data - handles arrays intelligently
   * For TableA, concatenates rows arrays instead of replacing
   */
  const smartMergeComponentData = (existingData, newData, componentType) => {
    if (componentType === "TableA" && existingData?.rows && newData?.rows) {
      // For TableA, concatenate rows if they're different
      // Use a Set with hash-based keys for O(1) duplicate detection
      const existingRowHashes = new Set(existingData.rows.map(hashRow));
      const mergedRows = [...existingData.rows];

      // Add new rows that aren't already in the existing rows
      newData.rows.forEach((newRow) => {
        const rowHash = hashRow(newRow);
        if (!existingRowHashes.has(rowHash)) {
          mergedRows.push(newRow);
          existingRowHashes.add(rowHash);
        }
      });

      console.log(
        "[SMART MERGE] TableA rows:",
        "existing:",
        existingData.rows.length,
        "new:",
        newData.rows.length,
        "merged:",
        mergedRows.length,
        "merged data:",
        mergedRows
      );

      return {
        ...existingData,
        ...newData,
        rows: mergedRows,
      };
    }

    // Default: simple spread merge
    return { ...existingData, ...newData };
  };

  /**
   * Parse buffer for $$$ delimited components (Phase 2)
   * Returns array of content parts: { type: 'text' | 'component', ... }
   * Handles incomplete component JSON during streaming
   * Merges component updates by ID (progressive rendering)
   */
  const parseBufferForComponents = (buffer, existingParts = []) => {
    console.log(
      "[PARSE] Buffer length:",
      buffer.length,
      "First 100 chars:",
      buffer.substring(0, 100)
    );

    const parts = [];
    let lastMatchEnd = 0;

    // Build a map of existing component data by ID for merging
    const existingComponentData = new Map();
    existingParts.forEach((part) => {
      if (part.type === "component" || part.type === "component-streaming") {
        existingComponentData.set(part.id, part.data);
      }
    });

    // Track components we've seen in current buffer to detect updates
    const seenInBuffer = new Map();

    // Regex to find $$$...$$$  blocks (triple dollar signs - Phase 2 backend)
    const componentRegex = /\$\$\$(.*?)\$\$\$/gs;
    let match;

    // Find all complete component blocks
    while ((match = componentRegex.exec(buffer)) !== null) {
      console.log("[PARSE] Found complete component at index:", match.index);
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
        console.log(
          "[PARSE] Parsed component:",
          componentData.type,
          componentData.id
        );

        // Validate component structure
        if (
          componentData.type &&
          componentData.id &&
          componentData.data !== undefined
        ) {
          const componentId = componentData.id;

          // Check if we've already seen this component ID in the current buffer
          if (seenInBuffer.has(componentId)) {
            console.log("[UPDATE] Updating component in buffer:", componentId);
            // Get the existing component from our buffer parse
            const existingInBuffer = seenInBuffer.get(componentId);
            // Merge with new data using smart merge
            existingInBuffer.data = smartMergeComponentData(
              existingInBuffer.data,
              componentData.data,
              componentData.type
            );
          } else {
            // First time seeing this component in current buffer
            const existingData = existingComponentData.get(componentId);

            const newComponent = {
              type: "component",
              componentType: componentData.type,
              id: componentId,
              data: existingData
                ? smartMergeComponentData(
                    existingData,
                    componentData.data,
                    componentData.type
                  )
                : componentData.data,
            };

            if (existingData) {
              console.log(
                "[MERGE] Merging with existing component:",
                componentId,
                "Old data:",
                existingData,
                "New data:",
                componentData.data,
                "Merged:",
                newComponent.data
              );
            } else {
              console.log("[NEW] Adding new component:", componentId);
            }

            parts.push(newComponent);
            seenInBuffer.set(componentId, newComponent);
          }
        } else {
          console.log("[PARSE] Invalid component structure, treating as text");
          // Invalid structure, treat as text
          parts.push({ type: "text", content: match[0] });
        }
      } catch (e) {
        console.log("[PARSE] JSON parse failed:", e.message);
        // JSON parse failed, treat as text
        parts.push({ type: "text", content: match[0] });
      }

      lastMatchEnd = match.index + match[0].length;
    }

    // Check for incomplete component (starts with $$$ but not closed yet)
    // We need to find the FIRST $$$ after lastMatchEnd that doesn't have a closing $$$
    const remainingBuffer = buffer.substring(lastMatchEnd);
    const firstTripleDollar = remainingBuffer.indexOf("$$$");
    console.log(
      "[PARSE] Checking for incomplete component. firstTripleDollar in remaining:",
      firstTripleDollar,
      "lastMatchEnd:",
      lastMatchEnd
    );

    if (firstTripleDollar !== -1) {
      const incompleteStart = lastMatchEnd + firstTripleDollar;
      // Check if there's a closing $$$ after this opening $$$
      const hasClosing =
        remainingBuffer.indexOf("$$$", firstTripleDollar + 3) !== -1;
      console.log("[PARSE] Has closing $$:", hasClosing);

      if (!hasClosing) {
        // We have an incomplete component, show text up to $$
        if (incompleteStart > lastMatchEnd) {
          const textContent = buffer.substring(lastMatchEnd, incompleteStart);
          if (textContent) {
            parts.push({ type: "text", content: textContent });
            console.log("[PARSE] Added text before incomplete component");
          }
        }

        // Try to parse incomplete JSON as streaming component
        const incompleteJson = buffer.substring(incompleteStart + 3);
        console.log(
          "[PARSE] Incomplete JSON:",
          incompleteJson.substring(0, 50)
        );

        if (incompleteJson.trim()) {
          try {
            const partialData = JSON.parse(incompleteJson + '}"}');
            console.log(
              "[PARSE] Streaming component with partial data:",
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
            console.log("[PARSE] Added streaming component");
          } catch (e) {
            console.log(
              "[PARSE] Could not parse incomplete JSON yet, showing as text"
            );
            // Not enough JSON yet, show as text
            parts.push({ type: "text", content: "$$$" + incompleteJson });
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

    console.log("[PARSE] Returning", parts.length, "parts");
    return parts;
  };

  const processStream = async (readableStream) => {
    const reader = readableStream.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let currentParts = []; // Track current parsed parts for merging
    let isFirstChunk = true; // Phase 5: Track first chunk to hide typing indicator

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("[STREAM] Stream complete");
          break;
        }

        // Phase 5: Hide typing indicator and create agent message on first chunk
        if (isFirstChunk) {
          setIsWaiting(false);
          startAgentMessage(); // Create the agent message now
          isFirstChunk = false;
          console.log("[STREAM] First chunk received - hiding typing indicator and creating message");
        }

        // Decode the chunk and add to buffer
        const chunk = decoder.decode(value, { stream: true });
        console.log(
          "[STREAM] Raw chunk size:",
          value.length,
          "Decoded chunk:",
          chunk
        );
        buffer += chunk;
        console.log(
          "[STREAM] Received chunk, buffer length:",
          buffer.length,
          "New chars:",
          chunk.length
        );

        // Parse buffer for components and text, passing existing parts for merging
        const contentParts = parseBufferForComponents(buffer, currentParts);
        console.log("[STREAM] Parsed into", contentParts.length, "parts");

        // Update current parts for next iteration
        currentParts = contentParts;

        // Update the agent message with parsed content
        updateAgentMessage(contentParts);
      }
    } catch (error) {
      console.error("[STREAM] Error:", error);
      // Re-throw to be caught by fetchChatStream
      throw error;
    } finally {
      reader.releaseLock();
    }
  };

  const handleSubmit = async (userInput, options = {}) => {
    if (!userInput.trim()) return;

    // Phase 6.13: Skip adding user message if it's a regeneration/edit
    // (message already exists in chat history)
    if (!options.skipAddingUserMessage) {
      addUserMessage(userInput);
    }

    // Start streaming
    setIsStreaming(true);

    // Phase 5: Don't create empty message - let typing indicator show instead
    // startAgentMessage() will be called when first chunk arrives

    // Fetch and process stream
    await fetchChatStream(userInput);
  };

  return {
    handleSubmit,
    stopStreaming,
  };
};

export default useChat;

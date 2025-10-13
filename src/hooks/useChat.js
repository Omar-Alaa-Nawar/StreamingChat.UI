import { useRef } from 'react';
import useChatStore from '../stores/chat-store';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8001';

const useChat = () => {
  const abortControllerRef = useRef(null);

  const {
    addUserMessage,
    startAgentMessage,
    updateAgentMessage,
    setIsStreaming
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      if (error.name === 'AbortError') {
        console.log('Stream stopped by user');
      } else {
        console.error('Error fetching chat stream:', error);
        // You could update the store with an error message here
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const processStream = async (readableStream) => {
    const reader = readableStream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        // Decode the chunk and add to buffer
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Update the agent message with accumulated content
        updateAgentMessage(buffer);
      }
    } catch (error) {
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

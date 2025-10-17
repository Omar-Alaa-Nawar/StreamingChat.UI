import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import ToastContainer from "./components/Toast";
import KeyboardShortcutsModal from "./components/KeyboardShortcutsModal";
import useChatStore from "./stores/chat-store";
import useChat from "./hooks/useChat";
import "./App.css";

/**
 * App Component - Main application entry point
 *
 * Phase 6.12 Updates:
 * - Keyboard shortcuts support (Ctrl+/, Ctrl+K, Esc)
 * - Markdown rendering with syntax highlighting
 * - Regenerate response button
 * - Shift+Enter for multiline input
 *
 * Phase 6.11 Updates:
 * - Added ToastContainer for toast notifications
 * - Copy button with toast feedback on messages
 *
 * Phase 6.9 Updates:
 * - Framer Motion integration for fluid animations
 * - Enhanced micro-interactions (ThemeToggle, TypingIndicator)
 * - Removed unnecessary theme overlay (CSS transitions handle it smoothly)
 *
 * Phase 6.8 Updates:
 * - Smooth theme transitions (0.35s cubic-bezier)
 * - Enhanced transition-colors for seamless dark/light mode switching
 *
 * Phase 6.2 Updates:
 * - Wrapped with ThemeProvider for dark/light mode
 * - Added Header component with theme toggle and profile menu
 * - Maintains existing ChatContainer functionality
 */
function App() {
  const toasts = useChatStore((state) => state.toasts);
  const dismissToast = useChatStore((state) => state.dismissToast);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { stopStreaming } = useChat();

  // Phase 6.12: Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+/ or Cmd+/ - Show keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setShowShortcuts(true);
      }

      // Ctrl+K or Cmd+K - Focus chat input
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const chatInput = document.querySelector('textarea[placeholder="Type your message..."]');
        if (chatInput) {
          chatInput.focus();
        }
      }

      // Esc - Stop streaming or close shortcuts modal
      if (e.key === "Escape") {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else {
          stopStreaming();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showShortcuts, stopStreaming]);

  return (
    <ThemeProvider>
      <div className="App flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-500 ease-in-out">
        <Header />
        <ChatContainer />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <KeyboardShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;

import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import ChatContainer from "./components/ChatContainer";
import "./App.css";

/**
 * App Component - Main application entry point
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
  return (
    <ThemeProvider>
      <div className="App flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-500 ease-in-out">
        <Header />
        <ChatContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;

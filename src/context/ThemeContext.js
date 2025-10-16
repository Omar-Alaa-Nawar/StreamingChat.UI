import { createContext, useContext, useState, useEffect } from "react";

/**
 * ThemeContext - Phase 6.3
 *
 * Provides global theme state (light/dark) with localStorage persistence.
 * Respects OS preference on first load.
 *
 * Usage:
 *   // Wrap app with provider
 *   <ThemeProvider>
 *     <App />
 *   </ThemeProvider>
 *
 *   // Use in components
 *   const { theme, toggleTheme } = useTheme();
 */

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("streamforge-theme");
    if (saved) return saved;
    // Default to light theme
    return "light";
  });

  // Apply theme class to document and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;

    // Remove both classes first to ensure clean state
    root.classList.remove("light", "dark");

    // Add the active theme class
    root.classList.add(theme);

    // Persist to localStorage
    localStorage.setItem("streamforge-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for consuming theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;

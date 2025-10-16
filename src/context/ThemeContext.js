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
  // Initialize theme from localStorage or respect OS preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("streamforge-theme");
    if (saved) return saved;
    // Respect OS preference on first load
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  // Apply theme class to document and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;

    // Only toggle 'dark' class; 'light' is default and needs no class
    root.classList.toggle("dark", theme === "dark");

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

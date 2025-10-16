import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Tooltip from "./Tooltip";

/**
 * ThemeToggle Component - Phase 6.10
 *
 * Premium toggle button for switching between light and dark themes.
 * Shows Moon icon in light mode, Sun icon in dark mode.
 *
 * Features:
 * - Framer Motion spring animations (whileTap, whileHover)
 * - Smooth icon rotation and fade transitions
 * - Tactile feedback with scale and rotate on tap
 * - Theme-adaptive tooltip on hover
 * - Accessible button with proper ARIA labels
 * - Integrates with ThemeContext
 * - GPU-accelerated animations for 60 FPS
 *
 * Usage:
 *   <ThemeToggle />
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={toggleTheme}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileTap={{ scale: 0.9, rotate: 15 }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative w-10 h-10 flex items-center justify-center rounded-full 
                   bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                   transition-colors shadow-sm"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <Tooltip
        text={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        show={showTooltip}
        position="left"
      />
    </div>
  );
};

export default ThemeToggle;

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

/**
 * TypingIndicator Component - Phase 6.10 Enhanced (ChatGPT-style)
 *
 * Displays an animated three-dot "typing" indicator while waiting for LLM response.
 * Inspired by ChatGPT's elegant wave animation.
 *
 * Features:
 * - Classic wave bounce animation (ChatGPT-style)
 * - Smooth continuous loop with perfect timing
 * - Theme-aware colors with subtle glow in dark mode
 * - Hardware-accelerated CSS animations (60 FPS)
 * - Elegant fade-in/fade-out entrance and exit
 *
 * Usage:
 *   <AnimatePresence mode="wait">
 *     {isWaiting && <TypingIndicator key="typing" />}
 *   </AnimatePresence>
 *
 * Typical placement:
 *   {isWaiting && <TypingIndicator />}
 */
const TypingIndicator = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      role="status"
      aria-label="Assistant is thinking"
      className="flex items-center justify-center gap-1 py-2"
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 0.3,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
          className={`w-2 h-2 rounded-full transition-colors duration-300
            ${isDark ? "bg-indigo-400" : "bg-indigo-600"}`}
          style={{
            boxShadow: isDark
              ? "0 0 8px rgba(129, 140, 248, 0.5)"
              : "0 0 4px rgba(79, 70, 229, 0.3)",
          }}
        />
      ))}
    </motion.div>
  );
};

export default TypingIndicator;

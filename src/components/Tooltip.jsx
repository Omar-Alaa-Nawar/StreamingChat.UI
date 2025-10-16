import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

/**
 * Tooltip Component - Phase 6.10
 *
 * Theme-adaptive tooltip with smooth animations and auto-positioning.
 * Automatically matches dark/light theme colors and transitions.
 *
 * Features:
 * - Theme-aware background and text colors
 * - Framer Motion fade + scale animation (0.2s)
 * - Position variants: top, bottom, left, right
 * - Smooth transitions when theme changes (0.5s)
 * - Shadow adaptation for both themes
 * - GPU-accelerated animations (60 FPS)
 *
 * Usage:
 *   const [showTip, setShowTip] = useState(false);
 *
 *   <div className="relative">
 *     <button
 *       onMouseEnter={() => setShowTip(true)}
 *       onMouseLeave={() => setShowTip(false)}
 *     >
 *       Hover me
 *     </button>
 *     <Tooltip text="Hello!" show={showTip} position="top" />
 *   </div>
 *
 * Props:
 *   - text: string - The tooltip content
 *   - show: boolean - Controls visibility
 *   - position: "top" | "bottom" | "left" | "right" - Tooltip placement
 */
const Tooltip = ({ text, show, position = "top" }) => {
  const { theme } = useTheme();

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  // Fallback to "top" if invalid position is provided
  const posClass = positionClasses[position] || positionClasses.top;

  const bgColor =
    theme === "dark"
      ? "bg-slate-800 text-gray-100 shadow-lg shadow-indigo-900/20 border border-slate-700"
      : "bg-white text-gray-900 shadow-lg shadow-gray-300/30 border border-gray-200";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 5 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={`absolute z-50 px-3 py-1.5 text-sm rounded-lg whitespace-nowrap
            transition-colors duration-500 ease-in-out tooltip
            ${bgColor} ${posClass}`}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tooltip;

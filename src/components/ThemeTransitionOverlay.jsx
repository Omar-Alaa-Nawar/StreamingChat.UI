import React from "react";
import { motion } from "framer-motion";

/**
 * ThemeTransitionOverlay Component - Phase 6.9 (Refined)
 *
 * Provides a very subtle ambient overlay that fades during theme transitions,
 * creating a smooth transition without harsh flashes.
 *
 * Features:
 * - Ultra-subtle opacity fade (0.08 max opacity)
 * - Pointer-events disabled (doesn't block interaction)
 * - Adapts to current theme (black for dark, white for light)
 * - Fixed positioning over entire viewport
 * - GPU-accelerated animations
 * - Fast transition (0.3s)
 *
 * Usage:
 *   <AnimatePresence mode="wait">
 *     <ThemeTransitionOverlay key={theme} theme={theme} />
 *   </AnimatePresence>
 *
 * Integration:
 *   Place above your main layout in App.js
 */
const ThemeTransitionOverlay = ({ theme }) => (
  <motion.div
    key={theme}
    initial={{ opacity: 0 }}
    animate={{ opacity: 0 }}
    exit={{ opacity: 0.08 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    className={`fixed inset-0 pointer-events-none z-50 ${
      theme === "dark" ? "bg-black" : "bg-white"
    }`}
  />
);

export default ThemeTransitionOverlay;

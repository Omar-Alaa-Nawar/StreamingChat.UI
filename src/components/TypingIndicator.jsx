import React from "react";

/**
 * TypingIndicator Component - Phase 5
 *
 * Displays an animated three-dot "typing" indicator while waiting for LLM response.
 * Shows immediately after user sends a message, hides when first stream chunk arrives.
 *
 * Features:
 * - Three bouncing dots with staggered animation (0ms, 150ms, 300ms delays)
 * - Smooth fade-in entrance animation (400ms)
 * - "Thinking..." label for accessibility
 * - Indigo color scheme matching Phase 4 components
 * - Hardware-accelerated CSS animations (60 FPS)
 *
 * Usage:
 *   <TypingIndicator />
 *
 * Typical placement:
 *   {isWaiting && <TypingIndicator />}
 */
const TypingIndicator = () => (
  <div
    className="flex items-center space-x-1 animate-typing-fadeIn"
    role="status"
    aria-live="polite"
    aria-label="Assistant is thinking"
  >
    {/* Dot 1: Bounces first (0ms delay) */}
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-typing-bounce delay-[0ms]" />

    {/* Dot 2: Bounces after 150ms */}
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-typing-bounce delay-[150ms]" />

    {/* Dot 3: Bounces after 300ms */}
    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-typing-bounce delay-[300ms]" />
  </div>
);

export default TypingIndicator;

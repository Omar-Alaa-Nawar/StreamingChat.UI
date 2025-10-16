import React from "react";
import { Sparkles } from "lucide-react";

/**
 * SuggestedPrompts Component - Phase 6.10 Enhanced
 *
 * Displays quick-access buttons for common test queries.
 * Useful for testing different component types and features.
 *
 * Features:
 * - Categorized prompts with visual icons
 * - Responsive grid layout
 * - Enhanced hover effects with Framer Motion-style transitions
 * - Full dark mode support with theme-aware styling
 * - Smart visibility (hide when user starts chatting)
 *
 * Usage:
 *   <SuggestedPrompts onSelect={(prompt) => sendMessage(prompt)} />
 */

const suggestedPrompts = [
  { label: "Card", prompt: "show me a card", icon: "🃏", category: "Basic" },
  {
    label: "Delayed Card",
    prompt: "show me a delayed card",
    icon: "🕒",
    category: "Basic",
  },
  { label: "Table", prompt: "show me a table", icon: "📋", category: "Data" },
  {
    label: "Line Chart",
    prompt: "show me a line chart",
    icon: "📈",
    category: "Charts",
  },
  {
    label: "Bar Chart",
    prompt: "show me a bar chart",
    icon: "📊",
    category: "Charts",
  },
  {
    label: "Messi Stats",
    prompt: "LLM Lionel Messi dashboard",
    icon: "⚽",
    category: "Advanced",
  },
  {
    label: "AI Dashboard",
    prompt: "show me an AI dashboard with sales data",
    icon: "🧠",
    category: "Advanced",
  },
];

const SuggestedPrompts = ({ onSelect, compact = false }) => {
  if (compact) {
    // Compact horizontal scrollable version for when chat has messages
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5 overflow-x-auto overflow-y-hidden custom-scrollbar-horizontal pb-1.5 pt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
            {suggestedPrompts.map((item) => (
              <button
                key={item.prompt}
                onClick={() => onSelect(item.prompt)}
                className="group flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800
                           hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50
                           dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30
                           hover:border-indigo-300 dark:hover:border-indigo-600
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                           hover:shadow-sm"
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full grid version for empty state
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 transition-colors px-6 py-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Try these prompts
          </span>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {suggestedPrompts.map((item) => (
            <button
              key={item.prompt}
              onClick={() => onSelect(item.prompt)}
              className="group relative text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800/50 backdrop-blur-sm
                         hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50
                         dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30
                         hover:border-indigo-300 dark:hover:border-indigo-600
                         hover:shadow-md dark:hover:shadow-indigo-900/20
                         hover:z-10
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              <div className="flex items-start gap-2">
                <span className="text-xl transition-transform duration-200">
                  {item.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {item.category}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedPrompts;

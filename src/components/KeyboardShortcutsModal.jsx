import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Command, Keyboard } from "lucide-react";

/**
 * KeyboardShortcutsModal Component - Phase 6.12
 *
 * Displays available keyboard shortcuts in a modal overlay.
 * Triggered by Ctrl+/ (or Cmd+/ on Mac)
 *
 * Features:
 * - Smooth Framer Motion animations
 * - Organized shortcut categories
 * - Escape key to close
 * - Click outside to close
 * - Full dark mode support
 * - Platform-aware (shows Ctrl vs Cmd based on OS)
 *
 * Usage:
 *   const [showShortcuts, setShowShortcuts] = useState(false);
 *   <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
 */

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const modKey = isMac ? "⌘" : "Ctrl";

  const shortcuts = [
    {
      category: "General",
      items: [
        { keys: [modKey, "/"], description: "Show keyboard shortcuts" },
        { keys: [modKey, "K"], description: "Focus chat input" },
        { keys: ["Esc"], description: "Stop streaming response" },
      ],
    },
    {
      category: "Chat Input",
      items: [
        { keys: ["Enter"], description: "Send message" },
        { keys: ["Shift", "Enter"], description: "New line in message" },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Keyboard Shortcuts
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                {shortcuts.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mb-6 last:mb-0">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {shortcut.description}
                          </span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <React.Fragment key={keyIndex}>
                                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                                  {key}
                                </kbd>
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className="text-gray-400 dark:text-gray-500 text-xs mx-0.5">
                                    +
                                  </span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Footer hint */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                      Esc
                    </kbd>{" "}
                    to close this dialog
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsModal;

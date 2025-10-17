import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";

/**
 * Toast Component - Phase 6.11
 *
 * Displays temporary notification messages with automatic dismissal.
 * Supports different types: success, error, warning, info
 *
 * Features:
 * - Smooth enter/exit animations with Framer Motion
 * - Auto-dismiss after configurable duration
 * - Manual dismiss button
 * - Icon based on toast type
 * - Full dark mode support
 * - Positioned at top-right of viewport
 *
 * Usage:
 *   const { showToast } = useChatStore();
 *   showToast({ message: "Copied!", type: "success" });
 */

const Toast = ({ toast, onDismiss }) => {
  const { id, message, type = "info", duration = 3000 } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  // Icon mapping
  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  // Color classes based on type
  const colorClasses = {
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    error:
      "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    warning:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
  };

  const iconColorClasses = {
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    info: "text-blue-600 dark:text-blue-400",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm ${colorClasses[type]} min-w-[300px] max-w-[400px]`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${iconColorClasses[type]}`}>
        {icons[type]}
      </div>

      {/* Message */}
      <div className="flex-1 text-sm font-medium">{message}</div>

      {/* Dismiss Button */}
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-current"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

/**
 * ToastContainer - Manages multiple toasts
 *
 * Positioned at top-right, just below the header for maximum visibility.
 * This placement ensures toasts are immediately seen without blocking chat content.
 */
const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;

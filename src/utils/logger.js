/**
 * Logger utility with configurable log levels
 * Logs can be disabled in production by setting REACT_APP_ENABLE_LOGGING=false
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

class Logger {
  constructor() {
    // Check if logging is enabled via environment variable
    // Default to true in development, false in production
    const isProduction = process.env.NODE_ENV === "production";
    const enableLogging = process.env.REACT_APP_ENABLE_LOGGING !== "false";

    this.enabled = !isProduction || enableLogging;

    // Set log level from environment or default to DEBUG in dev, ERROR in prod
    const envLogLevel =
      process.env.REACT_APP_LOG_LEVEL || (isProduction ? "ERROR" : "DEBUG");
    this.logLevel = LOG_LEVELS[envLogLevel] || LOG_LEVELS.DEBUG;
  }

  /**
   * Format log message with prefix and timestamp
   */
  formatMessage(prefix, ...args) {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    const prefixStr = prefix ? ` ${prefix}` : "";
    return [`[${timestamp}]${prefixStr}`, ...args];
  }

  /**
   * Log debug messages (verbose logging for development)
   */
  debug(prefix, ...args) {
    if (this.enabled && this.logLevel <= LOG_LEVELS.DEBUG) {
      console.log(...this.formatMessage(prefix, ...args));
    }
  }

  /**
   * Log informational messages
   */
  info(prefix, ...args) {
    if (this.enabled && this.logLevel <= LOG_LEVELS.INFO) {
      console.log(...this.formatMessage(prefix, ...args));
    }
  }

  /**
   * Log warning messages
   */
  warn(prefix, ...args) {
    if (this.enabled && this.logLevel <= LOG_LEVELS.WARN) {
      console.warn(...this.formatMessage(prefix, ...args));
    }
  }

  /**
   * Log error messages
   */
  error(prefix, ...args) {
    if (this.enabled && this.logLevel <= LOG_LEVELS.ERROR) {
      console.error(...this.formatMessage(prefix, ...args));
    }
  }

  /**
   * Group related logs together (useful for complex operations)
   */
  group(label) {
    if (this.enabled && console.group) {
      console.group(label);
    }
  }

  groupEnd() {
    if (this.enabled && console.groupEnd) {
      console.groupEnd();
    }
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;

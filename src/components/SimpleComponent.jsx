import React, { useEffect } from "react";
import { Calendar, TrendingUp } from "lucide-react";

/**
 * SimpleComponent - A card component that displays structured data
 * Phase 2: Supports progressive rendering (empty → partial → complete)
 *
 * Props:
 *   - id: Unique identifier for the component
 *   - data: {
 *       title?: string,
 *       description?: string,
 *       value?: number,        // Legacy field name
 *       units?: number,        // New field name (Phase 2.1)
 *       timestamp?: string,    // Legacy field name (ISO format)
 *       date?: string          // New field name (ISO format, Phase 2.1)
 *     }
 *   - isStreaming: boolean (optional) - indicates if component is still receiving data
 */
const SimpleComponent = ({ id, data = {}, isStreaming = false }) => {
  // Support both old and new field names for backwards compatibility
  const { title, description, value, units, timestamp, date } = data;

  // Use new field names (units, date) if available, otherwise fall back to old names
  const displayValue = units !== undefined ? units : value;
  const displayTimestamp = date || timestamp;

  // Debug logging to verify re-renders on data updates
  useEffect(() => {
    console.log("[SimpleComponent] ID:", id, "Data update:", data);
  }, [data, id]);

  // Determine rendering state based on available data
  const isEmpty = Object.keys(data).length === 0;
  const isPartial =
    !isEmpty && (title === undefined || displayValue === undefined);
  const isComplete = title !== undefined && displayValue !== undefined;

  console.log("[SimpleComponent] Rendering ID:", id, "State:", {
    isEmpty,
    isPartial,
    isComplete,
    data,
  });

  // Format timestamp for display
  const formatTimestamp = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return isoString;
    }
  };

  // Empty state - skeleton loader with informative text
  if (isEmpty) {
    return (
      <div className="my-2 animate-fadeIn">
        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-indigo-200 shadow-sm overflow-hidden">
          <div className="relative p-4">
            {/* Skeleton header */}
            <div className="flex items-start justify-between mb-2">
              <div className="skeleton h-5 w-32 rounded"></div>
              <div className="p-1.5 bg-gray-200 rounded-md skeleton">
                <TrendingUp className="w-4 h-4 text-transparent" />
              </div>
            </div>

            {/* Skeleton description with placeholder text */}
            <p className="text-gray-400 text-xs mb-3 leading-relaxed italic">
              Loading card data...
            </p>

            {/* Skeleton value with informative placeholder */}
            <div className="mb-3 p-3 bg-gray-100 rounded-md border border-gray-200">
              <div className="text-xs text-gray-400 italic">
                <span className="font-medium">Units</span>
                <br />
                <span className="text-[10px]">
                  ⏱️ [5.0s gap detected at 5.5s]
                </span>
                <br />
                <span>were updated after 5 second delay.</span>
              </div>
            </div>

            {/* Skeleton timestamp */}
            <div className="flex items-center gap-1.5 pt-2 border-t border-gray-200">
              <Calendar className="w-3 h-3 text-gray-300" />
              <div className="skeleton h-3 w-24 rounded"></div>
            </div>
          </div>
          <div className="h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"></div>
        </div>
      </div>
    );
  }

  // Partial or Complete state - render with available data
  return (
    <div className="my-2 animate-fadeIn">
      <div
        className="relative bg-gradient-to-br from-gray-50 to-white rounded-lg
                   border-2 border-indigo-200 shadow-sm hover:shadow-md
                   transition-all duration-300 overflow-hidden"
      >
        {/* Card content */}
        <div className="relative p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            {title !== undefined ? (
              <h3 className="text-base font-bold text-gray-900 leading-tight">
                {title}
              </h3>
            ) : (
              <div className="skeleton h-5 w-32 rounded"></div>
            )}
            <div
              className={`p-1.5 ${
                isComplete
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                  : "bg-gray-200 skeleton"
              } rounded-md`}
            >
              <TrendingUp
                className={`w-4 h-4 ${
                  isComplete ? "text-white" : "text-transparent"
                }`}
              />
            </div>
          </div>

          {/* Description */}
          {description !== undefined ? (
            <p className="text-gray-600 text-xs mb-3 leading-relaxed">
              {description}
            </p>
          ) : (
            <div className="skeleton h-4 w-full rounded mb-3"></div>
          )}

          {/* Value display */}
          <div
            className={`mb-3 p-3 rounded-md border ${
              isComplete
                ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-100"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            {displayValue !== undefined ? (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {displayValue}
                </span>
                <span className="text-xs text-gray-500 font-medium">units</span>
              </div>
            ) : (
              <div className="skeleton h-8 w-20 rounded"></div>
            )}
          </div>

          {/* Timestamp footer */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-gray-200">
            <Calendar className="w-3 h-3" />
            {displayTimestamp !== undefined ? (
              <span>{formatTimestamp(displayTimestamp)}</span>
            ) : (
              <div className="skeleton h-3 w-24 rounded"></div>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className={`h-0.5 ${
            isComplete
              ? "bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600"
              : "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default SimpleComponent;

import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

/**
 * SimpleComponent - A card component that displays structured data
 *
 * Props:
 *   - id: Unique identifier for the component
 *   - data: {
 *       title: string,
 *       description: string,
 *       value: number,
 *       timestamp: string (ISO format)
 *     }
 */
const SimpleComponent = ({ id, data, isStreaming = false }) => {
  const { title, description, value, timestamp } = data;

  // Format timestamp for display
  const formatTimestamp = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return isoString;
    }
  };

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
            <h3 className={`text-base font-bold text-gray-900 leading-tight ${isStreaming && !title ? 'animate-pulse bg-gray-200 rounded h-5 w-32' : ''}`}>
              {title || (isStreaming ? '' : 'Loading...')}
            </h3>
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md">
              <TrendingUp className={`w-4 h-4 text-white ${isStreaming ? 'animate-pulse' : ''}`} />
            </div>
          </div>

          {/* Description */}
          <p className={`text-gray-600 text-xs mb-3 leading-relaxed ${isStreaming && !description ? 'animate-pulse bg-gray-200 rounded h-4 w-full' : ''}`}>
            {description || (isStreaming ? '' : 'Loading...')}
          </p>

          {/* Value display */}
          <div className="mb-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md border border-indigo-100">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${isStreaming && value === undefined ? 'animate-pulse' : ''}`}>
                {value !== undefined ? value : (isStreaming ? '...' : '0')}
              </span>
              <span className="text-xs text-gray-500 font-medium">units</span>
            </div>
          </div>

          {/* Timestamp footer */}
          <div className={`flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-gray-200 ${isStreaming && !timestamp ? 'animate-pulse' : ''}`}>
            <Calendar className="w-3 h-3" />
            <span>{timestamp ? formatTimestamp(timestamp) : (isStreaming ? 'Loading...' : '')}</span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-0.5 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600"></div>
      </div>
    </div>
  );
};

export default SimpleComponent;

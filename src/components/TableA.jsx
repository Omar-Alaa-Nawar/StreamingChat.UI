import React from "react";
import PropTypes from "prop-types";

/**
 * Helper function to determine container CSS classes based on table state
 */
const getContainerClasses = (isEmpty, hasData, isComplete) => {
  return [
    "border rounded-2xl p-4 transition-all duration-300",
    isEmpty && "border-gray-300 bg-gray-50",
    hasData && !isComplete && "border-indigo-400 bg-white",
    isComplete &&
      "border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-100 shadow-md",
  ]
    .filter(Boolean)
    .join(" ");
};

/**
 * Helper function to determine header CSS classes based on table state
 */
const getHeaderClasses = (isEmpty, hasData, isComplete) => {
  return [
    "text-left text-sm font-semibold py-2 px-3 border-b-2",
    isEmpty && "text-gray-400 border-gray-300",
    hasData && !isComplete && "text-indigo-700 border-indigo-300",
    isComplete && "text-indigo-800 border-indigo-400",
  ]
    .filter(Boolean)
    .join(" ");
};

/**
 * Helper function to determine icon CSS classes based on table state
 */
const getIconContainerClasses = (isEmpty, hasData, isComplete) => {
  return [
    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
    isEmpty && "bg-gray-200",
    hasData && !isComplete && "bg-indigo-100",
    isComplete && "bg-gradient-to-br from-indigo-400 to-blue-500",
  ]
    .filter(Boolean)
    .join(" ");
};

/**
 * Helper function to determine icon SVG CSS classes based on table state
 */
const getIconClasses = (isEmpty, hasData, isComplete) => {
  return [
    "w-5 h-5 transition-colors duration-300",
    isEmpty && "text-gray-400",
    hasData && !isComplete && "text-indigo-600",
    isComplete && "text-white",
  ]
    .filter(Boolean)
    .join(" ");
};

/**
 * Helper function to determine title CSS classes based on table state
 */
const getTitleClasses = (isEmpty, hasData) => {
  return [
    "text-sm font-semibold transition-colors duration-300",
    isEmpty && "text-gray-500",
    hasData && "text-indigo-700",
  ]
    .filter(Boolean)
    .join(" ");
};

/**
 * Component to render a single table cell with skeleton fallback
 */
const TableCell = ({ cell, rowKey, col, colIndex }) => {
  const hasValue = cell !== undefined && cell !== null;

  return (
    <td
      key={`${rowKey}-cell-${col}-${colIndex}`}
      className="py-3 px-3 text-sm text-gray-800"
    >
      {hasValue ? (
        <span className="animate-fade-in">{cell}</span>
      ) : (
        <div className="skeleton h-4 w-20 rounded"></div>
      )}
    </td>
  );
};

TableCell.propTypes = {
  cell: PropTypes.any,
  rowKey: PropTypes.string.isRequired,
  col: PropTypes.string.isRequired,
  colIndex: PropTypes.number.isRequired,
};

/**
 * TableA Component - Progressive Table Renderer
 *
 * Supports three rendering states:
 * 1. Empty: No rows → Display skeleton placeholder rows
 * 2. Partial: Some rows loaded → Mix of real data and skeleton placeholders
 * 3. Complete: All rows filled → Gradient border and polished styling
 *
 * Progressive Behavior:
 * - Backend streams rows incrementally via ID-based merging
 * - Each new row replaces a skeleton placeholder
 * - Smooth transitions between states
 *
 * @param {Object} props - Component props
 * @param {Object} props.data - Table data
 * @param {string[]} props.data.columns - Column headers
 * @param {Array[]} props.data.rows - Array of row arrays
 * @param {number} props.completeThreshold - Minimum number of rows to consider the table complete (default: 3)
 */
export default function TableA({ data = {}, completeThreshold = 3 }) {
  const { columns = [], rows = [] } = data;

  // Debug logging
  console.log("[TableA] Rendering with data:", {
    columns,
    rowCount: rows.length,
    rows: rows,
  });

  // State detection
  const isEmpty = rows.length === 0;
  const hasColumns = columns.length > 0;
  const hasData = rows.length > 0;
  const isComplete = hasData && rows.length >= completeThreshold;

  // Determine CSS classes based on state
  const containerClasses = getContainerClasses(isEmpty, hasData, isComplete);
  const headerClasses = getHeaderClasses(isEmpty, hasData, isComplete);

  // Render skeleton rows when empty
  const renderSkeletonRows = () => {
    if (!hasColumns) return null;

    return Array.from({ length: 3 }).map((_, rowIndex) => {
      const rowKey = `skeleton-row-${rowIndex}-${Date.now()}`;
      return (
        <tr key={rowKey} className="border-b border-gray-200 last:border-0">
          {columns.map((col, colIndex) => (
            <td key={`${rowKey}-cell-${col}-${colIndex}`} className="py-3 px-3">
              <div className="skeleton h-4 w-24 rounded"></div>
            </td>
          ))}
        </tr>
      );
    });
  };

  // Render actual data rows
  const renderDataRows = () => {
    return rows.map((row, rowIndex) => {
      // Create a stable key based on row content
      const rowKey = `row-${JSON.stringify(row)}-${rowIndex}`;

      return (
        <tr
          key={rowKey}
          className="border-b border-gray-200 last:border-0 hover:bg-indigo-50 transition-colors duration-150"
        >
          {columns.map((col, colIndex) => (
            <TableCell
              key={`${rowKey}-cell-${col}-${colIndex}`}
              cell={row[colIndex]}
              rowKey={rowKey}
              col={col}
              colIndex={colIndex}
            />
          ))}
        </tr>
      );
    });
  };

  return (
    <div className={containerClasses}>
      {/* Header section with icon and title */}
      <div className="flex items-center gap-2 mb-3">
        <div className={getIconContainerClasses(isEmpty, hasData, isComplete)}>
          <svg
            className={getIconClasses(isEmpty, hasData, isComplete)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className={getTitleClasses(isEmpty, hasData)}>
          {isEmpty ? "Loading table..." : "Data Table"}
        </h3>
      </div>

      {/* Table content */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {hasColumns && (
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={`header-${col}`} className={headerClasses}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>{isEmpty ? renderSkeletonRows() : renderDataRows()}</tbody>
        </table>
      </div>

      {/* Footer with row count (only when data exists) */}
      {hasData && (
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
          <span>
            {rows.length} {rows.length === 1 ? "row" : "rows"}
          </span>
          {isComplete && (
            <span className="text-indigo-600 font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Complete
            </span>
          )}
        </div>
      )}
    </div>
  );
}

TableA.propTypes = {
  data: PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.array),
  }),
  completeThreshold: PropTypes.number,
};

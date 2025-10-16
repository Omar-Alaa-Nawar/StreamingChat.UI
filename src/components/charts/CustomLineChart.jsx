import React from "react";
import { useTheme } from "../../context/ThemeContext";

const CustomLineChart = ({
  labels,
  data,
  title,
  color = "#6366f1",
  theme: themeProp, // Keep prop for backwards compatibility
}) => {
  // Use theme from context, fallback to prop for backwards compatibility
  const { theme } = useTheme();
  const activeTheme = themeProp || theme;
  const isDark = activeTheme === "dark";

  // Check data after hooks are called
  if (!data || data.length === 0) return null;
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  const width = 100;
  const height = 100;
  const padding = 5;

  // Theme-aware colors
  const textColor = isDark ? "text-gray-300" : "text-gray-700";
  const labelColor = isDark ? "text-gray-400" : "text-gray-600";
  const axisColor = isDark ? "text-gray-500" : "text-gray-500";
  const gridColor = isDark ? "#475569" : "#e5e7eb"; // slate-600 : gray-200
  const tooltipBg = isDark ? "bg-gray-700" : "bg-gray-800";

  // Calculate SVG path points
  const points = data.map((value, index) => {
    const x = padding + ((width - 2 * padding) * index) / (data.length - 1);
    const y =
      height - padding - ((value - minValue) / range) * (height - 2 * padding);
    return { x, y, value, label: labels[index] || `Point ${index + 1}` };
  });

  // Create path string
  const pathString = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  // Create area fill path
  const areaPath = `${pathString} L ${width - padding} ${
    height - padding
  } L ${padding} ${height - padding} Z`;

  return (
    <div className="w-full relative pt-2 pb-8">
      {/* Chart Title */}
      {title && (
        <div className={`text-sm font-medium ${textColor} mb-3 text-center`}>
          {title}
        </div>
      )}

      {/* Main Chart Area with Y-axis */}
      <div className="flex gap-2">
        {/* Y-Axis Labels */}
        <div
          className={`flex flex-col justify-between text-xs ${axisColor} w-12 shrink-0`}
          style={{ height: "180px" }}
        >
          {[
            maxValue,
            maxValue * 0.75,
            maxValue * 0.5,
            maxValue * 0.25,
            minValue,
          ].map((val, i) => (
            <div key={i} className="text-right leading-none">
              {Math.round(val).toLocaleString()}
            </div>
          ))}
        </div>

        {/* SVG Chart Container */}
        <div className="flex-1 relative" style={{ height: "180px" }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid Lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke={gridColor}
                strokeWidth="0.5"
              />
            ))}

            {/* Area Fill with Gradient */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d={areaPath}
              fill="url(#areaGradient)"
              className="transition-all duration-700"
            />

            {/* Line Path */}
            <path
              d={pathString}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-700"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))",
              }}
            />

            {/* Data Points */}
            {points.map((point, index) => (
              <g key={index}>
                {/* Point Circle */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="1.5"
                  fill="white"
                  stroke={color}
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />

                {/* Hover Effect */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={color}
                  opacity="0"
                  className="transition-opacity duration-200"
                />
              </g>
            ))}
          </svg>

          {/* HTML Tooltips overlaid on SVG */}
          {points.map((point, index) => (
            <div
              key={`tooltip-${index}`}
              className="absolute group cursor-pointer"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: "translate(-50%, -50%)",
                width: "24px",
                height: "24px",
                zIndex: 10,
              }}
            >
              {/* Invisible hover target */}
              <div className="w-full h-full"></div>

              {/* Tooltip */}
              <div
                className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 ${tooltipBg} text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20`}
              >
                {point.label}: {point.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X-Axis Labels - positioned to match data points */}
      <div className="relative ml-12 mt-2" style={{ height: "20px" }}>
        {points.map((point, index) => (
          <div
            key={index}
            className={`absolute text-xs ${labelColor} font-medium transform -translate-x-1/2`}
            style={{
              left: `${point.x}%`,
            }}
          >
            {point.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomLineChart;

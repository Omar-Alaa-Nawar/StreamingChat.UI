import React from "react";

const CustomLineChart = ({ labels, data, title, color = "#6366f1" }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  const width = 100;
  const height = 100;
  const padding = 5;

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
        <div className="text-sm font-medium text-gray-700 mb-3 text-center">
          {title}
        </div>
      )}

      {/* Main Chart Area with Y-axis */}
      <div className="flex gap-2">
        {/* Y-Axis Labels */}
        <div
          className="flex flex-col justify-between text-xs text-gray-500 w-12 shrink-0"
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
                stroke="#e5e7eb"
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
              <g key={index} className="group cursor-pointer">
                {/* Point Circle */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="1.5"
                  fill="white"
                  stroke={color}
                  strokeWidth="1.5"
                  className="transition-all duration-200 group-hover:r-2"
                />

                {/* Hover Effect */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={color}
                  opacity="0"
                  className="group-hover:opacity-20 transition-opacity duration-200"
                />

                {/* Tooltip on hover */}
                <title>{`${
                  point.label
                }: ${point.value.toLocaleString()}`}</title>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* X-Axis Labels - positioned to match data points */}
      <div className="relative ml-12 mt-2" style={{ height: "20px" }}>
        {points.map((point, index) => (
          <div
            key={index}
            className="absolute text-xs text-gray-600 font-medium transform -translate-x-1/2"
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

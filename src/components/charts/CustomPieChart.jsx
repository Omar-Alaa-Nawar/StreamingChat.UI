import React from "react";

const CustomPieChart = ({ labels, data, title, colors }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, val) => sum + val, 0);
  const centerX = 50;
  const centerY = 50;
  const radius = 35;
  const innerRadius = 20; // Donut style

  // Default colors if not provided
  const defaultColors = [
    "#6366f1", // indigo
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#f59e0b", // amber
    "#10b981", // green
    "#3b82f6", // blue
    "#ef4444", // red
  ];
  const chartColors = colors || defaultColors;

  // Calculate segments
  let currentAngle = -90; // Start from top
  const segments = data.map((value, index) => {
    const percentage = (value / total) * 100;
    const angle = (value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    currentAngle = endAngle;

    // Calculate arc path
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ");

    return {
      pathData,
      color: chartColors[index % chartColors.length],
      value,
      percentage,
      label: labels[index] || `Segment ${index + 1}`,
      midAngle: startAngle + angle / 2,
    };
  });

  return (
    <div className="w-full h-64 relative flex items-center justify-center">
      {/* Chart Title */}
      {title && (
        <div className="absolute top-0 left-0 right-0 text-xs font-medium text-gray-600 text-center">
          {title}
        </div>
      )}

      <div className="flex items-center gap-8 w-full justify-center">
        {/* Pie Chart SVG */}
        <div className="relative" style={{ width: "200px", height: "200px" }}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform -rotate-0 transition-transform duration-500"
          >
            {/* Segments */}
            {segments.map((segment, index) => (
              <g key={index} className="group cursor-pointer">
                <path
                  d={segment.pathData}
                  fill={segment.color}
                  className="transition-all duration-300 group-hover:opacity-80"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                  }}
                />
                {/* Hover effect - slightly enlarge */}
                <path
                  d={segment.pathData}
                  fill="white"
                  opacity="0"
                  className="group-hover:opacity-20 transition-opacity duration-200"
                />
              </g>
            ))}

            {/* Center Circle (donut hole) with gradient */}
            <defs>
              <radialGradient id="centerGradient">
                <stop offset="0%" stopColor="#f9fafb" />
                <stop offset="100%" stopColor="#ffffff" />
              </radialGradient>
            </defs>
            <circle
              cx={centerX}
              cy={centerY}
              r={innerRadius}
              fill="url(#centerGradient)"
              style={{
                filter: "drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))",
              }}
            />

            {/* Total in center */}
            <text
              x={centerX}
              y={centerY - 2}
              textAnchor="middle"
              className="text-[8px] font-bold fill-gray-800"
            >
              {total.toLocaleString()}
            </text>
            <text
              x={centerX}
              y={centerY + 6}
              textAnchor="middle"
              className="text-[4px] fill-gray-500"
            >
              Total
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="flex items-center gap-2 group cursor-pointer"
            >
              {/* Color indicator */}
              <div
                className="w-3 h-3 rounded-sm transition-transform duration-200 group-hover:scale-110"
                style={{
                  backgroundColor: segment.color,
                  boxShadow: `0 2px 4px ${segment.color}40`,
                }}
              ></div>

              {/* Label and value */}
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-700">
                  {segment.label}
                </span>
                <span className="text-xs text-gray-500">
                  {segment.value.toLocaleString()} (
                  {segment.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomPieChart;

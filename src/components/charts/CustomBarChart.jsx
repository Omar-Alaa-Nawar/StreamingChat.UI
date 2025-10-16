import React from "react";

const CustomBarChart = ({
  labels,
  data,
  title,
  color = "#6366f1",
  theme = "light",
}) => {
  if (!data || data.length === 0) return null;

  const isDark = theme === "dark";
  const maxValue = Math.max(...data);
  const chartHeight = 180; // Reduced to fit within container

  // Theme-aware colors
  const textColor = isDark ? "text-gray-300" : "text-gray-700";
  const labelColor = isDark ? "text-gray-400" : "text-gray-600";
  const axisColor = isDark ? "text-gray-500" : "text-gray-500";
  const gridColor = isDark ? "border-gray-700" : "border-gray-200";
  const tooltipBg = isDark ? "bg-gray-700" : "bg-gray-800";

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
          style={{ height: `${chartHeight}px` }}
        >
          {[maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, 0].map(
            (val, i) => (
              <div key={i} className="text-right leading-none">
                {Math.round(val).toLocaleString()}
              </div>
            )
          )}
        </div>

        {/* Chart Container */}
        <div
          className="relative flex items-end justify-around gap-2 flex-1 px-2"
          style={{ height: `${chartHeight}px` }}
        >
          {/* Y-Axis Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`border-b ${gridColor}`}></div>
            ))}
          </div>

          {/* Bars */}
          {data.map((value, index) => {
            const heightPixels =
              maxValue > 0 ? (value / maxValue) * (chartHeight - 10) : 4;
            const label = labels[index] || `Item ${index + 1}`;

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center justify-end relative group z-10"
                style={{ maxWidth: "100px", minWidth: "40px" }}
              >
                {/* Value Label (on hover) */}
                <div
                  className={`absolute -top-6 ${tooltipBg} text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none`}
                >
                  {value.toLocaleString()}
                </div>

                {/* Bar */}
                <div
                  className="w-full rounded-t-lg transition-all duration-700 ease-out relative overflow-hidden mb-1"
                  style={{
                    height: `${heightPixels}px`,
                    background: `linear-gradient(to top, ${color}, ${color}dd)`,
                    boxShadow: `0 -2px 8px ${
                      isDark
                        ? "rgba(129, 140, 248, 0.3)"
                        : "rgba(99, 102, 241, 0.3)"
                    }`,
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
                </div>

                {/* X-Axis Label */}
                <div
                  className={`text-xs ${labelColor} font-medium truncate w-full text-center mt-1`}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomBarChart;

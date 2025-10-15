import React, { useMemo } from "react";
import CustomBarChart from "./charts/CustomBarChart";
import CustomLineChart from "./charts/CustomLineChart";
import CustomPieChart from "./charts/CustomPieChart";

const ChartComponent = ({ data }) => {
  // Handle both backend format (chart_type, x_axis, series) and frontend format (chartType, labels, datasets)
  const chartType = data.chartType || data.chart_type || "bar";
  const title = data.title || "Chart";

  // Memoize labels to prevent unnecessary re-renders
  const labels = useMemo(() => {
    return data.labels || data.x_axis || [];
  }, [data.labels, data.x_axis]);

  // Memoize datasets conversion to prevent unnecessary re-renders
  const datasets = useMemo(() => {
    if (data.datasets) {
      return data.datasets;
    }
    if (data.series && data.series.length > 0) {
      return data.series.map((s) => ({
        label: s.label || "Data",
        data: s.values || [],
        backgroundColor: s.backgroundColor || "#6366f1",
        borderColor: s.borderColor || "#4f46e5",
      }));
    }
    return [];
  }, [data.datasets, data.series]);

  // Memoize dataPoints to prevent unnecessary re-renders
  const dataPoints = useMemo(() => {
    return datasets[0]?.data || [];
  }, [datasets]);

  // State detection
  const isEmpty = dataPoints.length === 0;
  const hasData = dataPoints.length > 0;
  const expectedDataPoints = labels.length;
  const isComplete = hasData && dataPoints.length >= expectedDataPoints;
  const isPartial = hasData && !isComplete;

  // Debug logging
  console.log("ChartComponent render:", {
    rawData: data,
    chartType,
    title,
    labels,
    datasets,
    dataPoints,
    isEmpty,
    isPartial,
    isComplete,
  });

  // Render skeleton for empty state
  const renderSkeleton = () => (
    <div className="h-64 flex items-end justify-around bg-gray-50 rounded-xl p-8 gap-4">
      <div className="skeleton h-32 w-12 rounded"></div>
      <div className="skeleton h-40 w-12 rounded"></div>
      <div className="skeleton h-48 w-12 rounded"></div>
      <div className="skeleton h-36 w-12 rounded"></div>
    </div>
  );

  // Render chart based on type
  const renderChart = () => {
    if (isEmpty) return renderSkeleton();

    const chartColor =
      datasets[0]?.backgroundColor || datasets[0]?.borderColor || "#6366f1";
    const chartLabel = datasets[0]?.label || title;

    switch (chartType) {
      case "bar":
        return (
          <CustomBarChart
            labels={labels}
            data={dataPoints}
            title={chartLabel}
            color={chartColor}
          />
        );
      case "line":
        return (
          <CustomLineChart
            labels={labels}
            data={dataPoints}
            title={chartLabel}
            color={chartColor}
          />
        );
      case "pie":
        return (
          <CustomPieChart
            labels={labels}
            data={dataPoints}
            title={chartLabel}
            colors={datasets[0]?.backgroundColor}
          />
        );
      default:
        return (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-sm">
              Unsupported chart type: {chartType}
            </p>
          </div>
        );
    }
  };

  // Container styling based on state
  const containerClasses = [
    "border rounded-2xl p-4 transition-all duration-300",
    isEmpty && "border-gray-300 bg-gray-50",
    isPartial && "border-indigo-400 bg-white",
    isComplete &&
      "border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-100 shadow-md",
  ]
    .filter(Boolean)
    .join(" ");

  const iconClasses = [
    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
    isEmpty && "bg-gray-200 text-gray-400",
    isPartial && "bg-indigo-100 text-indigo-600",
    isComplete && "bg-gradient-to-br from-indigo-400 to-blue-500 text-white",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={iconClasses}>
          {/* Chart icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800">
            {isEmpty ? "Loading chart..." : title || "Chart"}
          </h3>
        </div>
        {isComplete && (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            ✓ Complete
          </span>
        )}
      </div>

      {/* Chart Area */}
      <div className="bg-white rounded-xl p-4 min-h-[16rem]">
        {renderChart()}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          {isEmpty && "Waiting for data..."}
          {isPartial &&
            `Loading... ${dataPoints.length} of ${expectedDataPoints} points`}
          {isComplete && `${dataPoints.length} data points`}
        </span>
        {isComplete && (
          <span className="text-indigo-600 font-medium">
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart
          </span>
        )}
      </div>
    </div>
  );
};

export default ChartComponent;

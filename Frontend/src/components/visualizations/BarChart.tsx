import React from 'react';

interface BarChartProps {
  data: {
    categories: string[];
    values: number[];
    labels: string[];
  };
  title: string;
  ui_config: {
    x_label: string;
    y_label: string;
    colors: string[];
    show_values: boolean;
  };
}

const BarChart: React.FC<BarChartProps> = ({ data, title, ui_config }) => {
  const { categories, values, labels } = data;
  const { x_label, y_label, colors, show_values } = ui_config;
  
  const maxValue = Math.max(...values);
  const chartHeight = 300;
  const chartWidth = 400;
  const barWidth = Math.min(chartWidth / categories.length * 0.7, 60);
  const spacing = chartWidth / categories.length;
  
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>
      
      <div className="flex justify-center">
        <div className="relative">
          <svg width={chartWidth + 80} height={chartHeight + 80}>
            {/* Y-axis */}
            <line 
              x1="50" 
              y1="20" 
              x2="50" 
              y2={chartHeight + 20} 
              stroke="#374151" 
              strokeWidth="2"
            />
            
            {/* X-axis */}
            <line 
              x1="50" 
              y1={chartHeight + 20} 
              x2={chartWidth + 50} 
              y2={chartHeight + 20} 
              stroke="#374151" 
              strokeWidth="2"
            />
            
            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = chartHeight + 20 - (ratio * chartHeight);
              const value = (ratio * maxValue).toFixed(1);
              return (
                <g key={index}>
                  <line x1="45" y1={y} x2="50" y2={y} stroke="#374151" strokeWidth="1" />
                  <text x="40" y={y + 4} textAnchor="end" className="text-xs fill-gray-600">
                    {value}
                  </text>
                </g>
              );
            })}
            
            {/* Bars */}
            {values.map((value, index) => {
              const x = 50 + index * spacing + (spacing - barWidth) / 2;
              const barHeight = (value / maxValue) * chartHeight;
              const y = chartHeight + 20 - barHeight;
              const color = colors[index % colors.length];
              
              return (
                <g key={index}>
                  {/* Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={color}
                    className="hover:opacity-80 transition-opacity"
                  />
                  
                  {/* Value label on top of bar */}
                  {show_values && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 5}
                      textAnchor="middle"
                      className="text-xs fill-gray-800 font-semibold"
                    >
                      {value}
                    </text>
                  )}
                  
                  {/* Category label */}
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 35}
                    textAnchor="middle"
                    className="text-xs fill-gray-700"
                  >
                    {categories[index]}
                  </text>
                </g>
              );
            })}
            
            {/* Axis labels */}
            <text
              x={chartWidth / 2 + 50}
              y={chartHeight + 65}
              textAnchor="middle"
              className="text-sm fill-gray-700 font-medium"
            >
              {x_label}
            </text>
            
            <text
              x="15"
              y={chartHeight / 2 + 20}
              textAnchor="middle"
              transform={`rotate(-90, 15, ${chartHeight / 2 + 20})`}
              className="text-sm fill-gray-700 font-medium"
            >
              {y_label}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BarChart;

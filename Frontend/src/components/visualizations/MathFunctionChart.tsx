import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MathFunctionChartProps {
  data: {
    x: number[];
    y: number[];
    label: string;
  };
  title: string;
  formula: string;
  ui_config: {
    grid?: boolean;
    axes_labels: { x: string; y: string };
    color: string;
    stroke_width: number;
  };
}

const MathFunctionChart: React.FC<MathFunctionChartProps> = ({ 
  data, 
  title, 
  formula, 
  ui_config 
}) => {
  // Convert x,y arrays to chart data format
  const chartData = data.x.map((x, index) => ({
    x: parseFloat(x.toFixed(2)),
    y: data.y[index] ? parseFloat(data.y[index].toFixed(2)) : null
  })).filter(point => point.y !== null && !isNaN(point.y) && isFinite(point.y));

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
          {formula}
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          {ui_config.grid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis 
            dataKey="x" 
            type="number"
            scale="linear"
            domain={['dataMin', 'dataMax']}
            label={{ value: ui_config.axes_labels.x, position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            type="number"
            domain={['dataMin', 'dataMax']}
            label={{ value: ui_config.axes_labels.y, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            labelFormatter={(value) => `${ui_config.axes_labels.x}: ${value}`}
            formatter={(value) => [value, ui_config.axes_labels.y]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="y" 
            stroke={ui_config.color} 
            strokeWidth={ui_config.stroke_width}
            name={data.label}
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MathFunctionChart;

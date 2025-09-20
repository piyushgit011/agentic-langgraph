import React from 'react';

interface RadarChartProps {
  data: {
    subjects: string[];
    scores: number[];
    max_score: number;
  };
  title: string;
  ui_config: {
    fill_color: string;
    stroke_color: string;
    point_color: string;
    grid_levels: number;
  };
}

const RadarChart: React.FC<RadarChartProps> = ({ data, title, ui_config }) => {
  const { subjects, scores, max_score } = data;
  const { fill_color, stroke_color, point_color, grid_levels } = ui_config;
  
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  const size = 300;
  
  // Calculate angles for each subject
  const angles = subjects.map((_, index) => (index * 2 * Math.PI) / subjects.length);
  
  // Calculate points for the data polygon
  const dataPoints = scores.map((score, index) => {
    const radius = (score / max_score) * maxRadius;
    const angle = angles[index] - Math.PI / 2; // Start from top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });
  
  // Generate grid levels
  const gridLevels = Array.from({ length: grid_levels }, (_, i) => {
    const radius = ((i + 1) / grid_levels) * maxRadius;
    const points = angles.map(angle => {
      const adjustedAngle = angle - Math.PI / 2;
      return `${centerX + radius * Math.cos(adjustedAngle)},${centerY + radius * Math.sin(adjustedAngle)}`;
    }).join(' ');
    return { radius, points };
  });
  
  // Generate axis lines
  const axisLines = angles.map(angle => {
    const adjustedAngle = angle - Math.PI / 2;
    return {
      x1: centerX,
      y1: centerY,
      x2: centerX + maxRadius * Math.cos(adjustedAngle),
      y2: centerY + maxRadius * Math.sin(adjustedAngle)
    };
  });
  
  // Generate labels
  const labels = subjects.map((subject, index) => {
    const angle = angles[index] - Math.PI / 2;
    const labelRadius = maxRadius + 20;
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle),
      text: subject
    };
  });

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>
      
      <div className="flex justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Grid levels */}
          {gridLevels.map((level, index) => (
            <polygon
              key={index}
              points={level.points}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Axis lines */}
          {axisLines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Data polygon */}
          <polygon
            points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
            fill={fill_color}
            stroke={stroke_color}
            strokeWidth="2"
          />
          
          {/* Data points */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={point_color}
            />
          ))}
          
          {/* Labels */}
          {labels.map((label, index) => (
            <text
              key={index}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-gray-700 font-medium"
            >
              {label.text}
            </text>
          ))}
          
          {/* Score labels on points */}
          {dataPoints.map((point, index) => (
            <text
              key={`score-${index}`}
              x={point.x}
              y={point.y - 8}
              textAnchor="middle"
              className="text-xs fill-gray-800 font-semibold"
            >
              {scores[index]}
            </text>
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          Scale: 0 - {max_score}
        </div>
      </div>
    </div>
  );
};

export default RadarChart;

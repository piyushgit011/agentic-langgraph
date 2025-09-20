import React from 'react';

interface GeometryVisualizationProps {
  shape_type: string;
  data: any;
  title: string;
  ui_config: {
    fill_color: string;
    stroke_color: string;
    stroke_width: number;
    show_measurements: boolean;
  };
}

const GeometryVisualization: React.FC<GeometryVisualizationProps> = ({ 
  shape_type, 
  data, 
  title, 
  ui_config 
}) => {
  const svgSize = 300;
  const centerX = svgSize / 2;
  const centerY = svgSize / 2;
  
  const renderShape = () => {
    switch (shape_type) {
      case 'circle':
        const { radius, center } = data;
        const scaledRadius = Math.min(radius * 20, 100); // Scale for display
        
        return (
          <g>
            <circle
              cx={centerX + (center[0] * 10)}
              cy={centerY + (center[1] * 10)}
              r={scaledRadius}
              fill={ui_config.fill_color}
              stroke={ui_config.stroke_color}
              strokeWidth={ui_config.stroke_width}
            />
            {ui_config.show_measurements && (
              <>
                {/* Radius line */}
                <line
                  x1={centerX + (center[0] * 10)}
                  y1={centerY + (center[1] * 10)}
                  x2={centerX + (center[0] * 10) + scaledRadius}
                  y2={centerY + (center[1] * 10)}
                  stroke="#374151"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                {/* Radius label */}
                <text
                  x={centerX + (center[0] * 10) + scaledRadius / 2}
                  y={centerY + (center[1] * 10) - 5}
                  textAnchor="middle"
                  className="text-sm fill-gray-800 font-semibold"
                >
                  r = {radius}
                </text>
              </>
            )}
          </g>
        );
        
      case 'rectangle':
        const { width, height, position } = data;
        const scaledWidth = width * 20;
        const scaledHeight = height * 20;
        const rectX = centerX + (position[0] * 10) - scaledWidth / 2;
        const rectY = centerY + (position[1] * 10) - scaledHeight / 2;
        
        return (
          <g>
            <rect
              x={rectX}
              y={rectY}
              width={scaledWidth}
              height={scaledHeight}
              fill={ui_config.fill_color}
              stroke={ui_config.stroke_color}
              strokeWidth={ui_config.stroke_width}
            />
            {ui_config.show_measurements && (
              <>
                {/* Width dimension */}
                <line
                  x1={rectX}
                  y1={rectY + scaledHeight + 10}
                  x2={rectX + scaledWidth}
                  y2={rectY + scaledHeight + 10}
                  stroke="#374151"
                  strokeWidth="1"
                />
                <text
                  x={rectX + scaledWidth / 2}
                  y={rectY + scaledHeight + 25}
                  textAnchor="middle"
                  className="text-sm fill-gray-800 font-semibold"
                >
                  {width}
                </text>
                
                {/* Height dimension */}
                <line
                  x1={rectX + scaledWidth + 10}
                  y1={rectY}
                  x2={rectX + scaledWidth + 10}
                  y2={rectY + scaledHeight}
                  stroke="#374151"
                  strokeWidth="1"
                />
                <text
                  x={rectX + scaledWidth + 25}
                  y={rectY + scaledHeight / 2}
                  textAnchor="middle"
                  transform={`rotate(90, ${rectX + scaledWidth + 25}, ${rectY + scaledHeight / 2})`}
                  className="text-sm fill-gray-800 font-semibold"
                >
                  {height}
                </text>
              </>
            )}
          </g>
        );
        
      case 'triangle':
        const { points } = data;
        const scaledPoints = points.map((point: number[]) => [
          centerX + point[0] * 20,
          centerY + point[1] * 20
        ]);
        
        const pathData = `M ${scaledPoints[0][0]},${scaledPoints[0][1]} ` +
                        `L ${scaledPoints[1][0]},${scaledPoints[1][1]} ` +
                        `L ${scaledPoints[2][0]},${scaledPoints[2][1]} Z`;
        
        return (
          <g>
            <path
              d={pathData}
              fill={ui_config.fill_color}
              stroke={ui_config.stroke_color}
              strokeWidth={ui_config.stroke_width}
            />
            {ui_config.show_measurements && (
              <>
                {scaledPoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={point[0]}
                    cy={point[1]}
                    r="3"
                    fill="#374151"
                  />
                ))}
              </>
            )}
          </g>
        );
        
      default:
        return <text x={centerX} y={centerY} textAnchor="middle" className="fill-gray-500">Unknown shape</text>;
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>
      
      <div className="flex justify-center">
        <svg width={svgSize + 60} height={svgSize + 60} className="border border-gray-200 rounded">
          {/* Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Axes */}
          <line x1="30" y1={centerY + 30} x2={svgSize + 30} y2={centerY + 30} stroke="#d1d5db" strokeWidth="2" />
          <line x1={centerX + 30} y1="30" x2={centerX + 30} y2={svgSize + 30} stroke="#d1d5db" strokeWidth="2" />
          
          {/* Shape */}
          <g transform="translate(30, 30)">
            {renderShape()}
          </g>
        </svg>
      </div>
      
      {/* Measurements */}
      {ui_config.show_measurements && (
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-600 space-y-1">
            {shape_type === 'circle' && (
              <>
                <div>Area: {data.area?.toFixed(2)} square units</div>
                <div>Circumference: {data.circumference?.toFixed(2)} units</div>
              </>
            )}
            {shape_type === 'rectangle' && (
              <>
                <div>Area: {data.area} square units</div>
                <div>Perimeter: {data.perimeter} units</div>
              </>
            )}
            {shape_type === 'triangle' && (
              <div>Area: {data.area?.toFixed(2)} square units</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeometryVisualization;

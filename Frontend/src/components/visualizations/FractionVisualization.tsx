'use client';

import React, { useState } from 'react';

interface FractionVisualizationProps {
  data: {
    numerator: number;
    denominator: number;
    decimal_value: number;
    percentage: number;
    is_proper: boolean;
    is_improper: boolean;
    is_whole: boolean;
  };
  ui_config?: {
    visualization_type?: 'pie_chart' | 'bar_model' | 'fraction_number_line';
    interactive?: boolean;
    show_labels?: boolean;
    animate?: boolean;
    colors?: {
      filled: string;
      empty: string;
      outline: string;
    };
  };
}

const FractionVisualization: React.FC<FractionVisualizationProps> = ({ 
  data, 
  ui_config = {} 
}) => {
  const [selectedView, setSelectedView] = useState(ui_config.visualization_type || 'pie_chart');
  const [showEquivalents, setShowEquivalents] = useState(false);
  
  const {
    interactive = true,
    show_labels = true,
    animate = true,
    colors = {
      filled: '#3b82f6',
      empty: '#e5e7eb',
      outline: '#1f2937'
    }
  } = ui_config;

  const formatDecimal = (value: number) => {
    return value.toFixed(3);
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(1) + '%';
  };

  const renderPieChart = () => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    const filledAngle = (data.numerator / data.denominator) * 360;
    
    // Calculate path for filled portion
    const startAngle = -90; // Start from top
    const endAngle = startAngle + filledAngle;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const largeArcFlag = filledAngle > 180 ? 1 : 0;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const pathData = filledAngle === 360 
      ? `M ${centerX} ${centerY} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`
      : `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    return (
      <div className="text-center">
        <svg width="200" height="200" className="mx-auto">
          {/* Empty circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill={colors.empty}
            stroke={colors.outline}
            strokeWidth="2"
          />
          
          {/* Filled portion */}
          {data.numerator > 0 && (
            <path
              d={pathData}
              fill={colors.filled}
              stroke={colors.outline}
              strokeWidth="1"
              className={animate ? 'animate-pulse' : ''}
            />
          )}
          
          {/* Division lines for denominator */}
          {Array.from({ length: data.denominator }, (_, i) => {
            const angle = (360 / data.denominator) * i - 90;
            const angleRad = (angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(angleRad);
            const y = centerY + radius * Math.sin(angleRad);
            
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={colors.outline}
                strokeWidth="1"
                opacity="0.5"
              />
            );
          })}
          
          {/* Center fraction label */}
          {show_labels && (
            <text
              x={centerX}
              y={centerY + 5}
              textAnchor="middle"
              className="text-lg font-bold"
              fill={colors.outline}
            >
              {data.numerator}/{data.denominator}
            </text>
          )}
        </svg>
      </div>
    );
  };

  const renderBarModel = () => {
    const barWidth = 300;
    const barHeight = 60;
    const sectionWidth = barWidth / data.denominator;
    
    return (
      <div className="text-center">
        <svg width="350" height="120" className="mx-auto">
          {/* Bar sections */}
          {Array.from({ length: data.denominator }, (_, i) => (
            <rect
              key={i}
              x={25 + i * sectionWidth}
              y={30}
              width={sectionWidth - 2}
              height={barHeight}
              fill={i < data.numerator ? colors.filled : colors.empty}
              stroke={colors.outline}
              strokeWidth="2"
              className={animate && i < data.numerator ? 'animate-pulse' : ''}
            />
          ))}
          
          {/* Section labels */}
          {show_labels && Array.from({ length: data.denominator }, (_, i) => (
            <text
              key={i}
              x={25 + i * sectionWidth + sectionWidth / 2}
              y={110}
              textAnchor="middle"
              className="text-sm font-medium"
              fill={colors.outline}
            >
              {i + 1}
            </text>
          ))}
          
          {/* Fraction label */}
          {show_labels && (
            <text
              x={200}
              y={20}
              textAnchor="middle"
              className="text-lg font-bold"
              fill={colors.outline}
            >
              {data.numerator}/{data.denominator}
            </text>
          )}
        </svg>
      </div>
    );
  };

  const renderNumberLine = () => {
    const lineWidth = 300;
    const lineStart = 25;
    const tickHeight = 10;
    const fractionPosition = lineStart + (data.decimal_value * lineWidth);
    
    return (
      <div className="text-center">
        <svg width="350" height="100" className="mx-auto">
          {/* Number line */}
          <line
            x1={lineStart}
            y1={50}
            x2={lineStart + lineWidth}
            y2={50}
            stroke={colors.outline}
            strokeWidth="3"
          />
          
          {/* Tick marks and labels */}
          {Array.from({ length: 11 }, (_, i) => {
            const x = lineStart + (i / 10) * lineWidth;
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={50 - tickHeight}
                  x2={x}
                  y2={50 + tickHeight}
                  stroke={colors.outline}
                  strokeWidth="2"
                />
                {(i % 5 === 0) && (
                  <text
                    x={x}
                    y={75}
                    textAnchor="middle"
                    className="text-sm font-medium"
                    fill={colors.outline}
                  >
                    {i / 10}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Fraction position marker */}
          <circle
            cx={fractionPosition}
            cy={50}
            r="6"
            fill={colors.filled}
            stroke={colors.outline}
            strokeWidth="2"
            className={animate ? 'animate-bounce' : ''}
          />
          
          {/* Fraction label */}
          {show_labels && (
            <text
              x={fractionPosition}
              y={35}
              textAnchor="middle"
              className="text-sm font-bold"
              fill={colors.filled}
            >
              {data.numerator}/{data.denominator}
            </text>
          )}
        </svg>
      </div>
    );
  };

  const renderVisualization = () => {
    switch (selectedView) {
      case 'pie_chart':
        return renderPieChart();
      case 'bar_model':
        return renderBarModel();
      case 'fraction_number_line':
        return renderNumberLine();
      default:
        return renderPieChart();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Fraction Visualization: {data.numerator}/{data.denominator}
        </h3>
        <div className="text-gray-600">
          Understanding fractions through multiple visual representations
        </div>
      </div>

      {/* Visualization Type Selector */}
      {interactive && (
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'pie_chart', label: '🥧 Pie Chart' },
              { key: 'bar_model', label: '📊 Bar Model' },
              { key: 'fraction_number_line', label: '📏 Number Line' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedView(key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedView === key
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Visualization */}
      <div className="mb-6">
        {renderVisualization()}
      </div>

      {/* Fraction Information Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Basic Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-3">Fraction Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Numerator:</span>
              <span className="font-medium">{data.numerator}</span>
            </div>
            <div className="flex justify-between">
              <span>Denominator:</span>
              <span className="font-medium">{data.denominator}</span>
            </div>
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium">
                {data.is_whole ? 'Whole Number' : 
                 data.is_proper ? 'Proper Fraction' : 
                 data.is_improper ? 'Improper Fraction' : 'Fraction'}
              </span>
            </div>
          </div>
        </div>

        {/* Equivalent Forms */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-bold text-green-800 mb-3">Equivalent Forms</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Decimal:</span>
              <span className="font-medium font-mono">{formatDecimal(data.decimal_value)}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-medium">{formatPercentage(data.percentage)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ratio:</span>
              <span className="font-medium">{data.numerator}:{data.denominator}</span>
            </div>
          </div>
        </div>

        {/* Educational Notes */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-bold text-yellow-800 mb-3">Understanding</h4>
          <div className="text-sm text-yellow-700 space-y-2">
            <div>
              <strong>Numerator ({data.numerator}):</strong> Parts we have
            </div>
            <div>
              <strong>Denominator ({data.denominator}):</strong> Total parts
            </div>
            <div>
              This fraction represents <strong>{data.numerator}</strong> out of <strong>{data.denominator}</strong> equal parts.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Equivalent Forms */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-bold text-gray-800">Equivalent Representations</h4>
          <button
            onClick={() => setShowEquivalents(!showEquivalents)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showEquivalents ? 'Hide' : 'Show'} Details
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600 mb-1">Fraction</div>
            <div className="text-xl font-bold text-blue-600">{data.numerator}/{data.denominator}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600 mb-1">Decimal</div>
            <div className="text-xl font-bold text-green-600">{formatDecimal(data.decimal_value)}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600 mb-1">Percentage</div>
            <div className="text-xl font-bold text-purple-600">{formatPercentage(data.percentage)}</div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="text-sm text-gray-600 mb-1">Words</div>
            <div className="text-sm font-bold text-orange-600">
              {data.numerator === 1 ? 'One' : 
               data.numerator === 2 ? 'Two' : 
               data.numerator === 3 ? 'Three' : 
               data.numerator === 4 ? 'Four' : 
               data.numerator.toString()} out of {data.denominator}
            </div>
          </div>
        </div>

        {showEquivalents && (
          <div className="mt-4 p-3 bg-white rounded border">
            <div className="text-sm text-gray-600">
              <strong>Conversion explanation:</strong> To convert {data.numerator}/{data.denominator} to decimal, 
              divide {data.numerator} ÷ {data.denominator} = {formatDecimal(data.decimal_value)}. 
              To get percentage, multiply by 100: {formatDecimal(data.decimal_value)} × 100 = {formatPercentage(data.percentage)}.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FractionVisualization;

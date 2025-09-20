'use client';

import React, { useState, useEffect } from 'react';

interface NumberLineStep {
  step: number;
  position: number;
  description: string;
  highlight?: boolean;
  movement?: {
    from: number;
    to: number;
    direction: 'left' | 'right';
    distance: number;
  };
}

interface NumberLineOperationProps {
  data: {
    num1: number;
    num2: number;
    result: number;
    operation: string;
    operation_symbol: string;
    steps: NumberLineStep[];
    range: {
      start: number;
      end: number;
    };
  };
  ui_config?: {
    interactive?: boolean;
    animate_steps?: boolean;
    step_duration?: number;
    show_calculation?: boolean;
    color_scheme?: {
      line: string;
      numbers: string;
      position_marker: string;
      movement_path: string;
      result_highlight: string;
    };
  };
  onStepChange?: (stepIndex: number, step: NumberLineStep) => void;
}

const NumberLineOperationVisualization: React.FC<NumberLineOperationProps> = ({ 
  data, 
  ui_config = {},
  onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  
  const { 
    interactive = true, 
    animate_steps = true, 
    step_duration = 2500,
    show_calculation = true,
    color_scheme = {
      line: '#374151',
      numbers: '#1f2937',
      position_marker: '#3b82f6',
      movement_path: '#10b981',
      result_highlight: '#ef4444'
    }
  } = ui_config;

  // Auto-advance steps for demonstration
  useEffect(() => {
    if (!interactive && animate_steps && data.steps.length > 1) {
      const timer = setTimeout(() => {
        if (currentStep < data.steps.length - 1) {
          const nextStep = currentStep + 1;
          setIsAnimating(true);
          setCurrentStep(nextStep);
          setCurrentPosition(data.steps[nextStep].position);
          
          setTimeout(() => setIsAnimating(false), 800);
          
          if (onStepChange) {
            onStepChange(nextStep, data.steps[nextStep]);
          }
        }
      }, step_duration);

      return () => clearTimeout(timer);
    }
  }, [currentStep, interactive, animate_steps, step_duration, data.steps, onStepChange]);

  // Set initial position
  useEffect(() => {
    if (data.steps.length > 0) {
      setCurrentPosition(data.steps[0].position);
    }
  }, [data.steps]);

  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < data.steps.length) {
      setIsAnimating(true);
      setCurrentStep(stepIndex);
      setCurrentPosition(data.steps[stepIndex].position);
      setTimeout(() => setIsAnimating(false), 500);
      
      if (onStepChange) {
        onStepChange(stepIndex, data.steps[stepIndex]);
      }
    }
  };

  const generateNumberLinePoints = () => {
    const points = [];
    for (let i = data.range.start; i <= data.range.end; i++) {
      points.push(i);
    }
    return points;
  };

  const getPositionX = (number: number) => {
    const totalRange = data.range.end - data.range.start;
    const position = (number - data.range.start) / totalRange;
    return 80 + position * 600; // 80px offset, 600px line length
  };

  const renderMovementPath = () => {
    if (currentStep === 0 || !data.steps[currentStep].movement) return null;
    
    const movement = data.steps[currentStep].movement;
    const fromX = getPositionX(movement!.from);
    const toX = getPositionX(movement!.to);
    
    return (
      <g>
        {/* Movement arrow path */}
        <path
          d={`M ${fromX} 200 L ${toX} 200`}
          stroke={color_scheme.movement_path}
          strokeWidth="4"
          strokeDasharray="5,5"
          className={`${isAnimating ? 'animate-pulse' : ''}`}
        />
        {/* Arrow head */}
        <polygon
          points={movement!.direction === 'right' 
            ? `${toX-8},195 ${toX},200 ${toX-8},205` 
            : `${toX+8},195 ${toX},200 ${toX+8},205`}
          fill={color_scheme.movement_path}
        />
        {/* Movement label */}
        <text
          x={(fromX + toX) / 2}
          y="185"
          textAnchor="middle"
          className="text-sm font-semibold"
          fill={color_scheme.movement_path}
        >
          {movement!.direction === 'right' ? '+' : '-'}{movement!.distance}
        </text>
      </g>
    );
  };

  const currentStepData = data.steps[currentStep] || data.steps[0];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Number Line Operations
        </h3>
        {show_calculation && (
          <div className="text-xl font-mono bg-blue-50 inline-block px-4 py-2 rounded-lg border-2 border-blue-200">
            {data.num1} {data.operation_symbol} {data.num2} = {data.result}
          </div>
        )}
      </div>

      {/* Number Line SVG */}
      <div className="mb-6">
        <svg width="800" height="300" className="w-full">
          {/* Main number line */}
          <line
            x1="80"
            y1="200"
            x2="680"
            y2="200"
            stroke={color_scheme.line}
            strokeWidth="3"
          />
          
          {/* Number line points and labels */}
          {generateNumberLinePoints().map((num) => (
            <g key={num}>
              <line
                x1={getPositionX(num)}
                y1="195"
                x2={getPositionX(num)}
                y2="205"
                stroke={color_scheme.line}
                strokeWidth="2"
              />
              <text
                x={getPositionX(num)}
                y="220"
                textAnchor="middle"
                className="text-sm font-medium"
                fill={color_scheme.numbers}
              >
                {num}
              </text>
            </g>
          ))}
          
          {/* Movement path */}
          {renderMovementPath()}
          
          {/* Current position marker */}
          <circle
            cx={getPositionX(currentPosition)}
            cy="200"
            r="8"
            fill={currentStep === data.steps.length - 1 ? color_scheme.result_highlight : color_scheme.position_marker}
            className={`${isAnimating ? 'animate-bounce' : ''} transition-all duration-500`}
          />
          
          {/* Position label */}
          <text
            x={getPositionX(currentPosition)}
            y="175"
            textAnchor="middle"
            className="text-lg font-bold"
            fill={currentStep === data.steps.length - 1 ? color_scheme.result_highlight : color_scheme.position_marker}
          >
            {currentPosition}
          </text>
        </svg>
      </div>

      {/* Step description */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            Step {currentStepData.step}: {currentStepData.description}
          </div>
          {currentStepData.movement && (
            <div className="text-sm text-gray-600">
              Moving {currentStepData.movement.direction} by {currentStepData.movement.distance} spaces
            </div>
          )}
        </div>
      </div>

      {/* Step controls */}
      {interactive && (
        <div className="flex justify-center space-x-2 mb-4">
          {data.steps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                index === currentStep
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Step {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Progress indicator */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / data.steps.length) * 100}%` }}
        ></div>
      </div>

      {/* Final result highlight */}
      {currentStep === data.steps.length - 1 && (
        <div className="text-center bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="text-xl font-bold text-green-800">
            🎉 Final Answer: {data.result}
          </div>
          <div className="text-green-600 mt-1">
            Great job! You've completed the {data.operation} on the number line!
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberLineOperationVisualization;

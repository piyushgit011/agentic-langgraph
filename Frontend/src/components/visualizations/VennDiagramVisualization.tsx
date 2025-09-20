'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VennDiagramProps {
  data: {
    set_a: {
      name: string;
      elements: string[];
      only_elements: string[];
      color: string;
    };
    set_b: {
      name: string;
      elements: string[];
      only_elements: string[];
      color: string;
    };
    intersection: string[];
    union: string[];
    neither: string[];
    universal_set: string[];
    probabilities: { [key: string]: number };
    statistics?: {
      total_elements: number;
      elements_in_a: number;
      elements_in_b: number;
      elements_in_both: number;
      elements_in_either: number;
      elements_in_neither: number;
    };
    steps?: Array<{
      step: number;
      title: string;
      highlight: string;
      description: string;
      chat_message?: string;
      concepts?: string[];
      auto_duration?: number;
    }>;
  };
  ui_config?: {
    interactive?: boolean;
    show_probabilities?: boolean;
    show_elements?: boolean;
    animate_highlighting?: boolean;
    circle_size?: number;
    overlap_offset?: number;
    websocket_enabled?: boolean;
    send_step_messages?: boolean;
    animate_steps?: boolean;
    auto_play?: boolean;
    step_duration?: number;
    colors?: {
      set_a: string;
      set_b: string;
      intersection: string;
      universal: string;
    };
  };
  currentStep?: number;
  onStepChange?: (stepIndex: number, stepData: any) => void;
}

const VennDiagramVisualization: React.FC<VennDiagramProps> = ({ 
  data, 
  ui_config = {},
  currentStep: externalCurrentStep,
  onStepChange
}) => {
  const [internalCurrentStep, setInternalCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animatingElements, setAnimatingElements] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use external step if provided, otherwise use internal
  const currentStep = externalCurrentStep !== undefined ? externalCurrentStep : internalCurrentStep;
  
  const {
    interactive = true,
    show_probabilities = true,
    show_elements = true,
    animate_highlighting = true,
    circle_size = 140,
    overlap_offset = 100,
    websocket_enabled = false,
    send_step_messages = false,
    animate_steps = true,
    auto_play = true,
    step_duration = 4000,
    colors = {
      set_a: '#3b82f6',
      set_b: '#ef4444',
      intersection: '#8b5cf6',
      universal: '#f8fafc'
    }
  } = ui_config;

  const steps = data.steps || [];
  const hasSteps = steps.length > 0;

  // Reset to first step when new data arrives
  useEffect(() => {
    if (externalCurrentStep === undefined) {
      setInternalCurrentStep(0);
    }
    setIsPlaying(false);
    setAnimatingElements([]);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
  }, [data, steps.length, externalCurrentStep]);

  // Send step message via WebSocket
  const sendStepMessage = (step: any) => {
    if (onStepChange && websocket_enabled && send_step_messages && step.chat_message) {
      onStepChange(currentStep, {
        type: 'step_message',
        step: step.step,
        description: step.description,
        chat_message: step.chat_message,
        auto_duration: step.auto_duration
      });
    }
  };

  // Go to specific step
  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    
    if (externalCurrentStep === undefined) {
      setInternalCurrentStep(stepIndex);
    }
    
    const step = steps[stepIndex];
    
    // Send step message if enabled
    if (step.chat_message) {
      sendStepMessage(step);
    }
    
    // Animate elements based on current step
    animateStepElements(step);
  };

  // Animate elements for current step
  const animateStepElements = (step: any) => {
    setAnimatingElements([]);
    
    setTimeout(() => {
      switch (step.highlight) {
        case 'set_a':
          setAnimatingElements(data.set_a.elements);
          break;
        case 'set_b':
          setAnimatingElements(data.set_b.elements);
          break;
        case 'intersection':
          setAnimatingElements(data.intersection);
          break;
        case 'union':
          setAnimatingElements(data.union);
          break;
        case 'both_sets':
          setAnimatingElements([...data.set_a.elements, ...data.set_b.elements]);
          break;
        default:
          setAnimatingElements([]);
      }
    }, 200);
  };

  // Auto-play functionality
  useEffect(() => {
    if (auto_play && hasSteps && !isPlaying && externalCurrentStep === undefined) {
      setIsPlaying(true);
      let stepIndex = 0;
      
      const playNextStep = () => {
        if (stepIndex < steps.length) {
          goToStep(stepIndex);
          stepIndex++;
          
          const nextDelay = steps[stepIndex - 1]?.auto_duration || step_duration;
          intervalRef.current = setTimeout(playNextStep, nextDelay);
        } else {
          setIsPlaying(false);
        }
      };
      
      // Start after a short delay
      intervalRef.current = setTimeout(playNextStep, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [auto_play, hasSteps, steps.length, step_duration, externalCurrentStep]);

  // Manual step controls
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  // SVG dimensions and positions
  const svgWidth = 800;
  const svgHeight = 500;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2 - 20;
  const circleA_X = centerX - overlap_offset / 2;
  const circleB_X = centerX + overlap_offset / 2;

  // Get current step highlighting
  const getCurrentHighlight = () => {
    if (!hasSteps || currentStep >= steps.length) return null;
    return steps[currentStep].highlight;
  };

  // Get section opacity based on current step
  const getSectionOpacity = (section: string) => {
    const highlight = getCurrentHighlight();
    if (!highlight) return 0.7;
    
    switch (highlight) {
      case 'set_a':
        return section === 'set_a' ? 0.9 : 0.2;
      case 'set_b':
        return section === 'set_b' ? 0.9 : 0.2;
      case 'intersection':
        return section === 'intersection' ? 0.9 : 0.2;
      case 'union':
        return (section === 'set_a' || section === 'set_b') ? 0.8 : 0.2;
      case 'both_sets':
        return (section === 'set_a' || section === 'set_b') ? 0.8 : 0.3;
      case 'universal':
        return 0.6;
      default:
        return 0.7;
    }
  };

  // Get stroke width for emphasis
  const getStrokeWidth = (section: string) => {
    const highlight = getCurrentHighlight();
    if (!highlight) return 2;
    
    if ((highlight === 'set_a' && section === 'set_a') ||
        (highlight === 'set_b' && section === 'set_b') ||
        (highlight === 'both_sets' && (section === 'set_a' || section === 'set_b'))) {
      return 4;
    }
    return 2;
  };

  // Element positioning
  const getElementPosition = (element: string, section: 'a_only' | 'b_only' | 'intersection' | 'neither') => {
    const positions = {
      a_only: { x: circleA_X - 50, y: centerY },
      b_only: { x: circleB_X + 50, y: centerY },
      intersection: { x: centerX, y: centerY },
      neither: { x: centerX, y: centerY + 150 }
    };
    
    const basePos = positions[section];
    const elements = section === 'a_only' ? data.set_a.only_elements :
                    section === 'b_only' ? data.set_b.only_elements :
                    section === 'intersection' ? data.intersection :
                    data.neither;
    
    const index = elements.indexOf(element);
    const itemsPerRow = section === 'neither' ? 4 : 3;
    
    const offsetX = (index % itemsPerRow - (itemsPerRow - 1) / 2) * 25;
    const offsetY = (Math.floor(index / itemsPerRow) - 0.5) * 25;
    
    return {
      x: basePos.x + offsetX,
      y: basePos.y + offsetY
    };
  };

  // Format probability as percentage
  const formatProbability = (prob: number) => {
    return `${(prob * 100).toFixed(1)}%`;
  };

  // Current step data
  const currentStepData = hasSteps && currentStep < steps.length ? steps[currentStep] : null;

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {hasSteps ? `Interactive Venn Diagram: ${data.set_a.name} & ${data.set_b.name}` : `Venn Diagram: ${data.set_a.name} & ${data.set_b.name}`}
        </h3>
        <p className="text-gray-600">
          {hasSteps ? "Step-by-step probability exploration" : "Exploring set relationships and probability"}
        </p>
        
        {/* Step Controls */}
        {hasSteps && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition-all duration-200 font-semibold"
            >
              ← Previous
            </button>
            
            <div className="bg-blue-100 px-4 py-2 rounded-lg">
              <span className="text-lg font-bold text-blue-700">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-all duration-200 font-semibold"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Main Venn Diagram */}
        <div className="xl:col-span-4">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 min-h-[600px]">
            {/* Current Step Info */}
            {currentStepData && (
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                <h4 className="text-lg font-bold text-blue-800 mb-2">
                  {currentStepData.title}
                </h4>
                <p className="text-blue-700 mb-2">
                  {currentStepData.description}
                </p>
                {currentStepData.concepts && (
                  <div className="space-y-1">
                    {currentStepData.concepts.map((concept, index) => (
                      <div key={index} className="text-xs text-blue-600 font-mono bg-blue-100 px-2 py-1 rounded">
                        • {concept}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SVG Diagram */}
            <div className="flex justify-center w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
              <svg 
                width={svgWidth} 
                height={svgHeight} 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full max-w-full border-2 border-blue-200 rounded-xl bg-white shadow-lg"
                style={{ maxHeight: '600px', minHeight: '500px', aspectRatio: '16/10' }}
              >
                {/* Universal set background */}
                <rect
                  x="30"
                  y="30"
                  width={svgWidth - 60}
                  height={svgHeight - 60}
                  fill={colors.universal}
                  stroke="#cbd5e1"
                  strokeWidth="3"
                  rx="15"
                  className="drop-shadow-sm"
                />
                <text x="45" y="55" className="text-lg font-bold fill-gray-700">
                  Universal Set (U) - {data.universal_set.length} elements
                </text>

                {/* Set A Circle */}
                <circle
                  cx={circleA_X}
                  cy={centerY}
                  r={circle_size}
                  fill={data.set_a.color || colors.set_a}
                  opacity={getSectionOpacity('set_a')}
                  stroke={data.set_a.color || colors.set_a}
                  strokeWidth={getStrokeWidth('set_a')}
                  className={`transition-all duration-700 ease-in-out drop-shadow-lg ${
                    getCurrentHighlight() === 'set_a' ? 'animate-pulse' : ''
                  }`}
                />
                
                {/* Set B Circle */}
                <circle
                  cx={circleB_X}
                  cy={centerY}
                  r={circle_size}
                  fill={data.set_b.color || colors.set_b}
                  opacity={getSectionOpacity('set_b')}
                  stroke={data.set_b.color || colors.set_b}
                  strokeWidth={getStrokeWidth('set_b')}
                  className={`transition-all duration-700 ease-in-out drop-shadow-lg ${
                    getCurrentHighlight() === 'set_b' ? 'animate-pulse' : ''
                  }`}
                />

                {/* Intersection Highlight */}
                {getCurrentHighlight() === 'intersection' && (
                  <ellipse
                    cx={centerX}
                    cy={centerY}
                    rx={overlap_offset * 0.6}
                    ry={circle_size * 0.8}
                    fill="none"
                    stroke={colors.intersection}
                    strokeWidth="6"
                    strokeDasharray="15,10"
                    className="animate-pulse"
                    opacity="0.8"
                  />
                )}

                {/* Union Highlight */}
                {getCurrentHighlight() === 'union' && (
                  <path
                    d={`M ${circleA_X - circle_size} ${centerY} A ${circle_size} ${circle_size} 0 1 0 ${circleA_X + circle_size} ${centerY} A ${circle_size} ${circle_size} 0 0 0 ${circleB_X + circle_size} ${centerY} A ${circle_size} ${circle_size} 0 1 0 ${circleB_X - circle_size} ${centerY} A ${circle_size} ${circle_size} 0 0 0 ${circleA_X - circle_size} ${centerY}`}
                    fill="none"
                    stroke={colors.intersection}
                    strokeWidth="6"
                    strokeDasharray="20,10"
                    className="animate-pulse"
                    opacity="0.7"
                  />
                )}

                {/* Set Labels */}
                <text
                  x={circleA_X}
                  y={centerY - circle_size - 20}
                  textAnchor="middle"
                  className="text-2xl font-bold fill-current"
                  style={{ fill: data.set_a.color || colors.set_a }}
                >
                  Set {data.set_a.name}
                </text>
                <text
                  x={circleA_X}
                  y={centerY - circle_size - 5}
                  textAnchor="middle"
                  className="text-sm fill-gray-600"
                >
                  {data.set_a.elements.length} elements
                </text>

                <text
                  x={circleB_X}
                  y={centerY - circle_size - 20}
                  textAnchor="middle"
                  className="text-2xl font-bold fill-current"
                  style={{ fill: data.set_b.color || colors.set_b }}
                >
                  Set {data.set_b.name}
                </text>
                <text
                  x={circleB_X}
                  y={centerY - circle_size - 5}
                  textAnchor="middle"
                  className="text-sm fill-gray-600"
                >
                  {data.set_b.elements.length} elements
                </text>

                {/* Elements */}
                {show_elements && (
                  <g>
                    {/* Elements only in A */}
                    {data.set_a.only_elements.map((element, index) => {
                      const pos = getElementPosition(element, 'a_only');
                      const isAnimating = animatingElements.includes(element);
                      return (
                        <g key={`a_only_${index}`} className={isAnimating ? 'animate-bounce' : ''}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="15"
                            fill="white"
                            stroke={data.set_a.color || colors.set_a}
                            strokeWidth="3"
                            className="drop-shadow-md transition-all duration-500"
                          />
                          <text
                            x={pos.x}
                            y={pos.y + 5}
                            textAnchor="middle"
                            className="text-sm font-bold fill-gray-800"
                          >
                            {element}
                          </text>
                        </g>
                      );
                    })}

                    {/* Elements only in B */}
                    {data.set_b.only_elements.map((element, index) => {
                      const pos = getElementPosition(element, 'b_only');
                      const isAnimating = animatingElements.includes(element);
                      return (
                        <g key={`b_only_${index}`} className={isAnimating ? 'animate-bounce' : ''}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="15"
                            fill="white"
                            stroke={data.set_b.color || colors.set_b}
                            strokeWidth="3"
                            className="drop-shadow-md transition-all duration-500"
                          />
                          <text
                            x={pos.x}
                            y={pos.y + 5}
                            textAnchor="middle"
                            className="text-sm font-bold fill-gray-800"
                          >
                            {element}
                          </text>
                        </g>
                      );
                    })}

                    {/* Elements in intersection */}
                    {data.intersection.map((element, index) => {
                      const pos = getElementPosition(element, 'intersection');
                      const isAnimating = animatingElements.includes(element);
                      return (
                        <g key={`intersection_${index}`} className={isAnimating ? 'animate-bounce' : ''}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="15"
                            fill="white"
                            stroke={colors.intersection}
                            strokeWidth="3"
                            className="drop-shadow-md transition-all duration-500"
                          />
                          <text
                            x={pos.x}
                            y={pos.y + 5}
                            textAnchor="middle"
                            className="text-sm font-bold fill-gray-800"
                          >
                            {element}
                          </text>
                        </g>
                      );
                    })}

                    {/* Elements in neither */}
                    {data.neither.map((element, index) => {
                      const pos = getElementPosition(element, 'neither');
                      const isAnimating = animatingElements.includes(element);
                      return (
                        <g key={`neither_${index}`} className={isAnimating ? 'animate-bounce' : ''}>
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="15"
                            fill="white"
                            stroke="#9ca3af"
                            strokeWidth="3"
                            className="drop-shadow-md transition-all duration-500"
                          />
                          <text
                            x={pos.x}
                            y={pos.y + 5}
                            textAnchor="middle"
                            className="text-sm font-bold fill-gray-600"
                          >
                            {element}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* Intersection label */}
                {data.intersection.length > 0 && (
                  <text
                    x={centerX}
                    y={centerY + circle_size + 35}
                    textAnchor="middle"
                    className="text-sm font-semibold fill-purple-600"
                  >
                    Intersection: {data.intersection.length} elements
                  </text>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Progress Indicator */}
          {hasSteps && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
              <h4 className="text-md font-bold text-gray-800 mb-3 flex items-center">
                <span className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                  {currentStep + 1}
                </span>
                Learning Progress
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600">
                {currentStep + 1} of {steps.length} steps completed ({Math.round(((currentStep + 1) / steps.length) * 100)}%)
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
            <h4 className="text-md font-bold text-gray-800 mb-3">📊 Quick Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800 text-sm">Total Elements</span>
                <span className="text-lg font-bold text-blue-600">{data.universal_set.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="font-medium text-green-800 text-sm">In Both Sets</span>
                <span className="text-lg font-bold text-green-600">{data.intersection.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800 text-sm">In Either Set</span>
                <span className="text-lg font-bold text-purple-600">{data.union.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800 text-sm">In Neither</span>
                <span className="text-lg font-bold text-gray-600">{data.neither.length}</span>
              </div>
            </div>
          </div>

          {/* Probabilities */}
          {show_probabilities && Object.keys(data.probabilities).length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h4 className="text-lg font-bold text-gray-800 mb-4">� Probabilities</h4>
              <div className="space-y-3">
                {Object.entries(data.probabilities).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <span className="font-mono text-sm text-gray-700">{key}</span>
                    <span className="text-lg font-bold text-indigo-600">{formatProbability(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Set Operations */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">🔄 Set Operations</h4>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
                <div className="font-bold text-green-800 mb-2">
                  {data.set_a.name} ∩ {data.set_b.name} (Intersection)
                </div>
                <div className="text-gray-700 font-mono">
                  {data.intersection.length > 0 ? `{${data.intersection.join(', ')}}` : '∅ (Empty set)'}
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border-l-4 border-blue-400">
                <div className="font-bold text-blue-800 mb-2">
                  {data.set_a.name} ∪ {data.set_b.name} (Union)
                </div>
                <div className="text-gray-700 font-mono">
                  {`{${data.union.join(', ')}}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VennDiagramVisualization;

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Step {
  step: number;
  position: number;
  description: string;
  highlight?: boolean;
  movement?: {
    from: number;
    to: number;
    direction: 'left' | 'right';
    distance: number;
    jumps?: number[];
  };
  chat_message?: string;
  auto_duration?: number;
  trigger_practice?: boolean;
  practice_config?: {
    operation: string;
    demonstrated_problem: string;
    difficulty: string;
    count: number;
  };
}

interface NumberLineVisualizationProps {
  data: {
    numbers?: number[];
    operation?: string;
    range?: [number, number] | { start: number; end: number };
    equation?: string;
    steps?: Step[];
    num1?: number;
    num2?: number;
    result?: number;
    operation_symbol?: string;
  };
  title: string;
  ui_config?: {
    interactive?: boolean;
    showAnimation?: boolean;
    color?: string;
    auto_play?: boolean;
    step_duration?: number;
    websocket_enabled?: boolean;
    send_step_messages?: boolean;
    mode?: string;
    student_controlled?: boolean;
    show_step_guidance?: boolean;
  };
  onStepChange?: (stepIndex: number, stepData: any) => void;
  onPracticeTrigger?: (practiceConfig: any) => void;
  currentStep?: number;
}

const NumberLineVisualization: React.FC<NumberLineVisualizationProps> = ({
  data,
  title,
  ui_config = {},
  onStepChange,
  onPracticeTrigger,
  currentStep: externalCurrentStep
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [showMovement, setShowMovement] = useState(false);
  const [animatingJumps, setAnimatingJumps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    steps = [],
    operation = '',
    range: rangeData = [-5, 15],
    equation = '',
    num1 = 0,
    num2 = 0,
    result = 0,
    operation_symbol = ''
  } = data;

  // Handle range from backend (can be array [start, end] or object {start, end})
  const range = Array.isArray(rangeData) 
    ? rangeData 
    : rangeData && typeof rangeData === 'object' && 'start' in rangeData
    ? [rangeData.start, rangeData.end]
    : [-5, 15];

  const {
    interactive = true,
    auto_play = true,
    step_duration = 3000,
    websocket_enabled = false,
    send_step_messages = false,
    mode = "demonstration",
    student_controlled = false,
    show_step_guidance = false,
    color = '#3b82f6'
  } = ui_config;
  
  // Practice mode state
  const [isPracticeMode, setIsPracticeMode] = useState(student_controlled);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [currentGuidance, setCurrentGuidance] = useState<string>("");
  const [showGuidance, setShowGuidance] = useState(show_step_guidance);
  
  const width = 700;
  const height = 250;
  const margin = { top: 60, right: 60, bottom: 80, left: 60 };
  const lineWidth = width - margin.left - margin.right;
  const lineY = height / 2;

  // Auto-determine range if not provided or fallback calculation
  const actualRange = (range && range[0] !== undefined && range[1] !== undefined) ? range : [
    Math.min(-3, (num1 || 0) - 3, (num2 || 0) - 3, (result || 0) - 3),
    Math.max(result + 5, (num1 || 0) + 6, (num2 || 0) + 6, (result || 0) + 6, 15)
  ];

  // Create scale for the number line
  const scale = (value: number) => {
    const [min, max] = actualRange;
    return (value - min) / (max - min) * lineWidth + margin.left;
  };

  // Generate tick marks
  const generateTicks = () => {
    const [min, max] = actualRange;
    const ticks = [];
    const range = max - min;
    
    // Always show every integer if range is reasonable (≤ 25)
    // For larger ranges, use smart stepping
    const step = range <= 25 ? 1 : 
                 range <= 50 ? 2 :
                 range <= 100 ? 5 : 
                 Math.ceil(range / 20);
    
    for (let i = min; i <= max; i += step) {
      ticks.push(i);
    }
    return ticks;
  };

  // Send step message via WebSocket
  const sendStepMessage = useCallback((step: Step) => {
    if (onStepChange && websocket_enabled && send_step_messages) {
      onStepChange(step.step - 1, {
        type: 'step_message',
        step: step.step,
        description: step.description,
        chat_message: step.chat_message,
        position: step.position,
        auto_duration: step.auto_duration
      });
    }
  }, [onStepChange, websocket_enabled, send_step_messages]);

  // Animate movement between positions
  const animateMovement = (step: Step) => {
    if (!step.movement) return;
    
    setShowMovement(true);
    
    if (step.movement.jumps && step.movement.jumps.length > 0) {
      // Animate each jump in sequence
      let jumpIndex = 0;
      const animateNextJump = () => {
        if (step.movement && step.movement.jumps && jumpIndex < step.movement.jumps.length) {
          setAnimatingJumps([step.movement.jumps[jumpIndex]]);
          jumpIndex++;
          setTimeout(animateNextJump, 500);
        } else {
          setAnimatingJumps([]);
          setShowMovement(false);
        }
      };
      setTimeout(animateNextJump, 500);
    } else {
      setTimeout(() => {
        setShowMovement(false);
      }, 1500);
    }
  };

  // Go to specific step
  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    
    setCurrentStep(stepIndex);
    const step = steps[stepIndex];
    
    // Generate guidance for practice mode
    if (isPracticeMode && showGuidance) {
      const guidance = generateStepGuidance(step, stepIndex);
      setCurrentGuidance(guidance);
    }
    
    // Send step message if enabled
    if (step.chat_message) {
      sendStepMessage(step);
    }
    
    // Check if this step should trigger practice problems
    if (step.trigger_practice && step.practice_config) {
      // Trigger practice problems after a short delay
      setTimeout(() => {
        if (onPracticeTrigger) {
          onPracticeTrigger(step.practice_config);
        } else {
          // Fallback: send message about practice
          sendStepMessage({
            ...step,
            chat_message: "🎯 Ready to practice! Ask me to generate practice problems for you."
          });
        }
      }, step.auto_duration || 2000);
    }
    
    // Animate movement
    animateMovement(step);
  };

  // Generate step-specific guidance for practice mode
  const generateStepGuidance = (step: Step, stepIndex: number): string => {
    if (stepIndex === 0) {
      return `📍 Start here! Click on position ${step.position} to begin your ${operation} journey.`;
    }
    
    if (step.movement) {
      const direction = step.movement.direction === 'right' ? 'right' : 'left';
      const verb = operation === 'addition' ? 'add' : operation === 'subtraction' ? 'subtract' : 'move';
      
      return `🎯 Now ${verb} ${step.movement.distance}! Click ${step.movement.distance} spaces to the ${direction} to reach ${step.movement.to}.`;
    }
    
    if (stepIndex === steps.length - 1) {
      return `🎉 Almost done! This should give you the final answer: ${step.position}. Click to complete!`;
    }
    
    return `👆 Click on position ${step.position} to continue the ${operation}.`;
  };

  // Sync external current step with internal state
  useEffect(() => {
    if (externalCurrentStep !== undefined && externalCurrentStep !== currentStep) {
      setCurrentStep(externalCurrentStep);
    }
  }, [externalCurrentStep]);

  // Reset to first step when new data arrives
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
  }, [data, steps.length]);

  // Auto-play functionality (only in demonstration mode)
  useEffect(() => {
    if (auto_play && !isPracticeMode && steps.length > 0 && !isPlaying) {
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
  }, [auto_play, isPracticeMode, steps.length]);

  // Handle manual step progression for practice mode
  const handleStepAdvance = () => {
    if (!isPracticeMode) return;
    
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      setPracticeCompleted(true);
      setCurrentGuidance("🎉 Excellent! You've completed this practice problem. Ready for another one?");
    }
  };

  // Handle number line click for interactive control
  const handleNumberLineClick = (position: number) => {
    if (!isPracticeMode) return;
    
    const step = steps[currentStep];
    if (step && Math.abs(step.position - position) < 0.5) {
      // Correct position clicked
      handleStepAdvance();
    } else {
      // Incorrect position - provide guidance
      setCurrentGuidance(`🤔 Not quite! Try clicking on position ${step?.position} instead.`);
    }
  };

  // Manual step controls
  const nextStep = () => {
    if (isPracticeMode) {
      handleStepAdvance();
    } else {
      // Original auto-advance behavior for demonstration mode
      if (currentStep < steps.length - 1) {
        goToStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && currentStep < steps.length - 1) {
      nextStep();
    }
  };

  const ticks = generateTicks();
  const currentStepData = steps[currentStep];

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
      
      {equation && (
        <div className="text-center mb-6 p-3 bg-blue-50 rounded-lg">
          <span className="text-blue-800 font-mono text-xl">{equation}</span>
        </div>
      )}

      {/* Practice Mode Guidance */}
      {isPracticeMode && showGuidance && currentGuidance && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <div className="flex items-center">
            <div className="text-yellow-700 font-medium">
              {currentGuidance}
            </div>
          </div>
        </div>
      )}

      {/* Practice Mode Instructions */}
      {isPracticeMode && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-800 text-sm">
            <span className="font-semibold">Practice Mode:</span> Click on the number line positions to solve the problem step by step.
            {!practiceCompleted && currentStep < steps.length - 1 && (
              <span className="ml-2">Click the "Next Step" button when you're ready to advance.</span>
            )}
          </div>
        </div>
      )}

      {/* Step information */}
      {currentStepData && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-green-600 font-semibold mb-1">
              Step {currentStepData.step} of {steps.length}
            </div>
            <div className="text-green-800 font-medium">
              {currentStepData.description}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mb-4">
        <svg 
          ref={svgRef}
          width={width} 
          height={height}
          className="border border-gray-200 rounded-lg bg-gray-50"
        >
          {/* Main number line */}
          <line
            x1={margin.left}
            y1={lineY}
            x2={margin.left + lineWidth}
            y2={lineY}
            stroke="#374151"
            strokeWidth="4"
          />

          {/* Arrow head */}
          <polygon
            points={`${margin.left + lineWidth + 8},${lineY} ${margin.left + lineWidth - 8},${lineY - 6} ${margin.left + lineWidth - 8},${lineY + 6}`}
            fill="#374151"
          />

          {/* Tick marks and labels */}
          {ticks.map((tick) => {
            const x = scale(tick);
            const isCurrentPosition = currentStepData?.position === tick;
            const isJumping = animatingJumps.includes(tick);
            const isHovered = hoveredPoint === tick;
            const isZero = tick === 0;
            const isOperationNumber = tick === num1 || tick === num2 || tick === result;

            return (
              <g key={tick}>
                {/* Special background for zero */}
                {isZero && (
                  <rect
                    x={x - 15}
                    y={lineY - 15}
                    width="30"
                    height="30"
                    fill="#fef3c7"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    rx="4"
                    opacity="0.3"
                  />
                )}

                {/* Tick mark */}
                <line
                  x1={x}
                  y1={lineY - 12}
                  x2={x}
                  y2={lineY + 12}
                  stroke={isCurrentPosition ? '#ef4444' : isZero ? '#f59e0b' : '#374151'}
                  strokeWidth={isCurrentPosition ? "3" : isZero ? "3" : "2"}
                />

                {/* Number label */}
                <text
                  x={x}
                  y={lineY + 30}
                  textAnchor="middle"
                  fill={isCurrentPosition ? '#ef4444' : isZero ? '#f59e0b' : isOperationNumber ? '#2563eb' : '#1f2937'}
                  fontSize={isZero || isCurrentPosition ? "18" : "16"}
                  fontWeight={isCurrentPosition || isZero || isOperationNumber ? "bold" : "600"}
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {tick}
                </text>

                {/* Clickable area for practice mode */}
                {isPracticeMode && (
                  <rect
                    x={x - 20}
                    y={lineY - 25}
                    width="40"
                    height="60"
                    fill="transparent"
                    onClick={() => handleNumberLineClick(tick)}
                    className="cursor-pointer hover:fill-blue-100 hover:opacity-20"
                    style={{ transition: 'all 0.2s ease' }}
                  />
                )}

                {/* Position marker */}
                {isCurrentPosition && (
                  <g>
                    <circle
                      cx={x}
                      cy={lineY}
                      r="12"
                      fill="#ef4444"
                      stroke="#dc2626"
                      strokeWidth="3"
                      className={isJumping ? "animate-bounce" : ""}
                    />
                    <text
                      x={x}
                      y={lineY - 20}
                      textAnchor="middle"
                      fill="#ef4444"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      ●
                    </text>
                  </g>
                )}

                {/* Jumping animation */}
                {isJumping && (
                  <circle
                    cx={x}
                    cy={lineY - 15}
                    r="8"
                    fill="#10b981"
                    className="animate-ping"
                  />
                )}

                {/* Interactive click area */}
                {interactive && (
                  <circle
                    cx={x}
                    cy={lineY}
                    r="15"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(tick)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                )}
              </g>
            );
          })}

          {/* Movement arrow */}
          {showMovement && currentStepData?.movement && (
            <g>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#10b981"
                  />
                </marker>
              </defs>
              <line
                x1={scale(currentStepData.movement.from)}
                y1={lineY - 40}
                x2={scale(currentStepData.movement.to)}
                y2={lineY - 40}
                stroke="#10b981"
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
                className="animate-pulse"
              />
              <text
                x={scale((currentStepData.movement.from + currentStepData.movement.to) / 2)}
                y={lineY - 50}
                textAnchor="middle"
                fill="#10b981"
                fontSize="12"
                fontWeight="bold"
              >
                {currentStepData.movement.direction === 'right' ? '+' : '-'}{currentStepData.movement.distance}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Step controls */}
      <div className="flex justify-center items-center gap-4 mb-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300 hover:bg-gray-600 transition-colors"
        >
          ← Previous
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Step</span>
          <span className="font-bold text-blue-600">{currentStep + 1}</span>
          <span className="text-sm text-gray-600">of {steps.length}</span>
        </div>

        <button
          onClick={nextStep}
          disabled={isPracticeMode ? practiceCompleted : currentStep === steps.length - 1}
          className={`px-4 py-2 rounded transition-colors ${
            isPracticeMode 
              ? (practiceCompleted 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-orange-500 text-white hover:bg-orange-600')
              : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300'
          }`}
        >
          {isPracticeMode 
            ? (practiceCompleted 
                ? '✓ Completed!' 
                : (currentStep === steps.length - 1 ? 'Finish' : 'Next Step'))
            : 'Next →'
          }
        </button>
      </div>

      {/* Progress bar */}
      {steps.length > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isPracticeMode && practiceCompleted 
                ? 'bg-green-600' 
                : isPracticeMode 
                  ? 'bg-orange-500' 
                  : 'bg-blue-600'
            }`}
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      )}

      {/* Final result */}
      {currentStep === steps.length - 1 && result !== undefined && (
        <div className="text-center p-4 bg-green-100 rounded-lg">
          <div className="text-green-800 font-bold text-lg">
            🎉 Final Answer: {num1} {operation_symbol} {num2} = {result}
          </div>
          <div className="text-green-600 text-sm mt-1">
            Great job! You've completed the {operation} on the number line!
          </div>
        </div>
      )}
    </div>
  );
};

export default NumberLineVisualization;

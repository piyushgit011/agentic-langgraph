import React, { useRef, useEffect, useState, useCallback } from 'react';

interface AlgebraicStep {
  step: number;
  expression: string;
  description: string;
  explanation?: string;
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

interface AlgebraicSimplificationVisualizationProps {
  data: {
    original_expression?: string;
    final_result?: string;
    steps?: AlgebraicStep[];
    step_count?: number;
  };
  title: string;
  ui_config?: {
    interactive?: boolean;
    showSteps?: boolean;
    animateTransition?: boolean;
    auto_play?: boolean;
    step_duration?: number;
    websocket_enabled?: boolean;
    send_step_messages?: boolean;
    color_scheme?: {
      original?: string;
      intermediate?: string;
      final?: string;
      highlight?: string;
    };
  };
  onStepChange?: (stepIndex: number, stepData: any) => void;
  onPracticeTrigger?: (practiceConfig: any) => void;
  currentStep?: number;
}

const AlgebraicSimplificationVisualization: React.FC<AlgebraicSimplificationVisualizationProps> = ({
  data,
  title,
  ui_config = {},
  onStepChange,
  onPracticeTrigger,
  currentStep: externalCurrentStep
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animatingStep, setAnimatingStep] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    steps = [],
    original_expression = '',
    final_result = '',
    step_count = 0
  } = data;

  const {
    interactive = true,
    showSteps = true,
    animateTransition = true,
    auto_play = true,
    step_duration = 4000,
    websocket_enabled = false,
    send_step_messages = false,
    color_scheme = {
      original: '#3b82f6',
      intermediate: '#10b981',
      final: '#ef4444',
      highlight: '#f59e0b'
    }
  } = ui_config;

  // Debug logging
  console.log('AlgebraicSimplification: Component initialized with config', {
    ui_config,
    websocket_enabled,
    send_step_messages,
    auto_play,
    step_duration,
    stepsLength: steps.length
  });

  // Send step message via WebSocket
  const sendStepMessage = useCallback((step: AlgebraicStep) => {
    console.log('AlgebraicSimplification: Sending step message', step.step);
    
    if (onStepChange && websocket_enabled && send_step_messages) {
      onStepChange(step.step - 1, {
        type: 'step_message',
        step: step.step,
        description: step.description,
        explanation: step.explanation,
        chat_message: step.chat_message,
        expression: step.expression,
        auto_duration: step.auto_duration
      });
    }
  }, [onStepChange, websocket_enabled, send_step_messages]);

  // Animate step transition
  const animateStepTransition = () => {
    if (animateTransition) {
      setAnimatingStep(true);
      setTimeout(() => {
        setAnimatingStep(false);
      }, 800);
    }
  };

  // Go to specific step
  const goToStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) return;
    
    console.log('AlgebraicSimplification: Going to step', stepIndex);
    setCurrentStep(stepIndex);
    const step = steps[stepIndex];
    
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
    
    // Animate transition
    animateStepTransition();
  };

  // Sync external current step with internal state
  useEffect(() => {
    if (externalCurrentStep !== undefined && externalCurrentStep !== currentStep) {
      setCurrentStep(externalCurrentStep);
    }
  }, [externalCurrentStep]);

  // Reset to first step when new data arrives
  useEffect(() => {
    console.log('AlgebraicSimplification: Reset effect triggered', {
      dataChanged: true,
      stepsLength: steps.length
    });
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, [data]);

  // Auto-play functionality - separate from reset to avoid conflicts
  useEffect(() => {
    console.log('AlgebraicSimplification: Auto-play effect triggered', {
      auto_play,
      stepsLength: steps.length,
      currentStep
    });
    
    // Only start auto-play if we have steps and auto_play is enabled
    if (auto_play && steps.length > 0) {
      console.log('AlgebraicSimplification: Starting auto-play with 100ms delay');
      setIsPlaying(true);
      
      // Start after a very short delay to ensure reset effect has completed
      const autoPlayTimeout = setTimeout(() => {
        let stepIndex = 0;
        
        const playNextStep = () => {
          console.log('AlgebraicSimplification: Auto-advancing to step', stepIndex + 1, 'of', steps.length);
          
          if (stepIndex < steps.length) {
            const step = steps[stepIndex];
            
            // Update current step
            setCurrentStep(stepIndex);
            
            // Send step message if enabled
            if (step.chat_message && onStepChange && ui_config.websocket_enabled && ui_config.send_step_messages) {
              console.log('AlgebraicSimplification: Sending chat message for step', stepIndex + 1);
              onStepChange(step.step - 1, {
                type: 'step_message',
                step: step.step,
                description: step.description,
                explanation: step.explanation,
                chat_message: step.chat_message,
                expression: step.expression,
                auto_duration: step.auto_duration
              });
            }
            
            // Trigger animation
            setAnimatingStep(true);
            setTimeout(() => setAnimatingStep(false), 800);
            
            // Move to next step
            stepIndex++;
            
            // Schedule next step if there are more steps
            if (stepIndex < steps.length) {
              const nextDelay = step.auto_duration || ui_config.step_duration || 4000;
              console.log('AlgebraicSimplification: Scheduling next step in', nextDelay, 'ms');
              intervalRef.current = setTimeout(playNextStep, nextDelay);
            } else {
              console.log('AlgebraicSimplification: Auto-play completed - all steps shown');
              setIsPlaying(false);
            }
          }
        };
        
        // Start immediately with first step
        playNextStep();
      }, 100); // Very short delay to ensure component is ready
      
      // Store the timeout reference
      intervalRef.current = autoPlayTimeout;
    } else {
      console.log('AlgebraicSimplification: Not starting auto-play', {
        auto_play,
        stepsLength: steps.length
      });
    }
    
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [auto_play, steps.length]); // Simplified dependencies

  // Manual step controls
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
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

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Get color for current step
  const getStepColor = (stepIndex: number) => {
    if (stepIndex === 0) return color_scheme.original;
    if (stepIndex === steps.length - 1) return color_scheme.final;
    return color_scheme.intermediate;
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
      
      {/* Original Expression Display */}
      {original_expression && (
        <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="text-sm text-blue-600 font-semibold mb-2">Original Expression</div>
          <div className="text-blue-800 font-mono text-2xl font-bold">
            {original_expression}
          </div>
        </div>
      )}

      {/* Current Step Display */}
      {currentStepData && (
        <div className="mb-6">
          {/* Step Information */}
          <div className="mb-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-green-600 font-semibold">
                Step {currentStepData.step} of {steps.length}
              </div>
              <div className="text-xs text-gray-500">
                {isFirstStep ? '🚀 Start' : isLastStep ? '🎯 Final' : '⚡ Progress'}
              </div>
            </div>
            <div className="text-green-800 font-medium mb-2">
              {currentStepData.description}
            </div>
            {currentStepData.explanation && (
              <div className="text-green-700 text-sm italic">
                {currentStepData.explanation}
              </div>
            )}
          </div>

          {/* Expression Display */}
          <div className="text-center mb-4">
            <div className={`
              inline-block p-6 rounded-lg border-2 font-mono text-3xl font-bold
              transition-all duration-800 ease-in-out
              ${animatingStep ? 'scale-110 shadow-lg' : 'scale-100'}
            `} style={{
              backgroundColor: `${getStepColor(currentStep)}20`,
              borderColor: getStepColor(currentStep),
              color: getStepColor(currentStep)
            }}>
              {currentStepData.expression}
            </div>
          </div>
        </div>
      )}

      {/* Step Controls */}
      {interactive && (
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
            disabled={currentStep === steps.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {steps.length > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      )}

      {/* Step Timeline */}
      {showSteps && steps.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Step Timeline</h4>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300
                  ${index === currentStep 
                    ? 'bg-blue-100 border-2 border-blue-400 shadow-md' 
                    : index < currentStep 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
                  }
                `}
                onClick={() => goToStep(index)}
              >
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-3
                  ${index === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : index < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                  }
                `}>
                  {index < currentStep ? '✓' : step.step}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{step.description}</div>
                  <div className="font-mono text-sm text-gray-600 mt-1">{step.expression}</div>
                </div>
                {index === currentStep && (
                  <div className="text-blue-500 font-bold">← Current</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final Result Display */}
      {isLastStep && final_result && (
        <div className="text-center p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-300">
          <div className="text-green-800 font-bold text-xl mb-2">
            🎉 Final Simplified Expression
          </div>
          <div className="text-green-700 font-mono text-3xl font-bold mb-2">
            {final_result}
          </div>
          <div className="text-green-600 text-sm">
            Great job! You've successfully simplified the algebraic expression! 🌟
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgebraicSimplificationVisualization;

"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useNumberLineState } from '../../contexts/VisualizationStateContext';

interface StudentAction {
  action_type: string;
  position?: number;
  step_number: number;
  user_reasoning?: string;
}

interface ExpectedStep {
  step: number;
  action: string;
  position: number;
  description: string;
}

interface InteractivePracticeSessionProps {
  data: {
    problem: string;
    num1: number;
    num2: number;
    result: number;
    operation: string;
    operation_symbol: string;
    guided_mode: boolean;
    student_controlled: boolean;
    human_in_loop: boolean;
    practice_mode: boolean;
    range: { start: number; end: number };
    expected_steps: ExpectedStep[];
    guidance_messages: any;
  };
  title: string;
  ui_config?: {
    interactive?: boolean;
    student_controlled?: boolean;
    show_next_step_button?: boolean;
    show_hint_button?: boolean;
    show_reset_button?: boolean;
    validate_each_step?: boolean;
    human_feedback_enabled?: boolean;
    websocket_enabled?: boolean;
    send_step_messages?: boolean;
    color_scheme?: any;
  };
  onStepChange?: (stepIndex: number, stepData: any) => void;
  onHumanFeedback?: (feedback: any) => void;
  sendMessage?: (message: string) => void;
}

export function InteractivePracticeSessionVisualization({
  data,
  title,
  ui_config = {},
  onStepChange,
  onHumanFeedback,
  sendMessage
}: InteractivePracticeSessionProps) {
  // Create a unique visualization ID based on the practice data
  const visualizationId = `session_${data.operation}_${data.num1}_${data.num2}_${title?.replace(/\s+/g, '_') || 'default'}`;
  const [state, updateState] = useNumberLineState(visualizationId);
  const initializationRef = useRef(false);

  console.log(`🔍 InteractivePracticeSessionVisualization: Visualization ID: ${visualizationId}`);
  console.log(`🔍 InteractivePracticeSessionVisualization: Current state:`, state);

  const svgRef = useRef<SVGSVGElement>(null);

  // Initialize state when component mounts
  useEffect(() => {
    if (!initializationRef.current) {
      console.log(`🔄 InteractivePracticeSessionVisualization: Initial mount - checking state for ${visualizationId}`);

      const currentProblem = `${data.num1} ${data.operation_symbol} ${data.num2}`;

      if (!state.isInitialized) {
        console.log(`🔄 InteractivePracticeSessionVisualization: Initializing state for ${visualizationId}`);
        updateState({
          isInitialized: true,
          problem: currentProblem,
          currentStep: 0,
          studentPosition: data.num1 || 0,
          studentActions: [],
          showHint: false,
          awaitingHumanFeedback: false,
          feedbackMessage: '',
          showReasoningInput: false,
          userReasoning: '',
          isCompleted: false
        });
      } else {
        console.log(`✅ InteractivePracticeSessionVisualization: State already exists for ${visualizationId}:`, state);
      }

      initializationRef.current = true;
    }
  }, []);

  // Use state from context
  const currentStep = state.currentStep || 0;
  const studentPosition = state.studentPosition || data.num1 || 0;
  const studentActions = state.studentActions || [];
  const showHint = state.showHint || false;
  const awaitingHumanFeedback = state.awaitingHumanFeedback || false;
  const feedbackMessage = state.feedbackMessage || '';
  const showReasoningInput = state.showReasoningInput || false;
  const userReasoning = state.userReasoning || '';
  const isCompleted = state.isCompleted || false;

  // Helper functions to update specific state parts
  const setCurrentStep = (step: number) => updateState({ currentStep: step });
  const setStudentPosition = (position: number) => updateState({ studentPosition: position });
  const setStudentActions = (actions: any[]) => updateState({ studentActions: actions });
  const setShowHint = (show: boolean) => updateState({ showHint: show });
  const setAwaitingHumanFeedback = (waiting: boolean) => updateState({ awaitingHumanFeedback: waiting });
  const setFeedbackMessage = (message: string) => updateState({ feedbackMessage: message });
  const setShowReasoningInput = (show: boolean) => updateState({ showReasoningInput: show });
  const setUserReasoning = (reasoning: string) => updateState({ userReasoning: reasoning });
  const setIsCompleted = (completed: boolean) => updateState({ isCompleted: completed });

  const {
    num1, num2, result, operation, operation_symbol, range: dataRange,
    expected_steps = [], guidance_messages = {}, guided_mode = false
  } = data || {};

  // Create a fallback range if not provided
  const range = dataRange || {
    start: Math.min(num1 || 0, num2 || 0, result || 0) - 5,
    end: Math.max(num1 || 0, num2 || 0, result || 0) + 5
  };

  const {
    show_hint_button = true,
    show_reset_button = true,
    validate_each_step = true,
    human_feedback_enabled = true,
    color_scheme = {}
  } = ui_config;

  // SVG dimensions
  const width = 700;
  const height = 250;
  const margin = { top: 60, right: 60, bottom: 80, left: 60 };
  const lineWidth = width - margin.left - margin.right;
  const lineY = height / 2;

  // Create scale for the number line
  const scale = (value: number) => {
    const rangeSize = range.end - range.start;
    return margin.left + (value - range.start) * (lineWidth / rangeSize);
  };

  // Generate ticks for the number line
  const generateTicks = () => {
    const ticks = [];
    for (let i = range.start; i <= range.end; i++) {
      ticks.push({
        value: i,
        x: scale(i),
        label: i.toString()
      });
    }
    return ticks;
  };

  // Send step message to chat
  const sendStepMessage = useCallback((message: string) => {
    if (sendMessage) {
      sendMessage(message);
    }
    if (onStepChange) {
      onStepChange(currentStep, {
        type: 'step_message',
        chat_message: message,
        step: currentStep,
        student_action: true
      });
    }
  }, [sendMessage, onStepChange, currentStep]);

  // Handle click on number line
  const handleNumberLineClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || isCompleted) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;

    // Find closest number
    let closestNumber = range.start;
    let minDistance = Math.abs(scale(range.start) - x);

    for (let i = range.start + 1; i <= range.end; i++) {
      const distance = Math.abs(scale(i) - x);
      if (distance < minDistance) {
        minDistance = distance;
        closestNumber = i;
      }
    }

    handleStudentAction('move_to_position', closestNumber);
  };

  // Handle student action
  const handleStudentAction = async (actionType: string, position?: number) => {
    const newAction: StudentAction = {
      action_type: actionType,
      position: position,
      step_number: currentStep + 1,
      user_reasoning: userReasoning
    };

    setStudentActions([...studentActions, newAction]);

    if (position !== undefined) {
      setStudentPosition(position);
    }

    // Send step message
    const stepMessage = getStepMessage(actionType, position);
    sendStepMessage(stepMessage);

    // Validate step if enabled
    if (validate_each_step && expected_steps?.[currentStep]) {
      await validateStudentStep(newAction);
    } else {
      setCurrentStep(currentStep + 1);
    }

    // Clear reasoning input
    setUserReasoning('');
    setShowReasoningInput(false);
  };

  // Get appropriate step message
  const getStepMessage = (actionType: string, position?: number) => {
    switch (actionType) {
      case 'move_to_position':
        return `I moved to position ${position} on the number line.`;
      case 'start_problem':
        return `I'm starting to solve ${num1} ${operation_symbol} ${num2}.`;
      case 'request_hint':
        return `I need a hint for this step.`;
      case 'explain_reasoning':
        return `My reasoning: ${userReasoning}`;
      default:
        return `I performed action: ${actionType}`;
    }
  };

  // Validate student step
  const validateStudentStep = async (action: StudentAction) => {
    const expectedStep = expected_steps?.[currentStep];

    if (!expectedStep) {
      setCurrentStep(currentStep + 1);
      return;
    }

    const isCorrect = action.position === expectedStep.position;

    if (isCorrect) {
      setFeedbackMessage(`✅ Excellent! ${expectedStep.description}`);
      const encouragements = guidance_messages?.encouragement || ['Well done!'];
      sendStepMessage(`Great job! You correctly moved to ${action.position}. ${encouragements[Math.floor(Math.random() * encouragements.length)]}`);

      setTimeout(() => {
        setFeedbackMessage('');
        setCurrentStep(currentStep + 1);

        // Check if completed
        if (currentStep + 1 >= (expected_steps?.length || 0)) {
          setIsCompleted(true);
          sendStepMessage(`🎉 Outstanding! You've successfully solved ${num1} ${operation_symbol} ${num2} = ${result}! You showed excellent mathematical reasoning!`);
        }
      }, 2000);
    } else {
      setFeedbackMessage(`🤔 Not quite right. Let me help you think through this...`);

      if (human_feedback_enabled) {
        setAwaitingHumanFeedback(true);
        sendStepMessage(`I moved to ${action.position}, but I think I might need some guidance. Can you help me understand what I should do next?`);

        // Request human feedback
        if (onHumanFeedback) {
          onHumanFeedback({
            student_action: action,
            expected_step: expectedStep,
            current_position: action.position,
            target_position: expectedStep.position,
            problem: data.problem,
            step: currentStep + 1
          });
        }
      } else {
        // Provide automated feedback
        setTimeout(() => {
          setFeedbackMessage(`💡 Hint: ${expectedStep.description}. Try again!`);
          sendStepMessage(`Let me give you a hint: ${expectedStep.description}. You can try clicking on a different position!`);
        }, 1500);
      }
    }
  };

  // Handle human feedback response
  const handleHumanFeedbackResponse = (feedback: string) => {
    setAwaitingHumanFeedback(false);
    setFeedbackMessage(feedback);
    sendStepMessage(feedback);

    setTimeout(() => {
      setFeedbackMessage('');
    }, 3000);
  };

  // Show hint
  const showHintForCurrentStep = () => {
    const expectedStep = expected_steps?.[currentStep];
    if (expectedStep) {
      const hint = guidance_messages.hints?.[expectedStep.action] || expectedStep.description;
      setFeedbackMessage(`💡 Hint: ${hint}`);
      sendStepMessage(`I asked for a hint: ${hint}`);
      setShowHint(true);

      setTimeout(() => {
        setFeedbackMessage('');
        setShowHint(false);
      }, 4000);
    }
  };

  // Reset practice
  const resetPractice = () => {
    setCurrentStep(0);
    setStudentPosition(0);
    setStudentActions([]);
    setFeedbackMessage('');
    setAwaitingHumanFeedback(false);
    setIsCompleted(false);
    sendStepMessage(`I'm resetting the practice to start over with ${num1} ${operation_symbol} ${num2}.`);
  };

  // Request reasoning input
  const requestReasoning = () => {
    setShowReasoningInput(true);
    sendStepMessage("I want to explain my thinking before making my next move.");
  };

  const ticks = generateTicks();
  const currentExpectedStep = expected_steps?.[currentStep];

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h3>

      {/* Problem Display */}
      <div className="text-center mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-2xl font-mono text-blue-800 mb-2">{data.problem} = ?</div>
        <div className="text-sm text-blue-600">
          {guided_mode ? 'Guided Practice Mode' : 'Free Practice Mode'} • Step {currentStep + 1} of {expected_steps?.length || 0}
        </div>
      </div>

      {/* Current Step Guidance */}
      {currentExpectedStep && !isCompleted && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <div className="text-green-800 font-medium">
            Next Step: {currentExpectedStep.description}
          </div>
          {guided_mode && (
            <div className="text-sm text-green-600 mt-1">
              Click on the number line to make your move!
            </div>
          )}
        </div>
      )}

      {/* Feedback Display */}
      {feedbackMessage && (
        <div className={`mb-4 p-3 rounded-lg ${feedbackMessage.includes('✅') ? 'bg-green-50 text-green-800' :
            feedbackMessage.includes('🤔') ? 'bg-yellow-50 text-yellow-800' :
              'bg-blue-50 text-blue-800'
          }`}>
          {feedbackMessage}
        </div>
      )}

      {/* Human Feedback Awaiting */}
      {awaitingHumanFeedback && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="text-orange-800 font-medium">⏳ Waiting for teacher feedback...</div>
          <div className="text-sm text-orange-600 mt-1">
            I've asked for help with this step. The teacher will guide me!
          </div>
        </div>
      )}

      {/* Reasoning Input */}
      {showReasoningInput && (
        <div className="mb-4 p-4 bg-purple-50 rounded-lg">
          <label className="block text-sm font-medium text-purple-800 mb-2">
            Explain your reasoning:
          </label>
          <textarea
            value={userReasoning}
            onChange={(e) => setUserReasoning(e.target.value)}
            className="w-full p-2 border border-purple-300 rounded text-sm"
            rows={3}
            placeholder="Why do you think this is the right move?"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setShowReasoningInput(false)}
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
            >
              Done
            </button>
            <button
              onClick={() => {
                setShowReasoningInput(false);
                setUserReasoning('');
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Interactive Number Line */}
      <div className="flex justify-center mb-4">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-gray-200 rounded-lg bg-gray-50 cursor-pointer"
          onClick={handleNumberLineClick}
        >
          {/* Main number line */}
          <line
            x1={margin.left}
            y1={lineY}
            x2={width - margin.right}
            y2={lineY}
            stroke={color_scheme.line || "#374151"}
            strokeWidth="3"
          />

          {/* Ticks and numbers */}
          {ticks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={tick.x}
                y1={lineY - 10}
                x2={tick.x}
                y2={lineY + 10}
                stroke={color_scheme.numbers || "#1f2937"}
                strokeWidth="2"
              />
              <text
                x={tick.x}
                y={lineY + 30}
                textAnchor="middle"
                className="text-sm font-medium fill-gray-700"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Student current position */}
          {studentPosition !== 0 && (
            <circle
              cx={scale(studentPosition)}
              cy={lineY}
              r="8"
              fill={color_scheme.student_action || "#8b5cf6"}
              stroke="#ffffff"
              strokeWidth="3"
            />
          )}

          {/* Expected position highlight */}
          {currentExpectedStep && guided_mode && (
            <circle
              cx={scale(currentExpectedStep.position)}
              cy={lineY}
              r="12"
              fill="none"
              stroke={color_scheme.result_highlight || "#ef4444"}
              strokeWidth="2"
              strokeDasharray="4,4"
              opacity="0.6"
            />
          )}
        </svg>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {show_hint_button && !isCompleted && (
          <button
            onClick={showHintForCurrentStep}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium"
          >
            💡 Get Hint
          </button>
        )}

        <button
          onClick={requestReasoning}
          disabled={isCompleted}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-lg font-medium"
        >
          🧠 Explain Thinking
        </button>

        {show_reset_button && (
          <button
            onClick={resetPractice}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
          >
            🔄 Start Over
          </button>
        )}
      </div>

      {/* Progress Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{currentStep} / {expected_steps?.length || 0} steps</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / (expected_steps?.length || 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Completion Message */}
      {isCompleted && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="text-2xl mb-2">🎉</div>
          <div className="text-green-800 font-bold text-lg mb-2">
            Excellent Work!
          </div>
          <div className="text-green-700 mb-3">
            You successfully solved {num1} {operation_symbol} {num2} = {result}!
          </div>
          <button
            onClick={resetPractice}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
          >
            🔄 Try Another Problem
          </button>
        </div>
      )}
    </div>
  );
}

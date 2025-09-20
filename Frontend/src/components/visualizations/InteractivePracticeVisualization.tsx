import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNumberLineState } from '../../contexts/VisualizationStateContext';

// Simple icon components to replace lucide-react
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HelpCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const Lightbulb = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

interface PracticeStep {
  step: number;
  question: string;
  hint: string;
  answer: string;
  explanation: string;
}

interface InteractivePracticeProps {
  data: {
    expression: string;
    steps: PracticeStep[];
    title?: string;
  };
  ui_config?: {
    interactive?: boolean;
    showHints?: boolean;
    allowSkip?: boolean;
  };
  onStepChange?: (stepIndex: number, stepData: any) => void;
}

const InteractivePracticeVisualization: React.FC<InteractivePracticeProps> = ({
  data,
  ui_config = {},
  onStepChange
}) => {
  // Create a unique visualization ID based on the practice data and session
  const visualizationId = `practice_${data.title?.replace(/\s+/g, '_') || 'default'}_${data.expression || 'unknown'}_${data.steps?.length || 0}`;
  const [state, updateState] = useNumberLineState(visualizationId);
  const initializationRef = useRef(false);

  console.log(`🔍 InteractivePracticeVisualization: Visualization ID: ${visualizationId}`);
  console.log(`🔍 InteractivePracticeVisualization: Current state:`, state);

  // Initialize state when component mounts or when the data changes
  useEffect(() => {
    if (!initializationRef.current) {
      console.log(`🔄 InteractivePracticeVisualization: Initial mount - checking state for ${visualizationId}`);

      if (!state.isInitialized) {
        console.log(`🔄 InteractivePracticeVisualization: Initializing state for ${visualizationId}`);
        updateState({
          isInitialized: true,
          problem: data.expression,
          currentStep: 0,
          userAnswer: '',
          showHint: false,
          isCorrect: null,
          completedSteps: []
        });
      } else {
        console.log(`✅ InteractivePracticeVisualization: State already exists for ${visualizationId}:`, state);
      }

      initializationRef.current = true;
    }
  }, []);

  // Use state from context
  const currentStep = state.currentStep || 0;
  const userAnswer = state.userAnswer || '';
  const showHint = state.showHint || false;
  const isCorrect = state.isCorrect;
  const completedSteps = state.completedSteps || [];

  // Helper functions to update specific state parts
  const setCurrentStep = (step: number) => updateState({ currentStep: step });
  const setUserAnswer = (answer: string) => updateState({ userAnswer: answer });
  const setShowHint = (show: boolean) => updateState({ showHint: show });
  const setIsCorrect = (correct: boolean | null) => updateState({ isCorrect: correct });
  const setCompletedSteps = (steps: number[]) => updateState({ completedSteps: steps });

  const { interactive = true, showHints = true, allowSkip = true } = ui_config;
  const currentStepData = data.steps[currentStep];

  // Only call onStepChange when there are actual changes, not on every render

  const handleSubmitAnswer = () => {
    if (!currentStepData) return;

    const normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/\s+/g, '');
    const normalizedCorrectAnswer = currentStepData.answer.trim().toLowerCase().replace(/\s+/g, '');

    const correct = normalizedUserAnswer === normalizedCorrectAnswer;
    setIsCorrect(correct);

    // Send feedback to chat via step change callback
    if (onStepChange) {
      onStepChange(currentStep, {
        step: currentStep + 1,
        question: currentStepData.question,
        userAnswer,
        correctAnswer: currentStepData.answer,
        isCorrect: correct,
        feedback: correct ?
          `Great job! ${currentStepData.explanation}` :
          `Not quite right. The correct answer is "${currentStepData.answer}". ${currentStepData.explanation}`,
        action: 'answer_submitted'
      });
    }

    if (correct) {
      setCompletedSteps([...completedSteps, currentStep]);
      setTimeout(() => {
        if (currentStep < data.steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setUserAnswer('');
          setIsCorrect(null);
          setShowHint(false);
        }
      }, 2000);
    }
    // For wrong answers, user can click "Try Again" button
  };

  const handleNextStep = () => {
    if (currentStep < data.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowHint(false);
    }
  };

  const handleSkipStep = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    handleNextStep();
  };

  if (!currentStepData) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">Practice Complete!</h3>
        </div>
        <p className="text-green-700">
          Great job! You've completed the practice session for: <strong>{data.expression}</strong>
        </p>
        <div className="mt-4">
          <p className="text-sm text-green-600">
            Steps completed: {completedSteps.length} / {data.steps.length}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Interactive Practice: {data.expression}
        </h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Step {currentStep + 1} of {data.steps.length}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / data.steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-2">Question:</h3>
            <p className="text-blue-700">{currentStepData.question}</p>
          </div>
        </div>
      </div>

      {/* Answer Input */}
      {interactive && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your answer here..."
              disabled={false}
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Feedback */}
      {isCorrect !== null && (
        <div className={`mb-4 p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle className={`h-5 w-5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              {isCorrect ? 'Excellent work! 🎉' : 'Not quite right, but keep trying! 💪'}
            </span>
          </div>
          {isCorrect ? (
            <p className="mt-2 text-green-700">{currentStepData.explanation}</p>
          ) : (
            <div className="mt-2">
              <p className="text-red-700">The correct answer is: <strong>{currentStepData.answer}</strong></p>
              <p className="text-red-600 mt-1">{currentStepData.explanation}</p>
              <p className="text-red-600 mt-1 text-sm">💡 Try again when you're ready!</p>
            </div>
          )}
        </div>
      )}

      {/* Hint */}
      {showHints && (
        <div className="mb-4">
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Show Hint</span>
            </button>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Hint:</h4>
                  <p className="text-yellow-700">{currentStepData.hint}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div>
          {allowSkip && isCorrect !== true && (
            <button
              onClick={handleSkipStep}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip this step
            </button>
          )}
        </div>

        <div className="flex space-x-2">
          {isCorrect === false && (
            <button
              onClick={() => {
                setIsCorrect(null);
                setUserAnswer('');
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Try Again
            </button>
          )}
          {isCorrect === true && currentStep < data.steps.length - 1 && (
            <button
              onClick={handleNextStep}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-center space-x-2">
          {data.steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index < currentStep ? 'bg-green-500' :
                  index === currentStep ? 'bg-blue-500' :
                    'bg-gray-300'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteractivePracticeVisualization;

import React, { useState, useEffect, useCallback } from 'react';

// Simple icon components
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

const Robot = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

interface PracticeStep {
  step: number;
  title: string;
  question: string;
  interaction_type: 'multiple_choice' | 'input_with_validation' | 'drag_and_drop';
  options?: { id: string; text: string; correct: boolean }[];
  correct_answers?: string[];
  components?: { id: string; text: string; type: string }[];
  correct_sequence?: string[];
  hint: string;
  explanation: string;
  ai_guidance: string;
}

interface InteractivePracticeUIProps {
  data: {
    expression: string;
    steps: PracticeStep[];
    current_step: number;
    total_steps: number;
    difficulty: string;
    practice_mode: string;
  };
  ui_config?: {
    interactive?: boolean;
    show_hints?: boolean;
    show_ai_guidance?: boolean;
    allow_retry?: boolean;
    real_time_feedback?: boolean;
  };
  onStepChange?: (stepIndex: number, stepData: any) => void;
}

const InteractivePracticeUI: React.FC<InteractivePracticeUIProps> = ({ 
  data, 
  ui_config = {}, 
  onStepChange 
}) => {
  const [currentStep, setCurrentStep] = useState(data.current_step || 0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [inputAnswer, setInputAnswer] = useState('');
  const [dragSequence, setDragSequence] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showAIGuidance, setShowAIGuidance] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const { 
    interactive = true, 
    show_hints = true, 
    show_ai_guidance = true, 
    allow_retry = true,
    real_time_feedback = true 
  } = ui_config;

  const currentStepData = data.steps[currentStep];

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData('text/plain', componentId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const componentId = e.dataTransfer.getData('text/plain');
    if (!dragSequence.includes(componentId)) {
      setDragSequence([...dragSequence, componentId]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeDragComponent = (index: number) => {
    const newSequence = [...dragSequence];
    newSequence.splice(index, 1);
    setDragSequence(newSequence);
  };

  const checkAnswer = useCallback(() => {
    if (!currentStepData) return;

    let isCorrect = false;
    let userAnswer = '';

    switch (currentStepData.interaction_type) {
      case 'multiple_choice':
        const selectedOption = currentStepData.options?.find(opt => opt.id === selectedAnswer);
        isCorrect = selectedOption?.correct || false;
        userAnswer = selectedOption?.text || '';
        break;
      
      case 'input_with_validation':
        const normalizedInput = inputAnswer.trim().toLowerCase().replace(/\s+/g, '');
        isCorrect = currentStepData.correct_answers?.some(answer => 
          answer.toLowerCase().replace(/\s+/g, '') === normalizedInput
        ) || false;
        userAnswer = inputAnswer;
        break;
      
      case 'drag_and_drop':
        isCorrect = JSON.stringify(dragSequence) === JSON.stringify(currentStepData.correct_sequence);
        userAnswer = dragSequence.join(' ');
        break;
    }

    // Set feedback
    setFeedback({
      type: isCorrect ? 'correct' : 'incorrect',
      message: isCorrect ? '🎉 Excellent!' : '❌ Not quite right.'
    });

    // Send step data to parent for AI guidance
    if (onStepChange) {
      onStepChange(currentStep, {
        step: currentStep + 1,
        userAnswer,
        isCorrect,
        stepType: currentStepData.interaction_type,
        stepTitle: currentStepData.title,
        explanation: currentStepData.explanation,
        ai_guidance: currentStepData.ai_guidance,
        action: 'answer_submitted'
      });
    }

    if (isCorrect) {
      setCompletedSteps(prev => [...prev, currentStep]);
      // Auto-advance after 2 seconds
      setTimeout(() => {
        if (currentStep < data.steps.length - 1) {
          setCurrentStep(currentStep + 1);
          resetStepState();
        }
      }, 2000);
    }
  }, [currentStep, selectedAnswer, inputAnswer, dragSequence, currentStepData, onStepChange, data.steps.length]);

  const resetStepState = () => {
    setSelectedAnswer('');
    setInputAnswer('');
    setDragSequence([]);
    setShowHint(false);
    setShowAIGuidance(false);
    setFeedback({ type: null, message: '' });
  };

  const handleRetry = () => {
    resetStepState();
    setFeedback({ type: null, message: '' });
  };

  if (!currentStepData) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">Practice Complete! 🎊</h3>
        </div>
        <p className="text-green-700">
          Fantastic work! You've successfully completed the interactive practice for: <strong>{data.expression}</strong>
        </p>
        <div className="mt-4">
          <p className="text-sm text-green-600">
            Steps completed: {completedSteps.length} / {data.steps.length}
          </p>
        </div>
      </div>
    );
  }

  const renderInteraction = () => {
    switch (currentStepData.interaction_type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentStepData.options?.map((option) => (
              <label
                key={option.id}
                className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedAnswer === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="multiple-choice"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'input_with_validation':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-center"
              placeholder="Enter your answer here..."
            />
          </div>
        );

      case 'drag_and_drop':
        return (
          <div className="space-y-4">
            {/* Available components */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Available Components:</h4>
              <div className="flex flex-wrap gap-2">
                {currentStepData.components?.map((component) => (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component.id)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-md cursor-move hover:shadow-md transition-shadow"
                  >
                    {component.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg min-h-[80px] bg-blue-50"
            >
              <h4 className="text-sm font-medium text-gray-700 mb-3">Build your answer:</h4>
              <div className="flex flex-wrap gap-2">
                {dragSequence.map((componentId, index) => {
                  const component = currentStepData.components?.find(c => c.id === componentId);
                  return (
                    <div
                      key={`${componentId}-${index}`}
                      className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-md cursor-pointer"
                      onClick={() => removeDragComponent(index)}
                    >
                      {component?.text}
                    </div>
                  );
                })}
                {dragSequence.length === 0 && (
                  <p className="text-gray-500 italic">Drag components here to build your answer</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canSubmit = () => {
    switch (currentStepData.interaction_type) {
      case 'multiple_choice':
        return selectedAnswer !== '';
      case 'input_with_validation':
        return inputAnswer.trim() !== '';
      case 'drag_and_drop':
        return dragSequence.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Interactive Practice: {data.expression}
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Step {currentStep + 1} of {data.steps.length}</span>
          <span>•</span>
          <span className="capitalize">{data.difficulty} Level</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2 ml-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / data.steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentStepData.title}</h3>
        
        {/* Question */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Question:</h4>
              <p className="text-blue-700">{currentStepData.question}</p>
            </div>
          </div>
        </div>

        {/* Interactive Component */}
        <div className="mb-6">
          {renderInteraction()}
        </div>

        {/* Submit Button */}
        {interactive && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={checkAnswer}
              disabled={!canSubmit() || feedback.type === 'correct'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {feedback.type === 'correct' ? 'Correct! ✓' : 'Submit Answer'}
            </button>
          </div>
        )}

        {/* Feedback */}
        {feedback.type && (
          <div className={`mb-4 p-4 rounded-lg ${
            feedback.type === 'correct' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <CheckCircle className={`h-5 w-5 ${feedback.type === 'correct' ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`font-medium ${feedback.type === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                {feedback.message}
              </span>
            </div>
            {feedback.type === 'correct' ? (
              <p className="mt-2 text-green-700">{currentStepData.explanation}</p>
            ) : (
              <div className="mt-2">
                <p className="text-red-700">{currentStepData.explanation}</p>
                {allow_retry && (
                  <button
                    onClick={handleRetry}
                    className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hint */}
        {show_hints && (
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

        {/* AI Guidance */}
        {show_ai_guidance && (
          <div className="mb-4">
            {!showAIGuidance ? (
              <button
                onClick={() => setShowAIGuidance(true)}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Robot className="h-4 w-4" />
                <span>Ask AI Teacher</span>
              </button>
            ) : (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Robot className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-800 mb-1">AI Teacher:</h4>
                    <p className="text-purple-700">{currentStepData.ai_guidance}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-center space-x-2">
          {data.steps.map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index < currentStep ? 'bg-green-500' :
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

export default InteractivePracticeUI;

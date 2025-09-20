import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addAIFeedbackMessage, pauseAutoAdvance } from '../../store/slices/studySlice';
import { getApiConfig } from '../../api';
import { fetchData } from '../../utils/apiUtils';

// Type definitions
interface Pattern {
  name: string;
  sequence: (number | string)[];
  rule: string;
  explanation: string;
  difficulty: number;
}

interface Patterns {
  [key: string]: Pattern;
}

interface Translation {
  tutorMode: string;
  practiceMode: string;
  learningProgress: string;
  currentSubtopic: string;
  understanding: string;
  mastery: string;
  level: string;
  pace: string;
  language: string;
  smartHints: string;
  hintsContent: string;
  numberPatternViz: string;
  rule: string;
  explanation: string;
  aiTutorChat: string;
  learningModeActive: string;
  practiceModeActive: string;
  typeMessage: string;
  send: string;
  intermediate: string;
  thoughtful: string;
  english: string;
}

interface Translations {
  [key: string]: Translation;
}

type Mode = 'teach' | 'practice';

interface NumberPatternsAppProps {
  externalPatterns?: Record<string, {
    name: string;
    sequence: (number | string)[];
    rule: string;
    explanation: string;
    difficulty: number;
  }> | null;
  mode?: string;
  currentPatternIndex?: number;
  setCurrentPatternIndex?: (index: number) => void;
  initialAutoAdvance?: boolean;
  sessionId?: string;
  toolId?: string;
}

const NumberPatternsApp: React.FC<NumberPatternsAppProps> = ({
  externalPatterns,
  mode,
  currentPatternIndex,
  setCurrentPatternIndex,
  initialAutoAdvance,
  sessionId,
  toolId
}) => {
  const dispatch = useDispatch();

  // Redux selectors
  const { autoAdvance } = useSelector((state: RootState) => state.study);

  // State Management
  const [currentMode, setCurrentMode] = useState<Mode>('teach');
  const [currentPattern, setCurrentPattern] = useState<string>('evenNumbers');

  // Local state for pattern index navigation
  const [localPatternIndex, setLocalPatternIndex] = useState<number>(0);

  // Practice mode state
  const [practiceInputs, setPracticeInputs] = useState<Record<string, (string | number)[]>>({});
  const [aiFeedback, setAiFeedback] = useState<Record<string, string>>({});
  const [isCheckingAnswer, setIsCheckingAnswer] = useState<Record<string, boolean>>({});
  const [debounceTimers, setDebounceTimers] = useState<Record<string, ReturnType<typeof setTimeout>>>({});

  // Auto-advance state - now controlled by Redux
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number>(5);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers).forEach(timer => clearTimeout(timer));
    };
  }, [debounceTimers]);

  // Set mode from props if provided
  useEffect(() => {
    if (mode) {
      if (mode === 'teach') {
        setCurrentMode('teach');
      } else if (mode === 'teach' || mode === 'practice') {
        setCurrentMode(mode as Mode);
      }
    }
  }, [mode]);

  // Sync local pattern index with external prop
  useEffect(() => {
    if (currentPatternIndex !== undefined && currentPatternIndex !== localPatternIndex) {
      setLocalPatternIndex(currentPatternIndex);
    }
  }, [currentPatternIndex, localPatternIndex]);

  // Use external pattern index if provided, otherwise use local
  const effectivePatternIndex = setCurrentPatternIndex ? (currentPatternIndex ?? 0) : localPatternIndex;

  // Auto-advance timer for teach mode - now using Redux autoAdvance state
  useEffect(() => {
    let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;
    let countdownTimer: ReturnType<typeof setInterval> | null = null;

    if (currentMode === 'teach' && canGoToNext() && autoAdvance) {
      // Reset countdown when pattern changes
      setAutoAdvanceCountdown(5);

      // Start countdown timer
      countdownTimer = setInterval(() => {
        setAutoAdvanceCountdown(prev => {
          if (prev <= 1) {
            return 5; // Reset for next pattern
          }
          return prev - 1;
        });
      }, 1000);

      // Auto-advance after 5 seconds
      autoAdvanceTimer = setTimeout(() => {
        handleNextPattern();
      }, 5000);
    }

    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    };
  }, [currentPattern, currentMode, autoAdvance]);

  // State for patterns from props
  const [dynamicPatterns, setDynamicPatterns] = useState<Patterns>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Handle practice mode initialization when mode changes
  useEffect(() => {
    if (currentMode === 'practice' && Object.keys(dynamicPatterns).length > 0) {
      setTimeout(() => initializePracticeInputs(), 100);
    }
  }, [currentMode, dynamicPatterns]);



  useEffect(() => {
    // If externalPatterns provided, use them directly
    if (externalPatterns && typeof externalPatterns === 'object' && Object.keys(externalPatterns).length > 0) {
      setDynamicPatterns(externalPatterns);
      const firstKey = Object.keys(externalPatterns)[0];
      if (firstKey) {
        setCurrentPattern(firstKey);
        // Set initial pattern index
        if (setCurrentPatternIndex) {
          setCurrentPatternIndex(0);
        } else {
          setLocalPatternIndex(0);
        }
      }
      setIsLoading(false);

      // If we're in practice mode, initialize practice inputs immediately
      if (currentMode === 'practice') {
        setTimeout(() => initializePracticeInputs(), 100);
      }
    } else {
      // Use fallback patterns and set loading to false
      setDynamicPatterns({});
      setCurrentPattern('arithmetic');
      setLocalPatternIndex(0);
      setIsLoading(false);
    }
  }, [externalPatterns]);


  // Use dynamic patterns if available, otherwise fallback to static patterns
  const patterns = dynamicPatterns;

  // Ensure loading is set to false if we have patterns (either dynamic or fallback)
  useEffect(() => {
    if (Object.keys(patterns).length > 0 && isLoading) {
      setIsLoading(false);
    }
  }, [patterns, isLoading]);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // Component mount effect
  useEffect(() => {
    // Force loading to false after mount if no external patterns
    if (!externalPatterns || Object.keys(externalPatterns).length === 0) {
      setIsLoading(false);
    }
  }, [initialAutoAdvance, externalPatterns, mode, currentPatternIndex, setCurrentPatternIndex]);

  // Translations
  const translations: Translations = {
    en: {
      tutorMode: "Tutor Mode",
      practiceMode: "Practice Mode",
      learningProgress: "Learning Progress",
      currentSubtopic: "Getting Started...",
      understanding: "Understanding:",
      mastery: "Mastery:",
      level: "Level:",
      pace: "Pace:",
      language: "Language:",
      smartHints: "Smart Hints",
      hintsContent: "You're doing well! Try to identify the rule that connects all numbers. Focus on arithmetic patterns and sequence relationships.",
      numberPatternViz: "Number Pattern Visualization",
      rule: "Rule:",
      explanation: "Explanation:",
      aiTutorChat: "AI Tutor Chat",
      learningModeActive: "Learning Mode Active",
      practiceModeActive: "Practice Mode Active",
      typeMessage: "Type your message here...",
      send: "Send",
      intermediate: "Intermediate",
      thoughtful: "Thoughtful",
      english: "English"
    }
  };

  // Updated pause/resume functions to use Redux
  const pauseAutoAdvanceLocal = (): void => {
    dispatch(pauseAutoAdvance());
  };

  const resumeAutoAdvanceLocal = (): void => {
  };

  const initializePracticeInputs = () => {
    if (Object.keys(patterns).length === 0) {
      return;
    }
    const inputs: Record<string, (string | number)[]> = {};
    Object.entries(patterns).forEach(([key, pattern]) => {
      inputs[key] = pattern.sequence.map(item => item === '_' ? '' : item);
    });
    setPracticeInputs(inputs);
  };

  const handlePracticeInputChange = (pattern: Pattern, patternKey: string, index: number, value: string) => {
    // Stop auto-advance when user starts typing in practice mode
    if (autoAdvance && currentMode === 'practice') {
      pauseAutoAdvanceLocal();
    }

    setPracticeInputs(prev => {
      const newInputs = { ...prev };
      if (!newInputs[patternKey]) {
        newInputs[patternKey] = pattern?.sequence?.map(item => item === '_' ? '' : item) || [];
      }

      const currentPatternInputs = [...(newInputs[patternKey] || [])];
      currentPatternInputs[index] = value === '' ? '' : parseInt(value) || value || '_';
      newInputs[patternKey] = currentPatternInputs;

      // Check answer with AI every time user makes a change (if they provide a value)
      if (value !== '' && value !== '_') {
        if (debounceTimers[patternKey]) {
          clearTimeout(debounceTimers[patternKey]);
        }

        const timer = setTimeout(() => {
          // Always try to use AI first, fallback to local if needed
          if (sessionId && toolId) {
            checkAnswerWithAPI(pattern, currentPatternInputs, patternKey, index);
          }
        }, 1000);

        setDebounceTimers(prev => ({ ...prev, [patternKey]: timer }));
      }

      return newInputs;
    });
  };

  const checkAnswerWithAPI = async (pattern: Pattern, userAnswer: (string | number)[], patternKey: string, index: number) => {
    if (!sessionId || !toolId) {
      // Fallback to local checking if no session/tool ID
      return;
    }

    setIsCheckingAnswer(prev => ({ ...prev, [patternKey]: true }));

    try {
      const questionText = `${pattern.name}: Find the missing numbers in sequence [${pattern.sequence.join(', ')}]. Rule: ${pattern.rule}. ${pattern.explanation}. Difficulty: ${pattern.difficulty}`;
      const answerText = `Student answered: [${userAnswer.join(', ')}] check the answer at index ${index}`;

      const payload = {
        toolId: toolId,
        sessionId: sessionId,
        question: questionText,
        answer: answerText
      };

      const apiConfig = getApiConfig('toolAnswerChecker');
      const response = await fetchData(apiConfig.url, apiConfig.method, payload, {
        credentials: 'include'
      });

      const result = response as any;

      if (result && result.success) {
        setAiFeedback(prev => ({
          ...prev,
          [patternKey]: result.data
        }));

        const feedbackMessage = {
          id: `feedback_${Date.now()}_${Math.random()}`,
          patternName: pattern.name,
          patternKey: patternKey,
          feedback: result.data,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          userAnswer: userAnswer,
          correctSequence: pattern.sequence
        };

        dispatch(addAIFeedbackMessage(feedbackMessage));
      }
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setIsCheckingAnswer(prev => ({ ...prev, [patternKey]: false }));
    }
  };

  const handlePatternSelect = (patternName: string): void => {
    setCurrentPattern(patternName);
    const patternKeys = Object.keys(patterns);
    const newIndex = patternKeys.indexOf(patternName);

    if (setCurrentPatternIndex) {
      setCurrentPatternIndex(newIndex);
    } else {
      setLocalPatternIndex(newIndex);
    }

    setAiFeedback(prev => {
      const newFeedback = { ...prev };
      delete newFeedback[currentPattern];
      return newFeedback;
    });

    if (currentMode === 'practice') {
      setTimeout(() => initializePracticeInputs(), 50);
    }
  };

  // Navigation helper functions
  const canGoToPrevious = (): boolean => {
    const patternKeys = Object.keys(patterns);
    const currentIndex = patternKeys.indexOf(currentPattern);
    return currentIndex > 0;
  };

  const canGoToNext = (): boolean => {
    const patternKeys = Object.keys(patterns);
    const currentIndex = patternKeys.indexOf(currentPattern);
    return currentIndex < patternKeys.length - 1;
  };

  const handlePreviousPattern = (): void => {
    if (canGoToPrevious()) {
      const newIndex = effectivePatternIndex - 1;

      if (setCurrentPatternIndex) {
        setCurrentPatternIndex(newIndex);
      } else {
        setLocalPatternIndex(newIndex);
      }

      const patternKeys = Object.keys(patterns);
      const currentIndex = patternKeys.indexOf(currentPattern);
      const previousPattern = patternKeys[currentIndex - 1];
      handlePatternSelect(previousPattern);
    }
  };

  const handleNextPattern = (): void => {
    if (canGoToNext()) {
      const newIndex = effectivePatternIndex + 1;

      if (setCurrentPatternIndex) {
        setCurrentPatternIndex(newIndex);
      } else {
        setLocalPatternIndex(newIndex);
      }

      const patternKeys = Object.keys(patterns);
      const currentIndex = patternKeys.indexOf(currentPattern);
      const nextPattern = patternKeys[currentIndex + 1];
      handlePatternSelect(nextPattern);
    }
  };

  // Get current translations
  const currentPatternData = patterns[currentPattern] || patterns.arithmetic;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 text-slate-800 font-['Inter'] leading-relaxed">
      <div className="flex max-lg:flex-col min-h-[fit-content] gap-px bg-slate-200">
        {/* Main Content Area */}
        <div className="flex-1 flex max-md:flex-col bg-white">
          {/* Visualization Panel */}
          <main className="flex-1 flex flex-col">
            <section className="flex-1 p-8 max-md:p-5 relative">
              <div className="text-center mb-8">
                {/* Pattern Controls */}
                {!isLoading && (
                  <div className="flex flex-col items-center gap-4 mb-8">
                    {/* Pattern Selection Buttons */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Object.entries(patterns).map(([key, pattern]) => (
                        <button
                          key={key}
                          className={`px-4 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all ${currentPattern === key
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white transform scale-105 shadow-lg'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:-translate-y-0.5 hover:shadow-md'
                            }`}
                          onClick={() => handlePatternSelect(key)}
                        >
                          {pattern.name.split(' ').slice(-2).join(' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Visualization Area */}
              <div className="flex-1 border-2 border-slate-200 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-8 min-h-96 relative overflow-hidden">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading patterns...</p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">Debug Info:</p>
                      <p className="text-xs text-blue-600">External Patterns: {externalPatterns ? 'Yes' : 'No'}</p>
                      <p className="text-xs text-blue-600">Patterns Count: {externalPatterns ? Object.keys(externalPatterns).length : 0}</p>
                      <p className="text-xs text-blue-600">Mode: {mode || 'None'}</p>
                      <p className="text-xs text-blue-600">Auto-advance: {autoAdvance ? 'ON' : 'OFF'}</p>
                      <button
                        onClick={() => {
                          setIsLoading(false);
                        }}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        Force Stop Loading
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Show fallback content if no patterns */}
                    {Object.keys(patterns).length === 0 ? (
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-700 mb-4">No Patterns Available</h3>
                        <p className="text-slate-600 mb-4">The NumberPatternsApp component is working but no patterns were loaded.</p>
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-700">Debug Info:</p>
                          <p className="text-xs text-yellow-600">External Patterns: {externalPatterns ? 'Yes' : 'No'}</p>
                          <p className="text-xs text-yellow-600">Dynamic Patterns: {Object.keys(dynamicPatterns).length}</p>
                          <p className="text-xs text-yellow-600">Current Pattern: {currentPattern}</p>
                          <p className="text-xs text-yellow-600">Auto-advance: {autoAdvance ? 'ON' : 'OFF'}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Number Sequence */}
                        <div className="flex gap-4 mb-8 flex-wrap justify-center">
                          {currentPatternData.sequence.slice(0, 8).map((num, index) => (
                            <div key={index} className="relative">
                              {currentMode === 'practice' && (num === '_' || num === '') ? (
                                <div className="relative">
                                  <input
                                    type="text"
                                    className={`w-16 h-16 max-md:w-12 max-md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl text-center text-lg max-md:text-base font-bold shadow-md border-2 border-white focus:border-blue-300 focus:outline-none transition-all ${isCheckingAnswer[currentPattern] ? 'ring-2 ring-blue-400 animate-pulse' : ''
                                      }`}
                                    placeholder="?"
                                    value={practiceInputs[currentPattern]?.[index] || ''}
                                    onChange={(e) => {
                                      handlePracticeInputChange(patterns[currentPattern], currentPattern, index, e.target.value)
                                    }}
                                    maxLength={3}
                                    disabled={isCheckingAnswer[currentPattern]}
                                  />
                                  {isCheckingAnswer[currentPattern] && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                                  )}
                                </div>
                              ) : (
                                <div
                                  className="w-16 h-16 max-md:w-12 max-md:h-12 bg-gradient-to-br from-blue-500 to-teal-500 text-white rounded-xl flex items-center justify-center text-lg max-md:text-base font-bold shadow-md transition-all cursor-pointer hover:-translate-y-1 hover:scale-105 hover:shadow-xl relative overflow-hidden"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full hover:translate-x-full transition-transform duration-500"></div>
                                  <span className="relative z-10">{num}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="flex flex-row items-center gap-4">
                      {/* AI Feedback Display */}
                      {currentMode === 'practice' && (
                        <div className="mb-6">
                          {isCheckingAnswer[currentPattern] ? (
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                  <div className="absolute inset-0 rounded-full border-2 border-blue-200"></div>
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-blue-700">🤖 AI is analyzing your answer...</span>
                                  <p className="text-xs text-blue-600 mt-1">This will take just a moment</p>
                                </div>
                              </div>
                            </div>
                          ) : aiFeedback[currentPattern] ? (
                            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm">
                              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                                <span className="text-lg">🤖</span>
                                AI Feedback
                              </h4>
                              <div className="text-sm text-green-700 leading-relaxed">
                                {aiFeedback[currentPattern]}
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200">
                              <div className="text-center text-sm text-slate-600">
                                <span className="text-lg">💡</span>
                                <p className="mt-1">Type your answer above to get AI feedback!</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Pattern Explanation */}
                      <div className="max-w-4/5 text-center bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                        <div className="text-lg font-bold text-slate-800 mb-3 tracking-tight">
                          {currentPatternData.name}
                        </div>
                        <div className="text-sm leading-relaxed text-slate-600">
                          <strong>{translations.en.rule}</strong> {currentPatternData.rule}<br />
                          <strong>{translations.en.explanation}</strong> {currentPatternData.explanation}
                        </div>

                        {/* Auto-advance indicator for teach mode */}
                        {currentMode === 'teach' && autoAdvance && canGoToNext() && (
                          <div className="mt-4 pt-3 border-t border-slate-200">
                            <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span>Auto-advancing in {autoAdvanceCountdown}s</span>
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            {!isLoading && (
              <div className="flex justify-between w-[90%] mx-auto">
                <button
                  onClick={() => handlePreviousPattern()}
                  disabled={!canGoToPrevious()}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${canGoToPrevious()
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:-translate-y-0.5 hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <span className="text-lg">←</span>
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
                    <span className="text-blue-600 font-bold">{Object.keys(patterns).indexOf(currentPattern) + 1}</span> of {Object.keys(patterns).length}
                  </span>
                  {/* Auto-advance Controls for Teach Mode */}
                  {currentMode === 'teach' && (
                    <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                      <button
                        onClick={autoAdvance ? pauseAutoAdvanceLocal : resumeAutoAdvanceLocal}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${autoAdvance
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                      >
                        {autoAdvance ? '⏸️ Pause' : '▶️ Resume'}
                      </button>
                      <span className="text-xs text-slate-600">
                        Auto-advance: {autoAdvance ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleNextPattern()}
                  disabled={!canGoToNext()}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${canGoToNext()
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:-translate-y-0.5 hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Next
                  <span className="text-lg">→</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

      .animate-slideIn {
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      @keyframes slideIn {
        from { 
          opacity: 0; 
          transform: translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }

      .animate-bounce {
        animation: bounce 1.4s infinite;
      }

      @keyframes bounce {
        0%, 60%, 100% { 
          opacity: 0.3; 
          transform: scale(0.8); 
        }
        30% { 
          opacity: 1; 
          transform: scale(1); 
        }
      }

      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
      }

      ::-webkit-scrollbar-track {
        background: #f1f5f9;
      }

      ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #64748b;
      }

      /* Responsive adjustments */
      @media (max-width: 1024px) {
        .max-lg\\:flex-col {
          flex-direction: column;
        }

        .max-lg\\:w-full {
          width: 100%;
        }

        .max-lg\\:max-h-48 {
          max-height: 12rem;
        }

        .max-lg\\:overflow-y-auto {
          overflow-y: auto;
        }
      }

      @media (max-width: 768px) {
        .max-md\\:flex-col {
          flex-direction: column;
        }

        .max-md\\:gap-3 {
          gap: 0.75rem;
        }

        .max-md\\:w-full {
          width: 100%;
        }

        .max-md\\:justify-between {
          justify-content: space-between;
        }

        .max-md\\:p-5 {
          padding: 1.25rem;
        }

        .max-md\\:w-12 {
          width: 3rem;
        }

        .max-md\\:h-12 {
          height: 3rem;
        }

        .max-md\\:text-base {
          font-size: 1rem;
        }

        .max-md\\:h-80 {
          height: 20rem;
        }
      }

      /* Utility classes */
      .max-w-4\\/5 {
        max-width: 85%;
      }

      .tracking-tight {
        letter-spacing: -0.025em;
      }

      .tracking-wide {
        letter-spacing: 0.025em;
      }

      .backdrop-blur {
        backdrop-filter: blur(10px);
      }

      .filter {
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      }

      .ring-3 {
        box-shadow: 0 0 0 3px var(--tw-ring-color);
      }

      .ring-blue-100 {
        --tw-ring-color: rgb(219 234 254 / 0.5);
      }
    `}</style>
    </div>
  );
};

export default NumberPatternsApp;
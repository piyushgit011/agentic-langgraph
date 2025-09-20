"use client";

import { useState, useEffect, useCallback } from "react";
// import { ProblemPractice } from "../ProblemPractice.tsx";

interface ProblemData {
  problem: string;
  answer: number | string;
  operation: string;
  steps: string[];
}

interface PracticeProblemsVisualizationProps {
  data: {
    operation: string;
    demonstrated_problem: string;
    difficulty_level: string;
    problems: ProblemData[];
    count: number;
    stage: string;
    message: string;
    instructions: string;
    auto_trigger?: boolean;
  };
  onProgress?: (currentProblem: number, totalProblems: number) => void;
  onComplete?: () => void;
  sendMessage?: (message: string) => void;
}

export function PracticeProblemsVisualization({
  data,
  onProgress,
  onComplete,
  sendMessage
}: PracticeProblemsVisualizationProps) {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [completedProblems, setCompletedProblems] = useState<boolean[]>(
    new Array(data.problems.length).fill(false)
  );
  const [showResults, setShowResults] = useState(false);
  const [practiceStarted, setPracticeStarted] = useState(false);

  // Auto-start practice if triggered automatically
  useEffect(() => {
    if (data.auto_trigger) {
      setPracticeStarted(true);
      // Send introductory message
      if (sendMessage) {
        sendMessage(data.message);
      }
    }
  }, [data.auto_trigger, data.message, sendMessage]);

  // Send progress updates
  useEffect(() => {
    if (onProgress) {
      const completed = completedProblems.filter(Boolean).length;
      onProgress(completed, data.problems.length);
    }
  }, [completedProblems, onProgress, data.problems.length]);

  const handleProblemSubmit = useCallback((answer: number) => {
    const currentProblem = data.problems[currentProblemIndex];
    const isCorrect = answer === currentProblem.answer;

    if (isCorrect) {
      // Mark current problem as completed
      const newCompleted = [...completedProblems];
      newCompleted[currentProblemIndex] = true;
      setCompletedProblems(newCompleted);

      // Send success message
      if (sendMessage) {
        sendMessage(`🎉 Excellent! You solved ${currentProblem.problem} = ${answer} correctly!`);
      }

      // Move to next problem or show results
      setTimeout(() => {
        if (currentProblemIndex < data.problems.length - 1) {
          setCurrentProblemIndex(currentProblemIndex + 1);
          if (sendMessage) {
            sendMessage(`🎯 Great job! Let's try the next problem.`);
          }
        } else {
          // All problems completed
          setShowResults(true);
          if (sendMessage) {
            sendMessage(`🏆 Outstanding! You've completed all practice problems! You're really getting the hang of ${data.operation}!`);
          }
          if (onComplete) {
            onComplete();
          }
        }
      }, 1500);
    } else {
      // Send encouragement message for incorrect answers
      if (sendMessage) {
        sendMessage(`💪 Not quite right, but don't give up! The answer to ${currentProblem.problem} is ${currentProblem.answer}. Let's try the next one!`);
      }
    }
  }, [currentProblemIndex, data.problems, completedProblems, sendMessage, onComplete, data.operation]);

  const startPractice = () => {
    setPracticeStarted(true);
    if (sendMessage) {
      sendMessage(data.message);
    }
  };

  const resetPractice = () => {
    setCurrentProblemIndex(0);
    setCompletedProblems(new Array(data.problems.length).fill(false));
    setShowResults(false);
    setPracticeStarted(true);
  };

  const currentProblem = data.problems[currentProblemIndex];
  const completedCount = completedProblems.filter(Boolean).length;

  if (!practiceStarted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🎯 Practice Time!
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            You just learned about <span className="font-semibold text-blue-600">{data.operation}</span>
          </p>
          <p className="text-gray-600 mb-6">
            Demonstrated problem: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{data.demonstrated_problem}</span>
          </p>
          <p className="text-gray-700 mb-8">
            {data.instructions}
          </p>
          <button
            onClick={startPractice}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
          >
            🚀 Start Practice ({data.count} Problems)
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const accuracy = Math.round((completedCount / data.problems.length) * 100);
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            🏆 Practice Complete!
          </h2>
          <div className="text-6xl mb-4">
            {accuracy >= 80 ? "🌟" : accuracy >= 60 ? "👍" : "💪"}
          </div>
          <p className="text-2xl font-semibold text-gray-700 mb-2">
            You completed {completedCount} out of {data.problems.length} problems!
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Accuracy: {accuracy}%
          </p>

          {accuracy >= 80 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">🎉 Excellent work!</p>
              <p className="text-green-700">You've mastered {data.operation}!</p>
            </div>
          )}

          {accuracy >= 60 && accuracy < 80 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-semibold">👍 Good job!</p>
              <p className="text-yellow-700">Keep practicing to master {data.operation}!</p>
            </div>
          )}

          {accuracy < 60 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-semibold">💪 Keep trying!</p>
              <p className="text-blue-700">Practice makes perfect with {data.operation}!</p>
            </div>
          )}

          <button
            onClick={resetPractice}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            🔄 Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto border">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            🎯 Practice Problems - {data.operation.charAt(0).toUpperCase() + data.operation.slice(1)}
          </h2>
          <div className="text-sm text-gray-600">
            Problem {currentProblemIndex + 1} of {data.problems.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentProblemIndex + 1) / data.problems.length) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 text-center">
          {completedCount} completed • {data.problems.length - completedCount} remaining
        </div>
      </div>

      {/* Current Problem */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Based on: {data.demonstrated_problem}
        </h3>
        <p className="text-gray-600">
          Now try solving similar problems using what you learned!
        </p>
      </div>

      {/* Problem Practice Component */}
      {/* {currentProblem && (
        <ProblemPractice
          problem={currentProblem.problem}
          operation={data.operation}
          onSubmit={handleProblemSubmit}
        />
      )} */}

      {/* Completed Problems Indicator */}
      {completedProblems.some(Boolean) && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-green-800 font-semibold mb-2">✅ Completed Problems:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {data.problems.map((problem, index) => (
              <div
                key={index}
                className={`text-sm p-2 rounded ${completedProblems[index]
                  ? 'bg-green-100 text-green-800'
                  : index === currentProblemIndex
                    ? 'bg-yellow-100 text-yellow-800 font-semibold'
                    : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {completedProblems[index] ? '✅' : index === currentProblemIndex ? '⏳' : '⭕'} {problem.problem}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

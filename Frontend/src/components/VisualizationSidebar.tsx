import React, { useState } from 'react';
import VisualizationRenderer from './visualizations/VisualizationRenderer';

interface VisualizationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  visualization?: any;
  position?: 'left' | 'right' | 'bottom';
  size?: 'small' | 'medium' | 'large';
  onStepUpdate?: (stepIndex: number, stepData: any) => void;
}

const VisualizationSidebar: React.FC<VisualizationSidebarProps> = ({
  isOpen,
  onClose,
  title = "Visualization",
  visualization,
  position = 'right',
  size = 'medium',
  onStepUpdate
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleStepChange = (stepIndex: number, stepData: any) => {
    if (onStepUpdate) {
      onStepUpdate(stepIndex, stepData);
    }
  };

  // Size configurations
  const sizeClasses = {
    small: {
      right: 'w-80',
      left: 'w-80',
      bottom: 'h-64'
    },
    medium: {
      right: 'w-96',
      left: 'w-96',
      bottom: 'h-80'
    },
    large: {
      right: 'w-1/2',
      left: 'w-1/2',
      bottom: 'h-96'
    }
  };

  // Position classes
  const positionClasses = {
    right: `fixed right-0 top-0 h-full ${sizeClasses[size].right} transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
      }`,
    left: `fixed left-0 top-0 h-full ${sizeClasses[size].left} transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
      }`,
    bottom: `fixed bottom-0 left-0 right-0 ${sizeClasses[size].bottom} transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'
      }`
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`${positionClasses[position]} bg-white shadow-xl z-50 border-l border-gray-200`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-200 rounded-md transition-colors"
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-md transition-colors"
              title="Close"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex-1 overflow-auto p-4">
            {visualization ? (
              <div className="h-full">
                <VisualizationRenderer
                  visualizationData={visualization}
                  onStepChange={handleStepChange}
                />

                {/* Additional metadata */}
                {visualization.description && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{visualization.description}</p>
                  </div>
                )}

                {/* Interactive elements */}
                {visualization.interaction?.requires_feedback && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-2">
                      This visualization is interactive! Try exploring the concepts and ask questions.
                    </p>
                    <button className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors">
                      I understand this concept
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2">No visualization yet</p>
                  <p className="text-sm">Ask the teacher to create a visualization to see it here!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default VisualizationSidebar;

import React from 'react';
import MathFunctionChart from './MathFunctionChart';
import RadarChart from './RadarChart';
import BarChart from './BarChart';
import GeometryVisualization from './GeometryVisualization';
import NumberLineVisualization from './NumberLineVisualization';
import AlgebraicSimplificationVisualization from './AlgebraicSimplificationVisualization';
import InteractivePracticeVisualization from './InteractivePracticeVisualization';
import InteractivePracticeUI from './InteractivePracticeUI';
import VennDiagramVisualization from './VennDiagramVisualization';
import ProbabilityTreeVisualization from './ProbabilityTreeVisualization';
import FractionVisualization from './FractionVisualization';
import { PracticeProblemsVisualization } from './PracticeProblemsVisualization';
import { InteractivePracticeSessionVisualization } from './InteractivePracticeSessionVisualization';

interface VisualizationData {
  visualization_type: string;
  title: string;
  data: any;
  ui_config: any;
  description?: string;
  formula?: string;
  shape_type?: string;
  timestamp: string;
}

interface VisualizationRendererProps {
  visualizationData: VisualizationData;
  onStepChange?: (stepIndex: number, stepData: any) => void;
  onPracticeTrigger?: (practiceConfig: any) => void;
  currentStep?: number;
}

const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({
  visualizationData,
  onStepChange,
  onPracticeTrigger,
  currentStep
}) => {
  const { visualization_type, data, title, ui_config, description, formula, shape_type } = visualizationData;

  const renderVisualization = () => {
    switch (visualization_type) {
      case 'math_function':
        return (
          <MathFunctionChart
            data={data}
            title={title}
            formula={formula || ''}
            ui_config={ui_config}
          />
        );

      case 'radar_chart':
        return (
          <RadarChart
            data={data}
            title={title}
            ui_config={ui_config}
          />
        );

      case 'bar_chart':
        return (
          <BarChart
            data={data}
            title={title}
            ui_config={ui_config}
          />
        );

      case 'geometry':
        return (
          <GeometryVisualization
            shape_type={shape_type || 'circle'}
            data={data}
            title={title}
            ui_config={ui_config}
          />
        );

      case 'number_line':
        return (
          <NumberLineVisualization
            data={data}
            title={title}
            ui_config={ui_config}
            onStepChange={onStepChange}
            onPracticeTrigger={onPracticeTrigger}
            currentStep={currentStep}
          />
        );

      case 'algebraic_simplification':
        return (
          <AlgebraicSimplificationVisualization
            data={data}
            title={title}
            ui_config={ui_config}
            onStepChange={onStepChange}
            onPracticeTrigger={onPracticeTrigger}
            currentStep={currentStep}
          />
        );

      case 'interactive_practice':
        return (
          <InteractivePracticeVisualization
            key={`practice_${data.title}_${data.expression}_${data.steps?.length || 0}`}
            data={data}
            ui_config={{ ...ui_config, interactive: true, showHints: true }}
            onStepChange={onStepChange}
          />
        );

      case 'interactive_practice_ui':
        return (
          <InteractivePracticeUI
            data={data}
            ui_config={{ ...ui_config, interactive: true, show_hints: true, show_ai_guidance: true }}
            onStepChange={onStepChange}
          />
        );

      case 'line_chart':
        // Convert line chart data to math function format for reuse
        const lineData = {
          x: data.x || data.points?.map((p: any) => p.x) || [],
          y: data.y || data.points?.map((p: any) => p.y) || [],
          label: title
        };
        return (
          <MathFunctionChart
            data={lineData}
            title={title}
            formula=""
            ui_config={{
              grid: true,
              axes_labels: { x: ui_config.x_label || 'X', y: ui_config.y_label || 'Y' },
              color: ui_config.color || '#10b981',
              stroke_width: ui_config.stroke_width || 2
            }}
          />
        );

      case 'concept_map':
        return <ConceptMap data={data} title={title} ui_config={ui_config} />;

      case 'molecule_3d':
        return <Molecule3D data={data} title={title} ui_config={ui_config} />;

      case 'number_line_operation':
        return (
          <NumberLineVisualization
            data={data}
            title={title}
            ui_config={ui_config}
            onStepChange={onStepChange}
            onPracticeTrigger={onPracticeTrigger}
            currentStep={currentStep}
          />
        );

      case 'venn_diagram':
        return (
          <VennDiagramVisualization
            data={data}
            ui_config={ui_config}
            onStepChange={onStepChange}
            currentStep={currentStep}
          />
        );

      case 'probability_tree':
        return (
          <ProbabilityTreeVisualization
            data={data}
            ui_config={ui_config}
          />
        );

      case 'fraction_visualization':
        return (
          <FractionVisualization
            data={data}
            ui_config={ui_config}
          />
        );

      case 'practice_problems':
      case 'auto_practice_problems':
      case 'provide_practice_problems':
        return (
          <PracticeProblemsVisualization
            data={data}
            onProgress={(current, total) => {
              console.log(`Practice progress: ${current}/${total}`);
            }}
            onComplete={() => {
              console.log('Practice session completed');
            }}
            sendMessage={(message) => {
              // This will be handled by parent component
              if (onStepChange) {
                onStepChange(-1, { chat_message: message });
              }
            }}
          />
        );

      case 'interactive_practice_session':
        return (
          <InteractivePracticeSessionVisualization
            key={`session_${data.operation}_${data.num1}_${data.num2}_${title?.replace(/\s+/g, '_') || 'default'}`}
            data={data}
            title={title}
            ui_config={ui_config}
            onStepChange={onStepChange}
            onHumanFeedback={(feedback) => {
              console.log('Human feedback requested:', feedback);
              // This would trigger human-in-the-loop feedback
              if (onStepChange) {
                onStepChange(-1, {
                  type: 'human_feedback_request',
                  feedback_data: feedback
                });
              }
            }}
            sendMessage={(message) => {
              if (onStepChange) {
                onStepChange(-1, { chat_message: message });
              }
            }}
          />
        );

      case 'error':
        return (
          <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Visualization Error</h3>
            <p className="text-red-600">{data.message || 'Unknown error occurred'}</p>
          </div>
        );

      default:
        return (
          <div className="w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Unsupported Visualization</h3>
            <p className="text-yellow-600">Visualization type "{visualization_type}" is not yet supported.</p>
            {description && <p className="text-sm text-yellow-600 mt-2">{description}</p>}
          </div>
        );
    }
  };

  return (
    <div className="mb-6">
      {renderVisualization()}
      {description && (
        <div className="mt-2 text-sm text-gray-600 text-center italic">
          {description}
        </div>
      )}
    </div>
  );
};

// Placeholder components for concept map and 3D molecule
const ConceptMap: React.FC<{ data: any; title: string; ui_config: any }> = ({ data, title }) => (
  <div className="w-full p-4 bg-white rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="flex flex-wrap gap-2 justify-center">
      {data.nodes?.map((node: any, index: number) => (
        <div
          key={index}
          className="px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg text-sm"
        >
          {node.label}
        </div>
      ))}
    </div>
    <p className="text-sm text-gray-600 mt-4 text-center">
      Interactive concept map (3D view coming soon)
    </p>
  </div>
);

const Molecule3D: React.FC<{ data: any; title: string; ui_config: any }> = ({ data, title }) => (
  <div className="w-full p-4 bg-white rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-4xl mb-2">⚛️</div>
        <p className="text-lg font-semibold">{data.atoms?.length || 0} atoms</p>
        <p className="text-sm text-gray-600">3D molecular viewer coming soon</p>
      </div>
    </div>
  </div>
);

export default VisualizationRenderer;

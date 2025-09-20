'use client';

import React, { useState, useEffect } from 'react';

interface TreeNode {
  id: string;
  label: string;
  level: number;
  probability: number;
  cumulative_probability: number;
  position: { x: number; y: number };
  path?: string[];
  outcome_data?: any;
}

interface TreeEdge {
  from: string;
  to: string;
  probability: number;
  label: string;
}

interface ProbabilityTreeProps {
  data: {
    experiment_name: string;
    nodes: TreeNode[];
    edges: TreeEdge[];
    stages: any[];
    final_outcomes: TreeNode[];
    total_outcomes: number;
    probability_sum: number;
  };
  ui_config?: {
    interactive?: boolean;
    show_probabilities?: boolean;
    highlight_paths?: boolean;
    node_size?: number;
    level_spacing?: number;
    node_spacing?: number;
    colors?: {
      node: string;
      edge: string;
      highlight: string;
      text: string;
    };
  };
}

const ProbabilityTreeVisualization: React.FC<ProbabilityTreeProps> = ({ 
  data, 
  ui_config = {} 
}) => {
  const [highlightedPath, setHighlightedPath] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<TreeNode | null>(null);
  
  const {
    interactive = true,
    show_probabilities = true,
    highlight_paths = true,
    node_size = 45,
    level_spacing = 150,
    node_spacing = 80,
    colors = {
      node: '#3b82f6',
      edge: '#6b7280',
      highlight: '#ef4444',
      text: '#1f2937'
    }
  } = ui_config;

  const svgWidth = 800;
  const svgHeight = 500;

  const formatProbability = (prob: number) => {
    return prob.toFixed(3);
  };

  const formatPercentage = (prob: number) => {
    return (prob * 100).toFixed(1) + '%';
  };

  const handleNodeClick = (node: TreeNode) => {
    if (!interactive) return;
    
    if (node.level === data.stages.length) {
      // Final outcome node
      setSelectedOutcome(selectedOutcome?.id === node.id ? null : node);
      setHighlightedPath(highlightedPath === node.id ? null : node.id);
    } else {
      setHighlightedPath(null);
      setSelectedOutcome(null);
    }
  };

  const getPathToNode = (nodeId: string): string[] => {
    const edgePath = [];
    let currentId = nodeId;
    
    while (currentId !== 'root') {
      const edge = data.edges.find(e => e.to === currentId);
      if (!edge) break;
      edgePath.unshift(edge.from + '->' + edge.to);
      currentId = edge.from;
    }
    
    return edgePath;
  };

  const isEdgeHighlighted = (edge: TreeEdge): boolean => {
    if (!highlightedPath) return false;
    const pathEdges = getPathToNode(highlightedPath);
    return pathEdges.includes(edge.from + '->' + edge.to);
  };

  const isNodeHighlighted = (node: TreeNode): boolean => {
    if (!highlightedPath) return false;
    if (node.id === highlightedPath) return true;
    const pathEdges = getPathToNode(highlightedPath);
    return pathEdges.some(edge => edge.startsWith(node.id + '->') || edge.endsWith('->' + node.id));
  };

  const calculateBranchProbabilities = (stage: number) => {
    const stageNodes = data.nodes.filter(n => n.level === stage);
    return stageNodes.map(node => ({
      ...node,
      branchTotal: data.nodes
        .filter(n => n.level === stage + 1 && data.edges.some(e => e.from === node.id && e.to === n.id))
        .reduce((sum, child) => sum + child.probability, 0)
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Probability Tree: {data.experiment_name}
        </h3>
        <div className="text-gray-600">
          Exploring sequential events and their combined probabilities
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Tree Diagram SVG */}
        <div className="flex-1">
          <svg width={svgWidth} height={svgHeight} className="w-full border rounded-lg bg-gray-50">
            {/* Edges */}
            <g>
              {data.edges.map((edge, index) => {
                const fromNode = data.nodes.find(n => n.id === edge.from);
                const toNode = data.nodes.find(n => n.id === edge.to);
                
                if (!fromNode || !toNode) return null;
                
                const isHighlighted = isEdgeHighlighted(edge);
                
                return (
                  <g key={index}>
                    {/* Edge line */}
                    <line
                      x1={fromNode.position.x}
                      y1={fromNode.position.y}
                      x2={toNode.position.x}
                      y2={toNode.position.y}
                      stroke={isHighlighted ? colors.highlight : colors.edge}
                      strokeWidth={isHighlighted ? 3 : 2}
                      className="transition-all duration-300"
                    />
                    
                    {/* Probability label */}
                    {show_probabilities && (
                      <text
                        x={(fromNode.position.x + toNode.position.x) / 2}
                        y={(fromNode.position.y + toNode.position.y) / 2 - 10}
                        textAnchor="middle"
                        className={`text-xs font-medium ${isHighlighted ? 'fill-red-600' : 'fill-gray-600'}`}
                      >
                        {formatProbability(edge.probability)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {data.nodes.map((node, index) => {
                const isHighlighted = isNodeHighlighted(node);
                const isFinalOutcome = node.level === data.stages.length;
                const isSelected = selectedOutcome?.id === node.id;
                
                return (
                  <g 
                    key={index}
                    className={interactive ? 'cursor-pointer' : ''}
                    onClick={() => handleNodeClick(node)}
                  >
                    {/* Node circle */}
                    <circle
                      cx={node.position.x}
                      cy={node.position.y}
                      r={node_size / 2}
                      fill={isSelected ? colors.highlight : (isHighlighted ? colors.highlight : (isFinalOutcome ? '#10b981' : colors.node))}
                      stroke={isHighlighted || isSelected ? colors.highlight : '#ffffff'}
                      strokeWidth="2"
                      opacity={isHighlighted || isSelected ? 0.9 : 0.8}
                      className="transition-all duration-300 hover:opacity-100"
                    />
                    
                    {/* Node label */}
                    <text
                      x={node.position.x}
                      y={node.position.y + 3}
                      textAnchor="middle"
                      className={`text-xs font-medium ${isHighlighted || isSelected ? 'fill-white' : 'fill-white'}`}
                    >
                      {node.label}
                    </text>
                    
                    {/* Cumulative probability for final outcomes */}
                    {isFinalOutcome && show_probabilities && (
                      <text
                        x={node.position.x}
                        y={node.position.y + node_size / 2 + 15}
                        textAnchor="middle"
                        className={`text-xs font-bold ${isHighlighted || isSelected ? 'fill-red-600' : 'fill-green-600'}`}
                      >
                        {formatPercentage(node.cumulative_probability)}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Stage labels */}
            <g>
              {data.stages.map((stage, index) => (
                <text
                  key={index}
                  x={100 + index * level_spacing}
                  y={30}
                  textAnchor="middle"
                  className="text-sm font-bold fill-gray-700"
                >
                  {stage.name}
                </text>
              ))}
            </g>
          </svg>
        </div>

        {/* Information Panel */}
        <div className="w-full xl:w-80 space-y-4">
          {/* Experiment Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 mb-3">Experiment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Stages:</span>
                <span className="font-medium">{data.stages.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Final outcomes:</span>
                <span className="font-medium">{data.total_outcomes}</span>
              </div>
              <div className="flex justify-between">
                <span>Probability sum:</span>
                <span className="font-medium">{formatProbability(data.probability_sum)}</span>
              </div>
            </div>
          </div>

          {/* Selected Outcome Details */}
          {selectedOutcome && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-green-800 mb-3">Selected Outcome</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-medium text-green-700">Path:</div>
                  <div className="text-gray-600">
                    {selectedOutcome.path ? selectedOutcome.path.join(' → ') : selectedOutcome.label}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-green-700">Probability:</div>
                  <div className="text-gray-600">
                    {formatProbability(selectedOutcome.cumulative_probability)} ({formatPercentage(selectedOutcome.cumulative_probability)})
                  </div>
                </div>
                {selectedOutcome.path && (
                  <div>
                    <div className="font-medium text-green-700">Calculation:</div>
                    <div className="text-gray-600 font-mono text-xs">
                      {data.edges
                        .filter(edge => getPathToNode(selectedOutcome.id).includes(edge.from + '->' + edge.to))
                        .map(edge => formatProbability(edge.probability))
                        .join(' × ')
                      } = {formatProbability(selectedOutcome.cumulative_probability)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Final Outcomes */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-3">All Final Outcomes</h4>
            <div className="space-y-2 text-sm max-h-60 overflow-y-auto">
              {data.final_outcomes.map((outcome, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedOutcome?.id === outcome.id 
                      ? 'bg-green-200 border-green-400 border' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => handleNodeClick(outcome)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {outcome.path ? outcome.path.join(' → ') : outcome.label}
                    </span>
                    <span className="text-green-600 font-bold">
                      {formatPercentage(outcome.cumulative_probability)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Tips */}
          {interactive && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-bold text-yellow-800 mb-2">💡 Interactive Tips</h4>
              <div className="text-sm text-yellow-700">
                Click on the final outcome nodes (green circles) to highlight the path and see detailed probability calculations!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stage Breakdown */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-bold text-gray-800 mb-3">Stage Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.stages.map((stage, index) => (
            <div key={index} className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700 mb-2">{stage.name}</div>
              <div className="space-y-1 text-sm">
                {stage.outcomes.map((outcome: any, outcomeIndex: number) => (
                  <div key={outcomeIndex} className="flex justify-between">
                    <span>{outcome.name}:</span>
                    <span className="font-medium">{formatPercentage(outcome.probability)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProbabilityTreeVisualization;

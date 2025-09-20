/**
 * Visualization Tool Factory
 * 
 * This factory provides standardized creation and management of visualization tools.
 */

import React from 'react';
import {
  BaseToolData,
  NumberLineData,
  GeometryData,
  AlgebraData,
  FractionData,
  GraphData,
  ToolType,
  ToolRegistry,
  UIConfig,
  ColorScheme
} from '@/types/visualization-tools';

// Import visualization components
import { InteractiveNumberLine } from '../InteractiveNumberLine';
import NumberLineVisualizationExample from './examples/NumberLineVisualizationExample';
// Import other visualization components as they are created

// Default configurations for different tool types
const DEFAULT_CONFIGS: Record<ToolType, Partial<BaseToolData>> = {
  number_line: {
    tool_type: "number_line",
    difficulty_level: "easy",
    interaction_config: {
      interactive: true,
      student_controlled: true,
      guided_mode: true,
      human_in_loop: false,
      validate_each_step: true
    },
    ui_config: {
      show_hint_button: true,
      show_reset_button: true,
      show_progress_bar: true,
      click_to_interact: true
    }
  },
  geometry: {
    tool_type: "geometry",
    difficulty_level: "medium",
    interaction_config: {
      interactive: true,
      student_controlled: true,
      guided_mode: false,
      human_in_loop: true,
      validate_each_step: false
    },
    ui_config: {
      show_grid: true,
      show_coordinates: true,
      drag_to_interact: true
    }
  },
  algebra: {
    tool_type: "algebra",
    difficulty_level: "medium",
    interaction_config: {
      interactive: true,
      student_controlled: true,
      guided_mode: true,
      human_in_loop: false,
      validate_each_step: true
    },
    ui_config: {
      enable_reasoning_input: true,
      show_progress_bar: true
    }
  },
  fraction_bars: {
    tool_type: "fraction_bars",
    difficulty_level: "easy",
    interaction_config: {
      interactive: true,
      student_controlled: true,
      guided_mode: true,
      human_in_loop: false,
      validate_each_step: true
    }
  },
  graph: {
    tool_type: "graph",
    difficulty_level: "medium",
    interaction_config: {
      interactive: true,
      student_controlled: false,
      guided_mode: false,
      human_in_loop: false,
      validate_each_step: false
    }
  },
  coordinate_plane: {
    tool_type: "coordinate_plane",
    difficulty_level: "medium",
    interaction_config: {
      interactive: true,
      student_controlled: true,
      guided_mode: true,
      human_in_loop: false,
      validate_each_step: true
    }
  },
  measurement: {
    tool_type: "measurement",
    difficulty_level: "easy",
    interaction_config: {
      interactive: true,
      student_controlled: true,
      guided_mode: true,
      human_in_loop: false,
      validate_each_step: true
    }
  },
  probability: {
    tool_type: "probability",
    difficulty_level: "hard",
    interaction_config: {
      interactive: true,
      student_controlled: true,
      guided_mode: false,
      human_in_loop: true,
      validate_each_step: false
    }
  },
  statistics: {
    tool_type: "statistics",
    difficulty_level: "medium",
    interaction_config: {
      interactive: true,
      student_controlled: false,
      guided_mode: false,
      human_in_loop: false,
      validate_each_step: false
    }
  }
};

// Tool registry mapping tool types to their components
const TOOL_REGISTRY: ToolRegistry = {
  number_line: {
    component: InteractiveNumberLine,
    validator: validateNumberLineData,
    defaultConfig: DEFAULT_CONFIGS.number_line,
    description: "Interactive number line for arithmetic operations",
    category: "arithmetic"
  },
  number_line_example: {
    component: NumberLineVisualizationExample,
    validator: validateNumberLineData,
    defaultConfig: DEFAULT_CONFIGS.number_line,
    description: "Example number line implementation",
    category: "examples"
  }
  // Add other tools as they are implemented
};

// Validation functions for different tool types
function validateNumberLineData(data: any): boolean {
  try {
    const numberLineData = data as NumberLineData;
    return (
      numberLineData.tool_type === "number_line" &&
      typeof numberLineData.core_data.start_position === "number" &&
      typeof numberLineData.core_data.target_position === "number" &&
      numberLineData.range &&
      typeof numberLineData.range.start === "number" &&
      typeof numberLineData.range.end === "number"
    );
  } catch {
    return false;
  }
}

function validateGeometryData(data: any): boolean {
  try {
    const geometryData = data as GeometryData;
    return (
      geometryData.tool_type === "geometry" &&
      Array.isArray(geometryData.core_data.shapes) &&
      geometryData.dimensions &&
      typeof geometryData.dimensions.width === "number" &&
      typeof geometryData.dimensions.height === "number"
    );
  } catch {
    return false;
  }
}

function validateAlgebraData(data: any): boolean {
  try {
    const algebraData = data as AlgebraData;
    return (
      algebraData.tool_type === "algebra" &&
      typeof algebraData.core_data.expression === "string" &&
      Array.isArray(algebraData.core_data.variables)
    );
  } catch {
    return false;
  }
}

/**
 * Visualization Tool Factory Class
 */
export class VisualizationToolFactory {
  
  /**
   * Create a new visualization tool with the standardized format
   */
  static createTool(type: ToolType, config: Partial<BaseToolData>): BaseToolData {
    const defaultConfig = DEFAULT_CONFIGS[type] || {};
    const toolId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      tool_id: toolId,
      session_id: config.session_id || `session_${Date.now()}`,
      tool_type: type,
      problem: config.problem || `Solve this ${type} problem`,
      problem_type: config.problem_type || type,
      difficulty_level: config.difficulty_level || "medium",
      core_data: config.core_data || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...defaultConfig,
      ...config
    } as BaseToolData;
  }
  
  /**
   * Create a number line tool
   */
  static createNumberLine(config: {
    problem: string;
    start_position: number;
    target_position: number;
    operation: "addition" | "subtraction" | "multiplication" | "division";
    operand: number;
    range?: { start: number; end: number };
    guided_mode?: boolean;
    session_id?: string;
  }): NumberLineData {
    
    const range = config.range || {
      start: Math.min(config.start_position, config.target_position) - 3,
      end: Math.max(config.start_position, config.target_position) + 3
    };
    
    return this.createTool("number_line", {
      problem: config.problem,
      problem_type: "arithmetic",
      session_id: config.session_id,
      core_data: {
        start_position: config.start_position,
        target_position: config.target_position,
        operation: config.operation,
        operand: config.operand,
        number_set: "integers"
      },
      range,
      interaction_config: {
        interactive: true,
        student_controlled: true,
        guided_mode: config.guided_mode ?? true,
        human_in_loop: false,
        validate_each_step: true
      },
      expected_steps: this.generateNumberLineSteps(
        config.start_position,
        config.target_position,
        config.operation,
        config.operand
      )
    }) as NumberLineData;
  }
  
  /**
   * Create a geometry tool
   */
  static createGeometry(config: {
    problem: string;
    shapes: any[];
    target_measurement?: number;
    dimensions: { width: number; height: number };
    session_id?: string;
  }): GeometryData {
    
    return this.createTool("geometry", {
      problem: config.problem,
      problem_type: "geometry",
      session_id: config.session_id,
      core_data: {
        shapes: config.shapes,
        constraints: [],
        target_measurement: config.target_measurement,
        coordinate_system: "cartesian",
        units: "units"
      },
      dimensions: config.dimensions,
      viewport: {
        center: { x: config.dimensions.width / 2, y: config.dimensions.height / 2 },
        zoom: 1
      }
    }) as GeometryData;
  }
  
  /**
   * Create an algebra tool
   */
  static createAlgebra(config: {
    problem: string;
    expression: string;
    variables: any[];
    target_form: string;
    session_id?: string;
  }): AlgebraData {
    
    return this.createTool("algebra", {
      problem: config.problem,
      problem_type: "algebra",
      session_id: config.session_id,
      core_data: {
        expression: config.expression,
        variables: config.variables,
        target_form: config.target_form,
        transformation_steps: [],
        equation_type: "linear"
      }
    }) as AlgebraData;
  }
  
  /**
   * Validate tool data
   */
  static validateTool(data: BaseToolData): boolean {
    const toolInfo = TOOL_REGISTRY[data.tool_type];
    if (!toolInfo) {
      console.error(`Unknown tool type: ${data.tool_type}`);
      return false;
    }
    
    return toolInfo.validator(data);
  }
  
  /**
   * Register a new tool type
   */
  static registerTool(type: string, definition: {
    component: React.ComponentType<any>;
    validator: (data: any) => boolean;
    defaultConfig: Partial<BaseToolData>;
    description: string;
    category: string;
  }) {
    TOOL_REGISTRY[type] = definition;
  }
  
  /**
   * Get tool component for rendering
   */
  static getToolComponent(toolType: string): React.ComponentType<any> | null {
    const toolInfo = TOOL_REGISTRY[toolType];
    return toolInfo ? toolInfo.component : null;
  }
  
  /**
   * Get all available tool types
   */
  static getAvailableTools(): string[] {
    return Object.keys(TOOL_REGISTRY);
  }
  
  /**
   * Get tool info
   */
  static getToolInfo(toolType: string) {
    return TOOL_REGISTRY[toolType] || null;
  }
  
  /**
   * Generate expected steps for number line problems
   */
  private static generateNumberLineSteps(
    start: number,
    target: number,
    operation: string,
    operand: number
  ) {
    const steps = [];
    
    steps.push({
      step: 1,
      action: "move_to_start",
      description: `Start at position ${start}`,
      validation_data: { position: start }
    });
    
    if (operation === "addition") {
      steps.push({
        step: 2,
        action: "move_right",
        description: `Move right ${operand} units to position ${target}`,
        validation_data: { position: target, direction: "right", units: operand }
      });
    } else if (operation === "subtraction") {
      steps.push({
        step: 2,
        action: "move_left", 
        description: `Move left ${operand} units to position ${target}`,
        validation_data: { position: target, direction: "left", units: operand }
      });
    }
    
    return steps;
  }
}

/**
 * React Hook for using the tool factory
 */
export function useVisualizationToolFactory() {
  const createTool = (type: ToolType, config: Partial<BaseToolData>) => {
    return VisualizationToolFactory.createTool(type, config);
  };
  
  const validateTool = (data: BaseToolData) => {
    return VisualizationToolFactory.validateTool(data);
  };
  
  const getToolComponent = (toolType: string) => {
    return VisualizationToolFactory.getToolComponent(toolType);
  };
  
  const renderTool = (data: BaseToolData, props: any = {}) => {
    const ToolComponent = VisualizationToolFactory.getToolComponent(data.tool_type);
    
    if (!ToolComponent) {
      console.error(`No component found for tool type: ${data.tool_type}`);
      return <div>Error: Unknown tool type</div>;
    }
    
    return <ToolComponent data={data} {...props} />;
  };
  
  return {
    createTool,
    validateTool,
    getToolComponent,
    renderTool,
    availableTools: VisualizationToolFactory.getAvailableTools(),
    factory: VisualizationToolFactory
  };
}

export default VisualizationToolFactory;

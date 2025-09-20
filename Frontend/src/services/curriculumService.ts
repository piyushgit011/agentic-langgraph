import { fetchData } from '../utils/apiUtils';

// Types for curriculum data structure
export interface Topic {
  topic_number: string;
  topic_title: string;
  file_name: string;
  file_path: string;
  content: {
    full_text: string;
    paragraphs: string[];
    tables: any[];
    word_count: number;
    paragraph_count: number;
  };
  unit_number: number;
  unit_title: string;
  extracted_at: string;
}

export interface Unit {
  unit_number: number;
  unit_title: string;
  unit_directory: string;
  topics: Topic[];
}

export interface CurriculumData {
  units: Unit[];
}

class CurriculumService {
  private baseURL = 'http://localhost:8000';

  /**
   * Fetch all curriculum data from the backend
   */
  async getAllCurriculum(): Promise<Unit[]> {
    try {
      const response = await fetchData<Unit[]>(`${this.baseURL}/api/v1/curriculum`);
      return response.data;
    } catch (error) {
      console.error('Error fetching curriculum data:', error);
      throw new Error('Failed to load curriculum data');
    }
  }

  /**
   * Fetch specific unit by unit number
   */
  async getUnit(unitNumber: number): Promise<Unit> {
    try {
      const response = await fetchData<Unit>(`${this.baseURL}/api/v1/curriculum/unit/${unitNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching unit ${unitNumber}:`, error);
      throw new Error(`Failed to load unit ${unitNumber}`);
    }
  }

  /**
   * Fetch specific topic by topic number
   */
  async getTopic(topicNumber: string): Promise<Topic> {
    try {
      const response = await fetchData<Topic>(`${this.baseURL}/api/v1/curriculum/topic/${topicNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching topic ${topicNumber}:`, error);
      throw new Error(`Failed to load topic ${topicNumber}`);
    }
  }

  /**
   * Get topics for a specific unit
   */
  async getTopicsForUnit(unitNumber: number): Promise<Topic[]> {
    try {
      const unit = await this.getUnit(unitNumber);
      return unit.topics;
    } catch (error) {
      console.error(`Error fetching topics for unit ${unitNumber}:`, error);
      throw new Error(`Failed to load topics for unit ${unitNumber}`);
    }
  }

  /**
   * Get all available units (summary)
   */
  async getUnitsOverview(): Promise<Array<{unit_number: number, unit_title: string, topic_count: number}>> {
    try {
      const response = await fetchData<Array<{unit_number: number, unit_title: string, topic_count: number}>>(`${this.baseURL}/api/v1/curriculum/overview`);
      return response.data;
    } catch (error) {
      console.error('Error fetching curriculum overview:', error);
      throw new Error('Failed to load curriculum overview');
    }
  }

  /**
   * Check if a topic has interactive tools available
   */
  hasInteractiveTools(topicNumber: string): boolean {
    // Define which topics have interactive tools
    const topicsWithTools: Record<string, string[]> = {
      '1.1': ['number_line', 'pattern_finder'],
      '1.2': ['sequence_builder', 'pattern_analyzer'],
      '1.3': ['visualization_tools', 'shape_builder'],
      // Add more topics and their tools as needed
    };

    return topicsWithTools.hasOwnProperty(topicNumber);
  }

  /**
   * Get available tools for a specific topic
   */
  getTopicTools(topicNumber: string): string[] {
    const topicsWithTools: Record<string, string[]> = {
      '1.1': ['number_line', 'pattern_finder'],
      '1.2': ['sequence_builder', 'pattern_analyzer'],
      '1.3': ['visualization_tools', 'shape_builder'],
    };

    return topicsWithTools[topicNumber] || [];
  }

  /**
   * Search topics by content
   */
  async searchTopics(query: string): Promise<Topic[]> {
    try {
      const response = await fetchData<Topic[]>(`${this.baseURL}/api/v1/curriculum/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching topics:', error);
      throw new Error('Failed to search topics');
    }
  }
}

// Create and export a singleton instance
export const curriculumService = new CurriculumService();
export default curriculumService;
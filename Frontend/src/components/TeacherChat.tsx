import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import VisualizationRenderer from './visualizations/VisualizationRenderer.tsx';
import VisualizationSidebar from './VisualizationSidebar.tsx';
import { ThreadHistory } from '../services/historyService';
import { useVisualizationState } from '../contexts/VisualizationStateContext';
import { useInterrupt } from '../contexts/InterruptContext';
import { userProfileService } from '../services/userProfileService';
import ReactMarkdown from 'react-markdown';
import { LuBrain } from 'react-icons/lu';
import { FaPaperPlane } from 'react-icons/fa';
import { Button, Paragraph } from './common/Elements';
import {
  AiIcon,
  AIMessage,
  AiMessageTextTime,
  ChatBody,
  ChatFooter,
  ChatHeader,
  ChatInput,
  ChatInputWrapper,
  ChatIpnutUploadIcon,
  ChatWrapper,
  Dot,
  MessageTime,
  StudentMessage,
  StudentMessageWrapper,
  ThinkingWrapper,
  TutorInfo,
  TutorModeButtons,
} from './Student/Subjects/LearingView/LearingViewStyles';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: any;
  visualization?: any;
}

interface HumanInteraction {
  requires_human_input: boolean;
  pending_question?: string;
  interaction_type?: 'choice' | 'text' | 'confirmation' | 'assessment';
  options?: string[];
}

interface FrontendAction {
  frontend_action: string;
  window_type?: string;
  tool_type?: string;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  position?: 'left' | 'right' | 'bottom';
  data?: any;
  closable?: boolean;
  timestamp: string;
}

interface TeacherChatProps {
  studentId: string;
  topic?: string;
  topicContent?: {
    full_text: string;
    paragraphs: string[];
    tables: any[];
    word_count: number;
    paragraph_count: number;
  };
  topicNumber?: string;
  mode?: 'teaching' | 'practice' | 'assessment';
  threadId?: string;
  isResumed?: boolean;
  initialHistory?: ThreadHistory;
  onBack?: () => void;
  onSessionCreated?: (threadId: string) => void;
}

const TeacherChat: React.FC<TeacherChatProps> = ({
  studentId,
  topic = '',
  topicContent,
  topicNumber,
  mode = 'teaching',
  threadId,
  isResumed = false,
  initialHistory,
  onBack,
  onSessionCreated
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visualization, setVisualization] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [currentVisualizationStep, setCurrentVisualizationStep] = useState<number>(0);
  const [humanInteraction, setHumanInteraction] = useState<HumanInteraction>({
    requires_human_input: false
  });

  // Visualization state management
  const {
    loadSessionState,
    clearSession,
    setToolState,
    interruptTool,
    resumeTool,
    completeTool,
    getToolState,
    getActiveTools
  } = useVisualizationState();

  // Interrupt management
  const { isInterrupted, interrupt, clearInterrupt } = useInterrupt();

  // Visualization sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisualization, setSidebarVisualization] = useState<any>(null);
  const [sidebarTitle, setSidebarTitle] = useState('Visualization');
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right' | 'bottom'>('right');
  const [sidebarSize, setSidebarSize] = useState<'small' | 'medium' | 'large'>('medium');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = 'http://164.52.192.178/ai-agent';

  // Progress tracking state
  const sessionStartTime = useRef<Date>(new Date());
  const interactionCount = useRef<number>(0);
  const [toolsUsed, setToolsUsed] = useState<Set<string>>(new Set());

  // Track user progress in background
  const trackUserProgress = useCallback(async (interactionData: {
    duration_minutes?: number;
    accuracy?: number;
    problems_attempted?: number;
    problems_correct?: number;
    tools_used?: string[];
  }) => {
    if (!topic || !studentId) return;

    try {
      await userProfileService.updateUserProgress(studentId, topic, interactionData);
      console.log('User progress updated:', { studentId, topic, interactionData });
    } catch (error) {
      console.error('Failed to update user progress:', error);
    }
  }, [studentId, topic]);

  // Calculate session duration
  const getSessionDuration = useCallback(() => {
    const now = new Date();
    const diffMs = now.getTime() - sessionStartTime.current.getTime();
    return Math.floor(diffMs / (1000 * 60)); // Duration in minutes
  }, []);

  // Handle practice triggers from visualizations
  const handlePracticeTrigger = useCallback(async (practiceConfig: any) => {
    console.log('Practice triggered:', practiceConfig);

    try {
      // Check if this is the new interactive session type
      if (practiceConfig.practice_type === 'interactive_session') {
        console.log('Handling interactive practice session locally');

        // Create practice data locally to avoid the 404 error
        const localPracticeData = {
          practice_data: {
            data: {
              expression: `${practiceConfig.num1} ${practiceConfig.operation === 'addition' ? '+' : '-'} ${practiceConfig.num2}`,
              steps: [
                {
                  step: 1,
                  question: `What is ${practiceConfig.num1} ${practiceConfig.operation === 'addition' ? '+' : '-'} ${practiceConfig.num2}?`,
                  answer: practiceConfig.operation === 'addition' ?
                    (practiceConfig.num1 + practiceConfig.num2).toString() :
                    (practiceConfig.num1 - practiceConfig.num2).toString(),
                  hint: `Start at ${practiceConfig.num1} and ${practiceConfig.operation === 'addition' ? 'move right' : 'move left'} ${practiceConfig.num2} steps.`,
                  explanation: `${practiceConfig.num1} ${practiceConfig.operation === 'addition' ? '+' : '-'} ${practiceConfig.num2} = ${practiceConfig.operation === 'addition' ? practiceConfig.num1 + practiceConfig.num2 : practiceConfig.num1 - practiceConfig.num2}`
                }
              ],
              title: `Practice: ${practiceConfig.operation}`
            },
            ui_config: {
              interactive: true,
              showHints: true,
              allowSkip: false
            }
          },
          message: `🎯 Get ready! You're now in control of solving this problem step by step. Click on the number line to make your moves!`
        };

        // Create an interactive practice visualization directly
        const practiceVisualization = {
          frontend_action: "show_visualization",
          visualization_type: "interactive_practice_session",
          title: `Interactive Practice: ${practiceConfig.operation}`,
          data: localPracticeData.practice_data.data,
          ui_config: localPracticeData.practice_data.ui_config,
          timestamp: new Date().toISOString()
        };

        // Show the interactive practice in the sidebar
        setVisualization(practiceVisualization);
        setSidebarOpen(true);
        setSidebarTitle(`🎯 Interactive Practice - ${practiceConfig.operation}`);

        // Add a message about interactive practice starting
        const practiceMessage: Message = {
          role: 'assistant',
          content: localPracticeData.message,
          timestamp: new Date().toISOString(),
          metadata: {
            type: 'interactive_practice_trigger',
            practice_config: practiceConfig
          }
        };
        setMessages(prev => [...prev, practiceMessage]);
      } else {
        // Use old practice system for backward compatibility
        const response = await fetch(`${API_BASE_URL}/auto_generate_practice_after_demo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operation: practiceConfig.operation,
            demonstrated_problem: practiceConfig.demonstrated_problem,
            difficulty_level: practiceConfig.difficulty || "easy",
            count: practiceConfig.count || 3
          }),
        });

        if (response.ok) {
          const practiceData = await response.json();
          console.log('Generated practice problems:', practiceData);

          // Create a practice problems visualization
          const practiceVisualization = {
            frontend_action: "show_visualization",
            visualization_type: "auto_practice_problems",
            title: `Practice: ${practiceConfig.operation}`,
            data: practiceData,
            timestamp: new Date().toISOString()
          };

          // Show the practice problems in the sidebar
          setVisualization(practiceVisualization.data);
          setSidebarOpen(true);
          setSidebarTitle(`🎯 Practice Problems - ${practiceConfig.operation}`);

          // Add a message about practice starting
          const practiceMessage: Message = {
            role: 'assistant',
            content: practiceData.message || `🎯 Great! Now let's practice what you learned. I've generated ${practiceData.count} practice problems for you!`,
            timestamp: new Date().toISOString(),
            metadata: {
              type: 'practice_trigger',
              practice_config: practiceConfig
            }
          };
          setMessages(prev => [...prev, practiceMessage]);
        } else {
          throw new Error('Failed to generate practice problems');
        }
      }
    } catch (error) {
      console.error('Error triggering practice:', error);
      // Fallback message
      const errorMessage: Message = {
        role: 'assistant',
        content: "🎯 Ready to practice! Ask me to generate practice problems for you.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [API_BASE_URL, setMessages, setVisualization, setSidebarOpen, setSidebarTitle]);

  // Handle step updates from visualizations (with enhanced practice feedback)
  const handleStepUpdate = useCallback((stepIndex: number, stepData: any) => {
    console.log('Received step update:', { stepIndex, stepData });

    // Handle step messages directly for chat integration
    if (stepData.type === 'step_message' && stepData.chat_message) {
      console.log('Processing step message for chat:', stepData.chat_message);

      const stepMessage: Message = {
        role: 'assistant',
        content: stepData.chat_message,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'step_explanation',
          step_info: {
            step: stepData.step,
            description: stepData.description,
            explanation: stepData.explanation,
            expression: stepData.expression
          }
        }
      };
      setMessages(prev => [...prev, stepMessage]);

      // Update visualization step
      setCurrentVisualizationStep(stepIndex);
      return;
    }

    // Send step update to backend via WebSocket for other types
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({
        type: 'step_update',
        session_id: sessionId,
        step_index: stepIndex,
        step_data: stepData
      }));
    }

    // Handle practice session feedback and AI guidance
    if (stepData.action === 'answer_submitted') {
      // Send immediate feedback based on correctness
      const feedbackMessage: Message = {
        role: 'assistant',
        content: stepData.isCorrect
          ? `🎉 ${stepData.ai_guidance} ${stepData.explanation}`
          : `💭 ${stepData.explanation} Try looking at the hint if you need help!`,
        timestamp: new Date().toISOString(),
        metadata: {
          type: 'ai_guidance',
          isCorrect: stepData.isCorrect,
          step: stepData.step,
          stepTitle: stepData.stepTitle,
          stepType: stepData.stepType
        }
      };

      setMessages(prev => [...prev, feedbackMessage]);

      // Add encouragement for wrong answers
      if (!stepData.isCorrect) {
        setTimeout(() => {
          const encouragementMessages = [
            "Don't worry! Every mathematician makes mistakes while learning. That's how we improve! 🌟",
            "Great effort! Learning is a process. Take your time and try again when you're ready. 💪",
            "No problem! Even the best students need multiple attempts. You're doing great! 🚀",
            "That's totally normal! The important thing is that you're practicing. Keep going! ✨"
          ];

          const randomEncouragement = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

          const encouragementMessage: Message = {
            role: 'assistant',
            content: randomEncouragement,
            timestamp: new Date().toISOString(),
            metadata: {
              type: 'encouragement'
            }
          };
          setMessages(prev => [...prev, encouragementMessage]);
        }, 1500);
      } else {
        // Celebrate correct answers
        setTimeout(() => {
          const celebrationMessages = [
            "Fantastic! You're really getting the hang of this! 🎊",
            "Excellent work! Your understanding is growing stronger! 🌟",
            "Perfect! You're mastering these concepts beautifully! 🎯",
            "Outstanding! Keep up this amazing progress! 🚀"
          ];

          const randomCelebration = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];

          const celebrationMessage: Message = {
            role: 'assistant',
            content: randomCelebration,
            timestamp: new Date().toISOString(),
            metadata: {
              type: 'celebration'
            }
          };
          setMessages(prev => [...prev, celebrationMessage]);
        }, 1000);
      }
    }
  }, [sessionId, websocket]);

  // Process message content to extract frontend actions
  const processMessageContent = (message: Message, isHistorical: boolean = false): Message => {
    try {
      // Check if message content is a JSON string representing a frontend action
      if (typeof message.content === 'string' && message.content.trim().startsWith('{')) {
        const parsed = JSON.parse(message.content);

        // If it's a frontend action, handle it only for live messages, not historical ones
        if (parsed.frontend_action) {
          console.log('Found frontend action in message content:', parsed, 'isHistorical:', isHistorical);

          // Only handle frontend actions for live messages, not when loading history
          if (!isHistorical) {
            console.log('🎬 Processing live frontend action:', parsed.frontend_action);
            handleFrontendAction(parsed);
          } else {
            console.log('📜 Skipping historical frontend action:', parsed.frontend_action);
          }

          return {
            ...message,
            content: 'Created interactive visualization', // Replace JSON with user-friendly text
            visualization: parsed // Store as visualization data
          };
        }
      }
    } catch (error) {
      // If parsing fails, just return the original message
      console.log('Message content is not JSON, displaying as text');
    }

    return message;
  };

  // Handle frontend actions from the agent
  const handleFrontendAction = (action: FrontendAction) => {
    console.log('Handling frontend action:', action);

    // Generate a unique tool ID for this action
    const toolId = `${action.tool_type || action.frontend_action}_${Date.now()}`;

    switch (action.frontend_action) {
      case 'show_visualization':
        // Show visualization in main chat area
        setVisualization(action.data);

        // Save tool state for this visualization
        if (action.data && sessionId) {
          setToolState(toolId, {
            toolId,
            toolType: action.data.visualization_type || 'number_line_demo',
            isActive: true,
            isInterrupted: false,
            currentStep: 0,
            totalSteps: action.data.data?.steps?.length || 0,
            progress: 0,
            data: action.data,
            timestamp: new Date().toISOString(),
            canResume: true,
            autoPlay: action.data.ui_config?.auto_play || false,
            stepDuration: action.data.ui_config?.step_duration || 4000
          });
        }
        break;

      case 'open_side_window':
        setSidebarTitle(action.title || 'Visualization');
        setSidebarPosition(action.position || 'right');
        setSidebarSize(action.size || 'medium');
        setSidebarVisualization(action.data);
        setSidebarOpen(true);
        break;

      case 'update_visualization':
        if (sidebarOpen) {
          setSidebarVisualization(action.data);
        } else {
          setVisualization(action.data);
        }
        break;

      case 'show_interactive_tool':
        // Handle interactive tools
        setSidebarTitle(`Interactive Tool: ${action.tool_type}`);
        setSidebarVisualization(action.data);
        setSidebarOpen(true);
        break;

      default:
        console.warn('Unknown frontend action:', action.frontend_action);
    }
  };

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup active tools when session changes or component unmounts
  useEffect(() => {
    return () => {
      // Interrupt all active tools when component unmounts or session changes
      const activeTools = getActiveTools();
      activeTools.forEach(tool => {
        if (tool.isActive) {
          interruptTool(tool.toolId);
          console.log(`🛑 Auto-interrupted tool: ${tool.toolId} on session cleanup`);
        }
      });
    };
  }, [sessionId, getActiveTools, interruptTool]);

  // Initialize teaching session
  const startSession = async () => {
    if (!topic) {
      console.log('No topic provided, cannot start session');
      return;
    }

    console.log('Starting session with:', { studentId, topic, mode, threadId, isResumed });

    setIsLoading(true);
    try {
      let activeThreadId = threadId;

      // If resuming a session, load history and set up thread
      if (isResumed && threadId) {
        console.log('Resuming session with thread:', threadId);
        activeThreadId = threadId;
        setSessionId(activeThreadId);

        // Clear any existing visualization state when resuming
        setVisualization(null);
        setSidebarOpen(false);
        setSidebarVisualization(null);
        setCurrentVisualizationStep(0);
        console.log('🧹 Cleared existing visualization state for session resume');

        // Clear any active tool states to prevent auto-appearance
        const activeTools = getActiveTools();
        activeTools.forEach(tool => {
          if (tool.isActive) {
            interruptTool(tool.toolId);
            console.log(`🛑 Auto-interrupted active tool during session resume: ${tool.toolId}`);
          }
        });

        // Clear the visualization state context as well to ensure no stale state
        clearSession(activeThreadId);
        console.log('🧹 Cleared visualization context state for session resume');

        // Load visualization state for this session
        loadSessionState(activeThreadId);

        // Check for interrupted tools in this session
        setTimeout(() => {
          const activeTools = getActiveTools();
          const interruptedTools = activeTools.filter(tool => tool.isInterrupted && tool.canResume);

          if (interruptedTools.length > 0) {
            console.log(`📋 Found ${interruptedTools.length} interrupted tool(s) that can be resumed:`, interruptedTools);
            // You could show a notification or prompt here to resume tools
            // For now, we'll just log it
            interruptedTools.forEach(tool => {
              console.log(`🔧 Interrupted tool: ${tool.toolId} (${tool.toolType}) - Step ${tool.currentStep}/${tool.totalSteps}`);
            });
          }
        }, 1000); // Small delay to ensure state is loaded

        // Load initial history if provided
        if (initialHistory && initialHistory.messages) {
          const processedMessages = initialHistory.messages.map((msg: Message) => processMessageContent(msg, true)); // Mark as historical
          setMessages(processedMessages);
        }

        // Setup WebSocket connection for resumed session
        const ws = new WebSocket(`ws://164.52.192.178/ai-agent/ws/${activeThreadId}`);
        setWebsocket(ws);
        setupWebSocketHandlers(ws);

      } else {
        // Create a new thread session
        console.log('Creating new session');
        const createResponse = await axios.post(`${API_BASE_URL}/api/advanced/threads/create`, {
          user_id: studentId,
          topic: topic,
          mode: mode
        });

        console.log('Thread creation response:', createResponse.data);

        if (createResponse.data.status === 'success') {
          activeThreadId = createResponse.data.thread_id;
          console.log('Setting session ID:', activeThreadId);
          if (activeThreadId) {
            setSessionId(activeThreadId);

            // Notify parent component of session creation
            if (onSessionCreated) {
              onSessionCreated(activeThreadId);
            }
          }

          // Send initial message to start the conversation with topic selection
          let initialMessage = `I want to learn about ${topic}`;
          
          // If we have a specific topic number, add topic selection command
          if (topicNumber) {
            initialMessage = `Select topic ${topicNumber}. ${initialMessage}`;
          }
          
          const messageResponse = await axios.post(`${API_BASE_URL}/api/advanced/threads/${activeThreadId}/message`, {
            user_id: studentId,
            message: initialMessage,
            topic_context: topicContent ? {
              topic_number: topicNumber,
              topic_title: topic,
              content: topicContent
            } : undefined
          });

          console.log('Initial message response:', messageResponse.data);

          if (messageResponse.data.status === 'success') {
            const messages = messageResponse.data.messages || [];
            console.log('Setting messages:', messages);
            // Process each message to handle frontend actions in content
            const processedMessages = messages.map((msg: Message) => processMessageContent(msg));
            setMessages(processedMessages);

            // Handle any frontend actions from the initial response
            if (messageResponse.data.frontend_actions && messageResponse.data.frontend_actions.length > 0) {
              messageResponse.data.frontend_actions.forEach((action: any) => {
                handleFrontendAction(action);
              });
            }
          }

          // Setup WebSocket connection for real-time updates
          const ws = new WebSocket(`ws://164.52.192.178/ai-agent/ws/${activeThreadId}`);
          setWebsocket(ws);
          setupWebSocketHandlers(ws);
        }
      }
    } catch (error) {
      console.error('Error starting session:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Error starting session. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate function to handle WebSocket setup for reusability
  const setupWebSocketHandlers = (ws: WebSocket) => {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);

      // Handle different message types
      if (data.type === 'frontend_action') {
        handleFrontendAction(data.action);
      } else if (data.type === 'step_message') {
        // Handle step-by-step messages from demonstrations
        const stepMessage: Message = {
          role: 'assistant',
          content: data.content,
          timestamp: data.timestamp,
          metadata: {
            type: 'step_explanation',
            step_info: data.step_info
          }
        };
        setMessages(prev => [...prev, stepMessage]);

        // Update visualization step if step info is provided
        if (data.step_info && typeof data.step_info.step === 'number') {
          setCurrentVisualizationStep(data.step_info.step - 1); // Convert to 0-based index
        }
      } else if (data.status === 'success') {
        // Process regular messages and add visualization data if present
        const rawMessages = data.messages?.map((msg: any) => ({
          ...msg,
          visualization: data.visualization || msg.visualization
        })) || [];

        // Process each message through processMessageContent to handle frontend actions
        const processedMessages = rawMessages.map((msg: Message) => processMessageContent(msg, false)); // false = not historical

        setMessages(prev => [...prev, ...processedMessages]);

        // Update visualization state if present
        if (data.visualization) {
          setVisualization(data.visualization);
          setCurrentVisualizationStep(0); // Reset to first step for new visualization
        }

        // Update progress if present
        if (data.progress) {
          setProgress(data.progress);
        }

        // Handle human-in-the-loop interactions
        if (data.requires_human_input) {
          setHumanInteraction({
            requires_human_input: true,
            pending_question: data.pending_question,
            interaction_type: data.interaction_type,
            options: data.options
          });
        } else {
          setHumanInteraction({ requires_human_input: false });
        }

        // Handle frontend actions
        if (data.frontend_actions && data.frontend_actions.length > 0) {
          data.frontend_actions.forEach((action: FrontendAction) => {
            handleFrontendAction(action);
          });
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  // Send message
  const sendMessage = async () => {
    if (!currentMessage.trim() || !sessionId) return;

    // Check if this is an interrupt command (e.g., "wait", "stop", "pause")
    const interruptKeywords = ['wait', 'stop', 'pause', 'interrupt', 'halt'];
    const isInterruptCommand = interruptKeywords.some(keyword =>
      currentMessage.toLowerCase().includes(keyword)
    );

    if (isInterruptCommand) {
      console.log('🛑 Interrupt command detected:', currentMessage);
      interrupt(); // Set local interrupt state

      // Interrupt all active tools
      const activeTools = getActiveTools();
      activeTools.forEach(tool => {
        if (tool.isActive) {
          interruptTool(tool.toolId);
          console.log(`🛑 Interrupted tool: ${tool.toolId}`);
        }
      });
    }

    const userMessage: Message = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        // Send through WebSocket with interrupt flag if needed
        const messageData = {
          ...userMessage,
          interrupt_requested: isInterruptCommand
        };
        websocket.send(JSON.stringify(messageData));
      } else {
        // Use advanced thread API for HTTP fallback
        const response = await axios.post(
          `${API_BASE_URL}/api/advanced/threads/${sessionId}/message`,
          {
            user_id: studentId,
            message: currentMessage,
            interrupt_requested: isInterruptCommand
          }
        );

        if (response.data.status === 'success') {
          const newMessages = response.data.messages || [];
          // Process each message to handle frontend actions in content
          const processedMessages = newMessages.map((msg: Message) => processMessageContent(msg));
          setMessages(prev => [...prev, ...processedMessages]);

          // Handle frontend actions from response
          if (response.data.frontend_actions && response.data.frontend_actions.length > 0) {
            response.data.frontend_actions.forEach((action: any) => {
              handleFrontendAction(action);
            });
          }

          // Handle human interaction requirements
          if (response.data.requires_human_input) {
            setHumanInteraction({
              requires_human_input: true,
              pending_question: response.data.pending_question,
              interaction_type: response.data.interaction_type,
              options: response.data.options
            });
          } else {
            setHumanInteraction({ requires_human_input: false });
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Request visualization
  const requestVisualization = async (type: string, data: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/visualize`, {
        tool_type: type,
        data: data,
        topic: topic,
        student_level: 'intermediate'
      });

      if (response.data.status === 'success') {
        setVisualization(response.data.visualization);
      }
    } catch (error) {
      console.error('Error creating visualization:', error);
    }
  };

  // Get progress data
  const fetchProgress = async () => {
    if (!sessionId) return;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/sessions/${sessionId}/progress`
      );
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  // Start session on component mount
  useEffect(() => {
    if (studentId && topic && !sessionId) {
      startSession();
    }
  }, [studentId, topic]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderVisualization = () => {
    if (!visualization) return null;

    // Handle new visualization format with VisualizationRenderer
    if (visualization.visualization_type) {
      return (
        <div className="visualization-container" style={{ width: '100%', marginBottom: '1rem' }}>
          <VisualizationRenderer
            visualizationData={visualization}
            onStepChange={handleStepUpdate}
            onPracticeTrigger={handlePracticeTrigger}
            currentStep={currentVisualizationStep}
          />
        </div>
      );
    }

    // Legacy visualization handling
    if (visualization.type === 'plot' || visualization.type === 'progress_radar') {
      try {
        const plotData = JSON.parse(visualization.data);
        return (
          <div className="visualization-container" style={{ width: '100%', height: '400px' }}>
            <h4>{visualization.description}</h4>
            <div dangerouslySetInnerHTML={{ __html: `<div id="plotly-div">${visualization.data}</div>` }} />
          </div>
        );
      } catch (error) {
        return <div>Error rendering visualization: {String(error)}</div>;
      }
    }

    return (
      <div className="visualization-container">
        <h4>{visualization.description}</h4>
        <pre>{JSON.stringify(visualization, null, 2)}</pre>
      </div>
    );
  };

  // Unified chat bubble renderer (matches AITutor styling)
  const renderMessage = (message: Message, index: number) => {
    const isAssistant = message.role === 'assistant' || message.role === 'system';

    if (isAssistant) {
      return (
        <AIMessage key={`${message.timestamp}-${index}`} data-message-id={`${message.timestamp}-${index}`}>
          <AiIcon className='tutor_icon'>
            <LuBrain />
          </AiIcon>
          <AiMessageTextTime>
            {/* Text content */}
            {message.content && (
              <Paragraph>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Paragraph>
            )}

            {/* Inline visualization if present */}
            {message.visualization && (
              <div style={{ marginTop: '12px' }}>
                <VisualizationRenderer visualizationData={message.visualization} />
              </div>
            )}

            <Paragraph>{new Date(message.timestamp).toLocaleTimeString()}</Paragraph>
          </AiMessageTextTime>
        </AIMessage>
      );
    }

    // User message
    return (
      <StudentMessageWrapper key={`${message.timestamp}-${index}`} data-message-id={`${message.timestamp}-${index}`}>
        <StudentMessage>
          <AiMessageTextTime>
            <Paragraph>
              {message.content}
            </Paragraph>
            <MessageTime>{new Date(message.timestamp).toLocaleTimeString()}</MessageTime>
          </AiMessageTextTime>
        </StudentMessage>
      </StudentMessageWrapper>
    );
  };

  const renderProgress = () => {
    if (!progress || !progress.session_progress) return null;

    const progressData = Object.entries(progress.session_progress).map(([topic, score]) => ({
      topic,
      score: typeof score === 'number' ? score * 100 : 0
    }));

    return (
      <div className="progress-container" style={{ width: '100%', height: '200px' }}>
        <h4>Learning Progress</h4>
        <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
          {progressData.map((item, index) => (
            <div key={index} style={{ marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.topic}</span>
                <span>{item.score.toFixed(1)}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${item.score}%`,
                  height: '100%',
                  backgroundColor: '#1976d2',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="teacher-chat-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header using unified ChatHeader */}
      <ChatHeader>
        <TutorInfo>
          <AiIcon>
            <LuBrain />
          </AiIcon>
          <div>
            <Paragraph>Teacher Agent - {topic}</Paragraph>
            <Paragraph>Mode: <strong>{mode}</strong> {isResumed && ' · 📖 Resumed Session'}</Paragraph>
          </div>
        </TutorInfo>
        <TutorModeButtons>
          {onBack && (
            <Button onClick={onBack}>Back</Button>
          )}
          <Button onClick={fetchProgress} disabled={!sessionId}>View Progress</Button>
          <Button onClick={() => requestVisualization('chart', { sample: 'data' })} disabled={!sessionId}>Create Viz</Button>
          {(() => {
            const activeTools = getActiveTools();
            return activeTools.length > 0 && (
              <Button
                onClick={() => {
                  activeTools.forEach(tool => {
                    if (tool.isActive) {
                      interruptTool(tool.toolId);
                    }
                  });
                  interrupt();
                }}
              >🛑 Stop All</Button>
            );
          })()}
        </TutorModeButtons>
      </ChatHeader>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar (kept as before) */}
        <div
          style={{
            flex: 2,
            borderLeft: '1px solid #e0e0e0',
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {visualization && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>Visualization</h3>
              {renderVisualization()}
            </div>
          )}

          {progress && (
            <div style={{ marginBottom: '2rem' }}>
              <h3>Learning Progress</h3>
              {renderProgress()}
            </div>
          )}

          {/* Flexible spacer keeps actions at bottom when no tool/progress */}
          <div style={{ flexGrow: 1 }} />

          <div style={{ marginTop: 'auto' }}>
            <h3>Quick Actions</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flex: "wrap" }}>
              <Button
                onClick={() => requestVisualization('graph', {
                  function_type: 'quadratic',
                  parameters: { a: 1, b: -2, c: 1 }
                })}
                disabled={!sessionId}
              >Show Math Function</Button>
              <Button
                onClick={() => sendMessage()}
                disabled={!sessionId}
              >Ask for Practice Problems</Button>
              <Button
                onClick={fetchProgress}
                disabled={!sessionId}
              >Check Understanding</Button>
            </div>
          </div>
        </div>

        {/* Chat Area using unified Chat UI */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ChatWrapper>
            <ChatBody>
              {messages.length === 0 && (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#333',
                  backgroundColor: '#fff',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}>
                  <strong>{sessionId ? 'Waiting for messages...' : 'Session not started yet'}</strong>
                  <br /><br />
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>
                    <div>Topic: <strong>{topic || 'No topic selected'}</strong></div>
                    <div>Student: <strong>{studentId}</strong></div>
                    <div>Mode: <strong>{mode}</strong></div>
                  </div>
                </div>
              )}

              {messages.map((m, i) => renderMessage(m, i))}

              {isLoading && (
                <ThinkingWrapper>
                  <Dot color="#21786E" delay="0s" />
                  <Dot color="#7B19D8" delay="0.2s" />
                  <Paragraph>AI is thinking...</Paragraph>
                </ThinkingWrapper>
              )}
              <div ref={messagesEndRef} />
            </ChatBody>

            <ChatFooter>
              <div style={{ flex: 1 }}>
                <ChatInput
                  placeholder="Type your message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!sessionId || isLoading}
                />
              </div>
              <ChatInputWrapper>
                {/* <ChatIpnutUploadIcon>
                  <Button className="square_btn" disabled={isLoading}>📎</Button>
                </ChatIpnutUploadIcon> */}
                <div>
                  <Button
                    className="square_fill_btn"
                    iconOnly
                    rightIcon={<FaPaperPlane />}
                    onClick={sendMessage}
                    disabled={!sessionId || isLoading || !currentMessage.trim()}
                  />
                </div>
              </ChatInputWrapper>
            </ChatFooter>
          </ChatWrapper>
        </div>
      </div>

      <VisualizationSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={sidebarTitle}
        visualization={sidebarVisualization}
        position={sidebarPosition}
        size={sidebarSize}
        onStepUpdate={handleStepUpdate}
      />
    </div>
  );
};

export default TeacherChat;

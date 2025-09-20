import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from './LearingViewStyles';
import { FaPaperclip, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { IoIosExpand, IoMdClose } from "react-icons/io";
import { LuBrain } from "react-icons/lu";
import { Button, Paragraph } from '../../../common/Elements';
import { useTheme } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { getApiConfig } from '../../../../api';
import { fetchData } from '../../../../utils/apiUtils';
import {
    setCurrentStep,
    setActiveTool,
    clearActiveTool,
    setCurrentPatternIndex,
    clearAIFeedbackMessages,
    pauseAutoAdvance,
    resumeAutoAdvance,
    addChatMessage,
    setLearningStepMode
} from '../../../../store/slices/studySlice';

interface Message {
    id: number;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
    isPatternMessage?: boolean;
    isAIFeedback?: boolean;
}

interface AITutorProps {
    closeView?: () => void;
    expandChat?: () => void;
    mode?: string;
}

const AITutor: React.FC<AITutorProps> = ({ closeView, expandChat, mode }) => {

    const { topicId, currentPatternIndex, activeTool, aiFeedbackMessages, autoAdvance, topicName } = useSelector((state: RootState) => state.study);
    const theme = useTheme();
    const dispatch = useDispatch();

    // Local state
    const messages = useSelector((state: RootState) => state.study.chatMessages);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isUserTyping, setIsUserTyping] = useState<boolean>(false);
    const [toolRunning, setToolRunning] = useState<boolean>(false);
    const [toolId, setToolId] = useState<number | null>(null);

    // Refs
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const hasShownInitialPattern = useRef<boolean>(false);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputMessageRef = useRef<string>('');

    // Clean up timeout on unmount
    useEffect(() => {
        const timeoutRef = typingTimeoutRef.current;
        return () => {
            if (timeoutRef) {
                clearTimeout(timeoutRef);
            }
        };
    }, []);

    // Clean up AI response text and convert Unicode to symbols
    const cleanResponseText = (text: string): string => {
        // First, handle escaped Unicode sequences
        const decodedText = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
            String.fromCharCode(parseInt(hex, 16))
        );

        // Then handle common HTML entities and escaped characters
        return decodedText
            .replace(/\\n/g, '\n')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
                String.fromCharCode(parseInt(hex, 16))
            )
            .replace(/&#(\d+);/g, (_, dec) =>
                String.fromCharCode(parseInt(dec, 10))
            );
    };

    // Generate pattern sequence message when index changes
    const generatePatternSequenceMessage = useCallback((patternIndex: number) => {
        if (!activeTool || activeTool.name !== 'NumberPattern' || !activeTool.payload) {
            return null;
        }

        try {
            interface ToolPayload {
                patterns: {
                    [key: string]: {
                        sequence: (number | string)[];
                        name: string;
                        rule: string;
                    };
                };
            }
            const toolPayload = activeTool.payload as ToolPayload;
            const patterns = toolPayload.patterns;

            if (!patterns || typeof patterns !== 'object') {
                return null;
            }

            const patternKeys = Object.keys(patterns);

            if (patternIndex >= 0 && patternIndex < patternKeys.length) {
                const currentPatternKey = patternKeys[patternIndex];
                const currentPattern = patterns[currentPatternKey];

                if (currentPattern) {
                    const sequence = currentPattern.sequence || [];
                    const name = currentPattern.name || 'Unknown Pattern';
                    const rule = currentPattern.rule || 'No rule specified';

                    const message = {
                        id: Date.now() + Math.random(),
                        type: 'ai' as const,
                        content: `<h3>Current Pattern: ${name}</h3><div class="sequence">Sequence: [${sequence.join(', ')}]</div><div class="rule">Rule: ${rule}</div><div class="pattern-info">Pattern ${patternIndex + 1} of ${patternKeys.length}</div>`,
                        timestamp: new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }),
                        isPatternMessage: true
                    };
                    return message;
                }
            }
        } catch (error) {
            console.error('Error generating pattern sequence message:', error);
        }

        return null;
    }, [activeTool]);

    // Auto-scroll to new message when new messages are added or loading state changes
    const scrollToNewMessage = useCallback(() => {
        if (chatBodyRef.current && messages.length > 0) {
            // Get the last message element
            const messageElements = chatBodyRef.current.querySelectorAll('[data-message-id]');
            const lastMessageElement = messageElements[messageElements.length - 1] as HTMLElement;

            if (lastMessageElement) {
                // Scroll to the top of the last message
                lastMessageElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // Fallback to scrolling to bottom if no message elements found
                chatBodyRef.current.scrollTo({
                    top: chatBodyRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, [messages]);

    useEffect(() => {
        scrollToNewMessage();
    }, [messages, isLoading, scrollToNewMessage]);

    // Log currentPatternIndex changes and generate pattern sequence message
    useEffect(() => {

        if (currentPatternIndex !== undefined && currentPatternIndex >= 0) {
            if (!hasShownInitialPattern.current || currentPatternIndex > 0) {
                const patternMessage = generatePatternSequenceMessage(currentPatternIndex);
                if (patternMessage) {
                    dispatch(addChatMessage(patternMessage));
                }

                if (!hasShownInitialPattern.current) {
                    hasShownInitialPattern.current = true;
                }
            }
        }
    }, [currentPatternIndex, activeTool, dispatch, generatePatternSequenceMessage]);

    // Monitor AI feedback messages from Redux
    useEffect(() => {

        if (aiFeedbackMessages.length > 0) {
            const latestFeedback = aiFeedbackMessages[aiFeedbackMessages.length - 1];

            const feedbackMessage: Message = {
                id: Date.now() + Math.random(),
                type: 'ai',
                content: `${latestFeedback.feedback}`,
                timestamp: latestFeedback.timestamp,
                isAIFeedback: true
            };
            dispatch(addChatMessage(feedbackMessage));
        }
    }, [aiFeedbackMessages, dispatch]);

    // Handle input change with auto-advance pause/resume logic
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputMessage(value);
        inputMessageRef.current = value;

        // If user starts typing and wasn't typing before, pause auto-advance
        if (value.length > 0 && !isUserTyping) {
            setIsUserTyping(true);
            dispatch(pauseAutoAdvance());
        }

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // If input becomes empty, resume auto-advance immediately
        if (value.length === 0 && isUserTyping) {
            setIsUserTyping(false);
            dispatch(resumeAutoAdvance());
        }
    };

    const initialMessageSentRef = useRef(false);

    const handleSendMessage = useCallback(async (messageToSend?: string) => {
        const messageContent = messageToSend || inputMessageRef.current;
        if (!messageContent?.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            type: 'user',
            content: messageContent,
            timestamp: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
        };

        // Add user message to chat
        dispatch(addChatMessage(userMessage));
        if (!messageToSend) setInputMessage('');
        setIsLoading(true);

        try {
            // Prepare API payload
            const payload: { topicId: string | null; question: string; sessionId?: string; toolId?: number; toolRunning?: boolean } = {
                topicId: topicId,
                question: messageContent
            };

            // Add sessionId to payload if it exists
            if (sessionId) {
                payload.sessionId = sessionId;
            }

            if (toolRunning && toolId !== null) {
                payload.toolId = toolId;
                payload.toolRunning = toolRunning;
            }

            // Call the API using authenticated service
            const apiConfig = getApiConfig('agentAsk');
            const response = await fetchData(apiConfig.url, apiConfig.method, payload, {
                credentials: 'include'
            });

            interface ApiResponse {
                success: boolean;
                data: {
                    sessionId?: string;
                    toolName?: string;
                    mode?: string;
                    answer: string;
                    toolId?: number;
                };
            }

            const apiResponse = response as ApiResponse;

            if (apiResponse && apiResponse.success) {
                if (apiResponse.data.sessionId && !sessionId) {
                    setSessionId(apiResponse.data.sessionId);
                }
                let aiMessage: Message;

                // Check if we have valid tool data
                const hasValidToolData = apiResponse.data.toolName && apiResponse.data.toolId && apiResponse.data.mode;

                if (JSON.parse(apiResponse.data.answer)?.ExplainationPossible == "false") {
                    setToolRunning(false);

                    // Make a fallback API call with just sessionId, question, and topicId
                    setToolId(null);
                    setToolRunning(false);
                    dispatch(setLearningStepMode('agent'));
                    try {
                        const fallbackPayload = {
                            topicId: topicId,
                            question: messageContent,
                            sessionId: sessionId
                        };

                        const fallbackApiConfig = getApiConfig('agentAsk');
                        const fallbackResponse = await fetchData(fallbackApiConfig.url, fallbackApiConfig.method, fallbackPayload, {
                            credentials: 'include'
                        });

                        const fallbackApiResponse = fallbackResponse as ApiResponse;

                        if (fallbackApiResponse && fallbackApiResponse.success) {
                            aiMessage = {
                                id: Date.now() + 1,
                                type: 'ai',
                                content: cleanResponseText(fallbackApiResponse.data.answer),
                                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                            };
                        } else {
                            aiMessage = {
                                id: Date.now() + 1,
                                type: 'ai',
                                content: "The question is not possible to solve using tool.",
                                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                            };
                        }
                    } catch (fallbackError) {
                        console.error('Fallback API call failed:', fallbackError);
                        aiMessage = {
                            id: Date.now() + 1,
                            type: 'ai',
                            content: "The question is not possible to solve using tool.",
                            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                        };
                    }

                    dispatch(addChatMessage(aiMessage));
                    return;
                }
                else if (hasValidToolData && (apiResponse.data.toolName === "NumberPattern" || apiResponse.data.toolName === "NumberLine") && apiResponse.data.answer) {
                    try {
                        dispatch(setLearningStepMode('tool'));
                        const parsedData = JSON.parse(apiResponse.data.answer) as Record<string, unknown>;
                        const toolMode = apiResponse.data.mode || null;

                        // Store the current auto-advance state before creating the payload
                        const currentAutoAdvanceState = autoAdvance;

                        // Check if tool is already running and this is an update
                        const isToolUpdate = toolRunning && activeTool?.name === apiResponse.data.toolName;

                        interface ToolPayload {
                            patterns?: Record<string, unknown>;
                            steps?: unknown[];
                            mode: string | null;
                            sessionId?: string;
                            toolId?: number;
                            currentPatternIndex?: number;
                            setCurrentPatternIndex?: (index: number) => void;
                            initialAutoAdvance?: boolean;
                            question?: string;
                            currentStepIndex?: number;
                            setCurrentStepIndex?: (index: number) => void;
                        }

                        setToolId(apiResponse.data.toolId!);
                        setToolRunning(true);

                        let toolPayload: ToolPayload = {
                            mode: toolMode
                        };
                        let toolMessage: Message = {
                            id: Date.now() + 1,
                            type: 'ai' as const,
                            content: `Tool call: ${apiResponse.data.toolName} loaded in default mode.`,
                            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                        };

                        if (apiResponse.data.toolName === "NumberPattern") {
                            toolPayload = {
                                patterns: (parsedData.steps as Record<string, unknown>) || parsedData,
                                mode: toolMode,
                                sessionId: apiResponse.data.sessionId,
                                toolId: apiResponse.data.toolId,
                                currentPatternIndex: currentPatternIndex,
                                setCurrentPatternIndex: setCurrentPatternIndex,
                                initialAutoAdvance: currentAutoAdvanceState
                            };
                            console.log(toolPayload)
                            setToolRunning(true);

                            // Reset the initial pattern flag for new tool
                            hasShownInitialPattern.current = false;

                            // Clear previous AI feedback messages
                            dispatch(clearAIFeedbackMessages());

                            // Set initial pattern index to 0 to trigger the first pattern message
                            dispatch(setCurrentPatternIndex(0));

                            // Generate initial pattern message
                            const initialPatternMessage = generatePatternSequenceMessage(0);
                            toolMessage = {
                                id: Date.now() + 1,
                                type: 'ai' as const,
                                content: `Tool call: ${apiResponse.data.toolName} loaded in ${toolMode || 'default'} mode.`,
                                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                            };

                            // // Add both messages
                            dispatch(addChatMessage(toolMessage));
                            if (initialPatternMessage) {
                                dispatch(addChatMessage(initialPatternMessage));
                                hasShownInitialPattern.current = true;
                            }
                        } else if (apiResponse.data.toolName === "NumberLine") {
                            // Validate that we have steps data
                            if (toolRunning && parsedData.ExplainationPossible === true && (!parsedData.steps || !Array.isArray(parsedData.steps))) {
                                aiMessage = {
                                    id: Date.now() + 1,
                                    type: 'ai',
                                    content: 'Sorry, I received invalid step data for the Number Line tool. Please try again.',
                                    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                                };
                                dispatch(addChatMessage(aiMessage));
                                return;
                            }

                            toolPayload = {
                                steps: parsedData.steps || parsedData,
                                mode: toolMode,
                                question: apiResponse.data.answer,
                                sessionId: apiResponse.data.sessionId,
                                toolId: apiResponse.data.toolId,
                                currentStepIndex: isToolUpdate ? currentPatternIndex : 0,
                                setCurrentStepIndex: (index: number) => dispatch(setCurrentPatternIndex(index)),
                                initialAutoAdvance: currentAutoAdvanceState
                            };

                            setToolId(apiResponse.data.toolId!);
                            setToolRunning(true);

                            if (!isToolUpdate) {
                                // Clear previous AI feedback messages only for new tool
                                dispatch(clearAIFeedbackMessages());
                                // Set initial step index to 0 only for new tool
                                dispatch(setCurrentPatternIndex(0));
                            }

                            // Update toolMessage for NumberLine
                            toolMessage = {
                                id: Date.now() + 1,
                                type: 'ai' as const,
                                content: isToolUpdate
                                    ? `Number Line tool updated with new steps.`
                                    : `Tool call: ${apiResponse.data.toolName} loaded in ${toolMode || 'default'} mode.`,
                                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                            };

                            // Add tool message
                            dispatch(addChatMessage(toolMessage));
                        }

                        dispatch(setActiveTool({
                            name: apiResponse.data.toolName,
                            payload: toolPayload
                        }));

                        dispatch(setCurrentStep("Tool"));

                        aiMessage = toolMessage;
                    } catch (parseError) {
                        console.error("Failed to parse tool data:", parseError);
                        aiMessage = {
                            id: Date.now() + 1,
                            type: 'ai',
                            content: 'Sorry, I received malformed tool data. Please try again.',
                            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                        };
                    }
                }
                else {
                    // Clear active tool since this is a normal response
                    dispatch(setLearningStepMode('agent'));
                    dispatch(clearActiveTool());

                    aiMessage = {
                        id: Date.now() + 1,
                        type: 'ai',
                        content: cleanResponseText(apiResponse.data.answer),
                        timestamp: new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        })
                    };
                }

                setIsUserTyping(false);
                dispatch(resumeAutoAdvance());
                dispatch(addChatMessage(aiMessage));
            } else {
                // Handle error response
                dispatch(clearActiveTool());

                const errorMessage: Message = {
                    id: Date.now() + 1,
                    type: 'ai',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    })
                };
                dispatch(addChatMessage(errorMessage));
                setToolRunning(false);

                // Resume auto-advance even on error
                setIsUserTyping(false);
                dispatch(resumeAutoAdvance());
            }
        } catch (error) {
            console.error('Error sending message:', error);
            dispatch(clearActiveTool());

            const errorMessage: Message = {
                id: Date.now() + 1,
                type: 'ai',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
            };
            dispatch(addChatMessage(errorMessage));

            // Resume auto-advance on error
            setIsUserTyping(false);
            dispatch(resumeAutoAdvance());
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, sessionId, topicId, autoAdvance, currentPatternIndex, generatePatternSequenceMessage, activeTool?.name, toolId, toolRunning]);

    useEffect(() => {
        if (!initialMessageSentRef.current && topicName) {
            initialMessageSentRef.current = true;
            const message = `teach me ${topicName}`;
            setInputMessage(message);
            inputMessageRef.current = message;
            handleSendMessage(message);
            setInputMessage("");
            inputMessageRef.current = "";
        }
    }, [topicName, handleSendMessage]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const renderMessage = (message: Message) => {
        if (message.type === 'ai') {
            // Check if this is a pattern message
            if (message.isPatternMessage) {
                return (
                    <AIMessage key={message.id} data-message-id={message.id}>
                        <AiIcon className='tutor_icon'>
                            <LuBrain />
                        </AiIcon>
                        <AiMessageTextTime>
                            <div dangerouslySetInnerHTML={{ __html: message.content }} />
                            <Paragraph>{String(message.timestamp)}</Paragraph>
                        </AiMessageTextTime>
                    </AIMessage>
                );
            }

            // Check if this is an AI feedback message
            if (message.isAIFeedback) {
                return (
                    <AIMessage key={message.id} data-message-id={message.id}>
                        <AiIcon className='tutor_icon'>
                            <LuBrain />
                        </AiIcon>
                        <AiMessageTextTime>
                            <div style={{
                                background: '#f3f3f3',
                                padding: '16px',
                                borderRadius: '12px'
                            }}>
                                <ReactMarkdown
                                    components={{
                                        p: ({ children }) => <p style={{ margin: '0 0 8px 0', lineHeight: '1.4' }}>{children}</p>,
                                        h1: ({ children }) => <h1 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{children}</h1>,
                                        h2: ({ children }) => <h2 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 'bold' }}>{children}</h2>,
                                        h3: ({ children }) => <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>{children}</h3>,
                                        ul: ({ children }) => <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }}>{children}</ul>,
                                        ol: ({ children }) => <ol style={{ margin: '0 0 8px 0', paddingLeft: '20px' }}>{children}</ol>,
                                        li: ({ children }) => <li style={{ margin: '0 0 4px 0', lineHeight: '1.4' }}>{children}</li>,
                                        strong: ({ children }) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>,
                                        em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
                                        br: () => <br style={{ lineHeight: '1.2' }} />,
                                        div: ({ children }) => <div style={{ margin: '0 0 4px 0', lineHeight: '1.4' }}>{children}</div>
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                            <Paragraph>{String(message.timestamp)}</Paragraph>
                        </AiMessageTextTime>
                    </AIMessage>
                );
            }

            // Regular AI message
            return (
                <AIMessage key={message.id}>
                    <AiIcon className='tutor_icon'>
                        <LuBrain />
                    </AiIcon>
                    <AiMessageTextTime>
                        <Paragraph>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </Paragraph>
                        <Paragraph>{String(message.timestamp)}</Paragraph>
                    </AiMessageTextTime>
                </AIMessage>
            );
        } else {
            return (
                <StudentMessageWrapper key={message.id} data-message-id={message.id}>
                    <StudentMessage>
                        <AiMessageTextTime>
                            <Paragraph color={theme.colors.dark}>
                                {message.content}
                            </Paragraph>
                            <MessageTime>{message.timestamp}</MessageTime>
                        </AiMessageTextTime>
                    </StudentMessage>
                </StudentMessageWrapper>
            );
        }
    };

    const ToolBtn = () => {
        setToolRunning(!toolRunning)
        console.log('toolRunning', toolRunning)
    }

    return (
        <ChatWrapper $mode={mode === 'FullChatView' ? 'FullChatView' : 'default'}>
            {/* Topbar */}
            <ChatHeader>
                <TutorInfo>
                    <AiIcon>
                        <LuBrain />
                    </AiIcon>
                    <div>
                        <Paragraph>AI Tutor</Paragraph>
                    </div>
                    <button onClick={() => ToolBtn()} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
                        {toolRunning ? 'Off ToolRunning' : 'On ToolRunning'}
                    </button>
                </TutorInfo>

                {mode === 'default' && (
                    <TutorModeButtons>
                        <Button className="square_btn" iconOnly rightIcon={<IoIosExpand />} onClick={expandChat} />
                        <Button className="square_btn" iconOnly rightIcon={<IoMdClose />} onClick={closeView} />
                    </TutorModeButtons>
                )}
            </ChatHeader>

            {/* Chat Messages */}
            <ChatBody ref={chatBodyRef}>
                {messages.map(renderMessage)}

                {isLoading && (
                    <ThinkingWrapper>
                        <Dot color="#21786E" delay="0s" />
                        <Dot color="#7B19D8" delay="0.2s" />
                        <Paragraph>AI is thinking...</Paragraph>
                    </ThinkingWrapper>
                )}
            </ChatBody>

            {/* Input */}
            <ChatFooter>
                <div>
                    <ChatInput
                        placeholder="Ask me anything about this topic..."
                        value={inputMessage}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                </div>
                <ChatInputWrapper>
                    <ChatIpnutUploadIcon>
                        <Button className="square_btn" iconOnly rightIcon={<FaPaperclip />} disabled={isLoading} />
                        <Button className="square_btn" iconOnly rightIcon={<FaMicrophone />} disabled={isLoading} />
                    </ChatIpnutUploadIcon>
                    <div>
                        <Button
                            className="square_fill_btn"
                            iconOnly
                            rightIcon={<FaPaperPlane />}
                            onClick={() => handleSendMessage()}
                            disabled={isLoading || !inputMessage.trim()}
                        />
                    </div>
                </ChatInputWrapper>
            </ChatFooter>
        </ChatWrapper >
    );
};

export default AITutor;
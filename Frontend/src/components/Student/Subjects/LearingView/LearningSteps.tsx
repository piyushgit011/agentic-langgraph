import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { MdOndemandVideo, MdRestartAlt } from "react-icons/md";
import { LuBrain } from "react-icons/lu";
import {
    LearingFooter,
    LearingStepsButtons,
    LearingViewStepaCard,
    LearningBodyContent,
    RoundedCornerButton,
    AIMessage,
    AiIcon,
    AiMessageTextTime,
} from "./LearingViewStyles";
import { Box, CircularProgress, Typography } from "@mui/material";
import ModalPopup from "../../../common/Elements/Modal/Modal";
import NumberPatternsApp from "../../../tools/NumberPatternApp";
import NumberLineTool from "../../../tools/NumberLineTool";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { setCurrentPatternIndex } from '../../../../store/slices/studySlice';
import { useLearningSteps } from '../../../../hooks/useLearningSteps';
import { Button } from "../../../common/Elements";
import ReactMarkdown from 'react-markdown';

const MessagesContainer = styled.div`
    height: 100%;
    min-height: 400px;
    max-height: 850px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px;
    margin-top: 10px;
    border-radius: 8px;
    background-color: #f8f9fa;
    width: 100%;
    box-sizing: border-box;

    /* Custom Scrollbar Styling */
    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
        &:hover {
            background: #555;
        }
    }

    /* Firefox Scrollbar Styling */
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
`;

interface Message {
    id: number;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
    isPatternMessage?: boolean;
    isAIFeedback?: boolean;
}

interface LearningStepsProps {
    onNextTopic?: (nextTitle: string, nextNumber: string | number) => void;
    onChapterComplete?: (flow: string) => void;
    subHeader?: string[];
    videoUrl?: string | null;
    data?: string | null;
}

interface LearningStep {
    label: string;
    icon: React.ComponentType;
    component: React.ReactNode;
}

const AIResponseComponent: React.FC<{ messages: Message[] }> = ({ messages }) => {
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToNewMessage = () => {
        if (messagesContainerRef.current && messagesEndRef.current) {
            const container = messagesContainerRef.current;
            const lastMessage = messagesEndRef.current;

            // Calculate the position of the last message relative to the container
            const containerRect = container.getBoundingClientRect();
            const messageRect = lastMessage.getBoundingClientRect();

            // Calculate the scroll position to bring the message to the top
            const scrollTop = container.scrollTop + (messageRect.top - containerRect.top);

            // Scroll to position the message at the top with some padding
            container.scrollTo({
                top: Math.max(0, scrollTop - 20), // 20px padding from top
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToNewMessage();
    }, [messages]);

    return (
        <MessagesContainer ref={messagesContainerRef}>
            {messages.map((message, index) => {
                if (message.type === 'ai') {
                    const isLastMessage = index === messages.length - 1;
                    return (
                        <AIMessage
                            key={message.id}
                            ref={isLastMessage ? messagesEndRef : null}
                            style={{
                                marginBottom: '16px'
                            }}
                        >
                            <AiIcon className='tutor_icon' style={{
                                backgroundColor: '#21786E',
                                padding: '8px',
                                borderRadius: '50%',
                                marginRight: '12px'
                            }}>
                                <LuBrain style={{ color: '#ffffff' }} />
                            </AiIcon>
                            <AiMessageTextTime>
                                <div style={{
                                    whiteSpace: 'pre-wrap',
                                    color: '#2D3748',
                                    fontSize: '14px',
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word',
                                    maxWidth: '100%'
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
                                        }}>
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: '#718096',
                                    marginTop: '8px'
                                }}>
                                    {message.timestamp}
                                </div>
                            </AiMessageTextTime>
                        </AIMessage>
                    );
                }
                return null;
            })}
        </MessagesContainer>
    );
};

const LearningSteps: React.FC<LearningStepsProps> = ({
    onNextTopic,
    onChapterComplete,
    subHeader = [],
    videoUrl = null,
    data = null
}) => {
    const dispatch = useDispatch();
    const {
        currentStep,
        completedSteps,
        stepResetKey,
        isModalOpen,
        topicsList,
        currentTopicNumber,
        addCompletedStep,
        setCurrentStep,
        incrementStepResetKey,
        setModalOpen,
        resetLearningSteps,
    } = useLearningSteps();

    const activeTool = useSelector((state: RootState) => state.study.activeTool);
    const chatMessages = useSelector((state: RootState) => state.study.chatMessages);
    const learningStepMode = useSelector((state: RootState) => state.study.learningStepMode);

    const VideoStep: React.FC = () => (
        <div>
            <video
                controls
                width="100%"
            >
                <source src={videoUrl || undefined} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );

    const DataStep: React.FC = () => (
        <div>
            <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3>Topic Content</h3>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {data || "No content available for this topic."}
                </div>
            </div>
        </div>
    );

    type ExternalPatterns = Record<string, {
        name: string;
        sequence: (number | string)[];
        rule: string;
        explanation: string;
        difficulty: number
    }>;

    interface Visualization {
        rangeStart: number;
        rangeEnd: number;
        interval: number;
        draggableMarkerPosition: number;
        jumpSize: number;
        operationType: string;
        tickMarksVisible: boolean;
        numberLabelsVisible: boolean;
        orientation: string;
        colorScheme: string;
        direction: string;
    }

    interface NumberLineStep {
        step: string;
        explanation: string;
        visualization: Visualization;
        result: string;
    }

    type ToolPayload = {
        patterns?: ExternalPatterns;
        steps?: NumberLineStep[];
        mode?: string;
        sessionId?: string;
        toolId?: number;
        currentPatternIndex?: number;
        initialAutoAdvance?: boolean;
        question?: string;
    };

    // Dynamically create learning steps based on subHeader
    const createLearningSteps = (): LearningStep[] => {
        const steps: LearningStep[] = [];

        subHeader.forEach((header) => {
            switch (header.toLowerCase()) {
                case 'videos':
                    steps.push({ label: "video", icon: MdOndemandVideo, component: <VideoStep /> });
                    break;
                case 'data':
                    steps.push({ label: "data", icon: MdOndemandVideo, component: <DataStep /> });
                    break;
                case 'tool':
                    steps.push({
                        label: "Tool",
                        icon: MdOndemandVideo,
                        component: (() => {
                            const toolPayload = activeTool?.payload as ToolPayload;
                            const externalPatterns = toolPayload?.patterns;
                            const mode = toolPayload?.mode;
                            const sessionId = toolPayload?.sessionId;
                            const toolId = toolPayload?.toolId?.toString();
                            const currentPatternIndex = toolPayload?.currentPatternIndex;
                            const initialAutoAdvance = (toolPayload as ToolPayload)?.initialAutoAdvance;

                            // Render appropriate tool based on activeTool name
                            if (activeTool?.name === 'NumberPattern') {
                                return (
                                    <NumberPatternsApp
                                        externalPatterns={externalPatterns}
                                        mode={mode}
                                        currentPatternIndex={currentPatternIndex}
                                        setCurrentPatternIndex={(index: number) => dispatch(setCurrentPatternIndex(index))}
                                        initialAutoAdvance={initialAutoAdvance}
                                        sessionId={sessionId}
                                        toolId={toolId}
                                    />
                                );
                            } else if (activeTool?.name === 'NumberLine') {
                                const externalSteps = toolPayload?.steps;
                                return (
                                    <NumberLineTool
                                        steps={externalSteps}
                                        mode={mode}
                                        sessionId={sessionId}
                                        toolId={toolId}
                                    />
                                );
                            }

                            // Fallback for unknown tools
                            return (
                                <div>Unknown tool: {activeTool?.name}</div>
                            );
                        })()
                    });
                    break;
                default:
                    // Fallback to default steps if no subHeader provided
                    break;
            }
        });

        // Don't add default steps if no subHeader provided
        if (steps.length === 0) {
            return steps;
        }

        return steps;
    };

    const learingSteps = createLearningSteps();

    const currentIndex = learingSteps.findIndex((step) => step.label === currentStep);
    const isLastStep = currentIndex === learingSteps.length - 1;

    const getFooterButtonText = (): string => {
        if (currentStep === "video") return "Next";
        if (currentStep === "data") return "Next";
        if (currentStep === "Practive Exercise") return "Tool";
        if (currentStep === "Tool") return "Quiz";
        if (currentStep === "Quiz") return "Finish & Next";
        return "Continue";
    };

    const goToNextStep = () => {
        if (!isLastStep) {
            if (!completedSteps.includes(currentStep)) {
                addCompletedStep(currentStep);
            }
            setCurrentStep(learingSteps[currentIndex + 1].label);
        } else {
            if (!completedSteps.includes(currentStep)) {
                addCompletedStep(currentStep);
            }

            const currentTopicIdx = currentTopicNumber - 1;
            const nextTopicIdx = currentTopicIdx + 1;

            if (topicsList[nextTopicIdx]) {
                const nextTitle = topicsList[nextTopicIdx];
                const nextNumber = nextTopicIdx + 1;

                if (onNextTopic) {
                    onNextTopic(nextTitle, nextNumber);
                }
                // Set initial step based on available content
                const initialStep = subHeader.length > 0 ? subHeader[0].toLowerCase() === 'videos' ? 'video' : 'data' : 'video';
                setCurrentStep(initialStep);
                resetLearningSteps();
            } else {
                // ✅ Chapter finished
                setModalOpen(true);
            }
        }
    };

    const restartCurrentStep = () => {
        incrementStepResetKey();
    };

    const activeStep = learingSteps[currentIndex];

    // Show loader if no steps are available
    if (learingSteps.length === 0) {
        return (
            <LearingViewStepaCard>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <CircularProgress />
                    <Typography variant="body1" color="text.secondary">
                        Loading learning content...
                    </Typography>
                </Box>
            </LearingViewStepaCard>
        );
    }

    return (
        <>
            <LearingViewStepaCard>
                <LearingStepsButtons>
                    {learingSteps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = currentStep === step.label;
                        const isCompleted = completedSteps.includes(step.label);

                        return (
                            <RoundedCornerButton
                                key={index}
                                className={`step_rounded_btn 
                                    ${isActive ? "active" : ""} 
                                    ${isCompleted ? "completed" : ""}`}
                            >
                                <StepIcon />
                                {step.label}
                            </RoundedCornerButton>
                        );
                    })}
                </LearingStepsButtons>

                <LearningBodyContent key={stepResetKey} style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                    {(() => {
                        // Determine what to show based on learningStepMode
                        if (learningStepMode === 'tool') {
                            // Force show tool if available, otherwise show regular content
                            if (activeTool?.name) {
                                return (
                                    <div style={{ flex: '1 1 auto', height: '100%' }}>
                                        {(() => {
                                            const toolPayload = activeTool?.payload as ToolPayload;
                                            const externalPatterns = toolPayload?.patterns;
                                            const mode = toolPayload?.mode;
                                            const sessionId = toolPayload?.sessionId;
                                            const toolId = toolPayload?.toolId?.toString();
                                            const currentPatternIndex = toolPayload?.currentPatternIndex;
                                            const initialAutoAdvance = (toolPayload as ToolPayload)?.initialAutoAdvance;

                                            // Render appropriate tool based on activeTool name
                                            if (activeTool?.name === 'NumberPattern') {
                                                return (
                                                    <NumberPatternsApp
                                                        externalPatterns={externalPatterns}
                                                        mode={mode}
                                                        currentPatternIndex={currentPatternIndex}
                                                        setCurrentPatternIndex={(index: number) => dispatch(setCurrentPatternIndex(index))}
                                                        initialAutoAdvance={initialAutoAdvance}
                                                        sessionId={sessionId}
                                                        toolId={toolId}
                                                    />
                                                );
                                            } else if (activeTool?.name === 'NumberLine') {
                                                const externalSteps = toolPayload?.steps;
                                                const question = toolPayload?.question;
                                                return (
                                                    <NumberLineTool
                                                        steps={externalSteps}
                                                        mode={mode}
                                                        sessionId={sessionId}
                                                        toolId={toolId}
                                                        question={question}
                                                    />
                                                );
                                            }

                                            // Fallback for unknown tools
                                            return (
                                                <div>Unknown tool: {activeTool?.name}</div>
                                            );
                                        })()}
                                    </div>
                                );
                            } else {
                                // No tool available, show regular content
                                return (
                                    <div style={{ flex: '1 1 auto' }}>
                                        {activeStep?.component}
                                    </div>
                                );
                            }
                        } else if (learningStepMode === 'agent') {
                            // Force show agent (messages) if available, otherwise show regular content
                            if (chatMessages && chatMessages.length > 0) {
                                return (
                                    <div style={{ flex: '1 1 auto', height: '100%', minHeight: '350px', maxHeight: '700px', overflow: 'hidden' }}>
                                        <AIResponseComponent messages={chatMessages} />
                                    </div>
                                );
                            } else {
                                // No messages available, show regular content
                                return (
                                    <div style={{ flex: '1 1 auto' }}>
                                        {activeStep?.component}
                                    </div>
                                );
                            }
                        } else {
                            // Auto mode - use the original logic
                            if (activeTool?.name) {
                                // Load the tool when activeTool exists
                                return (
                                    <div style={{ flex: '1 1 auto', height: '100%' }}>
                                        {(() => {
                                            const toolPayload = activeTool?.payload as ToolPayload;
                                            const externalPatterns = toolPayload?.patterns;
                                            const mode = toolPayload?.mode;
                                            const sessionId = toolPayload?.sessionId;
                                            const toolId = toolPayload?.toolId?.toString();
                                            const currentPatternIndex = toolPayload?.currentPatternIndex;
                                            const initialAutoAdvance = (toolPayload as ToolPayload)?.initialAutoAdvance;

                                            // Render appropriate tool based on activeTool name
                                            if (activeTool?.name === 'NumberPattern') {
                                                return (
                                                    <NumberPatternsApp
                                                        externalPatterns={externalPatterns}
                                                        mode={mode}
                                                        currentPatternIndex={currentPatternIndex}
                                                        setCurrentPatternIndex={(index: number) => dispatch(setCurrentPatternIndex(index))}
                                                        initialAutoAdvance={initialAutoAdvance}
                                                        sessionId={sessionId}
                                                        toolId={toolId}
                                                    />
                                                );
                                            } else if (activeTool?.name === 'NumberLine') {
                                                const externalSteps = toolPayload?.steps;
                                                const question = toolPayload?.question;
                                                return (
                                                    <NumberLineTool
                                                        steps={externalSteps}
                                                        mode={mode}
                                                        sessionId={sessionId}
                                                        toolId={toolId}
                                                        question={question}
                                                    />
                                                );
                                            }

                                            // Fallback for unknown tools
                                            return (
                                                <div>Unknown tool: {activeTool?.name}</div>
                                            );
                                        })()}
                                    </div>
                                );
                            } else if (chatMessages && chatMessages.length > 0) {
                                // Show chat messages when no tool is active
                                return (
                                    <div style={{ flex: '1 1 auto', height: '100%', minHeight: '350px', maxHeight: '700px', overflow: 'hidden' }}>
                                        <AIResponseComponent messages={chatMessages} />
                                    </div>
                                );
                            } else {
                                // Show regular learning step content
                                return (
                                    <div style={{ flex: '1 1 auto' }}>
                                        {activeStep?.component}
                                    </div>
                                );
                            }
                        }
                    })()}
                </LearningBodyContent>

                <LearingFooter>
                    <Button
                        direction="left"
                        color='primary'
                        label={"Learn Again"}
                        leftIcon={<MdRestartAlt />}
                        onClick={restartCurrentStep}
                    />
                    <Button
                        color='secondary'
                        label={getFooterButtonText()}
                        onClick={goToNextStep}
                    />
                </LearingFooter>
            </LearingViewStepaCard>
            0
            {/* ✅ Chapter Completed Modal */}
            <ModalPopup
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                onCancel={() => {
                    setModalOpen(false);
                    if (onChapterComplete) onChapterComplete("exam"); // ✅ exam flow
                }}
                onConfirm={() => {
                    setModalOpen(false);
                    if (onChapterComplete) onChapterComplete("nextChapter"); // ✅ next chapter flow
                }}
                type="save"
                title="chapter"
                name="This chapter is completed!"
                confirmText="Next Chapter"
                cancelText="Give Exam"
            />
        </>
    );
};

export default LearningSteps;
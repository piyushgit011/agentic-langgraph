import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAIFeedbackMessage, pauseAutoAdvance } from '../../store/slices/studySlice';
import { agentAPI } from '../../services/apiService';
import { RootState } from '../../store/store';

// Types
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

interface Step {
    step: string;
    explanation: string;
    visualization: Visualization;
    result: string;
}

interface NumberLineToolProps {
    steps?: Step[];
    width?: number;
    height?: number;
    mode?: string;
    sessionId?: string;
    toolId?: string;
    question?: string;
}

const NumberLineTool: React.FC<NumberLineToolProps> = ({
    steps: propSteps,
    width = 900,
    height = 200,
    mode = 'practice',
    sessionId,
    toolId,
    question
}) => {
    const dispatch = useDispatch();

    // Redux selectors
    const { autoAdvance: reduxAutoAdvance } = useSelector((state: RootState) => state.study);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [steps, setSteps] = useState<Step[]>(propSteps || []);
    const [clickedNumbers, setClickedNumbers] = useState<number[]>([0]);
    const [AiFeedback, setAiFeedback] = useState<string>("");
    const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
    const [localAutoAdvance, setLocalAutoAdvance] = useState(true);
    const autoAdvanceIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [countdown, setCountdown] = useState(5);

    // Use Redux auto-advance state if available, otherwise use local state
    const autoAdvance = reduxAutoAdvance !== undefined ? reduxAutoAdvance : localAutoAdvance;

    // Function to pause auto-advance (used when user interacts with AI Tutor chat)
    const pauseAutoAdvanceLocal = useCallback((): void => {
        if (reduxAutoAdvance !== undefined) {
            dispatch(pauseAutoAdvance());
        } else {
            setLocalAutoAdvance(false);
        }
    }, [reduxAutoAdvance, dispatch]);

    // Function to resume auto-advance
    const resumeAutoAdvanceLocal = useCallback((): void => {
        if (reduxAutoAdvance !== undefined) {
            dispatch({ type: 'study/resumeAutoAdvance' });
        } else {
            setLocalAutoAdvance(true);
        }

        // Log resume event to AI Tutor chat
        if (toolId && sessionId) {
            const resumeMessage = {
                id: `auto_resume_${Date.now()}_${Math.random()}`,
                patternName: 'Number Line Learning',
                patternKey: 'numberLine',
                feedback: 'Auto-advance resumed - continuing with step progression',
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                userAnswer: ['Auto-advance resumed'],
                correctSequence: [`Current step: ${currentIndex + 1}/${steps.length}`]
            };

            dispatch(addAIFeedbackMessage(resumeMessage));
        }
    }, [reduxAutoAdvance, dispatch, toolId, sessionId, currentIndex, steps.length]);


    // Monitor Redux auto-advance state changes and sync with local state
    useEffect(() => {
        if (reduxAutoAdvance !== undefined && !reduxAutoAdvance) {
            // Auto-advance was paused (likely due to AI Tutor chat interaction)
            setLocalAutoAdvance(false);

            // Log this event to AI Tutor chat
            if (toolId && sessionId) {
                const pauseMessage = {
                    id: `auto_pause_chat_${Date.now()}_${Math.random()}`,
                    patternName: 'Number Line Learning',
                    patternKey: 'numberLine',
                    feedback: 'Auto-advance paused due to AI Tutor chat interaction',
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }),
                    userAnswer: ['Auto-advance paused'],
                    correctSequence: [`Current step: ${currentIndex + 1}/${steps.length}`]
                };

                dispatch(addAIFeedbackMessage(pauseMessage));
            }
        }
    }, [reduxAutoAdvance, toolId, sessionId, currentIndex, steps.length, dispatch]);


    // Default example steps if none provided
    const defaultSteps: Step[] = propSteps || [
        {
            step: "Step 1",
            explanation: "Start at 0.",
            visualization: {
                rangeStart: 0,
                rangeEnd: 20,
                interval: 1,
                draggableMarkerPosition: 0,
                jumpSize: 5,
                operationType: "add",
                tickMarksVisible: true,
                numberLabelsVisible: true,
                orientation: "horizontal",
                colorScheme: "Primary",
                direction: "Right",
            },
            result: "",
        },
        {
            step: "Step 2",
            explanation: "Jump forward by 5.",
            visualization: {
                rangeStart: 0,
                rangeEnd: 20,
                interval: 1,
                draggableMarkerPosition: 5,
                jumpSize: 5,
                operationType: "add",
                tickMarksVisible: true,
                numberLabelsVisible: true,
                orientation: "horizontal",
                colorScheme: "Primary",
                direction: "Right",
            },
            result: "",
        },
        {
            step: "Step 3",
            explanation: "Jump forward by 1.",
            visualization: {
                rangeStart: 0,
                rangeEnd: 20,
                interval: 1,
                draggableMarkerPosition: 6,
                jumpSize: 6,
                operationType: "add",
                tickMarksVisible: true,
                numberLabelsVisible: true,
                orientation: "horizontal",
                colorScheme: "Primary",
                direction: "Right",
            },
            result: "",
        },
        {
            step: "Step 4",
            explanation: "Jump forward by 1.",
            visualization: {
                rangeStart: 0,
                rangeEnd: 20,
                interval: 1,
                draggableMarkerPosition: 7,
                jumpSize: 1,
                operationType: "add",
                tickMarksVisible: true,
                numberLabelsVisible: true,
                orientation: "horizontal",
                colorScheme: "Primary",
                direction: "Right",
            },
            result: "",
        },
        {
            step: "Step 5",
            explanation: "Jump forward by 1.",
            visualization: {
                rangeStart: 0,
                rangeEnd: 20,
                interval: 1,
                draggableMarkerPosition: 8,
                jumpSize: 1,
                operationType: "add",
                tickMarksVisible: true,
                numberLabelsVisible: true,
                orientation: "horizontal",
                colorScheme: "Primary",
                direction: "Right",
            },
            result: "",
        },
        {
            step: "Step 6",
            explanation: "Jump forward by 1.",
            visualization: {
                rangeStart: 0,
                rangeEnd: 20,
                interval: 1,
                draggableMarkerPosition: 9,
                jumpSize: 1,
                operationType: "add",
                tickMarksVisible: true,
                numberLabelsVisible: true,
                orientation: "horizontal",
                colorScheme: "Primary",
                direction: "Right",
            },
            result: "",
        },
        {
            step: "Step 7",
            explanation: "Jump forward by another 1.",
            visualization: {
                rangeStart: 0,
                rangeEnd: 20,
                interval: 1,
                draggableMarkerPosition: 10,
                jumpSize: 1,
                operationType: "add",
                tickMarksVisible: true,
                numberLabelsVisible: true,
                orientation: "horizontal",
                colorScheme: "Primary",
                direction: "Right",
            },
            result: "10",
        },
    ];

    // Function to validate and normalize steps data
    const validateSteps = useCallback((stepsData: unknown[]): Step[] => {
        if (!Array.isArray(stepsData)) {
            console.warn('Steps data is not an array:', stepsData);
            return defaultSteps;
        }

        return stepsData.map((step, index) => {
            if (!step || typeof step !== 'object') {
                console.warn(`Step at index ${index} is invalid:`, step);
                return defaultSteps[index] || defaultSteps[0];
            }

            // Type assertion for step object
            const stepObj = step as Record<string, unknown>;

            // Ensure visualization object exists and has required properties
            const visualization = (stepObj.visualization as Record<string, unknown>) || {};
            const normalizedStep: Step = {
                step: (stepObj.step as string) || `Step ${index + 1}`,
                explanation: (stepObj.explanation as string) || '',
                result: (stepObj.result as string) || '',
                visualization: {
                    rangeStart: typeof visualization.rangeStart === 'number' ? visualization.rangeStart : 0,
                    rangeEnd: typeof visualization.rangeEnd === 'number' ? visualization.rangeEnd : 20,
                    interval: typeof visualization.interval === 'number' ? visualization.interval : 1,
                    draggableMarkerPosition: typeof visualization.draggableMarkerPosition === 'number' ? visualization.draggableMarkerPosition : 0,
                    jumpSize: typeof visualization.jumpSize === 'number' ? visualization.jumpSize : 1,
                    operationType: (visualization.operationType as string) || 'add',
                    tickMarksVisible: typeof visualization.tickMarksVisible === 'boolean' ? visualization.tickMarksVisible : true,
                    numberLabelsVisible: typeof visualization.numberLabelsVisible === 'boolean' ? visualization.numberLabelsVisible : true,
                    orientation: (visualization.orientation as string) || 'Horizontal',
                    colorScheme: (visualization.colorScheme as string) || 'Primary',
                    direction: (visualization.direction as string) || 'Right'
                }
            };

            return normalizedStep;
        });
    }, []);

    // Initialize steps if none provided
    useEffect(() => {
        if (!propSteps || propSteps.length === 0) {
            setSteps(defaultSteps);
        } else {
            const validatedSteps = validateSteps(propSteps);
            setSteps(validatedSteps);
        }

        // Log tool initialization to AI Tutor chat
        if (toolId && sessionId) {
            const initMessage = {
                id: `tool_init_${Date.now()}_${Math.random()}`,
                patternName: 'Number Line Tool',
                patternKey: 'numberLine',
                feedback: `Number Line Tool loaded with ${steps.length || defaultSteps.length} learning steps. Mode: ${mode}`,
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                userAnswer: [`Tool initialized`],
                correctSequence: [`${steps.length || defaultSteps.length} steps available`]
            };

            dispatch(addAIFeedbackMessage(initMessage));
        }
    }, [propSteps, toolId, sessionId, mode, steps.length, dispatch, validateSteps]);

    // Handle propSteps changes (when new tool response comes in)
    useEffect(() => {
        if (propSteps && propSteps.length > 0) {
            const validatedSteps = validateSteps(propSteps);
            setSteps(validatedSteps);
            setCurrentIndex(0); // Reset to first step when new data comes in
        }
    }, [propSteps, validateSteps]);

    // Navigation helper functions
    const canGoToPrevious = useCallback((): boolean => {
        return currentIndex > 0;
    }, [currentIndex]);

    const canGoToNext = useCallback((): boolean => {
        return currentIndex < steps.length - 1;
    }, [currentIndex, steps.length]);

    const handlePreviousStep = useCallback((): void => {
        if (canGoToPrevious()) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);

            // Log step navigation to AI Tutor chat
            if (toolId && sessionId) {
                const previousStep = steps[prevIndex];

                const stepNavigationMessage = {
                    id: `step_nav_${Date.now()}_${Math.random()}`,
                    patternName: 'Number Line Learning',
                    patternKey: 'numberLine',
                    feedback: `Navigated back to: ${previousStep.step} - ${previousStep.explanation}`,
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }),
                    userAnswer: [`Step ${prevIndex + 1} accessed`],
                    correctSequence: [`Progress: ${prevIndex + 1}/${steps.length} steps`]
                };

                dispatch(addAIFeedbackMessage(stepNavigationMessage));
            }
        }
    }, [canGoToPrevious, currentIndex, steps, toolId, sessionId, dispatch]);

    const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
        if (mode !== 'practice') return;

        // Pause auto-advance when user starts interacting with the tool
        if (autoAdvance && mode === 'practice') {
            pauseAutoAdvanceLocal();
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if click is near a number label
        const padding = 40;
        const lineY = 100;
        const canvasWidth = width - padding * 2;
        const rangeStart = 0;
        const rangeEnd = 20;
        const interval = 1;
        const totalTicks = Math.floor((rangeEnd - rangeStart) / interval);
        const spacing = canvasWidth / totalTicks;

        for (let i = 0; i <= totalTicks; i++) {
            const labelX = padding + i * spacing;
            const labelY = lineY + 25;
            const currentValue = rangeStart + i * interval;

            // Check if click is within clickable area of the number
            if (Math.abs(x - labelX) < 15 && Math.abs(y - labelY) < 15) {

                // Add the clicked number to the sequence if it's not already the last one
                setClickedNumbers(prev => {
                    const lastNumber = prev[prev.length - 1];
                    if (currentValue !== lastNumber) {
                        return [...prev, currentValue];
                    }
                    return prev;
                });

                // Make API call to tool-answer-checker
                if (toolId && sessionId) {
                    setIsCheckingAnswer(true);
                    const requestBody = {
                        toolId: toolId.toString(),
                        sessionId: sessionId,
                        question: `Number Line Sequence`,
                        answer: `Student answered: [${clickedNumbers.join(', ')}, ${currentValue}]`
                    };

                    agentAPI.toolAnswerChecker(requestBody)
                        .then(response => {
                            // Set AI feedback if available
                            if (response.data) {
                                // The API returns the feedback directly in response.data
                                setAiFeedback(response.data);

                                // Dispatch the feedback message to Redux store for AI Tutor chat
                                const feedbackMessage = {
                                    id: `feedback_${Date.now()}_${Math.random()}`,
                                    patternName: 'Number Line Sequence',
                                    patternKey: 'numberLine',
                                    feedback: response.data,
                                    timestamp: new Date().toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    }),
                                    userAnswer: [...clickedNumbers, currentValue],
                                    correctSequence: [0, 5, 6, 7, 8, 9, 10] // Example correct sequence
                                };

                                dispatch(addAIFeedbackMessage(feedbackMessage));
                            }
                        })
                        .catch(error => {
                            console.error('Error calling tool answer checker:', error);
                            setAiFeedback("Sorry, I couldn't analyze your answer right now. Please try again!");
                        })
                        .finally(() => {
                            setIsCheckingAnswer(false);
                        });
                }

                break;
            }
        }
    }, [mode, width, toolId, sessionId, clickedNumbers]);

    const handleNextStep = useCallback((): void => {
        if (canGoToNext()) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);

            // Log step completion to AI Tutor chat
            if (toolId && sessionId) {
                const currentStep = steps[currentIndex];
                const nextStep = steps[nextIndex];

                const stepCompletionMessage = {
                    id: `step_${Date.now()}_${Math.random()}`,
                    patternName: 'Number Line Learning',
                    patternKey: 'numberLine',
                    feedback: `Completed: ${currentStep.step} - ${currentStep.explanation}. Moving to: ${nextStep.step}`,
                    timestamp: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    }),
                    userAnswer: [`Step ${currentIndex + 1} completed`],
                    correctSequence: [`Progress: ${currentIndex + 1}/${steps.length} steps`]
                };

                dispatch(addAIFeedbackMessage(stepCompletionMessage));
            }
        }
    }, [canGoToNext, currentIndex, steps, toolId, sessionId, dispatch]);

    // Draw functions
    const drawMarker = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, colorScheme: string) => {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = colorScheme === "Primary" ? "blue" : "green";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
    }, []);

    const drawCurvedArrow = useCallback((
        ctx: CanvasRenderingContext2D,
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        direction: string
    ) => {
        const dir = (direction || "Right").toLowerCase();
        const color = dir === "primary" ? "green" : "green";

        const midX = (fromX + toX) / 2;
        const controlY = fromY + (dir === "left" ? 30 : -30);

        // Draw curved line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(midX, controlY, toX, toY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw arrowhead
        const headlen = 10;
        const angle = Math.atan2(toY - controlY, toX - midX);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
            toX - headlen * Math.cos(angle - Math.PI / 6),
            toY - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            toX - headlen * Math.cos(angle + Math.PI / 6),
            toY - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.lineTo(toX, toY);
        ctx.fillStyle = color;
        ctx.fill();
    }, []);

    const animateArrow = useCallback((
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        direction: string
    ) => {
        const dx = (x2 - x1) / 20;
        let frame = 0;

        const drawFrame = () => {
            // Only clear a strip above the number line
            ctx.clearRect(0, y1 - 20, width, 40);

            // Redraw static parts
            drawStep(currentIndex, true);

            const xCurrent = x1 + dx * frame;
            drawCurvedArrow(ctx, x1, y1, xCurrent, y2, direction);

            frame++;
            if (xCurrent < x2) {
                requestAnimationFrame(drawFrame);
            } else {
                drawStep(currentIndex, true);
                drawCurvedArrow(ctx, x1, y1, x2, y2, direction);
            }
        };

        drawFrame();
    }, [currentIndex, width]);

    const drawAllArrowsUpToStep = useCallback((ctx: CanvasRenderingContext2D, stepIndex: number) => {
        const currentStep = steps[stepIndex];
        if (!currentStep || !currentStep.visualization) {
            console.warn('Current step or visualization is undefined at index:', stepIndex);
            return;
        }

        const rangeStart = currentStep.visualization.rangeStart;
        const interval = currentStep.visualization.interval;
        const padding = 40;
        const lineY = 100;
        const canvasWidth = width - padding * 2;
        const spacing = canvasWidth / Math.floor((currentStep.visualization.rangeEnd - rangeStart) / interval);

        for (let i = 1; i <= stepIndex; i++) {
            const prevStep = steps[i - 1];
            const currStep = steps[i];

            if (!prevStep || !prevStep.visualization || !currStep || !currStep.visualization) {
                console.warn('Previous or current step visualization is undefined at index:', i);
                continue;
            }

            const prevViz = prevStep.visualization;
            const currViz = currStep.visualization;

            const from = prevViz.draggableMarkerPosition;
            const to = currViz.draggableMarkerPosition;

            const fromX = padding + ((from - rangeStart) / interval) * spacing;
            const toX = padding + ((to - rangeStart) / interval) * spacing;

            drawCurvedArrow(
                ctx,
                fromX,
                lineY - 30,
                toX,
                lineY - 30,
                currViz.direction
            );
        }
    }, [steps, width]);

    const drawStep = useCallback((index: number, skipAnimation = false) => {
        if (!canvasRef.current || steps.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const step = steps[index];
        if (!step || !step.visualization) {
            console.warn('Step or visualization is undefined at index:', index);
            return;
        }
        const viz = step.visualization;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const padding = 40;
        const lineY = 100;
        const canvasWidth = width - padding * 2;
        const totalTicks = Math.floor((viz.rangeEnd - viz.rangeStart) / viz.interval) || 20;
        const spacing = canvasWidth / totalTicks;

        // Draw number line
        ctx.beginPath();
        ctx.moveTo(padding, lineY);
        ctx.lineTo(padding + spacing * totalTicks, lineY);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tick marks and labels
        for (let i = 0; i <= totalTicks; i++) {
            const x = padding + i * spacing;
            if (viz.tickMarksVisible) {
                ctx.beginPath();
                ctx.moveTo(x, lineY - 10);
                ctx.lineTo(x, lineY + 10);
                ctx.strokeStyle = viz.colorScheme === "Primary" ? "blue" : "green";
                ctx.stroke();
            }
            if (viz.numberLabelsVisible) {
                ctx.font = "14px Arial";
                const currentValue = viz.rangeStart + i * viz.interval;

                // Use red color for the final step's position
                const isFinalStep = index === steps.length - 1 && currentValue === step.visualization?.draggableMarkerPosition;

                ctx.fillStyle = isFinalStep
                    ? "red"
                    : viz.colorScheme === "Primary"
                        ? "blue"
                        : "green";

                ctx.textAlign = "center";
                ctx.fillText(currentValue.toString(), x, lineY + 25);
            }
        }

        // Draw marker
        const markerX = padding + ((viz.draggableMarkerPosition - viz.rangeStart) / viz.interval) * spacing;
        const isFinalStep = index === steps.length - 1;
        const markerColor = isFinalStep ? "red" : "blue";
        drawMarker(ctx, markerX, lineY, markerColor);

        // Draw result only on final step
        if (index === steps.length - 1 && step.result) {
            const resultX = padding + ((parseInt(step.result) - viz.rangeStart) / viz.interval) * spacing;
            ctx.beginPath();
            ctx.arc(resultX, lineY, 10, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Result", resultX, lineY - 20);
        }

        // Draw arrows
        if (index === steps.length - 1) {
            drawAllArrowsUpToStep(ctx, index);
        } else if (index > 0) {
            const prevStep = steps[index - 1];
            if (prevStep && prevStep.visualization) {
                const fromValue = prevStep.visualization.draggableMarkerPosition;
                const fromX = padding + ((fromValue - viz.rangeStart) / viz.interval) * spacing;
                const toX = markerX;

                if (!skipAnimation) {
                    animateArrow(ctx, fromX, lineY - 30, toX, lineY - 30, viz.direction);
                } else {
                    drawCurvedArrow(ctx, fromX, lineY - 30, toX, lineY - 30, viz.direction);
                }
            }
        }
    }, [steps, width, height, drawMarker, drawCurvedArrow, animateArrow, drawAllArrowsUpToStep]);

    // Updated practice mode drawing function with progressive arcs
    const drawPracticeMode = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        const padding = 40;
        const lineY = 100;
        const canvasWidth = width - padding * 2;
        const rangeStart = 0;
        const rangeEnd = 20;
        const interval = 1;
        const totalTicks = Math.floor((rangeEnd - rangeStart) / interval);
        const spacing = canvasWidth / totalTicks;

        // Draw number line
        ctx.beginPath();
        ctx.moveTo(padding, lineY);
        ctx.lineTo(padding + spacing * totalTicks, lineY);
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw tick marks and number labels
        for (let i = 0; i <= totalTicks; i++) {
            const x = padding + i * spacing;
            const currentValue = rangeStart + i * interval;

            // Draw tick mark
            ctx.beginPath();
            ctx.moveTo(x, lineY - 10);
            ctx.lineTo(x, lineY + 10);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Draw number label
            ctx.font = "14px Arial";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.fillText(currentValue.toString(), x, lineY + 25);
        }

        // Draw all progressive arcs and markers for clicked numbers
        if (clickedNumbers.length > 1) {
            for (let i = 1; i < clickedNumbers.length; i++) {
                const fromNumber = clickedNumbers[i - 1];
                const toNumber = clickedNumbers[i];

                const fromX = padding + ((fromNumber - rangeStart) / interval) * spacing;
                const toX = padding + ((toNumber - rangeStart) / interval) * spacing;

                // Draw arc between consecutive numbers
                drawCurvedArrow(ctx, fromX, lineY - 30, toX, lineY - 30, "Right");

                // Draw marker at each clicked position
                ctx.beginPath();
                ctx.arc(toX, lineY, 8, 0, 2 * Math.PI);
                ctx.fillStyle = "green";
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#fff";
                ctx.stroke();
            }
        }

        // Draw starting marker at position 0
        const startX = padding + ((0 - rangeStart) / interval) * spacing;
        ctx.beginPath();
        ctx.arc(startX, lineY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
    }, [width, height, clickedNumbers, drawCurvedArrow]);

    // Auto-advance functionality for teach mode
    useEffect(() => {
        if (mode === 'teach' && autoAdvance && currentIndex < steps.length - 1) {
            // Reset countdown to 5
            setCountdown(5);

            // Clear any existing interval
            if (autoAdvanceIntervalRef.current) {
                clearTimeout(autoAdvanceIntervalRef.current);
            }

            // Set new interval for 5 seconds
            autoAdvanceIntervalRef.current = setTimeout(() => {
                if (currentIndex < steps.length - 1) {
                    const nextIndex = currentIndex + 1;
                    setCurrentIndex(nextIndex);

                    // Log auto-advance step completion to AI Tutor chat
                    if (toolId && sessionId) {
                        const currentStep = steps[currentIndex];
                        const nextStep = steps[nextIndex];

                        const autoAdvanceMessage = {
                            id: `auto_advance_${Date.now()}_${Math.random()}`,
                            patternName: 'Number Line Learning',
                            patternKey: 'numberLine',
                            feedback: `Auto-advanced from: ${currentStep.step} to: ${nextStep.step} - ${nextStep.explanation}`,
                            timestamp: new Date().toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            }),
                            userAnswer: [`Auto-advanced to step ${nextIndex + 1}`],
                            correctSequence: [`Progress: ${nextIndex + 1}/${steps.length} steps`]
                        };

                        dispatch(addAIFeedbackMessage(autoAdvanceMessage));
                    }
                }
            }, 5000);
        }

        // Cleanup function
        return () => {
            if (autoAdvanceIntervalRef.current) {
                clearTimeout(autoAdvanceIntervalRef.current);
            }
        };
    }, [currentIndex, mode, autoAdvance, steps.length]);

    // Countdown timer effect
    useEffect(() => {
        if (mode === 'teach' && autoAdvance && currentIndex < steps.length - 1 && countdown > 0) {
            const countdownInterval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        return 5; // Reset to 5 when it reaches 0
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [mode, autoAdvance, currentIndex, steps.length, countdown]);

    // Draw step when currentIndex changes (for teach mode)
    useEffect(() => {
        if (mode === 'teach') {
            drawStep(currentIndex);
        }
    }, [currentIndex, drawStep, mode]);

    // Draw practice mode when component mounts or mode changes
    useEffect(() => {
        if (mode === 'practice') {
            drawPracticeMode();
        }
    }, [mode, drawPracticeMode, clickedNumbers]);

    // Handle canvas resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = width;
                if (mode === 'practice') {
                    drawPracticeMode();
                } else {
                    drawStep(currentIndex);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [width, currentIndex, drawStep, mode, drawPracticeMode]);

    if (mode === 'teach' && steps.length === 0) {
        return <div>Loading...</div>;
    }

    if (mode === 'teach') {
        const currentStep = steps[currentIndex];
        return (
            <div style={{ maxWidth: width, margin: 'auto', textAlign: 'center' }}>

                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    style={{ border: '1px solid #ccc' }}
                />
                <div style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '16px', marginTop: '5px' }}>
                        <strong>{currentStep?.step}</strong><br />
                        {currentStep?.explanation}
                        {currentStep?.result && currentStep?.result.trim() !== "" && (
                            <>
                                <br /><strong>Result:</strong> {currentStep?.result}
                            </>
                        )}
                    </p>
                    <div style={{ marginTop: '10px' }}>
                        <button
                            onClick={handlePreviousStep}
                            disabled={!canGoToPrevious()}
                            style={{
                                padding: '8px 16px',
                                margin: '0 5px',
                                fontSize: '14px',
                                cursor: !canGoToPrevious() ? 'not-allowed' : 'pointer',
                                opacity: !canGoToPrevious() ? 0.6 : 1,
                                backgroundColor: !canGoToPrevious() ? '#ccc' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            ⬅️ Previous
                        </button>
                        <button
                            onClick={handleNextStep}
                            disabled={!canGoToNext()}
                            style={{
                                padding: '8px 16px',
                                margin: '0 5px',
                                fontSize: '14px',
                                cursor: !canGoToNext() ? 'not-allowed' : 'pointer',
                                opacity: !canGoToNext() ? 0.6 : 1,
                                backgroundColor: !canGoToNext() ? '#ccc' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Next ➡️
                        </button>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <button
                            onClick={() => {
                                if (autoAdvance) {
                                    // Pause auto-advance
                                    if (reduxAutoAdvance !== undefined) {
                                        dispatch(pauseAutoAdvance());
                                    } else {
                                        setLocalAutoAdvance(false);
                                    }
                                } else {
                                    // Resume auto-advance
                                    if (reduxAutoAdvance !== undefined) {
                                        // Redux will handle this automatically
                                    } else {
                                        setLocalAutoAdvance(true);
                                    }
                                }

                                // Log auto-advance toggle to AI Tutor chat
                                if (toolId && sessionId) {
                                    const toggleMessage = {
                                        id: `auto_toggle_${Date.now()}_${Math.random()}`,
                                        patternName: 'Number Line Learning',
                                        patternKey: 'numberLine',
                                        feedback: `Auto-advance ${!autoAdvance ? 'enabled' : 'disabled'} for step progression`,
                                        timestamp: new Date().toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        }),
                                        userAnswer: [`Auto-advance ${!autoAdvance ? 'ON' : 'OFF'}`],
                                        correctSequence: [`Current step: ${currentIndex + 1}/${steps.length}`]
                                    };

                                    dispatch(addAIFeedbackMessage(toggleMessage));
                                }
                            }}
                            style={{
                                padding: '8px 16px',
                                margin: '0 5px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                backgroundColor: autoAdvance ? '#dc3545' : '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            {autoAdvance ? '⏸️ Pause Auto-Advance' : '▶️ Resume Auto-Advance'}
                        </button>
                        {autoAdvance && currentIndex < steps.length - 1 && (
                            <span style={{
                                fontSize: '12px',
                                color: '#666',
                                marginLeft: '10px',
                                padding: '4px 8px',
                                backgroundColor: '#e9ecef',
                                borderRadius: '4px'
                            }}>
                                ⏱️ Auto-advancing in {countdown}s
                            </span>
                        )}
                        {!autoAdvance && (
                            <button
                                onClick={resumeAutoAdvanceLocal}
                                style={{
                                    padding: '8px 16px',
                                    margin: '0 5px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                ▶️ Continue Auto-Advance
                            </button>
                        )}
                    </div>
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        Step {currentIndex + 1} of {steps.length}
                    </div>
                </div>
            </div>
        );
    }

    // Practice mode - simple number line
    return (
        <div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            <div style={{ padding: '20px' }}>
                <p>Click on the number line to create a sequence {question}</p>
                {clickedNumbers.length > 1 && (
                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#333' }}>
                        <strong>Your sequence:</strong> {clickedNumbers.join(' → ')}
                    </div>
                )}
            </div>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{
                    border: '1px solid #ccc',
                    cursor: 'pointer'
                }}
                onClick={handleCanvasClick}
            />

            {/* AI Feedback Display */}
            {isCheckingAnswer ? (
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'linear-gradient(to right, #dbeafe, #e0e7ff)',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                border: '2px solid #3b82f6',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <div style={{
                                position: 'absolute',
                                inset: '0',
                                borderRadius: '50%',
                                border: '2px solid #dbeafe'
                            }}></div>
                        </div>
                        <div>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1d4ed8' }}>
                                🤖 AI is analyzing your answer...
                            </span>
                            <p style={{ fontSize: '12px', color: '#3b82f6', margin: '4px 0 0 0' }}>
                                This will take just a moment
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                AiFeedback && (
                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        background: 'linear-gradient(to right, #dcfce7, #d1fae5)',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#166534',
                            margin: '0 0 8px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '20px' }}>🤖</span>
                            AI Feedback
                        </h4>
                        <div style={{
                            fontSize: '14px',
                            color: '#166534',
                            lineHeight: '1.5'
                        }}>
                            {AiFeedback}
                        </div>
                    </div>
                )
            )}

            {/* Empty state when no feedback */}
            {!isCheckingAnswer && !AiFeedback && (
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '14px', color: '#475569' }}>
                        <span style={{ fontSize: '20px' }}>💡</span>
                        <p style={{ margin: '8px 0 0 0' }}>Click on the number line to get AI feedback!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NumberLineTool;
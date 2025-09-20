import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveToolState {
    name: string | null;
    payload: unknown | null;
}

interface AIFeedbackMessage {
    id: string;
    patternName: string;
    patternKey: string;
    feedback: string;
    timestamp: string;
    userAnswer: (string | number)[];
    correctSequence: (string | number)[];
}

interface ChatMessage {
    id: number;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
    isPatternMessage?: boolean;
    isAIFeedback?: boolean;
}

interface StudyState {
    subjectId: string | null;
    subjectName: string | null;
    chapterId: string | null;
    chapterName: string | null;
    topicId: string | null;
    topicName: string | null;
    // Learning Steps State
    learningSteps: {
        currentStep: string;
        completedSteps: string[];
        stepResetKey: number;
        isModalOpen: boolean;
        topicsList: string[];
        currentTopicNumber: number;
    };
    activeTool: ActiveToolState;
    currentPatternIndex: number;
    aiFeedbackMessages: AIFeedbackMessage[];
    autoAdvance: boolean; // Added auto-advance state
    chatMessages: ChatMessage[]; // Added chat messages state
    learningStepMode: 'tool' | 'agent' | 'auto'; // Controls whether to show tool or agent in LearningSteps
}

const initialState: StudyState = {
    subjectId: null,
    subjectName: null,
    chapterId: null,
    chapterName: null,
    topicId: null,
    topicName: null,
    learningSteps: {
        currentStep: "video",
        completedSteps: [],
        stepResetKey: 0,
        isModalOpen: false,
        topicsList: [
            "Multi-digit multiplication",
            "Carrying over in addition",
            "Word problems on addition"
        ],
        currentTopicNumber: 1
    },
    activeTool: {
        name: null,
        payload: null
    },
    currentPatternIndex: 0,
    aiFeedbackMessages: [],
    autoAdvance: true, // Default to true
    chatMessages: [], // Initialize empty chat messages
    learningStepMode: 'auto' // Default to auto mode
};

const studySlice = createSlice({
    name: 'study',
    initialState,
    reducers: {
        setSubjectData: (state, action: PayloadAction<{ subjectId: string; subjectName: string }>) => {
            state.subjectId = action.payload.subjectId;
            state.subjectName = action.payload.subjectName;
        },
        setChapterData: (state, action: PayloadAction<{ chapterId: string; chapterName: string }>) => {
            state.chapterId = action.payload.chapterId;
            state.chapterName = action.payload.chapterName;
        },
        setTopicData: (state, action: PayloadAction<{ topicId: string; topicName: string }>) => {
            state.topicId = action.payload.topicId;
            state.topicName = action.payload.topicName;
        },
        // Learning Steps Actions
        setCurrentStep: (state, action: PayloadAction<string>) => {
            state.learningSteps.currentStep = action.payload;
        },
        addCompletedStep: (state, action: PayloadAction<string>) => {
            if (!state.learningSteps.completedSteps.includes(action.payload)) {
                state.learningSteps.completedSteps.push(action.payload);
            }
        },
        resetCompletedSteps: (state) => {
            state.learningSteps.completedSteps = [];
        },
        incrementStepResetKey: (state) => {
            state.learningSteps.stepResetKey += 1;
        },
        setModalOpen: (state, action: PayloadAction<boolean>) => {
            state.learningSteps.isModalOpen = action.payload;
        },
        setTopicsList: (state, action: PayloadAction<string[]>) => {
            state.learningSteps.topicsList = action.payload;
        },
        setCurrentTopicNumber: (state, action: PayloadAction<number>) => {
            state.learningSteps.currentTopicNumber = action.payload;
        },
        goToNextTopic: (state) => {
            const currentIdx = state.learningSteps.currentTopicNumber - 1;
            const nextIdx = currentIdx + 1;

            if (state.learningSteps.topicsList[nextIdx]) {
                state.learningSteps.currentTopicNumber = nextIdx + 1;
                state.learningSteps.currentStep = "video";
                state.learningSteps.completedSteps = [];
            }
        },
        resetLearningSteps: (state) => {
            state.learningSteps = {
                ...initialState.learningSteps,
                topicsList: state.learningSteps.topicsList
            };
            state.activeTool = { name: null, payload: null };
        },
        setActiveTool: (state, action: PayloadAction<ActiveToolState>) => {
            state.activeTool = action.payload;
        },
        clearActiveTool: (state) => {
            state.activeTool = { name: null, payload: null };
        },
        setCurrentPatternIndex: (state, action: PayloadAction<number>) => {
            state.currentPatternIndex = action.payload;
        },
        incrementCurrentPatternIndex: (state) => {
            state.currentPatternIndex += 1;
        },
        decrementCurrentPatternIndex: (state) => {
            state.currentPatternIndex -= 1;
        },
        addAIFeedbackMessage: (state, action: PayloadAction<AIFeedbackMessage>) => {
            state.aiFeedbackMessages.push(action.payload);
        },
        clearAIFeedbackMessages: (state) => {
            state.aiFeedbackMessages = [];
        },
        // Auto-advance actions
        setAutoAdvance: (state, action: PayloadAction<boolean>) => {
            state.autoAdvance = action.payload;
        },
        pauseAutoAdvance: (state) => {
            state.autoAdvance = false;
        },
        resumeAutoAdvance: (state) => {
            state.autoAdvance = true;
        },
        // Chat message actions
        addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.chatMessages.push(action.payload);
        },
        clearChatMessages: (state) => {
            state.chatMessages = [];
        },
        // Learning step mode actions
        setLearningStepMode: (state, action: PayloadAction<'tool' | 'agent' | 'auto'>) => {
            state.learningStepMode = action.payload;
        }
    }
});

export const {
    setSubjectData,
    setChapterData,
    setTopicData,
    setCurrentStep,
    addCompletedStep,
    resetCompletedSteps,
    incrementStepResetKey,
    setModalOpen,
    setTopicsList,
    setCurrentTopicNumber,
    goToNextTopic,
    resetLearningSteps,
    setActiveTool,
    clearActiveTool,
    setCurrentPatternIndex,
    incrementCurrentPatternIndex,
    decrementCurrentPatternIndex,
    addAIFeedbackMessage,
    clearAIFeedbackMessages,
    setAutoAdvance,
    pauseAutoAdvance,
    resumeAutoAdvance,
    addChatMessage,
    clearChatMessages,
    setLearningStepMode
} = studySlice.actions;

export default studySlice.reducer;
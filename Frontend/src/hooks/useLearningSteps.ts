import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import {
    setCurrentStep,
    addCompletedStep,
    resetCompletedSteps,
    incrementStepResetKey,
    setModalOpen,
    setTopicsList,
    setCurrentTopicNumber,
    goToNextTopic,
    resetLearningSteps
} from '../store/slices/studySlice';

export const useLearningSteps = () => {
    const dispatch = useDispatch();
    const learningSteps = useSelector((state: RootState) => state.study.learningSteps);

    return {
        // State
        ...learningSteps,

        // Actions
        setCurrentStep: (step: string) => dispatch(setCurrentStep(step)),
        addCompletedStep: (step: string) => dispatch(addCompletedStep(step)),
        resetCompletedSteps: () => dispatch(resetCompletedSteps()),
        incrementStepResetKey: () => dispatch(incrementStepResetKey()),
        setModalOpen: (isOpen: boolean) => dispatch(setModalOpen(isOpen)),
        setTopicsList: (topics: string[]) => dispatch(setTopicsList(topics)),
        setCurrentTopicNumber: (number: number) => dispatch(setCurrentTopicNumber(number)),
        goToNextTopic: () => dispatch(goToNextTopic()),
        resetLearningSteps: () => dispatch(resetLearningSteps()),

        // Computed values
        isStepCompleted: (step: string) => learningSteps.completedSteps.includes(step),
        getCurrentStepIndex: () => {
            const steps = ["video", "Practive Exercise", "Tool", "Quiz"];
            return steps.indexOf(learningSteps.currentStep);
        },
        isLastStep: () => {
            const steps = ["video", "Practive Exercise", "Tool", "Quiz"];
            const currentIndex = steps.indexOf(learningSteps.currentStep);
            return currentIndex === steps.length - 1;
        }
    };
}; 

import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './store/store';
import { autoLogin } from './store/slices/authSlice';
// import { SessionProvider } from './contexts/SessionContext';
import { ToolProvider } from './contexts/ToolContext';
import { TeachingFlowProvider } from './contexts/TeachingFlowContext';
import { VisualizationStateProvider } from './contexts/VisualizationStateContext';
import { InterruptProvider } from './contexts/InterruptContext';


const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(autoLogin());
    }, [dispatch]);

    return (
        <>
            <ToolProvider>
                <TeachingFlowProvider>
                    <VisualizationStateProvider>
                        <InterruptProvider>
                            <AppRoutes />
                        </InterruptProvider>
                    </VisualizationStateProvider>
                </TeachingFlowProvider>
            </ToolProvider>
        </>
    );
};

export default App; 

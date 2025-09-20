import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, user, initialized } = useSelector((state: RootState) => state.auth);
    const userRole = user?.role;

    console.log('PrivateRoute - Auth state:', { isAuthenticated, user, userRole });

    // Wait for auto-login initialization to finish to avoid premature redirects
    if (!initialized) {
        return null;
    }

    if (!isAuthenticated) {
        console.log('PrivateRoute - Not authenticated, redirecting to login');
        return <Navigate to="/login" />;
    }

    if (!userRole) {
        console.log('PrivateRoute - No user role, redirecting to login');
        return <Navigate to="/login" />;
    }

    console.log('PrivateRoute - Authenticated and has role, rendering children');
    return <>{children}</>;
};

export default PrivateRoute; 

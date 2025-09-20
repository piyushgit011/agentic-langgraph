import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PublicRouteProps {
    children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const { isAuthenticated, user, initialized } = useSelector((state: RootState) => state.auth);
    const userRole = user?.role;

    // Wait for auto-login to initialize before deciding
    if (!initialized) {
        return null;
    }

    // If user is authenticated and has a role, redirect to home
    if (isAuthenticated && userRole) {
        return <Navigate to="/home" />;
    }

    // If user is authenticated but no role, stay on current page
    if (isAuthenticated && !userRole) {
        return <>{children}</>;
    }

    // If not authenticated, show the children (login/signup forms)
    return <>{children}</>;
};

export default PublicRoute; 

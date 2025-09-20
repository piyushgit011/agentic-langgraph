import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import Layout from '../layout/Layout';
import Landing from '../pages/Landing/Landing';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import roleBasedPagesMap from './roleRoutes';
import { RootState } from '../store/store';
import CustomTeacherApp from '../components/CustomTeacherApp';
import AllAgents from '../pages/SuperAdmin/Agents/Agents';
import CreateAgent from '../pages/SuperAdmin/Agents/CreateAgent';
import EditAgent from '../pages/SuperAdmin/Agents/EditAgent';
import ViewAgent from '../pages/SuperAdmin/Agents/ViewAgent';

const AppRoutes: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const userRole = user?.role;

    return (
        <Routes>
            {/* Public Routes */}
            {/* <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} /> */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/" element={<CustomTeacherApp />} />
            <Route path="/agents" element={<AllAgents />} />
            <Route path="/agents/create-agent" element={<CreateAgent />} />
            <Route path="/agents/edit-agent" element={<EditAgent />} />
            <Route path="/agents/view-agent" element={<ViewAgent />} />

            {/* Role-based Routes */}
            <Route
                element={
                    <PrivateRoute>
                        <Layout role={userRole} />
                    </PrivateRoute>
                }
            >
                {Object.entries(roleBasedPagesMap[userRole] || {}).map(([path, PageComponent]) => (
                    <Route key={path} path={path} element={React.createElement(PageComponent)} />
                ))}
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<h1>404 – Page Not Found</h1>} />
        </Routes>
    );
};

export default AppRoutes; 

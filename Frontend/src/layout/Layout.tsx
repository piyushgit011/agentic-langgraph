import React, { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar/Sidebar';
import Topbar from '../components/common/Topbar/Topbar';
import { Outlet, useLocation } from 'react-router-dom';
import { LayoutWrapper, MainContentBox, PageContent } from './LayoutStyles';
import CustomBreadcumbs from '../components/common/Breadcrumbs/Breadcrumbs';

interface LayoutProps {
    role?: string;
}

const Layout: React.FC<LayoutProps> = ({ role }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);
    const smallMenuClose = () => setSidebarOpen(false);

    const location = useLocation();
    const pathParts = location.pathname.split("/").filter(Boolean);
    const LastPart = decodeURIComponent(pathParts[pathParts.length - 1]);

    // Extract query params if needed
    const queryParams = new URLSearchParams(location.search);
    const FinalTopic = location.state?.topicTitle || null;
    const FinalTopicNumber = location.state?.topicNumber || queryParams.get("topicNumber");

    // ✅ Only true if URL ends with "topic-<number>"
    const learningViewPattern = /^topic-\d+$/;
    const isLearningView = learningViewPattern.test(LastPart);

    const isDashboard = location.pathname === "/home" || location.pathname === "/";

    useEffect(() => {
        if (isLearningView) {
            setSidebarOpen(false); // close for learning view
        } else {
            setSidebarOpen(true); // open for all other views
        }
    }, [isLearningView]);

    return (
        <LayoutWrapper>
            <Sidebar role={role} open={sidebarOpen} mobileMenu={smallMenuClose} />
            <MainContentBox open={sidebarOpen}>
                <Topbar role={role} open={sidebarOpen} toggleSidebar={toggleSidebar} />
                <PageContent $isLearningView={isLearningView}>
                    {/* ✅ Show breadcrumb only if NOT learning view, NOT topic view, and NOT dashboard */}
                    {!isLearningView && !isDashboard && <CustomBreadcumbs role={role} />}

                    <Outlet
                        role={role}
                        context={{ topicTitle: FinalTopic, topicNumber: FinalTopicNumber }}
                    />
                </PageContent>
            </MainContentBox>
        </LayoutWrapper>
    );
};

export default Layout; 

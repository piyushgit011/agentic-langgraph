// src/routes/roleRoutes.ts
import React from 'react';

// Student Pages
import StudentDashboard from '../pages/Student/Dashboard';
import Classes from '../pages/Student/Classes';
import Subjects from '../pages/Student/Subjects/Subjects';
import Homework from '../pages/Student/Homework';
import Timetable from '../pages/Student/Timetable';
import Groups from '../pages/Student/Groups';
import Exams from '../pages/Student/Exam';
import Attendance from '../pages/Student/Attendance';
import ProgressReport from '../pages/Student/ProgressReport';
import LearningHistory from '../pages/Student/History/LearningHistory';
import AllChatsHistoryTable from '../pages/Student/History/AllChatsHistory';
import ViewChatHistory from '../pages/Student/History/ViewChatHistory';
import Settings from '../pages/Student/Settings';
import Notifications from '../pages/Student/Notifications';
import SingleSubject from '../pages/Student/Subjects/SingleSubject';
import ChapterListing from '../pages/Student/Subjects/ChapterListing';
import LearingView from '../pages/Student/Subjects/LearningView';
import CustomTeacherApp from '../components/CustomTeacherApp';
// Teacher Page
import TeacherDashboard from '../pages/Teacher/Dashboard';

// Parent Page
import ParentDashboard from '../pages/Parent/Dashboard';

// Admin Page
import AdminDashboard from '../pages/Admin/Dashboard';

// SuperAdmin Page
import SuperAdminDashboard from '../pages/SuperAdmin/Dashboard';
import AllAgents from '../pages/SuperAdmin/Agents/Agents';
import AllStudentsList from '../pages/SuperAdmin/Users/Students/AllStudents';
import CreateStudent from '../pages/SuperAdmin/Users/Students/CreateStudent';
import EditStudent from '../pages/SuperAdmin/Users/Students/Edit';
import ViewStudent from '../pages/SuperAdmin/Users/Students/View';
import Teachers from '../pages/SuperAdmin/Users/Teachers';
import Parents from '../pages/SuperAdmin/Users/Parents';
import Admins from '../pages/SuperAdmin/Users/Admins';

// Academics_routes

// Boards
import AllBoards from '../pages/SuperAdmin/Academics/Boards/AllBoards';
import CreateBoard from '../pages/SuperAdmin/Academics/Boards/CreateBoard';
import EditBoard from '../pages/SuperAdmin/Academics/Boards/EditBoard';
import ViewBoard from '../pages/SuperAdmin/Academics/Boards/ViewBoard';

// Classes
import AllClasses from '../pages/SuperAdmin/Academics/Classes/AllClasses';
import CreateClass from '../pages/SuperAdmin/Academics/Classes/CreateClasses';
import EditClass from '../pages/SuperAdmin/Academics/Classes/EditClass';
import ViewClass from '../pages/SuperAdmin/Academics/Classes/ViewClass';

// Subject
import AllSubjects from '../pages/SuperAdmin/Academics/Subjects/AllSubjects';
import CreateSubject from '../pages/SuperAdmin/Academics/Subjects/CreateSubject';
import EditSubject from '../pages/SuperAdmin/Academics/Subjects/EditSubject';
import ViewSubject from '../pages/SuperAdmin/Academics/Subjects/ViewSubject';

// Content_Routes
import AllChapters from '../pages/SuperAdmin/Content/Chapters/AllChapters';
import CreateChapter from '../pages/SuperAdmin/Content/Chapters/CreateChapter';
import EditChapter from '../pages/SuperAdmin/Content/Chapters/EditChapter';
import ViewChapter from '../pages/SuperAdmin/Content/Chapters/ViewChapter';

//Agents 
import CreateAgent from '../pages/SuperAdmin/Agents/CreateAgent';
import EditAgent from '../pages/SuperAdmin/Agents/EditAgent';
import ViewAgent from '../pages/SuperAdmin/Agents/ViewAgent';

import AllChats from '../pages/Chats/AllChats';
import ViewChat from '../pages/Chats/ViewChat';

import AllTopics from '../pages/SuperAdmin/Content/Topics/AllTopics';
import CreateTopic from '../pages/SuperAdmin/Content/Topics/CreateTopic';
import EditTopic from '../pages/SuperAdmin/Content/Topics/EditTopic';
import ViewTopic from '../pages/SuperAdmin/Content/Topics/ViewTopic';


// Tools
import AllTools from '../pages/SuperAdmin/Tools/AllTools';
import CreateTool from '../pages/SuperAdmin/Tools/CreateTool';
import EditTool from '../pages/SuperAdmin/Tools/EditTool';
import ViewTool from '../pages/SuperAdmin/Tools/ViewTool';

type PageComponent = React.ComponentType;

interface RoleBasedPagesMap {
    [role: string]: {
        [path: string]: PageComponent;
    };
}

const roleBasedPagesMap: RoleBasedPagesMap = {
    Student: {
        "/home": StudentDashboard,
        "/classes": Classes,
        "/subjects": Subjects,
        "/subjects/:subjectLabel": SingleSubject,
        "/subjects/:subjectLabel/:chapterNumber": ChapterListing,
        "/subjects/:subjectLabel/:chapterNumber/:topicNumber": LearingView,
        "/homework": Homework,
        "/timetable": Timetable,
        "/groups": Groups,
        "/exams": Exams,
        "/attendance": Attendance,
        "/progressReport": ProgressReport,
        "/learningHistory": LearningHistory,
        "/chatHistory": AllChatsHistoryTable,
        "/chatHistory/:sessionId": ViewChatHistory,
        "/settings": Settings,
        "/notifications": Notifications,
        "/customTeacher": CustomTeacherApp,
    },
    Teacher: {
        "/home": TeacherDashboard,
    },
    Parent: {
        "/home": ParentDashboard,
    },
    Admin: {
        "/home": AdminDashboard,
    },
    SuperAdmin: {
        "/home": SuperAdminDashboard,

        // User_routes::Start
        "/users/all-students": AllStudentsList,
        "/users/create-student": CreateStudent,
        "/users/edit": EditStudent,
        "/users/view": ViewStudent,
        "/users/teachers": Teachers,
        "/users/parents": Parents,
        "/users/admins": Admins,
        // User_routes::End

        // Academics_routes::Start

        // Boards
        "/academics/boards": AllBoards,
        "/academics/boards/create-board": CreateBoard,
        "/academics/boards/edit-board": EditBoard,
        "/academics/boards/view-board": ViewBoard,

        // Classes
        "/academics/classes": AllClasses,
        "/academics/classes/create-class": CreateClass,
        "/academics/classes/edit-class": EditClass,
        "/academics/classes/view-class": ViewClass,

        // Academics_routes::Start
        "/academics/subjects": AllSubjects,
        "/academics/subjects/create-subject": CreateSubject,
        "/academics/subjects/edit-subject": EditSubject,
        "/academics/subjects/view-subject": ViewSubject,
        // Academics_routes::End

        // Content_routes::Start
        "/content/chapters": AllChapters,
        "/content/chapters/create-chapter": CreateChapter,
        "/content/chapters/edit-chapter": EditChapter,
        "/content/chapters/view-chapter": ViewChapter,
        // Content_routes::End

        //Agents_routes::Start
        "/agents": AllAgents,
        "/agents/create-agent": CreateAgent,
        "/agents/edit-agent": EditAgent,
        "/agents/view-agent": ViewAgent,
        //Agents_routes::End

        // Topic_routes::Start
        "/content/topics": AllTopics,
        "/content/topics/create-topic": CreateTopic,
        "/content/topics/edit-topic": EditTopic,
        "/content/topics/view-topic": ViewTopic,
        // Topic_routes::End

        // Tools_routes::Start
        "/content/tools": AllTools,
        "/content/tools/create-tool": CreateTool,
        "/content/tools/edit-tool": EditTool,
        "/content/tools/view-tool": ViewTool,
        // Tools_routes::End

        //Chats_routes::Start
        "/chats": AllChats,
        "/chats/:sessionId": ViewChat,
        //Chats_routes::End

    }
};

export default roleBasedPagesMap; 

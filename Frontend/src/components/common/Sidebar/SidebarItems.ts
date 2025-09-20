// src/components/common/Sidebar/SidebarItems.ts

// Student sidebar icons
import { GrHomeRounded } from "react-icons/gr";
import { MdOndemandVideo } from "react-icons/md";
import { RiBook2Line, RiRobot2Line } from "react-icons/ri";
import { IoBookOutline, IoCalendarOutline, IoBarChartOutline, IoSettingsOutline, IoSchoolOutline } from "react-icons/io5";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { PiExam } from "react-icons/pi";
import { LuCalendarPlus2, LuBellDot, LuFilePen } from "react-icons/lu";
import { BsClockHistory } from "react-icons/bs";
import { TbUsersPlus } from "react-icons/tb";
import { BsChatSquareDots } from "react-icons/bs";
import { IconType } from "react-icons";

export interface MenuItem {
    label: string;
    icon?: IconType;
    path?: string;
    children?: MenuItem[];
}

interface SidebarItems {
    Student: MenuItem[];
    Teacher: MenuItem[];
    Parent: MenuItem[];
    Admin: MenuItem[];
    SuperAdmin: MenuItem[];
}

export const sidebarItems: SidebarItems = {
    Student: [
        { label: "Home", icon: GrHomeRounded, path: "/home" },
        { label: "Classes", icon: MdOndemandVideo, path: "/classes" },
        { label: "Subjects", icon: RiBook2Line, path: "/subjects" },
        { label: "Homework", icon: IoBookOutline, path: "/homework" },
        { label: "Timetable", icon: IoCalendarOutline, path: "/timetable" },
        { label: "Groups", icon: AiOutlineUsergroupAdd, path: "/groups" },
        { label: "Exams", icon: PiExam, path: "/exams" },
        { label: "Attendance", icon: LuCalendarPlus2, path: "/attendance" },
        { label: "Progress Report", icon: IoBarChartOutline, path: "/progressReport" },
        { label: "Learning History", icon: BsClockHistory, path: "/learningHistory" },
        { label: "Chat History", icon: BsChatSquareDots, path: "/chatHistory" },
        { label: "Notifications", icon: LuBellDot, path: "/notifications" },
        { label: "Settings", icon: IoSettingsOutline, path: "/settings" },
        { label: "Custom Teacher", icon: RiRobot2Line, path: "/customTeacher" },
    ],
    Teacher: [
        { label: "Home", icon: GrHomeRounded, path: "/home" },
    ],
    Parent: [
        { label: "Home", icon: GrHomeRounded, path: "/home" },
    ],
    Admin: [
        { label: "Home", icon: GrHomeRounded, path: "/home" },
    ],
    SuperAdmin: [
        { label: "Home", icon: GrHomeRounded, path: "/home" },
        {
            label: "Users",
            icon: TbUsersPlus,
            children: [
                { label: "Students", path: "/users/all-students" },
                { label: "Teachers", path: "/users/teachers" },
                { label: "Parents", path: "/users/parents" },
                { label: "Admins", path: "/users/admins" },
            ],
        },
        {
            label: "Academics",
            icon: IoSchoolOutline,
            children: [
                { label: "Boards", path: "/academics/boards" },
                { label: "Classes", path: "/academics/classes" },
                { label: "Subjects", path: "/academics/subjects" },
            ],
        },
        {
            label: "Content",
            icon: LuFilePen,
            children: [
                { label: "Chapters", path: "/content/chapters" },
                { label: "Topics", path: "/content/topics" },
                { label: "Tools", path: "/content/tools" },
            ],
        },
        { label: "Agents", icon: RiRobot2Line, path: "/agents" },
        { label: "Chats", icon: BsChatSquareDots, path: "/chats" },
    ],
};

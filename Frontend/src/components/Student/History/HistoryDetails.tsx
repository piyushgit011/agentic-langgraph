import React, { useState } from "react";
import { Grid, Pagination, Box } from "@mui/material";
import {
    ChapterNumber,
    FilterMain,
    HistoryCard,
    HistoryCardBody,
    HistoryCardFooter,
    HistoryCardHeader,
    HistoryCardMain,
    HistoryData,
    HistoryDataRander,
    HistoryDataTime,
    HistoryDate,
    Historypagination,
    HistorySubject,
    HistoryWrapper,
    StatusBadge,
} from "./HistoryStyle";

import {
    SearchWrapper,
    SearchBox,
    SearchInput,
} from "../../common/Auth/SignupForm/StudentAuth/PersonalDataProgressForm/StudentPersonalInformation";
import FilterDropdown from "../../common/Filters/FilterDropdown";
import SearchIcon from "@mui/icons-material/Search";


import { IoCalendarClearOutline, IoPlayOutline } from "react-icons/io5";
import { AiOutlineClockCircle } from "react-icons/ai";
import { Heading, Paragraph, Searchbar } from "../../common/Elements";
import { Search } from "@mui/icons-material";

interface HistoryItem {
    subject: string;
    chapter: string;
    title: string;
    topic: string;
    date: string;
    time: string;
    status: string;
}

interface GroupedHistory {
    [key: string]: HistoryItem[];
}

// ✅ Helper to group dates
const getDateType = (dateStr: string): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const itemDate = new Date(dateStr);

    const sameDay = (d1: Date, d2: Date): boolean =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    if (sameDay(itemDate, today)) return "Today";
    if (sameDay(itemDate, yesterday)) return "Yesterday";
    return "Earlier";
};

const HistoryDetails: React.FC = () => {
    const [page, setPage] = useState<number>(1);
    const rowsPerPage = 7;

    // ✅ Large dataset
    const allHistory: HistoryItem[] = [
        { subject: "Maths", chapter: "Ch 1", title: "Addition Basics", topic: "Multi-digit multiplication", date: "July 17, 2025", time: "30 Mins", status: "Completed" },
        { subject: "English", chapter: "Ch 2", title: "Reading Comprehension", topic: "Multi-digit multiplication", date: "July 17, 2025", time: "20 Mins", status: "Pending" },
        { subject: "Science", chapter: "Ch 3", title: "Plants Around Us", topic: "Multi-digit multiplication", date: "July 17, 2025", time: "25 Mins", status: "In Progress" },
        { subject: "Science", chapter: "Ch 3", title: "Plants Around Us", topic: "Multi-digit multiplication", date: "July 17, 2025", time: "25 Mins", status: "In Progress" },
        { subject: "Science", chapter: "Ch 3", title: "Plants Around Us", topic: "Multi-digit multiplication", date: "July 17, 2025", time: "25 Mins", status: "In Progress" },
        { subject: "Science", chapter: "Ch 3", title: "Plants Around Us", topic: "Multi-digit multiplication", date: "July 17, 2025", time: "25 Mins", status: "In Progress" },
        { subject: "Science", chapter: "Ch 3", title: "Plants Around Us", topic: "Multi-digit multiplication", date: "July 17, 2025", time: "25 Mins", status: "In Progress" },
        { subject: "Science", chapter: "Ch 3", title: "Plants Around Us", topic: "Multi-digit multiplication", date: "July 17, 2025", time: "25 Mins", status: "In Progress" },
        { subject: "Science", chapter: "Ch 3", title: "Plants Around Us", topic: "Multi-digit multiplication", date: "July 17, 2025", time: "25 Mins", status: "In Progress" },
        { subject: "History", chapter: "Ch 4", title: "Mughal Empire", topic: "Multi-digit multiplication", date: "July 16, 2025", time: "40 Mins", status: "Failed" },
        { subject: "Maths", chapter: "Ch 5", title: "Geometry - Lines", topic: "Multi-digit multiplication", date: "July 16, 2025", time: "35 Mins", status: "Completed" },
        { subject: "English", chapter: "Ch 6", title: "Poem: The Road Not Taken", topic: "Multi-digit multiplication", date: "July 16, 2025", time: "18 Mins", status: "In Progress" },
        { subject: "Science", chapter: "Ch 7", title: "Human Body - Circulation", topic: "Blood & Heart", date: "July 15, 2025", time: "45 Mins", status: "Pending" },
        { subject: "Geography", chapter: "Ch 8", title: "Rivers of India", topic: "Ganga Basin", date: "July 15, 2025", time: "28 Mins", status: "Failed" },
        { subject: "Maths", chapter: "Ch 9", title: "Algebra - Linear Equations", topic: "Solving Equations", date: "July 14, 2025", time: "30 Mins", status: "Completed" },
        { subject: "Science", chapter: "Ch 10", title: "Electricity & Circuits", topic: "Ohm's Law", date: "July 14, 2025", time: "32 Mins", status: "Pending" },
        { subject: "English", chapter: "Ch 11", title: "Story Writing", topic: "Creative Writing", date: "July 13, 2025", time: "22 Mins", status: "In Progress" },
        { subject: "History", chapter: "Ch 12", title: "Freedom Fighters", topic: "Mahatma Gandhi", date: "July 13, 2025", time: "38 Mins", status: "Completed" },
    ];

    const sortedHistory = [...allHistory].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const totalPages = Math.ceil(sortedHistory.length / rowsPerPage);
    const paginatedData = sortedHistory.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const groupedData: GroupedHistory = paginatedData.reduce((acc: GroupedHistory, item: HistoryItem) => {
        const type = getDateType(item.date);
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
    }, {});

    const renderHistoryCard = (item, index) => (
        <Grid container key={index}>
            <Grid size={{ xs: 12, lg: 12 }}>
                <HistoryCard>
                    <HistorySubject>{item.subject}</HistorySubject>
                    <div>
                        <div className="chapter_name">
                            <ChapterNumber>{item.chapter}</ChapterNumber>
                            <Heading as="h2" variant="h6" color='dark'>
                                {item.title}
                            </Heading>
                        </div>
                        <div className="history_topic">
                            <Paragraph fontSize="sm"><IoPlayOutline /> {item.topic}</Paragraph>
                        </div>
                    </div>
                    <div>
                        <HistoryDataTime>
                            <HistoryDate>
                                <IoCalendarClearOutline />
                                <Paragraph fontSize="sm">{item.date}</Paragraph>
                            </HistoryDate>
                            <HistoryDate>
                                <AiOutlineClockCircle />
                                <Paragraph fontSize="sm">{item.time}</Paragraph>
                            </HistoryDate>
                            <HistoryDate>
                                <StatusBadge status={item.status}>{item.status}</StatusBadge>
                            </HistoryDate>
                        </HistoryDataTime>
                    </div>
                </HistoryCard>
            </Grid>
        </Grid>
    );

    return (
        <HistoryWrapper>
            <HistoryCardMain>
                <HistoryCardBody>
                    <Grid container>
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
                            <FilterMain>
                                <SearchWrapper>
                                    <Searchbar/>
                                </SearchWrapper>
                                <FilterDropdown />
                            </FilterMain>
                        </Grid>
                    </Grid>
                    <HistoryData>
                        {["Today", "Yesterday", "Earlier"].map(
                            (section) =>
                                groupedData[section] && (
                                    <HistoryDataRander key={section}>
                                        <Paragraph variant="p" className="history_time_status">{section}</Paragraph>
                                        {groupedData[section].map((item, i) =>
                                            renderHistoryCard(item, i)
                                        )}
                                    </HistoryDataRander>
                                )
                        )}
                    </HistoryData>
                </HistoryCardBody>
                <HistoryCardFooter>
                    <Historypagination>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                        />
                    </Historypagination>
                </HistoryCardFooter>
            </HistoryCardMain>
        </HistoryWrapper>
    );
};

export default HistoryDetails; 

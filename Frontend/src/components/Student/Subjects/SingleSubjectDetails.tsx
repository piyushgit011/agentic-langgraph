import React, { useState, useEffect } from 'react';
import {
    PageWrapper,
    LeftSidebar,
    StatCard,
    StatIcon,
    StatLabel,
    StatValue,
    RightContent,
    ChapterCard,
    ChapterTitle,
    ProgressCircle,
    TopicList,
    ProgressBarWrapper,
    ProgressLabel,
    ProgressBar,
    ProgressFill,
    ChapterTag,
    TopicCountBadge,
    CardTitleWrapper,
    ChapterOverallProgress,
    LetsStartButton,
    ChapterDataWrapper,
    ChapterInfoWrapper,
    ShowToggle,
    ChapterMainRow
} from './SubjectsListingStyles';
import Star from '../../../assets/images/star.svg';
import {
    FaBookOpen,
    FaRegListAlt,
    FaPenAlt,
    FaClock,
    FaFolderOpen,
    FaQuestionCircle,
} from 'react-icons/fa';
import {
    Button
} from '../../common/Elements';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../../services/apiService';
import { useSelector, useDispatch } from 'react-redux';
import { setChapterData } from '../../../store/slices/studySlice';
import { RootState } from '../../../store/store';
import { Heading } from '../../common/Elements/Typography/Typography';

interface Topic {
    topicId: number;
    topicName: string;
}

interface Chapter {
    chapterId: number;
    chapterName: string;
    subjectName: string;
    topics: Topic[];
}

interface SubjectInfo {
    subjectId: number;
    subjectName: string;
    boardName: string;
    gradeName: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        subjectInfo: SubjectInfo;
        chapters: Chapter[];
        totalChapters: number;
        totalTopics: number;
    };
}

interface MappedChapter {
    number: number;
    title: string;
    topics: string[];
    chapterId: number;
    progress: number;
}

interface Stat {
    label: string;
    value: number;
    icon: React.ReactNode;
}

const SingleSubjectDetails: React.FC = () => {
    const navigate = useNavigate();
    const { subjectLabel } = useParams<{ subjectLabel: string }>();
    const dispatch = useDispatch();
    const studyState = useSelector((state: RootState) => state.study);
    const { subjectId } = studyState;

    // State for chapters data
    const [chapters, setChapters] = useState<MappedChapter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [subjectInfo, setSubjectInfo] = useState<SubjectInfo | null>(null);
    const [totalStats, setTotalStats] = useState({ chapters: 0, topics: 0 });

    // Fetch chapters and topics for the subjectId
    useEffect(() => {
        const fetchChaptersTopics = async () => {
            if (subjectId) {
                try {
                    setLoading(true);
                    const result = await apiService.getSubjectChaptersTopics(subjectId);
                    console.log('Chapters and Topics data:', result);

                    if (result.success && result.data) {
                        const { chapters: apiChapters, subjectInfo: info, totalChapters, totalTopics } = result.data;

                        // Map API data to component format with sequential numbers
                        const mappedChapters: MappedChapter[] = apiChapters.map((chapter: Chapter, index: number) => ({
                            number: index + 1, // Sequential chapter numbers
                            title: chapter.chapterName,
                            topics: chapter.topics.map(topic => topic.topicName),
                            chapterId: chapter.chapterId,
                            progress: 0 // Default progress, can be updated later
                        }));

                        setChapters(mappedChapters);
                        setSubjectInfo(info);
                        setTotalStats({ chapters: totalChapters, topics: totalTopics });
                    }
                } catch (error) {
                    console.error('Error fetching chapters and topics:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchChaptersTopics();
    }, [subjectId]);

    const stats: Stat[] = [
        { label: 'Chapters', value: totalStats.chapters, icon: <FaBookOpen /> },
        { label: 'Topics', value: totalStats.topics, icon: <FaRegListAlt /> },
        { label: 'Exercises', value: 20, icon: <FaPenAlt /> },
        { label: 'Hours', value: 75, icon: <FaClock /> },
        { label: 'Tutorials', value: 30, icon: <FaFolderOpen /> },
        { label: 'Quiz', value: 16, icon: <FaQuestionCircle /> },
    ];

    const progressData = [
        { label: 'Chapter', value: 70, color: '#0f766e' },
        { label: 'Topics', value: 60, color: '#f97316' },
        { label: 'Exercises', value: 30, color: '#9333ea' },
        { label: 'Chapter', value: 10, color: '#dc2626' },
    ];

    const [expandedChapters, setExpandedChapters] = useState<{ [key: number]: boolean }>({});

    const toggleChapterTopics = (chapterIndex: number) => {
        setExpandedChapters((prev) => ({
            ...prev,
            [chapterIndex]: !prev[chapterIndex],
        }));
    };

    return (
        <PageWrapper>
            <LeftSidebar>
                <CardTitleWrapper>
                    <div className='subject_title'>
                        <Heading as="h3" variant="h5">
                            <img src={Star} alt="Star" />
                            {subjectLabel}
                        </Heading>
                    </div>
                </CardTitleWrapper>

                {stats.map((stat, idx) => (
                    <StatCard key={idx}>
                        <StatIcon>{stat.icon}</StatIcon>
                        <StatLabel>{stat.label}</StatLabel>
                        <StatValue>{stat.value}</StatValue>
                    </StatCard>
                ))}

                <ChapterOverallProgress>
                    <CardTitleWrapper>
                        <div className='subject_title'>
                            <Heading as="h3" variant="h5">
                                <img src={Star} alt="Star" />
                                Overall progress
                            </Heading>
                        </div>
                    </CardTitleWrapper>
                    <div className='progress_data'>
                        {progressData.map((bar, idx) => (
                            <ProgressBarWrapper key={idx}>
                                <ProgressLabel>{bar.label}</ProgressLabel>
                                <ProgressBar>
                                    <ProgressFill width={bar.value} color={bar.color} />
                                </ProgressBar>
                            </ProgressBarWrapper>
                        ))}
                    </div>
                </ChapterOverallProgress>
            </LeftSidebar>

            <RightContent>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Loading chapters...</p>
                    </div>
                ) : (
                    chapters.map((ch, idx) => {
                        const isExpanded = expandedChapters[idx];
                        const topicsToShow = isExpanded ? ch.topics : ch.topics.slice(0, 2);
                        const remaining = ch.topics.length - 2;

                        return (
                            <ChapterCard key={idx}>
                                <ProgressCircle>
                                    <CircularProgressbar
                                        value={ch.progress || 0}
                                        text={`${ch.progress || 0}%`}
                                        styles={buildStyles({
                                            textColor: '#343A40',
                                            pathColor: '#73D673',
                                            trailColor: '#D9D9D9',
                                        })}
                                    />
                                </ProgressCircle>

                                <ChapterDataWrapper>
                                    <ChapterInfoWrapper>
                                        <ChapterMainRow>
                                            <ChapterTitle>
                                                <ChapterTag>Chapter-{ch.number}</ChapterTag> {ch.title}
                                            </ChapterTitle>
                                            <TopicCountBadge>{ch.topics.length} topics</TopicCountBadge>
                                        </ChapterMainRow>

                                        <TopicList>
                                            {topicsToShow.map((topic, i) => (
                                                <li key={i}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                        <ChangeHistoryIcon fontSize="small" />
                                                        <span>{topic}</span>
                                                    </div>
                                                </li>
                                            ))}

                                            {ch.topics.length > 2 && (
                                                <li>
                                                    <ShowToggle onClick={() => toggleChapterTopics(idx)}>
                                                        {isExpanded ? '− show less' : `+${remaining} more`}
                                                    </ShowToggle>
                                                </li>
                                            )}
                                        </TopicList>
                                    </ChapterInfoWrapper>

                                    <LetsStartButton>
                                        <Button
                                            type="button"
                                            color="secondary"
                                            label={`Let's start`}
                                            onClick={() => {
                                                // Save chapter data to Redux
                                                dispatch(setChapterData({
                                                    chapterId: ch.chapterId,
                                                    chapterName: ch.title,
                                                }));

                                                const url = `/subjects/${encodeURIComponent(subjectLabel || '')}/chapter-${ch.number}`;
                                                navigate(url);
                                            }}
                                        />
                                       

                                    </LetsStartButton>
                                </ChapterDataWrapper>
                            </ChapterCard>
                        );
                    })
                )}
            </RightContent>
        </PageWrapper>
    );
};

export default SingleSubjectDetails; 

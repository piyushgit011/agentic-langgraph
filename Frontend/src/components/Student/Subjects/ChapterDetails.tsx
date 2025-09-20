import React, { useState, useEffect } from 'react';
import {
    PageWrapper,
    LeftSidebar,
    RightContent,
    ChapterTitle,
    ChapterTag,
    CardTitleWrapper,
    ChapterItem,
    ChapterBox,
    ChapterInfoContainer,
    ActivityItem,
    Dot,
    ActivitiesList
} from './SubjectsListingStyles';
import Star from '../../../assets/images/star.svg';
import 'react-circular-progressbar/dist/styles.css';
import TopicCollapse from './TopicCollapse';
import { Grid } from '@mui/material';
import { getApiConfig } from '../../../api';
import { fetchData } from '../../../utils/apiUtils';
import { useSelector, useDispatch } from 'react-redux';
import { setTopicData } from '../../../store/slices/studySlice';
import { RootState } from '../../../store/store';
import { Heading } from '../../common/Elements/Typography/Typography';

interface Chapter {
    id: number;
    title: string;
    subtitle: string;
    chapterId: number;
    chapterName: string;
}

interface Topic {
    topicId: number;
    topicName: string;
}

interface CurrentChapter {
    chapterId: number;
    chapterName: string;
    topics: Topic[];
}

interface SubjectInfo {
    subjectName: string;
    subjectId: number;
}

const ChapterDetails: React.FC = () => {
    const dispatch = useDispatch();
    const { subjectId, subjectName, chapterId, chapterName } = useSelector((state: RootState) => state.study);

    // State for API data
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentChapter, setCurrentChapter] = useState<CurrentChapter | null>(null);
    const [subjectInfo, setSubjectInfo] = useState<SubjectInfo | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedChapterId, setSelectedChapterId] = useState<number | null>(chapterId);

    // Fetch chapters and topics data
    const fetchChaptersTopics = async (targetChapterId: number | null) => {
        if (targetChapterId) {
            try {
                setLoading(true);
                setError(null);

                const apiConfig = getApiConfig('getChaptersTopics');
                const payload = {
                    subjectId: subjectId,
                    chapterId: parseInt(targetChapterId.toString())
                };

                const response = await fetchData(apiConfig.url, apiConfig.method, payload);

                if (response.success) {
                    const { data } = response;

                    // Transform chapters data
                    const transformedChapters: Chapter[] = data.allChapters.map((chapter: any, index: number) => ({
                        id: chapter.chapterId,
                        title: `Chapter-${index + 1}`,
                        subtitle: chapter.chapterName,
                        chapterId: chapter.chapterId,
                        chapterName: chapter.chapterName
                    }));

                    setChapters(transformedChapters);
                    setCurrentChapter(data.specificChapter);
                    setSubjectInfo(data.subjectInfo);

                    // Dispatch topic details if topics are available
                    if (data.specificChapter && data.specificChapter.topics && data.specificChapter.topics.length > 0) {
                        const firstTopic = data.specificChapter.topics[0];
                        dispatch(setTopicData({ topicId: firstTopic.topicId, topicName: firstTopic.topicName }));
                    }
                } else {
                    setError('Failed to fetch chapters and topics');
                }
            } catch (error) {
                console.error('Error fetching chapters and topics:', error);
                setError('Error fetching chapters and topics');
            } finally {
                setLoading(false);
            }
        }
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchChaptersTopics(selectedChapterId);
    }, []);

    // Handle chapter selection
    const handleChapterSelect = (chapterId: number) => {
        setSelectedChapterId(chapterId);
        fetchChaptersTopics(chapterId);
    };

    return (
        <PageWrapper>
            <LeftSidebar>
                <CardTitleWrapper>
                    <div className='subject_title'>
                        <Heading as="h3" variant="h5">
                            <img src={Star} alt="Star" />
                            {subjectInfo?.subjectName || 'Loading...'}
                        </Heading>
                    </div>
                </CardTitleWrapper>
                <div>
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <p>Loading chapters...</p>
                        </div>
                    ) : error ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
                            <p>{error}</p>
                        </div>
                    ) : (
                        chapters.map((chapter) => (
                            <ChapterItem
                                key={chapter.id}
                                active={chapter.id === selectedChapterId}
                                onClick={() => handleChapterSelect(chapter.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h4>{chapter.title}</h4>
                                <span>{chapter.subtitle}</span>
                            </ChapterItem>
                        ))
                    )}
                </div>
            </LeftSidebar>

            <RightContent>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Loading chapter details...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                        <p>{error}</p>
                    </div>
                ) : currentChapter ? (
                    <>
                        <ChapterInfoContainer>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                                    <ChapterBox>
                                        <ChapterTag className='chapter_tag'>Chapter-{chapters.findIndex(ch => ch.chapterId === currentChapter.chapterId) + 1}</ChapterTag>
                                        <ChapterTitle>{currentChapter.chapterName}</ChapterTitle>
                                    </ChapterBox>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                                    <ChapterBox>
                                        <ChapterTag className='chapter_tag'>Activities</ChapterTag>
                                        <ActivitiesList className=''>
                                            <ActivityItem><Dot color="#4ade80" />Video tutorial</ActivityItem>
                                            <ActivityItem><Dot color="#6366f1" />Exercise</ActivityItem>
                                            <ActivityItem><Dot color="#22c55e" />Quiz</ActivityItem>
                                            <ActivityItem><Dot color="#3b82f6" />Chapter test</ActivityItem>
                                        </ActivitiesList>
                                    </ChapterBox>
                                </Grid>
                            </Grid>
                        </ChapterInfoContainer>
                        <TopicCollapse fetchedTopics={currentChapter.topics} />
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>No chapter data available</p>
                    </div>
                )}
            </RightContent>
        </PageWrapper>
    );
};

export default ChapterDetails; 

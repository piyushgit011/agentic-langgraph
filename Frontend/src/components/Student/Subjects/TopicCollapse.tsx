import React, { useState, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import {
    Actions,
    TopicCard,
    TopRow,
    Title,
    ToggleButton,
    CollapsibleWrapper,
    CollapsibleInner,
    SubTopicList,
    ProgressCircle,
    LetsStartButton,
} from './SubjectsListingStyles';

import TopicIcon from '../../../assets/images/topic.svg';
import { Button } from '../../common/Elements';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setTopicData } from '../../../store/slices/studySlice';

interface Topic {
    topicId: number;
    topicName: string;
}

interface TopicCollapseProps {
    fetchedTopics: Topic[];
}

const TopicCollapse: React.FC<TopicCollapseProps> = ({ fetchedTopics }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { subjectLabel, chapterNumber } = useParams();

    // Transform fetched topics to match component format
    const topics = fetchedTopics ? fetchedTopics.map((topic) => ({
        id: topic.topicId,
        title: topic.topicName,
        progress: 0, // Default progress, can be updated later
        subTopics: [
            // For now, we'll use placeholder subtopics since they're not in the API response
            // You can add actual subtopics when the API provides them
            `${topic.topicName} - Introduction`,
            `${topic.topicName} - Practice`,
            `${topic.topicName} - Assessment`
        ]
    })) : [];

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    const toggleIndex = (index: number) => {
        setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    // If no topics are available, show a message
    if (!fetchedTopics || fetchedTopics.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>No topics available for this chapter yet.</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Topics will be added soon. Please check back later.
                </p>
            </div>
        );
    }

    return (
        <div>
            {topics.map((topic, index) => {
                const isOpen = openIndex === index;

                return (
                    <TopicCard key={index}>
                        <TopRow>
                            <Title>
                                <img src={TopicIcon} alt="Topic" />
                                Topic {(index + 1).toString()}: <span className="topic_name">{topic.title}</span>
                            </Title>
                            <Actions>
                                <LetsStartButton>
                                    <Button
                                        type="button"
                                        color="secondary"
                                        label={`Lets start`}
                                        onClick={() => {
                                            // Save topic data to Redux
                                            dispatch(setTopicData({
                                                topicId: topic.id,
                                                topicName: topic.title,
                                            }));

                                            // Navigate to learning view
                                            navigate(
                                                `/subjects/${subjectLabel}/${chapterNumber}/topic-${topic.id.toString()}`,
                                                {
                                                    state: {
                                                        topicTitle: topic.title,
                                                        topicNumber: index + 1
                                                    }
                                                }
                                            );

                                        }}
                                    />
                                       

                                </LetsStartButton>
                                <ToggleButton onClick={() => toggleIndex(index)}>
                                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                                </ToggleButton>
                            </Actions>
                        </TopRow>

                        <CollapsibleWrapper
                            style={{
                                height: isOpen
                                    ? `${contentRefs.current[index]?.scrollHeight}px`
                                    : '0px'
                            }}
                        >
                            <CollapsibleInner
                                ref={(el) => {
                                    contentRefs.current[index] = el;
                                }}
                            >
                                <SubTopicList>
                                    {topic.subTopics.map((sub, i) => (
                                        <li key={i}>▹ {sub}</li>
                                    ))}
                                </SubTopicList>
                                <ProgressCircle>
                                    <CircularProgressbar
                                        value={topic.progress}
                                        text={`${topic.progress}%`}
                                        styles={buildStyles({
                                            textColor: '#343A40',
                                            pathColor: '#73D673',
                                            trailColor: '#D9D9D9',
                                        })}
                                    />
                                </ProgressCircle>
                            </CollapsibleInner>
                        </CollapsibleWrapper>
                    </TopicCard>
                );
            })}
        </div>
    );
};

export default TopicCollapse; 

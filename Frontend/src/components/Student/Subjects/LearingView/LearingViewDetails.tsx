import React, { useEffect, useState } from 'react';
import {
    CurrentTopicData,
    LearingRightSide,
    LearingTopbar,
    LearningLeftSide,
    LearningViewWrapper,
    NextTpoicsWrapper,
    RegularSmallText,
    LearningContentMain,
    AiTutorwrapperSM,
} from './LearingViewStyles';
import { LuBrain } from "react-icons/lu";
import WestIcon from '@mui/icons-material/West';
import AITutor from './AITutor';
import { Paragraph } from '../../../common/Elements/Typography/Typography';
import { useTheme } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import LearningSteps from './LearningSteps';
import UpNextTopicsModal from './UpNextTopicsModal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../store/store';
import { setCurrentTopicNumber } from '../../../../store/slices/studySlice';
import { Button } from '../../../common/Elements';
import { apiService } from '../../../../services/apiService';

const LearingViewDetails: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { topicId, topicName } = useSelector((state: RootState) => state.study);
    const { currentTopicNumber } = useSelector((state: RootState) => state.study.learningSteps);

    const defaultLearing = "default" as const;
    const FullVideo = "FullVideo" as const;
    const FullChatView = "FullChatView" as const;

    const [mode, setMode] = useState<'default' | 'FullVideo' | 'FullChatView'>(defaultLearing);
    const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth <= 991.5);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [subHeader, setSubHeader] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [data, setData] = useState<string | null>(null);


    useEffect(() => {
        const updateView = () => {
            const isSmall = window.innerWidth <= 991.5;
            setIsSmallDevice(isSmall);
            setMode(isSmall ? FullVideo : defaultLearing);
        };

        updateView(); // Initial
        window.addEventListener("resize", updateView);
        return () => window.removeEventListener("resize", updateView);
    }, []);

    // API call to fetch topic data when component mounts
    useEffect(() => {
        const fetchTopicData = async () => {
            if (topicId) {
                try {
                    const response = await apiService.getTopicById(topicId);

                    if (response.success && response.data) {
                        if (response.data.videoUrl) {
                            setVideoUrl(response.data.videoUrl);
                            setSubHeader(["videos", "Tool"])
                        }
                        else {
                            setData(response.data.data || null);
                            setSubHeader(["Data", "Tool"])
                        }
                    }
                } catch (error) {
                    console.error('Error fetching topic data:', error);
                }
            }
        };

        fetchTopicData();
    }, [topicId]);

    // Initial topic from navigation
    const initialTopicTitle = topicName || '';

    // Make it dynamic so it can be updated
    const [currentTopicTitle, setCurrentTopicTitle] = useState<string>(initialTopicTitle);

    const { subjectLabel, chapterNumber } = useParams<{ subjectLabel: string; chapterNumber: string }>();

    const handleBack = () => {
        navigate(`/subjects/${subjectLabel}/${chapterNumber}`);
    };

    // Callback for moving to next topic
    const handleNextTopic = (nextTitle: string, nextNumber: string | number) => {
        setCurrentTopicTitle(nextTitle);
        dispatch(setCurrentTopicNumber(Number(nextNumber)));
    };

    const handleClose = () => {
        if (mode === defaultLearing) {
            setMode(FullVideo);
            console.log("It is full video view");
        }
    };

    const hadleVideoShow = () => {
        if (mode === FullVideo) {
            setMode(defaultLearing);
            console.log("It is default Learing view");
        }
        else if (mode === FullChatView) {
            setMode(defaultLearing);
            console.log("It is default Learing view");
        }
    };

    const handleExapnChat = () => {
        if (mode === defaultLearing) {
            setMode(FullChatView);
            console.log("It is default Learing view");
        }
        else if (mode === FullChatView) {
            setMode(defaultLearing);
            console.log("It is default Learing view");
        }
    };

    return (
        <>
            <LearningViewWrapper>
                {/* Left Section */}
                <LearningLeftSide $mode={mode}>
                    <LearingTopbar>
                        <div className='current_topic_title'>
                            <Button

                                type="button"
                                color="secondary"
                                direction='right'
                                className='back-button'
                                onClick={handleBack}

                            >
                                <span> Back</span>
                            </Button>
                            {(isSmallDevice && mode === 'FullVideo') && (

                                <Button
                                    type="button"
                                    color="primary"
                                    className='square_btn'
                                    rightIcon={<WestIcon />}
                                    onClick={handleBack}
                                >
                                </Button>

                            )}
                            <CurrentTopicData>
                                <Paragraph color={theme.colors.primary}>
                                    Topic {currentTopicNumber}:
                                </Paragraph>
                                <RegularSmallText>{currentTopicTitle}</RegularSmallText>
                            </CurrentTopicData>
                        </div>
                        <NextTpoicsWrapper>
                            <Button

                                type="button"
                                color="secondary"
                                className='small_padding_button'
                                onClick={() => setIsModalOpen(true)}

                            >
                                Up Next topics
                            </Button>
                            {mode === 'FullVideo' && (
                                <Button

                                    type="button"
                                    color="primary"
                                    direction='right'
                                    rightIcon={<LuBrain />}
                                    className='small_padding_button'
                                    onClick={hadleVideoShow}


                                >
                                    Ai Tutor
                                </Button>

                            )}
                        </NextTpoicsWrapper>
                    </LearingTopbar>

                    <LearningContentMain>
                        <LearningSteps
                            onNextTopic={handleNextTopic}
                            subHeader={subHeader}
                            videoUrl={videoUrl}
                            data={data}
                        />
                    </LearningContentMain>
                </LearningLeftSide>

                {/* Right Section */}
                <LearingRightSide $mode={mode}>
                    {mode === 'FullChatView' && (
                        <LearingTopbar>
                            <div className='current_topic_title'>
                                {/* <BackButton onClick={handleBack} type="button" className='back_button'>
                                    <BackArrowIcon><WestIcon /></BackArrowIcon>
                                    Back
                                </BackButton> */}
                                <Button

                                    type="button"
                                    color="secondary"
                                    direction='right'
                                    className='back-button'
                                    onClick={() => navigate('/')}

                                >
                                    Back
                                </Button>
                                <CurrentTopicData>
                                    <Paragraph color={theme.colors.primary}>
                                        Topic {currentTopicNumber}:
                                    </Paragraph>
                                    <RegularSmallText>{currentTopicTitle}</RegularSmallText>
                                </CurrentTopicData>
                            </div>
                            <NextTpoicsWrapper>
                                <Button

                                    type="button"
                                    color="secondary"
                                    className='small_padding_button'
                                    onClick={() => setIsModalOpen(true)}

                                >
                                    Up Next topics
                                </Button>
                                <Button

                                    type="button"
                                    color="primary"
                                    direction='right'
                                    rightIcon={<LuBrain />}
                                    className='small_padding_button'
                                    onClick={hadleVideoShow}


                                >
                                    See Video
                                </Button>
                            </NextTpoicsWrapper>
                        </LearingTopbar>
                    )}
                    {(!isSmallDevice || mode === 'FullChatView') && (
                        <AITutor
                            expandChat={handleExapnChat}
                            closeView={handleClose}
                            mode={mode}
                        />
                    )}
                </LearingRightSide>
            </LearningViewWrapper>

            {/* Small_device_chat_View::Start */}
            {isSmallDevice && mode !== 'FullChatView' && (
                <AiTutorwrapperSM>
                    <Button
                        type="button"
                        color="secondary"
                        className='small_padding_button'
                        onClick={() => setIsModalOpen(true)}
                    >
                        Up Next topics
                    </Button>
                    <Button
                        type="button"
                        color="primary"
                        direction='right'
                        rightIcon={<LuBrain />}
                        className='small_padding_button'
                        onClick={hadleVideoShow}
                    >
                        Ai Tutor
                    </Button>
                </AiTutorwrapperSM>
            )}
            {/* Small_device_chat_View::End */}

            <UpNextTopicsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectTopic={handleNextTopic}
            />
        </>
    );
};

export default LearingViewDetails; 

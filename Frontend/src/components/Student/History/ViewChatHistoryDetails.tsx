import React, { useEffect, useState } from 'react';
import {
    AiIcon,
    AIMessage,
    AiMessageTextTime,
    ChatBody,
    ChatFooter,
    ChatHeader,
    ChatInput,
    ChatInputWrapper,
    ChatIpnutUploadIcon,
    ChatWrapper,
    Dot,
    IconButton,
    MessageTime,
    SendButton,
    SquareButtons,
    StudentMessage,
    StudentMessageWrapper,
    ThinkingWrapper,
    TutorInfo,
    TutorModeButtons,
} from '../Subjects/LearingView/LearingViewStyles';
import { FaPaperclip, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import Markdown from 'react-markdown';

import { IoIosExpand, IoMdClose } from "react-icons/io";
import { LuBrain } from "react-icons/lu";
import {Paragraph} from '../../common/Elements/Typography/Typography';
import { useTheme } from 'styled-components';
import { ChatHistoryBody, ChatHistoryFooter, ChatHistoryHeader, ChatHistoryWrapper } from './HistoryStyle';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getApiConfig } from '../../../api';
import { fetchWithAuth } from '../../../utils/apiUtils';
import { RootState } from '../../../store/store';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface ChatHistory {
    sessionId: string;
    messages: ChatMessage[];
    topicId: number;
    topicName: string;
}

interface ViewChatHistoryDetailsProps {
    closeView?: () => void;
    expandChat?: () => void;
    mode?: string;
}

const ViewChatHistoryDetails: React.FC<ViewChatHistoryDetailsProps> = ({
    closeView,
    expandChat,
    mode
}) => {
    const theme = useTheme();
    const { sessionId } = useParams<{ sessionId: string }>();
    const { accessToken } = useSelector((state: RootState) => state.auth);

    const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch chat history details
    const fetchChatHistoryDetails = async () => {
        if (!sessionId || !accessToken) return;

        try {
            setLoading(true);
            setError(null);

            const apiConfig = getApiConfig('myHistory', { sessionId });
            const response = await fetchWithAuth(apiConfig.url, apiConfig.method, accessToken);

            if (response.success) {
                setChatHistory(response.data);
            } else {
                setError(response.message || 'Failed to fetch chat history');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch chat history');
            console.error('Error fetching chat history details:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChatHistoryDetails();
    }, [sessionId, accessToken]);

    // Format timestamp to readable time
    const formatTime = (timestamp: string): string => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            return 'Unknown time';
        }
    };

    if (loading) {
        return (
            <ChatHistoryWrapper>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Paragraph>Loading chat history...</Paragraph>
                </div>
            </ChatHistoryWrapper>
        );
    }

    if (error) {
        return (
            <ChatHistoryWrapper>
                <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                    <Paragraph>Error: {error}</Paragraph>
                </div>
            </ChatHistoryWrapper>
        );
    }

    if (!chatHistory) {
        return (
            <ChatHistoryWrapper>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Paragraph>No chat history found</Paragraph>
                </div>
            </ChatHistoryWrapper>
        );
    }

    return (
        <ChatHistoryWrapper>
            <ChatHistoryHeader>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AiIcon>
                        <LuBrain />
                    </AiIcon>
                    <div>
                        <Paragraph>AI Tutor</Paragraph>
                        <Paragraph>Topic: {chatHistory.topicName}</Paragraph>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {expandChat && (
                        <SquareButtons onClick={expandChat}>
                            <IoIosExpand />
                        </SquareButtons>
                    )}
                    {closeView && (
                        <SquareButtons onClick={closeView}>
                            <IoMdClose />
                        </SquareButtons>
                    )}
                </div>
            </ChatHistoryHeader>

            <ChatHistoryBody>
                {chatHistory.messages.map((message, index) => (
                    <div key={message.id || index}>
                        {message.role === 'user' ? (
                            <StudentMessageWrapper>
                                <StudentMessage>
                                    <Paragraph>{message.content}</Paragraph>
                                    <MessageTime>
                                        <Paragraph>{formatTime(message.timestamp)}</Paragraph>
                                    </MessageTime>
                                </StudentMessage>
                            </StudentMessageWrapper>
                        ) : (
                            <AIMessage>
                                <TutorInfo>
                                    <AiIcon>
                                        <LuBrain />
                                    </AiIcon>
                                    <div>
                                        <Paragraph>AI Tutor</Paragraph>
                                        <AiMessageTextTime>
                                            <Paragraph>{formatTime(message.timestamp)}</Paragraph>
                                        </AiMessageTextTime>
                                    </div>
                                </TutorInfo>
                                <div style={{ marginTop: '8px' }}>
                                    <Markdown>{message.content}</Markdown>
                                </div>
                            </AIMessage>
                        )}
                    </div>
                ))}
            </ChatHistoryBody>

            <ChatHistoryFooter>
                <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
                    <Paragraph style={{ textAlign: 'center', color: '#666' }}>
                        This is a read-only view of your chat history
                    </Paragraph>
                </div>
            </ChatHistoryFooter>
        </ChatHistoryWrapper>
    );
};

export default ViewChatHistoryDetails; 

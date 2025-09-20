import React from 'react';
import { useTheme } from 'styled-components';
import { Overlay, SidebarContainer, TopicList, TopicItem } from './UpNextTopicModalStyles';
import { Paragraph } from '../../../common/Elements/Typography/Typography';
import { CircleButtonFilled } from '../../../common/Elements/Modal/ModalStyle';
import CloseIcon from '@mui/icons-material/Close';

interface Topic {
    number: number;
    title: string;
}

interface UpNextTopicsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTopic?: (title: string, number: number) => void;
}

const UpNextTopicsModal: React.FC<UpNextTopicsModalProps> = ({ isOpen, onClose, onSelectTopic }) => {
    const theme = useTheme();
    const mockTopics: Topic[] = [
        { number: 2, title: 'JSX and Components' },
        { number: 3, title: 'Props and State' },
        { number: 4, title: 'React Hooks' },
        { number: 5, title: 'React Router' },
    ];

    if (!isOpen) return null;

    return (
        <>
            <Overlay onClick={onClose} />
            <SidebarContainer>
                <CircleButtonFilled onClick={onClose} className='upnext_modal_close'>
                    <CloseIcon />
                </CircleButtonFilled>
                <Paragraph color={theme.colors.primary}>
                    Up Next Topics
                </Paragraph>
                <TopicList>
                    {mockTopics.map((topic) => (
                        <TopicItem
                            key={topic.number}
                            onClick={() => {
                                if (onSelectTopic) {
                                    onSelectTopic(topic.title, topic.number);
                                }
                                onClose();
                            }}
                        >
                            Topic {topic.number}: {topic.title}
                        </TopicItem>
                    ))}
                </TopicList>
            </SidebarContainer>
        </>
    );
};

export default UpNextTopicsModal; 

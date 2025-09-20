import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Paper, Typography, CircularProgress, TextField, Button,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getApiConfig } from '../../../api';
import { fetchData } from '../../../utils/apiUtils';
import styled from 'styled-components';

const ChatContainer = styled(Box)`
  height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 20px;
  background-color: #f0f2f5;
`;

const MessageContainer = styled(Box) <{ isUser?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin: 10px 0;
  width: 100%;
`;

const MessageBubble = styled(Box) <{ isUser?: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${props => props.isUser ? '#d9fdd3' : '#ffffff'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-bottom: 8px;
`;

const MessageTime = styled(Typography)`
  font-size: 0.75rem;
  color: #667781;
  margin-top: 4px;
`;

interface SessionInfo {
  sessionId: string;
  studentId: string;
  topicId: string;
  timestamp: string;
  agents: string[];
  agentSystemPrompts: { [key: string]: { modelName?: string; systemPrompt?: string } };
}

interface ConversationMessage {
  sessionId: string;
  studentId: string;
  topicId: string;
  timestamp: string;
  message: string;
  response: string;
  question?: string;
  agents: { [key: string]: AgentData };
  agentSystemPrompts?: { [key: string]: string };
}

interface AgentData {
  tokenUsage?: {
    inputTokens: number;
    outputTokens: number;
  };
  token_usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  response?: string;
  output?: string;
  systemPrompt?: string;
  responseTime?: number;
  response_time?: number;
  inputPrompt?: string;
  input_prompt?: string;
}

const ViewChatDetails: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const sessionIdValue = sessionId || '';
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [callNumber, setCallNumber] = useState<string>('');
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const conversationRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [expandedAgentResponses, setExpandedAgentResponses] = useState<{ [key: string]: boolean }>({});

  const fetchConversation = useCallback(async () => {
    try {
      const apiConfig = getApiConfig('history', { sessionId: sessionIdValue });
      const response = await fetchData(apiConfig.url, apiConfig.method);
      if ((response as { success: boolean; data: ConversationMessage[] }).success && response.data) {
        const dataArr = response.data;

        if (dataArr.length > 0) {
          const [firstMessage, ...actualCalls] = dataArr;

          setSessionInfo({
            sessionId: firstMessage.sessionId,
            studentId: firstMessage.studentId,
            topicId: firstMessage.topicId,
            timestamp: firstMessage.timestamp,
            agents: firstMessage.agents,
            agentSystemPrompts: firstMessage.agentSystemPrompts || {}
          });

          setConversation(actualCalls);
        }
      } else {
        setError('Failed to fetch conversation details');
      }
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [sessionIdValue]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  const formatDate = (dateString: string): string => new Date(dateString).toLocaleString();

  const handleGoToCall = () => {
    const number = parseInt(callNumber);
    if (isNaN(number) || number < 1 || number > conversation.length) {
      alert('Please enter a valid call number');
      return;
    }
    const targetRef = conversationRefs.current[number];
    if (targetRef && chatContainerRef.current) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      alert(`Call #${number} not found`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') handleGoToCall();
  };

  const handleCallNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCallNumber(e.target.value);
  };

  const toggleAgentResponseExpansion = (conversationIndex: number, agentName: string) => {
    const key = `${conversationIndex}_${agentName}`;
    setExpandedAgentResponses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const truncateText = (text: string, maxLength: number = 200): string =>
    text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;

  const calculateTokens = (agentData: AgentData) => {
    const inputTokens = agentData?.tokenUsage?.inputTokens || agentData?.token_usage?.input_tokens || 0;
    const outputTokens = agentData?.tokenUsage?.outputTokens || agentData?.token_usage?.output_tokens || 0;
    return { input: inputTokens, output: outputTokens, total: inputTokens + outputTokens };
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">{error}</Typography></Box>;

  return (
    <Box>
      {sessionInfo && (
        <>
          {/* Header */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Typography><strong>Student ID:</strong> {sessionInfo.studentId}</Typography>
                <Typography><strong>Topic:</strong> {sessionInfo.topicId}</Typography>
                <Typography><strong>Created:</strong> {formatDate(sessionInfo.timestamp)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Jump to Message"
                  size="small"
                  value={callNumber}
                  onChange={handleCallNumberChange}
                  onKeyPress={handleKeyPress}
                  sx={{ width: 140 }}
                />
                <Button variant="contained" onClick={handleGoToCall}>Go</Button>
              </Box>
            </Box>

            {/* System Prompts Accordion */}
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 'bold' }}>View System Prompts</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {Object.entries(sessionInfo?.agentSystemPrompts || {}).map(([key, data]) => (
                    <Box key={key} sx={{ flex: 1, minWidth: 300 }}>
                      <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Typography>
                      <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="caption">Model: {data?.modelName || 'Unknown'}</Typography>
                        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                          {data?.systemPrompt || 'No system prompt'}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* Chat Messages */}
          <ChatContainer ref={chatContainerRef}>
            {conversation.map((conv, index) => (
              <Box key={index} ref={(el: HTMLDivElement | null) => { if (el) conversationRefs.current[index + 1] = el; }}>
                {/* User Question */}
                <MessageContainer isUser>
                  <MessageBubble isUser>
                    <Typography variant="caption" sx={{ color: '#006d77', display: 'block', mb: 1 }}>
                      Message #{index + 1}
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                      {conv.question}
                    </Typography>
                    <MessageTime>{formatDate(conv.timestamp)}</MessageTime>
                  </MessageBubble>
                </MessageContainer>
                {/* Agent Responses */}
                <MessageContainer>
                  <MessageBubble>
                    {Object.entries(conv.agents || {}).map(([key, agentData]) => {
                      if (!agentData?.output && agentData?.responseTime === 0.0) return null;

                      const tokens = calculateTokens(agentData);
                      const responseTime = agentData?.responseTime || agentData?.response_time || 0;
                      const isExpanded = expandedAgentResponses[`${index}_${key}`];

                      return (
                        <Box key={key} sx={{ mb: 2 }}>
                          <Typography variant="caption" sx={{ color: '#006d77', display: 'block', mb: 1, fontWeight: 'bold' }}>
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Typography>
                          <Box sx={{
                            backgroundColor: '#f8f9fa',
                            p: 2,
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}>

                            {/* Input Prompt Section */}
                            {(agentData?.inputPrompt || agentData?.input_prompt) && (
                              <>
                                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2, mb: 1 }}>
                                  Input Prompt:
                                </Typography>
                                <Box sx={{ backgroundColor: '#f0f0f0', p: 1, borderRadius: 1 }}>
                                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {(agentData?.inputPrompt || agentData?.input_prompt)?.length > 200
                                      ? (isExpanded ? (agentData?.inputPrompt || agentData?.input_prompt) : truncateText(agentData?.inputPrompt || agentData?.input_prompt, 200))
                                      : (agentData?.inputPrompt || agentData?.input_prompt)}
                                  </Typography>
                                  {(agentData?.inputPrompt || agentData?.input_prompt)?.length > 200 && (
                                    <Button
                                      size="small"
                                      onClick={() => toggleAgentResponseExpansion(index, key)}
                                      sx={{ mt: 1, textTransform: 'none' }}
                                    >
                                      {isExpanded ? 'Show Less' : 'Read More'}
                                    </Button>
                                  )}
                                </Box>
                              </>
                            )}

                            {/* Output Section */}
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                              Output:
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {agentData?.output && agentData.output.length > 200
                                ? (isExpanded ? agentData.output : truncateText(agentData.output, 200))
                                : agentData?.output}
                            </Typography>
                            {agentData?.output && agentData.output.length > 200 && (
                              <Button
                                size="small"
                                onClick={() => toggleAgentResponseExpansion(index, key)}
                                sx={{ mt: 1, textTransform: 'none' }}
                              >
                                {isExpanded ? 'Show Less' : 'Read More'}
                              </Button>
                            )}
                            <Box sx={{
                              display: 'flex',
                              gap: 2,
                              mt: 1,
                              fontSize: '0.75rem',
                              color: '#667781'
                            }}>
                              <span>🔢 Tokens: {tokens.total}</span>
                              <span>⏱️ Time: {responseTime.toFixed(2)}s</span>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                    <MessageTime>{formatDate(conv.timestamp)}</MessageTime>
                  </MessageBubble>
                </MessageContainer>
              </Box>
            ))}
          </ChatContainer>
        </>
      )}
    </Box>
  );
};

export default ViewChatDetails; 

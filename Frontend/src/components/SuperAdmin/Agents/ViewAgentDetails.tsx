import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { RxBoxModel } from "react-icons/rx";
import { FiBookOpen } from "react-icons/fi";
import { TbTemperature } from "react-icons/tb";
import { RxTokens } from "react-icons/rx";
import Star from '../../../assets/images/star.svg';
import { apiService } from '../../../services/apiService';
import { MdSupportAgent } from "react-icons/md";
import {
    CreateCardBody,
    CreateCardFooter,
    CreateCardHeader,
    CreateFormWrapper,
    CreateMainCard,
    IconTitle,
} from '../CreateFormstyles';
import { Button, Input, Paragraph, Textarea } from '../../common/Elements';

interface AgentData {
    agentName: string;
    model: string;
    temperature: string;
    maxToken: string;
    Prompt: string;
    isActive: boolean;
}

const ViewAgentDetails: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const agentId = location.state?.agentData;

    const [agentData, setAgentData] = useState<AgentData>({
        agentName: "",
        model: "",
        temperature: "",
        maxToken: "",
        Prompt: "",
        isActive: true,
    });

    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Fetch agent data on component mount
    useEffect(() => {
        const fetchAgentData = async () => {
            if (!agentId) {
                setError("No agent ID provided");
                setIsFetching(false);
                return;
            }

            try {
                setIsFetching(true);
                setError("");
                const response = await apiService.getAgentById(agentId.toString());

                if (response.success && response.data) {
                    setAgentData({
                        agentName: response.data.agent_name,
                        model: response.data.model_name,
                        temperature: response.data.temperature.toString(),
                        maxToken: response.data.max_tokens.toString(),
                        Prompt: response.data.prompt,
                        isActive: response.data.is_active,
                    });
                } else {
                    setError(response.message || "Failed to fetch agent data");
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching agent data";
                setError(errorMessage);
            } finally {
                setIsFetching(false);
            }
        };

        fetchAgentData();
    }, [agentId]);

    if (isFetching) {
        return (
            <CreateFormWrapper>
                <CreateMainCard className='full_create_form'>
                    <CreateCardBody>
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div>Loading agent data...</div>
                        </div>
                    </CreateCardBody>
                </CreateMainCard>
            </CreateFormWrapper>
        );
    }

    return (
        <CreateFormWrapper>
            <CreateMainCard className='full_create_form'>
                <CreateCardHeader>
                    <IconTitle>
                        <Paragraph>
                            <img src={Star} alt="Star" />
                            View Agent
                        </Paragraph>
                    </IconTitle>
                </CreateCardHeader>

                <CreateCardBody>
                    <Grid container spacing={3}>
                        {/* Agent Name */}
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                            <Input
                                name="agent"
                                type="text"
                                label="Agent name"
                                icon={<MdSupportAgent />}
                                value={agentData.agentName}
                                readOnly
                                disabled
                            />
                        </Grid>

                        {/* Model Name */}
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                            <Input
                                name="model"
                                type="text"
                                label="Model"
                                icon={<RxBoxModel />}
                                value={agentData.model}
                                readOnly
                                disabled
                            />
                        </Grid>

                        {/* Temperature */}
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                            <Input
                                name="Temprature"
                                type="text"
                                label="Temprature"
                                icon={<TbTemperature />}
                                value={agentData.temperature}
                                readOnly
                                disabled
                            />
                        </Grid>

                        {/* Max Token */}
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                            <Input
                                name="Max token"
                                type="text"
                                label="Max token"
                                icon={<RxTokens />}
                                value={agentData.maxToken}
                                readOnly
                                disabled
                            />
                        </Grid>

                        {/* Is Active Status */}
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                                <input
                                    type="checkbox"
                                    checked={agentData.isActive}
                                    disabled
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <label style={{ fontSize: '14px', fontWeight: '500' }}>
                                    Active Status
                                </label>
                            </div>
                        </Grid>

                        {/* Prompt Description */}
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                            <Textarea
                                icon={<FiBookOpen />}
                                inputWrapperClass="border_text_area"
                                value={agentData.Prompt}
                                label="Prompt"
                                rows={18}
                                readOnly
                                disabled
                            />
                        </Grid>
                    </Grid>
                </CreateCardBody>

                <CreateCardFooter>
                    {error && (
                        <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}
                    <div className="footer_buttons">
                        <Button
                            textOnly={true}
                            label={'Back'}
                            color='primary'
                            onClick={() => navigate(-1)}
                        />
                    </div>
                </CreateCardFooter>
            </CreateMainCard>
        </CreateFormWrapper>
    );
};

export default ViewAgentDetails;

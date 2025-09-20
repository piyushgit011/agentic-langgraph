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
import { Button, Input, Paragraph, Select, Textarea } from '../../common/Elements';

interface FormData {
  agentName: string;
  model: string;
  temperature: string;
  maxToken: string;
  Prompt: string;
  isActive: boolean;
}

interface ModelOption {
  value: string;
  label: string;
}

const EditAgentForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const agentId = location.state?.agentData;

  const [formData, setFormData] = useState<FormData>({
    agentName: "",
    model: "",
    temperature: "",
    maxToken: "",
    Prompt: "",
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const modelOptions: ModelOption[] = [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4o', label: 'GPT-4o' },
  ];

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
          setFormData({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form data
      if (!formData.agentName || !formData.model || !formData.temperature || !formData.maxToken || !formData.Prompt) {
        setError("All fields are required");
        return;
      }

      const payload = {
        agent_name: formData.agentName,
        prompt: formData.Prompt,
        is_active: formData.isActive,
        model_name: formData.model,
        temperature: parseFloat(formData.temperature),
        max_tokens: parseInt(formData.maxToken)
      };

      const response = await apiService.updateAgent(agentId.toString(), payload);

      if (response.success) {
        setSuccess("Agent updated successfully!");
        // Reset form
        setFormData({
          agentName: "",
          model: "",
          temperature: "",
          maxToken: "",
          Prompt: "",
          isActive: true,
        });
        navigate('/agents');
      } else {
        setError(response.message || "Failed to update agent");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while updating the agent";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
      <form onSubmit={handleSubmit}>
        <CreateMainCard className='full_create_form'>
          <CreateCardHeader>
            <IconTitle>
              <Paragraph>
                <img src={Star} alt="Star" />
                Edit Agent
              </Paragraph>
            </IconTitle>
          </CreateCardHeader>

          <CreateCardBody>
            <Grid container spacing={3}>

              {/* ✅ Agent Name */}
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                <Input
                  name="agent"
                  type="text"
                  label="Agent name"
                  placeholder="Agent name"
                  margin="0 0 8px 0"
                  icon={<MdSupportAgent />}
                  value={formData.agentName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, agentName: e.target.value })
                  }
                />
              </Grid>

              {/* ✅ Model Name */}
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                <Select
                  id="model"
                  icon={<RxBoxModel />}
                  label='Model'
                  value={formData.model}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  options={modelOptions}
                  placeholder="Modal Name"
                />
              </Grid>

              {/* ✅ Temperature */}
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                <Input
                  name="Temprature"
                  type="number"
                  label="Temprature"
                  placeholder="Temprature"
                  icon={<TbTemperature />}
                  value={formData.temperature}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, temperature: e.target.value })
                  }
                />
              </Grid>

              {/* ✅ Max Token */}
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                <Input
                  name="Max token"
                  type="number"
                  label="Max token"
                  placeholder="Max token"
                  icon={<RxTokens />}
                  value={formData.maxToken}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, maxToken: e.target.value })
                  }
                />
              </Grid>

              {/* ✅ Is Active Toggle */}
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    style={{ width: '18px', height: '18px' }}
                  />
                  <label htmlFor="isActive" style={{ fontSize: '14px', fontWeight: '500' }}>
                    Active Status
                  </label>
                </div>
              </Grid>

              {/* ✅ Prompt Description */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                  icon={<FiBookOpen />}
                  inputWrapperClass="border_text_area"
                  value={formData.Prompt}
                  label="Prompt"
                  rows={18}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, Prompt: e.target.value })
                  }
                  placeholder="Prompt"
                />
              </Grid>
            </Grid>
          </CreateCardBody>

          <CreateCardFooter>
            {/* Error and Success Messages */}
            {error && (
              <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>
                {success}
              </div>
            )}
            <div className="footer_buttons">
              <Button
                textOnly={true}
                label={'Cancel'}
                color='primary'
                onClick={() => navigate(-1)}
              />
              <Button
                textOnly={true}
                label={isLoading ? 'Updating...' : 'Update'}
                color='secondary'
                type="submit"
                disabled={isLoading || isFetching}
              />
            </div>
          </CreateCardFooter>
        </CreateMainCard>
      </form>
    </CreateFormWrapper >
  );
};

export default EditAgentForm; 

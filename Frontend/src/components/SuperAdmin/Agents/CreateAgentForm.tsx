import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
}

interface ModelOption {
  value: string;
  label: string;
}

const CreateAgentForm: React.FC = () => {

  const [formData, setFormData] = useState<FormData>({
    agentName: "",
    model: "",
    temperature: "",
    maxToken: "",
    Prompt: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  const modelOptions: ModelOption[] = [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4o', label: 'GPT-4o' },
  ];

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
        created_by: "Jaimin",
        model_name: formData.model,
        temperature: parseFloat(formData.temperature),
        max_tokens: parseInt(formData.maxToken)
      };

      const response = await apiService.createAgent(payload);

      if (response.success) {
        setSuccess("Agent created successfully!");
        // Redirect after successful save
        navigate('/agents');
      } else {
        setError(response.message || "Failed to create agent");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the agent");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreateFormWrapper>
      <form onSubmit={handleSubmit}>
        <CreateMainCard className='full_create_form'>
          <CreateCardHeader>
            <IconTitle>
              <Paragraph>
                <img src={Star} alt="Star" />
                Create Agent
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
                  onChange={(e) =>
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
                  onChange={(e) =>
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
                  onChange={(e) =>
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
                  onChange={(e) =>
                    setFormData({ ...formData, maxToken: e.target.value })
                  }
                />
              </Grid>

              {/* ✅ Prompt Description */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                  icon={<FiBookOpen />}
                  inputWrapperClass="border_text_area"
                  value={formData.Prompt}
                  label="Prompt"
                  rows={18}
                  onChange={(e) =>
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
              {/* <LightButton type="button">Cancel</LightButton>
              <DarkButton type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Save'}
              </DarkButton> */}
              <Button
                textOnly={true}
                label={'Cancel'}
                color='primary'
                onClick={() => navigate(-1)}
              />
              <Button
                textOnly={true}
                label={isLoading ? 'Saving...' : 'Save'}
                color='secondary'
                type="submit"
                disabled={isLoading}
              />
            </div>
          </CreateCardFooter>
        </CreateMainCard>
      </form>
    </CreateFormWrapper >
  );
};

export default CreateAgentForm; 

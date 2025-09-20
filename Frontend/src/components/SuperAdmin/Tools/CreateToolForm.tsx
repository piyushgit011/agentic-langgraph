import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Star from '../../../assets/images/star.svg';
import { BsTextParagraph } from "react-icons/bs";
import { AiOutlineNumber } from "react-icons/ai";
import { RiRobot2Line } from "react-icons/ri";
import { FiDatabase } from "react-icons/fi";
import { PiExamLight } from "react-icons/pi";
import {
  CreateCardBody,
  CreateCardFooter,
  CreateCardHeader,
  CreateFormWrapper,
  CreateMainCard,
  DarkButton,
  IconTitle,
  LightButton,
} from '../CreateFormstyles';
import { TbTools } from "react-icons/tb";
import { Input, Paragraph, Select, Textarea } from '../../common/Elements';
import { toolAPI } from '../../../services/apiService';
import { useNavigate } from 'react-router-dom';

const CreateToolForm: React.FC = () => {

  const [selectModel, setSelectedModel] = useState<string>('');
  const [form, setForm] = useState({
    toolName: '',
    topicId: '',
    modelName: '',
    toolDescription: '',
    toolDataGenerationPrompt: '',
    toolPracticeGenerationPrompt: '',
    isActive: true,
    updatedBy: 'admin@example.com',
  });
  const navigate = useNavigate();

  return (
    <CreateFormWrapper>
      <form>
        <CreateMainCard className='full_create_form'>
          <CreateCardHeader>
            <IconTitle>
              <Paragraph>
                <img src={Star} alt="Star" />
                Create Tool
              </Paragraph>
            </IconTitle>
          </CreateCardHeader>
          <CreateCardBody>

            <Grid container spacing={2}>
              {/* Tool_Name::Start */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>

                <Input
                  name="tool"
                  type="text"
                  label="Tool Name"
                  placeholder="Tool name"
                  margin="0 0 8px 0"
                  icon={<TbTools />}
                  value={form.toolName}
                  onChange={(e: any) => setForm(prev => ({ ...prev, toolName: e.target.value }))}
                />
              </Grid>
              {/* Tool_Name::End */}

              {/* Topic_Id::Start */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>

                <Input
                  name="topicId"
                  type="text"
                  label="Topic Id"
                  placeholder="topicId"
                  icon={<AiOutlineNumber />}
                  value={form.topicId}
                  onChange={(e: any) => setForm(prev => ({ ...prev, topicId: e.target.value }))}
                />
              </Grid>
              {/* Topic_Id::End */}

              {/* Model_name::Start */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>

                <Select
                  id="model"
                  icon={<RiRobot2Line />}
                  label='Model'
                  value={selectModel}
                  onChange={(e) => { setSelectedModel(e.target.value); setForm(prev => ({ ...prev, modelName: e.target.value })); }}
                  options={[
                    { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
                    { value: 'gpt-4o', label: 'gpt-4o' },
                    { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
                    { value: "gemini-2.0-flash", label: "gemini-2.0-flash" },
                    { value: "gemini-2.5-flash", label: "gemini-2.5-flash" },
                    { value: "gemini-1.5-flash", label: "gemini-1.5-flash" },
                    { value: "gemini-1.0-flash", label: "gemini-1.0-flash" },
                    { value: "gemini-1.0-flash-lite", label: "gemini-1.0-flash-lite" },

                  ]}
                  placeholder="Select model"
                />
              </Grid>
              {/* Model_name::End */}

              {/* Tool_description::Start */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                  icon={<BsTextParagraph />}
                  label='Tool description'
                  placeholder="Tool description"
                  rows={5}
                  value={form.toolDescription}
                  onChange={(e: any) => setForm(prev => ({ ...prev, toolDescription: e.target.value }))}
                />
              </Grid>
              {/* Tool_description::End */}

              {/* Tool_DataGeneration_Prompt::Start */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                  icon={<FiDatabase />}
                  label='Tool dataGeneration prompt'
                  placeholder="Tool dataGeneration prompt"
                  rows={5}
                  value={form.toolDataGenerationPrompt}
                  onChange={(e: any) => setForm(prev => ({ ...prev, toolDataGenerationPrompt: e.target.value }))}
                />
              </Grid>
              {/* Tool_DataGeneration_Prompt::End */}

              {/* Tool_ExamGeneration_Prompt::Start */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                  icon={<PiExamLight />}
                  label='Tool examGeneration prompt'
                  placeholder="Tool examGeneration prompt"
                  rows={5}
                  value={form.toolPracticeGenerationPrompt}
                  onChange={(e: any) => setForm(prev => ({ ...prev, toolPracticeGenerationPrompt: e.target.value }))}
                />
              </Grid>
              {/* Tool_ExamGeneration_Prompt::End */}


            </Grid>
          </CreateCardBody>
          <CreateCardFooter>
            <div className='footer_buttons'>
              <LightButton>
                Cancel
              </LightButton>
              <DarkButton onClick={(e: any) => {
                e.preventDefault();
                const payload = {
                  toolName: form.toolName,
                  toolDescription: form.toolDescription,
                  toolDataGenerationPrompt: form.toolDataGenerationPrompt,
                  toolPracticeGenerationPrompt: form.toolPracticeGenerationPrompt,
                  topicId: Number(form.topicId || 0),
                  isActive: form.isActive,
                  modelName: form.modelName || selectModel,
                  updatedBy: form.updatedBy,
                };
                toolAPI.createTool(payload)
                  .then(() => navigate('/content/tools'))
                  .catch((err) => {
                    console.error('Create tool failed', err);
                    alert(err?.message || 'Failed to create tool');
                  });
              }}>
                Save
              </DarkButton>
            </div>
          </CreateCardFooter>
        </CreateMainCard>
      </form>
    </CreateFormWrapper >
  );
};

export default CreateToolForm; 

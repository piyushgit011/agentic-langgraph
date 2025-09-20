import React, { useEffect, useRef, useState } from 'react';
import { Grid } from '@mui/material';
import Star from '../../../assets/images/star.svg';
import { BsTextParagraph } from 'react-icons/bs';
import { AiOutlineNumber } from 'react-icons/ai';
import { RiRobot2Line } from 'react-icons/ri';
import { FiDatabase } from 'react-icons/fi';
import { PiExamLight } from 'react-icons/pi';
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
import { TbTools } from 'react-icons/tb';
import { Input, Paragraph, Select, Textarea } from '../../common/Elements';
import { useLocation, useNavigate } from 'react-router-dom';
import { toolAPI } from '../../../services/apiService';

const ViewToolDetails: React.FC = () => {
  const [form, setForm] = useState({
    toolName: '',
    topicId: '',
    modelName: '',
    toolDescription: '',
    toolDataGenerationPrompt: '',
    toolPracticeGenerationPrompt: '',
    isActive: true,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const toolId = searchParams.get('toolId');

  useEffect(() => {
    const didFetchRef = { current: false };
    const loadTool = async () => {
      if (!toolId || didFetchRef.current) return;
      didFetchRef.current = true;
      try {
        const res = await toolAPI.getToolById(toolId);
        const t = res.data?.data || res.data;
        if (!t) return;
        setForm({
          toolName: t.toolName || '',
          topicId: String(t.topicId ?? ''),
          modelName: t.modelName || '',
          toolDescription: t.toolDescription || '',
          toolDataGenerationPrompt: t.toolDataGenerationPrompt || '',
          toolPracticeGenerationPrompt: t.toolPracticeGenerationPrompt || '',
          isActive: Boolean(t.isActive),
        });
      } catch (e) {
        console.error('Failed to load tool', e);
      }
    };
    loadTool();
  }, [toolId]);

  return (
    <CreateFormWrapper>
      <form>
        <CreateMainCard className="full_create_form">
          <CreateCardHeader>
            <IconTitle>
              <Paragraph>
                <img src={Star} alt="Star" />
                View Tool
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
                  disabled
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
                  disabled
                />
              </Grid>
              {/* Topic_Id::End */}

              {/* Model_name::Start */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4 }}>
                <Select
                  id="model"
                  icon={<RiRobot2Line />}
                  label="Model"
                  value={form.modelName}
                  onChange={() => { }}
                  options={[
                    { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
                    { value: 'gpt-4o', label: 'gpt-4o' },
                    { value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo' },
                    { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
                    { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
                    { value: 'gemini-1.5-flash', label: 'gemini-1.5-flash' },
                    { value: 'gemini-1.0-flash', label: 'gemini-1.0-flash' },
                    { value: 'gemini-1.0-flash-lite', label: 'gemini-1.0-flash-lite' },
                  ]}
                  placeholder="Select model"
                  disabled
                />
              </Grid>
              {/* Model_name::End */}

              {/* Tool_description::Start */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                  icon={<BsTextParagraph />}
                  label="Tool description"
                  placeholder="Tool description"
                  rows={5}
                  value={form.toolDescription}
                  onChange={() => { }}
                  disabled
                />
              </Grid>
              {/* Tool_description::End */}

              {/* Tool_DataGeneration_Prompt::Start */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                  icon={<FiDatabase />}
                  label="Tool dataGeneration prompt"
                  placeholder="Tool dataGeneration prompt"
                  rows={5}
                  value={form.toolDataGenerationPrompt}
                  onChange={() => { }}
                  disabled
                />
              </Grid>
              {/* Tool_DataGeneration_Prompt::End */}

              {/* Tool_PracticeGeneration_Prompt::Start */}
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                <Textarea
                  icon={<PiExamLight />}
                  label="Tool practiceGeneration prompt"
                  placeholder="Tool practiceGeneration prompt"
                  rows={5}
                  value={form.toolPracticeGenerationPrompt}
                  onChange={() => { }}
                  disabled
                />
              </Grid>
              {/* Tool_ExamGeneration_Prompt::End */}
            </Grid>
          </CreateCardBody>
          <CreateCardFooter>
            <div className="footer_buttons">
              <LightButton onClick={(e) => { e.preventDefault(); navigate(-1); }}>
                Back
              </LightButton>
              <DarkButton disabled>
                Save
              </DarkButton>
            </div>
          </CreateCardFooter>
        </CreateMainCard>
      </form>
    </CreateFormWrapper>
  );
};

export default ViewToolDetails;

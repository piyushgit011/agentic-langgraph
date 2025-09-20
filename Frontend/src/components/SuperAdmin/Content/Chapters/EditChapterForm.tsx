import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { Grid, FormControl, MenuItem } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GoMortarBoard } from "react-icons/go";
import { MdOndemandVideo } from "react-icons/md";
import { RiBook2Line } from "react-icons/ri";
import { FiBookOpen } from "react-icons/fi";
import Star from '../../../../assets/images/star.svg';

import { BsTextParagraph } from "react-icons/bs";
import ModalPopup from '../../../common/Elements/Modal/Modal';
import {
  ChapterGridView,
  CreateCardBody,
  CreateCardFooter,
  CreateCardHeader,
  CreateFormWrapper,
  CreateMainCard,
  CustomSelectWrapper,
  DarkButton,
  IconBox,
  IconBoxSelect,
  IconTitle,
  InputWrapper,
  LightButton,
  StyledInput,
} from '../../CreateFormstyles';
import { useNavigate } from 'react-router-dom';
import { Input, Paragraph, Select, Textarea, Button } from '../../../common/Elements';

interface Option {
  value: string;
  label: string;
}

const EditChapterForm: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const boardOptions: Option[] = [
    { value: 'CBSE', label: 'CBSE' },
    { value: 'ICSE', label: 'ICSE' },
    { value: 'IGCSE', label: 'IGCSE' },
    { value: 'IB', label: 'IB' },
    { value: 'NIOS', label: 'NIOS' },
    { value: 'AISSCE', label: 'AISSCE' },
  ];

  const classOptions: Option[] = [
    { value: 'Class 4', label: 'Class 4' },
    { value: 'Class 5', label: 'Class 5' },
    { value: 'Class 6', label: 'Class 6' },
    { value: 'Class 7', label: 'Class 7' },
    { value: 'Class 8', label: 'Class 8' },
    { value: 'Class 9', label: 'Class 9' },
    { value: 'Class 10', label: 'Class 10' },
  ];

  const subjectOptions: Option[] = [
    { value: 'Maths', label: 'Maths' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'English', label: 'English' },
    { value: 'Gujarati', label: 'Gujarati' },
    { value: 'Marathi', label: 'Marathi' },
    { value: 'Tamil', label: 'Tamil' },
    { value: 'Kannad', label: 'Kannad' },
  ];

  const [board, setBoard] = useState<string>('CBSE'); 
  const [className, setClassName] = useState<string>('Class 4');
  const [subject, setSubject] = useState<string>('Maths');
  const [chapterName, setChapterName] = useState<string>('Linear Equations in Two Variables');
  const [chapterDescription, setChapterDescription] = useState<string>(
    `Deals with solving linear equations graphically and algebraically.Helps in understanding solutions as points of intersection of lines.Covers Euclid's Division Lemma, the Fundamental Theorem of Arithmetic, HCF, LCM, and properties of irrational numbers.Helps build the base for number theory and prime factorization concepts.`
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleChangeBaord = (e: React.ChangeEvent<{ value: unknown }>) => setBoard(e.target.value as string);
  const handleChangeClass = (e: React.ChangeEvent<{ value: unknown }>) => setClassName(e.target.value as string);
  const handleChangeSubjects = (e: React.ChangeEvent<{ value: unknown }>) => setSubject(e.target.value as string);

  return (
    <>
      <CreateFormWrapper>
        <form>
          <CreateMainCard className='full_create_form'>
            <CreateCardHeader>
              <IconTitle>
                <Paragraph>
                  <img src={Star} alt="Star" />
                  Edit Chapter Details
                </Paragraph>
              </IconTitle>
            </CreateCardHeader>
            <CreateCardBody>
              <Grid container spacing={3}>

                {/* Select_board::Start */}
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                  <Select
                    icon={<GoMortarBoard />}
                    label='Select board'
                    placeholder="Select board"
                    value={board}
                    onChange={handleChangeBaord}
                    options={boardOptions}
                  />
                </Grid>
                {/* Select_board::End */}

                {/* Select_class::Start */}
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                  <Select
                    icon={<MdOndemandVideo />}
                    label='Select class'
                    placeholder="Select class"
                    value={className}
                    onChange={handleChangeClass}
                    options={classOptions}
                  />
                </Grid>
                {/* Select_class::End */}

                {/* Select_subject::Start */}
                <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                  <Select
                    icon={<RiBook2Line />}
                    label='Select subject'
                    placeholder="Select subject"
                    value={subject}
                    onChange={handleChangeSubjects}
                    options={subjectOptions}
                  />
                </Grid>
                {/* Select_subject::End */}

                {/* ChapterName::Start */}
                <Grid size={{ xs: 12 }}>
                  <Input
                    name="chapter name"
                    type="text"
                    label="Chapter name"
                    placeholder="Chapter name"
                    margin="0 0 8px 0"
                    icon={<FiBookOpen />}
                    value={chapterName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChapterName(e.target.value)}
                  />
                </Grid>
                {/* ChapterName::End */}

                {/* Chapter_description::Start */}
                <Grid size={{ xs: 12 }}>
                  <Textarea
                    icon={<BsTextParagraph />}
                    label='Chapter description'
                    placeholder="Chapter description"
                    rows={5}
                    value={chapterDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setChapterDescription(e.target.value)}
                  />
                </Grid>
                {/* Chapter_description::End */}

              </Grid>
            </CreateCardBody>
            <CreateCardFooter>
              <div className='footer_buttons'>
                <Button
                  textOnly={true}
                  label={'Cancel'}
                  color='primary'
                />
                <Button
                  textOnly={true}
                  label={'Save'}
                  color='secondary'
                />
              </div>
            </CreateCardFooter>
          </CreateMainCard>
        </form>
      </CreateFormWrapper>

      <ModalPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          // Handle update logic here
          setIsModalOpen(false);
          navigate('/content/chapters');
        }}
        title="Update Chapter"
        message="Are you sure you want to update this chapter?"
      />
    </>
  );
};

export default EditChapterForm; 

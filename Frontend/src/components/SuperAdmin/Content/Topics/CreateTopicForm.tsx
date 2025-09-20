import { useState } from 'react';
import { useTheme } from 'styled-components';
import { Grid} from '@mui/material';
import { MdOndemandVideo } from "react-icons/md";
import { RiBook2Line } from "react-icons/ri";
import { FiBookOpen } from "react-icons/fi";
import { PiNotebookBold } from "react-icons/pi";
import { BsQuestionCircle, BsTextParagraph } from "react-icons/bs";
import { GiToolbox } from "react-icons/gi";
import AddIcon from '@mui/icons-material/Add';
import { LiaHandPointRight } from "react-icons/lia";
import { IoTrashOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Star from '../../../../assets/images/star.svg';
import AddTopic from '../../../../assets/images/addTopic.svg';
import ModalPopup from '../../../common/Elements/Modal/Modal';
import { Button, Input, Select, Textarea } from '../../../common/Elements';

import {
  AddTopicEmpty,
  ChapterGridView,
  CreateCardBody,
  CreateCardFooter,
  CreateCardHeader,
  CreateFormWrapper,
  CreateMainCard,
  DashedAddButton,
  FormUploadButtons,
  IconTitle,
  SubTopicCount,
  TextButton,
  TextButtonWrapper,
  TitleButtonContent,
  TopicCard
} from '../../CreateFormstyles';
import { Paragraph } from '../../../common/Elements';

interface Topic {
  name: string;
  description: string;
  topicType: string;
}

interface ChapterOption {
  value: string;
  label: string;
}

interface TopicTypeOption {
  value: string;
  label: string;
}

export default function CreateTopicForm() {
  const theme = useTheme();
  const navigate = useNavigate();

  // Chapter dropdown options
  const ChapterOptions: ChapterOption[] = [
    { value: 'Chapter-1', label: 'What is Mathematics?' },
    { value: 'Chapter-2', label: 'Patterns in Numbers' },
    { value: 'Chapter-3', label: 'Algebra Basics' },
    { value: 'Chapter-4', label: 'Geometry Fundamentals' },
  ];

  // Topic Type dropdown options
  const TopicType: TopicTypeOption[] = [
    { value: 'intro', label: 'Intro' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  // States
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedTopicType, setSelectedTopicType] = useState<string>('');

  const [topicName, setTopicName] = useState<string>('');
  const [topicDescription, setTopicDescription] = useState<string>('');
  const [chapterSaved, setChapterSaved] = useState<boolean>(false);

  const [topics, setTopics] = useState<Topic[]>([
    { name: '', description: '', topicType: '' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Handle chapter select
  const handleChangeChapter = (e: React.ChangeEvent<{ value: unknown }>) => setSelectedChapter(e.target.value as string);

  // Handle main topic type select (if needed)
  const handleChangeTopicType = (e: React.ChangeEvent<{ value: unknown }>) => setSelectedTopicType(e.target.value as string);

  // Handle topic field change (name, description, topicType)
  const handleTopicChange = (index: number, field: keyof Topic, value: string) => {
    const updatedTopics = [...topics];
    updatedTopics[index][field] = value;
    setTopics(updatedTopics);
  };

  // Add new empty topic
  const handleAddTopic = () => {
    setTopics([...topics, { name: '', description: '', topicType: '' }]);
  };

  // Remove topic
  const handleRemoveTopic = (indexToRemove: number) => {
    const updatedTopics = topics.filter((_, index) => index !== indexToRemove);
    setTopics(updatedTopics);
  };

  // Save chapter before adding topics
  const handleSaveChapter = () => {
    if (topicName.trim() && topicDescription.trim()) {
      setChapterSaved(true);
    } else {
      alert("Please fill both Topic Name and Description before adding topics.");
    }
  };

  // Open save modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <CreateFormWrapper>
        <form className='create_topic_form'>
          <ChapterGridView>
            <Grid container spacing={2} className='chapter_main_grid_container'>

              {/* LEFT SIDE - Chapter Details */}
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }} className="chapter_card_grid chapter_card">
                <CreateMainCard className="create_topic_card">
                  <CreateCardHeader>
                    <IconTitle>
                      <Paragraph>
                        <img src={Star} alt="Star" /> Create your topics
                      </Paragraph>
                    </IconTitle>
                  </CreateCardHeader>

                  <CreateCardBody>
                    <Grid container spacing={3}>

                      {/* Select Chapter */}
                      <Grid size={{ xs: 12, md: 12, sm: 12, lg: 12 }}>
                        <Select
                          icon={<RiBook2Line />}
                          label='Select Chapter'
                          placeholder="Select Chapter"
                          value={selectedChapter}
                          onChange={handleChangeChapter}
                          options={ChapterOptions}
                        />
                      </Grid>

                      {/* Topic Type selector (main) */}
                      <Grid size={{ xs: 12, md: 12, sm: 12, lg: 12 }}>
                        <Select
                          icon={<FiBookOpen />}
                          label='Topic Type'
                          placeholder="Select Topic Type"
                          value={selectedTopicType}
                          onChange={handleChangeTopicType}
                          options={TopicType}
                        />
                      </Grid>

                      {/* Topic Name */}
                      <Grid size={{ xs: 12, md: 12, sm: 12, lg: 12 }}>
                        <Input
                          name="Topic name"
                          placeholder="Topic name"
                          label="Topic name"
                          type="text"
                          icon={<FiBookOpen />}
                          value={topicName}
                          onChange={(e) => setTopicName(e.target.value)}
                        />
                      </Grid>

                      {/* Topic Description */}
                      <Grid size={{ xs: 12, md: 12, sm: 12, lg: 12 }}>
                        <Textarea
                          icon={<BsTextParagraph />}
                          label='Topic description'
                          placeholder="Topic description"
                          rows={5}
                          value={topicDescription}
                          onChange={(e) => setTopicDescription(e.target.value)}
                        />
                      </Grid>

                      <Grid size={{ sm: 12, lg: 12 }}>
                        <FormUploadButtons>
                          <label>
                            <input
                              type="file"
                              accept="video/*"
                              style={{ display: "none" }}
                              onChange={(e) => console.log("Selected video:", e.target.files?.[0])}
                            />
                            <DashedAddButton as="span">
                              <MdOndemandVideo /> Video
                            </DashedAddButton>
                          </label>

                          {/* Exercise Upload */}
                          <label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              style={{ display: "none" }}
                              onChange={(e) => console.log("Selected exercise:", e.target.files?.[0])}
                            />
                            <DashedAddButton as="span">
                              <PiNotebookBold /> Exercise
                            </DashedAddButton>
                          </label>

                          {/* Quiz Upload */}
                          <label>
                            <input
                              type="file"
                              accept=".json,.csv"
                              style={{ display: "none" }}
                              onChange={(e) => console.log("Selected quiz:", e.target.files?.[0])}
                            />
                            <DashedAddButton as="span">
                              <BsQuestionCircle /> Quiz
                            </DashedAddButton>
                          </label>

                          {/* Tool Upload */}
                          <label>
                            <input
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => console.log("Selected tool:", e.target.files?.[0])}
                            />
                            <DashedAddButton as="span">
                              <GiToolbox /> Tool
                            </DashedAddButton>
                          </label>
                        </FormUploadButtons>
                      </Grid>
                    </Grid>
                  </CreateCardBody>

                  <CreateCardFooter>
                    <Button
                      type="button"
                      color="secondary"
                      label={'Add sub topics'}
                      rightIcon={<AddIcon />}
                      onClick={handleSaveChapter}
                    />
                  </CreateCardFooter>
                </CreateMainCard>
              </Grid>

              {/* RIGHT SIDE - Topics */}
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8 }} className="chapter_card_grid">
                <CreateMainCard className="create_topic_card">
                  <CreateCardHeader>
                    <TitleButtonContent>
                      <Grid container spacing={2} style={{ width: "100%" }}>
                        <Grid size={{ sm: 12, lg: 12 }} className="left_content">
                          <IconTitle>
                            <Paragraph>
                              <img src={Star} alt="Star" /> Add sub topics
                            </Paragraph>
                          </IconTitle>
                        </Grid>
                      </Grid>
                    </TitleButtonContent>
                  </CreateCardHeader>

                  <CreateCardBody className="add_topics_card_body">
                    {/* If no chapter saved */}
                    {!chapterSaved ? (
                      <AddTopicEmpty>
                        <img className="empty_topic_img" src={AddTopic} alt="Add topic" />
                        <Paragraph variant="p">Add a topic to unlock sub topics</Paragraph>
                      </AddTopicEmpty>
                    ) : topics.length === 0 ? (
                      <AddTopicEmpty>
                        <DashedAddButton className="add_topic_btn" type="button" onClick={handleAddTopic}>
                          <AddIcon /> Add Topic
                        </DashedAddButton>
                        <Paragraph variant="p" className="empty_topics_name">
                          No topics added yet.
                        </Paragraph>
                      </AddTopicEmpty>
                    ) : (
                      <>
                        {topics.map((topic, index) => (
                          <div key={index}>
                            <TopicCard>
                              <Grid container spacing={2} className="topic_number_header">
                                <Grid size={{ sm: 6, lg: 6, md: 6, xs: 6 }}>
                                  {/* Dynamic Subtopic Number */}
                                  <SubTopicCount>
                                    {index + 1}
                                  </SubTopicCount>
                                </Grid>
                                <Grid size={{ sm: 6, lg: 6, md: 6, xs: 6 }} className="remove_text_btn_grid">
                                  <TextButtonWrapper>
                                    <TextButton type="button" color="danger" onClick={() => handleRemoveTopic(index)}>
                                      <IoTrashOutline /> Remove
                                    </TextButton>
                                  </TextButtonWrapper>
                                </Grid>
                              </Grid>

                              <Grid container spacing={2}>

                                {/* Topic Name */}
                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                  <Input
                                    type="text"
                                    name="Sub topic name"
                                    label="Sub topic name"
                                    placeholder="Sub topic name"
                                    icon={<LiaHandPointRight />}
                                    value={topic.name}
                                    onChange={(e) => handleTopicChange(index, "name", e.target.value)}
                                  />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }}>
                                  <Select
                                    icon={<RiBook2Line />}
                                    label='sub topic Type'
                                    placeholder="sub topic Type"
                                    value={selectedTopicType}
                                    onChange={handleChangeTopicType}
                                    options={TopicType}
                                  />

                                </Grid>

                                {/* Topic Description */}
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                  <Textarea
                                    icon={<BsTextParagraph />}
                                    label='Sub topic description'
                                    placeholder="Sub topic description"
                                    rows={1}
                                    value={topicDescription}
                                    onChange={(e) => setTopicDescription(e.target.value)}
                                  />
                                </Grid>

                                {/* Upload buttons */}
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }} className="form_upload_wrapper">
                                  <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                      <FormUploadButtons>
                                        <DashedAddButton><MdOndemandVideo /> Video</DashedAddButton>
                                        <DashedAddButton><PiNotebookBold /> Exercise</DashedAddButton>
                                        <DashedAddButton><BsQuestionCircle /> Quiz</DashedAddButton>
                                        <DashedAddButton><GiToolbox /> Tool</DashedAddButton>
                                      </FormUploadButtons>
                                    </Grid>
                                  </Grid>
                                </Grid>

                              </Grid>
                            </TopicCard>

                            {/* Add More Button */}
                            <TextButtonWrapper>
                              <TextButton
                                className="add_more_button"
                                type="button"
                                color="primary"
                                rightIcon={<AddIcon />}
                                onClick={handleAddTopic}
                              >
                                + Add more
                              </TextButton>
                            </TextButtonWrapper>
                          </div>
                        ))}
                      </>
                    )}
                  </CreateCardBody>

                  {/* Footer Save/Cancel */}
                  {chapterSaved && topics.length > 0 && (
                    <CreateCardFooter>
                      <div className="footer_buttons">
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
                  )}
                </CreateMainCard>
              </Grid>
            </Grid>
          </ChapterGridView>
        </form>
      </CreateFormWrapper>

      {/* Save Modal */}
      <ModalPopup
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={() => {
          setIsModalOpen(false);
          navigate('/content/chapters/view-chapter');
        }}
        type="save"
        title="chapter"
      />
    </>
  );
}

// CustomTableStyles.ts
import styled from 'styled-components';
import { Box, TextField, TableCell, Menu, Table, Grid, Card, CardHeader, Select, CardContent } from '@mui/material';

// Search bar
export const CreateMainCard = styled(Card)<{ $active?: boolean }>`
  background-color: ${({ $active, theme }: { $active?: boolean; theme: any }) => ($active ? theme.colors.light : theme.colors.background)} !important;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor} !important;
  border-radius: 20px !important;
  box-shadow: none !important;
  height: 100%;
  
  &.view_card_wrapper {
    height: calc(100vh - 165px);
  }

  .add_topics_card_body {
    overflow-y: auto;
  }

  &.full_create_form {
    height: calc(100vh - 165px);
    display: flex;
    justify-content: space-between;
    width: 100%;
    flex-direction: column;
  }

  @media (max-width: 1024px) {
    &.full_create_form {
      height: 100%;
    }
    &.view_card_wrapper {
      height: 100%;
    }
  }
`;

export const CreateFormWrapper = styled.div`
  height: calc(100vh - 165px);

  .create_chaper_card {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 300px);
    width: 100%;
    max-width: 100%;
  }
  
  .create_topic_card {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 165px);
  }
  
  .create_topic_form {
    height: 100%;
  }
  
  @media (max-width: 1024px) {
    height: 100%;

    .create_chaper_card,
    .create_topic_card {
      height: 100%;
    }
  }
`;

export const CreateCardBody = styled(CardContent)`
  padding: 15px 15px 20px 15px !important;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y:auto;

  .form_label {
    padding-bottom: 10px;
    display: block;
    color: ${({ theme }: { theme: any }) => theme.colors.primary};
  }
  
  .create_form_title {
    padding-bottom: 10px;
    display: block;
  }
  
  .create_form_title p {
    display: flex;
  }
  
  .create_form_title img {
    margin-right: 5px;
  }
`;

export const CustomSelectWrapper = styled.div`
  position: relative;
  width: 100%;
  
  svg {
    color: ${({ theme }: { theme: any }) => theme.colors.primary};
  }
  
  .MuiOutlinedInput-root {
    width: 100%;
  }
  
  .MuiFormControl-root {
    width: 100%;
    border: 0px;
    font-family: ${({ theme }: { theme: any }) => theme.fonts.primary};
    appearance: none;
    height: 50px;
    display: inline-flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
  }
  
  .MuiSelect-select {
    background-color: ${({ theme }: { theme: any }) => theme.colors.lightbg};
    border-radius: 10px !important;
    width: 100%;
    box-shadow: ${({ theme }: { theme: any }) => theme.shadow.shadowInput};
    border: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor};
    color: ${({ theme }: { theme: any }) => theme.colors.text};
    font-family: ${({ theme }: { theme: any }) => theme.fonts.primary};
    padding: 12px 12px 12px 65px;
  }
  
  .MuiOutlinedInput-notchedOutline {
    border: 0px;
    border-radius: 10px !important;
    width: 100%;
  }
  
  .MuiSelect-iconOutlined {
    margin-right: 5px;
  }
`;

export const IconBoxSelect = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  color: #666;
  z-index: 2;
  color: ${({ theme }: { theme: any }) => theme.colors.text};
  margin-right: 10px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  border-right: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor};
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconBoxArrow = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  color: #666;
  z-index: 2;
  margin-right: 10px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #F9F7FD;
  border-radius: 10px;
  padding: 0px 5px;
  box-shadow: ${({ theme }: { theme: any }) => theme.shadow.shadowInput};
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor};
  width: 100%;

  &.textarea_input {
    align-items: flex-start;
  }

  .iconBox_textArea {
    margin-top: 10px;
  }
`;

export const IconBox = styled.div`
  color: ${({ theme }: { theme: any }) => theme.colors.primary};
  margin-right: 10px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  border-right: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor};
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledInput = styled(TextField)`
  width: 100%;
  background: ${({ theme }: { theme: any }) => theme.colors.transperent};
  color: ${({ theme }: { theme: any }) => theme.colors.text};

  input {
    font-family: ${({ theme }: { theme: any }) => theme.fonts.primary};
    font-weight: ${({ theme }: { theme: any }) => theme.fontWeights.regular};
    font-size: ${({ theme }: { theme: any }) => theme.fontSizes.base};
    color: ${({ theme }: { theme: any }) => theme.colors.text};
    padding: 13px 5px;

    &::placeholder {
      opacity: 1;
      color: ${({ theme }: { theme: any }) => theme.colors.placeholder};
    }

    &:-webkit-autofill {
      box-shadow: 0 0 0px 1000px #faf7ff inset !important;
      -webkit-text-fill-color: #000 !important;
      transition: background-color 9999s ease-in-out 0s;
    }
  }

  fieldset {
    border: 0px !important;
  }
`;

export const CreateCardFooter = styled.div`
  display: flex;
  justify-content: end;
  padding: 8px 15px;
   border-top:1px solid #e0e0e0;

  .footer_buttons {
    // margin: 15px 0px;
    display: flex;
    gap: 10px;
   
  }
`;

export const ChapterGridView = styled.div`
  display: flex;
  height: 100%;

  .chapter_content_body {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &.create_chapter_grid_main {
    margin-top: 15px;
    width: 100%;
  }

  .topics_card_wrapper {
    margin-bottom: 10px;
  }

  .chapter_main_grid_container {
    width: 100%;
  }
`;

export const ResourceButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const DashedAddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }: { theme: any }) => theme.colors.lightbg};
  border: 1px dashed ${({ theme }: { theme: any }) => theme.colors.primary};
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }: { theme: any }) => theme.colors.primary || '#333'};
  font-family: ${({ theme }: { theme: any }) => theme.fonts.primary || 'Inter, sans-serif'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  svg {
    font-size: 18px;
  }

  &:hover {
    background-color: ${({ theme }: { theme: any }) => theme.colors.lightHover || '#f1edfb'};
    border-color: ${({ theme }: { theme: any }) => theme.colors.hoverBorder || '#bcb4d4'};
  }
`;

export const TextButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  
  .add_more_button {
    margin: 10px 0px;
  }
`;

export const TextButton = styled.button<{ color?: string }>`
  background-color: ${({ theme }: { theme: any }) => theme.colors.transperent};
  color: ${({ color, theme }: { color?: string; theme: any }) => theme.colors[color || 'text'] || theme.colors.text};
  font-weight: ${({ theme }: { theme: any }) => theme.fontWeights.medium};
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;

  svg {
    margin-right: 6px;
    width: 18px;
    height: 18px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const CreateCardHeader = styled.div`
  padding:8px 15px;
  border-bottom:1px solid #e0e0e0;
`;

export const IconTitle = styled.div`
  p {
    display: flex;
  }
  
  img {
    margin-right: 5px;
  }
`;

export const TopicCard = styled.div`
  background: ${({ theme }: { theme: any }) => theme.colors.background};
  padding: 10px 15px 15px 15px;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor};
  border-radius: 12px;
  position: relative;

  .topic_number_header {
    padding-bottom: 10px;
  }

  .remove_text_btn_grid {
    display: inline-flex;
    align-items: center;
    justify-content: end;
  }

  .form_upload_wrapper {
    margin-top: 10px;
  }
`;

export const AddTopicEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  .empty_topic_img {
    width: 250px;
    margin-bottom: 20px;
  }

  .empty_topics_name {
    margin-top: 10px;
  }
  
  .add_topic_btn {
    padding: 10px 15px;
  }
`;

export const FormUploadButtons = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  
  @media (max-width: 1024px) {
    flex-wrap: wrap;
  }
`;

export const TitleButtonContent = styled.div`
  .right_content {
    display: flex;
    justify-content: end;
  }
`;

export const LightButton = styled.button`
  background-color: #F6F6F6;
  border-radius: 50px;
  color: #343A40;
  padding: 8px 20px;
  cursor: pointer;
`;

export const DarkButton = styled.button`
  background-color: ${({ theme }: { theme: any }) => theme.colors.secondary};
  border-radius: 50px;
  color: white;
  padding: 8px 20px;
  cursor: pointer;
`;

export const SubTopicCount = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.secondary};
  border-radius: 10px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const CustomLabel = styled.label`
  color: ${({ theme }: { theme: any }) => theme.colors.primary};
  margin-bottom: 5px;
  font-size: 14px;
  display: block;
`;

export const FormInputMain = styled.div``;

export const SearchGrid = styled(Grid)`
  width: 100%;
`;

export const FullGrid = styled(Grid)`
  width: 100%;
`; 

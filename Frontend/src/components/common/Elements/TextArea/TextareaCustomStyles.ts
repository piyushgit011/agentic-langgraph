import { TextFields } from '@mui/icons-material';
import styled from 'styled-components';

export const StyledTextField = styled(TextFields)`
  width: 100%;

  & .MuiInputBase-root {
    background: ${({ theme }) => theme.colors.lightbg};
    border-radius: 10px;
    padding-left: 2.5rem;
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  background-color:${({ theme }) => theme.colors.lightbg};
  border-radius: 10px;
  padding: 10px 0px 10px 5px;;
  // box-shadow: ${({ theme }) => theme.shadow.shadowInput};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  margin-bottom:5px;

  &.no-margin {
    margin-bottom:0px; 
  }

  &.border_text_area
{
    border:2px dotted  ${({ theme }) => theme.colors.borderColor};
    padding:10px 15px;
}
      &.border_text_area .icon_box_textArea
      {
      display:none;
      }
`;

export const IconBox = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 10px;
  display: flex;
  align-items: center;
  border-right: 1px solid ${({ theme }) => theme.colors.borderColor};
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center; 

  svg 
  { 
  width:22px;
  height:22px;
  }
  
`;

export const StyledInput = styled.input`
  border: none;
  outline: none;
  background: ${({ theme }) => theme.colors.transperent};
  font-size: ${({ theme }) => theme.fontSizes.base};
  width: 100%;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color:${({ theme }) => theme.colors.placeholder};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
  }


`;
export const ToggleIconBox = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-left: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-left: 1px solid ${({ theme }) => theme.colors.borderColor};
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg 
  {
  width:22px;
  height:22px;
  }
`;

export const ErrorMessage = styled.div`
display:none;

`;
export const InputWithoutMargin = styled.div`
margin-bottom:0px; !important
input
{
margin-bottom:0px; !important
}

`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSizes.base};
  resize: vertical;
  background-color: ${({ theme }) => theme.colors.transperent};
  border: none;
  box-shadow:none;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

   &::placeholder {
    color:${({ theme }) => theme.colors.placeholder};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
  }
`;

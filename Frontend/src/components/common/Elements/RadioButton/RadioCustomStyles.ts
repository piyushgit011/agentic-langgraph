import styled from 'styled-components';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export const RadioGroupWrapperStyled = styled(RadioGroup)`
  display: flex;
  flex-direction: row;
    span 
  {
    font-family: ${({ theme }) => theme.fonts.primary} !important; 
      font-weight: ${({ theme }) => theme.fontWeights.regular} !important; 
  }
`;

export const RadioButtonStyled = styled(FormControlLabel)<{ checked: boolean }>`
  color: ${({ checked }) => (checked ? '#117a7a' : '#5f6388')};
  margin-right: 20px;

  .MuiFormControlLabel-label {
    font-weight: 500;
  }
      span 
  {
    font-family: ${({ theme }) => theme.fonts.primary} !important; 
      font-weight: ${({ theme }) => theme.fontWeights.regular} !important; 
  }
`;
export const FlexRadio = styled.div`
display:flex;
align-items:center;
`;

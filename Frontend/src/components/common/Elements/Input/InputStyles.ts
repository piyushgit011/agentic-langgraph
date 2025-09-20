import { TextFields } from '@mui/icons-material';
import styled from 'styled-components';
import { Theme } from '../../../../assets/styles/theme';

export const StyledTextField = styled(TextFields)`
    width: 100%;

    & .MuiInputBase-root {
        background: #f9f6ff;
        border-radius: 10px;
        padding-left: 2.5rem; /* space for the icon */
    }
`;

interface InputWrapperProps {
    theme: Theme;
}
export const InputMainWrapper = styled.div<InputWrapperProps>`

`;
export const InputWrapper = styled.div<InputWrapperProps>`
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.lightbg};
    border-radius: 10px;
    padding: 10px 0px 10px 5px;
    // box-shadow: ${({ theme }) => theme.shadow.shadowInput};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    margin-bottom:3px;
`;

interface IconBoxProps {
    theme: Theme;
}

export const IconBox = styled.div<IconBoxProps>`
    color: ${({ theme }) => theme.colors.primary};
    margin-right: 10px;
    font-size: 1.2rem;
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
    color:${({ theme }) => theme.colors.primary};
    width:22px;
    height:22px;
  }
`;

interface StyledInputProps {
    theme: Theme;
}

export const StyledInput = styled.input<StyledInputProps>`
    border: none;
    outline: none;
    background: transparent;
    font-size: ${({ theme }) => theme.fontSizes.base};
    width: 100%;
    color: ${({ theme }) => theme.colors.dark};
    font-family: ${({ theme }) => theme.fonts.primary};

    &::placeholder {
        color: ${({ theme }) => theme.colors.placeholder};
        font-weight: ${({ theme }) => theme.fontWeights.regular};
    }

      &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    transition: background-color 9999s ease-in-out 0s;
    -webkit-text-fill-color: #000; /* set your text color */
    caret-color: #000;
    box-shadow: none;
  }
    
`;

interface ToggleIconBoxProps {
    theme: Theme;
}

export const ToggleIconBox = styled.div<ToggleIconBoxProps>`
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
`;

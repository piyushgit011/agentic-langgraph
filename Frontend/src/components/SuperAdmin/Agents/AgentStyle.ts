import styled from 'styled-components';

export const AgentTextArea = styled.div`
 
.MuiFormControl-root
{
width:100%;

}
.MuiOutlinedInput-notchedOutline 
{
    border:2px dotted  ${({ theme }) => theme.colors.borderColor} !important;
    border-radius:12px;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-Weight: ${({ theme }) => theme.fontWeights.regular};
}
.MuiInputBase-input
{
font-family: ${({ theme }) => theme.fonts.primary};
font-Weight: ${({ theme }) => theme.fontWeights.regular};
color:${({ theme }) => theme.colors.text};
 font-size: ${({ theme }) => theme.fontSizes.base};
}



`; 

import styled from 'styled-components';

export const FieldGroup = styled.div`
  position: relative;
`;

export const CustomSelect = styled.div`
display: flex;
align-items: center;
width:100%;
font-family: ${({ theme }) => theme.fonts.primary};

.custom_select
{
  display:block;
  background-color:${({ theme }) => theme.colors.lightbg};
  border-radius: 10px;
  // box-shadow: ${({ theme }) => theme.shadow.shadowInput};
  border: 1px solid  ${({ theme }) => theme.colors.borderColor};
  width:100%;
  }
  .MuiPickersOutlinedInput-notchedOutline
  {
   border:0px;
  }
   .Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline
   {
    border:0px;
   }
  .MuiPickersInputBase-root,
  .MuiFormControl-root
  {
    width:100%;
    border:0px;
      border-radius: 10px;
  }
  .MuiFormControl-root
  {
  border:0px;
  
  }
.MuiStack-root
{
  width:100%;
  background-color:${({ theme }) => theme.colors.lightbg};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow.shadowInput};
  border: 1px solid  ${({ theme }) => theme.colors.borderColor};
  min-width:100%;
  padding-top:0px;
  height:50px;
}
   .MuiPickersSectionList-section 
   {
    font-family: ${({ theme }) => theme.fonts.primary};
   }
  .MuiPickersInputBase-sectionsContainer
  {
    padding: 12px 12px 12px 0px;
  }
.MuiIconButton-edgeStart
{
    border-right: 1px solid ${({ theme }) => theme.colors.borderColor};
    border-radius:0px;
    width:50px;
    height:30px;
}
  .MuiPickersTextField-root
  {
    min-width:100%;
    font-family: ${({ theme }) => theme.fonts.primary};
  }
    &:focus
    {
        border-color:none;
    }

    .MuiPickersInputBase-sectionContent
    {
    font-family: ${({ theme }) => theme.fonts.primary};
    }
  svg 
  {
    color:${({ theme }) => theme.colors.primary};
    width:22px;
    height:22px;
  }
`;


export const IconBoxSelect = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    z-index: 2;
    color:${({ theme }) => theme.colors.text};
    margin-right: 10px;
    display: flex;
    align-items: center;
    border-right: 1px solid ${({ theme }) => theme.colors.borderColor};
    width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    left:0;
`;
export const IconBoxArrow = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    z-index: 2;
    margin-right: 10px;
    display: flex;
    align-items: center;
    width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    right:0;
`;
export const Select = styled.select`
  width: 100%;
  padding: 0px 16px 0px 60px;
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 5px;
  font-size: ${({ theme }) => theme.fontSizes.base};
  background-color:${({ theme }) => theme.colors.lightbg};
  color:${({ theme }) => theme.colors.dark};
  outline: none;
  appearance: none;
  height:50px;
  line-height:50px;
    display:block;

  &:focus .icon-arrow{
    border-color:none;
    
  }

  &:disabled {
    background-color:${({ theme }) => theme.colors.diabled};
    cursor: not-allowed;
  }
    
`;

import styled from 'styled-components';

export const PhoneInputWrapper = styled.div`

  &.no-margin  .form-control {
      margin-bottom: 0px;
    }
      
  .form-control 
  {
    display: flex;
    align-items: center;
    background-color:${({ theme }) => theme.colors.lightbg};
    border-radius: 10px;
    padding: 12px 0px 12px 65px;;
    // box-shadow: ${({ theme }) => theme.shadow.shadowInput};
    border: 1px solid ${({ theme }) => theme.colors.borderColor} !important;
    width:100%;
    margin-bottom:3px;
    color:${({ theme }) => theme.colors.text};

  }
  
  .form-control:focus 
  {
  border:0px;
  outline:0px;
      box-shadow: ${({ theme }) => theme.shadow.shadowInput};
  }
  .flag-dropdown {
    background-color: transparent !important;
    border: none !important;
    padding-right: 8px;
  }

  .selected-flag {
    padding-left: 0px;
  }

  .country-list {
    border-radius: 10px;
    z-index: 9999;
  }
  .special-label
  {
  display:none
  }
  .react-tel-input .selected-flag 
  {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid ${({ theme }) => theme.colors.borderColor};
    height:30px;
   }
    .flag-dropdown 
    {
        display: flex;
    align-items: center;
    }
    .flag .arrow
    {
      display:none
    }
`;

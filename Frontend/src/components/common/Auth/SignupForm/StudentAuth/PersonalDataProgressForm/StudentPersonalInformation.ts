import { FormControlLabel, RadioGroup } from '@mui/material';
import styled from 'styled-components';
import { Theme } from '../../../../../../assets/styles/theme';

interface StyledProps {
    theme: Theme;
    $active?: boolean;
}

export const FieldGroup = styled.div`
    position: relative;
`;

export const PerosonalInfoWrapper = styled.div`
    height: 55vh;
    overflow: auto;
    @media (max-width: 1024px) {
        height: 100%;
    }
`;

// Birth_date_input_Style::Start
export const CustomSelect = styled.div<StyledProps>`
    display: flex;
    align-items: center;
    width: 100%;
    font-family: ${({ theme }) => theme.fonts.primary};

    .custom_select {
        display: flex;
        align-items: center;
        background-color: ${({ theme }) => theme.colors.lightbg};
        border-radius: 10px;
        box-shadow: ${({ theme }) => theme.shadow.shadowInput};
        border: 1px solid ${({ theme }) => theme.colors.borderColor};
        width: 100%;
    }

    .MuiPickersOutlinedInput-notchedOutline {
        border: 0px;
    }

    .Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline {
        border: 0px;
    }

    .MuiPickersInputBase-root,
    .MuiFormControl-root {
        width: 100%;
        border: 0px;
        border-radius: 10px;
    }

    .MuiFormControl-root {
        border: 0px;
    }

    .MuiStack-root {
        width: 100%;
        background-color: ${({ theme }) => theme.colors.lightbg};
        border-radius: 10px;
        box-shadow: ${({ theme }) => theme.shadow.shadowInput};
        border: 1px solid ${({ theme }) => theme.colors.borderColor};
        min-width: 100%;
        padding-top: 0px;
        height: 50px;
    }

    .MuiPickersSectionList-section {
        font-family: ${({ theme }) => theme.fonts.primary};
    }

    .MuiPickersInputBase-sectionsContainer {
        padding: 12px 12px 12px 0px;
    }

    .MuiIconButton-edgeStart {
        border-right: 1px solid ${({ theme }) => theme.colors.borderColor};
        border-radius: 0px;
        width: 50px;
        height: 30px;
    }

    .MuiPickersTextField-root {
        min-width: 100%;
        font-family: ${({ theme }) => theme.fonts.primary};
    }

    &:focus {
        border-color: none;
    }

    .MuiPickersInputBase-sectionContent {
        font-family: ${({ theme }) => theme.fonts.primary};
    }

    svg {
        color: ${({ theme }) => theme.colors.primary};
    }
`;
// Birth_date_input_Style::End

// Custom_select_Style::Start
export const IconBoxSelect = styled.div<StyledProps>`
    position: absolute;
    display: flex;
    align-items: center;
    z-index: 2;
    color: ${({ theme }) => theme.colors.text};
    margin-right: 10px;
    font-size: 1.2rem;
    border-right: 1px solid ${({ theme }) => theme.colors.borderColor};
    width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
`;

export const IconBoxArrow = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    color: #666;
    z-index: 2;
    margin-right: 10px;
    font-size: 1.2rem;
    width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
`;

export const Select = styled.select<StyledProps>`
    width: 100%;
    padding: 10px 16px 10px 60px;
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: 5px;
    font-size: 1rem;
    background-color: ${({ theme }) => theme.colors.lightbg};
    color: ${({ theme }) => theme.colors.dark};
    outline: none;
    appearance: none;
    height: 50px;

    &:focus .icon-arrow {
        border-color: none;
    }

    &:disabled {
        background-color: ${({ theme }) => theme.colors.lightbg};
        cursor: not-allowed;
    }
`;
// Custom_select_Style::End

// Custom_radio_button_Style::Start
export const RadioGroupWrapper = styled(RadioGroup)({
    flexDirection: 'row',
});

export const RadioButton = styled(FormControlLabel)({
    marginRight: '16px',
});
// Custom_radio_button_Style::End

// Gray_card_style::Start
export const GrayCard = styled.div<StyledProps>`
    background-color: ${({ $active, theme }) => ($active ? theme.colors.light : theme.colors.lightbg)};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: 12px;
    text-align: center;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
`;
// Gray_card_style::End

// Custom_search_Style::Start
export const SearchWrapper = styled.div`
    position: relative;
    width: 100%;
`;

export const SearchBox = styled.div<StyledProps>`
    display: flex;
    align-items: center;
    background: ${({ theme }) => theme.colors.lightbg};
    border: 1px solid ${({ theme }) => theme.colors.borderColor} !important;
    border-radius: 12px;
    box-shadow: ${({ theme }) => theme.shadow.shadowInput};
    height: 45px;

    ::placeholder {
        color: ${({ theme }) => theme.colors.placeholder};
    }
`;

export const SearchIconStyled = styled.div<StyledProps>`
    color: ${({ theme }) => theme.colors.primary};
    margin-right: 12px;
`;

export const SearchInput = styled.input<StyledProps>`
    border: none;
    outline: none;
    background: ${({ theme }) => theme.colors.light};
    border-radius: 12px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.text};
    width: 100%;
    font-family: ${({ theme }) => theme.fonts.primary};
    padding: 12px 12px 12px 65px;
    height: 45px;
`;

export const SuggestionList = styled.ul<StyledProps>`
    position: absolute;
    top: 105%;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.light};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: 8px;
    margin-top: 6px;
    padding: 8px 0;
    list-style: none;
    z-index: 99;
    box-shadow: ${({ theme }) => theme.shadow.shadowInput};

    li {
        padding: 10px 16px;
        cursor: pointer;
        font-family: ${({ theme }) => theme.fonts.primary};
        &:hover {
            background-color: ${({ theme }) => theme.colors.lightbg};
        }
    }
`;

export const SearchSelectWrappper = styled.div`
    margin-top: 30px;
`;
// Custom_search_Style::End

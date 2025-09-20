import { Button, OutlinedInput } from "@mui/material";
import styled from "styled-components";
import { Theme } from "../../../../assets/styles/theme";

interface StyledProps {
    theme: Theme;
    $active?: boolean;
    $font?: string;
    $fontSize?: string;
}


// Roles_cards_style::Start
export const RoleCardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

export const RoleLabel = styled.div<StyledProps>`
    color: ${({ theme }) => theme.colors.light};
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 30px;
    display: inline-block;
    padding: 5px 15px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 15px);
`;
// Roles_cards_style::End

// Role_section_Styled_component::Start
export const FormTitleContent = styled.div`
    margin-bottom: 30px;
`;

export const EndButton = styled.div`
    display: flex;
    justify-content: end;
    margin-top: 20px;
`;

export const RoleCard = styled.div<StyledProps>`
    background: ${({ $active, theme }) => ($active ? theme.colors.light : theme.colors.lightbg)};
    border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.borderColor)};
    border-radius: 12px;
    text-align: center;
    padding: 15px 15px 0px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    img {
        width: 100%;
        height: auto;
        object-fit: contain;
    }
`;

export const RoleCardWrapper = styled.div`
    display: grid;
    gap: 2rem;

    /* Mobile: 1 card per row */
    grid-template-columns: 1fr;

    /* Tablet: 2 cards per row */
    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    /* Desktop: 3 cards per row */
    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;
// Role_section_Styled_component::End

export const Wrapper = styled.div`
    padding: 2rem;
    text-align: center;
`;

export const ProgressContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 30px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 99;

    &::after {
        content: "";
        background: #F9F9F9;
        height: 5px;
        width: 100%;
        position: absolute;
        z-index: -2;
    }
`;

interface StepCircleProps {
    active?: boolean;
}

export const StepCircle = styled.div<StepCircleProps>`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: ${({ active }) => (active ? '#5E60CE' : '#ccc')};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
`;

export const StepContent = styled.div`
    min-height: 200px;
    margin-bottom: 2rem;
`;

export const ButtonRow = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
`;

export const ProgressCircle = styled(Button) <StyledProps>`
    font-family: ${({ theme, $font }) => theme.fonts[$font as keyof typeof theme.fonts] || theme.fonts.primary} !important;
    font-size: ${({ theme, $fontSize }) => theme.fontSizes[$fontSize as keyof typeof theme.fontSizes] || '1rem'} !important;
    min-width: 45px !important;
    min-height: 45px !important;
    background-color: ${({ $active }) => ($active ? '#7B19D8' : '#F1F1F1')} !important;
    border: 1px solid ${({ $active }) => ($active ? '#7B19D8' : '#E0E0E0')} !important;
    border-radius: 50px !important;
    color: ${({ $active }) => ($active ? '#ffff' : '#343A40')} !important;
`;

export const FormRow = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
`;

// PhoneNumber_input_Style::Start
export const PhoneInputWrapper = styled.div<StyledProps>`
    .form-control {
        display: flex;
        align-items: center;
        background-color: ${({ theme }) => theme.colors.lightbg};
        border-radius: 10px;
        padding: 12px 0px 12px 65px;
        box-shadow: ${({ theme }) => theme.shadow.shadowInput};
        border: 1px solid ${({ theme }) => theme.colors.borderColor} !important;
        width: 100%;
        color: ${({ theme }) => theme.colors.text};
    }

    .form-control:focus {
        border: 0px;
        outline: 0px;
        // box-shadow: ${({ theme }) => theme.shadow.shadowInput};
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

    .special-label {
        display: none;
    }

    .react-tel-input .selected-flag {
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid ${({ theme }) => theme.colors.borderColor};
        height: 30px;
    }

    .flag-dropdown {
        display: flex;
        align-items: center;
    }

    .flag .arrow {
        display: none;
    }
`;
// PhoneNumber_input_Style::End

// Custom_radio_button_css::Start
export const GenderWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 16px 0;
`;

export const GenderOption = styled.div`
    display: flex;
    align-items: center;
`;

export const HiddenRadio = styled.input`
    display: none;
`;

export const StyledRadio = styled.label<StyledProps>`
    padding: 6px 16px;
    border-radius: 30px;
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    background-color: ${({ theme }) => theme.colors.light};
    cursor: pointer;
    &.checked {
        background-color: ${({ theme }) => theme.colors.secondary};
        color: ${({ theme }) => theme.colors.light};
        border-color: ${({ theme }) => theme.colors.secondary};
    }
`;
// Custom_radio_button_css::End

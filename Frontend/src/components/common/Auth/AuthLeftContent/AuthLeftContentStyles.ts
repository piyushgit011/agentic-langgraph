// src/components/common/HeaderBar.styles.ts
import styled from 'styled-components';
import { Theme } from '../../../../assets/styles/theme';
import { StylesConfig } from 'react-select';

interface StyledProps {
    theme: Theme;
}

interface LanguageOption {
    value: string;
    label: string;
}

// Main_container_Style::Start
export const MainWrapper = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

export const LoginWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

export const AuthFormLayout = styled.div`
    padding: 2rem;
    @media (max-width: 1024px) {
        padding: 0px;
    }
`;
// Main_container_Style::End

// Login_logo_style::Start
export const LogoHeader = styled.div<StyledProps>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem 0rem 2rem;
    background-color: ${({ theme }) => theme.colors.light};
    @media (max-width: 1024px) {
        padding: 0px;
        padding-bottom: 20px;
    }
`;

export const LogoWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;
// Login_logo_style::End

// Language_input_style::Start
export const customStyles: StylesConfig<LanguageOption> = {
    control: (base) => ({
        ...base,
        backgroundColor: 'white',
        borderColor: '#e0e0e0',
        borderWidth: '1px',
        borderRadius: '30px',
        boxShadow: 'none',
        minHeight: 45,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            borderColor: '#e0e0e0',
        },
    }),
    menu: (base) => ({
        ...base,
        borderRadius: '30px',
        zIndex: 100,
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
        color: '#333',
        padding: '10px 15px',
        cursor: 'pointer',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
};

export const LangSelectWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    @media (max-width: 1024px) {
        justify-content: start;
        gap: 5px;
    }
`;
// Language_input_style::End

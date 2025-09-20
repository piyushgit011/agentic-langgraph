import styled from 'styled-components';
import { Theme } from '../../../../assets/styles/theme';

interface StyledProps {
    theme: Theme;
}

// Main_container_style::Start
export const AuthContainer = styled.div<StyledProps>`
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: row;
    background: ${({ theme }) => theme.colors.primary};
    position: relative;
    z-index: 5;

    @media (max-width: 1024px) {
        flex-direction: column;
        height: 100%;
    }
`;

export const LeftContentGrid = styled.div<StyledProps>`
    width: 40%;
    background-color: ${({ theme }) => theme.colors.light};
    padding: 20px;
    border-radius: 0 40px 40px 0;
    position: relative;
    box-shadow: ${({ theme }) => theme.shadow.shadowInput};
    overflow: visible;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        width: 100%;
        height: 95vh;
        background-color: ${({ theme }) => theme.colors.primary};
        z-index: -1;
        border-radius: 0 40px 40px 0;
    }

    @media (max-width: 1024px) {
        padding: 15px;
        width: 100%;
        height: 100%;
        border-radius: 0 0 40px 40px;

        &::before {
            width: 100%;
            height: 100%;
            border-radius: 0 0 40px 40px;
            top: 20px;
            left: 0px;
            transform: none;
        }
    }
`;

export const RightContentGrid = styled.div<StyledProps>`
    width: 60%;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.light};
    position: relative;
    z-index: -2;
    overflow: hidden;

    @media (max-width: 1024px) {
        width: 100%;
    }
`;
// Main_container_style::End

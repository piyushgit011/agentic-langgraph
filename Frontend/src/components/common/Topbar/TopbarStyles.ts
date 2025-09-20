import styled from 'styled-components';
import { Toolbar } from "@mui/material";
import { Theme } from '../../../assets/styles/theme';

interface StyledProps {
    theme: Theme;
    open?: boolean;
    $visible?: boolean;
}

export const CustomToolbar = styled(Toolbar)`
    background: transparent;
    border-bottom: 1px solid #e0e0e0;
`;

export const TopbarContainer = styled.div`
    background-color: transparent;
    border-bottom: 1px solid #e2e2e2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    height: 60px;
`;

export const LeftSection = styled.div<StyledProps>`
    display: flex;
    align-items: center;
    gap: 10px;
    transform: ${({ open }) => (open ? 'translateX(-40px)' : 'none')};

    h3 {
        font-weight: ${({ theme }) => theme.fontWeights.semibold};
        color: ${({ theme }) => theme.colors.text};
    }
`;

export const BackButton = styled.div`
    background-color: ${({ theme }) => theme.colors.secondary};
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;   
    color: ${({ theme }) => theme.colors.light};
    border-radius: 50%;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer !important;
`;

export const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const IconCircle = styled.div<StyledProps>`
    border: 1px solid ${({ theme }) => theme.colors.secondary};
    border-radius: 50%;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;

    svg {
        color: ${({ theme }) => theme.colors.secondary};
    }

    &.notify::after {
        content: "";
        position: absolute;
        top: 5px;
        right: 5px;
        width: 7px;
        height: 7px;
        background-color: ${({ theme }) => theme.colors.primary};
        border-radius: 50%;
    }
`;

export const UserProfile = styled.div<StyledProps>`
    display: flex;
    align-items: center;
    gap: 8px;

    img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid ${({ theme }) => theme.colors.light};
        box-shadow: ${({ theme }) => theme.shadow.shadowInput};
    }

    .info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
    }

    span.name {
        font-weight: ${({ theme }) => theme.fontWeights.semibold};
        color: ${({ theme }) => theme.colors.primary};
    }

    span.role {
        font-size: ${({ theme }) => theme.fontSizes.sm};
        color: ${({ theme }) => theme.colors.text};
    }
`;

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    height: 35px;
`;

export const SearchInput = styled.input<StyledProps>`
    width: ${(props) => (props.$visible ? '200px' : '0')};
    opacity: ${(props) => (props.$visible ? 1 : 0)};
    padding: ${(props) => (props.$visible ? '8px 12px' : '0')};
    border: ${(props) => (props.$visible ? '1px solid #ccc' : 'none')};
    border-radius: 25px;
    margin-right: 10px;
    transition: all 0.3s ease;
    outline: none;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    padding: 15px 20px;
    position: relative;
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    height: 35px;
    min-height: 35px;
    visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
`;

export const SearchButton = styled.button<StyledProps>`
    
    padding: 5px;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0px;

    svg {
        color: ${({ theme }) => theme.colors.secondary};
        font-size: 32px;
    }
`;

export const CircleButton = styled.button<StyledProps>`
    border: 1px solid ${({ theme }) => theme.colors.secondary};
    width: 35px;
    height: 35px;
    background: ${({ theme }) => theme.colors.light};
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        color: ${({ theme }) => theme.colors.secondary};
        font-size: 32px;
    }
`;

export const TopbarSearch = styled.input<StyledProps>`
    outline: none;
    background: ${({ theme }) => theme.colors.light};
    border-radius: 100px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    height: 45px;
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    color: ${({ theme }) => theme.colors.text};
    padding: 10px 15px;
    width: 100%;
    max-width: ${({ $visible }) => ($visible ? '300px' : '0px')};
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    transform: ${({ $visible }) => ($visible ? 'scaleX(1)' : 'scaleX(0.9)')};
    transform-origin: left;
    transition: max-width 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
    font-family: ${({ theme }) => theme.fonts.primary};
    white-space: nowrap;
    overflow: hidden;
    display: ${({ $visible }) => ($visible ? 'block' : 'none')};
`;

export const Notifications = styled.div`
    @media (max-width: 768px) {
        display: none;
    }
`;

export const UserInfo = styled.div`
    @media (max-width: 1024px) {
        display: none;
    }
`;

export const PageNameTopbar = styled.div`
    @media (max-width: 1024px) {
        display: none;
    }
`;

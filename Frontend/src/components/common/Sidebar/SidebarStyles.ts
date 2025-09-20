// components/SidebarStyles.ts

import styled from 'styled-components';
import { Drawer, ListItemIcon } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import { Theme } from '../../../assets/styles/theme';

interface StyledProps {
    theme: Theme;
    open?: boolean;
    $isOpen?: boolean;
}

export const StyledDrawer = styled(Drawer) <StyledProps>`
    & .MuiDrawer-paper {
        width: ${({ open }) => (open ? '250px' : '55px')};
        transition: width 0.3s ease-in-out;
        overflow-x: hidden;
        box-sizing: border-box;
        background-color: ${({ theme }) => theme.colors.background};
        border-right: 0;
        position: absolute;
        display: flex;
        justify-content: space-between;
        z-index: 5;
    }

    @media (max-width: 576px) {
        & .MuiDrawer-paper {
            width: 100%;
            transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
            opacity: ${({ open }) => (open ? '1' : '0')};
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            overflow-x: hidden;
            box-sizing: border-box;
            background-color: ${({ theme }) => theme.colors.background};
            border-right: 0;
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            z-index: 1300;
        }
    }
    @media (min-width: 577px) and (max-width: 1024px) {
        & .MuiDrawer-paper {
            width: 400px;
            transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
            opacity: ${({ open }) => (open ? '1' : '0')};
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            overflow-x: hidden;
            box-sizing: border-box;
            background-color: ${({ theme }) => theme.colors.background};
            border-right: 1px solid ${({ theme }) => theme.colors.borderColor};
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            z-index: 1300;
        }
    }
`;

export const SidebarLogo = styled.div<StyledProps>`
    text-align: center;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${({ open }) => (open ? '0px 20px' : '0px 5px')};

    img {
        width: 100%;
    }

    @media (max-width: 1024px) {
        justify-content: start;

        img {
            width: 250px;
            padding: 20px 15px;
        }
    }
`;

export const SidebarLinks = styled.div`
    display: grid;
    gap: 5px;
`;

export const StyledListItemIcon = styled(ListItemIcon) <StyledProps>`
    min-width: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: ${({ theme }) => theme.fontWeights.regular};

    svg {
        color: ${({ theme }) => theme.colors.text};
        height: 22px;
        width: 22px;
    }
`;

export const LogoutLink = styled.div<StyledProps>`
    border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

export const Row = styled(NavLink) <StyledProps>`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    background: transparent !important;
    padding: 8px 0;
    white-space: nowrap;

    &.active_link::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: ${({ open }) => (open ? '90%' : '100%')};
        height: 100%;
        background-color: ${({ theme }) => theme.colors.primary} !important;
        z-index: -1;
        border-radius: ${({ open }) => (open ? '0px 50px 50px 0px' : '0px')};
        transition: border-radius 0.3s ease;
    }

    &.active_link::before {
        content: '';
        background-image: url('/src/assets/images/activePencil.png');
        position: absolute;
        right: 5px;
        top: 0;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: right;
        z-index: -1;
    }

    &.active_link * {
        color: ${({ theme }) => theme.colors.light};
    }
`;

export const DropdownWrapper = styled.div<StyledProps>`
    overflow: hidden;
    max-height: ${({ $isOpen }) => ($isOpen ? '500px' : '0')};
    transition: max-height 0.3s ease;

    .active_link p {
        color: ${({ theme }) => theme.colors.primary} !important;
    }
`;

export const SidebarDropdown = styled.div<StyledProps>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0px;
    cursor: pointer;
    color: inherit;
    text-decoration: none;
    position: relative;

    &.active_link {
        color: ${({ theme }) => theme.colors.light};
        font-weight: ${({ theme }) => theme.fontWeights.medium};

        &::after {
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: ${({ open }) => (open ? '90%' : '100%')};
            height: 100%;
            background-color: ${({ theme }) => theme.colors.primary} !important;
            z-index: -1;
            border-radius: ${({ open }) => (open ? '0px 50px 50px 0px' : '0px')};
        }

        &::before {
            content: '';
            background-image: url(/src/assets/images/activePencil.png);
            position: absolute;
            right: 5px;
            top: 0;
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-position: right;
            z-index: -1;
        }
    }

    &.active_link p,
    &.active_link svg {
        color: ${({ theme }) => theme.colors.light} !important;
    }

    .arrow_icon {
        margin-right: 35px;
    }
`;

export const DropdownLinkStyle = styled.div<StyledProps>`
    .dropdown_link.active_link {
        background-color: #333;
        color: ${({ theme }) => theme.colors.light};
        border-radius: 8px;
    }

    .dropdown_link.active_link p {
        color: ${({ theme }) => theme.colors.light} !important;
    }
`;

export const DropdownChildLink = styled(Link)`
    display: flex;
    align-items: center;
    padding: 10px 20px;
`;

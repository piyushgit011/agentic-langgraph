import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Social_login_link::Start
export const SocialLoginWrapper = styled(Box)`
    gap: 15px;
    padding: 15px 0px;
    @media (max-width: 1024px) {
        gap: 5px;
    }
`;

interface SocialLinkProps {
    checked?: boolean;
    theme: Theme;
}

export const SocialLink = styled(Link) <SocialLinkProps>`
    background-color: ${({ theme }) => theme.colors.lightbg};
    border: 1px solid ${({ checked, theme }) => (checked ? theme.colors.primary : theme.colors.borderColor)};
    border-radius: 30px;
    padding: 8px 15px;
    text-transform: none;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.dark};
    box-shadow: none;
    text-decoration: none;
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
        margin-right: 10px;
    }

    @media (max-width: 1024px) {
        img {
            margin-right: 5px;
        }
    }

    p {
        color: #343A40;
    }

    &:hover {
        background-color: ${({ theme }) => theme.colors.light};
        box-shadow: none;
    }

    & .MuiButton-startIcon {
        margin-right: 8px;
    }

    & svg {
        font-size: 20px;
    }
`;
// Social_login_link::End

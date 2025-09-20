import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../../assets/styles/theme';

interface StyledProps {
    theme: Theme;
}

export const BreadcrumbWrapper = styled.nav<StyledProps>`
    display: flex;
    align-items: center;
    font-size: ${({ theme }) => theme.fontSizes.base};
    color: ${({ theme }) => theme.colors.light};
    padding: 0px 0px 15px 0px;

    @media (max-width: 576px) {
        flex-wrap: wrap;
    }
`;

export const Crumb = styled(Link) <StyledProps>`
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

export const Arrow = styled.span<StyledProps>`
    margin: 0 8px;
    color: ${({ theme }) => theme.colors.text};
`;

export const Current = styled.span<StyledProps>`
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

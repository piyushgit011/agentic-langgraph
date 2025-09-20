import { Link } from "react-router-dom";
import styled from "styled-components";
import { Theme } from "../../../../assets/styles/theme";

interface StyledLinkProps {
    weight?: number;
    color?: string;
    fontWeight?: number;
    to: string;
}

export const StyledLink = styled(Link)<StyledLinkProps>`
    text-decoration: none;
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.medium};
    color: ${({ color, theme }) => color || theme.colors.primary};
    text-decoration: none;
    
    &:hover {
        color: ${({ theme }) => theme.colors.primary};
        text-decoration: underline;
    }
`;


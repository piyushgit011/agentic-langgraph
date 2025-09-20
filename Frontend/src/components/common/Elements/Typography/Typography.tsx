import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

// ----------------------
// Types
// ----------------------
interface TypographyBaseProps {
    weight?: number;
    align?: string;
    color?: string;
    as?: string;
    variant?: string;
}

interface TextProps {
    weight?: number;
    color?: string;
}

interface ErrorSpanProps {
    weight?: number;
    align?: string;
    $fontSize?: string;
}

// ----------------------
// Generic Typography Component
// ----------------------
export const Typography = styled.p<TypographyBaseProps>`
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.medium};
    text-align: ${({ align }) => align || "left"};
    color: ${({ color, theme }) => color || theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.base};
`;

// ----------------------
// Heading Components
// ----------------------
export const Heading = styled.h1<TypographyBaseProps>`
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.medium};
    text-align: ${({ align }) => align || "left"};
    color: ${({ color, theme }) => color || theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.xl};
`;

export const Mainheading = styled.h1<TypographyBaseProps>`
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.medium};
    text-align: ${({ align }) => align || "left"};
    text-transform: capitalize;
    color: ${({ color, theme }) => color || theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.xxl};
`;

export const SectionTitle = styled.h2<TypographyBaseProps>`
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.medium};
    text-align: ${({ align }) => align || "left"};
    color: ${({ color, theme }) => color || theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.lg};
`;

// ----------------------
// Span Component
// ----------------------
export const Span = styled.span<TypographyBaseProps>`
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.medium};
    text-align: ${({ align }) => align || "left"};
    color: ${({ color, theme }) => color || theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.sm};
`;

// ----------------------
// Error Text
// ----------------------
export const ErrorSpan = styled.p<ErrorSpanProps>`
    font-size: ${({ theme, $fontSize }) => $fontSize || theme.fontSizes.sm};
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.regular};
    text-align: ${({ align }) => align || "left"};
    color: red;
    padding-top: 8px;
`;

// ----------------------
// Paragraph Components
// ----------------------
export const Paragraph = styled.p<TextProps>`
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.regular};
    color: ${({ color, theme }) => color || theme.colors.text};
`;

// ----------------------
// Small Text Variants
// ----------------------
export const SmallTextBold = styled.p<TextProps>`
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.medium};
`;

export const SmallTextRegular = styled.p<TextProps>`
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.regular};
`;

export const TextXS = styled.p<TextProps>`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.regular};
`;

export const TextSM = styled.p<TextProps>`
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.regular};
    color: ${({ color, theme }) => color || theme.colors.text};
`;

export const ExtraSmallTextLight = styled.p<TextProps>`
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.regular};
`;

export const smallHeading = styled.h3<TextProps>`
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ weight, theme }) => weight || theme.fontWeights.bold};
`;

// src/components/Typography/typography.ts

import styled, { css } from "styled-components";
import { Theme } from "../../../../assets/styles/theme";

// ✨ Available typography variants
type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "subtitle"
  | "link";

// ✨ Typography component props
interface TypographyBaseProps {
  variant?: TypographyVariant;
  color?: keyof Theme["colors"] | string;
  align?: string;
  weight?: keyof Theme["fontWeights"];
  fontSize?: keyof Theme["fontSizes"] | string;
}

// ✨ Variant-based font styles
const getVariantStyles = (variant: TypographyVariant, theme: Theme) => {
  switch (variant) {
    case "h1":
      return css`
        font-size: ${theme.fontSizes.xxxl};
        font-weight: ${theme.fontWeights.bold};
      `;
    case "h2":
      return css`
        font-size: ${theme.fontSizes.xxl};
        font-weight: ${theme.fontWeights.bold};
      `;
    case "h3":
      return css`
        font-size: ${theme.fontSizes.xl};
        font-weight: ${theme.fontWeights.semibold};
      `;
    case "h4":
      return css`
        font-size: ${theme.fontSizes.lg};
        font-weight: ${theme.fontWeights.semibold};
      `;
    case "h5":
      return css`
        font-size: ${theme.fontSizes.md};
        font-weight: ${theme.fontWeights.medium};
      `;
    case "h6":
      return css`
        font-size: ${theme.fontSizes.base};
        font-weight: ${theme.fontWeights.medium};
      `;
    case "subtitle":
      return css`
        font-size: ${theme.fontSizes.sm};
        font-weight: ${theme.fontWeights.regular};
        color: ${theme.colors.gray500};
      `;
    case "link":
      return css`
        font-size: ${theme.fontSizes.base};
        font-weight: ${theme.fontWeights.medium};
        color: #3b82f6;
        text-decoration: underline;

        &:hover {
          color: #2563eb;
        }
      `;
    case "p":
    default:
      return css`
        font-size: ${theme.fontSizes.base};
        font-weight: ${theme.fontWeights.regular};
      `;
  }
};

// ✨ Base style generator for all components
const baseTypography = ({
  variant = "p",
  color,
  align,
  weight,
  fontSize,
}: TypographyBaseProps) => ({
  theme,
}: {
  theme: Theme;
}) => css`
  ${getVariantStyles(variant, theme)};
  font-family: ${theme.fonts.primary};

  color: ${() => {
    const isThemeColor = color && Object.keys(theme.colors).includes(color);
    return isThemeColor
      ? theme.colors[color as keyof Theme["colors"]]
      : color || theme.colors.text;
  }};

  text-align: ${align || "left"};

  ${weight &&
  css`
    font-weight: ${theme.fontWeights[weight]};
  `}

  ${fontSize &&
  css`
    font-size: ${fontSize in theme.fontSizes
      ? theme.fontSizes[fontSize as keyof Theme["fontSizes"]]
      : fontSize};
  `}
`;


// ✨ Exported styled components
export const Heading = styled.h1<TypographyBaseProps>`
  ${baseTypography};
`;

export const Paragraph = styled.p<TypographyBaseProps>`
  ${baseTypography};
`;

export const Span = styled.span<TypographyBaseProps>`
  ${baseTypography};
`;

export const StyledLink = styled.a<TypographyBaseProps>`
  ${baseTypography};
`;

import styled from 'styled-components';
import { Theme } from '../../../../assets/styles/theme';

type FontSizeKeys = keyof Theme['fontSizes'];
type ColorKeys = keyof Theme['colors'];
type FontWeightKeys = keyof Theme['fontWeights'];

interface CustomLabelProps {
  flexLable?: boolean;
  color?: ColorKeys | string;
  fontSize?: FontSizeKeys | string;
  fontWeight?: FontWeightKeys | number;
  margin?: string;
}

export const CustomLabel = styled.label<CustomLabelProps>`
  font-size: ${({ theme, fontSize }) =>
    fontSize ? theme.fontSizes[fontSize as FontSizeKeys] || fontSize : theme.fontSizes.base};

  font-weight: ${({ theme, fontWeight }) =>
    fontWeight ? theme.fontWeights[fontWeight as FontWeightKeys] || fontWeight : theme.fontWeights.medium};

  color: ${({ theme, color }) =>
    color ? theme.colors[color as ColorKeys] || color : theme.colors.text};

  font-family: ${({ theme }) => theme.fonts.primary} !important;
  
  display: ${({ flexLable }) => (flexLable ? "flex" : "block")};

  margin: ${({ margin }) => margin || '0'}; // <-- now full dynamic margin
`;

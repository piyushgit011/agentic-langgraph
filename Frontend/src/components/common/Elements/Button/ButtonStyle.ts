import styled from 'styled-components';
import { Theme } from '../../../../assets/styles/theme';

interface SizeStyle {
    padding: string | {
        left: string;
        right: string;
        default: string;

    };
    fontSize: string;
}

interface SizeStyles {
    [key: string]: SizeStyle;
}

const sizeStyles: SizeStyles = {
    xs: { padding: '0.25rem 0.75rem', fontSize: '0.75rem' },
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: {
        padding: {
            left: '5px 20px 5px 5px',   // icon on left
            right: '5px 5px 5px 20px',  // icon on right
            default: '5px 10px',
        },
        fontSize: '1rem',
    },
    lg: {
        padding: {
            left: '8px 24px 8px 8px',
            right: '8px 8px 8px 24px',
            default: '8px 16px',
        },
        fontSize: '1.125rem',
    },
};

interface ButtonColors {
    bg: string;
    text: string;
    iconBg: string;
    iconColor: string;
    hoverBg: string;
    hoverText: string;
    hoverIconBg: string;
    hoverIconColor: string;
    border?: string;
    transperent?: string;
    borderColor?: string;
    hoverBorderColor?: string;
}

const getButtonColors = (theme: Theme, color: string): ButtonColors => {
    switch (color) {
        case 'primary':
            return {
                bg: theme.colors.primary,
                text: theme.colors.light,
                iconBg: theme.colors.light,
                iconColor: theme.colors.primary,
                hoverBg: theme.colors.light,
                hoverText: theme.colors.primary,
                hoverIconBg: theme.colors.primary,
                hoverIconColor: theme.colors.light,
            };
        case 'secondary':
            return {
                bg: theme.colors.secondary,
                text: theme.colors.light,
                iconBg: theme.colors.light,
                iconColor: theme.colors.secondary,
                hoverBg: theme.colors.light,
                hoverText: theme.colors.secondary,
                hoverIconBg: theme.colors.secondary,
                hoverIconColor: theme.colors.light,
                borderColor: theme.colors.secondary,
                hoverBorderColor: theme.colors.secondary,
            };
        case 'light':
            return {
                bg: theme.colors.light,
                text: theme.colors.primary,
                iconBg: theme.colors.primary,
                iconColor: theme.colors.light,
                hoverBg: theme.colors.primary,
                hoverText: theme.colors.light,
                hoverIconBg: theme.colors.light,
                hoverIconColor: theme.colors.primary,
            };
        case 'previous':
            return {
                bg: theme.colors.lightbg,
                text: theme.colors.secondary,
                iconBg: theme.colors.secondary,
                border: theme.colors.secondary,
                iconColor: theme.colors.light,
                hoverBg: theme.colors.secondary,
                hoverText: theme.colors.light,
                hoverIconBg: theme.colors.light,
                hoverIconColor: theme.colors.secondary,
            };
        case 'dark':
            return {
                bg: theme.colors.primary,
                text: theme.colors.light,
                iconBg: theme.colors.light,
                iconColor: theme.colors.secondary,
                hoverBg: theme.colors.light,
                hoverText: theme.colors.secondary,
                hoverIconBg: theme.colors.secondary,
                hoverIconColor: theme.colors.light,
            };
        default:
            return {
                bg: theme.colors.primary,
                text: theme.colors.light,
                iconBg: theme.colors.light,
                iconColor: theme.colors.secondary,
                hoverBg: theme.colors.light,
                hoverText: theme.colors.secondary,
                hoverIconBg: theme.colors.secondary,
                hoverIconColor: theme.colors.light,
            };
    }
};

interface CustomButtonProps {
    theme: Theme;
    $color?: string;
    $fontWeight?: number;
    $font?: string;
    $size?: string;
    $direction?: 'left' | 'right';
    $customPadding?: string;
    $iconCircleSize?: string;
    $iconSize?: string;
    $borderColor: string;
    $hoverBorderColor: string;
    $textOnly?: boolean;
}

export const CustomButton = styled.button<CustomButtonProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme, $color = 'primary' }) => getButtonColors(theme, $color).bg};
    color: ${({ theme, $color = 'primary' }) => getButtonColors(theme, $color).text};
    font-weight: ${({ $fontWeight }) => $fontWeight || 400};
    border: 1px solid ${({ theme, $color = 'primary' }) => getButtonColors(theme, $color).borderColor};
    border-radius: 999px;
    cursor: pointer;
    transition: all 0.3s ease;
    gap: 10px;
    font-family: ${({ theme, $font }) => theme.fonts[$font as keyof typeof theme.fonts] || theme.fonts.primary};
    font-size: ${({ $size = 'md' }) => sizeStyles[$size]?.fontSize || sizeStyles['md'].fontSize};
    padding: ${({ $textOnly, $customPadding, $size = 'md', $direction = 'right' }) =>
        $customPadding
            ? $customPadding
            : $textOnly
                ? '5px 15px'         
                : typeof sizeStyles[$size]?.padding === 'object'
                    ? sizeStyles[$size]?.padding[$direction] || sizeStyles[$size]?.padding.default
                    : sizeStyles[$size]?.padding || '5px 10px'};

    .icon-circle {
        background: ${({ theme, $color = 'primary' }) => getButtonColors(theme, $color).iconBg};
        color: ${({ theme, $color = 'primary' }) => getButtonColors(theme, $color).iconColor};
        border-radius: 50%;
        width: ${({ $iconCircleSize }) => $iconCircleSize || '35px'};
        height: ${({ $iconCircleSize }) => $iconCircleSize || '35px'};
        display: flex;
        align-items: center;
        justify-content: center;
    }

    svg {
        font-size: ${({ $iconSize }) => $iconSize || '1.5rem'};
    }

    &:hover {
        background-color: ${({ theme, $color = 'primary' }) => getButtonColors(theme, $color).hoverBg};
        color: ${({ theme, $color = 'primary' }) => getButtonColors(theme, $color).hoverText};
        border: 1px solid ${({ theme, $color = 'primary' }) => getButtonColors(theme, $color).hoverBorderColor};
    }

    &:hover .icon-circle {
        background: ${({ theme, $color = 'primary' }) => getButtonColors(theme, $color).hoverIconBg};
        color: ${({ theme, $color = 'primary' }) => getButtonColors(theme, $color).hoverIconColor};
    }

    // Back_button_style::Start

     &.back-button
    {
     background-color: ${({ theme }) => theme.colors.transperent};
     color: ${({ theme }) => theme.colors.primary};
     flex-direction: row-reverse;
     padding: 0px;
     border: none;
     gap:5px;
     border-radius:0px;
    }
    &.back-button span
    {
    color: ${({ theme }) => theme.colors.dark};
    }
    &.back-button .icon-circle
    {
    transform: rotate(180deg);
    width:unset;
    }

    &.back-button .icon-circle svg 
    {
    color: ${({ theme }) => theme.colors.primary};
    }

    &.back-button:hover .icon-circle
    {
            background-color: ${({ theme }) => theme.colors.transperent};
    }
    // Back_button_style::End

     
    // Small_padding_button::Start

    &.small_padding_button 
    {
    padding:3px 5px 3px 10px;
    }
    
    &.small_padding_button .icon-circle
    {
    width:22px;
    height:22px;
    }
   &.small_padding_button .icon-circle svg 
   {
    width:16px;
    height:16px;
   }
    // Small_padding_button::End

   // Square_button_css::Start
    &.square_btn
    {
    background-color: #F6F6F6;
    border: 1px solid #E0E0E0;
    width: 35px;
    height: 35px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding:0px;
    }
    &.square_btn svg 
    {
    color: #7b19d8;
    height: 1.2rem !important;
    width: 1.2rem !important;
      }

    // Square_button_css::End


    // Square_fill_button_css::Start

    &.square_fill_btn
    {
    background-color:${({ theme }) => theme.colors.secondary};
    width: 35px;
    height: 35px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding:0px;
    }
       &.square_fill_btn svg 
       {
           color: ${({ theme }) => theme.colors.white};
           height: 1.2rem !important;
    width: 1.2rem !important;
       }
    // Square_fill_button_css::End


    // Rounded_Fill_button::Start
    &.rounded_fill_btn
    {
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
    }
    &.rounded_border_btn
    {
    background-color: ${({ theme }) => theme.colors.transperent};
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;   
    color: ${({ theme }) => theme.colors.secondary};
    border-radius: 50%;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer !important;
    }
    // Rounded_Fill_button::End


     @media (max-width: 991.5px) {

     &.back-button 
    {
      display:none;
    }

    &.back_button_sm
    {
    margin-right:5px;
    background:none;
    border:none;
    padding:0px;
    background-color: ${({ theme }) => theme.colors.transperent} !important;
 
    }

    
    &.back_button_sm .icon-circle 
    {
    width:none;
    height:none;
    background-color: ${({ theme }) => theme.colors.transperent} !important;

    }
    &.back_button_sm .icon-circle svg 
    {
        color: ${({ theme }) => theme.colors.primary} !important;
    }
   
  }
`;

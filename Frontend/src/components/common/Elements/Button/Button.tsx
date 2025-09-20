import React from 'react';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { CustomButton } from './ButtonStyle';

interface ButtonProps {
    label?: string | React.ReactNode; // Dynamic label
    children?: React.ReactNode;       // optional
    type?: 'button' | 'submit' | 'reset';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    color?: string;
    font?: string;
    direction?: 'left' | 'right';
    iconSize?: string;
    iconCircleSize?: string;
    fontWeight?: number;
    customPadding?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    iconOnly?: boolean;
    textOnly?: boolean;               // <-- new prop here
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    borderColor?: string;
    hoverBorderColor?: string;
}

const Button: React.FC<ButtonProps> = ({
    label,
    children,
    type = 'button',
    size = 'md',
    color = 'primary',
    font = 'primary',
    direction = 'right',
    iconSize = '1.5rem',
    iconCircleSize = '30px',
    fontWeight = 400,
    customPadding,
    leftIcon,
    rightIcon,
    iconOnly = false,
    textOnly = false,               // <-- default false
    borderColor = 'transparent',
    hoverBorderColor = 'transparent',
    ...rest
}) => {
    return (
        <CustomButton
            type={type}
            $size={size}
            $color={color}
            $font={font}
            $direction={direction}
            $iconSize={iconSize}
            $iconCircleSize={iconCircleSize}
            $fontWeight={fontWeight}
            $customPadding={customPadding}
            $borderColor={borderColor}
            $hoverBorderColor={hoverBorderColor}
             $textOnly={textOnly}
            {...rest}
        >
            {iconOnly ? (
                // Icon-only mode (no label)
                leftIcon || rightIcon
            ) : textOnly ? (
                // Text-only mode (no icons)
                label || children
            ) : (
                <>
                    {direction === 'left' && (
                        <span className="icon-circle left">
                            {leftIcon || <WestIcon />}
                        </span>
                    )}
                    {label || children}
                    {direction === 'right' && (
                        <span className="icon-circle right">
                            {rightIcon || <EastIcon />}
                        </span>
                    )}
                </>
            )}
        </CustomButton>
    );
};

export default Button;

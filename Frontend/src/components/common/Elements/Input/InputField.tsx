import React, { useState, ChangeEvent } from 'react';
import { InputWrapper, IconBox, StyledInput, ToggleIconBox, InputMainWrapper } from './InputStyles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Label, Span } from '../../Elements'; // Assuming you already have a Label component

interface InputFieldProps {
    label?: string; 
    icon?: React.ReactNode;
    name?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    showToggle?: boolean;
    error?: boolean;
    errorText?: string;
    disabled?: boolean;
    className?: string;
    [key: string]: any;
}

const InputField: React.FC<InputFieldProps> = ({
    label, 
    icon = null,
    name = '',
    placeholder = '',
    type = 'text',
    showToggle = false,
    error = false,
    errorText = '',
    ...rest
}) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const isPassword = type === 'password';
    const inputType = showToggle && isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <InputMainWrapper>
            {/* Conditional rendering of label */}
            {label && <Label label={label} fontSize='sm' color='secondary' margin="0 0 3px 0" />}

            <InputWrapper>
                {icon && <IconBox>{icon}</IconBox>}

                <StyledInput
                    type={inputType}
                    name={name}
                    placeholder={placeholder}
                    {...rest}
                />

                {showToggle && isPassword && (
                    <ToggleIconBox onClick={() => setShowPassword(prev => !prev)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </ToggleIconBox>
                )}
            </InputWrapper>

            {error && errorText && (
                <Span className='error-text' as='span' color='danger' fontSize='sm' weight='medium'>
                    {errorText}
                </Span>
            )}
        </InputMainWrapper>
    );
};

export default InputField;

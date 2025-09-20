import React from 'react';
import { useTheme } from 'styled-components';
import { InputWrapper, IconBox, StyledTextarea, ErrorMessage } from './TextareaCustomStyles';
import { Span } from '../Typography/Typography';
import { Label } from '../../Elements';

interface TextareaCustomProps {
    label?: string;
    icon?: React.ReactNode;
    name?: string;
    placeholder?: string;
    error?: boolean;
    errorText?: string;
    noMargin?: boolean;
    rows?: number;
    [key: string]: any;
    inputWrapperClass?: string;
}
const TextareaCustom: React.FC<TextareaCustomProps> = ({
    label,
    icon = null,
    name = '',
    placeholder = '',
    error = false,
    errorText = '',
    noMargin = false,
    inputWrapperClass,
    rows = 1,
    ...rest
}) => {
    const theme = useTheme();

    return (
        <>
            {label && <Label label={label} fontSize='sm' color='secondary' margin="0 0 3px 0" />}
            <InputWrapper className={`${noMargin ? 'no-margin' : ''} ${inputWrapperClass || ''}`}>
                {icon && <IconBox className='icon_box_textArea'>{icon}</IconBox>}
                <StyledTextarea
                    name={name}
                    placeholder={placeholder}
                    rows={rows}
                    {...rest}
                />
            </InputWrapper>

            {error && errorText && (
                <ErrorMessage>
                    <Span className='error-text' as='span' color='danger' fontSize='sm' weight='medium'>{errorText}</Span>
                </ErrorMessage>
            )}
        </>
    );
};

export default TextareaCustom;

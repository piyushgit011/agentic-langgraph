import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { PhoneInputWrapper } from './PhoneNumberStyle';
import 'react-phone-input-2/lib/material.css';
import { Span } from '../Typography/Typography';

interface PhoneNumberProps {
  noMargin?: boolean;
  value?: string;
  onChange?: (phone: string) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  error?: boolean;
  errorText?: string;
}

const PhoneNumber: React.FC<PhoneNumberProps> = ({
  noMargin = false,
  value,
  onChange,
  placeholder = "Phone number",
  required = true,
  name = "phone",
  error = false,
  errorText = '',
  ...rest
}) => {
  const [phone, setPhone] = useState(value || '');

  const handleChange = (phoneNumber: string) => {
    setPhone(phoneNumber);
    if (onChange) {
      onChange(phoneNumber);
    }
  };

  return (
    <PhoneInputWrapper className={noMargin ? 'no-margin' : ''}>
      <PhoneInput
        country={'in'}
        value={phone}
        onChange={handleChange}
        enableSearch={false}
        placeholder={placeholder}
        inputProps={{
          name: name,
          required: required,
        }}
        {...rest}
      />
      
      {error && errorText && (
        <Span
          className='error-text'
          as='span'
          color='danger'
          fontSize='sm'
          weight='medium'
        >
          {errorText}
        </Span>
      )}
    </PhoneInputWrapper>
  );
};

export default PhoneNumber;

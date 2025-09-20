import React from 'react';
import { CheckboxContainer, HiddenCheckbox, StyledCheckbox } from './CustomCheckboxStyles';

interface CustomCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ id, label, checked, onChange }) => {
  return (
    <CheckboxContainer htmlFor={id}>
      <HiddenCheckbox
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <StyledCheckbox checked={checked} />
      {label}
    </CheckboxContainer>
  );
};

export default CustomCheckbox;

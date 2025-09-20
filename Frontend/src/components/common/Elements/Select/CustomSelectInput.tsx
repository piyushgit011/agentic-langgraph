import React from 'react';
import {
  FieldGroup,
  Select,
  IconBoxSelect,
  CustomSelect,
  IconBoxArrow,
} from './CustomSelectInputStyle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Label } from '../../Elements';

interface Option {
  value: string;
  label?: string; // label optional, for string[] fallback
}

interface CustomSelectInputProps {
  label?: string; // <-- Add label prop here
  icon?: React.ReactNode;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[] | string[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * Reusable Select Input with Icon and Styled Components
 */
const CustomSelectInput: React.FC<CustomSelectInputProps> = ({
  label,
  icon,
  value,
  onChange,
  options = [],  // <-- default value added here
  placeholder = 'Select an option',
  disabled = false,
  id,
}) => {
  return (
    <FieldGroup>
      {label && <Label label={label} fontSize="sm" color="secondary" margin="0 0 3px 0" />}
      <CustomSelect>
        {icon && <IconBoxSelect>{icon}</IconBoxSelect>}
        <Select
          id={id}
          className="custom_select"
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option
              key={typeof option === 'string' ? option : option.value}
              value={typeof option === 'string' ? option : option.value}
            >
              {typeof option === 'string' ? option : option.label}
            </option>
          ))}
        </Select>
        <IconBoxArrow>
          <KeyboardArrowDownIcon />
        </IconBoxArrow>
      </CustomSelect>
    </FieldGroup>
  );
};

export default CustomSelectInput;

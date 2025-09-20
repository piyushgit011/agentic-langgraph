import React from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { DatePicker as MuiDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const StyledDateFieldSC = styled(TextField)`
  width: 100%;
  & .MuiOutlinedInput-root {
    /* background and border radius from theme */
    background-color: ${({ theme }: { theme: any }) => theme.colors.primary};
    border-radius: ${({ theme }: { theme: any }) => theme.shape.borderRadius + 4}px;
    padding-left: 0; /* so the startAdornment aligns flush + margin */
    /* Border color default */
    & fieldset {
      border-color: ${({ theme }: { theme: any }) => theme.palette.divider};
    }
    /* Hover state */
    &:hover fieldset {
      border-color: ${({ theme }: { theme: any }) => theme.palette.text.primary};
    }
    /* Focused state */
    &.Mui-focused fieldset {
      border-color: ${({ theme }: { theme: any }) => theme.palette.primary.main};
    }
  }
  & .MuiInputBase-input {
    /* Inner padding and font */
    padding: 10px 12px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    background-color: #F9F7FD;
    border-radius: 10px;
    padding: 10px 0px 10px 5px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border: 1px solid #E0E0E0;
    margin-bottom: 30px;
    width: 100%;
  }
`;

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  inputFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  size?: 'small' | 'medium';
  [key: string]: any; // for other TextField props
}

/**
 * DatePicker component (styled via styled-components).
 * Props:
 *  - value: Date or null
 *  - onChange: function(Date|null)
 *  - placeholder: string (default "Select date")
 *  - inputFormat: string (default "dd-MM-yyyy")
 *  - minDate, maxDate: optional Date limits
 *  - size: "small" or "medium"
 *  - other TextField props: error, helperText, disabled, etc.
 */
const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  inputFormat = 'dd-MM-yyyy',
  minDate,
  maxDate,
  size = 'small',
  ...textFieldProps
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        value={value}
        onChange={onChange}
        inputFormat={inputFormat}
        mask={inputFormat.replace(/[dMy]/g, '_')}
        openTo="year"
        views={['year', 'month', 'day']}
        minDate={minDate}
        maxDate={maxDate}
        renderInput={(params) => (
          <StyledDateFieldSC
            {...params}
            placeholder={placeholder}
            size={size}
            {...textFieldProps}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start" sx={{ ml: 1 }}>
                  <CalendarMonthIcon sx={{ color: (theme: any) => theme.palette.primary.main }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 1 }}>
                  <ArrowDropDownIcon sx={{ color: (theme: any) => theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;

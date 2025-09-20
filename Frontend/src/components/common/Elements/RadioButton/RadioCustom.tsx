import React from 'react';
import Radio from '@mui/material/Radio';
import { RadioGroupWrapperStyled, RadioButtonStyled } from './RadioCustomStyles';

interface RadioCustomProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    options: string[];
}

const RadioCustom: React.FC<RadioCustomProps> = ({ value, onChange, options = [] }) => {
    return (
        <RadioGroupWrapperStyled row value={value} onChange={onChange}>
            {options.map((option) => (
                <RadioButtonStyled
                    key={option}
                    value={option.toLowerCase()}
                    control={
                        <Radio
                            sx={{
                                color: '#ccc',
                                '&.Mui-checked': {
                                    color: '#117a7a',
                                },
                            }}
                        />
                    }
                    label={option}
                    checked={value === option.toLowerCase()}
                />
            ))}
        </RadioGroupWrapperStyled>
    );
};

export default RadioCustom;

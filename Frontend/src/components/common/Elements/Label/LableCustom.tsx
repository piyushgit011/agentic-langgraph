import React from 'react';
import { CustomLabel } from './LableStyles';

interface LableCustomProps {
    label: string;
    FlexLable?: boolean;
    color?: string;
    fontSize?: string;
    margin?: string; // <-- new prop
}

const LableCustom: React.FC<LableCustomProps> = ({ 
    label, 
    FlexLable, 
    color, 
    fontSize,
    margin
}) => {
    return (
        <CustomLabel 
            flexLable={FlexLable} 
            color={color} 
            fontSize={fontSize}
            margin={margin} // <-- pass it to styled component
        >
            {label}
        </CustomLabel>
    );
};

export default LableCustom;

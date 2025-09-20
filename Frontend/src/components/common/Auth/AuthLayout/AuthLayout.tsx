import React from 'react';
import { AuthContainer, LeftContentGrid, RightContentGrid } from './AuthLayoutStyles';
import AuthLeftContent from "../AuthLeftContent/AuthLeftContent";
import AuthRightVisual from "../AuthRightVisual/AuthRightVisual";

const AuthLayout: React.FC = () => {
    return (
        <AuthContainer>
            <LeftContentGrid>
                <AuthLeftContent />
            </LeftContentGrid>
            <RightContentGrid>
                <AuthRightVisual />
            </RightContentGrid>
        </AuthContainer>
    );
};

export default AuthLayout;

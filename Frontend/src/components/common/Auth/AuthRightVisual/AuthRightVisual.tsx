import React from 'react';
import { RightContentWrapper, AuthRightTopContent, AuthImageContainer, ButtonWrapper } from './AuthRightVisualStyles';
import LoginImage from '../../../../assets/images/loginImage.svg';
import {
    Button,
} from '../../Elements';
import { useTheme } from 'styled-components';
import { Theme } from '../../../../assets/styles/theme';
import { Heading, Paragraph } from '../../Elements/Typography/Typography';

const AuthRightVisual: React.FC = () => {
    const theme = useTheme() as Theme;

    return (
        <RightContentWrapper>
            <AuthRightTopContent>
                <Heading variant='h1' color='white'>
                    Welcome to Reasonify
                </Heading>
                <Paragraph variant="p" color={theme.colors.light}>
                    With your AI Teacher, every lesson is tailored just for you. Log in to explore, learn, and grow at your own pace. Our AI Teacher is here to guide you through fun, personalized lessons. Log in and start your journey to smarter learning today!
                </Paragraph>
                <ButtonWrapper>
                    <Button
                        type="button"
                        color="light"
                        label={'Learn More'}
                    />
                </ButtonWrapper>
            </AuthRightTopContent>
            <AuthImageContainer>
                <img src={LoginImage} alt="Login visual" />
            </AuthImageContainer>
        </RightContentWrapper>
    );
};

export default AuthRightVisual;

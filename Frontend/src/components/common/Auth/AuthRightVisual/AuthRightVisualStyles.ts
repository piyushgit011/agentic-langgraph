// src/components/Auth/RightContent.styles.ts
import styled from 'styled-components';
import { Theme } from '../../../../assets/styles/theme';

interface StyledProps {
    theme: Theme;
}

export const RightContentWrapper = styled.div`
    color: ${({ theme }) => theme.colors.light};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    text-align: center;
    overflow: hidden;
    height: 100%;

    &::after {
        content: '';
        position: absolute;
        background-image: url(/src/assets/images/loginBg.png);
        top: 50%;
        left: 20px;
        transform: translateY(-50%);
        width: 100%;
        height: 100%;
        z-index: -1;
        background-repeat: no-repeat;
        background-position: top center;
    }

    @media (max-width: 1024px) {
        padding: 50px 15px 0px 15px;
        &::after {
            left: 0px;
        }
    }
`;

export const AuthRightTopContent = styled.div`
    text-align: center;
    padding: 5rem 8rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 1024px) {
        padding: 0px;
    }

    p, h1, h2, h3 {
        text-align: center;
    }
`;

export const LoginImageContainer = styled.div`
    position: absolute;
    bottom: 0;
`;

export const AuthImageContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 1024px) {
        img {
            width: 100%;
            margin-top: 30px;
        }
    }
`;

export const ButtonWrapper = styled.div`
    margin-top: 15px;

    @media (max-width: 768px) {
        margin-top: 1rem;
    }
`;

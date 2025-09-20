import styled from 'styled-components';
import { Theme } from '../../../../assets/styles/theme';

interface StyledProps {
    theme: Theme;
}

export const ModalBox = styled.div<StyledProps>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${({ theme }) => theme.colors.background};
    padding: 30px;
    border-radius: 15px;
    width: 400px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    outline: none;
`;

export const CustomModalHeader = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const CustomModalBody = styled.div`
    text-align: center;
    padding: 20px 0;
`;

export const ModalFooter = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
`;

export const ModalImg = styled.div`
    margin-bottom: 16px;
    text-align: center;

    img {
        width: 150px;
    }
`;

export const ModalBodyContent = styled.div`
    p {
        text-align: center;
    }
`;

export const ClsoeModalBtn = styled.div`
    text-align: center;
    position: absolute;
    right: 15px;
    top: 15px;
`;

export const CircleButtonFilled = styled.button<StyledProps>`
    border: 1px solid ${({ theme }) => theme.colors.secondary};
    background-color: ${({ theme }) => theme.colors.secondary};
    width: 35px;
    height: 35px;
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        color: ${({ theme }) => theme.colors.light};
    }
`;

export const MoldalLightBtn = styled.button<StyledProps>`
    background-color: ${({ theme }) => theme.colors.lightbg};
    border-radius: 50px;
    color: ${({ theme }) => theme.colors.dark};
    padding: 8px 20px;
    cursor: pointer;
    border: none;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const ModalDark = styled.button<StyledProps>`
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50px;
    color: ${({ theme }) => theme.colors.light};
    padding: 8px 20px;
    cursor: pointer;
    border: none;
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

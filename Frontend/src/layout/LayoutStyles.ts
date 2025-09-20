import styled from 'styled-components';
import { Box, Grid } from "@mui/material";

export const MainContentBox = styled(Box)<{ open: boolean }>`
  width: ${({ open }) => (open ? 'calc(100% - 265px)' : '100%')};
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }: { theme: any }) => theme.colors.pageColor};
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor};
  margin: 15px 15px 15px 0px;
  border-radius: 25px;
  z-index: 999;
  margin-left: ${({ open }) => (open ? '250px' : '55px')};

  @media (max-width: 1024px) {
    border-radius: 0px;
    margin: 0px !important;
    border: none;
  }
`;

export const PageContent = styled(Box)<{ $isLearningView?: boolean }>`
  padding: ${({ $isLearningView }) => ($isLearningView ? '0' : '15px')};
  height: 100%;

  @media (max-width: 1024px) {
    height: 100%;
  }
`;

export const PageContentInner = styled(Box)`
  height: 100%;
`;

export const LayoutWrapper = styled(Box)`
  display: flex;
  height: 100vh;
  
  @media (max-width: 1024px) {
    height: 100%;
    display: block;
    padding: 0px;
  }
`;

export const BreadcumbGrid = styled(Grid)`
  align-items: center;
  
  .add_button_icon {
    display: flex;
    justify-content: flex-end;
  }
`;

export const SmallDeviceClose = styled.div`
  display: none;

  button {
    background-color: ${({ theme }: { theme: any }) => theme.colors.secondary} !important;
    width: 40px !important;
    min-width: 40px !important;
    height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    color: ${({ theme }: { theme: any }) => theme.colors.white};
    border-radius: 50%;
    padding: 6px !important;
    cursor: pointer !important;
  }

  @media (max-width: 1024px) {
    display: block;
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 999;
  }

  button {
    background: ${({ theme }: { theme: any }) => theme.colors.transperent};
    border: none;
    color: ${({ theme }: { theme: any }) => theme.colors.white};
  }
`; 

import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Styles
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.3s ease-out;
  z-index: 1000;
`;

export const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 320px;
  background: ${({ theme }: { theme: any }) => theme.colors.white};
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
  animation: ${slideInRight} 0.3s ease-out;
  z-index: 1001;
  padding: 24px;
  overflow-y: auto;

  .upnext_modal_close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`;

export const TopicList = styled.div`
  margin-top: 24px;
`;

export const TopicItem = styled.div`
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  background: ${({ theme }: { theme: any }) => theme.colors.lightbg};
  transition: background 0.2s, color 0.2s;
  cursor: pointer;

  &:hover {
    background: ${({ theme }: { theme: any }) => theme.colors.secondary};
    color: ${({ theme }: { theme: any }) => theme.colors.white};
  }
`; 

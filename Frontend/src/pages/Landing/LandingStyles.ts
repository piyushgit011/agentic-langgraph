import styled from 'styled-components';

export const LandingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }: { theme: any }) => theme.colors.pageColor};
  display: flex;
  align-items: center;
  justify-content: center;
`; 

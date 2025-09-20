import styled from 'styled-components';

export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 50%; 
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const DropdownButton = styled.button`
  padding: 8px 12px;
  background: ${({ theme }: { theme: any }) => theme.colors.white};
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor};
  border-radius: 12px;
  box-shadow: ${({ theme }: { theme: any }) => theme.shadow.shadowInput};
  color: ${({ theme }: { theme: any }) => theme.colors.text};
  width: 100%;
  font-family: ${({ theme }: { theme: any }) => theme.fonts.primary || 'inherit'};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 180px; /* smaller button width */
  font-size: 16px;
  height: 45px;
  padding: 12px 12px 12px 65px;

  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%; 
  margin-top: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 5;
`;

export const DropdownItem = styled.button`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  cursor: pointer;
  background: #fff;
  text-align: left;

  &:hover {
    background: #f0f0f0;
  }
`;

export const FilterButtons = styled.div`
  display: flex;
  justify-content: end;
  gap: 10px;
  margin: 15px 0px;
`; 

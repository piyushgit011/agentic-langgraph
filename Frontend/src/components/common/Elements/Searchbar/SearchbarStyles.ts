import styled from 'styled-components';

// Table Searchbar Styles (from StudentPersonalInformation.js)
export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.lightbg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor} !important;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow.shadowInput};
  height: 45px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }
`;

export const IconBoxSelect = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  z-index: 2;
  margin-right: 10px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  border-right: 1px solid ${({ theme }) => theme.colors.borderColor};
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  background: #ffff;
  border-radius: 12px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.primary || 'inherit'};
  padding: 12px 12px 12px 65px;
  height: 45px;
  border: 1px solid ${({ theme }) => theme.colors.borderColor} !important;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }
`;

// Topbar Searchbar Styles (from TopbarStyles.js)
export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  height: 35px;
`;

// SearchButton moved to ButtonStyle.js - use Button component with buttonType="topbarSearch"

export const TopbarSearch = styled.input<{ $visible: boolean }>`
  outline: none;
  background: #fff;
  border-radius: 100px;
  font-size: 16px;
  height: 45px;
  border: 1px solid #e0e0e0;
  color: ${({ theme }) => theme.colors.text};
  padding: 10px 15px;
  width: 100%;
  max-width: ${({ $visible }) => ($visible ? '300px' : '0px')};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'scaleX(1)' : 'scaleX(0.9)')};
  transform-origin: left;
  transition: max-width 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.primary || 'inherit'};
  white-space: nowrap;
  overflow: hidden;
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }
`;

// Minimal Searchbar Styles (for compact searchbars)
export const MinimalSearchInput = styled.input<{ visible: boolean }>`
  width: ${(props) => (props.visible ? '200px' : '0')};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  padding: ${(props) => (props.visible ? '8px 12px' : '0')};
  border: ${(props) => (props.visible ? '1px solid #ccc' : 'none')};
  border-radius: 25px;
  margin-right: 10px;
  transition: all 0.3s ease;
  outline: none;
  font-size: 14px;
  padding: 15px 20px;
  position: relative;
  border: 1px solid #e0e0e0;
  height: 35px;
  min-height: 35px;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }
`;

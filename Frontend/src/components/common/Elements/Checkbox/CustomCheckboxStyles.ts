import styled from 'styled-components';

// Custom_checkbox::Start
export const CheckboxContainer = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  color:${({ theme }) => theme.colors.dark};
`;

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  display: none;
`;
export const StyledCheckbox = styled.span<{ checked: boolean }>`
  width: 25px;
  height: 25px;
  background: ${({ checked, theme }) => (checked ? theme.colors.secondary : theme.colors.lightbg)};
  border: 1px solid ${({ checked, theme }) => (checked ? theme.colors.secondary : theme.colors.borderColor)};
  border-radius:5px;
  transition: all 0.2s ease;
  display: inline-block;
  margin-right: 10px;
  position: relative;

  &::after {
    content: "";
    display: ${({ checked }) => (checked ? 'block' : 'none')};
    position: absolute;
    top: 5px;
    left: 9px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;
// Custom_checkbox::End

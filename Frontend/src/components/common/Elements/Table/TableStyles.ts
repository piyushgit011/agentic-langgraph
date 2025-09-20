// CustomTableStyles.ts
import styled from 'styled-components';
import { Box, TextField, TableCell, Menu, Table, Grid } from '@mui/material';

// Search bar
export const SearchTextField = styled(TextField)(({ theme }: { theme: any }) => ({
  flex: 1,
  borderRadius: '50px',
  backgroundColor: 'white',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    paddingLeft: theme.spacing(1),
  },
}));

// Styled Filter Menu
export const StyledFilterMenu = styled(Menu)(() => ({
  '& .MuiPaper-root': {
    width: 400,
    padding: 16,
    borderRadius: 16,
  },
}));

// Status Cell Typography
export const StatusTypography = styled(Box)<{ color: string }>(({ color }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color,
  fontWeight: 500,
  fontSize: 14,
}));

export const CustomTableMain = styled(Table)` 
  background: white;
  box-shadow: none !important;

  .table_head {
    color: white;
    background-color: #7B19D8; 
    padding: 20px;
  }

  .table_head tr th {
    color: white;
    padding: 10px 20px;
    font-family: ${({ theme }: { theme: any }) => theme.fonts?.primary || 'Poppins, sans-serif'} !important;
  }

  .table_body tr td {
    color: black;
    padding: 10px 20px;
    font-family: ${({ theme }: { theme: any }) => theme.fonts?.primary || 'Poppins, sans-serif'} !important;
  }
`;

export const CustomSearch = styled(TextField)` 
  background: white;
  box-shadow: none !important; 
`;

export const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 16px;
  position: relative;
`;

export const FilterSearchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

export const TableActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

export const CustomDataTable = styled.div`
  .table_filter_search {
    display: flex;
    gap: 15px;
  } 

  .table_search_box {
    width: 100%;
  }
  
  .search_grid_wrapper {
    width: 100%;
  }
  
  .filter_search_topbar {
    margin-bottom: 20px; 
  }
  
  .table_add_button {
    display: flex;
    justify-content: end;
  }

  @media (max-width: 899px) {
    .table_add_button {
      justify-content: start;
    }
  }

  .subject_name_tag {
    background: #F6F6F6;
    border: 1px solid #e0e0e0;
    padding: 3px 10px;
    border-radius: 8px;
    color: #7B19D8;
    font-weight: 500;
  }
  
  .chapter_number {
    background: #21786E;
    padding: 3px 10px;
    border-radius: 50px;
    color: white;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .wrap-column {
    white-space: normal;
    word-break: break-word;
    max-width: 300px;
  }
`;

export const DataTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto; 

  .rdt_Table {
    background-color: ${({ theme }: { theme: any }) => theme.colors.transperent}; 
  }
  
  .rdt_TableHeadRow {
    background-color: ${({ theme }: { theme: any }) => theme.colors.primary}; 
    border-radius: 15px 15px 0px 0px;
  }
  
  .rdt_TableCol_Sortable {
    color: ${({ theme }: { theme: any }) => theme.colors.background}; 
    font-size: ${({ theme }: { theme: any }) => theme.fontSizes.sm}; 
    justify-content: flex-start;
  }
  
  .rdt_TableBody {
    background-color: ${({ theme }: { theme: any }) => theme.colors.white}; 
  }
  
  .rdt_TableCell {
    color: ${({ theme }: { theme: any }) => theme.colors.text}; 
    font-size: ${({ theme }: { theme: any }) => theme.fontSizes.sm}; 
    justify-content: flex-start;
  }
  
  .rdt_Pagination {
    border-radius: 0px 0px 15px 15px; 
  }
`;

export const SearchFilterWrapper = styled.div`  
  display: flex;
  gap: 10px;
  width: 100%;
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
`;

export const ToggleButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  padding: 6px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  min-width: 90px;
  max-width: 90px;
  height: 45px;
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor} !important;
`;

export const TableToggleButton = styled.div`
  width: 35px;
  height: 35px;
  border: none;
  outline: none;
  border-radius: 8px;
  background: transparent;
  font-size: 20px;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  &.active {
    background: #7c3aed;
    color: #fff;
  }
`;

// Grid_view_Style::Start
export const TableGrid = styled.div``;

export const GridCard = styled.div`
  background-color: ${({ theme }: { theme: any }) => theme.colors.white};
  border: 1px solid ${({ theme }: { theme: any }) => theme.colors.borderColor};
  border-radius: 20px;
  box-shadow: none;
  height: 100%;
  padding: 15px;
`;

export const TableData = styled.div`
  display: flex;

  .table_data_value {
    margin-left: 5px;
  }
`;
// Grid_view_Style::End

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  gap: 8px;
`;

export const GridViewWrapper = styled.div`
  height: calc(100vh - 230px);
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  @media (max-width: 1024px) {
    height: 100%;
  }
`;

export const PageButton = styled.button<{ isArrow?: boolean; active?: boolean; disabled?: boolean }>`
  width: ${(props) => (props.isArrow ? "auto" : "32px")};
  height: ${(props) => (props.isArrow ? "auto" : "32px")};
  border-radius: ${(props) => (props.isArrow ? "4px" : "50%")};
  border: none;
  background: ${(props) =>
    props.active ? props.theme.colors.secondary : "transparent"};
  color: ${(props) => {
    if (props.disabled) return "#ccc";
    return props.active ? "#fff" : "#333";
  }};
  font-size: ${(props) => (props.isArrow ? "18px" : "14px")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: 0.3s;

  &:hover {
    background: ${(props) =>
    !props.active && !props.disabled ? "#f0f0f0" : ""};
  }
`; 
export const SearchWrapper = styled.div`
    position: relative;
    width: 100%;
`;
export const TableTopButton = styled.div`
  display:flex;
  justify-content:flex-end;
`;
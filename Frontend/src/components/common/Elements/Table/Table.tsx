import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Grid } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { IoGridOutline, IoListOutline, IoTrashOutline, IoCreateOutline, IoEyeOutline } from "react-icons/io5";
import {
  CustomDataTable,
  DataTableWrapper,
  GridCard,
  GridViewWrapper,
  PageButton,
  PaginationContainer,
  SearchFilterWrapper,
  SearchWrapper,
  TableData,
  TableGrid,
  TableToggleButton,
  TableTopButton,
  ToggleButtonWrapper,
} from "./TableStyles";
import Searchbar from "../Searchbar/Searchbar";
import FilterDropdown from "../../Filters/FilterDropdown";
import { Button } from '../../Elements'


// Props Interface
interface CentralizedTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  itemsPerPage?: number;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onCreate?: () => void;
  createButtonLabel?: string;
  showCreateButton?: boolean;
  renderGridCard?: (row: T) => React.ReactNode; // Optional custom grid card renderer
}

function Table<T extends { id: number | string }>({
  columns,
  data = [], // ✅ default empty array
  itemsPerPage = 6,
  onView,
  onEdit,
  onDelete,
  onCreate,
  createButtonLabel,
  renderGridCard,
   showCreateButton = true,
}: CentralizedTableProps<T>) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);

  const getInitialView = () => (window.innerWidth >= 1024 ? "list" : "grid");

  useEffect(() => {
    setView(getInitialView());
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const displayedData = (data ?? []).filter((row) =>
    JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(displayedData.length / itemsPerPage);
  const paginatedData = displayedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <CustomDataTable>
      {/* Top Bar */}
      <Grid container spacing={3} className="filter_search_topbar">
        <Grid size={{ xs: 12, sm: 12, md: 8, lg: 6 }}>
          <SearchFilterWrapper>
            <ToggleButtonWrapper>
              <TableToggleButton
                onClick={() => setView("list")}
                className={view === "list" ? "active" : ""}
              >
                <IoListOutline />
              </TableToggleButton>
              <TableToggleButton
                onClick={() => setView("grid")}
                className={view === "grid" ? "active" : ""}
              >
                <IoGridOutline />
              </TableToggleButton>
            </ToggleButtonWrapper>
            <SearchWrapper>
              <Searchbar value={search} onChange={handleSearch} />
            </SearchWrapper>
            <FilterDropdown onApplyFilters={(filters) => console.log('Filters applied:', filters)} />
          </SearchFilterWrapper>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 8, lg: 6 }}>
          <TableTopButton>

            {showCreateButton && onCreate && (
              <TableTopButton>
                <Button
                  type="button"
                  color="secondary"
                  rightIcon={<FiPlus />}
                  label={createButtonLabel || 'Create'}
                  onClick={onCreate}
                />
              </TableTopButton>
            )}
          </TableTopButton>

        </Grid>
      </Grid>

      {/* List View */}
      {view === "list" && (
        <DataTableWrapper>
          <DataTable
            columns={columns}
            data={displayedData}
            pagination
            highlightOnHover
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 290px)"
            striped
            responsive
            paginationPerPage={15}
          />
        </DataTableWrapper>
      )}

      {/* Grid View */}
      {view === "grid" && (
        <GridViewWrapper>
          <TableGrid>
            <Grid container spacing={2}>
              {paginatedData.map((row) => (
                <Grid key={row.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                  <GridCard>
                    {renderGridCard ? (
                      renderGridCard(row)
                    ) : (
                      <div>
                        {Object.entries(row).map(([key, value]) => (
                          <TableData key={key}>
                            <strong>{key}:</strong> {String(value)}
                          </TableData>
                        ))}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                        marginTop: "12px",
                        borderTop: "1px solid #eee",
                        paddingTop: "8px",
                      }}
                    >
                      {onView && (
                        <button onClick={() => onView(row)}>
                          <IoEyeOutline />
                        </button>
                      )}
                      {onEdit && (
                        <button onClick={() => onEdit(row)}>
                          <IoCreateOutline />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(row)}>
                          <IoTrashOutline />
                        </button>
                      )}
                    </div>
                  </GridCard>
                </Grid>
              ))}
            </Grid>
          </TableGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PageButton
                isArrow
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </PageButton>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (pageNum) => (
                  <PageButton
                    key={pageNum}
                    active={currentPage === pageNum}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </PageButton>
                )
              )}
              <PageButton
                isArrow
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </PageButton>
            </PaginationContainer>
          )}
        </GridViewWrapper>
      )}
    </CustomDataTable>
  );
}

export default Table;

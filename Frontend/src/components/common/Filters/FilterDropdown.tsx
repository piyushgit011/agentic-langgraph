import React, { useState, useRef, useEffect } from "react";
import {
    DropdownWrapper,
    DropdownButton,
    DropdownMenu,
    FilterButtons,
} from "./FilterDropdownStyle";
import { IconBoxSelect } from "../Auth/SignupForm/StudentAuth/PersonalDataProgressForm/StudentPersonalInformation";
import { FiFilter } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
    FormControl,
    Grid,
    MenuItem,
    Select,
    Checkbox,
    ListItemText,
    TextField,
    Chip,
    Box,
} from "@mui/material";
import { useTheme } from "styled-components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CustomSelectWrapper } from "../../SuperAdmin/CreateFormstyles";
import { GoMortarBoard } from "react-icons/go";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdSubject } from "react-icons/md";
import { ModalDark, MoldalLightBtn } from "../Elements/Modal/ModalStyle";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterDropdownProps {
    onApplyFilters: (filters: any) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ onApplyFilters }) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // ✅ Ref to detect outside click
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ✅ Boards
    const [searchBoard, setSearchBoard] = useState<string>("");
    const [selectedBoards, setSelectedBoards] = useState<string[]>([]);

    // ✅ Classes
    const [searchClass, setSearchClass] = useState<string>("");
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

    // ✅ Subjects
    const [searchSubject, setSearchSubject] = useState<string>("");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    // ✅ Detect outside click but ignore MUI Select dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdownEl = dropdownRef.current;
            const muiMenu = (event.target as Element)?.closest(".MuiPopover-root"); // ✅ Check if click is inside MUI Select menu

            // ✅ Close only if NOT inside dropdown & NOT inside MUI menu
            if (dropdownEl && !dropdownEl.contains(event.target as Node) && !muiMenu) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // ✅ Options
    const boardOptions: FilterOption[] = [
        { value: "CBSE", label: "CBSE" },
        { value: "ICSE", label: "ICSE" },
        { value: "IGCSE", label: "IGCSE" },
        { value: "IB", label: "IB" },
        { value: "NIOS", label: "NIOS" },
        { value: "AISSCE", label: "AISSCE" },
    ];

    const classOptions: FilterOption[] = [
        { value: "Class 1", label: "Class 1" },
        { value: "Class 2", label: "Class 2" },
        { value: "Class 3", label: "Class 3" },
        { value: "Class 4", label: "Class 4" },
        { value: "Class 5", label: "Class 5" },
        { value: "Class 6", label: "Class 6" },
    ];

    const subjectOptions: FilterOption[] = [
        { value: "Math", label: "Math" },
        { value: "Science", label: "Science" },
        { value: "English", label: "English" },
        { value: "History", label: "History" },
        { value: "Geography", label: "Geography" },
        { value: "Computer", label: "Computer" },
    ];

    // ✅ Filter options based on search
    const filteredBoards = boardOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchBoard.toLowerCase())
    );
    const filteredClasses = classOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchClass.toLowerCase())
    );
    const filteredSubjects = subjectOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchSubject.toLowerCase())
    );

    // ✅ Clear all filters and close dropdown
    const clearAllFilters = () => {
        setSelectedBoards([]);
        setSelectedClasses([]);
        setSelectedSubjects([]);
        setSearchBoard("");
        setSearchClass("");
        setSearchSubject("");

        // ✅ Notify parent that filters are cleared
        onApplyFilters({
            boards: [],
            classes: [],
            subjects: [],
        });

        // ✅ Close dropdown after clearing
        setIsOpen(false);
    };

    // ✅ Apply all filters at once
    const applyAllFilters = () => {
        const filters = {
            boards: selectedBoards,
            classes: selectedClasses,
            subjects: selectedSubjects,
        };

        // ✅ Send filter data to parent
        onApplyFilters(filters);

        // ✅ Close dropdown
        setIsOpen(false);
    };

    // ✅ Remove individual chip
    const removeFilter = (type: string, value: string) => {
        if (type === "boards")
            setSelectedBoards((prev) => prev.filter((v) => v !== value));
        if (type === "classes")
            setSelectedClasses((prev) => prev.filter((v) => v !== value));
        if (type === "subjects")
            setSelectedSubjects((prev) => prev.filter((v) => v !== value));
    };

    // ✅ Generic handler for multi-select
    const handleChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, e: any) => {
        const val =
            typeof e.target.value === "string"
                ? e.target.value.split(",")
                : e.target.value;
        setter(val);
    };

    // ✅ Reusable Select Component
    const renderMultiSelect = ({
        label,
        icon,
        value,
        searchValue,
        setSearchValue,
        options,
        setter,
    }: {
        label: string;
        icon: React.ReactNode;
        value: string[];
        searchValue: string;
        setSearchValue: React.Dispatch<React.SetStateAction<string>>;
        options: FilterOption[];
        setter: React.Dispatch<React.SetStateAction<string[]>>;
    }) => (
        <CustomSelectWrapper>
            <FormControl>
                <IconBoxSelect>{icon}</IconBoxSelect>
                <Select
                    multiple
                    value={value}
                    onChange={(e) => handleChange(setter, e)}
                    displayEmpty
                    renderValue={(selected) =>
                        selected.length === 0 ? `Select ${label}` : selected.join(", ")
                    }
                    IconComponent={ExpandMoreIcon}
                    sx={{ width: "250px" }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                padding: "8px",
                                borderRadius: "10px",
                                border: `1px solid ${theme?.colors?.borderColor || "#ccc"}`,
                                background: theme?.colors?.background || "#fff",
                                maxHeight: 300,
                                "& .MuiList-root": { paddingTop: 0 },
                                "& .MuiMenuItem-root": {
                                    borderRadius: "4px",
                                    marginBottom: "4px",
                                    fontFamily:
                                        theme?.fonts?.primary ||
                                        "inherit",
                                    color: theme?.colors?.text || "#333",
                                },
                                "& .Mui-selected": {
                                    background: theme?.colors?.lightbg || "#f5f5f5",
                                    "&:hover": {
                                        background: theme?.colors?.lightbg || "#f5f5f5",
                                    },
                                },
                            },
                        },
                    }}
                >
                    {/* ✅ Search Field inside dropdown */}
                    <MenuItem disableRipple>
                        <TextField
                            placeholder={`Search ${label.toLowerCase()}...`}
                            size="small"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                    </MenuItem>

                    {/* ✅ Filtered options */}
                    {options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            <Checkbox checked={value.indexOf(option.value) > -1} />
                            <ListItemText primary={option.label} />
                        </MenuItem>
                    ))}

                    {/* ✅ Show "No results" if no match */}
                    {options.length === 0 && (
                        <MenuItem disabled>No results found</MenuItem>
                    )}
                </Select>
            </FormControl>
        </CustomSelectWrapper>
    );

    // ✅ Show selected filters as Chips
    const renderSelectedChips = () => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {selectedBoards.map((val) => (
                <Chip
                    key={val}
                    label={`Board: ${val}`}
                    onDelete={() => removeFilter("boards", val)}
                />
            ))}
            {selectedClasses.map((val) => (
                <Chip
                    key={val}
                    label={`Class: ${val}`}
                    onDelete={() => removeFilter("classes", val)}
                />
            ))}
            {selectedSubjects.map((val) => (
                <Chip
                    key={val}
                    label={`Subject: ${val}`}
                    onDelete={() => removeFilter("subjects", val)}
                />
            ))}
        </Box>
    );

    // ✅ Count how many filters selected
    const totalSelectedCount =
        selectedBoards.length + selectedClasses.length + selectedSubjects.length;

    return (
        <DropdownWrapper ref={dropdownRef}>
            <DropdownButton onClick={toggleDropdown}>
                <IconBoxSelect>
                    <FiFilter />
                </IconBoxSelect>
                <div>
                    Filters
                    {totalSelectedCount > 0 && <span>({totalSelectedCount})</span>}
                </div>
                {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </DropdownButton>

            {isOpen && (
                <DropdownMenu style={{ width: "100%", padding: "16px" }}>
                    {/* ✅ Show selected filters as removable chips */}
                    {renderSelectedChips()}

                    <Grid container spacing={2}>
                        {/* ✅ Board Filter */}
                        <Grid size={{ xs: 12 }}>
                            {renderMultiSelect({
                                label: "Board",
                                icon: <GoMortarBoard />,
                                value: selectedBoards,
                                searchValue: searchBoard,
                                setSearchValue: setSearchBoard,
                                options: filteredBoards,
                                setter: setSelectedBoards,
                            })}
                        </Grid>

                        {/* ✅ Classes Filter */}
                        <Grid size={{ xs: 12 }}>
                            {renderMultiSelect({
                                label: "Class",
                                icon: <FaChalkboardTeacher />,
                                value: selectedClasses,
                                searchValue: searchClass,
                                setSearchValue: setSearchClass,
                                options: filteredClasses,
                                setter: setSelectedClasses,
                            })}
                        </Grid>

                        {/* ✅ Subjects Filter */}
                        <Grid size={{ xs: 12 }}>
                            {renderMultiSelect({
                                label: "Subject",
                                icon: <MdSubject />,
                                value: selectedSubjects,
                                searchValue: searchSubject,
                                setSearchValue: setSearchSubject,
                                options: filteredSubjects,
                                setter: setSelectedSubjects,
                            })}
                        </Grid>
                    </Grid>

                    {/* ✅ Apply & Clear Buttons */}
                    <FilterButtons>
                        <MoldalLightBtn onClick={clearAllFilters}>Clear</MoldalLightBtn>
                        <ModalDark onClick={applyAllFilters}>Apply</ModalDark>
                    </FilterButtons>
                </DropdownMenu>
            )}
        </DropdownWrapper>
    );
};

export default FilterDropdown; 

import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../hooks/useAuth";
import { authAPI } from "../../../services/apiService";

import {
    StyledDrawer,
    Row,
    SidebarLogo,
    StyledListItemIcon,
    SidebarLinks,
    LogoutLink,
    DropdownWrapper,
    SidebarDropdown,
    DropdownChildLink,
} from "./SidebarStyles";

import { sidebarItems, MenuItem } from "./SidebarItems";
import ReasonifyLogo from "../../../assets/images/reasonify-logo.svg";
import Favicon from "../../../assets/images/favicon.png";
import { SmallDeviceClose } from "../../../layout/LayoutStyles";
import { Paragraph } from "../Elements/Typography/Typography";

interface SidebarProps {
    open: boolean;
    mobileMenu: () => void;
    role?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ open, mobileMenu, role }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const normalizedRole = role as keyof typeof sidebarItems;
    const MenuItems: MenuItem[] = sidebarItems[normalizedRole] || [];

    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Handle logout
    const handleLogout = async () => {
        try {
            // Call logout API
            const response = await authAPI.logout();

            if (response.success) {
                // Clear local auth state
                logout();
                // Close mobile menu if open
                if (window.innerWidth <= 1024) {
                    mobileMenu();
                }
                // Navigate to login page
                navigate('/login');
            } else {
                console.error('Logout failed:', response.message);
                // Still logout locally and redirect
                logout();
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Still logout locally and redirect
            logout();
            navigate('/login');
        }
    };

    // ✅ Detect which dropdown should be open when navigating
    useEffect(() => {
        const matchedParent = MenuItems.find((item) =>
            item.children?.some((child) => location.pathname === child.path)
        );

        if (matchedParent) {
            // ✅ Keep dropdown open when navigating inside it
            setActiveDropdown(matchedParent.label);
        } else {
            // ✅ Do NOT force close here, allow manual toggle
        }
    }, [location.pathname, MenuItems]);

    const toggleDropdown = (label: string) => {
        // ✅ Toggle only the clicked dropdown (close if already open)
        setActiveDropdown((prev) => (prev === label ? null : label));
    };

    const isChildActive = (children?: MenuItem[]) =>
        children?.some((child) => location.pathname === child.path);

    const isExactPath = (path: string) => location.pathname === path;

    const handleLinkClick = (parentLabel: string | null = null) => {
        // ✅ If we are navigating inside the same dropdown, keep it open
        if (parentLabel && parentLabel === activeDropdown) {
            if (window.innerWidth <= 1024) mobileMenu();
            return; // ✅ Don't close dropdown
        }

        // ✅ Otherwise, close all dropdowns
        setActiveDropdown(null);

        if (window.innerWidth <= 1024) {
            mobileMenu();
        }
    };

    return (
        <StyledDrawer variant="permanent" open={open}>
            <div>
                {/* Sidebar Logo */}
                <SidebarLogo>
                    {open ? (
                        <img src={ReasonifyLogo} alt="Reasonify" />
                    ) : (
                        <img src={Favicon} alt="Reasonify" />
                    )}
                    <SmallDeviceClose>
                        <Button onClick={mobileMenu}>
                            <CloseIcon />
                        </Button>
                    </SmallDeviceClose>
                </SidebarLogo>

                {/* Sidebar Links */}
                <SidebarLinks>
                    {MenuItems.length === 0 && (
                        <Paragraph variant="p" style={{ padding: "1rem" }}>
                            No sidebar menu for this role
                        </Paragraph>
                    )}

                    {MenuItems.map((item, idx) => {
                        const Icon = item.icon;
                        const hasChildren = item.children?.length > 0;
                        const isDropdownOpen = activeDropdown === item.label;
                        const isParentActive = isExactPath(item.path);
                        const isAnyChildActive = isChildActive(item.children);

                        const parentClass =
                            isParentActive || isAnyChildActive || isDropdownOpen
                                ? "active_link"
                                : "";

                        return (
                            <div key={idx}>
                                {/* ✅ DROPDOWN MENU */}
                                {hasChildren ? (
                                    <>
                                        <SidebarDropdown
                                            className={parentClass}
                                            open={open}
                                            onClick={() => {
                                                if (open) toggleDropdown(item.label);
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <StyledListItemIcon>
                                                    <Icon />
                                                </StyledListItemIcon>
                                                {open && (
                                                    <Paragraph variant="p">{item.label}</Paragraph>
                                                )}
                                            </div>
                                            {open && (
                                                <ExpandMoreIcon
                                                    className="arrow_icon"
                                                    fontSize="small"
                                                    style={{
                                                        transform: isDropdownOpen
                                                            ? "rotate(180deg)"
                                                            : "rotate(0deg)",
                                                        transition: "transform 0.3s ease",
                                                    }}
                                                />
                                            )}
                                        </SidebarDropdown>

                                        {/* ✅ CHILD LINKS */}
                                        <DropdownWrapper $isOpen={open && isDropdownOpen}>
                                            {item.children?.map((child, cIdx) => {
                                                const isChildLinkActive = isExactPath(child.path);
                                                return (
                                                    <DropdownChildLink
                                                        key={cIdx}
                                                        to={child.path}
                                                        className={isChildLinkActive ? "active_link" : ""}
                                                        onClick={() => handleLinkClick(item.label)} // ✅ Pass parent label
                                                    >
                                                        {open && (
                                                            <Paragraph variant="p">
                                                                {child.label}
                                                            </Paragraph>
                                                        )}
                                                    </DropdownChildLink>
                                                );
                                            })}
                                        </DropdownWrapper>
                                    </>
                                ) : (
                                    /* ✅ NORMAL SINGLE LINK */
                                    <Row
                                        to={item.path}
                                        className={isExactPath(item.path) ? "active_link" : ""}
                                        open={open}
                                        onClick={() => handleLinkClick()} // ✅ Always close dropdowns for normal links
                                    >
                                        <StyledListItemIcon>
                                            <Icon />
                                        </StyledListItemIcon>
                                        {open && <Paragraph variant="p">{item.label}</Paragraph>}
                                    </Row>
                                )}
                            </div>
                        );
                    })}
                </SidebarLinks>
            </div>

            {/* ✅ LOGOUT LINK */}
            <LogoutLink>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        color: 'inherit',
                        textDecoration: 'none'
                    }}
                >
                    <StyledListItemIcon>
                        <RiLogoutCircleLine />
                    </StyledListItemIcon>
                    {open && <Paragraph variant="p">Logout</Paragraph>}
                </button>
            </LogoutLink>
        </StyledDrawer>
    );
};

export default Sidebar;

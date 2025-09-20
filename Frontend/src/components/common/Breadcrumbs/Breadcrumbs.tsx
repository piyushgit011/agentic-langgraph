import React from "react";
import { useLocation } from "react-router-dom";
import { Arrow, BreadcrumbWrapper, Crumb, Current } from "./BreadcrumbsStyles";
import { sidebarItems } from "../Sidebar/SidebarItems";

interface MenuItem {
    path: string;
    label: string;
    children?: MenuItem[];
}

interface DropdownMenu {
    slug: string;
    label: string;
    children: MenuItem[];
}

interface Breadcrumb {
    label: string;
    routeTo: string;
}

interface BreadcrumbProps {
    role?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ role }) => {
    const location = useLocation();
    const pathParts = location.pathname.split("/").filter(Boolean);
    if (pathParts.length === 0) return null;

    /**
     * ✅ Get menuItems for a specific role OR combine all roles
     */
    const getMenuItemsForRole = (roleName?: string): MenuItem[] => {
        if (roleName && sidebarItems[roleName as keyof typeof sidebarItems]) {
            return sidebarItems[roleName as keyof typeof sidebarItems];
        }
        // If role not given → merge all sidebar items from all roles
        return Object.values(sidebarItems).flat();
    };

    const menuItems = getMenuItemsForRole(role);

    /**
     * ✅ Detect dropdown menus (they have children)
     */
    const dropdownMenus: DropdownMenu[] = menuItems
        .filter(item => item.children?.length > 0)
        .map(item => ({
            slug: item.children?.[0]?.path.split("/")[1] || "", // e.g. "users", "content"
            label: item.label,
            children: item.children || []
        }));

    let breadcrumbs: Breadcrumb[] = [];

    /**
     * ✅ Try to detect if the first path segment is part of a dropdown
     */
    const dropdownMatch = dropdownMenus.find(dm => dm.slug === pathParts[0]);

    if (dropdownMatch) {
        // Find matching child (2nd segment)
        const childPath = `/${pathParts[0]}/${pathParts[1]}`;
        const childMatch = dropdownMatch.children.find(c => c.path === childPath);

        const parentLabel = dropdownMatch.label;
        const childLabel = childMatch ? childMatch.label : decodeURIComponent(pathParts[1]);

        // ✅ First merged crumb (clickable)
        breadcrumbs.push({
            label: `${parentLabel}: ${childLabel}`,
            routeTo: childPath
        });

        // ✅ If there are deeper segments → add normally
        if (pathParts.length > 2) {
            const mergedBase = `/${pathParts[0]}/${pathParts[1]}`;
            pathParts.slice(2).forEach((part, index) => {
                const routeTo = `${mergedBase}/${pathParts.slice(2, index + 3).join("/")}`;
                const label = decodeURIComponent(part)
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase());
                breadcrumbs.push({ label, routeTo });
            });
        }

    } else {
        // ✅ Normal non-dropdown routes → try to find labels from menuItems
        breadcrumbs = pathParts.map((part, index) => {
            const routeTo = "/" + pathParts.slice(0, index + 1).join("/");

            let foundLabel: string | null = null;

            // 1️⃣ Exact match with top-level
            const topMatch = menuItems.find(item => item.path === routeTo);
            if (topMatch) foundLabel = topMatch.label;

            // 2️⃣ Match inside dropdown children
            if (!foundLabel) {
                const dropdown = menuItems.find(item =>
                    item.children?.some(child => child.path === routeTo)
                );
                if (dropdown) {
                    const childMatch = dropdown.children?.find(child => child.path === routeTo);
                    if (childMatch) foundLabel = childMatch.label;
                }
            }

            // 3️⃣ Fallback → format from URL
            const label =
                foundLabel ||
                decodeURIComponent(part).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

            return { label, routeTo };
        });
    }

    return (
        <BreadcrumbWrapper>
            {/* Always show Home */}
            <Crumb to="/home">Home</Crumb>

            {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                    <React.Fragment key={index}>
                        <Arrow>›</Arrow>
                        {isLast ? (
                            <Current>{crumb.label}</Current>
                        ) : (
                            <Crumb to={crumb.routeTo}>{crumb.label}</Crumb>
                        )}
                    </React.Fragment>
                );
            })}
        </BreadcrumbWrapper>
    );
};

export default Breadcrumb;

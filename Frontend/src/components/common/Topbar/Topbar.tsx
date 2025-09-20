import React, { useState } from 'react';
import { BackButton, CircleButton, LeftSection, Notifications, PageNameTopbar, RightSection, SearchButton, SearchContainer, TopbarContainer, TopbarSearch, UserInfo, UserProfile } from './TopbarStyles';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useLocation } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { IoMoonOutline } from "react-icons/io5";
import { HiOutlineBell } from "react-icons/hi2";
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Button } from '../Elements';

interface TopbarProps {
    open: boolean;
    toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ open, toggleSidebar }) => {
    const [showInput, setShowInput] = useState<boolean>(false);
    const handleToggle = () => {
        setShowInput((prev) => !prev);
    };

    const location = useLocation();

    const user = useSelector((state: RootState) => state.auth.user);

    const formatTitle = (path: string): string => {
        const parts = path.split('/').filter(Boolean); // removes empty parts
        if (parts.length === 0) return 'Home';

        const lastSegment = parts[parts.length - 1];
        return decodeURIComponent(lastSegment)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize each word
    };

    return (
        <TopbarContainer>
            <LeftSection>
                <Button
                    className="rounded_fill_btn"
                    iconOnly
                    rightIcon={open ? <KeyboardBackspaceIcon /> : <MenuOpenIcon />}
                    onClick={toggleSidebar}
                />

                <PageNameTopbar>
                    <h3>{formatTitle(location.pathname)}</h3>
                </PageNameTopbar>
            </LeftSection>

            <RightSection>
                {/* Topbar_search */}
                <SearchContainer>
                    <TopbarSearch
                        type="text"
                        placeholder="Search here..."
                        $visible={showInput}
                    />
                    <SearchButton>
                      <Button
                        className="rounded_border_btn"
                        iconOnly
                        rightIcon={<IoIosSearch />}
                        onClick={handleToggle}
                    />
                    </SearchButton>
                </SearchContainer>
                {/* Topbar_search */}

                {/* Light_dark_mode_button */}
                <Button
                    className="rounded_border_btn"
                    iconOnly
                    rightIcon={<IoMoonOutline />}
                />

                {/* Light_dark_mode_button */}

                {/* Notifications_button */}
                <Notifications>
                    <Button
                        className="rounded_border_btn"
                        iconOnly
                        rightIcon={<HiOutlineBell />}
                    />
                </Notifications>
                {/* Notifications_button */}

                <UserProfile>
                    <img src="https://i.pravatar.cc/50?img=10" alt="User" />
                    <UserInfo className='info'>
                        <span className="name">{`${user?.firstName} ${user?.lastName}`}</span>
                        <span className="role">{user?.role}</span>
                    </UserInfo>
                </UserProfile>
            </RightSection>
        </TopbarContainer>
    );
};

export default Topbar;

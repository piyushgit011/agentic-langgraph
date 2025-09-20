import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import FilterDropdown from '../../common/Filters/FilterDropdown';
import SearchIcon from '@mui/icons-material/Search';
import { Grid } from '@mui/material';
import { SquareButtons } from '../../Student/Subjects/LearingView/LearingViewStyles';
import { IoEyeOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { IoGridOutline, IoListOutline } from 'react-icons/io5';
import { IconBoxSelect, SearchBox, SearchInput, SearchWrapper } from '../../common/Auth/SignupForm/StudentAuth/PersonalDataProgressForm/StudentPersonalInformation';
import ModalPopup from '../../common/Elements/Modal/Modal';
import { Paragraph } from '../../common/Elements/Typography/Typography';
import { useTheme } from 'styled-components';
import { SearchGrid } from '../../SuperAdmin/CreateFormstyles';
import { useSelector } from 'react-redux';
import { getApiConfig } from '../../../api';
import { fetchWithAuth } from '../../../utils/apiUtils';
import { RootState } from '../../../store/store';
import { Table } from '../../common/Elements';

interface ChatHistoryItem {
    id: number;
    sessionId: string;
    topicId: number;
    timestamp: string;
}

const AllChatsHistoryTable: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [tableData, setTableData] = useState<ChatHistoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [rowToDelete, setRowToDelete] = useState<ChatHistoryItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const getInitialView = (): string => (window.innerWidth >= 1024 ? 'list' : 'grid');
    const [view, setView] = useState<string>(getInitialView);
    const theme = useTheme();
    const { accessToken } = useSelector((state: RootState) => state.auth);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;

    const columns = [
        {
            name: 'ID',
            selector: (row: ChatHistoryItem) => row.id,
            width: '100px',
            center: true
        },
        {
            name: 'Session Id',
            selector: (row: ChatHistoryItem) => row.sessionId,
            sortable: true,
        },
        {
            name: 'Topic Id',
            selector: (row: ChatHistoryItem) => row.topicId,
            sortable: true
        },
        {
            name: 'Time stemp',
            selector: (row: ChatHistoryItem) => row.timestamp,
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row: ChatHistoryItem) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <SquareButtons onClick={() => handleView(row)}><IoEyeOutline /></SquareButtons>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            center: true,
            width: '200px',
        },
    ];

    // Fetch chat history data
    const fetchChatHistory = async () => {
        try {
            setLoading(true);
            setError(null);

            const apiConfig = getApiConfig('myHistoryList');
            const response = await fetchWithAuth(apiConfig.url, apiConfig.method, accessToken);

            if (response.success) {
                // Add id field to each item for DataTable compatibility
                const dataWithIds: ChatHistoryItem[] = response.data.map((item: any, index: number) => ({
                    ...item,
                    id: index + 1
                }));
                setTableData(dataWithIds);
            } else {
                setError('Failed to fetch chat history');
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
            setError('Error fetching chat history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChatHistory();
    }, []);

    const navigate = useNavigate();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

    const displayedData = tableData.filter((row) =>
        row.name.toLowerCase().includes(search.toLowerCase())
    );


    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleListClick = () => setView('list');
    const handleGridClick = () => setView('grid');
    const handleView = (row: ChatHistoryItem) => navigate(`/chatHistory/${row.sessionId}`);

    const confirmDelete = () => {
        if (rowToDelete) {
            setTableData(prev => prev.filter(item => item.id !== rowToDelete.id));
            setIsModalOpen(false);
            setRowToDelete(null);
        }
    };

    if (loading) {
        return <div>Loading chat history...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <Table
                columns={columns}
                data={view === 'list' ? displayedData : paginatedData}
                onCreate={handleAddClick}
                showCreateButton={false}
            />
        </>
    );
};

export default AllChatsHistoryTable;

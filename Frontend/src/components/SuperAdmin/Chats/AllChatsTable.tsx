import React, { useEffect, useState } from 'react';
import { apiService } from '../../../services/apiService';
import { SquareButtons } from '../../Student/Subjects/LearingView/LearingViewStyles';
import { IoEyeOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { Table } from '../../common/Elements';
import ModalPopup from '../../common/Elements/Modal/Modal';

interface ChatData {
  id: string;
  studentId: string;
  topicId: string;
  sessionId: string;
  timestamp: string;
}

const AllChatsTable: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [tableData, setTableData] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [rowToDelete, setRowToDelete] = useState<ChatData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const getInitialView = (): string => (window.innerWidth >= 1024 ? 'list' : 'grid');
  const [view, setView] = useState<string>(getInitialView);
  const theme = useTheme();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const columns = [
    {
      name: 'Student ID',
      selector: (row: ChatData) => row.studentId,
      sortable: true,
      width: '150px',
      center: true,
    },
    {
      name: 'Topic ID',
      selector: (row: ChatData) => row.topicId,
      sortable: true,
      width: '120px',
      center: true,
    },
    {
      name: 'Session ID',
      selector: (row: ChatData) => row.sessionId,
      cell: (row: ChatData) => <div className='session_id' style={{ fontSize: '12px' }}>{row.sessionId}</div>,
    },
    {
      name: 'Creation Time',
      selector: (row: ChatData) => row.timestamp,
      cell: (row: ChatData) => <div className='timestamp'>{new Date(row.timestamp).toLocaleString()}</div>,
    },
    {
      name: 'Actions',
      cell: (row: ChatData) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <SquareButtons onClick={() => handleView(row)}><IoEyeOutline /></SquareButtons>
          <SquareButtons onClick={() => handleDelete(row)}><IoTrashOutline /></SquareButtons>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
      width: '120px',
    },
  ];

  const navigate = useNavigate();

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await apiService.getHistoryList();

      if (response.success) {
        // Transform the data to match the expected format
        const dataWithIds: ChatData[] = response.data.map((item: any, index: number) => ({
          id: item.sessionId, // Use sessionId as the unique identifier
          studentId: item.studentId || 'Unknown',
          topicId: item.topicId || 'Unknown',
          sessionId: item.sessionId,
          timestamp: item.timestamp
        }));
        setTableData(dataWithIds);
      } else {
        setError('Failed to fetch chat history');
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError('Failed to fetch chat history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setView('list');
    } else {
      setView('grid');
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const displayedData = tableData.filter((row) =>
    row.sessionId.toLowerCase().includes(search.toLowerCase()) ||
    row.studentId.toLowerCase().includes(search.toLowerCase()) ||
    row.topicId.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(displayedData.length / itemsPerPage);
  const paginatedData = displayedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleListClick = () => setView('list');
  const handleGridClick = () => setView('grid');
  const handleView = (row: ChatData) => {
    navigate(`/chats/${row.sessionId}`, { state: { sessionData: row } });
  };
  const handleDelete = (row: ChatData) => {
    setRowToDelete(row);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (rowToDelete) {
      try {
        setDeleting(true);
        setError(null); // Clear any existing error
        const response = await apiService.deleteHistory(rowToDelete.sessionId);

        if (response.success) {
          // Remove the item from local state only after successful API call
          setTableData(prev => prev.filter(item => item.id !== rowToDelete.id));
          setIsModalOpen(false);
          setRowToDelete(null);
          setSuccess('Chat history deleted successfully');
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError('Failed to delete chat history');
        }
      } catch (error) {
        console.error('Error deleting chat history:', error);
        setError('Failed to delete chat history');
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading chat history...</div>;
  }

  return (
    <>
      <Table
        columns={columns}
        data={view === 'list' ? displayedData : paginatedData}
        showCreateButton={false}
      />

      {/* Delete Confirmation Modal */}
      <ModalPopup
        open={isModalOpen}
        onClose={() => !deleting && setIsModalOpen(false)}
        onCancel={() => !deleting && setIsModalOpen(false)}
        onConfirm={deleting ? () => { } : confirmDelete}
        type="delete"
        title="chat history"
        name={rowToDelete?.sessionId || ''}
        cancelText="Cancel"
        confirmText={deleting ? "Deleting..." : "Delete"}
      />
    </>
  );
};

export default AllChatsTable; 

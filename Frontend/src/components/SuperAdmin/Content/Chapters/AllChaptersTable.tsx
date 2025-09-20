import React, { useEffect, useState } from 'react';
import { SquareButtons } from '../../../Student/Subjects/LearingView/LearingViewStyles';
import { IoEyeOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { Button, Table } from '../../../common/Elements';

interface ChapterData {
  id: number;
  name: string;
  chapternumber: string;
  topics: string;
  subject: string;
  board: string;
  class: string;
}

const initialData: ChapterData[] = [
  { id: 1, name: 'Wake Up! / Neha\'s Alarm Clock', chapternumber: 'Chapter-1', topics: '4', subject: 'English', board: 'CBSE', class: '4' },
  { id: 2, name: 'Building with Bricks', chapternumber: 'Chapter-4', topics: '3', subject: 'Math', board: 'Gujarat', class: '4' },
  { id: 3, name: 'Whole Numbers', chapternumber: 'Chapter-4', topics: '5', subject: 'Maths', board: 'Gujarat Board', class: '6' },
  { id: 4, name: 'Basic Geometrical Ideas', chapternumber: 'Chapter-3', topics: '12', subject: 'Maths', board: 'CBSC', class: '4' },
  { id: 5, name: 'मन के भोले-भाले बादल', chapternumber: 'Chapter-12', topics: '1', subject: 'Hindi', board: 'CBSC', class: '4' },
  { id: 6, name: 'Decimals', chapternumber: 'Chapter-7', topics: '8', subject: 'Maths', board: 'CBSE', class: '5' },
  { id: 7, name: 'The Moon', chapternumber: 'Chapter-9', topics: '6', subject: 'Science', board: 'CBSE', class: '6' },
  { id: 8, name: 'The Moon', chapternumber: 'Chapter-9', topics: '6', subject: 'Science', board: 'CBSE', class: '6' },
  { id: 9, name: 'The Moon', chapternumber: 'Chapter-9', topics: '6', subject: 'Science', board: 'CBSE', class: '6' },
  { id: 10, name: 'The Moon', chapternumber: 'Chapter-9', topics: '6', subject: 'Science', board: 'CBSE', class: '6' },
  { id: 11, name: 'The Moon', chapternumber: 'Chapter-9', topics: '6', subject: 'Science', board: 'CBSE', class: '6' },
  { id: 12, name: 'The Moon', chapternumber: 'Chapter-9', topics: '6', subject: 'Science', board: 'CBSE', class: '6' },
  { id: 13, name: 'The Moon', chapternumber: 'Chapter-9', topics: '6', subject: 'Science', board: 'CBSE', class: '6' },
  { id: 14, name: 'The Moon', chapternumber: 'Chapter-9', topics: '6', subject: 'Science', board: 'CBSE', class: '6' },
  { id: 15, name: 'The Moon', chapternumber: 'Chapter-9', topics: '6', subject: 'Science', board: 'CBSE', class: '6' },
];

const AllChaptersTable: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [tableData, setTableData] = useState<ChapterData[]>(initialData);
  const [rowToDelete, setRowToDelete] = useState<ChapterData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const getInitialView = (): string => (window.innerWidth >= 1024 ? 'list' : 'grid');
  const [view, setView] = useState<string>(getInitialView);
  const theme = useTheme();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  const columns = [
    { name: 'ID', selector: (row: ChapterData) => row.id, width: '60px', center: true },
    {
      name: 'Chapter Number',
      selector: (row: ChapterData) => row.chapternumber,
      sortable: true,
      cell: (row: ChapterData) => <div className='chapter_number'>{row.chapternumber}</div>,
    },
    { name: 'Chapter Name', selector: (row: ChapterData) => row.name, sortable: true },
    { name: 'Topics', selector: (row: ChapterData) => row.topics },
    {
      name: 'Subject',
      selector: (row: ChapterData) => row.subject,
      center: true,
      cell: (row: ChapterData) => <div className='subject_name_tag'>{row.subject}</div>,
    },
    { name: 'Board', selector: (row: ChapterData) => row.board, center: true },
    { name: 'Class', selector: (row: ChapterData) => row.class, center: true },
    {
      name: 'Actions',
      cell: (row: ChapterData) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button className="square_btn" iconOnly rightIcon={<IoEyeOutline />} onClick={handleView} />
          <Button className="square_btn" iconOnly rightIcon={<IoCreateOutline />} onClick={handleEdit} />
          <Button className="square_btn" iconOnly rightIcon={<IoTrashOutline />} onClick={() => alert(`Delete ${row.name}`)} />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
      width: '200px',
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setView('list');
    } else {
      setView('grid');
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const displayedData = tableData.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
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

  const handleAddClick = () => navigate('/content/chapters/create-chapter');
  const handleListClick = () => setView('list');
  const handleGridClick = () => setView('grid');
  const handleView = (row?: ChapterData) => navigate('/content/chapters/view-chapter');
  const handleEdit = (row?: ChapterData) => navigate('/content/chapters/edit-chapter');
  const handleDelete = (row: ChapterData) => {
    setRowToDelete(row);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      setTableData(prev => prev.filter(item => item.id !== rowToDelete.id));
      setIsModalOpen(false);
      setRowToDelete(null);
    }
  };

  return (
    <>
      <Table
        columns={columns}
        data={view === 'list' ? displayedData : paginatedData}
        onCreate={handleAddClick}
        createButtonLabel="Create Chapter"
      />
    </>
  );
};

export default AllChaptersTable; 

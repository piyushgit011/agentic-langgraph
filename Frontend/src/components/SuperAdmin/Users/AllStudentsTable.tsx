import React, { useState, useEffect } from 'react';
import { SquareButtons } from '../../Student/Subjects/LearingView/LearingViewStyles';
import { IoEyeOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { Table,Button } from '../../common/Elements';

interface StudentData {
  id: number;
  name: string;
  email: string;
  class: string;
  subject: string;
  board: string;
  profileImage: string;
}

// ✅ Your original dummy data
const allData: StudentData[] = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', class: '10A', subject: 'Math', board: 'CBSE', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Priya Verma', email: 'priya@example.com', class: '9B', subject: 'Science', board: 'ICSE', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: 'John Doe', email: 'john@example.com', class: '8A', subject: 'English', board: 'CBSE', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: 'Rahul Sharma', email: 'rahul@example.com', class: '10A', subject: 'Math', board: 'CBSE', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 5, name: 'Priya Verma', email: 'priya@example.com', class: '9B', subject: 'Science', board: 'ICSE', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 6, name: 'John Doe', email: 'john@example.com', class: '8A', subject: 'English', board: 'CBSE', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 7, name: 'Priya Verma', email: 'priya@example.com', class: '9B', subject: 'Science', board: 'ICSE', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 8, name: 'John Doe', email: 'john@example.com', class: '8A', subject: 'English', board: 'CBSE', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 9, name: 'Rahul Sharma', email: 'rahul@example.com', class: '10A', subject: 'Math', board: 'CBSE', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 10, name: 'John Doe', email: 'john@example.com', class: '8A', subject: 'English', board: 'CBSE', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg' },
];

const AllStudentsTable: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setView('list');
    } else {
      setView('grid');
    }
  }, []);

  // ✅ Add view toggle & pagination states
  const getInitialView = (): string => (window.innerWidth >= 1024 ? 'list' : 'grid');
  const [view, setView] = useState<string>(getInitialView);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // ✅ Original columns remain unchanged
  const columns = [
    { name: 'ID', selector: (row: StudentData) => row.id, width: '60px', center: true },
    {
      name: 'Profile',
      selector: (row: StudentData) => row.profileImage,
      cell: (row: StudentData) => (
        <img src={row.profileImage} alt={row.name} width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} />
      ),
      center: true,
    },
    { name: 'Name', selector: (row: StudentData) => row.name, sortable: true },
    { name: 'Email', selector: (row: StudentData) => row.email },
    { name: 'Board', selector: (row: StudentData) => row.board, center: true },
    { name: 'Class', selector: (row: StudentData) => row.class, center: true },
    {
      name: 'Actions',
      cell: (row: StudentData) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '100%' }}>
          <Button className="square_btn" iconOnly rightIcon={<IoEyeOutline />} onClick={() => alert(`View ${row.name}`)}/>
          <Button className="square_btn" iconOnly rightIcon={<IoCreateOutline />} onClick={() => alert(`Edit ${row.name}`)}/>
          <Button className="square_btn" iconOnly rightIcon={<IoTrashOutline />} onClick={() => alert(`Delete ${row.name}`)}/>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
      width: '200px',
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const displayedData = allData.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Grid view pagination
  const totalPages = Math.ceil(displayedData.length / itemsPerPage);
  const paginatedData = displayedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleListClick = () => setView('list');
  const handleGridClick = () => setView('grid');
  const handleAddClick = () => navigate('/users/create-student');

  return (
    <>
      <Table
        columns={columns}
        data={view === 'list' ? displayedData : paginatedData}
         onCreate={handleAddClick}
          createButtonLabel="Create Student"
      />
    </>
  );
};

export default AllStudentsTable; 

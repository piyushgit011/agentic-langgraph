import { useEffect, useState } from 'react';
import { IoEyeOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import Button from '../../../common/Elements/Button/Button';
import { Table } from '../../../common/Elements';

interface TopicData {
    id: number;
    name: string;
    chapternumber: string;
    topics: string;
    subject: string;
    board: string;
    class: string;
}

const initialData: TopicData[] = [
    { id: 1, name: 'Variables and Constants', chapternumber: 'Chapter-1', topics: '4', subject: 'Mathematics', board: 'CBSE', class: '6' },
    { id: 2, name: 'Basic Equations', chapternumber: 'Chapter-2', topics: '3', subject: 'Mathematics', board: 'CBSE', class: '6' },
    { id: 3, name: 'Linear Functions', chapternumber: 'Chapter-3', topics: '5', subject: 'Mathematics', board: 'CBSE', class: '7' },
    { id: 4, name: 'Quadratic Equations', chapternumber: 'Chapter-4', topics: '6', subject: 'Mathematics', board: 'CBSE', class: '8' },
    { id: 5, name: 'Geometry Basics', chapternumber: 'Chapter-5', topics: '8', subject: 'Mathematics', board: 'CBSE', class: '6' },
    { id: 6, name: 'Trigonometry', chapternumber: 'Chapter-6', topics: '7', subject: 'Mathematics', board: 'CBSE', class: '9' },
    { id: 7, name: 'Statistics', chapternumber: 'Chapter-7', topics: '4', subject: 'Mathematics', board: 'CBSE', class: '8' },
    { id: 8, name: 'Probability', chapternumber: 'Chapter-8', topics: '5', subject: 'Mathematics', board: 'CBSE', class: '9' },
    { id: 9, name: 'Calculus Intro', chapternumber: 'Chapter-9', topics: '6', subject: 'Mathematics', board: 'CBSE', class: '10' },
    { id: 10, name: 'Algebra Advanced', chapternumber: 'Chapter-10', topics: '8', subject: 'Mathematics', board: 'CBSE', class: '10' },
];

export default function AllTopicsTable() {
    const [search, setSearch] = useState<string>('');
    const [tableData, setTableData] = useState<TopicData[]>(initialData);
    const [rowToDelete, setRowToDelete] = useState<TopicData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const getInitialView = (): string => (window.innerWidth >= 1024 ? 'list' : 'grid');
    const [view, setView] = useState<string>(getInitialView);
    const theme = useTheme();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;

    const columns = [
        { name: 'ID', selector: (row: TopicData) => row.id, width: '60px', center: true },
        {
            name: 'Chapter Number',
            selector: (row: TopicData) => row.chapternumber,
            sortable: true,
            cell: (row: TopicData) => <div className='chapter_number'>{row.chapternumber}</div>,
        },
        { name: 'Topic Name', selector: (row: TopicData) => row.name, sortable: true },
        { name: 'Sub Topics', selector: (row: TopicData) => row.topics },
        {
            name: 'Subject',
            selector: (row: TopicData) => row.subject,
            center: true,
            cell: (row: TopicData) => <div className='subject_name_tag'>{row.subject}</div>,
        },
        { name: 'Board', selector: (row: TopicData) => row.board, center: true },
        { name: 'Class', selector: (row: TopicData) => row.class, center: true },
        {
            name: 'Actions',
            cell: (row: TopicData) => (
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

    useEffect(() => {
        if (window.innerWidth >= 1024) {
            setView('list');
        } else {
            setView('grid');
        }
    }, []);


    const navigate = useNavigate();

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

    const handleListClick = () => setView('list');
    const handleGridClick = () => setView('grid');
    const handleAddClick = () => navigate('/content/topics/create-topic');
    const handleView = () => navigate('/content/topics/view-topic');
    const handleEdit = () => navigate('/content/topics/edit-topic');
    const handleDelete = (row: TopicData) => { setRowToDelete(row); setIsModalOpen(true); };

    const confirmDelete = () => {
        setTableData((prevData) => prevData.filter((item) => item.id !== rowToDelete?.id));
        setIsModalOpen(false);
        setRowToDelete(null);
    };

    return (
     <>
      <Table
        columns={columns}
        data={view === 'list' ? displayedData : paginatedData}
        onCreate={handleAddClick}
        createButtonLabel="Create Topic"
      />
    </>
    );
} 

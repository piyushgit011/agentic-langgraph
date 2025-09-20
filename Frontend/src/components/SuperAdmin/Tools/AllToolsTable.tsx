import React, { useEffect, useRef, useState, useCallback } from 'react';
import { IoEyeOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Button, Table } from '../../common/Elements';
import { toolAPI } from '../../../services/apiService';

interface ToolRow {
  id: number;
  toolName: string;
  topicName: string;
  modelName: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  toolDescription?: string;
}

interface ToolApiItem {
  toolId: number;
  toolName: string;
  toolDescription?: string;
  toolDataGenerationPrompt?: string;
  toolPracticeGenerationPrompt?: string;
  topicId?: number;
  topicName?: string;
  isActive?: boolean;
  modelName?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

const initialData: ToolRow[] = [];

const AllToolsTable: React.FC = () => {
  const [tableData, setTableData] = useState<ToolRow[]>(initialData);

  const navigate = useNavigate();
  const handleAddClick = useCallback(() => navigate('/content/tools/create-tool'), [navigate]);
  const handleView = useCallback((row: ToolRow) => navigate(`/content/tools/view-tool?toolId=${row.id}`), [navigate]);
  const handleEdit = useCallback((row: ToolRow) => navigate(`/content/tools/edit-tool?toolId=${row.id}`), [navigate]);
  const handleDelete = useCallback(async (row: ToolRow) => {
    const ok = window.confirm(`Delete tool: ${row.toolName}?`);
    if (!ok) return;
    try {
      await toolAPI.deleteTool(row.id);
      setTableData(prev => prev.filter(item => item.id !== row.id));
    } catch (e) {
      console.error('Delete tool failed', e);
      alert('Failed to delete tool');
    }
  }, [setTableData]);

  const columns = [
    { name: 'ID', selector: (row: ToolRow) => row.id, width: '80px', center: true },
    { name: 'Tool Name', selector: (row: ToolRow) => row.toolName, sortable: true },
    { name: 'Topic', selector: (row: ToolRow) => row.topicName || '-', sortable: true },
    { name: 'Model', selector: (row: ToolRow) => row.modelName || '-', center: true },
    {
      name: 'Active',
      selector: (row: ToolRow) => (row.isActive ? 'Active' : 'Inactive'),
      center: true,
      cell: (row: ToolRow) => (
        <div className='subject_name_tag' style={{ background: row.isActive ? '#e6ffed' : '#ffecec', color: row.isActive ? '#117a2a' : '#b00020' }}>
          {row.isActive ? 'Active' : 'Inactive'}
        </div>
      ),
      width: '140px',
    },
    { name: 'Created', selector: (row: ToolRow) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : '-'), sortable: true },
    { name: 'Updated', selector: (row: ToolRow) => (row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '-'), sortable: true },
    {
      name: 'Actions',
      cell: (row: ToolRow) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button className="square_btn" iconOnly rightIcon={<IoEyeOutline />} onClick={() => handleView(row)} />
          <Button className="square_btn" iconOnly rightIcon={<IoCreateOutline />} onClick={() => handleEdit(row)} />
          <Button className="square_btn" iconOnly rightIcon={<IoTrashOutline />} onClick={() => handleDelete(row)} />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
      width: '200px',
    },
  ];

  const didFetchRef = useRef<boolean>(false);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    const fetchTools = async () => {
      try {
        const res = await toolAPI.getTools();
        console.log("res", res);
        const tools = res.data?.tools ?? [];
        const mapped: ToolRow[] = tools.map((t: ToolApiItem, idx: number) => ({
          id: t.toolId ?? idx + 1,
          toolName: t.toolName ?? '-',
          topicName: t.topicName ?? '-',
          modelName: t.modelName ?? '-',
          isActive: Boolean(t.isActive),
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
          toolDescription: t.toolDescription,
        }));
        console.log("mapped", mapped);
        setTableData(mapped);
      } catch (e) {
        console.error('Failed to load tools', e);
      }
    };
    fetchTools();
  }, []);


  return (
    <>
      <Table columns={columns} data={tableData} onCreate={handleAddClick} createButtonLabel="Create Tool" />
    </>
  );
};

export default AllToolsTable; 

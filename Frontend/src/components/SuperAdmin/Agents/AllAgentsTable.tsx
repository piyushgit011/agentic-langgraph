import React, { useEffect, useState } from 'react';
import { apiService } from '../../../services/apiService';
import { IoEyeOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  Modal,
} from '../../common/Elements';
import { Typography } from '@mui/material';
import { Agent } from '../../../services/apiService';

interface AgentData {
  id: number;
  promptId: number;
  agentName: string;
  modelName: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
}

const AllAgentsTable: React.FC = () => {
  const [tableData, setTableData] = useState<AgentData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [rowToDelete, setRowToDelete] = useState<AgentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const columns = [
    { name: 'ID', selector: (row: AgentData) => row.promptId, width: '60px', center: true },
    {
      name: 'Agent Name',
      selector: (row: AgentData) => row.agentName,
      sortable: true,
      cell: (row: AgentData) => <div className='agent_name'>{row.agentName}</div>,
    },
    { name: 'Model Name', selector: (row: AgentData) => row.modelName, sortable: true },
    { name: 'Temperature', selector: (row: AgentData) => row.temperature },
    {
      name: 'Max Tokens',
      selector: (row: AgentData) => row.maxTokens,
      center: true,
      cell: (row: AgentData) => <div className='max_tokens'>{row.maxTokens}</div>,
    },
    { name: 'Status', selector: (row: AgentData) => row.isActive ? 'Active' : 'Inactive', center: true },
    {
      name: 'Actions',
      cell: (row: AgentData) => (
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

  // Fetch agents data
  const fetchAgents = async () => {
    try {
      setError(null);
      const response = await apiService.getSystemPrompts();

      if (response.success && Array.isArray(response.data)) {
        // Transform the data to match the expected format
        const transformedData = response.data.map((agent: Agent) => ({
          id: agent.id,
          promptId: agent.id,
          agentName: agent.agent_name,
          modelName: agent.model_name,
          temperature: agent.temperature,
          maxTokens: agent.max_tokens,
          isActive: agent.is_active
        }));
        setTableData(transformedData);
      } else {
        setError('Failed to fetch agents');
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      setError('Error fetching agents');
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);


  const navigate = useNavigate();

  const displayedData = tableData;
  const handleAddClick = () => navigate('/agents/create-agent');
  const handleView = (row: AgentData) => navigate('/agents/view-agent', { state: { agentData: row.promptId } });
  const handleEdit = (row: AgentData) => {
    navigate('/agents/edit-agent', { state: { agentData: row.promptId } });
  };
  const handleDelete = (row: AgentData) => {
    setRowToDelete(row);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (rowToDelete) {
      try {
        const response = await apiService.deleteAgent(rowToDelete.promptId.toString());
        if (response.success) {
          setTableData(prev => prev.filter(item => item.id !== rowToDelete.id));
          setIsModalOpen(false);
          setRowToDelete(null);
        } else {
          setError('Failed to delete agent');
        }
      } catch (error) {
        console.error('Error deleting agent:', error);
        setError('Error deleting agent');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}

      <Table
        columns={columns}
        data={displayedData}
        onCreate={handleAddClick}
        createButtonLabel="Create Agent"
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        type="delete"
        title="agent"
        name={rowToDelete?.agentName || ''}
      />
    </div>
  );
};

export default AllAgentsTable; 

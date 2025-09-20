import React, { useEffect } from 'react';
import { useAuth, useAcademicData, useAgent, useHistory } from '../../hooks/useApi';
import { authAPI, academicAPI, agentAPI, historyAPI } from '../../services/apiService';

const ApiUsageExample: React.FC = () => {
  // Using hooks for API calls
  const { boards, classes, languages } = useAcademicData();
  const { getSystemPrompts, createAgent } = useAgent();
  const { getMyHistoryList } = useHistory();
  const { login, checkEmail } = useAuth();

  // Example of using the API service directly
  const handleDirectApiCall = async () => {
    try {
      // Example: Check email availability
      const emailCheck = await authAPI.checkEmail('test@example.com');
      console.log('Email check result:', emailCheck);

      // Example: Get boards
      const boardsData = await academicAPI.getBoards();
      console.log('Boards data:', boardsData);

      // Example: Ask agent
      const agentResponse = await agentAPI.askAgent({
        message: 'Hello, how can you help me?',
        agentId: 'agent-123',
      });
      console.log('Agent response:', agentResponse);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  // Example of using hooks for API calls
  const handleHookApiCall = () => {
    // These will automatically handle loading states and errors
    boards.execute();
    classes.execute();
    languages.execute();
    getSystemPrompts.execute();
    getMyHistoryList.execute();
  };

  // Example login function
  const handleLogin = () => {
    login.execute({
      email: 'user@example.com',
      password: 'password123',
    });
  };

  // Example email check
  const handleEmailCheck = () => {
    checkEmail.execute('test@example.com');
  };

  // Example create agent
  const handleCreateAgent = () => {
    createAgent.execute({
      name: 'Math Tutor',
      description: 'A helpful math tutor agent',
      systemPrompt: 'You are a helpful math tutor. Help students understand mathematical concepts.',
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Usage Examples</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Direct API Service Usage</h2>
        <button 
          onClick={handleDirectApiCall}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Direct API Calls
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Hook-based API Usage</h2>
        <button 
          onClick={handleHookApiCall}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Load Data with Hooks
        </button>
        
        <button 
          onClick={handleLogin}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#ffc107', 
            color: 'black', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Login
        </button>
        
        <button 
          onClick={handleEmailCheck}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Check Email
        </button>
        
        <button 
          onClick={handleCreateAgent}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Create Agent
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Loading States</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <strong>Boards:</strong> {boards.loading ? 'Loading...' : boards.data ? `${boards.data.length} boards` : 'Not loaded'}
          </div>
          <div>
            <strong>Classes:</strong> {classes.loading ? 'Loading...' : classes.data ? `${classes.data.length} classes` : 'Not loaded'}
          </div>
          <div>
            <strong>Languages:</strong> {languages.loading ? 'Loading...' : languages.data ? `${languages.data.length} languages` : 'Not loaded'}
          </div>
          <div>
            <strong>Agents:</strong> {getSystemPrompts.loading ? 'Loading...' : getSystemPrompts.data ? `${getSystemPrompts.data.length} agents` : 'Not loaded'}
          </div>
          <div>
            <strong>History:</strong> {getMyHistoryList.loading ? 'Loading...' : getMyHistoryList.data ? `${getMyHistoryList.data.length} history items` : 'Not loaded'}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Error States</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {boards.error && <div style={{ color: 'red' }}><strong>Boards Error:</strong> {boards.error}</div>}
          {classes.error && <div style={{ color: 'red' }}><strong>Classes Error:</strong> {classes.error}</div>}
          {languages.error && <div style={{ color: 'red' }}><strong>Languages Error:</strong> {languages.error}</div>}
          {getSystemPrompts.error && <div style={{ color: 'red' }}><strong>Agents Error:</strong> {getSystemPrompts.error}</div>}
          {getMyHistoryList.error && <div style={{ color: 'red' }}><strong>History Error:</strong> {getMyHistoryList.error}</div>}
          {login.error && <div style={{ color: 'red' }}><strong>Login Error:</strong> {login.error}</div>}
          {checkEmail.error && <div style={{ color: 'red' }}><strong>Email Check Error:</strong> {checkEmail.error}</div>}
          {createAgent.error && <div style={{ color: 'red' }}><strong>Create Agent Error:</strong> {createAgent.error}</div>}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Data Display</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {boards.data && (
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
              <h3>Boards ({boards.data.length})</h3>
              <ul>
                {boards.data.slice(0, 3).map((board) => (
                  <li key={board.id}>{board.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          {classes.data && (
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
              <h3>Classes ({classes.data.length})</h3>
              <ul>
                {classes.data.slice(0, 3).map((cls) => (
                  <li key={cls.id}>{cls.name}</li>
                ))}
              </ul>
            </div>
          )}
          
          {languages.data && (
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
              <h3>Languages ({languages.data.length})</h3>
              <ul>
                {languages.data.slice(0, 3).map((lang) => (
                  <li key={lang.id}>{lang.name} ({lang.code})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Reset Functions</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => boards.reset()}
            style={{ 
              padding: '5px 10px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Reset Boards
          </button>
          <button 
            onClick={() => classes.reset()}
            style={{ 
              padding: '5px 10px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Reset Classes
          </button>
          <button 
            onClick={() => languages.reset()}
            style={{ 
              padding: '5px 10px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Reset Languages
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiUsageExample; 

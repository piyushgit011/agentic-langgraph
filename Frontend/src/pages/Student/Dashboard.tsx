import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  console.log('Dashboard - Auth state:', { user, isAuthenticated });

  if (!isAuthenticated || !user) {
    console.log('Dashboard - Not authenticated or no user');
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <Box p={3}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Email: {user.email}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Role: {user.role}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard; 

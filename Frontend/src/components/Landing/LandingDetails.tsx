import React from 'react';
import { Link } from 'react-router-dom';
import { LandingWrapper } from './LandingStyles';

const LandingDetails: React.FC = () => {
  return (
    <LandingWrapper>
      <Link to="/login">
        Login to you account
      </Link>
    </LandingWrapper>
  );
};

export default LandingDetails; 

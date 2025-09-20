import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
    return (
        <>
            <Link to={"/login"} state={{ id: "Student" }}>
                Landing page
            </Link>
        </>
    );
};

export default Landing; 

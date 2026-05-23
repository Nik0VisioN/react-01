import React from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
    const { session, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Loading...</div>;

    if (!session) {
        // save the current location in state so we can redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
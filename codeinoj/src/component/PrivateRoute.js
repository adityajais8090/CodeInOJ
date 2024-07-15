import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/user/userContext';
import SpinnerLoader from './SpinnerLoader';

const PrivateRoute = ({ children }) => {
    const { user, fetchUserProfile, loading } = useContext(UserContext);
    const [attempts, setAttempts] = useState(0);
    const maxAttempts = 5;

    useEffect(() => {
        if (!user && attempts < maxAttempts) {
            const interval = setInterval(() => {
                fetchUserProfile();
                setAttempts(prev => prev + 1);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [user, attempts, fetchUserProfile]);

    if (loading) {
        return <div><SpinnerLoader/></div>;
    }

    if (user) {
        return children;
    } else {
        return <Navigate to="/login" />;
    }
};

export { PrivateRoute };

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth/authState';
import SpinnerLoader from './SpinnerLoader';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    // You can return a loading spinner or null while loading
    return <div><SpinnerLoader/></div>;
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export { PrivateRoute };

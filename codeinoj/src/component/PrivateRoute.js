import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import UserContext from '../context/user/userContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  return user ? children : <Navigate to="/login" />;
};

export  {PrivateRoute};

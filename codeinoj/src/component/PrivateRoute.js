import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/user/userContext';
import SpinnerLoader from './SpinnerLoader';



const PrivateRoute = ({ children }) => {
  const { user, fetchUserProfile } = useContext(UserContext);
  const token = localStorage.getItem('userToken');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
     
        let attempts = 0;
        const maxAttempts = 6;
        while (attempts < maxAttempts) {
          await fetchUserProfile();
          if (user) {
            setLoading(false);
            return;
          }
          attempts += 1;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
        }
      
      setLoading(false);
    };

    fetchUser();
  }, [token, user, fetchUserProfile]);

  if (loading) {
    return <div><SpinnerLoader/></div>; // Display a loading indicator while fetching user profile
  }

  // Check if user is authenticated and token is valid
  if (user) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};

export { PrivateRoute };

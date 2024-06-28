import React, { useContext, useEffect } from 'react';
import { getProfile, delSession, getAdmin } from '../service/api';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/user/userContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useContext(UserContext);

    useEffect(() => {
        if (!user) {
            fetchUserProfile();
        }
    }, [user]);

 
 // console.log("my user is undefined: ", user);


  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await delSession();
      console.log("Response while logout: ", response);
      if (response.success) {
        window.location.href = '/';
      }
    } catch (err) {
      console.log("Error while logout: ", err);
    }
  };


  const handleProfilePage = async (e) => {
    e.preventDefault();
    try {
      const response = await getProfile();
      console.log("response profile : ", response);
      if (response.success) {
        navigate('/profile');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error while checking authentication:', err);
    }
  };

  const handleAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await getAdmin();
      console.log("response profile : ", response);
      if (response.success) {
        navigate('/admin');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error while checking authentication:', err);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">CodeInOJ</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" onClick={handleProfilePage}>Profile</Link>
            </li>
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" onClick={handleAdmin}>Admin</Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            
          {!user && (<>
               
                  <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              
              </>)}
           
              {user && (
                <>
                <li className="nav-item">
                    <Link className="nav-link" onClick={handleProfilePage}>{user.firstname}</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" onClick={handleLogout}>Logout</Link>
                </li>
              </> )}
          
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

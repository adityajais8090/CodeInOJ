import React from 'react';
import {getProfile} from '../service/api.js';
import { Link , useNavigate } from 'react-router-dom';




const Navbar = () => {
  const navigate = useNavigate();

  const handleProfilePage = async (e) => {
    e.preventDefault();
    try {
      const response = await getProfile();
      console.log("here is response : " , response);
      if (response.success) {
        navigate('/profile');
      } else {
        console.log("User not authenticated."); // Optionally handle this case
        navigate('/login');
      }
    } catch (err) {
      console.error("Error while checking authentication:", err); // Handle error if needed
    }
  };


 
  return (
    <>
     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">CodeInOJ</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile" onClick={handleProfilePage}>Profile</Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

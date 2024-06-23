import React from 'react';
import {getProfile} from '../service/api.js';

const Navbar = () => {

  const handleProfilePage = async (e) => {
    e.preventDefault();
    try {
      const response = await getProfile();
      //console.log(response);
      if (response.status === 200) {
        window.location.href = "/profile";
      } else {
        console.log("User not authenticated."); // Optionally handle this case
      }
    } catch (err) {
      console.error("Error while checking authentication:", err); // Handle error if needed
    }
  };

 
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">CodeInOJ</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile" onClick={handleProfilePage}>Profile</a>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="navbar-text nav-item">
            <a className="nav-link" href="/login">Login</a>
             </li>
             <li className="navbar-text nav-item">
            <a className="nav-link" href="/register">Register</a>
             </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

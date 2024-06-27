import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import '../styles/App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Home, Register, Login, Profile, Problem,  Admin } from '../pages';
import {Navbar} from './';

function App() {
  //added path for pages
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path = "/profile" element={<Profile/>} />
          <Route path = "/problemset/problem" element ={<Problem/>} />
          <Route path = "/admin" element = {<Admin/>} />
          </Routes>
      </Router>
  );
}

export default App;

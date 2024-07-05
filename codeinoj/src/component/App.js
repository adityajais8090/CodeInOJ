import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import '../styles/App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import UserState from '../context/user/userState.js';
import { Home, Register, Login, Profile, Problem,  Admin, Problemset, Contest } from '../pages';
import {Navbar} from './';

function App() {
  //added path for pages
  return (
    <UserState>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path = "/profile" element={<Profile/>} />
          <Route path = "/problemset/problem/:code" element ={<Problem/>} />
          <Route path = "/contests/:contestCode" element = {<Contest/>} />
          <Route path = "/admin" element = {<Admin/>} />
          <Route path = "/problemset" element = {<Problemset/>} />
          <Route path = "/contest" element = {<Contest/>} />
          </Routes>
      </Router>
      </UserState>
  );
}

export default App;

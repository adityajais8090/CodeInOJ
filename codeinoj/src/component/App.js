import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import { AuthState } from '../context/auth/authState';
import { Home, Register, Login, Profile, Problem, Admin, Problemset, Contest } from '../pages';
import Navbar from './Navbar';
import {PrivateRoute} from './PrivateRoute';

function App() {
  return (
    <AuthState>
    
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/problemset/problem/:code"
            element={
              <PrivateRoute>
                <Problem />
              </PrivateRoute>
            }
          />
          <Route
            path="/contests/:contestCode"
            element={
              <PrivateRoute>
                <Contest />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route path="/problemset" element={
            <PrivateRoute>
            <Problemset />
              </PrivateRoute>} />
          <Route path="/contest" element={
            <PrivateRoute>
            <Contest />
              </PrivateRoute>
            } />
        </Routes>
      </Router>
    
    </AuthState>
  );
}

export default App;

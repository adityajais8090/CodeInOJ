import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import '../styles/App.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Home, Register, Login, Profile } from '../pages';

function App() {
  //added path for pages
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path = "/profile" element={<Profile/>} />
          </Routes>
      </Router>
  );
}

export default App;

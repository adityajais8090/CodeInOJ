import React, { useState, useEffect } from 'react';
import { getProblemSet, uploadProblem, deleteProblem, updateProblem, getTestCases } from '../service/api';

import Profile from './profile';

import { AdminDashboard, ProblemFormModal, AdminContest } from '../component/index';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenNib, faPlus } from '@fortawesome/free-solid-svg-icons';

const Admin = () => {
  const [problems, setProblems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [problem, setProblem] = useState(initialProblemState);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const fetchProblems = async () => {
      const data = await getProblemSet();
      setProblems(data);
    };
    fetchProblems();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === 'constraints' || name === 'tags') {
      setProblem({
        ...problem,
        [name]: value.split(',').map((item) => item.trim()),
      });
    } else {
      setProblem({
        ...problem,
        [name]: value,
      });
    }
  };

  const handleShow = (prob = initialProblemState) => {
    setProblem(prob);
    setIsEditing(!!prob.code);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleAddProblem = async () => {
    await uploadProblem(problem);
    const data = await getProblemSet();
    setProblems(data);
    handleClose();
  };

  const handleUpdateProblem = async () => {
    await updateProblem(problem);
    const data = await getProblemSet();
    setProblems(data);
    handleClose();
  };

  const handleDelProblem = async (code) => {
    await deleteProblem(code);
    const data = await getProblemSet();
    setProblems(data);
  };

  const handleAddtest = async (prob) => {
    const testcases = await getTestCases(prob.code);
    setProblem({ ...prob, ...testcases });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDashboard = () => setActiveSection('dashboard');
  const handleProfile = () => setActiveSection('profile');
  const handleContest = () => setActiveSection('contest');

  return (
    <div className="container-fluid">
      <div className="row content">
        <div className="col-sm-3 sidenav">
          <h4>Admin</h4>
          <div className="p-3">
            <button className="btn btn-link" onClick={handleDashboard} style={{ textDecoration: 'none', color: 'inherit' }}>
              Dashboard
            </button>
          </div>
          <div className="p-3">
            <button className="btn btn-link" onClick={handleProfile} style={{ textDecoration: 'none', color: 'inherit' }}>
              Profile
            </button>
          </div>
          <div className="p-3">
            <button className="btn btn-link" onClick={handleContest} style={{ textDecoration: 'none', color: 'inherit' }}>
              Contest
            </button>
          </div>
        </div>

        <div className="col-sm-9">
          {activeSection === 'dashboard' && (
            <AdminDashboard problems={problems} handleShow={handleShow} handleDelProblem={handleDelProblem} handleAddtest={handleAddtest} />
          )}
          {activeSection === 'profile' && <Profile />}
          {activeSection === 'contest' && <AdminContest />}
        </div>
      </div>

      <ProblemFormModal
        showModal={showModal}
        handleClose={handleClose}
        handleInput={handleInput}
        handleAddProblem={handleAddProblem}
        handleUpdateProblem={handleUpdateProblem}
        isEditing={isEditing}
        problem={problem}
      />
    </div>
  );
};

const initialProblemState = {
  code: '',
  title: '',
  description: '',
  constraints: [],
  tags: [],
  timelimit: 0,
  memorylimit: 0,
  difficulty: '',
  input1: '',
  output1: '',
  input2: '',
  output2: ''
};

export default Admin;

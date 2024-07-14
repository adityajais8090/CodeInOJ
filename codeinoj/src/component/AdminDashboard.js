import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenNib, faPlus } from '@fortawesome/free-solid-svg-icons';
import ProblemRow from './ProblemRow';

const AdminDashboard = ({ problems, handleShow, handleDelProblem, handleAddtest }) => {
  return (
    <div className="container-fluid">
      <div className="row content">
        <div className="col-sm-12">
          <h4><small>Dashboard</small></h4>
          <hr />
          <div className="user-dashboard">
            <div className="row align-items-center">
              <div className="col">
                <h1>Hello, JS</h1>
              </div>
              <div className="col-auto">
                <button className="btn btn-primary" onClick={() => handleShow()}>
                  <FontAwesomeIcon icon={faPlus} /> Add Problem
                </button>
              </div>
            </div>

            <div className="row custom-row-style">
              <div className="col-4 col-md-2 p-3 text-center">
                Statistics
              </div>
              <div className="col-4 col-md-4 p-3">
                Title
              </div>
              <div className="col-4 col-md-2 p-3">
                Update
              </div>
              <div className="col-4 col-md-2 p-3">
                Add
              </div>
              <div className="col-4 col-md-2 p-3">
                Delete
              </div>
            </div>

            <div className="table">
              {problems.map((prob, index) => (
                <ProblemRow
                  key={index}
                  prob={prob}
                  handleShow={handleShow}
                  handleDelProblem={handleDelProblem}
                  handleAddtest={handleAddtest}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

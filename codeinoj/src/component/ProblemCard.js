import React from 'react';
import { Link } from 'react-router-dom';

const ProblemCard = ({ title, score, submissionStatus, problemId, code }) => (
  <div style={{ width: "100%" }} className={`card mb-3 ${submissionStatus === 'passed' ? 'bg-success' : ''}`}>
    <div style={{ display: "flex", justifyContent: "space-between" }} className="card-body">
      <div>
        <h5 className="card-title">{title}</h5>
        <div style={{ display: "flex" }}>
          <p style={{ marginRight: "20px", color: "green" }}>Score: {score}</p>
          <p >Status: {submissionStatus === 'passed' ? 'Passed' : 'Pending'}</p>
        </div>
      </div>
      <Link style={{ height: "40px" }} to={`/problemset/problem/${code}`} className="btn btn-primary">Solve Problem</Link>
    </div>
  </div>
);

export default ProblemCard;

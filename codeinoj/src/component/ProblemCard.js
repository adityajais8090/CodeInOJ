import React from 'react';
import { Link } from 'react-router-dom';

const ProblemCard = ({ title, score, submissionStatus, problemId, code }) => (
  <div className={`card mb-3 ${submissionStatus === 'passed' ? 'bg-success' : ''}`}>
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text">Score: {score}</p>
      <p className="card-text">Status: {submissionStatus === 'passed' ? 'Passed' : 'Pending'}</p>
      <Link to={`/problemset/problem/${code}`} className="btn btn-primary">Solve Problem</Link>
    </div>
  </div>
);

export default ProblemCard;

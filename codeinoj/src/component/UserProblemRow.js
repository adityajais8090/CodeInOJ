import React from 'react';
import SubmissionStatus from './SubmissionStatus'; // Adjust the import path as per your project structure
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const UserProblemRow = ({ problem, handleProblem }) => (
  <div className={`row custom-row-style ${problem.index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
    <div className="col-6 col-md-2 p-3 text-center">
      <SubmissionStatus problemId={problem._id} />
    </div>
    <div className={`col-6 col-md-6 p-3`}>
      <a
        className={`${problem.index % 2 === 0 ? 'even-row' : 'odd-row'}`}
        href="/problemset/problem"
        onClick={(event) => handleProblem(problem, event)}
      >
        {`${problem.code}. ${problem.title}`}
      </a>
    </div>
    <div className="col-6 col-md-2 p-3">
      {problem.difficulty || "medium"}
    </div>
    <div className="col-6 col-md-2 p-3">
      passed
    </div>
  </div>
);

export default UserProblemRow;

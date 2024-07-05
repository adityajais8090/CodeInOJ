import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/problemset.css';
import { getProblemSet } from '../service/api';
import UserContext from '../context/user/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const Problemset = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const { user, fetchUserProfile } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProblemSet();
        console.log("Response from ProblemSet:", response);
        setProblems(response);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    if (!user) {
      fetchUserProfile();
    }
    fetchData();
  }, [user]);

  const handleProblem = (problem, event) => {
    event.preventDefault();
    navigate(`/problemset/problem/${problem.code}`);
  };

  const getSubmissionStatus = (problemId) => {
    if (user && user.submissions) {
      const submission = user.submissions.find(sub => sub.problemId === problemId);
      return submission ? (submission.status ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />) : ' ';
    }
    return 'pending';
  };

  return (
    <>
      <div className="row-header row custom-row-style">
        <div className="col-6 col-md-2 p-3">
          <div className="text-center">Status</div>
        </div>
        <div className="col-6 col-md-6 p-3">Title</div>
        <div className="col-6 col-md-2 p-3">Difficulty</div>
        <div className="col-6 col-md-2 p-3">Solution</div>
      </div>
      
      <div className="table">
        {problems.map((problem, index) => (
          <div key={index} className={`row custom-row-style ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
            <div className="col-6 col-md-2 p-3 text-center">
              {getSubmissionStatus(problem._id)}
            </div>
            <div className={`col-6 col-md-6 p-3`}>
              <a
                className={`${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
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
            {getSubmissionStatus(problem._id)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Problemset;

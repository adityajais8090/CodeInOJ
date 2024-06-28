import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import { getProblemSet } from '../service/api';

const Home = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProblemSet();
        setProblems(response);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };
    fetchData();
  }, []);

  const handleProblem = (problem, event) => {
    event.preventDefault();
    navigate(`/problemset/problem/${problem.code}`, { state: { problem } });
  };

  return (
    <>
      <div className="row-header row custom-row-style">
        <div className="col-6 col-md-2 p-3">
          <div className="text-center">
            Status
          </div>
        </div>
        <div className="col-6 col-md-6 p-3">
          Title
        </div>
        <div className="col-6 col-md-2 p-3">
          Difficulty
        </div>
        <div className="col-6 col-md-2 p-3">
          Solution
        </div>
      </div>

      <div className="table">
        {problems.map((problem, index) => (
          <div key={index} className={`row custom-row-style ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
            <div className="col-6 col-md-2 p-3 text-center">
              {problem.status || "pending"}
            </div>
            <div className={`col-6 col-md-6 p-3`}>
              <a className={`${index % 2 === 0 ? 'even-row' : 'odd-row'}`} href="/problemset/problem" onClick={(event) => handleProblem(problem, event)} >
                {`${problem.code}. ${problem.title}`}
              </a>
            </div>
            <div className="col-6 col-md-2 p-3">
              {problem.difficulty || "medium"}
            </div>
            <div className="col-6 col-md-2 p-3">
              {problem.solution || "try once"}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;

import '../styles/problem.css';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getTestCases } from '../service/api';
import Compiler from './compiler';

const Problem = () => {
  const { problem } = useLocation().state; // Ensure problem is correctly received from location state
  const { code } = useParams();
  const [testcases, setTestcases] = useState({
    input: '',
    output: ''
  });

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await getTestCases(problem.code); // Use `problem.code` for fetching test cases
        if (response.success) {
          setTestcases({
            input: response.testcases.input,
            output: response.testcases.output
          });
        }
      } catch (err) {
        console.log("Error in getting TestCases", err);
      }
    };

    fetchTestCases(); // Call the function to fetch test cases on component mount
  }, [problem.code]); // Add `problem.code` to the dependencies array

  return (
    <div className="Problem" style={{ backgroundColor: '#eee' }}>
      <div className="container-fluid py-2">
        <div className="row">
          {/* Problem card */}
          <div className="col-lg-6" style={{ maxHeight: '40rem' }}>
            <div className="card" style={{ maxHeight: '40rem', overflowY: 'auto' }}>
              <div className="card-body">
                <h5 className="card-title">{`${problem.code}. ${problem.title}`}</h5>
                <p className="card-text">{problem.description}</p>
                <h6 className="card-subtitle mb-2 text-muted">Test Cases</h6>
                <p className="card-text">
                  <strong>Input:</strong> {testcases.input}<br />
                  <strong>Output:</strong> {testcases.output}
                </p>
                <h6 className="card-subtitle mb-2 text-muted">Tags</h6>
                <p className="card-text">{problem.tags && problem.tags.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Compiler card */}
          <div className="col-lg-6" style={{ maxHeight: '40rem'}}>
            <div className="card" style={{ maxHeight: '40rem', overflowY: 'auto' }}>
              <div className="card-body">
                <h5 className="card-title">Compiler</h5>
              <Compiler/> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;

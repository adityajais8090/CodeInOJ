import '../styles/problem.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTestCases } from '../service/api';
import Compiler from './compiler';

const Problem = () => {
  const { code } = useParams();
  const [problem, setProblem] = useState({
    code: "",
    title: "",
    description: "",
    constraints : [""],
    tags: [""],
    testcaseId : [""],
  });
  const [testcases, setTestcases] = useState({
    input1: '',
    output1: '',
    input2: '',
    output2: '',
  });

  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await getTestCases(code); // Use `problem.code` for fetching test cases
        if (response.success) {
          setTestcases({
            input1: response.testcases[0].input,
            output1: response.testcases[0].output,
            input2: response.testcases[1].input,
            output2: response.testcases[1].output,
          });
          setProblem(response.existProblem);
        }
      } catch (err) {
        console.log("Error in getting TestCases", err);
      }
    };

    fetchTestCases(); // Call the function to fetch test cases on component mount
  }, [code]); // Add `problem.code` to the dependencies array

  return (
    <div className="Problem" style={{ backgroundColor: '#eee' }}>
      <div className="container-fluid py-2">
        <div className="row">
          {/* Problem card */}
          <div className="col-lg-5">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{`${problem.code}. ${problem.title}`}</h5>
                <div className="mb-3">
                    <p className="card-text">{problem.description.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}</p>
                  </div>


                <div className="mb-3">
                  <h5 className="card-subtitle mb-2 text-muted">Test Case 1</h5>
                  <p className="card-text">
                    <strong>Input:</strong> {testcases.input1}<br />
                    <strong>Output:</strong> {testcases.output1}
                  </p>
                </div>
                <div className="mb-3">
                  <h5 className="card-subtitle mb-2 text-muted">Test Case 2</h5>
                  <p className="card-text">
                    <strong>Input:</strong> {testcases.input2}<br />
                    <strong>Output:</strong> {testcases.output2}
                  </p>
                </div>
                <div>
                  <h5 className="card-subtitle mb-2 text-muted">Constraints</h5>
                  <ul className="card-text">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="card-subtitle mb-2 text-muted">Tags</h5>
                  <p className="card-text">{problem.tags && problem.tags.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compiler card */}
          <div className="col-lg-7">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Compiler</h5>
                <Compiler problem={problem}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;

import React, { useEffect, useState } from 'react';
import SpinnerLoader from './SpinnerLoader';

const DescriptionCard = ({ problem, testcases }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (problem && testcases) {
      setLoading(false);
    }
  }, [problem, testcases]);

  return (
    <div>
      {loading ? (
        <SpinnerLoader />
      ) : (
        <div className="card h-100" style={{ backgroundColor: '#eee' }}>
          <div className="card-body">
            <h5 className="card-title">{`${problem.code}. ${problem.title}`}</h5>
            <p className="card-text">
              <strong>Difficulty:</strong> {problem.difficulty}
            </p>

            {/* Description */}
            <div className="mb-4">
              <p className="card-text">
                {problem.description.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>

            {/* Test Cases */}
            <div className="mb-4">
              <h5 className="card-subtitle mb-3 text-muted">Test Cases</h5>
              <div className="mb-3">
                <h6 className="card-subtitle mb-2 text-muted">Test Case 1</h6>
                <p className="card-text">
                  <strong>Input:</strong>
                  <br />
                  <pre>{testcases.input1}</pre>
                  <br />
                  <strong>Output:</strong>
                  <br />
                  <pre>{testcases.output1}</pre>
                </p>
              </div>
              <div className="mb-3">
                <h6 className="card-subtitle mb-2 text-muted">Test Case 2</h6>
                <p className="card-text">
                  <strong>Input:</strong>
                  <br />
                  <pre>{testcases.input2}</pre>
                  <br />
                  <strong>Output:</strong>
                  <br />
                  <pre>{testcases.output2}</pre>
                </p>
              </div>
            </div>

            {/* Constraints */}
            <div className="mb-4">
              <h5 className="card-subtitle mb-3 text-muted">Constraints</h5>
              <ul className="list-group">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="list-group-item">
                    {constraint}
                  </li>
                ))}
              </ul>
            </div>

            {/* Limits */}
            <div className="mb-4">
              <h5 className="card-subtitle mb-3 text-muted">Limits</h5>
              <p className="card-text">
                <strong>Time Constraints:</strong> {problem.timelimit}
                <br />
                <strong>Memory Constraints:</strong> {problem.memorylimit}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h5 className="card-subtitle mb-3 text-muted">Tags</h5>
              <p className="card-text">
                {problem.tags && problem.tags.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionCard;

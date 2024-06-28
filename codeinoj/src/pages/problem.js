import '../styles/problem.css';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getTestCases } from '../service/api';

const Problem = () => {
  const { problem } = useLocation().state; // Access problem from location state
  const { code } = useParams(); // Access code from route params
  const [testcases, setTestcases] = useState({
    input: '',
    output: ''
  });

  useEffect(() => {
    fetchTestCases();
  }, []);
  console.log("TestCases look like:", testcases);

  const fetchTestCases = async () => {
    try {
      const response = await getTestCases(problem.code);
      console.log("Response from Problem:", response.testcases);

      if (response.success) {
        setTestcases({
          ...testcases,
          input: response.testcases.input,
          output: response.testcases.output
        });
      }
    } catch (err) {
      console.log("Error in getting TestCases", err);
    }
  };

 

  return (
    <div className="Problem" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-6">
            <div className="card mb-2">
              <div className="card-body">
                <h5 className="card-title">{`${problem.code}. ${problem.title}`}</h5>
                <p className="card-text">{problem.description}</p>
                <h6 className="card-subtitle mb-2 text-muted">Test Cases</h6>
                <p className="card-text">
                  <strong>Input:</strong> {testcases.input}<br />
                  <strong>Output:</strong> {testcases.output}
                </p>
                <h6 className="card-subtitle mb-2 text-muted">Tags</h6>
                <p className="card-text">{problem.tags.join(', ')}</p>
              </div>
            </div>
          </div>
          <div className='col'>
            <div className="col-lg-12">
              <div className="card mb-2">
                <div className="card-body text-end">
                  <form>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlTextarea1">Compiler</label>
                      <textarea className="form-control" id="exampleFormControlTextarea1" rows="8"></textarea>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-12 ">
              <div className="card mb-2">
                <div className="card-body text-end">
                  <form>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlTextarea1">Input</label>
                      <textarea className="form-control" id="exampleFormControlTextarea1" rows="1"></textarea>
                    </div>
                  </form>
                  <form>
                    <div className="form-group">
                      <label htmlFor="exampleFormControlTextarea1">Output</label>
                      <textarea className="form-control" id="exampleFormControlTextarea1" rows="1"></textarea>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div> {/* end col */}
        </div> {/* end row */}
      </div> {/* end container */}
    </div>
  );
};

export default Problem;

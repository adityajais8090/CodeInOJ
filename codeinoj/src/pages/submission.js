import React, { useState, useEffect } from 'react';
import { getSubmission, getUser, getProblemSet } from '../service/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { SpinnerLoader } from '../component';

const AllSubmissions = () => {
  const[allSubmissions, setAllSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ allProblem, setAllProblem] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response_sub = await getSubmission(); // Replace with actual API function
       // console.log("All problem Submission : ", response.data.submissions);
       const response_prob = await getProblemSet();
       setAllProblem(response_prob);

       setAllSubmissions(response_sub.data.submissions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();


  }, []);

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
     
    } catch (error) {
      console.error('Failed to copy code: ', error);
    }
  };

  const handleProblem = async (problemId) => {
    try{
      

    }catch(err){
        console.err('Error in getting problem', err);
    }
  };

  const handleUser = async(userId) => {
    const payload = {userId};
    try{
        const response = await getUser(payload);
        console.log(response);
         
    }catch(err){
        console.error('Failed to detect user', err);
    }
  }


  return (
    <div>
    {loading ? <SpinnerLoader /> :
    <div className="card h-100" >
      <div className="card-body">
        <h5 className="card-title">All Submissions</h5>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Username</th>
                <th>Problem</th>
                <th>Language</th>
                <th>Runtime</th>
                <th>Result</th>
                <th>Days Ago</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {allSubmissions.map((submission) => (
                <tr key={submission._id}>
                 <td>{handleUser(submission.userId)}</td>
                  <td>{handleProblem(submission.problemId)}</td>
                  <td>{submission.languageSub}</td>
                  <td>{submission.runtimeSub}</td>
                  <td>{submission.isPassed ? 'Passed' : 'Failed'}</td>
                  <td>{Math.round((new Date() - new Date(submission.timestamp)) / (1000 * 60 * 60 * 24))} days ago</td>
                  <td>
                    <button type="button" className="btn btn-link" onClick={() => handleCopyCode(submission.problemCode)}>
                      <FontAwesomeIcon icon={faCopy} /> {/* FontAwesome copy icon */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
}
    </div>
  );
};

export default AllSubmissions;

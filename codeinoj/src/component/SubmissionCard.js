import React, { useState, useEffect } from 'react';
import { getSubmission } from '../service/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import SpinnerLoader from './SpinnerLoader';

const SubmissionCard = ({ problemId, userId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await getSubmission(); // Replace with actual API function
       // console.log("All problem Submission : ", response.data.submissions);
        if (response.data.success) {
          const filteredSubmissions = response.data.submissions.filter(submission => {
            return submission.problemId === problemId && submission.userId === userId;
          });
          setSubmissions(filteredSubmissions);
         // console.log("Finally get FilteredSubmissions : ", filteredSubmissions);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchSubmissions();

    
     
   


  }, [problemId, userId]);

  

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
     
    } catch (error) {
      console.error('Failed to copy code: ', error);
    }
  };

  return (
    <div>
    {loading ? <SpinnerLoader /> :
    <div className="card h-100" >
      <div className="card-body">
        <h5 className="card-title">Your Submissions</h5>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Result</th>
                <th>Language</th>
                <th>Runtime</th>
                <th>Days Ago</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td>{submission.isPassed ? 'Passed' : 'Failed'}</td>
                  <td>{submission.languageSub}</td>
                  <td>{submission.runtimeSub}</td>
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

export default SubmissionCard;

import React, { useState, useEffect } from 'react';
import { getAllSubmissions } from '../service/api';
import SpinnerLoader from './SpinnerLoader';

const AllSubmissionsCard = ({ problemId }) => {
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [ loading, setLoading ] = useState(true);
 // console.log("Problem Id :", problemId);

  useEffect(() => {
    const fetchAllSubmissions = async () => {
      try {
        const response = await getAllSubmissions(); // Replace with actual API function
       // console.log("All Submissions :", response.AllSubmissions);
        if (response.success) {
          // Filter submissions based on problemId
          const filteredSubmissions = response.AllSubmissions.filter(submission => submission.problemId === problemId);
          setAllSubmissions(filteredSubmissions);
         // console.log("Filtered :", filteredSubmissions);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching all submissions:', error);
      }
    };

    fetchAllSubmissions();
  }, [problemId]);

  const calculateDaysAgo = (timestamp) => {
    const now = new Date();
    const submissionDate = new Date(timestamp);
    const diffTime = Math.abs(now - submissionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  return (
    <div>
  { loading ? <SpinnerLoader/> :
    
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">All Submissions</h5>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>User</th>
                <th>Language</th>
                <th>Runtime</th>
                <th>Status</th>
                <th>Days Ago</th>
              </tr>
            </thead>
            <tbody>
              {allSubmissions.map((submission) => (
                <tr key={submission._id}>
                  <td>UserName</td> {/* Replace with actual user data */}
                  <td>{submission.languageSub}</td>
                  <td>{submission.runtimeSub}</td>
                  <td>{submission.isPassed ? 'Passed' : 'Failed'}</td>
                  <td>{calculateDaysAgo(submission.timestamp)}</td>
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

export default AllSubmissionsCard;

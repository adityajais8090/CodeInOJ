// RealTimeRatings.jsx
import React, { useEffect, useState } from 'react';

const RealTimeRatings = ({ user, problems }) => {
  const [ratings, setRatings] = useState(0);

  useEffect(() => {
    if (user && problems.length > 0) {
      const initialRatings = problems.reduce((total, problem, index) => {
        const submission = user.submissions.find(sub => sub.problemId === problem._id && sub.status === 'passed');
        const score = index < 4 ? [400, 800, 1000, 1200][index] : 0;
        return total + (submission ? score : 0);
      }, 0);
      setRatings(initialRatings);
    }
  }, [user, problems]);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Real-time Ratings</h5>
        <p className="card-text">{ratings}</p>
      </div>
    </div>
  );
};

export default RealTimeRatings;

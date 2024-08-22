import React, { useEffect, useState } from 'react';


const RealTimeRatings = ({ user, problems }) => {
  const [ratings, setRatings] = useState({ total: 0, easy: 0, medium: 0, hard: 0 });

  useEffect(() => {
    if (user && problems.length > 0) {
      const updatedRatings = problems.reduce((acc, problem, index) => {
        const submission = user.submissions.find(sub => sub.problemId === problem._id && sub.status === 'passed');
        const score = index < 4 ? [400, 800, 1000, 1200][index] : 0;

        if (submission) {
          if (problem.difficulty === 'easy') acc.easy += score;
          else if (problem.difficulty === 'medium') acc.medium += score;
          else if (problem.difficulty === 'hard') acc.hard += score;
          acc.total += score;
        }

        return acc;
      }, { total: 0, easy: 0, medium: 0, hard: 0 });

      setRatings(updatedRatings);
    }
  }, [user, problems]);

  return (
    <div className="ratings-card card">
      <div className="card-body">
        <h5 className="card-title">Real-time Ratings</h5>
        <div className="ratings-container">
          <div className="rating-item">
            <div className="rating-title">Total</div>
            <div className="rating-value">{ratings.total}</div>
          </div>
          <div className="rating-item">
            <div className="rating-title">Easy</div>
            <div className="rating-progress">
              <div
                className="rating-bar"
                style={{ width: `${(ratings.easy / 1200) * 100}%` }}  // Adjust max score for the bar width
              ></div>
            </div>
          </div>
          <div className="rating-item">
            <div className="rating-title">Medium</div>
            <div className="rating-progress">
              <div
                className="rating-bar"
                style={{ width: `${(ratings.medium / 1200) * 100}%` }}  // Adjust max score for the bar width
              ></div>
            </div>
          </div>
          <div className="rating-item">
            <div className="rating-title">Hard</div>
            <div className="rating-progress">
              <div
                className="rating-bar"
                style={{ width: `${(ratings.hard / 1200) * 100}%` }}  // Adjust max score for the bar width
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeRatings;

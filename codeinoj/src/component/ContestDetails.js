import React from 'react';

const ContestDetails = ({ contest }) => (
  <div>
    <h3 className="card-title">{contest.title}</h3>
    <p className="card-text">Start Time: {new Date(contest.startTime).toLocaleString()}</p>
    <p className="card-text">End Time: {new Date(contest.endTime).toLocaleString()}</p>
    <p className="card-text">Duration: {contest.duration} minutes</p>
  </div>
);

export default ContestDetails;

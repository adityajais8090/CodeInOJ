import React from 'react';

const ContestDetails = ({ contest }) => (
  <div style={{ backgroundColor: "#CAF4FF", padding: "10px 20px", borderRadius: "6px" }}>
    <h4 style={{ color: "#4535C1" }} className="card-title">{contest.title}</h4>
    <div style={{ display: "flex" }}>
      <p style={{ marginRight: "20px", color: "green" }} className="card-text">Start Time: {new Date(contest.startTime).toLocaleString()}</p>
      <p style={{ marginRight: "20px", color: "red" }} className="card-text">End Time: {new Date(contest.endTime).toLocaleString()}</p>
      <p className="card-text">Duration: {contest.duration} minutes</p>
    </div>
  </div>
);

export default ContestDetails;

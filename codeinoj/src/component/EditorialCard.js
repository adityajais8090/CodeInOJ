import React from 'react';

const EditorialCard = ({ problem }) => {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">Editorial</h5>
        {/* Editorial content goes here */}
        <p>This is the editorial for problem {problem.code}</p>
      </div>
    </div>
  );
};

export default EditorialCard;

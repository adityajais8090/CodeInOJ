import React from 'react';
import ProblemCard from './ProblemCard';

const ProblemList = ({ problems, getSubmissionStatus, onComplete }) => (
  <div className="col-md-8">
    {problems.map((problem, index) => {
      const submissionStatus = getSubmissionStatus(problem._id); // Get submission status for the problem
      const score = index < 4 ? [400, 800, 1000, 1200][index] : 0;

      return (
        <ProblemCard
          key={problem._id}
          title={problem.title}
          score={score}
          submissionStatus={submissionStatus}
          problemId={problem._id}
          code={problem.code}
        />
      );
    })}
  </div>
);

export default ProblemList;

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getSubmission } from '../service/api';
import SpinnerLoader from './SpinnerLoader';

const SubmissionStatus = ({ problemId }) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      try {
        const response = await getSubmission();
        const allSubmit = response.data.submissions;
        const submission = allSubmit.find(sub => sub.problemId === problemId && sub.isPassed);

        if (submission) {
          setStatus('passed');
        } else {
          setStatus('not-passed');
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setStatus('error');
      }
    };

    fetchSubmissionStatus();
  }, [problemId]);

  if (status === 'passed') {
    return <FontAwesomeIcon icon={faCheck} />; // Return a green check icon if submission passed
  } else if (status === 'not-passed') {
    return ; // Return a red times icon if no passed submission found
  } else {
    return <span><SpinnerLoader/></span>; // Return a loading state while fetching data
  }
};

export default SubmissionStatus;

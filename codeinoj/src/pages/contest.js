import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/contest.css';
import { getAllContest, getProblems, sendRatings } from '../service/api';
import { useAuth } from '../context/auth/authState';

import { ContestDetails, ProblemList, Timer, RealTimeRatings, SpinnerLoader } from '../component/index';

const Contest = () => {
  const { contestCode } = useParams();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loadingContest, setLoadingContest] = useState(true);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [isContestActive, setIsContestActive] = useState(false);
  const [isContestEnd, setIsContestEnd] = useState(false);
  const navigate = useNavigate();

  const { user, loading } = useAuth();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllContest();
        const matchedContest = response.data.find(contest => contest.contestCode === parseInt(contestCode));
        console.log("Matched Contest :", matchedContest);
        setContest(matchedContest);
        setLoadingContest(false);

        if (matchedContest) {
          const fetchProblems = async () => {
            const problemsList = [];
            for (const ObjectId of matchedContest.problemId) {
              try {
                const problem = await getProblems(ObjectId);
                problemsList.push(problem);
              } catch (error) {
                console.error(`Error fetching problem with ObjectId ${ObjectId}:`, error);
              }
            }
            return problemsList;
          };

          const problemsList = await fetchProblems();
          setProblems(problemsList);
          setLoadingProblems(false);

          // Calculate remaining time until the contest starts or ends
          const startTime = new Date(matchedContest.startTime).getTime() / 1000;
          const endTime = new Date(matchedContest.endTime).getTime() / 1000;
          const currentTime = Math.floor(Date.now() / 1000);

          if (currentTime < startTime) {
            setIsContestActive(false);
          } else if (currentTime >= startTime && currentTime <= endTime) {
            setIsContestActive(true);
          } else {
            setIsContestActive(false);
            setIsContestEnd(true);
          }
        }
      } catch (error) {
        // console.log("Error in fetching data:", error);
        setLoadingContest(false);
        setLoadingProblems(false);
      }
    };

    fetchData();
  }, [contestCode]);



  const handleTimerStart = () => {
    if (isContestActive) {
      //console.log("Contest Started");
    }
  }

  const handleTimerEnd = () => {
    if (isContestActive) {
      sendRating();
      navigate('/home');
    }
  };

  const sendRating = async () => {
    const payload = {
      user,
      ratings: problems.reduce((total, problem, index) => {
        const submission = user.submissions.find(sub => sub.problemId === problem._id && sub.status === 'passed');
        const score = index < 4 ? [400, 800, 1000, 1200][index] : 0;
        return total + (submission ? score : 0);
      }, 0),
      contestCode,
    }
    try {
      const response = await sendRatings(payload);
      console.log("Response from ratings:", response);
    } catch (err) {
      // console.log("Error updating ratings:", err);
    }
  };

  const getSubmissionStatus = (problemId) => {
    if (user && user.submissions) {
      const submission = user.submissions.find(sub => sub.problemId === problemId);
      return submission ? (submission.status === 'passed' ? 'passed' : 'pending') : 'pending';
    }
    return 'pending';
  };

  if (loadingContest || loadingProblems) {
    return <div><SpinnerLoader /></div>;
  }

  if (!contest) {
    return <div>Contest not found.</div>;
  }

  if (loading) {
    // You can return a loading spinner or null while loading
    return <div><SpinnerLoader /></div>;
  }

  return (
    <div className="container mt-5 mb-3">
      <div className="card mb-4">
        <div className="card-body">
          <ContestDetails contest={contest} />
          <div className="row">
            {(!isContestActive && !isContestEnd) && (
              <div className="col-md-12">
                <h5 className="card-title">Contest will start in:</h5>
                <Timer startTime={new Date(contest.startTime).getTime() / 1000} endTime={new Date(contest.endTime).getTime() / 1000} onEnd={handleTimerStart} />
              </div>
            )}
          </div>
          <div className="row">
            {isContestActive && (
              <>
                <ProblemList problems={problems} getSubmissionStatus={getSubmissionStatus} />
                <div className="col-md-4">
                  <Timer startTime={new Date(contest.startTime).getTime() / 1000} endTime={new Date(contest.endTime).getTime() / 1000} onEnd={handleTimerEnd} />
                  <RealTimeRatings user={user} problems={problems} />
                </div>
              </>
            )}
            {isContestEnd && (
              <div className='mt-4'>
                <div>
                  <h6 style={{ color: "red" }}>Contest End</h6>
                  <h6>Stay tuned for results!</h6>
                </div>
                <ProblemList problems={problems} getSubmissionStatus={getSubmissionStatus} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contest;

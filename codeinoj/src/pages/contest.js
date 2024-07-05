import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/contest.css';
import { getAllContest, getProblems } from '../service/api';
import UserContext from '../context/user/userContext';

const ProblemCard = ({ title, score, submissionStatus, problemId, code }) => (
  <Link to={`/problemset/problem/${code}`} className={`card mb-3 ${submissionStatus === 'passed' ? 'bg-success' : ''}`}>
    <div className="card-body">
      <h5 className="card-title">{title}</h5>
      <p className="card-text">Score: {score}</p>
      <p className="card-text">Status: {submissionStatus === 'passed' ? 'Passed' : 'Pending'}</p>
    </div>
  </Link>
);

const Contest = () => {
  const { contestCode } = useParams();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loadingContest, setLoadingContest] = useState(true);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const { user, fetchUserProfile } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllContest();
        console.log("Here is my get contest:", response.data);
        
        // Find the contest that matches the contestCode
        console.log("Contest Code Type:", typeof contestCode); // Check the type of contestCode
        const matchedContest = response.data && response.data.find(contest => contest.contestCode === parseInt(contestCode));
        console.log("Here is match Contest:", matchedContest);
        

        setContest(matchedContest);
        setLoadingContest(false);

        // Fetch problem details for each ObjectId in the contest
        if (matchedContest) {
          const fetchProblems = async () => {
            const problemsList = [];
            for (const ObjectId of matchedContest.problemId) {
              try {
                const problem = await getProblems(ObjectId); // Use ObjectId to fetch problem details
                problemsList.push(problem); // Store problem details in problemsList
              } catch (error) {
                console.error(`Error fetching problem with ObjectId ${ObjectId}:`, error);
              }
            }
            return problemsList;
          };

          const problemsList = await fetchProblems();
          setProblems(problemsList); // Update state with fetched problems
          setLoadingProblems(false);
        }
      } catch (error) {
        console.log("Error in fetching data:", error);
        setLoadingContest(false);
        setLoadingProblems(false);
      }
    };

    fetchData();
  }, [contestCode]);

  useEffect(() => {
    if (!user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  const getSubmissionStatus = (problemId) => {
    if (user && user.submissions) {
      const submission = user.submissions.find(sub => sub.problemId === problemId);
      return submission ? (submission.status ? 'passed' : 'pending') : 'pending';
    }
    return 'pending';
  };

  return (
    <div className="container mt-5 mb-3">
      <div className="card mb-4">
        <div className="card-body">
          {loadingContest ? (
            <p>Loading contest details...</p>
          ) : contest ? (
            <>
              <h3 className="card-title">{contest.title}</h3>
              <p className="card-text">Start Time: {new Date(contest.startTime).toLocaleString()}</p>
              <p className="card-text">End Time: {new Date(contest.endTime).toLocaleString()}</p>
              <p className="card-text">Duration: {contest.duration} minutes</p>
              <div className="row">
                <div className="col-md-8">
                  {loadingProblems ? (
                    <p>Loading problems...</p>
                  ) : problems.length > 0 ? (
                    problems.map((problem, index) => {
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
                    })
                  ) : (
                    <p>No problems found for this contest.</p>
                  )}
                </div>
                <div className="col-md-4">
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">Timer</h5>
                      <p className="card-text">Countdown timer here</p>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Real-time Ratings</h5>
                      <p className="card-text">Ratings for all four problems here</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>Contest not found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contest;

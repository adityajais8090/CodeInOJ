import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth/authState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { UserProblemRow, SubmissionStatus, CircularMetricsCard, Skills, SpinnerLoader } from '../component';
import { getSubmission, getProblemSet } from '../service/api';

const Profile = () => {
  const { user, loading } = useAuth();
  const [submitProblem, setSubmitProblem] = useState([]);
  const [loadingdata, setLoading] = useState(true); // Add loading state to manage loading state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProblemSet();
        const problems = response;
        const allSubmissionsResponse = await getSubmission();
        const allSubmissions = allSubmissionsResponse.data.submissions;

        if (allSubmissions.length > 0 && problems.length > 0) {
          const matchedProblems = [];

          allSubmissions.forEach((submission) => {
            if (submission.isPassed) {
              const matchedProblem = problems.find(
                (problem) => problem._id === submission.problemId
              );
              if (
                matchedProblem &&
                !matchedProblems.some(
                  (problem) => problem._id === matchedProblem._id
                )
              ) {
                matchedProblems.push(matchedProblem);
              }
            }
          });

          setSubmitProblem(matchedProblems);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading to false when data fetching completes (or encounters an error)
      }
    };

    
      fetchData(); // Call fetchData only when user is available
    
  }, [user]);

  if (loadingdata && loading) {
    return <div><SpinnerLoader/></div>;
  }

  const handleProblem = (problem, event) => {
    event.preventDefault();
    navigate(`/problemset/problem/${problem.code}`);
  };

  return (
    <div style={{ backgroundColor: '#EAF5FF' }}>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: '150px' }}
                />
                <h5 className="my-3">{`${user.firstname} ${user.lastname}`}</h5>
                <p className="text-muted mb-1">Full Stack Developer</p>
                <p className="text-muted mb-4">Bay Area, San Francisco, CA</p>
                <div className="d-flex justify-content-center mb-2">
                  <button type="button" className="btn btn-primary">
                    Follow
                  </button>
                  <button type="button" className="btn btn-outline-primary ms-1">
                    Message
                  </button>
                </div>
              </div>
            </div>
            <Skills user={user} />
          </div>

          <div className="col-lg-8">
            <div className="row gx-3">
              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-body d-flex justify-content-center align-items-center">
                    <CircularMetricsCard />
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-body">
                    <p className="mb-4">
                      <span className="text-primary font-italic me-1">assignment</span> Project Status
                    </p>
                    <p className="mb-1" style={{ fontSize: '.77rem' }}>
                      Web Design
                    </p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: '80%' }}
                        aria-valuenow="80"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="row-header row custom-row-style">
                  <div className="col-6 col-md-2 p-3">
                    <div className="text-center">Status</div>
                  </div>
                  <div className="col-6 col-md-6 p-3">Title</div>
                  <div className="col-6 col-md-2 p-3">Difficulty</div>
                  <div className="col-6 col-md-2 p-3">Solution</div>
                </div>

                <div className="table">
                  {submitProblem.map((problem, index) => (
                    <UserProblemRow
                      key={problem._id}
                      problem={problem}
                      index={index}
                      handleProblem={handleProblem}
                    >
                      <SubmissionStatus problemId={problem._id} />
                    </UserProblemRow>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/user/userContext';
import { getProblemSet } from '../service/api'; // Make sure this function returns complete problem data
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const [problems, setProblems] = useState([]);
  const [submitProblem, setSubmitProblem] = useState([]);
  const [skillsProgress, setSkillsProgress] = useState({});
  const { user, fetchUserProfile } = useContext(UserContext);
  const navigate = useNavigate();

 useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await getProblemSet();
      console.log("Response from ProblemSet:", response);
      setProblems(response);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  if (!user) {
    fetchUserProfile();
  }
  fetchData();
}, [user, fetchUserProfile]);

useEffect(() => {
  if (user && user.submissions && problems.length) {
    console.log("Here is my submission :", user.submissions);
    const matchedProblems = [];
    user.submissions.forEach(submission => {
      const matchedProblem = problems.find(problem => problem._id === submission.problemId);
      if (matchedProblem && !matchedProblems.some(problem => problem._id === matchedProblem._id)) {
        matchedProblems.push(matchedProblem);
      }
    });
    console.log("Here is my matched Problems : ",matchedProblems)
    setSubmitProblem(matchedProblems);

     // Calculate skills progress
     const skills = ["Array", "String", "TwoPointer", "DP", "Graph"];
     const skillsCount = {};

     matchedProblems.forEach(problem => {
       if (problem.tags) {
         problem.tags.forEach(tag => {
           if (skills.includes(tag)) {
             skillsCount[tag] = (skillsCount[tag] || 0) + 1;
           }
         });
       }
     });

     const totalSkills = skills.reduce((acc, skill) => {
       const total = problems.filter(problem => problem.tags && problem.tags.includes(skill)).length;
       return { ...acc, [skill]: total };
     }, {});

     const skillsProgress = skills.reduce((acc, skill) => {
       const achieved = skillsCount[skill] || 0;
       const total = totalSkills[skill] || 1;
       return { ...acc, [skill]: (achieved / total) * 100 };
     }, {});

     setSkillsProgress(skillsProgress);



  }
}, [user, problems]);






  const totalProblemSolved = () => {
    if (user && user.submissions) {
      return user.submissions.filter(sub => sub.status === "passed").length;
    }
    return 0;
  };

  const getSubmissionStatus = (problemId) => {
    if (user && user.submissions) {
      const submission = user.submissions.find(sub => sub.problemId === problemId);
     
      return submission ? (submission.status === "passed" ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />) : ' ';
    }
    return 'pending';
  };

  const handleProblem = (problem, event) => {
    event.preventDefault();
    navigate(`/problemset/problem/${problem.code}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar"
                  className="rounded-circle img-fluid" style={{ width: '150px' }} />
                <h5 className="my-3">{`${user.firstname} ${user.lastname}`}</h5>
                <p className="text-muted mb-1">Full Stack Developer</p>
                <p className="text-muted mb-4">Bay Area, San Francisco, CA</p>
                <div className="d-flex justify-content-center mb-2">
                  <button type="button" className="btn btn-primary">Follow</button>
                  <button type="button" className="btn btn-outline-primary ms-1">Message</button>
                </div>
              </div>
            </div>
            <div className="card mb-4 mb-lg-0">
              <div className="card-body mb-md-0">
              <p className="mb-4"><span className="text-primary font-italic me-1">Skills</span> Submission Status</p>
              {["Array", "String", "TwoPointer", "DP", "Graph"].map(skill => (
                  <div key={skill}>
                    <p className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>{skill}</p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: `${skillsProgress[skill] || 0}%` }} aria-valuenow={skillsProgress[skill] || 0}
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-4 mb-md-0 custom-height-card">
                  <div className="card-body d-flex justify-content-center align-items-center">
                    <div>
                      <h5>Total Problems Solved</h5>
                      <p>{totalProblemSolved()} / {problems.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card mb-4 mb-md-0">
                  <div className="card-body">
                    <p className="mb-4"><span className="text-primary font-italic me-1">assignment</span> Project Status</p>
                    <p className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</p>
                    <div className="progress rounded" style={{ height: '5px' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: '80%' }} aria-valuenow="80"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>

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
                <div key={index} className={`row custom-row-style ${index % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                  <div className="col-6 col-md-2 p-3 text-center">
                      {getSubmissionStatus(problem._id)}
                  </div>
                  <div className={`col-6 col-md-6 p-3`}>
                    <a
                      className={`${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
                      href="/problemset/problem"
                      onClick={(event) => handleProblem(problem, event)}
                    >
                      {`${problem.code}. ${problem.title}`}
                    </a>
                  </div>
                  <div className="col-6 col-md-2 p-3">
                    {problem.difficulty || "medium"}
                  </div>
                  <div className="col-6 col-md-2 p-3">
                    passed
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;